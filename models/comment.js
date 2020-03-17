
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/user',{useNewUrlParser: true,useUnifiedTopology: true})
var Schema = new mongoose.Schema({
	nickname: {
		type: String,
   	 	required: true
	},
	title: {
		type: String,
		required: true
	},
	comment:{
		type: String,
		required: true
	},
	created_time: {
	    type:Date,
	    default: Date.now
  },
	like:{
		type:Number,
		default: 0
	},
	dislike: {
		type: Number,
		defalut: 0
	}
})
module.exports = mongoose.model('Comment',Schema)