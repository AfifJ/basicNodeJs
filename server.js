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

// built in middleware express to handle urlencoded data
// u can say: form data
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built in middleware to for json
app.use(express.json());

// cors rule
app.use(cors(corsOptions));

// static folder like public
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/subdir', express.static(path.join(__dirname, 'public')));

// routes
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employees'));

// 404 not found
app.all('*', (req, res) => {
  res.status(404); /* not found */
  // not found in html (browser) or json (ex: postman)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
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
