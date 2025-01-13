const { formatPesos } = require('../../functions/helpers');
const request  = require('../../red/request');
const table =  'pagopro'

module.exports = function(dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql');
    }
    async function queryInvoices(req, res, next) {
        const fields = `nit, factura, fecfac, fecvcto, total, retencion, tot,
	        fecpago, pagfac, pagtot`
        const params = `fecpago IS NOT NULL`;
        try {
            const results = await db.query(table, fields, params);
            const formatedResults = results.map(result => ({ 
                ...result,
                total: formatPesos(result.total),
                retencion: formatPesos(result.retencion),
                tot: formatPesos(result.tot),
                pagfac: formatPesos(result.pagfac),
                pagtot: formatPesos(result.pagtot),
            }));
            request.success(req, res, formatedResults, 200);
        } catch (error) {
         next(error);
        }
    }       

    return {
        queryInvoices,
    }
}