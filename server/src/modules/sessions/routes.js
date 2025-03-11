const express = require('express');

const request = require('../../red/request');
const controller = require('./index');

const {verifyToken} = require('../../middleware/authMiddleware');
const router = express.Router();

router.get('/', verifyToken, controller.session);
router.post('/logout', verifyToken, async(req, res) => {
    const { sessionId } = req.auth;
    const logout = await controller.logout(sessionId);
    if (logout.status !== 200) {
        return request.error(req, res, { message: logout.message }, logout.status);
    }
    request.success(req, res, { message: logout.message }, logout.status);
  });

router.post('/deleteSession', async (req, res) => {
    const { data } = req.body;
    if (!data) {
        return request.error(req, res, { message: 'No se encontró la sesión' }, 404);
    }
    const logout = await controller.logout(data);
    if (logout.status !== 200) {
        return request.error(req, res, { message: logout.message }, logout.status);
    }
    request.success(req, res, { message: logout.message }, logout.status);
});

module.exports = router;