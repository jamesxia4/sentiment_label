/**
 * 
 */

$(document).ready(function(){
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
});
