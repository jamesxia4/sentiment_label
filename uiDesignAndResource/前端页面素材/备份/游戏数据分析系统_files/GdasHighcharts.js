/**
 * Created by ljjn1246 on 2015/8/4.
 */


/**
 *
 * http://www.highcharts.com/demo/sparkline
 * Create a constructor for sparklines that takes some sensible defaults and merges in the individual
 * chart options. This function is also available from the jQuery plugin as $(element).highcharts('SparkLine').
 */
Highcharts.SparkLine = function (options, callback) {
    var defaultOptions = {
        chart: {
            renderTo: (options.chart && options.chart.renderTo) || this,
            backgroundColor: null,
            borderWidth: 0,
            type: 'areaspline',
            margin: [2, 0, 2, 0],
            /*          width: 120,
             height: 20,*/
            style: {
                overflow: 'visible'
            },
            skipClone: true
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        xAxis: {
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            startOnTick: false,
            endOnTick: false,
            tickPositions: [],
            lineWidth:0
        },

        yAxis: {
            endOnTick: false,
            startOnTick: false,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            tickPositions: [0],
            gridLineColor: 'transparent'// y轴格仔线透明, 使得x轴线不存在
        },
        legend: {
            enabled: false
        },
        tooltip: {
            backgroundColor: null,
            borderWidth: 0,
            shadow: false,
            useHTML: true,
            hideDelay: 0,
            shared: true,
            padding: 0,
            positioner: function (w, h, point) {
                return { x: point.plotX - w / 2, y: point.plotY - h};
            }
        },
        plotOptions: {
            series: {
                animation: false,
                lineWidth: 3,
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 4
                    }
                },
                marker: {
                    radius: 2,
                    //lineWidth: 2,
                    states: {
                        hover: {
                            radius: 4,
                            lineWidthPlus: 2
                        }
                    }
                },
                fillOpacity: 0.25
            },
            column: {
                negativeColor: '#910000',
                borderColor: 'silver'
            }
        },
        exporting: {enabled: false}//禁止下载
    };
    options = Highcharts.merge(defaultOptions, options);
    return new Highcharts.Chart(options, callback);
};



