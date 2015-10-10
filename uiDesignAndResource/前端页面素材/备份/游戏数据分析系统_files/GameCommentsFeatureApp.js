/**
 * P.S. 引用本文件之前必须先引用DataApp.js
 * 
 * 本子类用于游戏评论应用的渲染与事件绑定
 */


function GameCommentsFeatureApp() {
	DataApp.call(this); // 继承属性，例如this.options
	
	this.name = "GameCommentsFeatureApp";
}

GameCommentsFeatureApp.prototype = new DataApp(); // 继承方法


GameCommentsFeatureApp.prototype.Init = function(url, json) {
	this.options.isEnglishVersion = json.isEnglishVersion;
	
	this.initTips();	
	
	this.dateInit(url, json, this.Query);
	this.singleSelectorInit(url, json, this.Query);
	
	var thisObj = this;
	(function()	{
		// render tabs and bind to click functions
		var columnNameLang_lst = ["百分比(%)", "数量"],
			columnName_lst = ["percent", "number"],
			$handler = $("#main_content .indicator_basic:eq(0) .tabs");
	
		if (columnNameLang_lst.length == columnName_lst.length) {
			$.each(columnNameLang_lst, function(i, o) {
				$("<a href='javascript:;' ></a>").attr("data-value",columnName_lst[i]).html(o).bind('click', function(event) {
					event.stopPropagation();
					$(this).siblings().removeClass("current");
					$(this).addClass("current");
					GameCommentsFeatureApp.prototype.SearchGameComments(url);
				}).appendTo($handler);
			});
		}
	})(url);
};

GameCommentsFeatureApp.prototype.Query = function(url) {
	console.log("debug: GameCommentsFeatureApp.prototype.Query this = ", this);
//	$("#indicator_basic_table_comments").addClass("classHidden");
//	$("#indicator_basic_plot_comments").addClass("classHidden");
	if ($("#main_content .indicator_basic .tabs a.current").size() > 0) {
		$("#main_content .indicator_basic .tabs a.current").click();
	} else {
		$("#main_content .indicator_basic .tabs a:eq(0)").click();
	}

//	// 因为要用于回调函数，所以这里使用GameCommentsFeatureApp.prototype.QueryTable
//	GameCommentsFeatureApp.prototype.QueryTable(url);	
};

//GameCommentsFeatureApp.prototype.QueryPlot = function($handler, url) {
//	var json = this.getParameterObject($handler);
//	json.op = "plot";
//	json.type = $handler.attr("data-value");
//
//	console.log("json", json);				
//	$that = $handler;
//	ajaxRequest(url, json, function(result) {
//		console.log("plot result", result);
//		$that.siblings().removeClass("current");
//		$that.addClass("current");
//		GameCommentsFeatureApp.prototype.Render($(".indicator_basic_plot:eq(0) .content"), result.plot);
//	});
//};

//GameCommentsFeatureApp.prototype.QueryTable = function(url) {
//	$handler = $("#main_content .indicator_basic_plot");
//	var json = this.getParameterObject($handler);
//	json.op = "table";
//	
//	console.log("json", json);				
//	
//	ajaxRequest(url, json, function(result) {
//		console.log("table result", result);
//		GameCommentsFeatureApp.prototype.TableRender($(".indicator_basic_table:eq(0) .content"), result.table);
//	});
//};

// 搜索原始评论
GameCommentsFeatureApp.prototype.SearchGameComments = function(/*type, game*/url) {
	$handler = $("#main_content .indicator_basic_plot");
	var json = this.getParameterObject($handler);
	json.op = "plot_table";
//	json.filter_type = type;
//	json.filter_game = game;
	json.type = $("#main_content .indicator_basic:eq(0) .tabs a.current").attr("data-value");
	console.log('search comments json', json);				
	
	var thisObj = this;
    var fSuccess=function(result) {
        console.log("search comments result", result);
        unBlock();
//		$("#indicator_basic_table_comments").removeClass("classHidden");
//		$("#indicator_basic_plot_comments").removeClass("classHidden");
        $("#indicator_basic_plot_comments .classTips").html(result.plot.tips);
        $("#indicator_basic_table_comments .classTips").html(result.table.tips);

        thisObj.PlotRender($("#indicator_basic_plot_comments .content"), result.plot);
        thisObj.gameCommentsTableRender($("#indicator_basic_table_comments .content"), result.table);

        // 滚动屏幕
        $(".indicator_basic_table").css({"min-height":"0px"});
        $("body").animate({scrollTop: $('#indicator_basic_plot_comments').offset().top-50}, 1000);
    };

/*	block();
	ajaxRequest("GameCommentsFeatureDataSearch.jsp", json,fSuccess);*/

    //重构为异步不阻塞页面
    this.ajaxManager.abortAllAndNonBlockAjax($(".indicator_basic .content"), url, json,fSuccess);
};

