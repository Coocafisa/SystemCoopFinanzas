const express = require('express');
const router = express.Router();

router.get('/session', (req, res) => {
  if (req.auth && req.auth.user) {
    var expiretoken = new Date(req.auth.exp * 1000);
    var currenttime = new Date();
    var timeRemaining = expiretoken - currenttime;
    var totalSeconds = Math.floor(timeRemaining / 1000);
    var totalTimes = {
      minutes: Math.floor(totalSeconds / 60),
      seconds: totalSeconds % 60}
    return res.json({ 
      isAuthenticated: true,
      user: req.auth.user,
      role: req.auth.role,
      expiration: totalTimes,
    });
  } else {
    return res.json({ isAuthenticated: false, user: null });
  }
});

module.exports = router;