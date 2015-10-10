/**
 * 周选择控件
 * Created by gzhuangzhankun on 2015/3/13.
 */

;
(function ($, window, document, undefined){
    $.fn.gdasWeekPicker = function(options){
        var opts = $.extend({}, $.fn.gdasWeekPicker.options, options);
        return this.each(function(index, input){
            $(this).hide();

            var suffix = (new Date()).getTime();
            var member = {
                weekPickerFrameId: "gdasWeekPickerFrame_" + suffix,
                divWeekId: "divWeek_" + suffix,
                weekInputId: "weekInput_" + suffix,
                triggerId: "gdasWeekPickerTrigger_" + suffix,
                weekPickerTargetId: "gdasWeekPickerTarget_" + suffix,
                weekPickerId: "gdasWeekPicker_" + suffix,
                aCurWeekId: "aCurWeek_" + suffix,
                aRecent2WeeksId: "aRecent2Weeks_" + suffix,
                aRecent4WeeksId: "aRecent4Weeks_" + suffix,
                aRecent12WeeksId: "aRecent12Weeks_" + suffix,
                aRecent24WeeksId: "aRecent24Weeks_" + suffix,
                replaceBtn: "btn_compare_" + suffix
            }

            opts.inputTrigger = member.triggerId;
            opts.inputId = member.weekInputId;
            opts.target = member.weekPickerTargetId;
            opts.weekPickerFrameId = member.weekPickerFrameId;
            this.id = "gdasWeekPickerHandler_" + suffix;
            opts.divWeekId = member.divWeekId;
            opts.weekPickerHandlerId = this.id;
            opts.replaceBtn = member.replaceBtn;
            opts.quickSelectId = "short_opt_" + suffix;
            opts.compareLabel = "compareLabel_" + suffix;

            if(opts.addQuickSelect == true){
                opts.aCurWeek = member.aCurWeekId;
                opts.aRecent2Weeks = member.aRecent2WeeksId;
                opts.aRecent4Weeks = member.aRecent4WeeksId;
                opts.aRecent12Weeks = member.aRecent12WeeksId;
                opts.aRecent24Weeks = member.aRecent24WeeksId;
            }

            addWeekPickerQuickSelectHtml(input, member, opts);
            if(this.value.split(',').length >= 2){
                opts.isSingleWeek = false;
                var startWeek = this.value.split(',')[0];
                var endWeek = this.value.split(',')[1];
                opts.startWeek = startWeek;
                opts.endWeek = endWeek;
            }else{
                opts.isSingleWeek = true;
                opts.startWeek = this.value;
                opts.endWeek = this.value;
            }

            if(opts.needCompare == true){
                var scWeek = strToWeek(opts.startWeek);
                var ecWeek = strToWeek(opts.endWeek);
                var scWeekStartDate = scWeek.weekToDateInterval()[0];
                var ecWeekStartDate = ecWeek.weekToDateInterval()[0];
                var delta = ecWeekStartDate - scWeekStartDate;
                scWeekStartDate.setUTCMilliseconds(scWeekStartDate.getUTCMilliseconds() - delta - 7 * 24 * 60 * 60 * 1000);
                ecWeekStartDate.setUTCMilliseconds(ecWeekStartDate.getUTCMilliseconds() - delta - 7 * 24 * 60 * 60 * 1000);
                var WEEKOFYEAR = new WeekOfYear();
                var scYW = WEEKOFYEAR.dateToYW(scWeekStartDate);
                var ecYW = WEEKOFYEAR.dateToYW(ecWeekStartDate);
                opts.startCompareWeek = new WeekOfYear(scYW[0], scYW[1]).formatWeekOfYear();
                opts.endCompareWeek = new WeekOfYear(ecYW[0], ecYW[1]).formatWeekOfYear();
            }

            input._weekPicker = new pickerWeekRange(opts.inputId, opts);
            sleep(1);
        });
    };

    $.fn.gdasWeekPicker.options = {
        //自动提交
        autoSubmit: false,
        needCompare: false,
        isSingleWeek: false,
        addQuickSelect: false,
        isEnglishVersion: GDAS.isEnglishVersion,//added by ljjn1246 20150922
        timezone: 'Asia/Shanghai',

        //回调函数
        success: function (obj) {
        }
    };

    //填充额外的HTML文本，这里css与mta的css名一致，如需修改css,需要修改本函数
    function addWeekPickerQuickSelectHtml(a, member, opts) {

        $(a).after('<div class="tool_week cf" id="' + member.weekPickerFrameId + '"></div>');
        $('#' + member.weekPickerFrameId).append('<button class="compareSwitchBtn" style="float:right" id="' + member.replaceBtn + '">' + (opts.isEnglishVersion ? 'Week Comparison' : '按时间对比') + '</button>');
        $('#' + member.weekPickerFrameId).append('<div class="week" id="' + member.divWeekId + '">' +
            '<span class="week_title" id="' + member.weekInputId + '"></span>' +
            '<a class="opt_sel" id="' + member.triggerId + '" href="#"><i class="i_orderd"></i></a></div>' +
            '<div id="' + member.weekPickerTargetId + '"></div>'
        );
        if (opts.addQuickSelect) {
            $('#' + member.weekPickerFrameId).append('<div class="week-section cf" id="' + opts.quickSelectId + '">' +
            '<ul id="toolbar" class="select cf">' +
            '<li class="active"><a id="' + member.aCurWeekId + '" href="javascript:void(0);">' + (opts.isEnglishVersion ? 'CurrentWeek' : '本周') + '</a></li>' +
            '<li class=""><a id="' + member.aRecent2WeeksId + '" href="javascript:void(0);">' + (opts.isEnglishVersion ? '2 Weeks' : '最近2周') + '</a></li>' +
            '<li class=""><a id="' + member.aRecent4WeeksId + '" href="javascript:void(0);">' + (opts.isEnglishVersion ? '4 Weeks' : '最近4周') + '</a></li>' +
            '<li class=""><a id="' + member.aRecent12WeeksId + '" href="javascript:void(0);">' + (opts.isEnglishVersion ? '12 Weeks' : '最近12周') + '</a></li>' +
            '<li class=""><a id="' + member.aRecent24WeeksId + '" href="javascript:void(0);">' + (opts.isEnglishVersion ? '24 Weeks' : '最近24周') + '</a></li>' +
            '</ul>' +
            '</div>');
        }
    }

    //伪sleep函数，保证生成控件的时间id唯一
    function sleep(n) {
        var start = new Date().getTime();
        while (true) {
            if (new Date().getTime() - start > n) {
                break;
            }
        }
    }

    function strToWeek(str) {
        var ar = str.split('-');
        return new WeekOfYear(Number(ar[0]), Number(ar[1]));
    }
})(jQuery, window, document);

/**
 * @description 周选择器对象的构造函数入口
 * @param inputId 周选择器ID
 * @param options 配置参数，可覆盖默认参数
 */
