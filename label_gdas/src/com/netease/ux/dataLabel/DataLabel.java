/**
 * 业务逻辑封装
 * @version 0.1
 * @2015-09-17
 */

package com.netease.ux.dataLabel;
import com.netease.ux.dataLabel.*;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.sql.SQLException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import java.util.ArrayList;
import java.util.List;


import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class DataLabel {
	private SQLHelper dbHelper=null;
	public DataLabel(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		dbHelper=new SQLHelper(mysqlConfig);
	}
	
	public JSONObject getLobbyAllTasksInfo(Integer task_group,String user_id){
		HashMap<String,String[]> taskIdAndInfo=new HashMap<String,String[]>();
		try{
			ResultSet rsInfo=dbHelper.getLobbyAllTasks(task_group);
			ResultSet rsNumTaken=dbHelper.getLobbyAllTasksTakenByUsers(task_group);

			Integer numUnfinished=dbHelper.getLobbyNumberOfUnfinishedTask(task_group, user_id, 100);
			
				while(rsInfo.next()&&rsNumTaken.next()){
					//未完成任务数<=5可以继续接活
					if(numUnfinished<=5){
						Integer task_id=rsInfo.getInt(1);
						String str_task_id=((Integer)rsInfo.getInt(1)).toString();
						String[] task_info=new String[6];
						task_info[0]=((Integer)(rsInfo.getInt(3))).toString();
						task_info[1]=rsInfo.getString(4);
						task_info[2]=rsInfo.getString(5);
						task_info[3]=rsInfo.getString(6);
						Integer numTaken=rsNumTaken.getInt(3);
						task_info[4]=((Integer)numTaken).toString();
						Integer isTakenByUser=dbHelper.getLobbyTaskIsTakenByUser(task_group,task_id,user_id);
						if(numTaken<3 && isTakenByUser==0){
							task_info[5]="领取任务";
							taskIdAndInfo.put(str_task_id, task_info);
						}
						else if(numTaken==3)
						{
							task_info[5]="人数已满";
							taskIdAndInfo.put(str_task_id, task_info);
						}
						else
						{
							task_info[5]="已领取";
							taskIdAndInfo.put(str_task_id, task_info);
						}
					//否则不允许继续接任务
					}else{
						Integer task_id=rsInfo.getInt(1);
						String str_task_id=((Integer)rsInfo.getInt(1)).toString();
						String[] task_info=new String[6];
						task_info[0]=((Integer)(rsInfo.getInt(3))).toString();
						task_info[1]=rsInfo.getString(4);
						task_info[2]=rsInfo.getString(5);
						task_info[3]=rsInfo.getString(6);
						Integer numTaken=rsNumTaken.getInt(3);
						task_info[4]=((Integer)numTaken).toString();
						Integer isTakenByUser=dbHelper.getLobbyTaskIsTakenByUser(task_group,task_id,user_id);
						if(isTakenByUser==1){
							task_info[5]="已领取";
						}
						else if(numTaken==3){
							task_info[5]="人数已满";
						}
						else{
							task_info[5]="不可用";
						}
						taskIdAndInfo.put(str_task_id, task_info);
					}
				}
				return JSONObject.fromObject(taskIdAndInfo);
			}catch(SQLException e){
				dbHelper.logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
				e.printStackTrace();
				return null;
			}
		}
}
