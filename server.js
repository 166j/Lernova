const fs = require('fs');
const path = require('path');
const http = require('http');
const vm = require('vm');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(ROOT, 'data');
const PROPERTIES_PATH = path.join(DATA_DIR, 'properties.json');
const SPREADSHEETS_PATH = path.join(DATA_DIR, 'spreadsheets.json');
const GAS_FILES = fs.readdirSync(ROOT).filter((file) => file.endsWith('.gs')).sort();
const ALLOWED_API_METHODS = new Set([
  'getAuthStatus',
  'getGoogleLoginConfig',
  'getAccountSuffixPreview',
  'createLocalAccount',
  'loginWithLocalAccount',
  'loginWithGoogleToken',
  'loginWithGoogleAccount',
  'logout',
  'getTasks',
  'getTestTasks',
  'evaluateTest',
  'checkAntwort',
  'submitTaskAnswer',
  'markTaskSolutionViewed',
  'getUserProgress',
  'getLernovaHilfe',
  'activateTeacherMode',
  'getTeacherDashboard',
  'createTeacherClassroom',
  'regenerateTeacherClassCode',
  'joinStudentClassroom',
  'switchStudentClassroom'
]);

ensureDataFiles();

function ensureDataFiles() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PROPERTIES_PATH)) {
    fs.writeFileSync(PROPERTIES_PATH, '{}\n', 'utf8');
  }
  if (!fs.existsSync(SPREADSHEETS_PATH)) {
    fs.writeFileSync(SPREADSHEETS_PATH, JSON.stringify({ spreadsheets: {} }, null, 2) + '\n', 'utf8');
  }
}

function readJson(filePath, fallbackValue) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return fallbackValue;
  }
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function getEnvBackedProperties() {
  const envProps = {};
  ['GOOGLE_CLIENT_ID', 'GEMINI_API_KEY', 'LERNOVA_ALLOWED_GOOGLE_EMAILS', 'LERNOVA_DATA_SPREADSHEET_ID'].forEach((key) => {
    if (process.env[key]) {
      envProps[key] = process.env[key];
    }
  });
  return envProps;
}

