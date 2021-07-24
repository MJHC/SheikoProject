import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import bodyParser from 'body-parser';
import session from 'express-session';
import * as easyDB from './scripts/easyData.js';
import {router} from './routes/config.js';
const app = express();
const port = process.env.PORT;

app.use(express.static('public'));
app.use(expressLayouts);

app.use(session(easyDB.sessionOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('layout', './layouts/index');
app.set('view engine', 'ejs');

app.use(router);

app.listen(port, () => console.log(`Sheiko Project @${port}`));