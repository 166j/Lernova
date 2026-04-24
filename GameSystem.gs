var BADGES = [
  {
    id: 'anfanger',
    title: 'Anfaenger',
    emoji: '🌱',
    description: '10 Aufgaben abgeschlossen',
    condition: function(profile) {
      return profile.stats.total >= 10;
    }
  },
  {
    id: 'grammatik_profi',
    title: 'Grammatik-Profi',
    emoji: '📚',
    description: '20 richtige Grammatik-Aufgaben geloest',
    condition: function(profile, resultMeta) {
      const topicStats = profile.stats && profile.stats.byTopic ? profile.stats.byTopic : {};
      const grammarStats = topicStats.grammatik || {};
      return (grammarStats.correct || 0) >= 20
        || (resultMeta && resultMeta.thema === 'grammatik' && (grammarStats.correct || 0) >= 20);
    }
  },
  {
    id: 'perfekt_serie',
    title: 'Perfekte Serie',
    emoji: '🔥',
    description: '5 richtige Antworten in Folge',
    condition: function(profile) {
      return profile.streak >= 5;
    }
  }
];

function getXPForLevel(level) {
  const safeLevel = Math.max(1, parseInt(level, 10) || 1);
  // Quadratische Kurve: fruehe Level schnell, spaetere Level spuerbar anspruchsvoller.
  const step = safeLevel - 1;
  return Math.floor((40 * step) + (10 * Math.pow(step, 2)));
}

function calculateXP(result, difficulty, streak) {
  const normalizedDifficulty = normalizeDifficulty_(difficulty);
  const normalizedResult = normalizeTaskResult_(result);
  let baseXP = 0;

  if (normalizedResult === 'correct') {
    baseXP = normalizedDifficulty === 'hard' ? 20 : normalizedDifficulty === 'medium' ? 15 : 10;
  } else if (normalizedResult === 'close') {
    baseXP = normalizedDifficulty === 'hard' ? 5 : 3;
  } else {
    baseXP = normalizedDifficulty === 'hard' ? 2 : normalizedDifficulty === 'medium' ? 1 : 0;
  }

  const streakBonus = normalizedResult === 'correct'
    ? 1 + getStreakBonusRate_(streak)
    : 1;

  return Math.floor(baseXP * streakBonus);
}

function updateStreak(profile, isCorrect) {
  profile.streak = isCorrect ? (profile.streak || 0) + 1 : 0;
}

function checkLevelUp(profile) {
  let leveledUp = false;
  while (profile.xp >= getXPForLevel(profile.level + 1)) {
    profile.level += 1;
    leveledUp = true;
  }
  return leveledUp;
}

function getLevelProgress(profile) {
  const safeLevel = Math.max(1, parseInt(profile.level, 10) || 1);
  const currentLevelXP = getXPForLevel(safeLevel);
  const nextLevelXP = getXPForLevel(safeLevel + 1);
  const percent = Math.max(0, Math.min(1, (profile.xp - currentLevelXP) / Math.max(1, nextLevelXP - currentLevelXP)));

  return {
    percent: percent,
    currentLevelXP: currentLevelXP,
    nextLevelXP: nextLevelXP,
    xpIntoLevel: Math.max(0, profile.xp - currentLevelXP),
    xpNeeded: Math.max(0, nextLevelXP - profile.xp)
  };
}

function checkBadges(profile, resultMeta) {
  const unlocked = [];
  const badges = profile.badges || [];

  BADGES.forEach(function(badge) {
    if (badge.condition(profile, resultMeta) && badges.indexOf(badge.id) === -1) {
      badges.push(badge.id);
      unlocked.push(badge.id);
    }
  });

  profile.badges = badges;
  return unlocked;
}

