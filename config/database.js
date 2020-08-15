var mysql = require('mysql');

//database Connection
var db = mysql.createPool({
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.MYSQL_DB,     
      connections:100
});


module.exports = db;
