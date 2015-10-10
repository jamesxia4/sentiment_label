/**
 * DataApp.js
 * Yang Wenfeng <gzyangwenfng@corp.netease.com>
 *
 * v1.0
 * 目标：数据应用基类，最开始为移动数据分析（手游）模块前端初始化及绑定事件类。
 * 后来单独成基类是为了可扩展用于其他数据应用。
 *
 *
 * Dependency：jQuery, blockUI, DataTables, Highcharts, gdasDatePicker
 */


/************************************************************************************/


/*********OtherOptions, added by ljjn1246 on 15-3-5.用来封装处理“其他参数”****************************

 /
 * 构造函数，用以构造一个对象处理“其他参数”配置的对象
 * @param rawStr
 * @constructor
 */
function OtherOptions(rawStr) {
    if (!rawStr) return;
    //this.optStr = rawStr;//原始的“其他参数”字符串
    var array = rawStr.split(';');
    var i;
    //通过原始字符串设置对象属性
    for (i = 0; i < array.length; i++) {
        var kv = array[i].split(':');
        var key = kv[0];
        if (key) this[key] = kv[1];
    }
}

/**
 *  Added by ljjn1246
 *  已有的其他参数配置常量表,增加参数不断扩展的可维护性
 *  只读，dev不要改其中的值
 */
OtherOptions.KEYS = {
    SHOW_TABLE: 'showTable', //简报页面是否立刻展开表格
    COMPARE_DIM: 'compareDim',//
    UPDATE_TIME_COL: 'updateTimeCol',//更新时间的列名
    COMPLEX_TABLE_HEADER: 'complexTableHeader',//使用表格渲染复杂表头
    DISABLE_SUM_AND_AVG: 'disableSumAndAvg',//图禁用计算累计和平均数
    IS_NEW: 'isNew',//页面是否新增的,若true，则菜单显示new标识
    PARENT_PAGE_ID: 'parentPageId',//父页面的index
    PARENT_PAGE_TITLE: 'parentPageTitle',//合并页面时候，显示主题的title
    MERGE_INDICATOR: 'mergeIndicator'//合并几个指标到一个tab中, 配置格式为 指标列n,指标列m(用逗号隔开)->合并到的中文tab名|英文Tab名。多项使用^隔开。注：必须对全部指标列进行配置
    //...可逐步增加，增加程序可读性
}

/**
 * 返回“其他参数中”的@key属性值（字符串）是否是bool的true，不区分大小写
 * @param key
 * @returns {boolean}
 */
OtherOptions.prototype.isTrue = function (key) {
    return this[key] && this[key].toLowerCase() === 'true';
}

/**
 * 返回某key的值
 * @param key
 * @returns {*}
 */
OtherOptions.prototype.get = function (key) {
    return this[key];
}

/*****************End of OtherOptions**********************************/


/**
 * AjaxManager , Added by ljjn1246 on 15-2-5.
 * 处理Ajax请求的入队/出队，abort等操作，用以实现非阻塞（NonBlock）的请求加载
 */

//constructor function
function AjaxManager() {
    this.ajaxQueue = [];//当前对象的ajax请求的working queue，ajax返回成功/失败后应该从队列中删除
}

/********************Static variables*******************/
AjaxManager.lodingMsg = {
    centerX: true,
    centerY: false,
    fadeOut: 0,
    message: '<img src="' + contextPath + '/image/busy.gif" /><span style="font-size: 14px">'+i18n['loading']+'</span>',
    overlayCSS: { backgroundColor: '#fff'},
    css: { /*width:'15vw',*/top: '40px', border: 'none' ,marginLeft: 'auto', marginRight: 'auto'}
};
//********************End of Static variables************//


/************Start of Static Method**************/

//正在加载数据，把$handlers下的内容全部block，并把原内容设为不可见
AjaxManager._loadingContent = function ($handlers, options) {
    $handlers.each(function (i, element) {
        var $content = $(element);
        if(!options || options.hiddenWhenRequest === 'true') {
            $content.children().css('visibility', 'hidden');//把需要的异步加载的内容隐藏，但保留空白
        }
        if(options && options.lodingMsg){
            $content.block($.extend({},AjaxManager.lodingMsg,options.lodingMsg));
        }else {
            $content.block(AjaxManager.lodingMsg);
        }

        //以下是使用插入html的方式的逻辑
        //$content.prevAll().filter(".loading_hint").first().replaceWith(AjaxManager.$loadFail.clone());//移出该handler前的loading 提示
    });
}

//把handers下的内容unblock并把内容重现显示出来
AjaxManager._reShowContent = function ($handlers) {
    $handlers.each(function (i, element) {
        var $content = $(element);
        $content.children().css('visibility', 'visible');
        $content.unblock();

        //以下是使用插入html的方式的逻辑
        //$content.prevAll().filter(".loading_hint").first().replaceWith(AjaxManager.$loadFail.clone());//移出该handler前的loading 提示
    });
}
/***************End of Static Method********************************/


/***************Start of Instance Method****************************/

//把队列中的Ajax请求全部abort
AjaxManager.prototype.abortAllAjaxReq = function () {
    console.log("to abort all ajax requests , length: ", this.ajaxQueue.length);
    //$(".loading_hint").remove();
    do {
        var jqXHR = this.ajaxQueue.shift();//deque the oldest request
        if (jqXHR) jqXHR.abort();
    }
    while (this.ajaxQueue.length > 0);
}


AjaxManager.prototype.nonBlockAjaxWithNoLoading = function ( $handlers, url, json, fSuccess, fFail ) {
    var thisObj = this;
    //发送请求
    $.ajax({
        url: url,
        type: "POST",
        data: json,
        beforeSend: function (jqXHR, settings) {
            thisObj._ajaxEnqueue(jqXHR);//发送前，放入队列
            //AjaxManager._loadingContent($handlers);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                window.location.href = contextPath + "/home.jsp?targetURL=" + window.location.href;
                return;
            }
            console.log('ajax error:', jqXHR, jqXHR.responseText, textStatus, errorThrown);
            if (textStatus === 'abort') {//手动abort
                thisObj._loadSuccess($handlers);//手动撤销，当加载成功处理。
            } else if (jqXHR.status !== 0) {//不是cancel,正确收到响应码
                console.error('load fails, status=', textStatus);
                thisObj._loadFail($handlers);
            }
            if (fFail) fFail(jqXHR, textStatus, errorThrown);//用户传进来的Error callback function
        },
        success: function (result, textStatus, jqXHR) {
            //thisObj._loadSuccess($handlers);
            fSuccess(result);//用户传进来的Success callback function
        },
        complete: function (jqXHR, textStatus) {//无论成功还是失败，ajax请求都出队
            thisObj._ajaxDeque(jqXHR);
        }
    });
}

//不阻塞的ajax数据加载，把handlers的部分改换为$loading的提示
AjaxManager.prototype.nonBlockAjax = function ($handlers, url, json, fSuccess, fFail, options) {
    var thisObj = this;
    //发送请求
    $.ajax({
        url: url,
        type: "POST",
        data: json,
        beforeSend: function (jqXHR, settings) {
            thisObj._ajaxEnqueue(jqXHR);//发送前，放入队列
            AjaxManager._loadingContent($handlers, options);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                window.location.href = contextPath + "/home.jsp?targetURL=" + window.location.href;
                return;
            }
            console.log('ajax error:', jqXHR, jqXHR.responseText, textStatus, errorThrown);
            if (textStatus === 'abort') {//手动abort
                thisObj._loadSuccess($handlers);//手动撤销，当加载成功处理。
            } else if (jqXHR.status !== 0) {//不是cancel,正确收到响应码
                console.error('load fails, status=', textStatus);
                thisObj._loadFail($handlers);
            }
            if (fFail) fFail(jqXHR, textStatus, errorThrown);//用户传进来的Error callback function
        },
        success: function (result, textStatus, jqXHR) {
            thisObj._loadSuccess($handlers);
            fSuccess(result);//用户传进来的Success callback function
        },
        complete: function (jqXHR, textStatus) {//无论成功还是失败，ajax请求都出队
            thisObj._ajaxDeque(jqXHR);
        }
    });
}

//abort队列中的请求再发送ajax请求加载数据
AjaxManager.prototype.abortAllAndNonBlockAjax = function ($handlers, url, json, fSuccess, fFail) {
    this.abortAllAjaxReq();
    this.nonBlockAjax($handlers, url, json, fSuccess, fFail);
}

AjaxManager.prototype._loadSuccess = function ($handlers) {
    AjaxManager._reShowContent($handlers);
}

//注：目前加载成功和加载失败使用同一套逻辑
AjaxManager.prototype._loadFail = function ($handlers) {
    AjaxManager._reShowContent($handlers);
}

AjaxManager.prototype._ajaxDeque = function (jqXHR) {
    console.log("dequeing " + jqXHR);
    for (var i = 0; i < this.ajaxQueue.length; i++) {
        if (jqXHR == this.ajaxQueue[i]) {
            this.ajaxQueue.splice(i, 1)//delete from the queue
            console.log("request ", i, "deques");
            break;
        }
    }
}

AjaxManager.prototype._ajaxEnqueue = function (jqXHR) {
    console.log(jqXHR, " enque");
    this.ajaxQueue.push(jqXHR);
}

/*****************Instance Method Ends*********************/


/********************注：**************************
 若把AjaxManager独立于一个单独的文件，则DataApp依赖于AjaxManager，需要在使用DataApp前引入AjaxManager
 由于legacy code中有非常多页面include单独DataApp.js，可考虑加入以下代码动态加载。
 */

/*
 //动态引入AjaxManager.js，避免在多个页面多次include
 if(typeof AjaxManager =='undefined'){
 console.log('AjaxManager is not loaded , getiing the script');
 $.ajax({
 url: contextPath+'/js/DataApp/AjaxManager.js',
 dataType: "script",
 async:false
 });
 }
 */

/*******************************End of AjaxManager*******************************************************/


// 公共函数
// 发送AJAX请求， error参数可以为空
function ajaxRequest(url, json, fSuccess, fError) {
    return $.ajax({
        url: url,
        type: "POST",
        data: json,
        error: function (xhr, message, obj) {
            if (xhr.status == 401) {
                window.location.href = contextPath + "/home.jsp?targetURL=" + window.location.href;
                return;
            }
            unBlock();
            console.log("ERR:", xhr.responseText, message, obj);
            if (fError) fError(xhr, message, obj);
        },
        success: function (result, textStatus, jqXHR) {
            fSuccess(result, textStatus, jqXHR);
        }
    });


}
//全局函数，用来解析json.option
function parseJsonOption(jsonOption) {
    var keyvalueArray = jsonOption.split(";");
    map = {};
    for (var i = 0; i < keyvalueArray.length; i++) {
        keyvalue = keyvalueArray[i].split(":");
        if (keyvalue.length == 2) {
            map[keyvalue[0]] = keyvalue[1];
        }
    }
    return map;
}

function getOptionFromType(type) {
    var opt = {"defaultType": null, "stacking": null};
    if (type && type.length > 0) {

        var type_stack_list = ['stackedcolumn', 'stackedbar', 'stackedarea'];
        var type_stack_percent_list = ['stackedpercentcolumn', 'stackedpercentbar', 'stackedpercentarea'];

        opt.defaultType = type.replace("stacked", "").replace("percent", "");
        opt.stacking = null;

        if ($.inArray(type, type_stack_list) != -1) {
            opt.stacking = "normal";
        } else if ($.inArray(type, type_stack_percent_list) != -1) {
            opt.stacking = "percent";
        }
    }
    return opt;
};

/**Added by ljjn1246
 * 如果传递过来的数据obj.data少于10行，隐藏$handler中哦好哪个“每页显示XX条数据”的提示
 * @param $handler ,obj
 * @returns {boolean}
 */
function hideTableLengthMenuIfLessThan10($handler, obj) {
    if (!obj.data || obj.data.length < 10) {
        $handler.find('.dataTables_length').hide();
        return true;
    }
    else return false;
}

/********************以下抽取出散落在各个地方的前端图/表配置，以便重用 ljjn1246*************************/

/**Added by ljjn1246
 * 从表格导出时的文件名
 */
function genDownloadFileName(isEng) {
    return (isEng ? "Download-From-GDAS" : "下载自游戏数据分析系统") + new Date().Format("yyyy-MM-dd-hhmmss") + ".xls";
}

/**Added by ljjn1246
 * 返回一个画图的Y轴Label formatter
 * 若是中文环境，则当绝对值大于10000时候，显示XX万,大于100000000时候，显示XX亿
 * 若是英文环境，则当绝对值大于1000时，显示XXK，大于1000000,显示XXM
 */
function yAxisFormatter() {
    var val = this.value;//返回的value
    var absVal = Math.abs(val);//因为对比图时会有负数，取绝对值
    if (GDAS.lang === GDAS.LANG_CHINESE) {//中文，则按照中文习惯以万分位显示
        if (absVal >= 100000000) {
            val = val / 100000000 + "亿"
        }
        else if (absVal >= 10000) {
            val = val / 10000 + "万"
        }
    }
    else if (GDAS.lang === GDAS.LANG_ENGLISH) {//英文，按照千分位显示
        if (absVal >= 1000000) {
            val = val / 1000000 + "M"
        }
        else if (absVal >= 1000) {
            val = val / 1000 + "K"
        }
    }
    return val;
}

/**Added by ljjn1246
 * 返回一个x轴的Label，对于过长的值，截断
 */
function xAxisFormartter() {
    if (typeof(this.value) != 'string') return this.value;
    var s = this.value, cnt = 0, i = 0;
    for (i = 0; i < this.value.length; i++) {
        if (isChinese(this.value.substr(i, 1))) {
            cnt += 2;
        } else {
            cnt += 1;
        }
        if (cnt >= 19) {
            s = s.substring(0, i + 1) + '...';//长于设定值,截断,加上"..."
            break;
        }
    }
    return s;
}

/**
 * 图表用的tooltip formatter， 抽取出来以便将来重用代码
 * @param o,obj
 * @returns {string}
 */
function defaultPlotToolTipFormatter(o, obj) {


    /**
     * 判断是否特殊的例子，如带有'率'，'留存'，'rate'用以判断是否tooltip要format成百分比
     */
    function isPercentageCase(name) {
        var percentage = false;
        if (name &&
            (name.indexOf('率') > -1 ||  /\bRATE\b/.test(name.toUpperCase())
            || name.indexOf('占比') > -1 || /\bRATIO\b/.test(name.toUpperCase())
            || name.indexOf('留存')>-1 || /\bRETENTION\b/.test(name.toUpperCase())
            )) {
            percentage = true;
        }
        return percentage;
    }




    var xName = isValidDate(this.x) ? toDateDesc(this.x) : this.x;
    var s = '<div style="padding:5px;"><b>' + xName + '</b></div>' +
                '<table style="width: 150px">';
    var isStacked = o.chart.options.plotOptions.series.stacking !== null;//是否堆积图
    var points = this.points || [this];//shared =true,则 this.points不为空，若shared=false, 则this.points为空，把this放置到数据中构造一个points。ref: http://api.highcharts.com/highcharts#tooltip

    var percentageCaseFunc = obj.isPercentageCase || isPercentageCase;// 参数传来的是否format成百分比的case 函数，若没有，则使用默认的

    if (points) {
        $.each(points, function (i, point) {//每个点一个tr
            s += '<tr>' +
                    '<td style="padding: 2px 5px;" >' +
                        '<span style="color:' + point.series.color + ';" >' + point.series.name + (point.key && isValidFormatDate(point.key) ? "(" + point.key + ")" : "") + '</span>' +
                    '</td>'
                + '  <td style="text-align: right;padding-left:15px">' +
                        ((point.y == null || point.y == undefined) ? GDAS.EMPTY_RESULT_TEXT :
                            (percentageCaseFunc(point.series.name)? toPercentage(point.y,1) : +point.y.toFixed(2))) ;

            //显示百分比
            if (point.percentage !== undefined && isStacked) { //堆积图
                s += (point.percentage ? "<strong>(" + point.percentage.toFixed(2).replace(".00", "") + "%)</strong>" : "");
            }

            // 添加环比增长率显示
            if (!obj || !obj.opts || //没有传对象
                (obj.opts && obj.opts.showRatio != "false")) //不是显示置为不显示环比
            {
                var mom = null;
                var isXDate = isValidDate(point.x) ||isValidDate(point.key)|| isDisplayDatePattern(point.x);//判断是否日期
                //console.log(point.x,point.key, isXDate);
                if (isXDate) {
                    var prevPoint = DataApp.prototype.findPrevInSeries(point.series, point.key);
                    if (prevPoint != null && prevPoint.y != 0 && !isNaN(prevPoint.y)) {
                        // 计算环比增长率
                        mom = ((parseFloat(point.y) / parseFloat(prevPoint.y) - 1) * 100).toFixed(2);
                        mom = mom > 0 ? "+" + mom : mom;
                    }
                }
                s += mom != null && !isNaN(mom) ? '<td style="text-align: right;padding-left:15px"><span style="color: ' + (mom >= 0 ? '#67A600' : '#C12121') + '">' + mom + '%</span></td>' : '';
            }

            s += '</td>';
            s += '</tr>';
        });
    }
    s += '</table>';
    return s;
}


