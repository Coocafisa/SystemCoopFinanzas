const request = require('../../red/request');
const express = require('express');
const router = express.Router();
const controller = require('./index');

router.get('/',  queryEmails);

async function queryEmails(req, res, next) {
    try {
        const items = await controller.Emails(req, res);
        request.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};

module.exports = router;