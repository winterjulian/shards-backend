import { BrowserWindow, app, Menu } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ESM-Variablen für Pfad-Auflösung
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // ESM-kompatibel
            nodeIntegration: isDev, // nur für Dev
            contextIsolation: true,
            webSecurity: !isDev,
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

export function getMainWindow() {
    return mainWindow;
}
