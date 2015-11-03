/**
 * 
 */

//测试数据，撸完就删
//楼上已撸

//用来获取页面url参数
function getUrlParam(name)
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r!=null) return unescape(r[2]); return null; //返回参数值
} 

//ajax调用servlet接口获取json并渲染页面
$(document).ready(function(){
	var url_to_use="/label_gdas/lobby?user_id="+getUrlParam('user_id')+"&task_group="+getUrlParam('task_group');
	$.ajax({
		type:"GET",
		url:url_to_use,
		dataType:"json",
		success: function(data){
			console.log("Success");
			console.log(data);
			renderHtml(data);
			addGadgets(data);
		}
	});
});

//渲染页面,添加html骨架
function renderHtml(data){
	$(document).ready(function(){
		console.log("start");
		
		var dataLength=0;
		for(var item in data){
			dataLength++;
		}
		
		console.log(dataLength);
		for(var idx=0;idx<dataLength;idx++){
			console.log(idx);
			$("<div class=\"label_lobby_tasks_item\"></div>").appendTo($(".label_lobby_tasks"));
		}
		
		//添加任务项框架
		$(".label_lobby_tasks_item").each(function(i,e){
			$("<div class=\"label_timeGameSource\"></div>").appendTo($(this));
			$("<div class=\"label_taskNameWorkerWrapper\"></div>").appendTo($(this));
			$("<div class=\"label_item_spliter\"></div>").appendTo($(this));
			$("<div class=\"label_item_infobox\"></div>").appendTo($(this));
			$("<div class=\"label_item_pulldown\"></div>").appendTo($(this));
		});
		
		
		//在任务项框架中的抬头部分添加数据来源游戏名称和任务倒计时
		$(".label_timeGameSource").each(function(i,e){
			$("<div class=\"label_clock\"></div>").appendTo($(this));
			//生成任务剩余时间字符串
			var idx=(i+1).toString();
			var timeLeft=data[idx][2];
			//TODO 日期变负的以后也要改
			var divTimeLeft="<div class=\"label_rTime\">"+timeLeft+"天"+"</div>";
			$(divTimeLeft).appendTo($(this));
			
			var commentGame="<div class=\"label_fromGame\">"+data[idx][5]+"</div>";
			var dataSource="<div class=\"label_scrapSource\">"+data[idx][6]+"</div>";
			$(commentGame).appendTo($(this));
			$(dataSource).appendTo($(this));
		});
		
		//在任务项框架中添加任务名与领取人数指示器，以及领取按钮
		$(".label_taskNameWorkerWrapper").each(function(i,e){
			//生成任务名
			var idx=(i+1).toString();
			var taskName=data[idx][3];
			var divTaskName="<div class=\"label_item_name\">"+taskName+"</div>";
			$(divTaskName).appendTo($(this));
			$("<div class=\"label_user_wrapper\"></div>").appendTo($(this));
		});
		
		//TODO 在任务项框架中添加下拉信息框的信息
		$(".label_item_infobox").each(function(i,e){
			$("<div class=\"label_infobox_header\">任务介绍 :</div>").appendTo($(this));
			$("<div class=\"label_infobox_textbox_upper\"></div>").appendTo($(this));
			$("<div class=\"label_infobox_textbox_lower\"></div>").appendTo($(this));
			$("<div class=\"label_infobox_generalDesc\"></div>").appendTo($(this));
			
			var idx=(i+1).toString();
			$("<div class=\"label_textbox_commentGame\"></div>").appendTo($(e).children(".label_infobox_textbox_upper"));
			$("<div class=\"label_textbox_dataSource\"></div>").appendTo($(e).children(".label_infobox_textbox_upper"));
			$("<div class=\"label_textbox_dataTime\"></div>").appendTo($(e).children(".label_infobox_textbox_upper"));
			$("<div class=\"label_textbox_userTaken\"></div>").appendTo($(e).children(".label_infobox_textbox_upper"));
			

			
			
			
			$("<div class=\"label_textbox_labelSize\"></div>").appendTo($(e).children(".label_infobox_textbox_lower"));
			$("<div class=\"label_textbox_labelType\"></div>").appendTo($(e).children(".label_infobox_textbox_lower"));
			$("<div class=\"label_textbox_labelBonus\"></div>").appendTo($(e).children(".label_infobox_textbox_lower"));
			
			$(e).find(".label_textbox_commentGame").text("评论游戏："+data[idx][5]);
			$(e).find(".label_textbox_dataSource").text("数据来源："+data[idx][6]);
			$(e).find(".label_textbox_dataTime").text("数据时间："+data[idx][4]);
			$(e).find(".label_textbox_userTaken").text("参加人数："+data[idx][10]);
			$(e).find(".label_textbox_labelSize").text("标注数量："+data[idx][7]);
			$(e).find(".label_textbox_labelType").text("标注类型："+data[idx][8]);
			$(e).find(".label_infobox_generalDesc").text(data[idx][9]);
			$(e).find(".label_textbox_labelBonus").text("任务奖励：0~100金币（标注数量x准确率）");

		});
		
		
	});
}