/**
 * 提取出shared 的判断逻辑，以便将来重用。ljjn1246
 *
 * 根据传递过来的数据决定tooltip是否shared = true
 * 1. 优先按照配置
 * 2. 按照series数量，若series数量少于等于10，shared = true
 * @param obj 具体的数据
 */
function isTooltipShared(obj) {
    var shared = false;
    if (obj.options && obj.options.tooltipShared && (obj.options.tooltipShared.toLowerCase() === 'true' || obj.options.tooltipShared.toLowerCase() === 'false')) {//#43681 ,对于tooltip 有正确自定义设置(true/false),按照自定义设置tooltipShared
        shared = obj.options.tooltipShared.toLowerCase() === 'true' ? true : false;
    }
    else if (obj.series && obj.series.length <= 10) {//没有配置或错误配置，则按照默认规则（数量<=10则显示全部）设置
        shared = true;
    }
    return shared;
}

/**
 * cross hair，目前不根据参数判断
 * @param
 * @returns false || {{color: string, dashStyle: string}}
 */
function defaultTooltipCrossHair(type) {

    var CROSS_HAIRS = {//cross haris对象 ref:http://api.highcharts.com/highcharts#tooltip.crosshairs
        color: '#7ac943',
        dashStyle: 'shortdot'
    };

    return function(){
        var crosshairs = CROSS_HAIRS;
/*        if (type === 'area'||type==='column'||type==='bar') {
           // crosshairs = false;
        }*/
        return crosshairs;
    }();
}

/**
 * 会按照obj的内容自动识别出tooltip是否shared,是否显示环比等
 * obj.opts.showRatio判断是否显示环比
 * tooltipShared和obj.series的长度判断是否shared
 * @param obj
 * @returns {{borderColor: string, borderWidth: number, borderRadius: number, backgroundColor: string, useHTML: boolean, crosshairs: {color: string, dashStyle: string}, shared: *, formatter: formatter}}
 */
function commonTooltipOption(obj){
    var tooltip={
            borderColor: '#666',
            borderWidth: 1,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            useHTML: true,
            crosshairs: {
            color: '#7ac943',
                dashStyle: 'shortdot'
            },
            shared: isTooltipShared(obj),

            formatter:function(o){
                return defaultPlotToolTipFormatter.call(this,o,obj);//绑定正确的this scope
            }
    }
    return tooltip;
}

/**
 * 按照obj.categories，返回一个xAxis的配置对象
 * @param obj
 */
function commonXaxis(obj){
/*    var _step = parseInt((obj.categories.length + 29) / 30);
    var _rotation = (obj.categories.length > 5) ? -45 : 0;*/
    return {
        //categories: obj.categories,
            labels: {
/*                step: _step,
                rotation: _rotation,*/
                align: 'right',
                style: {
                fontSize: '12px',
                    fontFamily: '微软雅黑, Verdana, sans-serif'
            },
            formatter: xAxisFormartter
        }
    }
}

/**
 * added by ljjn1246，抽取出序列排序的逻辑
 * 对序列使用BaseUtil.smartCompare排序，若有配置obj.options['orderSeries'] == 'false'，则不排序
 * @param obj
 */
function sortSeries(obj) {
    console.log("sortSeris....");
    // 对序列的name进行排行，即plot的序列图例
    if (obj.options && obj.options['orderSeries'] == 'false') {
        // 参数指定序列不排序
        console.log("not sort series");
    } else {
        obj.series.sort(function compare(obj1, obj2) {
            return BaseUtil.smartCompare(obj1.name, obj2.name);
        });
        console.log("sort series");
    }
}

/************************************************************************************/

function DataApp() {
    this.name = "DataApp";
    this.ajaxManager = new AjaxManager();
    this.options = {
        isEnglishVersion: false,
        MULTISELECT_OPTIONS_MAX_SIZE: 1000
    };
    GDAS.setHighchartGlobal();
}

// 初始化tips
DataApp.prototype.initTips = function () {
    $('.tip').each(function (index, trigger) {
        $(trigger).val('');

        if ($(this).next().html().length == 0) {
            $(this).hide();
            return;
        }

        $(trigger).bind('click', function (e) {
            var selectState = $(this).val();

            if (selectState == '') {
                $(this).val('selected');
                $(this).next().show().position({my: "left top", at: "right+13 top-10", of: $(this)});
            }
            else if (selectState == 'selected') {
                $(this).val('');
                $(this).next().hide();
            }
        });
        //绑定
        $(document).bind('click', function (e) {
            //length == 0 说明点击位置和trigger与tips浮层不是从属关系，此时隐藏表单。
            if ($(e.target).closest($(trigger)).length == 0 &&
                $(e.target).closest($(trigger).next()).length == 0) {
                $(trigger).next().hide();
                $(trigger).val('');
            }
        });
    });
};

// 延时/延迟调用，用于$("#id").keyup()等函数
DataApp.prototype.delayCall = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

DataApp.prototype.PlotPieRender = function ($handler, obj) {
//	console.info("obj.name",obj);
    //一般情况下饼图配置中obj.categories是不会存在的，
    //假如出现了这个情况应当是在generalSingleDimMultiIndex或者generalDoubleDimMultiIndex做数据重组的时候
    if (obj.categories) {
        var tmpData = obj.series[0]['data'];
        for (var j = 0; j < tmpData.length; j++) {
            var tmpDataVal = tmpData[j];
            tmpData[j] = [categories[j], tmpDataVal];
        }
    }

    var options = {
        credits: {
            enabled: false
        },
        legend: {
            //itemStyle:{display:"block"},
            //itemWidth:obj.itemWidth!=undefined?parseInt(obj.itemWidth):null,
            margin: 30
        },
        exporting: {enabled: false},
        chart: {
            type: 'pie',
            height: obj.height ? obj.height : 600,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: null,
            style: {
                margin: '10px 100px 0 0' // center it
            }

        },
        tooltip: {},
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
//                    color: '#000000',
//                    connectorColor: '#000000',
                    format: '{point.name}: {point.percentage:.1f} %'

                },
                showInLegend: true
            }
        },
        series: obj.series
    }
    var pointSuffix = "";
    if (obj.opts && obj.opts.valType && obj.opts.valType === "1") {
        pointSuffix = "%"
    }
    options.tooltip.pointFormat = '{series.name}: <b>{point.y}' + pointSuffix + '</b>({point.percentage:.1f}%)'
    $handler.highcharts(options);
};

// 时序数据画图
DataApp.prototype.PlotTimeSeriesRender = function ($handler, obj) {

    // yAxisRange
    var yAxisRange = this.getYAxisRange(obj);
    var _min = yAxisRange[0];
    var _max = yAxisRange[1];
    sortSeries(obj);//序列排序
    //console.log("_min, _max", _min, _max);
    var options = {
        chart: {
            type: obj.options && obj.options.defaultType ? obj.options.defaultType : null,
            height: obj.options && obj.options.chartHeight ? obj.options.chartHeight : 400
        },
        credits: {
            enabled: false
        },
        title: {
            text: null,
            style: {
                margin: '10px 100px 0 0' // center it
            }
        },
        xAxis: {
            type: "datetime",//时间轴要加上这个type，默认是linear
            maxPadding: 0.05,
            minPadding: 0.05,
            //tickInterval : 24 * 3600 * 1000 * 2,//两天画一个x刻度
            //或者150px画一个x刻度，如果跟上面那个一起设置了，则以最大的间隔为准
            tickPixelInterval: 150,
            tickWidth: 5,//刻度的宽度
            lineColor: '#990000',//自定义刻度颜色
            lineWidth: 1,//自定义x轴宽度
            gridLineWidth: 1,//默认是0，即在图上没有纵轴间隔线
            //自定义x刻度上显示的时间格式，根据间隔大小，以下面预设的小时/分钟/日的格式来显示
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: this.options.isEnglishVersion ? '%m-%e' : '%m月%e日',
                week: '%e. %b',
                month: '%b \'%y',
                year: '%Y'
            }
        },
        yAxis: {
            title: {
                text: null
            },
            min: _min,
            max: _max,
            labels: {
                formatter: yAxisFormatter
            }
        },
        plotOptions: {
            series: {
                marker: {
                    radius: 2
                },
                stacking: obj.options && obj.options.stacking ? obj.options.stacking : null
            }
        },

        tooltip: {
            borderColor: '#666',
            borderWidth: 1,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            useHTML: true,
            crosshairs: {
                color: '#7ac943',
                dashStyle: 'shortdot'
            },
            shared: (!!obj.tooltipOption) ? obj.tooltipOption.shared : false
        },
        legend: {
            enabled: (obj.options && obj.options.hideLegend) ? false : true
        },
        exporting: {enabled: false},
        //经测试，不能把时间值放到categories里，必须放到series的data里面去
        //这样是不行的：categories:[1274457600000,1274544000000,1274630400000]
        //时间单位是毫秒，Unix时间戳乘上1000
        series: obj.series
    }
    console.log("PlotTimeSeriesRender", obj.series);

    var pointSuffix = "";
    if (obj.opts && obj.opts.valType && obj.opts.valType === "1") {
        options.yAxis.labels = {
            format: '{value}%'
        }
        pointSuffix = "%"
    }

    //tooltips
    options.tooltip.formatter = function () {
        var s = '';
        //return '<b>'+ this.series.name +'</b><br/>('+
        //Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'，'+  Highcharts.numberFormat(this.y, 0) + ')';
        if (!!obj.tooltipOption) {
            var tooltipOption = obj.tooltipOption;
            if (!!tooltipOption.hideDate && !!tooltipOption.shared && tooltipOption.hideDate === true && tooltipOption.shared === true) {
                s = '<div style="padding:5px;"><b>' + Highcharts.dateFormat('%H:%M:%S', this.x) + '</b></div><table style="width: 150px">';
                $.each(this.points, function () {
                    s += '<tr><td style="padding: 2px 5px;" ><span style="color:' + this.series.color + ';" >' + this.series.name + '</span></td>'
                        + '<td style="text-align: right;padding-right:5px">' + Highcharts.numberFormat(this.y, 0) + pointSuffix + ' </td></tr>';
                });
                s += '</table>';
            }
        } else {
            var nX = this.x;
            s = '<div style="padding:5px;"><b>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', nX) + '</b></div><table style="width: 150px">';

            var aSeries =  this.series.chart.series;
            if(aSeries) {
                $.each(aSeries, function(i, oSeries){
                    if(oSeries.visible === true) {
                        var aPoints = oSeries.points;
                        var oPoint = null;
                        if(aPoints) {
                            $.each(aPoints, function(j, oP){
                                if(oP.x === nX) {
                                    oPoint = oP;
                                    return;
                                }
                            });
                        }
                        if(oPoint) {
                            s += '<tr><td style="padding: 2px 5px;" ><span style="color:' + oPoint.series.color + ';" >' + oPoint.series.name + '</span></td>'
                                + '<td style="text-align: right;padding-right:5px;">' + Highcharts.numberFormat(oPoint.y, 0) + pointSuffix + ' </td></tr>';
                        }
                    }
                });
            }
            s += '</table>';
        }

        return s;
    }
    $handler.highcharts(options);
};

DataApp.prototype.getYAxisRange = function (obj) {

    var _min = 0;
    var _max = null;

    if (obj.options && obj.options.yAxisRange) {

        var ss = obj.options.yAxisRange.split(",");
        var yrangepair_num = Math.floor(ss.length / 2) + ss.length % 2;

        var current_index = $("div#main_content div.indicator_basic div.tabs a").index($("div#main_content div.indicator_basic div.tabs a.current"));

        var min_index = (current_index % yrangepair_num) * 2;
        if (min_index >= 0) {
            _min = isNaN(ss[ min_index ]) ? null : parseInt(ss[ min_index ]);
            if (min_index + 1 > ss.length - 1) {
                _max = null;
            } else {
                _max = isNaN(ss[ min_index + 1 ]) ? null : parseInt(ss[min_index + 1]);
            }
        }
    }
    return new Array(_min, _max);
};

