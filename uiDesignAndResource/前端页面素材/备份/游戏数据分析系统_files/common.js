var MILLIS_IN_DAY = 1000 * 60 * 60 * 24;
var contextPath = "/gdas";
window.isEnglishVersion = false;
var nodeColors = ["#4572a7","#7ecef4","#89c897","#cce198","#fff100","#f7b551","#ff4811","#8f82bc"];

/**
 * 应用的全局变量对象, added by ljjn1246
 */
GDAS={
    LANG_CHINESE : 'zh_CN',
    LANG_ENGLISH : 'en',
    contextPath:"/gdas",
    EMPTY_RESULT_TEXT:'[空]',//没有数据显示的文本，用于判断后台回来的数据是否[空] ljjn1246 20150614
    lang : this.LANG_CHINESE,//默认是中文
    isEnglishVersion:false,
    timeouts : [],//全局的timeout id
    setTimeout : function(code,number){
        var id =setTimeout(code,number);
        if($.inArray(id,this.timeouts)===-1)
            this.timeouts.push(id);
    },
    clearAllTimeout :function(){
        for (var i=0; i<this.timeouts.length; i++) {
            window.clearTimeout(this.timeouts[i]);//如果找不到这个id（setTimeout的回调成功够，id仍然存在于数组）,这句代码什么也不执行
        }
        this.timeouts= [];//empty the id array
    },
    setHighchartGlobal: function(){
        // highcharts全局设定
        Highcharts.setOptions({
            colors: ['#058DC7', '#f28f43', '#8bbc21', '#77a1e5', '#24CBE5', '#492970', '#910000', '#d15959', '#0d233a']
        });
    },

	/**
	 *
	 * @param $handler
	 * @param columns
	 * @param dataSet
	 * @param options
	 * @param customSettings
	 * @returns {*}
	 */
	dataTables: function($handler,columns, dataSet, options, customSettings){
		$handler.empty();//清空
		$handler.html('<table cellpadding="0" cellspacing="0" border="0" class="display"></table>');//插入table

		var $table = $handler.find('table');
		var width ;//=((1/13)*100)+"%";//按照列数计算宽度
		//console.log(width);
		//var width =120;

		console.log($handler,dataSet,columns);

		var defaultSetting={
			pageSize: 15
		}

		var settings = $.extend(true,defaultSetting,customSettings);

		var oLanguage = {
			"sLengthMenu": "每页显示 _MENU_ 条记录",
			"sZeroRecords": "抱歉， 没有找到",
			"sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
			"sInfoEmpty": "没有数据",
			"sInfoFiltered": "(从 _MAX_ 条数据中查找)",
			"sZeroRecords": "没有查找到数据",
			"sSearch": "查找:",
			"oPaginate": {
				"sFirst" :GDAS.isEnglishVersion?"first":"首页",
				"sPrevious": "`",
				"sNext": "`",
				"sLast": GDAS.isEnglishVersion?"last":"尾页",
				"sPage": "跳转至",
				"sPageEnd": "页"
			}
		};

		var sDom = '<"top"T>rt<"clear">';//http://legacy.datatables.net/usage/options#sDom
		if (dataSet && dataSet.length >settings.pageSize ) {
			sDom += '<"bottom"p>';//显示“每页显示”，多少条数据，翻页
		}

		var defaultOptions = {
			"aaData": dataSet,//数据
			"aoColumns": columns,//表头
			"oLanguage":oLanguage,
			"bSort":false,
			"sDom":sDom,
			//"sPaginationType": "full_numbers",//翻页类型
			"sPaginationType": "ellipses_input",
			"iDisplayLength": settings.pageSize,//默认每页显示,//http://stackoverflow.com/questions/2871705/how-to-change-results-per-page-value-in-datatables
			//"aLengthMenu": [[7, 15,30 ], [7, 15, 30 ]],//每页显示“XX”条记录里面1的选项
			"bAutoWidth": false,
			//"sScrollX": "100%",
			"oTableTools": {
				"sSwfPath": contextPath + "/js/DataTables/media/swf/copy_csv_xls_pdf.swf",
				"aButtons": []
			},
			"fnRowCallback":function(nRow, aData, iDisplayIndex, iDisplayIndexFull ){//每行元素的callback
				//console.log(nRow,aData,iDisplayIndex,iDisplayIndexFull);
			}
		};



		var dataTable = $table.dataTable($.extend({},defaultOptions,options));

		return dataTable;
	}

};

//***********************国际版语言处理逻辑****************************//

/**
 * ljjn1246
 * 动态引入/js/i18n/jquery.i18n.properties.js
 * 由于当前的太多页面需要引入这个最高层依赖，目前include 这个src 是在手游的commonInclude中
 * 而端游页面没有include，故检测到没有则动态include避免在多个页面多次include的重复代码
 */

if(typeof $.i18n =='undefined'){
    console.log('jquery.i18n.properties.js is not loaded , Dymatically loading the script');
    $.ajax({
        url: contextPath+'/js/i18n/jquery.i18n.properties.js',
        dataType: "script",
        async:false// 同步的include
    });
}


/**
 * 国际化对象。
 * 加载前端资源文件会往这个对象写入值
 * @type
 */
i18n={}


/**
 * 加载资源文件, 基于 jQuery.i18n.properties
 * 会把资源对应语言的值读入全局变量的对象中。
 * 如i18n.msg_hello='你好'会读入全局变量 i18n.msg_hello中
 */
function loadLangBundle(lang,fCallback){
    console.log('loading i18n resources');
    lang? lang = lang:  lang = GDAS.lang;//若传入语言，则按照语言环境加载资源，否则按照全局环境加载

    $.i18n.properties({
        name:'Messages',//资源文件的名称
        path: GDAS.contextPath+'/i18n/',//资源文件所在的目录路径
        mode:'both',//模式：变量或map
        cache:false,//是否使用cache
        language:lang,//加载的语言资源
        encoding:'UTF-8',
        callback: function() {
            console.log("load lang resource successfully, lang =" ,lang);
            if (fCallback) fCallback();
        }
    });
}


function setLang(lang) {
    console.log("Setting lang to ", lang);
    if (lang.lastIndexOf('en') === 0) lang = 'en';//只要以en开头，都当作英语，因为回来的值有可能是en-US
    window.isEnglishVersion = lang == 'en'; // 全局变量 !important 不能删除，其他地方有用到，请项目全局搜索window.isEnglishVersion

    //重构后的语言环境全局变量应该放置到GDAS全局变量中统一管理, by ljjn1246
    GDAS.isEnglishVersion = lang == GDAS.LANG_ENGLISH;
    GDAS.lang = lang;//GDAS中存储当前的语言
    loadLangBundle(GDAS.lang);//按照当前语言环境加载资源
    document.title = i18n['title'];//动态修改页面的title
}

/**
 * 初始化语言，将发送后台浏览器语言，如果后台session中的语言还没有设置，则会按照浏览器语言初始化
 */
function initLang() {
    var browserLang = jQuery.i18n.browserLang().replace('-','_');//获取浏览器语言
    console.log('initing language env, the browser lang is ' ,browserLang);
    // 获得session中的Lang
    $.ajax(
        {
            url:contextPath+"/JspOfCommon/ajaxChangeLang.jsp",
            type:"post",
            data:{"browserLang":browserLang},//浏览器语言
            async:false,//同步加载，确保语言环境设置成功,才往下执行
            success:function(r){
                //因为执行到这里时候，页面的session已经被当作中文使得很多文本初始化已结束。后台决定是否应该重新加载页面，用于处理国际化第一次加载的session问题。
                if(r.reload){
                    window.location.reload();
                }
                else{
                    setLang(r.lang);
                }
            }
        }
    );
}

// 移动数据分析GameAnalytics 切换语言
function changeLang() {
    var $handler = $("#changeLang");
    var request_lang = $handler.html() == "English" ? 'en' : 'zh_CN';
    // 修改session中的Lang
    $.ajax(
        {
            url:contextPath+"/JspOfCommon/ajaxChangeLang.jsp",
            type:"post",
            data:{"lang":request_lang},
            success:function(r){
                window.location.reload();
            }
        }
    );
}

initLang();//立刻执行，执行国际化语言初始化*/

//======================国际版语言处理逻辑=========================//

// 刷新用户的元数据及权限，并重载当前页面
function refreshUserMeta() {
    //由于后台逻辑默认会把gameName从session中去除（手游页面修改引入的代码）
    // 而玩家级及可视化页面无法像手游通过url参数等方式推导出gameName，所以对于这两个模块，特殊处理，by ljjn1246
    //判断是否当前模块为玩家级/或者可视化，若是，则告诉后端保留游戏名。
    var isPlayerOrVisual = $('#sub_func_menu a.func_player.active,#sub_func_menu a.func_report.active').length;

    $.ajax({
        url:contextPath+"/user/refreshSession.do",
        type:"post",
        data:{
            remainGameName:isPlayerOrVisual
        },
        dataType:"json",
        error: function(xhr, message, obj) {
            if (xhr.status == 401) {
                window.location.href = contextPath + "/home.jsp?targetURL=" + window.location.href;
                return;
            }
        },
        success:function(r){
            if (r.success) {
                window.location.reload();
            } else {
                console.log('refreshUserMeta failed', r);
                alert(i18n['refresh_failed']);
            }
        }
    });
}


//trick, fix multiselect bug
function fixMultiselectTrick() {
	$(".ui-multiselect-all").attr("href","javascript:void(0)");
	$(".ui-multiselect-none").attr("href","javascript:void(0)");
}

//function clearChartSet() {
//	var gdas_chart_set_selected = [];
//	$('[id^="tagplot__"]').each(function(idx, e) {
//		gdas_chart_set_selected.push(e.id);
//	});
//	
//	$.each(window.gdas_chart_set, function(idx, e) {
//		if(gdas_chart_set_selected.indexOf(idx) == -1) {
//			delete gdas_chart_set_selected[idx];
//		}
//	});
//}