function pickerWeekRange(inputId, options) {
    /**
     * 默认配置参数
     */
    var defaults = {
        aCurWeek: 'aThisWeek', //本周
        aRecent2Weeks: 'aRecent2Weeks', //最近2周
        aRecent4Weeks: 'aRecent4Weeks', //最近3周
        aRecent12Weeks: 'aRecent12Weeks', //最近12周
        aRecent24Weeks: 'aRecent24Weeks', //最近24周
        startWeek: '', //开始周，如201501表示2015年第一个自然周
        endWeek: '', //结束周
        startCompareWeek: '', //对比开始周
        endCompareWeek: '', //对比结束周
        minValidWeek: '1970-01', //最小可选择的周
        maxValidWeek: '', //最大可用的周，与stopWeek配置互斥
        success: function (obj) {
            return true
        }, //回调函数，选择周之后执行何种操作
        startWeekId: 'targetStartWeek', //开始周输入框ID
        startCompareWeekId: 'targetStartCompareWeek', //对比开始周输入框ID
        endWeekId: 'targetEndWeek', //结束周输入框ID
        endCompareWeekId: 'targetEndCompareWeek', //对比结束周输入框ID
        target: '', //周选择框的目标，一般为<form>的ID值
        needCompare: false, //是否需要进行日期对比
        suffix: '', //控件ID的后缀
        inputTrigger: 'input_trigger', //
        compareTrigger: 'compare_trigger', //
        compareCheckboxId: 'targetNeedCompare', //比较选择框
        calendars: 2, // 最多展示的日历数
        weekRangeMax: 156, //选择的周区间的最大范围，以周计算
        weekTable: 'weekRangeTable', //周表格的CSS类
        selectCss: 'weekRangeSelected', //选中的周的CSS类
        compareCss: 'weekRangeSelected', //比较周选中的CSS类
        coincideCss: 'weekRangeCoincide', //重合部分的样式
        firstCss: 'first', //起始样式
        lastCss: 'last', //结束样式
        clickCss: 'curWeek', //点击样式
        disableGray: 'weekRangeGray', //不可选的周的样式
        isCurWeek: 'weekRangeCurWeek', //
        joinLineId: 'joinLine',
        isSingleWeek: false,
        defaultText: ' ~ ',
        singleCompare: false,
        stopWeek: true,
        isCurWeekValid: true,
        shortOpr: false, //结合单周选择的短操作，不需要确定和取消的操作按钮
        noCalendar: false, //输入框是否展示
        autoCommit: false, //加载后立马自动提交
        autoSubmit: false, //没有确定和取消按钮，直接提交
        replaceBtn: 'btn_compare',
        quickSelectedId: 'short_opr',
        isEnglishVersion: false,
        theme: 'ta'
    };

    this.WEEKOFYEAR = new WeekOfYear();

    //将对象赋给__method对象
    var __method = this;

    this.inputId = inputId;
    this.inputCompareId = inputId + 'Compare';
    this.compareInputDiv = 'div_compare_' + inputId;
    this.mOpts = $.extend({}, defaults, options);
    this.mOpts.calendars = Math.min(this.mOpts.calendars, 3);
    this.periodObj = {};
    this.periodObj[__method.mOpts.aCurWeek] = 0;
    this.periodObj[__method.mOpts.aRecent2Weeks] = 2;
    this.periodObj[__method.mOpts.aRecent4Weeks] = 4;
    this.periodObj[__method.mOpts.aRecent12Weeks] = 12;
    this.periodObj[__method.mOpts.aRecent24Weeks] = 24;

    this.startDefWeek = '';
    var suffix = '' === this.mOpts.suffix ? (new Date()).getTime() : this.mOpts.suffix;
    this.calendarId = 'calendar_week_' + suffix;
    this.weekListId = 'weekRangePicker_' + suffix;
    this.weekRangeDiv = 'weekRangeDiv_' + suffix;
    this.weekRangeCompareDiv = 'weekRangeCompareDiv_' + suffix;
    this.compareCheckBoxDiv = 'weekRangeCompareCheckBoxDiv_' + suffix;
    this.submitBtn = 'submit_' + suffix;
    this.closeBtn = 'cloaseBtn_' + suffix;
    this.preYear = 'weekRangePreYear_' + suffix;
    this.nextYear = 'weekRangeNextYear_' + suffix;

    this.divWeekId = this.mOpts.divWeekId;
    this.compareTrigger = this.mOpts.compareTrigger + '_' + suffix;
    this.mOpts.compareTrigger = this.mOpts.compareTrigger + '_' + suffix;

    this.mOpts.startWeekId = this.mOpts.startWeekId + '_' + suffix;
    this.mOpts.endWeekId = this.mOpts.endWeekId + '_' + suffix;
    this.mOpts.compareCheckboxId = this.mOpts.compareCheckboxId + '_' + suffix;
    this.mOpts.startCompareWeekId = this.mOpts.startCompareWeekId + '_' + suffix;
    this.mOpts.endCompareWeekId = this.mOpts.endCompareWeekId + '_' + suffix;

    this.startWeekId = 'startDate_' + suffix;
    this.endWeekId = 'endDate_' + suffix;
    this.compareCheckboxId = 'needCompare_' + suffix;
    this.startCompareWeekId = 'startCompareDate_' + suffix;
    this.endCompareWeekId = 'endCompareDate_' + suffix;

    var wrapper = {
        ta: [
            '<div id="' + this.calendarId + '" class="ta_calendar_week ta_calendar_week2 cf">',
            '<div class="ta_calendar_week_cont cf" id="' + this.weekListId + '">',
            '</div>',
            '<div class="ta_calendar_week_footer cf" ' + (this.mOpts.autoSubmit ? ' style="display:none" ' : '') + '>',
            '<div class="frm_msg">',
            '<div id="' + this.weekRangeDiv + '">',
            '<input type="text" class="ta_ipt_text_s_week" name="' + this.startWeekId + '" id="' + this.startWeekId + '" value="' + this.mOpts.startWeek + '"  />',
            '<span class="' + this.mOpts.joinLineId + '"> - </span>',
            '<input type="text" class="ta_ipt_text_s_week" name="' + this.endWeekId + '" id="' + this.endWeekId + '" value="' + this.mOpts.endWeek + '"  /><br />',
            '</div>',
            '<div id="' + this.weekRangeCompareDiv + '">',
            '<input type="text" class="ta_ipt_text_s_week" name="' + this.startCompareWeekId + '" id="' + this.startCompareWeekId + '" value="' + this.mOpts.startCompareWeek + '"  />',
            '<span class="' + this.mOpts.joinLineId + '"> - </span>',
            '<input type="text" class="ta_ipt_text_s_week" name="' + this.endCompareWeekId + '" id="' + this.endCompareWeekId + '" value="' + this.mOpts.endCompareWeek + '"  />',
            '</div>',
            '</div>',
            '<div class="frm_btn">',
            '<input class="ta_btn ta_btn_primary" type="button" name="' + this.submitBtn + '" id="' + this.submitBtn + '" value="' + (this.mOpts.isEnglishVersion ? "OK" : "确定") + '" />',
            '<input class="ta_btn" type="button" id="' + this.closeBtn + '" value="' + (this.mOpts.isEnglishVersion ? "Cancel" : "取消") + '"/>',
            '</div>',
            '</div>',
            '</div>'
        ]
    }

    var checkBoxWrapper = {
        ta: [
            '<label class="contrast" for ="' + this.compareCheckboxId + '" id="' + this.mOpts.compareLabel + '">',
            '<input type="checkbox" class="pc" name="' + this.compareCheckboxId + '" id="' + this.compareCheckboxId + '" value="1" style="display:none;"/>' + (this.mOpts.isEnglishVersion ? "vs" : '对比'),
            '</label>',
            '<div class="week" id="' + this.compareInputDiv + '">',
            '	<span name="weekCompare" id="' + this.inputCompareId + '" class="week_title"></span>',
            '	<a class="opt_sel" id="' + this.compareTrigger + '" href="#">',
            '		<i class="i_orderd"></i>',
            '	</a>',
            '</div>'
        ]
    }

    $(checkBoxWrapper[this.mOpts.theme].join('')).insertAfter($('#' + this.divWeekId));
    if (this.mOpts.weekPickerFrameId && '' != this.mOpts.weekPickerFrameId){
        $('#' + this.mOpts.weekPickerFrameId).attr('calendar-id', this.calendarId);
    }
    if (this.mOpts.noCalendar) {
        $('#' + this.inputId).css('display', 'none');
        $('#' + this.compareCheckboxId).parent().css('display', 'none');
    }

    $(0 < $('#appendParent').length ? '#appendParent' : document.body).append(wrapper[this.mOpts.theme].join(''));
    $('#' + this.calendarId).css('z-index', 10000000);//此处改成10000000防止被热力图的选择框遮挡

    // 初始化目标地址的元素
    if (1 > $('#' + this.mOpts.startWeekId).length) {
        $('' != this.mOpts.target ? '#' + this.mOpts.target : 'body').append('<input type="hidden" id="' + this.mOpts.startWeekId + '" name="startWeek" value="' + this.mOpts.startWeek + '" />');
    } else {
        $('#' + this.mOpts.startWeekId).val(this.mOpts.startWeekId);
    }
    if (1 > $('#' + this.mOpts.endWeekId).length) {
        $('' != this.mOpts.target ? '#' + this.mOpts.target : 'body').append('<input type="hidden" id="' + this.mOpts.endWeekId + '" name="endWeek" value="' + this.mOpts.endWeek + '" />');
    } else {
        $('#' + this.mOpts.endWeekId).val(this.mOpts.endWeek);
    }
    if (1 > $('#' + this.mOpts.compareCheckboxId).length) {
        $('' != this.mOpts.target ? '#' + this.mOpts.target : 'body').append('<input type="checkbox" id="' + this.mOpts.compareCheckboxId + '" name="needCompare" value="0" style="display:none;" />');
    }

    if (false === this.mOpts.needCompare) {
        $('#' + this.compareInputDiv).css('display', 'none');
        $('#' + this.compareCheckBoxDiv).css('display', 'none');
        $('#' + this.weekRangeCompareDiv).css('display', 'none');
        $('#' + this.compareCheckboxId).attr('disabled', true);
        $('#' + this.startCompareWeekId).attr('disabled', true);
        $('#' + this.endCompareWeekId).attr('disabled', true);
        //隐藏对比的checkbox
        $('#' + this.compareCheckboxId).parent().css('display', 'none');
        $('#' + this.mOpts.replaceBtn).length > 0 && $('#' + this.mOpts.replaceBtn).hide();
    } else {
        if (1 > $('#' + this.mOpts.startCompareWeekId).length) {
            $('' != this.mOpts.target ? '#' + this.mOpts.target : 'body').append('<input type="hidden" id="' + this.mOpts.startCompareWeekId + '" name="startCompareWeek" value="' + this.mOpts.startCompareWeek + '" />');
        } else {
            $('#' + this.mOpts.startCompareWeekId).val(this.mOpts.startCompareWeek);
        }
        if (1 > $('#' + this.mOpts.endCompareWeekId).length) {
            $('' != this.mOpts.target ? '#' + this.mOpts.target : 'body').append('<input type="hidden" id="' + this.mOpts.endCompareWeekId + '" name="endCompareWeek" value="' + this.mOpts.endCompareWeek + '" />');
        } else {
            $('#' + this.mOpts.endCompareWeekId).val(this.mOpts.endCompareWeek);
        }
    }

    this.weekInput = this.startWeekId;

    // 开始时间 input 的 click 事件
    $('#' + this.startWeekId).bind('click', function () {
        // 如果用户在选择基准结束时间时，换到对比时间了，则
        if (__method.endCompareWeekId == __method.weekInput) {
            $('#' + __method.startCompareWeekId).val(__method.startDefWeek);
        }
        __method.startDefWeek = '';
        __method.removeCSS(1);
        //__method.addCSS(1);
        __method.changeInput(__method.startWeekId);
        return false;
    });
    $('#' + this.calendarId).bind('click', function (event) {
        //event.preventDefault();
        // 防止冒泡
        event.stopPropagation();
    });
    // 开始比较时间 input 的 click 事件
    $('#' + this.startCompareWeekId).bind('click', function () {
        // 如果用户在选择基准结束时间时，换到对比时间了，则
        if (__method.endWeekId == __method.weekInput) {
            $('#' + __method.startWeekId).val(__method.startDefWeek);
        }
        __method.startDefWeek = '';
        __method.removeCSS(0);
        //__method.addCSS(0);
        __method.changeInput(__method.startCompareWeekId);
        return false;
    });

    /**
     * 设置回调句柄，点击成功后，返回一个时间对象，包含开始结束时间
     * 和对比开始结束时间
     */
    $('#' + this.submitBtn).bind('click', function () {
        __method.close(1);
        __method.mOpts.success({
            'startWeek': $('#' + __method.mOpts.startWeekId).val(),
            'endWeek': $('#' + __method.mOpts.endWeekId).val(),
            'needCompare': $('#' + __method.mOpts.compareCheckboxId).val(),
            'startCompareWeek': $('#' + __method.mOpts.startCompareWeekId).val(),
            'endCompareWeek': $('#' + __method.mOpts.endCompareWeekId).val()
        });
        if (__method.mOpts.isSingleWeek) {
            var newWeek = $('#' + __method.mOpts.startWeekId).val();
            $('#' + __method.mOpts.weekPickerHandlerId).val(newWeek);
        }
        else {
            var newWeek = $('#' + __method.mOpts.startWeekId).val() + ',' + $('#' + __method.mOpts.endWeekId).val();
            $('#' + __method.mOpts.weekPickerHandlerId).val(newWeek);
        }
        return false;
    });

    // 日期选择关闭按钮的 click 事件
    $('#' + this.closeBtn).bind('click', function () {
        __method.close();
        return false;
    });
    // 为输入框添加click事件
    $('#' + this.inputId).bind('click', function () {
        __method.mOpts.endWeek = $('#' + __method.endWeekId).val();
        __method.init();
        __method.show(false, __method);
        return false;
    });
    $('#' + this.mOpts.inputTrigger).bind('click', function () {
        __method.mOpts.endWeek = $('#' + __method.endWeekId).val();
        __method.init();
        __method.show(false, __method);
        return false;
    });
    $('#' + this.compareTrigger).bind('click', function () {
        __method.mOpts.endCompareWeek = $('#' + __method.endCompareWeekId).val();
        __method.init(true);
        __method.show(true, __method);
        return false;
    });
    // 为输入框添加click事件
    $('#' + this.inputCompareId).bind('click', function () {
        __method.mOpts.endCompareWeek = $('#' + __method.endCompareWeekId).val();
        __method.init(true);
        __method.show(true, __method);
        return false;
    });

    //判断是否是实时数据,如果是将时间默认填充进去
    if (this.mOpts.singleCompare) {
        $('#' + __method.startWeekId).val(__method.mOpts.startWeek);
        $('#' + __method.endWeekId).val(__method.mOpts.startWeek);
        $('#' + __method.startCompareWeekId).val(__method.mOpts.startCompareWeek);
        $('#' + __method.endCompareWeekId).val(__method.mOpts.startCompareWeek);
    }

    // 时间对比
    $('#' + this.weekRangeCompareDiv).css('display', $('#' + this.compareCheckboxId).attr('checked') ? '' : 'none');
    $('#' + this.compareInputDiv).css('display', $('#' + this.compareCheckboxId).attr('checked') ? '' : 'none');
    $('#' + this.compareCheckboxId).bind('click', function () {
        $('#' + __method.inputCompareId).css('display', this.checked ? '' : 'none');
        $('#' + __method.weekRangeCompareDiv).css('display', this.checked ? '' : 'none');
        $('#' + __method.compareInputDiv).css('display', this.checked ? '' : 'none');
        $('#' + __method.startCompareWeekId).css('disabled', this.checked ? false : true);
        $('#' + __method.endCompareWeekId).css('disabled', this.checked ? false : true);
        // 修改表单的 checkbox 状态
        $('#' + __method.mOpts.compareCheckboxId).attr('checked', $('#' + __method.compareCheckboxId).attr('checked'));
        // 修改表单的值
        $('#' + __method.mOpts.compareCheckboxId).val($('#' + __method.compareCheckboxId).attr('checked') ? 1 : 0);

        // 初始化对比周选择控件
        if ($('#' + __method.compareCheckboxId).attr('checked')) {
            var sWeek = __method.strToWeek($('#' + __method.startWeekId).val());
            var sWeekDateInterval = sWeek.weekToDateInterval();
            var sWeekStart = sWeekDateInterval[0];
            var eWeek = __method.strToWeek($('#' + __method.endWeekId).val());
            var eWeekDateInterval = eWeek.weekToDateInterval();
            var eWeekStart = eWeekDateInterval[0];

            var ecWeekEnd = __method.strToDate(__method.dateToymd(sWeekStart).join('-'));
            ecWeekEnd.setDate(ecWeekEnd.getDate() - 1);
            var scWeekEnd = __method.strToDate(__method.dateToymd(ecWeekEnd).join('-'));
            scWeekEnd.setDate(scWeekEnd.getDate() - ((eWeekStart.getTime() - sWeekStart.getTime()) / 86400000));

            var scYW = __method.WEEKOFYEAR.dateToYW(scWeekEnd), ecYW = __method.WEEKOFYEAR.dateToYW(ecWeekEnd);
            var scWeek = new WeekOfYear(scYW[0], scYW[1]);
            var ecWeek = new WeekOfYear(ecYW[0], ecYW[1]);
            var minValidWeek = __method.strToWeek(__method.mOpts.minValidWeek);
            if (ecWeek.compareTo(minValidWeek) < 0) {
                scWeek = sWeek;
                ecWeek = eWeek;
            } else if (scWeek.compareTo(minValidWeek) < 0) {
                scWeek = minValidWeek;
                ecWeek.setWeek(scWeek.getWeek() + (eWeekStart.getTime - sWeekStart.getTime) / 604800000)
            }
            $('#' + __method.startCompareWeekId).val(scWeek.formatWeekOfYear());
            $('#' + __method.endCompareWeekId).val(ecWeek.formatWeekOfYear());
        }
        __method.addCSS(1);
        // 输入框焦点切换到比较开始时间
        __method.changeInput(__method.startCompareWeekId);
        //用户点击默认自动提交 added by johnnyzheng 12-08
        __method.close(1);
        __method.mOpts.success({
            'startWeek': $('#' + __method.mOpts.startWeekId).val(),
            'endWeek': $('#' + __method.mOpts.endWeekId).val(),
            'needCompare': $('#' + __method.mOpts.compareCheckboxId).val(),
            'startCompareWeek': $('#' + __method.mOpts.startCompareWeekId).val(),
            'endCompareWeek': $('#' + __method.mOpts.endCompareWeekId).val()
        });
    });

    // 初始化开始
    this.init();
    // 关闭日期选择框，并把结果反显到输入框
    this.close(1);
    if (this.mOpts.replaceBtn && $('#' + this.mOpts.replaceBtn).length > 0) {
        var quickSelectId = this.mOpts.quickSelectId;
        var checkboxId = this.mOpts.compareCheckboxId;
        var compareLabelId = this.mOpts.compareLabel;
        var isEnglishVersion = this.mOpts.isEnglishVersion;
        $('#' + checkboxId).hide();
        $('#' + compareLabelId).hide();

        $('#' + this.mOpts.replaceBtn).bind('click', function () {
            var self = this;
            $('#' + __method.compareCheckboxId).attr('checked') ? $('#' + __method.compareCheckboxId).removeAttr('checked')
                : $('#' + __method.compareCheckboxId).attr('checked', 'checked');
            $('#' + __method.compareCheckboxId).click();
            $('#' + __method.compareCheckboxId).attr('checked')
                ? function () {
                $('#' + __method.compareCheckboxId).removeAttr('checked');
                //$('.contrast').hide();
                $('#' + compareLabelId).hide();
                $('#' + quickSelectId).show();
                $(self).text(isEnglishVersion ? 'Week Comparison' : '按时间对比');
            }()
                : function () {
                $('#' + __method.compareCheckboxId).attr('checked', 'checked');
                $('#' + compareLabelId).show();
                $('#' + quickSelectId).hide();
                $(self).text(isEnglishVersion ? 'Cancel Comparison' : '取消对比');
            }();
        });
    }

    if (this.mOpts.autoCommit) {
        this.mOpts.success({
            'startWeek': $('#' + __method.mOpts.startWeekId).val(),
            'endWeek': $('#' + __method.mOpts.endWeekId).val(),
            'needCompare': $('#' + __method.mOpts.compareCheckboxId).val(),
            'startCompareWeek': $('#' + __method.mOpts.startCompareWeekId).val(),
            'endCompareWeek': $('#' + __method.mOpts.endCompareWeekId).val()
        });
    }

    //让用户点击页面即可关闭弹窗
    $(document).bind('click', function () {
        __method.close();
    });
};

