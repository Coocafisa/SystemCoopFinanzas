const jwt = require('jsonwebtoken');
const config = require('../config');
const  {validateUser} = require('../moduls/users/index');
const { tokenAuth } = require('../moduls/auth/index');
const request = require('../red/request');

async function verifyToken(req, res, next) {
    let token = null;

    if (req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return request.error(req, res, {message: 'No estás autenticado. Token no encontrado.'}, 403);
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await validateUser(decoded.name);
        if (!user) {
            return request.error(req, res, {message: 'Usuario no autorizado.'}, 401);
        }

        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp - now < 180 && decoded.exp > now) {
            const newToken = tokenAuth(user);
            res.setHeader( 'Authorization', `${newToken}`);
           /*  res.cookie('token', newToken, { httpOnly: true }); */
            req.auth = jwt.verify(newToken, config.jwt.secret);
            console.log("Nuevo Token: ", newToken)
        } else if (decoded.exp < now) {
            return request.error(req, res, {message: 'Token expirado.'}, 401);
        } else {
            req.auth = decoded;
        }
        console.log("Datos de la sesión34", req.auth);
        next();          
    } catch (error) {
        request.error(req, res, {message:'Session Expirada.'}, 401);
    }
};

const roleMiddleware = (role) => (req, res, next) => {
    if (!req.auth || !req.auth.role) {
        return res.status(404).json({ errors: "No tienes permisos para acceder a esta ruta.", redirect: "/" });
    } else if (req.auth.role !== role) {
        return res.status(403).json({ errors: "No tienes el rol adecuado para acceder a esta ruta." });
    }
    next();
};

module.exports = { verifyToken, roleMiddleware}