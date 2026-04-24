function createMathTask(thema, klasse) {
  const tasksByTopic = {
    zahlen: [
      function() {
        const a = randInt(120, 950);
        const b = randInt(25, 280);
        return { frage: 'Berechne im Zahlenraum sicher: ' + a + ' + ' + b, loesung: String(a + b) };
      },
      function() {
        const a = randInt(200, 999);
        const b = randInt(20, 180);
        return { frage: 'Berechne: ' + a + ' - ' + b, loesung: String(a - b) };
      },
      function() {
        const whole = randInt(12, 45);
        const decimal = randInt(1, 9) / 10;
        const value = whole + decimal;
        return { frage: 'Welche Ziffer steht in der Zehntelstelle von ' + value.toFixed(1) + '?', loesung: String(Math.round(decimal * 10)) };
      },
      function() {
        const number = randInt(1000, 9999);
        const place = pick(['Hunderter', 'Zehner']);
        const digit = place === 'Hunderter' ? String(Math.floor(number / 100) % 10) : String(Math.floor(number / 10) % 10);
        return createChoiceTask('Welche Ziffer steht bei ' + number + ' auf der ' + place + 'stelle?', [digit, String(randInt(0, 9)), String(randInt(0, 9))], digit);
      },
      function() {
        const a = randInt(6, 14);
        const b = randInt(3, 9);
        return createChoiceTask('Welche Rechnung ist richtig?', [String(a) + ' · ' + String(b) + ' = ' + String(a * b), String(a) + ' · ' + String(b) + ' = ' + String(a + b), String(a) + ' · ' + String(b) + ' = ' + String(a * b + 2)], String(a) + ' · ' + String(b) + ' = ' + String(a * b));
      }
    ],
    geometrie: [
      function() {
        const a = randInt(3, 12);
        const b = randInt(4, 13);
        return { frage: 'Ein Rechteck ist ' + a + ' cm lang und ' + b + ' cm breit. Wie groß ist der Umfang?', loesung: String(2 * a + 2 * b) };
      },
      function() {
        const side = randInt(3, 11);
        return { frage: 'Wie groß ist der Umfang eines Quadrats mit Seitenlaenge ' + side + ' cm?', loesung: String(side * 4) };
      },
      function() {
        const angle = pick([30, 45, 60, 90]);
        return { frage: 'Wie nennt man einen Winkel mit ' + angle + ' Grad?', loesung: angle === 90 ? 'Rechter Winkel' : 'Spitzer Winkel' };
      },
      function() {
        return createChoiceTask('Welche Figur hat genau vier gleich lange Seiten?', ['Quadrat', 'Dreieck', 'Kreis'], 'Quadrat');
      },
      function() {
        const sideA = randInt(4, 9);
        const sideB = randInt(2, 7);
        return createChoiceTask('Welche Rechnung passt zum Umfang eines Rechtecks mit ' + sideA + ' cm und ' + sideB + ' cm?', ['2 · ' + sideA + ' + 2 · ' + sideB, sideA + ' · ' + sideB, sideA + ' + sideB'], '2 · ' + sideA + ' + 2 · ' + sideB);
      }
    ],
    daten: [
      function() {
        const values = shuffleList([4, 6, 6, 8, 10]).slice(0, 5);
        const sum = values.reduce(function(acc, value) { return acc + value; }, 0);
        return { frage: 'Berechne den Mittelwert der Zahlen: ' + values.join(', '), loesung: String(sum / values.length) };
      },
      function() {
        return { frage: 'Welche Darstellung passt besonders gut zum Vergleichen mehrerer Mengen: Balkendiagramm oder Thermometer?', loesung: 'Balkendiagramm' };
      },
      function() {
        const a = randInt(8, 18);
        const b = randInt(4, 12);
        return { frage: 'In Klasse A lesen ' + a + ' Kinder gern Comics, in Klasse B ' + b + '. Wie viele mehr sind es in Klasse A?', loesung: String(a - b) };
      },
      function() {
        return createChoiceTask('Welche Darstellung ist für das Vergleichen von Kategorien besonders geeignet?', ['Balkendiagramm', 'Fahrplan', 'Rezept'], 'Balkendiagramm');
      },
      function() {
        const values = shuffleList([2, 2, 3, 4, 4, 4]);
        return createChoiceTask('Welche Zahl kommt in der Datenreihe am haeufigsten vor: ' + values.join(', ') + '?', ['2', '3', '4'], '4');
      }
    ],
    brueche_zuordnungen: [
      function() {
        const numerator = pick([1, 2, 3, 4]);
        const denominator = pick([2, 4, 5, 10]);
        return { frage: 'Schreibe den Bruch ' + numerator + '/' + denominator + ' als Dezimalzahl.', loesung: String(numerator / denominator) };
      },
      function() {
        const total = randInt(20, 80);
        const factor = pick([2, 3, 4]);
        return { frage: 'Eine proportionale Zuordnung: ' + factor + ' Hefte kosten ' + total + ' Euro. Was kosten 1 Heft?', loesung: String(total / factor) };
      },
      function() {
        const base = randInt(20, 120);
        const percent = pick([10, 25, 50, 75]);
        return { frage: 'Wie viel sind ' + percent + '% von ' + base + '?', loesung: String(base * percent / 100) };
      },
      function() {
        return createChoiceTask('Welche Aussage beschreibt eine proportionale Zuordnung?', ['Doppelt so viel fuehrt zu doppelt so viel.', 'Die Werte steigen zufaellig.', 'Es gibt nie einen Zusammenhang.'], 'Doppelt so viel fuehrt zu doppelt so viel.');
      }
    ],
    terme_gleichungen: [
      function() {
        const x = randInt(2, 12);
        const add = randInt(3, 15);
        return { frage: 'Loese die Gleichung: x + ' + add + ' = ' + (x + add), loesung: String(x) };
      },
      function() {
        const factor = randInt(2, 8);
        const x = randInt(2, 10);
        return { frage: 'Loese: ' + factor + 'x = ' + (factor * x), loesung: String(x) };
      },
      function() {
        return { frage: 'Vereinfache: 3a + 2a', loesung: '5a' };
      },
      function() {
        return createChoiceTask('Welche Vereinfachung ist richtig?', ['4x + 3x = 7x', '4x + 3x = 12x', '4x + 3x = x'], '4x + 3x = 7x');
      }
    ],
    geometrie_flaechen: [
      function() {
        const base = randInt(4, 12);
        const height = randInt(3, 10);
        return { frage: 'Berechne den Flaecheninhalt eines Dreiecks mit g = ' + base + ' cm und h = ' + height + ' cm.', loesung: String(base * height / 2) };
      },
      function() {
        const missing = pick([35, 48, 62, 75]);
        return { frage: 'In einem Dreieck sind zwei Winkel zusammen ' + (180 - missing) + ' Grad. Wie groß ist der dritte Winkel?', loesung: String(missing) };
      },
      function() {
        const radius = randInt(2, 8);
        return { frage: 'Welcher Begriff passt zu allen Punkten mit gleichem Abstand vom Mittelpunkt?', loesung: 'Kreis' };
      },
      function() {
        return createChoiceTask('Welche Formel passt zum Flaecheninhalt eines Rechtecks?', ['Laenge · Breite', '2 · Laenge + 2 · Breite', 'Grundseite + Hoehe'], 'Laenge · Breite');
      }
    ],
    funktionen: [
      function() {
        const m = randInt(1, 4);
        const b = randInt(-3, 5);
        const x = randInt(0, 5);
        return { frage: 'Berechne den y-Wert der Funktion y = ' + m + 'x + ' + b + ' für x = ' + x + '.', loesung: String(m * x + b) };
      },
      function() {
        return { frage: 'Wie nennt man den Graphen einer linearen Funktion?', loesung: 'Gerade' };
      },
      function() {
        const x = randInt(1, 8);
        return { frage: 'Welcher x-Wert loest 2x + 3 = ' + (2 * x + 3) + '?', loesung: String(x) };
      },
      function() {
        return createChoiceTask('Welche Darstellung gehoert zu einer Funktion?', ['Wertetabelle', 'Packliste', 'Bastelbogen'], 'Wertetabelle');
      }
    ],
    prozent_zins: [
      function() {
        const base = randInt(80, 500);
        const percent = pick([5, 10, 20, 25]);
        return { frage: 'Ein Artikel kostet ' + base + ' Euro. Wie hoch ist ein Rabatt von ' + percent + '%?', loesung: String(base * percent / 100) };
      },
      function() {
        const capital = randInt(100, 900);
        const rate = pick([2, 3, 4, 5]);
        return { frage: 'Wie viele Euro Zinsen gibt es bei ' + capital + ' Euro und ' + rate + '% für ein Jahr?', loesung: String(capital * rate / 100) };
      },
      function() {
        return { frage: 'Wie nennt man den Wert, von dem Prozente berechnet werden?', loesung: 'Grundwert' };
      },
      function() {
        return createChoiceTask('Welche Angabe ist ein Prozentsatz?', ['25 %', '25 Euro', '25 cm'], '25 %');
      }
    ],
    koerper_wahrscheinlichkeit: [
      function() {
        const a = randInt(2, 8);
        const b = randInt(2, 8);
        const c = randInt(2, 8);
        return { frage: 'Berechne das Volumen eines Quaders mit ' + a + ' cm, ' + b + ' cm und ' + c + ' cm.', loesung: String(a * b * c) };
      },
      function() {
        return { frage: 'Wie groß ist die Wahrscheinlichkeit für eine gerade Zahl beim fairen Würfel?', loesung: '1/2' };
      },
      function() {
        const values = [2, 4, 6, 8, 10];
        return { frage: 'Wie groß ist der Mittelwert von 2, 4, 6, 8 und 10?', loesung: '6' };
      },
      function() {
        return createChoiceTask('Wie viele mögliche Ergebnisse hat ein normaler Würfel?', ['6', '8', '10'], '6');
      }
    ]
  };

  if (tasksByTopic[thema]) {
    return pickExpandedTask_(tasksByTopic[thema], 'mathe::' + klasse + '::' + thema, 20);
  }
  throw new Error('Unbekanntes Mathe-Thema: ' + thema);
}

