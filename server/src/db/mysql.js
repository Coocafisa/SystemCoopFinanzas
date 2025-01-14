const mysql = require('mysql2');
const config = require('../config');


const dbConfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

let connection;

function connectMysql() {
    connection = mysql.createConnection(dbConfig);
    connection.connect((err) => {
        if (err) {
            setTimeout(connectMysql, 2000);
        } else {
            return console.log('Conectado a la base de datos');
        }
    });
    connection.on('error', (err) => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connectMysql();
        } else {
            throw err;
        }

    });
}
connectMysql();

function query(table, fields = '*', params = '1=1') {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT ${fields} FROM ${table} WHERE ${params}`, (err, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
}

function insert(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
}

function update(table, data, params) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${table} SET ${data} WHERE ${params}`, (err, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
}

function remove (table, params) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM ${table} WHERE ${params}`, (err, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
}

module.exports = {
    query,
    insert,
    update,
    remove,
};