function createTextileTask(thema, klasse) {
  const difficulty = getDifficultyLevel(klasse);
  const tasksByTopic = {
    materialien: {
      leicht: [
        createChoiceTask('Welche Faser ist pflanzlich?', ['Baumwolle', 'Polyester', 'Acryl'], 'Baumwolle'),
        createChoiceTask('Womit misst man Stoffe beim Zuschneiden besonders genau?', ['Massband', 'Pinsel', 'Kamm'], 'Massband'),
        createChoiceTask('Welches Werkzeug schneidet Stoff?', ['Stoffschere', 'Lineal', 'Klebestift'], 'Stoffschere')
      ],
      mittel: [
        createChoiceTask('Welche Eigenschaft passt gut zu Baumwolle?', ['saugfaehig', 'wasserdicht', 'metallisch'], 'saugfaehig'),
        createChoiceTask('Welches Material ist eine Kunstfaser?', ['Polyester', 'Leinen', 'Wolle'], 'Polyester'),
        createChoiceTask('Warum sollte man Stoff vor dem Verarbeiten genau prüfen?', ['Wegen Struktur und Dehnbarkeit', 'Nur wegen der Farbe', 'Das ist unwichtig'], 'Wegen Struktur und Dehnbarkeit')
      ],
      schwer: [
        createChoiceTask('Welche Materialeigenschaft ist für Sportkleidung besonders wichtig?', ['atmungsaktiv', 'sproede', 'schwer'], 'atmungsaktiv'),
        createChoiceTask('Warum werden Mischgewebe eingesetzt?', ['Um Eigenschaften zu kombinieren', 'Nur um Stoff schwerer zu machen', 'Nur für Muster'], 'Um Eigenschaften zu kombinieren'),
        createChoiceTask('Welcher Begriff beschreibt die Herstellung von Flaechen aus Fasern?', ['Textiltechnik', 'Verdampfung', 'Legierung'], 'Textiltechnik')
      ]
    },
    muster_farben: {
      leicht: [
        createChoiceTask('Wie nennt man die Wiederholung gleicher Formen auf Stoff?', ['Muster', 'Naht', 'Saum'], 'Muster'),
        createChoiceTask('Welche Farben nennt man warm?', ['Rot und Orange', 'Blau und Gruen', 'Schwarz und Grau'], 'Rot und Orange'),
        createChoiceTask('Ein Karomuster besteht oft aus ...', ['Linien', 'Punkten nur', 'nur Kreisen'], 'Linien')
      ],
      mittel: [
        createChoiceTask('Wie nennt man einen starken Unterschied zwischen hell und dunkel?', ['Kontrast', 'Saumzugabe', 'Masche'], 'Kontrast'),
        createChoiceTask('Welches Muster wirkt oft regelmaessig und geordnet?', ['Streifen', 'Zerknitterung', 'Fleck'], 'Streifen'),
        createChoiceTask('Warum ist Farbwahl bei Kleidung wichtig?', ['Sie beeinflusst die Wirkung', 'Sie verhindert jede Naht', 'Sie ersetzt Material'], 'Sie beeinflusst die Wirkung')
      ],
      schwer: [
        createChoiceTask('Welche Gestaltung wirkt oft ruhig und klar?', ['wenige Farben und klare Formen', 'möglichst alles gleichzeitig', 'nur zufaellige Linien'], 'wenige Farben und klare Formen'),
        createChoiceTask('Wozu dienen Moodboards in der Gestaltung?', ['Zur Ideenplanung', 'Zum Stoffwaschen', 'Zum Messen'], 'Zur Ideenplanung'),
        createChoiceTask('Welche Wirkung haben Komplementaerfarben oft?', ['starker Spannungs- und Kontrasteffekt', 'sie wirken immer unsichtbar', 'sie loesen Naehte'], 'starker Spannungs- und Kontrasteffekt')
      ]
    },
    kleidung_alltag: {
      leicht: [
        createChoiceTask('Welche Funktion hat eine Regenjacke vor allem?', ['Schutz vor Naesse', 'Schmuck', 'Musik'], 'Schutz vor Naesse'),
        createChoiceTask('Welche Kleidung passt am besten zum Sport?', ['bequeme Funktionskleidung', 'Wintermantel aus Wolle', 'Schlafanzug'], 'bequeme Funktionskleidung'),
        createChoiceTask('Warum brauchen Kleider Etiketten?', ['Damit man Pflegehinweise lesen kann', 'Nur zur Dekoration', 'Damit sie schwerer werden'], 'Damit man Pflegehinweise lesen kann')
      ],
      mittel: [
        createChoiceTask('Was bedeutet ein bewusster Kleiderkauf?', ['Funktion, Qualitaet und Bedarf prüfen', 'immer das billigste nehmen', 'nur nach Werbung kaufen'], 'Funktion, Qualitaet und Bedarf prüfen'),
        createChoiceTask('Welche Kleidung ist für einen Werkraum sinnvoll?', ['robuste und sichere Kleidung', 'offene Hausschuhe', 'ein Schal in der Maschine'], 'robuste und sichere Kleidung'),
        createChoiceTask('Warum ist Pflege für Kleidung wichtig?', ['Sie verlaengert die Nutzungsdauer', 'Sie macht Kleidung automatisch modern', 'Sie ersetzt Reparaturen immer komplett'], 'Sie verlaengert die Nutzungsdauer')
      ],
      schwer: [
        createChoiceTask('Was bedeutet funktionale Kleidung?', ['Sie ist an einen Zweck angepasst', 'Sie ist immer bunt', 'Sie besteht nur aus Baumwolle'], 'Sie ist an einen Zweck angepasst'),
        createChoiceTask('Welche Entscheidung ist nachhaltig?', ['Kleidung reparieren und weiter nutzen', 'nach einmaligem Tragen wegwerfen', 'nur Trends verfolgen'], 'Kleidung reparieren und weiter nutzen'),
        createChoiceTask('Was zeigt Kleidung oft auch?', ['soziale Rollen und Identitaet', 'nur die Schuhgroesse', 'immer nur das Wetter'], 'soziale Rollen und Identitaet')
      ]
    },
    design_mode: {
      leicht: [
        createChoiceTask('Wie nennt man einen geplanten Entwurf für ein Kleidungsstueck?', ['Design', 'Legende', 'Diagramm'], 'Design'),
        createChoiceTask('Mode kann eine Person nach aussen ...', ['darstellen', 'verstecken als Zahl', 'wiegen'], 'darstellen'),
        createChoiceTask('Was ist typisch für eine Kollektion?', ['mehrere zusammenpassende Entwuerfe', 'nur ein Stoffrest', 'nur Werkzeuge'], 'mehrere zusammenpassende Entwuerfe')
      ],
      mittel: [
        createChoiceTask('Warum spielen Trends in der Mode eine Rolle?', ['Sie beeinflussen Kaufentscheidungen', 'Sie ersetzen Materialkunde', 'Sie machen Pflege unnoetig'], 'Sie beeinflussen Kaufentscheidungen'),
        createChoiceTask('Welche Aussage passt zu Modekritik?', ['Gestaltung und Wirkung werden beurteilt', 'Nur Preise werden aufgeschrieben', 'Naehmaschinen werden ignoriert'], 'Gestaltung und Wirkung werden beurteilt'),
        createChoiceTask('Wofür steht ein Logo auf Kleidung oft?', ['Marke und Wiedererkennung', 'Pflegeanleitung', 'Schnittmuster'], 'Marke und Wiedererkennung')
      ],
      schwer: [
        createChoiceTask('Welche Wirkung kann Kleidung haben?', ['Sie kann Zugehoerigkeit oder Abgrenzung zeigen', 'Sie hat nie Wirkung', 'Sie ersetzt Sprache immer'], 'Sie kann Zugehoerigkeit oder Abgrenzung zeigen'),
        createChoiceTask('Warum ist Zielgruppenorientierung in der Mode wichtig?', ['Entwuerfe sollen zu Nutzern passen', 'Damit Stoffe schneller reissen', 'Weil Farben dann egal sind'], 'Entwuerfe sollen zu Nutzern passen'),
        createChoiceTask('Welche Phase gehoert zum Designprozess?', ['Idee, Entwurf, Überarbeitung', 'nur Verkauf', 'nur Waschen'], 'Idee, Entwurf, Überarbeitung')
      ]
    },
    produktion: {
      leicht: [
        createChoiceTask('Wie nennt man den Weg vom Rohstoff bis zum Kleidungsstueck?', ['Produktion', 'Pause', 'Skizze'], 'Produktion'),
        createChoiceTask('Was passiert beim Zuschneiden?', ['Stoffteile werden passend vorbereitet', 'Farbe wird gewaehlt', 'Musik wird gemessen'], 'Stoffteile werden passend vorbereitet'),
        createChoiceTask('Was verbindet Stoffteile dauerhaft?', ['Naht', 'Radiergummi', 'Pinsel'], 'Naht')
      ],
      mittel: [
        createChoiceTask('Warum ist Qualitaetskontrolle wichtig?', ['Fehler sollen früh erkannt werden', 'Damit Kleidung schwerer wird', 'Damit Muster verschwinden'], 'Fehler sollen früh erkannt werden'),
        createChoiceTask('Welcher Schritt kommt vor dem Naehen?', ['Planen und Zuschneiden', 'Verkaufen', 'Recyceln'], 'Planen und Zuschneiden'),
        createChoiceTask('Was ist ein Rohstoff für Textilien?', ['Baumwolle', 'Kreide', 'Glas'], 'Baumwolle')
      ],
      schwer: [
        createChoiceTask('Warum beeinflusst die Produktionskette den Preis?', ['Weil viele Arbeitsschritte bezahlt werden muessen', 'Nur wegen der Farbe', 'Nur wegen Etiketten'], 'Weil viele Arbeitsschritte bezahlt werden muessen'),
        createChoiceTask('Was bedeutet industrielle Fertigung?', ['Herstellung mit Maschinen in großer Zahl', 'Handnaht zu Hause', 'nur ein Einzelstueck'], 'Herstellung mit Maschinen in großer Zahl'),
        createChoiceTask('Welche Frage gehoert zur Produktionskritik?', ['Unter welchen Bedingungen wurde hergestellt?', 'Welche Musik lief im Laden?', 'Wie viele Selfies gab es?'], 'Unter welchen Bedingungen wurde hergestellt?')
      ]
    },
    nachhaltigkeit_textil: {
      leicht: [
        createChoiceTask('Was bedeutet nachhaltig bei Kleidung?', ['Ressourcen und Menschen beruecksichtigen', 'nur möglichst billig', 'nur modisch'], 'Ressourcen und Menschen beruecksichtigen'),
        createChoiceTask('Was ist besser für die Umwelt?', ['reparieren statt wegwerfen', 'sofort neu kaufen', 'ungeprüft entsorgen'], 'reparieren statt wegwerfen'),
        createChoiceTask('Secondhand bedeutet ...', ['gebraucht weiterverkauft', 'frisch produziert', 'nie getragen und vernichtet'], 'gebraucht weiterverkauft')
      ],
      mittel: [
        createChoiceTask('Warum ist Fast Fashion problematisch?', ['wegen kurzer Nutzungsdauer und hohem Verbrauch', 'weil Stoffe immer besser werden', 'weil Pflege wegfaellt'], 'wegen kurzer Nutzungsdauer und hohem Verbrauch'),
        createChoiceTask('Was hilft bei bewussten Kaufentscheidungen?', ['Qualitaet und Herkunft prüfen', 'nur Werbung glauben', 'nur Trends folgen'], 'Qualitaet und Herkunft prüfen'),
        createChoiceTask('Welcher Begriff passt zu fairen Arbeitsbedingungen?', ['soziale Verantwortung', 'Beliebigkeit', 'Massenkauf'], 'soziale Verantwortung')
      ],
      schwer: [
        createChoiceTask('Welche Strategie ist besonders nachhaltig?', ['langlebige Produkte nutzen und pflegen', 'möglichst oft austauschen', 'ungefragt entsorgen'], 'langlebige Produkte nutzen und pflegen'),
        createChoiceTask('Warum spielt Recycling in der Textilbranche eine Rolle?', ['Materialien können erneut genutzt werden', 'damit Naehte verschwinden', 'damit Farben immer gleich bleiben'], 'Materialien können erneut genutzt werden'),
        createChoiceTask('Welche Frage gehoert zu verantwortlichem Konsum?', ['Brauche ich das Produkt wirklich?', 'Ist die Werbung laut genug?', 'Gibt es mehr Verpackung?'], 'Brauche ich das Produkt wirklich?')
      ]
    },
    textiltechnik: {
      leicht: [
        createChoiceTask('Wie nennt man ineinander verschlungene Schlaufen bei Strickware?', ['Maschen', 'Nieten', 'Riegel'], 'Maschen'),
        createChoiceTask('Welches Produkt ist oft gestrickt?', ['Pullover', 'Fensterscheibe', 'Lineal'], 'Pullover'),
        createChoiceTask('Warum ist Stoffpruefung wichtig?', ['Damit Material passend eingesetzt wird', 'Nur für das Etikett', 'Sie ist überflüssig'], 'Damit Material passend eingesetzt wird')
      ],
      mittel: [
        createChoiceTask('Was beeinflusst die Funktion eines Textils stark?', ['Faserart und Verarbeitung', 'nur die Marke', 'nur die Werbung'], 'Faserart und Verarbeitung'),
        createChoiceTask('Welcher Begriff passt zum technisch geplanten Aufbau eines Stoffes?', ['Materialstruktur', 'Wetterbericht', 'Stundenplan'], 'Materialstruktur'),
        createChoiceTask('Warum braucht Arbeitskleidung oft Spezialtextilien?', ['Wegen Schutzfunktionen', 'Nur wegen Logos', 'Damit sie schwerer ist'], 'Wegen Schutzfunktionen')
      ],
      schwer: [
        createChoiceTask('Funktionsmembranen dienen oft ...', ['dem Schutz vor Wind und Naesse', 'dem Faerben von Stoff', 'dem Bedrucken von Papier'], 'dem Schutz vor Wind und Naesse'),
        createChoiceTask('Welche Verbindung von Technik und Textil ist typisch?', ['Materialentwicklung für besondere Einsaetze', 'nur Modemagazine lesen', 'nur Schaufenster dekorieren'], 'Materialentwicklung für besondere Einsaetze'),
        createChoiceTask('Warum werden Produkte analysiert?', ['Um Aufbau, Funktion und Qualitaet zu verstehen', 'nur um Farben zu zaehlen', 'damit keine Pflegehinweise noetig sind'], 'Um Aufbau, Funktion und Qualitaet zu verstehen')
      ]
    },
    mode_wirkung: {
      leicht: [
        createChoiceTask('Kleidung kann zeigen, zu welcher Gruppe man sich zugehoerig fuehlt. Das nennt man ...', ['Wirkung', 'Verdunstung', 'Faserbruch'], 'Wirkung'),
        createChoiceTask('Mode aendert sich oft durch ...', ['Trends', 'Lineale', 'Heftklammern'], 'Trends'),
        createChoiceTask('Welche Aussage passt?', ['Kleidung kann Botschaften senden', 'Kleidung hat nie Bedeutung', 'Kleidung ist nur Zufall'], 'Kleidung kann Botschaften senden')
      ],
      mittel: [
        createChoiceTask('Warum wird Mode oft mit Identitaet verbunden?', ['Weil Menschen sich über Kleidung ausdruecken', 'Weil Stoffe rechnen können', 'Weil Farben immer gleich sind'], 'Weil Menschen sich über Kleidung ausdruecken'),
        createChoiceTask('Welche Frage gehoert zur Modeanalyse?', ['Wie wirkt das Kleidungsstueck auf andere?', 'Wie schwer ist der Laden?', 'Wie laut ist die Naehmaschine?'], 'Wie wirkt das Kleidungsstueck auf andere?'),
        createChoiceTask('Was können Rollenbilder in der Mode beeinflussen?', ['Gestaltung und Vermarktung', 'nur Schuhgroessen', 'nur Pflegeetiketten'], 'Gestaltung und Vermarktung')
      ],
      schwer: [
        createChoiceTask('Welche Aussage trifft zu?', ['Mode kann gesellschaftliche Entwicklungen spiegeln', 'Mode ist immer bedeutungslos', 'Mode ist nur privat und nie sozial'], 'Mode kann gesellschaftliche Entwicklungen spiegeln'),
        createChoiceTask('Warum wird Mode manchmal kritisiert?', ['Weil sie Druck und Ausgrenzung erzeugen kann', 'Weil Stoffe immer zu weich sind', 'Weil Naehte verboten sind'], 'Weil sie Druck und Ausgrenzung erzeugen kann'),
        createChoiceTask('Welche Sicht ist für Modebewertung wichtig?', ['Wirkung, Kontext und Zielgruppe', 'nur der Preis', 'nur die Verpackung'], 'Wirkung, Kontext und Zielgruppe')
      ]
    },
    berufe_textil: {
      leicht: [
        createChoiceTask('Welcher Bereich gehoert zur Textilbranche?', ['Gestaltung und Verkauf', 'nur Astronomie', 'nur Gartenbau'], 'Gestaltung und Verkauf'),
        createChoiceTask('Wer entwirft Kleidung?', ['Designerinnen und Designer', 'nur Fahrerinnen und Fahrer', 'nur Hausmeister'], 'Designerinnen und Designer'),
        createChoiceTask('Was gehoert zu einer beruflichen Entscheidung?', ['Interessen und Staerken prüfen', 'nur zufaellig waehlen', 'nur Trends folgen'], 'Interessen und Staerken prüfen')
      ],
      mittel: [
        createChoiceTask('Welcher Beruf arbeitet oft mit Stoffverarbeitung?', ['Maßschneiderin oder Maßschneider', 'Pilotin oder Pilot ausschliesslich', 'Banktresorwart'], 'Maßschneiderin oder Maßschneider'),
        createChoiceTask('Warum ist Teamarbeit in Produktionsprozessen wichtig?', ['Weil viele Aufgaben zusammenhaengen', 'Weil niemand planen muss', 'Weil Maschinen allein alles entscheiden'], 'Weil viele Aufgaben zusammenhaengen'),
        createChoiceTask('Was ist bei Vermarktung wichtig?', ['Zielgruppe und Praesentation', 'nur Verpackungsmuell', 'nur Zufall'], 'Zielgruppe und Praesentation')
      ],
      schwer: [
        createChoiceTask('Welche Kompetenz ist in Textilberufen wichtig?', ['Gestaltung mit technischem Verstaendnis verbinden', 'nur auswendig lernen', 'nur einkaufen'], 'Gestaltung mit technischem Verstaendnis verbinden'),
        createChoiceTask('Warum lohnt sich der Blick auf Produktionsbedingungen beruflich?', ['Weil Verantwortung in der Branche wichtig ist', 'Weil sie nie eine Rolle spielen', 'Weil nur Logos zaehlen'], 'Weil Verantwortung in der Branche wichtig ist'),
        createChoiceTask('Welcher Aspekt gehoert zur Berufsorientierung?', ['Arbeitsfelder realistisch kennenlernen', 'nur Kleidung sammeln', 'nur Werbung nachsprechen'], 'Arbeitsfelder realistisch kennenlernen')
      ]
    }
  };

  if (!tasksByTopic[thema] || !tasksByTopic[thema][difficulty]) {
    throw new Error('Unbekanntes Textilkunde-Thema: ' + thema);
  }

  return pickExpandedTask_(tasksByTopic[thema][difficulty], 'textilkunde::' + klasse + '::' + thema + '::' + difficulty, 20);
}

