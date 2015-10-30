<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<%@ page import="java.io.*" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="com.netease.ux.dataLabel.DataLabel" %>
<link href="../style/publicOpinion/labelLobby.css" rel="stylesheet">
<script src="../js/jquery-1.8.3.js"></script>
<script src="../js/publicOpinion/lobbyUI.js"></script>
<title>任务大厅</title>
</head>
<body>
	<%! 
		DataLabel testLogicLayer=new DataLabel();
		JSONObject testObject=testLogicLayer.getLobbyAllTasksInfo(1,"hzxiayuanfang");%>
	<% 
		response.setHeader("Pragma","No-Cache");
		response.setHeader("Cache-Control","No-Cache");
		response.setDateHeader("Ewindowsxpires", 0);
		System.out.println(testObject.toString()); 
	%>	
		<div id="label_main_content">
		<div class="label_lobby_container">
			<div class="label_lobby_header">
				<div class="label_logo_wrapper">
					<div class="label_lobby_header_logo">
						<img src="../image/publicOpinion/label_logo.png">
					</div>
					<div class="label_lobby_header_text">任务大厅</div>
				</div>
				<div class="label_lobby_header_spliter"></div>
			</div>
			<div class="label_lobby_task_grid">
				<div class="label_taskgroup_wrapper">
					<div class="label_task_group_selector">
					<!--//TODO:加上期数选择 现在先写死 20151026 --> 
						<div class="label_taskgroup_item">2015年 第1期</div>
						<div class="label_taskgroup_item">2015年 第2期</div>
						<div class="label_taskgroup_item">全部</div>
					</div>
				</div>
				<div class="label_lobby_tasks">
					<div class="label_lobby_subHeader">所有任务</div>
					<div class="label_lobby_tasks_item">
						<div class="label_timeGameSource">
							<div class="label_clock"></div>
							<div class="label_rTime"><%=testObject.getJSONArray("1").get(0).toString()%>天</div>
							<div class="label_fromGame">炉石传说</div>
							<div class="label_scrapSource">百度贴吧</div>
						</div>
						<div class="label_taskNameWorkerWrapper">
							<div class="label_item_name"><%=testObject.getJSONArray("1").get(1).toString()%></div>
							<div class="label_user_wrapper"></div>
							<div class="label_userBtn_available">可领取</div>
						</div>
						
						<div class="label_item_spliter"></div>
						<div class="label_item_infobox"></div>
						<div class="label_item_pulldown"></div>
					</div>
					
					<div class="label_lobby_tasks_item">
						<div class="label_timeGameSource">
							<div class="label_clock"></div>
							<div class="label_rTime"><%=testObject.getJSONArray("2").get(0).toString()%>天</div>
							<div class="label_fromGame">炉石传说</div>
							<div class="label_scrapSource">百度贴吧</div>
						</div>
						<div class="label_taskNameWorkerWrapper">
							<div class="label_item_name"><%=testObject.getJSONArray("2").get(1).toString()%></div>
							<div class="label_user_wrapper">
							</div>
						</div>
						<div class="label_item_spliter"></div>
						<div class="label_item_infobox"></div>
						<div class="label_item_pulldown"></div>
					</div>
					
					<div class="label_lobby_tasks_item">
						<div class="label_timeGameSource">
							<div class="label_clock"></div>
							<div class="label_rTime"><%=testObject.getJSONArray("3").get(0).toString()%>天</div>
							<div class="label_fromGame">炉石传说</div>
							<div class="label_scrapSource">百度贴吧</div>
						</div>
						<div class="label_taskNameWorkerWrapper">
							<div class="label_item_name"><%=testObject.getJSONArray("3").get(1).toString()%></div>
							<div class="label_user_wrapper">
							</div>
						</div>
						<div class="label_item_spliter"></div>
						<div class="label_item_infobox"></div>
						<div class="label_item_pulldown"></div>
					</div>
					
					<div class="label_lobby_tasks_item">
						<div class="label_timeGameSource">
							<div class="label_clock"></div>
							<div class="label_rTime"><%=testObject.getJSONArray("4").get(0).toString()%>天</div>
							<div class="label_fromGame">炉石传说</div>
							<div class="label_scrapSource">百度贴吧</div>
						</div>
						<div class="label_taskNameWorkerWrapper">
							<div class="label_item_name"><%=testObject.getJSONArray("4").get(1).toString()%></div>
							<div class="label_user_wrapper">
							</div>
						</div>
						<div class="label_item_spliter"></div>
						<div class="label_item_infobox"></div>
						<div class="label_item_pulldown"></div>
					</div>
					
					<div class="label_lobby_tasks_item">
						<div class="label_timeGameSource">
							<div class="label_clock"></div>
							<div class="label_rTime"><%=testObject.getJSONArray("5").get(0).toString()%>天</div>
							<div class="label_fromGame">炉石传说</div>
							<div class="label_scrapSource">百度贴吧</div>
						</div>
						<div class="label_taskNameWorkerWrapper">
							<div class="label_item_name"><%=testObject.getJSONArray("5").get(1).toString()%></div>
							<div class="label_user_wrapper">
							</div>
						</div>
						<div class="label_item_spliter"></div>
						<div class="label_item_infobox"></div>
						<div class="label_item_pulldown"></div>
					</div>
					
					<div class="label_lobby_tasks_item">
						<div class="label_timeGameSource">
							<div class="label_clock"></div>
							<div class="label_rTime"><%=testObject.getJSONArray("6").get(0).toString()%>天</div>
							<div class="label_fromGame">炉石传说</div>
							<div class="label_scrapSource">百度贴吧</div>
						</div>
						<div class="label_taskNameWorkerWrapper">
							<div class="label_item_name"><%=testObject.getJSONArray("6").get(1).toString()%></div>
							<div class="label_user_wrapper">
							</div>
						</div>
						<div class="label_item_spliter"></div>
						<div class="label_item_infobox"></div>
						<div class="label_item_pulldown"></div>
					</div>
					
					<div class="label_lobby_tasks_item">
						<div class="label_timeGameSource">
							<div class="label_clock"></div>
							<div class="label_rTime"><%=testObject.getJSONArray("7").get(0).toString()%>天</div>
							<div class="label_fromGame">炉石传说</div>
							<div class="label_scrapSource">百度贴吧</div>
						</div>
						<div class="label_taskNameWorkerWrapper">
							<div class="label_item_name"><%=testObject.getJSONArray("7").get(1).toString()%></div>
							<div class="label_user_wrapper">
							</div>
						</div>
						<div class="label_item_spliter"></div>
						<div class="label_item_infobox"></div>
						<div class="label_item_pulldown"></div>
					</div>
					
					<div class="label_lobby_tasks_item">
						<div class="label_timeGameSource">
							<div class="label_clock"></div>
							<div class="label_rTime"><%=testObject.getJSONArray("8").get(0).toString()%>天</div>
							<div class="label_fromGame">炉石传说</div>
							<div class="label_scrapSource">百度贴吧</div>
						</div>
						<div class="label_taskNameWorkerWrapper">
							<div class="label_item_name"><%=testObject.getJSONArray("8").get(1).toString()%></div>
							<div class="label_user_wrapper">
							</div>
						</div>
						<div class="label_item_spliter"></div>
						<div class="label_item_infobox"></div>
						<div class="label_item_pulldown"></div>
					</div>
					
					<div class="label_lobby_tasks_item">
						<div class="label_timeGameSource">
							<div class="label_clock"></div>
							<div class="label_rTime"><%=testObject.getJSONArray("9").get(0).toString()%>天</div>
							<div class="label_fromGame">炉石传说</div>
							<div class="label_scrapSource">百度贴吧</div>
						</div>
						<div class="label_taskNameWorkerWrapper">
							<div class="label_item_name"><%=testObject.getJSONArray("9").get(1).toString()%></div>
							<div class="label_user_wrapper">
							</div>
						</div>
						<div class="label_item_spliter"></div>
						<div class="label_item_infobox"></div>
						<div class="label_item_pulldown"></div>
					</div>
					
					<div class="label_lobby_tasks_item">
						<div class="label_timeGameSource">
							<div class="label_clock"></div>
							<div class="label_rTime"><%=testObject.getJSONArray("10").get(0).toString()%>天</div>
							<div class="label_fromGame">炉石传说</div>
							<div class="label_scrapSource">百度贴吧</div>
						</div>
						<div class="label_taskNameWorkerWrapper">
							<div class="label_item_name"><%=testObject.getJSONArray("10").get(1).toString()%></div>
							<div class="label_user_wrapper">
							</div>
						</div>
						<div class="label_item_spliter"></div>
						<div class="label_item_infobox"></div>
						<div class="label_item_pulldown"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	
</body>
</html>