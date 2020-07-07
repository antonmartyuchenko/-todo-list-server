const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const db = require('./db');

const app = express();

db.migrate().then(() => {
  app.use(express.json());
  app.use('*', cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }));

  routes.init(app);

  app.listen(3001, () => console.info('The server is running'));
});
