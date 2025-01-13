const request = require('../../red/request');
const express = require('express');
const router = express.Router();
const controller = require('./index');

router.get('/sheduledEmails', queryEmails);

async function queryEmails(req, res, next) {
    try {
        const items = await controller.Emails(req, res);
        request.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};

router.get('/sheduledEmailsPending', queryEmailsPending);

async function queryEmailsPending(req, res, next) {
    try {
        const items = await controller.pendingEmails(req, res);
        request.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};

router.post('/scheduleMailings', (req, res) => {
    const { hour, minute } = req.body;
    console.log(hour, minute)
    if (!hour || !minute || isNaN(hour) || isNaN(minute)) {
        return request.error(req, res, 'La hora o los minutos no son válidos.', 400);
    }
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        return request.error(req, res, 'La hora o los minutos están fuera del rango permitido.', 400);
    }
    const data = { selectHour: `${hour}:${minute}`, hour, minute };
    fs.writeFileSync('./funtions.email/report/hourprogram.json', JSON.stringify(data));
    return request.success(req, res, { message: 'La hora se ha guardado correctamente.' }, 200);
});

router.post('/resendEmails', controller.resendEmails);
module.exports = router;