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

     async function logout(dataSession) {
        if (!dataSession) {
            return { message: 'Imformacion invalidad para cerrar sesión.', status: 400 };
        }

        try {
        const cierreSesion =await db.update('auth', 'sessionId = 0', `sessionId = '${dataSession}'`);
        if (cierreSesion.affectedRows === 0) {
            return { message: 'Error al cerrar sesión.', status: 500 };
        }
        return { message: 'Sesión cerrada.', status: 200 };
        } catch (error) {
            throw error;
        }
    }

    return {
        session,
        logout,
    };
}