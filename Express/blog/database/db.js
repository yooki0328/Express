var mongoose = require('mongoose')
var db = mongoose.connect("mongodb://localhost/blog")
var Schema = mongoose.Schema
/*db.on('connect',function(){
	console.log('blog')
})*/
var userSchema =new Schema({
	username:String,
	password:String,
})
var articleSchema= new Schema({
	author:String,
	title:String,
	time:String,
	content:String
})
exports.user = db.model('users',userSchema)
exports.article = db.model('article',articleSchema)
