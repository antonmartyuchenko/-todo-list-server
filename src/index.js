const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const migrations = require('./db/migrations');

const app = express();

migrations.migrate();

app.use(express.json());
app.use(cors());

routes.init(app);

app.listen(3001);
