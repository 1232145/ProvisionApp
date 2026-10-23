const { contextBridge, ipcRenderer } = require('electron');

const requestResponse = (requestChannel, responseChannel, payload) => new Promise((resolve, reject) => {
  let timeout;
  const handler = (_event, value) => {
    clearTimeout(timeout);
    ipcRenderer.removeListener(responseChannel, handler);
    resolve(value);
  };

  timeout = setTimeout(() => {
    ipcRenderer.removeListener(responseChannel, handler);
    reject(new Error(`Timed out waiting for ${responseChannel}`));
  }, 5000);

  ipcRenderer.once(responseChannel, handler);
  ipcRenderer.send(requestChannel, payload);
});

contextBridge.exposeInMainWorld('desktop', {
  saveAutoSave: (data) => ipcRenderer.invoke('autosave', data),
  saveFile: async (content, fileName) => ipcRenderer.invoke('save-file', { content, fileName }),
  loadAutoSave: () => requestResponse('check-auto-save', 'load-auto-save'),
  checkSaveFileStatus: () => requestResponse('check-save-file-exists', 'save-file-status'),
  confirmClose: () => ipcRenderer.send('confirm-close'),
  onCloseWarning: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('warn-close', handler);
    return () => ipcRenderer.removeListener('warn-close', handler);
  },
  onSaveFileStatus: (callback) => {
    const handler = (_event, status) => callback(status);
    ipcRenderer.on('save-file-status', handler);
    return () => ipcRenderer.removeListener('save-file-status', handler);
  },
});
