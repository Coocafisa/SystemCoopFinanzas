const jwt = require("jsonwebtoken");
const config = require("../config");
const { validateUser } = require("../modules/users");
const request = require("../red/request");

async function verifyToken(req, res, next) {
    let token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
    if (!token) {
        return request.faultRequest(req, res, { message: "No estás autenticado. Token no encontrado." }, 403);
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await validateUser(decoded.name);

        if (!user) {
            return request.faultRequest(req, res, { message: "Usuario no encontrado." }, 401);
        }

        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            return request.faultRequest(req, res, { message: "Token expirado." }, 401);
        }
        req.auth = decoded;
        next();
    } catch (error) {
        return request.faultRequest(req, res, { message: "Inicia sesión nuevamente para continuar.", redirect: "/" }, 401);
    }
}

const roleMiddleware = (role) => (req, res, next) => {
    if (!req.auth?.role) {
        return request.faultRequest(req, res, { errors: "No tienes permisos para acceder a esta ruta.", redirect: "/" }, 403);
    }
    if (req.auth.role !== role) {
        return request.faultRequest(req, res, { errors: "No tienes el rol adecuado para acceder a esta ruta." }, 403);
    }
    next();
};

module.exports = { verifyToken, roleMiddleware };