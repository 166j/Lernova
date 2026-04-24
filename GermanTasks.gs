function createGermanTask(thema, klasse, unterthema) {
  const task = createGermanTaskByGrade_(thema, klasse, unterthema);
  return enrichGermanTask_(task, klasse, thema, unterthema);
}

function createGermanTaskByGrade_(thema, klasse, unterthema) {
  if (klasse === 5) {
    return createGermanGradeFiveTask(thema, unterthema);
  }
  if (klasse === 6) {
    return createGermanGradeSixTask(thema, unterthema);
  }
  if (klasse === 7) {
    return createGermanGradeSevenTask(thema, unterthema);
  }
  if (klasse === 8) {
    return createGermanGradeEightTask(thema, unterthema);
  }
  if (klasse === 9) {
    return createGermanGradeNineTask(thema, unterthema);
  }
  if (klasse === 10) {
    return createGermanGradeTenTask(thema, unterthema);
  }

  throw new Error('Unbekanntes Deutsch-Thema: ' + thema);
}

function enrichGermanTask_(task, klasse, thema, unterthema) {
  const safeTask = task || {};
  const finalSubtopic = safeTask.unterthema || unterthema || '';
  // Jede Deutsch-Aufgabe bekommt eine normalisierte Difficulty fuer XP, Leveling und adaptive Wiederholungen.
  const finalDifficulty = normalizeDifficulty_(safeTask.difficulty || inferGermanTaskDifficulty_(klasse, thema, finalSubtopic, safeTask));
  const seed = [klasse, thema, finalSubtopic, safeTask.type || 'text', safeTask.frage || '', safeTask.loesung || ''].join('::');

  return {
    id: safeTask.id || 'de-' + Math.abs(stringHashCode_(seed)),
    type: safeTask.type || 'text',
    frage: safeTask.frage || '',
    optionen: Array.isArray(safeTask.optionen) ? safeTask.optionen : [],
    loesung: safeTask.loesung,
    difficulty: finalDifficulty,
    thema: thema,
    unterthema: finalSubtopic,
    klasse: klasse
  };
}

function inferGermanTaskDifficulty_(klasse, thema, unterthema, task) {
  if (task && task.type === 'text') {
    return klasse >= 8 ? 'hard' : 'medium';
  }
  if (thema === 'schreiben') {
    return klasse >= 7 ? 'hard' : 'medium';
  }
  if (klasse <= 5) return 'easy';
  if (klasse <= 8) return 'medium';
  return 'hard';
}

function getGermanTaskCatalogForSelection_(klasse, thema, unterthema) {
  const catalog = [];
  const seen = {};
  let safetyCounter = 0;
  const maxItems = 36;

  while (catalog.length < maxItems && safetyCounter < maxItems * 6) {
    const task = enrichGermanTask_(createGermanTaskByGrade_(thema, klasse, unterthema), klasse, thema, unterthema);
    safetyCounter += 1;
    if (seen[task.id]) {
      continue;
    }
    seen[task.id] = true;
    catalog.push(task);
  }

  return catalog;
}