function createEnglishTask(thema, klasse) {
  const difficulty = getDifficultyLevel(klasse);

  const tasksByTopic = {
    alltag: {
      leicht: [
        ['Complete the answer: "What is your name?" - "My ___ is Mia."', 'name'],
        ['Translate into German: school bag', 'Schultasche'],
        ['Choose the correct word: "I ___ to school by bus." (go / goes / going)', 'go']
      ],
      mittel: [
        ['Complete: "I usually ___ my homework after lunch." (do)', 'do'],
        ['Translate into German: My favourite hobby is swimming.', 'Mein Lieblingshobby ist Schwimmen'],
        ['Choose the right answer: "We ___ in the park on Saturdays." (play / plays / is play)', 'play']
      ],
      schwer: [
        ['Complete the message: "Can you ___ me at 5 o clock?" (meet)', 'meet'],
        ['Translate into German: We often spend our weekends with friends.', 'Wir verbringen unsere Wochenenden oft mit Freunden'],
        ['Choose the best phrase: "Could you ___ me later?" (call / calls / called)', 'call']
      ]
    },
    grammar_basic: {
      leicht: [
        ['There is ___ orange on the table. (a / an)', 'an'],
        ['She ___ from London. (be)', 'is'],
        ['Choose the correct form: "They ___ happy." (is / are / am)', 'are']
      ],
      mittel: [
        ['They ___ football every Friday. (play)', 'play'],
        ['My brother ___ TV after dinner. (watch)', 'watches'],
        ['Choose the correct comparative: "Math is ___ than yesterday." (easy / easier / easiest)', 'easier']
      ],
      schwer: [
        ['These books are ___ than mine. (new)', 'newer'],
        ['He is the ___ student in our group. (tall)', 'tallest'],
        ['Choose the right form: "If I ___ more time, I would read more." (have / had / has)', 'had']
      ]
    },
    reading: {
      leicht: [
        ['Which word belongs to school life: ruler or thunderstorm?', 'ruler'],
        ['Choose the correct answer: A timetable tells you your school ___.', 'subjects']
      ],
      mittel: [
        ['What do you do first when you read a short text: look for key words or translate every word?', 'look for key words'],
        ['Which question fits reading for detail: "What is the exact time?" or "Is the topic interesting?"', 'What is the exact time?']
      ],
      schwer: [
        ['A heading helps you understand the main ___.', 'idea'],
        ['If a word is unknown, you should also use the surrounding ___.', 'context']
      ]
    },
    mediation: {
      leicht: [
        ['Translate into English for a friend: "Der Bus kommt um halb acht."', 'The bus arrives at half past seven'],
        ['Translate into German: "The museum is closed on Mondays."', 'Das Museum ist montags geschlossen']
      ],
      mittel: [
        ['Complete for mediation: "You should bring your sports clothes and a bottle of water." Translate "sports clothes".', 'Sportsachen'],
        ['Translate into English: "Wir treffen uns vor dem Kino."', 'We are meeting in front of the cinema']
      ],
      schwer: [
        ['For mediation, should you translate word for word or according to meaning?', 'according to meaning'],
        ['Translate into German: "Please tell your parents that the trip starts at 8 a.m."', 'Bitte sagt euren Eltern, dass der Ausflug um 8 Uhr beginnt']
      ]
    },
    tenses: {
      leicht: [
        ['Yesterday we ___ a film. (watch)', 'watched'],
        ['I ___ in Berlin since 2020. (live)', 'have lived']
      ],
      mittel: [
        ['When I arrived, he ___ dinner. (cook)', 'was cooking'],
        ['Last week she ___ her grandma. (visit)', 'visited']
      ],
      schwer: [
        ['Before the lesson started, we ___ the text. (read)', 'had read'],
        ['While I ___ my homework, my sister called me. (do)', 'was doing']
      ]
    },
    text_media: {
      leicht: [
        ['Which text type often tells a story with speakers: dialogue or shopping list?', 'dialogue'],
        ['Choose the better introduction for a poster: short heading or ten full paragraphs?', 'short heading']
      ],
      mittel: [
        ['A blog entry is usually more personal or more scientific?', 'more personal'],
        ['Which word fits media work: headline or denominator?', 'headline']
      ],
      schwer: [
        ['When presenting a person vividly, you should use details and clear ___.', 'examples'],
        ['A factual text should be read for key information and central ___.', 'statements']
      ]
    },
    literature: {
      leicht: [
        ['In a story, the main person is the main ___.', 'character'],
        ['A conflict in a text is usually a central ___.', 'problem']
      ],
      mittel: [
        ['When analysing a text, should you mention text evidence? yes or no', 'yes'],
        ['A narrator can describe events from a certain ___.', 'perspective']
      ],
      schwer: [
        ['A theme is the central __ of a text.', 'idea'],
        ['When comparing two characters, you should mention similarities and ___.', 'differences']
      ]
    },
    language_in_use: {
      leicht: [
        ['If it rains, we ___ at home. (stay)', 'will stay'],
        ['He has lived here ___ five years. (since / for)', 'for']
      ],
      mittel: [
        ['If I ___ more time, I would read more. (have)', 'had'],
        ['He speaks English ___ than before. (good)', 'better']
      ],
      schwer: [
        ['If they had studied more, they ___ the test. (pass)', 'would have passed'],
        ['Neither of the answers ___ correct. (be)', 'is']
      ]
    },
    writing: {
      leicht: [
        ['A good email needs a greeting and a clear ___.', 'ending'],
        ['Which is more suitable in a school email: "Hi dude" or "Hello Ms Brown"?', 'Hello Ms Brown']
      ],
      mittel: [
        ['When summarising, should you include every tiny detail or the main points?', 'the main points'],
        ['A good argument needs a reason and often an ___.', 'example']
      ],
      schwer: [
        ['When writing for mediation, should the result fit the reader and situation? yes or no', 'yes'],
        ['A well-structured text usually has an introduction, a main part and a ___.', 'conclusion']
      ]
    }
  };

  if (tasksByTopic[thema]) {
    return pickExpandedTask_(tasksByTopic[thema][difficulty], 'englisch::' + klasse + '::' + thema + '::' + difficulty, 20);
  }

  throw new Error('Unbekanntes Englisch-Thema: ' + thema);
}

