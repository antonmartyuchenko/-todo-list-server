const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('E:\\Martyuchenko\\js\\Work\\todo-list-server\\src\\db\\migrations');

const migrate = () => {
  const data = fs.readFileSync('executedMigrations.json').toString();

  let executedMigrations = [];

  if (data !== '') {
    executedMigrations = JSON.parse(fs.readFileSync('executedMigrations.json'));
  }

  for (const file of files) {
    if (path.extname(file) === '.js' && !executedMigrations.includes(file) && file !== 'index.js') {
      // eslint-disable-next-line global-require
      const script = require(`./${file}`);
      script.exec();
      executedMigrations.push(file);
      fs.writeFileSync('executedMigrations.json', JSON.stringify(executedMigrations));
    }
  }
};

module.exports = {
  migrate
};
