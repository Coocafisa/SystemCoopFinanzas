const request = require('./request');

function errors(req, res, err) {
    const message = err.message || 'Ocurrió un error';
    const status = err.statusCode || 500;
    return request.error(req, res, message, status);
}

module.exports = errors;