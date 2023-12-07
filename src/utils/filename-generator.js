function getFileExtension(str) {
    return str.slice(str.lastIndexOf('.'));
}

function generateRandomString(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function generateFileWithUniqueName(file) {
    const fileExtension = getFileExtension(file.name);
    const newFileName = `${file.name.replace(/\.[^/.]+$/, '')}-${generateRandomString(
        8
    )}${fileExtension}`;

    return new File([file], newFileName, {
        type: file.type
    });
}