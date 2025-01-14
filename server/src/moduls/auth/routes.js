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

router.get('/actividad', (req, res) => {
    const hora = new Date();
    request.success(req, res, { hora }, 200);
});

module.exports = router;