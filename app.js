require('dotenv').config()
const express = require('express')
const exJson = require('express').json
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const moment = require('moment-timezone')
const mongoose = require('mongoose')
const { exceptionMiddleware } = require('./helpers/exceptions')
moment.tz.setDefault('Europe/Moscow')
const userRouter = require('./routes/user')

const app = express()
const port = 3001

app.use(exJson())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, async () => {
    await mongoose.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sinc0.s7xsi06.mongodb.net/sin?retryWrites=true&w=majority`
    )
    console.log(`Example app listening on port ${port}`)
})
app.use('/user', userRouter)
app.use(exceptionMiddleware)
