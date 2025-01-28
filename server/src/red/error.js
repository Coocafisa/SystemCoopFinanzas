const request = require('./request');

function errors(err, req, res) {
    const message = err.message || 'Ocurrió un error';
    const status = err.statusCode || 500;
    request.error(req, res, message, status);
}

module.exports = errors;