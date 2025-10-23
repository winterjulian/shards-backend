import { app, BrowserWindow } from 'electron';
import { createMainWindow } from './windowManager.js';
import { registerStoreHandlers } from './storeService.js';
import './ipcHandlers.js';

app.whenReady().then(() => {
  registerStoreHandlers();
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
