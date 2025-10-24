import { ipcMain, dialog } from 'electron';
import { getMainWindow } from './windowManager.js';
import { extendFileInformation } from './fileUtils.js';
import { promises as fs } from 'fs';
import path from 'path';

ipcMain.handle('dialog:openFiles', async (event, path) => {
    console.log(path);
    try {
        const result = await dialog.showOpenDialog(getMainWindow(), {
            defaultPath: path || undefined,
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Alle Dateien', extensions: ['*'] }],
        });

        if (result.canceled) return [];

        return result.filePaths.map((filePath, index) =>
            extendFileInformation(filePath, index)
        );
    } catch (error) {
        console.error('Fehler beim Öffnen des Dialogs:', error);
        throw new Error('Fehler beim Öffnen des Dateidialogs.');
    }
});

ipcMain.handle('dialog:getFilesFromDirectory', async (event, directoryPath) => {
    console.log(directoryPath);
    try {
        const stats = await fs.stat(directoryPath);
        if (!stats.isDirectory()) {
            throw new Error('Der angegebene Pfad ist kein Ordner');
        }

        const files = await fs.readdir(directoryPath);

        const fileDetails = [];
        let index = 0;

        for (const file of files) {
            const fullPath = path.join(directoryPath, file);
            const fileStat = await fs.stat(fullPath);

            if (fileStat.isFile()) {
                fileDetails.push(extendFileInformation(fullPath, index));
                index++;
            }
        }

        return fileDetails;

    } catch (error) {
        console.error('Fehler beim Laden der Files:', error);
        throw new Error(`Fehler beim Laden der Files aus dem Ordner: ${error.message}`);
    }
});

ipcMain.handle('files:renameFiles', async (event, filesToRename) => {
    const errors = [];

    for (const file of filesToRename) {
        try {
            const oldPath = path.join(file.path, file.name + file.extension);
            const newPath = path.join(file.path, file.changedName + file.extension);
            await fs.promises.rename(oldPath, newPath);
            file.name = file.changedName;
        } catch (error) {
            errors.push({ file: file.name, message: error.message });
        }
    }

    if (errors.length > 0) {
        return { success: false, errors };
    }
    return { success: true, renamedFiles: filesToRename };
});

ipcMain.handle('dialog:openFolder', async () => {
    const mainWindow = getMainWindow();
    if (!mainWindow) return null;

    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
    });

    if (result.canceled || result.filePaths.length === 0) return null;

    return result.filePaths[0];
});