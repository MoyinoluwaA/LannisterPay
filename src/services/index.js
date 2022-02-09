const FeeService = require('./feeService')

const ContainerService = () => {
    return {
        feeService: FeeService()
    }
}

module.exports = ContainerService()
