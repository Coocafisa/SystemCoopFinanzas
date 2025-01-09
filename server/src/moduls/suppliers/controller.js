var table = 'entities';

module.exports = function (dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql');
    }
    async function Suppliers() {
        const fields = 'nit, razonsoc, correo';
        return await db.query(table, fields);
    }

    return {
        Suppliers,
    }
};