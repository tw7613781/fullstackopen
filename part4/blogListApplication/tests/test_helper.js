const Blog = require('../models/blog')
const user = require('../models/user')

const initialBlogs = [
  {
    title: 'My name is Evan You.',
    author: 'evan you',
    url: 'https://evanyou.me/',
    likes: 0,
  },
  {
    title: 'The Node.js Event Loop, Timers, and process.nextTick()',
    author: 'Node',
    url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/',
    likes: 0,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'something',
    url: 'something',
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await user.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