function createChemistryTask(thema, klasse) {
  const difficulty = getDifficultyLevel(klasse);

  if (thema === 'stoffe') {
    const tasks = {
      leicht: [
        { frage: 'Welcher Stoff ist ein Metall?', loesung: 'Eisen' },
        { frage: 'Welcher Stoff ist bei Raumtemperatur fluessig?', loesung: 'Wasser' },
        { frage: 'Welcher Stoff ist gasfoermig?', loesung: 'Sauerstoff' }
      ],
      mittel: [
        { frage: 'Nenne einen Stoff, der Strom gut leitet.', loesung: 'Kupfer' },
        { frage: 'Welcher Stoff loest sich gut in Wasser: Salz oder Sand?', loesung: 'Salz' },
        { frage: 'Wie nennt man Stoffe mit festen Schmelzpunkten und typischen Eigenschaften?', loesung: 'Reinstoffe' }
      ],
      schwer: [
        { frage: 'Wie nennt man Stoffe, die aus mehreren Reinstoffen bestehen?', loesung: 'Gemische' },
        { frage: 'Welcher Stoff ist für seine Reaktion mit Sauerstoff bei Rost bekannt?', loesung: 'Eisen' },
        { frage: 'Wie nennt man die kleinsten Teilchen eines Elements?', loesung: 'Atome' }
      ]
    };
    return pickExpandedTask_(tasks[difficulty], 'chemie::' + klasse + '::stoffe::' + difficulty, 20);
  }

  if (thema === 'trennverfahren') {
    const tasks = {
      leicht: [
        { frage: 'Wie trennt man Sand und Wasser?', loesung: 'Filtrieren' },
        { frage: 'Wie nennt man das Trennen von Salzloesung durch Verdampfen des Wassers?', loesung: 'Eindampfen' },
        { frage: 'Wie trennt man unterschiedlich große Feststoffe mit einem Sieb?', loesung: 'Sieben' }
      ],
      mittel: [
        { frage: 'Wie trennt man ein Gemisch aus Alkohol und Wasser mit unterschiedlichen Siedepunkten?', loesung: 'Destillieren' },
        { frage: 'Welches Trennverfahren passt zu Eisen und Schwefel mit Magnet?', loesung: 'Magnettrennung' },
        { frage: 'Wie nennt man das Absetzenlassen von Feststoffen in einer Fluessigkeit?', loesung: 'Sedimentieren' }
      ],
      schwer: [
        { frage: 'Welches Verfahren passt, wenn man Farbstoffe auf Papier trennt?', loesung: 'Chromatografie' },
        { frage: 'Wie nennt man das vorsichtige Abgiessen einer Fluessigkeit vom Bodensatz?', loesung: 'Dekantieren' },
        { frage: 'Wie trennt man ein Gemisch aufgrund unterschiedlicher Loeslichkeiten?', loesung: 'Extrahieren' }
      ]
    };
    return pickExpandedTask_(tasks[difficulty], 'chemie::' + klasse + '::trennverfahren::' + difficulty, 20);
  }

  if (thema === 'atommodell') {
    const tasks = {
      leicht: [
        { frage: 'Wie heisst der Kernbaustein mit positiver Ladung?', loesung: 'Proton' },
        { frage: 'Wie heisst das negativ geladene Teilchen?', loesung: 'Elektron' },
        { frage: 'Wo befinden sich Protonen und Neutronen?', loesung: 'Im Atomkern' }
      ],
      mittel: [
        { frage: 'Welches Teilchen im Kern ist ungeladen?', loesung: 'Neutron' },
        { frage: 'Wie viele Elektronen hat ein neutrales Atom im Vergleich zu Protonen?', loesung: 'Gleich viele' },
        { frage: 'Wie nennt man die Schalen, auf denen sich Elektronen befinden?', loesung: 'Elektronenschalen' }
      ],
      schwer: [
        { frage: 'Wie nennt man Atome desselben Elements mit unterschiedlicher Neutronenzahl?', loesung: 'Isotope' },
        { frage: 'Was bestimmt die Ordnungszahl eines Elements?', loesung: 'Die Protonenzahl' },
        { frage: 'Wie nennt man geladene Atome oder Molekuele?', loesung: 'Ionen' }
      ]
    };
    return pickExpandedTask_(tasks[difficulty], 'chemie::' + klasse + '::atommodell::' + difficulty, 20);
  }

  throw new Error('Unbekanntes Chemie-Thema: ' + thema);
}

