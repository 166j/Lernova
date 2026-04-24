function activateTeacherMode(authToken) {
  const session = requireAuthorizedSession(authToken);
  const teacherKey = getTeacherIdentityKey_(session);
  if (!teacherKey) {
    throw new Error('Dieses Konto kann nicht als Lehrerkonto aktiviert werden.');
  }

  upsertTeacherRecord_(teacherKey, session.displayName || teacherKey);
  return refreshSessionRole_(session);
}

function getTeacherDashboard(authToken) {
  const session = requireTeacherSession_(authToken);
  const teacherKey = getTeacherIdentityKey_(session);
  const classes = enrichTeacherClasses_(getClassesForTeacher_(teacherKey), teacherKey);
  const activities = getActivitiesForTeacher_(teacherKey, 80);

  return {
    classes: classes.map(sanitizeClassroom_),
    activities: activities.map(sanitizeActivity_)
  };
}

function createTeacherClassroom(authToken, payload) {
  const session = requireTeacherSession_(authToken);
  const teacherKey = getTeacherIdentityKey_(session);
  const safePayload = payload || {};
  const className = String(safePayload.className || '').trim();
  const classLevel = String(safePayload.classLevel || '').trim();

  if (!className) {
    throw new Error('Bitte gib einen Klassennamen ein.');
  }

  const sheet = getSheet_(TEACHER_SHEETS.classes);
  const classId = Utilities.getUuid();
  const classCode = generateUniqueClassCode_();
  const now = new Date().toISOString();

  sheet.appendRow([
    classId,
    teacherKey,
    session.displayName || teacherKey,
    className,
    classLevel,
    classCode,
    now,
    now
  ]);

  return sanitizeClassroom_({
    classId: classId,
    teacherEmail: teacherKey,
    teacherName: session.displayName || teacherKey,
    className: className,
    classLevel: classLevel,
    classCode: classCode,
    createdAt: now,
    updatedAt: now
  });
}

function regenerateTeacherClassCode(authToken, classId) {
  const session = requireTeacherSession_(authToken);
  const teacherKey = getTeacherIdentityKey_(session);
  const targetClassId = String(classId || '').trim();
  if (!targetClassId) {
    throw new Error('Klasse nicht gefunden.');
  }

  const sheet = getSheet_(TEACHER_SHEETS.classes);
  const rows = getSheetObjects_(sheet);
  const rowIndex = rows.findIndex(function(row) {
    return row.classId === targetClassId && row.teacherEmail === teacherKey;
  });

  if (rowIndex === -1) {
    throw new Error('Diese Klasse gehört nicht zu deinem Konto.');
  }

  const nextCode = generateUniqueClassCode_();
  const updatedAt = new Date().toISOString();
  const targetRowNumber = rowIndex + 2;
  const classCodeColumn = getSheetColumnIndex_(TEACHER_SHEETS.classes, 'classCode');
  const updatedAtColumn = getSheetColumnIndex_(TEACHER_SHEETS.classes, 'updatedAt');

  sheet.getRange(targetRowNumber, classCodeColumn).setValue(nextCode);
  sheet.getRange(targetRowNumber, updatedAtColumn).setValue(updatedAt);

  rows[rowIndex].classCode = nextCode;
  rows[rowIndex].updatedAt = updatedAt;
  return sanitizeClassroom_(rows[rowIndex]);
}

function logStudentActivity_(session, entry) {
  if (!session || !session.role || session.role !== 'student') {
    return;
  }

  if (!session.classId && !session.teacherEmail) {
    return;
  }

  const safeEntry = entry || {};
  const sheet = getSheet_(TEACHER_SHEETS.activities);
  sheet.appendRow([
    Utilities.getUuid(),
    new Date().toISOString(),
    session.teacherEmail || '',
    session.classId || '',
    session.className || '',
    session.displayName || '',
    session.studentKey || '',
    session.method || '',
    session.email || '',
    String(safeEntry.actionType || ''),
    String(safeEntry.subject || ''),
    String(safeEntry.topic || ''),
    String(safeEntry.subtopic || ''),
    String(safeEntry.detail || ''),
    String(safeEntry.status || '')
  ]);
}

