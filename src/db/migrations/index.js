const fs = require('fs');
const path = require('path');
const { connection } = require('../connection');

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

    return script.exec().then(() => {
      connection.execute(
        'INSERT INTO `migrations` (`migration`) VALUES (?)',
        [file]
      );
    });
  }), Promise.resolve());
});

module.exports = {
  migrate
};
