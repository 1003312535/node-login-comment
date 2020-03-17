var express = require('express')
var router = express.Router()
var User = require('../models/user.js')
var Comment = require('../models/comment.js')
var md5 = require("blueimp-md5")
//加载首页
router.get('/',function (req, res) {
  Comment.find(function (err, data) {
    res.render('index.html',{
      name: 'hahahahah',
      user: req.session.user,
      comments: data
    })
  })

})
//注册页面
router.get('/register', function (req, res,next) {
  res.render('register.html')
})
//注册提交
router.post('/register', function (req, res,next) {
  var body = req.body//接受前端提交的数据
  // console.log(body)
  body.password = md5(md5(body.password))
  //查看数据库
  User.findOne({
    $or: [
      {email: body.email},
      {nickname: body.nickname}
    ]
  }, function (err, data) {
      if (err){
        // return res.status(500).json({
        //   err_code: 500,
        //   message: 'Server Erorre'
        // })
        next(err)
      }
    //用户存在
    if (data) {
        return  res.status(200).json({
          err_code: 1,
          message: 'email or name  releady aesits!'
        })
      }
    //用户不存在  注册
      new User(body).save(function (err,user) {
        if (err) {
          next(err)
        }
        // console.log(user)
        // Express 提供了一个响应方法：json()
        // 该方法接受一个对象作为参数，他会自动帮助你吧对象转为字符串在发送给浏览器
        //注册成功，使用Session 记录用户的登录状态
        req.session.user = user;
        res.status(200).json({
          err_code: 0,
          message: 'ok'
        })
      })

  })
})

//进入登录页面
router.get('/login', function(req, res,next) {
  res.render('login.html')
})
//提交登录页面
router.post('/login', function(req, res,next) {
  var body = req.body
  User.findOne({email: body.email,password:md5(md5(body.password))},function(err,data){
    if (err) {
      // return res.status(500).json()
      next(err)
    }
    if (!data) {
         return res.status(200).json({err_code: 1,message: '邮箱或者密码错误！'})
    }
    req.session.user = data,
    res.status(200).json({err_code: 0,message: '登录成功！'})
  })
});
//退出登录
router.get('/logout',function(req, res,next) {
  req.session.user = null
  res.redirect('/')
})



//进入信息编辑页面
router.get('/edit',function(req, res, next) {
  res.render("edit.html",{
    user: req.session.user
  })
})
//提交修改
router.post('/edit', function(req, res, next) {
  var body = req.body;
  body.gender =parseInt(body.gender)
  console.log(body)
  User.findOne({_id: req.body._id},function (err, data) {
      if (err){
        next(err)
      }
      if (data){
        console.log(data)
        Comment.updateMany({nickname: data.nickname} ,{nickname: body.nickname}, function (err) {
            if (err) {
              next(err)
            }
        })
      }
  })
  User.findOneAndUpdate({_id:req.body._id}, body, {new: true},function(err, data) {
    if (err) {
      next(err)
    }else{
      req.session.user = data
      res.status(200).json({err_code: 0,message: '修改成功！'})
    }
  })

})
//进入内容编辑页面
router.get('/write', function(req, res, next) {
  if (req.session.user) {
    // console.log(req.session.user)
    res.render('write.html', {
      user: req.session.user
    })
  }else{
    res.send('请登录！')
  }
})
router.post('/write',function (req, res, next) {
  var body = req.body
  body.created_time = new Date()
  console.log(body)
  new Comment(body).save(function (err, data) {
      if (err) {
        next(err)
      }
    res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
  })
})

//进入 content 页面
router.get('/content', function(req, res, next) {
  var body = req.query
  Comment.find(body, function(err, data){
    if (err) {
      next(err)
    }
    if (data) {
      console.log(data)
      res.render('content.html',{
        data: data
      })
    }
  })
})
module.exports = router