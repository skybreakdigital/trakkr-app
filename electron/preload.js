const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getMissionDetails: () => ipcRenderer.invoke('get-mission-details'),
  getMissionConfig: () => ipcRenderer.invoke('get-mission-config'),
  setMissionConfig: (data) => ipcRenderer.invoke('set-mission-config', data),
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
