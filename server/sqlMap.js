// sql语句
let sqlMap = {
    // 用户
    user: {
        add: 'insert into libuser( userid, username, password, userkind, money) values ( ?, ?,?,?,?)',
        list: 'select userid, username, password, userkind, money from libuser',
        update: 'update libuser set password=? where username=?',
        deleteUser:'delete from libuser where userid=?',
        updateMoney:'update libuser set money=? where userid=?'
    },
    books: {
        add: 'insert into books(bookId, bookname, writer, findNumber, resbooks, allbooks,bookkind,price) values (?,?,?,?,?,?,?,?)',
        list: 'select bookId, bookname, writer, findNumber, resbooks, allbooks,bookkind,price from books',
        delete: 'delete from books where bookId=?',
        update: 'update books set resbooks=?, allbooks=? ,price=? where bookId=?'
    },
    record:{
        add: 'insert into record(userid,bookid,borrowDate,renew,price) values (?,?,?,?,?)',
        list: 'select bookid,borrowDate,renew,price from record where userid=?',
        delete: 'delete from record where userid =? and bookid=?',
        update:'update record set renew=? where userid=? and bookid=?',
    },
    sellrecord:{
        list: 'select usename,address,sum,date from sellrecord',
        add: 'insert into sellrecord(usename,address,sum,date) values (?,?,?,?)',
        delete:'delete from sellrecord where usename=? and date=?',
    },
    modules: {
        add: 'insert into modules(node_id, node_name, node_value, parent, task_id) values(?,?,?,?,?)',
        list: 'select node_id, node_name, node_value, parent from modules where task_id=?',
        delete: 'delete from modules where task_id=?'

    }
}
module.exports = sqlMap
