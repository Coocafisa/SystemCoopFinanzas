const request = require('../../red/request');
const express = require('express');
const router = express.Router();
const controller = require('./index');
const fs = require('fs');
const path = require('path');

router.get ('/timer', controller.timerEmails);
router.get('/sheduledEmails', queryEmails);

async function queryEmails(req, res, next) {
    try {
        const items = await controller.Emails(req, res);
        return request.success(req, res, items, 200);
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
    try {
        const { hour, minute } = req.body;

        if (hour === undefined || minute === undefined || !Number.isInteger(hour) || !Number.isInteger(minute)) {
            return request.error(req, res, { message: 'La hora o los minutos no son válidos.' }, 400);
        }

        if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            return request.error(req, res, { message: 'La hora o los minutos están fuera del rango permitido.' }, 400);
        }

        const formattedMinute = minute.toString().padStart(2, '0');
        const data = {
            selectHour: `${hour}:${formattedMinute}`,
            hour,
            minute: formattedMinute
        };

        const filePath = path.join(__dirname, './funtions.email/report/hourprogram.json');

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        return request.success(req, res, { message: 'La hora se ha guardado correctamente.' }, 200);
    } catch (error) {
        return request.error(req, res, { message: 'Ocurrió un error al guardar la hora.' }, 500);
    }
});


router.post('/resendEmails', controller.resendEmails);
module.exports = router;