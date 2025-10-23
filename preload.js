const { contextBridge, ipcRenderer } = require('electron');

// Exponiere eine API für den Renderer-Prozess
contextBridge.exposeInMainWorld('electron', {
  openFiles: () => ipcRenderer.invoke('dialog:openFiles'),
  getFilesFromDirectory: (directoryPath) => ipcRenderer.invoke('dialog:getFilesFromDirectory', directoryPath),
  renameFiles: (filesToRename) => ipcRenderer.invoke('files:renameFiles', filesToRename),
  getFavoriteDirectories: () => ipcRenderer.invoke('favorites:getDirectories'),
  addFavoriteDirectory: (favoriteDirectory) => ipcRenderer.invoke('favorites:addDirectory', favoriteDirectory),
  removeFavoriteDirectory: (favoriteDirectory) => ipcRenderer.invoke('favorites:removeDirectory', favoriteDirectory),
  openDirectory: () => ipcRenderer.invoke('dialog:openFolder'),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
});
