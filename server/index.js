const userApi = require('./api/userApi')
const booksApi = require('./api/booksApi')
const recordApi = require('./api/recordApi')

const bodyParser = require('body-parser')
const express = require('express')
const app = express()

app.use(bodyParser.json())//解析json
app.use(bodyParser.urlencoded({extended: false}))//解析表单不含文件

// 后端api路由
app.use('/api/user', userApi)
app.use('/api/books', booksApi)
app.use('/api/record',recordApi)


// 监听端口
app.listen(3000)
console.log('success listen at port:3000......')
