const { contextBridge, ipcRenderer } = require('electron');

// Exponiere eine API für den Renderer-Prozess
contextBridge.exposeInMainWorld('electron', {
  openFiles: () => ipcRenderer.invoke('dialog:openFiles')
});
