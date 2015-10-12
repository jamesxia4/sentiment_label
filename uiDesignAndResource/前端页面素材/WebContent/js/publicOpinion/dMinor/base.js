var BaseUtil = window.BaseUtil || {};

/**resize
 *
 * 脚本设置主区域高度
 * modified by ljjn1246 20150518
 *
 * ***/
BaseUtil.mainContentResize = function() {
//	var W = $(window).width();
	var H = $(window).height(),
	menu_height = $("#sub_func_menu").height(),//主菜单
    bottom_height =$('#body_layout_south').height();//页尾

    var barHeight=menu_height+bottom_height;// 页尾+页首

	if (H - barHeight > 500) { // 不致于高度过小
		$("#main_content").css({'min-height': (H - barHeight) +'px'});
	}

	if ($("#main_content").height() < menu_height) {
		$("#main_content").css({'min-height': menu_height +'px'});
	}
};

window.onresize = function(event) {
	BaseUtil.mainContentResize();
};

window.onload = function() {
	BaseUtil.mainContentResize();
};

BaseUtil.smartCompare = function(s1, s2) {
	if (s1 == null && s2 == null) {
		return 0;
	} else if (s1 == null) {
		return -1;
	} else if (s2 == null) {
		return 1;
	}

	if (! isNaN(s1) && ! isNaN(s2)) {
		return parseFloat(s1) - parseFloat(s2);
	} else if (! isNaN(s1)) {
		return -1;
	} else if (! isNaN(s2)) {
		return 1;
	}

	var a = s1, b = s2;
	var idx1 = -1, idx2 = -1;
	idx1 = (s1[0] == "-") ? s1.substring(1).indexOf("-") : s1.indexOf("-");
	idx2 = (s2[0] == "-") ? s2.substring(1).indexOf("-") : s2.indexOf("-");

	if (idx1 > 0) {
		a = s1.substring(0, idx1);
	}
	if (idx2 > 0) {
		b = s2.substring(0, idx2);
	}

	if (! isNaN(a) && ! isNaN(b)) {
		a = parseFloat(a);
		b = parseFloat(b);

		if (a == b) {
			return s1.substring( idx1 < 0 ? 0 : idx1 ).localeCompare( s2.substring( idx2 < 0 ? 0 : idx2 ) );
		} else {
			return a - b;
		}
	}

    var numReg = /\d+/g;
    // 针对留存/流失序列的排序逻辑
    if ((s1.indexOf("留存") >= 0 || s1.indexOf("流失") >= 0) && (s2.indexOf("留存") >= 0 || s2.indexOf("流失") >= 0)) {
        if (s1.indexOf("次日") >= 0) return -1;
        if (s2.indexOf("次日") >= 0) return 1;
        var d1 = null, d2 = null;
        var m1 = s1.match(numReg);
        if (m1 != null) {
            d1 = m1[0];
        }
        var m2 = s2.match(numReg);
        if (m2 != null) {
            d2 = m2[0];
        }
        if (d1 == d2 == null) return 0;
        if (d1 == null) return -1;
        if (d2 == null) return 1;
        return parseFloat(d1) - parseFloat(d2);
    }

    var tdReg = /\D*\d+\D*/g;
    if (s1.match(tdReg) && s2.match(tdReg)) {
        var td_1 = BaseUtil.splitTextAndDigital(s1.replace(" ", ""));
        var td_2 = BaseUtil.splitTextAndDigital(s2.replace(" ", ""));
        var i = 0;
        while (i < td_1.length && i < td_2.length) {
            if (!isNaN(td_1[i]) && !isNaN(td_2[i])) {
                if (parseFloat(td_1[i]) < parseFloat(td_2[i])) return -1;
                if (parseFloat(td_1[i]) > parseFloat(td_2[i])) return 1;
            } else {
                if (td_1[i] < td_2[i]) return -1;
                if (td_1[i] > td_2[i]) return 1;
            }
            i++;
        }
        return td_1.length - td_2.length;
    }

	return s1.localeCompare(s2);
};

/**
 * 将字符串按数字分割为若干字符
 * @param str
 * @returns {*}
 */