function block(handler,fontSize,cssOpt) {
	if(handler){
		var style = cssOpt || { width:'20%',left:'40%',top:'40%'};
		var font = fontSize || "h1";
		if(typeof(handler) === "string"){
			if ( arguments[3] === true ) {
				$(handler).block({ message: '', overlayCSS: { backgroundColor: '#fff'}, css:style });
			} else {
				$(handler).block({ message: '<'+font+'><img src="' + contextPath + '/image/busy.gif" />正在加载...</'+font+'>', overlayCSS: { backgroundColor: '#fff'}, css:style });
			}
		} else if (handler.size && handler.size() > 0){
			if ( arguments[3] === true ) {
				handler.block({ message: '', overlayCSS: { backgroundColor: '#fff'}, css:style });
			} else {
				handler.block({ message: '<'+font+'><img src="' + contextPath + '/image/busy.gif" />正在加载...</'+font+'>', overlayCSS: { backgroundColor: '#fff'}, css:style });
			}
		} else {
			$("[name='"+handler.name+"']").block({ message: '<h1><img src="' + contextPath + '/image/busy.gif" />正在加载...</h1>', overlayCSS: { backgroundColor: '#fff'}, css:{ width:'20%',left:'40%',top:'40%'} });
		}
	} else{
		$.blockUI({ message: '<h1><img src="' + contextPath + '/image/busy.gif" />正在加载...</h1>', overlayCSS: { backgroundColor: '#fff'}, css:{ width:'20%',left:'40%',top:'40%'} }); 
	}
}

function unBlock(handler) {
	$.unblockUI();
	$(handler).removeAttr("disabled");
}



String.prototype.startWith=function(s){
	if((s==null) || (s=="") || this.length==0 || (s.length > this.length))
		return false;
	if(this.substr(0,s.length)==s)
		return true;
	else
		return false;
	return true;
};

function removeEmptyObject(data, type) {
	var i = 0;
	while (i < data.length) {
		// import: remove specific key-value
		if (data[i]["value"] == "") {
			data.splice(i, 1);
//		} else if (type != "DW" && data[i]["name"].indexOf("_") == -1) {
//			data.splice(i, 1);
		} else {
			i ++;
		}
	}
	return data;
}
	
function StringBuffer () {
	this._strings_ = new Array();
}

StringBuffer.prototype.append = function(str) {
	this._strings_.push(str);
};

StringBuffer.prototype.toString = function() {
	return this._strings_.join("");
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * added by ljjn1246
 * 格式化数字，用千分位隔开，小数点保留两位。若整数的除去.00, 若不是数字，返回"-"
 * @param n
 * @returns {XML|string|void|*}
 */
function formatNumber(n){
    if(isNaN(n)) return "-";
    return numberWithCommas(n.toFixed(2)).replace('.00','');
}

/**
 * added by ccn1069
 * 获取url参数
 * @returns {{}}
 */
function getUrlParams(){
    var oParams = {};
    var search = location.search;
    if (search.indexOf("?") != 0) return oParams;
    var aParams = search.substring(1).split("&");
    for (var i = 0; i < aParams.length; i++){
        var aOneParam = aParams[i].split("=");
        if (aOneParam.length === 2) {
            oParams[aOneParam[0]] = aOneParam[1];
        }
    }
    return oParams;
}

/**
 * 符合“第XX天”的模式
 * @param str
 * @returns {boolean}
 */
function isDisplayDatePattern(str) {
    var regx= /第\d+天/;
    return regx.test(str);
}

function isValidDate(str) {
	var date_reg = /^((((1[6-9]|[2-9]\d)\d{2})(0?[13578]|1[02])(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})(0?[13456789]|1[012])(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})0?2(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|2468][048]|[3579][26])00))0?229))$/;

    //增加一个yyyy-mm-dd的正则匹配
    var date_reg2 = /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
	return date_reg.test(str) || date_reg2.test(str);
}

function isWeekend(str) {
	if (! isValidDate(str)) return false;
	
	var s = str.substr(0,4) + '/' + str.substr(4,2) +  '/' + str.substr(6,2);
	var d = new Date(s);
	return d.getDay() == 6 || d.getDay() == 0;
}

function isValidFormatDate(str) {
	str += '';
	var s = str.replace(/-/g,"");
	return isValidDate(s) && str.length == 10;
}

function isChinese(str) {  
	var re = /[^\u4e00-\u9fa5]/;  
	if (re.test(str)) return false;  
	return true;  
}

function isContainChinese(str) {
	var flag = false;
	
	for (var i = 0; i < str.length; i++) {
		if (isChinese(str.charAt(i))) {
			flag = true;
			break;
		}
	}
	
	return flag;
}

function toDateDesc(str) {
    var s = '';
    //确保是字符串，如果是数字，没有indexOf方法，会报错
	str += '';
	if(str.indexOf("-") === 4){
        s = str;
    }else{
        s = str.substr(0,4) + '-' + str.substr(4,2) +  '-' + str.substr(6,2);
    }

	var weekday = new Date(s.replace(/-/g, "/")).getDay(); //转换为非chrome也能识别的date格式
	
	if (window.isEnglishVersion) {
		switch (weekday) {
			case 0: weekday = 'SUN';break;
			case 1: weekday = 'MON';break;
			case 2: weekday = 'TUE';break;
			case 3: weekday = 'WED';break;
			case 4: weekday = 'THU';break;
			case 5: weekday = 'FRI';break;
			case 6: weekday = 'SAT';break;
			default: weekday = '';break;
		}
	} else {
		switch (weekday) {
			case 0: weekday = '周日';break;
			case 1: weekday = '周一';break;
			case 2: weekday = '周二';break;
			case 3: weekday = '周三';break;
			case 4: weekday = '周四';break;
			case 5: weekday = '周五';break;
			case 6: weekday = '周六';break;
			default: weekday = '';break;
		}	
	}

	return s + '(' + weekday + ')';
}

function setMarkerRadiusToHighchartsSeries(categories, series) {
	// 横坐标是日期yyyymmdd格式，如果是周末，则marker.radius=5，plot时点较大
	//console.log("obj.series", obj.series);
	
	for (var i = 0; i < series.length; i++) {
		var tmp_arr = [];
		for (var j = 0; j < categories.length; j++) {
			if (j >= series[i].data.length) break;
			var v = series[i].data[j], flag = isWeekend(categories[j]);			
			if (v && flag) {
				if (typeof(v) === 'object') {
					v.marker = {'radius':6};
					tmp_arr.push(v);
				} else {
					tmp_arr.push({'y':v, 'marker':{'radius':5}});
				}				
			} else {
				tmp_arr.push(v);
			}
		}
		series[i].data = tmp_arr;
	}
	//console.log("obj.series", obj.series);
	
	return series;
}

function searchFormValidInit(){
	var n_reg =  /^\s*[-+]?\d{0,9}\s*$/;
	var p_reg =  /^\s*$/;
	var float_reg = /(^\s*[-+]?\d{1,9}\.\d{1,4}\s*$)|(^\s*[-+]?\d{1,9}\s*$)/;
	var date_reg = /^((((1[6-9]|[2-9]\d)\d{2})(0?[13578]|1[02])(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})(0?[13456789]|1[012])(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})0?2(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|2468][048]|[3579][26])00))0?229))$/;
	if ($.fn.validatebox) {
		$.extend($.fn.validatebox.defaults.rules, {  
		    equals: {  
		        validator: function(value,param){  
		            return value == $(param[0]).val();  
		        },  
		        message: 'Field do not match.'  
		    },  	 
			grade: {
				validator: function(value){  
			        return p_reg.test(value) || (1 <= value && value <= 999);  
		        },  
		        message: '请输入等级大于1的整数！' 
			},  	  	 
			grade_in: {
				validator: function(value){  
					var vals = value.split(",");
					for(var vi = 0; vi < vals.length; vi++){
				        if(!p_reg.test(vals[vi]) && (!n_reg.test(vals[vi])||( 1 > vals[vi] || vals[vi] > 999))){
							return false;
				        }
					}
			        return true;  
		        },  
		        message: '请输入等级大于1的整数, 各值之间用","分隔！' 
			},   
			school: {
				validator: function(value){  
			        return n_reg.test(value) && 1 <= value && value <= 8;  
		        },  
		        message: '门派范围在1-8之间！' 
			},  	 
			n: {
				validator: function(value){  
			        return n_reg.test(value);  
		        },  
		        message: '请输入小于9位的整数！' 
			},  	 
			n_in: {
				validator: function(value){  
					var vals = value.split(",");
					for(var vi = 0; vi < vals.length; vi++){
				        if(!n_reg.test(vals[vi])){
				        	return false;
				        }
					}
			        return true;   
		        },  
		        message: '请输入小于9位的整数, 各值之间用","分隔！' 
			},  	 
			s: {
				validator: function(value){  
					return value.length <= 40;
		        },  
		        message: '请输入长度不超过40的字符串！' 
			},  	 
			s_in: {
				validator: function(value){  
					var vals = value.split(",");
					for(var vi = 0;  vi < vals.length; vi++ ){
				        if(vals[vi].length > 40){
				        	return false;
				        }
					}
			        return true;  
		        },  
		        message: '请输入长度不超过40的字符串, 各值之间用","分隔！' 
			},  	 
			f: {
				validator: function(value){  
			        return float_reg.test(value);  
		        },  
		        message: '请输入浮点数，最多保留小数点后4位、前9位！' 
			},	 
			f_in: {
				validator: function(value){  
					var vals = value.split(",");
					for(var vi = 0;  vi < vals.length; vi++ ){
				        if(!float_reg.test(vals[vi])){
				        	return false;
				        }
					}
			        return true;  
		        },  
		        message: '请输入浮点数，最多保留小数点后4位、前9位, 各值之间用","分隔！' 
			},
			notempty: {
				validator: function(value){  
					return value.length > 0;
		        },  
		        message: '此项禁止为空！' 
			},
		    segment_step: {
				validator: function(value){  
					return float_reg.test(value) && value >= 0.0;
		        },  
		        message: '请输入大于0的浮点数，最多保留小数点后4位、前9位！'
		    },
		    segment_date: {
				validator: function(value){  
					return n_reg.test(value) && value >= 0;
		        },  
		        message: '请输入大于0的整数，不超过9位！' 
		    },
		    date: {
				validator: function(value){  
					if (value.length != 8) return false;
					return date_reg.test(value);
		        },  
		        message: '请输入日期格式数字，日期格式如20130228！' 
		    },
		    segment_date_in: {
		    	validator: function(value){  
					var vals = value.split(",");
					for (var i = 0; i < vals.length; i++) {
						if(!date_reg.test(vals[i]) || vals[i].length != 8) return false;
						if (i+1 < vals.length && parseFloat(vals[i]) >= parseFloat(vals[i+1])) return false;
					}
			        return true;  
		        },  
		        message: '请输入日期格式数字序列，严格递增，各值之间用","分隔！日期格式如20130228。' 
		    },
			segment_f_in: {
				validator: function(value){  
					var vals = value.split(",");
					for (var i = 0; i < vals.length; i++) {
						if(!float_reg.test(vals[i])) return false;
						if (i+1 < vals.length && parseFloat(vals[i]) >= parseFloat(vals[i+1])) return false;
					}
			        return true;  
		        },  
		        message: '请输入浮点数序列，严格递增， 各值之间用","分隔！最多保留小数点后4位、前9位。' 
			}
		});
	}
	
}

