import path from 'path';
import { randomUUID } from 'crypto';
import fs from "fs";

export function extendFileInformation(filePath, index) {
    const fileName = path.basename(filePath);
    const purePath = path.dirname(filePath);
    const extension = path.extname(fileName);
    const name = fileName.replace(extension, '');
    const stats = fs.statSync(filePath);
    const size = stats.size;

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
        size: size
    };
}
