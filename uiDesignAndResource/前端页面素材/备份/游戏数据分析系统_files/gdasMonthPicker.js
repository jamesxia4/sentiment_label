/**
 * 月控件，可以配置选择月或者选择季度，如果是季度控件，则以每个季度的开始月作为该季度的表示，如2015-04表示2015年的第二季度
 * Created by gzhuangzhankun on 2015/3/16.
 */

;
(function ($, window, document, undefined){
    $.fn.gdasMonthPicker = function(options){
        var opts = $.extend({}, $.fn.gdasMonthPicker.options, options);
        return this.each(function(index, input){
            $(this).hide();

            var suffix = (new Date()).getTime();
            var member = {
                monthPickerFrameId: "gdasMonthPickerFrame_" + suffix,
                divMonthId: "divMonth_" + suffix,
                monthInputId: "monthInput_" + suffix,
                triggerId: "gdasMonthPickerTrigger_" + suffix,
                monthPickerTargetId: "gdasMonthPickerTarget_" + suffix,
                monthPickerId: "gdasMonthPicker_" + suffix,
                aCurId: "aCur_" + suffix,
                aLast2Id: "aLast2_" + suffix,
                aLast3Id: "aLast3_" + suffix,
                aLast6Id: "aLast6_" + suffix,
                aLast12Id: "aLast12_" + suffix,
                replaceBtn: "btn_compare_" + suffix
            }

            opts.inputTrigger = member.triggerId;
            opts.inputId = member.monthInputId;
            opts.target = member.monthPickerTargetId;
            this.id = "gdasMonthPickerHandler_" + suffix;
            opts.monthPickerFrameId = member.monthPickerFrameId;
            opts.divMonthId = member.divMonthId;
            opts.monthPickerHandlerId = this.id;
            opts.replaceBtn = member.replaceBtn;
            opts.quickSelectId = "short_opt_" + suffix;
            opts.compareLabel = "compareLabel_" + suffix;

            if(opts.addQuickSelect == true){
                opts.aCur = member.aCurId;
                opts.aLast2 = member.aLast2Id;
                opts.aLast3 = member.aLast3Id;
                opts.aLast6 = member.aLast6Id;
                opts.aLast12 = member.aLast12Id;
            }

            addMonthPickerQuickSelectHtml(input, member, opts);
            if(this.value.split(',').length >= 2){
                opts.isSingleMonth = false;
                var startMonth = this.value.split(',')[0];
                var endMonth = this.value.split(',')[1];
                opts.startMonth = startMonth;
                opts.endMonth = endMonth;
            }else{
                opts.isSingleMonth = true;
                opts.startMonth = this.value;
                opts.endMonth = this.value;
            }

            if(opts.needCompare == true){
                var scMonth = strToMonth(opts.startMonth);
                var ecMonth = strToMonth(opts.endMonth);
                var step = ecMonth.compareTo(scMonth);
                if(opts.isQuarter && opts.isQuarter == true){
                    step -= 7;
                }else{
                    step -= 1;
                }
                scMonth.setMonth(scMonth.getMonth() - step);
                ecMonth.setMonth(ecMonth.getMonth() - step);

                opts.startCompareMonth = scMonth.formatMonthOfYear();
                opts.endCompareMonth = ecMonth.formatMonthOfYear();
            }

            input._monthPicker = new pickerMonthRange(opts.inputId, opts);
            sleep(1);
        });
    };

    $.fn.gdasMonthPicker.options = {
        //自动提交
        autoSubmit: false,
        needCompare: false,
        isSingleMonth: false,
        addQuickSelect: false,
        isEnglishVersion: GDAS.isEnglishVersion,
        timezone: 'Asia/Shanghai',

        //回调函数
        success: function (obj) {
        }
    };

    //填充额外的HTML文本，这里css与mta的css名一致，如需修改css,需要修改本函数
    function addMonthPickerQuickSelectHtml(a, member, opts) {

        $(a).after('<div class="tool_month cf" id="' + member.monthPickerFrameId + '"></div>');
        $('#' + member.monthPickerFrameId).append('<button class="compareSwitchBtn" style="float:right" id="' + member.replaceBtn + '">' + (opts.isEnglishVersion ? 'Month Comparison' : '按时间对比') + '</button>');
        $('#' + member.monthPickerFrameId).append('<div class="month" id="' + member.divMonthId + '">' +
            '<span class="month_title" id="' + member.monthInputId + '"></span>' +
            '<a class="opt_sel" id="' + member.triggerId + '" href="#"><i class="i_orderd"></i></a></div>' +
            '<div id="' + member.monthPickerTargetId + '"></div>'
        );
        if (opts.addQuickSelect) {
            $('#' + member.monthPickerFrameId).append('<div class="month-section cf" id="' + opts.quickSelectId + '">' +
            '<ul id="toolbar" class="select cf">' +
            '<li class="active"><a id="' + member.aCurId + '" href="javascript:void(0);">' + (opts.isEnglishVersion ? (opts.isQuarter && true == opts.isQuarter ? 'CurrentQuarter' : 'CurrentMonth') : (opts.isQuarter && true == opts.isQuarter ? '本季度' : '本月')) + '</a></li>' +
            '<li class=""><a id="' + member.aLast2Id + '" href="javascript:void(0);">' + (opts.isEnglishVersion ? (opts.isQuarter && true == opts.isQuarter ? 'Last2Quarters' : 'Last2Months') : (opts.isQuarter && true == opts.isQuarter ? '最近2季度' : '最近2月')) + '</a></li>' +
            '<li class=""><a id="' + member.aLast3Id + '" href="javascript:void(0);">' + (opts.isEnglishVersion ? (opts.isQuarter && true == opts.isQuarter ? 'Last3Quarters' : 'Last3Months') : (opts.isQuarter && true == opts.isQuarter ? '最近3季度' : '最近3月')) + '</a></li>' +
            '<li class=""><a id="' + member.aLast6Id + '" href="javascript:void(0);">' + (opts.isEnglishVersion ? (opts.isQuarter && true == opts.isQuarter ? 'Last6Quarters' : 'Last6Months') : (opts.isQuarter && true == opts.isQuarter ? '最近6季度' : '最近6月')) + '</a></li>' +
            '<li class=""><a id="' + member.aLast12Id + '" href="javascript:void(0);">' + (opts.isEnglishVersion ? (opts.isQuarter && true == opts.isQuarter ? 'Last12Quarters' : 'Last12Months') : (opts.isQuarter && true == opts.isQuarter ? '最近12季度' : '最近12月')) + '</a></li>' +
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

    function strToMonth(str) {
        var ar = str.split('-');
        return new MonthOfYear(Number(ar[0]), Number(ar[1]));
    }
})(jQuery, window, document);

function pickerMonthRange(inputId, options){
    /**
     * 默认参数
     */
    var defaults = {
        isQuarter: false, //是否作为季度控件
        startMonth: '', //如果是作为季度控件，则获取该月所在的季度
        endMonth: '',
        startCompareMonth: '',
        endCompareMonth: '',
        minValidMonth: '2000-01',
        maxValidMonth: '',
        success: function(obj){return false},
        startMonthId: 'targetStartMonth',
        startCompareMonthId: 'targetStartCompareMonth',
        endMonthId: 'targetEndMonth',
        endCompareMonthId: 'targetEndCompareMonth',
        target: '',
        needCompare: false,
        suffix: '',
        inputTrigger: 'input_trigger',
        compareTrigger: 'compare_trigger',
        compareCheckboxId: 'targetNeedCompare',
        calendars: 2,
        monthRangeMax: 120,
        monthTable: 'monthRangeTable',
        selectCss: 'monthRangeSelected',
        compareCss: 'monthRangeSelected',
        coincideCss: 'monthRangeCoincide',
        firstCss: 'first',
        lastCss: 'last',
        clickCss: 'curMonth',
        disableGray: 'monthRangeGray',
        isCurMonth: 'monthRangeCurMonth',
        joinLineId: 'joinLine',
        isSingleMonth: false,
        defaultText: ' ~ ',
        singleCompare: false,
        stopMonth: true,
        isCurMonthValid: true,
        shortOpr: false, //结合单月选择的短操作，不需要确定和取消的操作按钮
        noCalendar: false, //输入框是否展示
        autoCommit: false, //加载后立马自动提交
        autoSubmit: false, //没有确定和取消按钮，直接提交
        replaceBtn: 'btn_compare',
        quickSelectedId: 'short_opr',
        isEnglishVersion: false,
        theme: 'ta'
    };

    //将对象赋给__method对象
    var __method = this;

    this.inputId = inputId;
    this.inputCompareId = inputId + 'Compare';
    this.compareInputDiv = 'div_compare_' + inputId;
    this.mOpts = $.extend({}, defaults, options);

    if(this.mOpts.isQuarter){
        this.mOpts.monthTable = 'quarterRangeTable';
        this.mOpts.monthTable.selectCss = 'quarterRangeSelected';
        this.mOpts.monthTable.compareCss = 'quarterRangeSelected';
        this.mOpts.monthTable.coincideCss = 'quarterRangeCoincide';
        if('' != this.mOpts.startMonth){
            this.mOpts.startMonth = this.toFirstMonthOfQuarter(this.mOpts.startMonth).formatMonthOfYear();
        }
        if('' != this.mOpts.endMonth){
            this.mOpts.endMonth = this.toFirstMonthOfQuarter(this.mOpts.endMonth).formatMonthOfYear();
        }
        if('' != this.mOpts.startCompareMonth){
            this.mOpts.startCompareMonth = this.toFirstMonthOfQuarter(this.mOpts.startCompareMonth).formatMonthOfYear();
        }
        if('' != this.mOpts.endCompareMonth){
            this.mOpts.endCompareMonth = this.toFirstMonthOfQuarter(this.mOpts.endCompareMonth).formatMonthOfYear();
        }
    }

    this.mOpts.calendars = Math.min(this.mOpts.calendars, 3);
    this.periodObj = {};
    this.periodObj[__method.mOpts.aCur] = 0;
    this.periodObj[__method.mOpts.aLast2] = 2;
    this.periodObj[__method.mOpts.aLast3] = 3;
    this.periodObj[__method.mOpts.aLast6] = 6;
    this.periodObj[__method.mOpts.aLast12] = 12;

    this.startDefMonth = '';
    this.mOpts.prefix = this.mOpts.isQuarter ? 'quarter' : 'month';
    var suffix = this.mOpts.prefix + '_' + ('' == this.mOpts.suffix ? (new Date()).getTime() : this.mOpts.suffix);

    this.calendarId = 'calendar_' + suffix;
    this.monthListId = this.mOpts.prefix + 'RangePicker_' + suffix;
    this.monthRangeDiv =this.mOpts.prefix + 'RangeDiv_' + suffix;
    this.monthRangeCompareDiv = this.mOpts.prefix + 'RangeCompareDiv_' + suffix;
    this.compareCheckBoxDiv = this.mOpts.prefix + 'RangeCompareCheckBoxDiv_' + suffix;
    this.submitBtn = 'submit_' + suffix;
    this.closeBtn = 'cloaseBtn_' + suffix;
    this.preYear = this.mOpts.prefix + 'RangePreYear_' + suffix;
    this.nextYear = this.mOpts.prefix + 'RangeNextYear_' + suffix;

    this.divMonthId = this.mOpts.divMonthId;
    this.compareTrigger = this.mOpts.compareTrigger + '_' + suffix;
    this.mOpts.compareTrigger = this.mOpts.compareTrigger + '_' + suffix;

    this.mOpts.startMonthId = this.mOpts.startMonthId + '_' + suffix;
    this.mOpts.endMonthId = this.mOpts.endMonthId + '_' + suffix;
    this.mOpts.compareCheckboxId = this.mOpts.compareCheckboxId + '_' + suffix;
    this.mOpts.startCompareMonthId = this.mOpts.startCompareMonthId + '_' + suffix;
    this.mOpts.endCompareMonthId = this.mOpts.endCompareMonthId + '_' + suffix;

    this.startMonthId = 'startDate_' + suffix;
    this.endMonthId = 'endDate_' + suffix;
    this.compareCheckboxId = 'needCompare_' + suffix;
    this.startCompareMonthId = 'startCompareDate_' + suffix;
    this.endCompareMonthId = 'endCompareDate_' + suffix;

    var wrapper = {
        gri: [
            '<div id="' + this.calendarId + '" class="gri_monthRangeCalendar">',
            '<table class="gri_monthRangePicker"><tr id="' + this.monthListId + '"></tr></table>',
            '<div class="gri_monthRangeOptions" ' + (this.mOpts.autoSubmit ? ' style="display:none" ' : '') + '>',
            '<div class="gri_monthRangeInput" id="' + this.monthRangeDiv + '" >',
            '<input type="text" class="gri_monthRangeInput" name="' + this.startMonthId + '" id="' + this.startMonthId + '" value="' + this.mOpts.startMonth + '"  />',
            '<span id="' + this.mOpts.joinLineId + '"> - </span>',
            '<input type="text" class="gri_monthRangeInput" name="' + this.endMonthId + '" id="' + this.endMonthId + '" value="' + this.mOpts.endMonth + '"  /><br />',
            '</div>',
            '<div class="gri_monthRangeInput" id="' + this.monthRangeCompareDiv + '">',
            '<input type="text" class="gri_monthRangeInput" name="' + this.startCompareMonthId + '" id="' + this.startCompareMonthId + '" value="' + this.mOpts.startCompareMonth + '"  />',
            '<span class="' + this.mOpts.joinLineId + '"> - </span>',
            '<input type="text" class="gri_monthRangeInput" name="' + this.endCompareMonthId + '" id="' + this.endCompareMonthId + '" value="' + this.mOpts.endCompareMonth + '"  />',
            '</div>',
            '<div>',
            '<input type="button" name="' + this.submitBtn + '" id="' + this.submitBtn + '" value="' + (this.mOpts.isEnglishVersion ? "OK" : "确定") + '" />',
            '&nbsp;<a id="' + this.closeBtn + '" href="javascript:;">' + (this.mOpts.isEnglishVersion ? "Cancel" : "取消") + '</a>',
            '</div>',
            '</div>',
            '</div>'
        ],
        ta: [
            '<div id="' + this.calendarId + '" class="ta_calendar_month ta_calendar_month2 cf">',
            '<div class="ta_calendar_month_cont cf" id="' + this.monthListId + '">',
            '</div>',
            '<div class="ta_calendar_month_footer cf" ' + (this.mOpts.autoSubmit ? ' style="display:none" ' : '') + '>',
            '<div class="frm_msg">',
            '<div id="' + this.monthRangeDiv + '">',
            '<input type="text" class="ta_ipt_text_s_month" name="' + this.startMonthId + '" id="' + this.startMonthId + '" value="' + this.mOpts.startMonth + '"  />',
            '<span class="' + this.mOpts.joinLineId + '"> - </span>',
            '<input type="text" class="ta_ipt_text_s_month" name="' + this.endMonthId + '" id="' + this.endMonthId + '" value="' + this.mOpts.endMonth + '"  /><br />',
            '</div>',
            '<div id="' + this.monthRangeCompareDiv + '">',
            '<input type="text" class="ta_ipt_text_s_month" name="' + this.startCompareMonthId + '" id="' + this.startCompareMonthId + '" value="' + this.mOpts.startCompareMonth + '"  />',
            '<span class="' + this.mOpts.joinLineId + '"> - </span>',
            '<input type="text" class="ta_ipt_text_s_month" name="' + this.endCompareMonthId + '" id="' + this.endCompareMonthId + '" value="' + this.mOpts.endCompareMonth + '"  />',
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
        gri: [
            '<label class="gri_contrast" for ="' + this.compareCheckboxId + '">',
            '<input type="checkbox" class="gri_pc" name="' + this.compareCheckboxId + '" id="' + this.compareCheckboxId + '" value="1"/>' + (this.mOpts.isEnglishVersion ? "vs" : '对比'),
            '</label>',
            '<input type="text" name="' + this.inputCompareId + '" id="' + this.inputCompareId + '" value="" class="gri_month"/>'
        ],
        ta: [
            '<label class="contrast" for ="' + this.compareCheckboxId + '" id="' + this.mOpts.compareLabel + '">',
            '<input type="checkbox" class="pc" name="' + this.compareCheckboxId + '" id="' + this.compareCheckboxId + '" value="1" style="display:none;"/>' + (this.mOpts.isEnglishVersion ? "vs" : '对比'),
            '</label>',
            '<div class="month" id="' + this.compareInputDiv + '">',
            '	<span name="monthCompare" id="' + this.inputCompareId + '" class="month_title"></span>',
            '	<a class="opt_sel" id="' + this.compareTrigger + '" href="#">',
            '		<i class="i_orderd"></i>',
            '	</a>',
            '</div>'
        ]
    }

    if (this.mOpts.theme == 'ta') {
        $(checkBoxWrapper[this.mOpts.theme].join('')).insertAfter($('#' + this.divMonthId));
    } else {
        $(checkBoxWrapper[this.mOpts.theme].join('')).insertAfter($('#' + this.inputId));
    }
    if (this.mOpts.monthPickerFrameId && '' != this.mOpts.monthPickerFrameId){
        $('#' + this.mOpts.monthPickerFrameId).attr('calendar-id', this.calendarId);
    }
    if(this.mOpts.noCalendar){
        $('#' + this.inputId).css('display', 'none');
        $('#' + this.compareCheckboxId).parent().css('display', 'none');
    }

    $(0 < $('#appendParent').length ? '#appendParent' : document.body).append(wrapper[this.mOpts.theme].join(''));
    $('#' + this.calendarId).css('z-index', 10000000);

    // 初始化目标地址的元素
    if (1 > $('#' + this.mOpts.startMonthId).length) {
        $('' != this.mOpts.target ? '#' + this.mOpts.target : 'body').append('<input type="hidden" id="' + this.mOpts.startMonthId + '" name="startMonth" value="' + this.mOpts.startMonth + '" />');
    } else {
        $('#' + this.mOpts.startMonthId).val(this.mOpts.startMonthId);
    }
    if (1 > $('#' + this.mOpts.endMonthId).length) {
        $('' != this.mOpts.target ? '#' + this.mOpts.target : 'body').append('<input type="hidden" id="' + this.mOpts.endMonthId + '" name="endMonth" value="' + this.mOpts.endMonth + '" />');
    } else {
        $('#' + this.mOpts.endMonthId).val(this.mOpts.endMonth);
    }
    if (1 > $('#' + this.mOpts.compareCheckboxId).length) {
        $('' != this.mOpts.target ? '#' + this.mOpts.target : 'body').append('<input type="checkbox" id="' + this.mOpts.compareCheckboxId + '" name="needCompare" value="0" style="display:none;" />');
    }

    if (false === this.mOpts.needCompare) {
        $('#' + this.compareInputDiv).css('display', 'none');
        $('#' + this.compareCheckBoxDiv).css('display', 'none');
        $('#' + this.monthRangeCompareDiv).css('display', 'none');
        $('#' + this.compareCheckboxId).attr('disabled', true);
        $('#' + this.startCompareMonthId).attr('disabled', true);
        $('#' + this.endCompareMonthId).attr('disabled', true);
        //隐藏对比的checkbox
        $('#' + this.compareCheckboxId).parent().css('display', 'none');
        $('#' + this.mOpts.replaceBtn).length > 0 && $('#' + this.mOpts.replaceBtn).hide();
    } else {
        if (1 > $('#' + this.mOpts.startCompareMonthId).length) {
            $('' != this.mOpts.target ? '#' + this.mOpts.target : 'body').append('<input type="hidden" id="' + this.mOpts.startCompareMonthId + '" name="startCompareMonth" value="' + this.mOpts.startCompareMonth + '" />');
        } else {
            $('#' + this.mOpts.startCompareMonthId).val(this.mOpts.startCompareMonth);
        }
        if (1 > $('#' + this.mOpts.endCompareMonthId).length) {
            $('' != this.mOpts.target ? '#' + this.mOpts.target : 'body').append('<input type="hidden" id="' + this.mOpts.endCompareMonthId + '" name="endCompareMonth" value="' + this.mOpts.endCompareMonth + '" />');
        } else {
            $('#' + this.mOpts.endCompareMonthId).val(this.mOpts.endCompareMonth);
        }
    }

    this.monthInput = this.startMonthId;

    // 开始时间 input 的 click 事件
    $('#' + this.startMonthId).bind('click', function () {
        // 如果用户在选择基准结束时间时，换到对比时间了，则
        if (__method.endCompareMonthId == __method.monthInput) {
            $('#' + __method.startCompareMonthId).val(__method.startDefMonth);
        }
        __method.startDefMonth = '';
        __method.removeCSS(1);
        __method.changeInput(__method.startMonthId);
        return false;
    });
    $('#' + this.calendarId).bind('click', function (event) {
        event.stopPropagation();
    });
    // 开始比较时间 input 的 click 事件
    $('#' + this.startCompareMonthId).bind('click', function () {
        // 如果用户在选择基准结束时间时，换到对比时间了，则
        if (__method.endMonthId == __method.monthInput) {
            $('#' + __method.startMonthId).val(__method.startDefMonth);
        }
        __method.startDefMonth = '';
        __method.removeCSS(0);
        __method.changeInput(__method.startCompareMonthId);
        return false;
    });

    $('#' + this.submitBtn).bind('click', function () {
        __method.close(1);
        __method.mOpts.success({
            'startMonth': $('#' + __method.mOpts.startMonthId).val(),
            'endMonth': $('#' + __method.mOpts.endMonthId).val(),
            'needCompare': $('#' + __method.mOpts.compareCheckboxId).val(),
            'startCompareMonth': $('#' + __method.mOpts.startCompareMonthId).val(),
            'endCompareMonth': $('#' + __method.mOpts.endCompareMonthId).val()
        });
        if (__method.mOpts.isSingleMonth) {
            var newMonth = $('#' + __method.mOpts.startMonthId).val();
            $('#' + __method.mOpts.monthPickerHandlerId).val(newMonth);
        }
        else {
            var newMonth = $('#' + __method.mOpts.startMonthId).val() + ',' + $('#' + __method.mOpts.endMonthId).val();
            $('#' + __method.mOpts.monthPickerHandlerId).val(newMonth);
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
        __method.mOpts.endMonth = $('#' + __method.endMonthId).val();
        __method.init();
        __method.show(false, __method);
        return false;
    });
    $('#' + this.mOpts.inputTrigger).bind('click', function () {
        __method.mOpts.endMonth = $('#' + __method.endMonthId).val();
        __method.init();
        __method.show(false, __method);
        return false;
    });
    $('#' + this.compareTrigger).bind('click', function () {
        __method.mOpts.endCompareMonth = $('#' + __method.endCompareMonthId).val();
        __method.init(true);
        __method.show(true, __method);
        return false;
    });
    // 为输入框添加click事件
    $('#' + this.inputCompareId).bind('click', function () {
        __method.mOpts.endCompareMonth = $('#' + __method.endCompareMonthId).val();
        __method.init(true);
        __method.show(true, __method);
        return false;
    });

    //判断是否是实时数据,如果是将时间默认填充进去
    if (this.mOpts.singleCompare) {
        if (this.mOpts.theme === 'ta') {
            $('#' + __method.startMonthId).val(__method.mOpts.startMonth);
            $('#' + __method.endMonthId).val(__method.mOpts.startMonth);
            $('#' + __method.startCompareMonthId).val(__method.mOpts.startCompareMonth);
            $('#' + __method.endCompareMonthId).val(__method.mOpts.startCompareMonth);
        }
        else {
            $('#' + __method.startMonthId).val(__method.mOpts.startMonth);
            $('#' + __method.endMonthId).val(__method.mOpts.startMonth);
            $('#' + __method.startCompareMonthId).val(__method.mOpts.startCompareMonth);
            $('#' + __method.endCompareMonthId).val(__method.mOpts.startCompareMonth);
            $('#' + this.compareCheckboxId).attr('checked', true);
            $('#' + this.mOpts.compareCheckboxId).attr('checked', true);
        }
    }

    // 时间对比
    $('#' + this.monthRangeCompareDiv).css('display', $('#' + this.compareCheckboxId).attr('checked') ? '' : 'none');
    $('#' + this.compareInputDiv).css('display', $('#' + this.compareCheckboxId).attr('checked') ? '' : 'none');
    $('#' + this.compareCheckboxId).bind('click', function () {
        $('#' + __method.inputCompareId).css('display', this.checked ? '' : 'none');
        $('#' + __method.monthRangeCompareDiv).css('display', this.checked ? '' : 'none');
        $('#' + __method.compareInputDiv).css('display', this.checked ? '' : 'none');
        $('#' + __method.startCompareMonthId).css('disabled', this.checked ? false : true);
        $('#' + __method.endCompareMonthId).css('disabled', this.checked ? false : true);
        // 修改表单的 checkbox 状态
        $('#' + __method.mOpts.compareCheckboxId).attr('checked', $('#' + __method.compareCheckboxId).attr('checked'));
        // 修改表单的值
        $('#' + __method.mOpts.compareCheckboxId).val($('#' + __method.compareCheckboxId).attr('checked') ? 1 : 0);


        // 初始化对比月选择控件，对比控件的结束月为月选择控件的开始月的前一个月
        if ($('#' + __method.compareCheckboxId).attr('checked')) {
            var sMonth = __method.str2Month($('#' + __method.startMonthId).val());
            var eMonth = __method.str2Month($('#' + __method.endMonthId).val());
            var step = eMonth.compareTo(sMonth);
            var ecMonth = __method.str2Month($('#' + __method.startMonthId).val());
            __method.mOpts.isQuarter ? ecMonth.setMonth(ecMonth.getMonth() - 3) : ecMonth.setMonth(ecMonth.getMonth() - 1);
            var scMonth = new MonthOfYear(ecMonth.getYear(), ecMonth.getMonth());
            scMonth.setMonth(scMonth.getMonth() - step);

            var minValidMonth = __method.str2Month(__method.mOpts.minValidMonth);
            if(__method.mOpts.isQuarter){
                minValidMonth = __method.toFirstMonthOfQuarter(minValidMonth);
                scMonth = __method.toFirstMonthOfQuarter(scMonth);
                ecMonth = __method.toFirstMonthOfQuarter(ecMonth);
                if(ecMonth.compareTo(minValidMonth) < 0){
                    scMonth = sMonth;
                    ecMonth = eMonth;
                }else if(scMonth.compareTo(minValidMonth) < 0){
                    scMonth = minValidMonth;
                    ecMonth.setMonth(scMonth.getMonth() + step);
                }
                $('#' + __method.startCompareMonthId).val(scMonth.formatMonthOfYear());
                $('#' + __method.endCompareMonthId).val(ecMonth.formatMonthOfYear());
            }else{
                if(ecMonth.compareTo(minValidMonth) < 0){
                    scMonth = sMonth;
                    ecMonth = eMonth;
                }else if(scMonth.compareTo(minValidMonth) < 0){
                    scMonth = minValidMonth;
                    ecMonth.setMonth(scMonth.getMonth() + step);
                }
                $('#' + __method.startCompareMonthId).val(scMonth.formatMonthOfYear());
                $('#' + __method.endCompareMonthId).val(ecMonth.formatMonthOfYear());
            }
        }
        __method.addCSS(1);
        // 输入框焦点切换到比较开始时间
        __method.changeInput(__method.startCompareMonthId);
        __method.close(1);
        __method.mOpts.success({
            'startMonth': $('#' + __method.mOpts.startMonthId).val(),
            'endMonth': $('#' + __method.mOpts.endMonthId).val(),
            'needCompare': $('#' + __method.mOpts.compareCheckboxId).val(),
            'startCompareMonth': $('#' + __method.mOpts.startCompareMonthId).val(),
            'endCompareMonth': $('#' + __method.mOpts.endCompareMonthId).val()
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
                $(self).text(isEnglishVersion ? 'Comparison' : '按时间对比');
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
            'startMonth': $('#' + __method.mOpts.startMonthId).val(),
            'endMonth': $('#' + __method.mOpts.endMonthId).val(),
            'needCompare': $('#' + __method.mOpts.compareCheckboxId).val(),
            'startCompareMonth': $('#' + __method.mOpts.startCompareMonthId).val(),
            'endCompareMonth': $('#' + __method.mOpts.endCompareMonthId).val()
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
pickerMonthRange.prototype.init = function(isCompare){
    var __method = this;
    var isNeedCompare = typeof(isCompare) != 'undefined' ? isCompare && $("#" + __method.compareCheckboxId).attr('checked') : $("#" + __method.compareCheckboxId).attr('checked');
    // 清空日期列表的内容
    $('#' + this.monthListId).empty();

    var now = moment().tz(__method.mOpts.timezone);

    //如果结束月为空，则以当前年份为结束年
    var endMonth;
    if(isCompare){
        endMonth = '' == this.mOpts.endCompareMonth ? this.str2Month(now.year()+'-01') : this.str2Month(this.mOpts.endCompareMonth);
    }else{
        endMonth = '' == this.mOpts.endMonth ? this.str2Month(now.year()+'-01') : this.str2Month(this.mOpts.endMonth);
    }
    //最后一个月作为日历结束月
    this.calendar_endMonth = new MonthOfYear(endMonth.getYear(), 12);

    for(var i=0; i<this.mOpts.calendars; i++){
        var td = null;
        if (this.mOpts.theme == 'ta') {
            td = this.fillMonth(endMonth.getYear(), i);
        }
        else {
            td = document.createElement('td');
            $(td).append(this.fillMonth(endMonth.getYear(), i));
            $(td).css('vertical-align', 'top');
        }
        if (0 == i) {
            $("#" + this.monthListId).append(td);
        } else {
            var firstTd = (this.mOpts.theme == 'ta' ? $("#" + this.monthListId).find('table').get(0) : $("#" + this.monthListId).find('td').get(0));
            $(firstTd).before(td);
            $(firstTd).before($('<div class="tb_divider"></div>'));
        }
        endMonth = new MonthOfYear(endMonth.getYear() - 1, 1);
    }

    // 上一年
    $('#' + this.preYear).bind('click', function () {
        __method.calendar_endMonth = new MonthOfYear(__method.calendar_endMonth.getYear() - 1, 12);
        if(isCompare){
            __method.mOpts.endCompareMonth = __method.calendar_endMonth.formatMonthOfYear();
            __method.init(isCompare);
            //如果是单月选择的时候，要控制input输入框,即下次选日期的时候要设置哪个输入框的值
            if (1 == __method.mOpts.calendars) {
                if ('' == $('#' + __method.startCompareMonthId).val()) {
                    __method.changeInput(__method.startCompareMonthId);
                }
                else {
                    __method.changeInput(__method.endCompareMonthId);
                }
            }
        }else{
            __method.mOpts.endMonth = __method.calendar_endMonth.formatMonthOfYear();
            __method.init(isCompare);
            //如果是单月选择的时候，要控制input输入框,即下次选日期的时候要设置哪个输入框的值
            if (1 == __method.mOpts.calendars) {
                if ('' == $('#' + __method.startMonthId).val()) {
                    __method.changeInput(__method.startMonthId);
                }
                else {
                    __method.changeInput(__method.endMonthId);
                }
            }
        }
        return false;
    });
    // 下一年
    $('#' + this.nextYear).bind('click', function () {
        __method.calendar_endMonth = new MonthOfYear(__method.calendar_endMonth.getYear() + 1, 12);
        if(isCompare){
            __method.mOpts.endCompareMonth = __method.calendar_endMonth.formatMonthOfYear();
            __method.init(isCompare);
            //如果是单月选择的时候，要控制input输入框,即下次选日期的时候要设置哪个输入框的值
            if (1 == __method.mOpts.calendars) {
                if ('' == $('#' + __method.startCompareMonthId).val()) {
                    __method.changeInput(__method.startCompareMonthId);
                }
                else {
                    __method.changeInput(__method.endCompareMonthId);
                }
            }
        }else{
            __method.mOpts.endMonth = __method.calendar_endMonth.formatMonthOfYear();
            __method.init(isCompare);
            //如果是单月选择的时候，要控制input输入框,即下次选日期的时候要设置哪个输入框的值
            if (1 == __method.mOpts.calendars) {
                if ('' == $('#' + __method.startMonthId).val()) {
                    __method.changeInput(__method.startMonthId);
                }
                else {
                    __method.changeInput(__method.endMonthId);
                }
            }
        }

        return false;
    });

    this.calendar_startMonth = new MonthOfYear(endMonth.getYear() + 1, 1);

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
                var cla = __method.mOpts.theme == 'ta' ? 'active' : 'a';
                $(this).parent().nextAll().removeClass(cla);
                $(this).parent().prevAll().removeClass(cla);
                $(this).parent().addClass(cla);
                //拼接提交时间串
                var timeObj = __method.getSpecialPeriod(__method.periodObj[$(this).attr('id')]);
                $('#' + __method.startMonthId).val(timeObj.startMonth);
                $('#' + __method.endMonthId).val(timeObj.endMonth);
                $('#' + __method.mOpts.startMonthId).val($('#' + __method.startMonthId).val());
                $('#' + __method.mOpts.endMonthId).val($('#' + __method.endMonthId).val());
                __method.mOpts.theme == 'ta' ? $('#' + __method.compareInputDiv).hide() : $('#' + __method.inputCompareId).css('display', 'none');
                $('#' + __method.compareCheckboxId).attr('checked', false);
                $('#' + __method.mOpts.compareCheckboxId).attr('checked', false);
                $('#' + this.compareInputDiv).css('display', $('#' + this.compareCheckboxId).attr('checked') ? '' : 'none');
                __method.close(1);
                //于此同时清空对比时间框的时间
                $('#' + __method.startCompareMonthId).val('');
                $('#' + __method.endCompareMonthId).val('');
                $('#' + __method.mOpts.startCompareMonthId).val('');
                $('#' + __method.mOpts.endCompareMonthId).val('');
                $('#' + __method.mOpts.compareCheckboxId).val(0);

                if ($('#' + __method.mOpts.replaceBtn).length > 0) {
                    $('.contrast').hide();
                    $('#' + __method.mOpts.replaceBtn).text(__method.mOpts.isEnglishVersion ? 'Comparison' : '按时间对比');
                }
                //点击提交
                __method.mOpts.success({'startMonth': $('#' + __method.mOpts.startMonthId).val(),
                    'endMonth': $('#' + __method.mOpts.endMonthId).val(),
                    'needCompare': $('#' + __method.mOpts.compareCheckboxId).val(),
                    'startCompareMonth': $('#' + __method.mOpts.startCompareMonthId).val(),
                    'endCompareMonth': $('#' + __method.mOpts.endCompareMonthId).val()
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
            $('#' + __method.startMonthId).val('');
            $('#' + __method.endMonthId).val('');
            $('#' + __method.startCompareMonthId).val('');
            $('#' + __method.endCompareMonthId).val('');
        }
    })

}

/**
 * @description 移除选择日期面板的样式
 * @param {Boolean} isCompare 是否是对比日期面板
 * @param {String} specialClass 特殊的样式，这里默认是常规和对比日期两种样式的重合样式
 */
pickerMonthRange.prototype.removeCSS = function (isCompare, specialClass) {
    // 是否移除对比部分的样式:0 日期选择;1 对比日期选择
    if ('undefined' == typeof(isCompare)) {
        isCompare = 0;
    }

    // 整个日期列表的开始日期
    var bMonth = new MonthOfYear(this.calendar_startMonth.getYear(), this.calendar_startMonth.getMonth());
    var cla = '';
    var step = this.mOpts.isQuarter ? 3 : 1;
    // 从开始日期循环到结束日期
    for (var m = bMonth; m.compareTo(this.calendar_endMonth) <= 0; m.setMonth(m.getMonth() + step)) {
        if (0 == isCompare) {
            // 移除日期样式
            cla = this.mOpts.theme + '_' + this.mOpts.selectCss;
        } else {
            // 移除对比日期样式
            cla = this.mOpts.theme + '_' + this.mOpts.compareCss;
        }
        // 移除指定样式
        $('#' + this.calendarId + '_' + m.formatMonthOfYear()).removeClass(cla);
        $('#' + this.calendarId + '_' + m.formatMonthOfYear()).removeClass(this.mOpts.firstCss).removeClass(this.mOpts.lastCss).removeClass(this.mOpts.clickCss);

    }
};

/**
 * @description 为选中的日期加上样式：1=比较时间；0=时间范围
 * @param {Boolean} isCompare 是否是对比日期面板
 * @param {String} specialClass 特殊的样式，这里默认是常规和对比日期两种样式的重合样式
 */
pickerMonthRange.prototype.addCSS = function (isCompare, specialClass) {
    // 是否移除对比部分的样式:0 日期选择;1 对比日期选择
    if ('undefined' == typeof(isCompare)) {
        isCompare = 0;
    }
    // 获取4个日期
    var startMonth = this.str2Month($('#' + this.startMonthId).val());
    var endMonth = this.str2Month($('#' + this.endMonthId).val());
    var startCompareMonth = this.str2Month($('#' + this.startCompareMonthId).val());
    var endCompareMonth = this.str2Month($('#' + this.endCompareMonthId).val());

    // 循环开始周
    var sMonth = 0 == isCompare ? startMonth : startCompareMonth;
    // 循环结束周
    var eMonth = 0 == isCompare ? endMonth : endCompareMonth;
    var cla = '';
    var step = this.mOpts.isQuarter ? 3 : 1;
    for (var d = new MonthOfYear(sMonth.getYear(), sMonth.getMonth()); d.compareTo(eMonth) <= 0; d.setMonth(d.getMonth() + step)) {
        if (0 == isCompare) {
            // 添加日期样式
            cla = this.mOpts.theme + '_' + this.mOpts.selectCss;
            $('#' + this.calendarId + '_' + d.formatMonthOfYear()).removeClass(this.mOpts.firstCss).removeClass(this.mOpts.lastCss).removeClass(this.mOpts.clickCss);
            $('#' + this.calendarId + '_' + d.formatMonthOfYear()).removeClass(cla);
        } else {
            // 添加对比日期样式
            cla = this.mOpts.theme + '_' + this.mOpts.compareCss;
        }

        $('#' + this.calendarId + '_' + d.formatMonthOfYear()).attr('class', cla);
    }
    if (this.mOpts.theme == 'ta') {
        //为开始结束添加特殊样式
        $('#' + this.calendarId + '_' + sMonth.formatMonthOfYear()).removeClass().addClass(this.mOpts.firstCss);
        $('#' + this.calendarId + '_' + eMonth.formatMonthOfYear()).removeClass().addClass(this.mOpts.lastCss);
        //如果开始结束时间相同
        sMonth.compareTo(eMonth) == 0 && $('#' + this.calendarId + '_' + eMonth.formatMonthOfYear()).removeClass().addClass(this.mOpts.clickCss);
    }
};

pickerMonthRange.prototype.checkMonthRange = function (startYM, endYM) {
    var sMonth = this.str2Month(startYM);
    var eMonth = this.str2Month(endYM);
    var maxEMonth;
    if (eMonth.compareTo(sMonth) >= 0) {
        maxEMonth = this.str2Month(startYM);
        maxEMonth.setMonth(maxEMonth.getMonth() + this.mOpts.monthRangeMax)
        if (maxEMonth.compareTo(eMonth) < 0) {
            alert('结束月不能大于：' + maxEMonth.formatMonthOfYear());
            return false;
        }
    } else {
        maxEMonth = this.str2Month(startYM);
        maxEMonth.setMonth(maxEMonth.getMonth() - this.mOpts.monthRangeMax)
        if (maxEMonth.compareTo(eMonth) > 0) {
            alert('开始月不能小于：' + maxEMonth.formatMonthOfYear());
            return false;
        }
    }
    return true;
}

pickerMonthRange.prototype.selectMonth = function (ym) {
    this.changeInput(this.monthInput);
    var ymFormat = ym;
    // start <-> end 切换
    if (this.startMonthId == this.monthInput) {
        // 移除样式
        this.removeCSS(0);
        this.removeCSS(1);
        // 为当前点加样式
        $('#' + this.calendarId + '_' + ym).attr('class', (this.mOpts.theme == 'ta' ? this.mOpts.clickCss : this.mOpts.theme + '_' + this.mOpts.selectCss));
        this.startDefMonth = $('#' + this.monthInput).val();
        // 更改对应输入框的值
        $('#' + this.monthInput).val(ymFormat);
        $('#' + this.endMonthId).val(ymFormat);

        // 切换输入框焦点,如果是实时数据那么选择一天的数据
        if (true == this.mOpts.singleCompare || true == this.mOpts.isSingleMonth) {
            this.monthInput = this.startMonthId;
            $('#' + this.endMonthId).val(ymFormat);
        } else {
            this.monthInput = this.endMonthId;
        }

    } else if (this.endMonthId == this.monthInput) {
        if ('' == $('#' + this.startMonthId).val()) {
            this.monthInput = this.startMonthId;
            this.selectMonth(ym);
            return false;
        }
        // 判断用户选择的时间范围
        if (false == this.checkMonthRange($('#' + this.startMonthId).val(), ym)) {
            return false;
        }
        // 如果结束时间小于开始时间
        if (this.compareStrMonth(ym, $('#' + this.startMonthId).val()) < 0) {
            // 更改对应输入框的值(结束时间)
            $('#' + this.monthInput).val($('#' + this.startMonthId).val());
            // 更改对应输入框的值(开始时间)
            $('#' + this.startMonthId).val(ymFormat);
            ymFormat = $('#' + this.monthInput).val();
        }
        // 更改对应输入框的值
        $('#' + this.monthInput).val(ymFormat);

        // 切换输入框焦点
        this.monthInput = this.startMonthId;
        this.removeCSS(0);
        this.addCSS(0);
        //this.addCSS(0, this.mOpts.coincideCss);
        this.startDefMonth = '';
        if (this.mOpts.autoSubmit) {
            this.close(1);
            this.mOpts.success({'startMonth': $('#' + this.mOpts.startMonthId).val(),
                'endMonth': $('#' + this.mOpts.endMonthId).val(),
                'needCompare': $('#' + this.mOpts.compareCheckboxId).val(),
                'startCompareMonth': $('#' + this.mOpts.startCompareMonthId).val(),
                'endCompareMonth': $('#' + this.mOpts.endCompareMonthId).val()
            });
        }
    } else if (this.startCompareMonthId == this.monthInput) {
        // 移除样式
        this.removeCSS(1);
        this.removeCSS(0);
        // 为当前点加样式
        $('#' + this.calendarId + '_' + ym).attr('class', (this.mOpts.theme == 'ta' ? this.mOpts.clickCss : this.mOpts.theme + '_' + this.mOpts.compareCss));
        // 获取开始时间的初始值
        this.startDefMonth = $('#' + this.monthInput).val();
        // 更改对应输入框的值
        $('#' + this.monthInput).val(ymFormat);
        // 切换输入框焦点
        if (true == this.mOpts.singleCompare || true == this.mOpts.isSingleMonth) {
            this.monthInput = this.startCompareMonthId;
            $('#' + this.endCompareMonthId).val(ymFormat);
        }
        else {
            this.monthInput = this.endCompareMonthId;
        }

    } else if (this.endCompareMonthId == this.monthInput) {
        // 如果开始时间未选
        if ('' == $('#' + this.startCompareMonthId).val()) {
            this.monthInput = this.startCompareMonthId;
            this.selectMonth(ym);
            return false;
        }
        // 判断用户选择的时间范围
        if (false == this.checkMonthRange($('#' + this.startCompareMonthId).val(), ym)) {
            return false;
        }
        // 如果结束时间小于开始时间
        if (this.compareStrMonth(ym, $('#' + this.startCompareMonthId).val()) < 0) {
            // 更改对应输入框的值(结束时间)
            $('#' + this.monthInput).val($('#' + this.startCompareMonthId).val());
            // 更改对应输入框的值(开始时间)
            $('#' + this.startCompareMonthId).val(ymFormat);
            ymFormat = $('#' + this.monthInput).val();
        }
        // 更改对应输入框的值
        $('#' + this.monthInput).val(ymFormat);
        // 切换输入框焦点
        this.monthInput = this.startCompareMonthId;
        //this.addCSS(1, this.mOpts.coincideCss);
        this.removeCSS(1);
        this.addCSS(1);
        this.startDefMonth = '';

        if (this.mOpts.autoSubmit) {
            this.close(1);
            this.mOpts.success({'startMonth': $('#' + this.mOpts.startMonthId).val(),
                'endMonth': $('#' + this.mOpts.endMonthId).val(),
                'needCompare': $('#' + this.mOpts.compareCheckboxId).val(),
                'startCompareMonth': $('#' + this.mOpts.startCompareMonthId).val(),
                'endCompareMonth': $('#' + this.mOpts.endCompareMonthId).val()
            });
        }
    }
};

pickerMonthRange.prototype.show = function (isCompare, __method) {
    $('#' + __method.monthRangeDiv).css('display', isCompare ? 'none' : '');
    $('#' + __method.monthRangeCompareDiv).css('display', isCompare ? '' : 'none');

    var pos = isCompare ? $('#' + this.inputCompareId).offset() : $('#' + this.inputId).offset();
    var clientWidth = parseInt($(document.body)[0].clientWidth);
    var left = pos.left;
    $("#" + this.calendarId).css('display', 'block');
    if(__method.mOpts.isQuarter){
        $('#' + this.monthListId).addClass('quarter_calendar');
        $('#' + this.monthRangeDiv).css('display', 'none');
        $('#' + this.monthRangeCompareDiv).css('display', 'none');
    }
    if (true == this.mOpts.singleCompare || true == this.mOpts.isSingleMonth) {
        $('#' + this.endMonthId).css('display', 'none');
        $('#' + this.endCompareMonthId).css('display', 'none');
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
    isCompare ? this.changeInput(this.startCompareMonthId) : this.changeInput(this.startMonthId);
    return false;
};

pickerMonthRange.prototype.close = function (btnSubmit) {

    var __method = this;
    if (btnSubmit) {
        //如果是单日快捷选择
        if (this.mOpts.shortOpr === true) {
            $('#' + this.inputId).val($('#' + this.startMonthId).val());
            $('#' + this.inputCompareId).val($('#' + this.startCompareMonthId).val());
        } else {
            if (this.mOpts.isSingleMonth == true) {
                $('#' + this.inputId).val(this.formatMonthStr($('#' + this.startMonthId).val(), this.mOpts.isEnglishVersion));
            }
            else {
                $('#' + this.inputId).val(this.formatMonthStr($('#' + this.startMonthId).val(), this.mOpts.isEnglishVersion) + ('' == $('#' + this.endMonthId).val() ? '' : (this.mOpts.isEnglishVersion ? " to " : this.mOpts.defaultText) + this.formatMonthStr($('#' + this.endMonthId).val(), this.mOpts.isEnglishVersion)));
            }

        }

        if(this.mOpts.isSingleMonth == true){
            $('#' + this.endMonthId).val($('#' + this.startMonthId).val());
        }

        var now = moment().tz(__method.mOpts.timezone);
        var currMonth = new MonthOfYear(now.year(), now.month() + 1);

        //如果本月不可用，从前一月往前推
        (true == __method.mOpts.isCurMonthValid && ('' != __method.mOpts.isCurMonthValid)) ? '' : currMonth.setMonth(currMonth.getMonth() - 1);
        var bMonth = this.str2Month($('#' + this.startMonthId).val())
        var eMonth = this.str2Month($('#' + this.endMonthId).val())
        //如果eMonth小于bMonth 相互交换
        if (eMonth.compareTo(bMonth) < 0) {
            var tmp = $('#' + this.startMonthId).val();
            $('#' + this.startMonthId).val($('#' + this.endMonthId).val());
            $('#' + this.endMonthId).val(tmp);
        }
        var _val = this.mOpts.shortOpr == true ? this.formatMonthStr($('#' + this.startMonthId).val(), this.mOpts.isEnglishVersion) : (this.formatMonthStr($('#' + this.startMonthId).val(), this.mOpts.isEnglishVersion) + ('' == $('#' + this.endMonthId).val() ? '' : (this.mOpts.isEnglishVersion ? " to " : this.mOpts.defaultText) + this.formatMonthStr($('#' + this.endMonthId).val(), this.mOpts.isEnglishVersion)));
        if (this.mOpts.isSingleMonth) {
            _val = this.formatMonthStr($('#' + this.startMonthId).val(), this.mOpts.isEnglishVersion);
        }
        var input = document.getElementById(this.inputId);
        if (input && input.tagName == 'INPUT') {
            $('#' + this.inputId).val(_val);
            $('#' + this.inputCompareId).is(':visible') && $('#' + this.inputCompareId).val(_compareVal);
        } else {
            $('#' + this.inputId).html(_val);
            $('#' + this.inputCompareId).is(':visible') && $('#' + this.inputCompareId).html(_compareVal);
        }
        var _compareVal = this.mOpts.shortOpr == true ? this.formatMonthStr($('#' + this.startCompareMonthId).val(), this.mOpts.isEnglishVersion) : (this.formatMonthStr($('#' + this.startCompareMonthId).val(), this.mOpts.isEnglishVersion) + ('' == $('#' + this.endCompareMonthId).val() ? '' : (this.mOpts.isEnglishVersion ? " to " : this.mOpts.defaultText) + this.formatMonthStr($('#' + this.endCompareMonthId).val(), this.mOpts.isEnglishVersion)));
        if (this.mOpts.isSingleMonth) {
            _compareVal = this.formatMonthStr($('#' + this.startCompareMonthId).val(), this.mOpts.isEnglishVersion);
        }
        if (input && input.tagName == 'INPUT') {
            $('#' + this.inputCompareId).val(_compareVal);
        } else {
            $('#' + this.inputCompareId).html(_compareVal);
        }

        var curMonthStr;
        if(this.mOpts.isQuarter === true){
            currMonth = this.toFirstMonthOfQuarter(currMonth);
            curMonthStr = currMonth.formatMonthOfYear();
            currMonth.setMonth(currMonth.getMonth() - 3);
        }else{
            curMonthStr = currMonth.formatMonthOfYear();
            currMonth.setMonth(currMonth.getMonth() - 1);
        }
        if(curMonthStr == $('#' + this.startMonthId).val() && curMonthStr == $('#' + this.endMonthId).val()){
            $("#" + this.mOpts.aCur).parent().addClass('active').siblings().removeClass('active');
        }else if(curMonthStr == $('#' + this.endMonthId).val()){
            var startMonth = this.str2Month($('#' + this.startMonthId).val());
            var endMonth = this.str2Month($('#' + this.endMonthId).val());
            var step = endMonth.compareTo(startMonth) / (this.mOpts.isQuarter ? 3 : 1);
            step += 1;
            $("#" + this.mOpts.aCur).parent().removeClass('active').siblings().removeClass('active');
            $("#" + this.mOpts['aLast' + step]).parent().addClass('active');
        }else{ //都不是
            $("#" + this.mOpts.aCur).parent().removeClass('active').siblings().removeClass('active');
        }

        // 更改目标元素值
        $('#' + this.mOpts.startMonthId).val($('#' + this.startMonthId).val());
        $('#' + this.mOpts.endMonthId).val($('#' + this.endMonthId).val());
        $('#' + this.mOpts.startCompareMonthId).val($('#' + this.startCompareMonthId).val());
        $('#' + this.mOpts.endCompareMonthId).val($('#' + this.endCompareMonthId).val());
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

pickerMonthRange.prototype.changeInput = function (ipt) {
    // 强制修改为开始输入框
    if (true == this.mOpts.isSingleMonth) {
        ipt = this.startMonthId;
    }
    // 所有4个输入框
    var allInputs = [this.startMonthId, this.startCompareMonthId, this.endMonthId, this.endCompareMonthId];

    // 如果 ipt 是日期输入框，则为日期样式，否则为对比日期样式
    var cla = '';
    if (ipt == this.startMonthId || ipt == this.endMonthId) {
        cla = this.mOpts.theme + '_' + this.mOpts.selectCss;
    } else {
        cla = this.mOpts.theme + '_' + this.mOpts.compareCss;
    }
    if (ipt == this.endMonthId && this.mOpts.singleCompare) {
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
    this.monthInput = ipt;
};


pickerMonthRange.prototype.compareStrMonth = function(b, e) {
    var bMonth = this.str2Month(b);
    var eMonth = this.str2Month(e);
    return bMonth.compareTo(eMonth);
};

pickerMonthRange.prototype.formatMonthStr = function(ym, isEnglishVersion){
    var ar = ym.split('-');
    if(this.mOpts.isQuarter) {
        var ret = (ar.length > 0 ? ar[0] : '?') + (isEnglishVersion ? ' ' : '年');
        if(ar.length > 1){
            var q = Math.floor((Number(ar[1]) -1 ) / 3) + 1;
            if(isEnglishVersion){
                ret += 'Q' + q;
            }else {
                var quarter = '?';
                switch (q) {
                    case 1 :
                        quarter = '一';
                        break;
                    case 2 :
                        quarter = '二';
                        break;
                    case 3 :
                        quarter = '三';
                        break;
                    case 4 :
                        quarter = '四';
                        break;
                }
                ret += '第' + quarter + '季度'
            }
        }
        return ret;
    }else{
        var ret = (ar.length > 0 ? ar[0] : '?') + (isEnglishVersion ? '-' : '年');
        ret += (ar.length > 1 ? ar[1] : '?');
        ret += (isEnglishVersion ? '' : '月');
        return ret;
    }
}


pickerMonthRange.prototype.getSpecialPeriod = function(period){
    var __method = this;
    var now = moment().tz(__method.mOpts.timezone);
    var cm = now.month() + 1;
    (true == __method.mOpts.isCurMonthValid && '' != __method.mOpts.isCurMonthValid || period < 2) ? '' : cm-=1;
    var curMonth = new MonthOfYear(now.year(), cm);
    if(__method.mOpts.isQuarter){
        curMonth = __method.toFirstMonthOfQuarter(curMonth);
    }
    var back = period < 2 ? period : period - 1;
    var endStr = curMonth.formatMonthOfYear();
    curMonth.setMonth(curMonth.getMonth() - back * (__method.mOpts.isQuarter ? 3 : 1));
    var startStr = curMonth.formatMonthOfYear();
    if(period == __method.periodObj[__method.mOpts.aLast]){
        endStr = startStr;
    }
    return {endMonth: endStr, startMonth: startStr};
}

pickerMonthRange.prototype.fillMonth = function(year, index){
    var __method = this;
    var isTaTheme = this.mOpts.theme == 'ta';
    var table = document.createElement('table');
    if(isTaTheme) {
        table.className = this.mOpts.monthTable;
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
        if(this.mOpts.isQuarter) {
            $(td).attr('colSpan', 1);
        }else{
            $(td).attr('colSpan', 4);
        }
        $(td).css('text-align', 'center');
        $(tr).append(td);
        $(table).append(tr);
    }else{
        table.className = this.mOpts.theme + '_' + this.mOpts.monthTable;

        tr = document.createElement('tr');
        td = document.createElement('td');
        if (0 == index) {
            $(td).append('<a href="javascript:void(0);" id="' + this.nextYear + '" class="gri_monthRangeNextYear"><span>next</span></a>');
        }
        if (index + 1 == this.mOpts.calendars) {
            $(td).append('<a href="javascript:void(0);" id="' + this.preYear + '" class="gri_monthRangePreYear"><span>pre</span></a>');
        }
        if (this.mOpts.isEnglishVersion) {
            $(td).append(year);
        } else {
            $(td).append(year + '年');
        }

        if(this.mOpts.isQuarter) {
            $(td).attr('colSpan', 1);
        }else{
            $(td).attr('colSpan', 4);
        }
        $(td).css('text-align', 'center');
        $(td).css('background-color', '#F9F9F9');
        $(tr).append(td);
        $(table).append(tr);
    }

    var tdClass = '', deviation = 0;
    var beginMonth = this.str2Month(year.toString() + '-01');
    var stopMonth = this.str2Month(year.toString() + '-12');
    var now = moment().tz(__method.mOpts.timezone);
    var curMonth = this.str2Month(now.year()+'-'+(now.month()+1).toString());
    var minMonth = this.str2Month(this.mOpts.minValidMonth);
    var maxMonth = '' == this.mOpts.maxValidMonth ? null : this.str2Month(this.mOpts.maxValidMonth);
    if(this.mOpts.isQuarter){
        var currQuarter = this.toFirstMonthOfQuarter(curMonth);
        var minQuarter = this.toFirstMonthOfQuarter(minMonth);
        var maxQuarter = maxMonth == null ? null : this.toFirstMonthOfQuarter(maxMonth);
        for(var month = beginMonth; month.compareTo(stopMonth) <= 0; month.setMonth(month.getMonth() + 3)){
            if((this.mOpts.stopMonth == true && month.compareTo(currQuarter) > 0) || month.compareTo(minQuarter) < 0 || ('' != this.mOpts.maxValidMonth && month.compareTo(maxQuarter) > 0) ){
                tdClass = this.mOpts.theme + '_' + this.mOpts.disableGray;
                deviation = '1';
            }else{
                deviation = '0';
                if (month.compareTo(currQuarter) == 0) {
                    if (true == this.mOpts.isCurMonthValid) {
                        tdClass = this.mOpts.theme + '_' + this.mOpts.isCurMonth;
                    } else {
                        tdClass = this.mOpts.theme + '_' + this.mOpts.disableGray;
                        deviation = '1';
                    }
                } else {
                    tdClass = '';
                }
            }
            tr = document.createElement('tr');
            td = document.createElement('td');
            var quarter = Math.floor((month.getMonth() - 1) / 3) ;
            var seasons = this.mOpts.isEnglishVersion ? ['Season 1', 'Season 2', 'Season 3', 'Season 4'] : ['第一季度', '第二季度', '第三季度', '第四季度'];
            td.innerHTML = seasons[quarter];
            if ('' != tdClass) {
                $(td).attr('class', tdClass);
            }

            if ('0' == deviation) {
                $(td).attr('id', __method.calendarId + '_' + month.formatMonthOfYear());
                $(td).css('cursor', 'pointer');
                (function (monthStr) {
                    $(td).bind('click', monthStr, function () {
                        __method.selectMonth(monthStr);
                        return false;
                    })
                })(month.formatMonthOfYear());
            }

            $(tr).append(td);
            $(table).append(tr);
        }
    }else{
        for(var month = beginMonth; month.compareTo(stopMonth) <= 0; month.setMonth(month.getMonth() + 1)){
            if((this.mOpts.stopMonth == true && month.compareTo(curMonth) > 0) || month.compareTo(minMonth) < 0 || ('' != this.mOpts.maxValidMonth && month.compareTo(maxMonth) > 0) ){
                tdClass = this.mOpts.theme + '_' + this.mOpts.disableGray;
                deviation = '1';
            }else{
                deviation = '0';
                if (month.compareTo(curMonth) == 0) {
                    if (true == this.mOpts.isCurMonthValid) {
                        tdClass = this.mOpts.theme + '_' + this.mOpts.isCurMonth;
                    } else {
                        tdClass = this.mOpts.theme + '_' + this.mOpts.disableGray;
                        deviation = '1';
                    }
                } else {
                    tdClass = '';
                }
            }

            if (month.getMonth() % 4 == 1) { //每4周显示一行
                tr = document.createElement('tr');
            }
            td = document.createElement('td');
            var months = this.mOpts.isEnglishVersion ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Otc', 'Nov', 'Dec'] : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
            td.innerHTML = months[month.getMonth() - 1];

            if ('' != tdClass) {
                $(td).attr('class', tdClass);
            }

            if ('0' == deviation) {
                $(td).attr('id', __method.calendarId + '_' + month.formatMonthOfYear());
                $(td).css('cursor', 'pointer');
                (function (monthStr) {
                    $(td).bind('click', monthStr, function () {
                        __method.selectMonth(monthStr);
                        return false;
                    })
                })(month.formatMonthOfYear());
            }

            $(tr).append(td);
            if (month.getMonth() % 4 == 0) {
                $(table).append(tr);
            }
        }
    }

    return table;

}


pickerMonthRange.prototype.str2Month = function(ym){
    var ar = ym.split('-');
    return new MonthOfYear(Number(ar[0]), Number(ar[1]));
}

pickerMonthRange.prototype.toFirstMonthOfQuarter = function(ym){
    if(ym instanceof MonthOfYear){
        var month = ym.getMonth();
        var firstMonthOfQuarter = Math.floor((month - 1) / 3 ) ;
        return new MonthOfYear(ym.getYear(), 1 + firstMonthOfQuarter * 3);
    }else if(typeof(ym) == 'string'){
        var ymObj = this.str2Month(ym);
        return this.toFirstMonthOfQuarter(ymObj);
    }
}

function MonthOfYear(year, month){
    if(arguments.length == 0){
        this.year = 2015;
        this.month = 1;
    }else if(arguments.length == 2){
        var firstDate = new Date(year, month - 1, 1);
        this.year = firstDate.getFullYear();
        this.month = firstDate.getMonth() + 1;
    }
}

MonthOfYear.prototype.getYear = function(){
    return this.year;
}

MonthOfYear.prototype.getMonth = function(){
    return this.month;
}

MonthOfYear.prototype.formatMonthOfYear = function(){
    var ret = this.year.toString() + '-';
    if(this.month < 10){
        ret += '0' + this.month.toString();
    }else{
        ret += this.month.toString();
    }
    return ret;
}

MonthOfYear.prototype.compareTo = function(other){
    if(this.year != other.year){
        return (this.year - other.year) * 12 + (this.month - other.month);
    }else{
        return this.month - other.month;
    }
}

MonthOfYear.prototype.setYear = function(newYear){
    this.year = newYear;
}

MonthOfYear.prototype.setMonth = function(newMonth){
    var newMonthOfYear = new MonthOfYear(this.year, newMonth)
    this.year = newMonthOfYear.year;
    this.month = newMonthOfYear.month;
}
