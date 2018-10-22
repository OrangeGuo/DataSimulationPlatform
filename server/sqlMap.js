// sql语句
var sqlMap = {
  // 用户
  user: {
      add: 'insert into user( username, password) values ( ?, ?)',
      list: 'select username,password from user'
  }
}
module.exports = sqlMap
