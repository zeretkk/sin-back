const route = require('express').Router()
const db = require('../helpers/mongo')
const UserController = require('../controllers/UserController/UserController')
const { authMiddleware } = require('../helpers/auth')

route.post('/login', UserController.login)
route.post('/register', UserController.register)
route.get('/logout', UserController.logout)
route.get('/refresh', UserController.refresh)

// TODO:Authorization check middleware
route.get('/:username?', authMiddleware, UserController.getByUsername)

module.exports = route
