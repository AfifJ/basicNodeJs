const { logEvents } = require('./logger');

/* error handler from express doc */
const errLogger = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, `errLog.log`)
  console.log(err.stack)
  res.status(500).send(err.message)
}

module.exports = errLogger