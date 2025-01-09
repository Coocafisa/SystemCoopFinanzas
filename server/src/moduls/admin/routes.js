const router = require('express').Router();
const controller = require('./index');

router.get('/', controller.queryInvoices);

module.exports = router;