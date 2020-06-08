const fs = require('fs');
const path = require('path');

let executedMigrations = [];

if (fs.existsSync('executedMigration.json')) {
  const executedMigrate = fs.readFileSync('executedMigration.json').toString();

  if (executedMigrate !== '') {
    executedMigrations = JSON.parse(executedMigrate);
  }
}

const fileFilter = (file) => path.extname(file) === '.js' && !executedMigrations.includes(file) && file !== 'index.js';

const migrate = () => {
  const files = fs.readdirSync(path.resolve('./src/db/migrations')).filter(fileFilter).sort();
  return files.reduce((previousPromise, file) => previousPromise.then(() => {
    // eslint-disable-next-line global-require
    const script = require(`./${file}`);
    fs.appendFileSync('executedMigration.json', `${JSON.stringify(file)}\n`);
    return script.exec();
  }), Promise.resolve());
};

module.exports = {
  migrate
};
