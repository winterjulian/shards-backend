const { BrowserWindow, app, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
const isDev = !app.isPackaged;

const configPath = path.join(app.getAppPath(), 'config.build.json');
let frontendPath;

try {
    const rawData = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(rawData);

    if (config.frontendPath) {
        frontendPath = config.frontendPath;
    } else {
        console.error(`⚠️ frontendPath fehlt in ${configPath}`);
        process.exit(1);
    }
} catch (e) {
    console.error(`❌ Fehler beim Lesen der Config (${configPath}):`, e.message);
    process.exit(1);
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(app.getAppPath(), 'preload.js'),
            nodeIntegration: isDev,
            contextIsolation: true,
            webSecurity: !isDev
        },
    });


    if (isDev) {
        mainWindow.loadURL('http://localhost:4200');
        mainWindow.webContents.openDevTools();
    } else {
        Menu.setApplicationMenu(null);
        const indexPath = path.join(__dirname, frontendPath);
        mainWindow.loadFile(indexPath);
    }
}

function getMainWindow() {
    return mainWindow;
}

module.exports = {
    createMainWindow,
    getMainWindow,
};
