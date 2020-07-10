const fs = require('fs');
const readline = require('readline');

const createInterface = () => readline.createInterface({
  input: fs.createReadStream('log.txt'),
  output: process.stdout,
  terminal: false
});

const addMessage = (newMessage) => new Promise((resolve, reject) => {
  let count = 0;

  if (fs.existsSync('log.txt')) {
    const rl = createInterface();

    rl.on('line', line => {
      if (line) {
        count = JSON.parse(line).id;
        count++;
      }
    });

    rl.on('close', () => {
      fs.appendFileSync('log.txt', `\n${JSON.stringify({ id: count, message: newMessage })}`);
      resolve(JSON.stringify({ id: count, message: newMessage }));
    });
  } else {
    fs.appendFileSync('log.txt', `${JSON.stringify({ id: count, message: newMessage })}`);
    resolve(JSON.stringify({ id: count, message: newMessage }));
  }
});

const findAll = () => {
  if (fs.existsSync('log.txt')) {
    const fileData = fs.readFileSync('log.txt', 'utf8');

    if (fileData) {
      return fileData.split('\n').map(line => {
        if (line) {
          return JSON.parse(line);
        }
        return null;
      }).filter(task => task);
    }
  }

  return [];
};

const findOne = messageId => new Promise((resolve, reject) => {
  if (fs.existsSync('log.txt')) {
    const rl = createInterface();

    const numberId = parseInt(messageId, 10);

    rl.on('line', line => {
      if (line) {
        const { id, message } = JSON.parse(line);

        if (id === numberId) {
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
    reject(new Error('Message has not been found'));
  }
});

const deleteMessage = messageId => new Promise((resolve, reject) => {
  let lineBreak = '';
  let messageDeleted = false;

  if (fs.existsSync('log.txt')) {
    const rl = createInterface();
    const numberId = parseInt(messageId, 10);

    rl.on('line', line => {
      if (line) {
        const { id } = JSON.parse(line);

        if (id !== numberId) {
          fs.appendFileSync('log1.txt', `${lineBreak}${line}`);
        } else {
          messageDeleted = true;
        }

        if (!lineBreak) { lineBreak = '\n'; }
      }
    });

    rl.on('close', () => {
      fs.unlinkSync('log.txt');
      fs.renameSync('log1.txt', 'log.txt');

      if (messageDeleted) {
        resolve();
      } else {
        reject(new Error('Message has not been found'));
      }
    });
  } else {
    reject(new Error('Message has not been found'));
  }
});

const updateMessage = (messageId, modifiedMessage) => new Promise((resolve, reject) => {
  let lineBreak = '';
  let messageModified = false;

  if (fs.existsSync('log.txt')) {
    const rl = createInterface();

    const numberId = parseInt(messageId, 10);

    rl.on('line', line => {
      if (line) {
        const { id } = JSON.parse(line);

        if (id === numberId) {
          fs.appendFileSync('log1.txt', `${lineBreak}${JSON.stringify({ id, message: modifiedMessage })}`);
          messageModified = true;
        } else {
          fs.appendFileSync('log1.txt', `${lineBreak}${line}`);
        }

        if (!lineBreak) { lineBreak = '\n'; }
      }
    });

    rl.on('close', () => {
      fs.unlinkSync('log.txt');
      fs.renameSync('log1.txt', 'log.txt');

      if (messageModified) {
        resolve(JSON.stringify({ id: numberId, message: modifiedMessage }));
      } else {
        reject(new Error('Message has not been found'));
      }
    });
  } else {
    reject(new Error('Message has not been found'));
  }
});

module.exports = {
  addMessage,
  findAll,
  findOne,
  deleteMessage,
  updateMessage
};