// run
searchFormValidInit();

/**
 * 通用的获取参数方法，从wrapper中查询所有带name的值，最后返回一个json对象
 * @param $wrapper
 * @returns {{}}
 */
function generalNameParameter($wrapper){
	var json={};

	$wrapper.find("[name]").each(function (index, element) {
		var name = this.name;
		var value = $(this).val();
		if (name && value) {
			if (typeof(value) === 'object' && value.length == 1) {
				value = value[0];
			}

			if (name in json) {
				if (typeof(json[name]) === 'string') {
					json[name] = [json[name]];
				}
				json[name] = json[name].concat(value);
			} else {
				json[name] = value;
			}
		}
	});

	return json;
}



/**
 * added by ljjn1246, 20150731
 *
 * 通用的gdas纬度选择控件初始化接口
 * 按照已有的renderer下的dim选择控件，渲染出对应的gdas选择控件。
 *
 * @param $selectClass 需要渲染的jquery 对象，可以是集合
 * @param options      预留的配置, 目前已有的配置是 isEnglishVersion
 * @param callback     选择后的回调函数/回调对象(带callback)，可以使一个函数，也可以是一个对象(拥有callback 接口),允许接受参数
 * @param ...callbackParams 回调函数需要调用的参数列表, 可变长度参数列表
 *
 *
 * 注： 使用的时候，需要使用call/apply 方法绑定到需要的this作用域，以便回调函数中this作用域绑定正确。
 *
 */
function generalDimSelectorInit($selectClass ,options, callback , callbackParams){
	var thisObj = this;
	var thisArguments =arguments;
	$selectClass.each(function (index, e) {
		//单选控件
		var selectType = $(e).attr("data-selectType");
		var isMultiSelect = false;
		if (selectType.length >= 'levelSelect'.length && selectType.substr(0, 'levelSelect'.length) == 'levelSelect') {
			isMultiSelect = true;
		}
		if (isMultiSelect) {
			//层级单选控件
			$(e).jMultiLevelSelect({
				has_least_one: selectType.indexOf("__hasleastone") != -1 ? true : false, //必选
				active_127: selectType.indexOf("__active_127") != -1 ? true : false,
				callback: function () {
					if (callback && typeof(callback) === "function") {//回调函数
						console.log("generalDimSelectorInit: callback function");
						callback.apply(thisObj,Array.prototype.slice.call(thisArguments,3));//绑定此回调函数的this作用域到调用对象上
					} else if (callback && typeof(callback) === "object") {//回调对象
						console.log("generalDimSelectorInit: callback object, calling callback.callback");
						callback.callback(Array.prototype.slice.call(thisArguments,3));
					}
				}
			});
		} else {
			var isAjaxSearch = $(e).find("option").size() >= 1000;
			$(e).gdasSingleSelector({
				isWrapped: true,
				wrapThreshold: 5,
				wrapButtonName: options.isEnglishVersion ? "More" : "更多",
				searchPlaceholder: options.isEnglishVersion ? "Search" : "搜索",
				animateTime: 0, //其他菜单出现和隐藏的动画时间, 单位毫秒
				searchBar: "auto",//提供对更多数据的搜索过滤功能, "false", "true", "auto" "auto" 表示自动根据更多数据的大小来自动启动
				searchBarEnableThreshold: 8, //当更多数据项超过该阈值时，自动启动搜索功能
				isAjaxSearch: isAjaxSearch, // 是否开始ajax搜索
				callback: function () {
					if (callback && typeof(callback) === "function") {
						console.log("generalDimSelectorInit: call callback function");
						callback.apply(thisObj,Array.prototype.slice.call(thisArguments,3));//绑定此回调函数的this作用域到调用对象上
					} else if (callback && typeof(callback) === "object") {
						console.log("generalDimSelectorInit: callback parameters is an object, then call callback.callback");
						callback.callback(Array.prototype.slice.call(thisArguments,3));
					}
				}
			});
		}
	});
};




function tipToolsFac (){
	
	this.timeouthandle;
	
}
	
tipToolsFac.prototype = {
		
	showTips: function (div, t, move) {
		
		if ( !div || !div.find ) {
			return false;
		}
		
		var tips = div.find( "p.validateTips" );
		
		if( tips.size() == 0){
			tips = div.siblings( "p.validateTips" );		
		}
		
		tips.text( t ).append( "<img class=\"close\" src=\"" + contextPath + "/image/tipsClose.png\" />" ).addClass( "showValidateTips" ).show();

		if( move === true ){
			tips.position({
				my: "left middle",
				at: "right+10 middle",
				of: div,
				collision: "none"
			});
		}
		
		var that = this;
		
		tips.find( "img.close" ).bind("click", function(){
			that.closeTips(div);
		});
		
		return true;
		
	},
	
	closeTips: function (div) {
		
		if(!div || !div.find){
			return false;
		}
		
		var tips = div.find( "p.validateTips" );
		
		if( tips.size() == 0){
			tips = div.siblings( "p.validateTips" );
		}
		
		tips.find( "img.close" ).unbind( );
		
		tips.text( "" ).removeClass( "showValidateTips" ).hide();
		return true;
		
	},
	
	updateTips: function ( div, t, move ) {

		if( this.showTips(div, t, move) ){

			var timeouthandle = this.timeouthandle,
			that = this;
			
			if ( timeouthandle ){
				clearTimeout( timeouthandle );
			}
			
			this.timeouthandle = setTimeout(function() {
				that.closeTips(div);
			}, 2000 );
			
		}
		
	},
	
	clearTips: function ( div ) {
		var tips = div.find( "p.validateTips" );
		if( tips.size() == 0){
			tips = div.siblings( "p.validateTips" );
		}
		tips.text( "" ).removeClass( "showValidateTips" );
	}
};

var commonTipTools = new tipToolsFac();

function checkRegexp( o, regexp, n, div) {
	if ( !( regexp.test( o.val() ) ) ) {
		o.addClass( "ui-state-error" );
		commonTipTools.updateTips( n, div );
		return false;
	} else {
		return true;
	}
}

function checkLength( o, n, min, max, div ) {
	if ( o.val().length > max || o.val().length < min ) {
		o.addClass( "ui-state-error" );
		commonTipTools.updateTips( div, n + "必须在" + min + "到" + max + "字之间" );
		return false;
	} else {
		return true;
	}
}

function checkLengthNotEmpty(o, n, div){
	if(o.val().length == 0){
		o.addClass("ui-state-error");
		commonTipTools.updateTips(div, n+"不能为空");
		return false;
	}else{
		return true;
	}
}


/**
 * Added by ljjn1246
 * 往body插入一个导航栏,position=fixed
 * 导航的目录项由html中拥有nav属性的结点决定。
 *
 * 其中nav属性决定导航项的显示, id决定导航的位置
 */
