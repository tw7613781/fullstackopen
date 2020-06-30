const _ = require('lodash')
const blog = require('../models/blog')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const ret = blogs.reduce((current, blog) => current + blog.likes, 0)
  return ret
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {}
  const fav = blogs.reduce((favBlog, blog) => (blog.likes > favBlog.likes ? blog : favBlog))
  return {
    title: fav.title,
    author: fav.author,
    likes: fav.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}
  const ret = _.chain(blogs).countBy('author').toPairs().maxBy(_.last).value()
  return {
    author: ret[0],
    blogs: ret[1],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}
  const sum = (value, key) => {
    return [key, _.sumBy(value, 'likes')]
  }
  const ret = _.chain(blogs).groupBy('author').map(sum).maxBy(_.last).value()
  return {
    author: ret[0],
    likes: ret[1],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
