const jwt = require('jsonwebtoken');
const config = require('../config');
const  {validateUser} = require('../moduls/users/index');
const tokenAuth = require('../moduls/auth/controller');
const request = require('../red/request');

async function verifyToken(req, res, next) {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return request.error(req, res, 'No estás autenticado. Token no encontrado.', 403);
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        const now = Math.floor(Date.now() / 1000);
        const exp = decoded.exp;
        const remainingTime = exp - now;

        if (remainingTime > 0) {
            const user = await validateUser(decoded.name);
            if (!user) {
                return request.error(req, res, 'Usuario no autorizado.', 401);
            }

            /* if (remainingTime < 120) {
                const newToken = tokenAuth(user);
                res.setHeader('Authorization', `Bearer ${newToken}`);
                res.cookie('token', newToken, { httpOnly: true });
            }
            const newToken = tokenAuth(user);
                res.setHeader('Authorization', `Bearer ${newToken}`);
                res.cookie('token', newToken, { httpOnly: true }); */
            req.auth = decoded;
            next();          
        }
    } catch (error) {
        request.error(req, res, 'Token invalido o expirado.', 401);
    }
}

const roleMiddleware = (role) => (req, res, next) => {
    if (!req.auth || !req.auth.role) {
        return res.status(404).json({ errors: "No tienes permisos para acceder a esta ruta.", redirect: "/" });
    } else if (req.auth.role !== role) {
        return res.status(403).json({ errors: "No tienes el rol adecuado para acceder a esta ruta." });
    }
    next();
};

module.exports = { verifyToken, roleMiddleware}