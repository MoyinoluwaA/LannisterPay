const feesRepository = require('../repositories/fee')
const { NO_FEE_SET, NO_FEE_APPLIES, INVALID_FEES } = require('../utils/constants')

const FeeService = () => {
    
    const restructureFees = requestBody => {
        const feeConfiguration = requestBody.FeeConfigurationSpec
        const feesArray = feeConfiguration.split('\n')
        const arr = feesArray.map(fee => {
            const feeArr = fee.split(' ')
            const startBracket = feeArr[3].indexOf('(')
            const endBracket = feeArr[3].indexOf(')')
            
            if (feeArr.length !== 8) throw new Error(INVALID_FEES)
            
            return {
                feeId: feeArr[0],
                feeCurrency: feeArr[1],
                feeLocale: feeArr[2],
                feeEntity: feeArr[3].slice(0, startBracket),
                entityProperty: feeArr[3].slice(startBracket + 1, endBracket),
                feeType: feeArr[6],
                feeValue: feeArr[7]
            }
        })
        return {
            fees: arr
        }
    }

    const setFees = async fees => {
        const formerFees = await getFees()
        
        if (formerFees) {
            await feesRepository.addFees(fees)
            await feesRepository.deleteFees(...formerFees)
        } else {
            return await feesRepository.addFees(fees)
        }
    }
    
    const getAppliedFees = async(transaction) => {
        const fees = await getFees()
        if (!fees) throw new Error(NO_FEE_SET)

        let feeLocale;
        if (transaction.CurrencyCountry === transaction.PaymentEntity.Country) {
            feeLocale = 'LOCL'
        } else {
            feeLocale = 'INTL'
        }

        const possibleFees = fees.filter(fee => 
            (fee.feeCurrency === transaction.Currency || fee.feeCurrency === '*')
            &&
            (fee.feeLocale === feeLocale || fee.feeLocale === '*')
            &&
            (fee.feeEntity === transaction.PaymentEntity.Type || fee.feeEntity === '*')
            &&
            (fee.entityProperty === transaction.PaymentEntity.ID || 
            fee.entityProperty === transaction.PaymentEntity.Issuer ||
            fee.entityProperty === transaction.PaymentEntity.Brand || 
            fee.entityProperty === transaction.PaymentEntity.Number ||
            fee.entityProperty === transaction.PaymentEntity.SixID || 
            fee.entityProperty === '*')
        )

        if (possibleFees.length === 0) {
            throw new Error(NO_FEE_APPLIES)
        } else if (possibleFees.length === 1) {
            const [ appliedFees ] = possibleFees
            return appliedFees
        } else {
            return sortFeeBySpecificity(possibleFees)
        }
    }

    const getFees = async() => {
        return await feesRepository.getFees()
    }

    const sortFeeBySpecificity = (fees) => {
        const arr = fees.map(fee => {
            const nonSpecificProp = Object.values(fee._doc).filter(val => val === '*')
            return nonSpecificProp.length
        })
    
        const moreSpecific = fees[arr.indexOf(Math.min(...arr))]
        return moreSpecific
    }

    const calculateTransactionFees = (body, fees) => {
        const appliedFeeId = fees.feeId
        
        let appliedFeeValue, chargeAmount

        if (fees.feeType === 'FLAT') {
            appliedFeeValue = Number(fees.feeValue)
        } else if (fees.feeType === 'PERC') {
            appliedFeeValue = (fees.feeValue / 100) * body.Amount
        } else {
            const fee = fees.feeValue.split(':')
            const fixedFee = Number(fee[0])
            const percentFee = Number(fee[1])
            appliedFeeValue = fixedFee + ((percentFee / 100) * body.Amount)
        }

        if (body.Customer.BearsFee) {
            chargeAmount = body.Amount + appliedFeeValue
        } else {
            chargeAmount = body.Amount
        }
        
        const settlementAmount = chargeAmount - appliedFeeValue

        return {
            AppliedFeeID: appliedFeeId,
            AppliedFeeValue: Math.round(appliedFeeValue),
            ChargeAmount: chargeAmount,
            SettlementAmount: settlementAmount
        }
    }

    return {
        restructureFees,
        getAppliedFees,
        calculateTransactionFees,
        setFees
    }
}


module.exports = FeeService