/**
 * @description 日期选择器的初始化方法，对象原型扩展
 * @param {Boolean} isCompare 标识当前初始化选择面板是否是对比日期
 */
pickerWeekRange.prototype.init = function(isCompare){
    var __method = this;
    var isNeedCompare = typeof(isCompare) != 'undefined' ? isCompare && $("#" + __method.compareCheckboxId).attr('checked') : $("#" + __method.compareCheckboxId).attr('checked');
    // 清空日期列表的内容
    $('#' + this.weekListId).empty();
    var now = moment().tz(__method.mOpts.timezone);
    var curDate = new Date();
    curDate.setYear(now.year()); curDate.setMonth(now.month()); curDate.setDate(now.date());

    var curryw = this.WEEKOFYEAR.dateToYW(curDate);
    var currWeek = new WeekOfYear(curryw[0], curryw[1]);

    //如果结束周为空，则取当天所在的周为结束周
    var endWeek;
    if(isCompare){
        endWeek = '' == this.mOpts.endCompareWeek ? currWeek : this.strToWeek(this.mOpts.endCompareWeek);
    }else{
        endWeek = '' == this.mOpts.endWeek ? currWeek : this.strToWeek(this.mOpts.endWeek);
    }
    //最后一周
    this.calendar_endWeek = new WeekOfYear(endWeek.getYear()+1, 0);

    for(var i=0; i<this.mOpts.calendars; i++){
        var td = null;
        if(this.mOpts.theme == 'ta'){
            td = this.fillWeek(endWeek.getYear(), i);
        }
        if (0 == i) {
            $("#" + this.weekListId).append(td);
        } else {
            var firstTd = $("#" + this.weekListId).find('table').get(0);
            $(firstTd).before(td);
            $(firstTd).before($('<div class="tb_divider"></div>'));
        }
        endWeek = new WeekOfYear(endWeek.getYear() - 1, 1);
    }

    // 上一年
    $('#' + this.preYear).bind('click', function () {
        __method.calendar_endWeek = new WeekOfYear(__method.calendar_endWeek.getYear(), 0);
        if(isCompare){
            __method.mOpts.endCompareWeek = __method.calendar_endWeek.formatWeekOfYear();
            __method.init(isCompare);
            //如果是单月选择的时候，要控制input输入框,即下次选日期的时候要设置哪个输入框的值
            if (1 == __method.mOpts.calendars) {
                if ('' == $('#' + __method.startCompareWeekId).val()) {
                    __method.changeInput(__method.startCompareWeekId);
                }
                else {
                    __method.changeInput(__method.endCompareWeekId);
                }
            }
        }else{
            __method.mOpts.endWeek = __method.calendar_endWeek.formatWeekOfYear();
            __method.init(isCompare);
            //如果是单月选择的时候，要控制input输入框,即下次选日期的时候要设置哪个输入框的值
            if (1 == __method.mOpts.calendars) {
                if ('' == $('#' + __method.startWeekId).val()) {
                    __method.changeInput(__method.startWeekId);
                }
                else {
                    __method.changeInput(__method.endWeekId);
                }
            }
        }
        __method.mOpts.endWeek = __method.calendar_endWeek.formatWeekOfYear();
        __method.init(isCompare);

        return false;
    });
    // 下一年
    $('#' + this.nextYear).bind('click', function () {
        __method.calendar_endWeek = new WeekOfYear(__method.calendar_endWeek.getYear() + 1, 0);
        if(isCompare){
            __method.mOpts.endCompareWeek = (__method.calendar_endWeek.getYear() + 1) + '-01';
            __method.init(isCompare);
            //如果是单月选择的时候，要控制input输入框,即下次选日期的时候要设置哪个输入框的值
            if (1 == __method.mOpts.calendars) {
                if ('' == $('#' + __method.startCompareWeekId).val()) {
                    __method.changeInput(__method.startCompareWeekId);
                }
                else {
                    __method.changeInput(__method.endCompareWeekId);
                }
            }
        }else{
            __method.mOpts.endWeek = (__method.calendar_endWeek.getYear() + 1) + '-01';
            __method.init(isCompare);
            //如果是单月选择的时候，要控制input输入框,即下次选日期的时候要设置哪个输入框的值
            if (1 == __method.mOpts.calendars) {
                if ('' == $('#' + __method.startWeekId).val()) {
                    __method.changeInput(__method.startWeekId);
                }
                else {
                    __method.changeInput(__method.endWeekId);
                }
            }
        }
        __method.mOpts.endWeek = (__method.calendar_endWeek.getYear() + 1) + '-01';

        return false;
    });

    // 日历开始周
    this.calendar_startWeek = new WeekOfYear(endWeek.getYear() + 1, 1);
    // 初始化时间选区背景
    /*if (this.endWeekId != this.weekInput && this.endCompareWeekId != this.weekInput) {
     (isNeedCompare && typeof(isCompare) != 'undefined') ? this.addCSS(1) : this.addCSS(0);
     }*/

    if (isNeedCompare && typeof(isCompare) != 'undefined') {
        __method.addCSS(1);
    }
    else {
        __method.addCSS(0);

    }
    // 隐藏对比日期框
    $('#' + __method.inputCompareId).css('display', isNeedCompare ? '' : 'none');
    $('#' + this.compareInputDiv).css('display', $('#' + this.compareCheckboxId).attr('checked') ? '' : 'none');

    //快捷选择的点击，样式要自己定义，id可以传递默认，也可覆盖
    for (var property in __method.periodObj) {
        if ($('#' + property).length > 0) {
            $('#' + property).unbind('click');
            $('#' + property).bind('click', function () {
                //处理点击样式
                var cla = 'active';
                $(this).parent().nextAll().removeClass(cla);
                $(this).parent().prevAll().removeClass(cla);
                $(this).parent().addClass(cla);
                //拼接提交时间串
                var timeObj = __method.getSpecialPeriod(__method.periodObj[$(this).attr('id')]);
                $('#' + __method.startWeekId).val(timeObj.startWeek);
                $('#' + __method.endWeekId).val(timeObj.endWeek);
                $('#' + __method.mOpts.startWeekId).val($('#' + __method.startWeekId).val());
                $('#' + __method.mOpts.endWeekId).val($('#' + __method.endWeekId).val());
                __method.mOpts.theme == 'ta' ? $('#' + __method.compareInputDiv).hide() : $('#' + __method.inputCompareId).css('display', 'none');
                $('#' + __method.compareCheckboxId).attr('checked', false);
                $('#' + __method.mOpts.compareCheckboxId).attr('checked', false);
                $('#' + this.compareInputDiv).css('display', $('#' + this.compareCheckboxId).attr('checked') ? '' : 'none');
                __method.close(1);
                //于此同时清空对比时间框的时间
                $('#' + __method.startCompareWeekId).val('');
                $('#' + __method.endCompareWeekId).val('');
                $('#' + __method.mOpts.startCompareWeekId).val('');
                $('#' + __method.mOpts.endCompareWeekId).val('');
                $('#' + __method.mOpts.compareCheckboxId).val(0);

                if ($('#' + __method.mOpts.replaceBtn).length > 0) {
                    $('.contrast').hide();
                    $('#' + __method.mOpts.replaceBtn).text(__method.mOpts.isEnglishVersion ? 'Week Comparison' : '按时间对比');
                }
                //点击提交
                __method.mOpts.success({'startWeek': $('#' + __method.mOpts.startWeekId).val(),
                    'endWeek': $('#' + __method.mOpts.endWeekId).val(),
                    'needCompare': $('#' + __method.mOpts.compareCheckboxId).val(),
                    'startCompareWeek': $('#' + __method.mOpts.startCompareWeekId).val(),
                    'endCompareWeek': $('#' + __method.mOpts.endCompareWeekId).val()
                });
            });
        }
    }

    // 让用户手动关闭或提交日历，每次初始化的时候绑定，关闭的时候解绑
    $(document).bind('click', function () {
        __method.close();
    });

    //完全清空日期控件的值
    $('#' + this.inputId).bind('change', function () {
        if ($(this).val() === '') {
            $('#' + __method.startWeekId).val('');
            $('#' + __method.endWeekId).val('');
            $('#' + __method.startCompareWeekId).val('');
            $('#' + __method.endCompareWeekId).val('');
        }
    })

}

