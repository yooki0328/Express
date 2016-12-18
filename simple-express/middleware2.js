var http = require('http')
var EventEmitter = require('events').EventEmitter
exports.createServer = createServer

let _proto={}
function createServer(){
    
    function app(req,res,next){
        app.handle(req,res,next)
    }
    Object.assign(app,_proto)
    Object.assign(app,EventEmitter.prototype)
    app._route='/'
    app._stack=[]
    return app
}
_proto.use=function(route,fn){
    console.log(typeof route)
    if(typeof route !=='string'){
        
        fn = route
        route='/'
    }
    console.log(route)
    if(typeof fn.handle==='function'){
        fn._route=route
        fn = fn.handle.bind(fn)
    }
    if(route[route.length-1]==='/')
        route = route.slice(0,-1)
    
    console.log(route)
    this._stack.push({route:route,handle:fn})
    console.log(this._stack)
    return this
}

_proto.handle=function(req,res,out){
    
    let index = 0,
        removed='',
        slashAdded=false
    let next= err=>{
        /*if(slashAdded){
            req.url=req.url.substr(1)
            slashAdded=false
        }*/
        if(removed.length){
            req.url = removed + req.url
            removed= '' 
        }
        let layer = this._stack[index++]
        
        console.log(layer)
        if(!layer){
            out&&out(err)
            return

        
        }
        let route = layer.route
       console.log(req.url+"----"+route) 
            console.log(req.url.substr(0,route.length).toLowerCase()+"is ==?"+route.toLowerCase())   
        if(req.url.substr(0,route.length).toLowerCase()!==route.toLowerCase())
            {
            return next(err)
        }
        let border = req.url[route.length]
        console.log(border)
        if(border!=='/'&& border !==undefined)
            return next(err)
        if(route.length !==0 && route!=='/'){
            req.url = req.url.substr(route.length)
            removed = route
            console.log('*********'+req.url)
           /* if(req.url[0]!='/'){
                req.url = '/'+req.url
                slashAdded = true
            }*/
        }
        let handle = layer.handle
        console.log(err+"......."+handle.length)
        if(err&&handle.length===4)
            return handle(err,req,res,next)
        else if(!err&& handle.length<4)
            {
            console.log('im come')
            return handle(req,res,next)
            
            }
        next(err)
        
    }
    next()
}

_proto.listen = function(...args){
    const server = http.createServer(this)
    return server.listen(...args)
}
