/**
 * 
 */

var testData={
		"1":["现在活跃人数确实少了1","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区1","画面","百度贴吧","www.baidu.com","0"],
		"2":["现在活跃人数确实少了2","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区2","画面","百度贴吧","www.baidu.com","0"],
		"3":["现在活跃人数确实少了3现在活跃人数确实少了3现在活跃人数确实少了3现在活跃人数确实少了3现在活跃人数确实少了3","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区3","画面","百度贴吧","www.baidu.com","0"],
		"4":["现在活跃人数确实少了4","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区4","画面","百度贴吧","www.baidu.com","0"],
		"5":["现在活跃人数确实少了5","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区5","画面","百度贴吧","www.baidu.com","0"],
		"6":["现在活跃人数确实少了6","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区6","画面","百度贴吧","www.baidu.com","0"]
}
//用来获取页面url参数
function getUrlParam(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r!=null) return unescape(r[2]); return null; //返回参数值
} 

function renderComment(data,done,doing,todo){
	var textDone=data[done][0];
	var textDoing=data[doing][0];
	var textTodo=data[todo][0];
	
	$(".label_labelCard.Done").find(".label_card_comment").text(textDone);
	$(".label_labelCard.Doing").find(".label_card_comment").text(textDoing);
	$(".label_labelCard.ToDo").find(".label_card_comment").text(textTodo);
}

function renderSource(data,done,doing,todo){
	var textDone=data[done][1];
	var textDoing=data[doing][1];
	var textTodo=data[todo][1];
	
	$(".label_labelCard.Done").find(".label_card_source").text(textDone);
	$(".label_labelCard.Doing").find(".label_card_source").text(textDoing);
	$(".label_labelCard.ToDo").find(".label_card_source").text(textTodo);
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

function cardSelector(){
	$(".label_labelCard").click(function(e){
		e.preventDefault();
		if(!$(this).hasClass("Doing")&&!$(this).hasClass("ToDo")&&!$(this).hasClass("Done")){
			$(this).addClass("Doing");
			$(this).find(".label_card_source").addClass("doing");
			$(this).find(".label_card_comment").addClass("doing");
			$(this).siblings(".label_labelCard").each(function(i,e){
				if($(e).hasClass("Doing")){
					$(e).removeClass("Doing");
					$(e).addClass("Done");
					$(e).find(".label_card_source.doing").removeClass("doing");
					$(e).find(".label_card_comment.doing").removeClass("doing");
				}
			});
		}
		else if(!$(this).hasClass("Doing")){
			$(this).removeClass("ToDo").removeClass("Done").addClass("Doing");
			$(this).find(".label_card_source").removeClass("todo").addClass("doing");
			$(this).find(".label_card_comment").removeClass("todo").addClass("doing");
			$(this).siblings(".label_labelCard").each(function(i,e){
				if($(e).hasClass("Doing")){
					//TODO 判断是否已选
					$(e).removeClass("Doing");
					$(e).addClass("Done");
					$(e).find(".label_card_source.doing").removeClass("doing");
					$(e).find(".label_card_comment.doing").removeClass("doing");
				}
			});
		}
	});
};

$(document).ready(function(){
	console.log("start");
	renderProgressBar(50);
	renderComment(testData,"1","2","3");
	renderSource(testData,"1","2","3");
	cardSelector();
});