function createHistoryTask(thema, klasse) {
  const difficulty = getDifficultyLevel(klasse);
  const tasksByTopic = {
    aegypten: {
      leicht: [
        { frage: 'An welchem Fluss entstand die Hochkultur Ägyptens?', loesung: 'Nil' },
        { frage: 'Wie nennt man die Herrscher im alten Ägypten?', loesung: 'Pharaonen' }
      ],
      mittel: [
        { frage: 'Warum war der Nil für Ägypten besonders wichtig?', loesung: 'Wegen Wasser und fruchtbaren Böden' },
        { frage: 'Wie nennt man Bilderzeichen der Ägypter?', loesung: 'Hieroglyphen' }
      ],
      schwer: [
        { frage: 'Wie nennt man eine frühe staatlich organisierte Gesellschaft wie Ägypten?', loesung: 'Hochkultur' },
        { frage: 'Welche Gebäudeform ist typisch für die Gräber vieler Pharaonen?', loesung: 'Pyramide' }
      ]
    },
    rom: {
      leicht: [
        { frage: 'Wie hiess die Stadt am Tiber?', loesung: 'Rom' },
        { frage: 'Wie nennt man die Herrschaftsform, in der Bürger mitentscheiden können?', loesung: 'Republik' }
      ],
      mittel: [
        { frage: 'Wie hiess das Amphitheater in Rom?', loesung: 'Kolosseum' },
        { frage: 'Wie nennt man die römischen Wasserleitungen?', loesung: 'Aquaedukte' }
      ],
      schwer: [
        { frage: 'Welches große Reich beherrschte viele Gebiete in Europa rund um das Mittelmeer?', loesung: 'Römisches Reich' },
        { frage: 'Welche Sprache sprachen die Römer?', loesung: 'Latein' }
      ]
    },
    mittelalter: {
      leicht: [
        { frage: 'Wie nannte man bewaffnete Reiter im Mittelalter?', loesung: 'Ritter' },
        { frage: 'Wie hiess die Gesellschaftsordnung mit Adel, Klerus und Bauern?', loesung: 'Staendegesellschaft' }
      ],
      mittel: [
        { frage: 'Wie nennt man das Lehenssystem zwischen Koenig und Adeligen?', loesung: 'Feudalismus' },
        { frage: 'Wie hiess der Stand der Geistlichen?', loesung: 'Klerus' }
      ],
      schwer: [
        { frage: 'Welche Lebensform beschreibt die Regel "Bete und arbeite"?', loesung: 'Klosterleben' },
        { frage: 'Wie nennt man die Zeit zwischen Antike und Neuzeit?', loesung: 'Mittelalter' }
      ]
    },
    stadt_buerger: {
      leicht: [
        { frage: 'Wie nennt man Zusammenschluesse von Handwerkern in Städten?', loesung: 'Zuenfte' },
        { frage: 'Wer lebte im Mittelalter oft innerhalb von Stadtmauern: Bauern oder Bürger?', loesung: 'Bürger' }
      ],
      mittel: [
        { frage: 'Wie nennt man den regelmaessigen Warenhandel an einem Ort?', loesung: 'Markt' },
        { frage: 'Warum wurden Städte für viele Menschen attraktiver?', loesung: 'Wegen Handel und Freiheiten' }
      ],
      schwer: [
        { frage: 'Wie nennt man eine Stadt, die dem Landesherrn nur teilweise unterstand und eigene Rechte hatte?', loesung: 'Freie Stadt' },
        { frage: 'Welcher gesellschaftliche Wandel setzte mit städtischem Leben und Handel stärker ein?', loesung: 'Mehr bürgerliche Freiheit' }
      ]
    },
    religionen_handel: {
      leicht: [
        { frage: 'Welche drei Religionen spielten im Mittelalter im Mittelmeerraum eine große Rolle?', loesung: 'Christentum Judentum Islam' },
        { frage: 'Wie nennt man Handel über weite Entfernungen?', loesung: 'Fernhandel' }
      ],
      mittel: [
        { frage: 'Wie nennt man friedliches Nebeneinander verschiedener Religionen?', loesung: 'Koexistenz' },
        { frage: 'Wie nennt man einen wichtigen Handelsverbund norddeutscher Städte?', loesung: 'Hanse' }
      ],
      schwer: [
        { frage: 'Was foerderte der Fernhandel zwischen verschiedenen Kulturraeumen besonders?', loesung: 'Austausch von Waren und Ideen' },
        { frage: 'Wie nennt man Auseinandersetzungen zwischen Religionen oder Gruppen?', loesung: 'Konflikte' }
      ]
    },
    epochenwende: {
      leicht: [
        { frage: 'Wie nennt man die kulturelle Erneuerungsbewegung um 1500?', loesung: 'Renaissance' },
        { frage: 'Wie hiess der Reformator Martin ___?', loesung: 'Luther' }
      ],
      mittel: [
        { frage: 'Wer erfand den Buchdruck mit beweglichen Lettern?', loesung: 'Gutenberg' },
        { frage: 'Wie nennt man die kirchliche Erneuerungsbewegung um Martin Luther?', loesung: 'Reformation' }
      ],
      schwer: [
        { frage: 'Wie nennt man die Zeit des Übergangs vom Mittelalter zur Neuzeit?', loesung: 'Epochenwende' },
        { frage: 'Was wurde durch den Buchdruck deutlich leichter verbreitet?', loesung: 'Wissen' }
      ]
    },
    weimar: {
      leicht: [
        { frage: 'Wie hiess die erste deutsche Demokratie nach dem Ersten Weltkrieg?', loesung: 'Weimarer Republik' },
        { frage: 'Welche Staatsform hatte Deutschland in der Weimarer Republik?', loesung: 'Demokratie' }
      ],
      mittel: [
        { frage: 'Wie nennt man den Zusammenbruch der Boerse 1929 mit weltweiten Folgen?', loesung: 'Weltwirtschaftskrise' },
        { frage: 'Warum geriet die Weimarer Republik politisch unter Druck?', loesung: 'Wegen Krisen und Extremismus' }
      ],
      schwer: [
        { frage: 'Wie nennt man eine demokratische Staatsordnung mit Verfassung und Parlament?', loesung: 'Republik' },
        { frage: 'Welche Gefahr bedrohte die Demokratie der Weimarer Republik von links und rechts?', loesung: 'Extremismus' }
      ]
    },
    nationalsozialismus: {
      leicht: [
        { frage: 'Wie hiess die Diktatur in Deutschland von 1933 bis 1945?', loesung: 'Nationalsozialismus' },
        { frage: 'Wie nennt man eine Herrschaft ohne freie Wahlen und ohne Opposition?', loesung: 'Diktatur' }
      ],
      mittel: [
        { frage: 'Wie nennt man die Verfolgung und Ermordung der europaeischen Juden?', loesung: 'Holocaust' },
        { frage: 'Wie heisst gezielte politische Beeinflussung durch Medien und Botschaften?', loesung: 'Propaganda' }
      ],
      schwer: [
        { frage: 'Wie hiess das Führerprinzip der NS-Herrschaft mit Adolf Hitler an der Spitze?', loesung: 'Führerdiktatur' },
        { frage: 'Welche Grundwerte wurden im Nationalsozialismus systematisch verletzt?', loesung: 'Menschenrechte' }
      ]
    },
    kalter_krieg: {
      leicht: [
        { frage: 'Wie hiessen die beiden deutschen Staaten nach 1949?', loesung: 'BRD und DDR' },
        { frage: 'Wie nennt man den Konflikt zwischen USA und UdSSR ohne direkten großen Krieg?', loesung: 'Kalter Krieg' }
      ],
      mittel: [
        { frage: 'Welche Mauer trennte Berlin lange Zeit?', loesung: 'Berliner Mauer' },
        { frage: 'Wie nennt man die politische und militaerische Spannung zwischen Ost und West?', loesung: 'Systemkonflikt' }
      ],
      schwer: [
        { frage: 'Wie nennt man die friedliche Oeffnung der innerdeutschen Grenze 1989 als Symbol des Umbruchs?', loesung: 'Mauerfall' },
        { frage: 'In welchem Staat lebten Jugendliche unter sozialistischer Herrschaft: BRD oder DDR?', loesung: 'DDR' }
      ]
    }
  };

  if (tasksByTopic[thema]) {
    return pickExpandedTask_(tasksByTopic[thema][difficulty], 'geschichte::' + klasse + '::' + thema + '::' + difficulty, 20);
  }

  throw new Error('Unbekanntes Geschichte-Thema: ' + thema);
}