//GameCommentsFeatureApp.prototype.Render = function($handler, obj) {
//	$handler.empty();
//	
//	if (obj.series && obj.series.length == 0) {
//		var html = ['<div class="emptyMessage">'];
//		if (this.options.isEnglishVersion) {
//			html.push("<span>No data found</span>");
//			if (obj.options && obj.options['emptyTipsEN']) {
//				html.push("<span>"+obj.options['emptyTipsEN']+"</span>");
//			}
//		} else {
//			html.push("<span>没有数据</span>");
//			if (obj.options && obj.options['emptyTips']) {
//				html.push("<span>"+obj.options['emptyTips']+"</span>");
//			}
//		}
//		html.push('</div>');
//		$handler.html(html.join(''));
//		console.log("obj", obj);
//		return;
//	}
//		
//	// general plot
//	var _step = parseInt((obj.categories.length + 29) / 30);
//	var _rotation = (obj.categories.length > 5) ? -45 : 0;
//	//var _gameName = obj.gameName;
//	
//	var options = {
//			chart:{
//				renderTo:"",
//				zoomType:'xy',
//				type : obj.type ? obj.type : null
//			},
//			credits:{
//				enabled:false
//			},
//			title:{
//				text: obj["title"],
//				margin:5,
//				style:{
//					fontSize : '14px',
//					fontWeight : 'bold',
//					fontFamily : '微软雅黑',	
//				}
//			},
//			subtitle:{
//				text: obj["subtitle"],
//				x:-20
//			},
//			xAxis : {
//				categories : obj.categories,
//				labels : {
//					step : _step,
//					rotation : _rotation,
//					align : 'right',
//					style : {
//						fontSize : '12px',
//						fontFamily : '微软雅黑, Verdana, sans-serif'
//					},
//					formatter: function() {
//						if (typeof(this.value) != 'string') return this.value;
//						var s = this.value, cnt = 0, i = 0;				
//						for (i = 0; i < this.value.length; i++) {
//							if (isChinese(this.value.substr(i, 1))) {
//								cnt += 2;
//							} else {
//								cnt += 1;
//							}
//							if (cnt >= 19) break;
//						}
//						
//						return s.substring(0,i+1);
//					}
//				}
//			},
//			yAxis:{
//					title:"", 
//					// 是否显示纵坐标小数刻度, default:false;
//					allowDecimals: obj.options && "true" == obj.options.yAxisAllowDecimals,
//					// y轴倒序, default=false;
//					reversed: obj.options && "true" == obj.options.yAxisReversed, 
//			},
//			legend : {
//				x : 10,
//				y : 10,
//				maxHeight : 64,
//				borderWidth : 0
//			},
//	        plotOptions: {
//	        	series: {
//	        		marker: {
//	        			radius: 3
//	        		},
//	        		cursor: "pointer",
////	        		events: {
////	        			click: function(e) {
////	        				var type = "0";
////	        				console.log('debug', e.point);
////	        				if (e.point.series.name.indexOf('好评') != -1) {
////	        					type = '1';
////	        				} else if (e.point.series.name.indexOf('差评') != -1) {
////	        					type = '-1';
////	        				}
////	        				var game = e.point.category;
////	        				GameCommentsFeatureApp.prototype.SearchGameComments(type, game);
////	        			}
////	        		}
//	        	},
//	        	column: {
//                    stacking: 'normal'
//                }
//	        },
//			tooltip: {                
//	            borderColor: '#666',
//	            borderWidth: 1,
//	            borderRadius: 2,
//	            backgroundColor: 'rgba(255, 255, 255, 0.7)',
//	            useHTML: true,
//	            crosshairs: {
//	                color: '#7ac943',
//	                dashStyle: 'shortdot'
//	            },
//	            shared: false
//	        },
//			exporting : {enabled: false},
//			series : obj.series
//		};
//	
//	// 如果series不超过10条线，tooltip可同时显示
//	if (obj.type && obj.type != 'line') {
//		options.tooltip.crosshairs = false;
//	}
//	
////	if (obj.series && obj.series.length <= 10) {
////		options.tooltip.shared = true;
////	} 
//	
//	// tooltip
//	options.tooltip.formatter = function() {
//		var xName = isValidDate(this.x) ? toDateDesc(this.x) : this.x;
//		
//		var s = '<div style="padding:5px;"><b>' + xName + '</b>&nbsp;&nbsp;点击查看原始评论</div><table style="width: 150px">';
//		if (this.points) {
//			$.each(this.points, function(i, point) {
//				//console.log(i, point);
//				s += '<tr><td style="padding: 2px 5px;" ><span style="color:'+point.series.color+';" >' + point.series.name + (point.key && isValidFormatDate(point.key) ? "("+point.key+")" : "") + '</span></td>' 
//				   + '<td style="text-align: right;padding-left:15px">' + Math.abs(point.y) + '</td></tr>';
//			});
//		} else {
//			s += '<tr><td style="padding: 2px 5px;" ><span style="color:'+this.series.color+';" >' + this.series.name + '</span></td>' 
//			   + '<td style="text-align: right;padding-left:15px">' + Math.abs(this.y) + (this.series.name.indexOf("百分比") != -1 ? "%" : "") + ' </td></tr>';
//		}
//        
//		s += '</table>';
//		
//		return s;
//	};
//	$handler.highcharts(options);
//
//};

