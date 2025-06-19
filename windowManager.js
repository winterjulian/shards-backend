const { BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    });

    mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.openDevTools();
}

function getMainWindow() {
    return mainWindow;
}

module.exports = {
    createMainWindow,
    getMainWindow
};
