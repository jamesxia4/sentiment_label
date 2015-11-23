<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<%@ page import="com.netease.ux.dataLabel.DataLabel" %>
<link href="../style/publicOpinion/labelRank.css" rel="stylesheet">
<script src="../js/jquery-1.8.3.js"></script>
<script src="../js/publicOpinion/rankUI.js"></script>
<title>终于快做完啦(╯‵□′)╯︵┻━┻</title>
</head>
<body>
	<div id="label_main_content">
		<div class="label_rank_container">
			<div class="label_rank_header">
				<div class="label_rank_wrapper">
					<div class="label_rank_header_logo">
						<img src="../image/publicOpinion/label_logo.png">
					</div>
					<div class="label_rank_header_text">排行榜</div>
				</div>
				<div class="label_rank_header_spliter"></div>
			</div>
			
			<div class="label_myTask_task_grid">
				<div class="label_myTask_tasks">
					<div class="label_myTask_subHeader">未完成任务</div>
					<!-- 以下是所有未完成任务的罗列  -->
				</div>
				
				<div class="label_myTask_finishedTasks">
					<div class="label_myTask_subHeader">已完成任务</div>
					<!-- 以下是所有已完成任务的罗列  -->
				</div>
			</div>
		</div>
	</div>
</body>
</html>