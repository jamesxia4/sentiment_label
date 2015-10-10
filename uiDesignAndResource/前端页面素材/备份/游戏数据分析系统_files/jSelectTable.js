/**
 * Created by ljjn1246 on 15-6-15.
 * jQuery 插件，构建于把一个select结点建成一个可搜索的长表格
 */

(function($){


    //默认的一些配置, 构造时候覆盖
    var defaultOption={
        title:'items',//列表名字
        searchable:false,//是否支持搜索
        searchPlaceholder:'搜索',//搜索提示语
        defaultSelected: 0 ,//默认选择第几个
        columns: 4,        //一行多少列
        searchFilter: function(key,item){// 默认搜索匹配的函数，true则显示，false则不显示
            var target = item.text;//文本
            if (target.indexOf(key)>-1) return true;//全包含
            else return false;
        },

        //事件
        onSelected: function(seltectItem){//用户点击后的selected事件，selectedItem{value: "-127", text: "-127-全部"}
        }
    };


    /**
     * 公开方法API:
     * init: 初始化
     * item(index): 获取第index选项的对象
     * items: 获取所有选项对象
     * itemHandlers: 所有选项对应的jqeury对象的集合
     * hide  : 隐藏panel
     * show  : 显示panel
     * selected : 1.传入参数index, 设置第index个选中; 2没有传入参数，获取当前选中的item对象
     *
     */
    var methods={
        //初始化
        init:function(options){
            var $handler = this;
            var setting = $.extend({},defaultOption,options);//合并配置
            console.log('[jSelectTable][init]',setting);
            $handler.data('setting',setting);//保存setting数据
            _renderHTML.apply($handler);//渲染HTML
            $handler.jSelectTable('selected',setting['defaultSelected']);//默认选中
            return $handler.hide();//原select 隐藏
        },

        /**
         * 返回第index个选项
         * @param index
         * @returns {{value: *, text: (*|XMLList|jsPDF)}}
         */
        item:function(index){
            var $item = _getPanel.apply(this).find('.item:eq('+index+')');
            return {
               value:$item.attr('value'),
               text: $item.text()
            }
        },

        items:function(){//所有的items
            return _getPanel.apply(this).find('.item').each(function(i,e){
                return {
                    value:$(e).attr('value'),
                    text:$(e).text()
                };
            });
        },

        itemHandlers:function(){//所有的items
            return _getPanel.apply(this).find('.item');
        },

        //隐藏
        hide:function(){
            _getPanel.apply(this).hide();
        },

        //展开
        show:function(){
            _getPanel.apply(this).show().find('.searchBar input').focus();
        },

        //选中 getter/setter, 带参数则选中第index项，不带参数则返回选中的item对象
        selected:function(index){
            var $handler = this;
            var $selectBox = $handler.data('$selectBox');
            if(index==undefined || index ==null){//getter 获得选中的结点对象
                //console.log('getter',$selectBox);
                return {
                    value:$selectBox.attr('value'),
                    text:$selectBox.find('.seleted-item').text()
                }
            }

            else{//setter选中 第index个
               // console.log('setter', $selectBox,index);
                _getPanel.apply($handler).find('.item').each(function(i,e){
                    if(i==index){
                        $(this).parents('.item-list').find('.item').removeClass('current');//移出选中样式
                        $(this).addClass('current');
                        $selectBox.attr('value',$(this).attr('value'));
                        $selectBox.find('.seleted-item').text($(this).text());
                        $handler.val($selectBox.attr('value'));//设置原select的值
                        return false;
                    }
                });
                return $handler;//返回自身
            }
        }

    };


    //插件入口
    $.fn.jSelectTable=function(option){
        var $handler = this;
        if(methods[option]){//传递的参数存在于public method中，调用的是API
            var methodName = option;
            return methods[methodName].apply(this,Array.prototype.slice.call(arguments,1)); //方法调用
        }

        else if(typeof option==='object'|| !option){//传入了配置对象或者空对象,初始化
            return methods['init'].apply(this,arguments);//调用init方法
        }

        else{//不是API，也不是传入一个配置对象
            $.error('Method'+option+'does not exist on jQuery jSelectTable');
        }

    }


    /*START:  私有方法*/

    /**
     * 渲染HTML, this需要绑定到原handler
     * @private
     */
    var _renderHTML =function(){
        var $handler = this;
        var setting = $handler.data('setting');

        var $selectBox = $('<div class="jSelectTable selectbox ">').append($('<span class="seleted-item">'))
                                                        .append('<span class="triangle_span">');


        var $itemPanel = $('<div class="jSelectTable item-panel">')
            .append($('<div class="top-bar">').append($('<span class="title">').text(setting.title))
                                             .append($('<div class="searchBar">').append($('<input>').attr('placeholder',setting['searchPlaceholder'])))
            );

        var $selectOptions = this.find('option');//原select的option
        console.log('[render]',$selectOptions);

        var $itemLists =$('<div class="item-list">').appendTo($itemPanel);

        var columnsCnt =setting['columns'];//默认一行四列,有可能被复写
        var linesCnt= parseInt($selectOptions.length/columnsCnt,10)+1;
        var $line = null;
        $selectOptions.each(function(i,e){
            var $option = $(e);
            if((i+1)%(columnsCnt)===1){//新一行
                $line= $('<div class="row">').appendTo($itemLists);//新一行记录，插入
            }
            $line.append($('<span class="item">').text($option.text()).attr('value',$option.val()).attr('title',$option.text()).attr('index',i));
        });

        $handler.nextAll('.jSelectTable').remove();//删掉原来的
        $handler.after($selectBox.append($itemPanel));//新render

        $handler.data('$itemPanel',$itemPanel);
        $handler.data('$selectBox',$selectBox);

        bindEvent();

        function bindEvent(){
            $itemPanel.find('.item').off('click').on('click',function(e){//item点击事件
                e.stopPropagation();
                $handler.jSelectTable('selected',parseInt($(this).attr('index'),10));//调用API
                if(setting['onSelected']){
                    $handler.each(function(i,e){
                        var selectedItem = $handler.jSelectTable('selected')
                        setting['onSelected'].call(this,selectedItem);//,触发onSelected事件this是原select的dom 结点
                    });

                };
                $itemPanel.hide();//立刻隐藏面板
            });

            $itemPanel.find('.searchBar input').off('keyup').on('keyup',function(event) {//搜索, ie9 不支持input事件中捕获backspace(https://developer.mozilla.org/en-US/docs/Web/Events/input)，故使用keyup事件，keyup事件不支持鼠标复制粘贴改变内容,
                //event.preventDefault();
                var key = $(this).val().toLocaleLowerCase().trim();
                var filter=$handler.data('setting')['searchFilter'];
                $handler.jSelectTable('itemHandlers').each(function(i,e){
                    var item = $handler.jSelectTable('item',i);//获取第i个的item对象
                    if(filter(key,item)) $(e).show();
                    else $(e).hide();
                });
            });

            $selectBox.off('click').on('click',function(e){
                e.stopPropagation();
                $handler.jSelectTable('show');
            });



            $(document).off('click.jSelectTable').on('click.jSelectTable',function(e){
                $itemPanel.hide();//隐藏面板
            })

        };
    };

    /**
     * 获取插件创造的panel结点的jquery对象
     * @returns {*}
     * @private
     */
    var _getPanel=function(){
        return this.data('$itemPanel');
    };

    /*END :  私有方法*/

})(jQuery);