//渲染页面,添加特效
function addGadgets(data){
	$(document).ready(function(){
		//任务组选择器
		$(".label_taskgroup_item").click(function(e){
			e.preventDefault();
			if(!$(this).hasClass("taskgroup_item_selected")){
				$(this).addClass("taskgroup_item_selected");
				$(this).siblings(".label_taskgroup_item").each(function(i,e){
					if($(e).hasClass("taskgroup_item_selected")){
						$(e).removeClass("taskgroup_item_selected");
					}
				});
			}
		});
		
		//任务下拉信息
		$(".label_item_pulldown").click(function(e){
			e.preventDefault();
			if(!$(this).hasClass("infoPulledDown")){
				$(this).parent().siblings(".label_lobby_tasks_item").children(".label_item_pulldown").each(function(i,e){
					if($(e).hasClass("infoPulledDown")){
						$(e).removeClass("infoPulledDown");
						$(e).siblings(".label_item_spliter").slideUp(180);
						$(e).siblings(".label_item_infobox").slideUp(180);
					}
				});
				$(this).addClass("infoPulledDown");
				$(this).siblings(".label_item_spliter").slideDown(180);
				$(this).siblings(".label_item_infobox").slideDown(180);
				$(this).siblings(".label_item_infobox").children().slideDown(180);
			} else {
				$(this).removeClass("infoPulledDown");
				$(this).siblings(".label_item_spliter").slideUp(180);
				$(this).siblings(".label_item_infobox").slideUp(180);
				$(this).siblings(".label_item_infobox").children().slideUp(180);
			}
		});
		
		//剩余时间提示（小于10天红色）
		$(".label_rTime").each(function(i,e){
			if($(e).text().slice(0,-1)<=10){
				$(e).addClass("urgent");
				$(e).siblings(".label_clock").addClass("urgent");
			}
		});
		
		//当前参与人数指示器
		$(".label_user_wrapper").each(function(i,e){
			var idx=(i+1).toString();
			var numPerson=parseInt(data[idx][10]);
			for(var iterIdx=0;iterIdx<numPerson;iterIdx++){
				$("<div class=\"label_user_on\"></div>").appendTo($(this));
			}
			for(var iterIdx=0;iterIdx<3-numPerson;iterIdx++){
				$("<div class=\"label_user_off\"></div>").appendTo($(this));
			}
		});
		
		//按钮样式自动生成
		$(".label_taskNameWorkerWrapper").each(function(i,e){
			var idx=(i+1).toString();
			var buttonStyle=data[idx][11];
			if (buttonStyle=="领取任务"){
				$("<div class=\"label_userBtn_available\">领取任务</div>").appendTo($(this));
			} else if(buttonStyle=="已领取") {
				$("<div class=\"label_userBtn_disable\">已领取</div>").appendTo($(this));
			} else if(buttonStyle=="人数已满") {
				$("<div class=\"label_userBtn_disable\">人数已满</div>").appendTo($(this));
			} else {
				console.log(idx);
				console.log(buttonStyle);
				$("<div class=\"label_userBtn_disable\">不可用</div>").appendTo($(this));
			}
		});
		
		//翻页
		//TODO: 做个ajax翻页
	});
}

