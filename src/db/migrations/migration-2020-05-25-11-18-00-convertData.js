const fs = require('fs');
const readline = require('readline');

const convertData = () => new Promise(resolve => {
  let count = 0;
  let lineBreak = '';

  if (fs.existsSync('log.txt')) {
    const rl = readline.createInterface({
      input: fs.createReadStream('log.txt'),
      output: process.stdout,
      terminal: false
    });

    rl.on('line', line => {
      if (line) {
        fs.appendFileSync('log1.txt', `${lineBreak}${JSON.stringify({ id: count++, message: line })}`);
      }
      if (!lineBreak) { lineBreak = '\n'; }
    });

    rl.on('close', () => {
      fs.unlinkSync('log.txt');
      fs.renameSync('log1.txt', 'log.txt');
      resolve();
    });
  }
});

module.exports = {
  exec: convertData
};
