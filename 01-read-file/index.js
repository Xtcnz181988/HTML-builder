const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const rs = fs.createReadStream(path.join(__dirname, './text.txt'));
rs.pipe(stdout)
