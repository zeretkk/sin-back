const {MongoClient} = require("mongodb")
const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sinc0.s7xsi06.mongodb.net/?retryWrites=true&w=majority`)

client.db('sin').collection('user').createIndexes([
    {key:{'username':1}, name:'username'},
    {key:{'email':1}, name:'email'},
], {unique:true})
    .then(res=>{
        res.forEach(idx=>console.log(idx+' index created'))
    })
module.exports = client.db('sin')