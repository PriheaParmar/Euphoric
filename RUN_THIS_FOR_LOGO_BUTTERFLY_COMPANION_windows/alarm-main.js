const path = require('path');
const { app, BrowserWindow, ipcMain, screen } = require('electron');

let payload = {};
try {
  payload = JSON.parse(Buffer.from(process.argv[2] || '', 'base64').toString('utf8'));
} catch {
  payload = {
    taskId: 'test',
    title: 'Euphoric reminder',
    text: 'This is the repaired Euphoric logo butterfly reminder test.',
    dueAt: Date.now()
  };
}

const VERSION = '6.6.0';
let mainWindow;
let finished = false;
let compactBounds = null;

function sendResult(result) {
  if (finished) return;
  finished = true;
  const payloadOut = {
    ok: true,
    taskId: String(payload.taskId || ''),
    action: result.action || 'dismiss',
    minutes: Number(result.minutes || 0),
    version: VERSION
  };
  console.log('EUPHORIC_RESULT:' + JSON.stringify(payloadOut));
  setTimeout(() => app.quit(), 80);
}

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const workArea = display.workArea;

  // Start as a wide transparent strip so the logo butterfly can visibly fly
  // across the laptop screen from left to right. After landing, the window
  // shrinks back to a compact top-right reminder.
  const flightWidth = Math.max(760, workArea.width);
  const flightHeight = Math.min(420, Math.max(330, Math.floor(workArea.height * 0.42)));
  const flightX = workArea.x;
  const flightY = workArea.y;

  const compactWidth = 430;
  const compactHeight = 282;
  compactBounds = {
    width: compactWidth,
    height: compactHeight,
    x: Math.round(workArea.x + workArea.width - compactWidth - 18),
    y: Math.round(workArea.y + 18)
  };

  mainWindow = new BrowserWindow({
    width: flightWidth,
    height: flightHeight,
    x: flightX,
    y: flightY,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    hasShadow: false,
    focusable: true,
    show: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadFile(path.join(__dirname, 'alarm.html'));
  mainWindow.once('ready-to-show', () => {
    mainWindow.showInactive();
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    mainWindow.moveTop();
  });

  mainWindow.on('closed', () => {
    if (!finished) sendResult({ action: 'dismiss' });
  });
}

app.whenReady().then(createWindow);

ipcMain.handle('get-payload', () => ({
  taskId: String(payload.taskId || ''),
  title: String(payload.title || 'Euphoric reminder'),
  text: String(payload.text || 'Your reminder is ready.'),
  dueAt: Number(payload.dueAt || Date.now()),
  type: String(payload.type || 'reminder')
}));

ipcMain.on('flight-complete', () => {
  if (mainWindow && !mainWindow.isDestroyed() && compactBounds) {
    mainWindow.setBounds(compactBounds, true);
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    mainWindow.moveTop();
  }
});

ipcMain.on('alarm-action', (_event, result) => {
  sendResult(result || { action: 'dismiss' });
});

ipcMain.on('keep-on-top', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    mainWindow.moveTop();
  }
});

app.on('window-all-closed', () => {});
