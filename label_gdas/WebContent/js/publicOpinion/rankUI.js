/**
 * 
 */

//测试数据，撸完就删
var testData={}

var testData1={}

//用来获取页面url参数
function getUrlParam(name)
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r!=null) return unescape(r[2]); return null; //返回参数值
} 

//ajax调用servlet接口获取json并渲染页面

/*function reloadRank(){
	$(document).ready(function(){
		var url_to_use="/label_gdas/rank?user_id="+getUrlParam('user_id');
		$.ajax({
			type:"GET",
			url:url_to_use,
			dataType:"json",
			success: function(data){
				renderRank(data);
				addGadgets(data);
			}
		});
	});
}*/

/*//渲染页面,添加html骨架
function renderRank(JsonData){
	$(document).ready(function(){
		var dataLength=0;
		for(var item in JsonData){
			dataLength++;
		}
	});
}*/

//渲染页面,添加特效
function addGadgets(){
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
	});
}

$(document).ready(function(){
	addGadgets();
});

/*//Entry
reloadRank();*/


