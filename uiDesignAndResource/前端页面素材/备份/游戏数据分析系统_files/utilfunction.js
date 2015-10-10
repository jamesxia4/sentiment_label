/**
 * Created by ljjn1246 on 15-5-15.
 * 由于common.js太大，为了区别处理，创建本文件保留一些与系统业务无关的工具函数
 */

/**
 * Added by ljjn1246
 * 对一个obj的keys进行排序，返回排序后的数组
 * 若没有传入sortFunction,则按照默认排序
 */
function sortedKeys(obj, sortFunction){
    var keys = [];
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            keys.push(key);
        }
    }
    // sort keys
    if(sortFunction){
        keys.sort(sortFunction);
    }
    else{
        keys.sort();
    }

    return keys;
}


/**************************************jQuery dom 操作函数*******************************************************/

/**
 * 创建带类属性的jquery结点
 */
var $createElement = function (elementType,attr) {
    var $element=$('<'+elementType+'>');//构建一个元素
    if(attr){
        for(var attrKey in attr){
            if(attr.hasOwnProperty(attrKey)){
                if(attrKey.toLowerCase()==='class'){//先判断类
                    var cls = attr[attrKey];//类列表
                    if(cls!==undefined) {//有类
                        if(Array.isArray(cls)){//多个类
                            for(var i=0;i< cls.length;i++){
                                $element.addClass(cls[i])
                            }
                        }
                        else{
                            $element.addClass(cls);//一个类
                        }
                    };//增加类
                }
                else{//其他属性，如id,name 或其他
                    var attrValue= attr[attrKey];
                    $element.attr(attrKey,attrValue)
                }
            }

        }

    }
    return $element;
};

//创建带类属性的jquery,div
var $div=function(attr){
    return $createElement('div',attr);
}

//创建带类属性的jquery的span
var $span=function(attr){
    return $createElement('span',attr);
}


/************************************************字符串工具函数****************************************************/

/**
 * 把一个对象转为url的参数格式
 * @param data
 */
function toURLParam(data){
    var paramStr = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&');
    return paramStr;
}

/**
 * 若对象为空，则使用默认值替换
 * @param o
 * @param defaultVal
 * @returns {*}
 */
function nvl(o,defaultVal){
    if (o===0) return 0;//数值是0，直接返回
    return o ||defaultVal;//实际上的空值都替换为default
}





/*************************************************数字工具函数***************************************************/
/**
 * ljjn1246
 * 不够length长度则左补0
 * @param str
 * @param length
 * @returns {string}
 */
function paddingZero(str,length){
    return new Array(length - str.length + 1).join("0") + str;
}

/**
 * added by ljjn1246 判断一个数字是否是整型
 * @param n
 * @returns {boolean}
 */
function isInt(n) {
    return Number(n)===n && n%1===0;
}

/**
 * added by ljjn1246 判断一个数字是否是浮点数字
 * @param n
 * @returns {boolean}
 */
function isFloat(n){
    return   n===Number(n)  && n%1!==0
}

/**
 * ljjn1246
 * 四舍五入，保留decimals为数字，
 * 如果本身是整数则返回整数
 * @param n
 * @param decimals
 * @returns {*}
 */
function roundDisplay(n,decimals){
    if(n===null || n===undefined || !isActuallyNumeric(n)) return '-';
    if(isInt(n)) return n;
    if( isActuallyNumeric(n) && (typeof n === 'string' || n instanceof String))
        return roundDisplay(parseFloat(n),decimals);//转字符串为数字，递归调用

    return (n.toFixed(decimals))/1;
}

function toDisplayNum(n,digits){
    if(isNaN(n)) return '-';
    return n.toFixed(digits);
}

/**
 * 字符串转float, 保留decimals位小数
 * @param str
 * @param decimals
 * @returns {number}
 */
function toRoundNumber(str,decimals){
    return +parseFloat(str).toFixed(decimals);
}


/**
 * ljjn1246 20150907
 * 判断是否数字， 若字符串表示为数字也返true
 * @param num
 * @returns {boolean}
 */
function isActuallyNumeric(num){
    if(num===null||num===undefined||num==='') return false;

    return !isNaN(num)
}
/**
 * 判断是否[-100%,100%]之间的百分比数字
 * @param validStrArr
 * @returns {boolean}
 */
function isPercentage(validStrArr){
    if (typeof validStrArr !== 'string') return false;//不是字符串
    if(validStrArr.charAt(validStrArr.length-1) !=='%') return false;//没有带% return false

    var x = parseFloat(validStrArr);//强行转换为数字
    if (isNaN(x) || x < -100 || x > 100) {
        return false;
    }
    else return true;
}