function generateFeedback(result, xp, streak, unlockedBadges, leveledUp) {
  const normalizedResult = normalizeTaskResult_(result);
  const streakInfo = streak >= 2 ? ' | 🔥 Streak x' + streak : '';
  const levelInfo = leveledUp ? ' | ⭐ Level up!' : '';
  const badgeInfo = unlockedBadges && unlockedBadges.length
    ? ' | 🏅 Neuer Badge: ' + unlockedBadges.map(function(id) {
      const badge = getBadgeMeta_(id);
      return badge ? ((badge.emoji ? badge.emoji + ' ' : '') + badge.title) : id;
    }).join(', ')
    : '';

  if (normalizedResult === 'correct') {
    let feedback = '🔥 Perfekt! +' + xp + ' XP';
    const streakBonusPercent = Math.round(getStreakBonusRate_(Math.max(0, streak - 1)) * 100);
    if (streakBonusPercent > 0) {
      feedback += ' (' + streakBonusPercent + '% Streak-Bonus)';
    }
    return feedback + streakInfo + levelInfo + badgeInfo;
  }

  if (normalizedResult === 'close') {
    return '💡 Fast! Schau nochmal genau hin.' + (xp > 0 ? ' +' + xp + ' XP' : '') + badgeInfo;
  }

  return xp > 0
    ? '👀 Versuch\'s nochmal! +' + xp + ' XP fuer deinen Einsatz.'
    : '👀 Versuch\'s nochmal!';
}