function createBiologyTask(thema, klasse) {
  const difficulty = getDifficultyLevel(klasse);
  const tasksByTopic = {
    lebensraeume: {
      leicht: [
        { frage: 'Wie nennt man Pflanzen, die ihre Nahrung selbst herstellen?', loesung: 'Produzenten' },
        { frage: 'Wie nennt man eine Abfolge von Wer-frisst-wen?', loesung: 'Nahrungskette' }
      ],
      mittel: [
        { frage: 'Wie heisst der Teil der Bluetenpflanze, aus dem sich Samen entwickeln können?', loesung: 'Bluete' },
        { frage: 'Wie nennt man eine Eigenschaft, die einem Lebewesen das Überleben im Lebensraum erleichtert?', loesung: 'Angepasstheit' }
      ],
      schwer: [
        { frage: 'Wie nennt man Tiere, die sich von Pflanzen und Tieren ernaehren?', loesung: 'Allesfresser' },
        { frage: 'Wie nennt man den Schutz von Tieren, Pflanzen und Lebensraeumen?', loesung: 'Naturschutz' }
      ]
    },
    gesundheit: {
      leicht: [
        { frage: 'Welches Organ pumpt Blut durch den Körper?', loesung: 'Herz' },
        { frage: 'Wie nennt man die feste Struktur, die den Körper stützt?', loesung: 'Skelett' }
      ],
      mittel: [
        { frage: 'Welcher Stoff in Lebensmitteln liefert dem Körper besonders schnell Energie?', loesung: 'Kohlenhydrate' },
        { frage: 'Wie nennt man die Zerkleinerung und Verarbeitung von Nahrung im Körper?', loesung: 'Verdauung' }
      ],
      schwer: [
        { frage: 'Wie nennt man eine Ernaehrung mit allen wichtigen Naehrstoffen in sinnvoller Menge?', loesung: 'Ausgewogene Ernaehrung' },
        { frage: 'Wie nennt man Krankheiten, die durch Bewegungsmangel und ungesunden Lebensstil beguenstigt werden?', loesung: 'Zivilisationskrankheiten' }
      ]
    },
    sinne: {
      leicht: [
        { frage: 'Welches Sinnesorgan ist für das Hoeren zustaendig?', loesung: 'Ohr' },
        { frage: 'Welches Sinnesorgan nimmt Lichtreize auf?', loesung: 'Auge' }
      ],
      mittel: [
        { frage: 'Wie nennt man eine Reaktion des Körpers auf einen Reiz?', loesung: 'Reaktion' },
        { frage: 'Welches Sinnesorgan hilft dem Körper beim Tasten, Fühlen und Temperaturwahrnehmen?', loesung: 'Haut' }
      ],
      schwer: [
        { frage: 'Wie nennt man die Weiterleitung von Informationen im Körper über Nervenbahnen?', loesung: 'Reizleitung' },
        { frage: 'Warum besitzen viele Tiere besonders angepasste Sinnesorgane?', loesung: 'Zur Orientierung im Lebensraum' }
      ]
    },
    oekosysteme: {
      leicht: [
        { frage: 'Wie nennt man die Gesamtheit aus Lebensraum und Lebensgemeinschaft?', loesung: 'Oekosystem' },
        { frage: 'Wie nennt man Lebewesen, die abgestorbene Reste abbauen?', loesung: 'Destruenten' }
      ],
      mittel: [
        { frage: 'Wie nennt man Tiere, die andere Tiere fressen?', loesung: 'Konsumenten' },
        { frage: 'Wie nennt man den Kreislauf von Stoffen in einem Oekosystem?', loesung: 'Stoffkreislauf' }
      ],
      schwer: [
        { frage: 'Wie nennt man die Erwaermung der Erde durch bestimmte Gase in der Atmosphaere?', loesung: 'Treibhauseffekt' },
        { frage: 'Wie nennt man ein Beziehungsgeflecht aus vielen Nahrungsketten?', loesung: 'Nahrungsnetz' }
      ]
    },
    medizin: {
      leicht: [
        { frage: 'Wie nennt man krankmachende Bakterien oder Viren allgemein?', loesung: 'Krankheitserreger' },
        { frage: 'Wie nennt man die körpereigene Abwehr gegen Krankheitserreger?', loesung: 'Immunsystem' }
      ],
      mittel: [
        { frage: 'Wie nennt man eine vorbeugende Schutzmassnahme gegen bestimmte Infektionskrankheiten?', loesung: 'Impfung' },
        { frage: 'Welches Hormon senkt den Blutzuckerspiegel?', loesung: 'Insulin' }
      ],
      schwer: [
        { frage: 'Wie nennt man es, wenn Bakterien gegen ein Antibiotikum unempfindlich werden?', loesung: 'Resistenz' },
        { frage: 'Wie nennt man eine Erkrankung, bei der die Blutzuckerregulation gestoert ist?', loesung: 'Diabetes' }
      ]
    },
    sexualerziehung: {
      leicht: [
        { frage: 'Wie nennt man die Lebensphase, in der der Körper geschlechtsreif wird?', loesung: 'Pubertät' },
        { frage: 'Wie heisst die weibliche Keimzelle?', loesung: 'Eizelle' }
      ],
      mittel: [
        { frage: 'Wie heisst die maennliche Keimzelle?', loesung: 'Samenzelle' },
        { frage: 'Wie nennt man das Verschmelzen von Eizelle und Samenzelle?', loesung: 'Befruchtung' }
      ],
      schwer: [
        { frage: 'Wie nennt man verantwortliches Entscheiden über den eigenen Körper und Beziehungen?', loesung: 'Selbstbestimmung' },
        { frage: 'Wie nennt man die Entwicklung eines Kindes vor der Geburt?', loesung: 'Schwangerschaft' }
      ]
    },
    genetik: {
      leicht: [
        { frage: 'Wie nennt man den Traeger der Erbinformation?', loesung: 'DNA' },
        { frage: 'Wie nennt man Einheiten der Vererbung?', loesung: 'Gene' }
      ],
      mittel: [
        { frage: 'Wie nennt man faedige Strukturen im Zellkern, die Gene tragen?', loesung: 'Chromosomen' },
        { frage: 'Wie nennt man Veränderungen im Erbgut?', loesung: 'Mutationen' }
      ],
      schwer: [
        { frage: 'Wie nennt man einen Erbgang, bei dem sich Merkmale von Eltern auf Kinder übertragen?', loesung: 'Vererbung' },
        { frage: 'Wie nennt man die Zellteilung, bei der Keimzellen entstehen?', loesung: 'Meiose' }
      ]
    },
    evolution: {
      leicht: [
        { frage: 'Wie nennt man versteinerte Reste oder Spuren früherer Lebewesen?', loesung: 'Fossilien' },
        { frage: 'Wie nennt man die Entwicklung von Lebewesen über sehr lange Zeitraeume?', loesung: 'Evolution' }
      ],
      mittel: [
        { frage: 'Wie nennt man den Evolutionsfaktor, bei dem besonders gut angepasste Lebewesen bessere Überlebenschancen haben?', loesung: 'Selektion' },
        { frage: 'Wie nennt man eine zufaellige Veränderung im Erbgut als Grundlage neuer Merkmale?', loesung: 'Mutation' }
      ],
      schwer: [
        { frage: 'Wie nennt man die Entstehung neuer Arten durch Trennung von Populationen?', loesung: 'Isolation' },
        { frage: 'Wie nennt man die stammesgeschichtliche Entwicklung einer Artengruppe?', loesung: 'Stammesentwicklung' }
      ]
    },
    lebensphasen: {
      leicht: [
        { frage: 'Wie nennt man die erste Entwicklungsphase nach der Befruchtung?', loesung: 'Embryo' },
        { frage: 'Wie nennt man die Phase zwischen Kindheit und Erwachsensein?', loesung: 'Jugend' }
      ],
      mittel: [
        { frage: 'Wie nennt man Veränderungen des Körpers im hohen Alter zusammenfassend?', loesung: 'Altern' },
        { frage: 'Wie nennt man Entscheidungen, die den eigenen Lebensweg betreffen?', loesung: 'Lebensplanung' }
      ],
      schwer: [
        { frage: 'Wie nennt man medizinische Eingriffe rund um Beginn oder Ende des Lebens als großes ethisches Entscheidungsfeld?', loesung: 'Medizinethik' },
        { frage: 'Wie nennt man einen gesundheitsbewussten Lebensstil, der Entwicklung und Wohlbefinden foerdert?', loesung: 'Gesunde Lebensfuehrung' }
      ]
    }
  };

  return pickExpandedTask_(tasksByTopic[thema][difficulty], 'biologie::' + klasse + '::' + thema + '::' + difficulty, 20);
}

