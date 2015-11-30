/**
 * 
 */


//测试数据，撸完就删
var testDataAll={
		"1":["1","hzzhangjingjing999","2000","1"],
		"2":["2","hzzhangjingjing1","2001","0"],
		"3":["3","hzzhangjingjing2","2002","-1"],
		"4":["4","hzzhangjingjing3","2003","1"],
		"5":["5","hzzhangjingjing4","2004","0"],
		"6":["6","hzzhangjingjing5","2005","-1"],
		"7":["7","hzzhangjingjing6","2006","1"],
		"8":["8","hzzhangjingjing7","2007","1"],
		"9":["9","hzzhangjingjing8","2008","1"],
		"10":["10","hzzhangjingjing9","2009","0"],
		"11":["11","hzzhangjingjing10","2010","-1"],
		"12":["12","hzzhangjingjing11","2011","1"],
		"13":["13","hzzhangjingjing12","2012","-1"],
		"14":["14","hzzhangjingjing13","2013","0"],
		"15":["15","hzzhangjingjing","2014","1"],
		"16":["16","hzzhangjingjing15","2015","0"],
		"17":["17","hzzhangjingjing16","2016","-1"],
		"18":["18","hzzhangjingjing17","2017","-1"],
		"19":["19","hzzhangjingjing18","2018","-1"],
		"20":["20","hzzhangjingjing19","2019","-1"],
		"21":["21","hzzhangjingjing20","2020","-1"],
		"22":["22","hzzhangjingjing21","2021","-1"],
		"23":["23","hzzhangjingjing22","2022","-1"],
		"24":["24","hzzhangjingjing23","2023","-1"],
		"25":["25","hzzhangjingjing24","2024","-1"]
} 

var testDataTask={
		"1":["1","hzzhangjingjing1","100","1"],
		"2":["2","hzzhangjingjing2","101","0"],
		"3":["3","hzzhangjingjing","102","-1"],
		"4":["4","hzzhangjingjing3","103","1"],
		"5":["5","hzzhangjingjing4","104","0"],
		"6":["6","hzzhangjingjing5","105","-1"],
		"7":["7","hzzhangjingjing6","106","1"],
		"8":["8","hzzhangjingjing7","107","1"],
		"9":["9","hzzhangjingjing8","108","1"],
		"10":["10","hzzhangjingjing9","109","0"],
		"11":["11","hzzhangjingjing10","110","-1"],
		"12":["12","hzzhangjingjing11","111","1"],
		"13":["13","hzzhangjingjing12","112","-1"],
		"14":["14","hzzhangjingjing13","113","0"],
		"15":["15","hzzhangjingjing14","114","1"],
		"16":["16","hzzhangjingjing15","115","0"],
		"17":["17","hzzhangjingjing16","116","-1"],
		"18":["18","hzzhangjingjing17","117","-1"],
		"19":["19","hzzhangjingjing18","118","-1"],
		"20":["20","hzzhangjingjing19","119","-1"],
		"21":["21","hzzhangjingjing20","120","-1"],
		"22":["22","hzzhangjingjing21","121","-1"],
		"23":["23","hzzhangjingjing22","122","-1"],
		"24":["24","hzzhangjingjing23","123","-1"],
		"25":["25","hzzhangjingjing24","124","-1"]
} 

var testDataPrecision={
		"1":["1","hzzhangjingjing1","0.939","1"],
		"2":["2","hzzhangjingjing","0.938","0"],
		"3":["3","hzzhangjingjing2","0.937","-1"],
		"4":["4","hzzhangjingjing3","0.936","1"],
		"5":["5","hzzhangjingjing4","0.935","0"],
		"6":["6","hzzhangjingjing5","0.934","-1"],
		"7":["7","hzzhangjingjing6","0.933","1"],
		"8":["8","hzzhangjingjing7","0.932","1"],
		"9":["9","hzzhangjingjing8","0.931","1"],
		"10":["10","hzzhangjingjing9","0.930","0"],
		"11":["11","hzzhangjingjing10","0.929","-1"],
		"12":["12","hzzhangjingjing11","0.928","1"],
		"13":["13","hzzhangjingjing12","0.927","-1"],
		"14":["14","hzzhangjingjing13","0.926","0"],
		"15":["15","hzzhangjingjing14","0.925","1"],
		"16":["16","hzzhangjingjing15","0.924","0"],
		"17":["17","hzzhangjingjing16","0.923","-1"],
		"18":["18","hzzhangjingjing17","0.922","-1"],
		"19":["19","hzzhangjingjing18","0.921","-1"],
		"20":["20","hzzhangjingjing19","0.920","-1"],
		"21":["21","hzzhangjingjing20","0.919","-1"],
		"22":["22","hzzhangjingjing21","0.918","-1"],
		"23":["23","hzzhangjingjing22","0.917","-1"],
		"24":["24","hzzhangjingjing23","0.916","-1"],
		"25":["25","hzzhangjingjing24","0.915","-1"]
} 


