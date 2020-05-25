const fs = require('fs');

const convertData = () => {
  if (fs.existsSync('log.txt')) {
    const fileData = fs.readFileSync('log.txt', 'utf8');

    if (fileData) {
      const messages = fileData.split('\n');
      let count = 0;
      fs.writeFileSync('log.json', JSON.stringify(messages.map(message => ({ id: count++, message }))));
    }
  }
};

module.exports = {
  exec: convertData
};
