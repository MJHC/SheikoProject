import express from 'express';
const app = express();
import expressLayouts from 'express-ejs-layouts';
import bodyParser from 'body-parser';
import session from 'express-session';

import * as easyDB from './js/easyData.js';
const port = process.env.PORT || 80;

import {router} from './routes/config.js';

app.use(express.static('public'));

app.use(expressLayouts);
app.use(session(easyDB.sessionOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('layout', './layouts/index');
app.set('view engine', 'ejs');


app.use(router);

app.listen(port, () => {
  console.log(`Sheiko Project @${port}`);
});