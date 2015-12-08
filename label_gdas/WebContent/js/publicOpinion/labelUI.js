/** 测试数据
 testData={
		"1":["现在活跃人数确实少了1","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区1","画面","百度贴吧","http://www.baidu.com/","1","1"],
		"2":["现在活跃人数确实少了2","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区2","画面","百度贴吧","http://www.google.com.sg/","0","0"],
		"3":["现在活跃人数确实少了现在活跃人数确实少了现在活跃人数确实少了现在活跃人数确实少了现在活跃人数确实少了3","活跃人数实在太少夜里星星妖王都没人杀可把我一个人累坏了做完不知道哪个小号猛放妖王让我一个人足足杀了一个半小时现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3","画面","百度贴吧","http://www.sina.com.cn/","2","1"],
		"4":["现在活跃人数确实少了4","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区4","画面","百度贴吧","http://www.bilibili.com/","0","0"],
		"5":["现在活跃人数确实少了5","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区5","画面","百度贴吧","http://www.acfun.tv/","4","1"],
		"6":["现在活跃人数确实少了6","活跃人数实在太少，夜里星星妖王都没人杀，可把我一个人累坏了，做完不知道哪个小号猛放妖王，让我一个人足足杀了一个半小时，现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区6","画面","百度贴吧","http://news.163.com/","3","0"]
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
 */

//TODO 自动翻页(点到最后一个)
//TODO 评论文字非激活时只显示一部分v			

//用来获取页面url参数
function getUrlParam(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r!=null) return unescape(r[2]); return null; //返回参数值
} 