function joinStudentClassroom(authToken, classCode) {
  const session = requireAuthorizedSession(authToken);
  if ((session.role || 'student') !== 'student') {
    throw new Error('Nur Schüler können Klassen beitreten.');
  }

  const classroom = joinStudentToClass_(session.username || session.displayName || session.studentKey, classCode);
  session.activeClassId = classroom.classId;
  session.classId = classroom.classId;
  session.className = classroom.className;
  session.classCode = classroom.classCode;
  session.teacherEmail = classroom.teacherEmail;
  session.studentKey = buildStudentKey_(session.username || session.displayName || 'student', classroom.classId);
  session.classMemberships = getStudentClassesForUsername_(session.username || session.displayName || session.studentKey);
  persistAuthSession_(session);

  return sanitizeAuthSession_(session);
}

function switchStudentClassroom(authToken, classId) {
  const session = requireAuthorizedSession(authToken);
  const targetClassId = String(classId || '').trim();
  const memberships = getStudentClassesForUsername_(session.username || session.displayName || session.studentKey);
  const nextClass = memberships.find(function(item) {
    return item.classId === targetClassId;
  });

  if (!nextClass) {
    throw new Error('Diese Klasse ist nicht mit deinem Konto verknüpft.');
  }

  session.activeClassId = nextClass.classId;
  session.classId = nextClass.classId;
  session.className = nextClass.className;
  session.classCode = nextClass.classCode;
  session.teacherEmail = nextClass.teacherEmail;
  session.studentKey = buildStudentKey_(session.username || session.displayName || 'student', nextClass.classId);
  session.classMemberships = memberships;
  persistAuthSession_(session);

  return sanitizeAuthSession_(session);
}

function requireTeacherSession_(authToken) {
  const session = requireAuthorizedSession(authToken);
  const refreshed = refreshSessionRole_(session);
  if (refreshed.role !== 'teacher') {
    throw new Error('Diese Funktion ist nur im Lehrermodus verfügbar.');
  }
  return refreshed;
}

function refreshSessionRole_(session) {
  if (!session) {
    return null;
  }

  const nextRole = isTeacherEmail_(getTeacherIdentityKey_(session)) ? 'teacher' : 'student';
  if (session.role === nextRole) {
    return session;
  }

  session.role = nextRole;
  persistAuthSession_(session);
  return session;
}

function isTeacherEmail_(email) {
  const normalizedEmail = normalizeTeacherIdentityKey_(email);
  if (!normalizedEmail) {
    return false;
  }

  return getTeacherRecords_().some(function(record) {
    return record.teacherEmail === normalizedEmail;
  });
}

function upsertTeacherRecord_(email, displayName) {
  const normalizedEmail = normalizeTeacherIdentityKey_(email);
  if (!normalizedEmail) {
    throw new Error('Konto-ID fehlt.');
  }

  const sheet = getSheet_(TEACHER_SHEETS.teachers);
  const rows = getSheetObjects_(sheet);
  const matchIndex = rows.findIndex(function(row) {
    return row.teacherEmail === normalizedEmail;
  });
  const now = new Date().toISOString();

  if (matchIndex === -1) {
    sheet.appendRow([normalizedEmail, String(displayName || normalizedEmail), now]);
    return;
  }

  const rowNumber = matchIndex + 2;
  sheet.getRange(rowNumber, getSheetColumnIndex_(TEACHER_SHEETS.teachers, 'displayName')).setValue(String(displayName || normalizedEmail));
}

function getTeacherRecords_() {
  return getSheetObjects_(getSheet_(TEACHER_SHEETS.teachers)).map(function(row) {
    return {
      teacherEmail: normalizeTeacherIdentityKey_(row.teacherEmail),
      displayName: String(row.displayName || '').trim(),
      enabledAt: String(row.enabledAt || '')
    };
  }).filter(function(row) {
    return !!row.teacherEmail;
  });
}

function getClassesForTeacher_(teacherEmail) {
  const normalizedEmail = normalizeTeacherIdentityKey_(teacherEmail);
  return getSheetObjects_(getSheet_(TEACHER_SHEETS.classes)).map(normalizeClassroomRow_).filter(function(row) {
    return row.teacherEmail === normalizedEmail;
  });
}