function navbox() {

    /**
     *     返回页面中所有可以导航目录数组
     *     name来源于 nav属性， id来自于结点id
     *     格式诸如：
     *     var aDirectory = [
             {name: "概览", id: "overview"},
             {name: "模块1", id: "module1"},
             {name: "模块2", id: "module2"},
             {name: "模块3", id: "module3"},
             {name: "模块4", id: "moudle4"}
           ];
     */

    var _buildDir=function(){
        var aDirectory=[];
        $('[nav]').each(function(i,e){
            var dir={
                name:$(e).attr('nav'),
                id: $(e).attr('id')
            };
            aDirectory.push(dir);
        });

        return aDirectory;
    }

    /**
     * 返回到指定高度
     * @param nTop
     * @private
     */
    var _fBackTop = function (nTop) {
        $("html,body").animate({scrollTop: nTop + "px"}, 200);
    };

    /**
     * 从aDirectory对应的模块中找出当前应该染色的的模块ID
     * @returns {*|.data.id|id|jQuery.fn.linkbutton.defaults.id|swfZoomDetection._attributes.id|.submitdata.id}
     * @private
     */
    var _findCurModuleId = function (aDirectory) {
        var nScrollTop = parseFloat($(window).scrollTop());
        var nWinHeight = parseFloat($(window).height());
        var nCurId = aDirectory[aDirectory.length - 1].id;
        $.each(aDirectory, function (i, oDirectory) {
            if ($("#" + oDirectory.id).length > 0) {
                var nModuleTop = parseFloat($("#" + oDirectory.id).offset().top);
                if (nModuleTop > nScrollTop && nModuleTop < (nScrollTop + nWinHeight) && nModuleTop < parseFloat($("#" + nCurId).offset().top)) {
                    nCurId = oDirectory.id;
                }
            }
        });
        return nCurId;
    };

    /**
     * highlight导航目录中对应的项
     */

    var _highlightCurrent=function(aDirectory){
        var nCurId = _findCurModuleId(aDirectory);
        $("#moduleNav").find("ul.directory li a").removeClass("current");
        $("#moduleNav").find("ul.directory li a[data-target=" + nCurId + "]").addClass("current");
    }

    /*END 闭包私有方法*/


    var aDirectory = _buildDir();//构建目录树的对象

    /* START: 渲染HTML */
    var html = [];
    html.push("<div id='moduleNav' class='module-nav'>");
    html.push("    <ul class='directory'>");
    $.each(aDirectory, function (i, oDirectory) {
        html.push("        <li><a data-target='" + oDirectory.id + "'>" + oDirectory.name + "</a></li>");
    });
    html.push("    </ul>");
    html.push("    <div class='backtop'><span>返回顶部</span></div>");
    html.push("</div>");
    $("body").append(html.join(''));
    /* END: 渲染HTML */

    _highlightCurrent(aDirectory);//初始化染色


    /* START: 绑定事件 */
    // 绑定导航目录项点击事件
    $("#moduleNav ul.directory li a").off('click').on('click', function () {
        var id = $(this).attr("data-target");
        if ($("#" + id).length > 0) {
            var nTargetTop = $("#" + id).offset().top - 20;
            _fBackTop(nTargetTop);
        }
    });


    // 绑定返回顶部事件
    $("#moduleNav").find(".backtop").on('click', function () {
        _fBackTop(0);
    });


    // 当页面滚动时，将导航控件移动到适当位置
    $(window).scroll(function () {
        /*var nScrollTop = parseFloat($(window).scrollTop());
         var nWinHeight = parseFloat($(window).height());
         var nTop = nScrollTop + nWinHeight * 0.5;
         $("#moduleNav").stop().animate({top: nTop + "px"});*/

        // 如果当前视窗滚动到某个模块，highlight导航目录中对应的项
        _highlightCurrent(aDirectory);
    });
    /* END: 绑定事件 */
}



function setGameImgAnimation(){
	
	$.fn.gameimganimationleft = function( using ) {
		return this.position({
			my: "right top",
			at: "left top",
			of: "#ulForGameList",
			collision: "none",
			using: using
		});
	};
	
	$.fn.gameimganimationright = function( using ) {
		return this.position({
			my: "left top",
			at: "right top",
			of: "#ulForGameList",
			collision: "none",
			using: using
		});
	};
	
	$.fn.gameimganimationfirst = function( using ) {
		return this.position({
			my: "left top",
			at: "left top",
			of: "#ulForGameList",
			using: using
		});
	};
	
	$.fn.gameimganimationsecond = function( using ) {
		return this.position({
			my: "left top",
			at: "left+120 top",
			of: "#ulForGameList",
			using: using
		});
	};
	
	$.fn.gameimganimationthird = function( using ) {
		return this.position({
			my: "left top",
			at: "left+240 top",
			of: "#ulForGameList",
			using: using
		});
	};
	
	$.fn.gameimganimationforth = function( using ) {
		return this.position({
			my: "left top",
			at: "left+360 top",
			of: "#ulForGameList",
			using: using
		});
	};
	
	$.fn.gameimganimationfifth = function( using ) {
		return this.position({
			my: "left top",
			at: "left+480 top",
			of: "#ulForGameList",
			using: using
		});
	};
	
	$.fn.gameimganimationsixth = function( using ) {
		return this.position({
			my: "left top",
			at: "left+600 top",
			of: "#ulForGameList",
			using: using
		});
	};
	
	if($( "#ulForGameList li.active" ).index() > 1 ){
		$( "#ulForGameList li:lt(" + ( $( "#ulForGameList li.active" ).index()-1) + ")" ).appendTo( "#ulForGameList" );
	} else if($( "#ulForGameList li.active" ).index() == 0 ){
		$( "#ulForGameList li:last" ).prependTo( "#ulForGameList" );
	}
	$( "#ulForGameList li:eq(0)" ).gameimganimationfirst();
	$( "#ulForGameList li:eq(1)" ).gameimganimationsecond();
	$( "#ulForGameList li:eq(2)" ).gameimganimationthird();
	$( "#ulForGameList li:eq(3)" ).gameimganimationforth();
	$( "#ulForGameList li:eq(4)" ).gameimganimationfifth();
	$( "#ulForGameList li:eq(5)" ).gameimganimationsixth();
	$( "#ulForGameList li:gt(5)" ).gameimganimationright(); 
	
	function animate( to ) {
		$( this ).stop( true, false ).animate( to );
	}
	
	function next( event ) {
		event.preventDefault();
		$( "#ulForGameList li:eq(6)" ).gameimganimationright().gameimganimationsixth( animate );
		$( "#ulForGameList li:eq(5)" ).gameimganimationfifth( animate );
		$( "#ulForGameList li:eq(4)" ).gameimganimationforth( animate );
		$( "#ulForGameList li:eq(3)" ).gameimganimationthird( animate );
		$( "#ulForGameList li:eq(2)" ).gameimganimationsecond( animate );
		$( "#ulForGameList li:eq(1)" ).gameimganimationfirst( animate );
		$( "#ulForGameList li:eq(0)" ).gameimganimationleft( animate ).appendTo( "#ulForGameList" );
	}
	
	function previous( event ) {
		event.preventDefault();
		$( "#ulForGameList li:eq(0)" ).gameimganimationsecond( animate );
		$( "#ulForGameList li:eq(1)" ).gameimganimationthird( animate );
		$( "#ulForGameList li:eq(2)" ).gameimganimationforth( animate );
		$( "#ulForGameList li:eq(3)" ).gameimganimationfifth( animate );
		$( "#ulForGameList li:eq(4)" ).gameimganimationsixth( animate );
		$( "#ulForGameList li:eq(5)" ).gameimganimationright( animate );
		$( "#ulForGameList li:last" ).gameimganimationleft().gameimganimationfirst( animate ).prependTo( "#ulForGameList" );
	}
	
	$( "#body_layout_center_game_list div.prevLogo" ).click( previous );
	$( "#body_layout_center_game_list div.nextLogo" ).click( next );  
	
};


/**
 * 取最小值
 * @param array
 * @returns {*}
 */
function smallestNumber(array){
    var min = array[0];
    for (var i = 1; i < array.length; i++) {
        if (array[i] < min) {
            min = array[i];
        }
    }
    return min;
}

/**
 * 取最大值
 * @param array
 * @returns {*}
 */
function largetstNumber(array){
    var max = array[0];
    for (var i = 1; i < array.length; i++) {
        if (array[i] > max) {
            max = array[i];
        }
    }
    return max;
}

function unableGameImgAnimation(){
	
	$.fn.gameimganimationfirst = function( using ) {
		return this.position({
			my: "left top",
			at: "left top",
			of: "#ulForGameList",
			using: using
		});
	};
	
	$.fn.gameimganimationsecond = function( using ) {
		return this.position({
			my: "left top",
			at: "left+120 top",
			of: "#ulForGameList",
			using: using
		});
	};
	
	$.fn.gameimganimationthird = function( using ) {
		return this.position({
			my: "left top",
			at: "left+240 top",
			of: "#ulForGameList",
			using: using
		});
	};
	
	$.fn.gameimganimationforth = function( using ) {
		return this.position({
			my: "left top",
			at: "left+360 top",
			of: "#ulForGameList",
			using: using
		});
	};
	
	$.fn.gameimganimationfifth = function( using ) {
		return this.position({
			my: "left top",
			at: "left+480 top",
			of: "#ulForGameList",
			using: using
		});
	};
	
	$.fn.gameimganimationsixth = function( using ) {
		return this.position({
			my: "left top",
			at: "left+600 top",
			of: "#ulForGameList",
			using: using
		});
	};

	$( "#ulForGameList li:eq(0)" ).gameimganimationfirst();
	$( "#ulForGameList li:eq(1)" ).gameimganimationsecond();
	$( "#ulForGameList li:eq(2)" ).gameimganimationthird();
	$( "#ulForGameList li:eq(3)" ).gameimganimationforth();
	$( "#ulForGameList li:eq(4)" ).gameimganimationfifth();
	$( "#ulForGameList li:eq(5)" ).gameimganimationsixth();
};

var cookieName="page_scroll";
var expdays=365;

/**
 * get game name, like 'tx3', 'xyq', etc
 */
function getGameName() {
	var tmp = $("#ulForGameList").find("img[src$='_selected.png']:eq(0)");
	if (tmp && tmp.length > 0) {
		tmp = tmp[0].src.split("/");
		return tmp[tmp.length - 1].split("_")[0];
	}
	return null;
}

/**
 * default we can see last day data, except tx3
 */
function getDefaultNDays() {
	var def = -1;
	if ("tx3" == getGameName()) {
		def = -2;
	}	
	return def;
}

// An adaptation of Dorcht's cookie functions.