function stringHashCode_(value) {
  const text = String(value || '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function createGermanGradeFiveTask(thema, unterthema) {
  if (thema === 'schreiben') {
    return pickExpandedTask_([
      { type: 'choice', frage: 'Welcher Aufbau passt zu einem guten Text?', optionen: ['Schluss – Einleitung – Hauptteil', 'Einleitung – Hauptteil – Schluss', 'Hauptteil – Schluss – Einleitung'], loesung: 'Einleitung – Hauptteil – Schluss' },
      { type: 'order', frage: 'Ziehe die Teile eines Textes in die richtige Reihenfolge.', optionen: shuffleList(['Einleitung', 'Hauptteil', 'Schluss']), loesung: ['Einleitung', 'Hauptteil', 'Schluss'] },
      { type: 'choice', frage: 'Was passt am besten zu einer Personenbeschreibung?', optionen: ['Aussehen und Eigenschaften beschreiben', 'Nur die Überschrift notieren', 'Nur einen Ort nennen'], loesung: 'Aussehen und Eigenschaften beschreiben' },
      { type: 'text', frage: 'Schreibe 2 bis 3 Sätze als Anfang einer Erlebniserzählung über einen spannenden Schultag.', loesung: 'individuelle lösung' },
      { type: 'text', frage: 'Schreibe einen kurzen freundlichen Briefanfang an deine beste Freundin oder deinen besten Freund.', loesung: 'individuelle lösung' },
      { type: 'choice', frage: 'Was passt gut zu einer Bildergeschichte?', optionen: ['Die Bilder in sinnvoller Reihenfolge erzählen', 'Nur das letzte Bild beschreiben', 'Nur eine Überschrift aufschreiben'], loesung: 'Die Bilder in sinnvoller Reihenfolge erzählen' },
      { type: 'text', frage: 'Beschreibe in 2 bis 3 Sätzen einen Gegenstand aus deinem Klassenraum so genau, dass man ihn erkennt.', loesung: 'individuelle lösung' }
    ]);
  }
  if (thema === 'rechtschreibung') return createGermanGradeFiveSpellingTask(unterthema);
  if (thema === 'grammatik') return createGermanGradeFiveGrammarTask(unterthema);
  return { type: 'text', frage: 'Schreibe etwas zu diesem Thema.', loesung: 'individuelle lösung' };
}

function createGermanGradeFiveSpellingTask(unterthema) {
  const subtopic = unterthema || 'gross_klein';
  const taskSets = {
    gross_klein: [
      { type: 'choice', frage: 'Welcher Satz ist richtig geschrieben?', optionen: ['die Katze sitzt auf dem Sofa.', 'Die Katze sitzt auf dem Sofa.', 'Die katze sitzt auf dem sofa.'], loesung: 'Die Katze sitzt auf dem Sofa.' },
      { type: 'choice', frage: 'Welches Wort wird großgeschrieben?', optionen: ['laufen', 'schön', 'Sommer'], loesung: 'Sommer' },
      { type: 'choice', frage: 'Welcher Satzanfang ist richtig?', optionen: ['morgen gehen wir wandern.', 'Morgen gehen wir wandern.', 'morgen Gehen wir wandern.'], loesung: 'Morgen gehen wir wandern.' }
    ],
    ie_h_doppel: [
      { type: 'choice', frage: 'Welche Schreibweise ist richtig?', optionen: ['viel', 'fiel', 'vihl'], loesung: 'viel' },
      { type: 'choice', frage: 'Welche Schreibweise ist richtig?', optionen: ['Fehler', 'Feler', 'Feeler'], loesung: 'Fehler' },
      { type: 'choice', frage: 'Welches Wort ist richtig geschrieben?', optionen: ['fahren', 'faren', 'fahrn'], loesung: 'fahren' }
    ],
    s_laute: [
      { type: 'choice', frage: 'Welche Schreibweise mit ß oder ss ist richtig?', optionen: ['Straße', 'Strasse', 'Strahße'], loesung: 'Straße' },
      { type: 'choice', frage: 'Welche Schreibweise ist richtig?', optionen: ['Flus', 'Fluss', 'Fluhs'], loesung: 'Fluss' }
    ],
    zeichensetzung: [
      { type: 'choice', frage: 'Setze die Satzzeichen richtig: Ich kaufe Äpfel Birnen und Bananen', optionen: ['Ich kaufe Äpfel Birnen, und Bananen.', 'Ich kaufe Äpfel, Birnen und Bananen.', 'Ich kaufe, Äpfel Birnen und Bananen.'], loesung: 'Ich kaufe Äpfel, Birnen und Bananen.' },
      { type: 'choice', frage: 'Welcher Satz endet richtig?', optionen: ['Heute scheint die Sonne', 'Heute scheint die Sonne.', 'Heute scheint die Sonne,'], loesung: 'Heute scheint die Sonne.' }
    ],
    abschreiben: [
      { type: 'choice', frage: 'Welche Abschrift ist fehlerfrei?', optionen: ['Im Garten blühen rote Rosen.', 'Im Garten blühen rote rosen.', 'Im garten blühen rote Rosen.'], loesung: 'Im Garten blühen rote Rosen.' },
      { type: 'choice', frage: 'Verbessere den Fehler: „viilen dank für den brif.“', optionen: ['Vielen Dank für den Brief.', 'vielen Dank für den Brief.', 'Vielen Dank für den brif.'], loesung: 'Vielen Dank für den Brief.' }
    ]
  };
  return pickExpandedTask_(taskSets[subtopic] || taskSets.gross_klein, 'deutsch::5::rechtschreibung::' + subtopic, 20);
}

function createGermanGradeFiveGrammarTask(unterthema) {
  const subtopic = unterthema || 'wortarten';
  const taskSets = {
    wortarten: [
      { type: 'choice', frage: 'Welche Wortart ist „Hund“?', optionen: ['Verb', 'Nomen', 'Adjektiv'], loesung: 'Nomen' },
      { type: 'choice', frage: 'Welche Wortart ist „der“?', optionen: ['Artikel', 'Verb', 'Nomen'], loesung: 'Artikel' },
      { type: 'choice', frage: 'Welche Wortart ist „rennt“?', optionen: ['Adjektiv', 'Verb', 'Nomen'], loesung: 'Verb' },
      { type: 'choice', frage: 'Welche Wortart ist „schnell“?', optionen: ['Adjektiv', 'Verb', 'Artikel'], loesung: 'Adjektiv' }
    ],
    zeitformen: [
      { type: 'choice', frage: 'In welcher Zeit steht der Satz „Ich spiele Fußball.“?', optionen: ['Präsens', 'Präteritum', 'Perfekt'], loesung: 'Präsens' },
      { type: 'choice', frage: 'In welcher Zeit steht der Satz „Ich spielte Fußball.“?', optionen: ['Präteritum', 'Präsens', 'Perfekt'], loesung: 'Präteritum' },
      { type: 'choice', frage: 'In welcher Zeit steht der Satz „Ich habe Fußball gespielt.“?', optionen: ['Präsens', 'Perfekt', 'Präteritum'], loesung: 'Perfekt' }
    ],
    satzglieder: [
      { type: 'order', frage: 'Ziehe die Satzglieder in die richtige Reihenfolge für einen einfachen Satz.', optionen: shuffleList(['Subjekt', 'Prädikat', 'Objekt']), loesung: ['Subjekt', 'Prädikat', 'Objekt'] },
      { type: 'choice', frage: 'Was ist im Satz „Lena malt ein Bild.“ das Prädikat?', optionen: ['Lena', 'malt', 'ein Bild'], loesung: 'malt' },
      { type: 'choice', frage: 'Was ist im Satz „Lena malt ein Bild.“ das Subjekt?', optionen: ['Lena', 'malt', 'ein Bild'], loesung: 'Lena' }
    ],
    satzarten: [
      { type: 'choice', frage: 'Welche Satzart ist das: „Wo wohnst du?“', optionen: ['Aussagesatz', 'Aufforderungssatz', 'Fragesatz'], loesung: 'Fragesatz' },
      { type: 'choice', frage: 'Welche Satzart ist das: „Komm bitte her!“', optionen: ['Aufforderungssatz', 'Fragesatz', 'Aussagesatz'], loesung: 'Aufforderungssatz' },
      { type: 'choice', frage: 'Welche Satzart ist das: „Heute scheint die Sonne.“', optionen: ['Aussagesatz', 'Fragesatz', 'Aufforderungssatz'], loesung: 'Aussagesatz' }
    ]
  };
  return pickExpandedTask_(taskSets[subtopic] || taskSets.wortarten, 'deutsch::5::grammatik::' + subtopic, 20);
}

function createGermanGradeSixTask(thema, unterthema) {
  if (thema === 'schreiben') return createGermanGradeSixWritingTask();
  if (thema === 'rechtschreibung') return createGermanGradeSixSpellingTask(unterthema);
  if (thema === 'grammatik') return createGermanGradeSixGrammarTask(unterthema);
  return { type: 'text', frage: 'Schreibe etwas zu diesem Thema.', loesung: 'individuelle lösung' };
}

function createGermanGradeSixWritingTask() {
  return pickExpandedTask_([
    { type: 'choice', frage: 'Was passt am besten zu einem formelleren Brief oder einer E-Mail?', optionen: ['Hi, was geht?', 'Sehr geehrte Frau Keller,', 'Hey du!'], loesung: 'Sehr geehrte Frau Keller,' },
    { type: 'text', frage: 'Schreibe den Anfang einer formelleren E-Mail an deine Lehrkraft, in der du um Informationen zu Hausaufgaben bittest.', loesung: 'individuelle lösung' },
    { type: 'choice', frage: 'Was verbessert einen Text am besten?', optionen: ['Nur ein Wort ändern', 'Fehler verbessern und Sätze klarer formulieren', 'Alles genauso lassen'], loesung: 'Fehler verbessern und Sätze klarer formulieren' },
    { type: 'text', frage: 'Formuliere diesen Satz besser: „Ich war dann da und das war halt gut.“', loesung: 'individuelle lösung' },
    { type: 'choice', frage: 'Welche Anrede passt zu einer E-Mail an die Schulleitung?', optionen: ['Hallo Leute,', 'Liebe Oma,', 'Sehr geehrte Damen und Herren,'], loesung: 'Sehr geehrte Damen und Herren,' },
    { type: 'text', frage: 'Verbessere diesen Satz sprachlich: „Ich will wissen was auf ist weil ich es nicht habe.“', loesung: 'individuelle lösung' }
  ]);
}

function createGermanGradeSixSpellingTask(unterthema) {
  const subtopic = unterthema || 'gross_klein';
  const taskSets = {
    gross_klein: [
      { type: 'choice', frage: 'Welche Nominalisierung ist richtig geschrieben?', optionen: ['das laufen', 'das Laufen', 'Das laufen'], loesung: 'das Laufen' },
      { type: 'choice', frage: 'Welcher Satz ist richtig?', optionen: ['Beim Schwimmen habe ich Spaß.', 'beim Schwimmen habe ich Spaß.', 'Beim schwimmen habe ich Spaß.'], loesung: 'Beim Schwimmen habe ich Spaß.' }
    ],
    ie_h_doppel: [
      { type: 'choice', frage: 'Welche Schreibweise ist richtig?', optionen: ['ziehen', 'zihen', 'ziehn'], loesung: 'ziehen' },
      { type: 'choice', frage: 'Welche Schreibweise ist richtig?', optionen: ['kommen', 'komen', 'kohmen'], loesung: 'kommen' },
      { type: 'choice', frage: 'Welches Wort ist richtig geschrieben?', optionen: ['Sohn', 'Son', 'Sohnn'], loesung: 'Sohn' }
    ],
    s_laute: [
      { type: 'choice', frage: 'Welche Schreibweise ist richtig?', optionen: ['müssen', 'müßen', 'müsen'], loesung: 'müssen' },
      { type: 'choice', frage: 'Welche Schreibweise ist richtig?', optionen: ['groß', 'gross', 'grohs'], loesung: 'groß' }
    ],
    zeichensetzung: [
      { type: 'choice', frage: 'Wo steht das Komma richtig?', optionen: ['Ich glaube dass es morgen regnet.', 'Ich glaube, dass es morgen regnet.', 'Ich glaube dass, es morgen regnet.'], loesung: 'Ich glaube, dass es morgen regnet.' },
      { type: 'choice', frage: 'Welche Aufzählung ist richtig gesetzt?', optionen: ['Wir brauchen Hefte Stifte und Bücher.', 'Wir brauchen Hefte, Stifte und Bücher.', 'Wir brauchen Hefte, Stifte, und Bücher.'], loesung: 'Wir brauchen Hefte, Stifte und Bücher.' }
    ],
    abschreiben: [
      { type: 'choice', frage: 'Welche Verbesserung ist richtig?', optionen: ['Das lesen macht mir spaß.', 'Das Lesen macht mir Spaß.', 'Das lesen macht mir Spaß.'], loesung: 'Das Lesen macht mir Spaß.' },
      { type: 'choice', frage: 'Welcher Satz enthält keinen Fehler mehr?', optionen: ['Ich hoffe das du kommst.', 'Ich hoffe, dass du kommst.', 'Ich hoffe dass, du kommst.'], loesung: 'Ich hoffe, dass du kommst.' }
    ]
  };
  return pickExpandedTask_(taskSets[subtopic] || taskSets.gross_klein, 'deutsch::6::rechtschreibung::' + subtopic, 20);
}

function createGermanGradeSixGrammarTask(unterthema) {
  const subtopic = unterthema || 'wortarten';
  const taskSets = {
    wortarten: [
      { type: 'choice', frage: 'Welche Wortart ist „mein“?', optionen: ['Pronomen', 'Verb', 'Nomen'], loesung: 'Pronomen' },
      { type: 'choice', frage: 'Welche Wortart ist „schnell“?', optionen: ['Adjektiv', 'Artikel', 'Nomen'], loesung: 'Adjektiv' },
      { type: 'choice', frage: 'Welche Wortart ist „wir“?', optionen: ['Pronomen', 'Adjektiv', 'Verb'], loesung: 'Pronomen' }
    ],
    zeitformen: [
      { type: 'choice', frage: 'In welcher Zeit steht der Satz „Ich hatte meine Hausaufgaben gemacht.“?', optionen: ['Perfekt', 'Plusquamperfekt', 'Präteritum'], loesung: 'Plusquamperfekt' },
      { type: 'choice', frage: 'In welcher Zeit steht der Satz „Ich spielte im Hof.“?', optionen: ['Präteritum', 'Präsens', 'Perfekt'], loesung: 'Präteritum' },
      { type: 'choice', frage: 'In welcher Zeit steht der Satz „Ich habe ein Buch gelesen.“?', optionen: ['Perfekt', 'Präsens', 'Plusquamperfekt'], loesung: 'Perfekt' },
      { type: 'choice', frage: 'Welche Form ist Plusquamperfekt?', optionen: ['ich hatte gelernt', 'ich lerne', 'ich habe gelernt'], loesung: 'ich hatte gelernt' }
    ],
    satzglieder: [
      { type: 'choice', frage: 'Welches Objekt steht im Dativ? „Ich gebe dem Hund einen Ball.“', optionen: ['dem Hund', 'einen Ball', 'Ich'], loesung: 'dem Hund' },
      { type: 'choice', frage: 'Welches Objekt steht im Akkusativ? „Ich gebe dem Hund einen Ball.“', optionen: ['dem Hund', 'einen Ball', 'Ich'], loesung: 'einen Ball' },
      { type: 'order', frage: 'Ordne die Satzglieder zu einem einfachen Hauptsatz.', optionen: shuffleList(['Subjekt', 'Prädikat', 'Objekt']), loesung: ['Subjekt', 'Prädikat', 'Objekt'] }
    ],
    satzarten: [
      { type: 'choice', frage: 'Welcher Satz ist ein Nebensatz?', optionen: ['weil ich krank war', 'Ich gehe nach Hause.', 'Komm bitte sofort!'], loesung: 'weil ich krank war' },
      { type: 'choice', frage: 'Was ist ein Satzgefüge?', optionen: ['Zwei Hauptsätze ohne Nebensatz', 'Ein Hauptsatz mit mindestens einem Nebensatz', 'Nur ein einzelnes Wort'], loesung: 'Ein Hauptsatz mit mindestens einem Nebensatz' },
      { type: 'choice', frage: 'Welche Satzart ist das: „Schließe bitte die Tür!“', optionen: ['Aufforderungssatz', 'Fragesatz', 'Aussagesatz'], loesung: 'Aufforderungssatz' }
    ]
  };
  return pickExpandedTask_(taskSets[subtopic] || taskSets.wortarten, 'deutsch::6::grammatik::' + subtopic, 20);
}

function createGermanGradeSevenTask(thema, unterthema) {
  return createGermanSecondaryTask(7, thema, unterthema);
}

function createGermanGradeEightTask(thema, unterthema) {
  return createGermanSecondaryTask(8, thema, unterthema);
}

function createGermanGradeNineTask(thema, unterthema) {
  return createGermanUpperSecondaryTask(9, thema, unterthema);
}

function createGermanGradeTenTask(thema, unterthema) {
  return createGermanUpperSecondaryTask(10, thema, unterthema);
}

function createGermanSecondaryTask(klasse, thema, unterthema) {
  if (thema === 'schreiben') {
    return pickExpandedTask_([
      { type: 'choice', frage: 'Welche Textsorte passt am besten zu einer sachlichen Darstellung eines Unfalls?', optionen: ['Bericht', 'Märchen', 'Gedicht'], loesung: 'Bericht' },
      { type: 'choice', frage: 'Was ist bei einer Vorgangsbeschreibung besonders wichtig?', optionen: ['Die Reihenfolge der Schritte', 'Nur eine spannende Überschrift', 'Viele Ausrufezeichen'], loesung: 'Die Reihenfolge der Schritte' },
      { type: 'text', frage: 'Schreibe den Anfang eines Berichts über einen Vorfall in der Schule. Achte auf eine sachliche Sprache.', loesung: 'individuelle lösung' },
      { type: 'text', frage: 'Formuliere zwei sachliche Sätze für eine Vorgangsbeschreibung zum Thema „Pausenbrot zubereiten“.', loesung: 'individuelle lösung' },
      { type: 'choice', frage: 'Was verbessert eine Argumentation am besten?', optionen: ['Eine Begründung mit Beispiel', 'Nur die eigene Meinung', 'Möglichst kurze Sätze ohne Inhalt'], loesung: 'Eine Begründung mit Beispiel' },
      { type: 'text', frage: 'Schreibe zwei passende Einleitungssätze für eine Stellungnahme zum Thema „Sollte die Pause länger sein?“', loesung: 'individuelle lösung' }
    ]);
  }
  if (thema === 'rechtschreibung') return createGermanSecondarySpellingTask(klasse, unterthema);
  if (thema === 'grammatik') return createGermanSecondaryGrammarTask(klasse, unterthema);
  return { type: 'text', frage: 'Schreibe etwas zu diesem Thema.', loesung: 'individuelle lösung' };
}

function createGermanUpperSecondaryTask(klasse, thema, unterthema) {
  if (thema === 'schreiben') {
    return pickExpandedTask_([
      { type: 'choice', frage: 'Welche Textsorte eignet sich am besten, wenn du Pro- und Contra-Argumente abwägen sollst?', optionen: ['Erörterung', 'Rezept', 'Märchen'], loesung: 'Erörterung' },
      { type: 'choice', frage: 'Was gehört in eine Inhaltsangabe?', optionen: ['Sachliche Wiedergabe im Präsens', 'Eigene Meinung in jedem Satz', 'Wörtliche Rede'], loesung: 'Sachliche Wiedergabe im Präsens' },
      { type: 'text', frage: 'Schreibe eine kurze Einleitung für eine Erörterung zum Thema „Sollte das Handy in der Schule erlaubt sein?“', loesung: 'individuelle lösung' },
      { type: 'text', frage: 'Formuliere zwei sachliche Sätze für eine Bewerbung oder eine formelle E-Mail.', loesung: 'individuelle lösung' },
      { type: 'choice', frage: 'Was ist für eine Interpretation wichtig?', optionen: ['Textstellen mit Deutung verbinden', 'Nur den Titel wiederholen', 'Den Text vollständig abschreiben'], loesung: 'Textstellen mit Deutung verbinden' },
      { type: 'text', frage: 'Schreibe zwei passende Hauptargumente für eine Erörterung zum Thema „Digitale Hausaufgaben“.', loesung: 'individuelle lösung' }
    ]);
  }
  if (thema === 'rechtschreibung') return createGermanUpperSecondarySpellingTask(klasse, unterthema);
  if (thema === 'grammatik') return createGermanUpperSecondaryGrammarTask(klasse, unterthema);
  return { type: 'text', frage: 'Schreibe etwas zu diesem Thema.', loesung: 'individuelle lösung' };
}

function createGermanSecondarySpellingTask(klasse, unterthema) {
  const subtopic = unterthema || 'das_dass';
  const taskSets = {
    das_dass: [
      { type: 'choice', frage: 'Welche Schreibweise ist richtig?', optionen: ['Ich glaube, das er kommt.', 'Ich glaube, dass er kommt.', 'Ich glaube dass, er kommt.'], loesung: 'Ich glaube, dass er kommt.' },
      { type: 'choice', frage: 'Welche Form passt? „Das ist das Buch, ___ ich suche.“', optionen: ['das', 'dass', 'daß'], loesung: 'das' }
    ],
    kommaregeln: [
      { type: 'choice', frage: 'Wo steht das Komma richtig?', optionen: ['Wenn es regnet bleibe ich zu Hause.', 'Wenn es regnet, bleibe ich zu Hause.', 'Wenn, es regnet bleibe ich zu Hause.'], loesung: 'Wenn es regnet, bleibe ich zu Hause.' },
      { type: 'choice', frage: 'Welche Aufzählung ist richtig?', optionen: ['Wir brauchen Hefte Stifte, und Bücher.', 'Wir brauchen Hefte, Stifte und Bücher.', 'Wir brauchen, Hefte Stifte und Bücher.'], loesung: 'Wir brauchen Hefte, Stifte und Bücher.' },
      { type: 'choice', frage: 'Welche Kommasetzung ist richtig?', optionen: ['Obwohl es spät war lernten wir weiter.', 'Obwohl es spät war, lernten wir weiter.', 'Obwohl, es spät war lernten wir weiter.'], loesung: 'Obwohl es spät war, lernten wir weiter.' }
    ],
    wortbausteine: [
      { type: 'choice', frage: 'Welche Schreibweise ist richtig?', optionen: ['wiederholen', 'widerholen', 'wiederhohlen'], loesung: 'wiederholen' },
      { type: 'choice', frage: 'Welches Wort ist richtig geschrieben?', optionen: ['selbstständig', 'selbsständig', 'selbststaendig'], loesung: 'selbstständig' }
    ]
  };
  return pickExpandedTask_(taskSets[subtopic] || taskSets.das_dass, 'deutsch::sek1::rechtschreibung::' + klasse + '::' + subtopic, 20);
}

function createGermanSecondaryGrammarTask(klasse, unterthema) {
  const subtopic = unterthema || 'satzbau';
  const taskSets = {
    satzbau: [
      { type: 'choice', frage: 'Welcher Satz enthält einen Haupt- und einen Nebensatz?', optionen: ['Ich bleibe zu Hause, weil ich krank bin.', 'Morgen kommt mein Freund.', 'Lies bitte das Buch!'], loesung: 'Ich bleibe zu Hause, weil ich krank bin.' },
      { type: 'choice', frage: 'Was ist ein Satzgefüge?', optionen: ['Ein Hauptsatz mit Nebensatz', 'Nur ein Hauptsatz', 'Eine Aufzählung'], loesung: 'Ein Hauptsatz mit Nebensatz' }
    ],
    pronomen: [
      { type: 'choice', frage: 'Welche Wortart ist „mein“?', optionen: ['Pronomen', 'Verb', 'Adjektiv'], loesung: 'Pronomen' },
      { type: 'choice', frage: 'Welches Wort ist ein Pronomen?', optionen: ['laufen', 'dieser', 'schön'], loesung: 'dieser' }
    ],
    aktiv_passiv: [
      { type: 'choice', frage: 'Welcher Satz steht im Passiv?', optionen: ['Der Ball wird geworfen.', 'Tom wirft den Ball.', 'Tom warf den Ball.'], loesung: 'Der Ball wird geworfen.' },
      { type: 'choice', frage: 'Welcher Satz steht im Aktiv?', optionen: ['Das Fenster wird geöffnet.', 'Die Tür wurde geschlossen.', 'Lena öffnet das Fenster.'], loesung: 'Lena öffnet das Fenster.' },
      { type: 'choice', frage: 'Welche Passivform passt zu „Die Klasse löst die Aufgabe.“?', optionen: ['Die Aufgabe wird von der Klasse gelöst.', 'Die Aufgabe löst die Klasse.', 'Die Aufgabe hat gelöst.'], loesung: 'Die Aufgabe wird von der Klasse gelöst.' }
    ]
  };
  return pickExpandedTask_(taskSets[subtopic] || taskSets.satzbau, 'deutsch::sek1::grammatik::' + klasse + '::' + subtopic, 20);
}

function createGermanUpperSecondarySpellingTask(klasse, unterthema) {
  const subtopic = unterthema || 'fremdwoerter';
  const taskSets = {
    fremdwoerter: [
      { type: 'choice', frage: 'Welche Schreibweise ist richtig?', optionen: ['interessant', 'interresant', 'interressant'], loesung: 'interessant' },
      { type: 'choice', frage: 'Welche Schreibweise ist richtig?', optionen: ['Rhythmus', 'Rythmus', 'Rhythmmus'], loesung: 'Rhythmus' }
    ],
    nominalisierung: [
      { type: 'choice', frage: 'Welche Nominalisierung ist richtig?', optionen: ['beim lernen', 'beim Lernen', 'Beim lernen'], loesung: 'beim Lernen' },
      { type: 'choice', frage: 'Welche Schreibweise ist richtig?', optionen: ['das Schwimmen', 'das schwimmen', 'Das schwimmen'], loesung: 'das Schwimmen' },
      { type: 'choice', frage: 'Welche Nominalisierung ist korrekt?', optionen: ['beim Lesen', 'beim lesen', 'Beim lesen'], loesung: 'beim Lesen' }
    ],
    kommata: [
      { type: 'choice', frage: 'Wo steht das Komma richtig?', optionen: ['Er sagte dass er später komme.', 'Er sagte, dass er später komme.', 'Er sagte dass, er später komme.'], loesung: 'Er sagte, dass er später komme.' },
      { type: 'choice', frage: 'Welcher Satz ist richtig gesetzt?', optionen: ['Bevor wir gehen räumen wir auf.', 'Bevor wir gehen, räumen wir auf.', 'Bevor, wir gehen räumen wir auf.'], loesung: 'Bevor wir gehen, räumen wir auf.' }
    ]
  };
  return pickExpandedTask_(taskSets[subtopic] || taskSets.fremdwoerter, 'deutsch::ober::rechtschreibung::' + klasse + '::' + subtopic, 20);
}

function createGermanUpperSecondaryGrammarTask(klasse, unterthema) {
  const subtopic = unterthema || 'konjunktiv';
  const taskSets = {
    konjunktiv: [
      { type: 'choice', frage: 'Welcher Satz steht im Konjunktiv II?', optionen: ['Ich hätte mehr gelernt.', 'Ich habe mehr gelernt.', 'Ich lerne mehr.'], loesung: 'Ich hätte mehr gelernt.' },
      { type: 'choice', frage: 'Wofür nutzt man den Konjunktiv I häufig?', optionen: ['Für die indirekte Rede', 'Für Befehle', 'Für Aufzählungen'], loesung: 'Für die indirekte Rede' },
      { type: 'choice', frage: 'Welche Form passt zur indirekten Rede?', optionen: ['Er sagte, er habe keine Zeit.', 'Er sagte, er hat keine Zeit.', 'Er sagte, er hatte keine Zeit.'], loesung: 'Er sagte, er habe keine Zeit.' }
    ],
    satzbau: [
      { type: 'choice', frage: 'Welcher Satz ist ein Satzgefüge?', optionen: ['Ich gehe nach Hause, weil ich müde bin.', 'Ich gehe nach Hause und ich esse.', 'Müde und leise.'], loesung: 'Ich gehe nach Hause, weil ich müde bin.' },
      { type: 'choice', frage: 'Welches Satzglied steht im Dativ?', optionen: ['dem Lehrer', 'den Ball', 'der Lehrer'], loesung: 'dem Lehrer' }
    ],
    aktiv_passiv: [
      { type: 'choice', frage: 'Welcher Satz steht im Passiv?', optionen: ['Die Aufgabe wird gelöst.', 'Der Schüler löst die Aufgabe.', 'Die Schüler lösen Aufgaben.'], loesung: 'Die Aufgabe wird gelöst.' },
      { type: 'choice', frage: 'Wie lautet die Aktivform zu „Der Brief wurde geschrieben.“?', optionen: ['Jemand schrieb den Brief.', 'Der Brief schrieb jemanden.', 'Der Brief wird geschrieben.'], loesung: 'Jemand schrieb den Brief.' }
    ]
  };
  return pickExpandedTask_(taskSets[subtopic] || taskSets.konjunktiv, 'deutsch::ober::grammatik::' + klasse + '::' + subtopic, 20);
}
