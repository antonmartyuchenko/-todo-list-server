const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const db = require('./db');

const app = express();

db.migrate();

app.use(express.json());
app.use(cors());

routes.init(app);

app.listen(3001);
