    // Addition Aufgabe
function getAdditionAufgabe(schwierigkeit) {
  let a, b;
  if (schwierigkeit === 'Leicht') {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
  } else if (schwierigkeit === 'Mittel') {
    a = Math.floor(Math.random() * 90) + 10;
    b = Math.floor(Math.random() * 90) + 10;
  } else {
    a = Math.floor(Math.random() * 900) + 100;
    b = Math.floor(Math.random() * 900) + 100;
  }
  return {
    frage: 'Berechne: ' + a + ' + ' + b,
    loesung: (a + b).toString()
  };
}
function checkAdditionLoesung(userInput, richtigeLoesung) {
  return parseInt(userInput) === parseInt(richtigeLoesung);
}

// Subtraktion Aufgabe
function getSubtraktionAufgabe(schwierigkeit) {
  let a, b;
  if (schwierigkeit === 'Leicht') {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * a);
  } else if (schwierigkeit === 'Mittel') {
    a = Math.floor(Math.random() * 90) + 10;
    b = Math.floor(Math.random() * a);
  } else {
    a = Math.floor(Math.random() * 900) + 100;
    b = Math.floor(Math.random() * a);
  }
  return {
    frage: 'Berechne: ' + a + ' - ' + b,
    loesung: (a - b).toString()
  };
}
function checkSubtraktionLoesung(userInput, richtigeLoesung) {
  return parseInt(userInput) === parseInt(richtigeLoesung);
}

// Multiplikation Aufgabe
function getMultiplikationAufgabe(schwierigkeit) {
  let a, b;
  if (schwierigkeit === 'Leicht') {
    a = Math.floor(Math.random() * 10) + 2;
    b = Math.floor(Math.random() * 10) + 2;
  } else if (schwierigkeit === 'Mittel') {
    a = Math.floor(Math.random() * 20) + 2;
    b = Math.floor(Math.random() * 20) + 2;
  } else {
    a = Math.floor(Math.random() * 90) + 10;
    b = Math.floor(Math.random() * 90) + 10;
  }
  return {
    frage: 'Berechne: ' + a + ' × ' + b,
    loesung: (a * b).toString()
  };
}
function checkMultiplikationLoesung(userInput, richtigeLoesung) {
  return parseInt(userInput) === parseInt(richtigeLoesung);
}

// Division Aufgabe
function getDivisionAufgabe(schwierigkeit) {
  let b, loesung, a;
  if (schwierigkeit === 'Leicht') {
    b = Math.floor(Math.random() * 8) + 2;
    loesung = Math.floor(Math.random() * 8) + 2;
  } else if (schwierigkeit === 'Mittel') {
    b = Math.floor(Math.random() * 19) + 2;
    loesung = Math.floor(Math.random() * 10) + 2;
  } else {
    b = Math.floor(Math.random() * 90) + 10;
    loesung = Math.floor(Math.random() * 90) + 10;
  }
  a = b * loesung;
  return {
    frage: 'Berechne: ' + a + ' ÷ ' + b,
    loesung: loesung.toString()
  };
}
function checkDivisionLoesung(userInput, richtigeLoesung) {
  return parseInt(userInput) === parseInt(richtigeLoesung);
}
/**
 * Mathe-Übungsseite für Klasse 9 (Realschule)
 * Google Apps Script Backend (Code.gs)
 */

function legacyCodeDoNotUse_() {
  return HtmlService.createHtmlOutputFromFile('index');
}

// Bruch Aufgabe
function getBruchAufgabe(schwierigkeit) {
  let zaehler1, nenner1, zaehler2, nenner2;
  if (schwierigkeit === 'Leicht') {
    zaehler1 = Math.floor(Math.random() * 4) + 1;
    nenner1 = Math.floor(Math.random() * 4) + 1;
    zaehler2 = Math.floor(Math.random() * 4) + 1;
    nenner2 = Math.floor(Math.random() * 4) + 1;
  } else if (schwierigkeit === 'Mittel') {
    zaehler1 = Math.floor(Math.random() * 7) + 1;
    nenner1 = Math.floor(Math.random() * 7) + 1;
    zaehler2 = Math.floor(Math.random() * 7) + 1;
    nenner2 = Math.floor(Math.random() * 7) + 1;
  } else {
    zaehler1 = Math.floor(Math.random() * 9) + 1;
    nenner1 = Math.floor(Math.random() * 9) + 1;
    zaehler2 = Math.floor(Math.random() * 9) + 1;
    nenner2 = Math.floor(Math.random() * 9) + 1;
  }
  return {
    frage: 'Berechne: ' + zaehler1 + '/' + nenner1 + ' + ' + zaehler2 + '/' + nenner2,
    loesung: (zaehler1/nenner1 + zaehler2/nenner2).toFixed(2)
  };
}

// Lösung prüfen
function checkBruchLoesung(userInput, richtigeLoesung) {
  return Math.abs(parseFloat(userInput) - parseFloat(richtigeLoesung)) < 0.01;
}
