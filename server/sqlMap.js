// sql语句
let sqlMap = {
    // 用户
    user: {
        add: 'insert into user( username, password) values ( ?, ?)',
        list: 'select username,password from user',
        update: 'update user set password=? where username=?'
    },
    task: {
        add: 'insert into tasks(taskName, date, detail,id) values (?,?,?,?)',
        list: 'select taskName,date,detail,id from tasks',
        delete: 'delete from tasks where taskName=?',
        update: 'update tasks set taskName=?, detail=? where id=?'
    },
    nodes: {
        add: 'insert into nodes(taskId, id, name, parent, pos_x, pos_y, degree) VALUES (?,?,?,?,?,?,?)',
        list: 'select taskId, id, name, parent, pos_x, pos_y, degree from nodes where taskId=?',
        delete: 'delete from nodes where taskId=?'
    },
    edges: {
        add: 'insert into edges(taskId,id, dst_node_id, src_node_id) values (?,?,?,?)',
        list: 'select id,dst_node_id,src_node_id from edges where taskId=?',
        delete: 'delete from edges where taskId=?'
    }
}
module.exports = sqlMap