function findClassByCode_(code) {
  const normalizedCode = normalizeClassCode_(code);
  if (!normalizedCode) {
    return null;
  }

  const rows = getSheetObjects_(getSheet_(TEACHER_SHEETS.classes)).map(normalizeClassroomRow_);
  return rows.find(function(row) {
    return row.classCode === normalizedCode;
  }) || null;
}

function getActivitiesForTeacher_(teacherEmail, limit) {
  const normalizedEmail = normalizeTeacherIdentityKey_(teacherEmail);
  const items = getSheetObjects_(getSheet_(TEACHER_SHEETS.activities)).map(normalizeActivityRow_).filter(function(row) {
    return row.teacherEmail === normalizedEmail;
  });

  items.sort(function(left, right) {
    return String(right.timestamp || '').localeCompare(String(left.timestamp || ''));
  });

  return items.slice(0, limit || 50);
}

function normalizeClassroomRow_(row) {
  return {
    classId: String(row.classId || '').trim(),
    teacherEmail: normalizeTeacherIdentityKey_(row.teacherEmail),
    teacherName: String(row.teacherName || '').trim(),
    className: String(row.className || '').trim(),
    classLevel: String(row.classLevel || '').trim(),
    classCode: normalizeClassCode_(row.classCode),
    createdAt: String(row.createdAt || ''),
    updatedAt: String(row.updatedAt || '')
  };
}

