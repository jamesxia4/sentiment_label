<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<%@ page import="java.io.*" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="com.netease.ux.dataLabel.DataLabel" %>
<link href="../style/publicOpinion/labelLabel.css" rel="stylesheet">
<script src="../js/jquery-1.8.3.js"></script>
<script src="../js/publicOpinion/labelUI.js"></script>
<script src="http://echarts.baidu.com/build/dist/echarts.js"></script>
<!--  
  <script type="text/javascript">
        // 路径配置
        require.config({
            paths: {
                echarts: 'http://echarts.baidu.com/build/dist'
            }
        });
        
        // 使用
        require(
            [
                'echarts',
                'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById("label_label_progressBar")); 
                
                var option = {
                    tooltip: {
                        show: true
                    },
                    legend: {
                    	show: false
                    },
                    xAxis : [
                        {
                            type : 'progress',
                            data : ["10","20","30","40","50","60","70","80","90","100"],
                        	show : false
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            "name":"销量",
                            "type":"bar",
                            "data":[5, 20, 40, 10, 10, 20]
                        }
                    ]
                };
        
                // 为echarts对象加载数据 
                myChart.setOption(option); 
            }
        );
    </script>
-->
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
					<div class="label_label_bonusLogo"></div>
					<div class="label_label_progressBar">
						<div class="label_label_progressBarUndoneLayer"></div>
						<div class="label_label_progressBarDoneLayer"></div>
					</div>
				</div>
				<div class="label_labelCard_grid">
					<div class="label_labelCard_Done"></div>
					<div class="label_labelCard_Doing">
						<div class="label_labelItem_comment"></div>
						<div class="label_labelItem_spliter"></div>
						<div class="label_labelItem_source"></div>
						<div class="label_labelItem_extraInfo">
							<div class="label_labelItem_subject"></div>
							<div class="label_labelItem_urlSource"></div>
							<div class="label_labelItem_url"></div>
						</div>
					</div>
					<div class="label_labelCard_toDo"></div>
					<div class="label_labelOptionWrapper">
						<div class="label_label_isIrrelevent"></div>
						<div class="label_label_sentiment"></div>
					</div>
				</div>
			</div>
		<div>
	</div>
</body>
</html>