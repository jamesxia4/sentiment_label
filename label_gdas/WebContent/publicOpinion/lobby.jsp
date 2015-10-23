<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="com.netease.ux.dataLabel.DataLabel" %>
<title>任务大厅</title>
</head>
<body>
	<% 
		DataLabel testLogicLayer=new DataLabel();
		JSONObject testObject=testLogicLayer.getLobbyAllTasksInfo(1,"hzxiayuanfang");
		//out.println(testObject.toString());
	%> 
	<div id=indicator-container">
		<div class="lobbyTask-grid" id="lobbyTask-grid">
			
		</div>
	</div>
</body>
</html>