function sanitizeClassroom_(row) {
  return {
    classId: row.classId,
    className: row.className,
    classLevel: row.classLevel,
    classCode: row.classCode,
    teacherName: row.teacherName,
    studentCount: parseInt(row.studentCount, 10) || 0,
    lastActivityAt: row.lastActivityAt || '',
    students: Array.isArray(row.students) ? row.students.map(sanitizeStudentSummary_) : [],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

function sanitizeStudentSummary_(row) {
  return {
    studentName: row.studentName,
    selectionKey: row.selectionKey,
    joinedAt: row.joinedAt,
    updatedAt: row.updatedAt,
    activityCount: parseInt(row.activityCount, 10) || 0,
    lastActivityAt: row.lastActivityAt || '',
    lastActionType: row.lastActionType || ''
  };
}

function getStudentClassesForUsername_(username) {
  const usernameKey = normalizeStudentName_(username);
  if (!usernameKey) {
    return [];
  }

  const memberships = getSheetObjects_(getSheet_(TEACHER_SHEETS.memberships)).filter(function(row) {
    return normalizeStudentName_(row.usernameKey || row.studentName || '') === usernameKey;
  });
  const classesById = {};

  getSheetObjects_(getSheet_(TEACHER_SHEETS.classes)).map(normalizeClassroomRow_).forEach(function(row) {
    classesById[row.classId] = row;
  });

  return memberships.map(function(row) {
    const classroom = classesById[String(row.classId || '').trim()];
    if (!classroom) {
      return null;
    }

    return {
      classId: classroom.classId,
      className: classroom.className,
      classLevel: classroom.classLevel,
      classCode: classroom.classCode,
      teacherName: classroom.teacherName,
      teacherEmail: classroom.teacherEmail,
      joinedAt: String(row.joinedAt || ''),
      updatedAt: String(row.updatedAt || '')
    };
  }).filter(Boolean);
}

function joinStudentToClass_(username, classCode) {
  const normalizedUsername = String(username || '').trim();
  const usernameKey = normalizeStudentName_(normalizedUsername);
  const classroom = findClassByCode_(classCode);

  if (!usernameKey) {
    throw new Error('Bitte gib zuerst einen Benutzernamen ein.');
  }

  if (!classroom) {
    throw new Error('Der Klassen-Code ist ungültig.');
  }

  const sheet = getSheet_(TEACHER_SHEETS.memberships);
  const rows = getSheetObjects_(sheet);
  const existingIndex = rows.findIndex(function(row) {
    return normalizeStudentName_(row.usernameKey || row.studentName || '') === usernameKey
      && String(row.classId || '').trim() === classroom.classId;
  });
  const now = new Date().toISOString();

  if (existingIndex === -1) {
    sheet.appendRow([
      Utilities.getUuid(),
      usernameKey,
      normalizedUsername,
      classroom.classId,
      now,
      now
    ]);
  } else {
    const rowNumber = existingIndex + 2;
    sheet.getRange(rowNumber, getSheetColumnIndex_(TEACHER_SHEETS.memberships, 'studentName')).setValue(normalizedUsername);
    sheet.getRange(rowNumber, getSheetColumnIndex_(TEACHER_SHEETS.memberships, 'updatedAt')).setValue(now);
  }

  return classroom;
}

function normalizeActivityRow_(row) {
  return {
    eventId: String(row.eventId || ''),
    timestamp: String(row.timestamp || ''),
    teacherEmail: normalizeTeacherIdentityKey_(row.teacherEmail),
    classId: String(row.classId || ''),
    className: String(row.className || ''),
    studentName: String(row.studentName || ''),
    studentKey: String(row.studentKey || ''),
    loginMethod: String(row.loginMethod || ''),
    userEmail: String(row.userEmail || ''),
    actionType: String(row.actionType || ''),
    subject: String(row.subject || ''),
    topic: String(row.topic || ''),
    subtopic: String(row.subtopic || ''),
    detail: String(row.detail || ''),
    status: String(row.status || '')
  };
}

function sanitizeActivity_(row) {
  return {
    classId: row.classId,
    timestamp: row.timestamp,
    className: row.className,
    studentName: row.studentName,
    selectionKey: buildStudentSelectionKey_(row.studentName, row.studentKey),
    actionType: row.actionType,
    subject: row.subject,
    topic: row.topic,
    subtopic: row.subtopic,
    detail: row.detail,
    status: row.status
  };
}

function enrichTeacherClasses_(classes, teacherEmail) {
  const safeClasses = Array.isArray(classes) ? classes.slice() : [];
  const classLookup = {};
  const memberships = getSheetObjects_(getSheet_(TEACHER_SHEETS.memberships));
  const activities = getActivitiesForTeacher_(teacherEmail, 500);
  const studentStatsByClass = {};

  safeClasses.forEach(function(item) {
    classLookup[item.classId] = item;
    studentStatsByClass[item.classId] = {};
  });

  memberships.forEach(function(row) {
    const classId = String(row.classId || '').trim();
    const classroom = classLookup[classId];
    const studentName = String(row.studentName || '').trim();
    const selectionKey = buildStudentSelectionKey_(studentName, row.usernameKey);
    if (!classroom || !selectionKey) {
      return;
    }

    studentStatsByClass[classId][selectionKey] = {
      studentName: studentName || 'Unbekannt',
      selectionKey: selectionKey,
      joinedAt: String(row.joinedAt || ''),
      updatedAt: String(row.updatedAt || ''),
      activityCount: 0,
      lastActivityAt: '',
      lastActionType: ''
    };
  });

  activities.forEach(function(row) {
    const classId = String(row.classId || '').trim();
    const selectionKey = buildStudentSelectionKey_(row.studentName, row.studentKey);
    if (!studentStatsByClass[classId] || !selectionKey) {
      return;
    }

    if (!studentStatsByClass[classId][selectionKey]) {
      studentStatsByClass[classId][selectionKey] = {
        studentName: String(row.studentName || '').trim() || 'Unbekannt',
        selectionKey: selectionKey,
        joinedAt: '',
        updatedAt: '',
        activityCount: 0,
        lastActivityAt: '',
        lastActionType: ''
      };
    }

    studentStatsByClass[classId][selectionKey].activityCount += 1;
    if (!studentStatsByClass[classId][selectionKey].lastActivityAt || String(row.timestamp || '') > String(studentStatsByClass[classId][selectionKey].lastActivityAt || '')) {
      studentStatsByClass[classId][selectionKey].lastActivityAt = String(row.timestamp || '');
      studentStatsByClass[classId][selectionKey].lastActionType = String(row.actionType || '');
    }
  });

  return safeClasses.map(function(item) {
    const students = Object.keys(studentStatsByClass[item.classId] || {}).map(function(selectionKey) {
      return studentStatsByClass[item.classId][selectionKey];
    }).sort(function(left, right) {
      if (String(right.lastActivityAt || '') !== String(left.lastActivityAt || '')) {
        return String(right.lastActivityAt || '').localeCompare(String(left.lastActivityAt || ''));
      }
      return String(left.studentName || '').localeCompare(String(right.studentName || ''));
    });

    return Object.assign({}, item, {
      students: students,
      studentCount: students.length,
      lastActivityAt: students.length ? students[0].lastActivityAt : ''
    });
  });
}

function buildStudentSelectionKey_(studentName, fallbackKey) {
  const nameKey = normalizeStudentName_(studentName);
  if (nameKey) {
    return nameKey;
  }
  return String(fallbackKey || '').trim().toLowerCase();
}

function generateUniqueClassCode_() {
  const existingCodes = getSheetObjects_(getSheet_(TEACHER_SHEETS.classes)).map(function(row) {
    return normalizeClassCode_(row.classCode);
  });

  for (var attempt = 0; attempt < 20; attempt++) {
    var code = buildReadableCode_();
    if (existingCodes.indexOf(code) === -1) {
      return code;
    }
  }

  throw new Error('Es konnte kein eindeutiger Klassen-Code erzeugt werden.');
}

function buildReadableCode_() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = [];

  for (var segmentIndex = 0; segmentIndex < 2; segmentIndex++) {
    var part = '';
    for (var charIndex = 0; charIndex < 4; charIndex++) {
      part += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    segments.push(part);
  }

  return segments.join('-');
}

function normalizeClassCode_(code) {
  return String(code || '')
    .trim()
    .replace(/\s+/g, '')
    .toUpperCase();
}

function getTeacherIdentityKey_(sessionOrValue) {
  if (sessionOrValue && typeof sessionOrValue === 'object') {
    return normalizeTeacherIdentityKey_(sessionOrValue.email || sessionOrValue.studentKey || sessionOrValue.displayName || '');
  }
  return normalizeTeacherIdentityKey_(sessionOrValue);
}

function normalizeTeacherIdentityKey_(value) {
  return String(value || '').trim().toLowerCase();
}

var TEACHER_SHEETS = {
  teachers: {
    name: 'teachers',
    headers: ['teacherEmail', 'displayName', 'enabledAt']
  },
  classes: {
    name: 'classes',
    headers: ['classId', 'teacherEmail', 'teacherName', 'className', 'classLevel', 'classCode', 'createdAt', 'updatedAt']
  },
  activities: {
    name: 'activities',
    headers: ['eventId', 'timestamp', 'teacherEmail', 'classId', 'className', 'studentName', 'studentKey', 'loginMethod', 'userEmail', 'actionType', 'subject', 'topic', 'subtopic', 'detail', 'status']
  },
  memberships: {
    name: 'memberships',
    headers: ['membershipId', 'usernameKey', 'studentName', 'classId', 'joinedAt', 'updatedAt']
  }
};

function getSheet_(definition) {
  const spreadsheet = getTeacherDataSpreadsheet_();
  var sheet = spreadsheet.getSheetByName(definition.name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(definition.name);
    sheet.appendRow(definition.headers);
    sheet.setFrozenRows(1);
  }

  const headerValues = sheet.getRange(1, 1, 1, definition.headers.length).getValues()[0];
  const matches = definition.headers.every(function(header, index) {
    return headerValues[index] === header;
  });

  if (!matches) {
    sheet.getRange(1, 1, 1, definition.headers.length).setValues([definition.headers]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function getSheetObjects_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    return [];
  }

  const headers = values[0];
  return values.slice(1).map(function(row) {
    return headers.reduce(function(result, header, index) {
      result[header] = row[index];
      return result;
    }, {});
  }).filter(function(row) {
    return Object.keys(row).some(function(key) {
      return row[key] !== '' && row[key] !== null;
    });
  });
}

function getSheetColumnIndex_(definition, headerName) {
  return definition.headers.indexOf(headerName) + 1;
}

function getTeacherDataSpreadsheet_() {
  const properties = PropertiesService.getScriptProperties();
  var spreadsheetId = properties.getProperty('LERNOVA_DATA_SPREADSHEET_ID');

  if (spreadsheetId) {
    return SpreadsheetApp.openById(spreadsheetId);
  }

  const spreadsheet = SpreadsheetApp.create('Lernova Teacher Data');
  properties.setProperty('LERNOVA_DATA_SPREADSHEET_ID', spreadsheet.getId());
  return spreadsheet;
}