GdasHicharts={
    isAllSeriesEmpty :function(series){
        if(series && series.length == 0) return true;//没有series
        var isEmpty = true;
        for(var i=0;i<series.length;i++){//有series,判断是否data的长度都有0
            isEmpty=this.isSeriesEmpty(series[i]);
            if(isEmpty==false) break;//有一条不是empty,即false
        }
        return isEmpty;
    },

    isSeriesEmpty:function(serie){
        var isEmpty = true;
        var data = serie['data'];
        if (data.length>0) {//有data
            for(var j=0;j<data.length;j++){//data非空且不等"[空]"
                if((data[j] || data[j]===0) && data[j]!=GDAS.EMPTY_RESULT_TEXT){//非空数据或0，且不是[空]
                    isEmpty=false;//一个数据非空，
                    break;
                }
            }
        }
        return isEmpty;
    },

    /**
     * highcharts x 轴配置
     * @param obj
     */
    generalXOptions :function(obj){
        var thisObj =this;
        var _step = parseInt((obj.series[0].data.length + 29) / 30);
        //var _step = 1;
        var _rotation = (obj.series[0].data.length > 5) ? -45 : 0;
        return {
            categories: obj.categories,
            gridLineColor: '#E9E9E9',//格子竖线颜色
            gridLineWidth: 1,
            lineColor: '#E9E9E9',// //X轴颜色
            tickWidth: 0,
            tickmarkPlacement: 'on',//仅适用于类别轴categories值时候，刻度线位于在类别名称的中心
            labels: {
                step: _step,//步长
                y:20,//垂直偏移
                staggerLines: 1,
                //align:'right',
                style: {
                    fontWeight:'normal',
                    fontSize: '10px',
                    fontFamily: '微软雅黑, Verdana, sans-serif'
                },
                formatter: thisObj.smartDateAxisFormatter

            }
        }
    },

    /**
     * 画图的那个
     * @param $handler handler, jquery 结点
     * @param obj {series:序列对象{name:, data:[]} , categories : []}   }
     * @param highchartOptions 需要重写的配置，格式于highcharts的配置一样
     * @param customSettings{
     *      sort: false 不对序列名进行排序, 默认使用smartCompare
     *      emptyText:"没有数据"
     *      displayLimit:{
     *          pointsLimit:undefined,//一个图最多显示多少点，多余的话使用左右翻页
                navigatorHeight:16,//箭头高度
     *      }
     *}
     * @returns {*}
     */
    render: function ($handler,obj,highchartOptions, customSettings){
        var defaultSettings ={//一些设置
            sort:function compare(obj1, obj2) {
                return -BaseUtil.smartCompare(obj1.name, obj2.name);//倒序
            },
            emptyText:(GDAS.isEnglishVersion?"No Data Found":"没有数据"),
            displayLimit:{//
                pointsLimit:undefined,
                navigatorHeight:16
            }
        };

        var settings = $.extend(true,{},defaultSettings,customSettings);//配置


        var thisObj = this;
        $handler.empty();

        //空数据
        if (this.isAllSeriesEmpty(obj.series)) {
            var emptyText = settings['emptyText'];
            var html = ['<div class="emptyMessage plotmsg">'];
            html.push("<span>"+emptyText+"</span>");
            html.push('</div>');
            $handler.html(html.join(''));
            return;
        }


        var dataObj = $.extend(true,{},obj);
        if(settings.sort!=false) {//排序
            obj.series.sort(settings.sort);
        }

        //hicharts 默认的options
        var defaultOptions = {
            credits: {
                enabled: false//去除右下角的水印
            },
            title: {
                text: "",
                style: {
                    margin: '10px 100px 0 0' // center it
                }
            },
            chart: {
                renderTo: "",
                zoomType: 'xy',
                type: "line",
                spacingTop: 40
            },
            xAxis: this.generalXOptions(dataObj),
            yAxis: {
                title: {
                    align: 'high',
                    rotation: 0,
                    offset: 0,
                    y: -17,//上移一点点,
                    text:""
                },
                min: 0,
                gridLineColor: '#E9E9E9',//格仔横线
                //max:opts.plotOption['yMax'],
                //allowDecimals: opts.allowDecimals, // 是否显示纵坐标小数刻度, default:false;
                // y轴倒序, default=false;
                labels: {
                    formatter:yAxisFormatter //默认的formatter
                }
            },
            legend:{
                verticalAlign: 'top',
                align: 'left',
                floating: true,
                y: -40,
                x: 60,
                borderWidth: 0,
                itemStyle: {
                    fontFamily: 'Arial,微软雅黑'
                }
            },
            plotOptions: {
                series: {
                    //showCheckbox: true,
                    marker: {
                        enabled: true,
                        fillColor: 'white',
                        lineColor: null,
                        lineWidth: 2,
                        symbol: 'circle',
                        states: {
                            hover: {
                                radius: 5,
                                lineWidthPlus: 2,
                                fillColor: "#FFFFFF"
                            }
                        }
                    },
                    animation: {duration: 1500}
                }
            },
            tooltip: commonTooltipOption(dataObj),
            exporting: {enabled: false},
            series: dataObj.series
        };

        var options = $.extend(true,defaultOptions,highchartOptions); //扩展配置
        console.log("[GdasHighchars]: extended option: ",options);
        if(settings.displayLimit.pointsLimit>0 && dataObj.categories.length>settings.displayLimit.pointsLimit){
            processLimitPointsChart($handler,dataObj,settings);
            $handler.find('.curr-plot-page').highcharts(options);
        }
        else {
            return $handler.highcharts(options);
        }
    },

    /**Added by ljjn1246
     * 返回一个x轴的Label，
     * 1. 如果发现是日期，则尽可能截断为只有yydd,除非月第一天或者第一列
     * 2. 如果是字符串，若太长,截断
     */
    smartDateAxisFormatter:function() {
        //console.log("smartDateAxisFormatter", this.value, typeof (this.value), this);
        var formatResult = this.value;
        if(typeof(this.value) =='number') {
            if (this.value >= 10000000 && this.value <= 99999999) {//数字&&范围符合日期
                var date = this.value;
                var year = Math.floor(date / 10000) + "";
                var md = paddingZero(date % 1000 + "", 4);
                if (this.isFirst || md == '0101')//x轴第一列 || 第一月第一天或者
                    formatResult= year + "/" + md;
                else formatResult= md;
            }
        }

        //普通字符串处理
        else if (typeof(this.value) == 'string') {
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

            formatResult = s;
        }
        return formatResult;

    },

    /**Added by ljjn1246, 20150922
     * 返回一个x轴的Label，
     *    如果发现是日期，则尽可能截断为只有dd,除非月第一天或者第一列,则yy/dd
     */
    simpleDateFormater:function() {
        var formatResult = this.value;

        if (this.value >= 10000000 && this.value <= 99999999) {//数字&&范围符合日期
            var date = this.value;
            var year = Math.floor(date / 10000) + "";//年
            var month = paddingZero(Math.floor((date%1000)/100)+"",2);//月
            var day = paddingZero(date%100+"",2);//最后两位日
            var md = paddingZero(date % 1000 + "", 4);//月年
            if (this.isFirst || md == '0101')//x轴第一点 || 第一月第一天或者
                formatResult= month + "/" + day;
            else formatResult= day;
        }

        return formatResult;
    },

    //小mini图
    sparkline : function($handler,obj,options,customSettings){

        var setting={
            emptyText:"没有数据"
        };

        $.extend(true,setting,customSettings);

        if (this.isAllSeriesEmpty(obj.series)) {
            var emptyText = setting['emptyText'];
            var html = ['<div class="emptyMessage plotmsg">'];
            html.push("<span>"+emptyText+"</span>");
            html.push('</div>');
            $handler.html(html.join(''));
            return;
        }


        var chartOptions = {
            series:obj.series,
            xAxis:{
                categories: obj.categories
            }
        };

        $.extend(true,chartOptions,options);
        $handler.highcharts('SparkLine',chartOptions);
    }

};


