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
import java.util.List;
import java.util.ArrayList;

public class DataLabel {
	private SQLHelper dbHelper=null;
	public DataLabel(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		dbHelper=new SQLHelper(mysqlConfig);
	}
	
	/**任务大厅 罗列任务名和起止日期
	 * @return HashMap<Integer任务id,String起止日期>
	 */
	public HashMap<Integer,String> getLobbyAllTaskNamesAndDates(){
		HashMap<Integer,String> taskNamesAndDates=new HashMap<Integer,String>();
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
				taskNamesAndDates.put(task_id, startDateAndEndDate);
			}
			return taskNamesAndDates;
		}
		catch (SQLException e) {
			e.printStackTrace();
			return taskNamesAndDates;
		}
	}
	
	/**任务大厅 罗列任务名和进度
	 * @return HashMap<Integer任务id,String三人进度>
	 */
	public HashMap<Integer,String> getAllTaskIdAndProgress(){
		HashMap<Integer,String> taskIdAndProgress=new HashMap<Integer,String>();
		try{
			ResultSet rs_src=dbHelper.queryExecutor("select task_id from label_task order by task_id");
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
	
	/**任务描述 罗列起止日期
	 * 
	 */
	//TODO: 任务描述：起止日期
	
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