function createGeographyTask(thema, klasse) {
  const difficulty = getDifficultyLevel(klasse);
  const tasksByTopic = {
    orientierung: {
      leicht: [
        { frage: 'Welche Himmelsrichtung liegt oben auf den meisten Karten?', loesung: 'Norden' },
        { frage: 'Wie nennt man die Zeichenerklaerung auf einer Karte?', loesung: 'Legende' }
      ],
      mittel: [
        { frage: 'Wie nennt man das Verhaeltnis zwischen Karte und Wirklichkeit?', loesung: 'Massstab' },
        { frage: 'Welche Linien verbinden Orte mit gleicher Hoehe?', loesung: 'Hoehenlinien' }
      ],
      schwer: [
        { frage: 'Wie nennt man das Gitternetz aus Breiten- und Laengengraden?', loesung: 'Gradnetz' },
        { frage: 'Welche Himmelsrichtung liegt gegenüber von Osten?', loesung: 'Westen' }
      ]
    },
    tourismus: {
      leicht: [
        { frage: 'Wie nennt man Reisen in Ferien und Freizeit zusammenfassend?', loesung: 'Tourismus' },
        { frage: 'Welche Orte werden durch viele Besucher oft wirtschaftlich ändert?', loesung: 'Tourismusorte' }
      ],
      mittel: [
        { frage: 'Wie nennt man die wirtschaftliche Nutzung eines Ortes durch Urlauber?', loesung: 'Touristische Nutzung' },
        { frage: 'Was kann durch starken Tourismus an Landschaften entstehen: Schutz oder Belastung?', loesung: 'Belastung' }
      ],
      schwer: [
        { frage: 'Wie nennt man Tourismus, der Natur und Menschen möglichst schont?', loesung: 'Nachhaltiger Tourismus' },
        { frage: 'Warum ändert Tourismus oft Orte besonders stark?', loesung: 'Wegen Infrastruktur und Nutzung' }
      ]
    },
    landwirtschaft: {
      leicht: [
        { frage: 'Wie nennt man den Anbau von Pflanzen und die Haltung von Tieren zur Lebensmittelproduktion?', loesung: 'Landwirtschaft' },
        { frage: 'Welcher Faktor ist für Ernten wichtig: Klima oder Ampelfarbe?', loesung: 'Klima' }
      ],
      mittel: [
        { frage: 'Wie nennt man den Boden, das Klima und die Lage eines landwirtschaftlichen Raums zusammenfassend?', loesung: 'Standortbedingungen' },
        { frage: 'Wie nennt man große Felder mit einer einzigen Kulturpflanze?', loesung: 'Monokultur' }
      ],
      schwer: [
        { frage: 'Wie nennt man eine Landwirtschaft, die Umwelt und Ressourcen besonders beachtet?', loesung: 'Nachhaltige Landwirtschaft' },
        { frage: 'Warum ist Landwirtschaft für alle Menschen wichtig?', loesung: 'Wegen der Lebensmittelversorgung' }
      ]
    },
    klima: {
      leicht: [
        { frage: 'Wie nennt man den Zustand der Atmosphaere an einem bestimmten Tag?', loesung: 'Wetter' },
        { frage: 'Was misst ein Thermometer?', loesung: 'Temperatur' }
      ],
      mittel: [
        { frage: 'Wie nennt man den durchschnittlichen Wetterverlauf über viele Jahre?', loesung: 'Klima' },
        { frage: 'Wie heisst Wasser, das aus Wolken auf die Erde faellt?', loesung: 'Niederschlag' }
      ],
      schwer: [
        { frage: 'Wie nennt man Gebiete mit sehr wenig Niederschlag?', loesung: 'Trockengebiete' },
        { frage: 'Welche Windzone liegt in der Naehe des Aequators?', loesung: 'Passatwindzone' }
      ]
    },
    regenwald: {
      leicht: [
        { frage: 'Wie heisst der Lebensraum mit ganzjaehrig warmem und feuchtem Klima?', loesung: 'Tropischer Regenwald' },
        { frage: 'Auf welchem Kontinent liegt ein großer Teil des Amazonas-Regenwaldes?', loesung: 'Suedamerika' }
      ],
      mittel: [
        { frage: 'Wie nennt man das Abholzen großer Waldgebiete?', loesung: 'Abholzung' },
        { frage: 'Warum ist der Regenwald für das Klima wichtig?', loesung: 'Weil er Kohlenstoff speichert' }
      ],
      schwer: [
        { frage: 'Wie nennt man eine Nutzung des Regenwaldes, die auf Dauer möglich bleiben soll?', loesung: 'Nachhaltige Nutzung' },
        { frage: 'Warum ist der Regenwald stark gefaehrdet?', loesung: 'Wegen Rodung und Nutzung' }
      ]
    },
    naturgefahren: {
      leicht: [
        { frage: 'Wie nennt man ploetzliche Naturereignisse mit großer Gefahr für Menschen?', loesung: 'Naturgefahren' },
        { frage: 'Nenne eine Naturgefahr: Erdbeben oder Taschenlampe?', loesung: 'Erdbeben' }
      ],
      mittel: [
        { frage: 'Wie nennt man eine sehr große Flutwelle nach einem Seebeben?', loesung: 'Tsunami' },
        { frage: 'Wie nennt man geschuetzten Abstand oder Schutzmassnahmen gegen Gefahren?', loesung: 'Vorsorge' }
      ],
      schwer: [
        { frage: 'Warum werden Naturereignisse für Menschen oft erst durch Besiedlung zu großen Risiken?', loesung: 'Wegen Gefaehrdung von Siedlungen' },
        { frage: 'Wie nennt man das Ziel, Schaeden durch Fruehwarnung und Planung zu verringern?', loesung: 'Katastrophenvorsorge' }
      ]
    },
    stadtentwicklung: {
      leicht: [
        { frage: 'Wie nennt man große Siedlungsraeume mit vielen Menschen und Gebäuden?', loesung: 'Städte' },
        { frage: 'Welcher Bereich einer Stadt wird oft Innenstadt genannt?', loesung: 'Zentrum' }
      ],
      mittel: [
        { frage: 'Wie nennt man Veränderungen von Wohn-, Verkehrs- und Wirtschaftsraeumen in einer Stadt?', loesung: 'Stadtentwicklung' },
        { frage: 'Wie nennt man das Pendeln vieler Menschen zwischen Wohnort und Arbeitsort?', loesung: 'Pendlerverkehr' }
      ],
      schwer: [
        { frage: 'Wie nennt man Probleme wie Wohnraummangel, Verkehr und Luftbelastung zusammenfassend?', loesung: 'Staedtische Probleme' },
        { frage: 'Wie nennt man eine Planung, die eine Stadt lebenswerter machen soll?', loesung: 'Stadtplanung' }
      ]
    },
    globalisierung: {
      leicht: [
        { frage: 'Wie nennt man die weltweite Verflechtung von Wirtschaft und Handel?', loesung: 'Globalisierung' },
        { frage: 'Produkte werden heute oft in mehreren Laendern hergestellt. Wie nennt man das?', loesung: 'Globale Arbeitsteilung' }
      ],
      mittel: [
        { frage: 'Wie nennt man den Transport von Waren rund um die Welt in standardisierten Boxen?', loesung: 'Containerverkehr' },
        { frage: 'Wie nennt man Firmen, die in vielen Laendern taetig sind?', loesung: 'Internationale Unternehmen' }
      ],
      schwer: [
        { frage: 'Wie nennt man Abhaengigkeiten zwischen entfernten Wirtschaftsraeumen?', loesung: 'Globale Verflechtungen' },
        { frage: 'Wie nennt man faire und sozial verantwortliche Handelsbeziehungen als Gegenmodell zu Ausbeutung?', loesung: 'Fairer Handel' }
      ]
    },
    bevoelkerung: {
      leicht: [
        { frage: 'Wie nennt man alle Menschen, die in einem Land oder Gebiet leben?', loesung: 'Bevoelkerung' },
        { frage: 'Wie nennt man die Zahl der Einwohner pro Quadratkilometer?', loesung: 'Bevoelkerungsdichte' }
      ],
      mittel: [
        { frage: 'Wie nennt man das Wandern von Menschen von einem Ort an einen anderen?', loesung: 'Migration' },
        { frage: 'Wie nennt man das Wachstum der Einwohnerzahl in einem Gebiet?', loesung: 'Bevoelkerungswachstum' }
      ],
      schwer: [
        { frage: 'Wie nennt man sehr schnell wachsende Millionenstaedte besonders in Entwicklungslaendern?', loesung: 'Megastaedte' },
        { frage: 'Wie nennt man ungleiche Lebensbedingungen zwischen Laendern oder Regionen?', loesung: 'Entwicklungsunterschiede' }
      ]
    }
  };

  return pickExpandedTask_(tasksByTopic[thema][difficulty], 'geographie::' + klasse + '::' + thema + '::' + difficulty, 20);
}

