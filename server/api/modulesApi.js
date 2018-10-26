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
//增加modules
router.post('/addModules', (req, res) => {
    let sql = $sql.modules.add;
    let items = req.body;
    for (let i = 0; i < items.length; i++) {
        let params = items[i];
        conn.query(sql, [params.node_id, params.node_name, params.value, params.parent, params.task_id], function (err, result) {
            if (err) {
                console.log(err);
            }

        })
    }

});

//列出modules
router.post('/listModules', (req, res) => {
    let sql = $sql.modules.list;
    let params = req.body;
    conn.query(sql, [params.task_id], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            //console.log(result.length);
            jsonWrite(res, result);
        }
    })
});

//删除modules
router.post('/deleteModules', (req, res) => {
    let sql = $sql.modules.delete;
    let params = req.body;
    console.log(params);
    conn.query(sql, [params.task_id], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
module.exports = router;
