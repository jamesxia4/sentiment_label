/**
 * Created by gzhuangzhankun on 2015/3/18.
 */

;
(function ($, window, document, undefined){
    $.fn.gdasCombinedDatePicker = function(options){
        var opts = $.extend({}, $.fn.gdasCombinedDatePicker.options, options);
        return this.each(function(i, input){
            var suffix = (new Date()).getTime();
            $(input).before('<div class="switchBtnDiv" id="switchBtnDiv_' + suffix + '"></div>');
            $.each(opts.switchTypes,function(n,type){
                var btnTxt;
                if('day' === type){
                    btnTxt = '日';
                }else if('week' === type){
                    btnTxt = '周';
                }else if('month' === type){
                    btnTxt = '月';
                }
                var btnId = 'btn_' + type + '_' + suffix;
                $('#switchBtnDiv_' + suffix).append('<button id="' + btnId + '"value="' + type + '"><div onselectstart="return false" class="ffbug_wrapper">' + btnTxt + '</div></button>');
                $('#' + btnId).bind('click', function(){
                    var newVal = null; //隐藏时间
                    if(!opts.commander && $('#hidden-date').length > 0 && '' !== $('#hidden-date').val()){
                        newVal = $('#hidden-date').val();
                        $(this).removeClass('active');
                    }
                    if($(this).hasClass('active')){
                        return false;
                    }
                    $(this).addClass('active');
                    $(this).siblings().removeClass('active');
                    var tool_date = $(this).parent().next().next();
                    var val = $(this).val();
                    tool_date.each(function(index, element){
                        var calendarId = $(element).attr('calendar-id');
                        $('#' + calendarId).remove();
                        $(element).remove();
                    });
                    var confirmCallBack = opts.success;
                    if('day' === val){
                        //var defOptions = opts.defaultOptions.day;
                        var defOptions = $.extend({},opts.defaultOptions.day);//clone 一份，防止被下面修改 ljjn1246 20150910
                        if(defOptions.success == undefined){
                            defOptions.success = confirmCallBack;
                        }
                        if(newVal == null){
                            newVal = defOptions.defaultValue;
                        }
                        $(input).val(newVal);
                        $(input).gdasDatePicker($.extend({},defOptions, {defaultValue:newVal}));
                    }else if('week' === val){
                        //var defOptions = opts.defaultOptions.week;
                        var defOptions = $.extend({},opts.defaultOptions.week);//clone 一份，防止被下面修改 ljjn1246 20150910
                        if(defOptions.success == undefined){
                            defOptions.success = confirmCallBack;
                        }
                        if(newVal == null){
                            newVal = defOptions.defaultValue;
                        }
                        $(input).val(newVal);
                        $(input).gdasWeekPicker($.extend({},defOptions, {defaultValue:newVal}));
                    }else if('month' === val){
                        //var defOptions = opts.defaultOptions.month;
                        var defOptions = $.extend({},opts.defaultOptions.month);//clone 一份，防止被下面修改 ljjn1246 20150910
                        if(defOptions.success == undefined){
                            defOptions.success = confirmCallBack;
                        }
                        if(newVal == null){
                            newVal = defOptions.defaultValue;
                        }
                        $(input).val(newVal);
                        $(input).gdasMonthPicker($.extend({},defOptions, {defaultValue:newVal}));
                    }
                    opts.callback(val, newVal);
                });
            });
            if(opts.defaultDateType){
                $('#btn_' + opts.defaultDateType + '_' + suffix).trigger('click');
            }else{
                $('#btn_' + opts.switchTypes[0] + '_' + suffix).trigger('click');
            }
            sleep(1);
        })
    }

    $.fn.gdasCombinedDatePicker.options = {
        defaultDateType : 'day',
        switchTypes: ['day', 'week', 'month'],
        callback: function(){},
        success: function(){}

    }

    function sleep(n) {
        var start = new Date().getTime();
        while (true) {
            if (new Date().getTime() - start > n) {
                break;
            }
        }
    };


})(jQuery, window, document);