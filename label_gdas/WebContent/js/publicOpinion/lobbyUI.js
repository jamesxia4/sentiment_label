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
		}
	});
});

//渲染页面,添加特效
function renderHtml(data){
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
			var numPerson=parseInt(data[idx][4]);
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
			var buttonStyle=data[idx][5];
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