function setCookie(name, value, expires, path, domain, secure){
    if (!expires){expires = new Date();}
    document.cookie = name + "=" + escape(value) + 
    ((expires == null) ? "" : "; expires=" + expires.toGMTString()) +
    ((path == null) ? "" : "; path=" + path) +
    ((domain == null) ? "" : "; domain=" + domain) +
    ((secure == null) ? "" : "; secure");
}

function getCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg){
            return getCookieVal(j);
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}

function getCookieVal(offset){
    var endstr = document.cookie.indexOf (";", offset);
    if (endstr == -1)
    endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}

function deleteCookie(name,path,domain){
    document.cookie = name + "=" +
    ((path == null) ? "" : "; path=" + path) +
    ((domain == null) ? "" : "; domain=" + domain) +
    "; expires=Thu, 01-Jan-00 00:00:01 GMT";
}

function saveScroll(){ // added function
    var expdate = new Date ();
    expdate.setTime (expdate.getTime() + (expdays*24*60*60*1000)); // expiry date

    var x = (document.pageXOffset?document.pageXOffset:document.body.scrollLeft);
    var y = (document.pageYOffset?document.pageYOffset:document.body.scrollTop);
    Data=x + "_" + y;
    setCookie(cookieName,Data,expdate);
}

function loadScroll(){ // added function
    inf=getCookie(cookieName);
    if(!inf){return;}
    var ar = inf.split("_");
    if(ar.length == 2){
        window.scrollTo(parseInt(ar[0]), parseInt(ar[1]));
    }
}

// add onload="loadScroll()" onunload="saveScroll()" to the opening BODY tag


function gotoTopFac (){

	this.goto_top_type = -1;
	this.goto_top_itv = 0;
	
}
	
gotoTopFac.prototype = {

	goto_top_timer: function () {
		
		var y = this.goto_top_type == 1 ? document.documentElement.scrollTop : document.body.scrollTop,
		moveby = 15;
		  
		y -= Math.ceil(y * moveby / 100);
		if (y < 0) {
			y = 0;
		}
		 
		if ( this.goto_top_type == 1 ) {
			document.documentElement.scrollTop = y;
		} else {
			document.body.scrollTop = y;
		}
		 
		if (y == 0) {
			clearInterval( this.goto_top_itv );
			this.goto_top_itv = 0;
		}
		
	},

	goto_top_timer_handle: function () {
		var handler = this;
		return function (){
		
			var y = handler.goto_top_type == 1 ? document.documentElement.scrollTop : document.body.scrollTop,
			moveby = 35;
			  
			y -= Math.ceil(y * moveby / 100);
			if (y < 0) {
				y = 0;
			}
			 
			if ( handler.goto_top_type == 1 ) {
				document.documentElement.scrollTop = y;
			} else {
				document.body.scrollTop = y;
			}
			 
			if (y == 0) {
				clearInterval( handler.goto_top_itv );
				handler.goto_top_itv = 0;
			}
			
		};
		
	},
	 
	goto_top: function () {
		
		if ( this.goto_top_itv == 0) {
			if (document.documentElement && document.documentElement.scrollTop) {
				this.goto_top_type = 1;
			} else if (document.body && document.body.scrollTop) {
				this.goto_top_type = 2;
			} else {
				this.goto_top_type = 0;
			}
			
			if ( this.goto_top_type > 0 ) {
				var that = this;
				this.goto_top_itv = setInterval(function(){that.goto_top_timer();}, 5);
			}
		}
	
	},
	 
	goto_top_handle: function () {
		var handler = this;
		return function (){
		
			if ( handler.goto_top_itv == 0) {
				if (document.documentElement && document.documentElement.scrollTop) {
					handler.goto_top_type = 1;
				} else if (document.body && document.body.scrollTop) {
					handler.goto_top_type = 2;
				} else {
					handler.goto_top_type = 0;
	            }
	               
				if ( handler.goto_top_type > 0 ) {
					handler.goto_top_itv = setInterval(handler.goto_top_timer_handle(), 5);
				}
			}
			
		};
	}
};

function commonPlot(container_handler, obj, options) {
	
	var _step = parseInt((obj.categories.length + 29) / 30);
	var _rotation = (obj.categories.length > 5) ? -45 : 0;

	var _opts = ("opts" in obj) ? obj["opts"] : {};
	var _yAxis = obj["yAxis"];
	
	if ("yAxisRange" in _opts) {
		var ss = _opts.yAxisRange.split(",");
		for (var i = 0; i <_yAxis.length; i++) {
			if (! isNaN(parseInt(ss[0])) && ! _yAxis[i].min) _yAxis[i].min = parseInt(ss[0]);
			if (! isNaN(parseInt(ss[1])) && ! _yAxis[i].max) _yAxis[i].max = parseInt(ss[1]);
		}
	}
	
	//console.log("obj", obj);
	if (obj.series_order && obj.series_order.length > 0) {
		var map = {}, arr = [], e;
		for (var i = 0; i < obj.series.length; i++) {
			e = obj.series[i];
			if (obj.series_order.indexOf(e.name) != -1) {
				map[e.name] = e;
			} else {
				arr.push(e);
			}
		}
		
		var tmp = [];
		for (var i = 0; i < obj.series_order.length; i++) {
			if (obj.series_order[i] in map) {
				tmp.push(map[obj.series_order[i]]);
			}
		}
		
		obj.series = tmp.concat(arr);
	} else if ("sortSeries" in _opts && _opts.sortSeries == "true") {
		obj.series.sort(function compare(obj1, obj2) {
			return obj1.name.localeCompare(obj2.name);
		});
	}
	//console.log("obj after", obj);
	
	// 
	//obj.series = setMarkerRadiusToHighchartsSeries(obj.categories, obj.series);
	
	var $plot = $(container_handler).find("div.common_plot_plot");
	var plot_options = {
		chart : {
//				renderTo : "",
			zoomType : 'xy',
			type : options && options.type ? options.type : null
		},
		credits : {
			enabled : false
		},
		title : {
			text : obj["title"],
			//x: -20 //center
			margin : 5,
			style : {
				fontSize : '16px',
				fontWeight : 'normal',
				fontFamily : '微软雅黑',
				lineHeight: '27px'
			}
		},
		subtitle : {
			text : obj["subtitle"],
			x : -20
		},
		xAxis : {
			categories : obj.categories,
			labels : {
				step : _step,
				rotation : _rotation,
				align : 'right',
				style : {
					fontSize : '12px',
					fontFamily : '微软雅黑, Verdana, sans-serif'
				}
			}
		},
		yAxis : _yAxis,
		tooltip : {
			formatter : options && options.formatter ? options.formatter : (function() {return '<span style="color:'+this.series.color+';font-weight:bold;">'+ this.series.name + '</span><br/>'+ "["+ this.x+ '， '+ numberWithCommas(this.y)+ "]";})
		},
		legend : {
			x : 10,
			y : 10,
			maxHeight : 64,
			borderWidth : 0
		},
		exporting : {enabled: false},
		series : obj.series,
		plotOptions: {
			series: {
				stacking: options && options.stacking ? options.stacking : null
			}
		}
	};
	$plot.highcharts(plot_options);
}

function initShowTable(container_handler) {
	
	var $container_handler = $( container_handler ),
	$common_plot_show_table = $container_handler.find("button.common_plot_show_table");
	
	$common_plot_show_table.bind("click", function() {
		
		var $common_plot_table_handler = $container_handler.find("div.common_plot_table");

		if ( $common_plot_table_handler.find( ".dataTables_wrapper" ).size() === 0 ) {
			
			initTable( $container_handler );
			$( this ).addClass( "opened" );
			setHideShowTable( container_handler, "true" );
			return;
			
		}
		
		if ( $common_plot_table_handler.is(":visible") ) {
			
			$common_plot_table_handler.hide();
			$container_handler.find("div.common_plot_ctrl_panel div.top").hide();
			$( this ).removeClass( "opened" );
			setHideShowTable( container_handler, "false" );
			
		} else {
			
			$common_plot_table_handler.show();
			$container_handler.find("div.common_plot_ctrl_panel div.top").show();
			$( this ).addClass( "opened" );
			setHideShowTable( container_handler, "true" );
			
		}
		
	});
	
	var obj = getOption($container_handler);

	if ("opts" in obj && "showTable" in obj.opts && obj.opts.showTable === 'true') {
		$common_plot_show_table.click();
	}
}

function getDefaultOption(container_handler) {
	var options = {"type":null,"stacking":null,formatter:null},
	$bigFrameHead = $( container_handler).parent( "div.BigFrameBody, div.classDivPlot" ).prev( ".BigFrameHead, form.classForm" ),
	$type_button = $( container_handler).find( "button.common_plot_select_type_button" );
	
	if ( $bigFrameHead.size() > 0 ) {
		$type_button = $bigFrameHead.find( "button.common_plot_select_type_button" );
	}
	
	var type = $type_button.data( "value" ) || $type_button.attr( "data-value" ) || "";
	
	if (type.length > 0) {
//		var type_list = ['line','column','spline','area','areaspline','bar','scatter'];
		var type_stack_list = ['stackedcolumn','stackedbar','stackedarea'];
		var type_stack_persent_list = ['stackedpercentcolumn','stackedpercentbar','stackedpercentarea'];
		
		options.type = type.replace("stacked","").replace("percent","");
		options.stacking = null;
		
		if (type_stack_list.indexOf(type) != -1) {
			options.stacking = "normal";
		} else if (type_stack_persent_list.indexOf(type) != -1) {
			options.stacking = "percent";
			options.formatter = function() {return '<span style="color:'+this.series.color+';font-weight:bold;">'+ this.series.name +'</span><br/>'+ "[" + this.x +'， '+ numberWithCommas(this.y) + "<strong>("+this.percentage.toFixed(2).toString().replace(/\.0*$/, "")+"%)</strong>]";};
		}
	}
	
	return options;
}

