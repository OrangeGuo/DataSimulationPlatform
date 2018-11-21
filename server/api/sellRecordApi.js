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
router.post('/deleteSell', (req, res) => {
    let sql = $sql.sellrecord.delete;
    let params = req.body;
    console.log(params);
    conn.query(sql, [params.usename,params.date], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
router.post('/addSell', (req, res) => {
    let sql = $sql.sellrecord.add;
    let params = req.body;
    console.log(params);
    conn.query(sql, [params.usename, params.address,params.sum,params.date], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

router.post('/listSell', (req, res) => {
    let sql = $sql.sellrecord.list;
    let params = req.body;
    console.log(params);
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
