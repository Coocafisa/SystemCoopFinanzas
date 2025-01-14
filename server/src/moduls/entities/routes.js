const express = require('express');

const request = require('../../red/request');
const controller = require('./index');
const { verifyToken } = require('../../middleware/authMiddleware');

const router = express.Router();
router.use(verifyToken);

router.get('/', controller.queryEntities);

module.exports = router;