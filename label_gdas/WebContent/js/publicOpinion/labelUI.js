/**
 * 
 */

//用来获取页面url参数
function getUrlParam(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r!=null) return unescape(r[2]); return null; //返回参数值
} 

function renderProgressBar(progress){
		var numToPaintGreen=Math.floor(progress/10);
		console.log(numToPaintGreen);
		for(var i=0;i<9;i++){
			if(i==0){
				$("<div class=\"label_label_progressBarDotUnDone\"></div>").appendTo($(".label_label_progressBar"));
			}
			else{
				$("<div class=\"label_label_progressBarDotUnDone\"></div>").appendTo($(".label_label_progressBar")).css("left",(i*11).toString()+"%");
			}
		}
}

$(document).ready(function(){
	console.log("start");
	renderProgressBar(97);
});