const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const port = process.env.PORT || 3000;
const path = require('path');

const routes = require('./routes/config');

app.use(express.static('public'));
app.use('/xml', express.static(path.join(__dirname, 'data')))

app.use(expressLayouts);
app.set('layout', './layouts/page');
app.set('view engine', 'ejs');

app.use('/', routes);

app.listen(port, () => {
  console.log(`Sheiko Project @${port}`);
});