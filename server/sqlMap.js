// sql语句
let sqlMap = {
    // 用户
    user: {
        add: 'insert into libuser( userid, username, password, userkind, booksnum) values ( ?, ?,?,?,?)',
        list: 'select userid, username, password, userkind, booksnum from libuser',
        update: 'update libuser set password=? where username=?'
    },
    books: {
        add: 'insert into books(bookId, bookname, writer, findNumber, resbooks, allbooks,bookkind) values (?,?,?,?,?,?,?)',
        list: 'select bookId, bookname, writer, findNumber, resbooks, allbooks,bookkind from books',
        delete: 'delete from books where bookId=?',
        update: 'update books set resbooks=?, allbooks=? where bookId=?'
    },
    record:{
        add: 'insert into record(userid,bookid,borrowDate) values (?,?,?)',
        list: 'select userid,bookid,deadline,borrowDate from record',
        delete: 'delete from record where userid =? and bookid=?'
    },
    modules: {
        add: 'insert into modules(node_id, node_name, node_value, parent, task_id) values(?,?,?,?,?)',
        list: 'select node_id, node_name, node_value, parent from modules where task_id=?',
        delete: 'delete from modules where task_id=?'

    }
}
module.exports = sqlMap