function initSelectType( container_handler ) {
	
	var $container_handler = $( container_handler ),
	$common_plot_select_type = $container_handler.find( "div.common_plot_select_type" ),
	$bigFrameHead = $container_handler.parent( "div.BigFrameBody, div.classDivPlot" ).prev( ".BigFrameHead, form.classForm" );
	
	if ( $bigFrameHead.size() > 0 ) {

		$bigFrameHead.find( "div.common_plot_select_type" ).remove();
		$common_plot_select_type.appendTo( $bigFrameHead );
		
	}
	
	var type_button = "button.common_plot_select_type_button",
	type_ul = "ul.common_plot_select_type_ul",
	$type_button = $common_plot_select_type.find( type_button ),
	$type_ul = $common_plot_select_type.find( type_ul );
		 
	
	$( document ).click(function( event ){
		
		var $target = null;
	
		if ( event && event.target ){
			$target = $( event.target );
		} else {
			return true;
		}

		if ( $target.closest( type_button + ", " + type_ul ).size() === 0 ){
			$type_ul.hide();
		}
		
	});
	
	$type_button.bind("click", function(){
		
		if ( $type_ul.is(":visible") ){
			$type_ul.hide();
		} else {
			$type_ul.show().position( { my: "right top", at: "right bottom+3", of: $type_button } );
		}

	});
	
	$type_ul.find( "li" ).bind("click", function(){
		
		var $type_ul_li = $( this ),
		old_type_value = $type_button.data( "value" ) || $type_button.attr( "data-value" ), 
		type_value = $type_ul_li.data( "value") || $type_ul_li.attr( "data-value" ) || "",
		$type_button_img = $type_button.find( "img" );
		
		$type_ul.hide();
		
		$type_button_img.attr("src", $type_button_img.attr("src").replace(old_type_value, type_value ) );
		
		$type_button.data( "value", type_value ).attr( "data-value", type_value );
		
		changeCommonPlotType();
		
	});
	
	function changeCommonPlotType(){

		saveScroll();
		var obj = getOption(container_handler),
		options = getDefaultOption(container_handler),
		type_value = $type_button.data( "value") || $type_button.attr( "data-value" ) || "";
		
		setHideDefaultType(container_handler, type_value);
		commonPlot(container_handler, obj, options);
		loadScroll();
		
	};
	
	//
	var obj = getOption(container_handler);
//	console.log("initSelectType  obj.opts", obj.opts);
	if ("opts" in obj && "defaultType" in obj.opts && obj.opts.defaultType.length > 0) {
		$type_button.data( "value", obj.opts.defaultType ).attr( "data-value", obj.opts.defaultType );
	}
	
	changeCommonPlotType();
	
}

function getOption(container_handler) {
	var $option_handler = $(container_handler).find("div.common_plot_option");
	obj = {};
	
	if ( $option_handler.size() > 0 ) {
		obj = $.parseJSON($($option_handler).html());
	} else {
		var $plot_handler = $(container_handler).find("div.common_plot_plot");
		if ( $plot_handler.size() > 0 ) {
			obj = $plot_handler.data( "obj" ) || $plot_handler.attr( "data-obj" );
		}
	}

	return obj;
}

function parseTableData(obj) {
	// process data for table
	var aaData = new Array();
	var aoColumns = new Array();
	for ( var i = 0; i < obj.categories.length; i++) {
		var one = new Array();
		one.push(obj.categories[i]);
		aaData.push(one);
	}

	// must set sType for the first column
	aoColumns.push({
		"sTitle" : "横坐标",
		"sType" : "mytype"
	});
	for ( var i = 0; i < obj.series.length; i++) {
		aoColumns.push({
			"sTitle" : obj.series[i].name
		});
		var one = obj.series[i].data;
		for ( var j = 0; j < one.length; j++) {
			aaData[j].push(one[j]);
		}
	}

	return {
		"aaData" : aaData,
		"aoColumns" : aoColumns
	};
}

function initTable(container_handler) {
	var obj = getOption(container_handler);
	var json = parseTableData(obj);
	$(container_handler).find("div.common_plot_table table").dataTable(
	{
		"sDom" : '<"top"iT>rt<"bottom"flp><"clear">',
		"oTableTools" : {
			"sSwfPath" : contextPath + "/js/DataTables/media/swf/copy_csv_xls_pdf.swf",
			"aButtons" : [ {
				"sExtends" : "copy",
//				"sButtonText" : "复制到剪贴板"
				"sButtonText" : ""
			}, {
				"sExtends" : "xls",
//				"sButtonText" : "保存为EXCEL",
				"sButtonText" : "",
				"sFileName" : "*.xls"
			} ]
		},
		"aaData" : json.aaData,
		"aoColumns" : json.aoColumns,
		//"bSort": false,
		"sPaginationType" : "full_numbers",
		"sScrollX" : "100%",
		"bScrollCollapse" : true,
		"bDestroy" : true,
		"bRetrieve" : true,
		"bAutoWidth" : true,
		"oLanguage" : {
			"sLengthMenu" : "每页显示 _MENU_ 条记录",
			"sZeroRecords" : "抱歉， 没有找到",
			"sInfo" : "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
			"sInfoEmpty" : "没有数据",
			"sInfoFiltered" : "(从 _MAX_ 条数据中查找)",
			"sZeroRecords" : "没有查找到数据",
			"sSearch" : "查找:",
			"oPaginate" : {
				"sFirst" : GDAS.isEnglishVersion?"first":"首页",
				"sPrevious" : "前一页",
				"sNext" : "后一页",
				"sLast" :GDAS.isEnglishVersion?"Last": "尾页"
			}
		},
		"fnDrawCallback" : function(oSettings) {
			saveScroll();
			var container_handler = $(this).parents("div.common_plot_container");
			var myOption = getOption(container_handler);
			
			var data = this.fnGetData(); // do not change even after sorting
			var result = new Array(data.length);
			for ( var i = 0; i < oSettings.aiDisplay.length; i++) {
				result[i] = data[oSettings.aiDisplay[i]];
			}

			var categories = new Array(data.length);
			for ( var i = 0; i < result.length; i++) {
				categories[i] = result[i][0];
			}

			myOption.categories = categories;

			for ( var i = 0; i < myOption.series.length; i++) {
				var one = new Array(data.length);
				for ( var j = 0; j < result.length; j++) {
					one[j] = result[j][i + 1];
				}
				myOption.series[i].data = one;
			}
			// var chart = new Highcharts.Chart(myOption);
			var options = getDefaultOption(container_handler);
			commonPlot(container_handler, myOption, options);
			//$(container_handler).find("select.common_plot_select_type").change();			
			loadScroll();
		}
	});
	
	var $common_plot_ctrl_panel_clearBoth =  $(container_handler).find("div.common_plot_ctrl_panel div.clearBoth"),
	$common_plot_table_top = $(container_handler).find("div.common_plot_table div.dataTables_wrapper div.top");
	
	if ( $common_plot_ctrl_panel_clearBoth.size() > 0 && $common_plot_table_top.size() > 0 ) {
		$common_plot_ctrl_panel_clearBoth.before( $common_plot_table_top );
	}
	
}

function getHideDefaultType(container_handler) {
	var $default_type_handler = $(container_handler).parents("[data-id^='container__']").find("[name='hide__defaultType']");
	var type = "";
	if ($default_type_handler.size() > 0) {
		type =  $default_type_handler.val();
	}
	return type;
}

function setHideDefaultType(container_handler, value) {
	var $default_type_handler = $(container_handler).parents("[data-id^='container__']").find("[name='hide__defaultType']");
	
	if ( $default_type_handler.size() > 0 ) {
		$default_type_handler.val(value);
		return true;
	}
	return false;
}

function getHideShowTable(container_handler) {
	var $default_type_handler = $(container_handler).parents("[data-id^='container__']").find("[name='hide__showTable']");
	var showTable = "";
	if ($default_type_handler.size() > 0) {
		showTable = $default_type_handler.val();
	}
	return showTable;
}

function setHideShowTable(container_handler, value) {
	var $default_type_handler = $(container_handler).parent( "div.classDivPlot" ).prev( "form.classForm" ).find("[name='hide__showTable']");
	if ( $default_type_handler.size() > 0 ) {
		$default_type_handler.val(value);
		return true;
	}
	return false;
}

//selecting ranges with jQueryUI Datepicker
$(function() {
	$.datepicker._defaults.onAfterUpdate = null;
	var datepicker__updateDatepicker = $.datepicker._updateDatepicker;
	$.datepicker._updateDatepicker = function( inst ) {
	   datepicker__updateDatepicker.call( this, inst );
	
	   var onAfterUpdate = this._get(inst, 'onAfterUpdate');
	   if (onAfterUpdate)
	      onAfterUpdate.apply((inst.input ? inst.input[0] : null),
	         [(inst.input ? inst.input.val() : ''), inst]);
	};					
	$.datepicker.regional['zh-CN'] = {
	        closeText: '关闭',
	        prevText: '<上月',
	        nextText: '下月>',
	        currentText: '今天',
	        monthNames: ['1月','2月','3月','4月','5月','6月',
				         '7月','8月','9月','10月','11月','12月'],
	        monthNamesShort: ['1月','2月','3月','4月','5月','6月',
	                        '7月','8月','9月','10月','11月','12月'],
	        dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
	        dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
	        dayNamesMin: ['日','一','二','三','四','五','六'],
	        weekHeader: '周',
	        dateFormat: 'yy-mm-dd',
	        //firstDay: 1,
	        isRTL: false,
	        changeMonth: true,
	        changeYear: true,
	        showMonthAfterYear: true,
	        yearSuffix: '年'
	};
	$.datepicker.setDefaults($.datepicker.regional['zh-CN']);
});

