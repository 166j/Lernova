function getMathRange(klasse) {
  if (klasse <= 6) {
    return { min: 1, max: 30 };
  }
  if (klasse <= 8) {
    return { min: 10, max: 120 };
  }
  return { min: 50, max: 999 };
}

const TASK_CATALOG_CACHE_ = {};
const TASK_TOPIC_CURSOR_ = {};

function getDifficultyLevel(klasse) {
  if (klasse <= 6) return 'leicht';
  if (klasse <= 8) return 'mittel';
  return 'schwer';
}

function greatestCommonDivisor(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const rest = x % y;
    x = y;
    y = rest;
  }
  return x || 1;
}

function parseMathValue(input) {
  const normalized = String(input || '').trim().replace(',', '.');
  if (!normalized) return NaN;

  if (normalized.indexOf('/') !== -1) {
    const parts = normalized.split('/');
    if (parts.length !== 2) return NaN;
    const numerator = parseFloat(parts[0]);
    const denominator = parseFloat(parts[1]);
    if (!isFinite(numerator) || !isFinite(denominator) || denominator === 0) return NaN;
    return numerator / denominator;
  }

  const value = parseFloat(normalized);
  return isFinite(value) ? value : NaN;
}

function checkMathAnswer(thema, userInput, loesung) {
  const userValue = parseMathValue(userInput);
  const solutionValue = parseMathValue(loesung);
  if (isNaN(userValue) || isNaN(solutionValue)) return false;
  return Math.abs(userValue - solutionValue) < 0.0001;
}

function buildCheckResult(correct, successMessage, failureMessage) {
  return {
    status: correct ? 'correct' : 'incorrect',
    correct: correct,
    message: correct ? successMessage : failureMessage
  };
}

function assessGermanWritingAnswer(userInput) {
  const rawText = String(userInput || '').trim();
  const normalizedText = normalizeText(rawText);
  const words = rawText
    .split(/\s+/)
    .map(function(word) { return normalizeText(word); })
    .filter(Boolean);
  const uniqueWords = words.filter(function(word, index) {
    return words.indexOf(word) === index;
  });
  const sentenceCount = rawText
    .split(/[.!?]+/)
    .map(function(part) { return part.trim(); })
    .filter(Boolean)
    .length;

  if (!normalizedText) {
    return {
      status: 'review',
      correct: false,
      message: 'Schreibcheck: Es steht noch keine Antwort im Feld. Schreibe erst einen eigenen Textentwurf.'
    };
  }

  if (normalizedText.length < 25 || words.length < 5) {
    return {
      status: 'review',
      correct: false,
      message: 'Schreibcheck: Dein Text ist noch zu kurz. Formuliere mindestens einen kleinen zusammenhaengenden Schreibversuch mit mehreren Woertern.'
    };
  }

  if (uniqueWords.length < 4) {
    return {
      status: 'review',
      correct: false,
      message: 'Schreibcheck: Verwende mehr eigene Woerter statt Wiederholungen. So wird dein Schreibversuch aussagekraeftiger.'
    };
  }

  if (sentenceCount === 0 && words.length >= 8) {
    return {
      status: 'review',
      correct: false,
      message: 'Schreibcheck: Trenne deine Gedanken klarer in Saetze. Ein Satzschlusszeichen hilft beim Aufbau.'
    };
  }

  return {
    status: 'review',
    correct: false,
    message: 'Schreibcheck: Dein Text wirkt wie ein echter Schreibversuch. Inhaltlich solltest du jetzt Aufbau, Verständlichkeit und passende Sprache selbst prüfen.'
  };
}

function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/\s+/g, ' ');
}

function normalizeSequence(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeText).join('|');
  }
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeText).join('|');
    }
  } catch (error) {
    // Fallback below.
  }
  return normalizeText(value);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getGradeFromRatio(ratio) {
  const normalized = Math.max(0, Math.min(1, Number(ratio) || 0));
  if (normalized >= 0.92) return 1;
  if (normalized >= 0.81) return 2;
  if (normalized >= 0.67) return 3;
  if (normalized >= 0.50) return 4;
  if (normalized >= 0.30) return 5;
  return 6;
}

