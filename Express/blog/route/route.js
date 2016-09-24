var express = require('express')
var router = express.Router()
var user = require("../database/db").user
router.get('/',function(req,res){
	res.render('index.ejs')
})
router.route('/register').get(function(req,res){
    res.render('register.ejs')
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
router.route('/login').get(function(req,res){
    res.render('login.ejs',{message:res.locals.message})
}).post(function(req,res){
    var uname = req.body.username
    var password = req.body.password

    user.findOne({'username':uname},function(err,doc){
            if(err)
            {
            res.status(500).send(err)
        }else if(!doc){
        	req.session.message='username isn\'t exist'
             res.status(500)
            
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


module.exports = router
