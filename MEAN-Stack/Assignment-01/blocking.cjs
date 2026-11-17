const fs = require('node:fs');
const path = require('node:path');
console.log('Start');
console.log(fs.readFileSync(path.join(__dirname, 'message.txt'), 'utf8').trim());
console.log('End');
