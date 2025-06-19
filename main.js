const { app } = require('electron');
const { createMainWindow, getMainWindow } = require('./windowManager');
require('./ipcHandlers');

app.whenReady().then(() => {
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});