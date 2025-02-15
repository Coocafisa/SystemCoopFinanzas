const request = require("../../red/request");
const { validateUser } = require("../users/index");
module.exports = function(dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql');
    }

    async function session(req, res) {
        if (req.auth && req.auth.name) {
            var expiretoken = new Date(req.auth.exp * 1000);
            var currenttime = new Date();
            var timeRemaining = expiretoken - currenttime;
            var totalSeconds = Math.floor(timeRemaining / 1000);
            var totalTimes = {
                minutes: Math.floor(totalSeconds / 60),
                seconds: totalSeconds % 60}
            return res.json({ 
                isAuthenticated: true,
                user: req.auth.name,
                role: req.auth.role,
                expiration: totalTimes,
            });
        } else {
            return res.json({ isAuthenticated: false, user: null });
        }
        
    }

     async function logout(req, res) {
        const { name } = req.auth;
        const { usuario_id } = await validateUser(name);
        if (!data) {
            return request.error(req, res, { message: 'Usuario no encontrado.' }, 404);
        }
        res.clearCookie('token', { path: '/' });
        await db.update('auth', 'sesion = 0', `${usuario_id}`);
        return request.success(req, res, { message: 'Serrando sesión...' }, 200);
    }

    return {
        session,
        logout,
    };
}