function getLernovaHilfe(payload) {
  const safePayload = payload || {};
  const session = requireAuthorizedSession(safePayload.authToken);
  const profile = loadUserProfileForSession_(session);
  const scriptProperties = PropertiesService.getScriptProperties();
  const apiKey = scriptProperties.getProperty('GEMINI_API_KEY');

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY fehlt. Lege den Schlüssel in den Script Properties an.');
  }

  const fach = String(safePayload.fach || '');
  const thema = String(safePayload.thema || '');
  const klasse = String(safePayload.klasse || '');
  const unterthema = String(safePayload.unterthema || '');
  const userMessage = String(safePayload.message || '').trim();
  const aktuelleAufgabe = String(safePayload.aktuelleAufgabe || '').trim();
  const aktuelleAntwort = String(safePayload.aktuelleAntwort || '').trim();

  if (!userMessage) {
    throw new Error('Bitte stelle zuerst eine Frage.');
  }

  logStudentActivity_(session, {
    actionType: 'help_chat',
    subject: fach,
    topic: thema,
    subtopic: unterthema,
    detail: userMessage.slice(0, 180),
    status: 'asked'
  });

  const directHint = getRuleBasedHint(fach, thema, userMessage, aktuelleAufgabe);
  if (directHint) {
    appendChatHistory_(profile, 'user', userMessage);
    appendChatHistory_(profile, 'assistant', directHint);
    saveUserProfile_(profile);
    return directHint;
  }

  const recentHistory = getRecentChatHistory_(profile, 5);

  const systemPrompt = [
    'Du bist Lernova-Hilfe, ein deutschsprachiger Lernassistent für eine Schulplattform.',
    'Du hilfst nur beim Verstehen und darfst keine vollständige Endlösung liefern.',
    'Regeln:',
    '- Keine komplette Musterlösung, kein Endergebnis, keine direkt abschreibbare Antwort.',
    '- Gib stattdessen konkrete Hinweise, kurze Teil-Schritte und einen klaren nächsten Schritt.',
    '- Beziehe dich auf die aktuelle Aufgabe, wenn sie angegeben ist.',
    '- Wenn schon ein Lösungsversuch da ist, gib zuerst kurzes Feedback dazu.',
    '- Antworte ohne langes Begrüßen oder Smalltalk.',
    '- Nutze dieses Format: Hinweis:, Nächster Schritt:, Prüfimpuls:.',
    '- Antworte altersgerecht und kompakt auf Deutsch.'
  ].join('\n');

  const userPrompt = [
    'Kontext:',
    'Klasse: ' + klasse,
    'Fach: ' + fach,
    'Thema: ' + thema,
    'Unterthema: ' + (unterthema || 'keins'),
    'Aktuelle Aufgabe: ' + (aktuelleAufgabe || 'keine konkrete Aufgabe angegeben'),
    'Bisherige Antwort oder Versuch: ' + (aktuelleAntwort || 'kein Versuch angegeben'),
    'Letzte Chat-Nachrichten:',
    recentHistory.length ? recentHistory.map(function(entry) {
      const role = entry.role === 'user' ? 'Schüler' : 'Lernova Hilfe';
      return '- ' + role + ': ' + entry.text;
    }).join('\n') : '- keine',
    '',
    'Frage:',
    userMessage,
    '',
    'Nur helfen, nicht lösen.'
  ].join('\n');

  const response = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-goog-api-key': apiKey
    },
    muteHttpExceptions: true,
    payload: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 280
      }
    })
  });

  const statusCode = response.getResponseCode();
  const bodyText = response.getContentText();
  const data = JSON.parse(bodyText || '{}');

  if (statusCode >= 400) {
    const apiMessage = data && data.error && data.error.message ? data.error.message : 'Unbekannter API-Fehler.';
    throw new Error('Hilfe-Chat fehlgeschlagen: ' + apiMessage);
  }

  const content = extractGeminiText(data);
  if (!content) {
    const fallback = buildFallbackHint(fach, thema, aktuelleAufgabe);
    appendChatHistory_(profile, 'user', userMessage);
    appendChatHistory_(profile, 'assistant', fallback);
    saveUserProfile_(profile);
    return fallback;
  }

  const trimmedContent = content.trim();
  if (trimmedContent.length < 40 || /^hallo\b/i.test(trimmedContent) || /gerne helfe ich dir/i.test(trimmedContent)) {
    const fallbackResponse = buildFallbackHint(fach, thema, aktuelleAufgabe);
    appendChatHistory_(profile, 'user', userMessage);
    appendChatHistory_(profile, 'assistant', fallbackResponse);
    saveUserProfile_(profile);
    return fallbackResponse;
  }

  appendChatHistory_(profile, 'user', userMessage);
  appendChatHistory_(profile, 'assistant', trimmedContent);
  saveUserProfile_(profile);

  return trimmedContent;
}

function extractGeminiText(data) {
  if (!data || !data.candidates || !data.candidates.length) {
    return '';
  }

  const candidate = data.candidates[0];
  if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
    return '';
  }

  const parts = candidate && candidate.content && candidate.content.parts;
  if (!parts || !parts.length) {
    return '';
  }

  return parts
    .map(function(part) {
      return part && part.text ? part.text : '';
    })
    .join('\n')
    .trim();
}

