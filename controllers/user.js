const route = require('express').Router()
const db = require('../helpers/mongo')
const bcrypt = require("bcrypt");
const moment = require('moment')
const {generateToken} = require("../helpers/auth");
const {User} = require("../models/user");


route.post('/', (req, res)=>{
    bcrypt.hash(req.body.password, 10,  (err, hash)=>{
        if(err) {
            res.status(500).json({code: 500, message: 'Crypting error', type: 'internal'})
            return
        }
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            email:req.body.email,
            password: hash,
        })
        user.save()
            .then(saved=>{
                res.status(201).json({"user": saved.username})
            })
            .catch(err=>{
                if(err.code === 11000){
                    res.raise('unique')
                }
            })
    })
})

route.post('/login', async (req, res)=>{

})

// TODO:Authorization check middleware
route.get('/:usename?', (req, res)=>{
        db.collection('user').findOne({username: req.user.username}, {projection: {password:0}})
            .then(user => res.json(user))
            .catch(()=>res.raise('internal'))

})
module.exports = route