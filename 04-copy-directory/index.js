const path = require('path');
const { rm, mkdir, readdir, copyFile } = require('fs/promises');
const { Console } = require('console');
const pathFilesCopy = path.join(__dirname, 'files-copy');
const pathFiles = path.join(__dirname, 'files');

async function removeFolder () {
    await rm(pathFilesCopy, {recursive:true, force:true});
}

async function createFilesCopy () {
    await mkdir(pathFilesCopy, {recursive:true}).catch(err => {createFilesCopy ()});
}

async function copyFilesToNewFolder (inputFolder, outputFolder) {
    const rdFiles = await readdir(outputFolder, {withFileTypes: true});
    for (let file of rdFiles) {
        const pathOutputFile = path.join(outputFolder, `${file.name}`)
        const pathInputFile = path.join(inputFolder, `${file.name}`)
        if(file.isFile()) {
            await copyFile(pathOutputFile, pathInputFile).catch(err => {console.log('Ошибка создания')})
        } else {
            await mkdir(pathInputFile, {recursive:true});
            copyFilesToNewFolder(pathInputFile, pathOutputFile);
        }
    }
}

(async function () {
    await removeFolder().catch(err => {});
    await createFilesCopy().catch(err => {createFilesCopy()});
    await copyFilesToNewFolder(pathFilesCopy, pathFiles);
}) ();