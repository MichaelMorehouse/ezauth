const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const router = require('./router')

const app = express()

// NOTE: If your app is intended to perform or handle cross-origin
// requests, run `npm install cors` and uncomment the code below
// Additional configuration may be required, see
// https://www.npmjs.com/package/cors
// const cors = require('cors')
// app.use(cors())

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(morgan('combined'))
// Static files are served from the applications /public directory
app.use(express.static(path.join(__dirname, "/public")))
// All application requests starting with /api/
// will use the express router
app.use('/api', router)

// Pull connection string from env var or 
// fallback to local db during development
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ezauth'
const PORT = process.env.PORT || 5050

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        console.log("Connected to database")
        app.listen(PORT)
        console.log(`App listening on port ${PORT}`)
    })
    .catch(err=>console.log(err))

