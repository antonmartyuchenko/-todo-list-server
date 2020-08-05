const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'todolist',
  password: 'Liverpoolfc1993'
});

const addMessage = (newMessage) => new Promise((resolve, reject) => {
  connection.execute(
    'INSERT INTO `messages` (`message`) VALUES (?)',
    [newMessage],
    (err, results) => {
      resolve({ id: results.insertId, message: newMessage });
    }
  );
});

const findAll = () => new Promise(resolve => {
  connection.query(
    'SELECT * FROM `messages`',
    (err, results) => {
      resolve(results.map(item => ({ id: item.id, message: item.message })));
    }
  );
});

const findOne = messageId => new Promise((resolve, reject) => {
  connection.query(
    'SELECT * FROM `messages` WHERE `id` = ?',
    [parseInt(messageId, 10)],
    (err, results) => {
      if (results.length) {
        resolve(results.map(item => ({ id: item.id, message: item.message })));
      } else {
        reject(new Error('Message has not been found'));
      }
    }
  );
});

const deleteMessage = messageId => new Promise((resolve, reject) => {
  connection.query(
    'DELETE FROM `messages` WHERE `id` = ?',
    [parseInt(messageId, 10)],
    (err, results) => {
      if (results.affectedRows) {
        resolve();
      } else {
        reject(new Error('Message has not been found'));
      }
    }
  );
});

const updateMessage = (messageId, modifiedMessage) => new Promise((resolve, reject) => {
  const numberId = parseInt(messageId, 10);

  connection.query(
    'UPDATE `messages` SET `message` = ? WHERE `id` = ?',
    [modifiedMessage, numberId],
    (err, results) => {
      if (results.affectedRows) {
        resolve({ id: numberId, message: modifiedMessage });
      } else {
        reject(new Error('Message has not been found'));
      }
    }
  );
});

module.exports = {
  addMessage,
  findAll,
  findOne,
  deleteMessage,
  updateMessage
};
