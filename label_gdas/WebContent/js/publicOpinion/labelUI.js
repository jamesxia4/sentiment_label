/**
 * 
 */
testData={
		"1":["现在活跃人数确实少了1","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区1","画面","百度贴吧","www.baidu.com","-3","-1"],
		"2":["现在活跃人数确实少了2","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区2","画面","百度贴吧","www.baidu.com","-3","-1"],
		"3":["现在活跃人数确实少了3","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区3","画面","百度贴吧","www.baidu.com","-3","-1"],
		"4":["现在活跃人数确实少了4","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区4","画面","百度贴吧","www.baidu.com","-2","-1"],
		"5":["现在活跃人数确实少了5","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区5","画面","百度贴吧","www.baidu.com","-3","-1"],
		"6":["现在活跃人数确实少了6","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区6","画面","百度贴吧","www.baidu.com","-3","-1"]
};

sentimentLabel=[];
irreleventLabel=[];

dataLength=0;
for(key in testData){
	sentimentLabel[dataLength]=parseInt(testData[key][5]);
	irreleventLabel[dataLength]=parseInt(testData[key][6]);
	++dataLength;
}



indexCard1=1;
indexCard2=2;
indexCard3=3;

//用来获取页面url参数
function getUrlParam(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r!=null) return unescape(r[2]); return null; //返回参数值
} 

//TODO 渲染的时候要读取暂存结果
function renderCardText(data,card1,card2,card3){
/*	console.log(card1);
	console.log(card2);
	console.log(card3);*/
	var cardComment1=data[card1.toString()][0];
	var cardComment2=data[card2.toString()][0];
	var cardComment3=data[card3.toString()][0];
	var cardSource1=data[card1.toString()][1];
	var cardSource2=data[card2.toString()][1];
	var cardSource3=data[card3.toString()][1];
	
	$("#label_card1").find(".label_card_comment").text(cardComment1);
	$("#label_card2").find(".label_card_comment").text(cardComment2);
	$("#label_card3").find(".label_card_comment").text(cardComment3);
	$("#label_card1").find(".label_card_source").text(cardSource1);
	$("#label_card2").find(".label_card_source").text(cardSource2);
	$("#label_card3").find(".label_card_source").text(cardSource3);
}

function renderProgressBar(progress){
		//渲染前先清空原有结果
		$(".label_label_progressBar").empty();
		$("<div class=\"label_label_progressBarUndoneLayer\">").appendTo($(".label_label_progressBar"));
		$("<div class=\"label_label_progressBarDotFinished\">").appendTo($(".label_label_progressBarUndoneLayer"));
		$("<div class=\"label_label_progressBarDoneLayer\">").appendTo($(".label_label_progressBar"));
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
				//console.log(barWidth);
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


function renderPage(jsonData,idx1,idx2,idx3){
	renderProgressBar(idx1);
	renderCardText(jsonData,idx1,idx2,idx3);
}


//TODO BUG
function headInsertSingleCard(jsonData,idx,label){
	var newCard=$("#label_card3").html();
	$("#label_card3").remove();
	$("#label_card2").attr("id","label_card3");
	$("#label_card1").attr("id","label_card2");
	
	$("<div class=\"label_labelCard ToDo\" id=\"label_card1\"></div>").prependTo($(".label_labelCard_wrapper"));
	$(newCard).appendTo($("#label_card1"));
	

}

//TODO BUG
function tailAppendSingleCard(jsonData,idx,label){
	var newCard=$("#label_card1").html();
	$("#label_card1").remove();
	$("#label_card2").attr("id","label_card1");
	$("#label_card3").attr("id","label_card2");
	
	$("<div class=\"label_labelCard ToDo\" id=\"label_card3\"></div>").appendTo($(".label_labelCard_wrapper"));
	$(newCard).appendTo($("#label_card3"));
	
}

function renderSingleCard(jsonData,idx,semLabel,cardId){
	var cardComment=jsonData[idx.toString()][0];
	var cardSource=jsonData[idx.toString()][1];
	$(cardId).find(".label_card_comment").removeClass("todo").removeClass("doing").text(cardComment);
	$(cardId).find(".label_card_source").removeClass("todo").removeClass("doing").text(cardSource);
	$(cardId).removeClass("ToDo").removeClass("Doing").removeClass("Done");
	var label=semLabel[idx-1];
	console.log(label);
	if(label!=-3){
		$(cardId).addClass("Done");
	}else{
		$(cardId).addClass("ToDo");
		$(cardId).find(".label_card_comment").addClass("todo");
		$(cardId).find(".label_card_source").addClass("todo");
	}
}

//TODO 翻页的时候要做暂存
function listenEvents(jsonData,label){
	$(document).ready(function(){
		$(".label_prev").click(function(e){
			e.preventDefault();
			if(indexCard1>=2){
				indexCard1--;
				indexCard2--;
				indexCard3--;
				headInsertSingleCard(jsonData,indexCard1,label);
/*				renderSingleCard(jsonData,indexCard1,label,"#label_card1");*/
			}
		});
		
		$(".label_next").click(function(e){
			e.preventDefault();
			if(indexCard3<dataLength){
				indexCard1++;
				indexCard2++;
				indexCard3++;
				tailAppendSingleCard(jsonData,indexCard3,label);
/*				renderSingleCard(jsonData,indexCard3,label,"#label_card3");*/
			}
		});
		
		$(".label_labelCard").click(function(e){
			e.preventDefault();
			if(!$(this).hasClass("Doing")){
				console.log("flag1");
				$(this).removeClass("ToDo").removeClass("Done").addClass("Doing");
				$(this).find(".label_card_source").removeClass("todo").addClass("doing");
				$(this).find(".label_card_comment").removeClass("todo").addClass("doing");
				$(this).siblings(".label_labelCard").each(function(i,e){
					if($(e).hasClass("Doing")){
						if($("input[name='semSelect']:checked").val()!=undefined){
							console.log("flag2");
							$(e).removeClass("Doing");
							$(e).addClass("Done");
							$(e).find(".label_card_source.doing").removeClass("doing");
							$(e).find(".label_card_comment.doing").removeClass("doing");
						}else{
							console.log("flag2");
							$(e).removeClass("Doing");
							$(e).addClass("ToDo");
							$(e).find(".label_card_source.doing").removeClass("doing").addClass("todo");
							$(e).find(".label_card_comment.doing").removeClass("doing").addClass("todo");;
						}
					}
				});
				//清零放在最后
				$("input[name='semSelect']:checked").attr('checked',false);
			}
		});
	});
}




$(document).ready(function(){
	console.log(sentimentLabel);
	renderPage(testData,indexCard1,indexCard2,indexCard3);
	listenEvents(testData,sentimentLabel);
});
