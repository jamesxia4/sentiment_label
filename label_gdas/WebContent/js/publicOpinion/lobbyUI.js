/**
 * 
 */

function taskGroupSelector($hanlder){
	this.$hanlder=$hanlder;
	this.Init();
}

taskGroupSelector.prototype.Init=function(){
	this.BindingEvent();
}

taskGroupSelector.prototype.BindingEvent=function(){
	$(".label_taskgroup_item").click(function(e){
		e.preventDefault();
		
		//toggle selected, other unselected;
		if($(this).hasClass(".label_taskgroup_item")){
			$(this).addClass("taskgroup_item_selected");
			$(this).siblings.each(function(i,e){
				if($(e).hasClass("taskgroup_item_selected")){
					e.removeClass("taskgroup_item_selected");
				}
			})
		}
	})
}