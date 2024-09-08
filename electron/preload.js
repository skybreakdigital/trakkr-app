const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  setState: (data) => ipcRenderer.invoke('set-state', data),
  getState: () => ipcRenderer.invoke('get-state'),
  getMissionDetails: () => ipcRenderer.invoke('get-mission-details'),
  on: (channel, callback) => {
    const validChannels = ['journal-file-updated'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    }
  },
  removeListener: (channel, callback) => {
    const validChannels = ['journal-file-updated'];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, callback);
    }
  }
});
