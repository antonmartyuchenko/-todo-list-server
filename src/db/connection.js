const mysql = require('mysql2');
const { HOST, USER, PASS, DB} = require('dotenv').config().parsed;

const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  database: DB,
  password: PASS
});

module.exports = {
    connection
  };