const { migrate } = require('./migrations');
const { connection } = require('./connection');

module.exports = {
  migrate, connection
};
