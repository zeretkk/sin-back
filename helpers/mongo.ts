import {MongoClient} from "mongodb";
const client:MongoClient = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sinc0.s7xsi06.mongodb.net/?retryWrites=true&w=majority`)

client.db('sin').collection('users').createIndexes([
        {key:{'username':1}, name:'username', unique:true},
        {key:{'email':1}, name:'email', unique:true},
    ], {unique:true})
    .then(res=>{
        res.forEach(idx=>console.log(idx+' index created'))
    })
export default client.db('sin')