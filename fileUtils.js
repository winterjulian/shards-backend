const path = require('path');

function extendFileInformation(filePath, index) {
    const fileName = path.basename(filePath);
    const purePath = path.dirname(filePath);
    const extension = path.extname(fileName);
    const name = fileName.replace(extension, '');

    return {
        index,
        name,
        displayName: name,
        groups: [],
        path: purePath,
        chosen: false,
        changed: false,
        visible: true,
        length: fileName.length,
        extension,
        changedName: name,
        changeApproved: false
    };
}

module.exports = {
    extendFileInformation
};
