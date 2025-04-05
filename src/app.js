const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('../config/prisma');
const passport = require('../config/passport');
const flash = require('connect-flash');
const authRoute = require('./routes/authRoute');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000
    },
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma,
      {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use(flash());
app.use(passport.session());

app.get('/', (req, res) => {
  console.log(req.session);
  res.send('test test 123');
})

app.use('/auth', authRoute);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).send(
    err.message || 'Internal Server Error'
  );
});

module.exports = app;