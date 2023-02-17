const {MongoClient} = require("mongodb")
const client = new MongoClient('mongodb://127.0.0.1:27017')
client.db('sin').collection('user').createIndex({'username':1}, {unique:true})
    .then(res=>{
        console.log('Index created '+res)
    })
module.exports = client.db('sin')