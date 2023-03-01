const User = require('../../models/user')
const Token = require('../../models/token')
const UserDto = require('./User.dto')
const { generateJWT, writeToken, deleteToken, validateToken } = require('../../helpers/auth')
const bcrypt = require('bcrypt')
const { HTTPException } = require('../../helpers/exceptions')

class UserService {
    async register(username, email, password) {
        try {
            const hash = bcrypt.hashSync(password, 10)
            const user = await User.create({
                username: username,
                email: email,
                password: hash,
            })
            const userDto = new UserDto(user)
            const tokens = generateJWT({ ...userDto })
            await writeToken(user._id, tokens.refreshToken)
            return { ...tokens, user: userDto }
        } catch (e) {
            switch (e?.code) {
                case 11000:
                    throw HTTPException.BadRequest('Username and email must be unique')
                default:
                    throw HTTPException.Internal()
            }
        }
    }

    async login(username, password) {
        const user = await User.findOne({ username: username })
        if (!user) {
            throw HTTPException.BadRequest('Unknown username')
        }
        if (!bcrypt.compareSync(password, user.password)) {
            throw HTTPException.Unauthorized('Incorrect Password')
        }
        const userDto = new UserDto(user)
        const tokens = generateJWT({ ...userDto })
        await writeToken(user._id, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }
    logout(refreshToken) {
        deleteToken(refreshToken)
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw HTTPException.Unauthorized()
        }
        const userData = validateToken(refreshToken, 'refresh')
        const savedToken = await Token.findOne({ refreshToken: refreshToken })
        if (!userData || !savedToken) {
            throw HTTPException.Unauthorized()
        }
        const user = await User.findOne({ username: userData.username })
        const userDto = new UserDto(user)
        const tokens = generateJWT({ ...userDto })
        return { ...tokens, user: userDto, refreshToken }
    }
    async getByUsername(username) {
        if (!username) {
            throw HTTPException.BadRequest('Unknown username')
        }
        const found = await User.findOne({ username: username })
        if (!found) {
            throw HTTPException.NotFound()
        }
        return new UserDto(found)
    }
}

module.exports = new UserService()
