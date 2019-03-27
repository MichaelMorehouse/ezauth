require('dotenv').config()
const express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	routes = require('./routes'),

	app = express()

// NOTE: If your app is intended to perform or handle cross-origin
// requests, run `npm install cors` and uncomment the code below
// Additional configuration may be required, see
// https://www.npmjs.com/package/cors
// const cors = require('cors')
// app.use(cors())

// Register middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('combined'))

// All application requests starting with /api/
// will use the express router
// app.use('/api', routes)

routes(app)

// Pull connection string from env var or 
// fallback to local db during development
// eslint-disable-next-line no-undef
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ezauth'
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8080

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
	.then(() => {
		// eslint-disable-next-line no-console
		console.log('Connected to database')
		app.listen(PORT)
		// eslint-disable-next-line no-console
		console.log(`App listening on port ${PORT}`)
	})
	// eslint-disable-next-line no-console
	.catch(err => console.log(err))