function createPoliticsTask(thema, klasse) {
  const difficulty = getDifficultyLevel(klasse);
  const tasksByTopic = {
    digitales_leben: {
      leicht: [
        { frage: 'Wie nennt man den respektvollen Umgang miteinander im Internet?', loesung: 'Netiquette' },
        { frage: 'Welche Daten sollte man im Netz besonders schuetzen?', loesung: 'Persoenliche Daten' }
      ],
      mittel: [
        { frage: 'Wie nennt man das Recht, selbst über eigene Daten zu bestimmen?', loesung: 'Datenschutz' },
        { frage: 'Wie nennt man absichtliches Taeuschen im Netz, um Daten zu bekommen?', loesung: 'Phishing' }
      ],
      schwer: [
        { frage: 'Wie nennt man die Teilnahme am gesellschaftlichen Leben über digitale Medien?', loesung: 'Digitale Teilhabe' },
        { frage: 'Wie nennt man bewusst falsche Inhalte im Netz zur Beeinflussung?', loesung: 'Desinformation' }
      ]
    },
    zusammenleben: {
      leicht: [
        { frage: 'Warum gibt es Regeln in einer Gemeinschaft?', loesung: 'Damit Zusammenleben gelingt' },
        { frage: 'Wie nennt man eine friedliche Loesung von Streit?', loesung: 'Konfliktloesung' }
      ],
      mittel: [
        { frage: 'Wie nennt man das Mitbestimmen in einer Gruppe oder Klasse?', loesung: 'Mitwirkung' },
        { frage: 'Wie nennt man den respektvollen Umgang mit anderen Menschen?', loesung: 'Toleranz' }
      ],
      schwer: [
        { frage: 'Wie nennt man das Gefühl und die Pflicht, für andere mitzudenken?', loesung: 'Verantwortung' },
        { frage: 'Wie nennt man Regeln und Werte, die ein faires Zusammenleben sichern sollen?', loesung: 'Normen' }
      ]
    },
    verbraucher: {
      leicht: [
        { frage: 'Wie nennt man Menschen, die Waren kaufen oder nutzen?', loesung: 'Verbraucher' },
        { frage: 'Was soll Werbung haeufig erreichen?', loesung: 'Kaufen' }
      ],
      mittel: [
        { frage: 'Wie nennt man das bewusste Vergleichen von Preis und Leistung vor einem Kauf?', loesung: 'Kaufentscheidung' },
        { frage: 'Wie nennt man Kennzeichen für umweltfreundliche Produkte?', loesung: 'Siegel' }
      ],
      schwer: [
        { frage: 'Wie nennt man Konsum, der soziale und oekologische Folgen mitbedenkt?', loesung: 'Nachhaltiger Konsum' },
        { frage: 'Wie nennt man das Recht auf Informationen und Schutz beim Kauf?', loesung: 'Verbraucherschutz' }
      ]
    },
    demokratie: {
      leicht: [
        { frage: 'Wie nennt man die Herrschaftsform, in der das Volk mitbestimmt?', loesung: 'Demokratie' },
        { frage: 'Wie heisst der Vorgang, bei dem Bürger ihre Vertreter bestimmen?', loesung: 'Wahl' }
      ],
      mittel: [
        { frage: 'Wie nennt man gewaehlte Vertreter in einem Parlament?', loesung: 'Abgeordnete' },
        { frage: 'Wie heisst das deutsche Parlament?', loesung: 'Bundestag' }
      ],
      schwer: [
        { frage: 'Wie nennt man die Teilung staatlicher Macht in verschiedene Bereiche?', loesung: 'Gewaltenteilung' },
        { frage: 'Wie nennt man das Recht, seine Meinung frei zu aeussern?', loesung: 'Meinungsfreiheit' }
      ]
    },
    medien: {
      leicht: [
        { frage: 'Wie nennt man die gezielte Beeinflussung durch Medieninhalte?', loesung: 'Manipulation' },
        { frage: 'Wie nennt man Inhalte, die nicht geprüft und ungefiltert verbreitet werden?', loesung: 'Fake News' }
      ],
      mittel: [
        { frage: 'Wie nennt man die Darstellung der eigenen Person in sozialen Netzwerken?', loesung: 'Selbstdarstellung' },
        { frage: 'Wie nennt man das kritische Pruefen von Quellen und Aussagen?', loesung: 'Medienkritik' }
      ],
      schwer: [
        { frage: 'Wie nennt man die Fähigkeit, Medien bewusst, kritisch und verantwortungsvoll zu nutzen?', loesung: 'Medienkompetenz' },
        { frage: 'Wie nennt man Auswirkungen sozialer Medien auf das Bild von sich selbst und anderen?', loesung: 'Identitaetsbildung' }
      ]
    },
    nachhaltigkeit: {
      leicht: [
        { frage: 'Wie nennt man Handeln, das auch an die Zukunft denkt?', loesung: 'Nachhaltigkeit' },
        { frage: 'Was soll beim nachhaltigen Konsum möglichst geschont werden?', loesung: 'Ressourcen' }
      ],
      mittel: [
        { frage: 'Wie nennt man Produkte, die unter fairen Bedingungen gehandelt werden?', loesung: 'Fair-Trade-Produkte' },
        { frage: 'Wie nennt man die Folgen des Konsums für Natur und Klima?', loesung: 'Umweltfolgen' }
      ],
      schwer: [
        { frage: 'Wie nennt man einen Lebensstil, der Umwelt, Soziales und Wirtschaft zusammendenkt?', loesung: 'Nachhaltige Entwicklung' },
        { frage: 'Wie nennt man den sorgsamen Umgang mit endlichen Gütern?', loesung: 'Ressourcenschonung' }
      ]
    },
    europa: {
      leicht: [
        { frage: 'Wie heisst der Staatenverbund vieler europaeischer Laender?', loesung: 'Europaeische Union' },
        { frage: 'Wie kuerzt man die Europaeische Union ab?', loesung: 'EU' }
      ],
      mittel: [
        { frage: 'In welcher Stadt hat das Europaeische Parlament einen wichtigen Sitz?', loesung: 'Strassburg' },
        { frage: 'Wie nennt man das gemeinsame Geld vieler EU-Laender?', loesung: 'Euro' }
      ],
      schwer: [
        { frage: 'Wie nennt man das Recht, in vielen EU-Laendern frei zu reisen und zu arbeiten?', loesung: 'Freizuegigkeit' },
        { frage: 'Wie heisst die Zusammenarbeit von Staaten bei gemeinsamen politischen Entscheidungen?', loesung: 'Integration' }
      ]
    },
    wirtschaft: {
      leicht: [
        { frage: 'Wie nennt man einen Ort oder Prozess, an dem Angebot und Nachfrage aufeinandertreffen?', loesung: 'Markt' },
        { frage: 'Wie nennt man Geld, das man für Arbeit bekommt?', loesung: 'Lohn' }
      ],
      mittel: [
        { frage: 'Wie nennt man Unternehmen, die Waren herstellen oder Dienstleistungen anbieten?', loesung: 'Betriebe' },
        { frage: 'Wie nennt man das Verhaeltnis zwischen verfügbaren Produkten und Kaufwuenschen?', loesung: 'Angebot und Nachfrage' }
      ],
      schwer: [
        { frage: 'Wie nennt man eine Wirtschaftsordnung mit Wettbewerb und sozialem Ausgleich in Deutschland?', loesung: 'Soziale Marktwirtschaft' },
        { frage: 'Wie nennt man steigende Preise für viele Güter?', loesung: 'Inflation' }
      ]
    },
    arbeitswelt: {
      leicht: [
        { frage: 'Wie nennt man die Welt von Beruf, Arbeit und Unternehmen zusammenfassend?', loesung: 'Arbeitswelt' },
        { frage: 'Wie nennt man die Vorbereitung auf einen spaeteren Beruf?', loesung: 'Berufsorientierung' }
      ],
      mittel: [
        { frage: 'Wie nennt man Veränderungen von Berufen durch Technik und Digitalisierung?', loesung: 'Strukturwandel' },
        { frage: 'Wie nennt man eine schriftliche Vorstellung für eine Stelle?', loesung: 'Bewerbung' }
      ],
      schwer: [
        { frage: 'Wie nennt man gerechte Bezahlung und faire Bedingungen in der Arbeitswelt?', loesung: 'Soziale Gerechtigkeit' },
        { frage: 'Wie nennt man die Fähigkeit, sich an neue berufliche Anforderungen anzupassen?', loesung: 'Flexibilitaet' }
      ]
    }
  };

  return pickExpandedTask_(tasksByTopic[thema][difficulty], 'politik::' + klasse + '::' + thema + '::' + difficulty, 20);
}