/**
 * @description 计算本周、最近2周、最近4周、最近12周、最近24周对应的区间
 * @param {Num} period 快捷选择的时间段,本周-0，最近2周-2，最近4周-4，最近12周-12，最近24周-24
 */
pickerWeekRange.prototype.getSpecialPeriod = function (period) {
    var __method = this;
    var now = moment().tz(__method.mOpts.timezone);
    var curDate = new Date();
    curDate.setYear(now.year()); curDate.setMonth(now.month()); curDate.setDate(now.date());
    var currYW = this.WEEKOFYEAR.dateToYW(curDate);
    //如果本周不可用，从前一周往前推
    (true == __method.mOpts.isCurWeekValid && ('' != __method.mOpts.isCurWeekValid) || 2 > period) ? '' : currYW[1] -= 1;

    var back = period < 2 ? period : period - 1;
    var endStr = new WeekOfYear(currYW[0], currYW[1]).formatWeekOfYear();
    var startStr = new WeekOfYear(currYW[0], currYW[1] - back).formatWeekOfYear();
    return {endWeek: endStr, startWeek: startStr};
}

/**
 * @description 移除选择日期面板的样式
 * @param {Boolean} isCompare 是否是对比日期面板
 * @param {String} specialClass 特殊的样式，这里默认是常规和对比日期两种样式的重合样式
 */
