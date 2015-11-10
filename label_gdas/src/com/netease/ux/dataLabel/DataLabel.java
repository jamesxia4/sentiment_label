/**
 * 业务逻辑封装
 * @version 0.2
 * @2015-11-04
 */

package com.netease.ux.dataLabel;

import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import java.util.ArrayList;
import java.util.List;


import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class DataLabel implements java.io.Serializable{
	private SQLHelper dbHelper=null;
	public DataLabel(String configFullPath){
		//如果是tomcat调用,当前的根文件夹就是tomcat的文件夹
		Config mysqlConfig=new Config(configFullPath);
		dbHelper=new SQLHelper(mysqlConfig);
	}
	
	//任务大厅:显示所有任务
	//TODO 与期数联调
	public JSONObject getLobbyAllTasksInfo(Integer task_group,String user_id){
		//用了LinkedHashMap就解决了Json无序的问题啦.
		HashMap<String,String[]> taskIdAndInfo=new LinkedHashMap<String,String[]>();
		
		List<String[]> rsInfo=dbHelper.getLobbyAllTasks(task_group);
		List<String[]> rsNumTaken=dbHelper.getLobbyAllTasksTakenByUsers(task_group);
		Integer numUnfinished=dbHelper.getLobbyNumberOfUnfinishedTask(task_group, user_id, 100);
		for(int i=0;i<rsInfo.size();i++){
			String[] task_info=new String[12];
			
			Integer task_id=Integer.parseInt(rsInfo.get(i)[0]);
			String str_task_id=rsInfo.get(i)[0];
			task_info[0]=rsInfo.get(i)[0];	//任务id
			task_info[1]=rsInfo.get(i)[1];	//任务组
			task_info[2]=rsInfo.get(i)[2];	//任务剩余时间
			task_info[3]=rsInfo.get(i)[3];  //任务名
			task_info[4]=rsInfo.get(i)[4];  //数据采集时间
			task_info[5]=rsInfo.get(i)[5];  //数据来源游戏名
			task_info[6]=rsInfo.get(i)[6];  //数据来源
			task_info[7]=rsInfo.get(i)[7];  //任务大小
			task_info[8]=rsInfo.get(i)[8];  //任务类型
			task_info[9]=rsInfo.get(i)[9];  //InfoboxText
			
			Integer numTaken=Integer.parseInt(rsNumTaken.get(i)[2]); //任务已领人数
			task_info[10]=((Integer)numTaken).toString(); //任务已领人数
			
			//是否已被领取
			Integer isTakenByUser=dbHelper.getLobbyTaskIsTakenByUser(task_group,task_id,user_id);
			
			//未完成任务数<=4可以继续接活
			if(numUnfinished<=4){
				if(numTaken<3 && isTakenByUser==0){
					task_info[11]="领取任务";
				}
				else if(numTaken==3 && isTakenByUser==0)
				{
					task_info[11]="人数已满";
				}
				else if(numTaken==3 && isTakenByUser==1)
				{
					task_info[11]="已领取";
				}
				else
				{
					task_info[11]="已领取";
				}
			//>=5以后不允许继续接任务
			}else{
				if(isTakenByUser==1){
					task_info[11]="已领取";
				}
				else if(numTaken==3){
					task_info[11]="人数已满";
				}
				else{
					task_info[11]="不可用";
				}
			}
			taskIdAndInfo.put(str_task_id, task_info);
		}
		return JSONObject.fromObject(taskIdAndInfo);
	}
	
	//任务大厅:领取任务
	public JSONObject setUserNewTask(Integer task_group,Integer task_id,String user_id){
		dbHelper.setNewTaskToBeTaken(task_id, task_group, user_id);
		return getLobbyAllTasksInfo(task_group,user_id);
	}
	
	
	//我的任务:已领未完成任务
	public JSONObject getMyTaskAllUnfinishedTaskInfo(String user_id){
		HashMap<String,String[]> myUnfinishedTaskInfo=new LinkedHashMap<String,String[]>();
		List<String[]> rsInfo=dbHelper.getMyTaskAllUnfinishedTaskInfo(user_id);
		List<String[]> rsNumTaken=dbHelper.getMyTaskUnfinishedTaskTakenByUser(user_id);
		
		for(int i=0;i<rsInfo.size();i++){
			String[] task_info=new String[11];
			
			String str_task_id=rsInfo.get(i)[0];
			task_info[0]=rsInfo.get(i)[0];	//任务id
			task_info[1]=rsInfo.get(i)[1];	//任务组
			task_info[2]=rsInfo.get(i)[2];	//任务剩余时间
			task_info[3]=rsInfo.get(i)[3];  //任务名
			task_info[4]=rsInfo.get(i)[4];  //数据采集时间
			task_info[5]=rsInfo.get(i)[5];  //数据来源游戏名
			task_info[6]=rsInfo.get(i)[6];  //数据来源
			task_info[7]=rsInfo.get(i)[7];  //任务大小
			task_info[8]=rsInfo.get(i)[8];  //任务类型
			task_info[9]=rsInfo.get(i)[9];  //InfoboxText
			
			Integer numTaken=Integer.parseInt(rsNumTaken.get(i)[2]); //任务已领人数
			task_info[10]=((Integer)numTaken).toString(); //任务已领人数
			myUnfinishedTaskInfo.put(str_task_id, task_info);
		}
		
		return JSONObject.fromObject(myUnfinishedTaskInfo);
	}
	
	//我的任务:已完成任务
	public JSONObject getMyTaskAllFinishedTaskInfo(String user_id){
		HashMap<String,String[]> myFinishedTaskInfo=new LinkedHashMap<String,String[]>();
		List<String[]> rsInfo=dbHelper.getMyTaskAllFinishedTaskInfo(user_id);
		
		for(int i=0;i<rsInfo.size();i++){
			String[] task_info=new String[6];
			
			String str_task_id=rsInfo.get(i)[0];
			task_info[0]=rsInfo.get(i)[0];	//任务id
			task_info[1]=rsInfo.get(i)[1];	//任务组
			task_info[2]=rsInfo.get(i)[2];	//任务名
			task_info[3]=rsInfo.get(i)[3];  //任务大小
			task_info[4]=rsInfo.get(i)[4];  //任务精确度
			//TODO 等排名弄好了再改这里
			task_info[5]="2";  //任务排名

			myFinishedTaskInfo.put(str_task_id, task_info);
		}
		
		return JSONObject.fromObject(myFinishedTaskInfo);
	}
}
