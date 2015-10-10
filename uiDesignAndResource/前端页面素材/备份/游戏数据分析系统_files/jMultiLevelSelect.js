/**
 * jMultiLevelSelect 1.0.0
 * 
 * @author Chen ZhiYun
 * 
 * @version 2.0
 * 
 * 这是一个基于jQuery的自定义的层级多选过滤控件
 */

(function ($) {
	
	var jMultiLevelSelect = function() {
		//生成html
		var getMultiLevelSelectHTML = function(member) {
			var arr = [];
			//arr.push('<input class="multilevelselect_view withTriangle" readonly />');
			arr.push('<button class="ui-multiselect ui-widget ui-state-default ui-corner-all multilevelselect_view" aria-haspopup="true"><span class="ui-icon ui-icon-triangle-2-n-s"></span><span class="multilevelselect_view_span">请选择至少一项</span></button>');
			arr.push('<div class="multilevelselect_container hiddenClass" >');
			
				arr.push('<div class="multilevelselect_head">');
					arr.push('<input class="multilevelselect_search_input" placeholder="搜索" />');
					arr.push('<button class="blueShadeButton multilevelselect_search" >搜索</button>');
					arr.push('<button class="blueShadeButton multilevelselect_clear" >清除</button>');
						
					arr.push('<span class="multilevelselect_total_select">全选</span>');
					//arr.push('<span class="multilevelselect_revert_select">反选</span>');//去除反选功能, ljjn1246 20150817
					arr.push('<span class="multilevelselect_clear_select">清空</span>');
						
				arr.push('</div>');
				
				arr.push('<div class="multilevelselect_fixed_group"></div>');
				
				arr.push('<div class="multilevelselect_content" >');
				
					arr.push('<div class="multilevelselect_toplevel"></div>');							
					arr.push('<div class="multilevelselect_leaflevel_content">');
					arr.push('</div>');
				arr.push('</div>');
				
				arr.push('<div class="multilevelselect_foot">');
					arr.push('<span class="multilevelselect_tips"></span>');
					arr.push('<button class="blueShadeButton multilevelselect_close">确定</button>');
				arr.push('</div>');
			arr.push('</div>');
			return arr.join('');
		},
		//更新值val
		updateMultiSelectValue = function($e,member) {
			
			var split_delimiter = member.split_delimiter;
			var is_group_select = member.is_group_select;
			
			$e.parents(".multilevelselect_container").each(function(index, element) {
				
				var $tmp = $($(element).find(".multilevelselect_leaflevel_content span.multilevelselect_span_selected"));
				var vals = [];
				vals = $tmp.map(function(){return $(this).attr("value");}).get();
				
				console.info("vals",vals);
				var selected_element_size = $tmp.size();
				var text = "";
				if( selected_element_size>0 ) {
					var dataname = $tmp.attr("data-name");
					var datalevel = $tmp.attr("data-level");
					//允许中间组选择
					if ( is_group_select ) {
						$tmp_selected = $(element).find(".multilevelselect_toplevel .multilevelselect_menuItem span.multilevelselect_menuItem_selected");
						dataname = ( $tmp_selected.attr("data-name") && $tmp_selected.attr("data-name") !='全部' ) ? $tmp_selected.attr("data-name") + split_delimiter + $.trim( $tmp_selected.html() ) : $.trim( $tmp_selected.html() );
						dataname.indexOf("<a>") != -1 ? ( dataname = dataname.substr(0,dataname.indexOf("<a>") ) ) : "";
						dataname.indexOf("<A>") != -1 ? ( dataname = dataname.substr(0,dataname.indexOf("<A>") ) ) : "";
						datalevel = $tmp_selected.attr("data-level");
					}
					if( split_delimiter != ">>" )
					{
						dataname = dataname.split(split_delimiter).join(">>");
					}
					console.log("DEBUG dataname",dataname);
					if(selected_element_size == 1 )
					{
						text = (datalevel == 1) ? $tmp.text() : ( (dataname != "全部" && dataname != "") ? dataname+":" : "") + $tmp.text();
						
					}
					else
					{
						textsArray = $tmp.map(function(){return $(this).text();}).get();
						text = ( datalevel == 1) ? ( "("+selected_element_size+"):" + textsArray.join(",") ):
										( dataname+"("+selected_element_size+"):" + textsArray.join(",") );
					}
				}
//				var label = $(element).prev().prev().attr("data-label");
				$(element).prev() 
						.find(".multilevelselect_view_span").text( ( text.length > 0 ) ? text : "[空]");

//				console.info("$(element):html",$(element).prev().prev().html());
				$(element).prev().prev().val(vals);
				console.info("$(element)",$(element).prev().prev().val());
			});
		},

		//得到一个叶子结点所属的,目录的hander, added by ljjn1246
		getDirHandler =function($container,$leafItem,split_delimiter){
			var $targetDir = null
			$container.find('.multilevelselect_toplevel .multilevelselect_menuItem').each(function(i,dir){
				var $dir=$(dir).children('span');
				var textname = $dir.html().indexOf("<a>") != -1 ? $dir.html().substr(0,$dir.html().indexOf("<a>") ) : $.trim( $dir.html() );
				textname = textname.indexOf("<A>") != -1 ? textname.substr(0,$dir.html().indexOf("<A>") ) : $.trim( textname );
				var pathname = $dir.attr("data-name") == "" ? textname :$dir.attr("data-name") + split_delimiter + textname;

				if($leafItem.attr("data-name")==(pathname)) {//找到缩属于的目录，返回
						$targetDir =  $(dir);
						return false;//dir
					}
				});

			return $targetDir;
		},


		/****leaf node 全选、反选、清空*****/
		initMultiSelectSelect = function($container_handler,member) {
			/****叶子节点中的全选\反选\清空****/
			var $leafhandler = $container_handler.find(".multilevelselect_head");

			//全选事件，改为全局选中, ljjn1246 20150817
			$leafhandler.find(".multilevelselect_total_select").click( function(event) {
				//$(this).parents(".multilevelselect_container").find(".multilevelselect_leaflevel_content span:visible").addClass("multilevelselect_span_selected");//commented by ljjn1246, 这是旧的局部全选功能

				$(this).parents(".multilevelselect_container").find(".multilevelselect_leaflevel_content span").addClass("multilevelselect_span_selected");//选中所有
				$(this).parents(".multilevelselect_container").find(".menuitem_checkall").prop('checked','checked');//多选框选中

				var active_127 =  $(this).parents(".multilevelselect_container").find(".multilevelselect_leaflevel_content span[value=\\-127]");
                if(active_127.length == 1 ) {
                    active_127.removeClass("multilevelselect_span_selected");
                }

			});

			//去除反选功能, ljjn1246 at 20150817
/*			$leafhandler.find(".multilevelselect_revert_select").click(function(event){
				$(this).parents(".multilevelselect_container")
							.find("span.multilevelselect_span_selected:hidden")
								.removeClass("multilevelselect_span_selected");
				$(this).parents(".multilevelselect_container")
							.find(".multilevelselect_leaflevel_content span:visible")
										.map(function()
										{ 
											if($(this).hasClass("multilevelselect_span_selected"))
												$(this).removeClass("multilevelselect_span_selected");
											else
												$(this).addClass("multilevelselect_span_selected");
										});
//				updateMultiSelectValue($(this),member);
			});*/

			//全局清空, ljjn1246 at 20150817
			$leafhandler.find(".multilevelselect_clear_select").click(function(event){
				$(this).parents(".multilevelselect_container").find(".multilevelselect_leaflevel_content span.multilevelselect_span_selected")
								.removeClass("multilevelselect_span_selected");
				$(this).parents(".multilevelselect_container").find(".menuitem_checkall").removeProp('checked');//目录前面的checkbox清掉
			});
		},
		
		initMultiLevelSelectBtn = function($container_handler,member) {
			var leastHasOne = member.has_least_one;
			var split_delimiter = member.split_delimiter;
			var callback = member.callback;
			$container_handler.find(".multilevelselect_close").bind("click",function(event) {
				var $contain_handler = $(this).parent().parent();
				if ( leastHasOne ) {
					var $vals = $container_handler.find(".multilevelselect_leaflevel_content span.multilevelselect_span_selected");
					if($vals!=null && $vals.size()>0){
						$contain_handler.find(".multilevelselect_foot span.multilevelselect_tips").text('');
						$(".multilevelselect_container").hide();
						//提交数据
						updateMultiSelectValue($(this),member);
						//callback function
						callback();
					} else {
						$contain_handler.find(".multilevelselect_foot span.multilevelselect_tips").text('请至少选择一项');
					}
				} else {
					updateMultiSelectValue($(this),member);
					$contain_handler.find(".multilevelselect_foot span.multilevelselect_tips").text('');
					
					 $(".multilevelselect_container").hide();
					 //callback function
					 callback();
				}
				event.preventDefault();
			});
		},
		
		initTopLevelMenu = function ( $multilevelselect_container,$TopMenuObj,member ) {
			console.log('initTopLevelMenu');
			//初始化变量
			var split_delimiter = member.split_delimiter;
			var has_total_selected = member.has_total_selected;
			var default_padding_number = member.default_padding_num;
			//toplevel menu
			var levelNum=$TopMenuObj.length;
			//获取toplevel句柄
			$ToplevelHandler = $multilevelselect_container.find(".multilevelselect_content .multilevelselect_toplevel");
			
			var $curlevel = 1;
			var paddingNum = default_padding_number;
			var active_127 = member.active_127;
			var is_group_select = member.is_group_select;
			var is_number_visible = member.is_number_visible;
            // Modified by ccn1069: “全部”一级菜单只显示“全部”选项，其他选项隐藏。若没有-127，则不显示“全部”一级菜单
			if(has_total_selected == true && active_127)
			{
				//add the total select menuItem
				$total_handler = $('<div class="multilevelselect_menuItem" style="padding-left:'+paddingNum*($curlevel)+'px;"}><span value="-127" >全部<a></a></span></div>')
										.appendTo( $ToplevelHandler );
				$total_handler.find( "span" ).on( "click", function(event)  {
					//清除叶子节点所有选中项
					$multilevelselect_content = $(this).parents(".multilevelselect_content");
					$multilevelselect_content.find(".multilevelselect_leaflevel_content span.multilevelselect_span_selected")
													.removeClass("multilevelselect_span_selected");
					var span_127_handler = $multilevelselect_content.parent().find(".multilevelselect_leaflevel_content span[value='-127']");
					if ( active_127 || is_group_select) {
						span_127_handler.show();
						$multilevelselect_content.parent().find(".multilevelselect_leaflevel_content span[value!='-127']").hide();
					}
					span_127_handler.addClass('multilevelselect_span_selected');
					//切换菜单选中项
					$(this).parent().parent().find(".multilevelselect_menuItem span")
													.removeClass("multilevelselect_menuItem_selected");
					
					$(this).addClass("multilevelselect_menuItem_selected");
//					updateMultiSelectValue($(this),member);
//					if ( is_group_select ) {
//						$multilevelselect_content.parent().find(".multilevelselect_leaflevel_content span").show();
//					}
				} ).attr( {"data-name":"全部","data-level":"1"} );
			}
			for(var i in $TopMenuObj[$curlevel-1] )
			{
				$keyname = "";
				$valuename = $TopMenuObj[$curlevel-1][i];
				//封装参数
				var parameter_member = {
						$curlevel : $curlevel,
						$keyname  : $keyname,
						$valuename : $valuename,
						$TopMenuObj : $TopMenuObj,
						$ToplevelHandler : $ToplevelHandler,
						levelNum : levelNum,
						paddingNum : paddingNum,
						split_delimiter :split_delimiter,
						is_group_select : is_group_select,
						is_number_visible : is_number_visible,
						multiple: member.multiple//是否多选， ljjn1246 20150817
				};
				var menuSpanHandler = generateMenuItem (parameter_member);
				//递归生成子孩子
				if( $curlevel < levelNum ) {
					menuSpanHandler.addClass("multilevelselect_menuItem_span_has_child");
					
					for( var j=0 ; j < $TopMenuObj[$curlevel][i].length ; j++ ) {
						var parameter_member = {
								$curlevel : $curlevel+1,
								$keyname  : i,
								$valuename : $TopMenuObj[$curlevel][i][j],
								$TopMenuObj : $TopMenuObj,
								$ToplevelHandler : $ToplevelHandler,
								levelNum : levelNum,
								paddingNum : paddingNum,
								split_delimiter :split_delimiter,
								is_group_select : is_group_select,
								is_number_visible : is_number_visible,
								multiple: member.multiple//是否多选， ljjn1246 20150817
								
						};
						generateMenuHtml(parameter_member);
					}
				}
			}
//			初始化菜单
//			console.log("$ToplevelHandler.parent().prev().prev().val()",$ToplevelHandler.parents(".multilevelselect_container").prev().prev().val());
//			if( $ToplevelHandler.parents(".multilevelselect_container").prev().prev().val() == null ) {
//				var $curHandler = $ToplevelHandler.find(".multilevelselect_menuItem:eq(0)");
//				if( has_total_selected )
//					$curHandler = $ToplevelHandler.find(".multilevelselect_menuItem:eq(1)");
//				$curHandler.find("span").click();
//				for( var i=1 ;i < levelNum ; i++ ) {
//					
//					$curHandler=$curHandler.next();
//					$curHandler.find("span").click();
//					
//				}
//			}
		},
		
		show_group_spans = function( $this ,pathname ) {
			console.log('show_group_spans');

			//可以跨组选择
			$this.parents(".multilevelselect_toplevel")
				.find(".multilevelselect_menuItem span.multilevelselect_menuItem_selected")
					.removeClass("multilevelselect_menuItem_selected");
			$this.addClass("multilevelselect_menuItem_selected");
			var $multilevelselect_content = $this.parents(".multilevelselect_container").find(".multilevelselect_content");
			var selected_size = 0;
			$multilevelselect_content.find(".multilevelselect_leaflevel_content span")
				.map(function(){
					
					 var reg=$(this).attr("data-name");
					 
					 if( reg.length >= pathname.length )
					  {
						 if( reg.substr(0,pathname.length) == pathname ) {
							 $(this).show();
							 if( $(this).hasClass("multilevelselect_span_selected") ) {
								 selected_size = selected_size + 1;
							 }
						 }							 
						 else $(this).hide();
					  } else {
						  $(this).hide();
					  }
				});
			if ( is_number_visible ) {
				//显示选择的span的数量

				console.log("Debug select_size :",selected_size);
				if( selected_size > 0) {
					$this.find("a").text( "(" + selected_size + ")" );
				} else {
					$this.find("a").text("");
				}
			}
		},
		
		generateMenuItem  = function(parameter_member ) {
			console.log('generateMenuItem');


			var $curlevel = parameter_member.$curlevel,
				$keyname = parameter_member.$keyname,
				$valuename = parameter_member.$valuename,
				$TopMenuObj = parameter_member.$TopMenuObj,
				$ToplevelHandler = parameter_member.$ToplevelHandler,
				levelNum = parameter_member.levelNum,
				paddingNum = parameter_member.paddingNum,
				split_delimiter = parameter_member.split_delimiter,
				is_group_select = parameter_member.is_group_select,
				is_number_visible = parameter_member.is_number_visible,
				multiple = parameter_member.multiple;//是否多选


			var menuItemHandler;
			if(multiple){//多选，每个目录项追加一个checkbox
				menuItemHandler = $('<div class="multilevelselect_menuItem" style="padding-left:'+paddingNum*($curlevel)+'px;'+'">' +
										'<input type="checkbox" class="menuitem_checkall"/><span>'+$valuename+'<a></a></span>' +
								  '</div>').appendTo($ToplevelHandler);
			}
			else{//单选则没有checkbox
				menuItemHandler = $('<div class="multilevelselect_menuItem" style="padding-left:'+paddingNum*($curlevel)+'px;'
				+'"><span>'+$valuename+'<a></a></span></div>')
					.appendTo($ToplevelHandler);
			}

			var menuSpanHandler = menuItemHandler.find("span");
			var $checkAll = menuItemHandler.find(".menuitem_checkall");

			//checkbox 选中这个菜单下的所有选项
			$checkAll.off('change').on('change',function(e){
				var $dirItem = $(this).next('span');
				var textname = $dirItem.html().indexOf("<a>") != -1 ? $dirItem.html().substr(0,$dirItem.html().indexOf("<a>") ) : $.trim( $dirItem.html() );
				textname = textname.indexOf("<A>") != -1 ? textname.substr(0,$dirItem.html().indexOf("<A>") ) : $.trim( textname );
				var pathname = $dirItem.attr("data-name") == "" ? textname :$dirItem.attr("data-name") + split_delimiter + textname;


				var toCheckAll = $(this).is(":checked");//选择全部，还是清空全部

				$(this).parents(".multilevelselect_container")
					.find(".multilevelselect_content .multilevelselect_leaflevel_content span")
					.map(function() {
						if($(this).attr("data-name")==(pathname)) {//属于目录
							$(this).show();
							if (toCheckAll)$(this).addClass('multilevelselect_span_selected');//选中
							else $(this).removeClass('multilevelselect_span_selected');//目录下全部取消
						}
						else $(this).hide();//不是这个目录的隐藏
					});
			});

//			console.log("is_group_select :" ,is_group_select);

			//添加样式,事件
			menuSpanHandler.attr({"data-level":$curlevel,"data-name":$keyname,"title":$valuename})
			.on("click",function(event) {//选项span 点击事件
						event.stopPropagation();//防止冒泡

						var textname = $(this).html().indexOf("<a>") != -1 ? $(this).html().substr(0,$(this).html().indexOf("<a>") ) : $.trim( $(this).html() );
						textname = textname.indexOf("<A>") != -1 ? textname.substr(0,$(this).html().indexOf("<A>") ) : $.trim( textname );
						var pathname = $(this).attr("data-name") == "" ? textname : $(this).attr("data-name") + split_delimiter + textname;

						console.log("menuSpanHandler onClick: pathname : ",pathname);
						if( $(this).hasClass("multilevelselect_menuItem_span_has_child") )
						{//展开子节点
							//$(this).parents(".multilevelselect_toplevel").find(".multilevelselect_menuItem span[data-name='"+pathname+"']").parent().show();
							$(this).parents(".multilevelselect_toplevel")
								.find(".multilevelselect_menuItem span[data-name='"+pathname+"']")
								.map( function() {
									if( $(this).hasClass("multilevelselect_menuItem_span_selected_has_child") ) {
										
										$(this).removeClass("multilevelselect_menuItem_span_selected_has_child");
										$(this).addClass("multilevelselect_menuItem_span_has_child");
										$(this).click();
									}
									$(this).parent().show();
								});
							$(this).removeClass("multilevelselect_menuItem_span_has_child");
							$(this).addClass("multilevelselect_menuItem_span_selected_has_child");
							if( is_group_select ) {
								show_group_spans($(this) , pathname );
							}
						} else if( $(this).hasClass("multilevelselect_menuItem_span_selected_has_child") ) {
						//关闭子节点
						//$(this).parents(".multilevelselect_toplevel").find(".multilevelselect_menuItem span[data-name='"+pathname+"']").parent().hide();
							var Nodes = $(this).parents(".multilevelselect_toplevel")
													.find(".multilevelselect_menuItem span");
							
							if( Nodes.size()>0 ) {
									//console.log("close child pathname",pathname.replace("^","\^"));
									Nodes.map(function(){
										
										 var reg=$(this).attr("data-name");
										 
										 if( reg.length >= pathname.length )
										  {
											 if( reg.substr(0,pathname.length) == pathname )
												 $(this).parent().hide();
										  }
									
									});
							}
							$(this).addClass("multilevelselect_menuItem_span_has_child");
							$(this).removeClass("multilevelselect_menuItem_span_selected_has_child");
							
							if( is_group_select ) {
								show_group_spans($(this) , pathname );
							}
						} 
						else {//无子节点
							$(this).parent().parent()
											.find(".multilevelselect_menuItem span.multilevelselect_menuItem_selected")
												.removeClass("multilevelselect_menuItem_selected");
							$(this).addClass("multilevelselect_menuItem_selected");//选中目录
							//更新叶子节点面板
							//console.log("pathname",pathname);
							$(this).parents(".multilevelselect_container")
									.find(".multilevelselect_content .multilevelselect_leaflevel_content span")
										.map(function() {
											if($(this).attr("data-name")==(pathname)){//属于目录，显示
												$(this).show();
											}else
												$(this).hide();
										});
						}

				});

			menuItemHandler.closest('.multilevelselect_menuItem').off('click').on('click',function(e){
				$(this).children('span').trigger('click');//点击整个选项也触发选中事件
			});

			if($curlevel > 1) {
				menuSpanHandler.parent().hide();
			}
			
			return menuSpanHandler;
		},
		
		/****生成层级菜单****/
		generateMenuHtml = function( parameter_member ) {
			console.log('generateMenuHtml')
			var $curlevel = parameter_member.$curlevel,
			$keyname = parameter_member.$keyname,
			$valuename = parameter_member.$valuename,
			$TopMenuObj = parameter_member.$TopMenuObj,
			$ToplevelHandler = parameter_member.$ToplevelHandler,
			levelNum = parameter_member.levelNum,
			paddingNum = parameter_member.paddingNum,
			split_delimiter = parameter_member.split_delimiter ;
			is_group_select = parameter_member.is_group_select,
			is_number_visible = parameter_member.is_number_visible  ;
			
			menuSpanHandler = generateMenuItem(parameter_member );
			//递归生成子孩子
			if ($curlevel < levelNum) {
				menuSpanHandler
						.addClass("multilevelselect_menuItem_span_has_child");
				for ( var j = 0; j < $TopMenuObj[$curlevel][$keyname
						+ split_delimiter + $valuename].length; j++)
				{
					var sub_parameter_member = {
							$curlevel : $curlevel+1,
							$keyname  : $keyname + split_delimiter + $valuename,
							$valuename : $TopMenuObj[$curlevel][$keyname + split_delimiter + $valuename][j],
							$TopMenuObj : $TopMenuObj,
							$ToplevelHandler : $ToplevelHandler,
							levelNum : levelNum,
							paddingNum : paddingNum,
							split_delimiter :split_delimiter,
							is_group_select : is_group_select,
							is_number_visible : is_number_visible
							
					};
					generateMenuHtml(sub_parameter_member);
				}
			}
			

		},
		/***过滤其他组的选中项***/
		filter_other_group_selected = function ( $this , pathname ) {
			$this.parent()
			.find("span.multilevelselect_span_selected")
				.map(function () {
					 var reg=$(this).attr("data-name");

					 if( reg.length >= pathname.length )
					  {
						 if( reg.substr(0,pathname.length) != pathname )
							 $(this).removeClass("multilevelselect_span_selected");
					  } else {
						  $(this).removeClass("multilevelselect_span_selected");
					  };
				});
		},
		
		expandParentNode = function ( $ToplevelHandler,cur_pathname, member) {
			
			var split_delimiter = member.split_delimiter;
			var parents_pathname = cur_pathname.split(split_delimiter);
			$ToplevelHandler.find(".multilevelselect_menuItem span").each( function(index,element) {
//				console.log("$(this).text",parents_pathname[0],$(element).html());
				var textName = $(element).html().indexOf("<a>")!=-1 ? $(element).html().substr(0,$(element).html().indexOf("<a>")) : $(element).html();
				textName = textName.indexOf("<A>")!=-1 ? textName.substr(0,$(element).html().indexOf("<A>")) : textName;
				if( textName == parents_pathname[0] 
						&& ( $(element).hasClass("multilevelselect_menuItem_span_has_child")
						|| $(element).attr("data-level") == parents_pathname.length ) ) 
				{
//					console.log("$(this).text",parents_pathname[0],$(element).html());
					$(this).click();
				}
					
			});
			
//			$curHandler.find("span").click();
			$curPath = "";
			for(var i = 0;i < parents_pathname.length-1; i++) {
				
				$curPath = $curPath == "" ? parents_pathname[i] : $curPath+split_delimiter+parents_pathname[i];
//				console.log("$curPath",$curPath);
				$ToplevelHandler.find(".multilevelselect_menuItem span[data-name='"+$curPath+"']")
					.each( function( index,element ) {
//						console.log("$(this).text",$(element).attr("data-level")==parents_pathname.length);
						var textName = $(element).html().indexOf("<a>")!=-1 ? $(element).html().substr(0,$(element).html().indexOf("<a>")) : $(element).html();
						textName = textName.indexOf("<A>")!=-1 ? textName.substr(0,$(element).html().indexOf("<A>")) : textName;
						if(textName == parents_pathname[i+1] 
								&& ($(element).hasClass("multilevelselect_menuItem_span_has_child")
								||$(element).attr("data-level")==parents_pathname.length) )
						{
//							console.log("$(this).text",parents_pathname[i+1],$(element).html());
							$(this).click();
						}
					});
			}
		},
		
		/****初始化叶子节点***/
		initLeafLevelMenu = function( $handler,member ) {
			/*加载叶子节点菜单*/
			var split_delimiter = member.split_delimiter;
			var $levelNum = member.level_num;
			var multiple = member.multiple;
			var selected_list = [];
			var active_127 = member.active_127;
			var is_group_select = member.is_group_select;
			var is_number_visible = member.is_number_visible;
			
			$handler.find("option").each(function(index, element) { 
				
				var telementobj = $(element).attr("title") ? $(element).attr("title") : $(element).text();

				telement = telementobj.lastIndexOf(split_delimiter);
//				console.info(telement);
				var	dataname = (telement > 0) ? telementobj.substr(0,telement) : "";
				var	textelement= (telement > 0) ? telementobj.substr(telement+2) : telementobj;
				if(element.value == "-127")
				{
					dataname = "全部";
					textelement = "全部";
				}


				var span_handler =$("<span></span>").attr({ "value" : element.value,"data-name" : dataname,"data-level" : $levelNum,"title" : textelement } )
					.on("click", function(event) {

					if (multiple && $(this).hasClass("multilevelselect_span_selected") ) {//这次是多选的取消选中
						$(this).removeClass("multilevelselect_span_selected");
						var $dir = getDirHandler($(this).parents(".multilevelselect_container"),$(this),split_delimiter);
						console.log('uncheck, dir = ',$dir);
						$dir.find('.menuitem_checkall').removeProp('checked');//取消全选
					}
					else {
						if (! multiple) {
							$(this).parents(".multilevelselect_container")
								.find(".multilevelselect_leaflevel_content span")
									.removeClass("multilevelselect_span_selected");
						}


						else{//added by ljjn1246 多选，选中, 判断是否全部选中了,若是，则选中目录前面的checkbox
							$(this).addClass("multilevelselect_span_selected");
							var $dir = getDirHandler($(this).parents(".multilevelselect_container"),$(this),split_delimiter)
							if($dir) {// null
								var $dirSpan = $dir.children('span');//目录的文字
								var textname = $dirSpan.html().indexOf("<a>") != -1 ? $dirSpan.html().substr(0, $dirSpan.html().indexOf("<a>")) : $.trim($dirSpan.html());
								textname = textname.indexOf("<A>") != -1 ? textname.substr(0, $dirSpan.html().indexOf("<A>")) : $.trim(textname);
								var pathname = $dirSpan.attr("data-name") == "" ? textname : $dirSpan.attr("data-name") + split_delimiter + textname;

								if ($dirSpan.parents(".multilevelselect_container").find(".multilevelselect_content .multilevelselect_leaflevel_content span")
										.filter('[data-name=' + pathname + ']').not('.multilevelselect_span_selected').length === 0) {
									console.log('check all already');
									$dir.children('.menuitem_checkall').prop('checked', 'checked');
								}
							}

						}

						$(this).addClass("multilevelselect_span_selected");

						// 如果选中的不是全部选项，则uncheck全部选项
						if($(this).attr("value") != '-127' && active_127) {
							$(this).parents(".multilevelselect_container")
									.find(".multilevelselect_leaflevel_content span[value='-127']")
										.removeClass("multilevelselect_span_selected");
						}
                        // 如果选中的是全部选项，则uncheck其他非全部选项
						else if( $(this).attr("value") == '-127' && active_127) {
							$(this).parents(".multilevelselect_container")
								.find(".multilevelselect_leaflevel_content span[value!='-127']")
									.removeClass("multilevelselect_span_selected");
						}
						var datalevel = $(this).attr("data-level");
						if(datalevel > 1) {
							//check the same partition
//							console.log("$(this).attr('data-name')",$(this).attr("data-name"));
//							if( !is_group_select ) {
//								$(this).parent()
//												.find("span.multilevelselect_span_selected[data-name !='"+$(this).attr("data-name")+"']")
//													.removeClass("multilevelselect_span_selected");
//							}
							//可能需要展开父节点
							$ToplevelHandler = $(this).parents(".multilevelselect_container").find(".multilevelselect_toplevel");
							
//							console.log($ToplevelHandler.html());
							var cur_pathname = $(this).attr("data-name");
							
							var $MenuItemSelected = $ToplevelHandler.find(".multilevelselect_menuItem span.multilevelselect_menuItem_selected");
							
							var $MenuItemSelected_Pathname = "";
							if( $MenuItemSelected.size() > 0 ) {
								$MenuItemSelected_Pathname = $MenuItemSelected.attr("data-name") && $MenuItemSelected.attr("data-name") != '全部' ? 
																$MenuItemSelected.attr("data-name")+split_delimiter+$($MenuItemSelected).html()
																:
																$($MenuItemSelected).html();
								if ( $MenuItemSelected_Pathname.indexOf("<a>") != -1 ) {
									$MenuItemSelected_Pathname = $MenuItemSelected_Pathname.substr( 0,$MenuItemSelected_Pathname.indexOf("<a>") );
								}
								if ( $MenuItemSelected_Pathname.indexOf("<A>") != -1 ) {
									$MenuItemSelected_Pathname = $MenuItemSelected_Pathname.substr( 0,$MenuItemSelected_Pathname.indexOf("<A>") );
								}
							}
//							console.log("cur_pathname",cur_pathname,$MenuItemSelected_Pathname);
							if( is_group_select && $MenuItemSelected.attr("data-name") != '全部') {
									filter_other_group_selected($(this),$MenuItemSelected_Pathname);
							}
							if( cur_pathname != $MenuItemSelected_Pathname && !is_group_select ) {
								//需要展开父亲节点
								expandParentNode( $ToplevelHandler,cur_pathname,member);
							}
						}
					}
					//更新这个值
//					updateMultiSelectValue($(this),member);
					
			} )
			.text(textelement);
			//确保“全部”选项一定在全面
			if(element.value == "-127") {
				var firstspan = $handler.next().next().find(".multilevelselect_leaflevel_content span:eq(0)");
				
				if( firstspan.size() >=1 ) {
					firstspan.before(span_handler);
				} else {
					span_handler.appendTo($handler.next().next().find(".multilevelselect_leaflevel_content"));
				}
				
			}else {				
				span_handler.appendTo($handler.next().next().find(".multilevelselect_leaflevel_content"));
			}
			//根据单选或者多选调整样式
			if( multiple ) {
				span_handler.addClass("multiselect");
			 } else {
				span_handler.addClass("singleselect");
			}
			//加入默认选择列表中
			if (element.selected) {
				selected_list.push(span_handler);
			}
			//在多层时候，默認把全部選項永远隐藏
			if(element.value == "-127" && $levelNum > 1) {
				span_handler.hide();
			}
		});
		
			return selected_list;
		},
		
		/*获得搜索功能的比较函数*/
		getCompareFunction = function(search_val) {
			var search_func = null, ss = search_val.split(',');
			if (ss.length > 2) { // 多值匹配
				search_func = function(v) {
					for (var i = 0; i < ss.length; i++) {
						if (ss[i] != '' && v.indexOf(ss[i]) != -1) {
							return true;
						}
					}
					return false;
				};
			} else if (ss.length == 2) { // 区间匹配
				search_func = function(v) {
					if (typeof(BaseUtil.smartCompare) === 'function') {
						return (ss[0] == '' || BaseUtil.smartCompare(v, ss[0]) >= 0) && (ss[1] == '' || BaseUtil.smartCompare(v, ss[1]) <= 0);
					} 
					return v.localeCompare(ss[0]) >= 0 && v.localeCompare(ss[1]) <= 0;
				};						
			} else { // 字符串匹配
				search_func = function(v) {
					return v.indexOf(search_val) != -1;
				};
			}
			
			return search_func;
		};
		
		/****搜索事件****/
		initMultiLevelSelectSearch=function($container,member){
			// search button
			$container_handler=$container.find(".multilevelselect_head");
			$container_handler.find(".multilevelselect_search").click(function(event) {
				event.preventDefault();
				var search_val = $.trim($(this).parent().find(".multilevelselect_search_input").val());
				if (search_val.length > 0) {					
					var search_func = getCompareFunction(search_val);
					
					$(this).parents(".multilevelselect_container").find(".multilevelselect_leaflevel_content span")
						.each( function( index, element ) {							
							if (search_func($(element).html())){
								$(element).show();
							} else {
								$(element).hide();
							}
						});
				} else {
					$(this).parents(".multilevelselect_container").find(".multilevelselect_leaflevel_content span")
						.map(function() {
								$(this).show();
							});
				}
			});
			
			// search input
			$container_handler.find(".multilevelselect_search_input").keyup(function(event) {
				event.preventDefault();
				if ($(this).val().indexOf('，') != -1) {
					$(this).val($(this).val().replace(/，/,','));
				}				
				$(this).parent().find(".multilevelselect_search").click();
			});
			
		},
		
		/***绑定退出事件***/		
		binding2DocumentClick = function() {
			$( document ).click(function(e) {
				
				var $target = e && (e.target ) && $( (e.target) );
				var flag = $((e.relatedTarget || e.srcElement || e.target)).hasClass("multilevelselect_view") || ($target && $target.parents(".multilevelselect_view, .multilevelselect_container").size() > 0);
				
				if (! flag) {

					$(".multilevelselect_container").hide();

				}
			});
		},
		
		/***主要的控件渲染函数****/
		renderMultiLevelSelect = function($handler,LevelArray,member) {
			
			var multiple = member.multiple ;
			var has_total_selected = member.has_total_selected;
			console.log("has_total_selected",has_total_selected);
			var levelNum = member.level_num;
			//生成select框架代码
			$handler.after(getMultiLevelSelectHTML(member));
			var $container = $handler.next().next();
			if (!multiple) {//非多选，隐藏几个top bar选项
				$container.find(".multilevelselect_total_select").hide();
				//$container.find(".multilevelselect_revert_select").hide();
				$container.find(".multilevelselect_clear_select").hide();
			} else {
				//初始化叶子节点中的全选、清空事件
				initMultiSelectSelect($container,member);	
			}
			//关闭事件
			initMultiLevelSelectBtn($container,member);
			//搜索事件
			initMultiLevelSelectSearch($container,member);
			//关闭事件
			binding2DocumentClick();
			//初始化叶子节点，返回默认选择项		
//			console.info(JSON.stringify(LevelArray));
			var selected_list = initLeafLevelMenu($handler,member);
			//初始化层次菜单
			if( levelNum > 1) {				
				initTopLevelMenu($container,LevelArray,member);
			} else {
				//没有层级，隐藏层级菜单栏
				$container.find(".multilevelselect_toplevel").hide();
			}
			/*default the selected click*/
			if(selected_list.length>0) {
				$(selected_list).map(function(){$(this).click();});
			}
			else {
				if( has_total_selected == true ) {
					//有全部选择
					levelNum>1 ?
							$container.find(".multilevelselect_toplevel .multilevelselect_menuItem span[data-name='全部']").click() :
									$container.find(".multilevelselect_leaflevel_content span:eq(0)").click();	
				} else {
                    if(member.is_total_select){
                        //是否默认全部选中
                        $container.find(".multilevelselect_leaflevel_content span").each(function(){
                            $(this).trigger("click");//全选
                        });
                    }else {
                        //无全部选择,选第一个
                        $container.find(".multilevelselect_leaflevel_content span:eq(0)").click();
                    }

				}
			}
			
				//初始化
			updateMultiSelectValue($handler.next().next().find(".multilevelselect_leaflevel_content"),member);

			$handler.next().click(function(event) {
				$(".multilevelselect_container").hide();

				$(this).next().show().position({
					my: 'left top',
	             	at: 'left bottom',
	             	of: $(this)
				});

                $(this).next().find(".multilevelselect_search_input").focus();//Set focus on the search input box after showing the multilevel select box
				event.preventDefault();
			});
		},
		/* default options */
		defaultOptions = {
				//全选项是否生效
				active_127 : false,
				//至少需要选择一个
				has_least_one : true,
				//确定分隔符
				split_delimiter : "^^",
				//层级数量，用于限制无层级数据，默认为false;
				has_set_no_level : false,
				//层级菜单默认缩进
				default_padding_num : 10,
				//允许组选择
				is_group_select : false,
				//显示已选择数量
				is_number_visible : false,
                //默认是否全选
                is_total_select: false,
				//确定按钮的回调函数，默认为空
				callback : function(){
					
				}
		};
		
		return {									
			init : function(options) {
				var $handler = $(this);
				if (! $handler.hasClass("classInit")) {
					$handler.addClass("classInit");
					$handler.hide();
				}
				
				//扩展配置
	            var opts = $.extend({}, defaultOptions, options);
	            
				console.info(" Debug options",opts);
				
				//确定分隔符
				var split_delimiter = opts.split_delimiter;				
				//确定层级数量
				var	levelNum=$handler.find("option:eq(0)").text().split(split_delimiter).length;
				if(opts.has_set_no_level == true) {
					levelNum == 1;
					split_delimiter = split_delimiter + split_delimiter;
				} else {
					//确定最大层级及最小层级，解决层级不一致问题
					var minLevelNum = levelNum;
					var maxLevelNum = 0;
					$handler.find("option").each(function(index, element) {
						var textelementobj=$(element).attr("title");
						if ( !textelementobj) {
							textelementobj = $(element).text();
						}
						var textelement = textelementobj.split(split_delimiter);
						var level = textelement.length;
						if(level > maxLevelNum) {
							maxLevelNum = level;
						}
						if(level < minLevelNum) {
							minLevelNum = level;
						}
					});
					levelNum = levelNum != maxLevelNum ? maxLevelNum : levelNum;
				}
				
//				console.info("final levelNum",levelNum);
//				console.info("split_delimiter",split_delimiter);
				
				var label_name = $handler.attr("data-label");	
				var multiple = ! ($handler.attr("data-multiple") === "false");				
				//是否需要全部选项
				var has_total_select = false;

//				/**创建各级菜单**/			
				var LevelArray = [];
				for(var i=0;i<levelNum-1;i++)
				{
					LevelArray[i]={};
				}
				$handler.find("option").each( function(index, element) {
					if(element.value==='-127'){
						has_total_select = true;
						return;
					}
					var textelementobj=$(element).attr("title") ? $(element).attr("title") : $(element).text();
					var textelement = textelementobj.split(split_delimiter);
					if(textelement.length < levelNum) {
						var temps = [];
						for(var i=0;i<levelNum-textelement.length;i++) {
							temps.push("其他");
						}							
						for(var i=0;i<textelement.length;i++) {
							temps.push(textelement[i]);
						}
						textelement = temps;
						$(element).attr({"title":textelement.join(split_delimiter)});
					}
					/*分离各级节点菜单*/
					var strpath="";
					for(var i = 0;i< textelement.length-1; i++ ) {						
						if(i == 0) {
//							console.info(LevelArray[i][textelement[i]]);
							if(!(textelement[i] in LevelArray[i]) ) {
								LevelArray[i][textelement[i]]=textelement[i];
							}
							strpath=textelement[i];
						} else {
							if( ! (strpath in LevelArray[i]) ) {
								LevelArray[i][strpath]=[];
							}
							if($.inArray(textelement[i],LevelArray[i][strpath])==-1 ) {
								LevelArray[i][strpath].push(textelement[i]);
							}
							strpath=strpath+split_delimiter+textelement[i];
						}
					}
				});
				
				//参数获取结束，生成这个对象
				var member = {
					//是否有active-127
					active_127 : opts.active_127,
					//层数，无层级为1层
					level_num : levelNum,
					//分隔符
					split_delimiter : opts.split_delimiter,
					//控件名称
					label_name : label_name,
					//是否要至少选一个
					has_least_one : opts.has_least_one,
					//是否有全选项
					has_total_selected : has_total_select,
					//默认层级缩进数量
					default_padding_num : opts.default_padding_num,
					//是否允许多选
					multiple : multiple,
					//是否支持以组为单位选择
					is_group_select : opts.is_group_select,
					//是否选择数量可见
					is_number_visible : opts.is_number_visible,
                    //是否默认全选
                    is_total_select:opts.is_total_select,
					//回调函数
					callback : opts.callback
				};
				
				//render
				renderMultiLevelSelect($handler,LevelArray,member);
			}
			
		};
	}();  // jMultiLevelSelect					
	
	

	$.fn.extend({
 	 	jMultiLevelSelect: jMultiLevelSelect.init
  	});
})(jQuery);