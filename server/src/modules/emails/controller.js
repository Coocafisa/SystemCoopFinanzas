const request = require('../../red/request');
const { obtainData } = require("./funtions.email/report/obtainData");
const obtainTimer = require("./funtions.email/report/hourprogram.json");

module.exports = function (dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql');
    }

    async function Emails(req, res) {
        try {
        const table = `pagopro INNER JOIN entities ON pagopro.nit = entities.identificacion`;
        const fields = '*';
        const params = `send_email = false AND entities.identificacion = pagopro.nit AND
        str_to_Date(fecpago, '%e-%b-%y') = curdate()`;
        return await db.query(table, fields, params);
        } catch (error) {
            request.error(req, res, error, 404);
        }
    }

    async function pendingEmails(req, res) {
        try {
            const table = `pagopro INNER JOIN entities ON pagopro.nit = entities.identificacion`;
            const fields = '*';
            const params = 'send_email = false AND entities.identificacion = pagopro.nit GROUP BY pagopro.nit';  
            return await db.query(table, fields, params);
        } catch (error) {
            request.error(req, res, error, 404);
        }
    }

    async function resendEmails (req, res) {
        const results = await pendingEmails(req, res);
        if (results.length > 0) {
            const send_email = await obtainData(results);
            return request.success(req, res, send_email.message, send_email.status);
        }
        return request.error(req, res, {message: "No hay correos pendientes."}, 400);
    }

    async function timerEmails(req, res) {
        if (!obtainTimer) {
            request.error(req, res, {message: "No se encontró la hora programada."}, 400);
        }
        const { hour, minute } = obtainTimer;
        request.success(req, res, { hour, minute }, 200);
        };
    
    return {
        Emails,
        pendingEmails,
        resendEmails,
        timerEmails,
    }
}