function processLimitPointsChart($handler,obj,setting){
    var categoriesShown = obj.categories;
    var seriesShown = obj.series;
    var $plotHandler = $handler;

    var pointsLimit = setting.displayLimit.pointsLimit;
    var navHeight = setting.displayLimit.navigatorHeight;

    //数据点过多，增加左右切换按钮
    if (obj.categories.length > pointsLimit) {
        var categoriesAll = $.merge([], obj.categories);
        var seriesAll = [];
        for (var i = 0; i < obj.series.length; i++) {
            seriesAll.push({data: $.merge([], obj.series[i].data)});
            seriesShown[i].data.splice(pointsLimit, obj.categories.length - pointsLimit);
        }
        categoriesShown.splice(pointsLimit, obj.categories.length - pointsLimit);
        $handler.attr('data-start', 0);
        $handler.attr('data-end', pointsLimit);

        $handler.append('<div class="prev-plot-page" onselectstart="return false;" style="height: ' + navHeight + 'px;"></div>');
        $handler.append('<div class="curr-plot-page"></div>');
        $handler.append('<div class="next-plot-page active" onselectstart="return false;" style="height: ' + navHeight + 'px;"></div>');
        $plotHandler = $handler.find('.curr-plot-page');
        var $prevHandler = $handler.find('.prev-plot-page');
        var $nextHandler = $handler.find('.next-plot-page');

        $prevHandler.off('click').on('click', function () {
            if ($(this).hasClass('active')) {
                $nextHandler.addClass('active');
                var startPoint = Number($handler.attr('data-start'));
                var endPoint = Number($handler.attr('data-end'));
                if (startPoint == 1) {
                    //这次点击之后窗口已经滑动到最左端，不可以再次滑动
                    $(this).removeClass('active');
                }
                var newStartPoint = startPoint - 1;
                var newEndPoint = endPoint - 1;
                $handler.attr('data-start', newStartPoint);
                $handler.attr('data-end', newEndPoint);

                var chart = $plotHandler.highcharts();
                for (var i = 0; i < seriesAll.length; i++) {
                    chart.series[i].data[pointsLimit - 1].remove(false);
                    chart.series[i].addPoint({x: newStartPoint, y: seriesAll[i].data[newStartPoint]}, false, false);
                }
                console.log(chart.xAxis[0].categories);
                chart.redraw();
            }
        });

        $nextHandler.off('click').on('click', function () {
            if ($(this).hasClass('active')) {
                $prevHandler.addClass('active');
                var startPoint = Number($handler.attr('data-start'));
                var endPoint = Number($handler.attr('data-end'));
                if (endPoint == categoriesAll.length - 1) {
                    //这次点击之后窗口已经滑动到最左端，不可以再次滑动
                    $(this).removeClass('active');
                }
                var newStartPoint = startPoint + 1;
                var newEndPoint = endPoint + 1;
                $handler.attr('data-start', newStartPoint);
                $handler.attr('data-end', newEndPoint);

                var chart = $plotHandler.highcharts();
                for (var i = 0; i < seriesAll.length; i++) {
                    chart.series[i].addPoint({x: endPoint, y: seriesAll[i].data[endPoint]}, false, true);
                }
                var newCategories = $.merge([], chart.xAxis[0].categories);
                newCategories.push(categoriesAll[endPoint]);
                chart.xAxis[0].setCategories(newCategories, false);
                chart.redraw();
            }
        });
    }
}




