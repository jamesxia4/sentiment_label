function chooseReportResult(id) {
	if (id >= 0) {
		block();
		$("#report_forms_and_result").load('report_render.jsp?id='+id, null,
				function()
				{
					unBlock($("#report_forms_and_result"));
					//$.unblockUI();
				}
		);
	}
}

function getFormatDate(date) {
	var tmp = "" + date.getFullYear() + "-";
	if (date.getMonth() < 9) { // getMonth() value range 0 to 11
		tmp += "0" + (1 + date.getMonth());
	} else {
		tmp += (1 + date.getMonth());
	}
	tmp += "-";
	if (date.getDate() < 10) {
		tmp += "0" + date.getDate();
	} else {
		tmp += date.getDate();
	}
	return tmp;
}

// calc weeknum
function calculateWeek(d) {
	// url: http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
    // Copy date so don't modify original
    d = new Date(d);
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    //return [d.getFullYear(), weekNo];
    return "" + d.getFullYear() + (weekNo < 10 ? "0" + weekNo : weekNo); 
}

$('html').click(function() {
	$("[class='datepicker-calendar']:visible").hide();
});


function reportInitDate(container_handler, options) {
	$(container_handler).find( ".classDatepicker" ).each(function (index,element){
	initDatepickerRange($(element), options);
//		$(element).after($("<div style=\"position:absolute;z-index:1;\" class=\"datepicker-calendar\"></div>"));
//		
//		var mode = 'range';		
//		var to   = new Date((new Date()).getTime() - 1000 * 60 * 60 * 24 * 2);
//		var from = new Date((new Date()).getTime() - 1000 * 60 * 60 * 24 * 16);
//		var date = [from, to];
//		
//		if (!$(element).val()) {
//			$(element).val(getFormatDate(from) + "," + getFormatDate(to));			
//		} else {
//			var ss = $(element).val().replace("/-/g","/").split(","); // set given date range
//			if (ss.length == 1) {
//				mode = 'single';
//				date = new Date(ss[0] + " 00:00:00");
//				$(element).val(getFormatDate(date));
//			} else if (ss.length == 2) {
//				from = new Date(ss[0] + " 00:00:00");
//				to   = new Date(ss[1] + " 00:00:00");
//				date = [from, to];
//			}
//		}
//		//console.log("mode", mode);
//		$(element).next().DatePicker({
//			inline : true,
//			date : date,
//			calendars : 3,
//			mode : mode,
//			current : new Date(to.getFullYear(), to.getMonth() - 1, 1),
//			onChange : function(dates, el) {
//				// update the range display
//				var tmp = mode == 'range' ? getFormatDate(dates[0]) + "," + getFormatDate(dates[1]) : getFormatDate(dates);
//				$(element).val(tmp);
//			}
//		});
//		$(element).next().hide();
//		
//		$(element).click(function() {
//			$(element).next().toggle();
//			return false;
//		});
	});
	
}

function reportInitWeek(container_handler) {
	var dt1 = new Date();
	dt1.setDate(dt1.getDate() - 7);
	$(container_handler).find('[name="end_dt"]').each(function (idx, e) {
		if($(e).get(0).selectedIndex == 0) { // has not default value
			$(e).val(calculateWeek(dt1));
			var cnt = 0;
			while($(e).val() != calculateWeek(dt1)) {
				dt1.setDate(dt1.getDate() - 7*1);
				$(e).val(calculateWeek(dt1));
				cnt += 1;
				if (cnt > 10) break;
			};
		}
	});
	
	//console.log(calculateWeek(dt1));
	dt1.setDate(dt1.getDate() - 7*9);
	$(container_handler).find('[name="start_dt"]').each(function (idx, e) {
		if($(e).get(0).selectedIndex == 0) { // has not default value
			$(e).val(calculateWeek(dt1));
			var cnt = 0;
			while($(e).val() != calculateWeek(dt1)) {
				dt1.setDate(dt1.getDate() - 7*1);
				$(e).val(calculateWeek(dt1));
				cnt += 1;
				if (cnt > 10) break;
			};
		}
	});
	//console.log(calculateWeek(dt1));
}

function reportInitMultiSelect(container_handler) {
	$(container_handler).find('[data-id^="multi-select"]').each(function (index,element) {
		var label = $(element).attr("data-label"),
		multiple = $(element).attr("data-multiple") == "false" ? false : true;
		if (multiple && $(element).find("option").length > 20) {
			$(element).jMultiSelect();
			return;
		}
		
		$(element).multiselect({
			multiple: multiple,
			header: null,
			minWidth: 225,
			noneSelectedText: (label && label.length > 0) ? ('全部' + label) : '请选择至少一项',
			selectedText: function(numChecked, numTotal, checkedItems) {
				var title = $(checkedItems).map(function() {return this.title; }).get().join(",");
				var value = $(checkedItems).map(function() {return this.value; }).get().join(",");
				$(element).val(value.split(",")); 				
				return title;
			},
			click: function(e) {
		    	//if( $(this).multiselect("widget").find("input:checked").length > 6 ) { return false; }
		    }
	 	}).multiselectfilter({
 			label: false,
 			width: "199",
			placeholder: "搜索..."
 		});	
	});	
}

