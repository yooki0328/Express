var express= require('express')
var superAgent= require('superagent')
var cheerio = require('cheerio')
var app = express()
app.get('/',function(req,res,next){
    var url = 'https://cnodejs.org'
    superAgent.get(url).end(function(err,sres){
        if(err){
            return next(err)
        }else{
            var $=cheerio.load(sres.text)
            var items=[]
            
            var cell=$('#topic_list .cell')
            cell.each(function(index,data){
                var $data = $(data)
                var author=$data.children().first().find('img').attr('title')  
                var topic =$data.children().last().find('a')
                //console.log($data.first().attr('class'))
               items.push({
                    'title' : topic.attr('title'),
                    'href' : url+topic.attr('href'),
                    'author':author
                })
            })
            var text=""
            for(var i of items){
                //console.log(i)
                text+=`<div><p>作者:${i.author}</p><p>title:${i.title}</p><p>link:<a href=${i.href}>${i.href}</a></p></div>`
            }
            
    res.send(text)
        }
    })
})
app.listen(3000,function(req,res){
    console.log('app is running at port 3000')
})