function createChoiceTask(frage, optionen, loesung) {
  return {
    type: 'choice',
    frage: frage,
    optionen: shuffleList(optionen),
    loesung: loesung
  };
}

function pickExpandedTask_(entries, scopeKey, minCount) {
  const catalog = buildExpandedTaskCatalog_(entries, scopeKey, minCount || 20);
  if (!catalog.length) {
    throw new Error('Für dieses Thema sind keine Aufgaben vorhanden.');
  }

  const cursorKey = String(scopeKey || 'default');
  const nextIndex = TASK_TOPIC_CURSOR_[cursorKey] || 0;
  TASK_TOPIC_CURSOR_[cursorKey] = nextIndex + 1;
  return cloneTaskDeep_(catalog[nextIndex % catalog.length]);
}

function buildExpandedTaskCatalog_(entries, scopeKey, minCount) {
  const cacheKey = String(scopeKey || 'default') + '::' + String(minCount || 20);
  if (TASK_CATALOG_CACHE_[cacheKey]) {
    return TASK_CATALOG_CACHE_[cacheKey];
  }

  const baseEntries = Array.isArray(entries) ? entries.slice() : [];
  const targetCount = Math.max(parseInt(minCount, 10) || 20, 20);
  const catalog = [];

  if (!baseEntries.length) {
    TASK_CATALOG_CACHE_[cacheKey] = catalog;
    return catalog;
  }

  for (let index = 0; index < targetCount; index += 1) {
    const sourceEntry = baseEntries[index % baseEntries.length];
    const resolvedTask = resolveTaskEntry_(sourceEntry, index, scopeKey);
    catalog.push(applyTaskVariant_(resolvedTask, index, scopeKey));
  }

  TASK_CATALOG_CACHE_[cacheKey] = catalog;
  return catalog;
}

function resolveTaskEntry_(entry, variantIndex, scopeKey) {
  if (typeof entry === 'function') {
    return entry(variantIndex, scopeKey);
  }

  if (Array.isArray(entry)) {
    return {
      type: 'text',
      frage: entry[0],
      loesung: entry[1]
    };
  }

  if (entry && typeof entry === 'object') {
    return cloneTaskDeep_(entry);
  }

  return {
    type: 'text',
    frage: String(entry || ''),
    loesung: ''
  };
}

function applyTaskVariant_(task, variantIndex, scopeKey) {
  const safeTask = task && typeof task === 'object' ? cloneTaskDeep_(task) : { frage: '', loesung: '' };
  const variantNumber = variantIndex + 1;
  const optionen = Array.isArray(safeTask.optionen)
    ? rotateList_(safeTask.optionen, safeTask.optionen.length ? variantIndex % safeTask.optionen.length : 0)
    : [];

  return Object.assign({}, safeTask, {
    id: String(safeTask.id || scopeKey || 'task') + '--' + variantNumber,
    frage: String(safeTask.frage || '') + ' [Aufgabe ' + variantNumber + ']',
    optionen: optionen
  });
}

function rotateList_(list, offset) {
  const safeList = Array.isArray(list) ? list.slice() : [];
  if (!safeList.length) {
    return safeList;
  }

  const normalizedOffset = ((offset % safeList.length) + safeList.length) % safeList.length;
  return safeList.slice(normalizedOffset).concat(safeList.slice(0, normalizedOffset));
}

function cloneTaskDeep_(task) {
  return JSON.parse(JSON.stringify(task));
}

function isAutoGradableTask(task) {
  if (!task || !task.loesung) {
    return false;
  }

  if (task.type === 'choice' || task.type === 'order') {
    return true;
  }

  if (task.type === 'text') {
    const normalizedSolution = normalizeText(task.loesung);
    return normalizedSolution && normalizedSolution !== 'individuelle loesung';
  }

  return false;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffleList(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}
