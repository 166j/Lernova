function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Lernova');
}

function getTasks(authToken, fach, thema, klasse, anzahl, unterthema) {
  const session = requireAuthorizedSession(authToken);
  const taskCount = Math.min(Math.max(parseInt(anzahl, 10) || 5, 1), 20);
  const klassenstufe = parseInt(klasse, 10) || 5;
  const tasks = generateDistinctTasksForSession_(session, fach, thema, klassenstufe, unterthema, taskCount, false);

  logStudentActivity_(session, {
    actionType: 'load_tasks',
    subject: fach,
    topic: thema,
    subtopic: unterthema,
    detail: 'Es wurden ' + taskCount + ' Aufgaben geladen.',
    status: 'ok'
  });

  return tasks;
}

function getTestTasks(authToken, fach, thema, klasse, unterthema) {
  const session = requireAuthorizedSession(authToken);
  const klassenstufe = parseInt(klasse, 10) || 5;
  const tasks = generateDistinctTasksForSession_(session, fach, thema, klassenstufe, unterthema, 20, true);

  if (tasks.length < 20) {
    throw new Error('Für dieses Thema sind noch nicht genug automatisch prüfbare Testaufgaben vorhanden.');
  }

  logStudentActivity_(session, {
    actionType: 'start_test',
    subject: fach,
    topic: thema,
    subtopic: unterthema,
    detail: 'Ein Test mit 20 Aufgaben wurde gestartet.',
    status: 'started'
  });

  return tasks;
}

function evaluateTest(authToken, fach, thema, unterthema, tasks, answers) {
  const session = requireAuthorizedSession(authToken);
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeAnswers = Array.isArray(answers) ? answers : [];
  let correctCount = 0;

  const results = safeTasks.map(function(task, index) {
    const userInput = safeAnswers[index];
    const normalized = normalizeCheckResultForServer_(
      checkAntwort(authToken, fach, thema, userInput, task.loesung, task.type || 'text')
    );

    if (normalized.correct) {
      correctCount += 1;
    }

    return {
      correct: normalized.correct,
      status: normalized.status,
      message: normalized.message
    };
  });

  const totalCount = safeTasks.length;
  const ratio = totalCount ? correctCount / totalCount : 0;
  const note = getGradeFromRatio(ratio);

  logStudentActivity_(session, {
    actionType: 'finish_test',
    subject: fach,
    topic: thema,
    subtopic: unterthema,
    detail: correctCount + ' von ' + totalCount + ' Aufgaben richtig.',
    status: 'note_' + note
  });

  return {
    totalCount: totalCount,
    correctCount: correctCount,
    ratio: ratio,
    note: note,
    results: results
  };
}

function checkAntwort(authToken, fach, thema, userInput, loesung, taskType) {
  const session = requireAuthorizedSession(authToken);
  const result = evaluateAnswerCore_(fach, thema, userInput, loesung, taskType);

  logCheckActivity_(session, fach, thema, result);
  return result;
}

