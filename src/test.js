var mysql=require('mysql');
var connection = mysql.createConnection({
host : 'localhost',
user : 'root',
password : '12345',
database : 'dap',
port:'3306',
    insecureAuth : true
});
connection.connect();
connection.query('select * from user', function(err, rows, fields) {
if (err) throw err;
console.log('selected after inserted');
for(var i= 0,usr;usr=rows[i++];){
console.log('user nae='+usr.name + ', password='+usr.age);
}
console.log('\n');
});
connection.end();
