const { NO_FEE_SET } = require("../utils/constants")

const FeeController = (serviceContainer, errorResponse) => {

	/** @desc Adds fee configuration
     * @param {object} req - The request object 
     * @param {object} res - The response object 
	 * @route  POST /fees
    */
	const addFee = async(req, res) => {
		try {
			const fees = await serviceContainer.feeService.restructureFees(req.body)
            await serviceContainer.feeService.setFees(fees)

            res.status(200).json({
                status: 'ok'
            })
	
		} catch (error) {
            errorResponse(
				[{
					domain: "global",
					reason: "badRequest",
					message: "Bad Request"
				}], 
				res, error.message, 400
			)
		}
	}

	/** @desc Computes transaction Fee
     * @param {object} req - The request object 
     * @param {object} res - The response object 
	 * @route  POST /compute-transaction-fee
    */
	const computeTransactionFee = async(req, res) => {
		try {
			const { body } = req
			const appliedFees = await serviceContainer.feeService.getAppliedFees(body)
			const response = await serviceContainer.feeService.calculateTransactionFees(body, appliedFees)

			res.status(200).json({
                ...response
            })

		} catch (error) {
			let statusCode, reason, message
			if (error.message === NO_FEE_SET) {
				statusCode =  400
				reason = 'badRequest'
				message = 'Bad Request'
			} else {
				statusCode = 404
				reason = 'notFound',
				message = 'Not Found'
			}
			errorResponse(
				[{
					domain: "global",
					reason: reason,
					message: message
				}], 
				res, error.message, statusCode
			)
		}
	}

	return {
		addFee,
		computeTransactionFee
	}
}


module.exports = FeeController
