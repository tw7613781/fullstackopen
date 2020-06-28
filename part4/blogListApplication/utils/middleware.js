const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.name === 'CastError') {
    res.status(400).send({ error: 'malformatted id' })
  }
  if (err.name === 'SyntaxError') {
    res.status(400).send({ error: err.message })
  }
  if (err.name === 'ValidationError') {
    res.status(400).send({ error: err.message })
  }
  next(err)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
}
