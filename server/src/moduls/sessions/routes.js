const express = require('express');

const request = require('../../red/request');
const controller = require('./index');

const {verifyToken} = require('../../middleware/authMiddleware');
const router = express.Router();

router.get('/', verifyToken,controller.session);
router.post('/logout', (req, res, next) => {
    res.clearCookie('token', { path: '/' });
    controller.logout
    request.success(req, res,'Serrando sesión...', 200);
  });

module.exports = router;