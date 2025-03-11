const jwt = require("jsonwebtoken");
const config = require("../config");
const { validateUser } = require("../modules/users");
const request = require("../red/request");

async function verifyToken(req, res, next) {
    let token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
    if (!token) {
        return request.error(req, res, { message: "No estás autenticado. Token no encontrado." }, 403);
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await validateUser(decoded.name);

        if (!user) {
            return request.error(req, res, { message: "Usuario no autorizado.", redirect: "/" }, 401);
        }

        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            return request.error(req, res, { message: "Token expirado." }, 401);
        }
        req.auth = decoded;
        next();
    } catch (error) {
        return request.error(req, res, { message: "Inicia sesión nuevamente para continuar.", redirect: "/" }, 401);
    }
}

const roleMiddleware = (role) => (req, res, next) => {
    if (!req.auth?.role) {
        return res.status(403).json({ errors: "No tienes permisos para acceder a esta ruta.", redirect: "/" });
    }
    if (req.auth.role !== role) {
        return res.status(403).json({ errors: "No tienes el rol adecuado para acceder a esta ruta." });
    }
    next();
};

module.exports = { verifyToken, roleMiddleware };