function createComputerScienceTask(thema, klasse) {
  const difficulty = getDifficultyLevel(klasse);
  const tasksByTopic = {
    algorithmen: {
      leicht: [
        { frage: 'Wie nennt man eine genaue Schritt-für-Schritt-Anleitung in der Informatik?', loesung: 'Algorithmus' },
        { frage: 'Wie nennt man Fehler in einem Programm umgangssprachlich?', loesung: 'Bug' }
      ],
      mittel: [
        { frage: 'Wie nennt man das Suchen und Beheben von Fehlern im Code?', loesung: 'Debugging' },
        { frage: 'Wie nennt man eine Wiederholung von Anweisungen im Programm?', loesung: 'Schleife' }
      ],
      schwer: [
        { frage: 'Wie nennt man eine Verzweigung mit Ja-Nein-Entscheidung im Programm?', loesung: 'Bedingung' },
        { frage: 'Wie nennt man eine Anweisungssprache für Computer?', loesung: 'Programmiersprache' }
      ]
    },
    codierung: {
      leicht: [
        { frage: 'Wie nennt man das Darstellen von Informationen mit Zeichen oder Zahlen?', loesung: 'Codierung' },
        { frage: 'Wie viele Ziffern hat das Binaersystem?', loesung: 'Zwei' }
      ],
      mittel: [
        { frage: 'Wie nennt man das Rueckgaengigmachen einer Codierung?', loesung: 'Decodierung' },
        { frage: 'Welche zwei Ziffern nutzt ein Computer im Binaersystem?', loesung: '0 und 1' }
      ],
      schwer: [
        { frage: 'Wie nennt man ein Verfahren, das Informationen geheim machen soll?', loesung: 'Verschluesselung' },
        { frage: 'Warum sind Codes in der Informatik wichtig?', loesung: 'Zur eindeutigen Darstellung von Informationen' }
      ]
    },
    automaten: {
      leicht: [
        { frage: 'Wie nennt man ein System, das nach festen Regeln auf Eingaben reagiert?', loesung: 'Automat' },
        { frage: 'Wie nennt man unterschiedliche Situationen, in denen sich ein Automat befinden kann?', loesung: 'Zustaende' }
      ],
      mittel: [
        { frage: 'Wie nennt man den Wechsel von einem Zustand in einen anderen?', loesung: 'Übergang' },
        { frage: 'Was loest bei einem Automaten oft einen Zustandswechsel aus?', loesung: 'Eingabe' }
      ],
      schwer: [
        { frage: 'Wie nennt man die vereinfachte Beschreibung technischer Systeme mit Zustaenden und Regeln?', loesung: 'Modell' },
        { frage: 'Warum sind Automatenmodelle in der Informatik hilfreich?', loesung: 'Weil sie Verhalten beschreiben' }
      ]
    },
    programmierung: {
      leicht: [
        { frage: 'Wie nennt man einen Speicherplatz für änderbare Werte im Programm?', loesung: 'Variable' },
        { frage: 'Wie nennt man eine Wiederholung von Befehlen?', loesung: 'Schleife' }
      ],
      mittel: [
        { frage: 'Wie nennt man eine Ja-Nein-Entscheidung im Programmablauf?', loesung: 'Bedingung' },
        { frage: 'Wie nennt man das Finden und Beheben von Programmfehlern?', loesung: 'Debugging' }
      ],
      schwer: [
        { frage: 'Wie nennt man die Zerlegung eines Problems in einzelne Schritte?', loesung: 'Algorithmisierung' },
        { frage: 'Wie nennt man gut lesbaren Pseudocode oder Ablaufplaene als Vorbereitung auf Code?', loesung: 'Modellierung' }
      ]
    },
    daten_netzwerke: {
      leicht: [
        { frage: 'Wie nennt man miteinander verbundene Computer?', loesung: 'Netzwerk' },
        { frage: 'Wie nennt man Informationen, die gespeichert und verarbeitet werden?', loesung: 'Daten' }
      ],
      mittel: [
        { frage: 'Wie nennt man die Adresse einer Webseite?', loesung: 'URL' },
        { frage: 'Wie nennt man Regeln für den Austausch von Daten in Netzwerken?', loesung: 'Protokolle' }
      ],
      schwer: [
        { frage: 'Wie nennt man den Schutz persoenlicher Informationen in digitalen Systemen?', loesung: 'Datenschutz' },
        { frage: 'Wie nennt man ein weltweites Netz aus vielen Netzwerken?', loesung: 'Internet' }
      ]
    },
    sicherheit: {
      leicht: [
        { frage: 'Wie nennt man ein geheimes Kennwort für den Zugang zu einem Konto?', loesung: 'Passwort' },
        { frage: 'Soll ein sicheres Passwort leicht oder schwer zu erraten sein?', loesung: 'Schwer zu erraten' }
      ],
      mittel: [
        { frage: 'Wie nennt man Schadsoftware, die Computer befallen kann?', loesung: 'Malware' },
        { frage: 'Wie nennt man das ungewollte Preisgeben persoenlicher Daten?', loesung: 'Datenleck' }
      ],
      schwer: [
        { frage: 'Wie nennt man das vorsichtige und verantwortliche Verhalten mit digitalen Daten?', loesung: 'Datensicherheit' },
        { frage: 'Wie nennt man einen zweiten Schutzschritt neben dem Passwort?', loesung: 'Zwei-Faktor-Authentifizierung' }
      ]
    },
    datenbanken_ki: {
      leicht: [
        { frage: 'Wie nennt man eine geordnete Sammlung vieler Datensaetze?', loesung: 'Datenbank' },
        { frage: 'Wie nennt man Systeme, die aus Daten Muster erkennen können?', loesung: 'Kuenstliche Intelligenz' }
      ],
      mittel: [
        { frage: 'Wie nennt man eine einzelne Kategorie in einer Tabelle, zum Beispiel Name oder Alter?', loesung: 'Feld' },
        { frage: 'Wie nennt man das automatische Lernen aus Beispieldaten?', loesung: 'Maschinelles Lernen' }
      ],
      schwer: [
        { frage: 'Wie nennt man die kritische Frage, ob Daten für KI fair und geeignet sind?', loesung: 'Datenqualitaet' },
        { frage: 'Wie nennt man die Gefahr, dass KI Entscheidungen verzerrt trifft?', loesung: 'Bias' }
      ]
    },
    logische_schaltungen: {
      leicht: [
        { frage: 'Wie nennt man Verknuepfungen wie UND, ODER und NICHT?', loesung: 'Logische Operationen' },
        { frage: 'Welche Logik liefert nur dann wahr, wenn beide Eingaben wahr sind?', loesung: 'UND' }
      ],
      mittel: [
        { frage: 'Welche Verknuepfung ist wahr, wenn mindestens eine Eingabe wahr ist?', loesung: 'ODER' },
        { frage: 'Welche Operation kehrt wahr und falsch um?', loesung: 'NICHT' }
      ],
      schwer: [
        { frage: 'Wie nennt man technische Bauteile, die logische Entscheidungen umsetzen?', loesung: 'Schaltungen' },
        { frage: 'Warum sind logische Schaltungen für Computer wichtig?', loesung: 'Weil sie Entscheidungen verarbeiten' }
      ]
    },
    projektentwicklung: {
      leicht: [
        { frage: 'Wie nennt man das genaue Beschreiben eines Problems vor der Loesung?', loesung: 'Analyse' },
        { frage: 'Wie nennt man eine erste vereinfachte Loesungsidee für ein digitales Produkt?', loesung: 'Entwurf' }
      ],
      mittel: [
        { frage: 'Wie nennt man das Testen, ob eine digitale Loesung funktioniert?', loesung: 'Testen' },
        { frage: 'Wie nennt man das Verbessern eines Projekts nach Rückmeldungen?', loesung: 'Überarbeitung' }
      ],
      schwer: [
        { frage: 'Wie nennt man die schrittweise Entwicklung einer digitalen Loesung vom Problem bis zum Produkt?', loesung: 'Projektentwicklung' },
        { frage: 'Wie nennt man die Beurteilung, ob eine digitale Loesung sinnvoll und passend ist?', loesung: 'Evaluation' }
      ]
    },
    hardware: {
      leicht: [
        { frage: 'Wie nennt man das Gehirn des Computers?', loesung: 'Prozessor' },
        { frage: 'Welche Hardware zeigt Bilder auf dem Bildschirm an?', loesung: 'Grafikkarte' }
      ],
      mittel: [
        { frage: 'Wie nennt man den kurzfristigen Arbeitsspeicher eines Computers?', loesung: 'RAM' },
        { frage: 'Welche Komponente speichert Daten dauerhaft, zum Beispiel SSD oder HDD?', loesung: 'Speicher' }
      ],
      schwer: [
        { frage: 'Wie nennt man die Hauptplatine, auf der viele Teile verbunden sind?', loesung: 'Mainboard' },
        { frage: 'Welches Geraet wandelt Tasteneingaben in digitale Signale um?', loesung: 'Tastatur' }
      ]
    },
    internet: {
      leicht: [
        { frage: 'Wie nennt man das weltweite Netzwerk aus Computern?', loesung: 'Internet' },
        { frage: 'Wie nennt man ein geheimes Kennwort für einen Account?', loesung: 'Passwort' }
      ],
      mittel: [
        { frage: 'Wie nennt man falsche Nachrichten, mit denen Daten erschlichen werden sollen?', loesung: 'Phishing' },
        { frage: 'Wie nennt man die Adresse einer Webseite im Browser?', loesung: 'URL' }
      ],
      schwer: [
        { frage: 'Wie nennt man die Verschluesselung von Daten zur sicheren Übertragung?', loesung: 'Verschluesselung' },
        { frage: 'Wie nennt man Regeln für respektvolles Verhalten im Netz?', loesung: 'Netiquette' }
      ]
    }
  };

  return pickExpandedTask_(tasksByTopic[thema][difficulty], 'informatik::' + klasse + '::' + thema + '::' + difficulty, 20);
}

