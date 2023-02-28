const route = require('express').Router()
const db = require('../helpers/mongo')
const bcrypt = require('bcrypt')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const { generateToken, generateJWT, writeToken } = require('../helpers/auth')
const { User } = require('../models/user')
const UserDto = require('../Dtos/User.dto')

route.post('/', (req, res) => {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
            res.status(500).json({
                code: 500,
                message: 'Crypting error',
                type: 'internal',
            })
            return
        }
        try {
            const user = await User.create({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: hash,
            })
            const userDto = new UserDto(user)
            const tokens = generateJWT({ ...userDto })
            await writeToken(user._id, tokens.refreshToken)
            res.status(201).json({ ...tokens, user: userDto })
        } catch (e) {
            console.log(e)
            switch (e?.code) {
                case 11000:
                    res.raise('unique')
                    break
                default:
                    res.raise('internal')
            }
        }
    })
})

route.post('/login', async (req, res) => {
    const tokenPair = generateJWT()
})

// TODO:Authorization check middleware
route.get('/:usename?', (req, res) => {
    db.collection('user')
        .findOne(
            { username: req.user.username },
            { projection: { password: 0 } }
        )
        .then((user) => res.json(user))
        .catch(() => res.raise('internal'))
})
module.exports = route
