import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import * as easyDB from './scripts/easyData.js';
import {router} from './routes/config.js';
const app = express();
const port = process.env.PORT;

app.use(express.static('public'));
app.use(expressLayouts);

app.use(session(easyDB.sessionOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.set('layout', './layouts/default');
app.set('view engine', 'ejs');

app.use(router);

app.listen(port, () => console.log(`Sheiko Project @${port}`));