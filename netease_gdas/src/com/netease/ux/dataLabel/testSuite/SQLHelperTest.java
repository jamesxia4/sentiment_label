/**
 * 数据库操作封装 单元测试
 * @author hzxiayuanfang@corp.netease.com
 * @version 0.1
 * @2015-09-14
 */
package com.netease.ux.dataLabel.testSuite;

import org.junit.*;
import static org.junit.Assert.*;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

import org.junit.Test;
import junit.framework.*;
import junit.framework.TestCase;

import com.netease.ux.dataLabel.*;

public class SQLHelperTest extends TestCase{
	@Test
	public void testSQLHelper() {
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		assertEquals("com.mysql.jdbc.Driver",testSQL.SQLInfo("dbDriver"));
		assertEquals("root",testSQL.SQLInfo("dbUsername"));
		assertEquals("biubiubiu",testSQL.SQLInfo("dbPassword"));
		assertEquals("jdbc:mysql://localhost:3306/label_netease_gdas_test?useUnicode=True&characterEncoding=utf-8",testSQL.SQLInfo("dbUrl"));
		assertEquals("True",testSQL.SQLInfo("connection"));
/*		System.out.println("In test--SQLHelper Constructor\n");*/
	}

	@Test
	public void testSQLInfo() {
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		assertEquals("com.mysql.jdbc.Driver",testSQL.SQLInfo("dbDriver"));
		assertEquals("root",testSQL.SQLInfo("dbUsername"));
		assertEquals("biubiubiu",testSQL.SQLInfo("dbPassword"));
		assertEquals("jdbc:mysql://localhost:3306/label_netease_gdas_test?useUnicode=True&characterEncoding=utf-8",testSQL.SQLInfo("dbUrl"));
		assertEquals("True",testSQL.SQLInfo("connection"));
		assertNull(testSQL.SQLInfo("123123123"));
/*		System.out.println("In test--SQLHelper SQLInfo");*/
	}
	
	@Test
	public void testQueryExecutor(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		try{
			ResultSet rs=testSQL.queryExecutor("select task_id, start_time, end_time from label_task;");
			rs.last();
/*			System.out.println(rs.getRow());*/
		}
		catch(SQLException e){
			e.printStackTrace();
		}
	}
	
	@Test
	public void testGetLobbyAllTasks(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		ResultSet rs=testSQL.getLobbyAllTasks();
		try{
			rs.last();
			int rowCount=rs.getRow();
			assertEquals(13,rowCount);
			int taskid=rs.getInt(1);
			Timestamp startTime=rs.getTimestamp(2);
			Timestamp endTime=rs.getTimestamp(3);
			String strStartTime="2015-09-16 16:12:00";
			Timestamp sTs=Timestamp.valueOf(strStartTime);
			String strEndTime="2015-09-17 16:12:00";
			Timestamp eTs=Timestamp.valueOf(strEndTime);
			
			assertEquals(13,taskid);
			assertEquals(sTs,startTime);
			assertEquals(eTs,endTime);
		}
		catch(SQLException e)
		{
			testSQL.logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
		}
	}
	
	@Test
	public void testGetProgressByTaskId(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		try{
			ResultSet rs=testSQL.getProgressByTaskId(1);
			rs.last();
			String userid=rs.getString(1);
			Integer getProgress=rs.getInt(2);
			Integer setProgress=200;
			assertEquals("James",userid);
			assertEquals(setProgress,getProgress);
		}
		catch(SQLException e){
			testSQL.logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
		}
	}
	
	@Test
	public void testGetTaskInfoByTaskId(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		try{
			ResultSet rs=testSQL.getTaskInfoByTaskId(13);
			rs.last();
			Integer getTaskId=rs.getInt(1);
			Timestamp getStartTime=rs.getTimestamp(2);
			Timestamp getEndTime=rs.getTimestamp(3);
			Integer taskid=13;
			String strStartTime="2015-09-16 16:12:00";
			Timestamp sTs=Timestamp.valueOf(strStartTime);
			String strEndTime="2015-09-17 16:12:00";
			Timestamp eTs=Timestamp.valueOf(strEndTime);
			assertEquals(taskid,getTaskId);
			assertEquals(sTs,getStartTime);
			assertEquals(eTs,getEndTime);
		}
		catch(SQLException e){
			testSQL.logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
		}
	}
	
	@Test
	public void testGetTaskInfoByTaskIdAndUserId(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		try{
			ResultSet rs=testSQL.getTaskInfoByTaskIdAndUserId(1, "James");
			while(rs.next()){
				int taskid=rs.getInt(1);
				int curProgress=rs.getInt(2);
				assertEquals(1,taskid);
				assertEquals(200,curProgress);
			}
		}
		catch(SQLException e){
			testSQL.logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
		}
		
	}
	
	@Test
	public void testGetUnfinishedTaskInfoByUserId(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		try{
			ResultSet rs=testSQL.getUnfinishedTaskInfoByUserId("James",200);
			rs.last();
			assertEquals(2,rs.getInt(1));
			assertEquals(0,rs.getInt(2));
		}
		catch(SQLException e){
			testSQL.logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
		}
	}
	
/*	@Test
	public void testGetAllLabelItem(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		try{
			ResultSet rs=testSQL.getAllLabelItem(1,"James");
			rs.last();
			assertEquals(5,rs.getInt(1));
			assertEquals("百度贴吧",rs.getString(2));
			assertEquals("画面",rs.getString(3));
			assertEquals("这个游戏画面真好15",rs.getString(4));
			assertEquals("查狗真好玩,这个游戏画面真好15",rs.getString(5));
			assertEquals(1.0,rs.getFloat(6));
			assertEquals(0,rs.getInt(7));
			assertEquals(1,rs.getInt(8));
		}
		catch(SQLException e){
			testSQL.logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
		}
	}*/
	
	@Test
	public void testInsertLabelItem(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		int rowCount=testSQL.insertLabelItem("James",1,1,(float)1.0,0,1);
/*			ResultSet rs=testSQL.getAllLabelItem(1, "James");
			rs.next();
			assertEquals(1,rs.getInt(1));
			assertEquals("百度贴吧",rs.getString(2));
			assertEquals("画面",rs.getString(3));
			assertEquals("但是这个游戏画面真烂",rs.getString(4));
			assertEquals("查狗真好玩，但是这个游戏画面真烂",rs.getString(5));
			assertEquals(1.0,rs.getFloat(6));
			assertEquals(0,rs.getInt(7));
			assertEquals(1,rs.getInt(8));*/
		
	}

}
