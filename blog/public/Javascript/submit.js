$(function(){
	$("#register").click(function(){
		location.href='register'
	})
	$("#login").click(function(){
		location.href='login'
	})
	var aside = $(".aside_left")
	var tag_a=aside.find("a")
	for(var i =0;i<tag_a.length;i++){
		//console.log(tag_a.eq(i).attr('href',))
		var url =tag_a.eq(i).attr('href')
		url = url+"?n="+i
		console.log(url)
		tag_a.eq(i).attr('href',url)
	}
	function changeActive( ){
		var url = this.location.href
		var n = url.split('=')[1]||0
		aside.find("li").removeClass().eq(n).addClass('active')
	}
	changeActive()
})