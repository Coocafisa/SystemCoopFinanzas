const request = require("../../red/request");
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
        res.clearCookie('token', { path: '/' });
        const data = await db.query(`entities INNER JOIN users ON entities.entidad_id = users.entidad_id
            INNER JOIN auth ON auth.usuario_id = users.usuario_id`, 'identificacion, usuario_id',
            `identificacion = ${req.auth.name}`);
        await db.update('auth', 'sesion = 0', `${data[0].usuario_id}`);
        return request.success(req, res, { message: 'Serrando sesión...' }, 200);
    }

    return {
        session,
        logout,
    };
}