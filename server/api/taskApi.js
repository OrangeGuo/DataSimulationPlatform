let models = require('../db');
let express = require('express');
let router = express.Router();
let mysql = require('mysql');
let $sql = require('../sqlMap');

// 连接数据库
let conn = mysql.createConnection(models.mysql);

conn.connect();
let jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);

    }
};
//修改任务接口
router.post('/updateTask', (req, res) => {
    let sql = $sql.task.update;
    let params = req.body;
    console.log(params);
    conn.query(sql, [params.taskName, params.detail, params.id], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
//删除任务接口
router.post('/deleteTask', (req, res) => {
    let sql = $sql.task.delete;
    let params = req.body;
    console.log(params);
    conn.query(sql, [params.taskName], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
// 增加用户接口
router.post('/addTask', (req, res) => {
    let sql = $sql.task.add;
    let params = req.body;
    console.log(params);
    conn.query(sql, [params.taskName, new Date(), params.detail], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

router.post('/listTask', (req, res) => {
    let sql = $sql.task.list;

    console.log("list task");
    conn.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            //console.log(result.length);
            jsonWrite(res, result);
        }
    })
});

module.exports = router;