function createScriptPropertiesStore() {
  return {
    getProperty(key) {
      const envProps = getEnvBackedProperties();
      if (Object.prototype.hasOwnProperty.call(envProps, key)) {
        return envProps[key];
      }
      const data = readJson(PROPERTIES_PATH, {});
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    setProperty(key, value) {
      const data = readJson(PROPERTIES_PATH, {});
      data[key] = String(value);
      writeJson(PROPERTIES_PATH, data);
      return this;
    },
    getProperties() {
      return Object.assign({}, readJson(PROPERTIES_PATH, {}), getEnvBackedProperties());
    }
  };
}

const scriptPropertiesStore = createScriptPropertiesStore();
const cacheStore = new Map();

function pruneCache() {
  const now = Date.now();
  for (const [key, entry] of cacheStore.entries()) {
    if (entry.expiresAt <= now) {
      cacheStore.delete(key);
    }
  }
}

function getSpreadsheetState() {
  return readJson(SPREADSHEETS_PATH, { spreadsheets: {} });
}

function saveSpreadsheetState(state) {
  writeJson(SPREADSHEETS_PATH, state);
}

function ensureSpreadsheet(state, id, name) {
  if (!state.spreadsheets[id]) {
    state.spreadsheets[id] = {
      id,
      name: name || id,
      sheets: {}
    };
  }
  return state.spreadsheets[id];
}

function createSpreadsheetWrapper(id) {
  return {
    getId() {
      return id;
    },
    getSheetByName(name) {
      const state = getSpreadsheetState();
      const spreadsheet = state.spreadsheets[id];
      if (!spreadsheet || !spreadsheet.sheets[name]) {
        return null;
      }
      return createSheetWrapper(id, name);
    },
    insertSheet(name) {
      const state = getSpreadsheetState();
      const spreadsheet = ensureSpreadsheet(state, id, id);
      if (!spreadsheet.sheets[name]) {
        spreadsheet.sheets[name] = {
          name,
          frozenRows: 0,
          rows: []
        };
        saveSpreadsheetState(state);
      }
      return createSheetWrapper(id, name);
    }
  };
}

function createSheetWrapper(spreadsheetId, sheetName) {
  function ensureSheetState() {
    const state = getSpreadsheetState();
    const spreadsheet = ensureSpreadsheet(state, spreadsheetId, spreadsheetId);
    if (!spreadsheet.sheets[sheetName]) {
      spreadsheet.sheets[sheetName] = {
        name: sheetName,
        frozenRows: 0,
        rows: []
      };
      saveSpreadsheetState(state);
    }
    return { state, sheet: spreadsheet.sheets[sheetName] };
  }

  return {
    appendRow(row) {
      const context = ensureSheetState();
      context.sheet.rows.push(Array.isArray(row) ? row.slice() : []);
      saveSpreadsheetState(context.state);
    },
    setFrozenRows(count) {
      const context = ensureSheetState();
      context.sheet.frozenRows = Number(count) || 0;
      saveSpreadsheetState(context.state);
    },
    getDataRange() {
      const context = ensureSheetState();
      const rowCount = Math.max(1, context.sheet.rows.length);
      const columnCount = Math.max(1, context.sheet.rows.reduce((max, row) => Math.max(max, row.length), 0));
      return createRangeWrapper(spreadsheetId, sheetName, 1, 1, rowCount, columnCount);
    },
    getRange(startRow, startCol, numRows, numCols) {
      return createRangeWrapper(spreadsheetId, sheetName, startRow, startCol, numRows || 1, numCols || 1);
    }
  };
}

function createRangeWrapper(spreadsheetId, sheetName, startRow, startCol, numRows, numCols) {
  function readRangeValues() {
    const state = getSpreadsheetState();
    const spreadsheet = ensureSpreadsheet(state, spreadsheetId, spreadsheetId);
    const sheet = spreadsheet.sheets[sheetName] || { rows: [] };
    const values = [];

    for (let rowOffset = 0; rowOffset < numRows; rowOffset += 1) {
      const sourceRow = sheet.rows[startRow - 1 + rowOffset] || [];
      const rowValues = [];
      for (let colOffset = 0; colOffset < numCols; colOffset += 1) {
        rowValues.push(sourceRow[startCol - 1 + colOffset] ?? '');
      }
      values.push(rowValues);
    }

    return values;
  }

  function writeRangeValues(values) {
    const state = getSpreadsheetState();
    const spreadsheet = ensureSpreadsheet(state, spreadsheetId, spreadsheetId);
    if (!spreadsheet.sheets[sheetName]) {
      spreadsheet.sheets[sheetName] = {
        name: sheetName,
        frozenRows: 0,
        rows: []
      };
    }

    const sheet = spreadsheet.sheets[sheetName];
    for (let rowOffset = 0; rowOffset < numRows; rowOffset += 1) {
      const targetRowIndex = startRow - 1 + rowOffset;
      while (sheet.rows.length <= targetRowIndex) {
        sheet.rows.push([]);
      }
      const targetRow = sheet.rows[targetRowIndex];
      const sourceRow = values[rowOffset] || [];
      for (let colOffset = 0; colOffset < numCols; colOffset += 1) {
        targetRow[startCol - 1 + colOffset] = sourceRow[colOffset] ?? '';
      }
    }

    saveSpreadsheetState(state);
  }

  return {
    getValues() {
      return readRangeValues();
    },
    setValues(values) {
      writeRangeValues(values);
      return this;
    },
    setValue(value) {
      writeRangeValues([[value]]);
      return this;
    }
  };
}

function curlFetch(url, options = {}) {
  const method = String(options.method || 'get').toUpperCase();
  const args = ['-sS', '-L', '-w', '\n%{http_code}', '-X', method];
  const headers = options.headers || {};

  Object.keys(headers).forEach((key) => {
    args.push('-H', `${key}: ${headers[key]}`);
  });

  if (options.contentType) {
    args.push('-H', `Content-Type: ${options.contentType}`);
  }

  if (Object.prototype.hasOwnProperty.call(options, 'payload')) {
    args.push('--data-binary', String(options.payload));
  }

  args.push(url);

  try {
    const output = execFileSync('curl', args, {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    });
    const lines = output.split('\n');
    const statusCode = Number(lines.pop()) || 0;
    const body = lines.join('\n');
    return {
      getResponseCode() {
        return statusCode;
      },
      getContentText() {
        return body;
      }
    };
  } catch (error) {
    if (options.muteHttpExceptions) {
      const stdout = error.stdout ? String(error.stdout) : '';
      const lines = stdout.split('\n');
      const statusCode = Number(lines.pop()) || 500;
      const body = lines.join('\n');
      return {
        getResponseCode() {
          return statusCode;
        },
        getContentText() {
          return body;
        }
      };
    }
    throw new Error(`HTTP request failed for ${url}`);
  }
}

function createGasSandbox() {
  const sandbox = {
    console,
    Math,
    Date,
    JSON,
    Number,
    String,
    Boolean,
    Array,
    Object,
    RegExp,
    parseInt,
    parseFloat,
    isNaN,
    encodeURIComponent,
    decodeURIComponent,
    setTimeout,
    clearTimeout,
    PropertiesService: {
      getScriptProperties() {
        return scriptPropertiesStore;
      }
    },
    CacheService: {
      getScriptCache() {
        return {
          get(key) {
            pruneCache();
            const entry = cacheStore.get(key);
            return entry ? entry.value : null;
          },
          put(key, value, expirationInSeconds) {
            const ttlMs = Math.max(1, Number(expirationInSeconds) || 600) * 1000;
            cacheStore.set(String(key), {
              value: String(value),
              expiresAt: Date.now() + ttlMs
            });
          },
          remove(key) {
            cacheStore.delete(String(key));
          }
        };
      }
    },
    Utilities: {
      DigestAlgorithm: {
        SHA_256: 'SHA_256'
      },
      Charset: {
        UTF_8: 'utf8'
      },
      getUuid() {
        return crypto.randomUUID();
      },
      computeDigest(algorithm, value, charset) {
        const resolvedAlgorithm = algorithm === 'SHA_256' ? 'sha256' : 'sha256';
        const resolvedCharset = charset || 'utf8';
        const digest = crypto.createHash(resolvedAlgorithm).update(String(value || ''), resolvedCharset).digest();
        return Array.from(digest);
      },
      base64Encode(bytes) {
        return Buffer.from(bytes).toString('base64');
      }
    },
    UrlFetchApp: {
      fetch(url, options) {
        return curlFetch(url, options || {});
      }
    },
    Session: {
      getActiveUser() {
        return {
          getEmail() {
            return String(process.env.GOOGLE_ACTIVE_USER_EMAIL || '');
          }
        };
      }
    },
    SpreadsheetApp: {
      openById(id) {
        const state = getSpreadsheetState();
        if (!state.spreadsheets[id]) {
          ensureSpreadsheet(state, id, id);
          saveSpreadsheetState(state);
        }
        return createSpreadsheetWrapper(id);
      },
      create(name) {
        const id = `sheet-${crypto.randomUUID()}`;
        const state = getSpreadsheetState();
        ensureSpreadsheet(state, id, name || id);
        saveSpreadsheetState(state);
        return createSpreadsheetWrapper(id);
      }
    },
    HtmlService: {
      createHtmlOutputFromFile(filename) {
        const content = readTemplateFile(String(filename || ''));
        return {
          getContent() {
            return content;
          }
        };
      },
      createTemplateFromFile(filename) {
        const content = readTemplateFile(String(filename || ''));
        return {
          evaluate() {
            return {
              content,
              setTitle() {
                return this;
              }
            };
          }
        };
      }
    }
  };

  sandbox.global = sandbox;
  sandbox.globalThis = sandbox;
  return sandbox;
}

function readTemplateFile(name) {
  const candidates = [
    path.join(ROOT, name),
    path.join(ROOT, `${name}.html`),
    path.join(ROOT, `${name}.gs`)
  ];

  const match = candidates.find((candidate) => fs.existsSync(candidate));
  return match ? fs.readFileSync(match, 'utf8') : '';
}

const gasSandbox = createGasSandbox();
vm.createContext(gasSandbox);
const bundledGasCode = GAS_FILES.map((file) => fs.readFileSync(path.join(ROOT, file), 'utf8')).join('\n\n');
vm.runInContext(bundledGasCode, gasSandbox, { filename: 'lernova.gs' });

function composeIndexHtml() {
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  html = html.replace("<?!= include('Styles'); ?>", fs.readFileSync(path.join(ROOT, 'Styles.html'), 'utf8'));
  html = html.replace("<?!= include('Markup'); ?>", fs.readFileSync(path.join(ROOT, 'Markup.html'), 'utf8'));
  html = html.replace("<?!= include('Scripts'); ?>", `${buildGoogleScriptRunShim()}\n${fs.readFileSync(path.join(ROOT, 'Scripts.html'), 'utf8')}`);
  return html;
}

function buildGoogleScriptRunShim() {
  return `<script>
  (function() {
    var baseGoogle = window.google || {};

    function createRunner(successHandler, failureHandler) {
      return new Proxy({}, {
        get: function(_target, prop) {
          if (prop === 'withSuccessHandler') {
            return function(nextSuccessHandler) {
              return createRunner(nextSuccessHandler, failureHandler);
            };
          }

          if (prop === 'withFailureHandler') {
            return function(nextFailureHandler) {
              return createRunner(successHandler, nextFailureHandler);
            };
          }

          return function() {
            var args = Array.prototype.slice.call(arguments);
            fetch('/api/run', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                method: String(prop),
                args: args
              })
            })
              .then(function(response) {
                return response.json().catch(function() {
                  return { ok: false, error: 'Ungültige Server-Antwort.' };
                }).then(function(payload) {
                  if (!response.ok || !payload.ok) {
                    throw new Error(payload.error || ('Request failed with status ' + response.status));
                  }
                  return payload.result;
                });
              })
              .then(function(result) {
                if (typeof successHandler === 'function') {
                  successHandler(result);
                }
              })
              .catch(function(error) {
                var wrappedError = { message: error && error.message ? error.message : String(error) };
                if (typeof failureHandler === 'function') {
                  failureHandler(wrappedError);
                  return;
                }
                console.error(error);
              });
          };
        }
      });
    }

    baseGoogle.script = baseGoogle.script || {};
    baseGoogle.script.run = createRunner(null, null);
    window.google = baseGoogle;
  })();
  </script>`;
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) {
        reject(new Error('Request body too large.'));
        request.destroy();
      }
    });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

