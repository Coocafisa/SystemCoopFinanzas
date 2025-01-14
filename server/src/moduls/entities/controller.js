const request  = require('../../red/request.js');

var table = 'entities';

module.exports = function (dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql.js');
    }    

    async function queryEntities(req, res) {
        const fields = 'identificacion, nombre, tipo_entidad, direcc, correo, telefono, fech_reg';
        try {
            const data = await db.query(table, fields);
            request.success(req, res, data, 200);
        } catch (error) {
            request.error(req, res, error, 404);
        }
        }
    return {
        queryEntities,
    }
};