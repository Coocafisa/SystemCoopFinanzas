const request  = require('../../red/request.js');

var table = 'entities';

module.exports = function (dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql.js');
    }    

    async function queryInvoicesUserId(req, res) {
        const user = req.auth.name;
        const selectTable = table + ' LEFT JOIN pagopro ON entities.identificacion = pagopro.nit';
        const fields = 'nit, nombre, factura, fecfac, fecvcto, tot, retencion, total, fecpago, pagtot, pagfac';
        const params = `nit = ${user}`;
        try {
            const data = await db.query(selectTable, fields, params);
            return request.successRequest(req, res, data, 200);
        } catch (error) {
            return request.faultRequest(req, res, error, 404);
        }
    }

    async function queryInvoicesPaymentUserdId(req, res) {
        const user = req.auth.name;
        const selectTable = table + ' LEFT JOIN pagopro ON entities.identificacion = pagopro.nit';
        const fields = 'nit, nombre, factura, fecfac, fecvcto, retencion, tot, total, pagtot, fecpago, pagfac';
        const params = `nit = ${user} AND fecpago IS NOT NULL`;
        try {
            const data = await db.query(selectTable, fields, params);
            return request.successRequest(req, res, data, 200);
        } catch (error) {
            return request.faultRequest(req, res, error, 404);
        }
    }

    async function queryInvoicesPendingUserId(req, res) {
        const user = req.auth.name;
        const selectTable = table + ' LEFT JOIN pagopro ON entities.identificacion = pagopro.nit';
        const fields = 'nit, nombre, factura, fecfac, fecvcto, tot, retencion, total, pagtot, fecpago, pagfac';
        const params = `nit = ${user} AND fecpago IS NULL`;
        try {
            const data = await db.query(selectTable, fields, params);
            return request.successRequest(req, res, data, 200);
            } catch (error) {
             return request.faultRequest(req, res, error, 404);
            }
        }
    
    return {
        queryInvoicesUserId,
        queryInvoicesPaymentUserdId,
        queryInvoicesPendingUserId,
    }
};