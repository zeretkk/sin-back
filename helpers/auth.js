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

module.exports = {checkToken}