const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRoute = require('./controllers/blogs')

logger.info('Connecting to', config.MONGODB_URI)
const mongoUrl = config.MONGODB_URI
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('DB connected successful')
  })
  .catch((e) => {
    logger.error('DB connected failed')
    process.exit(1)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRoute)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = config.PORT
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

module.exports = {
  app,
  server,
}