BaseUtil.splitTextAndDigital = function(str) {
    var reg = /\d+/g;
    var m = str.match(reg);
    if (m == null || m.length === 0) return [str];
    var result = [];
    var s = str;
    for (var i = 0 ; i < m.length ; i++) {
        var index = s.indexOf(m[i]);
        if (index > 0) result.push(s.substring(0, index));
        result.push(m[i]);
        s = s.substring(index + m[i].length)
    }
    if (s != "") {
        result.push(s);
    }
    return result;
}

BaseUtil.TestCase = {
    retention: ["2日留存","20日留存","30日留存","10日留存", "3日留存", "次日留存"],
    retention_1: ["第2日留存","第20日留存","第30日留存","第10日留存", "第3日留存", "次日留存"],
    lost: ["2日流失","20日流失","30日流失","10日流失", "3日流失", "次日流失"],
    lost_1: ["第2日流失","第20日流失","第30日流失","第10日流失", "第3日流失", "次日流失"],
    td: ["第1章","第2章","第11章","第3章"],
    td_1: ["第1章第2节","第1章第13节","第2章第5节","第2章第12节"],
    td_2: ["第 1章","第 2章","第11章","第 3章"],
    td_3: ["10~19级", "110-119级","20~29级", "100-109级"],
    td_4: ["关卡2",  "章节1", "章节2", "关卡1", "关卡13", "章节13"]
}

