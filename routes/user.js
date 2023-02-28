const route = require('express').Router()
const db = require('../helpers/mongo')
const UserController = require('../controllers/UserController/UserController')

route.post('/login', UserController.login)
route.post('/register', UserController.register)
route.get('/logout', UserController.logout)
route.get('/refresh', UserController.refresh)

// TODO:Authorization check middleware
route.get('/:usename?', (req, res) => {
    db.collection('user')
        .findOne({ username: req.params.username }, { projection: { password: 0 } })
        .then((user) => res.json(user))
        .catch(() => res.raise('internal'))
})

module.exports = route
