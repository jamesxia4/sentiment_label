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
	
	/**任务大厅 罗列任务名和起止日期
	 * @return HashMap<Integer任务id,String起止日期>
	 */
	public HashMap<Integer,String> getLobbyAllTaskIdAndDates(){
		HashMap<Integer,String> taskIdAndDates=new HashMap<Integer,String>();
		try{
			ResultSet rs=dbHelper.getLobbyAllTasks();
			while(rs.next()){
				Integer task_id;
				String startDateAndEndDate;
				task_id=rs.getInt(1);
				Timestamp startTime=rs.getTimestamp(2);
				Timestamp endTime=rs.getTimestamp(3);
				String sTS=startTime.toString();
				String eTS=endTime.toString();
				startDateAndEndDate=sTS+"--"+eTS;
				taskIdAndDates.put(task_id, startDateAndEndDate);
			}
			return taskIdAndDates;
		}
		catch (SQLException e) {
			e.printStackTrace();
			return taskIdAndDates;
		}
	}
	
	/**任务大厅 罗列任务名和进度
	 * @return HashMap<Integer任务id,String三人进度>
	 */
	public HashMap<Integer,String> getLobbyAllTaskIdAndProgress(){
		HashMap<Integer,String> taskIdAndProgress=new HashMap<Integer,String>();
		try{
			ResultSet rs_src=dbHelper.queryExecutor("select task_id from label_task order by task_id;");
			while(rs_src.next()){
				Integer task_id=rs_src.getInt(1);
				ResultSet rs=dbHelper.getProgressByTaskId(task_id);
				String taskProgress;
				while(rs.next()){
					Integer usrProgress=rs.getInt(2);
					taskProgress=usrProgress.toString()+"/200 ";
					taskIdAndProgress.put(task_id, taskProgress);
				}
			}
			return taskIdAndProgress;
		}
		catch(SQLException e){
			e.printStackTrace();
			return taskIdAndProgress;
		}
	}
	
	/**
	 * 任务大厅：获取所有任务id
	 * @return List<Integer> 任务id
	 */
	public List<Integer> getAllTaskId(){
		List<Integer> taskIdList=new ArrayList<Integer>();
		try{
			String sqlStmt="select task_id from label_task order by task_id;";
			ResultSet rs=dbHelper.queryExecutor(sqlStmt);
			while(rs.next()){
				taskIdList.add(rs.getInt(1));
			}
			return taskIdList;
		}
		catch(SQLException e){
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * 任务大厅：以Json格式输出任务id与信息
	 * @return {1:["2015-09-16 16:02:00-2015-09-17 16:02:00","0/200 200/200 200/200"]}
	 */
	public JSONObject getLobbyAllTaskInfo(){
		List<Integer> taskIdList=new ArrayList<Integer>();
		List<String[]> infoList=new ArrayList<String[]>();
		HashMap<Integer,String> taskIdAndDates=getLobbyAllTaskIdAndDates();
		HashMap<Integer,String> taskIdAndProgress=getLobbyAllTaskIdAndProgress();
		
		//用entryset遍历效率更高，如果用keyset遍历，实际遍历了两次，
		//一次是iterator,一次是用取出的key找value
		//entryset直接一次取出放入entry,快一倍
		Iterator iterDates=taskIdAndDates.entrySet().iterator();
		Iterator iterProgress=taskIdAndDates.entrySet().iterator();
		
		while(iterDates.hasNext() && iterProgress.hasNext()){
			String[] datesAndProgress=new String[2];
			Map.Entry entryDates=(Map.Entry) iterDates.next();
			Map.Entry entryProgress=(Map.Entry) iterProgress.next();
			Object date=entryDates.getValue();
			Object progress=entryProgress.getValue();
			datesAndProgress[0]=(String)date;
			datesAndProgress[1]=(String)progress;
			infoList.add(datesAndProgress);
		}
		
		Map<Integer,String[]> taskIdAndInfo = new HashMap<Integer,String[]>();
		for(int i=0;i<taskIdList.size();i++){
			taskIdAndInfo.put(taskIdList.get(i),infoList.get(i));
		}
		return JSONObject.fromObject(taskIdAndInfo);
	}
	
	/**任务描述 罗列起止日期
	 * @return String起始日期-截止日期
	 */
	public String getDatesByTaskId(Integer task_id){
		String dates="";
		try{
			String sqlStmt="select start_time,end_time from label_task where task_id=%d;";
			sqlStmt=String.format(sqlStmt, task_id);
			ResultSet rs=dbHelper.queryExecutor(sqlStmt);
			
			while(rs.next()){
				Timestamp startTime=rs.getTimestamp(2);
				Timestamp endTime=rs.getTimestamp(3);
				String sTS=startTime.toString();
				String eTS=endTime.toString();
				dates=sTS+"--"+eTS;
			}
			return dates;
		}
		catch(SQLException e){
			e.printStackTrace();
			return dates;
		}
		
	}
	
	/**任务描述 罗列人员名与各自进度
	 * @return HashMap<String用户名,String进度>
	 */
	public HashMap<String,String> getAllUserProgressByTaskId(Integer task_id){
		HashMap<String,String> userIdAndProgress=new HashMap<String,String>();
		try{
			ResultSet rs=dbHelper.getProgressByTaskId(task_id);
			while(rs.next()){
				String userId=rs.getString(1);
				String taskProgress;
				Integer usrProgress=rs.getInt(2);
				taskProgress=usrProgress.toString()+"/200 ";
				userIdAndProgress.put(userId, taskProgress);
			}
			return userIdAndProgress;
		}
		catch(SQLException e){
			e.printStackTrace();
			return userIdAndProgress;
		}
	}
	

}
