const fs = require('fs');
const path = require('path');
const {stdout} = process;

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        if (file.isFile()) {
            const pathFile = path.join(__dirname, 'secret-folder', `${file.name}`);
            const { name, ext } = path.parse(pathFile);
            fs.stat(path.join(pathFile), (err, stats) => {
                if(err) throw err;
                stdout.write(`${name} - ${ext.slice(1)} - ${stats.size} bytes\n`)
            })
        }
})
})