//全局变量:当前页数
currentPageNum=1;

//用来获取页面url参数
function getUrlParam(name)
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r!=null) return unescape(r[2]); return null; //返回参数值
} 

//获取json数据对应表格页数
function getPages(jsonData){
	var dataLength=0;
	for(var item in jsonData){
		dataLength++;
	}
	return Math.floor(dataLength/10)+1;
}

//获取排名表格最后一页剩余条目数
function getLastPageOffset(jsonData){
	var dataLength=0;
	for(var item in jsonData){
		dataLength++;
	}
	return dataLength-(getPages(jsonData)-1)*10;
}

//渲染排名表格
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

//渲染分页器页数
function renderPaginator(jsonData,currentPage){
	var totalPages=getPages(jsonData);
	var textToOutput=currentPage.toString()+"/"+totalPages.toString();
	$(".label_rank_paginator_current").text(textToOutput);
}

//分页器事件处理
function paginator(username,jsonData){
	var numOfPages=getPages(jsonData);
	$(document).ready(function(){
		$(".label_rank_paginator_prev").click(function(e){
			if(currentPageNum>1){
				console.log(jsonData);
				currentPageNum--;
				renderRankTable(jsonData,currentPageNum);
				renderPaginator(jsonData,currentPageNum);
				changeFontAndHighlightUsername(username);
			}
		});
		
		$(".label_rank_paginator_next").click(function(e){
			if(currentPageNum<numOfPages){
				console.log(jsonData);
				currentPageNum++;
				renderRankTable(jsonData,currentPageNum);
				renderPaginator(jsonData,currentPageNum);
				changeFontAndHighlightUsername(username);
			}
		});
	});
	changeFontAndHighlightUsername(username);
}

//排名选项卡hover事件
function rankTypeSelector(username,jsonDataAll,jsonDataTask,jsonDataPrecision){
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
				paginator(username,dataToFeed);
			}else if(selectId==2){
				console.log("card2");
				dataToFeed=jsonDataTask;
				currentPageNum=1;
				renderRankTable(dataToFeed,currentPageNum);
				renderPaginator(dataToFeed,currentPageNum);
				$(".label_rank_paginator_prev").unbind();
				$(".label_rank_paginator_next").unbind();
				paginator(username,dataToFeed);
			}else{
				console.log("card3");
				dataToFeed=jsonDataPrecision;
				currentPageNum=1;
				renderRankTable(dataToFeed,currentPageNum);
				renderPaginator(dataToFeed,currentPageNum);
				$(".label_rank_paginator_prev").unbind();
				$(".label_rank_paginator_next").unbind();
				paginator(username,dataToFeed);
			}
			
		});
	});
}

//渲染右侧排名表格
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
			userScoreRank=jsonData[key][0];
			userScore=jsonData[key][2];
			userScoreTrend=jsonData[key][3];
		}
	}
	
	for(key in jsonData1){
		if(jsonData1[key][1]==username){
			userTaskRank=jsonData1[key][0];
			userTask=jsonData1[key][2];
			userTaskTrend=jsonData1[key][3];
		}
	}
	
	for(key in jsonData2){
		if(jsonData2[key][1]==username){
			userPrecisionRank=jsonData2[key][0];
			userPrecision=jsonData2[key][2];
			userPrecisionTrend=jsonData2[key][3];
		}
	}
	
	console.log(userScore,userScoreRank,userScoreTrend);
	console.log(userTask,userTaskRank,userTaskTrend);
	console.log(userPrecision,userPrecisionRank,userPrecisionTrend);
	
	//填写右侧上表
	$("#labelMyScore").text(userScore);
	$("#labelMyTask").text(userTask);
	$("#labelMyAvgPrecision").text(userPrecision);
	
	//填写排名
	$("#labelRankTdAll").text(userScoreRank);
/*	$("#labelRankTdAllTrend").text(userScoreTrend);*/
	$("#labelRankTdTask").text(userTaskRank);
/*	$("#labelRankTdTaskTrend").text(userTaskTrend);*/
	$("#labelRankTdPrecision").text(userPrecisionRank);