// 普通数据画图
DataApp.prototype.PlotRender = function ($handler, obj, opt) {
    var thisObj = this;
    $handler.empty();

    if (obj.series && obj.series.length == 0) {
        var html = ['<div class="emptyMessage">'];
        if (thisObj.options.isEnglishVersion) {
            html.push("<span>No data found</span>");
            if (obj.options && obj.options['emptyTipsEN']) {
                html.push("<span>" + obj.options['emptyTipsEN'] + "</span>");
            }
        } else {
            html.push("<span>没有数据</span>");
            if (obj.options && obj.options['emptyTips']) {
                html.push("<span>" + obj.options['emptyTips'] + "</span>");
            }
        }
        html.push('</div>');
        $handler.html(html.join(''));
        /*数据为空，隐藏视图*/
        $("div.changePlotType").hide();
        this.initSumAndAvgBtn($handler, obj);//由于之前的过滤条件可能已经初始化显示此按钮，这里重新初始化【累计/平均值按钮】，让其隐藏
        console.log("obj", obj);
        return;
    }
    //如果数据非空，则保存数据,显示视图
    $("#indicator_basic_plot_result").attr({"data-obj": JSON.stringify(obj)});

    // 对序列的name进行排行，即plot的序列图例
    if (obj.options && obj.options['orderSeries'] == 'false') {
        // 参数指定序列不排序
        console.log("not sort series");
    } else {
        obj.series.sort(function compare(obj1, obj2) {
            return BaseUtil.smartCompare(obj1.name, obj2.name);
        });
        console.log("sort series");
    }

    /* Added by ccn1069: 图形显示序列过多默认仅显示前N条 */
    var nShownCount = 10000;
    if (obj.options && obj.options.defaultShownSeries && !isNaN(obj.options.defaultShownSeries)) {
        nShownCount = parseInt(obj.options.defaultShownSeries);
    }

    if (obj.series && obj.series.length > 0) {
        var i =0;
        while (i < obj.series.length && i < nShownCount) {
            obj.series[i].visible = true;
            i++;
        }
        while (i < obj.series.length) {
            obj.series[i].visible = false;
            i++;
        }
    }
    /* Added by ccn1069: 图形显示序列过多默认仅显示前N条 */

    // timeseries
    if (obj.type == 'timeseries') {
        thisObj.PlotTimeSeriesRender($handler, obj);
        $("div.changePlotType").show();
        return; // plot timeseries end and return
    }
    //pie
    if (obj.type == 'pie' || ( obj.options && obj.options.defaultType === "pie")) {
        thisObj.PlotPieRender($handler, obj);
        return;
    }
    //其他
    $("div.changePlotType").show();

    this.initSumAndAvgBtn($handler, obj);//按照传来的数据和配置初始化【累计/平均值按钮】


    //如果数据非空，则保存数据,显示视图
    $("#indicator_basic_plot_result").attr({"data-obj": JSON.stringify(obj)});
    // general plot
    var _step = parseInt((obj.categories.length + 29) / 30);
    if (!!opt && !!opt.xStep) {
        _step = opt.xStep;
    }
    var _rotation = (obj.categories.length > 5) ? -45 : 0;
    // var _gameName = obj.gameName;

    // yAxisRange

    var yAxisRange = this.getYAxisRange(obj);
    var _min = yAxisRange[0];
    var _max = yAxisRange[1];
    //console.log("_min, _max", _min, _max);
    var defaultEvents = {};
    var defaultLegend = {
        x: 10,
        y: 10,
        maxHeight: 64,
        borderWidth: 0
    };

    var options = {
        chart: {
            renderTo: "",
            zoomType: 'xy',
            height: obj.options && obj.options.chartHeight ? obj.options.chartHeight : 400,
            type: obj.type ? obj.type : (obj.options && obj.options.defaultType ? obj.options.defaultType : null),
            events: obj.options && obj.options.events ? obj.options.events : defaultEvents
        },
        credits: {
            enabled: false
        },
        title: {
            text: obj["title"],
            margin: 5,
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: '微软雅黑'
            }
        },
        subtitle: {
            text: obj["subtitle"],
            x: -20
        },
        xAxis: {
            categories: obj.categories,
            labels: {
                step: _step,
                rotation: _rotation,
                align: 'right',
                style: {
                    fontSize: '12px',
                    fontFamily: '微软雅黑, Verdana, sans-serif'
                },
                formatter: xAxisFormartter
            }
        },
        yAxis: {
            title: "",
            min: _min,
            max: _max,
            // 是否显示纵坐标小数刻度, default:false;
            allowDecimals: obj.options && ("true" == obj.options.yAxisAllowDecimals || obj.options.yAxisAllowDecimals === true ),
            // y轴倒序, default=false;
            reversed: obj.options && "true" == obj.options.yAxisReversed,
            labels: {
                formatter: yAxisFormatter
            }
        },
        legend: obj.options && obj.options.legend ? obj.options.legend : defaultLegend,
        plotOptions: {
            series: {
                marker: {
                    radius: 3
                },
                stacking: obj.options && obj.options.stacking ? obj.options.stacking : null
            }
        },
        tooltip: {
            borderColor: '#666',
            borderWidth: 1,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            useHTML: true,
            crosshairs: {
                color: '#7ac943',
                dashStyle: 'shortdot'
            },
            shared: false
        },
        exporting: {enabled: false},
        series: obj.series
    };
    var pointSuffix = "";
    if (obj.opts && obj.opts.valType && obj.opts.valType === "1") {
        options.yAxis.labels = {
            format: '{value}%'
        }
        pointSuffix = "%"
    }
    // 如果series不超过10条线，tooltip可同时显示
    if (obj.type && obj.type != 'line') {
        options.tooltip.crosshairs = false;
    }

    if (obj.options.tooltipShared && (obj.options.tooltipShared.toLowerCase() === 'true' || obj.options.tooltipShared.toLowerCase() === 'false')) {//#43681 ,对于tooltip 有正确自定义设置(true/false),按照自定义设置tooltipShared
        options.tooltip.shared = obj.options.tooltipShared.toLowerCase() === 'true' ? true : false;
    }
    else if (obj.series && obj.series.length <= 10) {//没有配置或错误配置，则按照默认规则（数量<=10则显示全部）设置
        options.tooltip.shared = true;
    }


    // tooltip
    options.tooltip.formatter = function () {
        var isXDate = isValidDate(this.x);
        var xName = isXDate ? toDateDesc(this.x) : this.x;

        var s = '<div style="padding:5px;"><b>' + xName + ' </b></div> ' +
            //'<div style="max-height:250px ;min-width: 170px; overflow-y:auto;overflow-x:hidden ">' +//make a scroll bar to y axis when over 250px
            '<table style="width: 150px">';
        if (this.points) {
            $.each(this.points, function (i, point) {
                //console.log(i, point);
                s += '<tr><td style="padding: 2px 5px;" ><span style="color:' + point.series.color + ';" >' + point.series.name + (point.key && isValidFormatDate(point.key) ? "(" + point.key + ")" : "") + '</span></td>'
                    + '<td style="text-align: right;padding-left:15px">' + BaseUtil.FormatNumberWithCommas(point.y);

                if (point.percentage != undefined) {
                    s += (point.percentage ? "<strong>(" + point.percentage.toFixed(2).toString().replace(/\.0*$/, "") + "%)</strong>" : "");
                } else {
                    s += pointSuffix;
                }
                s += '</td>';

                // 添加环比增长率显示
                if (!thisObj.meta || thisObj.meta.options.showRatio != "false") {
                    var mom = null;
                    if (isXDate) {
                        var prevPoint = thisObj.findPrevInSeries(point.series, point.key);
                        if (prevPoint != null && prevPoint.y != 0 && !isNaN(prevPoint.y)) {
                            // 计算环比增长率
                            mom = ((parseFloat(point.y) / parseFloat(prevPoint.y) - 1) * 100).toFixed(2);
                            mom = mom > 0 ? "+" + mom : mom;
                        }
                    }
                    s += mom != null && !isNaN(mom) ? '<td style="text-align: right;padding-left:15px"><span style="color: ' + (mom >= 0 ? '#67A600' : '#C12121') + '">' + mom + '%</span></td>' : '';
                }

                s += '</tr>';
            });
        } else {
            s += '<tr><td style="padding: 2px 5px;" ><span style="color:' + this.series.color + ';" >' + this.series.name + '</span></td>'
                + '<td style="text-align: right;padding-left:15px">' + BaseUtil.FormatNumberWithCommas(this.y);

            if (this.percentage != undefined) {
                s += (this.percentage ? "<strong>(" + this.percentage.toFixed(2).toString().replace(/\.0*$/, "") + "%)</strong>" : "") + ' </td>';
            } else {
                s += pointSuffix + ' </td>';
            }

            // 添加环比增长率显示
            if (!thisObj.meta || thisObj.meta.options.showRatio != "false") {
                var mom = null;
                if (isXDate) {
                    var prevPoint = thisObj.findPrevInSeries(this.series, this.key);
                    if (prevPoint != null && prevPoint.y != 0 && !isNaN(prevPoint.y)) {
                        // 计算环比增长率
                        mom = ((parseFloat(this.y) / parseFloat(prevPoint.y) - 1) * 100).toFixed(2);
                        mom = mom > 0 ? "+" + mom : mom;
                    }
                }
                s += mom != null && !isNaN(mom) ? '<td style="text-align: right;padding-left:15px"><span style="color: ' + (mom >= 0 ? '#67A600' : '#C12121') + '">' + mom + '%</span></td>' : '';
            }

            s += '</tr>';
        }

        s += '</table>';
        //'</div>';
        return s;
    };
    return $handler.highcharts(options);

};


DataApp.prototype.RenderComplexTableHeader = function ($table, obj) {
    var tmpAllData = obj.data;
    var complexHeaderArr = [];
    for (var i = 0; i < tmpAllData.length; i++) {
        if (complexHeaderArr.indexOf(tmpAllData[i][1]) === -1) { //还没有就添加进去
            complexHeaderArr.push(tmpAllData[i][1]);
        }
    }
    // 智能排序
    complexHeaderArr.sort(BaseUtil.smartCompare);
    var colspan = complexHeaderArr.length;
    var rowspan = 1;
    var thead = "<thead>";
    //第一行表头
    thead += '<tr>';
    var thStyle = "";
    for (var i = 0; i < obj.thead.length; i++) {
        thStyle = "text-align:center;border:0px;border-top:1px solid #b1b1b1;border-left: 1px solid #b1b1b1;";
        if (i === 0) { //日期
            thStyle = "text-align:center;border-top:1px solid #b1b1b1;";
        }

        if (i === 1) {
            continue;
        }
        thead += '<th colspan="' + (( i === 0 ) ? 1 : colspan) + '" rowspan="' + (( i === 0 ) ? 2 : rowspan) + '" style="' + thStyle + '">' + obj.thead[i];
        thead += '</th>';
    }
    thead += '</tr>';

    //第二行表头
    thead += '<tr>';
    for (var j = 0; j < (complexHeaderArr.length) * (obj.thead.length - 2); j++) {
        thead += '<th colspan="1" rowspan="1">' + complexHeaderArr[j % ( complexHeaderArr.length )];
        thead += '</th>';
    }
    thead += '</tr>';

    thead += '</thead>';
    $table.append($(thead));
    return complexHeaderArr;
};

//分类表头
DataApp.prototype.RenderClassifyTableHeader = function ($table, obj, colIdx){
    var classifyHeader = [];
    var classItemMap = {};
    $.each(obj.data, function(i, lineData){
        var fullItemName = lineData[colIdx];
        var className = fullItemName.split('^^')[0];
        var itemName = fullItemName.split('^^')[1];
        if(classifyHeader.indexOf(className) == -1){
            classifyHeader.push(className);
            classItemMap[className] = [];
        }
        if(classItemMap[className].indexOf(itemName) == -1){
            classItemMap[className].push(itemName);
        }
    });

    classifyHeader.sort(BaseUtil.smartCompare);
    var firstLayerColSpan = 0;
    $.each(classifyHeader, function(i, className){
        firstLayerColSpan += classItemMap[className].length;
        classItemMap[className].sort(BaseUtil.smartCompare);
    });
    var thead = '<thead>';
    //第一行表头
    thead += '<tr>';
    var thStyle = "";
    for (var i = 0; i < obj.thead.length; i++) {
        thStyle = "text-align:center;border:0px;border-top:1px solid #b1b1b1;border-left: 1px solid #b1b1b1;";
        if (i < colIdx) {
            thStyle = "text-align:center;border-top:1px solid #b1b1b1;";
        }

        if (i === colIdx) {
            continue;
        }
        thead += '<th colspan="' + (( i < colIdx ) ? 1 : firstLayerColSpan) + '" rowspan="' + (( i < colIdx ) ? 3 : 1) + '" style="' + thStyle + '">' + obj.thead[i];
        thead += '</th>';
    }
    thead += '</tr>';

    //第二行表头和第三行表头
    var second = [], third = [];
    for (var i=0; i< classifyHeader.length * (obj.thead.length - (colIdx + 1)); i++){ //可能有多个指标
        var className = classifyHeader[i % (classifyHeader.length)];
        var itemNames = classItemMap[className];
        thStyle = "text-align:center;border:0px;border-top:1px solid #b1b1b1;border-left: 1px solid #b1b1b1;";
        second.push('<th colspan="'+ itemNames.length +'" rowspan="1" style="'+ thStyle +'">' + className + '</th>');
        for(var j=0; j<itemNames.length; j++){
            third.push('<th colspan="1" rowspan="1" style="border-left: 1px solid #b1b1b1;">' + itemNames[j] + '</th>')
        }
    }

    thead+= '<tr>' + second.join('') + '</tr>';
    thead+= '<tr>' + third.join('') + '</tr>';
    $table.append($(thead));
    return {
        classNames: classifyHeader,
        classItemMap: classItemMap,
        itemCount: firstLayerColSpan
    };
};