function submitTaskAnswer(authToken, fach, thema, klasse, unterthema, task, userInput) {
  const session = requireAuthorizedSession(authToken);
  const safeTask = task || {};
  const klassenstufe = parseInt(klasse, 10) || safeTask.klasse || 5;
  const result = evaluateAnswerCore_(fach, thema, userInput, safeTask.loesung, safeTask.type || 'text');
  const normalized = normalizeCheckResultForServer_(result);
  const profile = loadUserProfileForSession_(session);
  const taskId = String(safeTask.id || '').trim();

  if (normalized.status === 'review') {
    logCheckActivity_(session, fach, thema, normalized);
    return {
      result: normalized,
      profile: buildProfileSummary_(profile),
      xp: 0,
      feedback: '',
      nextTask: null
    };
  }

  if (normalized.correct && hasTaskBeenRewarded_(profile, taskId)) {
    logCheckActivity_(session, fach, thema, normalized);
    return {
      result: {
        status: normalized.status,
        correct: true,
        message: normalized.message + ' Diese Aufgabe wurde bereits gewertet, deshalb gibt es keine weiteren XP.'
      },
      profile: buildProfileSummary_(profile),
      xp: 0,
      feedback: '',
      nextTask: null,
      alreadyRewarded: true
    };
  }

  if (hasTaskBeenRevealed_(profile, taskId)) {
    logCheckActivity_(session, fach, thema, normalized);
    return {
      result: {
        status: normalized.status,
        correct: normalized.correct,
        message: normalized.message + ' Für diese Aufgabe gibt es keine XP mehr, weil die Lösung schon angezeigt wurde.'
      },
      profile: buildProfileSummary_(profile),
      xp: 0,
      feedback: '',
      nextTask: null,
      alreadyRewarded: true,
      solutionRevealed: true
    };
  }

  const taskMeta = {
    id: taskId,
    thema: thema,
    unterthema: safeTask.unterthema || unterthema || '',
    difficulty: safeTask.difficulty || 'easy'
  };
  const progression = processTaskResult(profile, normalized.correct ? 'correct' : 'wrong', taskMeta.difficulty, taskMeta);
  if (normalized.correct) {
    markTaskAsRewarded_(profile, taskId);
    saveUserProfile_(profile);
    progression.profile = buildProfileSummary_(profile);
  }
  const nextTask = fach === 'deutsch'
    ? selectAdaptiveGermanTask_(profile, klassenstufe, thema, unterthema || safeTask.unterthema || '', safeTask, normalized.correct, [safeTask.id])
    : null;
  const combinedMessage = [normalized.message, progression.feedback].filter(Boolean).join(' ');

  logCheckActivity_(session, fach, thema, normalized);

  return {
    result: {
      status: normalized.status,
      correct: normalized.correct,
      message: combinedMessage
    },
    profile: progression.profile,
    xp: progression.xp,
    feedback: progression.feedback,
    nextTask: nextTask,
    alreadyRewarded: false,
    solutionRevealed: false
  };
}

function markTaskSolutionViewed(authToken, taskId) {
  const session = requireAuthorizedSession(authToken);
  const profile = loadUserProfileForSession_(session);
  markTaskAsRevealed_(profile, taskId);
  profile.lastUpdatedAt = new Date().toISOString();
  saveUserProfile_(profile);
  return { ok: true };
}

function evaluateAnswerCore_(fach, thema, userInput, loesung, taskType) {
  let result;

  if (fach === 'mathe') {
    result = buildCheckResult(
      checkMathAnswer(thema, userInput, loesung),
      'Richtig gelöst.',
      'Noch nicht richtig. Schau dir die Aufgabe oder den Tipp noch einmal an.'
    );
    return result;
  }

  if (fach === 'deutsch' && thema === 'schreiben' && taskType === 'text') {
    result = assessGermanWritingAnswer(userInput);
    return result;
  }

  if (taskType === 'choice') {
    result = buildCheckResult(
      normalizeText(userInput) === normalizeText(loesung),
      'Richtig gelöst.',
      'Noch nicht richtig. Schau dir die Aufgabe oder den Tipp noch einmal an.'
    );
    return result;
  }

  if (taskType === 'order') {
    result = buildCheckResult(
      normalizeSequence(userInput) === normalizeSequence(loesung),
      'Richtig gelöst.',
      'Noch nicht richtig. Schau dir die Aufgabe oder den Tipp noch einmal an.'
    );
    return result;
  }

  result = buildCheckResult(
    normalizeText(userInput) === normalizeText(loesung),
    'Richtig gelöst.',
    'Noch nicht richtig. Schau dir die Aufgabe oder den Tipp noch einmal an.'
  );
  return result;
}

function logCheckActivity_(session, fach, thema, result) {
  const normalized = result && typeof result === 'object'
    ? result
    : { status: result ? 'correct' : 'incorrect', message: '', correct: !!result };

  logStudentActivity_(session, {
    actionType: 'check_answer',
    subject: fach,
    topic: thema,
    detail: normalized.message || '',
    status: normalized.status || (normalized.correct ? 'correct' : 'incorrect')
  });
}

function normalizeCheckResultForServer_(checkResult) {
  if (checkResult && typeof checkResult === 'object') {
    return {
      status: checkResult.status || (checkResult.correct ? 'correct' : 'incorrect'),
      message: checkResult.message || '',
      correct: !!checkResult.correct
    };
  }

  return {
    status: checkResult ? 'correct' : 'incorrect',
    message: '',
    correct: !!checkResult
  };
}

