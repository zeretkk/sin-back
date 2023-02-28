const UserService = require('./user.service')
const { deleteToken, generateJWT, writeToken } = require('../../helpers/auth')
const { User } = require('../../models/user')
const { HTTPException } = require('../../helpers/exceptions')
const bcrypt = require('bcrypt')
const UserDto = require('./User.dto')
class UserController {
    async register(req, res, next) {
        try {
            const { username, email, password } = req.body
            const registeredUsed = await UserService.register(username, email, password)
            res.cookie('refreshToken', registeredUsed.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 1000 * 60 * 60 * 24 * 30,
            })
            res.status(201).json(registeredUsed)
        } catch (e) {
            next(e)
        }
    }
    async login(req, res, next) {
        try {
            const loginInfo = await UserService.login(req.body.username, req.body.password)
            res.cookie('refreshToken', loginInfo.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 1000 * 60 * 60 * 24 * 30,
            })
            res.json(loginInfo)
        } catch (e) {
            next(e)
        }
    }
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.status(200).json({ status: 'success' })
        } catch (e) {
            next(e)
        }
    }
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const userData = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 1000 * 60 * 60 * 24 * 30,
            })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()