function replaceImg(place_handler) {
	$(place_handler).html("<img src='" + contextPath + "/image/busy.gif' alt='Loading...' />");
}

function reportInitSubmit(form_handler) {
	$(form_handler).find("button.submit_button").click(function(){	
		
		var flag = "";
		$(this).parent().find('[data-id^="multi-select"]').each(function(idx, e) {
			var element_id_handler = $(e);
			if ($(e).attr("data-multiple") == "nonone" && ! element_id_handler.val()) {
				if (flag == "") {
					flag += $(e).attr("data-label");
				} else {
					flag += "," + $(e).attr("data-label");
				}
			}
		});
		if (flag.length > 0) {
			alert(flag + "字段不能为空！");				
			return false;
		}
		
		var that = this;
		replaceImg($(that).parent("form").next());
		
		$.ajax({
			url:$(that).parent("form").attr("action"),
			data:$(that).parent("form").serialize(),
			//async: false,
			success:function(data){
				$(that).parent("form").next().html(data);
			}
		});
		
	});
}



function reportInitForm(container_handler) {
	$(container_handler).find('[data-id^="form__"]').each(function (index,element){
		// init submit button
		reportInitSubmit(element);
						
		// init plot div
		replaceImg($(element).next());
		
		// init checkbox
		if ($(element).children('input[type="checkbox"][name!="exchange"]:checked').size() >= 2) {
			$(element).children('input[type="checkbox"][name!="exchange"]').each(function (i, e) {
				if (! $(e).attr("checked")) {
					$(e).attr("disabled", true);
				}
			});
		}
		
		// init multiselect
		if ($(element).children('[data-id^="multi-select"]').length >= 5) {
			$(element).children('button').each(function(idx, e) {
				if ($(e).hasClass('ui-multiselect')) {
					$(e).width("135px");
				}
			});
		}
		
		// hide__opts
		var hide_opts_obj = {};
		if ($(element).children('input[name="hideopts"]').length == 1) {
			var tmp = $($(element).children('input[name="hideopts"]').get(0)).val();
			if (tmp && tmp.length > 0) {
				hide_opts_obj = $.parseJSON(tmp);
			}
			if ("hidePanel" in hide_opts_obj && hide_opts_obj.hidePanel.indexOf("filterpanel") != -1) {
				$(element).children('button').each(function(idx, e) {
					if ($(e).hasClass('ui-multiselect')) {
						$(e).hide();
					}
				});
			}
		}
	
		// init x-axis and compare dimension
		if ($(element).attr("action").indexOf("idxTable.jsp") == -1) {
			var onlyDim = [];
			if ($(element).children("input[name='ctrl__onlyDim']").length > 0) {
				onlyDim = $($(element).children("input[name='ctrl__onlyDim']").get(0)).val();
				onlyDim = onlyDim == "null" ? [] : onlyDim.split(",");
			}
			var defaultDim = [];
			if ($(element).children("input[name='ctrl__defaultDim']").length > 0) {
				defaultDim = $($(element).children("input[name='ctrl__defaultDim']").get(0)).val();
				defaultDim = defaultDim == "null" ? [] : defaultDim.split(",");
			}
			
			var xaxis_option = [];
			var comp_option = [];
			$(element).children('select').each(function(idx, e) {
				var dim = e.name.replace("dim__","");
				if (onlyDim.length == 0 || onlyDim.indexOf(dim) != -1) {
					if ( e.dataset.label ) {
						if (defaultDim.length > 0 && defaultDim[0] == dim) {
							xaxis_option.push("<option value='" + dim + "' selected='selected'>" + e.dataset.label + "</option>");
						} else {
							xaxis_option.push("<option value='" + dim + "'>" + e.dataset.label + "</option>");
						}
						if (defaultDim.length > 1 && defaultDim[1] == dim) {
							comp_option.push("<option value='" + dim + "' selected='selected'>" + e.dataset.label + "</option>");
						} else {
							comp_option.push("<option value='" + dim + "'>" + e.dataset.label + "</option>");
						}
					}
				}
			});

			var s = "<span>";
			if ("hidePanel" in hide_opts_obj && hide_opts_obj.hidePanel.indexOf("ctrlpanel") != -1) {
				s = "<span style='display:none;'>";
			}
			var xaxis_title = "选择一个维度作为横坐标轴";
			var comp_title = "选择另一个维度作对比";
			if (xaxis_option.length > 0) {
				s += "<span class='lable' title='" + xaxis_title + "'>横轴:</span><select name='ctrl__xaxis' style='width:83px;'><option value='date'>日期</option>" + xaxis_option.join("") + "</select>" ;
			}
			if (comp_option.length > 0) {
				s += "<span class='lable' title='" + comp_title + "'>对比:</span><select name='ctrl__comp' style='width:83px;'><option value=''>无</option>";
				if (defaultDim.length > 1 && defaultDim[1] == "date") {
					s += "<option value='date' selected='selected'>日期</option>";
				} else {
					s += "<option value='date'>日期</option>";
				}
				s += comp_option.join("") + "</select>";
			}
			s += "</span>";
			//console.log("debug report.js s", s);
			$(element).find("button.submit_button").eq(0).before(s);
		}
	});
	
}

