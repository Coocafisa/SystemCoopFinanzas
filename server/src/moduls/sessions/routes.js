const express = require('express');

const request = require('../../red/request');
const controller = require('./index');

const {verifyToken} = require('../../middleware/authMiddleware');
const router = express.Router();
router.use(verifyToken)


router.get('/', controller.session);
router.post('/logout', (req, res, next) => {
  if (req.auth && req.auth.name) {
    res.clearCookie('token', { path: '/' });
    request.success(req, res, { message: 'Serrando sesión...' }, 200);
  } 
  request.error(req, res, 'No hay sessiones activas.', 400);

  });

module.exports = router;