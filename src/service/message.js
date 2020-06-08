const fs = require('fs');
const readline = require('readline');

const createInterface = () => readline.createInterface({
  input: fs.createReadStream('log.txt'),
  output: process.stdout,
  terminal: false
});

const addMessage = (newMessage) => new Promise((resolve, reject) => {
  let lineBreak = '';

  if (fs.existsSync('log.txt')) {
    const rl = createInterface();
    let newId = 0;

    rl.on('line', line => {
      if (line) {
        const { id, message } = JSON.parse(line);

        fs.appendFileSync('log1.txt', `${lineBreak}${JSON.stringify({ id, message })}`);

        if (!lineBreak) { lineBreak = '\n'; }

        newId = id;
      }
    });

    rl.on('close', () => {
      fs.unlinkSync('log.txt');
      fs.appendFileSync('log1.txt', `${lineBreak}${JSON.stringify({ id: ++newId, message: newMessage })}`);
      fs.renameSync('log1.txt', 'log.txt');
      resolve(newMessage);
    });
  } else {
    reject(new Error('file not exiest'));
  }
});

const findAll = () => {
  if (fs.existsSync('log.txt')) {
    const fileData = fs.readFileSync('log.txt', 'utf8');

    if (fileData) {
      return fileData.split('\n');
    }
  }

  return [];
};

const findOne = messageId => new Promise((resolve, reject) => {
  if (fs.existsSync('log.txt')) {
    const rl = createInterface();

    rl.on('line', line => {
      if (line) {
        const { id, message } = JSON.parse(line);

        if (id === parseInt(messageId, 10)) {
          resolve(message);
          rl.close();
          rl.removeAllListeners();
        }
      }
    });

    rl.on('close', () => {
      reject(new Error('Message has not been found'));
    });
  } else {
    reject(new Error('file not exiest'));
  }
});

const deleteMessage = messageId => new Promise((resolve, reject) => {
  let lineBreak = '';

  if (fs.existsSync('log.txt')) {
    const rl = createInterface();

    rl.on('line', line => {
      if (line) {
        const { id, message } = JSON.parse(line);

        if (id !== parseInt(messageId, 10)) {
          fs.appendFileSync('log1.txt', `${lineBreak}${JSON.stringify({ id, message })}`);
        } else {
          resolve();
        }
        if (!lineBreak) { lineBreak = '\n'; }
      }
    });

    rl.on('close', () => {
      fs.unlinkSync('log.txt');
      fs.renameSync('log1.txt', 'log.txt');
      reject(new Error('Message has not been found'));
    });
  } else {
    reject(new Error('file not exiest'));
  }
});

const updateMessage = (messageId, modifiedMessage) => new Promise((resolve, reject) => {
  let lineBreak = '';

  if (fs.existsSync('log.txt')) {
    const rl = createInterface();

    rl.on('line', line => {
      if (line) {
        const { id, message } = JSON.parse(line);

        if (id === parseInt(messageId, 10)) {
          fs.appendFileSync('log1.txt', `${lineBreak}${JSON.stringify({ id, message: modifiedMessage })}`);
          resolve(modifiedMessage);
        } else {
          fs.appendFileSync('log1.txt', `${lineBreak}${JSON.stringify({ id, message })}`);
        }

        if (!lineBreak) { lineBreak = '\n'; }
      }
    });

    rl.on('close', () => {
      fs.unlinkSync('log.txt');
      fs.renameSync('log1.txt', 'log.txt');
      reject(new Error('Message has not been found'));
    });
  } else {
    reject(new Error('file not exiest'));
  }
});

module.exports = {
  addMessage,
  findAll,
  findOne,
  deleteMessage,
  updateMessage
};