pickerWeekRange.prototype.removeCSS = function (isCompare, specialClass) {
    // 是否移除对比部分的样式:0 日期选择;1 对比日期选择
    if ('undefined' == typeof(isCompare)) {
        isCompare = 0;
    }

    // 整个日期列表的开始日期
    var bWeek = new WeekOfYear(this.calendar_startWeek.getYear(), this.calendar_startWeek.getWeek());
    var cla = '';
    // 从开始日期循环到结束日期
    for (var d = bWeek; d.compareTo(this.calendar_endWeek) <= 0; d.setWeek(d.getWeek() + 1)) {
        if (0 == isCompare) {
            // 移除日期样式
            cla = this.mOpts.theme + '_' + this.mOpts.selectCss;
        } else {
            // 移除对比日期样式
            cla = this.mOpts.theme + '_' + this.mOpts.compareCss;
        }
        // 移除指定样式
        $('#' + this.calendarId + '_' + d.formatWeekOfYear()).removeClass(cla);
        $('#' + this.calendarId + '_' + d.formatWeekOfYear()).removeClass(this.mOpts.firstCss).removeClass(this.mOpts.lastCss).removeClass(this.mOpts.clickCss);

    }
};

/**
 * @description 为选中的日期加上样式：1=比较时间；0=时间范围
 * @param {Boolean} isCompare 是否是对比日期面板
 * @param {String} specialClass 特殊的样式，这里默认是常规和对比日期两种样式的重合样式
 */
pickerWeekRange.prototype.addCSS = function (isCompare, specialClass) {
    // 是否移除对比部分的样式:0 日期选择;1 对比日期选择
    if ('undefined' == typeof(isCompare)) {
        isCompare = 0;
    }
    // 获取4个日期
    var startWeek = this.strToWeek($('#' + this.startWeekId).val());
    var endWeek = this.strToWeek($('#' + this.endWeekId).val());
    var startCompareWeek = this.strToWeek($('#' + this.startCompareWeekId).val());
    var endCompareWeek = this.strToWeek($('#' + this.endCompareWeekId).val());

    // 循环开始周
    var sWeek = 0 == isCompare ? startWeek : startCompareWeek;
    // 循环结束周
    var eWeek = 0 == isCompare ? endWeek : endCompareWeek;
    var cla = '';
    for (var d = new WeekOfYear(sWeek.getYear(), sWeek.getWeek()); d.compareTo(eWeek) <= 0; d.setWeek(d.getWeek() + 1)) {
        if (0 == isCompare) {
            // 添加日期样式
            cla = this.mOpts.theme + '_' + this.mOpts.selectCss;
            $('#' + this.calendarId + '_' + d.formatWeekOfYear()).removeClass(this.mOpts.firstCss).removeClass(this.mOpts.lastCss).removeClass(this.mOpts.clickCss);
            $('#' + this.calendarId + '_' + d.formatWeekOfYear()).removeClass(cla);
        } else {
            // 添加对比日期样式
            cla = this.mOpts.theme + '_' + this.mOpts.compareCss;
        }

        $('#' + this.calendarId + '_' + d.formatWeekOfYear()).attr('class', cla);
    }
    if (this.mOpts.theme == 'ta') {
        //为开始结束添加特殊样式
        $('#' + this.calendarId + '_' + sWeek.formatWeekOfYear()).removeClass().addClass(this.mOpts.firstCss);
        $('#' + this.calendarId + '_' + eWeek.formatWeekOfYear()).removeClass().addClass(this.mOpts.lastCss);
        //如果开始结束时间相同
        sWeek.compareTo(eWeek) == 0 && $('#' + this.calendarId + '_' + eWeek.formatWeekOfYear()).removeClass().addClass(this.mOpts.clickCss);
    }
};

/**
 * @description 判断开始、结束周是否处在允许的范围内
 * @param {String} startYW 开始周字符串
 * @param {String} endYmd 结束周字符串
 */
pickerWeekRange.prototype.checkWeekRange = function (startYW, endYW) {
    var sWeek = this.strToWeek(startYW);
    var eWeek = this.strToWeek(endYW);
    var maxEWeek;
    if (eWeek.compareTo(sWeek) >= 0) {
        maxEWeek = this.strToWeek(startYW);
        maxEWeek.setWeek(maxEWeek.getWeek() + this.mOpts.weekRangeMax)
        if (maxEWeek.compareTo(eWeek) < 0) {
            alert('结束周不能大于：' + maxEWeek.formatWeekOfYear());
            return false;
        }
    } else {
        // 判断是否超过最大日期外
        maxEWeek = this.strToWeek(startYW);
        maxEWeek.setWeek(maxEWeek.getWeek() - this.mOpts.weekRangeMax)
        if (maxEWeek.compareTo(eWeek) > 0) {
            alert('开始周不能小于：' + maxEWeek.formatWeekOfYear());
            return false;
        }
    }
    return true;
}

