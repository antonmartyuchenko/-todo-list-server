const express = require('./utils');
const routes = require('./routes');

routes.init(express.Router);

express.createServer();