function createPhysicsTask(thema, klasse) {
  const difficulty = getDifficultyLevel(klasse);

  if (thema === 'bewegung') {
    const tasks = {
      leicht: [
        { frage: 'Wie nennt man die Strecke, die ein Körper in einer bestimmten Zeit zurücklegt?', loesung: 'Weg' },
        { frage: 'Wie nennt man, wie schnell sich etwas bewegt?', loesung: 'Geschwindigkeit' },
        { frage: 'Was zeigt ein Tacho an?', loesung: 'Geschwindigkeit' }
      ],
      mittel: [
        { frage: 'Wie lautet die Einheit der Geschwindigkeit im Alltag?', loesung: 'km/h' },
        { frage: 'Wie nennt man eine Veränderung der Geschwindigkeit?', loesung: 'Beschleunigung' },
        { frage: 'Bewegt sich ein Körper gleichförmig, wenn seine Geschwindigkeit immer gleich bleibt?', loesung: 'Ja' }
      ],
      schwer: [
        { frage: 'Welche Groesse berechnet man mit Weg durch Zeit?', loesung: 'Geschwindigkeit' },
        { frage: 'Wie nennt man die Bewegung mit ständiger Geschwindigkeitszunahme?', loesung: 'Beschleunigte Bewegung' },
        { frage: 'Welche Einheit ist in der Physik für Geschwindigkeit gebräuchlich?', loesung: 'm/s' }
      ]
    };
    return pickExpandedTask_(tasks[difficulty], 'physik::' + klasse + '::bewegung::' + difficulty, 20);
  }

  if (thema === 'kraft') {
    const tasks = {
      leicht: [
        { frage: 'Wie nennt man in der Physik Ziehen oder Druecken?', loesung: 'Kraft' },
        { frage: 'Welche Kraft zieht Gegenstaende zur Erde?', loesung: 'Gewichtskraft' },
        { frage: 'Mit welchem Geraet misst man Kraefte?', loesung: 'Federkraftmesser' }
      ],
      mittel: [
        { frage: 'Wie heisst die Einheit der Kraft?', loesung: 'Newton' },
        { frage: 'Welche Kraft bremst Bewegungen auf Oberflaechen?', loesung: 'Reibungskraft' },
        { frage: 'Wie nennt man die Kraft in einer gespannten Feder?', loesung: 'Federkraft' }
      ],
      schwer: [
        { frage: 'Wie nennt man Kraefte, die sich gegenseitig aufheben?', loesung: 'Kraeftegleichgewicht' },
        { frage: 'Was passiert mit einem Körper, wenn die wirkende Kraft größer wird?', loesung: 'Er beschleunigt stärker' },
        { frage: 'Welche Kraft wirkt zwischen Magneten?', loesung: 'Magnetische Kraft' }
      ]
    };
    return pickExpandedTask_(tasks[difficulty], 'physik::' + klasse + '::kraft::' + difficulty, 20);
  }

  if (thema === 'strom') {
    const tasks = {
      leicht: [
        { frage: 'Wie nennt man den Fluss elektrischer Ladung?', loesung: 'Strom' },
        { frage: 'Welches Bauteil liefert oft elektrische Energie in einfachen Stromkreisen?', loesung: 'Batterie' },
        { frage: 'Was braucht eine Lampe, damit sie im Stromkreis leuchtet?', loesung: 'Einen geschlossenen Stromkreis' }
      ],
      mittel: [
        { frage: 'Wie nennt man Stoffe, die Strom gut leiten?', loesung: 'Leiter' },
        { frage: 'Wie nennt man Stoffe, die Strom kaum leiten?', loesung: 'Isolatoren' },
        { frage: 'Welches Messgeraet nutzt man für die Stromstaerke?', loesung: 'Amperemeter' }
      ],
      schwer: [
        { frage: 'Wie heisst die Einheit der elektrischen Spannung?', loesung: 'Volt' },
        { frage: 'Wie nennt man eine Reihenschaltung mit zwei Lampen hintereinander?', loesung: 'Reihenschaltung' },
        { frage: 'Wie nennt man eine Schaltung, bei der jede Lampe einen eigenen Zweig hat?', loesung: 'Parallelschaltung' }
      ]
    };
    return pickExpandedTask_(tasks[difficulty], 'physik::' + klasse + '::strom::' + difficulty, 20);
  }

  throw new Error('Unbekanntes Physik-Thema: ' + thema);
}