/**
 *  @description 选择周
 *  @param {String} yw 周字符串
 */
pickerWeekRange.prototype.selectWeek = function (yw) {
    this.changeInput(this.weekInput);
    var ywFormat = yw;
    // start <-> end 切换
    if (this.startWeekId == this.weekInput) {
        // 移除样式
        this.removeCSS(0);
        this.removeCSS(1);
        // 为当前点加样式
        $('#' + this.calendarId + '_' + yw).attr('class', (this.mOpts.theme == 'ta' ? this.mOpts.clickCss : this.mOpts.theme + '_' + this.mOpts.selectCss));
        // 获取开始周的初始值
        this.startDefWeek = $('#' + this.weekInput).val();
        // 更改对应输入框的值
        $('#' + this.weekInput).val(ywFormat);
        $('#' + this.endWeekId).val(ywFormat);

        // 切换输入框焦点,如果是实时数据那么选择一天的数据
        if (true == this.mOpts.singleCompare || true == this.mOpts.isSingleWeek) {
            this.weekInput = this.startWeekId;
            $('#' + this.endWeekId).val(ywFormat);
        } else {
            this.weekInput = this.endWeekId;
        }

    } else if (this.endWeekId == this.weekInput) {
        // 如果开始周未选
        if ('' == $('#' + this.startWeekId).val()) {
            this.weekInput = this.startWeekId;
            this.selectWeek(yw);
            return false;
        }
        // 判断用户选择的时间范围
        if (false == this.checkWeekRange($('#' + this.startWeekId).val(), yw)) {
            return false;
        }
        // 如果结束时间小于开始时间
        if (this.compareStrWeek(yw, $('#' + this.startWeekId).val()) < 0) {
            // 更改对应输入框的值(结束时间)
            $('#' + this.weekInput).val($('#' + this.startWeekId).val());
            // 更改对应输入框的值(开始时间)
            $('#' + this.startWeekId).val(ywFormat);
            ywFormat = $('#' + this.weekInput).val();
        }
        // 更改对应输入框的值
        $('#' + this.weekInput).val(ywFormat);

        // 切换输入框焦点
        this.weekInput = this.startWeekId;
        this.removeCSS(0);
        this.addCSS(0);
        //this.addCSS(0, this.mOpts.coincideCss);
        this.startDefWeek = '';
        if (this.mOpts.autoSubmit) {
            this.close(1);
            this.mOpts.success({'startWeek': $('#' + this.mOpts.startWeekId).val(),
                'endWeek': $('#' + this.mOpts.endWeekId).val(),
                'needCompare': $('#' + this.mOpts.compareCheckboxId).val(),
                'startCompareWeek': $('#' + this.mOpts.startCompareWeekId).val(),
                'endCompareWeek': $('#' + this.mOpts.endCompareWeekId).val()
            });
        }
    } else if (this.startCompareWeekId == this.weekInput) {
        // 移除样式
        this.removeCSS(1);
        this.removeCSS(0);
        // 为当前点加样式
        $('#' + this.calendarId + '_' + yw).attr('class', (this.mOpts.theme == 'ta' ? this.mOpts.clickCss : this.mOpts.theme + '_' + this.mOpts.compareCss));
        // 获取开始时间的初始值
        this.startDefWeek = $('#' + this.weekInput).val();
        // 更改对应输入框的值
        $('#' + this.weekInput).val(ywFormat);
        // 切换输入框焦点
        if (true == this.mOpts.singleCompare || true == this.mOpts.isSingleWeek) {
            this.weekInput = this.startCompareWeekId;
            $('#' + this.endCompareWeekId).val(ywFormat);

            // Note: 注释这段代码在于解决，当isSingleDay时，选择一个日期后自动提交请求
//    			(this.mOpts.shortOpr || this.mOpts.autoSubmit) && this.close(1);
//                this.mOpts.success({'startDate': $('#' + this.mOpts.startDateId).val(),
//                    'endDate': $('#' + this.mOpts.endDateId).val(),
//                    'needCompare' : $('#' + this.mOpts.compareCheckboxId).val(),
//                    'startCompareDate':$('#' + this.mOpts.startCompareDateId).val(),
//                    'endCompareDate':$('#' + this.mOpts.endCompareDateId).val()
//                });
        }
        else {
            this.weekInput = this.endCompareWeekId;
        }

    } else if (this.endCompareWeekId == this.weekInput) {
        // 如果开始时间未选
        if ('' == $('#' + this.startCompareWeekId).val()) {
            this.weekInput = this.startCompareWeekId;
            this.selectWeek(yw);
            return false;
        }
        // 判断用户选择的时间范围
        if (false == this.checkWeekRange($('#' + this.startCompareWeekId).val(), yw)) {
            return false;
        }
        // 如果结束时间小于开始时间
        if (this.compareStrWeek(yw, $('#' + this.startCompareWeekId).val()) < 0) {
            // 更改对应输入框的值(结束时间)
            $('#' + this.weekInput).val($('#' + this.startCompareWeekId).val());
            // 更改对应输入框的值(开始时间)
            $('#' + this.startCompareWeekId).val(ywFormat);
            ywFormat = $('#' + this.weekInput).val();
        }
        // 更改对应输入框的值
        $('#' + this.weekInput).val(ywFormat);
        // 切换输入框焦点
        this.weekInput = this.startCompareWeekId;
        //this.addCSS(1, this.mOpts.coincideCss);
        this.removeCSS(1);
        this.addCSS(1);
        this.startDefWeek = '';

        if (this.mOpts.autoSubmit) {
            this.close(1);
            this.mOpts.success({'startWeek': $('#' + this.mOpts.startWeekId).val(),
                'endWeek': $('#' + this.mOpts.endWeekId).val(),
                'needCompare': $('#' + this.mOpts.compareCheckboxId).val(),
                'startCompareWeek': $('#' + this.mOpts.startCompareWeekId).val(),
                'endCompareWeek': $('#' + this.mOpts.endCompareWeekId).val()
            });
        }
    }
};

pickerWeekRange.prototype.show = function (isCompare, __method) {
    $('#' + __method.weekRangeDiv).css('display', isCompare ? 'none' : '');
    $('#' + __method.weekRangeCompareDiv).css('display', isCompare ? '' : 'none');

    var pos = isCompare ? $('#' + this.inputCompareId).offset() : $('#' + this.inputId).offset();
    var offsetHeight = isCompare ? $('#' + this.inputCompareId).height() : $('#' + this.inputId).height();
    var clientWidth = parseInt($(document.body)[0].clientWidth);
    var left = pos.left;
    $("#" + this.calendarId).css('display', 'block');
    if (true == this.mOpts.singleCompare || true == this.mOpts.isSingleWeek) {
        $('#' + this.endWeekId).css('display', 'none');
        $('#' + this.endCompareWeekId).css('display', 'none');
        $('#' + this.mOpts.joinLineId).css('display', 'none');
        $('.' + this.mOpts.joinLineId).css('display', 'none');
    }
    // 如果和输入框左对齐时超出了宽度范围，则右对齐
    if (0 < clientWidth && $("#" + this.calendarId).width() + pos.left > clientWidth) {
        left = pos.left + $('#' + this.inputId).width() - $("#" + this.calendarId).width() + ((/msie/i.test(navigator.userAgent) && !(/opera/i.test(navigator.userAgent))) ? 5 : 0);
        __method.mOpts.theme == 'ta' && (left += 50);
    }
    $("#" + this.calendarId).css('left', left + 'px');
    //$("#" + this.calendarId).css('top', pos.top + (offsetHeight ? offsetHeight- 1 : (__method.mOpts.theme=='ta'?35:22)) + 'px');
    $("#" + this.calendarId).css('top', pos.top + (__method.mOpts.theme == 'ta' ? 35 : 22) + 'px');
    //第一次显示的时候，一定要初始化输入框
    isCompare ? this.changeInput(this.startCompareWeekId) : this.changeInput(this.startWeekId);
    return false;
};

