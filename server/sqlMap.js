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
    modules: {
        add: 'insert into modules(node_id, node_name, node_value, parent, task_id) values(?,?,?,?,?)',
        list: 'select node_id, node_name, node_value, parent from modules where task_id=?',
        delete: 'delete from modules where task_id=?'

    },
    nodes: {
        add: 'insert into nodes(taskId, id, name, imgContent, pos_x, pos_y, input,output) VALUES (?,?,?,?,?,?,?,?)',
        list: 'select taskId, id, name, imgContent, pos_x, pos_y, input, output from nodes where taskId=?',
        delete: 'delete from nodes where taskId=?'
    },
    edges: {
        add: 'insert into edges(taskId, dst_node_id, src_node_id) values (?,?,?)',
        list: 'select dst_node_id,src_node_id from edges where taskId=?',
        delete: 'delete from edges where taskId=?'
    }
}
module.exports = sqlMap
