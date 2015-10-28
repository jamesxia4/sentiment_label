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
				}
			});
			$(this).addClass("infoPulledDown");
		} else {
			$(this).removeClass("infoPulledDown");
		}
	});
});
