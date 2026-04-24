function getAuthStatus(authToken) {
  const session = readAuthSession_(authToken);
  return {
    authenticated: !!session,
    session: session ? sanitizeAuthSession_(refreshSessionRole_(session)) : null
  };
}

function getGoogleLoginConfig() {
  return {
    clientId: String(PropertiesService.getScriptProperties().getProperty('GOOGLE_CLIENT_ID') || '').trim()
  };
}

function getAccountSuffixPreview(displayName) {
  const normalizedName = normalizeAccountDisplayName_(displayName);
  if (!normalizedName) {
    return { suffix: '#0001', handle: '' };
  }

  const nextSuffix = getNextAccountSuffix_(normalizedName);
  return {
    suffix: formatAccountSuffix_(nextSuffix),
    handle: normalizedName + formatAccountSuffix_(nextSuffix)
  };
}

function createLocalAccount(displayName, password) {
  const normalizedName = normalizeAccountDisplayName_(displayName);
  const normalizedPassword = String(password || '');

  if (!normalizedName) {
    throw new Error('Bitte gib zuerst deinen Namen ein.');
  }

  validateAccountPassword_(normalizedPassword);

  const suffixNumber = getNextAccountSuffix_(normalizedName);
  const suffix = formatAccountSuffix_(suffixNumber);
  const handle = normalizedName + suffix;
  const now = new Date().toISOString();
  const account = {
    handle: handle,
    displayName: normalizedName,
    suffix: suffix,
    passwordHash: hashPassword_(normalizedPassword),
    createdAt: now
  };

  saveLocalAccount_(account);

  return createAuthResponse_({
    method: 'account',
    role: 'student',
    displayName: handle,
    email: handle.toLowerCase(),
    studentKey: handle,
    loginLabel: handle
  });
}

function loginWithLocalAccount(handle, password) {
  const normalizedHandle = normalizeAccountHandle_(handle);
  const normalizedPassword = String(password || '');

  if (!normalizedHandle) {
    throw new Error('Bitte gib deinen Namen mit #0001 ein.');
  }

  if (!normalizedPassword) {
    throw new Error('Bitte gib dein Passwort ein.');
  }

  const account = loadLocalAccount_(normalizedHandle);
  if (!account) {
    throw new Error('Dieser Account wurde nicht gefunden.');
  }

  if (account.passwordHash !== hashPassword_(normalizedPassword)) {
    throw new Error('Das Passwort ist falsch.');
  }

  return createAuthResponse_({
    method: 'account',
    role: 'student',
    displayName: account.handle,
    email: account.handle.toLowerCase(),
    studentKey: account.handle,
    loginLabel: account.handle
  });
}

function loginWithGoogleToken(accessToken) {
  const token = String(accessToken || '').trim();
  if (!token) {
    throw new Error('Google-Login fehlgeschlagen: Zugriffstoken fehlt.');
  }

  const response = UrlFetchApp.fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: 'Bearer ' + token
    },
    muteHttpExceptions: true
  });

  if (response.getResponseCode() >= 400) {
    throw new Error('Google-Login fehlgeschlagen: Kontoinformationen konnten nicht geladen werden.');
  }

  const profile = JSON.parse(response.getContentText() || '{}');
  const email = String(profile.email || '').trim().toLowerCase();
  const displayName = String(profile.name || profile.email || '').trim();
  const emailVerified = profile.email_verified !== false;

  if (!email || !emailVerified) {
    throw new Error('Das ausgewählte Google-Konto hat keine bestätigte E-Mail-Adresse.');
  }

  const allowedEmails = getAllowedGoogleEmails_();
  if (allowedEmails.length && allowedEmails.indexOf(email) === -1) {
    throw new Error('Dieses Google-Konto ist für Lernova nicht freigeschaltet.');
  }

  return createAuthResponse_({
    method: 'google',
    role: isTeacherEmail_(email) ? 'teacher' : 'student',
    displayName: displayName,
    email: email,
    studentKey: email,
    loginLabel: displayName
  });
}

function loginWithGoogleAccount() {
  const email = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase();
  if (!email) {
    throw new Error('Google-Anmeldung ist in dieser Web-App noch nicht direkt verfügbar. Hinterlege GOOGLE_CLIENT_ID für die Kontoauswahl oder veröffentliche die App mit Google-Login.');
  }

  const allowedEmails = getAllowedGoogleEmails_();
  if (allowedEmails.length && allowedEmails.indexOf(email) === -1) {
    throw new Error('Dieses Google-Konto ist für Lernova nicht freigeschaltet.');
  }

  return createAuthResponse_({
    method: 'google',
    role: isTeacherEmail_(email) ? 'teacher' : 'student',
    displayName: email,
    email: email,
    studentKey: email,
    loginLabel: email
  });
}

function logout(authToken) {
  const normalizedToken = String(authToken || '').trim();
  if (normalizedToken) {
    CacheService.getScriptCache().remove(buildAuthCacheKey_(normalizedToken));
  }
  return { success: true };
}

function requireAuthorizedSession(authToken) {
  const session = readAuthSession_(authToken);
  if (!session) {
    throw new Error('Die Anmeldung ist abgelaufen. Bitte melde dich erneut an.');
  }
  return session;
}

