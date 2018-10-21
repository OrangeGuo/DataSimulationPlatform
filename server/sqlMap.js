// sql语句
var sqlMap = {
  // 用户
  user: {
      add: 'insert into user( name, age) values ( ?, ?)',
      list: 'select name,age from user'
  }
}
module.exports = sqlMap
