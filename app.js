require('dotenv').config()
const express = require('express')
const userController = require('./controllers/user')
const exception = require('./helpers/exceptions')
const exJson = require("express").json
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const moment = require('moment-timezone')
const mongoose = require("mongoose");
moment.tz.setDefault('Europe/Moscow')

const app = express()
const port = 3001

app.use(cors())
app.use(exJson())
app.use(cookieParser())
app.use(bodyParser.json())

app.use((req, res, next)=>{
    res.raise=(code)=>{
        res.status(exception[code.toUpperCase()].code).json(exception[code.toUpperCase()])
    }
    next()
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, async () => {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sinc0.s7xsi06.mongodb.net/sin?retryWrites=true&w=majority`)
    console.log(`Example app listening on port ${port}`)
})

app.use('/user', userController)