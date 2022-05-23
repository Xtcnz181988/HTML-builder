const { Console } = require('console');
const fs = require('fs');
const { mkdir, rm, readFile, readdir, copyFile } = require('fs/promises') 
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const assetsOutput = path.join(__dirname, 'assets');
const assetsInput = path.join(__dirname, 'project-dist', 'assets');
const styleInput = path.join(__dirname, 'styles');
const components = path.join(__dirname, 'components');

async function removeProjectDist () {
    await rm(projectDist, {force:true, recursive:true})/* .catch(err => {}) */;
}

async function addProjectDist () {
  await mkdir(projectDist, {recursive: true});
}

async function createFolderAssets(inputFolder, outputFolder) {
  await mkdir(outputFolder, {recursive:true, force:true})
  const rdAssets = await readdir(outputFolder, {withFileTypes: true})
  for (let file of rdAssets) {
    const pathOutputFile = path.join(outputFolder, `${file.name}`)
    const pathInputFile = path.join(inputFolder, `${file.name}`)
    if(file.isFile()) {
      await copyFile(pathOutputFile, pathInputFile);
    } else {
      await mkdir(pathInputFile, {recursive:true});
      createFolderAssets(pathInputFile, pathOutputFile);
    }
  }
};

function createStyleCss () {
    const wsStyles = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
    fs.readdir(styleInput, {withFileTypes: true}, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            const pathFile = path.join(__dirname, 'styles', `${file.name}`);
            const { ext } = path.parse(pathFile);
            if (ext === '.css')
            fs.createReadStream(pathFile).pipe(wsStyles)
        })
    })
}

async function createIndexHtml () {
    let rwTemplate = await readFile(path.join(__dirname,  'template.html'), 'utf-8');
    const rdCpmonents = await readdir(components, {withFileTypes: true});
    for (let file of rdCpmonents) {
      const pathFile = path.join(components, `${file.name}`);
      const { name } = path.parse(pathFile);
      const dataFile = await readFile(pathFile, 'utf-8');
      const subsStr =`{{${name}}}`;
      rwTemplate = rwTemplate.replace(subsStr, dataFile);
    }
    fs.writeFile(path.join(projectDist, 'index.html'), rwTemplate, err => {
      if (err) throw err;
    });
  };

  (async function () {
    await removeProjectDist().catch(err => {});
    await addProjectDist();
    createStyleCss ();
    createIndexHtml ();
    await createFolderAssets(assetsInput, assetsOutput);
  }) ();