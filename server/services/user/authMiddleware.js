const jwt = require('jsonwebtoken');
async function verifyToken (req, res, next) {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(403).json({ error: 'No estás autenticado. Token no encontrado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const now = Math.floor(Date.now() / 1000);
        const exp = decoded.exp;
        const remainingTime = exp - now;

        if (remainingTime < 5 * 60) {
            const user = await validateUser(decoded.name);
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const newToken = generateTokenValidation(user);
            res.setHeader('Authorization', `Bearer ${newToken}`);
        }
        req.auth = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Token invalido o expirado'});
    }
}

const roleMiddleware = (role) => (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(404).json({ errors: "No tienes permisos para acceder a esta ruta.", redirect: "/" });
    } else if (req.user.role !== role) {
        return res.status(403).json({ errors: "No tienes el rol adecuado para acceder a esta ruta." });
    }
    next();
};

module.exports = { verifyToken, roleMiddleware}