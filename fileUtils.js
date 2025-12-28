import path from 'path';
import { randomUUID } from 'crypto';

export function extendFileInformation(filePath, index) {
    const fileName = path.basename(filePath);
    const purePath = path.dirname(filePath);
    const extension = path.extname(fileName);
    const name = fileName.replace(extension, '');

    return {
        index,
        id: randomUUID(),
        name,
        displayName: name,
        groups: [],
        path: purePath,
        isSelected: false,
        isChanged: false,
        isVisible: true,
        length: fileName.length,
        extension,
        changedName: name,
        changeApproved: false,
    };
}
