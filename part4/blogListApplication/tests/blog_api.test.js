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

describe('Blog Restful API test', () => {
  test('get /api/blogs ==> blogs length', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('get /api/blogs ==> property id exist', async () => {
    const res = await api.get('/api/blogs')
    const blogsId = res.body.map((blog) => blog.id)
    expect(blogsId).toBeDefined()
  })

  test('post /api/blogs ==> blogs number increased by 1 and the content is correct', async () => {
    const newBlog = {
      title: '科技爱好者周刊（第 114 期）：U 盘化生存和 Uber-job',
      author: '阮一峰',
      url: 'http://www.ruanyifeng.com/blog/2020/07/weekly-issue-114.html',
      likes: 0,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const res = await api.get('/api/blogs')
    const contents = res.body.map((r) => r.title)
    expect(res.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents).toContain('科技爱好者周刊（第 114 期）：U 盘化生存和 Uber-job')
  })

  test('post /api/blogs ==> likes of blog is able to be missing and default value is 0', async () => {
    const newBlog = {
      title: '有时候服务端真的没法确定这是一次Ajax请求',
      author: '虢國書館',
      url:
        'http://wxb.github.io/2017/03/08/%E6%9C%89%E6%97%B6%E5%80%99%E6%9C%8D%E5%8A%A1%E7%AB%AF%E7%9C%9F%E7%9A%84%E6%B2%A1%E6%B3%95%E7%A1%AE%E5%AE%9A%E8%BF%99%E6%98%AF%E4%B8%80%E6%AC%A1Ajax%E8%AF%B7%E6%B1%82.html',
    }
    const res = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(res.body.likes).toBe(0)
  })

  test('post /api/blogs ==> title and url are required', async () => {
    const blogNoTitle = {
      author: '虢國書館',
      url:
        'http://wxb.github.io/2017/03/08/%E6%9C%89%E6%97%B6%E5%80%99%E6%9C%8D%E5%8A%A1%E7%AB%AF%E7%9C%9F%E7%9A%84%E6%B2%A1%E6%B3%95%E7%A1%AE%E5%AE%9A%E8%BF%99%E6%98%AF%E4%B8%80%E6%AC%A1Ajax%E8%AF%B7%E6%B1%82.html',
      likes: 0,
    }
    const blogNoUrl = {
      title: '有时候服务端真的没法确定这是一次Ajax请求',
      author: '虢國書館',
      likes: 0,
    }
    await api
      .post('/api/blogs')
      .send(blogNoTitle)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    await api
      .post('/api/blogs')
      .send(blogNoUrl)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => {
  mongoose.connection.close()
  express.server.close()
})
