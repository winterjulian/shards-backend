const { ipcMain, dialog } = require('electron');
const { getMainWindow } = require('./windowManager');
const { extendFileInformation } = require('./fileUtils');
const fs = require('fs');
const path = require('path');

ipcMain.handle('dialog:openFiles', async () => {
    console.log('dialog.showOpenDialog()');
    try {
        const result = await dialog.showOpenDialog(getMainWindow(), {
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Alle Dateien', extensions: ['*'] }],
        });

        if (result.canceled) {
            return [];
        }

        return result.filePaths.map((filePath, index) =>
            extendFileInformation(filePath, index)
        );
    } catch (error) {
        console.error('Fehler beim Öffnen des Dialogs:', error);
        throw new Error('Fehler beim Öffnen des Dateidialogs.');
    }
});

ipcMain.handle('files:renameFiles', async (event, filesToRename) => {
    const errors = [];

    for (const file of filesToRename) {
        console.log(file);
        try {
            const oldPath = path.join(file.path, file.name + file.extension);
            const newPath = path.join(file.path, file.changedName + file.extension);
            console.log(oldPath);
            console.log(newPath);
            await fs.promises.rename(oldPath, newPath);
        } catch (error) {
            errors.push({ file: file.name, message: error.message });
        }
    }

    if (errors.length > 0) {
        return { success: false, errors };
    }
    return { success: true };
});
