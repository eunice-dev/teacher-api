const mysql = require('mysql');
const util = require('util');

const config = {
    host: 'localhost',
    port: '8889',
    user: 'root',
    password: 'root',
    database: 'teachers',
};

const pool = mysql.createPool(config);
pool.query = util.promisify(pool.query);

module.exports = pool;