GameCommentsFeatureApp.prototype.gameCommentsTableRender = function($handler, obj) {
	var keywords = obj.keys;
	this.TableRender($handler, obj, {
        "aoColumnDefs": [
                         {"sWidth": "60px", "aTargets": [0] },
                         {"sWidth": "65px", "aTargets": [1,2] },
                         {
                        	 "mRender":function(value,type,full) {
                        		 return renderHighlight(value, keywords);
                        	 },
                        	 "sWidth": "250px", 
                        	 "aTargets": [3] 
                         },
                         {
                        	 "mRender":function(value,type,full) {
                        		 return renderHighlight(value, keywords);
                        	 },
                        	 "aTargets": [4] 
                         },
						 {
						    "mRender": function(value, type, full) {
						    	if (value == '[空]') {
						    		return '无';
						    	}
						        return "<a href='"+value+"'target='_blank'>查看</a><br />";
						    },
						    "sWidth": "40px", 
							"aTargets": [5]
						 }
						 ]
	});	
};

var renderHighlight = function(value, keywords){

    if(keywords.length < 1) return value;

    var valueQueue = value.split(keywords[0]);

    var insertFirstColorHtml = "<font color='#C00000'>" + keywords[0] + "</font>";
    var firstTemQueue = [];
    for(var i = 0, j = 0; i < valueQueue.length * 2 - 1;i += 2, j++ ){
        if(valueQueue[j] != "") {
            firstTemQueue.push(valueQueue[j]);
        }
        if( i + 1 < valueQueue.length * 2 - 1 ) {
            firstTemQueue.push(insertFirstColorHtml);
        }
    }
    valueQueue = firstTemQueue;
    console.log("keywordsValue", keywords.join("','"));
    var reg = new RegExp("^<font color='#C00000'>.*<\/font>$");
//    var reg = new RegExp("<\/font>$");
    for(var i = 1; i < keywords.length; i++) {
        var temQueue = [];
        for(var j = 0; j < valueQueue.length; j++) {
            var queueStr = valueQueue[j]; //获取queue中的值
            //判断是否为渲染值
            if(queueStr.match(reg)) {
                temQueue.push(queueStr); //放回push
                continue;
            }
            var queueStrSplitList = queueStr.split(keywords[i]);
            if(queueStrSplitList == 1) {
                if(queueStrSplitList[0] != "") {
                    temQueue.push(queueStrSplitList[0]);
                }
            } else {
                var insertColorHtml = "<font color='#C00000'>" + keywords[i] + "</font>";
                for(var k = 0, h = 0; k < queueStrSplitList.length + queueStrSplitList.length - 1; k+=2, h++) {
                    if(queueStrSplitList[h] != "") {
                        temQueue.push(queueStrSplitList[h]);
                    }
                    if( k + 1 < 2 * queueStrSplitList.length - 1 ) {
                        temQueue.push(insertColorHtml);
                    }
                }
            }
        }
        valueQueue = temQueue;
    }
//    console.log("result", valueQueue.join(""));

    if(valueQueue.length != 0){
        console.log("result", valueQueue.join(""));
        return valueQueue.join("");
    } else {
        return "";
    }

}

