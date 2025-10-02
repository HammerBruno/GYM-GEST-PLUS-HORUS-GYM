const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gymgestplus'
});

db.connect ((err)=>{
    if (err){
        throw err;
    }

    console.log('Conectando a Mysql');
});

module.exports = db;
