// importing mysql2
const mysql = require('mysql2');

// creating connection
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employees_db'
  });

  connection.connect(function (err){
    if (err) throw err;
  });
// exporting connection
  module.exports = connection;
