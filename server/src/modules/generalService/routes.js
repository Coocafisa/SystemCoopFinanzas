const express = require('express');

const controller = require('./index');
const { verifyToken } = require('../../middleware/authMiddleware');

const router = express.Router();
router.post('/updateRegister', verifyToken, controller.updateRegister);
router.post('/deleteRegister', verifyToken, controller.deleteRegister);

module.exports = router;