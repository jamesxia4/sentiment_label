/**
 * 
 */

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
		}
	});
	
	//当前参与人数指示器
});
