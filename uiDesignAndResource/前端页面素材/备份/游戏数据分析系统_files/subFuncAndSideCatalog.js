/**
 * Added by ljjn1246
 * Return an Object sorted by it's Key
 */
var sortObjectByKey = function(obj){
    var keys = [];
    var sorted_obj = {};

    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            keys.push(key);
        }
    }

    // sort keys
    keys.sort();

    // create new array based on Sorted Keys
    jQuery.each(keys, function(i, key){
        sorted_obj[key] = obj[key];
    });

    return sorted_obj;
};


/**
 *
 * Added by ljjn1246
 * Return an Object sorted by it's Key
 * 创建一个拼音对照的table，传入游戏列表和选中的游戏
 * */
function buildPinyinTable(gamelist, selectedGameName,selectedService){

    gamelist.sort(function(o1,o2){//拼音首字母排序
        var firstLetter1=firstPinyinLetter(o1);
        var firstLetter2=firstPinyinLetter(o2);
        if(firstLetter1 > firstLetter2){
            return -1 ;//小的排前面
        }
        else if(firstLetter1 == firstLetter2){//相等，二级排序
            return o1.localeCompare(o2);
        }
        return 1;
    });

    var pinyinMap={};//map, 拼音首字母-->游戏
    for(var i = 0;i< gamelist.length;i++){
        var firstLetter = firstPinyinLetter(gamelist[i]);
        if(!pinyinMap[firstLetter]) pinyinMap[firstLetter] = [];//还没有这个首字母的游戏，新建立一个
        pinyinMap[firstLetter].push(gamelist[i]);
    }

    //console.log(pinyinMap);
    var aHtml = [];

    if(gamelist.length>9){//如果有多余9个游戏，增加搜索功能
        aHtml.push('<div class="top-bar" >');
            aHtml.push('<span class="title" >游戏列表</span>');
            aHtml.push('<div class="game_search_bar">')
/*                aHtml.push('<span class="search-text" >&#xe600;</span>');*/
                aHtml.push('<input name="searchGameName" placeholder="输入游戏名搜索"/>');
            aHtml.push('</div>');
        aHtml.push('</div>');
        aHtml.push('<div id="no_results_found" style="display:none">搜索结果为空</div>');//没有结果时候的提示
    }

    aHtml.push('<table class="game_table" >');
    pinyinMap = sortObjectByKey(pinyinMap);
    for(var letter in pinyinMap){//循环所有已有的拼音
        aHtml.push('<tr>');
        aHtml.push('<td class="head">');
        aHtml.push(letter);
        aHtml.push('</td>');

        aHtml.push('<td class="games">');
        aHtml.push('<ul class="nav">');
        for(var j=0;j<pinyinMap[letter].length;j++){//循环这个拼音开头的所有游戏
            var g = pinyinMap[letter][j].split('(');
            var gameName = g[1].substr(0, g[1].length-1);
            var gameNameCN = g[0];
            aHtml.push('<li gameName ='+ gameName +' gameNameCN = "' + gameNameCN+'" +>');
            var isActive = gameName==selectedGameName? 'class="active"' :'';
            aHtml.push('<a href="/gdas/index.jsp?gameName='+gameName +  (selectedService ? '&fromService='+selectedService : '') + '"'   +isActive+' title="'+pinyinMap[letter][j]+'"   >'+pinyinMap[letter][j]+'</a>');
            aHtml.push('</li>');
        }
        aHtml.push('</ul>');
        aHtml.push('</td>');

        aHtml.push('</tr>');
    }
    aHtml.push('</table>');

    var html = aHtml.join('');
    $('.game_list_body').append(html);

    $('.game_list_body').off('click').on('click',function(e){
        e.stopPropagation();//防止触发document onclick
    })

    initSearchBar();
    return $('.game_list_body');

    /********************内部函数***********************/


    //拿手拼音首字母，大写,
    function firstPinyinLetter(displayName){
        gameNameCN = displayName.split('(')[0];
        switch (gameNameCN){//特殊处理多音字
            case '率土之滨'://
                return 'S';
            default ://不是特殊处理的多音字
                var pinyin = new JSPinyin();//js/pinyin/JSpinyin.js，支持全拼以及首字母
                var firstLetter = pinyin.getCamelChars(displayName.substr(0,1)).toUpperCase();
                return firstLetter;
        }
    }

    function getPinyinCammelLetter(displayName){
        gameNameCN = displayName.split('(')[0];
        switch (gameNameCN){//特殊处理多音字
            case '率土之滨'://
                return 'STZB';
            default ://不是特殊处理的多音字
                var pinyin = new JSPinyin();//js/pinyin/JSpinyin.js，支持全拼以及首字母
                var commel = pinyin.getCamelChars(displayName).toUpperCase();
                return commel;
        }
    }


    //初始化搜索的事件
    function initSearchBar(){
        $(".game_list_body .game_search_bar input").off('input').on('input',function(event) {
            var $searchBar = $(this);
            event.preventDefault();

            var val = $(this).val().toLocaleLowerCase().trim();
            if (val && val.length > 0) {
                $( ".game_list_body .game_table tr ul li" ).each( function ( index, element ) {//遍历table每行的li
                    var gameName = $(element).attr("gameName").toLocaleLowerCase();//游戏代号
                    var gameNameCN = $(element).attr("gameNameCN").toLocaleLowerCase();//游戏中文名
                    var gameNameShowName = $(element).text().toLocaleLowerCase();//游戏在列表的显示名
                    if ( ( gameName && gameName.indexOf(val) > -1 ) || ( gameNameCN && gameNameCN.indexOf(val) > -1 ) || ( gameNameShowName).indexOf(val) > -1 ) {
                        $(element).closest('tr').show();//确保该行显示
                        $(element).show();
                    } else {
                        $(element).hide();
                    }
                });
            } else { //显示全部
                $( ".game_list_body .game_table tr").show();//显示行
                $( ".game_list_body .game_table tr ul li").show();//显示游戏
            }

            //再把没有了游戏列表的那些行隐藏
            $( ".game_list_body .game_table tr" ).each( function ( index, element ) {//遍历table每行的tr
                var $tr = $(element);
                if($tr.find('td.games ul.nav li:visible').length==0){
                    $tr.hide();
                }
                else {
                    $tr.show();
                }
            });

            if($( ".game_list_body .game_table tr:visible").length==0){//所有行都隐藏了,显示no results found
                $('.game_list_body #no_results_found').show();
            }
            else{//隐藏没有搜索结果的提示
                $('.game_list_body #no_results_found').hide();
            }



        });
    }


}

