const express = require('express');

const request = require('../../red/request');
const controller = require('./index');

const router = express.Router();

router.post('/', Auth);

async function Auth(req, res, next) {
    const data = { user, password } = req.body;
        const items = await controller.auth(req, res, data);
        return items;
};

module.exports = router;