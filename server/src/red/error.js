const request = require('./request');

function errors(err, req, res, next) {
    const isProduction = process.env.NODE_ENV === 'production';
    const message = isProduction ? 'Error interno del servidor' : err.message || 'Error interno del servidor';
    const status = err.statusCode || 500;
    console.error(`[${new Date().toISOString()}] Error ${status}: ${message}`);
    next(err);
    return request.faultRequest(req, res, message, status);
}

module.exports = errors;