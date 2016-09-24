var mongoose = require('mongoose')
var db = mongoose.connect("mongodb://localhost/blog")
var Schema = mongoose.Schema
/*db.on('connect',function(){
	console.log('blog')
})*/
var userSchema =new Schema({
	username:String,
	password:String
})
exports.user = db.model('users',userSchema)