// 表格渲染
DataApp.prototype.TableRender = function ($handler, obj, options, preSortIndex) {//preSortIndex表示表格第一次渲染时候需要按照哪一列进行排序
    var thisObj = this;
    $handler.html('<table cellpadding="0" cellspacing="0" border="0" class="display"></table>');

    if (preSortIndex >= 0) { //发现table需要预排序（-1表示不需要排序预处理）
        obj.data.sort(function (o1, o2) {//使obj.data按照时间由近到远排序
            if (o1[preSortIndex] == o2[preSortIndex]) return 0;
            return o1[[preSortIndex]] > o2[[preSortIndex]] ? -1 : 1;
        });
    }

    var aoColumns = new Array();
    var aaData = obj.data;
    var complexData = [];
    var complexColDataSturcture = [];
    var aaSorting = [];
    if (options && options.complexTableHeader === "true") {
        var indexColCount = obj.thead.length - 2;
        //画复杂表头
        var complexHeaderArr = this.RenderComplexTableHeader($handler.children("table"), obj);
        var tmpAllData = obj.data;
        //表头画完后，数据也需要重新组织
        var complexDataObj = {
            'dateArr': [],
            'dataArr': []
        }

        for (var i = 0; i < tmpAllData.length; i++) {
            var tmpDataObj = {
                date: '',
                compareDim: '',
                value: []
            }
            for (var j = 0; j < tmpAllData[i].length; j++) {

                if (j === 0) { //日期数据去重
                    if (complexDataObj['dateArr'].indexOf(tmpAllData[i][j]) === -1) { //还没有就添加进去
                        complexDataObj['dateArr'].push(tmpAllData[i][j]);
                    }
                    tmpDataObj['date'] = tmpAllData[i][j];
                } else if (j === 1) {
                    tmpDataObj['compareDim'] = tmpAllData[i][j];
                } else {
                    tmpDataObj['value'].push(tmpAllData[i][j]);
                }
            }
            complexDataObj['dataArr'].push(tmpDataObj);
        }

        //数据行结构
        complexColDataSturcture = ['date'];
        for (var indexCount = 0; indexCount < indexColCount; indexCount++) {
            complexColDataSturcture = complexColDataSturcture.concat(complexHeaderArr);
        }

        var aoCol = {//普通列的属性
            "sType": "mytype",
            "asSorting": ['desc', 'asc']
        };

        //#43866 [bug]点击日期后表格列宽明显变化  ,options.complexTableHeader === "true"

        for (var colCount = 0; colCount < complexColDataSturcture.length; colCount++) {
            if ($handler.children('table:first').find('th:first').text() === '日期' && colCount === 0) {//专门为日期列设置一个固定宽度(暂时仅适用于options.complexTableHeader === "true") ，by #43866 [bug]点击日期后表格列宽明显变化
                var dateAoCol = jQuery.extend(true, {"sWidth": "5em"}, aoCol);//Deep copy一个col对象专门给第一列（日期）用，固定其宽度，避免排序时dataTable重新计算宽度,
                aoColumns.push(dateAoCol);
            }
            else {//其他列
                aoColumns.push(aoCol);
            }
        }

        //初始化新的数据
        for (var k = 0; k < complexDataObj['dateArr'].length; k++) {
            complexData[k] = [];
            for (var l = 0; l < complexColDataSturcture.length; l++) { //初始化每行数据
                complexData[k][l] = "";
                if (l === 0) {
                    complexData[k][l] = complexDataObj['dateArr'][k]; //填充不重复的日期
                }
            }
        }
        //中间临时数组
        var tmpComplexData = [];

        for (var m = 0; m < complexDataObj['dataArr'].length; m++) {
            var tmpComplexDataObj = {};
            var tmpCmpDimObj = {};
            tmpCmpDimObj[complexDataObj['dataArr'][m]['compareDim']] = complexDataObj['dataArr'][m]['value'];
            tmpComplexDataObj[complexDataObj['dataArr'][m]['date']] = tmpCmpDimObj;
            tmpComplexData.push(tmpComplexDataObj);
        }

        var tmpComplexRes = {};
        for (var n = 0; n < tmpComplexData.length; n++) {
            tmpComplexRes = $.extend(true, tmpComplexRes, tmpComplexData[n]);
        }

        $.each(tmpComplexRes, function (key) {
            for (var i = 0; i < complexData.length; i++) {
                if (complexData[i][0] === key) {
                    $.each(tmpComplexRes[key], function (dimKey) {
                        if (complexColDataSturcture.indexOf(dimKey) !== -1) {
                            var index = complexColDataSturcture.indexOf(dimKey);
                            var values = tmpComplexRes[key][dimKey];
                            for (var j = 0; j < values.length; j++) {
                                complexData[i][index + ( complexHeaderArr.length ) * j ] = values[j];
                            }
                        }
                    });
                }
            }
        });

        //空值处理
        for (var k = 0; k < complexData.length; k++) {
            //console.log(complexData[k]);
            for (var l = 0; l < complexData[k].length; l++) {
                if (complexData[k][l] === "") {
                    complexData[k][l] = "-";
                }
            }
        }
        //复杂表头使用的表格数据赋值
        aaData = complexData;
        if (aaData.length === 0) { //没数据
            $handler.children("table").empty();
        }

    } else if(options && options['itemClassifyHeader'] === "true"){
        var has_reason_dim = options['reasonDim'] !== undefined;
        var indexColCount = obj.thead.length - (has_reason_dim ? 3 : 2);
        var colIdx = has_reason_dim ? 2 : 1;
        var classifyHeaderObj = this.RenderClassifyTableHeader($handler.children("table"), obj, colIdx);
        var complexDataObj = {
            'dateArr':[],
            'dateObj': {}
        };
        var fakeReason = 'REASON';
        $.each(obj.data, function(i, lineData){
            var dateid = lineData[0];
            var reason = has_reason_dim ? lineData[1] : fakeReason;
            var itemName = has_reason_dim ? lineData[2] : lineData[1];
            var valFieldStart = has_reason_dim ? 3 : 2;
            if(complexDataObj['dateArr'].indexOf(dateid) == -1){
                complexDataObj['dateArr'].push(dateid);
                complexDataObj['dateObj'][dateid] = {
                    'reasonArr': [],
                    'reasonObj': {}
                }
            }
            if(complexDataObj['dateObj'][dateid]['reasonArr'].indexOf(reason) == -1){
                complexDataObj['dateObj'][dateid]['reasonArr'].push(reason);
                complexDataObj['dateObj'][dateid]['reasonObj'][reason] = {
                    'itemArr' : [],
                    'itemObj' : {}
                }
            }
            if(complexDataObj['dateObj'][dateid]['reasonObj'][reason]['itemArr'].indexOf(itemName) == -1){
                complexDataObj['dateObj'][dateid]['reasonObj'][reason]['itemArr'].push(itemName);
                complexDataObj['dateObj'][dateid]['reasonObj'][reason]['itemObj'][itemName] = {
                    'valArr' : []
                }
            }
            for(var j = valFieldStart; j< lineData.length; j++){
                complexDataObj['dateObj'][dateid]['reasonObj'][reason]['itemObj'][itemName]['valArr'].push(lineData[j]);
            }
        });
        var structuredTableData =[];
        $.each(complexDataObj['dateArr'], function(i, dateid){
            var dateObj = complexDataObj['dateObj'][dateid];
            $.each(dateObj['reasonArr'], function(j, reason){
                var reasonObj = dateObj['reasonObj'][reason];
                var itemObj = reasonObj['itemObj'];
                var structuredTableLine = [dateid];
                var offset = 1;
                if(has_reason_dim){
                    structuredTableLine.push(reason);
                    offset = 2;
                }
                for(var m=0; m<indexColCount * classifyHeaderObj.itemCount; m++){
                    structuredTableLine.push('-');
                }
                $.each(classifyHeaderObj.classNames, function(m, className){
                    var itemNames = classifyHeaderObj.classItemMap[className];
                    $.each(itemNames, function(n, itemName){
                        var fullItemName = className + '^^' + itemName;
                        if(itemObj[fullItemName] !== undefined){
                            $.each(itemObj[fullItemName]['valArr'], function(p, val){
                                structuredTableLine[offset + p * classifyHeaderObj.itemCount] = val;
                            })
                        }
                        offset += 1;
                    })
                })
                structuredTableData.push(structuredTableLine);
            })
        });
        aaData = structuredTableData;
        if (aaData.length === 0) { //没数据
            $handler.children("table").empty();
        }
    } else {
        for (var i = 0; i < obj.thead.length; i++) {
            aoColumns.push({"sTitle": obj.thead[i], "sType": "mytype", "asSorting": ["desc", "asc"]});
        }
    }


    //console.log(aoColumns, aaData);
    var sDom = '<"top"iT>rt<"clear">';//http://legacy.datatables.net/usage/options#sDom
    if (aaData && aaData.length > 10) {
        sDom += '<"bottom"flp>';//显示“每页显示”，翻页，查找
    }
    var tb_options = {
        "sDom": sDom, //'<"top"iT>rt<"bottom"flp><"clear">',
        "oTableTools": {
            "sSwfPath": contextPath + "/js/DataTables/media/swf/copy_csv_xls_pdf.swf",
            "aButtons": [
                {
                    "sExtends": "copy",
                    "sButtonText": thisObj.options && thisObj.options.isEnglishVersion ? "Copy" : "复制"
                },
                {
                    "sExtends": "xls",
                    "sButtonText": thisObj.options && thisObj.options.isEnglishVersion ? "Save" : "保存",
                    /*"sFileName": genDownloadFileName(thisObj.options && thisObj.options.isEnglishVersion),*/
                    "fnClick": function (nButton, oConfig, oFlash) {//保存按钮的callback
                        oFlash.setFileName(genDownloadFileName(thisObj.options && thisObj.options.isEnglishVersion));//使用dataApp中的方法动态生成文件名
                        this.fnSetText(oFlash, this.fnGetTableData(oConfig));//因为覆盖了fnClick事件函数，需要补上这句否则下载的文件为空
                    }
                }
            ]
        },
        "iDisplayLength": (!!options && !!options['displayLength']) ? options['displayLength'] : 10,
        "aaData": aaData,
        //"aoColumns" : aoColumns,
        "sPaginationType": "full_numbers",
        "sScrollX": "100%",
        "bAutoWidth": false,
        /* Disable initial sort */
        "aaSorting": [],
        "aoColumnDefs": options && options.aoColumnDefs ? options.aoColumnDefs : [],
        "fnDrawCallback": function (oSettings) {
            //确保是排序事件，才执行回调函数
            //console.log("oSettings",oSettings);
            var $thead = $handler.find(".dataTables_scrollHeadInner table thead");
            var isSorting = false;
            $thead.children("tr").each(function (i) {
                $(this).children("th").each(function (j) {
                    if (!$(this).hasClass("sorting") && ($(this).hasClass("sorting_desc") || $(this).hasClass("sorting_asc"))) {
                        isSorting = true;
                        $("#indicator_basic_plot_result").attr("data-sortevent", "1");
                        return;
                    }
                });
                if (isSorting)
                    return;
            });
            if ($("#indicator_basic_plot_result").attr("data-tableobj") && $("#indicator_basic_plot_result").attr("data-sortevent") == "1") {
                $("#indicator_basic_plot_result").attr({"data-sortevent": "0"});
                //如果是时序图，则不做任何改变
                if ($("#indicator_basic_plot_result").attr("data-jspType") && $("#indicator_basic_plot_result").attr("data-jspType") == "TimeSeries") {
                    return;
                }
                saveScroll();
                //更新数据
                var data = this.fnGetData(); // do not change even after sorting
                //防止查找后点击排序造成错误
                if (data.length != oSettings.aiDisplay.length) {
                    return;
                }
                var result = new Array(data.length);
                for (var i = 0; i < oSettings.aiDisplay.length; i++) {
                    result[i] = data[oSettings.aiDisplay[i]];
                }
                $("#indicator_basic_plot_result").attr({"data-tableobj": JSON.stringify(result)});
                //更新数据，根据表格的排序方式，更新图的表现形式
                $("#main_content .indicator_basic_plot").each(function (index, element) {
                    if ($(element).find(".tabs a.current").size() > 0) {
                        $(element).find(".tabs a.current").trigger('click');
                    } else {
                        $(element).find(".tabs a:eq(0)").trigger('click');
                    }
                });

                loadScroll();
            }

        }
    };

    if (aoColumns.length > 0) {
        tb_options['aoColumns'] = aoColumns;
    }

    if (!this.options || !this.options.isEnglishVersion) {
        tb_options["oLanguage"] = {
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
        };
    }

    try {

        var tableDataObj = $handler.find("table").dataTable(tb_options);
        var tbData = tableDataObj.fnGetData();
        var plotData = tbData;//默认情况下，图表数据和表格数据一致，但如果表格需要预处理，则重新排序
        if (preSortIndex >= 0) {//若proSortIndex>=0，证明一开始表格(line 940)已经按照时间倒序了
            plotData.sort(function (o1, o2) {//使图表数据按照时间正序排序
                if (o1[preSortIndex] == o2[preSortIndex]) return 0;
                return o1[[preSortIndex]] > o2[[preSortIndex]] ? 1 : -1;
            });
        }
        $("#indicator_basic_plot_result").attr({"data-tableobj": JSON.stringify(plotData)});
        $("#indicator_basic_plot_result").attr({"data-tableheadobj": JSON.stringify(complexColDataSturcture)});

        //表的结构改变了，图的结构一定会改变
        $("#main_content .indicator_basic_plot").each(function (index, element) {
            if ($(element).find(".tabs a.current").size() > 0) {
                $(element).find(".tabs a.current").trigger('click');
            } else {
                $(element).find(".tabs a:eq(0)").trigger('click');
            }
        });
    } catch (err) {
        console.log("表格渲染出错了", err);
    }

};

