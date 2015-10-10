/**
 * 运营分析模块菜单
 * Created by gzhuangzhankun on 2015/3/25.
 */
/******************************************************************************************************************/
/*menu new*/
function opMenuModule($handler, jsonArray, storeUpArray) {
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
opMenuModule.matchKeyAndPinyin =function(key,target){
    key =key.trim();
    if (target.indexOf(key)>-1) return true;//全包含

    //下面判断拼音
    var pinyin = new JSPinyin();//js/pinyin/JSpinyin.js，支持全拼以及首字母
    var camel=pinyin.getCamelChars(target).toLowerCase();
    var pinyinChar=pinyin.getFullChars(target).toLowerCase();
    return camel.indexOf(key.toLowerCase())>-1 || pinyinChar.indexOf(key.toLowerCase())>-1;
}


opMenuModule.prototype.Init = function() {
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

opMenuModule.prototype.IsStoreUp = function(subjectObj) {
    return subjectObj.text == '我的收藏';
};

opMenuModule.prototype.RenderHTML = function() {
    // 区分是否是数据应用模块的菜单
    if(this.isComment){
        this.$handler.append("<div class='searchBar'><input name='searchreport' placeholder='输入游戏名进行搜索'></div>");
    }else{
        this.$handler.append("<div class='searchBar'><input name='searchreport' placeholder='搜索'></div>");
    }
    this.$handler.append('<div class="subjectDividerDiv" id="storeSubject"></div>');
    this.$handler.append('<div class="menuDivider"></div>');
    this.$handler.append('<div class="subjectDividerDiv" id="commonSubject"></div>');
    this.$handler.append('<div class="menuDivider"></div>');
    this.$handler.append('<div class="subjectDividerDiv" id="customSubject"></div>');
    if(this.isComment){
        this.RenderCommentMenuHTML();
    }else{
        this.RenderMenuHTML();
    }
    if($('#storeSubject').find('span').size() == 0){
        $('#storeSubject').next(".menuDivider").hide();
    }
    if($('#commonSubject').find('span').size() == 0){
        $('#commonSubject').next(".menuDivider").hide();
        if($('#customSubject').find('span').size() == 0){
            $('#commonSubject').prev(".menuDivider").hide();
        }
    }
    if($('#customSubject').find('span').size() == 0){
        $('#customSubject').prev(".menuDivider").hide();
    }

};


opMenuModule.prototype.RenderMenuHTML = function() {
    var thisObj = this;
    $.each(this.jsonArray, function(i, e) {
        var is_storeup = thisObj.IsStoreUp(e);
        var is_custom_subject = (Math.floor(Number(e.subject_index) / 100) == 1);
        if (e.children.length == 1 && ! is_storeup) { //单个页面的主题
            var html = thisObj.RenderMenuItemsHTML(e.children);
            if(is_custom_subject){
                $("#customSubject").append(html);
            }else{
                $('#commonSubject').append(html);
            }
        } else {//包含多个页面的主题
            var html = [];
            html.push('<div onselectstart="return false" class="menuSubject menuClose '+(is_storeup ? "menuStoreUp" : "")+'" data-subjectid="'+e.id+'">');
            //html.push('<span class="bullet"></span>');
            html.push('<span class="switch"></span>');
            html.push('<span class="title" title="'+e.text+'">'+e.text+'</span>');

            html.push('</div>');
            html.push('<div class="menuList menuClose '+(is_storeup ? "menuStoreUp" : "")+'">');
            html.push(thisObj.RenderMenuItemsHTML(e.children));
            html.push('</div>');

            if(is_storeup){
                $('#storeSubject').append(html.join(''));
            }else if(is_custom_subject){
                $('#customSubject').append(html.join(''));
            }else{
                $('#commonSubject').append(html.join(''));
            }
        }

    });

};

/**
 * 数据应用部分菜单: 显示有权限的subject, 隐藏没有权限的subject, 便于进行检索.
 * Add by Rao Junyang @ 2014-09-03
 */
opMenuModule.prototype.RenderCommentMenuHTML = function() {
    var thisObj = this;
    $.each(this.jsonArray, function(i, e) {
        // 只显示有权限的
        if(e.flag == 1){
            var is_storeup = thisObj.IsStoreUp(e);
            var is_custom_subject = (Math.floor(Number(e.subject_index) / 100) == 1);
            if (e.children.length == 1 && ! is_storeup) {
                var html = thisObj.RenderMenuItemsHTML(e.children);
                if(is_custom_subject){
                    $("#customSubject").append(html);
                }else{
                    $('#commonSubject').append(html);
                }
            } else {
                var html= [];
                html.push('<div onselectstart="return false" class="menuSubject menuClose '+(is_storeup ? "menuStoreUp" : "")+'" data-subjectid="'+e.id+'">');
                //html.push('<span class="bullet"></span>');
                html.push('<span class="switch"></span>');
                html.push('<span class="title" title="'+e.text+'" games="' + e.games + '" flag="' + e.flag + '">'+e.text+'</span>');

                html.push('</div>');
                html.push('<div class="menuList menuClose '+(is_storeup ? "menuStoreUp" : "")+'">');
                html.push(thisObj.RenderMenuItemsHTML(e.children));
                html.push('</div>');

                if(is_storeup){
                    $('#storeSubject').append(html.join(''));
                }else if(is_custom_subject){
                    $('#customSubject').append(html.join(''));
                }else{
                    $('#commonSubject').append(html.join(''));
                }
            }
        }
        else{
            var html = [];
            html.push('<div onselectstart="return false" class="menuSubject" data-subjectid="'+e.id+'" style="display:none">');
            //html.push('<span class="bullet"></span>');
            html.push('<span class="switch"></span>');
            html.push('<span class="title" title="'+e.text+'" games="' + e.games + '" flag="' + e.flag + '">'+e.text+'</span>');

            html.push('</div>');
            if(is_storeup){
                $('#storeSubject').append(html.join(''));
            }else if(is_custom_subject){
                $('#customSubject').append(html.join(''));
            }else{
                $('#commonSubject').append(html.join(''));
            }
        }

    });
};

opMenuModule.prototype.RenderMenuItemsHTML = function(itemArray) {
    var html = [];
    $.each(itemArray, function(i, e) {
        if(!e['parentPageId']){
            html.push('<div onselectstart="return false" class="menuItem" data-fieldid="'+e.id+'">');
            //html.push('<span class="bullet"></span>');
            html.push('<span class="switch"></span>');
            html.push('<span class="title" title="'+e.text+'" >'+'<a href=\''+e.href+'\' target="_top">'+e.text+(this['isNew'] ==='true'? '<span class="newMarker">&#xe60e;</span>':'')+'</a></span>');

            html.push('</div>');
        }
    });

    return html.join('');
};



opMenuModule.prototype.BindingSearchBarEvent = function() {
    var $searchResult, $curren_span;

    $("#subject_field_menu .searchBar input" ).focus(function() {
        if (! $(this).next().hasClass("searchResult" )) {
            $( this).after("<div class='searchResult'></div>");
        }
        $tmp = $( this).next();
        if ($tmp.find("span" ).size() == 0) {
            $tmp.html( "<p>请输入关键词</p>" );
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
                $handler.html( "<p>搜索结果为空</p>" );

                if (val && val.length > 0) {
                    var cnt = 0;
                    $( ".menuItem span.title").each(function(index, element) {
                        var fieldnamecn = $(element).attr("title");
                        if (cnt < 10 && fieldnamecn && opMenuModule.matchKeyAndPinyin(val,fieldnamecn)) {
                            if (cnt == 0) {
                                $handler.html( "<p>搜索结果：</p>" );
                            } else if (cnt == 9) {
                                $handler.find( "p").html("搜索结果前10条：" );
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
opMenuModule.prototype.BindingCommentSearchBarEvent = function() {
    var $searchResult, $curren_span;

    $(".searchBar input" ).focus(function() {
        if (! $(this).next().hasClass("searchResult" )) {
            $( this).after("<div class='searchResult'></div>");
        }
        $tmp = $( this).next();
        if ($tmp.find("span" ).size() == 0) {
            $tmp.html( "<p>请输入关键词</p>" );
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
            $handler.html( "<p>搜索结果为空</p>" );

            if (val && val.length > 0) {
                var cnt = 0;
                // 检索一级目录
                $(".menuSubject span.title").each(function(index, element) {
                    var fieldnamecn = $(element).attr("title") + " " + $(element).attr("games");


                    if (cnt < 10 && fieldnamecn && opMenuModule.matchKeyAndPinyin(val,fieldnamecn)) {
                        if (cnt == 0) {
                            $handler.html( "<p>搜索结果(红色为无权限)：</p>" );
                        } else if (cnt == 9) {
                            $handler.find( "p").html("搜索结果前10条(红色为无权限)：" );
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

opMenuModule.prototype.BindingEvent = function() {
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

    $('.menuItem span.title').off('click').on('click',function(){
        window.location=$(this).children('a').attr('href');
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

opMenuModule.prototype.SetSelected = function(id) {
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

opMenuModule.prototype.AppendGameVersion = function(version_string, gameName) {
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