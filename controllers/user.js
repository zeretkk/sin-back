const route = require('express').Router()
const exJson = require('express').json
const db = require('../helpers/mongo')
const bcrypt = require("bcrypt");
const moment = require('moment')
const crypto = require('crypto')
route.get('/:username?', (req, res)=>{

    if(req.params.username){
        db.collection('user').findOne({username: req.params.username}, {projection: {pass:0}})
            .then(user => res.json(user))
            .catch(err=>res.status(500).json({code:500, message:'Internal server error', type:'internal'}))
    }else{
        res.status(400).json({code:400, message:'Username must be specified', type:'missing'})
    }
})

route.use(exJson())
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
                            })
                            const userObj = {...user}
                            delete userObj['pass']
                            res.json({...userObj, token})
                        }else{
                            res.status(401).json({code:401, message:'Wrong credentials'})
                        }

                    })
                }
            })
    }else if(req.headers['authorization']){
        const token = req.headers['authorization'].replace('Bearer ', '')
        db.collection('session').findOne({token:token})
            .then(session=>{
                console.log(session)
                console.log(session.expires)
                console.log(moment().isBefore(moment(session.expires)))
                if(session && moment().isBefore(moment(session.expires))){
                    db.collection('user').findOne({_id:session.user}, {projection:{pass:0}})
                        .then(user=>{
                            res.json({...user, token:session.token})
                        })
                }else if(session){
                    db.collection('session').deleteOne(session)
                        .then(r => res.status(401).json({code:401, message:'Session Expired'}))
                }else{
                    res.status(401).json({code:401, message:'Wrong credential'})
                }
            }).catch(()=>res.raise('internal'))
    }else{
        res.raise('internal')
    }

})
module.exports = route