// 获得参数
DataApp.prototype.getParameterObject = function ($handler) {
    var json = {};

    // 日期类型，日/周/月
    json.dateType = $("#main_content .indicator_header .dateTypeSwitcher").find("a.current").attr("data-value");

    $("#main_content").find(".indicator_header .content [name]").each(function (index, element) {
        name = this.name;
        value = $(this).val();
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
};

// 初始化日/周/月切换开关
DataApp.prototype.dateTypeSwitcherInit = function (url, json, callback) {
    var thisObj = this;
    var dateType_lst = json.dateType.split(",");
    var isEnglishVersion = json.EnglishVersion;
    var $dateTypeSwitcher = $("#main_content .indicator_header .dateTypeSwitcher");

    $.each(dateType_lst, function (i, dateType) {
        var dateTypeLang = isEnglishVersion ? 'Day' : '日';
        if (dateType === "week") {
            dateTypeLang = isEnglishVersion ? 'Week' : '周';
        } else if (dateType === "month") {
            dateTypeLang = isEnglishVersion ? 'Month' : '月';
        }
        $("<a href='javascript:;' ></a>").attr("data-value", dateType).html(dateTypeLang).bind('click',function () {
            $(this).siblings().removeClass("current");
            $(this).addClass("current");
            if (callback) {
                callback(url);
            } else {
                thisObj.generalQuery(url);
            }
        }).appendTo($dateTypeSwitcher);
    });

    $dateTypeSwitcher.find("a:first").addClass("current");

    if ($dateTypeSwitcher.find("a").size() < 2) {
        $dateTypeSwitcher.hide();
    }
};

// 初始化标签切换时绑定的事件
DataApp.prototype.tabClickInit = function (url, json) {
    // render tabs and bind to click functions

    var columnNameLang_lst = json.columnNameLang.split("^"), //指标中文名
        columnName_lst = json.columnName.split("^"), //指标名
        $handler = $("#main_content .indicator_basic .tabs");
    var jsonOption = parseJsonOption(json.option);
    //扩展配置
    var opts = $.extend({}, json, jsonOption);

    //保存页面类型TimeSeries 或者CompareAnalysis,用于时序图不能根据表格数据的动态变化来重画检测
    $("#indicator_basic_plot_result").attr({"data-jspType": opts.jspName});
    console.log("json+option: ", opts);
    var thisObj = this;
    //如果是饼图的话，隐藏视图
    if (opts.defaultType && opts.defaultType == 'pie') {
        //隐藏视图
        $("div.changePlotType").hide();
    }
    if (opts.indexName) { // 多个指标值同时显示
        var tagText = opts.indexName;
        $("<a href='javascript:;' ></a>").attr("data-value", json.columnNameLang).html(tagText).bind('click',function (event) {
            event.stopPropagation();
            //获取前端控件的参数
            var json = thisObj.getParameterObject($(this));
            //从数据表中生成数据
            thisObj.generalPlotFromTable($(this), 0, '', url, opts, json);
        }).appendTo($handler);
    }
    else if (opts[OtherOptions.KEYS.MERGE_INDICATOR]) {//可配置的合并指标到自定义的tab，使得多个指标可以同时显示到一个tab
        var indicators = json.columnNameLang.split(/\^/);//指标的名字
        var mergeOpts = opts[OtherOptions.KEYS.MERGE_INDICATOR].split(/\^/);//合并配置的规则
        for (var i = 0; i < mergeOpts.length; i++) {
            var opt = mergeOpts[i].split('->');//一个配置
            var mergingIndexs = opt[0].split(',');
            var tabCNEN = opt[1].split('|');//中英文分隔符"|"
            var tabIndex = (GDAS.isEnglishVersion && tabCNEN.length>1)? 1: 0 ;//如果配置了英文，则取tabIndex=1
            var mergingTag =tabCNEN[tabIndex];//合并的tab名，分中英文
            var mergingIndicator = "";
            var mergingIndicatorIndex = "";
            for (var j = 0; j < mergingIndexs.length; j++) {
                mergingIndicator += indicators[j] + '^';
                mergingIndicatorIndex += mergingIndexs[j] + '^';
            }
            var mergingIndicator = mergingIndicator.substring(0, mergingIndicator.lastIndexOf('^'));
            var mergingIndicatorIndex = mergingIndicatorIndex.substring(0, mergingIndicatorIndex.lastIndexOf('^'));
            $("<a href='javascript:;' ></a>").attr('data-value', mergingIndicator).attr('merge-index', mergingIndicatorIndex)
                .html(mergingTag).off('click').on('click',function (e) {
                    e.stopPropagation();
                    var json = thisObj.getParameterObject();
                    //从数据表中生成数据
                    thisObj.generalPlotFromTable($(this), $(this).index(), '', url, opts, json);//第i个tab 被click了
                }).appendTo($handler);
        }//end of for loop
    }
    else if (columnNameLang_lst.length == columnName_lst.length) {
        $.each(columnNameLang_lst, function (i, o) {
            $("<a href='javascript:;' ></a>").attr("data-value", columnName_lst[i]).html(o).bind('click',function (event) {
                event.stopPropagation();
                //获取前端控件的参数
                var json = thisObj.getParameterObject($(this));
                //从数据表中生成数据
                thisObj.generalPlotFromTable($(this), i, o, url, opts, json);
            }).appendTo($handler);
        });
    }
};

/**
 *
 * @param tableData 二维数据，但只有一行
 * @param fieldObj 元数据对象
 */
DataApp.prototype.generalNoDimMultiIndex = function (tableData, fieldObj) {
    console.log('tableData', tableData, 'fieldObj', fieldObj);

    var obj = {};
    obj["type"] = fieldObj.defaultType;
    obj["categories"] = [fieldObj.indexName];

    var names = fieldObj.columnNameLang.split(/,|\^/); // 按,或^分隔

    var value, series = [];
    for (var i = 0; i < tableData[0].length; i++) {
        value = parseFloat(tableData[0][i]);
        series.push({
            "data": [isNaN(value) ? null : value],
            "name": names[i]
        });
    }
    obj['series'] = series;
    obj['options'] = fieldObj.options; // 原因是将传递参数orderSeries:false;

    console.log('generalNoDimMultiIndex() return obj = ', obj);
    return obj;
};

/*
 * 根据表格数据生成时序图的数据格式
 * @param tbdata 二维数组 表数据
 * @param index  一维数组 指标的下标数组
 * @param indexName 一维数组 对应的指标名数组
 * @param paramJSON {key:value} 前端选择的控制参数
 * @param kvs {key:value} 自定义画图的参数
 */
DataApp.prototype.generalTimeSeriesSingleDimMultiIndex = function (tbdata, index, indexName, paramJSON, kvs) {
    var obj = {};
    obj["type"] = "timeseries";
    if (kvs) {
        var kvArray = kvs.split(";");
        var opts = {};
        for (var i = 0; i < kvArray.length; i++) {
            var kv = kvArray[i].split(":");
            if (kv.length == 2) {
                obj[kv[0]] = kv[1];

                if ("type" == (kv[0])) {
                    opts["defaultType"] = kv[1];
                }

                if ("yaxis" == (kv[0])) {
                    opts["yaxis"] = kv[1];
                }
            }
        }
        obj["opts"] = opts;
    }
    series = [];
    for (var i = 0; i < index.length; i++) {
        elementObj = {};
        elementObj["name"] = indexName[i];
        data = [];
        for (var ii = 0; ii < tbdata.length; ii++) {
            element = [];
            //IE11和Safari的bug
            //new Date(time)的时候,time如果是yyyy-mm-dd hh:mm:ss的形式，则IE会得到一个NaN，Safari会得到Invalid Date
            //使用mm/dd/yyyy hh:mm:ss则可以支持所有浏览器
            var tt = tbdata[ii][1].replace(/(\d{4})-(\d{2})-(\d{2})(\s+)(.*)?/, "$1/$2/$3 $5");
            time = new Date(tt.replace(/-/g, "/")).getTime() + 8 * 60 * 60 * 1000;
            element.push(time);
            value = parseFloat(tbdata[ii][index[i] + 2]);
            element.push(isNaN(value) ? null : value);
            data.push(element);
        }
        elementObj["data"] = data;
        if (data.length > 0) {
            series.push(elementObj);
        }
    }
    obj["series"] = series;
    console.log("plot obj: ", obj);
    return obj;
};

/**
 *
 * 根据表格数据生成时序图的数据格式(开放时序图TimeSeries日期对比,CompareDim == "undefined" 时进行开放）
 * @param tbdata 二维数组 表数据
 * @param index  一维数组 指标的下标数组
 * @param indexName 一维数组 对应的指标名数组
 * @param paramJSON {key:value} 前端选择的控制参数
 * @param kvs {key:value} 自定义画图的参数
 */
DataApp.prototype.generalTimeSeriesSingleDimMultiIndexCompareDate = function (tbdata, index, indexName, paramJSON, kvs) {

    var obj = {};
    obj["type"] = "timeseries";
    if (kvs) {
        var kvArray = kvs.split(";");
        var opts = {};
        for (var i = 0; i < kvArray.length; i++) {
            var kv = kvArray[i].split(":");
            if (kv.length == 2) {
                obj[kv[0]] = kv[1];

                if ("type" == (kv[0])) {
                    opts["defaultType"] = kv[1];
                }

                if ("yaxis" == (kv[0])) {
                    opts["yaxis"] = kv[1];
                }
            }
        }
        obj["opts"] = opts;
    }

    var startDate = parseInt(paramJSON.startDate.replace(/-/g, ""));
    var endDate = parseInt(paramJSON.endDate.replace(/-/g, ""));
    var startCompareDate = parseInt(paramJSON.startCompareDate.replace(/-/g, ""));
    var endCompareDate = parseInt(paramJSON.endCompareDate.replace(/-/g, ""));
    //-----------------------------------
    series = [];
    elementObj1 = {};
    elementObj1["name"] = startDate + "至" + endDate;
    elementObj2 = {};
    elementObj2["name"] = startCompareDate + "至" + endCompareDate;

    for (var i = 0; i < index.length; i++) {
        data1 = [];
        data2 = [];
        for (var ii = 0; ii < tbdata.length; ii++) {
            element = [];
            //IE11和Safari的bug
            //new Date(time)的时候,time如果是yyyy-mm-dd hh:mm:ss的形式，则IE会得到一个NaN，Safari会得到Invalid Date
            //使用mm/dd/yyyy hh:mm:ss则可以支持所有浏览器
            var tt = tbdata[ii][1].replace(/(\d{4})-(\d{2})-(\d{2})(\s+)(.*)?/, "$1/$2/$3 $5");
            var datetimett = parseInt(tbdata[ii][0]);
            time = new Date(tt.replace(/-/g, "/")).getTime() + 8 * 60 * 60 * 1000;
            element.push(time);
            value = parseFloat(tbdata[ii][index[i] + 2]);
            element.push(isNaN(value) ? null : value);
            if(startDate <= datetimett && datetimett <= endDate) {
                data1.push(element);
            }
            if(startCompareDate <= datetimett && datetimett <= endCompareDate) {
                data2.push(element);
            }
        }

        //将data2中数据中的日期与data1中的数据日期设置为相等
        if(data1.length >= data2.length) {
            for (var j = 0; j < data2.length; j++) {
                data2[j][0] = data1[j][0];
            }
        } else {
            for (var j = 0; j < data1.length; j++) {
                data1[j][0] = data2[j][0];
            }
            //此处是以data的量为基准，可能需要进行修改，因为用户不知道下面显示的哪一条才是想要的，可能要改变data2多出的数量
        }

        console.log("plot data1: ", data1);
        console.log("plot data2: ", data2);
        elementObj1["data"] = data1;
        elementObj2["data"] = data2;
        if (data1.length > 0) {
            series.push(elementObj1);
        }
        if (data2.length > 0) {
            series.push(elementObj2);
        }
    }
    obj["series"] = series;
    console.log("plot obj: ", obj);
    return obj;
};

DataApp.prototype.generalTimeSeriesDoubleDimSingleIndex = function (tbdata, index, indexName, paramJSON, kvs) {
    var obj = {};
    obj["type"] = "timeseries";
    if (kvs) {
        var kvArray = kvs.split(";");
        var opts = {};
        for (var i = 0; i < kvArray.length; i++) {
            var kv = kvArray[i].split(":");
            if (kv.length == 2) {
                obj[kv[0]] = kv[1];

                if ("type" == (kv[0])) {
                    opts["defaultType"] = kv[1];
                }

                if ("yaxis" == (kv[0])) {
                    opts["yaxis"] = kv[1];
                }
            }
        }
        obj["opts"] = opts;
    }
    //第一列是日期，第二列是时间序列列，第三列是对比列，第四列开始是指标列
    compareMap = {};
    compareName = [];
    for (var i = 0; i < tbdata.length; i = i + 1) {
        if ($.inArray(tbdata[i][2], compareName) == -1) {
            compareName.push(tbdata[i][2]);
            compareMap[tbdata[i][2]] = [];//存储数据
        }
    }

    for (var i = 0; i < tbdata.length; i++) {
        element = [];
        time = new Date(tbdata[i][1].replace(/-/g, "/")).getTime() + 8 * 60 * 60 * 1000;
        value = parseFloat(tbdata[i][index[0] + 3]);
        element.push(time);
        element.push(isNaN(value) ? null : value);
        compareMap[tbdata[i][2]].push(element);
    }
    series = [];
    for (var ii = 0; ii < compareName.length; ii++) {
        elementObj = {};
        elementObj["name"] = compareName[ii];
        elementObj["data"] = compareMap[compareName[ii]];
        if (elementObj.data.length > 0) {
            series.push(elementObj);
        }
    }
    obj["series"] = series;
    console.log("plot obj: ", obj);
    return obj;

};
DataApp.prototype.generalPieSingleDimSingleIndex = function (tbdata, index, indexName, paramJSON, kvs) {
    var obj = {};
    obj["type"] = "pie";
    if (kvs) {
        var kvArray = kvs.split(";");
        var opts = {};
        for (var i = 0; i < kvArray.length; i++) {
            var kv = kvArray[i].split(":");
            if (kv.length == 2) {
                obj[kv[0]] = kv[1];

                if ("type" == (kv[0])) {
                    opts["defaultType"] = kv[1];
                }

                if ("yaxis" == (kv[0])) {
                    opts["yaxis"] = kv[1];
                }
            }
        }
        obj["opts"] = opts;
    }

    series = [];
    //第一列是x轴,第二列以后是指标列
    for (var ii = 0; ii < index.length; ii++) {
        elementObj = {};
        elementObj["name"] = indexName[ii];
        data = [];
        for (var i = 0; i < tbdata.length; i++) {
            element = [];
            element.push(tbdata[i][0]);
            value = parseFloat(tbdata[i][index[ii] + 1]);
            element.push(isNaN(value) ? null : value);
            data.push(element);
        }
        elementObj["data"] = data;
        if (data.length > 0) {
            series.push(elementObj);
        }
    }
    obj["series"] = series;
    return obj;
};
DataApp.prototype.generalPieDoubleDimSingleIndex = function (tbdata, index, indexName, paramJSON, kvs) {
    var obj = {};
    obj["type"] = "pie";
    if (kvs) {
        var kvArray = kvs.split(";");
        var opts = {};
        for (var i = 0; i < kvArray.length; i++) {
            var kv = kvArray[i].split(":");
            if (kv.length == 2) {
                obj[kv[0]] = kv[1];

                if ("type" == (kv[0])) {
                    opts["defaultType"] = kv[1];
                }

                if ("yaxis" == (kv[0])) {
                    opts["yaxis"] = kv[1];
                }
            }
        }
        obj["opts"] = opts;
    }
    series = [];
    //iner object
    //第一列是inner level；第二列是outer level；最后是特定指标列
    categories = {};
    catelogriesArray = [];
    for (var i = 0; i < tbdata.length; i++) {
        if (!(tbdata[i][0] in categories)) {
            categories[tbdata[i][0]] = 0;
            catelogriesArray.push(tbdata[i][0]);
        }
        value = parseFloat(tbdata[i][index[0] + 2]);
        categories[tbdata[i][0]] = categories[tbdata[i][0]] + (isNaN(value) ? 0.0 : value );
    }
    if (catelogriesArray.length > 0) {
        //it must have data
        //put the mainObj into the pie plot
        mainObj = {};
        mainData = [];
        for (var i = 0; i < catelogriesArray.length; i++) {
            o = {};
            o["name"] = catelogriesArray[i];
            o["y"] = categories[catelogriesArray[i]];
            mainData.push(o);
        }
        mainObj["name"] = indexName[0];
        mainObj["data"] = mainData;
        mainObj["size"] = "80%";
        mainObj["showInLegend"] = false;
        dataLabels = {};
        dataLabels["distance"] = -30;
        dataLabels["format"] = "<b>{point.name}</b>";
        dataLabels["color"] = "white";
        mainObj["dataLabels"] = dataLabels;
        if (mainData.length > 0) {
            series.push(mainObj);
        }

        //put the subObj into pie plot
        subObj = {};
        subData = [];
        for (var i = 0; i < tbdata.length; i++) {
            o = {};
            o["name"] = tbdata[i][0] + "-" + tbdata[i][1];
            value = parseFloat(tbdata[i][index[0] + 2]);
            o["y"] = (isNaN(value) ? null : value);
            subData.push(o);
        }
        subObj["name"] = indexName[0];
        subObj["size"] = "100%";
        subObj["innerSize"] = "80%";
        subObj["data"] = subData;
        if (subData.length > 0) {
            series.push(subObj);
        }
    }
    obj["series"] = series;
    return obj;
};
DataApp.prototype.generalCompareTimeSingleDimMultiIndex = function (tbdata, index, indexName, paramJSON, kvs) {
    var obj = {};
    if (kvs) {
        var kvArray = kvs.split(";");
        var opts = {};
        for (var i = 0; i < kvArray.length; i++) {
            var kv = kvArray[i].split(":");
            if (kv.length == 2) {
                obj[kv[0]] = kv[1];

                if ("type" == (kv[0])) {
                    opts["defaultType"] = kv[1];
                }

                if ("yaxis" == (kv[0])) {
                    opts["yaxis"] = kv[1];
                }
            }
        }
        obj["opts"] = opts;
    }
    //startDate
//	console.log("startDate:",paramJSON.startDate);
    var startDate = parseInt(paramJSON.startDate.replace(/-/g, ""));
//	console.log("startDate:",paramJSON.startDate);
    //endDate
    var endDate = parseInt(paramJSON.endDate.replace(/-/g, ""));
//	console.log("endDate:",endDate);
    //startCompareDate
    var startCompareDate = parseInt(paramJSON.startCompareDate.replace(/-/g, ""));
    //endCompareDate
    var endCompareDate = parseInt(paramJSON.endCompareDate.replace(/-/g, ""));
    var before_categories = [];
    var after_categories = [];
    for (var i = 0; i < tbdata.length; i++) {
        var curdate = parseInt(tbdata[i][0]);
        if (curdate >= startDate && curdate <= endDate) {
            if ($.inArray(curdate, before_categories) == -1) {
                before_categories.push(tbdata[i][0]);
            }
        }
        if (curdate >= startCompareDate && curdate <= endCompareDate) {
            if ($.inArray(curdate, after_categories) == -1) {
                after_categories.push(tbdata[i][0]);
            }
        }
    }

    obj["categories"] = before_categories;
    // series
    series = [];
    indicator_map = [];
    for (var ii = 0; ii < index.length; ii++) {
        indicator_map.push([
            [],
            []
        ]);
    }
    for (var i = 0; i < tbdata.length; i++) {
        var curdate = parseInt(tbdata[i][0]);
        for (var ii = 0; ii < index.length; ii++) {
            value = parseFloat(tbdata[i][index[ii] + 1]);
            value = (isNaN(value) ? null : value );
            if (curdate >= startDate && curdate <= endDate) {
                indicator_map[ii][0].push(value);
            }
            if (curdate >= startCompareDate && curdate <= endCompareDate) {
                indicator_map[ii][1].push(value);
            }
        }
    }

    for (var i = 0; i < indicator_map.length; i++) {
        for (var ii = 0; ii < 2; ii++) {
            var elementObj = {};
            elementObj["name"] = ii == 0 ? (startDate + i18n['to'] + endDate) : (startCompareDate + i18n['to'] + endCompareDate);
            elementObj["data"] = indicator_map[i][ii];
            if (indicator_map[i][ii].length > 0) {
                series.push(elementObj);
            }
        }
    }
    obj["series"] = series;
    console.log("plot obj: ", obj);
    return obj;
};
DataApp.prototype.generalSingleDimMultiIndex = function (tbdata, index, indexName, kvs, theadData, columnCount) {
    var obj = {};
    if (kvs) {
        var kvArray = kvs.split(";");
        var opts = {};
        for (var i = 0; i < kvArray.length; i++) {
            var kv = kvArray[i].split(":");
            if (kv.length == 2) {
                obj[kv[0]] = kv[1];

                if ("type" == (kv[0])) {
                    opts["defaultType"] = kv[1];
                }

                if ("yaxis" == (kv[0])) {
                    opts["yaxis"] = kv[1];
                }
            }
        }
        obj["opts"] = opts;
    }

    //收集x轴，肯定是第一列
    categories = [];
    for (var i = 0; i < tbdata.length; i++) {
        if ($.inArray(tbdata[i][0], categories) == -1) {
            categories.push(tbdata[i][0]);
        }
    }
//	console.log("categories",categories);
    obj["categories"] = categories;
    // series
    series = [];

    if (theadData) {
        var mapCompare = {};
        var mapCompareArr = []; //字典无法保证顺序，再增加一个数组用来确保图与表格列顺序一致


        for (var jj = 1; jj <= (theadData.length - 1) / columnCount; jj++) {
            var x = theadData[jj];
            if (!(x in mapCompare )) {
                mapCompare[ x ] = [];
                for (var ii = 0; ii < index.length; ii++) {
                    mapCompare[ x ].push([]);
                    for (var t = 0; t < categories.length; t++) {
                        mapCompare[x][ii].push(null);
                    }
                }
                var tmpMapCompareObj = {
                    tCol: x,
                    tVal: mapCompare[x]
                };
                mapCompareArr.push(tmpMapCompareObj);
            }
        }

        for (var i = 0; i < tbdata.length; i++) {
            var c = tbdata[i][0];
            for (var l = 0; l < mapCompareArr.length; l++) {
                var xx = mapCompareArr[l]['tCol'];
                var pointer = theadData.indexOf(xx);
                for (var ii = 0; ii < index.length; ii++) {
                    var value = parseFloat(tbdata[i][ pointer + ( index ) * ( ( theadData.length - 1 ) / columnCount )]);
                    if (!isNaN(value)) {
                        mapCompareArr[l]['tVal'][ii][$.inArray(c, categories)] = value;
                    }
                }
            }

            //for(var xx in mapCompare){
            //	var pointer = theadData.indexOf(xx) % ( ( theadData.length - 1 ) / 2 ) ;
            //	for ( var ii = 0; ii < index.length; ii++ ) {
            //		var value = parseFloat(tbdata[i][ pointer + ( index ) * ( ( theadData.length - 1 ) / 2 )]);
            //		if (! isNaN(value)) {
            //			mapCompare[xx][ii][$.inArray(c, categories)] = value;
            //		}
            //	}
            //}
        }
        for (var k = 0; k < mapCompareArr.length; k++) {
            for (var ii = 0; ii < index.length; ii++) {
                elementObject = {};
                if (index.length > 1) {
                    elementObject["name"] = indexName[ii] + "-" + key;
                } else {
                    elementObject["name"] = mapCompareArr[k]['tCol'];
                }
                elementObject["data"] = mapCompareArr[k]['tVal'][ii];
                series.push(elementObject);
            }
        }
    } else {
        for (var ii = 0; ii < index.length; ii++) {
            elementObj = {};
            elementObj["name"] = indexName[ii];
            data = [];

            for (var i = 0; i < tbdata.length; i++) {
                value = parseFloat(tbdata[i][index[ii] + 1]);//Cauthion!!: 表格中的xx%会被parse成xx，如64.2%会被解析成64.2
                data.push(isNaN(value) ? null : value);
            }
            elementObj["data"] = data;
            if (data.length > 0) {
                series.push(elementObj);
            }
        }
    }
    obj["series"] = series;
    return obj;
};
DataApp.prototype.generalDoubleDimMultiIndex = function (tbdata, index, indexName, kvs, theadData, columnCount) {
    var obj = {};
    if (kvs) {
        var kvArray = kvs.split(";");
        var opts = {};
        for (var i = 0; i < kvArray.length; i++) {
            var kv = kvArray[i].split(":");
            if (kv.length == 2) {
                obj[kv[0]] = kv[1];

                if ("type" == (kv[0])) {
                    opts["defaultType"] = kv[1];
                }

                if ("yaxis" == (kv[0])) {
                    opts["yaxis"] = kv[1];
                }
            }
        }
        obj["opts"] = opts;
    }

    //收集x轴，肯定是第一列
    categories = [];
    for (var i = 0; i < tbdata.length; i++) {
        if ($.inArray(tbdata[i][0], categories) == -1) {
            categories.push(tbdata[i][0]);
        }
    }
//	console.log("categories",categories);
    obj["categories"] = categories;
    // series
    series = [];
    mapCompare = {};

    if (theadData) {  //有值说明是复杂表头的情况
        var mapCompareArr = []; //字典无法保证顺序，再增加一个数组用来确保图与表格列顺序一致
        for (var jj = 1; jj <= (theadData.length - 1) / columnCount; jj++) {
            var x = theadData[jj];

            if (!(x in mapCompare )) {
                mapCompare[ x ] = [];
                for (var ii = 0; ii < index.length; ii++) {
                    mapCompare[ x ].push([]);
                    for (var t = 0; t < categories.length; t++) {
                        mapCompare[x][ii].push(null);
                    }
                }
                var tmpMapCompareObj = {
                    tCol: x,
                    tVal: mapCompare[x]
                };
                mapCompareArr.push(tmpMapCompareObj);
            }
        }
        for (var i = 0; i < tbdata.length; i++) {
            var c = tbdata[i][0];
            for (var l = 0; l < mapCompareArr.length; l++) {
                var xx = mapCompareArr[l]['tCol'];
                var pointer = theadData.indexOf(xx);
                for (var ii = 0; ii < index.length; ii++) {
                    var value = parseFloat(tbdata[i][ pointer + ( index ) * ( ( theadData.length - 1 ) / columnCount )]);
                    if (!isNaN(value)) {
                        mapCompareArr[l]['tVal'][ii][$.inArray(c, categories)] = value;
                    }
                }
            }


            //for(var xx in mapCompare){
            //	var pointer = theadData.indexOf(xx) % ( ( theadData.length - 1 ) / columnCount ) ;
            //	for ( var ii = 0; ii < index.length; ii++ ) {
            //		var value = parseFloat(tbdata[i][ pointer + ( index ) * ( ( theadData.length - 1 ) / columnCount )]);
            //		if (! isNaN(value)) {
            //			mapCompare[xx][ii][$.inArray(c, categories)] = value;
            //		}
            //	}
            //}
        }
        for (var k = 0; k < mapCompareArr.length; k++) {
            for (var ii = 0; ii < index.length; ii++) {
                elementObject = {};
                if (index.length > 1) {
                    elementObject["name"] = indexName[ii] + "-" + key;
                } else {
                    elementObject["name"] = mapCompareArr[k]['tCol'];
                }
                elementObject["data"] = mapCompareArr[k]['tVal'][ii];
                series.push(elementObject);
            }
        }

    } else {
        for (var i = 0; i < tbdata.length; i++) {
            var c = tbdata[i][0];
            var x = tbdata[i][1];
            if (!(x in mapCompare )) {

                mapCompare[ x ] = [];
                for (var ii = 0; ii < index.length; ii++) {
                    mapCompare[ x ].push([]);
                    for (var t = 0; t < categories.length; t++) {
                        mapCompare[x][ii].push(null);
                    }
                }
            }
            for (var ii = 0; ii < index.length; ii++) {
                var value = parseFloat(tbdata[i][2 + index[ii]]);
                if (!isNaN(value)) {
                    mapCompare[x][ii][$.inArray(c, categories)] = value;
                }
                //mapCompare[tbdata[i][1]][ii].push(isNaN(value)  ? null : value );
            }
        }
        for (var key in mapCompare) {
            for (var ii = 0; ii < index.length; ii++) {
                elementObject = {};
                if (index.length > 1) {
                    elementObject["name"] = indexName[ii] + "-" + key;
                } else {
                    elementObject["name"] = key;
                }
                elementObject["data"] = mapCompare[key][ii];
                series.push(elementObject);
            }
        }
    }


    obj["series"] = series;
    //console.log("plot obj",obj);
    return obj;
};
DataApp.prototype.generalPlotFromTable = function ($handler, index, indexName, url, json, paramJSON) {
    //先考虑，正常情况，单个指标，单个维度，聚合
    var JSONObject = {};
    var tableData = $.parseJSON($("#indicator_basic_plot_result").attr("data-tableobj"));
    var theadData = $.parseJSON($("#indicator_basic_plot_result").attr("data-tableheadobj"));
    var columnCount = json.columnName.split("^").length;
    //console.log("tableData:",tableData, 'json', json, 'parseJSON', paramJSON);

    //SimpleAnaylsis
    if ('SimpleAnalysis' == json.jspName) {
        JSONObject = this.generalNoDimMultiIndex(tableData, json);
    }
    //时序图
    else if (typeof (json.jspName) != "undefined" && ( json.jspName == 'TimeSeries')) {
        if (typeof (json.compareDim) != 'undefined') {
            //console.log("double dim single index");
            JSONObject = this.generalTimeSeriesDoubleDimSingleIndex(tableData, [index], [indexName], paramJSON, '{"yaxis":"true"}');
        } else {
            if(paramJSON.needCompare != '1') {
                //console.log("single dim multi index");
                JSONObject = this.generalTimeSeriesSingleDimMultiIndex(tableData, [index], [indexName], paramJSON, null);
            } else {
                //产生对比时间图，没有对比维度，没有多个指标情况
                JSONObject = this.generalTimeSeriesSingleDimMultiIndexCompareDate(tableData, [index], [indexName], paramJSON, null);
            }

        }
    }
    //饼图
    else if (typeof (json.defaultType) != "undefined" && ( json.defaultType == 'pie')) {
        if (typeof (json.compareDim) != 'undefined' && json.compareDim.split(",").length > 1) {
            //double dim single index
            JSONObject = this.generalPieDoubleDimSingleIndex(tableData, [index], [indexName], paramJSON, null);
        } else {
            //single dim single index
            JSONObject = this.generalPieSingleDimSingleIndex(tableData, [index], [indexName], paramJSON, null);
        }
    }
    //普通画图
    else if (paramJSON.needCompare == '1') {
        //对比分析页面的日期对比画图逻辑不同
        if (json.jspName === 'CompareAnalysis') {
            JSONObject = this.generalDoubleDimMultiIndex(tableData, [index], [indexName], '{"yaxis":"true"}');
        } else {
            //产生对比时间图，没有对比维度，没有多个指标情况
            JSONObject = this.generalCompareTimeSingleDimMultiIndex(tableData, [index], [indexName], paramJSON, '{"yaxis":"true"}');
        }

    }
    else if (typeof (json.compareDim) == 'undefined' && typeof (json.indexName) == 'undefined' && (typeof (json[OtherOptions.KEYS.MERGE_INDICATOR]) == 'undefined') && ( json.jspName !== 'GeneralIndicator')) {
        //无对比维度，无多指标
        console.log("no dim,single indicator");
        if (json.options && json.options.complexTableHeader === "true") { //复杂表头
            JSONObject = this.generalSingleDimMultiIndex(tableData, [index], [indexName], '{"yaxis":"true"}', theadData, columnCount);
        } else {
            JSONObject = this.generalSingleDimMultiIndex(tableData, [index], [indexName], '{"yaxis":"true"}');
        }
        //JSONObject = this.generalSingleDimMultiIndex(tableData,[index],[indexName],'{"yaxis":"true"}');
    } else if (typeof (json.compareDim) == 'undefined' && ( json.jspName !== 'GeneralIndicator')) {
        //无对比列，可能有一个或者多个指标
        console.log("no dim,multi indicator");
        var indexNameArray = [];
        var indexArray = [];

        if (json[OtherOptions.KEYS.MERGE_INDICATOR]) {//可配置的合并多个指标
            var indicatorsArray = json.columnNameLang.split(/,|\^/);
            var clickTab = index;
            var mergeOpts = json[OtherOptions.KEYS.MERGE_INDICATOR].split(/\^/)[clickTab].split('->');//正在click的tab的合并配置的规则
            indexArray = mergeOpts[0].split(',').map(function (item) {
                return parseInt(item, 10);
            });
            for (var k = 0; k < indexArray.length; k++) {//通过指标的index填充indexName Array
                indexNameArray.push(indicatorsArray[indexArray[k]]);
            }
        }//可弹性合并指标 end


        else {
            indexNameArray = json.columnNameLang.split(/,|\^/);
            indexArray = [];
            for (var i = 0; i < indexNameArray.length; i++) {
                indexArray.push(i);
            }
        }

//		if ( paramJSON.ctrl__indicator != "-1") {
//			indexNameArray = [indexNameArray[parseInt(paramJSON.ctrl__indicator)]];
//			indexArray =[parseInt(paramJSON.ctrl__indicator)];
//		}
        //组装指标线
        //JSONObject = this.generalSingleDimMultiIndex(tableData,indexArray,indexNameArray,'{"yaxis":"true"}');
        if (json.options && json.options.complexTableHeader === "true") { //复杂表头
            JSONObject = this.generalSingleDimMultiIndex(tableData, indexArray, indexNameArray, '{"yaxis":"true"}', theadData, columnCount);
        } else {
            JSONObject = this.generalSingleDimMultiIndex(tableData, indexArray, indexNameArray, '{"yaxis":"true"}');
        }

    } else if (typeof (json.indexName) == 'undefined') {
        //一个指标列，有对比列,并且只有一个对比列
        //组装指标线
        if ($("select[name='ctrl__xaxis']").size() > 0 && (typeof (paramJSON.ctrl__comp) == 'undefined' || paramJSON.ctrl__xaxis == paramJSON.ctrl__comp )) {
            console.log("no dim,single indicator");
            if (json.options && json.options.complexTableHeader === "true") { //复杂表头
                JSONObject = this.generalSingleDimMultiIndex(tableData, [index], [indexName], '{"yaxis":"true"}', theadData, columnCount);
            } else {
                JSONObject = this.generalSingleDimMultiIndex(tableData, [index], [indexName], '{"yaxis":"true"}');
            }
        } else {
            console.log("double dim,single indicator");
            //可能是compareAnalyse.jsp页面
            if (typeof (json.jspName) != "undefined" && ( json.jspName == 'CompareAnalysis') && json.compareDim.split(",").length <= 1) {
                var indexArray = [index];
                var indexNameArray = [indexName];

                if (json[OtherOptions.KEYS.MERGE_INDICATOR]) {//配置了需要合并多个指标
                    var indicatorsArray = json.columnNameLang.split(/,|\^/);
                    var clickTab = index;
                    var mergeOpts = json[OtherOptions.KEYS.MERGE_INDICATOR].split(/\^/)[clickTab].split('->');//正在click的tab的合并配置的规则
                    indexArray = mergeOpts[0].split(',').map(function (item) {
                        return parseInt(item, 10);
                    });
                    indexNameArray = [];//清空indexNameArray,按照点击的合并了的tab去重新填充
                    for (var k = 0; k < indexArray.length; k++) {//通过指标的index填充indexName Array
                        indexNameArray.push(indicatorsArray[indexArray[k]]);
                    }
                }//可弹性合并指标 end

                if (json.options && json.options.complexTableHeader === "true") { //复杂表头
                    JSONObject = this.generalSingleDimMultiIndex(tableData, indexArray, indexNameArray, '{"yaxis":"true"}', theadData, columnCount);
                } else {
                    JSONObject = this.generalSingleDimMultiIndex(tableData, indexArray, indexNameArray, '{"yaxis":"true"}');
                }
            } else {
                if (json.options && json.options.complexTableHeader === "true") { //复杂表头
                    JSONObject = this.generalDoubleDimMultiIndex(tableData, [index], [indexName], '{"yaxis":"true"}', theadData, columnCount);
                } else {
                    JSONObject = this.generalDoubleDimMultiIndex(tableData, [index], [indexName], '{"yaxis":"true"}');
                }
            }
        }
    } else {
        //有对比,且有多个指标
        if ($("select[name='ctrl__xaxis']").size() > 0 && ( typeof (paramJSON.ctrl__comp) == 'undefined' || paramJSON.ctrl__xaxis == paramJSON.ctrl__comp )) {
            //这种情况可以看成是无对比的情况了
            console.log("one dim,multi indicator");
            var indexNameArray = json.indexName.split(",");
            var indexArray = [];
            for (var i = 0; i < indexNameArray.length; i++) {
                indexArray.push(i);
            }
            if (paramJSON.ctrl__indicator != "-1") {
                indexNameArray = [indexNameArray[parseInt(paramJSON.ctrl__indicator)]];
                indexArray = [parseInt(paramJSON.ctrl__indicator)];
            }
            //组装指标线
            JSONObject = this.generalSingleDimMultiIndex(tableData, indexArray, indexNameArray, '{"yaxis":"true"}');

        } else {
            //对比分析页面对比单个维度，多个指标且有indexName
            if (typeof (json.jspName) != "undefined" && ( json.jspName == 'CompareAnalysis') && json.compareDim.split(",").length <= 1 && !!json.indexName) {
                var indexNameArray = json.columnNameLang.split(/,|\^/);
                var indexArray = [];
                for (var i = 0; i < indexNameArray.length; i++) {
                    indexArray.push(i);
                }
                JSONObject = this.generalSingleDimMultiIndex(tableData, indexArray, indexNameArray, '{"yaxis":"true"}');
            } else {
                console.log("double dim,multi indicator");
                var indexNameArray = json.indexName.split(",");
                var indexArray = [];
                for (var i = 0; i < indexNameArray.length; i++) {
                    indexArray.push(i);
                }
                if (paramJSON.ctrl__indicator != "-1") {
                    indexNameArray = [indexNameArray[parseInt(paramJSON.ctrl__indicator)]];
                    indexArray = [parseInt(paramJSON.ctrl__indicator)];
                }
                JSONObject = this.generalDoubleDimMultiIndex(tableData, indexArray, indexNameArray, '{"yaxis":"true"}');
            }
        }
    }
    //console.log("JSONObject: ", JSONObject);
    //补上丢失的options选项
    JSONObject["options"] = $.extend({}, json.options, opt);

    //更新选中项，及画图
    $handler.siblings().removeClass("current");
    $handler.addClass("current");
    //取出defaultType
    if (json.defaultType) {
        var defaultTypeArr = json.defaultType.split(",");//按逗号分隔
        //默认绘图类型取第一个
        var currentDefaultType = defaultTypeArr[0];
        if (defaultTypeArr.length > index) {
            currentDefaultType = defaultTypeArr[index];
        }
        var opt = {};
        opt = getOptionFromType(currentDefaultType); //defaultType为stackedpercentcolumn时不可直接用，此处需要转换一下
        if (JSONObject.options) {
            JSONObject["options"] = $.extend({}, JSONObject.options, opt);
        } else {
            JSONObject["options"] = $.extend({}, json.options, opt);
        }
    }
    /*
     * 如果有选中的type,则取出
     */
    var select_span = $(".plotTypeWrap .plotTypeList span.selected");
    var select_x_switch_span = $(".plotTypeWrap .plotSwitchList span.selected");
    if (select_span.size() > 0) {
        var type = select_span.attr("data-value");
        var opt = getOptionFromType(type);
        //扩展配置
        if (JSONObject.options) {
            JSONObject["options"] = $.extend({}, JSONObject.options, opt);
        } else {
            JSONObject["options"] = opt;
        }
    }
    var opt = {};
    if (select_x_switch_span.size() > 0) {
        var val = select_x_switch_span.attr("data-value");
        opt = {"xStep": val};
    }
    if (json.idxValType) {
        var idxValTypeArr = json.idxValType.split(",");
        var idxValType = "0";
        if (idxValTypeArr.length > index) {
            idxValType = idxValTypeArr[index];
        }
        if (JSONObject.opts) {
            JSONObject.opts["valType"] = idxValType;
        } else {
            JSONObject.opts = {};
            JSONObject.opts["valType"] = idxValType;
        }
    }
    if ($("#indicator_basic_plot_result").size() > 0) {
        this.PlotRender($("#indicator_basic_plot_result"), JSONObject, opt);
    } else {
        this.PlotRender($handler.closest(".indicator_container").find(".indicator_basic_plot:eq(0) .content"), JSONObject, opt);
    }
};
DataApp.prototype.InitManageDate = function () {
    $handler = $('.classDatepicker');

    // 初始日期
    var from, to, d1, d2;
    if ($handler.val() == "") {
        from = new Date((new Date()).getTime() - 1000 * 60 * 60 * 24 * 15);
        to = new Date((new Date()).getTime() - 1000 * 60 * 60 * 24 * 1);
        d1 = $.datepicker.formatDate('yy-mm-dd', from, {});
        d2 = $.datepicker.formatDate('yy-mm-dd', to, {});

        $handler.attr("value", d1 + "," + d2);
    }

    // 日期控件初始化
    var options = {
        addQuickSelect: false,
        needCompare: false,
        isEnglishVersion: false, // 是否是英文版
        success: function (obj) {
            console.log(this.datePickerHandlerId, obj);
            $("#" + this.datePickerHandlerId).val(obj.startDate + "," + obj.endDate);
        }
    };
    $handler.gdasDatePicker(options);
    $handler.next().css("width", "219px");
};

// 初始化日期控件
DataApp.prototype.dateInit = function (url, json, callback) {
    var thisObj = this;
    // 重要TODO！当日期不是区间时，设置addQuickSelect:false。这是临时解决日期非区间，但addQuickSelect选择成区间的bug
    var val = $('#main_content div.indicator_header div.content .classDatepicker').val();

    // 日期控件初始化
    var options = {
        addQuickSelect: val && val.split(",").length == 2 ? true : false, //重要TODO
        needCompare: json.isDateComparable,
        isEnglishVersion: json.isEnglishVersion, // 是否是英文版
        timezone: json['timezone'] ? json['timezone'] : 'Asia/Shanghai',
        success: function (obj) {
            console.log(this.datePickerHandlerId, obj);
            $("#" + this.datePickerHandlerId).val(obj.startDate + "," + obj.endDate);
            if (callback && typeof(callback) === "function") {
                console.log("INFO: call callback function");
                callback.call(thisObj, url);//为该callback function重新绑定作用域本来属于的对象
            } else if (callback && typeof(callback) === "object") {
                console.log("INFO: callback parameters is an object, then call callback.callback");
                callback.callback(url);
            } else {
                thisObj.generalQuery(url);
            }
        }
    };
    $('#main_content div.indicator_header div.content .classDatepicker').gdasDatePicker(options);
};

// 初始化过滤控件
DataApp.prototype.singleSelectorInit = function (url, json, callback) {
    var thisObj = this;
    $("#main_content div.indicator_header div.content select.selectClass").each(function (index, e) {
        //单选控件
        var selectType = $(e).attr("data-selectType");
        var isMultiSelect = false;
        if (selectType.length >= 'levelSelect'.length && selectType.substr(0, 'levelSelect'.length) == 'levelSelect') {
            isMultiSelect = true;
        }
        if (isMultiSelect) {
            //层级单选控件
            $(e).jMultiLevelSelect({
                has_least_one: selectType.indexOf("__hasleastone") != -1 ? true : false,
                active_127: selectType.indexOf("__active_127") != -1 ? true : false,
                callback: function () {
                    if (callback && typeof(callback) === "function") {
                        console.log("INFO: call callback function");
                        //callback(url,thisObj);//Added a param "thisObj" to pass context of DataApp(or its sub-class) object
                        callback.call(thisObj, url);//绑定此回调函数的作用域到DataApp/或其子 对象上
                    } else if (callback && typeof(callback) === "object") {
                        console.log("INFO: callback parameters is an object, then call callback.callback");
                        callback.callback(url);
                    } else {
                        thisObj.generalQuery(url);
                    }
                }
            });
        } else {
            var isAjaxSearch = $(e).find("option").size() >= thisObj.options.MULTISELECT_OPTIONS_MAX_SIZE;
            $(e).gdasSingleSelector({
                isWrapped: true,
                wrapThreshold: 5,
                wrapButtonName: json.isEnglishVersion ? "More" : "更多",
                searchPlaceholder: json.isEnglishVersion ? "Search" : "搜索",
                animateTime: 0, //其他菜单出现和隐藏的动画时间, 单位毫秒
                searchBar: "auto",//提供对更多数据的搜索过滤功能, "false", "true", "auto" "auto" 表示自动根据更多数据的大小来自动启动
                searchBarEnableThreshold: 8, //当更多数据项超过该阈值时，自动启动搜索功能
                isAjaxSearch: isAjaxSearch, // 是否开始ajax搜索
                callback: function () {
                    if (callback && typeof(callback) === "function") {
                        console.log("INFO: call callback function");
                        //callback(url,thisObj);//Added a param "this" to pass thisObj
                        callback.call(thisObj, url);//当作回调函数调用，重新绑定this到DataApp/或其子 对象上
                    } else if (callback && typeof(callback) === "object") {
                        console.log("INFO: callback parameters is an object, then call callback.callback");
                        callback.callback(url);
                    } else {
                        thisObj.generalQuery(url);
                    }
                }
            });
        }
    });
};

// 设置初始参数
DataApp.prototype.setParameters = function (parameters) {
    if (parameters == null || JSON.stringify(parameters) == '{}') {
        return;
    }

    $("#main_content div.indicator_header div.content select.selectClass").each(function (i, e) {
        if (e.name && parameters[e.name]) {
            var val = parameters[e.name];

            if ($(e).find('option[value="' + val + '"]').size() == 0) {
                $(e).append('<option value="' + val + '">' + val + '</option>');
            }
            // 修改select本身的value
            $(e).val(val);

            console.log(e.name, parameters[e.name], $(e).val(), $(e).attr('id'));

            var suffix = $(e).attr('id').replace("gdasSingleSelector_", ""),
                singleSelectorId = "singleSelector_" + suffix,
                singleSelectorOtherBtnId = "singleSelectorOtherBtn_" + suffix,
                singleSelectorBtnContainerId = "singleSelectorBtnContainer_" + suffix;

            $("#" + singleSelectorId).find("button").removeClass("selected");
            var find_flag = false;
            // 直接子节点中查找
            $("#" + singleSelectorId + ">.singleSelectBtn").each(function (j, o) {
                if ($(o).attr("value") == val) {
                    find_flag = true;
                    $(o).addClass("selected");
                }
            });

            if (!find_flag) {
                $("#" + singleSelectorOtherBtnId).addClass("selected");
                // 在隐藏列表中选择
                var $tmp = $("#" + singleSelectorBtnContainerId + " .singleSelectBtn[value='" + val + "']");
                if ($tmp.size() == 1) {
                    $('#' + singleSelectorOtherBtnId).find('a').text($tmp.text());
                } else { //前端都没有，要异步去取
                    var sql16 = $(e).attr("data-sql"); // sql语句经过base16 encode
                    $.ajax({
                        url: contextPath + "/js/SingleSelector/ajaxSearch.jsp",
                        data: {'sql16': sql16, 'value': val},
                        async: false, // 必需的
                        success: function (json) {
                            $('#' + singleSelectorOtherBtnId).find('a').text(json.name);
                        },
                        error: function (a, b) {
                            console.log("ajaxSearchDataItem error", a, b);
                        }
                    });
                }
            }
        }
    });
};

DataApp.prototype.generalPlot = function ($handler, url) {
    var json = this.getParameterObject($handler);

    json.columnName = $handler.attr("data-value");
    json.op = "plot";

    var $that = $handler, thisObj = this;
    console.log("plot json", json);
    block();
    ajaxRequest(url, json, function (result) {
        unBlock();
        $that.siblings().removeClass("current");
        $that.addClass("current");
        if ($("#indicator_basic_plot_result").size() > 0) {
            thisObj.PlotRender($("#indicator_basic_plot_result"), result.plot);
        } else {
            thisObj.PlotRender($that.closest(".indicator_container").find(".indicator_basic_plot:eq(0) .content"), result.plot);
        }
    });
};

/**
 * 通过查询的url寻找需要预排序的列index,目前只有手游使用
 * @param url 后端数据的jsp页面
 * @param data [optional] 显示用的数据，主要用于给GeneralIndicator页面判断是否横轴为日期格式
 * @returns {number}
 */
DataApp.prototype.sortDateIndex = function (url, data) {
    var path = url.split("?")[0];
    var page = url.substring(path.lastIndexOf("/") + 1, path.length).replace("Data.jsp", "");//拿到page的名字

    if (page === 'GeneralAnalysis' || page === 'G18ItemOutput') {
        return 0;//按照第一列中的日期排序
    }
    if (page === 'TimeSeries') {
        return 1;//按照第二列具体时间排序
    }
    if (page === 'GeneralIndicator') {//需要判断横轴是否为日期格式
        if (data && data.length > 0) {
            //var regex ='\\d{8}';
            if (isValidDate(data[0][0])) {//第一列是日期格式-》横轴为日期
                return 0;
            }
        }
    }
    return -1;//其他页面不需要排序，返回-1.如comapareAnalysis
}

DataApp.prototype.generalTable = function ($handler, url) {
    var json = this.getParameterObject($handler);
    json.op = "table";

    var $that = $handler, thisObj = this;
    var isPureTable = !!arguments[2];
    var options = null;
    if (isPureTable) {
        options = {
            'displayLength': 50
        };
    }
    //block();

    var $tableAndPlot = $(".indicator_basic .content");//异步请求的区域
    this.ajaxManager.abortAllAjaxReq();
    this.ajaxManager.nonBlockAjax($tableAndPlot, url, json,
        function (result, textStatus, jqXHR) {//ajax成功的callback
            if (result.options) {
                options = $.extend(true, options, result.options);
            }
            var sortIndex = thisObj.sortDateIndex(url, result.data);
            thisObj.TableRender($that.closest(".indicator_container").find(".indicator_basic_table:eq(0) .content"), result, options, sortIndex);
        }
    );

    /*    this.abortAllAjaxReq();//先放弃之前的请求，再发新的请求
     var jqXHR=ajaxRequest(url, json, function(result,textStatus,jqXHR) {
     //unBlock();
     thisObj._ajaxDeque(jqXHR);//请求成功后，把该队列从队列中出队
     asyncLoadCompleted($tableAndPlot.find(".content"));//#43733
     if(result.options){
     options = $.extend(true,options,result.options);
     }
     thisObj.TableRender($that.closest(".indicator_container").find(".indicator_basic_table:eq(0) .content"), result, options);
     },function(jqXHR, textStatus, errorThrown ){//Error addition callback method
     if(jqXHR) thisObj._ajaxDeque(jqXHR);//失败后，从请求队列中删除
     });
     this.ajaxQueque.push(jqXHR);//发送请求后，把当前请求放入请求队列中
     asyncLoadStart($tableAndPlot.find(".content"));//#43733*/
};


DataApp.prototype.generalQuery = function (url) {
    var thisObj = this;
    var isPureTable = (!!arguments[1] && arguments[1] === 'GeneralTable');
    $("#main_content .indicator_basic_table").each(function (index, element) {
        if (!isPureTable) {
            console.log("To generate not-pure table")
            thisObj.generalTable($(element), url);
        } else {
            console.log("To generate pure table");
            thisObj.generalTable($(element), url, isPureTable);
        }
    });
};

DataApp.prototype.ctrlDimClickInit = function (url, json) {
    var thisObj = this;
    var ctrl__xaxisDefaultVal = $("select[name='ctrl__xaxis']").val();
    var ctrl__compDefaultVal = $("select[name='ctrl__comp']").val();
    //如果横轴默认值和默认对比维度值相同则disable掉对比维度的那个
    $("select[name='ctrl__comp'] option").each(function () {
        if ($(this).val() === ctrl__xaxisDefaultVal) {
            $(this).attr("disabled", true);
        }
    });

    //如果默认对比维度值和横轴默认值相同则disable掉横轴那个
    $("select[name='ctrl__xaxis'] option").each(function () {
        if ($(this).val() === ctrl__compDefaultVal) {
            $(this).attr("disabled", true);
        }
    });

    //ctrl__xaxis
    $("select[name='ctrl__xaxis']").change(function () {
        thisObj.generalQuery(url);
        var curXAxisVal = $(this).val();
        disabledAnotherCtrlOption('ctrl__comp', $(this).val());
    });
    //ctrl_comp
    $("select[name='ctrl__comp']").change(function () {
        thisObj.generalQuery(url);
        disabledAnotherCtrlOption('ctrl__xaxis', $(this).val());
    });

    function disabledAnotherCtrlOption(selectName, disabledVal) {
        $("select[name=" + selectName + "] option").each(function () {
            $(this).attr("disabled", false);
            if ($(this).val() === disabledVal) {
                $(this).attr("disabled", true);
            }
        });
    }

    //ctrl_indicator
    $("select[name='ctrl__indicator']").change(function () {
        //thisObj.generalQuery(url);
        //指标的变化，并不会引起，图的结构一定会改变
        $("#main_content .indicator_basic_plot").each(function (index, element) {
            if ($(element).find(".tabs a.current").size() > 0) {
                $(element).find(".tabs a.current").click();
            } else {
                $(element).find(".tabs a:eq(0)").click();
            }
        });
    });

    // 视图
    $(".changePlotType").click(function (event) {
        //alert("changePlotType"+$(this).parent().find(".plotTypeWrap").html());
        //console.log("html = "+$(this).parent().find(".plotTypeWrap").show());

        //判断是否只有一个游戏，如果是，则不显示类似"累计**"的选项
        var series = JSON.parse($(this).next().next().attr("data-obj")).series;
        if (series && series.length <= 1) {
            $(this).next(".plotTypeWrap").find(".plotTypeList .plot_type_stackedcolumn").hide();
            $(this).next(".plotTypeWrap").find(".plotTypeList .plot_type_stackedpercentcolumn").hide();
            $(this).next(".plotTypeWrap").find(".plotTypeList .plot_type_stackedbar").hide();
            $(this).next(".plotTypeWrap").find(".plotTypeList .plot_type_stackedpercentbar").hide();
            $(this).next(".plotTypeWrap").find(".plotTypeList .plot_type_stackedarea").hide();
            $(this).next(".plotTypeWrap").find(".plotTypeList .plot_type_stackedpercentarea").hide();
        }
        else {
            $(this).next(".plotTypeWrap").find(".plotTypeList .plot_type_stackedcolumn").show();
            $(this).next(".plotTypeWrap").find(".plotTypeList .plot_type_stackedpercentcolumn").show();
            $(this).next(".plotTypeWrap").find(".plotTypeList .plot_type_stackedbar").show();
            $(this).next(".plotTypeWrap").find(".plotTypeList .plot_type_stackedpercentbar").show();
            $(this).next(".plotTypeWrap").find(".plotTypeList .plot_type_stackedarea").show();
            $(this).next(".plotTypeWrap").find(".plotTypeList .plot_type_stackedpercentarea").show();
        }

        $(this).next(".plotTypeWrap").show();
//		$(this).next(".plotTypeWrap").show().position({
//			my: 'right top',
//	     	at: 'right bottom+2',
//	     	of: $(this)
//		});
    });

    $(".plotTypeWrap span").click(function (event) {
        var $parentCls = $(this).parent().attr("class");
        $(".plotTypeWrap").hide();
        var obj = $.parseJSON($("#indicator_basic_plot_result").attr("data-obj"));
        if ($parentCls === "plotTypeList") {//变更plot图表类型
            $(this).parent(".plotTypeList").find("span").removeClass("selected");
            $(this).addClass("selected");
            var type = $(this).attr("data-value");
            var opt = getOptionFromType(type);

            //扩展配置
            if (obj.options) {
                var opts = $.extend({}, obj.options, opt);
                obj["options"] = opts;
            }
            else {
                obj["options"] = opt;
            }
            console.log("opts:", obj);
            thisObj.PlotRender($("#indicator_basic_plot_result"), obj);
        } else if ($parentCls === "plotSwitchList") {
            var opt = {"xStep": $(this).attr("data-value")};
            if ($(this).hasClass("selected")) {
                //取消显示所有
                $(this).removeClass("selected");
                opt = {};
            } else {
                $(this).addClass("selected")
            }
            thisObj.PlotRender($("#indicator_basic_plot_result"), obj, opt);
        }
    });
    /*
     * 隐藏已经显示的plotTypeWrap
     */
    $(document).bind("click", function (event) {
        var $target = event && event.target && $(event.target);
        // event.srcElement - ie/chrome, event.target - firefox
        var flag = $(event.srcElement || event.target).attr("class") == "changePlotType" || ($target && $target.parents(".plotTypeWrap").size() > 0);
        if (!flag) {
            $(".plotTypeWrap").hide();
        }
    });
};

DataApp.prototype.generalInit = function (url, json, parameters) {
    this.meta = json;

    this.options.isEnglishVersion = json.isEnglishVersion;

    this.initTips();

    this.dateInit(url, json);

    this.singleSelectorInit(url, json);

    this.dateTypeSwitcherInit(url, json);
    if (!arguments[3] || arguments[3] != 'GeneralTable') {
        this.tabClickInit(url, json);

        //控制维度Init
        this.ctrlDimClickInit(url, json);
    }
    // set parameters
    this.setParameters(parameters);
};


//每日简报初始化
DataApp.prototype.dailyBriefInit = function (url, json, parameters) {
    this.initTips();
    this.DailyBrief.Init(url, json, this);
};

DataApp.prototype.DailyBrief = {
    PlotTemplate: '<div class="indicator_basic indicator_basic_plot indicator_basic_half" index=@{INDEX}><div class="title"><span>@{PLOTNAME}</span><span class="classTips" style="display:none;">@{PLOTTIPS}</span></div><div class="content"></div></div>',
    Init: function (url, json, _) {
        var $prevNode = $(".indicator_container .indicator_header").next('.spliter');

        //指标数组
        var subjects = json.isEnglishVersion ? json.subjects : json.subjects;
        var index = 0;
        for (var k in subjects) {
            var container = this.PlotTemplate.replace(/@\{INDEX\}/g, index).replace(/@\{PLOTNAME\}/g, k);
            //页面追加图表容器
            $prevNode.after(container);
            //绘制图表
            var opt = {};
            opt.id = json.id;
            opt.op = "plot";
            opt.columnName = json.columnName;
            opt.columnNameCN = subjects[k]['columnNameCN'];
            opt.dateType = subjects[k]['dateType'];
            opt.sql = subjects[k]['sql'];
            opt.type = subjects[k]['type'];
            opt.compareDim = subjects[k]['compareDim'];
            opt.dimTranslate = subjects[k]['dimTranslate'];
            opt.plotType = (subjects[k]['plotType']) ? subjects[k]['plotType'] : null;
            opt.idxValType = (subjects[k]['idxValType']) ? subjects[k]['idxValType'] : null;
            this.Render($(".indicator_basic[index=" + index + "]"), url, opt, _);
            $prevNode = $(".indicator_basic[index=" + index + "]");
            index += 1;
        }
    },
    Render: function ($container, url, opt, _) {
        //console.log("plot json", opt);
        ajaxRequest(url, opt, function (result) {
            _.PlotRender($container.children(".content"), result.plot);
        });
    }
};


DataApp.prototype.g3BriefInit = function (plotUrl, tableUrl) {
    this.G3Brief.RenderPlot($(".indicator_basic_plot"), plotUrl, this);
    this.G3Brief.RenderTable($(".indicator_basic_table"), tableUrl, this);
};

DataApp.prototype.G3Brief = {
    RenderPlot: function ($container, url, _) {
        var fSuccess = function (result) {
            var json = JSON.parse(result);
            if (json.success) {
                var series = [];
                for (var i in json.obj) {
                    var tmpData = [];
                    for (var j = 0; j < json.obj[i].length; ++j) {
                        var tmpTime = new Date(json.obj[i][j]['time'].replace(/-/g, "/")).getTime() + 3600 * 8 * 1000;
                        if (i === "1周前全服在线") {
                            tmpTime += 3600 * 24 * 1000 * 7;
                        }
                        tmpData.push([tmpTime, json.obj[i][j]['rolenum']])
                    }
                    series.push({
                        name: i,
                        data: tmpData
                    })
                }
                var obj = {
                    type: 'timeseries',
                    options: {
                        defaultType: 'line',
                        stacking: null
                    },
                    tooltipOption: {
                        hideDate: true,
                        shared: true
                    },
                    series: series
                };
                _.PlotRender($container.find(".content"), obj);
            }


        }
        //ajaxRequest(url, '',fSuccess );
        _.ajaxManager.nonBlockAjax($container.find(".content"), url, '', fSuccess);
    },
    RenderTable: function ($container, url, _) {
        //block();

        var fSuccess = function (result) {
            var json = JSON.parse(result);
            if (json.success) {
                var values = [];
                for (var i = 0; i < json.list.length; ++i) {
                    values.push([
                        json.list[i]['server_name'],
                        json.list[i]['recent_update_time'],
                        json.list[i]['recent_online_role_num'] + ""
                    ]);
                }
                var obj = {
                    thead: ['服务器', '最新更新时间', '最新在线角色数'],
                    data: values
                };
                //unBlock();
                _.TableRender($container.find(".content"), obj, {displayLength: 100});
            }
        };
        //ajaxRequest(url, '',fSuccess);
        _.ajaxManager.nonBlockAjax($container.find(".content"), url, '', fSuccess);//使用非阻塞的方式加载数据
    }
};


DataApp.prototype.renderPlotTypeWrap = function () {
    var plotTypeSet = [
        {
            clsName: 'plot_type_line',
            dataVal: 'line',
            name:  i18n['line_chart']
        },
        {
            clsName: 'plot_type_column',
            dataVal: 'column',
            name:    i18n['column_chart']
        },
        {
            clsName: 'plot_type_spline',
            dataVal: 'spline',
            name:     i18n['curve_line_chart']
        },
        {
            clsName: 'plot_type_area',
            dataVal: 'area',
            name:     i18n['area_graph']
        },
        {
            clsName: 'plot_type_areaspline',
            dataVal: 'areaspline',
            name:    i18n['surface_chart']// 曲面图
        },


        {
            clsName: 'plot_type_bar',
            dataVal: 'bar',
            name:    i18n['bar_chart'] // 条形图

        },
        {
            clsName: 'plot_type_scatter',
            dataVal: 'scatter',
            name:     i18n['scatter_diagram'] //散点图
        },

        {
            clsName: 'plot_type_stackedcolumn',
            dataVal: 'stackedcolumn',
            name:     i18n['stacked_column_chart']// 堆积柱形图
        },
        {
            clsName: 'plot_type_stackedbar',
            dataVal: 'stackedbar',
            name: i18n['stacked_bar_chart'] //堆积条形图
        },
        {
            clsName: 'plot_type_stackedarea',
            dataVal: 'stackedarea',
            name: i18n['stacked_area_graph'] // 堆积面积图
        },
        {
            clsName: 'plot_type_stackedpercentcolumn',
            dataVal: 'stackedpercentcolumn',
            name: i18n['percentage_stacked_column_chart'] // 百分比堆积柱形图
        },
        {
            clsName: 'plot_type_stackedpercentbar',
            dataVal: 'stackedpercentbar',
            name: i18n['percentage_stacked_bar_chart'] //百分比堆积条形图
        },
        {
            clsName: 'plot_type_stackedpercentarea',
            dataVal: 'stackedpercentarea',
            name: i18n['percentage_stacked_area_graph'] // 百分比堆积面积图
        }
    ];

    var plotSwitchSet = [
        {
            clsName: 'plot_switch_allXAxis',
            dataVal: 1,
            name: i18n['show_all_x']//显示所有X轴
        }
    ];

    var $plotTypeWrap = $(".indicator_basic .content .plotTypeWrap");
    var tpl = '';

    tpl += '<div class="plotSwitchList">';
    //控制绘图相关属性开关
    for (var i = 0; i < plotSwitchSet.length; ++i) {
        tpl += '<span class="' + plotSwitchSet[i]["clsName"] + '"' + ' data-value="' + plotSwitchSet[i]["dataVal"] + '"' + '>' + plotSwitchSet[i]["name"] + '</span>';
    }
    tpl += '</div>';
    tpl += '<div class="plotTypeList">';
    for (var i = 0; i < plotTypeSet.length; ++i) {
        tpl += '<span class="' + plotTypeSet[i]["clsName"] + '"' + ' data-value="' + plotTypeSet[i]["dataVal"] + '"' + '>' + plotTypeSet[i]["name"] + '</span>';
    }
    tpl += '</div>';
    $plotTypeWrap.empty();
    $plotTypeWrap.append(tpl);

};

/**
 * 根据传递参数中obj的值和配置，初始化累计/平均值的按钮
 * obj.option.disableSumAndAvg ==true则不显示
 * @param series
 * @returns 若显示，则返回jQuery包裹过的对象
 */
DataApp.prototype.initSumAndAvgBtn = function ($plotResult, obj) {
    var thisObj = this;
    var series = obj.series;
    var options = obj.options;
    var currentTabName = $plotResult.parents('.indicator_basic.indicator_basic_plot').find('.title .tabs .current').text();//当前选中的图的tab
    var results = [];//利用闭包缓存计算过的结果);

    //由于之前可能曾经已经构建成功了按钮以及内容，所以一开始尝试获取此对象。
    var $sumAndAvgBtn = $plotResult.parent().find('.sumAndAvgBtn');//尝试获取累计/平均的按钮
    var $sumAndAvgResultWrap = $sumAndAvgBtn.next('.sumAndAvgResultWrap');//尝试获取累计/平均的内容div


    /***************内部函数 Begins**************************/


    /**
     * 判断是否特殊的例子，如带有'率'，'均'，'rate'用以判断是否需要计算该序列的平均/总数
     */
    function specialCase(name) {
        var special = false;

        if (name &&
            (name.indexOf('率') > -1 || name.indexOf('均') > -1 || name.indexOf('比例') > -1
          || name.toUpperCase().indexOf('ARPU') > -1 || name.toUpperCase().indexOf('ARPPU') > -1
          || name.toUpperCase().indexOf('RETENTION')>-1 || name.toUpperCase().indexOf('RATE')>-1
          || name.toUpperCase().indexOf('AVG')>-1
            )) {
            special = true;
        }

        return special;
    }

    /**
     * 判断序列是否全都是特殊的不需要计算的case
     * @param series
     * @returns {boolean}
     */
    function allSpecialCases(series) {
        var allSpecial = true;
        for (var i = 0; i < series.length; i++) {
            if (!specialCase(series[i].name)) {//有一个非特殊的case，即为false
                allSpecial = false;
                break;
            }
        }
        return allSpecial;
    }

    /**
     * 判断此图的所有tabs是否全都是特殊的不需要计算的case
     * @param series
     * @returns {boolean}
     */
    function allTabsSpecialCases() {
        var allSpecial = true;
        var $tabs = $plotResult.parents('.indicator_basic.indicator_basic_plot').find('div .tabs').children();
        for (var i = 0; i < $tabs.length; i++) {
            if (!specialCase($tabs[i].text)) {//有一个非特殊的case，即为false
                allSpecial = false;
                break;
            }
        }
        return allSpecial;
    }

    /**
     * 返回是否应该显示累计/平均值的按钮
     * 没有数据，配置禁用，或者全部序列均为不需要显示的特殊case，则返回false
     * @param series
     * @param options
     * @returns {boolean}
     */
    function shouldShowBtn(series, options) {
        var should = true;
        if (!series || series.length === 0 || (options && options[OtherOptions.KEYS.DISABLE_SUM_AND_AVG] === 'true') || allTabsSpecialCases()) {
            should = false;
        }
        return should;
    }


    /**
     * 计算，并构建累积/平均值的数据内容及绑定相应事件
     * 注：此函数会修改results的值，以缓存计算结果
     * @param series
     * @returns 被jQuery包裹的创建出来的对象
     */
    function createDataElement(series) {
        for (var i = 0; i < series.length; i++) {
            var res = {name: series[i].name}; //一个序列的数据
            if (!specialCase(series[i].name) && !specialCase(currentTabName)) {
                var sum = 0;
                var cnt = 0;
                var data = series[i].data;//序列中的数据
                for (var j = 0; j < data.length; j++) {
                    if (isNumber(data[j])) {
                        sum += data[j];
                        cnt++;
                    }
                    else {
                        console.log(data[j], ' is not a number! IGNORE! ')
                    }
                }
                res['sum'] = Highcharts.numberFormat(sum, 2).replace('.00', '');
                res['avg'] = Highcharts.numberFormat(sum / cnt, 2);//平均值保留两位小数
            }
            else {//特殊的序列
                res['sum'] = '-';
                res['avg'] = '-';
            }
            results.push(res);
        }//end of for, results中已经存有内容

        //动态构建内容
        var sumAndAvgResultWrap = '<div class="sumAndAvgResultWrap" style="display:none;"></div>';
        var table = '<table class = "subAndAvgResultTable" style = "width:100%">' +
                     '<tr>' +
                            '<th>'+i18n['serie_name']+'</th>'+
                            '<th>'+i18n['total']+'</th>'+
                            '<th>'+i18n['avg']+'</th>'+
                        '</tr>'+
                     '</table>';
        $(this).after(sumAndAvgResultWrap);
        $sumAndAvgResultWrap = $(this).next('.sumAndAvgResultWrap');
        $sumAndAvgResultWrap.append(table);
        for (var i = 0; i < results.length; i++) {//使用缓存的值中构建table的行
            var tr = '<tr><td>' + results[i]['name'] + '</td>' + '<td>' + results[i]['sum'] + '</td>' + '<td>' + results[i]['avg'] + '</td></tr>'
            $(".sumAndAvgResultWrap table").append(tr);
        }

        //绑定Hover函数，当用户hover中相应table行时候，高亮该series
        var chart = $plotResult.highcharts();

        var highlightSerieCallback = function (e) {
            var seriesName = $(this).find(':first-child').text();
            //console.log('hightLight ', seriesName);
            $.each(chart.series, function (i, s) {
                if (s.name === seriesName) {
                    s.onMouseOver();
                    return false;//break the each
                }
            });
        };

        var disHighlightSerieCallback = function (e) {
            var seriesName = $(this).find(':first-child').text();
            //console.log('DisHightLight ', seriesName);
            $.each(chart.series, function (i, s) {
                if (s.name === seriesName) {
                    s.onMouseOut();
                    return false;//break the each
                }
            });
        };

        $sumAndAvgResultWrap.find('tr:not(:first-child)').off("mouseenter mouseleave").hover(highlightSerieCallback, disHighlightSerieCallback);

        $sumAndAvgResultWrap.off('click').on('click', function (e) {
            e.stopPropagation();//防止冒泡到document而触发隐藏事件
        });

        return $sumAndAvgResultWrap;
    }

    /********End of 内部函数*********/

    if (shouldShowBtn(series, options)) {//应该显示此按钮
        if ($sumAndAvgBtn.length === 0) {//但还没有建立，动态构建【累计/平均值】的按钮
            var sumAndAvgBtn = '<div class="sumAndAvgBtn">'+i18n.sum_avg+'</div>';
            $plotResult.parent().prepend(sumAndAvgBtn);
            $sumAndAvgBtn = $plotResult.parent().find('.sumAndAvgBtn');//赋值保存起来
        }
        $sumAndAvgBtn.show();
        $sumAndAvgResultWrap.hide();
    }
    else {//不应该显示此btn的，隐藏
        $sumAndAvgBtn.hide();
        $sumAndAvgResultWrap.hide();
    }

    //以绑定事件回调
    $('div .indicator_basic_plot .sumAndAvgBtn').off('click').on('click', function (e) {
        if (results.length === 0) {//还没有保存过值，证明第一次点击，保存计算的结果到results数组中，以便不需每次点击都重新计算并建立元素
            $sumAndAvgResultWrap = createDataElement.call(this, series);
        }
        $sumAndAvgResultWrap.show();
    });

    $(document).on('click', function (e) {
        console.log(e.target);
        if (e.target != $sumAndAvgBtn[0]) {//确定不是btn的click事件
            $sumAndAvgResultWrap.hide();
        }
    });
    if ($sumAndAvgBtn.length > 0) return $sumAndAvgBtn;
}

/**
 * 在series中查找上一个点
 * @param series
 * @param key
 * @returns {*}
 */
DataApp.prototype.findPrevInSeries = function (series, key) {
    if (series.data && series.data.length > 0) {
        var cur = 0;
        $.each(series.data, function (i, e) {
            if (e.category == key) {
                cur = i;
            }
        });
        if (cur > 0) {
            return series.data[cur - 1];
        }
    }
    return null;
}

/**
 * 在series中查找下一个点
 * @param series
 * @param key
 * @returns {*}
 */
DataApp.prototype.findNextInSeries = function (series, key) {
    if (series.data && series.data.length > 0) {
        var cur = 0;
        $.each(series.data, function (i, e) {
            if (e.category == key) {
                cur = i;
            }
        });
        if (cur < series.data.length - 1) {
            return series.data[cur + 1];
        }
    }
    return null;
}