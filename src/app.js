const express = require('express')
const cors = require('cors')
const connectDB = require('./config/connect')
const Router = require('./routehandler')
const { successResponse } = require('./utils/successResponse')
const { errorResponse } = require('./utils/errorResponse')
const logger = require('./middleware/logger')

const port = process.env.PORT || 5000
const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(logger)
app.get('/', (req, res) => {
	successResponse(res, 'Welcome to Lannister Pay API', [], 200)
})

app.use(Router)

app.use((req, res) => {
	errorResponse([
        {
            reason: 'notFound',
            message: 'Page not found'
        }
    ], res, null, 404)
})

app.use((err, req, res, next) => {
    errorResponse(
        [{
            reason: 'Internal Server Error',
            message: err.message
        }], 
        res, err.message, 500
    )
})

const bootstrap = async () => {
    try {
        await connectDB; // connect to Database
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        });
    } catch (error) {
        console.log(error);
    }
};

bootstrap()

module.exports = app