function createAdditionTask(klasse) {
  const range = getMathRange(klasse);
  const templates = [
    function() {
      const a = randInt(range.min, range.max);
      const b = randInt(range.min, range.max);
      return { frage: 'Berechne: ' + a + ' + ' + b, loesung: String(a + b) };
    },
    function() {
      const a = randInt(range.min, range.max);
      const b = randInt(range.min, range.max);
      const c = klasse >= 7 ? randInt(range.min, range.max) : randInt(1, 20);
      return { frage: 'Berechne: ' + a + ' + ' + b + ' + ' + c, loesung: String(a + b + c) };
    },
    function() {
      const a = randInt(range.min, range.max);
      const b = randInt(10, klasse >= 8 ? 200 : 50);
      return { frage: 'Im Regal stehen ' + a + ' Buecher. ' + b + ' kommen dazu. Wie viele sind es insgesamt?', loesung: String(a + b) };
    }
  ];
  return pick(templates)();
}

function createSubtractionTask(klasse) {
  const range = getMathRange(klasse);
  const templates = [
    function() {
      const a = randInt(range.min + 10, range.max + 20);
      const b = randInt(range.min, a);
      return { frage: 'Berechne: ' + a + ' - ' + b, loesung: String(a - b) };
    },
    function() {
      const a = randInt(range.min + 20, range.max + 40);
      const b = randInt(range.min, Math.max(range.min + 1, Math.floor(a / 2)));
      const c = randInt(1, klasse >= 7 ? 30 : 10);
      return { frage: 'Berechne schrittweise: ' + a + ' - ' + b + ' - ' + c, loesung: String(a - b - c) };
    },
    function() {
      const start = randInt(range.min + 30, range.max + 60);
      const sold = randInt(5, Math.max(10, Math.floor(start / 2)));
      return { frage: 'Ein Kino hatte ' + start + ' Karten. ' + sold + ' wurden verkauft. Wie viele bleiben uebrig?', loesung: String(start - sold) };
    }
  ];
  return pick(templates)();
}