function buildFallbackHint(fach, thema, aktuelleAufgabe) {
  if (fach === 'Mathe') {
    return 'Hinweis: Zerlege die Aufgabe in kleine Schritte.\nNächster Schritt: Schau zuerst auf Rechenart, Zahlen und mögliche Zwischenrechnungen.\nPrüfimpuls: Welcher erste kleine Rechenschritt hilft dir hier weiter?';
  }

  if (fach === 'Englisch') {
    return 'Hinweis: Achte auf Signalwörter, Wortart und Satzbau.\nNächster Schritt: Suche zuerst das Wort oder die Zeitform, die über die Lösung entscheidet.\nPrüfimpuls: Welches Wort im Satz gibt dir den besten Hinweis?';
  }

  if (fach === 'Deutsch') {
    return 'Hinweis: Überlege zuerst, welche Regel geprüft wird, zum Beispiel Großschreibung, Zeichensetzung oder Satzbau.\nNächster Schritt: Untersuche dann nur einen Satzteil oder ein Wort nach dem anderen.\nPrüfimpuls: Welche Regel passt am besten zu deiner Aufgabe?';
  }

  return 'Hinweis: Gehe Schritt für Schritt vor.\nNächster Schritt: Beschreibe mir den Teil, den du schon verstehst, und den Teil, der noch unklar ist.\nPrüfimpuls: An welchem genauen Schritt hängst du gerade?';
}

function getRuleBasedHint(fach, thema, userMessage, aktuelleAufgabe) {
  const question = String(userMessage || '').toLowerCase().trim();
  const taskText = String(aktuelleAufgabe || '').toLowerCase();
  const combined = question + ' ' + taskText;

  if (fach === 'Mathe') {
    const plusMatch = combined.match(/(\d+)\s*\+\s*(\d+)/);
    if (plusMatch) {
      const left = parseInt(plusMatch[1], 10);
      const right = parseInt(plusMatch[2], 10);

      if (right === 10 || left === 10) {
        const other = right === 10 ? left : right;
        return 'Hinweis: Bei einer Plus-10-Aufgabe bleibt die Einerstelle gleich.\nNächster Schritt: Schau auf die Zahl ' + other + '. Die ' + (other % 10) + ' hinten bleibt stehen, nur der Zehner wird um 1 größer.\nPrüfimpuls: Wie sieht die Zahl aus, wenn vorne ein Zehner dazukommt?';
      }

      if (right < 20 && left < 20) {
        return 'Hinweis: Zerlege beide Zahlen in Zehner und Einer.\nNächster Schritt: Rechne erst die Zehner zusammen und danach die Einer.\nPrüfimpuls: Welche Zehner und welche Einer haben deine beiden Zahlen?';
      }
    }

    if (/bruch/.test(combined)) {
      return 'Hinweis: Bei Bruchaufgaben ist der Nenner oft der erste Schlüssel.\nNächster Schritt: Prüfe, ob die Nenner gleich sind oder ob du zuerst erweitern musst.\nPrüfimpuls: Haben beide Brüche schon denselben Nenner?';
    }

    if (/wie addiert man|wie rechne ich/.test(question)) {
      return 'Hinweis: Beim Addieren kannst du Zahlen in Zehner und Einer zerlegen.\nNächster Schritt: Rechne zuerst einen einfachen Teil, zum Beispiel die Zehner oder zuerst bis zum nächsten Zehner.\nPrüfimpuls: Welche zwei Teile könntest du bei deiner Aufgabe zuerst zusammenrechnen?';
    }
  }

  if (fach === 'Englisch') {
    if (/übersetze|uebersetze|vokabel/.test(combined)) {
      return 'Hinweis: Suche zuerst das Hauptwort oder Verb, das du sicher erkennst.\nNächster Schritt: Übersetze Wort für Wort und prüfe dann, ob der Ausdruck im Deutschen natürlich klingt.\nPrüfimpuls: Welches englische Wort in deiner Aufgabe kennst du sicher?';
    }

    if (/zeit|tense|verb|present|past|perfect/.test(combined)) {
      return 'Hinweis: Signalwörter helfen dir bei der Zeitform.\nNächster Schritt: Suche Wörter wie every day, yesterday, since oder while.\nPrüfimpuls: Welches Signalwort verrät dir hier die richtige Zeit?';
    }
  }

  if (fach === 'Deutsch') {
    if (/groß|gross|klein/.test(combined)) {
      return 'Hinweis: Prüfe zuerst Satzanfänge, Nomen und Nominalisierungen.\nNächster Schritt: Frage dich bei jedem wichtigen Wort, ob es ein Ding, Name oder nominalisiertes Wort ist.\nPrüfimpuls: Welches Wort müsste nach dieser Regel großgeschrieben werden?';
    }

    if (/komma|zeichensetzung/.test(combined)) {
      return 'Hinweis: Suche zuerst Aufzählungen oder Nebensätze.\nNächster Schritt: Markiere die Stelle, an der ein neuer Satzteil beginnt.\nPrüfimpuls: Wo trennt sich dein Satz in zwei Teile?';
    }

    if (/wortart|pronomen|verb|adjektiv|nomen/.test(combined)) {
      return 'Hinweis: Überlege, welche Aufgabe das Wort im Satz hat.\nNächster Schritt: Frage dich, ob es ein Ding, eine Tätigkeit, eine Eigenschaft oder ein Stellvertreterwort ist.\nPrüfimpuls: Welche Rolle spielt das Wort im Satz?';
    }
  }

  return '';
}
