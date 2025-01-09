const request = require('../../red/request')
var table = 'entities';

module.exports = function (dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql');
    }
    async function Contractors() {
        try {
            return await db.query(table);
        } catch (error) {
            request.error(req, res, error, 404);
        }
    };

    async function queryInvoices (req, res) {
        try {
            const fields = '*';
            const params = 'identificacion = 1000000001';
            return await db.query(table, fields, params);
        } catch (error) {
            request.error(req, res, error, 404);
            next(error);
        }
    }

    return {
        Contractors,
        queryInvoices,
    }
};