function createMultiplicationTask(klasse) {
  const max = klasse <= 6 ? 12 : (klasse <= 8 ? 25 : 60);
  const templates = [
    function() {
      const a = randInt(2, max);
      const b = randInt(2, max);
      return { frage: 'Berechne: ' + a + ' x ' + b, loesung: String(a * b) };
    },
    function() {
      const a = randInt(2, max);
      const b = randInt(10, klasse >= 8 ? 40 : 20);
      return { frage: 'Berechne: ' + a + ' x ' + b, loesung: String(a * b) };
    },
    function() {
      const rows = randInt(3, klasse >= 8 ? 18 : 10);
      const seats = randInt(4, klasse >= 8 ? 24 : 12);
      return { frage: 'Ein Saal hat ' + rows + ' Reihen mit je ' + seats + ' Plaetzen. Wie viele Plaetze gibt es?', loesung: String(rows * seats) };
    }
  ];
  return pick(templates)();
}

function createDivisionTask(klasse) {
  const max = klasse <= 6 ? 12 : (klasse <= 8 ? 25 : 60);
  const templates = [
    function() {
      const divisor = randInt(2, max);
      const result = randInt(2, max);
      const dividend = divisor * result;
      return { frage: 'Berechne: ' + dividend + ' : ' + divisor, loesung: String(result) };
    },
    function() {
      const divisor = randInt(2, max);
      const result = randInt(2, Math.max(4, Math.floor(max / 2)));
      const dividend = divisor * result;
      return { frage: 'Verteile ' + dividend + ' Murmeln gleichmaessig auf ' + divisor + ' Kinder. Wie viele bekommt jedes Kind?', loesung: String(result) };
    },
    function() {
      const divisor = randInt(2, max);
      const result = randInt(2, max);
      const dividend = divisor * result;
      return { frage: 'Berechne: (' + dividend + ' : ' + divisor + ')', loesung: String(result) };
    }
  ];
  return pick(templates)();
}

