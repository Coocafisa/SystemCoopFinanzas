const router = require('express').Router();
const { verifyToken } = require('../../middleware/authMiddleware');
const controller = require('./index');
router.use(verifyToken);

router.get('/', controller.queryInvoices);
router.post('/permissions', controller.assignPermission);

module.exports = router;