var mysql = require('mysql')

var pool = mysql.createPool({
    host:'remotemysql.com',
    user:'Em6vInuMcj',
    password:'KdcgjxoZzh',
    database:'Em6vInuMcj'
});

// con.connect(function(err) {
//     if(err){
//         throw err;
//     }
//     console.log('connected to mysql')
// });

module.exports = pool;