/**
 * 
 */

//TODO 右侧自动渲染
//TODO 自动高亮
//TODO 右侧名次
//TODO 左侧名次

//测试数据，撸完就删
var testDataAll={
		"1":["1","gzwanwei","2000","1"],
		"2":["2","gzwanwei1","2001","0"],
		"3":["3","gzwanwei2","2002","-1"],
		"4":["4","gzwanwei3","2003","1"],
		"5":["5","gzwanwei4","2004","0"],
		"6":["6","gzwanwei5","2005","-1"],
		"7":["7","gzwanwei6","2006","1"],
		"8":["8","gzwanwei7","2007","1"],
		"9":["9","gzwanwei8","2008","1"],
		"10":["10","gzwanwei9","2009","0"],
		"11":["11","gzwanwei10","2010","-1"],
		"12":["12","gzwanwei11","2011","1"],
		"13":["13","gzwanwei12","2012","-1"],
		"14":["14","gzwanwei13","2013","0"],
		"15":["15","gzwanwei14","2014","1"],
		"16":["16","gzwanwei15","2015","0"],
		"17":["17","gzwanwei16","2016","-1"],
		"18":["18","gzwanwei17","2017","-1"],
		"19":["19","gzwanwei18","2018","-1"],
		"20":["20","gzwanwei19","2019","-1"],
		"21":["21","gzwanwei20","2020","-1"],
		"22":["22","gzwanwei21","2021","-1"],
		"23":["23","gzwanwei22","2022","-1"],
		"24":["24","gzwanwei23","2023","-1"],
		"25":["25","gzwanwei24","2024","-1"]
} 

var testDataTask={
		"1":["1","gzwanwei1","100","1"],
		"2":["2","gzwanwei2","101","0"],
		"3":["3","gzwanwei","102","-1"],
		"4":["4","gzwanwei3","103","1"],
		"5":["5","gzwanwei4","104","0"],
		"6":["6","gzwanwei5","105","-1"],
		"7":["7","gzwanwei6","106","1"],
		"8":["8","gzwanwei7","107","1"],
		"9":["9","gzwanwei8","108","1"],
		"10":["10","gzwanwei9","109","0"],
		"11":["11","gzwanwei10","110","-1"],
		"12":["12","gzwanwei11","111","1"],
		"13":["13","gzwanwei12","112","-1"],
		"14":["14","gzwanwei13","113","0"],
		"15":["15","gzwanwei14","114","1"],
		"16":["16","gzwanwei15","115","0"],
		"17":["17","gzwanwei16","116","-1"],
		"18":["18","gzwanwei17","117","-1"],
		"19":["19","gzwanwei18","118","-1"],
		"20":["20","gzwanwei19","119","-1"],
		"21":["21","gzwanwei20","120","-1"],
		"22":["22","gzwanwei21","121","-1"],
		"23":["23","gzwanwei22","122","-1"],
		"24":["24","gzwanwei23","123","-1"],
		"25":["25","gzwanwei24","124","-1"]
} 

var testDataPrecision={
		"1":["1","gzwanwei1","0.939","1"],
		"2":["2","gzwanwei","0.938","0"],
		"3":["3","gzwanwei2","0.937","-1"],
		"4":["4","gzwanwei3","0.936","1"],
		"5":["5","gzwanwei4","0.935","0"],
		"6":["6","gzwanwei5","0.934","-1"],
		"7":["7","gzwanwei6","0.933","1"],
		"8":["8","gzwanwei7","0.932","1"],
		"9":["9","gzwanwei8","0.931","1"],
		"10":["10","gzwanwei9","0.930","0"],
		"11":["11","gzwanwei10","0.929","-1"],
		"12":["12","gzwanwei11","0.928","1"],
		"13":["13","gzwanwei12","0.927","-1"],
		"14":["14","gzwanwei13","0.926","0"],
		"15":["15","gzwanwei14","0.925","1"],
		"16":["16","gzwanwei15","0.924","0"],
		"17":["17","gzwanwei16","0.923","-1"],
		"18":["18","gzwanwei17","0.922","-1"],
		"19":["19","gzwanwei18","0.921","-1"],
		"20":["20","gzwanwei19","0.920","-1"],
		"21":["21","gzwanwei20","0.919","-1"],
		"22":["22","gzwanwei21","0.918","-1"],
		"23":["23","gzwanwei22","0.917","-1"],
		"24":["24","gzwanwei23","0.916","-1"],
		"25":["25","gzwanwei24","0.915","-1"]
} 

var testData1={}

currentPageNum=1;
currentRankTab=1;

