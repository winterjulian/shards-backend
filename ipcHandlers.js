const { ipcMain, dialog } = require('electron');
const { getMainWindow } = require('./windowManager');
const { extendFileInformation } = require('./fileUtils');

ipcMain.handle('dialog:openFiles', async () => {
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
