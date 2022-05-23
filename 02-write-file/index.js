const fs = require('fs');
const path = require('path');

const { stdin, stdout} = process;
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Hello. You can write some sentences or words\n');
const exit = () => {
    stdout.write('Bye. See you soon');
    process.exit();
}

stdin.on('data', chunk => {
    if (chunk.toString().trim() == 'exit') {
       exit();
    }
    output.write(chunk);
});
process.on("SIGINT", ()  => {
   exit ();
})