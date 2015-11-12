<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<%@ page import="com.netease.ux.dataLabel.DataLabel" %>
<link href="../style/publicOpinion/labelLabel.css" rel="stylesheet">
<script src="../js/jquery-1.8.3.js"></script>
<script src="../js/publicOpinion/labelUI.js"></script>
<title>8楼自动售货机老是卡货(╯‵□′)╯︵┻━┻</title>
</head>
<body>
	<div id="label_main_content">
		<div class="label_label_container">
			<div class="label_label_header">
				<div class="label_label_wrapper">
					<div class="label_label_header_logo">
						<img src="../image/publicOpinion/label_logo.png">
					</div>
					<div class="label_label_header_text">任务标注</div>
				</div>
				<div class="label_label_header_spliter"></div>
				<div class="label_label_headerAndSubmit">
					<div class="label_label_smallHeader">2015第一期 玩家评论情感倾向任务 001</div>
					<div class="label_label_sumbit">提交</div>
				</div>
				<div class="label_progressBarWrapper">
					<div class="label_label_progressBar">
						<div class="label_label_progressBarUndoneLayer">
							<div class="label_label_progressBarDotFinished"></div>
						</div>
						<div class="label_label_progressBarDoneLayer"></div>
					</div>
				</div>
				
				<div class="label_label_bonusWrapper">
						<div class="label_label_bonusLogo"></div>
				</div>
			</div>
			
			<div class="label_label_bigWrapper">
				<div class="label_labelCard_grid">
					<div class="label_labelCard_wrapper">
						<div class="label_labelCard Done">
							<div class="card_wrapper">
								<div class="label_labelItem_commentWrapper">
									<div class="label_labelItem_comment">
										<textarea class="label_card_comment" rows="2" cols="22"></textarea>
									</div>
									<div class="label_labelItem_tick"></div>
								</div>
								<div class="label_labelItem_spliter">
									<div class="label_spliter_hyphen">———————</div> 
									<div class="label_spliter_text">评论原文</div> 
									<div class="label_spliter_hyphen">———————</div>  
								</div>
								<div class="label_labelItem_source">
									<textarea class= "label_card_source" rows="11" cols="22"></textarea>
								</div>
								<div class="label_labelItem_extraInfo">
									<div class="label_labelItem_subject"></div>
									<div class="label_labelItem_urlSource"></div>
									<div class="label_labelItem_url"></div>
								</div>
							</div>
						</div>
						
						<div class="label_labelCard Doing">
							<div class="card_wrapper">
								<div class="label_labelItem_commentWrapper">
									<div class="label_labelItem_comment">
										<textarea class="label_card_comment doing" rows="2" cols="22"></textarea>
									</div>
									<div class="label_labelItem_tick"></div>
								</div>
								<div class="label_labelItem_spliter">
									<div class="label_spliter_hyphen">———————</div> 
									<div class="label_spliter_text">评论原文</div> 
									<div class="label_spliter_hyphen">———————</div> 
								</div>
								<div class="label_labelItem_source">
									<textarea class= "label_card_source doing" rows="11" cols="22"></textarea>
								</div>
								<div class="label_labelItem_extraInfo">
									<div class="label_labelItem_subject"></div>
									<div class="label_labelItem_urlSource"></div>
									<div class="label_labelItem_url"></div>
								</div>
							</div>
						</div>
						
						<div class="label_labelCard ToDo">
							<div class="card_wrapper">
								<div class="label_labelItem_commentWrapper">
									<div class="label_labelItem_comment">
										<textarea class="label_card_comment" rows="2" cols="22"></textarea>
									</div>
									<div class="label_labelItem_tick"></div>
								</div>
								<div class="label_labelItem_spliter">
									<div class="label_spliter_hyphen">———————</div> 
									<div class="label_spliter_text">评论原文</div> 
									<div class="label_spliter_hyphen">———————</div> 
								</div>
								<div class="label_labelItem_source">
									<textarea class= "label_card_source" rows="11" cols="22"></textarea>
								</div>
								<div class="label_labelItem_extraInfo">
									<div class="label_labelItem_subject"></div>
									<div class="label_labelItem_urlSource"></div>
									<div class="label_labelItem_url"></div>
								</div>
							</div>
						</div>
					</div>
					
					<div class="label_labelOptionWrapper">
						<div class="label_label_isIrrelevent"></div>
						<div class="label_label_sentiment"></div>
					</div>
					
				</div>
			</div>
		</div>
	</div>
</body>
</html>