function createTechnologyTask(thema, klasse) {
  const difficulty = getDifficultyLevel(klasse);
  const tasksByTopic = {
    werkstoffe: {
      leicht: [
        { frage: 'Nenne einen Werkstoff aus Holz, Metall oder Kunststoff, der magnetisch sein kann.', loesung: 'Metall' },
        { frage: 'Welcher Werkstoff ist oft leicht und gut formbar: Holz, Kunststoff oder Stein?', loesung: 'Kunststoff' }
      ],
      mittel: [
        { frage: 'Welcher Werkstoff ist meist hart, schwer und leitfaehig?', loesung: 'Metall' },
        { frage: 'Welcher Werkstoff stammt direkt von Baeumen?', loesung: 'Holz' }
      ],
      schwer: [
        { frage: 'Wie nennt man die Eigenschaft, dass ein Stoff Strom leitet?', loesung: 'Leitfaehigkeit' },
        { frage: 'Wie nennt man die Widerstandsfaehigkeit eines Materials gegen Druck oder Zug?', loesung: 'Festigkeit' }
      ]
    },
    werkzeuge: {
      leicht: [
        { frage: 'Welches Werkzeug nutzt man oft zum Einschlagen von Naegeln?', loesung: 'Hammer' },
        { frage: 'Welches Werkzeug dient haeufig zum Messen von Laengen?', loesung: 'Lineal' }
      ],
      mittel: [
        { frage: 'Wie nennt man den Schutz für die Augen beim Werken?', loesung: 'Schutzbrille' },
        { frage: 'Welches Werkzeug dreht Schrauben hinein oder heraus?', loesung: 'Schraubendreher' }
      ],
      schwer: [
        { frage: 'Was ist vor der Nutzung elektrischer Werkzeuge besonders wichtig?', loesung: 'Sicherheit' },
        { frage: 'Wie nennt man das feste Einspannen eines Werkstuecks für sauberes Arbeiten?', loesung: 'Fixieren' }
      ]
    },
    konstruktion: {
      leicht: [
        { frage: 'Wie nennt man eine geplante technische Loesung oder Bauidee?', loesung: 'Konstruktion' },
        { frage: 'Was hilft vor dem Bauen beim genauen Planen: Text oder Zeichnung?', loesung: 'Zeichnung' }
      ],
      mittel: [
        { frage: 'Wie nennt man eine technische Zeichnung mit Massen und Ansicht?', loesung: 'Bauzeichnung' },
        { frage: 'Wie nennt man das Verbinden von Teilen mit Kleber, Schrauben oder Naegeln?', loesung: 'Fuegen' }
      ],
      schwer: [
        { frage: 'Wie nennt man einen ersten vereinfachten Entwurf eines Produkts?', loesung: 'Modell' },
        { frage: 'Welche Eigenschaft meint, dass etwas seinen Zweck gut erfuellt?', loesung: 'Funktionalitaet' }
      ]
    }
  };

  return pickExpandedTask_(tasksByTopic[thema][difficulty], 'technik::' + klasse + '::' + thema + '::' + difficulty, 20);
}