/**
 * added byl ljjn1246
 * 初始化新版游戏列表，20150512，绑定gamebutton和document的click事件
 * @param gamelist
 * @param selectedGameName
 * @param selectedService 当前选中的模块name
 */
function initGameMenuTable(gamelist, selectedGameName , selectedService){
    var $handler = buildPinyinTable(gamelist, selectedGameName,selectedService);
    $('.game_button').on('click',function(e){
        e.stopPropagation();
        $("#sub_func_menu .game_button .triangle").html('&#xe616;');//下箭头
        $handler.slideDown(100);
        $('.game_search_bar input').val('').trigger('input').focus();//清空原来的搜索框，触发input事件，立刻获取搜索焦点

    });

    $(document).on('click',function(){
        $("#sub_func_menu .game_button .triangle").html('&#xe62b;');//右箭头
        $handler.hide();
    });
}




function addToSideCatalog( sideCatalogJson ){
	if ( !sideCatalogJson || !sideCatalogJson.length || sideCatalogJson.length === 0 ) {
		toggleSideCatalog();
		return false;
	}

	var ddTempArray = [];
	
	for ( var i = 0, m = sideCatalogJson.length; i < m; i++ ) {
		
		var sideCatalogItem1 = sideCatalogJson[i];
		
		ddTempArray.push($( '<dd class="sideCatalog-item1" id="sideToolbar-item-0-' + sideCatalogItem1.id + '">' + 
				'<span class="sideCatalog-index1">' + sideCatalogItem1.id + '</span>' +
				'<a href="#sideCatalog_' + sideCatalogItem1.id + '"" title="' + sideCatalogItem1.text + '" onclick="return false;">' + sideCatalogItem1.text + '</a>' +
				'<span class="sideCatalog-dot"></span>' +
			'</dd>' ));
		
		if ( !sideCatalogItem1 || !sideCatalogItem1.children || sideCatalogItem1.children.length === 0 ) {
			continue;
		}
		
		var children = sideCatalogItem1.children;
		
		for ( var j in children ){
			
			var sideCatalogItem2 = children[j];
			
			ddTempArray.push($( '<dd class="sideCatalog-item1" id="sideToolbar-item-0-' + sideCatalogItem1.id + '_' + sideCatalogItem2.id + '">' + 
					'<span class="sideCatalog-index1">' + sideCatalogItem1.id + ':' + sideCatalogItem2.id + '</span>' + 
					'<a href="#sideCatalog_' + sideCatalogItem1.id + '_' + sideCatalogItem2.id + '"" title="' + sideCatalogItem2.text + '" onclick="return false;">' + sideCatalogItem2.text + '</a>' +
					'<span class="sideCatalog-dot"></span>' +
				'</dd>' ));
			
		}
		
		children = null;
		
	}
	
	$( "#sideCatalog-catalog dl" ).html("").append( ddTempArray );
	
	$( document ).trigger("scroll");
	
	return true;
	
}

function setHighlight( ddElem ){

	$( "#sideCatalog-catalog dl dd" ).removeClass( "highlight" );
	$( "#sideCatalog-catalog dl dd:has(a[href='#" + ddElem.attr( "id" ) + "'])" ).addClass( "highlight" );

}

function toggleSideCatalog(){
	$( "#sideCatalog" ).toggle();
	$( "#sideCatalogBtn" ).toggleClass( "closed" );
}

function initSideCatalog(){
	
	$( "#sideToolbar-up" ).bind("click", (new gotoTopFac()).goto_top_handle());
	$( "#sideCatalogBtn" ).bind("click", toggleSideCatalog);
	
	$( "#sideCatalog-catalog dl dd" ).live("click", function(){
		var $dd = $( this ), $a, href;
		if ( ($a = $dd.find( "a" )) && (href = $a.attr("href")) && href.startWith("#") ){
			window.top.location.href = href;	
		}
	});
	
}