function createTask(fach, thema, klasse, unterthema) {
  if (fach === 'mathe') {
    return createMathTask(thema, klasse);
  }
  if (fach === 'englisch') {
    return createEnglishTask(thema, klasse);
  }
  if (fach === 'deutsch') {
    return createGermanTask(thema, klasse, unterthema);
  }
  if (fach === 'textilkunde') {
    return createTextileTask(thema, klasse);
  }
  if (fach === 'chemie') {
    return createChemistryTask(thema, klasse);
  }
  if (fach === 'geschichte') {
    return createHistoryTask(thema, klasse);
  }
  if (fach === 'physik') {
    return createPhysicsTask(thema, klasse);
  }
  if (fach === 'biologie') {
    return createBiologyTask(thema, klasse);
  }
  if (fach === 'geographie') {
    return createGeographyTask(thema, klasse);
  }
  if (fach === 'politik') {
    return createPoliticsTask(thema, klasse);
  }
  if (fach === 'informatik') {
    return createComputerScienceTask(thema, klasse);
  }
  if (fach === 'technik') {
    return createTechnologyTask(thema, klasse);
  }
  if (fach === 'kunst') {
    return createArtTask(thema, klasse);
  }
  if (fach === 'musik') {
    return createMusicTask(thema, klasse);
  }
  if (fach === 'sport') {
    return createSportTask(thema, klasse);
  }
  if (fach === 'religion_ethik') {
    return createReligionEthicsTask(thema, klasse);
  }

  throw new Error('Unbekanntes Fach: ' + fach);
}

function generateDistinctTasks_(fach, thema, klasse, unterthema, targetCount, autoGradableOnly) {
  return generateDistinctTasksForSession_(null, fach, thema, klasse, unterthema, targetCount, autoGradableOnly);
}

function generateDistinctTasksForSession_(session, fach, thema, klasse, unterthema, targetCount, autoGradableOnly) {
  const tasks = [];
  const fallbackPool = [];
  const seenKeys = {};
  const seenIds = [];
  let safetyCounter = 0;
  const maxAttempts = Math.max(targetCount * 18, 120);
  const profile = session && String(fach || '').toLowerCase() === 'deutsch'
    ? loadUserProfileForSession_(session)
    : null;

  while (tasks.length < targetCount && safetyCounter < maxAttempts) {
    let task = null;
    if (profile && String(fach || '').toLowerCase() === 'deutsch') {
      task = selectAdaptiveGermanTask_(profile, klasse, thema, unterthema, null, true, seenIds);
    }
    if (!task) {
      task = createTask(fach, thema, klasse, unterthema);
    }
    safetyCounter += 1;

    if (autoGradableOnly && !isAutoGradableTask(task)) {
      continue;
    }

    fallbackPool.push(task);

    const taskKey = buildTaskUniquenessKey_(task);
    if (seenKeys[taskKey]) {
      continue;
    }

    seenKeys[taskKey] = true;
    tasks.push(task);
    if (task && task.id) {
      seenIds.push(task.id);
    }
  }

  if (!autoGradableOnly && tasks.length < targetCount && fallbackPool.length) {
    let variantNumber = 1;
    while (tasks.length < targetCount) {
      const sourceTask = fallbackPool[(tasks.length - 1 + fallbackPool.length) % fallbackPool.length];
      tasks.push(buildRepeatedTaskVariant_(sourceTask, variantNumber));
      variantNumber += 1;
    }
  }

  if (tasks.length < targetCount) {
    throw new Error('Für dieses Thema sind noch nicht genug unterschiedliche Aufgaben vorhanden.');
  }

  return tasks;
}

function buildTaskUniquenessKey_(task) {
  const safeTask = task || {};
  const solution = Array.isArray(safeTask.loesung) ? safeTask.loesung.join('||') : String(safeTask.loesung || '');
  return [
    String(safeTask.type || 'text'),
    String(safeTask.frage || ''),
    solution
  ].join('::');
}

function buildRepeatedTaskVariant_(task, variantNumber) {
  const safeTask = task && typeof task === 'object' ? task : {};
  const baseId = String(safeTask.id || 'task');
  return Object.assign({}, safeTask, {
    id: baseId + '__repeat_' + variantNumber,
    variantIndex: variantNumber,
    isRepeatedVariant: true
  });
}
