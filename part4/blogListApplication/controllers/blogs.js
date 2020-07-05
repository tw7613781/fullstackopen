const blogsRoute = require('express').Router()
const Blog = require('../models/blog')
require('express-async-errors')

blogsRoute.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRoute.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRoute.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const ret = await blog.save()
  response.status(201).json(ret)
})

blogsRoute.delete('/:id', async (request, response) => {
  const ret = await Blog.findByIdAndRemove(request.params.id)
  if (ret) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

blogsRoute.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRoute
