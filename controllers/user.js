const route = require('express').Router()
const db = require('../helpers/mongo')
const bcrypt = require("bcrypt");
const moment = require('moment')
const {generateToken} = require("../helpers/auth");


route.post('/', (req, res)=>{
    bcrypt.hash(req.body.password, 10, (err, hash)=>{
        if(err) {
            res.status(500).json({code: 500, message: 'Crypting error', type: 'internal'})
            return
        }
        const user = {
            name: req.body.name,
            username: req.body.username,
            password: hash,
            status:'status here',
            comments:0,
            posts:0,
            createdAt: moment(moment.now()).toDate()
        }
        db.collection('user').insertOne(user)
            .then(result=>{
                if(result.acknowledged){
                    res.status(201).json({status:'created', id:result.insertedId})
                }else{
                    res.status(500).json({code:500, message:'Internal server error', type:'internal'})
                }
            })
            .catch(err=>{
                if(err.code === 11000){
                    res.status(400).json({code:400, message:'Username must be unique', type:'unique'})
                    return
                }
                res.status(500).json({code:500, message:'Internal server error', type:'internal'})
            })
    })
})

route.post('/login', async (req, res)=>{
    console.log(req.body)
    if(req.body.username && req.body.password){
       const user = await db.collection('user').findOne({username:req.body.username})
        if(user){
            if(bcrypt.compareSync(req.body.password, user.password)) {
                const session = await db.collection('session').findOne({user: user._id})
                const userObj = {...user}
                delete userObj['password']
                if(session && moment(moment.now()).isBefore(session.expires)){
                    res.json({...userObj, token:session.token})
                    return
                }else if(session){
                    await db.collection('session').deleteOne(session)
                }
                const newSession = {
                    token: generateToken(45),
                    expires: moment(moment().add(24, 'hours')).toDate(),
                    user: user._id
                }
                await db.collection('session').insertOne(newSession)
                res.json({...userObj, token:newSession.token})
                return
            }
            res.status(401).json({code:401, message:'Wrong credentials', type:'wrong'})
        }
    }else{
        res.raise('internal')
    }
})

// TODO:Authorization check middleware
route.get('/', (req, res)=>{
        db.collection('user').findOne({username: req.user.username}, {projection: {password:0}})
            .then(user => res.json(user))
            .catch(()=>res.status(500).json({code:500, message:'Internal server error', type:'internal'}))

})
module.exports = route