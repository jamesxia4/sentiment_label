function showThisTrAll(trId,moreIsWhich){
	showThisTrNone(trId,moreIsWhich);
	$("[id^='"+trId+"__']").css("display","table-row");
	$("#"+trId+" ."+moreIsWhich+" .showMore").css("display","none");
	$("#"+trId+" ."+moreIsWhich+" .showLess").css("display","inline");
	$("[id^='"+trId+"__']").css("background-color","#D7E8F5");
	$("#"+trId).css("background-color","#D7E8F5");
//		$("#"+trId+" td").css("border-bottom","0");
}

function showThisTrNone(trId,moreIsWhich){
	var trIdHead = trId.split("__")[0];
	$("[id^='"+trIdHead+"__'].hiddenedContent").css("display","none");
	$("[id^='"+trIdHead+"__'] ."+moreIsWhich+" .showMore").css("display","inline");
	$("[id^='"+trIdHead+"__'] ."+moreIsWhich+" .showLess").css("display","none");
	$("[id^='"+trIdHead+"__']").css("background-color","#fff");
}

function showTrAll(trIdHead,moreIsWhich){
	$("[id^='"+trIdHead+"__'].hiddenedTitle").css("display","table-row");
	$("td."+moreIsWhich+" span.showMore").css("display","none");
	$("td."+moreIsWhich+" span.showLess").css("display","inline");
}

function showTrNone(trIdHead, lineInitShow,moreIsWhich){
	var id = $("tr[id^='"+trIdHead+"__'].hiddenedContent:not(:hidden):first");
	if(id){
		if(id.attr("id")){
			id=id.attr("id");
			id = id.split("__");
			if(id.length>1){
				id=id[1];
				if(id>=lineInitShow){
					showThisTrNone(trIdHead+"__"+id,moreIsWhich.replace(new RegExp("^(.+)b$"),"$1a"));
				}
			}
		}
	}
	$("[id^='"+trIdHead+"__'].hiddenedTitle").css("display","none");
	$("td."+moreIsWhich+" span.showMore").css("display","inline");
	$("td."+moreIsWhich+" span.showLess").css("display","none");
}