/**
 * @description A function that facilitates the response of a successful request
 * @param {Response} res http response object
 * @param {String} message custom success message
 * @param {Object} data custom success message
 * @param {Number} [status=200] http success status code, defaults to 200
 * @returns {Response} http response with success status and message
*/
exports.successResponse = (res, message, data, status = 200) => {
    const resBody = {
        status: 'success', code: status, message, data,
    }

    return res.status(status).json(resBody)
}