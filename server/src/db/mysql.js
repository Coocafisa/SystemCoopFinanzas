const mysql = require('mysql2/promise');
const config = require('../config');


const dbConfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0
};

const connection = mysql.createPool(dbConfig);

async function query(table, fields = '*', params = '', values = []) {
    try {
        let sql = `SELECT ${fields} FROM ${table}`;
        if (params) {
            sql += ` WHERE ${params}`;
        }
        const [result] = await connection.query(sql, values);
        return result;
    } catch (error) {
        throw error;
    }
}

async function insert(table, data) {
    try {
    const [result] = await connection.query(`INSERT INTO ${table} SET ?`, data);
    return result;
    } catch (error) {
        throw error;
    }
}

async function update(table, data, params) {
    try {
        const [result] = await connection.query(`UPDATE ${table} SET ${data} WHERE ${params}`);
        return result;
    } catch (error) {
        throw error;
    }
}

async function remove (table, params) {
    try {
        const [result] = await connection.query(`DELETE FROM ${table} WHERE ${params}`);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    query,
    insert,
    update,
    remove,
};