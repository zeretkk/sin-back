const db = require('./mongo')
const moment = require('moment/moment')
const jwt = require('jsonwebtoken')
const Token = require('../models/token')
async function checkToken(token) {
    const session = await db.collection('session').findOne({ token: token })
    if (session && moment().isBefore(moment(session.expires))) {
        return session.user
    } else if (session) {
        await db.collection('session').deleteOne(session)
    }
    return false
}
function generateToken(n) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    var token = ''
    for (var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)]
    }
    return token
}
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
    console.log(presToken)
    console.log(presToken)
    if (presToken) {
        presToken.refreshToken = token
        return presToken.save()
    }
    return await Token.create({
        user: userId,
        refreshToken: token,
    })
}

module.exports = { checkToken, generateToken, generateJWT, writeToken }
