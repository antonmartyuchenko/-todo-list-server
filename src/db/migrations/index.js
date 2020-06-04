const fs = require('fs');
const path = require('path');

const executedMigrate = fs.readFileSync('executedMigrations.json').toString();
let executedMigrations = [];

if (executedMigrate !== '') {
  executedMigrations = JSON.parse(fs.readFileSync('executedMigrations.json'));
}

const fileFilter = (file) => path.extname(file) === '.js' && !executedMigrations.includes(file) && file !== 'index.js';

const files = fs.readdirSync(path.resolve('./src/db/migrations')).filter(fileFilter).sort();

const migrate = () => {
  files.reduce((previousPromise, file) => previousPromise.then(() => {
    // eslint-disable-next-line global-require
    const script = require(`./${file}`);
    fs.appendFileSync('executedMigrations.json', `${JSON.stringify(file)}\n`);
    return script.exec();
  }), Promise.resolve());
};

module.exports = {
  migrate
};
