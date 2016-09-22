var eventproxy = require('eventproxy')
var superAgent= require('superagent')
var cheerio = require('cheerio')
var url = require('url')
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
            //console.log(topicUrls)
        
var ep = new eventproxy()
ep.after('topic_html',topicUrls.length,function(topics){
    topics = topics.map(function(topicPair){
        if(topicPair[1]!=null){
        var topicUrl=topicPair[0]
        var topicHtml=topicPair[1]
        var $=cheerio.load(topicHtml)
        return ({
            title:$('.topic_full_title').text(),
            href:topicUrl,
            comment:$('.reply_content').eq(0).text()
        })
        }
    })
    console.log(topics)
})
topicUrls.forEach(function(topicUrl){
    superAgent.get(topicUrl)
        .end(function(res){
        //console.log(res)
        console.log(`fetch ${topicUrl} successful`)
        if( res){
         ep.emit('topic_html',[topicUrl,res.text])
        }else{
          ep.emit('topic_html',[topicUrl,null])
        }
        })
    })
}
})

    

