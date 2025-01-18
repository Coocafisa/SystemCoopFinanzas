const express = require('express');

const controller = require('./index');
const { verifyToken } = require('../../middleware/authMiddleware');

const router = express.Router();
router.use(verifyToken);

router.get('/', controller.queryInvoicesUserId);
router.get('/invoicesPayment', controller.queryInvoicesPaymentUserdId);
router.get('/invoicesPending', controller.queryInvoicesPendingUserId);

module.exports = router;