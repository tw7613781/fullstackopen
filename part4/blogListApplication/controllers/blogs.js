const blogsRoute = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const usersRoute = require('./users')
require('express-async-errors')

blogsRoute.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
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
  const body = request.body

  const user = await User.findById(body.userId)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const ret = await blog.save()
  user.blogs = user.blogs.concat(ret._id)
  await user.save()
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
