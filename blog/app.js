var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var router= require('./route/route.js')
var session = require('express-session')
app.set('views',path.join(__dirname,'views'))
app.set('viw engine','ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))
var sess={
	secret:'blog key',
	cookie:{secure:false}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy 
  sess.cookie.secure = true // serve secure cookies 
}
app.use(session(sess))
app.use(function(req,res,next){
	res.locals.user=req.session.user
	var message = req.session.message||null
	delete req.session.message
	if(message)
		res.locals.message=`<div class="alert alert-danger" style="margin-bottom:20px;color:red">${message}</div>`
	next()
})
app.use('/',router)
app.listen(3002,function(){
	console.log('server running on port 3002')
})
