let models = require('../db');
let express = require('express');
let router = express.Router();
let mysql = require('mysql');
let $sql = require('../sqlMap');
let multer = require('multer');

// 连接数据库
let conn = mysql.createConnection(models.mysql);
let storage = multer.diskStorage({
   //文件存储路径
   destination: (req , file , cb )=>{
      cb(null , './static/img');
   },
   //修改上传文件的名字
   //file 是个文件对象 ,fieldname对应在客户端的name属性
   filename: (req , file , cb ) => {
      cb( null, file.originalname);
   }
});
let upload=multer({storage:storage});
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

// 增加用户接口
router.post('/addUser', (req, res) => {
    let sql = $sql.user.add;
    let params = req.body;
    console.log("add user");
    console.log(params);
    conn.query(sql, [params.username, params.password,params.image], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
router.post('/listUser', (req, res) => {
    let sql = $sql.user.list;
    let params = req.body;
    console.log("list user");
    console.log(params.username);
    conn.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            //console.log(res);


            jsonWrite(res, result);
        }
    })
});
router.post('/uploadImg', upload.any(), (req, res) => {
    console.log("upload");
    console.log(req.files);
    //console.log(req.headers);



});
router.post('/updatePass', (req, res) => {
    let sql = $sql.user.update;
    let params = req.body;
    console.log("update pass");
    conn.query(sql, [params.password, params.username], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }

    })
})
module.exports = router;
