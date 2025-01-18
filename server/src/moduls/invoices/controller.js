const { formatPesos, formatDate } = require('../../../services/functions/helpers.js');
const request  = require('../../red/request.js');

var table = 'entities';

module.exports = function (dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql.js');
    }    

    async function queryInvoicesUserId(req, res) {
        const user = req.auth.name;
        const selectTable = table + ' INNER JOIN pagopro ON entities.identificacion = pagopro.nit';
        const fields = 'nombre, factura, fecfac, fecvcto, tot, retencion, total, fecpago, pagtot, pagfac';
        const params = `nit = ${user}`;
        try {
            const data = await db.query(selectTable, fields, params);
            if (data.length === 0) {
                return request.success(req, res, { message: 'No tienes facturas registradas.' }, 200);
            }
            const formatedResults = data.map(result => ({
                ...result,
                fecpago: formatDate(result.fecpago),
                fecfac: formatDate(result.fecfac),
                fecvcto: formatDate(result.fecvcto),
                retencion: formatPesos(result.retencion),
                total: formatPesos(result.total),
                pagfac: formatPesos(result.pagfac),
                tot: formatPesos(result.tot),
                pagtot: formatPesos(result.pagtot),
            }) )
            request.success(req, res, formatedResults, 200);
        } catch (error) {
            request.error(req, res, error, 404);
        }
    }

    async function queryInvoicesPaymentUserdId(req, res) {
        const user = req.auth.name;
        const selectTable = table + ' INNER JOIN pagopro ON entities.identificacion = pagopro.nit';
        const fields = 'nombre, factura, fecfac, fecvcto, retencion, tot, total, pagtot, fecpago, pagfac';
        const params = `nit = ${user} AND fecpago IS NOT NULL`;
        try {
            const data = await db.query(selectTable, fields, params);
            if (data.length === 0) {
                return request.success(req, res, { message: 'No tienes pagos de facturas registrados.' }, 200);
            }
            const formatedResults = data.map(result => ({
                ...result,
                fecpago: formatDate(result.fecpago),
                fecfac: formatDate(result.fecfac),
                fecvcto: formatDate(result.fecvcto),
                retencion: formatPesos(result.retencion),
                total: formatPesos(result.total),
                pagfac: formatPesos(result.pagfac),
                tot: formatPesos(result.tot),
                pagtot: formatPesos(result.pagtot),
            }) )
            request.success(req, res, formatedResults, 200);
        } catch (error) {
            request.error(req, res, error, 404);
        }
    }

    async function queryInvoicesPendingUserId(req, res) {
        const user = req.auth.name;
        const selectTable = table + ' INNER JOIN pagopro ON entities.identificacion = pagopro.nit';
        const fields = 'nombre, factura, fecfac, fecvcto, tot, retencion, total, pagtot, fecpago, pagfac';
        const params = `nit = ${user} AND fecpago IS NULL`;
        try {
            const data = await db.query(selectTable, fields, params);
            if (data.length === 0) {
                return request.success(req, res, { message: 'No tienes facturas pendientes.' }, 200);
                }
                const formatedResults = data.map(result => ({
                    ...result,
                    fecpago: formatDate(result.fecpago),
                    fecfac: formatDate(result.fecfac),
                    fecvcto: formatDate(result.fecvcto),
                    retencion: formatPesos(result.retencion),
                    total: formatPesos(result.total),
                    pagfac: formatPesos(result.pagfac),
                    tot: formatPesos(result.tot),
                    pagtot: formatPesos(result.pagtot),
                }) )
                request.success(req, res, formatedResults, 200);
            } catch (error) {
                request.error(req, res, error, 404);
            }
        }
    
    return {
        queryInvoicesUserId,
        queryInvoicesPaymentUserdId,
        queryInvoicesPendingUserId,
    }
};