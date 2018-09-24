const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const router = require('./router')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(express.static(path.join(__dirname, "/public")))
app.use('/api', router)

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ezauth'
const PORT = process.env.PORT || 5050

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        console.log("Connected to database")
        app.listen(PORT)
        console.log(`App listening on port ${PORT}`)
    })
    .catch(err=>console.log(err))

