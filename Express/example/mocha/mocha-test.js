var mocha = require('./mocha')
var should = require('should')
console.log(mocha.fibonacci(10))
describe('/test.js',function(){
    it('should equal 0 when n ===0',function(){
        mocha.fibonacci(0).should.equal(0)
    })
    it('should equal 1 when n ===1',function(){
        mocha.fibonacci(1).should.equal(1)
    })
    it('should equal 55 when n ===10',function(){
        mocha.fibonacci(10).should.equal(55)
    })
    it('should throw  when n >10',function(){
        (function(){
            mocha.fibonacci(11)
        }).should.throw('n should <=10')
    })

    it('should throw  when n <0',function(){
        (function(){
            mocha.fibonacci(-1)
        }).should.throw('n should >=0')
})
})
