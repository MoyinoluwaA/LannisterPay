const express = require('express')
const FeeController = require('./controllers/fee')
const validateInput = require('./middleware/validation')
const { feeConfigurationSchema, computeTransactionFeeSchema } = require('./schemas/fee')
const serviceContainer = require('./services')
const { errorResponse } = require('./utils/errorResponse')
const FeeControllerHandler = FeeController(serviceContainer, errorResponse)

const router = express.Router()

router.post(
    '/fees', 
    validateInput(feeConfigurationSchema, 'body'),
    (req, res) => {
        FeeControllerHandler.addFee(req, res)
    }
)

router.post(
    '/compute-transaction-fee', 
    validateInput(computeTransactionFeeSchema, 'body'),
    (req, res) => {
        FeeControllerHandler.computeTransactionFee(req, res)
    }
)

module.exports = router
