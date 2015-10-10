;(function ($, window, document, undefined) {
    /**
     * @description GDAS SingleSelector 单选插件
     * @param {Object} 数据源
     * @param {Object} 插件选项
   
     * @author Zeyu Chen(gzchenzeyu@corp.netease.com)
     * @version  2013-01-15 第一版
     *           2013-01-16 通过select option 加载数据，不通过json从外部传递加载
     *           2013-01-17 通过添加sleep函数，确保生成SingleSelect的时间超过 1 mili second
     *           2013-01-22 添加对“更多”的按钮组的中的按钮进行搜索和过滤
     * @example 
     *   var opts = {
     *       isWrapped : true,
     *       wrapThreshold : 5,
     *       wrapButtonName : "更多",
     *       defaultSelect : 0,
     *       animateTime : 300,
     *       //button被选择后的回调函数，默认为空函数
     *       callback : function() {
     *       }
     *   };
     *  $("#selector").gdasSingleSelector(opts)
     */
    $.fn.gdasSingleSelector = function (options) {
        
        return this.each( function(index, element) {
            //扩展配置
            var opts = $.extend({}, $.fn.gdasSingleSelector.options, options);

            //通过时间和页面的第几个select标签下标生成唯一的后缀 
            var suffix = (new Date()).getTime() + "_" + index;
            
            if(element.id.length == 0) {
                element.id = "gdasSingleSelector_" + suffix;
            }
            //找出需要初始化defaultSelect
            var dataArray = new Array();
            $('#' + element.id).find('option').each(function (index, value) {
                var item = {'name': this.title, 'value' : this.value};
                if($(this)[0].selected == true) {
                    //将defaultSelect设置为被标记select="true"的下标
                    opts.defaultSelect = index; 
                }
                dataArray.push(item);
            });

            //封装member对象，简化私有函数的成员变量的传递
            member = {
                suffix : suffix,
                //需要生成gdasSingleSelector的select标签id
                selectId : element.id,
                //selectItem Data 数组
                selectItems : dataArray,
                //最外层div的id
                singleSelectorId : "singleSelector_" + suffix,
                //下拉列表的id
                singleSelectorDropdownListId : "singleSelectorDropdownListId_" + suffix,
                //弹出下拉菜单按钮的id
                singleSelectorOtherBtnId : "singleSelectorOtherBtn_" + suffix,
                //弹出下拉菜单的搜索输入框
                singleSelectorSearchBarId : "singleSelectorSearchBar_" + suffix,

                singleSelectorBtnContainerId : "singleSelectorBtnContainer_" + suffix,
                // ajax 搜索结果显示
                singleSelectorAjaxSearchResultContainerId : "singleSelectorAjaxSearchResultContainer_" + suffix,
                //下拉菜单的下拉三角形html代码
                downAngleHtml : '<span style="font-size: 12"> &nbsp; ▼</span>'
            };
            
            renderSigleSelectItem(member, opts);

            sleep(1);
        });
        //从select标签的option总获得需要渲染的数据，存放到array中
        //返回对象，以便可以链式操作
        //return $('#singleSelector_' + member.singleSelectorId);
    };


    /*
    *  Gdas SingleSelector 默认配置
    */
    $.fn.gdasSingleSelector.options = {
        //当selectItem大于某一个阈值时执行Wrap操作, 默认为5
        wrapThreshold : 5,
        //是否执行Wrap操作
        isWrapped : true,
        //Wrap操作后的按钮名称
        wrapButtonName : "其他",
        //搜索框中的placeholder
        searchPlaceholder: "搜索",
        //初始化时默认选择值, 默认为0，选择第一个
        isAjaxSearch: false,
        defaultSelect : 0,
        //其他菜单出现和隐藏的动画时间, 单位毫秒
        animateTime : 300,
        //提供对更多数据的搜索过滤功能, "false", "true", "auto" "auto" 表示自动根据更多数据的大小来自动启动
        searchBar : "auto",
        //当更多数据项超过该阈值时，自动启动搜索功能
        searchBarEnableThreshold : 8,
        //button被选择后的回调函数，默认为空函数
        callback : function() {
        }
    };   

    /*
    *  Gdas SingleSelector 主要渲染函数
    */
    function renderSigleSelectItem(member, opts) {
        
        var selectId = member.selectId;
        var singleSelectorId = member.singleSelectorId;
        var data = member.selectItems;
        var singleSelectorDropdownListId = member.singleSelectorDropdownListId;
        var singleSelectorOtherBtnId = member.singleSelectorOtherBtnId;
        var singleSelectorSearchBarId = member.singleSelectorSearchBarId;
        var singleSelectorBtnContainerId = member.singleSelectorBtnContainerId;
        var singleSelectorAjaxSearchResultContainerId = member.singleSelectorAjaxSearchResultContainerId;

        $("#" + selectId).hide();
        $("#" + selectId).after('<div id="' + singleSelectorId + '" class="singleSelectBtnGroup"></div>');
        
        var moreItemNum = data.length - opts.searchBarEnableThreshold;

        for(var i = 0; i < data.length; ++i ) {
            var buttonValue = data[i].value
            var buttonId = "singleSelectBtn_" + member.suffix + "_" + i;
            var buttonName = data[i].name;
            if(opts.isWrapped) {
                if(i < opts.wrapThreshold) {
                    $("#" + singleSelectorId).append('<button class="singleSelectBtn" id = "' + buttonId + '" value = "' + buttonValue + '""> ' + buttonName + '</button>');
                    
                    bindButtonAction(member, buttonId, buttonValue,  opts);
                }
                else {
                    break;
                }
            }
            else {
                $("#" + singleSelectorId).append('<button class="singleSelectBtn" id = "' + buttonId + '" value = "' + buttonValue + '""> ' + buttonName + '</button>');
                bindButtonAction(member, buttonId, buttonValue, opts);
            }
        }

        //渲染被隐藏到下拉菜单的选择按钮
        if(opts.isWrapped && data.length > opts.wrapThreshold) {
            $("#" + singleSelectorId).append('<button class="singleSelectBtn" id="' + singleSelectorOtherBtnId + '"><a>' + opts.wrapButtonName + '</a> ' + member.downAngleHtml + ' </button>');
            $('#' + singleSelectorOtherBtnId).bind('click', function() {
                //获取"其他"按钮的位置
                var pos = $("#" + singleSelectorOtherBtnId).position();
                var height = $("#" + singleSelectorOtherBtnId).outerHeight();
                $('#' + singleSelectorDropdownListId).css({
                    //通过绝对位置使得下拉浮层的位置始终在"其他"按钮的下面
                    position:"absolute",
                    left: pos.left-1 + "px"
                }).slideToggle(opts.animateTime);
                $(this).next().find(".singleSelectSearchBar").first().focus();//显示后，focus在搜索框
            })

            $("#" + singleSelectorId).append('<div class="singleSelectDropdown" id="' + singleSelectorDropdownListId + '"></div>');
            
            //根据配置和moreItemNum的数量，决定是否启用搜索栏
            if((opts.searchBar == "auto" && moreItemNum > opts.searchBarEnableThreshold) ||  
                opts.searchBar == "true") {
                enableSearchBar(member, opts);
            }
            //添加buttonContainer
            $("#" + singleSelectorDropdownListId).append('<div class="singleSelectBtnContainer" id = "' + singleSelectorBtnContainerId  + '"></div>');
            $("#" + singleSelectorDropdownListId).hide();

            for(var i = opts.wrapThreshold; i < data.length; ++i ) {
                var buttonValue = data[i].value
                var buttonId = "singleSelectBtn_" + member.suffix + "_" + i;
                var buttonName = data[i].name;
                $("#" + singleSelectorBtnContainerId).append('<button class="singleSelectBtn" id = "' + buttonId + '" value = "' + buttonValue + '""> ' + buttonName + '</button>');
                    
                bindWrappedButtonAction(member, buttonId, buttonName, buttonValue, opts);
            }
            
        	// 如果isAnasSearch=True，则添加ajax搜索结果的container
        	if (opts.isAjaxSearch) {
            	$("#" + singleSelectorDropdownListId).append('<div class="singleSelectAjaxSearchResultContainer" id = "' + singleSelectorAjaxSearchResultContainerId  + '"></div>');
            }

        }
       
        dealWithBackgroudClickHideDropdownList(member, opts);

        dealWithDefaultSelection(member, opts);
    }

    function enableSearchBar(member, opts) {

        var singleSelectorDropdownListId = member.singleSelectorDropdownListId;
        var singleSelectorSearchBarId = member.singleSelectorSearchBarId;
        $("#" + singleSelectorDropdownListId).append('<input class="singleSelectSearchBar" type="text" placeholder="'+opts.searchPlaceholder+'" id="' + singleSelectorSearchBarId + '" ><button class="singleSelectSearchBarBtn"></button>');
       
        //绑定onkeyup和onchange事件，触发过滤器 
        $("#" + singleSelectorSearchBarId).on('keyup',  function(e) {        	
            var keyword = $("#" + singleSelectorSearchBarId).val();
            if(keyword.length == 0) {
            	$("#" + member.singleSelectorBtnContainerId).show();
            	$("#" + member.singleSelectorAjaxSearchResultContainerId).hide();
                $('#' + member.singleSelectorDropdownListId).find('button').show();
                return;
            }
            if (opts.isAjaxSearch) { // 异步获取其他选项
            	$("#" + member.singleSelectorBtnContainerId).hide();
            	$("#" + member.singleSelectorAjaxSearchResultContainerId).empty();
            	$("#" + member.singleSelectorAjaxSearchResultContainerId).show();
            	ajaxSearchDataItem(member, opts, keyword);
            } else {
            	$("#" + member.singleSelectorAjaxSearchResultContainerId).hide();
            	$("#" + member.singleSelectorBtnContainerId).show();            	
                filterMoreDataItem(member, opts, keyword);	
            }

        });
    }
    
    // ajax搜索dim表
    function ajaxSearchDataItem(member, opts, keyword) {    	
    	var sql16 = $("#" + member.selectId).attr("data-sql"); // sql语句经过base16 encode
    	$.ajax({
    		url: contextPath + "/js/SingleSelector/ajaxSearch.jsp",
    		data: {'sql16':sql16, 'keyword': keyword},
    		async: false, // 必需的
    		success: function(arr) {    			
    			$.each(arr, function(i, obj) {
    				var buttonValue = obj.value;
                    var buttonId = "singleSelectBtn_" + member.suffix + "_ajax_" + i;
                    var buttonName = obj.name;
    				$("#" + member.singleSelectorAjaxSearchResultContainerId).append('<button class="singleSelectBtn" id = "' + buttonId + '" value = "' + buttonValue + '""> ' + buttonName + '</button>');
    				
    				bindWrappedButtonAction(member, buttonId, buttonName, buttonValue, opts);
    			});
    		},
    		error: function(a, b) {
    			console.log("ajaxSearchDataItem error", a, b);
    			$("#" + member.singleSelectorAjaxSearchResultContainerId).append("计算出错");
    		}
    	});
    }

    //根据关键字过滤更多的数据项
    function filterMoreDataItem(member, opts, keyword) {
    	//console.log("member, opts, keyword", member, opts, keyword);
//        if(keyword.length == 0) {            
//            $('#' + member.singleSelectorDropdownListId).find('button').show();
//        }
//        else {

            $('#' + member.singleSelectorDropdownListId).find('button').each(function(index, button) {
                var buttonText = $(this).text();
                if(buttonText.indexOf(keyword) >= 0) {
                    $(this).show();
                }
                else {
                    $(this).hide();
                }
            });
//        }
    }

    //处理初始化后，默认选中哪个按钮
    function dealWithDefaultSelection(member, opts) {
        $('#' + member.singleSelectorId + ' .singleSelectBtn').each(function(index, button) {
            var selectIndex = index;
            //如果默认选中是在wrapbutton中的
            if(opts.isWrapped && index > opts.wrapThreshold) {
                selectIndex --;
                if(selectIndex == opts.defaultSelect) {
                    //只是添加被选择的css,不做click操作,但需要把id set进select中
                    $('#' + member.selectId).attr("value", button.value);
                    $('#' + member.singleSelectorOtherBtnId).find('a').text($(this).text());
                    $('#' + member.singleSelectorOtherBtnId).addClass("selected");
                }
            }
            else {
                if(selectIndex == opts.defaultSelect) {
                    //只是添加被选择的css,不做click操作,但需要把id set进select中
                    $('#' + member.selectId).attr("value",  button.value);
                    $('#' + this.id).addClass("selected");
                }
            }
        });
    }
    //处理
    function dealWithBackgroudClickHideDropdownList(member, opts) {
        //对document绑定触发事件，隐藏下拉列表，通过closest来实现
        $(document).bind('click',  function(e) {
            //length == 0 说明点击位置与其他按钮不是从属关系，此时隐藏表单。
            if($(e.target).closest('#' + member.singleSelectorOtherBtnId).length == 0 && 
                //加上搜索框的过滤
                $(e.target).closest('#' + member.singleSelectorSearchBarId).length == 0) {
                $('#' + member.singleSelectorDropdownListId).slideUp(opts.animateTime);
            }
        });

    }

    //传入select的id和button的id, 绑定按钮事件：修改select的value值
    function bindButtonAction(member, buttonId, buttonValue,  opts) {
        $('#'+ buttonId).bind('click', function(){
            $('#' + member.selectId).attr("value", buttonValue);
            selectButton(member, buttonId); 
            //将"其他"按钮返回原状，并隐藏下拉列表
            var aHandler = $('#' + member.singleSelectorOtherBtnId);
            aHandler.html('<a>' + opts.wrapButtonName + '</a> ' + member.downAngleHtml );
            $('#' + member.singleSelectorDropdownListId).slideUp(opts.animateTime);
        });
        //绑定回调函数
       
        $('#'+ buttonId).bind('click', opts.callback);
    };

    //绑定下拉浮层下的按钮事件
    function bindWrappedButtonAction(member, buttonId, buttonName, buttonValue, opts) {
        $('#'+ buttonId).bind('click', function(){
        	if ($('#' + member.selectId).find('option[value="'+buttonValue+'"]').size() == 0) {
        		$('#' + member.selectId).append('<option value="'+buttonValue+'">'+buttonValue+'</option>');
        	}
            $('#' + member.selectId).attr("value", buttonValue);

            selectButton(member, member.singleSelectorOtherBtnId);
            //更改“其他”按钮的字样，并隐藏下拉列表
            var aHandler = $('#' + member.singleSelectorOtherBtnId);
            aHandler.html('<a>' + buttonName + '</a> ' + member.downAngleHtml );
            $('#' + member.singleSelectorDropdownListId).slideUp(opts.animateTime);
            
        });
        //绑定回调函数
        $('#'+ buttonId).bind('click', opts.callback);
    }

    //选中当前buttonId的按钮后的行为
    function selectButton(member, buttonId) {
        //去掉其他所有按钮的选中状态
        $('#' + member.singleSelectorId).find("button").removeClass("selected");
        //添加当前按钮的选中状态
        $('#' + buttonId).addClass("selected");
    }

    //伪sleep函数
    function sleep(n) { 
        var start = new Date().getTime(); 
        while(true)  {
            if(new Date().getTime() - start > n) {
                break; 
            }
        }
    }

})(jQuery, window, document);
