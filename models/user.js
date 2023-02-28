const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    bio: {type: String, default: ''},
    cover: {type: String, default: ''},
    volume: {type: Number, default: 0},
    sold: {type: Number, default: 0},
    followers: {type: Number, default: 0},
    links: [String],
    createdAt: {type: Date, default: Date.now}
})
const User = mongoose.model('User', userSchema)

module.exports.default = User
module.exports = {User}