/**
 * added by ljjn1246
 * 数字转百分比显示, 保留digits位小数, 若传来的不是数字，则返回-
 * 若digits没有传，则把n*100判断是否整数，若是整数，不保留小数位，若整数，则保留一位小数
 */
function toPercentage(n,digits){
    if(isNaN(n) || n==null || n==undefined) return '-';
    if(digits===undefined) {digits = isInt(n*100)? 0: 1;}//没有传，浮点数保留一位小数，整数不保留小数
    return (n*100).toFixed(digits) +"%";
}


/**
 * 百分比转数字
 * 使用parseFloat(percentageStr)/100 返回
 * @param percentageStr
 * @returns {*}
 */
function toDecimal(percentageStr){
    if (typeof percentageStr !== 'string' || percentageStr.charAt(percentageStr.length-1) !=='%') return parseFloat(percentageStr);//没有带%，直接返回
    else return parseFloat(percentageStr)/100;
}

/***********************************************日期工具函数****************************************************************/

/**
 * 某天所在月第一天,
 * @returns {Date}
 */
function firstDay(date){
    var date = date||new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay;
}

/**
 * 某天所在月最后一天
 * @returns {Date}
 */
function lastDay(date){
    var date = date|| new Date();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);//last day
    return lastDay;
}



/**
 * 把dateid 转换为 yyyy.mm.dd的格式，其中spliter是年月日的分隔符， 默认为'.'
 * @param dateid
 * @param spliter 分隔符
 * @returns {string}
 */
function formatDateId(dateid,spliter){
    if(!spliter) spliter='.';//默认用.分割
    var year = parseInt(dateid/10000,10);
    var month =parseInt((dateid%10000)/100,10);
    var day = dateid%100;
    return year+spliter+paddingZero(month+"",2)+spliter+paddingZero(day+"",2);
}


/**ljjn1246
 * 中文显示的日期转换为数字dateid
 * 2015年1月10日-->20150110
 * @param dateStr
 */
function chineseDateStrToDateId(dateStr){
    var regx = /^[1-9]\d{3}年\d\d?月\d\d?日$/;//2015年1月10日
    var dateId =0;
    if(regx.test(dateStr)){
        var tmp=dateStr.split('年');
        var year =tmp[0];
        tmp=tmp[1].split('月');
        var month=paddingZero(tmp[0],2);
        tmp=tmp[1].split('日');
        var day=paddingZero(tmp[0],2);
        var dateId=parseInt(year+month+day,10);
    }
    return dateId;

}


/**
 * dateid 转换为Date对象
 * @param dateid
 * @returns {Date}
 */
function toDate(dateid){
    var dateString  = dateid.toString();
    var year        = dateString.substring(0,4);
    var month       = dateString.substring(4,6);
    var day         = dateString.substring(6,8);
    var date        = new Date(year, month-1, day);
    return date;
}

/**
 * 日期date1 和date2 的天数间隔
 * @param date1
 * @param date2
 * @returns {number}
 */
function dayDiff(date1, date2) {
    return Math.floor((date1-date2)/(1000*60*60*24));
}


/**
 * 传入一个dateid, 返回增加天数后的dateid
 * @param dateid
 * @param numberOfDaysToAdd
 * @returns {Number}
 */
function addDays(dateid, numberOfDaysToAdd){
    var someDate = toDate(dateid);//转为日期格式
    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    var yyyy=someDate.getFullYear().toString();
    var mm = (someDate.getMonth()+1).toString();
    var dd = someDate.getDate().toString();
// CONVERT mm AND dd INTO chars
    var mmChars = mm.split('');
    var ddChars = dd.split('');

// CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
    var datestring = yyyy+ (mmChars[1]?mm:"0"+mmChars[0]) + '' + (ddChars[1]?dd:"0"+ddChars[0]);

    return parseInt(datestring,10);
}


/****************Blocking ajax****************/
// 发送AJAX请求， error参数可以为空
function blockAjax(setting,extendOption) {
    var defaultSetting={
        type:'POST',//post 请求
        data:{},//空参数.
        beforeSend:function (jqXHR, settings) {//开始前block
            block();
        },
        complete: function (jqXHR, textStatus) {//无论成功还是失败，都unblock
            unBlock();
        },
        error: function (jqXHR,textStatus,errorThrow){
            console.error(jqXHR,textStatus,errorThrow);
        }
    }

    if(extendOption){//保留扩展的一些选项

    }

    var setting = $.extend({},defaultSetting,setting);
    return $.ajax(setting);

}



