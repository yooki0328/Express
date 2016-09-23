var superAgent= require('superagent')
var cheerio = require('cheerio')
var url = require('url')
var async = require('async')
var cnodeUrl = 'https://cnodejs.org/'
superAgent.get(cnodeUrl)
        .end(function(err,sres){
            if(err){
                return console.error(err)
            }else{
            var $=cheerio.load(sres.text)
            var topicUrls=[]
            $('#topic_list .topic_title').each(function(index,element){
                $element=$(element)
                var href = url.resolve(cnodeUrl,$element.attr('href'))
                topicUrls.push(href)
            })
        }
        var currencyCount=0
        var fetchUrl = function(url,callback){
            superAgent.get(url)
                .end(function(err,res){
                    var pageHTML=res.text
                    
            var delay = parseInt((Math.random()*100000)%2000,10)
            currencyCount++
            console.log('现在的并发数',currencyCount,',正在抓取的是',url,',耗时'+delay+'毫秒')
            setTimeout(function(){
                currencyCount--
                callback(null,{url:url,text:pageHTML})
            },delay)
        })
            
    }
    async.mapLimit(topicUrls,5,function(url,callback){
        fetchUrl(url,callback)
    },function(err,result){
        //console.log(result)
        var lastResult = result.map(function(data){
            var $ = cheerio.load(data.text)
            var title=$('.topic_full_title').text().trim()
            var comment={
            author:$('#reply1 .dark reply_author').text(),
            content:$('#reply1 .markdown-text').text().trim()
            }

            return {
            title:title,
            url:data.url,
            comment:comment
            }
        })
        console.log(lastResult)
    })
})

    