function createArtTask(thema, klasse) {
  const difficulty = getDifficultyLevel(klasse);
  const tasksByTopic = {
    farbenlehre: {
      leicht: [
        { frage: 'Nenne eine Primaerfarbe.', loesung: 'Rot' },
        { frage: 'Welche Farbe entsteht aus Blau und Gelb?', loesung: 'Gruen' }
      ],
      mittel: [
        { frage: 'Wie nennt man Farben, die sich im Farbkreis gegenüberliegen?', loesung: 'Komplementaerfarben' },
        { frage: 'Welche Wirkung haben warme Farben oft?', loesung: 'Lebhaft' }
      ],
      schwer: [
        { frage: 'Wie nennt man Abstufungen von hell nach dunkel einer Farbe?', loesung: 'Tonwerte' },
        { frage: 'Welche Farbgruppe wirkt oft ruhig und distanziert: warm oder kalt?', loesung: 'Kalt' }
      ]
    },
    perspektive: {
      leicht: [
        { frage: 'Wie nennt man die Linie, auf der Himmel und Erde scheinbar zusammentreffen?', loesung: 'Horizontlinie' },
        { frage: 'Wie nennt man den Punkt, auf den Linien in der Perspektive zulaufen?', loesung: 'Fluchtpunkt' }
      ],
      mittel: [
        { frage: 'Wie nennt man eine Darstellung mit nur einem Fluchtpunkt?', loesung: 'Einpunktperspektive' },
        { frage: 'Wirken Gegenstaende größer oder kleiner, wenn sie im Bild weiter hinten liegen?', loesung: 'Kleiner' }
      ],
      schwer: [
        { frage: 'Wie nennt man eine Darstellung mit zwei Fluchtpunkten?', loesung: 'Zweipunktperspektive' },
        { frage: 'Welche Zeichenmethode erzeugt raeumliche Tiefe auf einer Flaeche?', loesung: 'Perspektive' }
      ]
    },
    bildanalyse: {
      leicht: [
        { frage: 'Was beschreibt man in einer Bildanalyse zuerst: Eindruck oder sichtbare Merkmale?', loesung: 'Sichtbare Merkmale' },
        { frage: 'Wie nennt man den Aufbau eines Bildes?', loesung: 'Komposition' }
      ],
      mittel: [
        { frage: 'Wie nennt man die Stimmung oder Wirkung eines Bildes?', loesung: 'Atmosphaere' },
        { frage: 'Welche Frage gehoert zur Deutung: Was sehe ich oder was bedeutet es?', loesung: 'Was bedeutet es' }
      ],
      schwer: [
        { frage: 'Wie nennt man das gezielte Untersuchen von Farbe, Form und Wirkung?', loesung: 'Analyse' },
        { frage: 'Wie nennt man einen wiederkehrenden Bildgedanken oder eine zentrale Aussage?', loesung: 'Motiv' }
      ]
    }
  };

  return pickExpandedTask_(tasksByTopic[thema][difficulty], 'kunst::' + klasse + '::' + thema + '::' + difficulty, 20);
}

