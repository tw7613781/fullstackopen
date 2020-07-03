const mongoose = require('mongoose')
const supertest = require('supertest')
const express = require('../index')

const api = supertest(express.app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseSave = blogObjects.map((blogObject) => blogObject.save())
  await Promise.all(promiseSave)
})

test('', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
  express.server.close()
})
