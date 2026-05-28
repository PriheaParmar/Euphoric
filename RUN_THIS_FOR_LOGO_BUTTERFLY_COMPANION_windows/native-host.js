const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const HOST_NAME = 'com.euphoric.butterfly';
const VERSION = '6.6.0';
const LOG = path.join(__dirname, 'euphoric_v6_repair_native_log.txt');

function log(line) {
  try {
    fs.appendFileSync(LOG, `[${new Date().toISOString()}] ${line}\n`, 'utf8');
  } catch {}
}

function readNativeMessage() {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0);
    let expectedLength = null;
    let resolved = false;

    const failTimer = setTimeout(() => {
      if (!resolved) reject(new Error('Timed out waiting for native message from Chrome'));
    }, 15000);

    function tryParse() {
      if (resolved) return;
      try {
        if (expectedLength === null) {
          if (buffer.length < 4) return;
          expectedLength = buffer.readUInt32LE(0);
          buffer = buffer.slice(4);
          if (!expectedLength || expectedLength > 1024 * 1024) {
            throw new Error(`Invalid native message length: ${expectedLength}`);
          }
        }
        if (buffer.length < expectedLength) return;
        const body = buffer.slice(0, expectedLength).toString('utf8');
        resolved = true;
        clearTimeout(failTimer);
        resolve(JSON.parse(body));
      } catch (error) {
        resolved = true;
        clearTimeout(failTimer);
        reject(error);
      }
    }

    process.stdin.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      tryParse();
    });

    process.stdin.on('end', () => {
      if (!resolved) tryParse();
      if (!resolved) {
        clearTimeout(failTimer);
        reject(new Error('Chrome closed native message pipe before sending a complete message'));
      }
    });

    process.stdin.on('error', (error) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(failTimer);
        reject(error);
      }
    });

    process.stdin.resume();
  });
}

function sendNativeMessage(message) {
  const encoded = Buffer.from(JSON.stringify(message), 'utf8');
  const length = Buffer.alloc(4);
  length.writeUInt32LE(encoded.length, 0);
  process.stdout.write(Buffer.concat([length, encoded]));
}

function getElectronPath() {
  try {
    const electronPath = require('electron');
    if (typeof electronPath === 'string' && fs.existsSync(electronPath)) return electronPath;
  } catch (error) {
    log(`Cannot require electron: ${error.message}`);
  }

  const fallback = path.join(__dirname, 'node_modules', '.bin', process.platform === 'win32' ? 'electron.cmd' : 'electron');
  if (fs.existsSync(fallback)) return fallback;
  return null;
}

function runAlarm(payload) {
  return new Promise((resolve) => {
    const electronPath = getElectronPath();
    if (!electronPath) {
      resolve({ ok: false, error: 'Electron is not installed. Run install_companion_windows.bat first.', host: HOST_NAME, version: VERSION });
      return;
    }

    const data = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
    const child = spawn(electronPath, [path.join(__dirname, 'alarm-main.js'), data], {
      cwd: __dirname,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let settled = false;
    let output = '';
    let errors = '';

    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    child.stdout.on('data', (chunk) => {
      output += chunk.toString('utf8');
      const lines = output.split(/\r?\n/);
      for (const line of lines) {
        if (line.startsWith('EUPHORIC_RESULT:')) {
          try {
            const result = JSON.parse(line.slice('EUPHORIC_RESULT:'.length));
            finish({ ok: true, host: HOST_NAME, version: VERSION, ...result });
          } catch (error) {
            finish({ ok: false, error: error.message, host: HOST_NAME, version: VERSION });
          }
        }
      }
    });

    child.stderr.on('data', (chunk) => {
      errors += chunk.toString('utf8');
    });

    child.on('error', (error) => {
      log(`Electron spawn error: ${error.message}`);
      finish({ ok: false, error: error.message, host: HOST_NAME, version: VERSION });
    });

    child.on('exit', (code) => {
      if (!settled) {
        if (errors.trim()) log(`Electron stderr: ${errors.trim()}`);
        finish({ ok: true, action: 'dismiss', taskId: payload.taskId || '', minutes: 0, host: HOST_NAME, version: VERSION, code });
      }
    });
  });
}

async function main() {
  try {
    let payload;
    if (process.argv.includes('--test')) {
      payload = {
        source: 'direct-test',
        type: 'test',
        taskId: 'test',
        title: 'Euphoric reminder',
        text: 'This is the repaired Euphoric logo butterfly reminder test.',
        dueAt: Date.now()
      };
    } else {
      payload = await readNativeMessage();
    }

    log(`Received payload type=${payload.type} taskId=${payload.taskId}`);
    const result = await runAlarm(payload);

    if (process.argv.includes('--test')) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      sendNativeMessage(result);
    }
  } catch (error) {
    log(`Native host error: ${error.stack || error.message}`);
    const result = { ok: false, error: error.message, host: HOST_NAME, version: VERSION };
    if (process.argv.includes('--test')) console.error(JSON.stringify(result, null, 2));
    else sendNativeMessage(result);
  }
}

main();