//用来获取页面url参数
function getUrlParam(name)
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r!=null) return unescape(r[2]); return null; //返回参数值
} 

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
	
	var tableHeader=$(".label_rankTableHeader").html();
	$(".label_rankTable").empty();
	$("<tr class=\"label_rankTableHeader\"></tr>").appendTo($(".label_rankTable"));
	$(tableHeader).appendTo($(".label_rankTableHeader"));
	
	//渲染最后一页
	if(pageNum==totalPages){
		var startIndex=(totalPages-1)*10+1;
		for(var i=startIndex;i<dataLength+1;i++){
			var itemRank=jsonData[i][0];d
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

function renderPaginator(jsonData,currentPage){
	var totalPages=getPages(jsonData);
	var textToOutput=currentPage.toString()+"/"+totalPages.toString();
	$(".label_rank_paginator_current").text(textToOutput);
}



function paginator(jsonData){
	var numOfPages=getPages(jsonData);
	$(document).ready(function(){
		$(".label_rank_paginator_prev").click(function(e){
			if(currentPageNum>1){
				console.log(jsonData);
				currentPageNum--;
				renderRankTable(jsonData,currentPageNum);
				renderPaginator(jsonData,currentPageNum);
			}
		});
		
		$(".label_rank_paginator_next").click(function(e){
			if(currentPageNum<numOfPages){
				console.log(jsonData);
				currentPageNum++;
				renderRankTable(jsonData,currentPageNum);
				renderPaginator(jsonData,currentPageNum);
			}
		});
	});
}

function rankTypeSelector(jsonDataAll,jsonDataTask,jsonDataPrecision){
	$(document).ready(function(){
		$(".label_rankTableLeft ul li").hover(function(e){
			currentPageNum=1;
			var selectId=$(this).attr("id").slice(-1);
			$(this).siblings(".label_rankTableLeft ul li").each(function(i,e){
				if($(e).hasClass("selected")){
					$(e).removeClass("selected");
				}
			});
			$(this).addClass("selected");
			var dataToFeed;
			if(selectId==1){
				console.log("card1");
				dataToFeed=jsonDataAll;
				currentPageNum=1;
				renderRankTable(dataToFeed,currentPageNum);
				renderPaginator(dataToFeed,currentPageNum);
				$(".label_rank_paginator_prev").unbind();
				$(".label_rank_paginator_next").unbind();
				paginator(dataToFeed);
			}else if(selectId==2){
				console.log("card2");
				dataToFeed=jsonDataTask;
				currentPageNum=1;
				renderRankTable(dataToFeed,currentPageNum);
				renderPaginator(dataToFeed,currentPageNum);
				$(".label_rank_paginator_prev").unbind();
				$(".label_rank_paginator_next").unbind();
				paginator(dataToFeed);
			}else{
				console.log("card3");
				dataToFeed=jsonDataPrecision;
				currentPageNum=1;
				renderRankTable(dataToFeed,currentPageNum);
				renderPaginator(dataToFeed,currentPageNum);
				$(".label_rank_paginator_prev").unbind();
				$(".label_rank_paginator_next").unbind();
				paginator(dataToFeed);
			}
			
		});
	});
}

//TODO
function renderRightTable(username,jsonData,jsonData1,jsonData2){
	var userScore;
	var userTask;
	var userPrecision;
	
	var userScoreRank;
	var userTaskRank;
	var userPrecisionRank;
	
	var userScoreTrend;
	var userTaskTrend;
	var userPrecisionTrend;
	
	for(key in jsonData){
		if(jsonData[key][1]==username){
			userScoreRank=jsonData[key][1];
			userScore=jsonData[key][2];
			userScoreTrend=jsonData[key][3];
		}
	}
	
	for(key in jsonData1){
		if(jsonData1[key][1]==username){
			userTaskRank=jsonData1[key][1];
			userTask=jsonData1[key][2];
			userTaskTrend=jsonData1[key][3];
		}
	}
	
	for(key in jsonData2){
		if(jsonData2[key][1]==username){
			userTaskRank=jsonData2[key][1];
			userTask=jsonData2[key][2];
			userTaskTrend=jsonData2[key][3];
		}
	}
	
}

//TODO
function usernameHighlighter(username){
	$(".label_rankTable").find(".table_item_td_name").each(function(i,e){
		if($(this).text()==username){
			$(this).parent("tr").addClass("tr_selected");
		}
	});
}

function rankHighlighterLeft(){
	
}

function rankHighlighterRight(){
	
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

function listenEvents(jsonData,jsonData1,jsonData2){
	rankTypeSelector(jsonData,jsonData1,jsonData2);
}

$(document).ready(function(){
	addGadgets();
	renderRankTable(testDataAll,currentPageNum);
	renderPaginator(testDataAll,currentPageNum);
	$(".label_rank_paginator_prev").unbind();
	$(".label_rank_paginator_next").unbind();
	paginator(testDataAll);
	listenEvents(testDataAll,testDataTask,testDataPrecision);
});



