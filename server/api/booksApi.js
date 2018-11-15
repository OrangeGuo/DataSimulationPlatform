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
router.post('/updateBook', (req, res) => {
    let sql = $sql.books.update;
    let params = req.body;
    console.log(params);
    conn.query(sql, [params.resbooks, params.allbooks, params.bookId], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
//删除任务接口
router.post('/deleteBook', (req, res) => {
    let sql = $sql.books.delete;
    let params = req.body;
    console.log(params);
    conn.query(sql, [params.bookId], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
// 增加用户接口
router.post('/addBook', (req, res) => {
    let sql = $sql.books.add;
    let params = req.body;
    console.log(params);
    conn.query(sql, [params.bookId, params.bookname, params.writer,params.findNumber,params.resbooks,params.allbooks,params.bookkind], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

router.post('/listBook', (req, res) => {
    let sql = $sql.books.list;

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
