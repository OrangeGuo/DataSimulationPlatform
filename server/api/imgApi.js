let express = require('express');
let router = express.Router();

let multer = require('multer');
let path = require('path');


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

router.post('/getImg', (req, res) => {
    let img=req.body.filename;
    console.log('image:'+img);
    res.sendFile(path.resolve(path.resolve(__dirname,'..'),'..') + "/" +img);
});
router.post('/uploadImg', upload.any(), (req, res) => {
    console.log("upload");
    console.log(req.files);
    res.status(200).send('');


});
module.exports = router;

