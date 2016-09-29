var express = require('express')
var router = express.Router()
var user = require("../database/db").user
var article = require("../database/db").article
var multer = require('multer')
var markdown = require('markdown').markdown
var storage = multer.diskStorage({
               destination: function (req, file, cb) {
                    cb(null, 'public/upload')
                    },
               filename: function (req, file, cb) {
                    cb(null, file.fieldname)
                    }
})                
var upload = multer({ storage: storage })
router.get('/',function(req,res,next){
	article.find({},function(err,doc){
		if(err){
			console.error(err)
		}else{
			var new_doc = doc
			res.render('index.ejs',{title:'HomePage',data:new_doc.reverse()})
		}
	})
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
            if(err){
            res.status(500).send(err)
            }else if(!doc){
            	req.session.message='username isn\'t exist'
                res.status(500).redirect('back')
            }else{
                if(password !=doc.password){
                    req.session.message='password isn\'t right'
                    res.status(500).redirect('back')
                }else{
                    req.session.message='login sucess'
                    req.session.user=uname
                    res.status(200).redirect('/')
                }   
            }
        })
    })
router.get('/t/:title/:author/:time',function(req,res){
    var title = req.params.title
    var author = req.params.author
    var time = req.params.time
    article.findOne({title:title,author:author,time:time},function(err,doc){    
        if(err||!doc){
            req.session.message="error"
            res.status(500).redirect('back')
        }else{
            res.render('article.ejs',{title:'Article',art:doc})
        }
    })
})
router.get('/a/:author',function(req,res){
    var author= req.params.author
    article.find({author:author},function(err,doc){
        if(err||!doc){
            req.session.message="error"
            res.status(500).redirect('back')
        }else{
            res.render('user.ejs',{title:'User',data:doc})
        }
    })
})
router.use(function(req,res,next){
	if(!req.session.user){
		req.session.message="you should login first"
		res.redirect('back')
	}
	next()
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
    new_content = markdown.toHTML(content)
    var time = new Date()
    time= `${time.getFullYear()}--${time.getMonth()+1}--${time.getDate()} ${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}`
    var article_entity={
		author:req.session.user,
		title:title,
		time:time,
		content:new_content    	
    }
    article.create(article_entity,function(err,doc){
	    if(err){
	    	console.log(err)
	    	res.status(500).redirect('back')
	    }else{
	    	req.session. message="post success"
	    	res.status(200).redirect('/')
	    }
	})	 
})
router.post("/post/:id",function(req,res){
	var id = req.params.id
	var content= req.body.content
    new_content = markdown.toHTML(content)
    var time = new Date()
	time= `${time.getFullYear()}--${time.getMonth()+1}--${time.getDate()} ${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}`
	article.where({_id:id}).update({$set:{time:time,content:new_content}},function(err,doc){
		if(err){
			console.error(err)
			res.sendStatus(500)
		}else{
			req.session.message="Edit Success"
			res.status(200).redirect('/')
		}
	})
})
router.route('/upload').get(function(req,res){
	res.render('upload.ejs',{title:'Upload'})
}).post(upload.single('upload'),function(req,res){
    req.session.message="上传成功"
    res.status(200).redirect('upload')
})

router.get('/edit/:title/:author/:time',function(req,res){
    var title = req.params.title
    var author = req.params.author
    var time = req.params.time
    article.findOne({title:title,author:author,time:time},function(err,doc){
        if(err||!doc){
            req.session.message='error'
            res.status(500).redirect('back')
        }else{
            res.render('edit.ejs',{title:'Edit',art:doc})
        }
    })

})
router.get('/remove/:title/:author/:time',function(req,res){
	var title = req.params.title
    var author = req.params.author
    var time = req.params.time
    article.remove({title:title,author:author,time:time},function(err){
    	if(!err){
    		req.session.message="Delete success"
    		res.status(200).redirect('/')
    	}
    })
})
module.exports = router
