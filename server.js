const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logger');
const errLogger = require('./middleware/errLogger');
const PORT = process.env.PORT || 3500;

// custom middleware to log method and url
app.use(logger);

// static folder like public
app.use(express.static(path.join(__dirname, 'public')));

// built in middleware express to handle urlencoded data
// u can say: form data
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built in middleware to for json
app.use(express.json());

// cors rule
app.use(cors(corsOptions));

// index
app.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get(
  '/hello(.html)?',
  (req, res, next) => {
    console.log('Hello ...');
    next();
  },
  (req, res) => {
    res.send('Hello on console');
  }
);

const one = (req, res, next) => {
  console.log('one');
  next();
};
const two = (req, res, next) => {
  console.log('two');
  next();
};
const three = (req, res) => {
  console.log('three');
  res.send('Chain finished');
};

app.get('/chain(.html)?', [one, two, three]);

app.get('/new-page(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
  res.redirect(301, 'new-page');
});

// 404 not found
app.all('*', (req, res) => {
  res.status(404); /* not found */
  // not found in html (browser) or json (ex: postman)
  if (req.accepted('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepted('json')) {
    res.json({ error: '404 Not Found Page' });
  } else {
    res.type('txt').send('404 Not Found Page');
  }
});

// custom middleware to log error
app.use(errLogger);

// listen ( localhost listening )
app.listen(PORT, (req, res) => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
