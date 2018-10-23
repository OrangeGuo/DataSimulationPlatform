// sql语句
let sqlMap = {
    // 用户
    user: {
        add: 'insert into user( username, password) values ( ?, ?)',
        list: 'select username,password from user',
        update: 'update user set password=? where username=?'
    },
    task: {
        add: 'insert into tasks(taskName, date, detail) values (?,?,?)',
        list: 'select taskName,date,detail from tasks'
    }
}
module.exports = sqlMap
