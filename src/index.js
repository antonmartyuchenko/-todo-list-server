express = require('./utils');
routes = require('./routes');

routes.init(express.Router);

express.createServer();
