/**
 * 
 */

//测试数据，撸完就删
var jsonData={
			"1":["14","2015年第一期测试任务1","这是测试任务1的任务说明","这是测试任务1的任务要求","1","已领取"],
			"2":["14","2015年第一期测试任务2","这是测试任务2的任务说明","这是测试任务2的任务要求","1","已领取"],
			"3":["15","2015年第一期测试任务3","这是测试任务3的任务说明","这是测试任务3的任务要求","3","人数已满"],
			"4":["15","2015年第一期测试任务4","这是测试任务4的任务说明","这是测试任务4的任务要求","1","已领取"],
			"5":["16","2015年第一期测试任务5","这是测试任务5的任务说明","这是测试任务5的任务要求","1","已领取"],
			"6":["14","2015年第一期测试任务6","这是测试任务6的任务说明","这是测试任务6的任务要求","0","不可用"],
			"7":["6","2015年第一期测试任务7","这是测试任务7的任务说明","这是测试任务7的任务要求","1","已领取"],
			"8":["6","2015年第一期测试任务8","这是测试任务8的任务说明","这是测试任务8的任务要求","1","已领取"],
			"9":["6","2015年第一期测试任务9","这是测试任务9的任务说明","这是测试任务9的任务要求","0","不可用"],
			"10":["6","2015年第一期测试任务10","这是测试任务10的任务说明","这是测试任务10的任务要求","0","不可用"]
};

console.log(jsonData["1"][0]);

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
		} else {
			$(this).removeClass("infoPulledDown");
			$(this).siblings(".label_item_spliter").slideUp(180);
			$(this).siblings(".label_item_infobox").slideUp(180);
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
		var numPerson=parseInt(jsonData[idx][4]);
		for(var iterIdx=0;iterIdx<numPerson;iterIdx++){
			$("<div class=\"label_user_on\"></div>").appendTo($(this));
		}
		for(var iterIdx=0;iterIdx<3-numPerson;iterIdx++){
			$("<div class=\"label_user_off\"></div>").appendTo($(this));
		}
	});
	
	//按钮样式自动生成
	$
	
	//翻页
});