function invokeGasMethod(method, args) {
  if (!ALLOWED_API_METHODS.has(method)) {
    throw new Error('Diese API-Funktion ist nicht freigegeben.');
  }

  const fn = gasSandbox[method];
  if (typeof fn !== 'function') {
    throw new Error(`Unbekannte Funktion: ${method}`);
  }

  return fn.apply(gasSandbox, Array.isArray(args) ? args : []);
}

function contentTypeFor(filePath) {
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.ico')) return 'image/x-icon';
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  return 'application/octet-stream';
}

function tryServeStatic(requestPath, response) {
  const decodedPath = decodeURIComponent(requestPath);
  const normalized = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(ROOT, normalized);

  if (!filePath.startsWith(ROOT)) {
    sendJson(response, 403, { ok: false, error: 'Forbidden' });
    return true;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return false;
  }

  response.writeHead(200, {
    'Content-Type': contentTypeFor(filePath)
  });
  response.end(fs.readFileSync(filePath));
  return true;
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  if (request.method === 'GET' && requestUrl.pathname === '/health') {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === 'POST' && requestUrl.pathname === '/api/run') {
    try {
      const rawBody = await readRequestBody(request);
      const payload = rawBody ? JSON.parse(rawBody) : {};
      const result = invokeGasMethod(String(payload.method || ''), payload.args || []);
      sendJson(response, 200, { ok: true, result });
    } catch (error) {
      sendJson(response, 500, {
        ok: false,
        error: error && error.message ? error.message : 'Interner Serverfehler.'
      });
    }
    return;
  }

  if (request.method === 'GET' && (requestUrl.pathname === '/' || requestUrl.pathname === '/index.html')) {
    response.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });
    response.end(composeIndexHtml());
    return;
  }

  if (request.method === 'GET' && tryServeStatic(requestUrl.pathname, response)) {
    return;
  }

  response.writeHead(404, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  response.end('Not found');
});

function startServer(port = Number(process.env.PORT) || 3000) {
  server.listen(port, () => {
    console.log(`Lernova Render server listening on port ${port}`);
  });
  return server;
}

module.exports = {
  composeIndexHtml,
  invokeGasMethod,
  startServer
};

if (require.main === module) {
  startServer();
}
