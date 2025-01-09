const db = require('../../db/mysql');
const ctrl = require('./controller');

module.exports = ctrl(db);
