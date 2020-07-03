const blogsRoute = require('express').Router()
const Blog = require('../models/blog')
require('express-async-errors')

blogsRoute.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRoute.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const ret = await blog.save()
  response.status(201).json(ret)
})

module.exports = blogsRoute