function loadUserData(userId) {
  const raw = PropertiesService.getScriptProperties().getProperty(buildUserProfileKey_(userId));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function loadUserProfile(userId) {
  return loadUserData(userId);
}

function saveUserData(user) {
  PropertiesService.getScriptProperties().setProperty(buildUserProfileKey_(user.userId), JSON.stringify(user));
}

function loadUserProfileForSession_(session) {
  const userId = getUserIdFromSession_(session);
  const profile = loadUserProfile(userId) || createDefaultUserProfile_(session);
  profile.userId = userId;
  profile.displayName = session && session.displayName ? session.displayName : profile.displayName || '';
  ensureProfileShape_(profile);
  return profile;
}

function saveUserProfile_(profile) {
  saveUserData(profile);
}

function buildProfileSummary_(profile) {
  const levelProgress = getLevelProgress(profile);
  return {
    xp: profile.xp,
    level: profile.level,
    streak: profile.streak,
    mastery: profile.mastery,
    levelProgress: levelProgress.percent,
    levelProgressDetails: levelProgress,
    stats: profile.stats,
    recentErrors: profile.recentErrors || [],
    errorTopics: profile.errorTopics || {},
    chatHistory: getRecentChatHistory_(profile, 5),
    badges: (profile.badges || []).map(function(id) {
      return getBadgeMeta_(id);
    }).filter(Boolean)
  };
}

function getUserProgress(authToken) {
  const session = requireAuthorizedSession(authToken);
  return buildProfileSummary_(loadUserProfileForSession_(session));
}

function processTaskResult(profile, result, difficulty, taskMeta) {
  const normalizedResult = normalizeTaskResult_(result);
  const isCorrect = normalizedResult === 'correct';
  const xp = calculateXP(normalizedResult, difficulty, profile.streak);

  // Der Ablauf bleibt bewusst linear, damit er leicht erweitert und getestet werden kann.
  profile.xp += xp;
  updateStreak(profile, isCorrect);
  profile.stats.total += 1;

  if (isCorrect) {
    profile.stats.correct += 1;
  } else {
    profile.stats.wrong += 1;
    trackError_(profile, taskMeta);
  }

  updateTopicStats_(profile, taskMeta, isCorrect);

  profile.mastery = calculateMastery_(profile);
  const leveledUp = checkLevelUp(profile);
  const unlockedBadges = checkBadges(profile, taskMeta);
  profile.lastUpdatedAt = new Date().toISOString();

  saveUserProfile_(profile);

  return {
    xp: xp,
    leveledUp: leveledUp,
    unlockedBadges: unlockedBadges,
    profile: buildProfileSummary_(profile),
    feedback: generateFeedback(normalizedResult, xp, profile.streak, unlockedBadges, leveledUp)
  };
}

function appendChatHistory_(profile, role, text) {
  if (!text) {
    return;
  }

  profile.chatHistory = Array.isArray(profile.chatHistory) ? profile.chatHistory : [];
  profile.chatHistory.push({
    role: role,
    text: String(text).trim(),
    timestamp: new Date().toISOString()
  });

  if (profile.chatHistory.length > 5) {
    profile.chatHistory = profile.chatHistory.slice(profile.chatHistory.length - 5);
  }
}

function getRecentChatHistory_(profile, limit) {
  const history = Array.isArray(profile && profile.chatHistory) ? profile.chatHistory : [];
  const safeLimit = Math.max(1, Math.min(5, parseInt(limit, 10) || 5));
  return history.slice(history.length - safeLimit);
}

function buildAdaptiveDifficulty_(profile, previousTask, wasCorrect) {
  if (!wasCorrect && previousTask) {
    return normalizeDifficulty_(previousTask.difficulty || 'easy');
  }

  const mastery = Number(profile && profile.mastery) || 0;
  if (mastery < 0.5) return 'easy';
  if (mastery <= 0.8) return 'medium';
  return 'hard';
}

function selectAdaptiveGermanTask_(profile, klasse, thema, unterthema, previousTask, wasCorrect, excludedIds) {
  const targetDifficulty = buildAdaptiveDifficulty_(profile, previousTask, wasCorrect);
  const preferredSubtopic = !wasCorrect && previousTask && previousTask.unterthema
    ? previousTask.unterthema
    : unterthema;
  const catalog = getGermanTaskCatalogForSelection_(klasse, thema, preferredSubtopic);
  const excludeLookup = arrayToLookup_(excludedIds);
  const available = catalog.filter(function(task) {
    return !excludeLookup[task.id];
  });

  if (previousTask && !wasCorrect) {
    const similar = available.filter(function(task) {
      return task.unterthema === previousTask.unterthema
        && normalizeDifficulty_(task.difficulty) === targetDifficulty
        && task.id !== previousTask.id;
    });
    if (similar.length) {
      return cloneTask_(pick(similar));
    }
  }

  const sameDifficulty = available.filter(function(task) {
    return normalizeDifficulty_(task.difficulty) === targetDifficulty;
  });
  if (sameDifficulty.length) {
    return cloneTask_(pick(sameDifficulty));
  }

  if (available.length) {
    return cloneTask_(pick(available));
  }

  return catalog.length ? cloneTask_(pick(catalog)) : null;
}

function createDefaultUserProfile_(session) {
  return {
    userId: getUserIdFromSession_(session),
    displayName: session && session.displayName ? session.displayName : '',
    xp: 0,
    level: 1,
    streak: 0,
    mastery: 0,
    badges: [],
    stats: {
      total: 0,
      correct: 0,
      wrong: 0,
      byTopic: {}
    },
    recentErrors: [],
    errorTopics: {},
    rewardedTaskIds: [],
    revealedTaskIds: [],
    chatHistory: [],
    lastUpdatedAt: new Date().toISOString()
  };
}

function ensureProfileShape_(profile) {
  profile.xp = parseInt(profile.xp, 10) || 0;
  profile.level = Math.max(1, parseInt(profile.level, 10) || 1);
  profile.streak = Math.max(0, parseInt(profile.streak, 10) || 0);
  profile.mastery = Math.max(0, Math.min(1, Number(profile.mastery) || 0));
  profile.badges = Array.isArray(profile.badges) ? profile.badges : [];
  profile.recentErrors = Array.isArray(profile.recentErrors) ? profile.recentErrors : [];
  profile.errorTopics = profile.errorTopics && typeof profile.errorTopics === 'object' ? profile.errorTopics : {};
  profile.rewardedTaskIds = Array.isArray(profile.rewardedTaskIds) ? profile.rewardedTaskIds : [];
  profile.revealedTaskIds = Array.isArray(profile.revealedTaskIds) ? profile.revealedTaskIds : [];
  profile.chatHistory = Array.isArray(profile.chatHistory) ? profile.chatHistory : [];
  profile.stats = profile.stats && typeof profile.stats === 'object' ? profile.stats : {};
  profile.stats.total = parseInt(profile.stats.total, 10) || 0;
  profile.stats.correct = parseInt(profile.stats.correct, 10) || 0;
  profile.stats.wrong = parseInt(profile.stats.wrong, 10) || 0;
  profile.stats.byTopic = profile.stats.byTopic && typeof profile.stats.byTopic === 'object' ? profile.stats.byTopic : {};
}

function getUserIdFromSession_(session) {
  return String((session && (session.studentKey || session.email || session.displayName)) || 'anonymous');
}

function buildUserProfileKey_(userId) {
  return 'lernova-user-profile-' + String(userId || '').trim().toLowerCase();
}

function calculateMastery_(profile) {
  const total = profile.stats.total || 0;
  return total ? Math.max(0, Math.min(1, (profile.stats.correct || 0) / total)) : 0;
}

function trackError_(profile, taskMeta) {
  const topicKey = [taskMeta && taskMeta.thema, taskMeta && taskMeta.unterthema].filter(Boolean).join('::') || 'allgemein';
  profile.recentErrors.push({
    taskId: taskMeta && taskMeta.id ? taskMeta.id : '',
    thema: taskMeta && taskMeta.thema ? taskMeta.thema : '',
    unterthema: taskMeta && taskMeta.unterthema ? taskMeta.unterthema : '',
    difficulty: taskMeta && taskMeta.difficulty ? taskMeta.difficulty : '',
    timestamp: new Date().toISOString()
  });

  if (profile.recentErrors.length > 8) {
    profile.recentErrors = profile.recentErrors.slice(profile.recentErrors.length - 8);
  }

  profile.errorTopics[topicKey] = (parseInt(profile.errorTopics[topicKey], 10) || 0) + 1;
}

function getBadgeMeta_(id) {
  for (let i = 0; i < BADGES.length; i += 1) {
    if (BADGES[i].id === id) {
      return {
        id: BADGES[i].id,
        title: BADGES[i].title,
        emoji: BADGES[i].emoji || '',
        description: BADGES[i].description
      };
    }
  }
  return null;
}

function hasTaskBeenRewarded_(profile, taskId) {
  const safeTaskId = String(taskId || '').trim();
  if (!safeTaskId) {
    return false;
  }

  return profile.rewardedTaskIds.indexOf(safeTaskId) !== -1;
}

function markTaskAsRewarded_(profile, taskId) {
  const safeTaskId = String(taskId || '').trim();
  if (!safeTaskId || hasTaskBeenRewarded_(profile, safeTaskId)) {
    return;
  }

  profile.rewardedTaskIds.push(safeTaskId);

  if (profile.rewardedTaskIds.length > 250) {
    profile.rewardedTaskIds = profile.rewardedTaskIds.slice(profile.rewardedTaskIds.length - 250);
  }
}

function hasTaskBeenRevealed_(profile, taskId) {
  const safeTaskId = String(taskId || '').trim();
  if (!safeTaskId) {
    return false;
  }

  return profile.revealedTaskIds.indexOf(safeTaskId) !== -1;
}

function markTaskAsRevealed_(profile, taskId) {
  const safeTaskId = String(taskId || '').trim();
  if (!safeTaskId || hasTaskBeenRevealed_(profile, safeTaskId)) {
    return;
  }

  profile.revealedTaskIds.push(safeTaskId);

  if (profile.revealedTaskIds.length > 250) {
    profile.revealedTaskIds = profile.revealedTaskIds.slice(profile.revealedTaskIds.length - 250);
  }
}

function getStreakBonusRate_(streak) {
  const safeStreak = Math.max(0, parseInt(streak, 10) || 0);
  if (safeStreak >= 6) return 0.2;
  if (safeStreak >= 3) return 0.1;
  return 0;
}

function normalizeTaskResult_(result) {
  const value = String(result || '').toLowerCase();
  if (value === 'correct') return 'correct';
  if (value === 'close' || value === 'almost') return 'close';
  return 'wrong';
}

function normalizeDifficulty_(difficulty) {
  const value = String(difficulty || '').toLowerCase();
  if (value === 'hard' || value === 'schwer') return 'hard';
  if (value === 'medium' || value === 'mittel') return 'medium';
  return 'easy';
}

function updateTopicStats_(profile, taskMeta, isCorrect) {
  const topicKey = String(taskMeta && taskMeta.thema || 'allgemein');
  const byTopic = profile.stats.byTopic;

  byTopic[topicKey] = byTopic[topicKey] && typeof byTopic[topicKey] === 'object'
    ? byTopic[topicKey]
    : { total: 0, correct: 0, wrong: 0 };

  byTopic[topicKey].total += 1;
  if (isCorrect) {
    byTopic[topicKey].correct += 1;
  } else {
    byTopic[topicKey].wrong += 1;
  }
}

function arrayToLookup_(list) {
  const lookup = {};
  (Array.isArray(list) ? list : []).forEach(function(value) {
    lookup[String(value || '')] = true;
  });
  return lookup;
}

function cloneTask_(task) {
  return JSON.parse(JSON.stringify(task));
}
