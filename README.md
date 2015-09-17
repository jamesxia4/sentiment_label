# netease_gdas_label
# 网易游戏实习项目 
# 舆情分析语料标注平台

#【更新日志】
#2015.9.10 第一次提交
  添加了两份设计思维导图：需求分析、功能规划<br/>
  添加了axure原型设计图：datalabel.rp<br/>
  添加了数据库设计说明： 数据库说明.xlsx<br/>
  添加了数据库sql脚本：create_table.sql<br/>
#2015.9.11 第二次提交
  按照变更的需求修改了数据库设计说明，合并了user_task_taken和user_task_finished，user_id换成了网易内部通行证的前缀，暂存功能直接用提交替代，task的大小设定为200，去除了任务介绍<br/>
  按数据库设计说明变更了数据库sql脚本：create_table.sql<br/>
  \\\\TO DO:修改设计思维导图
#2015.9.14 第三次提交
  +开始编写数据库操作封装部分:netease_gdas<br/>
  +数据库配置文件夹:config<br/>
  参考了组内gameNaming的写法，完成了jdbc的连接部分的编写与JUnit测试<br/>
  \\\\TO DO:添加dataLabel类与其测试类的说明<br/>
#2015.9.14 第四次提交
  修改了create_table.sql：在建立数据表时添加了utf-8设定<br/>
  修改了数据库名称:netease_gdas-->label_netease_gdas<br/>
#2015.9.15 第五次提交
  修改了create_table.sql：添加了source_name<br/>
  +SQLHelper.java: 封装了大厅和标注的基本数据库操作<br/>
#2015.9.17 第七次提交
  修改create_table.sql: 修改了label_user表删去num_current_task,num_finished_task<br/>
  完成了提交后num_effective的计算<br/>
  +添加了测试数据库test.sql<br/>
  +添加了基于log4j的log功能<br/>
  变更原型设计datalabel.rp，与最终要求一致<br/>
  \\\\TO DO: 修改设计思维导图，完成test.sql,完成kappa计算,添加数据库上层封装，完成模块单元测试<br/>