BaseUtil.FormatNumberWithCommas = function(x) {
	if (isNaN(x) || ! x) return x; // 如果不是数字，直接返回原值

	// 解决小数部分数字添加千分位逗号问题
	var ss = x.toString().split('.');
	if (ss.length == 2) {
		// Modified by ccn1069: <0.01的小数部分保留两位有效数字
        // 算法：将小数部分以0为边界转换为float，利用toFixed四舍五入保留2位数字，再补0转换回原来的小数部分
        if (parseFloat(x) < 0.01) {
		    var tmpStr = ss[1];
            var sFraction = parseFloat(("0." + tmpStr)).toFixed(2).replace("0.", "");    // 直接保留2位小数的结果
            var nZeroCount = 0; // 小数部分有效0的个数
            var sTmp = "";
            for(var i = 0; i < tmpStr.length; i++){
                if(tmpStr[i] != "0") {
                    sTmp += "." + tmpStr.substring(i);
                    break;
                }
                nZeroCount++;
            }
            sTmp = parseFloat(sTmp).toFixed(2).toString().replace(/0*$/, "").replace("0.", "");
            // 补0
            for(var i = 0; i < nZeroCount; i++){
                sTmp = "0" + sTmp;
            }
            // 如果计算的结果与直接保留2位小数的结果会一致，则使用直接保留2位小数的结果
            sFraction = (parseFloat("0." + sFraction) == parseFloat("0." + sTmp) ? sFraction: sTmp);
		    return ss[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +"." + sFraction;
        } else {
            ss = parseFloat(x).toFixed(2).toString().split('.');
            return ss[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + ss[1];
        }
	}

    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

BaseUtil.FormatNumberWithPostfix = function(x, base, postfix){
	if (isNaN(x) || ! x) return x; // 如果不是数字，直接返回原值
	if(Math.abs(x) / base < 1){
		return BaseUtil.FormatNumberWithCommas(x);
	}else{
		x = Math.round(x / base);
		return BaseUtil.FormatNumberWithCommas(x) + postfix;
	}
};

BaseUtil.FormatNumberWithOptionalPostfix = function(x, bases, postfixes){
	if (isNaN(x) || ! x) return x; // 如果不是数字，直接返回原值
	for(var i=bases.length-1; i>=0; i--){
		if(Math.abs(x) / bases[i] >= 1){
			x = Math.round(x / bases[i]);
			return BaseUtil.FormatNumberWithCommas(x) + postfixes[i];
		}
	}
	return BaseUtil.FormatNumberWithCommas(x);
};

BaseUtil.FormatNumberWithPostfixByThreshold = function(x, bases, postfixes, thresholds){
	if (isNaN(x) || ! x) return x; // 如果不是数字，直接返回原值
	for(var i=bases.length-1; i>=0; i--){
		if(Math.abs(x) >= thresholds[i]){
			x = Math.round(x / bases[i]);
			return BaseUtil.FormatNumberWithCommas(x) + postfixes[i];
		}
	}
	return BaseUtil.FormatNumberWithCommas(x);
};

//计算一个数组的平均值
BaseUtil.ComputeAvg = function (arr) {
	var j = 0;
	for ( var i = 0; i < arr.length; i++ ) {
		j += parseFloat(arr[i]);
	}
	return Math.round(j/arr.length,2);
}

BaseUtil.FormatNumberToPercent = function(x, fix) {
	if (isNaN(x)) return x;
	if (fix !== undefined) {
		return (parseFloat(x) * 100).toFixed(fix) + "%";
	}
    return parseFloat(x) * 100 + "%";
};

BaseUtil.initTips = function() {
	//动画时间
	var animateTime = 300;
	//浮层出现位置在tip trigger上方多少像素
	var upDis = 35;
	//浮层出现位置在tip trigger右方多少像素
	var rightDis = 12;

	$('.tip').each(function(index, trigger) {
		//console.log($(trigger));
		$(trigger).val('');

		if ($(this).next().html().length == 0) {
			$(this).hide();
			return;
		}

		$(trigger).bind('click', function(e) {

//			var posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft + rightDis;
//			var posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - upDis;

			var selectState = $(this).val();

			if(selectState == '') {
				$(this).val('selected');
//				$(this).next().css({'position':'absolute',  'left':posx + 'px','top':posy + 'px'});
				$(this).next().show().position({my:"left top", at:"right+13 top-10", of:$(this)});
//				$(this).next().slideDown(animateTime);
			}
			else if(selectState == 'selected') {
				$(this).val('');
				$(this).next().hide();
//				$(this).next().slideUp(animateTime);
			}
		});
		//绑定
		$(document).bind('click',  function(e) {
            //length == 0 说明点击位置和trigger与tips浮层不是从属关系，此时隐藏表单。
            if($(e.target).closest($(trigger)).length == 0 &&
                $(e.target).closest($(trigger).next()).length == 0) {
            	$(trigger).next().hide();
//                $(trigger).next().slideUp(animateTime);
            	$(trigger).val('');
            }
        });
	});
};

//初始化日期控件
BaseUtil.dateInit = function(callback) {
	// 重要TODO！当日期不是区间时，设置addQuickSelect:false。这是临时解决日期非区间，但addQuickSelect选择成区间的bug
	var val = $('#main_content div.indicator_header div.content .classDatepicker').val();

	// 日期控件初始化
	var options = {
	    addQuickSelect : false,
        needCompare : false,
        isEnglishVersion: false,
	    success : function(obj) {
	        $("#"+this.datePickerHandlerId).val(obj.startDate+","+obj.endDate);
	        console.log(this.datePickerHandlerId, obj, $("#"+this.datePickerHandlerId).val());
	        if (callback) callback();
	    }
	};
	$('#main_content div.indicator_header div.content .classDatepicker').gdasDatePicker(options);
};

// 延时调研
BaseUtil.delayCall = (function(){
	var timer = 0;
	return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();

/************** 菜单 *************/
/******************************************************************************************************************/
/*menu new*/
function menuModule($handler, jsonArray, storeUpArray) {
	this.$handler = $handler;
	// 区分是否是数据应用模块的菜单
	if(jsonArray.length > 0 && jsonArray[0] == "comment"){
		this.jsonArray = jsonArray[1];
		this.isComment = true;
	}
	else{
		this.jsonArray = jsonArray;
		this.isComment = false;
	}
	this.storeUpArray = storeUpArray;

	this.Init();
};

/**
 * 判断key是否符合target的搜索条件：
 * 1.key是target的一部分
 * 2.key是target拼音的一部分
 * 3.key是target的拼音首字母的一部分
 * @param key
 * @param target
 * @returns {boolean}
 */
menuModule.matchKeyAndPinyin =function(key,target){
    key =key.trim();
    if (target.indexOf(key)>-1) return true;//全包含

    //下面判断拼音
    var pinyin = new JSPinyin();//js/pinyin/JSpinyin.js，支持全拼以及首字母
    var camel=pinyin.getCamelChars(target).toLowerCase();
    var pinyinChar=pinyin.getFullChars(target).toLowerCase();
    return camel.indexOf(key.toLowerCase())>-1 || pinyinChar.indexOf(key.toLowerCase())>-1;
}


menuModule.prototype.Init = function() {
	this.RenderHTML();
	// 区分是否是数据应用模块的菜单
	if(this.isComment){
		this.BindingCommentSearchBarEvent();
	}
	else{
		this.BindingSearchBarEvent();
	}
	this.BindingEvent();
};

menuModule.prototype.IsStoreUp = function(subjectObj) {
	return subjectObj.text == '我的收藏';
};

menuModule.prototype.RenderHTML = function() {
	var html = [];

	// 区分是否是数据应用模块的菜单
	if(this.isComment){
		html.push("<div class='searchBar'><input name='searchreport' placeholder='"+i18n['search_game']+"'></div>");
		html.push(this.RenderCommentMenuHTML());
	}
	else{
		html.push("<div class='searchBar'><input name='searchreport' placeholder='"+i18n['search']+"'></div>");
		html.push(this.RenderMenuHTML());
	}

	this.$handler.append(html.join(''));

    var delegateToLinkClick = function(e){
        e.stopPropagation();
        if(e.target.tagName !=='A'){//当前触发事件的节点不是a,则按照href值跳转
            window.location = $(this).find("a").first().attr('href');
        }
    };

    this.$handler.find(".menuItem  .title").off("click").on("click",delegateToLinkClick);//绑定menu item 的click事件为跳转事件

};


menuModule.prototype.RenderMenuHTML = function() {
    /**
     * added by ljjn1246
     * 计算menu中有多少个页面是配置了parentPageId（子页面）的数量
     * @param menu
     * @returns {number}
     */
    var countChildrenPage = function(menu){
        var c = 0;
        $.each(menu.children,function(i,item){
            if(item['parentPageId'] >=0)c++;
        });
        return c;
    }

	var html = [];
	var thisObj = this;
	$.each(this.jsonArray, function(i, e) {
		//console.log(i, e);
		var is_storeup = thisObj.IsStoreUp(e);
		if (e.children.length -countChildrenPage(e) == 1 && ! is_storeup) {
			html.push(thisObj.RenderMenuItemsHTML(e.children));
		} else {
			html.push('<div onselectstart="return false" class="menuSubject menuClose '+(is_storeup ? "menuStoreUp" : "")+'" data-subjectid="'+e.id+'">');
				//html.push('<span class="bullet"></span>');
                html.push('<span class="switch"></span>');
				html.push('<span class="title" title="'+e.text+'">'+e.text+'</span>');

			html.push('</div>');
			html.push('<div class="menuList menuClose '+(is_storeup ? "menuStoreUp" : "")+'">');
				html.push(thisObj.RenderMenuItemsHTML(e.children));
			html.push('</div>');
			if(is_storeup){
				html.push("<div class='menuDivider'></div>");
			}
		}

	});

	return html.join('');
};

/**
 * 数据应用部分菜单: 显示有权限的subject, 隐藏没有权限的subject, 便于进行检索.
 * Add by Rao Junyang @ 2014-09-03
 */
menuModule.prototype.RenderCommentMenuHTML = function() {
	var html = [];
	var thisObj = this;
	$.each(this.jsonArray, function(i, e) {
		// 只显示有权限的
		if(e.flag == 1){
			//console.log(i, e);
			var is_storeup = thisObj.IsStoreUp(e);
			if (e.children.length == 1 && ! is_storeup) {
				html.push(thisObj.RenderMenuItemsHTML(e.children));
			} else {
				html.push('<div onselectstart="return false" class="menuSubject menuClose '+(is_storeup ? "menuStoreUp" : "")+'" data-subjectid="'+e.id+'">');
					//html.push('<span class="bullet"></span>');
                    html.push('<span class="switch"></span>');
					html.push('<span class="title" title="'+e.text+'" games="' + e.games + '" flag="' + e.flag + '">'+e.text+'</span>');

				html.push('</div>');
				html.push('<div class="menuList menuClose '+(is_storeup ? "menuStoreUp" : "")+'">');
					html.push(thisObj.RenderMenuItemsHTML(e.children));
				html.push('</div>');
			}
		}
		else{
			html.push('<div onselectstart="return false" class="menuSubject" data-subjectid="'+e.id+'" style="display:none">');
				//html.push('<span class="bullet"></span>');
                html.push('<span class="switch"></span>');
                html.push('<span class="title" title="'+e.text+'" games="' + e.games + '" flag="' + e.flag + '">'+e.text+'</span>');

			html.push('</div>');
		}

	});

	return html.join('');
};

menuModule.prototype.RenderMenuItemsHTML = function(itemArray) {
	var html = [];
	$.each(itemArray, function(i, e) {
        if(e['parentPageId'] === undefined){//没有配置父页面，则渲染
            if(e['isParent']==='true'){//MobileGameMeta决定了是父页面,则尝试从text这个合并的title中渲染正确语言版本的title
                var title = e.text.split('|');
                var titleIndex = title.length>1&&GDAS.isEnglishVersion ?1:0;
                e.text = title[titleIndex];
            }
            html.push('<div onselectstart="return false" class="menuItem" data-fieldid="'+e.id+'">');
                //html.push('<span class="bullet"></span>');
                html.push('<span class="switch"></span>');
                html.push('<span class="title" title="'+e.text+'" >'+'<a href=\''+e.href+'\' target="_top">'+e.text+'</a>'+(this['isNew'] ==='true'? '<span class="newMarker">&#xe60e;</span>':'')+'</span>');

            html.push('</div>');
        }
	});

	return html.join('');
};



menuModule.prototype.BindingSearchBarEvent = function() {
	var $searchResult, $curren_span;

    $("#subject_field_menu .searchBar input" ).focus(function() {
         if (! $(this).next().hasClass("searchResult" )) {
            $( this).after("<div class='searchResult'></div>");
        }
        var $tmp = $( this).next();
         if ($tmp.find("span" ).size() == 0) {
            $tmp.html( "<p>"+i18n['search_key']+"</p>" );
        }
        $tmp.show();
    }).keyup(function(event) {
       event.preventDefault();

        $searchResult = $(this).next(); // .searchResult
        $curren_span = $searchResult.find("span.selected");

        if (event.which == 40) { // down
        	$curren_span.removeClass("selected");
        	if ($curren_span.next().is("span")) {
        		$curren_span.next().addClass("selected");
        	} else {
        		$searchResult.find("span:eq(0)").addClass("selected");
        	}
        } else if (event.which == 38) { // up
        	$curren_span.removeClass("selected");
        	if ($curren_span.prev().is("span")) {
        		$curren_span.prev().addClass("selected");
        	} else {
        		$searchResult.find("span:last-child").addClass("selected");
        	}

        } else if (event.which == 13 && $curren_span.length > 0) { // enter
        	window.location.href = $curren_span.find("a").attr("href");
        } else {
        	var val = $(this ).val(), $handler = $(this).next();
            $handler.empty();
            $handler.html( "<p>"+i18n['empty_search_result']+"</p>" );

             if (val && val.length > 0) {
                 var cnt = 0;
                $( ".menuItem span.title").each(function(index, element) {
                     var fieldnamecn = $(element).attr("title");
                     if (cnt < 10 && fieldnamecn && menuModule.matchKeyAndPinyin(val,fieldnamecn)) {
                         if (cnt == 0) {
                            $handler.html( "<p>"+i18n['search_result']+"</p>" );
                        } else if (cnt == 9) {
                            $handler.find( "p").html(i18n['search_result_first_ten'] );
                        }
                        cnt = cnt + 1;
                        if (cnt == 1) {
	                        $(element).clone().addClass("selected").appendTo($handler);
                        } else {
	                        $(element).clone().appendTo($handler);
                        }
                    };
                });

            }
            $handler.position({
                my: 'left top',
                at: 'left bottom',
                of: $(this)
            });
        }
    }


    );

    $( document ).click( function(event){
         var $target = event && event.target && $( event.target );
         if( $target.closest( ".searchResult, .searchBar" ).size() == 0){
            $( ".searchResult").hide();
        }

    });
};

/**
 * 数据应用部分搜索框: 检索一级目录, 同时检索该一级目录对应组所包含的所有游戏.
 * 显示结果用红色标示没有权限的一级目录, 且没有超链接. 点击检索结果，跳转至该一级目录下的第一个二级目录.
 * Add by Rao Junyang @ 2014-09-03
 */
menuModule.prototype.BindingCommentSearchBarEvent = function() {
	var $searchResult, $curren_span;

	$(".searchBar input" ).focus(function() {
		if (! $(this).next().hasClass("searchResult" )) {
			$( this).after("<div class='searchResult'></div>");
		}
		var $tmp = $( this).next();
		if ($tmp.find("span" ).size() == 0) {
			$tmp.html( "<p>"+i18n['search_key']+"</p>" );
		}
		$tmp.show();
	}).keyup(function(event) {
		event.preventDefault();

		$searchResult = $(this).next(); // .searchResult
		$curren_span = $searchResult.find("span.selected");

		if (event.which == 40) { // down
			$curren_span.removeClass("selected");
			if ($curren_span.next().is("span")) {
				$curren_span.next().addClass("selected");
			} else {
				$searchResult.find("span:eq(0)").addClass("selected");
			}
		} else if (event.which == 38) { // up
			$curren_span.removeClass("selected");
			if ($curren_span.prev().is("span")) {
				$curren_span.prev().addClass("selected");
			} else {
				$searchResult.find("span:last-child").addClass("selected");
			}

		} else if (event.which == 13 && $curren_span.length > 0) { // enter
			if($curren_span.find("a").size() > 0){
				window.location.href = $curren_span.find("a").attr("href");
			}
		} else {
			var val = $(this ).val(), $handler = $(this).next();
			$handler.empty();
			$handler.html( "<p>"+i18n['empty_search_result']+"</p>" );

			if (val && val.length > 0) {
				var cnt = 0;
				// 检索一级目录
				$(".menuSubject span.title").each(function(index, element) {
					var fieldnamecn = $(element).attr("title") + " " + $(element).attr("games");


					if (cnt < 10 && fieldnamecn && menuModule.matchKeyAndPinyin(val,fieldnamecn)) {
						if (cnt == 0) {
							$handler.html( "<p>"+i18n['search_result_including_unauth']+"</p>" );
						} else if (cnt == 9) {
							$handler.find( "p").html(i18n['search_result_including_unauth_first_10']);
						}
						cnt = cnt + 1;

						// 设置超链接: 找到本级menuSubject的下一个menuList中title的span, 即使用group的第一个子菜单的超链接
						// 说明: 每个menuSubject必然有menuList, 否则直接展示了menuItem, 而不会有menuSubject, 而检索的是menuSubject
						var tips = "<font size='1px'>在<b>" + $(element).attr("title").replace(/舆情监控/, "") + "</b>分类下搜索</font>";
						if($(element).attr("flag") == "1"){
							var href = "";
							if($(element).parent().next().find("span.title").size() > 0){
								href = $(element).parent().next().find("span.title:eq(0)").children("a").attr("href");
							}

							// 抽取被检索结果的game_id，便于直接展示该游戏的舆情简报
							// Add by Rao Junyang @ 2014-11-10
							var ind = fieldnamecn.indexOf(val);
							var endInd = fieldnamecn.indexOf(" ", ind);
							endInd = endInd == -1 ? fieldnamecn.length : endInd;
							var startInd = endInd - 1;
							while(startInd > ind && fieldnamecn.charAt(startInd)-'0' >= 0 && fieldnamecn.charAt(startInd)-'0' <= 9)
								startInd--;
							if(startInd > ind && fieldnamecn.charAt(startInd) == ':'){
								var game_id = fieldnamecn.substring(startInd+1, endInd);
								href += "&game_id=" + game_id;
							}

							// 设置元素属性
							if (cnt == 1) {
								$(element).clone().addClass("selected").html("<a href=\'"+href+"\' target=\'_top\'>"+tips+"</a>").appendTo($handler);
							} else {
								$(element).clone().html("<a href=\'"+href+"\' target=\'_top\'>"+tips+"</a>").appendTo($handler);
							}
						}
						else{
							if (cnt == 1) {
								$(element).clone().addClass("selected").attr("style", "color:red").html(tips).appendTo($handler);
							} else {
								$(element).clone().attr("style", "color:red").html(tips).appendTo($handler);
							}
						}
					};
				});

			}
			$handler.position({
				my: 'left top',
				at: 'left bottom',
				of: $(this)
			});
		}
	});

	$( document ).click( function(event){
		var $target = event && event.target && $( event.target );
		if( $target.closest( ".searchResult, .searchBar" ).size() == 0){
			$( ".searchResult").hide();
		}

	});

};

menuModule.prototype.BindingEvent = function() {
	$(".menuSubject").click(function(e) {
		e.preventDefault();

		if ($(this).hasClass("menuClose")) {
			$(this).next(".menuList").slideDown(180);
			$(this).removeClass("menuClose");
			$(this).removeClass("current");
			$(this).next(".menuList").removeClass("menuClose");
			$(this).siblings(".menuSubject").each(function(i,e){
				if(!$(e).hasClass("menuClose")){
					$(e).trigger("click");
				}
			})
		} else {
			$(this).next(".menuList").slideUp(180);
			$(this).addClass("menuClose");
			$(this).next(".menuList").addClass("menuClose");
			var hasSelectedItem = false;
			$(this).next(".menuList").find(".menuItem").each(function(i,e){
				if($(e).hasClass("active")){
					hasSelectedItem = true;
					return;
				}
			});
			if(hasSelectedItem){
				$(this).addClass("current");
			}
		}
	});

	$(".menuStoreUp .menuItem span.switch").click(function(e) {
		e.preventDefault();
		if (confirm("你正在删除该收藏，是否继续？")) {
			$thisParentObj = $(this).parent();
			var id = $(this).parent().attr("data-fieldid");
			$.ajax({
				url: contextPath + "/JspOfCommon/storeUp.jsp",
				data: {"op": "delete", "id": id},
				error: function(xhr, message, e) {
					console.log("ERR:",xhr, message, e, xhr.responseText);
					alert("出错了！");
				},
				success:function(r) {
					if (r && r.flag) {
						$thisParentObj.remove();
                        //如果删除了一个玩家级收藏项，则重载页面
                        if(window.location.href.indexOf("gdas/player/index.jsp?storeUpId=") !== -1){
                            window.location.href = contextPath +"/player/";
                        }
					}
				}
			});
		}
	}).hover(function(e) {
		$(this).attr("title", "删除该收藏");
	});;
};

menuModule.prototype.SetSelected = function(id) {
	var is_find = false;
	$(".menuItem").each(function(i, e) {
		if ($(e).attr("data-fieldid") == id && ! is_find) {
			if ($(e).parent().hasClass("menuList")) {
				$(e).parent().removeClass("menuClose");
				$(e).parent().prev().removeClass("menuClose");
			}
			is_find = true;
			$(e).addClass("active");
		}
	});
};

menuModule.prototype.AppendGameVersion = function(version_string, gameName) {
	if (version_string.length > 0) {
		console.log(version_string, gameName);
		var ss = version_string.split(',');
		var html = ['<select id="game_version_select">'];
			for (var i = 0; i < ss.length; i=i+2) {
				html.push('<option value="'+ss[0]+'__'+ss[i]+'">' + ss[i+1] + '</option>');
			}
		html.push('</select>');

		$("#subject_field_menu .searchBar").before(html.join(''));

		$("#game_version_select option[value='"+gameName+"']").attr("selected", true);

		$("#game_version_select").change(function(event) {
			var val = $(this).val();
			event.preventDefault();
			$.ajax({
				url: contextPath + "/JspOfCommon/ajaxSetGameVersion.jsp",
				data: {"gameVersion": val},
				error: function(xhr, message, obj) {
					console.log(xhr, message, obj, xhr.responseText);
				},
				success: function(r) {
					console.log('set game version success', r);
					window.location.reload();
				}
			});
		});
	}
};