/*	$("#labelRankTdPrecisionTrend").text(userTaskTrend);*/
	
	//填写排名趋势
	if(parseInt(userScoreTrend)==-1){
		$("#labelRankTdAllTrend").addClass("up");
	}else if(parseInt(userScoreTrend)==0){
		$("#labelRankTdAllTrend").addClass("unchanged");
	}else{
		$("#labelRankTdAllTrend").addClass("down");
	}
	
	if(parseInt(userTaskTrend)==-1){
		$("#labelRankTdTaskTrend").addClass("up");
	}else if(parseInt(userTaskTrend)==0){
		$("#labelRankTdTaskTrend").addClass("unchanged");
	}else{
		$("#labelRankTdTaskTrend").addClass("down");
	}
	
	if(parseInt(userPrecisionTrend)==-1){
		$("#labelRankTdPrecisionTrend").addClass("up");
	}else if(parseInt(userPrecisionTrend)==0){
		$("#labelRankTdPrecisionTrend").addClass("unchanged");
	}else{
		$("#labelRankTdPrecisionTrend").addClass("down");
	}
	
	//填写表头
	$(".label_userName").text(username);
	$(".label_rankBonusText").text(userScore);
}

//高亮当前用户排名背景色
function usernameHighlighter(username){
	$(".label_rankTable").find(".table_item_td_name").each(function(i,e){
		if($(this).text()==username){
			$(this).parent("tr").addClass("tr_selected");
		}
	});
}


//渲染排名数字颜色
function rankHighlighterLeft(){
	$(".table_item_td_rank").each(function(i,e){
		if($(this).text()=="1"){
			$(this).css("font-family","magneto");
			$(this).css("font-weight","900");
			$(this).css("font-size","16px");
			$(this).css("color","#ffc21d");
		}else if($(this).text()=="2"){
			$(this).css("font-family","magneto");
			$(this).css("font-weight","900");
			$(this).css("font-size","16px");
			$(this).css("color","#efe66c");
		}else if($(this).text()=="3"){
			$(this).css("font-family","magneto");
			$(this).css("font-weight","900");
			$(this).css("font-size","16px");
			$(this).css("color","#9b7210");
		}else{
			$(this).css("font-weight","900");
			$(this).css("color","#292d3e");
		}
	});
}

//渲染右侧排名数字颜色
function rankHighlighterRight(){
	var textScoreAll=$("#labelRankTdAll").text();
	var textScoreTask=$("#labelRankTdTask").text();
	var textScorePrecision=$("#labelRankTdPrecision").text();
	
	if(textScoreAll=="1"){
		$("#labelRankTdAll").css("color","#ffc21d");
	}else if(textScoreAll=="2"){
		$("#labelRankTdAll").css("color","#efe66c");
	}else if(textScoreAll=="3"){
		$("#labelRankTdAll").css("color","#9b7210");
	}else{
		$("#labelRankTdAll").css("color","#292d3e");
	}
	
	if(textScoreTask=="1"){
		$("#labelRankTdTask").css("color","#ffc21d");
	}else if(textScoreTask=="2"){
		$("#labelRankTdTask").css("color","#efe66c");
	}else if(textScoreTask=="3"){
		$("#labelRankTdTask").css("color","#9b7210");
	}else{
		$("#labelRankTdTask").css("color","#292d3e");
	}
	
	if(textScorePrecision=="1"){
		$("#labelRankTdPrecision").css("color","#ffc21d");
	}else if(textScorePrecision=="2"){
		$("#labelRankTdPrecision").css("color","#efe66c");
	}else if(textScorePrecision=="3"){
		$("#labelRankTdPrecision").css("color","#9b7210");
	}else{
		$("#labelRankTdPrecision").css("color","#292d3e");
	}
}

function changeFontAndHighlightUsername(username){
	usernameHighlighter(username);
	rankHighlighterLeft();
	rankHighlighterRight();
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

//绑定事件
function listenEvents(username,jsonData,jsonData1,jsonData2){
	rankTypeSelector(username,jsonData,jsonData1,jsonData2);
}

//Entry
$(document).ready(function(){
	addGadgets();
	renderRightTable("hzzhangjingjing",testDataAll,testDataTask,testDataPrecision);
	renderRankTable(testDataAll,currentPageNum);
	renderPaginator(testDataAll,currentPageNum);
	$(".label_rank_paginator_prev").unbind();
	$(".label_rank_paginator_next").unbind();
	paginator("hzzhangjingjing",testDataAll);
	listenEvents("hzzhangjingjing",testDataAll,testDataTask,testDataPrecision);
});



