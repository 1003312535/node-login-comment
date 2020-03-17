var express = require('express')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')
var router = require('./router/router')
var session = require('express-session')

//开放公共资源
app.use('/public/', express.static(path.join(__dirname,'./public/')))
app.use('/node_modules/', express.static(path.join(__dirname,'./node_modules/')))
//配置模板
app.engine('html',require('express-art-template'))
//配置模板默认读取路径
app.set('views',path.join(__dirname,'./views/'))


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({
  secret: 'keyboard cat', //秘密 自定义的加密字符串 它会子啊原有的基础之上和这个字符串凭ie起来去加密
  resave: false,
  saveUninitialized: true //无论是否使用 Session 都会默认的给分配一把钥匙
}))

app.use(router)

//配置一个404处理的中间键
app.use(function(req, res) {
	res.render('404.html');
})

//配置全局的错误处理中间键
//当调用了 next() 的时候， 如果传递了参数，则直接往后找到带有 四个参数的中间键
//什么时候使用全局中间键呢？
app.use(function(err, req, res, next){
	res.status(500).json({err_code:500,message: '服务器繁忙，请稍候在试!'})
})
app.listen(3000,function () {
  console.log('jjj')
})