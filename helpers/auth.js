const jwt = require('jsonwebtoken')
const Token = require('../models/token')

function generateJWT(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '30m',
    })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '30d',
    })
    return { accessToken, refreshToken }
}
async function writeToken(userId, token) {
    const presToken = await Token.findOne({ user: userId })
    if (presToken) {
        presToken.refreshToken = token
        return presToken.save()
    }
    return await Token.create({
        user: userId,
        refreshToken: token,
    })
}
function deleteToken(token) {
    return Token.deleteOne({ refreshToken: token })
}
function validateToken(token, type) {
    if (type === 'access') {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    } else if (type === 'refresh') {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    }
    return null
}

module.exports = { generateJWT, writeToken, deleteToken, validateToken }
