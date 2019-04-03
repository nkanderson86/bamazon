let mysql = require("mysql");
require("dotenv").config();

function query(command) {
  return new Promise((resolve, reject) => {
    let connection = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PW
    });

    connection.connect(async err => {
      if (err) reject(err);
      connection.query(command, (err, results) => {
        if (results) resolve(results);
        if (err) reject(err);
      });
      connection.end();
    });
  });
}

module.exports = query;
