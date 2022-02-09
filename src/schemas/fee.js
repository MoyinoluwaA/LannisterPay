const Joi = require('joi')

const feeConfigurationSchema = {
	schema: Joi.object().keys({
		FeeConfigurationSpec: Joi.string().required(),
	}),
	message: 'Input error while setting fee'
}

let hex = Joi.string().length(6).regex(/^[0-9a-fA-F]{6,}$/);
let num = Joi.number().min(100000).max(999999).integer();

const computeTransactionFeeSchema = {
	schema: Joi.object().keys({
		ID: Joi.number().required(),
        Amount: Joi.number().required(),
        Currency: Joi.string().required(),
        CurrencyCountry: Joi.string().required(),
        Customer: Joi.object().keys({
            ID: Joi.number().required(),
            EmailAddress: Joi.string().email().required(),
            FullName: Joi.string().required(),
            BearsFee: Joi.boolean().required()
        }),
        PaymentEntity: Joi.object().keys({
            ID: Joi.number().required(),
            Issuer: Joi.string().required(),
            Brand: Joi.string().allow('', null),
            Number: Joi.string().required(),
            SixID: Joi.alternatives().try(hex, num).required(),
            Type: Joi.string().required(),
            Country: Joi.string().required()
        })
	}),
	message: 'Input error while computing transaction fee'
}

module.exports = {
	feeConfigurationSchema,
    computeTransactionFeeSchema
}
