const fs = require('fs');
const readline = require('readline');

const createInterface = () => readline.createInterface({
  input: fs.createReadStream('log.txt'),
  output: process.stdout,
  terminal: false
});

const addMessage = (newMessage) => new Promise((resolve, rejected) => {
  let lineBreak = '';

  if (fs.existsSync('log.txt')) {
    const rl = createInterface();
    let newId = 0;

    rl.on('line', line => {
      const { id, message } = JSON.parse(line);
      if (line) {
        fs.appendFileSync('log1.txt', `${lineBreak}${JSON.stringify({ id, message })}`);
      }
      if (!lineBreak) { lineBreak = '\n'; }

      newId = id;
    });

    rl.on('close', () => {
      fs.unlinkSync('log.txt');
      fs.appendFileSync('log1.txt', `${lineBreak}${JSON.stringify({ id: ++newId, message: newMessage })}`);
      fs.renameSync('log1.txt', 'log.txt');
      resolve(newMessage);
    });
  } else {
    rejected(new Error('file not exiest'));
  }
});

const findAll = () => {
  if (fs.existsSync('log.txt')) {
    const fileData = fs.readFileSync('log.txt', 'utf8');

    if (fileData) {
      return fileData;
    }
  }

  return [];
};

const findOne = messageId => new Promise((resolve, rejected) => {
  if (fs.existsSync('log.txt')) {
    const rl = createInterface();

    rl.on('line', line => {
      const { id, message } = JSON.parse(line);

      if (id === parseInt(messageId, 10)) {
        resolve(message);
        rl.close();
        rl.removeAllListeners();
      }
    });

    rl.on('close', () => {
      rejected(new Error('Message has not been found'));
    });
  } else {
    rejected(new Error('file not exiest'));
  }
});

const deleteMessage = messageId => new Promise((resolve, rejected) => {
  let lineBreak = '';

  if (fs.existsSync('log.txt')) {
    const rl = createInterface();

    rl.on('line', line => {
      const { id, message } = JSON.parse(line);

      if (id !== parseInt(messageId, 10)) {
        if (line) {
          fs.appendFileSync('log1.txt', `${lineBreak}${JSON.stringify({ id, message })}`);
        }
        if (!lineBreak) { lineBreak = '\n'; }
      } else {
        resolve();
      }
    });

    rl.on('close', () => {
      fs.unlinkSync('log.txt');
      fs.renameSync('log1.txt', 'log.txt');
      rejected(new Error('Message has not been found'));
    });
  } else {
    rejected(new Error('file not exiest'));
  }
});

const updateMessage = (messageId, modifiedMessage) => new Promise((resolve, rejected) => {
  let lineBreak = '';

  if (fs.existsSync('log.txt')) {
    const rl = createInterface();

    rl.on('line', line => {
      const { id, message } = JSON.parse(line);

      if (id === parseInt(messageId, 10)) {
        if (line) {
          fs.appendFileSync('log1.txt', `${lineBreak}${JSON.stringify({ id, message: modifiedMessage })}`);
          resolve(modifiedMessage);
        }
      } else if (line) {
        fs.appendFileSync('log1.txt', `${lineBreak}${JSON.stringify({ id, message })}`);
      }

      if (!lineBreak) { lineBreak = '\n'; }
    });

    rl.on('close', () => {
      fs.unlinkSync('log.txt');
      fs.renameSync('log1.txt', 'log.txt');
      rejected(new Error('Message has not been found'));
    });
  } else {
    rejected(new Error('file not exiest'));
  }
});

module.exports = {
  addMessage,
  findAll,
  findOne,
  deleteMessage,
  updateMessage
};