// init function for range-datepicker
function initDatepickerRange(handler, options) {

	var e = handler;

	if (typeof(handler) == "string") {
		e = $(handler);
	}
	
	var tmp = $(e).val();
	if (tmp && tmp.length == 10) { // if not range
		$(e).datepicker();
		return;
	}
	
	if (! tmp || tmp == "-1") {
		var from, to, d1, d2;
		from = new Date((new Date()).getTime() - 1000 * 60 * 60 * 24 * 15);
		to   = new Date((new Date()).getTime() - 1000 * 60 * 60 * 24 * 1);
		d1 = $.datepicker.formatDate('yy-mm-dd', from, {});
	    d2 = $.datepicker.formatDate('yy-mm-dd', to, {});

		$(e).attr("value", d1 + "," + d2);
	}

	
	$(e).on("click", function() {
		var that = $(this);
		var val = $(this).val();

		if (val && val.length > 0) {
			var ss = val.replace("/-/g","/").split(",");
			$(this).attr("data-prv", (new Date(ss[0] + " 00:00:00")).getTime());
			$(this).attr("data-cur", (new Date(ss[ss.length - 1] + " 00:00:00")).getTime());
		}
		
		if (! $(this).hasClass("classInit")) {
			$(this).addClass("classInit");
			$(this).after("<div style='position: absolute;z-index: 10000;'></div>");
		}
		
		var $datepickerHandler = $(this).next();
				
		$datepickerHandler.datepicker("destroy");
		$datepickerHandler.datepicker({
            numberOfMonths: 2,
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            maxDate: 0,
            newOpen: true,

            onSelect: function ( dateText, inst ) {
            	var cur = parseInt($(this).prev().attr("data-cur")),
            	    prv = parseInt($(this).prev().attr("data-prv")), tmp, d1, d2;
            	
            	tmp = (new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)).getTime();
            	
            	if( $(this).datepicker("option","newOpen") ){
            		cur = prv = tmp;
            		$(this).datepicker("option","newOpen", false);
            	} else if ( cur === prv ) {
	            	cur = tmp;
            	} else {
            		cur = prv = tmp;
            	}
            	
            	$(this).prev().attr("data-cur", cur);
            	$(this).prev().attr("data-prv", prv);
            	
            	tmp = Math.min(prv,cur);
            	cur = Math.max(prv,cur);
            	prv = tmp;
            	
            	d1 = $.datepicker.formatDate('yy-mm-dd', new Date(prv), {});
                d2 = $.datepicker.formatDate('yy-mm-dd', new Date(cur), {});
                $(this).prev().val(d1 + "," + d2);					                    
            },
            beforeShowDay: function ( date ) {
            	var prv = $(this).prev().attr("data-prv"),
            	cur = $(this).prev().attr("data-cur"),
            	classes = "",
            	max = Math.max(prv, cur),
            	min = Math.min(prv, cur),
            	dateTime = date.getTime();
            	if((dateTime >= min && dateTime <= max )){
            		classes = 'date-range-selected';
            		if ( dateTime == min && dateTime == max  ) {
            			classes += ' date-range-only';
            		} else if ( dateTime == min ) {
            			classes += ' date-range-first';
            		} else if ( dateTime == max ) {
            			classes += ' date-range-last';
            		}
            	}
            	
            	return [true, classes];
            },
            onAfterUpdate: function ( inst ) {
                  $('<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" data-handler="hide" data-event="click">确定</button>')
                     .appendTo($('.ui-datepicker-buttonpane'))
                     .on('click', function () {
                    	 $('.ui-datepicker').hide();
                    	 if (options && options.datepickerCloseCallback) {
                    		 options.datepickerCloseCallback();
                    	 }
                     });
            },
            onClose: function(){
            	$(this).datepicker("option","newOpen", true);
            }
         });
	
		$datepickerHandler.datepicker('refresh').show();
		
	});
	
	$( document ).click(function( event ){
		var $target = event && event.target;
	
		if ( !$target ){
			return true;
		}

		$target = $( $target );

		if ( !$(event.toElement).is( ".classDatepicker, .ui-state-default, .ui-datepicker-current, .ui-icon" )
				&& $target.closest( ".classDatepicker, .hasDatepicker" ).size() == 0 ){
			var tmp = $(".ui-datepicker :visible");
			if (tmp && tmp.length > 0 && options && options.datepickerCloseCallback) {
				options.datepickerCloseCallback();
			}
			$('.ui-datepicker').hide();
		}
		
	});
	
//	if( options && options.withQuickAccess ){
//		
//		$('<ul class="selectCf">'
//	        + '<li class=""><a class="aToday" href="javascript:void(0);">今天</a></li>'
//	        + '<li class=""><a class="aYesterday" href="javascript:void(0);">昨天</a></li>'
//	        + '<li class=""><a class="aRecent7Days" href="javascript:void(0);">7天</a></li>'
//	        + '<li class=""><a class="aRecent14Days" href="javascript:void(0);">14天</a></li>'
//	        + '<li class="active"><a class="aRecent30Days" href="javascript:void(0);">30天</a></li>'
//	        + '</ul>').insertAfter( $(e) );
//		
//	}
}

function initIDXTable (element){
	
	var $tableOri = $( element );
	
	if ($tableOri.hasClass("dataTable")) {
		return;
	}
	
	try {
		$tableOri.dataTable().fnDestroy();
		$tableOri.dataTable({
			"sDom": '<"top"iT>rt<"bottom"flp><"clear">',
			"oTableTools": {
				"sSwfPath": "../js/DataTables/media/swf/copy_csv_xls_pdf.swf",
				"aButtons": [
				             {
			                	"sExtends": "copy",
			                	"sButtonText": ""
			                 },{
			                	"sExtends": "xls",
			                	"sButtonText": "",
			                    "sFileName": "*.xls"
			                 }
							]
			}, 
			"sPaginationType" : "full_numbers",
	        "sScrollX": "100%",
//	        "sScrollXInner": "100%",
	        "bScrollCollapse": false,
	        "bScrollInfinite": false,
	        "bDestroy": true,
	        "bRetrieve": true,
	        "bAutoWidth": false,
			"oLanguage" : {
				"sLengthMenu": "每页显示 _MENU_ 条记录",
				"sZeroRecords": "抱歉， 没有找到",
				"sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
				"sInfoEmpty": "没有数据",
				"sInfoFiltered": "(从 _MAX_ 条数据中查找)",
				"sZeroRecords": "没有查找到数据",
				 "sSearch": "查找:",
				"oPaginate": {
					"sFirst": "首页",
					"sPrevious": "前一页",
					"sNext": "后一页",
					"sLast": "尾页"
				}
			}
		});
		
	} catch (err) {
		$tableOri.html("<p>配置出错了！</p>");
	}
}

function initSimpleMode(json_array) {
	var $x_handler = $(".simple_mode select.simple_mode_x"),
	$y_handler = $(".simple_mode select.simple_mode_y"),
	$cmp_handler = $(".simple_mode select.simple_mode_cmp"),
	$tmp;

	$(json_array).each(function(index, element) {
		$tmp = $("<option></option>").attr("value", element.id).attr("title",element.nameCN).html(element.nameCN);
		$tmp.appendTo($x_handler);
		var isdim = false;
		if (element.type == 'date' || element.type == 'week') {
			isdim = true;
		} else if (element.translate && element.translate.length > 0) {
			isdim = true;
		}
		$tmp.clone().attr("data-type", element.type).attr("data-isdim", isdim).appendTo($y_handler);
		$tmp.clone().appendTo($cmp_handler);
	});
	
	$x_handler.prepend("<option value=''>无</option>");
	// set default x
	$x_handler.get(0).selectedIndex = 1;
	$cmp_handler.prepend("<option value=''>无</option>");
	
	$("select.simple_mode_y").change(function(event) {
		var tmp = $(this).find("option:selected").attr("data-type");
		var flag = tmp.indexOf("string") != -1 || tmp.indexOf("_enum") != -1 || tmp === 'uuid';

		$(this).parent().find("select.simple_mode_aggregation option").each(function(index, element) {
			if (flag && element.value != 'count' && element.value != 'distinctCount') {
				$(element).hide();
			} else {
				$(element).show();
			}
		});
		$(this).parent().find("select.simple_mode_aggregation").val(flag ? "count" : "sum");
	});
	
	// set default y
	var default_y_index = 0;
	$("select.simple_mode_y").find("option").each(function(index, element) {
		if ($(element).attr('data-isdim') === 'false' && default_y_index == 0) {
			default_y_index = index;
		}
	});
	$("select.simple_mode_y").get(0).selectedIndex = default_y_index;
	$("select.simple_mode_y").change();
}

function initCommonMultiSelect($handler) {
	var label = $handler.attr("data-label"),
		multiple = $handler.attr("data-multiple") == "false" ? false : true;
		
	$handler.multiselect({
		multiple: multiple,
		header: "",
		minWidth: 225,
		header: true,
		checkAllText:"全选",
		uncheckAllText:"清空",
		noneSelectedText: (label && label.length > 0) ? ('全部' + label) : '',
		selectedText: function(numChecked, numTotal, checkedItems) {
			var title = $(checkedItems).map(function() {return this.title; }).get().join(",");
			var value = $(checkedItems).map(function() {return this.value; }).get().join(",");
			$handler.val(value.split(",")); 				
			return title;
		},
		click: function(e) {
	    	//if( $(this).multiselect("widget").find("input:checked").length > 6 ) { return false; }
	    },
        open: function(){
            $(this).multiselect('widget').find('input[type="search"]:first').focus();//set search input box focused after multiselect opens
        }
 	}).multiselectfilter({
		label: false,
		width: "",
		placeholder: "查找..."
	});	
}


