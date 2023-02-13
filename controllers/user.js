const route = require('express').Router()
const db = require('../helpers/mongo')
const bcrypt = require("bcrypt");
const moment = require('moment')
const crypto = require('crypto')
const {checkToken} = require("../helpers/auth");


route.post('/', (req, res)=>{
    bcrypt.hash(req.body.pass, 10, (err, hash)=>{
        if(err) {
            res.status(500).json({code: 500, message: 'Internal server error', type: 'internal'})
            return
        }
        db.collection('user').insertOne({...req.body, pass:hash})
            .then(result=>{
                if(result.acknowledged){
                    res.json(result.insertedId)
                }else{
                    res.status(500).json({code:500, message:'Internal server error', type:'internal'})
                }
            })
            .catch(err=>{
                if(err.code === 11000){
                    res.status(400).json({code:400, message:'Username must be unique', type:'unique'})
                }
            })
    })
})

route.post('/login', (req, res)=>{
    console.log(req.body)
    if(req.body.username && req.body.pass){
        db.collection('user').findOne({username: req.body.username})
            .then(user=>{
                if(user){
                    bcrypt.compare(req.body.pass, user.pass, (err, result)=>{
                        if(err){
                            res.raise('internal')
                            return
                        }
                        if(result){
                            const token = crypto.randomUUID({disableEntropyCache:true})
                            db.collection('session').insertOne({
                                token:token,
                                expires:moment().add(1, 'day').toDate(),
                                user: user._id
                            }).then(()=>{
                                const userObj = {...user}
                                delete userObj['pass']
                                res.json({...userObj, token})
                            })
                                .catch(()=>res.raise('internal'))

                        }else{
                            res.status(401).json({code:401, message:'Wrong credentials'})
                        }

                    })
                }
            })
    }else if(req.headers['authorization']){
        const token = req.headers['authorization'].replace('Bearer ', '')
        checkToken(token).then(userId=>{
            if(userId){
                db.collection('user').findOne({_id: userId}, {projection: {pass: 0}})
                    .then(user=>{
                        if(user){
                            res.json(user)
                        }else{
                            res.raise('internal')
                        }
                    })
                    .catch(()=>res.raise('internal'))
            }else{
                res.status(401).json({code:401, message:'Unauthorized', type:'unauthorized'})
            }
        })

    }else{
        res.raise('internal')
    }
})

// TODO:Authorization check middleware
route.get('/', (req, res)=>{
        db.collection('user').findOne({username: req.user.username}, {projection: {pass:0}})
            .then(user => res.json(user))
            .catch(()=>res.status(500).json({code:500, message:'Internal server error', type:'internal'}))

})
module.exports = route