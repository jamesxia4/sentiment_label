/**
 * P.S. 引用本文件之前必须先引用DataApp.js
 * 
 * 本子类用于游戏评论应用的渲染与事件绑定
 */


function WordCloudApp() {
	DataApp.call(this); // 继承属性，例如this.options
}

WordCloudApp.prototype = new DataApp(); // 继承方法

// 初始化关键词搜索游戏评论输入框
WordCloudApp.prototype.SearchComments = function(keyword, url) {
	$('#heat_word_search_result_div').show();
	var thisObj = this;
//	var keyword = $("#heat_word_search_input").val();
	
	var json = thisObj.getParameterObject($handler);
	json.op = "table";
	json.keyword = keyword;
	
	console.log("search comments json", json);
	$("#heat_word_search_tips").text("");
	
	block();
	ajaxRequest(url, json, function(result) {
		console.log("search comments result", result);
		unBlock();
		$("#heat_word_search_tips").text(result.table.tips);
		//获取热词关键字
		var keyword = $("#heat_word_search_tips").text();
		keyword = keyword.substr(keyword.lastIndexOf("：")+1);
		if(keyword.indexOf("，")!=-1)
			keyword = keyword.split("，")[0];
		keyword = keyword=="[空]"?"":keyword;
//		alert(keyword);
		thisObj.TableRender($("#heat_word_search_result"), result.table, {
	        "aoColumnDefs": [
	                         {"sWidth": "60px", "aTargets": [0,1,2] },
	                         {
	                        	 "sWidth": "250px", 
	                        	 "aTargets": [3] ,
	                        	 "mRender" :function(value,type,full){
	                        		 if(keyword&&keyword.length>0){
	                        			 for(var i = 0; i < keyword.length; ++i){
	                        				 if(keyword[i] == ' ')continue;
	                        				 var reg = new RegExp(keyword[i], "ig");
	                        				 value = value.replace(reg,"<font color='#C00000'>" + keyword[i] + "</font>");
	                        			 }
	                        		 }
	                        		 return value;
	                        	 }
	                         },
	                         {
	                        	 "aTargets": [4] ,
	                        	 "mRender" :function(value,type,full){
	                        		 if(keyword&&keyword.length>0){
	                        			 for(var i = 0; i < keyword.length; ++i){
	                        				 if(keyword[i] == ' ')continue;
	                        				 var reg = new RegExp(keyword[i], "ig");
	                        				 value = value.replace(reg,"<font color='#C00000'>" + keyword[i] + "</font>");
	                        			 }
	                        		 }
	                        		 return value;
	                        	 }
	                         },
							 {
							    "mRender": function(value, type, full) {
							        return "<a href='"+value+"'target='_blank'>查看</a><br />";
							    },
							    "sWidth": "40px", 
								"aTargets": [5]
							 }
							 ]
		});	
	}, function(xhr, message, e) {
		unBlock();
		console.log(xhr, message, e, xhr.responseText);
	});

};


//WordCloudApp.prototype.SearchCommentsInit = function() {
////	var thisObj = this;
//	$("#heat_word_search_input").keyup(function(event) {
//		if (event.keyCode == 13) {
//			WordCloudApp.prototype.SearchComments();
//		}
////		else {
////			if ($(this).val().length == 0) {
////				return false;
////			}
////			thisObj.delayCall(function() { WordCloudApp.prototype.SearchComments();}, 1000 );			
////		}	
//	});
//};

//文字云渲染函数
WordCloudApp.prototype.WordCloudRender = function($handler, result, url) {
	$handler.empty();
	
	var wordMap = {};
	$.each(result.words, function(i, e) {
		for (var i = 0; i < e.count; i++) {
			wordMap[e.word] = e.count;
		}
	});
	
	var w = $handler.width(), h = 400;	

	var obj = WordCloudApp.prototype.WordCountScale(result);

	var words = [];
	$.each(obj.words, function(i, e) {
		for (var i = 0; i < e.count; i++) {
			words.push(e.word);
		}
	});
	
	if (words.length == 0) {
		$handler.html('<div class="emptyMessage"><span>没有数据</span></div>');
	} else {		
		var fill = d3.scale.category20();
	
		var fontSize = d3.scale["log"]().range([2, 30]); // linear, log
			
		d3.layout.cloud()
			.size([ w, h ])
			.words(obj.words.map(function(d) {
					return {
						text : d.word,
						size : fontSize(d.count)
					};
				})
			)
			.rotate(function() {
				return ~~(Math.random() * 2) * 90;
			})
			.font("Impact").fontSize(function(d) {
				return d.size;
			})
			.on("end", draw).start();
		
		  function draw(words) {
			d3.select($handler[0]).append("svg").attr("width", w).attr("height", h)
					.append("g").attr("transform", "translate("+[w >> 1, h >> 1]+")").selectAll(
							"text").data(words).enter().append("text").style(
							"font-size", function(d) {
								return d.size + "px";
							}).style("font-family", "Impact").style("fill",
							function(d, i) {
								return fill(i);
							}).attr("text-anchor", "middle").attr(
							"transform",
							function(d) {
								return "translate(" + [ d.x, d.y ] + ")rotate("
										+ d.rotate + ")";
							}).text(function(d) {
						return d.text;
					});
		}	
		 
		// 点击文字触发事件
		$handler.find("text").click(function(event) {
			var val = $(this).text();
//			$("#heat_word_search_input").val(val);
			WordCloudApp.prototype.SearchComments(val, url);
		}).hover(function(event) {
			$("#word_count_tips").html($(this).text() + ' ' + wordMap[$(this).text()]).show().position({
				at: 'center center',
				my: 'left top',
				of: $(this)
			});
			
		}, function(event) {
			$("#word_count_tips").hide();
		});
//		if ($("#heat_word_search_input").val().length == 0) {
//			$("#heat_word_search_input").val($handler.find("text:eq(0)").text());
//		}	
//		$handler.find("text:eq(0)").click();
	}	
	//WordCloudApp.prototype.SearchComments();
};

// 查询
WordCloudApp.prototype.WordCloudQuery = function(url) {
	$handler = $("#main_content .indicator_basic_plot");
	var json = WordCloudApp.prototype.getParameterObject($handler);
	json.op = "plot";

	console.log("json", json);				
	
	ajaxRequest(url, json, function(result) {
		WordCloudApp.prototype.WordCloudRender($("#word_cloud"), result, url);
	});
};

WordCloudApp.prototype.WordCountScale = function(obj) {
	var words = [], min = obj.min, d = obj.max - obj.min;
	$.each(obj.words, function(i, e) {
		words.push({"word": e.word, "count": parseInt((e.count-min)/d*398+2)});
	});
	obj.words = words;
	return obj;
};

// 整体初始化
WordCloudApp.prototype.WordCloudInit = function(url, json) {
	this.options.isEnglishVersion = json.isEnglishVersion;
	this.initTips();	
	
	this.dateInit(url, json, this.WordCloudQuery);
	this.singleSelectorInit(url, json, this.WordCloudQuery);
	$('#heat_word_search_result_div').hide();
//	this.SearchCommentsInit();
};


