import { readFile } from 'node:fs/promises';
async function main() {
  console.log('Start');
  try {
    const text = await readFile(new URL('./message.txt', import.meta.url), 'utf8');
    console.log(text.trim());
    console.log('Finished');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
main();
console.log('Scheduled');
