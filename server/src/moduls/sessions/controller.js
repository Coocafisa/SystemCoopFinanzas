module.exports = function(dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql');
    }

    async function  session(req, res) {
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

    return {
        session,
    };
}