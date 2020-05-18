const fs = require('fs');

const addMessage = (message) => {
  let lineBreak = '';

  if (fs.existsSync('log.txt') && fs.readFileSync('log.txt', 'utf8') !== '') {
    lineBreak = '\n';
  }

  fs.appendFileSync('log.txt', `${lineBreak}${message}`);

  return message;
};

const findAll = () => {
  if (fs.existsSync('log.txt')) {
    const fileData = fs.readFileSync('log.txt', 'utf8');

    if (fileData) {
      return fileData.split('\n');
    }
  }

  return [];
};

const findOne = id => {
  if (fs.existsSync('log.txt')) {
    const fileData = fs.readFileSync('log.txt', 'utf8');

    if (fileData) {
      const message = fileData.split('\n')[id];

      if (message) {
        return message;
      }
    }
  }

  return null;
};


const deleteMessage = id => {
  if (fs.existsSync('log.txt')) {
    const fileData = fs.readFileSync('log.txt', 'utf8');

    if (fileData) {
      const messages = fileData.split('\n');

      if (id >= messages.length) { throw new Error('Message has not been found'); }

      messages.splice(id, 1);

      fs.writeFileSync('log.txt', messages.join('\n'));

      return;
    }
  }

  throw new Error('Message has not been found');
};

const updateMessage = (id, message) => {
  if (fs.existsSync('log.txt')) {
    const fileData = fs.readFileSync('log.txt', 'utf8');

    if (fileData) {
      const messages = fileData.split('\n');

      if (id >= messages.length) { throw new Error('Message has not been found'); }

      messages[id] = message;

      fs.writeFileSync('log.txt', messages.join('\n'));

      return message;
    }
  }

  throw new Error('Message has not been found');
};

module.exports = {
  addMessage,
  findAll,
  findOne,
  deleteMessage,
  updateMessage
};
