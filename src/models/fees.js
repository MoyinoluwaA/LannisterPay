const mongoose = require('mongoose')
const Schema = mongoose.Schema

const feeSchema = new Schema({
    feeId: {
        type: String,
        required: true
    },
    feeCurrency: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 3
    },
    feeLocale: {
        type: String,
        required: true,
        enum: { 
            values: ['LOCL', 'INTL', '*'], 
            message: '{VALUE} is not a valid Fee Locale'
        }
    },
    feeEntity: {
        type: String,
        required: true,
        enum: { 
            values: ['CREDIT-CARD', 'DEBIT-CARD', 'BANK-ACCOUNT', 'USSD', 'WALLET-ID', '*'], 
            message: '{VALUE} is not a valid Fee Entity'
        }
    },
    entityProperty: {
        type: String,
        required: true
    },
    feeType: {
        type: String,
        required: true,
        enum: { 
            values: ['FLAT', 'PERC', 'FLAT_PERC'],
            message: '{VALUE} is not a valid Fee Type'
        }
    },
    feeValue: {
        type: String,
        required: true
    },
})

const FeesSchema = new Schema({
    fees: {
        type: [feeSchema],
        required: true
    },
    
}, { timestamps: true })

const Fees = mongoose.model('Fees', FeesSchema)
module.exports = Fees
