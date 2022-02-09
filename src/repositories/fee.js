const Fees = require('../models/fees')

const FeesRepository = () => {

    const addFees = async fees => {
        const res = await Fees.create(fees)
        return res
    }

    const getFees = async() => {
        const res = await Fees.findOne()
        if (res) {
            return res.fees
        }
        return false
    }

    const deleteFees = async() => {
        const res = await Fees.deleteOne()
        return res.fees
    }

    return {
        addFees,
        getFees,
        deleteFees
    }
}

module.exports = FeesRepository()