function createFractionTask(klasse) {
  const maxDenominator = klasse <= 6 ? 6 : (klasse <= 8 ? 10 : 14);
  const templates = [
    function() {
      const z1 = randInt(1, maxDenominator);
      const n1 = randInt(2, maxDenominator);
      const z2 = randInt(1, maxDenominator);
      const n2 = randInt(2, maxDenominator);
      const numerator = z1 * n2 + z2 * n1;
      const denominator = n1 * n2;
      return createReducedFractionTask('Berechne: ' + z1 + '/' + n1 + ' + ' + z2 + '/' + n2, numerator, denominator);
    },
    function() {
      const denominator = randInt(2, maxDenominator);
      const z1 = randInt(1, denominator - 1);
      const z2 = randInt(1, denominator - 1);
      return createReducedFractionTask('Berechne: ' + z1 + '/' + denominator + ' + ' + z2 + '/' + denominator, z1 + z2, denominator);
    },
    function() {
      const z1 = randInt(1, maxDenominator - 1);
      const n1 = randInt(z1 + 1, maxDenominator + 2);
      const whole = randInt(1, klasse >= 8 ? 4 : 2);
      return createReducedFractionTask('Berechne: ' + whole + ' + ' + z1 + '/' + n1, whole * n1 + z1, n1);
    }
  ];
  return pick(templates)();
}

function createReducedFractionTask(question, numerator, denominator) {
  const gcd = greatestCommonDivisor(numerator, denominator);
  const reducedNumerator = numerator / gcd;
  const reducedDenominator = denominator / gcd;
  return {
    frage: question,
    loesung: reducedDenominator === 1 ? String(reducedNumerator) : reducedNumerator + '/' + reducedDenominator
  };
}
