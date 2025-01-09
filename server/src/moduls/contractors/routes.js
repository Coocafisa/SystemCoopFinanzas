const express = require('express');
const controller = require('./index');
const request = require('../../red/request');
const router = express.Router();

router.get('/queryContractors',  queryContractors);
router.get('/queryInvoices',  queryInvoices);

async function queryContractors(req, res, next) {
    try {
        const items = await controller.Contractors();
        request.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};

async function queryInvoices(req, res, next) {
    try {
        const items = await controller.queryInvoices(req, res);
        console.log(items);
        request.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};

module.exports = router;