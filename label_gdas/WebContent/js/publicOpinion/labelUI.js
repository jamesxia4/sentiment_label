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
		var barWidth;
		//根据progressBar宽度调整刻度
		
		//添加刻度
		for(var i=0;i<10;i++){
			if(i==0){
				$("<div class=\"label_label_progressBarDotUnDone\"></div>").appendTo($(".label_label_progressBar"));
			}
			else{
				barWidth=parseInt($(".label_label_progressBar").css("width").slice(0,-2));
				console.log(barWidth);
				$("<div class=\"label_label_progressBarDotUnDone\"></div>").appendTo($(".label_label_progressBar")).css("left",(Math.ceil(i*barWidth/10)).toString()+"px");
			}
		}
		
		//画出进度条
		$(".label_label_progressBarDoneLayer").css("width",(progress/100*barWidth).toString()+"px");
		if(progress>0){
		$("<div class=\"label_label_progressBarDotIndex\"></div>").appendTo($(".label_label_progressBar")).css("left",(progress/100*barWidth-1).toString()+"px");}
		else{
			$("<div class=\"label_label_progressBarDotIndex\"></div>").appendTo($(".label_label_progressBar")).css("left",(progress/100*barWidth-3).toString()+"px");
		}
		
		//根据计算结果调整刻度颜色
		$(".label_label_progressBarDotUnDone").each(function(i,e){
			if(numToPaintGreen<0){
				return;
			}
			else{
				numToPaintGreen--;
				$(this).removeClass("label_label_progressBarDotUnDone").addClass("label_label_progressBarDotDone");
			}
		});
}

$(document).ready(function(){
	console.log("start");
	renderProgressBar(50);
});