function reportInitCtrlSelect(container_handler) {
	$(container_handler).find('select[name^="ctrl__"]').each(function(idx, e) {
		$(e).click(function() {
			if (this.name == "ctrl__comp") {
				$($(this).children("option")[1]).removeAttr("disabled");
				var other_handler = $(this).parent().children('select[name="ctrl__xaxis"]').get(0);
				if ($(other_handler).val() == "date") {
					$($(this).children("option")[1]).attr("disabled","true");
				}
			}
		});
		$(e).change(function() {
			var other_name = this.name == 'ctrl__xaxis' ?  "ctrl__comp" : "ctrl__xaxis";			
			var other_handler = $(this).parent().children('select[name="' + other_name + '"]').get(0);
						
			if ($(other_handler).val() == $(this).val()) {
				if ($(this).val() == "date") {
					$(this).val("");
					$(other_handler).val("");
				} else {
					var other_value = other_name == "ctrl__xaxis" ? "date" : "";
					$(other_handler).val(other_value);
				}
			}
		});
	});
}

function reportInitPlot(container_handler) {
	$(container_handler).find(".classDivPlot").each(function(index, element) {
		$(element).css({"min-height":400});
	});
}

function reportInitTable() {
	$('.tableClass').each(function(index,element){
		if ($(element).hasClass("classDivInit")) {
			return;
		}		
		$(element).addClass("classDivInit");

		try {
			$(element).dataTable().fnDestroy();
			$(element).dataTable({
		        "sPaginationType" : "full_numbers",
		        "sScrollX": "100%",
		        "bScrollCollapse": true,
		        "bDestroy": true,
		        "bRetrieve": true,
		        "bAutoWidth": true,
		        //"bScrollCollapse": false,
		        "aaSorting": [], // disable default sort
				"oLanguage" : {
					"sLengthMenu": "每页显示 _MENU_ 条记录",
					"sZeroRecords": "抱歉， 没有找到",
					"sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
					"sInfoEmpty": "没有数据",
					"sInfoFiltered": "(从 _MAX_ 条数据中查找)",
					"sZeroRecords": "没有查找到数据",
					 "sSearch": "查找:",
					"oPaginate": {
						"sFirst": "首页",
						"sPrevious": "前一页",
						"sNext": "后一页",
						"sLast": "尾页"
					}
				}
			});
		} catch (err) {
			$(element).html("<p>配置出错了！</p>");
		}
	});
}

function reportInitPlainPlot() {
	$('[data-id^="plainplot__"]').each(function(index,element) {
		if ($(element).hasClass("classDivInit")) {
			return;
		}		
		$(element).addClass("classDivInit");
		var obj = $(element).attr("data-obj");
		$.ajax({
			url: contextPath + "/JspForReportDefine/reportStaticPlot.jsp",
			type: "POST",
			data: "obj=" + obj,
			async: false,
			success: function(result) {
				$(element).html(result);
			}
		});		
	});
}
function reportInit(options) {
	$("div[data-id^='container__']").each(function(index, element) {
		if ($(element).hasClass("classDivInit")) {
			return;
		}		
		$(element).addClass("classDivInit");
		
		//console.log(index, element);
		
		// init date input		
		reportInitDate(element, options);
		
		// init multi-select
		reportInitMultiSelect(element);
		
		// init form
		reportInitForm(element);
		
		// init week
		reportInitWeek(element);
		
		// trick
		fixMultiselectTrick();
		
		// init ctrl__ select
		reportInitCtrlSelect(element);
		
		// init 
		reportInitPlot(element);
				
		// init favorite
//		if (typeof(favoriteBindingToIdx) == "function") {
//			favoriteBindingToIdx(element);
//		}
		
		// click
		$(element).find('[data-id^="form__"]').each(function (index,element){
			$(element).find("button.submit_button").eq(0).click();
		});
	});

	
	// init plainplot
	reportInitPlainPlot();
	
	// init table
	reportInitTable();
	
	
//	// 在FORM后添加PLOT DIV
//	$('[data-id^="container__"]').each(function(idx,e) {
//		var flag = $(e).first().get(0).firstElementChild.action.indexOf("idxTable.jsp") == -1;
//		if (flag && $(e).find("div.idx_plot_container").size() == 0) {
//			$(e).append('<div class="idx_plot_container" style="height:400px;"></div>');
//		} else {
//			$(e).append('<div class="idx_table_container" style="height:auto;"></div>');
//		}
//		
//		if (typeof(favoriteBindingToIdx) == "function") {
//			favoriteBindingToIdx( this );
//		}
//	});
	
	// plainplot

	
	// 多选下拉框，包括维度和过滤字段

	
	
//	$(handler_prefix + ' .classDivRight').each(function (index,element){
//		$(element).after("<div style='clear:both;'></div>");
//	});
	
//	if(opts && opts.fun){
//		opts.fun();
//	}
}


