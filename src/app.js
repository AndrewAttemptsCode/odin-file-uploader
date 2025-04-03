const express = require('express');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('test test 123');
})

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).send(
    err.message || 'Internal Server Error'
  );
});

module.exports = app;