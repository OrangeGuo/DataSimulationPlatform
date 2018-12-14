const userApi = require('./api/userApi');
const taskApi = require('./api/taskApi');
const nodeApi = require('./api/nodeApi');
const edgeApi =require('./api/edgeApi');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json());//解析json
app.use(bodyParser.urlencoded({extended: true}));//解析表单不含文件

// 后端api路由
app.use('/api/user', userApi);
app.use('/api/task', taskApi);
app.use('/api/node', nodeApi);
app.use('/api/edge',edgeApi);
// 监听端口
app.listen(3000);
console.log('success listen at port:3000......');