/**
 * Added by ljjn1246
 * 判断array1是不是array2的子数组。（不区分顺序）
 * 注：本函数不支持重复，确保参数的数组中不包含重复元素
 * @param array1
 * @param array2
 * @returns {boolean}
 */
function isSubArray (array1, array2) {
    if(array1.length > array2.length) return false;
    for(var i = 0 , len = array1.length; i < len; i++) {
        if($.inArray(array1[i], array2) == -1) return false;
    }
    return true;
}

/**
 * Added by ljjn1246
 * @param o
 * @returns {boolean}
 */
function isNumber(o){
    return typeof o ==='number' && !isNaN (o-0);
}

/**
 * 判断对象s==true,如果s是字符串，则不区分大小写和"true"对比
 * @param s
 * @returns {boolean}
 */
function isTrue(s){
    return s==true ||( s!=undefined&&s.toLowerCase()=='true');
}

/**
 * 判断对象!s==true,如果s是字符串，则不区分大小写和"false"对比
 * @param s
 * @returns {boolean}
 */
function isFalse(s){
    return !s==true||s.toLowerCase() =='false';
}


/**
 * If jQuery.fn.dataTableExt exists, then add customized sort rule to it.
 */
$(function() {
	// customize type 'mytype'
	if (jQuery.fn.dataTableExt) {
		var isPercentFunc = function(validStrArr){
			var sValidChars = "0123456789,.-";//增加负号“-”,20150521,ljjn1246
			var Char;
			var isTmpPercent = false;
			/*如果末位是%则说明可能是百分比数字*/
			for(var i=0; i<validStrArr.length; i++){

				if ( validStrArr[i].toString().charAt(validStrArr[i].length-1) === '%' ) {
					/* Check the numeric part */
					for ( var j=0 ; j<validStrArr[i].length ; j++ )
					{
						Char = validStrArr[i][j].charAt(j);
						if (sValidChars.indexOf(Char) == -1)
						{
							return false;
						}
					}
					isTmpPercent = true;
				} else if(validStrArr[i] === '[空]'){
					isTmpPercent = true;
				}
				if(!isTmpPercent){
					return false;
				}
			}

			return isTmpPercent;
		};

		jQuery.fn.dataTableExt.oSort['mytype-asc']  = function(x,y) {
            x = x.toString();
            y = y.toString();
			var strArr = [x, y];
			var isPercent = isPercentFunc(strArr);
			if(isPercent){
				var percentA = ((x == "-")) ? 0 : x.replace( /%/, "");
				var percentB = ((y == "-")) ? 0 : y.replace( /%/, "" );
				var parsedA = parseFloat( percentA );
				var parsedB = parseFloat( percentB );
				if(x == '[空]' && y == '[空]')
					return 0;
				else if(x == '[空]')
					return 1;
				else if(y == '[空]')
					return -1;
				else
					return ((parsedA < parsedB) ? -1 : ((parsedA > parsedB) ? 1 : 0));
			}else {
				var a = x, b = y;
				var idx1 = -1, idx2 = -1;

				if (x == undefined || y == undefined) {
					return 0;
				}

				idx1 = (x[0] == "-") ? x.substring(1).indexOf("-") : x.indexOf("-");
				idx2 = (y[0] == "-") ? y.substring(1).indexOf("-") : y.indexOf("-");

				if (typeof(x) === "string" && idx1 > 0) {
					a = x.substring(0, idx1);
				}
				if (typeof(y) === "string" && idx2 > 0) {
					b = y.substring(0, idx2);
				}
				a = a.replace(/,/g, '');
				b = b.replace(/,/g, '');
				if (! isNaN(a) && ! isNaN(b)) {
					a = parseFloat(a);
					b = parseFloat(b);
					return ((a < b) ?  -1 : ((a > b) ? 1 : x.substring( idx1 < 0 ? 0 : idx1 ).localeCompare( y.substring( idx2 < 0 ? 0 : idx2 ) ) ));
				}

                var numReg = /\d+/g;
                // 针对留存/流失序列的排序逻辑
                if ((x.indexOf("留存") >= 0 || x.indexOf("流失") >= 0) && (y.indexOf("留存") >= 0 || y.indexOf("流失") >= 0)) {
                    if (x.indexOf("次日") >= 0) return -1;
                    if (y.indexOf("次日") >= 0) return 1;
                    var d1 = null, d2 = null;
                    var m1 = x.match(numReg);
                    if (m1 != null) {
                        d1 = m1[0];
                    }
                    var m2 = y.match(numReg);
                    if (m2 != null) {
                        d2 = m2[0];
                    }
                    if (d1 == d2 == null) return 0;
                    if (d1 == null) return -1;
                    if (d2 == null) return 1;
                    return parseFloat(d1) - parseFloat(d2);
                }

                var tdReg = /\D*\d+\D*/g;
                if (x.match(tdReg) && y.match(tdReg)) {
                    var td_1 = BaseUtil.splitTextAndDigital(x.replace(" ", ""));
                    var td_2 = BaseUtil.splitTextAndDigital(y.replace(" ", ""));
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

				return ((x < y) ? -1 : ((x > y) ?  1 : 0));
			}
	    };
	 
	    jQuery.fn.dataTableExt.oSort['mytype-desc']  = function(x,y) {
            x = x.toString();
            y = y.toString();
			var strArr = [x, y];
			var isPercent = isPercentFunc(strArr);
			if(isPercent){
				var percentA = ((x == "-")) ? 0 : x.replace( /%/, "");
				var percentB = ((y == "-")) ? 0 : y.replace( /%/, "" );
				var parsedA = parseFloat( percentA );
				var parsedB = parseFloat( percentB );
				if(x == '[空]' && y == '[空]')
					return 0;
				else if(x == '[空]')
					return 1;
				else if(y == '[空]')
					return -1;
				else
					return ((parsedA < parsedB) ? 1 : ((parsedA > parsedB) ? -1 : 0));
			}else {
				var a = x, b = y;
				var idx1 = -1, idx2 = -1;

				if (x == undefined || y == undefined) {
					return 0;
				}

				idx1 = (x[0] == "-") ? x.substring(1).indexOf("-") : x.indexOf("-");
				idx2 = (y[0] == "-") ? y.substring(1).indexOf("-") : y.indexOf("-");

				if (typeof(x) === "string" && idx1 > 0) {
					a = x.substring(0, idx1);
				}
				if (typeof(y) === "string" && idx2 > 0) {
					b = y.substring(0, idx2);
				}
				a = a.replace(/,/g, '');
				b = b.replace(/,/g, '');
				if (! isNaN(a) && ! isNaN(b)) {
					a = parseFloat(a);
					b = parseFloat(b);
					return ((a < b) ?  1 : ((a > b) ? -1 : y.substring( idx2 < 0 ? 0 : idx2 ).localeCompare( x.substring( idx1 < 0 ? 0 : idx1 ) ) ));
				}

                var numReg = /\d+/g;
                // 针对留存/流失序列的排序逻辑
                if ((x.indexOf("留存") >= 0 || x.indexOf("流失") >= 0) && (y.indexOf("留存") >= 0 || y.indexOf("流失") >= 0)) {
                    if (x.indexOf("次日") >= 0) return 1;
                    if (y.indexOf("次日") >= 0) return -1;
                    var d1 = null, d2 = null;
                    var m1 = x.match(numReg);
                    if (m1 != null) {
                        d1 = m1[0];
                    }
                    var m2 = y.match(numReg);
                    if (m2 != null) {
                        d2 = m2[0];
                    }
                    if (d1 == d2 == null) return 0;
                    if (d1 == null) return 1;
                    if (d2 == null) return -1;
                    return parseFloat(d2) - parseFloat(d1);
                }

                var tdReg = /\D*\d+\D*/g;
                if (x.match(tdReg) && y.match(tdReg)) {
                    var td_1 = BaseUtil.splitTextAndDigital(x.replace(" ", ""));
                    var td_2 = BaseUtil.splitTextAndDigital(y.replace(" ", ""));
                    var i = 0;
                    while (i < td_1.length && i < td_2.length) {
                        if (!isNaN(td_1[i]) && !isNaN(td_2[i])) {
                            if (parseFloat(td_1[i]) < parseFloat(td_2[i])) return 1;
                            if (parseFloat(td_1[i]) > parseFloat(td_2[i])) return -1;
                        } else {
                            if (td_1[i] < td_2[i]) return 1;
                            if (td_1[i] > td_2[i]) return -1;
                        }
                        i++;
                    }
                    return td_2.length - td_1.length;
                }

				return ((x < y) ? 1 : ((x > y) ?  -1 : 0));
			}
	    };
	}
});



//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
//例子： 
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
//调用： var time1 = new Date().Format("yyyy-MM-dd");var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
Date.prototype.Format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};
/**
 * 由于IE8中 Array不支持indexOf
 * 如果发现没有则添加
 */
if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(elt /*, from*/)
	{
		var len = this.length >>> 0;
		var from = Number(arguments[1]) || 0;
		from = (from < 0)
			? Math.ceil(from)
			: Math.floor(from);
		if (from < 0)
			from += len;
		for (; from < len; from++)
		{
			if (from in this &&
				this[from] === elt)
				return from;
}
		return -1;
	};
};

/**
 * Added by ljjn1246
 * IE8不支持trim函数，发现添加trim函数到String原型中
 */
if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    }
}

/**
 * Added by ccn1069
 * IE8不支持indexOf函数
 */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S")
// (new Date()).Format("yyyy-M-d h:m:s.S")
Date.prototype.Format = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}


document.write("<scr"+"ipt src=\""+contextPath+"\/js\/openPlugIn\/swfZoomDetect\/swfobject.js\"><\/scr"+"ipt>");
document.write("<scr"+"ipt src=\""+contextPath+"\/js\/openPlugIn\/swfZoomDetect\/swfZoomDetection.js\"><\/scr"+"ipt>");