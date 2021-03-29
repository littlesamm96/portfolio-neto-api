const express = require('express')
const router = express.Router()
const { checkJWT, checkRole } = require('../controllers/auth')
const {getBlogs, getBlogById, getBlogBySlug, createBlog, updateBlog, getBlogsByUser } = require('../controllers/blogs')

router.get('', getBlogs)

router.get('/me', checkJWT, checkRole('admin'), getBlogsByUser)

router.get('/:id', getBlogById)

router.get('/s/:slug', getBlogBySlug)

router.post('', checkJWT, checkRole('admin'), createBlog)

router.patch('/:id', checkJWT, checkRole('admin'), updateBlog)

module.exports = router