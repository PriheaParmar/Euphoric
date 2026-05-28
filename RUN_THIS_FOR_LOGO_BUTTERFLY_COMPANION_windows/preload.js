const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('euphoricAlarm', {
  getPayload: () => ipcRenderer.invoke('get-payload'),
  action: (result) => ipcRenderer.send('alarm-action', result),
  keepOnTop: () => ipcRenderer.send('keep-on-top'),
  flightComplete: () => ipcRenderer.send('flight-complete')
});
