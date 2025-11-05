let mysql = require('mysql2');

let connection = mysql.createConnection({
    host:           'localhost',
    user:           'root',
    password:       '',
    database:       'db_express_api'
});

connection.connect((error) => {
    if (!!error) {
        console.log(error);
    } else {
        console.log('Connection Successfully');
    }
})

module.exports = connection;