function renderCardText(data,semLabel,card1,card2,card3){
	
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
	
	$("#label_card1").attr("dataid",card1.toString());
	$("#label_card2").attr("dataid",card2.toString());
	$("#label_card3").attr("dataid",card3.toString());
	
	var tempArr=[card1,card2,card3];
	for(idx in tempArr){
		var cardId="#label_card"+(parseInt(idx)+1).toString();
		var label=semLabel[tempArr[idx]-1];
/*		console.log(cardId,label);*/
		if(label!=0){
			$(cardId).addClass("Done");
			$(cardId).find(".label_labelItem_comment").css("width","260px");
			$(cardId).find(".label_labelItem_tick").css("display","inline-block");
			$(cardId).find(".label_card_comment").removeClass("doing").removeClass("todo").addClass("done");
			$(cardId).find(".label_card_source").removeClass("doing").removeClass("todo").addClass("done");
			//New
			$(cardId).find(".label_labelItem_spliter").children().addClass("done");
		}else{
			$(cardId).addClass("ToDo");
			$(cardId).find(".label_card_comment").removeClass("doing").removeClass("done").addClass("todo");
			$(cardId).find(".label_card_source").removeClass("doing").removeClass("done").addClass("todo");
			//New
			$(cardId).find(".label_labelItem_spliter").children().removeClass("done");
		}
	}
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
			$("<div class=\"label_label_progressBarDotIndex\"></div>").appendTo($(".label_label_progressBar")).css("left",(progress/100*barWidth-1).toString()+"px");
			$("<div class=\"label_label_progressBarIndicator\"></div>").appendTo($(".label_label_progressBar")).css("left",(progress/100*barWidth-11).toString()+"px").text(progress.toString());
		}else{
			$("<div class=\"label_label_progressBarDotIndex\"></div>").appendTo($(".label_label_progressBar")).css("left",(progress/100*barWidth-3).toString()+"px");
			$("<div class=\"label_label_progressBarIndicator\"></div>").appendTo($(".label_label_progressBar")).css("left",(progress/100*barWidth-11).toString()+"px").text(progress.toString());
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


function renderPage(jsonData,semLabel,irrLabel,idx1,idx2,idx3){
	renderProgressBar(idx1);
	renderCardText(jsonData,semLabel,idx1,idx2,idx3);
	renderExtraInfo(jsonData,idx1,idx2,idx3);
	bindingCardEvents(semLabel,irrLabel);
}


function headInsertSingleCard(jsonData,idx,label){
	var newCard=$("#label_card3").html();
	$("#label_card3").remove();
	$("#label_card2").attr("id","label_card3");
	$("#label_card1").attr("id","label_card2");

	$("<div class=\"label_labelCard ToDo\" id=\"label_card1\"></div>").prependTo($(".label_labelCard_wrapper"));
	$(newCard).appendTo($("#label_card1"));
	$("#label_card1").attr("dataid",idx.toString());
}

function tailAppendSingleCard(jsonData,idx,label){
	var newCard=$("#label_card1").html();
	$("#label_card1").remove();
	$("#label_card2").attr("id","label_card1");
	$("#label_card3").attr("id","label_card2");
	$("<div class=\"label_labelCard ToDo\" id=\"label_card3\"></div>").appendTo($(".label_labelCard_wrapper"));
	$(newCard).appendTo($("#label_card3"));
	$("#label_card3").attr("dataid",idx.toString());
}

function renderSingleCard(jsonData,idx,semLabel,cardId){
	var cardComment=jsonData[idx.toString()][0];
	var cardSource=jsonData[idx.toString()][1];
	$(cardId).find(".label_card_comment").removeClass("todo").removeClass("doing").removeClass("done").text(cardComment);
	$(cardId).find(".label_card_source").removeClass("todo").removeClass("doing").removeClass("done").text(cardSource);
	$(cardId).find(".label_labelItem_comment").removeAttr("style");
	$(cardId).find(".label_labelItem_tick").css("display","none");
	$(cardId).removeClass("ToDo").removeClass("Doing").removeClass("Done");
	//New
	$(cardId).find(".label_labelItem_spliter").children().removeClass("done");
	var label=semLabel[idx-1];
	if(label!=0){
		$(cardId).addClass("Done");
		$(cardId).find(".label_card_comment").addClass("done");
		$(cardId).find(".label_card_source").addClass("done");
		$(cardId).find(".label_labelItem_comment").css("width","260px");
		$(cardId).find(".label_labelItem_tick").css("display","inline-block");
		$(cardId).find(".label_labelItem_spliter").children().addClass("done");
	}else{
		$(cardId).addClass("ToDo");
		$(cardId).find(".label_card_comment").addClass("todo");
		$(cardId).find(".label_card_source").addClass("todo");
	}
}

function renderExtraInfo(jsonData,idx1,idx2,idx3){
	$("#label_card1").find(".label_labelItem_subject").text(jsonData[idx1][2]);
	$("#label_card1").find(".label_labelItem_urlSource").text(jsonData[idx1][3]);
	$("#label_card1").find("a").prop("href",jsonData[idx1][4]);
	
	$("#label_card2").find(".label_labelItem_subject").text(jsonData[idx2][2]);
	$("#label_card2").find(".label_labelItem_urlSource").text(jsonData[idx2][3]);
	$("#label_card2").find("a").prop("href",jsonData[idx2][4]);
	
	$("#label_card3").find(".label_labelItem_subject").text(jsonData[idx3][2]);
	$("#label_card3").find(".label_labelItem_urlSource").text(jsonData[idx3][3]);
	$("#label_card3").find("a").prop("href",jsonData[idx3][4]);
	
	$(".label_labelItem_url").click(function(e){
		var href=$(this).find("a").attr("href");
		window.open(href);
	})
} 

function bindingCardEvents(semLabel,irrLabel){
	$(".label_labelCard").click(function(e){
		e.preventDefault();
/*		console.log(semLabel,irrLabel);*/
		if(!$(this).hasClass("Doing")){
			renderProgressBar(parseInt($(this).attr("dataid")));
			$(this).removeClass("ToDo").removeClass("Done").addClass("Doing");
			$(this).find(".label_card_source").removeClass("done").removeClass("todo").addClass("doing");
			$(this).find(".label_card_comment").removeClass("done").removeClass("todo").addClass("doing");
			//New
			$(this).find(".label_labelItem_spliter").children().removeClass("done");
			$(this).find(".label_labelItem_comment").removeAttr("style");
			$(this).find(".label_labelItem_tick").css("display","none");
			$(this).siblings(".label_labelCard").each(function(i,e){
				if($(e).hasClass("Doing")){
					if($("input[name='semSelect']:checked").val()!=undefined){
						$(e).removeClass("Doing");
						$(e).addClass("Done");
						$(e).find(".label_labelItem_comment").css("width","260px");
						$(e).find(".label_labelItem_tick").css("display","inline-block");
						$(e).find(".label_card_source.doing").removeClass("doing").addClass("done");
						$(e).find(".label_card_comment.doing").removeClass("doing").addClass("done");
						//New
						$(e).find(".label_labelItem_spliter").children().addClass("done");
						
					}else{
						$(e).removeClass("Doing").addClass("ToDo");
						$(e).find(".label_card_source.doing").removeClass("doing").addClass("todo");
						$(e).find(".label_card_comment.doing").removeClass("doing").addClass("todo");
						$(e).find(".label_labelItem_spliter").children().removeClass("done");
					}
				}
			});
			var idx=parseInt($(this).attr("dataid"));
			var semVal=semLabel[idx-1];
			var irrVal=irrLabel[idx-1];
			
			if(semVal!=0){
				var radioId="#semRadio"+(semVal).toString();
				$(radioId).prop('checked',true);
			}else{
				$("input[name='semSelect']:checked").prop('checked',false);
			}
			
			if(irrVal==1){
				$(".semCheck").prop('checked',true);
			}else{
				$(".semCheck").prop('checked',false);
			}
		}
	});
}

function listenEvents(jsonData,semLabel,irrLabel){
	$(document).ready(function(){
		$(".label_prev").click(function(e){
			e.preventDefault();
			if(indexCard1>=2){
				indexCard1--;
				indexCard2--;
				indexCard3--;
				headInsertSingleCard(jsonData,indexCard1,semLabel);
				renderSingleCard(jsonData,indexCard1,semLabel,"#label_card1");
				renderExtraInfo(jsonData,indexCard1,indexCard2,indexCard3);
				bindingCardEvents(semLabel,irrLabel);
			}
		});
		
		$(".label_next").click(function(e){
			e.preventDefault();
			if(indexCard3<dataLength){
				indexCard1++;
				indexCard2++;
				indexCard3++;
				tailAppendSingleCard(jsonData,indexCard3,semLabel);
				renderSingleCard(jsonData,indexCard3,semLabel,"#label_card3");
				renderExtraInfo(jsonData,indexCard1,indexCard2,indexCard3);
				bindingCardEvents(semLabel,irrLabel);
			}
		});
		
		//点击情感选项时保存结果
		$(".semRadio").click(function(e){
			var semSelectOption=parseInt($(this).val());
			var irrSelectOption=$(".semCheck").prop("checked");
			if($(".label_labelCard.Doing").length>0){
				var dataid=parseInt($(".label_labelCard.Doing").attr("dataid"));
				var cardId=$(".label_labelCard.Doing").attr("id");
				if(!isNaN(semSelectOption)){
					semLabel[dataid-1]=semSelectOption;
				}else{
					semLabel[dataid-1]=0;
				}
				
				if(irrSelectOption==true){
					irrLabel[dataid-1]=1;
				}else{
					irrLabel[dataid-1]=0;
				}
	/*			console.log(sentimentLabel,irreleventLabel);*/
			}else{
				alert("请先点选卡片");
				$("input[name='semSelect']:checked").prop('checked',false);
				$(".semCheck").prop('checked',false);
			}
		});
		
		$(".semCheck").click(function(e){
			var semSelectOption=parseInt($('input:radio:checked').val());
			var irrSelectOption=$(".semCheck").prop("checked");
			if($(".label_labelCard.Doing").length>0){
				var dataid=parseInt($(".label_labelCard.Doing").attr("dataid"));
				var cardId=$(".label_labelCard.Doing").attr("id");
				if(!isNaN(semSelectOption)){
					semLabel[dataid-1]=semSelectOption;
				}else{
					semLabel[dataid-1]=0;
				}
				
				if(irrSelectOption==true){
					irrLabel[dataid-1]=1;
				}else{
					irrLabel[dataid-1]=0;
				}
	/*			console.log(sentimentLabel,irreleventLabel);*/
			}else{
				alert("请先点选卡片");
				$("input[name='semSelect']:checked").prop('checked',false);
				$(".semCheck").prop('checked',false);
			}
		});
		
		//点击保存时进行暂存
		$("#btn_save").click(function(e){
			$.post(
				"/label_gdas/label?",
				{
					task_id:getUrlParam('task_group'),
					task_group:getUrlParam('task_group'),
					user_id:getUrlParam('user_id'),
					semLabelData:JSON.stringify(semLabel),
					irrLabelData:JSON.stringify(irrLabel),
					reqType:"save",
				},
				function(data,status){
					console.log(data);
				    alert(data);
				}
			);
		});
		
		//点击提交时进行提交
		$("#btn_submit").click(function(e){
			$.post(
				"/label_gdas/label?",
				{
					task_id:getUrlParam('task_group'),
					task_group:getUrlParam('task_group'),
					user_id:getUrlParam('user_id'),
					semLabelData:JSON.stringify(semLabel),
					irrLabelData:JSON.stringify(irrLabel),
					reqType:"submit",
				},
				function(data,status){
					console.log(data);
				    alert(data);
				    $(".label_label_submit").removeClass("label_label_submit").addClass("label_label_submit_disable");
				    $(".label_label_submit_disable").unbind();
				}
			);
		});
	});
}

//Entry
$(document).ready(function(){
	testData={};
	sentimentLabel=[];
	irreleventLabel=[];
	indexCard1=1;
	indexCard2=2;
	indexCard3=3;
	
	$.ajax({
		type:"GET",
		url:"/label_gdas/label?task_id="+getUrlParam('task_id')+"&task_group="+getUrlParam('task_group')+"&user_id="+getUrlParam('user_id'),
		dataType:"json",
		success: function(data){
			testData=data;
/*		    console.log(data);*/
			dataLength=0;
			for(key in testData){
				sentimentLabel[dataLength]=parseInt(testData[key][5]);
				irreleventLabel[dataLength]=parseInt(testData[key][6]);
				++dataLength;
			}
			renderPage(testData,sentimentLabel,irreleventLabel,indexCard1,indexCard2,indexCard3);
			listenEvents(testData,sentimentLabel,irreleventLabel);
		}
	});
});


/**Entry
 $(document).ready(function(){
	renderPage(testData,sentimentLabel,irreleventLabel,indexCard1,indexCard2,indexCard3);
	listenEvents(testData,sentimentLabel,irreleventLabel);
});
 */