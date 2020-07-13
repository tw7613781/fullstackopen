const bcrypt = require('bcrypt')
const usersRoute = require('express').Router()
const User = require('../models/user')
require('express-async-errors')

usersRoute.post('/', async (req, res, next) => {
  const body = req.body

  if (body.password === void 0) {
    throw Error(Error('`password` is required'))
  }

  if (body.password.length < 3) {
    throw Error('password length should be longger or equal to 3')
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  res.json(savedUser)
})

usersRoute.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

module.exports = usersRoute
