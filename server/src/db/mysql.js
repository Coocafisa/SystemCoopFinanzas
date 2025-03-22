const mysql = require('mysql2/promise');
const config = require('../config');
const { formatDate, formatPesos } = require('../functions/helpers');


const dbConfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    connectTimeout: 10000,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0
};

const connection = mysql.createPool(dbConfig);
connection.on('error', (err) => {
    throw new Error ("Error en la conexion con la base de datos: " + err.message);
});

async function query(table, fields = '*', params = '', values = []) {
    try {
        let sql = `SELECT ${fields} FROM ${table}`;
        if (params) {
            sql += ` WHERE ${params}`;
        }
        const [result] = await connection.query(sql, values);
        const fieldDate = ["fecpago", "fecvcto", "fecfac", "fech_reg", "fech_auth"];
        const fieldMoney = ["total", "retencion", "tot", "pagfac", "pagtot"];

        const formatedResults = result.map(item => {
            return Object.keys(item).reduce((newItem, key) => {
                if (fieldDate.includes(key)) {
                    newItem[key] = formatDate(item[key]) || "No disponible";
                } else if (fieldMoney.includes(key)) {
                    newItem[key] = formatPesos(item[key]) || "0";
                } else {
                    newItem[key] = item[key];
                }
                return newItem;
            }, {});
            });
        return formatedResults;
    } catch (error) {
        throw new Error ("Error en la consulta a la base de datos: " + error.message);
    }
}

async function insert(table, data) {
    try {
    const [result] = await connection.query(`INSERT INTO ${table} SET ?`, data);
    return result;
    } catch (error) {
        throw new Error ("Error en la inserción en la base de datos: " + error.message);
    }
}

async function update(table, data, params) {
    try {
        const [result] = await connection.query(`UPDATE ${table} SET ${data} WHERE ${params}`);
        return result;
    } catch (error) {
        throw new Error ("Error en la actualización en la base de datos: " + error.message);
    }
}

async function remove (table, params) {
    try {
        const [result] = await connection.query(`DELETE FROM ${table} WHERE ${params}`);
        return result;
    } catch (error) {
        throw new Error ("Error en la eliminación en la base de datos: " + error.message);
    }
}

module.exports = {
    query,
    insert,
    update,
    remove,
};