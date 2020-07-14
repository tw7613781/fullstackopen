const logger = require('./logger')
var unless = require('express-unless')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
    next()
  } else {
    return response.status(401).json({ error: 'token is missing' })
  }
}
tokenExtractor.unless = unless

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV != 'test') {
    console.log(err.message)
  }
  if (err.name === 'CastError') {
    res.status(400).json({ error: 'malformatted id' })
  }
  if (err.name === 'SyntaxError') {
    res.status(400).json({ error: err.message })
  }
  if (err.name === 'ValidationError') {
    res.status(400).json({ error: err.message })
  }
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ error: 'invalid token' })
  }
  if (err.name === 'Error') {
    res.status(400).json({ error: err.message })
  }
  next(err)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
}
