var table = 'empleado';

module.exports = function (dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql');
    }
    async function Employees() {
        return 'hola Soy la vista de empleados';
    };

    return {
        Employees,
    }
};