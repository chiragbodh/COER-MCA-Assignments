const fs = require('node:fs');
const path = require('node:path');
console.log('Start');
fs.readFile(path.join(__dirname, 'message.txt'), 'utf8', (error, text) => {
  if (error) { console.error(error.message); process.exitCode = 1; return; }
  console.log(text.trim());
});
console.log('End');
