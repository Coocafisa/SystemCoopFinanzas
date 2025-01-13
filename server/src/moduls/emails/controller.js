const request = require('../../red/request');
const { obtainData } = require("./funtions.email/report/obtainData");

module.exports = function (dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql');
    }

    async function  Emails(req, res) {
        try {
        const table = `pagopro INNER JOIN entities ON pagopro.nit = entities.identificacion`;
        const fields = '*';
        const params = `send_email = false AND entities.identificacion = pagopro.nit AND str_to_Date(fecpago, '%e-%b-%y') = curdate()`;
        return await db.query(table, fields, params);
        } catch (error) {
            request.error(req, res, error, 404);
        }
    }

    async function pendingEmails(req, res) {
        try {
            const table = `pagopro INNER JOIN entities ON pagopro.nit = entities.identificacion`;
            const fields = '*';
            const params = 'send_email = false AND entities.identificacion = pagopro.nit';
            return await db.query(table, fields, params);
        } catch (error) {
            request.error(req, res, error, 404);
        }
    }

    async function resendEmails () {
        const results = await pendingEmails();
        if (results.length > 0) {
            await obtainData(results);
            request.success(req, res, { message: "Correos enviados con éxito." }, 200);
        } else {
            request.error(req, res, "No hay correos pendientes.", 400);
        }
      }

    return {
        Emails,
        pendingEmails,
        resendEmails,
    }
}