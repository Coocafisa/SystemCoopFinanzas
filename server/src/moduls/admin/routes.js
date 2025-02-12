const router = require('express').Router();
const { verifyToken } = require('../../middleware/authMiddleware');
const controller = require('./index');
router.use(verifyToken);

router.get('/', controller.queryInvoices);

module.exports = router;