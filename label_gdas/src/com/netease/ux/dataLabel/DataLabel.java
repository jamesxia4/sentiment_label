/**
 * 业务逻辑封装
 * @version 0.1
 * @2015-09-17
 */

package com.netease.ux.dataLabel;
import com.netease.ux.dataLabel.*;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
public class DataLabel {
	private SQLHelper dbhelper=null;
	public DataLabel(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		dbhelper=new SQLHelper(mysqlConfig);
	}
	
	public HashMap getLobbyAllTaskNamesAndDates(){
		HashMap<Integer,String> taskNamesAndDates=new HashMap<Integer,String>();
		ResultSet rs=dbhelper.getLobbyAllTasks();
		try{
			while(rs.next()){
				Integer task_id;
				String startDateAndEndDate;
				task_id=rs.getInt(1);
				
			}
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