function createMusicTask(thema, klasse) {
  const difficulty = getDifficultyLevel(klasse);
  const tasksByTopic = {
    rhythmus: {
      leicht: [
        { frage: 'Wie nennt man den gleichmaessigen Grundschlag in der Musik?', loesung: 'Puls' },
        { frage: 'Wie nennt man das Zaehlen in regelmaessigen Gruppen, zum Beispiel 1 2 3 4?', loesung: 'Takt' }
      ],
      mittel: [
        { frage: 'Wie nennt man das Muster aus langen und kurzen Toenen?', loesung: 'Rhythmus' },
        { frage: 'Wie viele Schlaege hat ein 4/4-Takt in einem Takt?', loesung: 'Vier' }
      ],
      schwer: [
        { frage: 'Wie nennt man eine Verschiebung gegen den Grundschlag?', loesung: 'Synkope' },
        { frage: 'Was bleibt bei einem gleichbleibenden Tempo konstant?', loesung: 'Geschwindigkeit' }
      ]
    },
    noten: {
      leicht: [
        { frage: 'Wie nennt man die Zeichen für Toene in der Musikschrift?', loesung: 'Noten' },
        { frage: 'Wie heisst das Symbol am Anfang vieler Notenzeilen für hohe Töne?', loesung: 'Violinschluessel' }
      ],
      mittel: [
        { frage: 'Wie viele Linien hat ein Notensystem?', loesung: 'Fuenf' },
        { frage: 'Welche Note ist laenger: Viertelnote oder halbe Note?', loesung: 'Halbe Note' }
      ],
      schwer: [
        { frage: 'Wie nennt man das Zeichen, das einen Ton erhoeht?', loesung: 'Kreuz' },
        { frage: 'Wie nennt man das Zeichen, das eine Pause anzeigt?', loesung: 'Pausenzeichen' }
      ]
    },
    instrumente: {
      leicht: [
        { frage: 'Zu welcher Familie gehoert die Geige?', loesung: 'Streichinstrumente' },
        { frage: 'Zu welcher Familie gehoert die Trompete?', loesung: 'Blechblasinstrumente' }
      ],
      mittel: [
        { frage: 'Welches Instrument hat schwarze und weisse Tasten?', loesung: 'Klavier' },
        { frage: 'Wie nennt man Instrumente, bei denen eine Saite schwingt?', loesung: 'Saiteninstrumente' }
      ],
      schwer: [
        { frage: 'Wie nennt man Instrumente, bei denen Luftsaeulen den Klang erzeugen?', loesung: 'Blasinstrumente' },
        { frage: 'Welche Instrumentenfamilie erzeugt Toene meist durch Schlag oder Erschuetterung?', loesung: 'Schlaginstrumente' }
      ]
    }
  };

  return pickExpandedTask_(tasksByTopic[thema][difficulty], 'musik::' + klasse + '::' + thema + '::' + difficulty, 20);
}

function createSportTask(thema, klasse) {
  const difficulty = getDifficultyLevel(klasse);
  const tasksByTopic = {
    bewegung: {
      leicht: [
        { frage: 'Wie nennt man das Zusammenspiel von Wahrnehmen und Bewegung?', loesung: 'Koordination' },
        { frage: 'Wie nennt man das Bewegen des Körpers vor dem Sport zur Vorbereitung?', loesung: 'Aufwärmen' }
      ],
      mittel: [
        { frage: 'Wie nennt man die Fähigkeit, den Körper sicher im Gleichgewicht zu halten?', loesung: 'Balance' },
        { frage: 'Wie nennt man die Beweglichkeit von Gelenken und Muskeln?', loesung: 'Flexibilitaet' }
      ],
      schwer: [
        { frage: 'Wie nennt man das schnelle Reagieren auf ein Signal im Sport?', loesung: 'Reaktionsfaehigkeit' },
        { frage: 'Wie nennt man genau abgestimmte Bewegungsablaeufe?', loesung: 'Technik' }
      ]
    },
    training: {
      leicht: [
        { frage: 'Wie nennt man die Fähigkeit, lange aktiv zu bleiben?', loesung: 'Ausdauer' },
        { frage: 'Wie nennt man die Fähigkeit, viel Kraft aufbringen zu können?', loesung: 'Kraft' }
      ],
      mittel: [
        { frage: 'Wie nennt man die Erholungsphase nach Belastung?', loesung: 'Regeneration' },
        { frage: 'Was sollte ein Training neben Belastung immer auch enthalten?', loesung: 'Erholung' }
      ],
      schwer: [
        { frage: 'Wie nennt man einen planmaessigen Wechsel zwischen Belastung und Pause?', loesung: 'Trainingssteuerung' },
        { frage: 'Wie nennt man das langsame Gewöhnen des Körpers an steigende Anforderungen?', loesung: 'Anpassung' }
      ]
    },
    regeln: {
      leicht: [
        { frage: 'Wie nennt man respektvolles und faires Verhalten im Sport?', loesung: 'Fair Play' },
        { frage: 'Warum gibt es Regeln im Sport: für Chaos oder für Fairness?', loesung: 'Fairness' }
      ],
      mittel: [
        { frage: 'Wie nennt man jemanden, der im Spiel auf die Einhaltung der Regeln achtet?', loesung: 'Schiedsrichter' },
        { frage: 'Wie nennt man die Zusammenarbeit innerhalb einer Mannschaft?', loesung: 'Teamarbeit' }
      ],
      schwer: [
        { frage: 'Wie nennt man absichtliches Benachteiligen anderer entgegen den Regeln?', loesung: 'Unsportlichkeit' },
        { frage: 'Welcher Grundgedanke steht über dem Gewinnen im Schulsport?', loesung: 'Fairness' }
      ]
    }
  };

  return pickExpandedTask_(tasksByTopic[thema][difficulty], 'sport::' + klasse + '::' + thema + '::' + difficulty, 20);
}

function createReligionEthicsTask(thema, klasse) {
  const difficulty = getDifficultyLevel(klasse);
  const tasksByTopic = {
    katholisch: {
      leicht: [
        { frage: 'Wie heisst das wichtigste Buch des Christentums?', loesung: 'Bibel' },
        { frage: 'Wie nennt man die Feier mit Brot und Wein in der katholischen Kirche?', loesung: 'Eucharistie' }
      ],
      mittel: [
        { frage: 'Wie nennt man die Leitung der katholischen Kirche weltweit?', loesung: 'Papst' },
        { frage: 'Wie heissen besondere heilige Handlungen wie Taufe und Eucharistie?', loesung: 'Sakramente' }
      ],
      schwer: [
        { frage: 'Wie nennt man die Gemeinschaft aller Glaubenden in der Kirche?', loesung: 'Gemeinde' },
        { frage: 'Wie heisst die Vorbereitung auf Ostern in der katholischen Tradition?', loesung: 'Fastenzeit' }
      ]
    },
    evangelisch: {
      leicht: [
        { frage: 'Wie hiess der Reformator Martin ___?', loesung: 'Luther' },
        { frage: 'Wie heisst das heilige Buch im evangelischen Glauben ebenfalls?', loesung: 'Bibel' }
      ],
      mittel: [
        { frage: 'Wie nennt man die kirchliche Bewegung, die eng mit Martin Luther verbunden ist?', loesung: 'Reformation' },
        { frage: 'Wie nennt man die Predigt- und Gottesdienstgemeinschaft vor Ort?', loesung: 'Gemeinde' }
      ],
      schwer: [
        { frage: 'Welcher Grundgedanke der Reformation betont den Glauben besonders stark?', loesung: 'Glaube' },
        { frage: 'Wie nennt man das Vertrauen auf Gottes Wort als wichtigen evangelischen Bezugspunkt?', loesung: 'Schriftprinzip' }
      ]
    },
    philosophie: {
      leicht: [
        { frage: 'Wie nennt man das Nachdenken über gutes und richtiges Handeln?', loesung: 'Ethik' },
        { frage: 'Wie nennt man die Liebe zur Weisheit auf Deutsch erklaert?', loesung: 'Philosophie' }
      ],
      mittel: [
        { frage: 'Wie nennt man Regeln oder Vorstellungen, an denen wir Handeln beurteilen?', loesung: 'Werte' },
        { frage: 'Wie nennt man die Pflicht, für eigenes Handeln einzustehen?', loesung: 'Verantwortung' }
      ],
      schwer: [
        { frage: 'Wie nennt man eine Begruendung dafür, warum etwas richtig oder falsch sein soll?', loesung: 'Argument' },
        { frage: 'Wie nennt man die Achtung vor jedem Menschen als moralischen Grundsatz?', loesung: 'Menschenwuerde' }
      ]
    }
  };

  return pickExpandedTask_(tasksByTopic[thema][difficulty], 'religion_ethik::' + klasse + '::' + thema + '::' + difficulty, 20);
}