pickerWeekRange.prototype.close = function (btnSubmit) {

    var __method = this;
    // 把开始、结束周显示到输入框 (PS:如果选择的本周，上一周，则只填入一个周)
    // 如果开始和结束相同也照样分段
    if (btnSubmit) {
        //如果是单日快捷选择
        if (this.mOpts.shortOpr === true) {
            $('#' + this.inputId).val($('#' + this.startWeekId).val());
            $('#' + this.inputCompareId).val($('#' + this.startCompareWeekId).val());
        } else {
            if (this.mOpts.isSingleWeek == true) {
                $('#' + this.inputId).val(this.formatWeekStr($('#' + this.startWeekId).val(), this.mOpts.isEnglishVersion));
            }
            else {
                $('#' + this.inputId).val(this.formatWeekStr($('#' + this.startWeekId).val(), this.mOpts.isEnglishVersion) + ('' == $('#' + this.endWeekId).val() ? '' : (this.mOpts.isEnglishVersion ? " to " : this.mOpts.defaultText) + this.formatWeekStr($('#' + this.endWeekId).val(), this.mOpts.isEnglishVersion)));
            }

        }
        if(this.mOpts.isSingleWeek == true){
            $('#' + this.endWeekId).val($('#' + this.startWeekId).val());
        }
        var now = moment().tz(__method.mOpts.timezone);
        var curDate = new Date();
        curDate.setYear(now.year()); curDate.setMonth(now.month()); curDate.setDate(now.date());
        var currYW = this.WEEKOFYEAR.dateToYW(curDate);
        //如果本周不可用，从前一周往前推
        (true == __method.mOpts.isCurWeekValid && ('' != __method.mOpts.isCurWeekValid)) ? '' : currYW[1] -= 1;
        var bWeek = this.strToWeek($('#' + this.startWeekId).val())
        var eWeek = this.strToWeek($('#' + this.endWeekId).val())
        //如果eWeek小于bWeek 相互交换
        if (eWeek.compareTo(bWeek) < 0) {
            var tmp = $('#' + this.startWeekId).val();
            $('#' + this.startWeekId).val($('#' + this.endWeekId).val());
            $('#' + this.endWeekId).val(tmp);
        }
        var _val = this.mOpts.shortOpr == true ? this.formatWeekStr($('#' + this.startWeekId).val(), this.mOpts.isEnglishVersion) : (this.formatWeekStr($('#' + this.startWeekId).val(), this.mOpts.isEnglishVersion) + ('' == $('#' + this.endWeekId).val() ? '' : (this.mOpts.isEnglishVersion ? " to " : this.mOpts.defaultText) + this.formatWeekStr($('#' + this.endWeekId).val(), this.mOpts.isEnglishVersion)));
        if (this.mOpts.isSingleWeek) {
            _val = this.formatWeekStr($('#' + this.startWeekId).val(), this.mOpts.isEnglishVersion);
        }
        // 把开始、结束时间显示到输入框 (PS:如果选择的本周、上一周，则只填入一个日期)
        var input = document.getElementById(this.inputId);
        if (input && input.tagName == 'INPUT') {
            $('#' + this.inputId).val(_val);
            $('#' + this.inputCompareId).is(':visible') && $('#' + this.inputCompareId).val(_compareVal);
        } else {
            $('#' + this.inputId).html(_val);
            $('#' + this.inputCompareId).is(':visible') && $('#' + this.inputCompareId).html(_compareVal);
        }
        var _compareVal = this.mOpts.shortOpr == true ? $('#' + this.startCompareWeekId).val() : (this.formatWeekStr($('#' + this.startCompareWeekId).val(), this.mOpts.isEnglishVersion) + ('' == $('#' + this.endCompareWeekId).val() ? '' : (this.mOpts.isEnglishVersion ? " to " : this.mOpts.defaultText) + this.formatWeekStr($('#' + this.endCompareWeekId).val(), this.mOpts.isEnglishVersion)));
        if (this.mOpts.isSingleWeek) {
            _compareVal = this.formatWeekStr($('#' + this.startCompareWeekId).val(), this.mOpts.isEnglishVersion);
        }
        if (input && input.tagName == 'INPUT') {
            $('#' + this.inputCompareId).val(_compareVal);
        } else {
            $('#' + this.inputCompareId).html(_compareVal);
        }

        var curWeekStr = new WeekOfYear(currYW[0], currYW[1]).formatWeekOfYear();
        if(curWeekStr == $('#' + this.startWeekId).val() && curWeekStr == $('#' + this.endWeekId).val()){ //本周
            $("#" + this.mOpts.aCurWeek).parent().addClass('active').siblings().removeClass('active');
        }else if(curWeekStr == $('#' + this.endWeekId).val()){
            var startWeek = this.strToWeek($('#' + this.startWeekId).val());
            var endWeek = this.strToWeek($('#' + this.endWeekId).val());
            var step = (endWeek.weekToDateInterval()[0].getTime() - startWeek.weekToDateInterval()[0].getTime()) / (7 * 24 * 60 * 60 * 1000);
            step += 1;
            $("#" + this.mOpts.aCurWeek).parent().removeClass('active').siblings().removeClass('active');
            $("#" + this.mOpts['aRecent' + step + 'Weeks']).parent().addClass('active');
        }else{ //都不是
            $("#" + this.mOpts.aCurWeek).parent().removeClass('active').siblings().removeClass('active');
        }

        // 更改目标元素值
        $('#' + this.mOpts.startWeekId).val($('#' + this.startWeekId).val());
        $('#' + this.mOpts.endWeekId).val($('#' + this.endWeekId).val());
        $('#' + this.mOpts.startCompareWeekId).val($('#' + this.startCompareWeekId).val());
        $('#' + this.mOpts.endCompareWeekId).val($('#' + this.endCompareWeekId).val());
        for (var property in this.periodObj) {
            if ($('#' + this.mOpts[property])) {
                $('#' + this.mOpts[property]).parent().removeClass('a');
            }
        }
    }
    // 隐藏日期选择框
    $("#" + this.calendarId).css('display', 'none');
    return false;
};

/**
 * @description 切换焦点到当前输入框
 * @param {String} 日期框体ID
 */
pickerWeekRange.prototype.changeInput = function (ipt) {
    // 强制修改为开始输入框
    if (true == this.mOpts.isSingleWeek) {
        ipt = this.startWeekId;
    }
    // 所有4个输入框
    var allInputs = [this.startWeekId, this.startCompareWeekId, this.endWeekId, this.endCompareWeekId];

    // 如果 ipt 是日期输入框，则为日期样式，否则为对比日期样式
    var cla = '';
    if (ipt == this.startWeekId || ipt == this.endWeekId) {
        cla = this.mOpts.theme + '_' + this.mOpts.selectCss;
    } else {
        cla = this.mOpts.theme + '_' + this.mOpts.compareCss;
    }
    if (ipt == this.endWeekId && this.mOpts.singleCompare) {
        cla = this.mOpts.theme + '_' + this.mOpts.compareCss;
    }

    // 移除所有输入框的附加样式
    for (var i = 0; i < allInputs.length; i++) {
        $('#' + allInputs[i]).removeClass(this.mOpts.theme + '_' + this.mOpts.selectCss);
        $('#' + allInputs[i]).removeClass(this.mOpts.theme + '_' + this.mOpts.compareCss);
    }

    // 为指定输入框添加样式
    $('#' + ipt).addClass(cla);
    //背景图repeat
    $('#' + ipt).css('background-repeat', 'repeat');
    // 把输入焦点移到指定输入框
    this.weekInput = ipt;
};

pickerWeekRange.prototype.strToWeek = function(yw){
    var ar = yw.split('-');
    // 返回日期格式
    return new WeekOfYear(Number(ar[0]), Number(ar[1]));
}
pickerWeekRange.prototype.weekToyw = function (w) {
    return [w.getYear(), w.getWeek()];
}


pickerWeekRange.prototype.dateToymd = function (d) {
    return [d.getFullYear(), (d.getMonth() + 1), d.getDate()];
};
pickerWeekRange.prototype.strToDate = function (str) {
    var ar = str.split('-');
    // 返回日期格式
    return new Date(ar[0], ar[1] - 1, ar[2]);
};

