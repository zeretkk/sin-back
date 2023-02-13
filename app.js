const express = require('express')
const userController = require('./controllers/user')
const exception = require('./helpers/exceptions')
const exJson = require("express").json

const app = express()
const port = 3000

app.use((req, res, next)=>{
    res.raise=(code)=>{
        res.status(exception[code.toUpperCase()].code).json(exception[code.toUpperCase()])
    }
    next()
})
app.use(exJson())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
app.use('/user', userController)