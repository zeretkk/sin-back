const db = require("./mongo");
const moment = require("moment/moment");

async function checkToken(token) {
    const session = await db.collection('session').findOne({token:token})
    if( session && moment().isBefore(moment(session.expires)) ){
        return session.user
    }else if(session){
        await db.collection('session').deleteOne(session)
    }
    return false
}
function generateToken(n) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var token = '';
    for(var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}

module.exports = {checkToken, generateToken}