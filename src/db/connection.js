const mysql = require('mysql2');
const {
  DB_HOST, DB_PORT, USER, PASS, DB
} = require('dotenv').config().parsed;

const connection = mysql.createConnection({
  host: DB_HOST,
  user: USER,
  database: DB,
  password: PASS,
  port: DB_PORT 
});

module.exports = {
  connection
};
