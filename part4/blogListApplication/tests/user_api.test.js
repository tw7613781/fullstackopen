const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const express = require('../index')

const api = supertest(express.app)

const User = require('../models/user')
const helper = require('./test_helper')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      passwordHash,
    })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersStStart = await helper.usersInDb()
    const newUser = {
      username: 'tw7613781',
      name: 'Max',
      password: 'tangwei@2020',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersStStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersStStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'tangwei@2020',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersStStart.length)
  })

  test('creation fails with proper statuscode and message if password is not given', async () => {
    const usersStStart = await helper.usersInDb()

    const newUser = {
      username: 'testtest',
      name: 'testtest',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`password` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersStStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  express.server.close()
})
