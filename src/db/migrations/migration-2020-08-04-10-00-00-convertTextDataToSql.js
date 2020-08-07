const fs = require('fs');
const readline = require('readline');
const { connection } = require('../connection');

const convertDataToSql = () => new Promise(resolve => {
  if (fs.existsSync('log.txt')) {
    const rl = readline.createInterface({
      input: fs.createReadStream('log.txt'),
      output: process.stdout,
      terminal: false
    });

    rl.on('line', line => {
      if (line) {
        const { id, message } = JSON.parse(line);

        connection.execute(
          'INSERT INTO `messages` (`id`, `message`) VALUES (?, ?)',
          [id, message]
        );
      }
    });

    rl.on('close', () => {
      resolve();
    });
  } else { resolve(); }
});

module.exports = {
  exec: convertDataToSql
};
