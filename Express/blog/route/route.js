var express = require('express')
var router = express.Router()
var user = require("../database/db").user
var article = require("../database/db").article
var multer = require('multer')
var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'../public/Img')
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now())
    }
})
var upload = multer({storage:storage})
router.get('/',function(req,res,next){
	article.find({},function(err,doc){
		if(err){
			console.error(err)
		}else{
			var new_doc = doc
			res.render('index.ejs',{title:'HomePage',data:new_doc.reverse()})
		}
	})
	//res.render('index.ejs',{title:"HomePage"})
})
router.route('/register').get(function(req,res){

    res.render('register.ejs',{title:"Register"})
}).post(function(req,res,next){
    var uname = req.body.username
    var password = req.body.password
    user.findOne({'username':uname},function(err,doc){
            if(err)
            {

            console.log(err)
            res.sendStatus(500)
        }else if(doc){
        	console.log(1)
        	req.session.message='usename is already exist'
            res.status(500).redirect('/register')
        }else{
            user.create({'username':uname,'password':password},function(err,doc){
               	
                if(err){
                    res.status(500).send(err)
                }else{
                req.session.message='username register success!'
                res.status(200).redirect('/login')

                }
            })
            }
    })
})
router.get('/login',(function(req,res,next){
	if(req.session.user){
		req.session.message="you has been login"
		res.status(500).redirect('back')
	}
	next()
})
)
router.route('/login').get(function(req,res){
    res.render('login.ejs',{title:"Login"})
}).post(function(req,res){
    var uname = req.body.username
    var password = req.body.password

    user.findOne({'username':uname},function(err,doc){
            if(err)
            {
            res.status(500).send(err)
        }else if(!doc){
        	req.session.message='username isn\'t exist'
             res.status(500).redirect('back')
            
        }else{
             if(password !=doc.password){
                req.session.message='password isn\'t right'
                res.status(500)
                }else{
                	req.session.message='login sucess'
                    req.session.user=uname
                    res.status(200).redirect('/')
                }   
             }
        })
       
    })
router.route('/logout').get(function(req,res){
    req.session.user=null
    req.session.message="logout success"
    res.redirect('/')
})
router.route('/post').get(function(req,res){
    res.render('post.ejs',{title:"Post"})
}).post(function(req,res){
    var title= req.body.title
    var content= req.body.content
    var time = new Date()
    time= `${time.getFullYear()}--${time.getMonth()+1}--${time.getDate()} ${time.getHours()}-${time.getMinutes()}`
    var article_entity={
		author:req.session.user,
		title:title,
		time:time,
		content:content    	
    }
    article.create(article_entity,function(err,doc){
    	if(err){
    		console.log(err)
    		res.status(500).redirect('back')
    	}else{
    		req.session.message="post success"
    		res.status(200).redirect('/')
    	}
    })        
})
router.route('/upload').get(function(req,res){
	res.render('upload.ejs',{title:'Upload'})
}).post(function(req,res){
    console.log(req.body.name1)
    res.status(200).redirect('/upload')
})
module.exports = router