pickerWeekRange.prototype.fillWeek = function(year, index) {
    var __method = this;
    var beginWeek = new WeekOfYear(year, 1);
    var lastDateOfYear = new Date(year, 11, 31);
    var lastDayOfYear = lastDateOfYear.getDay();
    var lastWeekLastDate = lastDateOfYear;
    lastWeekLastDate.setDate(lastWeekLastDate.getDate() - lastDayOfYear);
    var lastYW = this.WEEKOFYEAR.dateToYW(lastWeekLastDate);
    var stopWeek = new WeekOfYear(lastYW[0], lastYW[1]);

    var now = moment().tz(__method.mOpts.timezone);
    var curDate = new Date();
    curDate.setYear(now.year()); curDate.setMonth(now.month()); curDate.setDate(now.date());
    var currYW = this.WEEKOFYEAR.dateToYW(curDate);

    var curWeek = new WeekOfYear(currYW[0], currYW[1]);
    var table = document.createElement('table');
    if (this.mOpts.theme == 'ta') {
        table.className = this.mOpts.weekTable;

        var cap = document.createElement('caption');
        if (this.mOpts.isEnglishVersion) {
            $(cap).append(year);
        } else {
            $(cap).append(year + '年');
        }

        $(table).append(cap);

        var tr = document.createElement('tr');
        var td = document.createElement('td');
        if (index == 0) {
            $(td).append('<a href="javascript:void(0);" id="' + this.nextYear + '"><i class="i_next"></i></a>');
        } else if (index + 1 == this.mOpts.calendars) {
            $(td).append('<a href="javascript:void(0);" id="' + this.preYear + '"><i class="i_pre"></i></a>');
        }
        $(td).attr('colSpan', 7);
        $(td).css('text-align', 'center');
        $(tr).append(td);
        $(table).append(tr);
    }

    var tdClass = '', deviation = 0;
    for (var week = beginWeek; week.compareTo(stopWeek) <= 0; week.setWeek(week.getWeek() + 1)) {
        if ((this.mOpts.stopWeek == true && week.compareTo(curWeek) > 0) || week.compareTo(this.strToWeek(this.mOpts.minValidWeek)) < 0 || ('' != this.mOpts.maxValidWeek && week.compareTo(this.strToWeek(this.mOpts.maxValidWeek)) > 0)) {
            tdClass = this.mOpts.theme + '_' + this.mOpts.disableGray;
            deviation = '1';
        } else {
            deviation = '0';
            if (week.compareTo(curWeek) == 0) {
                if (true == this.mOpts.isCurWeekValid) {
                    tdClass = this.mOpts.theme + '_' + this.mOpts.isCurWeek;
                } else {
                    tdClass = this.mOpts.theme + '_' + this.mOpts.disableGray;
                    deviation = '1';
                }
            } else {
                tdClass = '';
            }
        }
        if (week.getWeek() % 7 == 1) { //每7周显示一行
            tr = document.createElement('tr');
        }
        td = document.createElement('td');
        td.innerHTML = week.getWeek();
        if ('' != tdClass) {
            $(td).attr('class', tdClass);
        }

        var dateInterval = week.weekToDateInterval();
        var interval = dateInterval[0].getFullYear() + '/' + (dateInterval[0].getMonth() + 1) + '/' + dateInterval[0].getDate() + '-' + dateInterval[1].getFullYear() + '/' + (dateInterval[1].getMonth() + 1) + '/' + dateInterval[1].getDate();
        $(td).attr('title', interval);

        if ('0' == deviation) {
            $(td).attr('id', __method.calendarId + '_' + week.formatWeekOfYear());
            $(td).css('cursor', 'pointer');
            (function (weekStr) {
                $(td).bind('click', weekStr, function () {
                    __method.selectWeek(weekStr);
                    return false;
                })
            })(week.formatWeekOfYear());
        }

        $(tr).append(td);
        if (week.getWeek() % 7 == 0 || week.getWeek() == stopWeek.getWeek()) {
            $(table).append(tr);
        }

    }
    return table;
}

/**
 * @description 比较两个时间字串的大小:>0 大于; =0 等于; <0 小于
 * @param {String} b 待比较时间串1
 * @param {String} e 待比较时间串2
 */
pickerWeekRange.prototype.compareStrWeek = function(b, e) {
    var bWeek = this.strToWeek(b);
    var eWeek = this.strToWeek(e);
    return bWeek.compareTo(eWeek);
};

pickerWeekRange.prototype.formatWeekStr = function(yw, isEnglishVersion){
    var ar = yw.split('-');
    var ret = (ar.length > 0 ? ar[0] : '?') + (isEnglishVersion ? '-' : '年第');
    ret += (ar.length > 1 ? ar[1] : '?');
    ret += (isEnglishVersion ? '' : '周');
    return ret;
}

function WeekOfYear(year, week){
    if(arguments.length == 0){
        this.year = 2015;
        this.week = 1;
    }else if(arguments.length == 2) {
        var firstDate = new Date(year, 0, 1);
        var firstDay = firstDate.getDay();
        firstDay = firstDay == 0 ? 6 : firstDay - 1;
        var firstWeekStartDate = firstDate;
        firstWeekStartDate.setDate(firstWeekStartDate.getDate() - firstDay);
        firstWeekStartDate.setDate(firstWeekStartDate.getDate() + (week - 1) * 7);
        var yw= this.dateToYW(firstWeekStartDate);
        this.year = yw[0];
        this.week = yw[1];
    }
}

WeekOfYear.prototype.getYear = function(){
    return this.year;
}

WeekOfYear.prototype.getWeek = function(){
    return this.week;
}

WeekOfYear.prototype.dateToYW = function(date){
    var currDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var currDay = currDate.getDay();
    currDay = currDay == 0 ? 6 : currDay -1;
    var lastDate = new Date(currDate.getFullYear(), 11, 31);
    var lastDay = lastDate.getDay();
    var lastWeekLastDate = lastDate;
    lastWeekLastDate.setDate(lastWeekLastDate.getDate() - lastDay);
    if(currDate.getTime() > lastWeekLastDate.getTime()){
        return [currDate.getFullYear() + 1, 1];
    }
    var firstDate = new Date(currDate.getFullYear(), 0, 1);
    var firstDay = firstDate.getDay();
    firstDay = firstDay == 0 ? 6 : firstDay -1;
    var firstWeekStartDate = firstDate;
    firstWeekStartDate.setDate(firstWeekStartDate.getDate() - firstDay);
    var firstDateWithCurrDay = firstWeekStartDate;
    firstDateWithCurrDay.setDate(firstDateWithCurrDay.getDate() + currDay);

    var weekId = ((currDate.getTime() - firstDateWithCurrDay.getTime()) / 604800000) + 1;
    return [currDate.getFullYear(), weekId];
}


WeekOfYear.prototype.formatWeekOfYear = function(){
    var ret = this.year.toString() + '-';
    if(this.week<10){
        ret += '0' + this.week.toString();
    }else{
        ret += this.week.toString();
    }
    return ret;
}

WeekOfYear.prototype.formatDisplay = function(isEnglishVersion){
    var ret = this.year.toString() + isEnglishVersion ? '-' : '年第';
    if (this.week < 10) {
        ret += '0' + this.week.toString();
    } else {
        ret += this.week.toString();
    }
    ret += isEnglishVersion ? '' : '周';
    return ret;
}

WeekOfYear.prototype.weekToDateInterval = function(){
    var firstDateOfYear = new Date(this.year, 0, 1);
    var firstDay = firstDateOfYear.getDay();
    firstDay = firstDay == 0 ? 6 : firstDay -1;
    var firstWeekStartDate = firstDateOfYear;
    firstWeekStartDate.setDate(firstWeekStartDate.getDate() - firstDay);
    var firstWeekEndDate = new Date(firstWeekStartDate.getFullYear(), firstWeekStartDate.getMonth(), firstWeekStartDate.getDate() + 6);
    firstWeekStartDate.setDate(firstWeekStartDate.getDate() + 7 * (this.week-1));
    firstWeekEndDate.setDate(firstWeekEndDate.getDate() + 7 * (this.week-1));
    return [firstWeekStartDate, firstWeekEndDate];
}

WeekOfYear.prototype.compareTo = function(other){
    if(this.year != other.year){
        return this.year - other.year;
    }else{
        return this.week - other.week;
    }
}

WeekOfYear.prototype.setWeek = function(newWeek){
    var newWeekOfYear = new WeekOfYear(this.year, newWeek);
    this.year = newWeekOfYear.year;
    this.week = newWeekOfYear.week;
}

WeekOfYear.prototype.setYear = function(newYear){
    var newWeekOfYear = new WeekOfYear(newYear, this.week);
    this.year = newWeekOfYear.year;
    this.week = newWeekOfYear.week;
}