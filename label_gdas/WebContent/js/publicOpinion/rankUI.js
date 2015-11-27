/**
 * 
 */

//测试数据，撸完就删
var testData={
		"1":["1","hzzhangjingjing","0.93","1"],
		"2":["2","hzzhangjingjing","0.93","0"],
		"3":["3","hzzhangjingjing","0.93","-1"],
		"4":["4","hzzhangjingjing","0.93","1"],
		"5":["5","hzzhangjingjing","0.93","0"],
		"6":["6","hzzhangjingjing","0.93","-1"],
		"7":["7","hzzhangjingjing","0.93","1"],
		"8":["8","hzzhangjingjing","0.93","1"],
		"9":["9","hzzhangjingjing","0.93","1"],
		"10":["10","hzzhangjingjing","0.93","0"],
		"11":["11","hzzhangjingjing","0.93","-1"],
		"12":["12","hzzhangjingjing","0.93","1"],
		"13":["13","hzzhangjingjing","0.93","-1"],
		"14":["14","hzzhangjingjing","0.93","0"],
		"15":["15","hzzhangjingjing","0.93","1"],
		"16":["16","hzzhangjingjing","0.93","0"],
		"17":["17","hzzhangjingjing","0.93","-1"],
		"18":["18","hzzhangjingjing","0.93","-1"],
		"19":["19","hzzhangjingjing","0.93","-1"],
		"20":["20","hzzhangjingjing","0.93","-1"],
		"21":["21","hzzhangjingjing","0.93","-1"],
		"22":["22","hzzhangjingjing","0.93","-1"],
		"23":["23","hzzhangjingjing","0.93","-1"],
		"24":["24","hzzhangjingjing","0.93","-1"],
		"25":["25","hzzhangjingjing","0.93","-1"],
}

var testData1={}

pageNum=1;

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

function getPages(jsonData){
	var dataLength=0;
	for(var item in jsonData){
		dataLength++;
	}
	return Math.floor(dataLength/10)+1;
}

function getLastPageOffset(jsonData){
	var dataLength=0;
	for(var item in jsonData){
		dataLength++;
	}
	return dataLength-(getPages(jsonData)-1)*10;
}


function renderRankTable(jsonData,pageNum){
	var dataLength=0;
	for(var item in jsonData){
		dataLength++;
	}	
	var totalPages=getPages(jsonData);
	var lastPageItems=getLastPageOffset(jsonData);
	
	//渲染最后一页
	if(pageNum==totalPages){
		var startIndex=(totalPages-1)*10+1;
		for(var i=startIndex;i<dataLength+1;i++){
			var itemRank=jsonData[i][0];
			var itemUsername=jsonData[i][1];
			var itemPrecision=jsonData[i][2];
			var itemTrend=parseInt(jsonData[i][3]);
			var itemTrendToRender="";
			if(itemTrend==-1){
				itemTrendToRender="<td class=\"table_item_td_trend down\"></td>";
			}else if(itemTrend==0){
				itemTrendToRender="<td class=\"table_item_td_trend unchanged\"></td>";
			}else{
				itemTrendToRender="<td class=\"table_item_td_trend up\"></td>";
			}
			$("<tr></tr>").appendTo($(".label_rankTable")).attr("id","rankTable"+i.toString());
			$("<td class=\"table_item_td_rank\"></td>").appendTo($("#rankTable"+i.toString())).text(itemRank);
			$("<td class=\"table_item_td_name\"></td>").appendTo($("#rankTable"+i.toString())).text(itemUsername);
			$("<td class=\"table_item_td_precision\"></td>").appendTo($("#rankTable"+i.toString())).text(itemPrecision);
			$(itemTrendToRender).appendTo($("#rankTable"+i.toString()));
		}
	}else{ //不是最后一页
		var startIndex=(pageNum-1)*10+1;
		for(var i=startIndex;i<pageNum*10+1;i++){
			var itemRank=jsonData[i][0];
			var itemUsername=jsonData[i][1];
			var itemPrecision=jsonData[i][2];
			var itemTrend=parseInt(jsonData[i][3]);
			var itemTrendToRender="";
			if(itemTrend==-1){
				itemTrendToRender="<td class=\"table_item_td_trend down\"></td>";
			}else if(itemTrend==0){
				itemTrendToRender="<td class=\"table_item_td_trend unchanged\"></td>";
			}else{
				itemTrendToRender="<td class=\"table_item_td_trend up\"></td>";
			}
			$("<tr></tr>").appendTo($(".label_rankTable")).attr("id","rankTable"+i.toString());
			$("<td class=\"table_item_td_rank\"></td>").appendTo($("#rankTable"+i.toString())).text(itemRank);
			$("<td class=\"table_item_td_name\"></td>").appendTo($("#rankTable"+i.toString())).text(itemUsername);
			$("<td class=\"table_item_td_precision\"></td>").appendTo($("#rankTable"+i.toString())).text(itemPrecision);
			$(itemTrendToRender).appendTo($("#rankTable"+i.toString()));
		}
	}
}


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
	renderRankTable(testData,3);
});

/*//Entry
reloadRank();*/


