const fs = require('fs');
const path = require('path');

const ws = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
const rd = fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        const pathFile = path.join(__dirname, 'styles', `${file.name}`);
        const { ext } = path.parse(pathFile);
        if (ext === '.css')
        fs.createReadStream(pathFile).pipe(ws)
    })
})