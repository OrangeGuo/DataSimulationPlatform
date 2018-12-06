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
//删除任务接口
router.post('/deleteNodes', (req, res) => {
    let sql = $sql.nodes.delete;
    let params = req.body;
    console.log("delete node");
    console.log(params);
    conn.query(sql, [params.taskId], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
// 增加用户接口
router.post('/addNodes', (req, res) => {
    let sql = $sql.nodes.add;
    let nodes = req.body;
    console.log("add node");
    console.log(nodes);
    for (let i = 0; i < nodes.length; i++) {
        let params = nodes[i];
        conn.query(sql, [params.taskId, params.id, params.name, params.parent, params.pos_x, params.pos_y, params.degree], function (err, result) {
            if (err) {
                console.log(err);
            }
            //if (result) {
            //console.log(result.length);
            //jsonWrite(res, result);
            //}
        })
    }
});

router.post('/listNodes', (req, res) => {
    let sql = $sql.nodes.list;
    let params = req.body;
    console.log("list node");
    console.log(params);
    conn.query(sql, [params.taskId], function (err, result) {
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
