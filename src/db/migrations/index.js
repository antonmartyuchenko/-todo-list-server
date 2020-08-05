const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'todolist',
  password: 'Liverpoolfc1993'
});

const getExecutedMigrations = () => new Promise((resolve) => {
  connection.query(
    'SELECT `migration` FROM `migrations`',
    (err, results) => {
      resolve(results.map(item => item.migration));
    }
  );
});

const migrate = () => getExecutedMigrations().then((executedMigrations) => {
  const fileFilter = (file) => path.extname(file) === '.js' && !executedMigrations.includes(file) && file !== 'index.js';

  const files = fs.readdirSync(path.resolve('./src/db/migrations')).filter(fileFilter).sort();

  return files.reduce((previousPromise, file) => previousPromise.then(() => {
    // eslint-disable-next-line global-require
    const script = require(`./${file}`);

    connection.execute(
      'INSERT INTO `migrations` (`migration`) VALUES (?)',
      [file]
    );

    return script.exec();
  }), Promise.resolve());
});

module.exports = {
  migrate
};
