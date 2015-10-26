<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="com.netease.ux.dataLabel.DataLabel" %>
<link href="../style/publicOpinion/labelLobby.css" rel="stylesheet">
<title>任务大厅</title>
</head>
<body>
	<% 
		DataLabel testLogicLayer=new DataLabel();
		JSONObject testObject=testLogicLayer.getLobbyAllTasksInfo(1,"hzxiayuanfang");
		//out.println(testObject.toString());
	%> 
	<div id="label_lobby_container">
		<div id="label_lobby_header">
			<div id="label_lobby_header_logo">
				<img src="../image/publicOpinion/3.png">
			</div>
			<div id="label_lobby_header_text">
				任务大厅
			</div>
			<div id="label_lobby_header_spliter">
			
			</div>
		</div>
		<div class="lobbyTask-grid" id="lobbyTask-grid">
			
		</div>
	</div>
</body>
</html>