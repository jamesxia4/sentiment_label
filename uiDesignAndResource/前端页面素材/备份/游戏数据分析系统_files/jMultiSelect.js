/**
 * jMultiSelect 1.0.0
 *
 * Yang Wenfeng
 *
 * 这是一个基于jQuery的自定义的多选过滤控件
 *
 * 2014.12.08修改，删除已选择区，清空/反选/全选只针对搜索后的结果取作用，支持shift选择与区间过滤
 *
 * 修改记录：
 * 2015.01.12   ccn1069 如果存在-127（全部）选项，该选项与其他选项为互斥关系，清空时选中-127选项，全选时不选中-127选项
 */

(function ($) {
	var jMultiSelect = function() {
		var getMultiSelectHTML = function(label) {
			var arr = [];
			//arr.push('<input class="multiselect_view withTriangle" readonly />');
			arr.push('<button class="ui-multiselect ui-widget ui-state-default ui-corner-all multiselect_view" aria-haspopup="true"><span class="ui-icon ui-icon-triangle-2-n-s"></span><span class="multiselect_view_span">请选择至少一项</span></button>');
			arr.push('<div class="multiselect_container" style="display:none;">');
				arr.push('<div class="multiselect_head">');
					arr.push('<input class="multiselect_search_input" placeholder="搜索" />');
					arr.push('<button class="blueShadeButton multiselect_search" >搜索</button>');
					arr.push('<button class="blueShadeButton multiselect_clear" >清除</button>');

					//arr.push('<div class="multiselect_panel_ctrl" >');
						arr.push('<span class="multiselect_total_select">全选</span>');
						arr.push('<span class="multiselect_invert_select">反选</span>');
						arr.push('<span class="multiselect_clear_select">清空</span>');
					//arr.push('</div>');
				arr.push('</div>');
				arr.push('<div class="multiselect_fixed_group"></div>');
				arr.push('<div class="multiselect_content" >');
//					arr.push('<div class="multiselect_panel_selected"><label>已选</label></div>');
//					arr.push('<div class="multiselect_div_selected"></div>');
					arr.push('<div class="multiselect_panel_total"><label>所有'+label+'</label></div>');
					arr.push('<div class="multiselect_div_total"></div>');
				arr.push('</div>');
				arr.push('<div class="multiselect_foot">');
					arr.push('<button class="blueShadeButton multiselect_close">确定</button>');
				arr.push('</div>');
			arr.push('</div>');

			return arr.join('');
		},

		updateMultiSelectValue = function($e) {
			$e.parents(".multiselect_container").each(function(index, element) {
				var $tmp = $($(element).find(".multiselect_div_total span.multiselect_span_selected"));
				var vals = $tmp.map(function(){return $(this).attr("value");}).get();
				var text = $tmp.map(function(){
					var tmp = $(this).html();
					if (tmp) {
						tmp = tmp.replace(/^-/,"");
						tmp = tmp.substring(tmp.indexOf("-") + 1);
					} else {
						tmp = this.value;
					}
					return tmp;
				}).get().join(",");

				var label = $(element).prev().prev().attr("data-label");
				if (text.length > 0) {
					$(element).prev().find(".multiselect_view_span").text(label + "：" + text);
				} else {
					$(element).prev().find(".multiselect_view_span").text(label + "：全部");
				}

				$(element).prev().prev().val(vals);
			});
		},

		initMultiSelectSelect = function($container_handler) {
			// total select
			$container_handler.find(".multiselect_total_select").click(function() {
				$(this).parents(".multiselect_container").find(".multiselect_div_total span:visible").addClass("multiselect_span_selected");
                var active_127 =  $(this).parents(".multiselect_container").find(".multiselect_div_total span:visible[value=\\-127]");
                if(active_127.length === 1) {
                    active_127.removeClass("multiselect_span_selected");
                }
				updateMultiSelectValue($(this));
			});

			// invert select
			$container_handler.find(".multiselect_invert_select").click(function() {

				$(this).parents(".multiselect_container").find(".multiselect_div_total span:visible").each(function(index, element) {
					if ($(element).hasClass("multiselect_span_selected")) {
						$(element).removeClass("multiselect_span_selected");
					} else {
						$(element).addClass("multiselect_span_selected");
					}
				});
				updateMultiSelectValue($(this));
			});

			// clear select
			$container_handler.find(".multiselect_clear_select").click(function() {
				var thisObj = $container_handler.find(".multiselect_clear_select");
				thisObj.parents(".multiselect_container").find(".multiselect_div_total span:visible").removeClass("multiselect_span_selected");
                var active_127 = thisObj.parents(".multiselect_container").find(".multiselect_div_total span:visible[value=\\-127]");
                if(active_127.length === 1) {
                    active_127.addClass("multiselect_span_selected");
                }
				updateMultiSelectValue(thisObj);
			});
		},

		initMultiSelectBtn = function($container_handler) {
			$container_handler.find(".multiselect_close").click(function(event) {
				$(".multiselect_container").hide();
				event.preventDefault();
			});
		},

		updateMultiSelectPanelTotal = function($container_handler) {
			var search_val = $container_handler.find(".multiselect_search_input").val(),
				label = $container_handler.prev().prev().attr("data-label"),
				//multiple = ! ($container_handler.prev().prev().attr("data-multiple") === "false"),
				s = "";

			if ($.trim(search_val).length > 0) {
				s = label+"搜索结果：";
			} else {
				s = "所有" + label;
			}
			$container_handler.find(".multiselect_panel_total label").html(s);
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

		initMultiSelectSearch = function($container_handler) {
			// search button
			$container_handler.find(".multiselect_search").click(function(event) {
				event.preventDefault();
				var search_val = $.trim($(this).parent().find(".multiselect_search_input").val());;
				//console.log("search_val", search_val);
				if (search_val.length > 0) {
					var search_func = getCompareFunction(search_val);

					$(this).parents(".multiselect_container").find(".multiselect_div_total span").each(function(index, element) {
						if (search_func($(element).html())) {
							$(element).show();
						} else {
							$(element).hide();
						}
					});
				} else {
					$(this).parents(".multiselect_container").find(".multiselect_div_total span").map(function() {$(this).show();});
				}
				updateMultiSelectPanelTotal($(this).parents(".multiselect_container"));
			});

			// search input
			$container_handler.find(".multiselect_search_input").keyup(function(event) {
				event.preventDefault();
				if ($(this).val().indexOf('，') != -1) {
					$(this).val($(this).val().replace(/，/,','));
				}
				$(this).parents(".multiselect_container").find(".multiselect_search").click();
			});

			// clear button
			$container_handler.find(".multiselect_clear").click(function(event) {
				event.preventDefault();
				$(this).parent().find(".multiselect_search_input").val("");
				$(this).parents(".multiselect_container").find(".multiselect_search").click();
			});
		},

        bindDocumentClickInJMultiSelect = function() {
			$( document ).click(function(e) {
				var $target = e && (e.target ) && $( (e.target) );
				var flag = $((e.relatedTarget || e.srcElement || e.target)).hasClass("multiselect_view") || ($target && $target.parents(".multiselect_view, .multiselect_container").size() > 0);

				if (! flag) {
					 $(".multiselect_container").hide();
				}
			});
		};

		return {
			init : function() {
				var $handler = $(this);
				if (! $handler.hasClass("classInit")) {
					$handler.addClass("classInit");
					$handler.hide();
				}

				var label = $handler.attr("data-label");
				$handler.after(getMultiSelectHTML(label));

				var $container = $handler.next().next();


				var $total = $container.find(".multiselect_div_total");
				//var $selected = $container.find(".multiselect_div_selected");

				var multiple = ! ($handler.attr("data-multiple") === "false");
				if (! multiple) {
					$container.find(".multiselect_total_select").hide();
					$container.find(".multiselect_invert_select").hide();
					$container.find(".multiselect_clear_select").hide();
				} else {
					initMultiSelectSelect($container);
				}

				initMultiSelectBtn($container);
				initMultiSelectSearch($container);
                bindDocumentClickInJMultiSelect();

				var selected_list = [];

				$handler.find("option").each(function(index, element) {
					var span_handler = $("<span></span>").attr({"value":element.value})
					.on("click", function(event) {
						event.preventDefault();
                        var multiple = $(this).parents(".multiselect_container").prev().prev().attr("data-multiple") == "false" ? false: true;
                        var isAll = $(this).attr("value") == -127;
                        if(isAll) {
                            // 如果是“全部”选项
                            if (!$(this).hasClass("multiselect_span_selected")) {
                                $(this).siblings().removeClass("multiselect_span_selected");    // uncheck 其他选项
                                $(this).addClass("multiselect_span_selected");
                            }
                        } else {
                            // 如果是普通选项
                            if (multiple && $(this).hasClass("multiselect_span_selected")) {
                                $(this).removeClass("multiselect_span_selected");
                                // 如果当前没有选项选中，则选中“全部”
                                if($(this).parent().find(".multiselect_span_selected").length < 1) {
                                    $(this).parent().find("span[value=\\-127]").addClass("multiselect_span_selected");
                                }
                            } else if(!$(this).hasClass("multiselect_span_selected")) {
                                $(this).addClass("multiselect_span_selected");
                                if(multiple) {
                                    // uncheck “全部”选项
                                    var active_127 = $(this).siblings("span[value=\\-127]");
                                    if (active_127.length === 1) {
                                        active_127.removeClass("multiselect_span_selected");
                                    }
                                } else {
                                    $(this).siblings().removeClass("multiselect_span_selected");    // uncheck 其他选项
                                }
                            }

//                            if (! multiple && $(this).parents(".multiselect_container").find(".multiselect_div_total span.multiselect_span_selected").size() == 0) {
//                                $(this).addClass("multiselect_span_selected");
//                            }

                            if (multiple && event.shiftKey) {
                                // 如果是多选，且按住shift键，进行区间选择
                                var current_index = $(this).index(),
                                    prev = $(this).siblings(),
                                    prev_index = current_index;
                                for (var i = current_index; i >= 0; i--) {
                                    if ($(prev[i]).hasClass('multiselect_span_selected')) {
                                        prev_index = i;
                                        break;
                                    }
                                }

                                for (var i = prev_index; i < current_index; i++) {
                                    if($(prev[i]).attr("value") != -127) {
                                        $(prev[i]).addClass('multiselect_span_selected');
                                    }
                                }
                            }
                        }
						updateMultiSelectValue($(this));
					})
					.text($(element).html())
					.appendTo($total);
					if (element.selected) {
						selected_list.push(span_handler);
					}
				});


				$(selected_list).map(function(){$(this).click();});
				updateMultiSelectValue($total);

				$handler.next().click(function(event) {
                    $(".multiselect_container").hide();
					$(this).next().show().position({
						my: 'left top',
		             	at: 'left bottom',
		             	of: $(this)
					});

                    var $search_input=$(this).next().find('.multiselect_search_input');
                    $search_input.focus();//After showing the container, set focus on the search input box
                    event.preventDefault();
				});
			}

		};
	}();  // jMultiSelect


	$.fn.extend({
 	 	jMultiSelect: jMultiSelect.init
  	});
})(jQuery);