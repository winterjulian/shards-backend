import Store from 'electron-store';
import { ipcMain } from 'electron';
import path from 'path';

const store = new Store({ name: 'user-data' });

// function createSuccessResponse(message, status = 200) {
//     return {
//         message,
//         isError: false,
//         errorMessage: undefined,
//         status
//     };
// }
//
// function createErrorResponse(message, errorMessage, status = 500) {
//     return {
//         message,
//         isError: true,
//         errorMessage,
//         status
//     };
// }

export function registerStoreHandlers() {
    ipcMain.handle('favorites:getDirectories', () => store.get('favorites', []));

    ipcMain.handle('favorites:addDirectory', (event, favoriteDir) => {
        try {
            const favorites = store.get('favorites', []);

            if (favorites.some(f => f.path === favoriteDir.path)) {
                return {
                    message: 'Ordner bereits in Favoriten vorhanden',
                    isError: false,
                    errorMessage: undefined,
                    status: 409
                };
            }

            favorites.push({
                ...favoriteDir
            });
            store.set('favorites', favorites);

            return {
                message: 'Ordner erfolgreich zu Favoriten hinzugefügt',
                isError: false,
                errorMessage: undefined,
                status: 201
            };

        } catch (error) {
            return {
                message: 'Fehler beim Hinzufügen des Ordners',
                isError: true,
                errorMessage: error.message,
                status: 500
            };
        }
    });

    ipcMain.handle('favorites:removeDirectory', (event, favoriteDir) => {
        const favorites = store.get('favorites', []).filter(f => f.path !== favoriteDir.path);
        store.set('favorites', favorites);
        return {
            message: 'Ordner erfolgreich aus den Favoriten entfernt',
            isError: false,
            errorMessage: undefined,
            status: 201
        };
    });
}