/********************************************通用的UI函数**************************************************

 /**
 * 创建一个提示文本，显示一段时间后消失
 * setting{
 *  text:'显示的文本'
 * }
 * @param setting
 */
function toast(setting){
    var notificationText=setting['text'];//文本
    var $toast=$div({class:'notification-toast'}).text(notificationText).appendTo($('body'));
    $toast.fadeIn('slow',function(){
        $(this).delay(2000).fadeOut(400,function(){$(this).remove()});
    });//toast的提示，然后删除
}


/**
 * 弹窗确认
 * @param text
 * @param setting
 */
function diaglogConfirm(text,setting){
    var defualtSetting={
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        title:'确认修改？',
        buttons: {
            '确定':function(){
                $(this).dialog('close');
            },
            '取消':function(){
                $(this).dialog('close');
            }
        }
    }

    var setting  = $.extend({},defualtSetting,setting);

    $('.jdiaglog-confirm').remove();
    var $diaglogWrapper=$div({class:'jdiaglog-confirm'}).appendTo($('body')).append($span({class:"content"}).html(text));

    $diaglogWrapper.dialog(setting);
}


/**
 * 把一个JSON转化为可下载的csv文件
 * @param JSONData
 * @param ReportTitle
 * @param ShowLabel
 * @constructor
 */
function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {

    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }
        row = row.slice(0, -1);
        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }
        row.slice(0, row.length - 1);
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //this trick will generate a temp "a" tag
    var link = document.createElement("a");
    link.id="lnkDwnldLnk";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);

    var csv = "\ufeff"+CSV;//加上 \ufeff BOM 头 解决excel 打开的乱码问题
    var blob = new Blob([csv], { type: 'text/csv' });
    var csvUrl = window.webkitURL.createObjectURL(blob);
    var filename = ReportTitle+'.csv';
    $("#lnkDwnldLnk")
        .attr({
            'download': filename,
            'href': csvUrl
        });

    $('#lnkDwnldLnk')[0].click();
    document.body.removeChild(link);
}


/**
 * 把数组导出成CSV文件
 * @param arrData
 * @param ReportTitle
 * @constructor
 */
function arrayToCSVConvertor(arrData, reportTitle) {
    var processRow = function (row) {//对每行记录csv进行处理 ,http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal;
    };

    //开始处理数据
    var CSV='';//csv字符串
    arrData.forEach(function(infoArray, index){
        //var dataString = infoArray.join(",");
        var dataString = processRow(infoArray);//处理特殊字符如","
        dataString= dataString.split('\n').join('；');//去除回车
        CSV += dataString+ "\n";
    });


    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //临时构建一个a标签用于下载，然后点击，然后移除
    var link = document.createElement("a");
    link.id="lnkDwnldLnk";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);

    var csv = "\ufeff"+CSV;//加上 \ufeff BOM 头 解决excel 打开的乱码问题
/*    window.open(encodeURI(csv));*/

    var blob = new Blob([csv], { type: ' type: "text/csv;charset=UTF-8"' });
    //var csvUrl = window.webkitURL.createObjectURL(blob);
    var csvUrl = createObjectURL(blob);

    var filename = reportTitle+'.csv';

    if(navigator.msSaveBlob){//IE 10
        return navigator.msSaveBlob(blob, filename);
    }else{
        $("#lnkDwnldLnk")
            .attr({
                'download': filename,
                'href': csvUrl
            });
        $('#lnkDwnldLnk')[0].click();
        document.body.removeChild(link);
    }
}


function createObjectURL ( file ) {
    if ( window.URL && window.URL.createObjectURL ) {
        return window.URL.createObjectURL( file );
    }
    else if ( window.webkitURL ) {
        return window.webkitURL.createObjectURL( file );
    }
    else {
        return null;
    }
}


function copyToClipBoard(elelemnt){
    selectElementContents(elelemnt);//select the text
    document.execCommand("copy");//copy
    document.getSelection().removeAllRanges();//remove select
}

function selectElementContents(el) {
    var body = document.body, range, sel;
    if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
            range.selectNodeContents(el);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(el);
            sel.addRange(range);
        }
    } else if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
}


function sleep(n) {
    var start = new Date().getTime();
    while (true) {
        if (new Date().getTime() - start > n) {
            break;
        }
    }
};