function createAuthResponse_(sessionPayload) {
  const token = Utilities.getUuid();
  const session = {
    token: token,
    method: sessionPayload.method,
    role: sessionPayload.role || 'student',
    displayName: sessionPayload.displayName,
    email: sessionPayload.email || '',
    classId: sessionPayload.classId || '',
    className: sessionPayload.className || '',
    classCode: sessionPayload.classCode || '',
    teacherEmail: sessionPayload.teacherEmail || '',
    studentKey: sessionPayload.studentKey || '',
    loginLabel: sessionPayload.loginLabel || sessionPayload.displayName || '',
    issuedAt: new Date().toISOString()
  };

  enrichStudentSessionWithMemberships_(session);
  persistAuthSession_(session);

  return {
    token: token,
    session: sanitizeAuthSession_(session)
  };
}

function readAuthSession_(authToken) {
  const normalizedToken = String(authToken || '').trim();
  if (!normalizedToken) {
    return null;
  }

  const raw = CacheService.getScriptCache().get(buildAuthCacheKey_(normalizedToken));
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.token !== normalizedToken) {
      return null;
    }
    return parsed;
  } catch (error) {
    return null;
  }
}

function sanitizeAuthSession_(session) {
  const safeSession = session || {};
  const profileSummary = (safeSession.role || 'student') === 'student'
    ? buildProfileSummary_(loadUserProfileForSession_(safeSession))
    : null;

  return {
    method: safeSession.method,
    role: safeSession.role || 'student',
    displayName: safeSession.displayName,
    email: safeSession.email || '',
    classId: safeSession.classId || '',
    className: safeSession.className || '',
    classCode: safeSession.classCode || '',
    teacherEmail: safeSession.teacherEmail || '',
    classMemberships: Array.isArray(safeSession.classMemberships) ? safeSession.classMemberships : [],
    loginLabel: safeSession.loginLabel || safeSession.displayName || '',
    issuedAt: safeSession.issuedAt,
    profile: profileSummary
  };
}

function enrichStudentSessionWithMemberships_(session) {
  if (!session || (session.role || 'student') !== 'student') {
    return session;
  }

  const lookupName = session.displayName || session.studentKey || session.email || '';
  const memberships = getStudentClassesForUsername_(lookupName);
  session.classMemberships = memberships;

  if (!memberships.length) {
    session.classId = '';
    session.className = '';
    session.classCode = '';
    session.teacherEmail = '';
    return session;
  }

  const activeClassId = String(session.classId || session.activeClassId || '').trim();
  const activeMembership = memberships.find(function(item) {
    return item.classId === activeClassId;
  }) || memberships[0];

  session.activeClassId = activeMembership.classId;
  session.classId = activeMembership.classId;
  session.className = activeMembership.className;
  session.classCode = activeMembership.classCode;
  session.teacherEmail = activeMembership.teacherEmail;
  session.studentKey = buildStudentKey_(lookupName, activeMembership.classId);
  return session;
}

function persistAuthSession_(session) {
  CacheService.getScriptCache().put(
    buildAuthCacheKey_(session.token),
    JSON.stringify(session),
    21600
  );
}

function buildAuthCacheKey_(token) {
  return 'lernova-auth-' + token;
}

function getAllowedGoogleEmails_() {
  const raw = PropertiesService.getScriptProperties().getProperty('LERNOVA_ALLOWED_GOOGLE_EMAILS');
  if (!raw) {
    return [];
  }

  return raw
    .split(/[\n,;]+/)
    .map(function(value) {
      return String(value || '').trim().toLowerCase();
    })
    .filter(Boolean);
}

function buildStudentKey_(studentName, classId) {
  return normalizeStudentName_(studentName) + '::' + String(classId || '').trim();
}

function normalizeStudentName_(studentName) {
  return String(studentName || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

function normalizeAccountDisplayName_(displayName) {
  return String(displayName || '')
    .trim()
    .replace(/#/g, '')
    .replace(/\s+/g, ' ');
}

function normalizeAccountHandle_(handle) {
  return String(handle || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*#\s*/g, '#');
}

function validateAccountPassword_(password) {
  if (!String(password || '').trim()) {
    throw new Error('Bitte gib ein Passwort ein.');
  }
  if (String(password).length < 4) {
    throw new Error('Das Passwort muss mindestens 4 Zeichen lang sein.');
  }
}

function getNextAccountSuffix_(displayName) {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const prefix = 'lernova-account-';
  const matchingHandles = Object.keys(properties).filter(function(key) {
    if (key.indexOf(prefix) !== 0) {
      return false;
    }
    const handle = key.slice(prefix.length);
    return handle.indexOf(displayName + '#') === 0;
  });

  let maxSuffix = 0;
  matchingHandles.forEach(function(handle) {
    const match = handle.match(/#(\d{4})$/);
    if (match) {
      maxSuffix = Math.max(maxSuffix, parseInt(match[1], 10) || 0);
    }
  });

  return maxSuffix + 1;
}

function formatAccountSuffix_(number) {
  return '#' + ('0000' + Math.max(1, parseInt(number, 10) || 1)).slice(-4);
}

function buildLocalAccountKey_(handle) {
  return 'lernova-account-' + normalizeAccountHandle_(handle);
}

function saveLocalAccount_(account) {
  PropertiesService.getScriptProperties().setProperty(
    buildLocalAccountKey_(account.handle),
    JSON.stringify(account)
  );
}

function loadLocalAccount_(handle) {
  const raw = PropertiesService.getScriptProperties().getProperty(buildLocalAccountKey_(handle));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function hashPassword_(password) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(password || ''),
    Utilities.Charset.UTF_8
  );

  return Utilities.base64Encode(digest);
}
