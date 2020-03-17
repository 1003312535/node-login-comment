var mongoose = require('mongoose')


mongoose.connect('mongodb://localhost:27017/user',{useNewUrlParser: true,useUnifiedTopology: true})
var Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created_time: {
    type:Date,
    default: Date.now
  },
  last_modified_time: {
    type:Date,
    default: Date.now
  },
  avatar: {//头像
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  gender: {
    type: Number,
    enum: [-1, 0, 1],
    default: -1
  },
  birthdy: {
    type:Date
  },
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0
  }
})
// module.exports = mongoose.model('User',Schema)
module.exports = mongoose.model('User',Schema)