import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import {router} from './routes/config.js';
const app = express();

const port = process.env.PORT;
const sessionOps = {
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    /*cookie: {maxAge: (60000*5)}*/
}

app.use(express.static('public'));
app.use(expressLayouts);

app.use(session(sessionOps));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.set('layout', './layouts/default');
app.set('view engine', 'ejs');

app.use(router);

app.listen(port, () => console.log(`Sheiko Project @${port}`));