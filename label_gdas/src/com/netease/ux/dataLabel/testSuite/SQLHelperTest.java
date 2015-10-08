/**
 * 数据库操作封装 单元测试
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
			assertEquals(5,rowCount);
			int taskid=rs.getInt(1);
			Timestamp startTime=rs.getTimestamp(2);
			Timestamp endTime=rs.getTimestamp(3);
			String strStartTime="2015-09-16 16:04:00";
			Timestamp sTs=Timestamp.valueOf(strStartTime);
			String strEndTime="2015-09-17 16:04:00";
			Timestamp eTs=Timestamp.valueOf(strEndTime);
			
			assertEquals(5,taskid);
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
			ResultSet rs=testSQL.getTaskInfoByTaskId(5);
			rs.last();
			Integer getTaskId=rs.getInt(1);
			Timestamp getStartTime=rs.getTimestamp(2);
			Timestamp getEndTime=rs.getTimestamp(3);
			Integer taskid=5;
			String strStartTime="2015-09-16 16:04:00";
			Timestamp sTs=Timestamp.valueOf(strStartTime);
			String strEndTime="2015-09-17 16:04:00";
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
	
	
	
	@Test
	public void testInsertLabelItem(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		try{
			int rowCount=testSQL.insertLabelItem("James",1,1,(float)1.0,0,1);
			ResultSet rs=testSQL.getAllLabelItem(1,"James");
			rs.last();
			assertEquals(1,rs.getInt(1));
			assertEquals("百度贴吧",rs.getString(2));
			assertEquals("画面",rs.getString(3));
			assertEquals("这个游戏画面好糟糕",rs.getString(4));
			assertEquals("这个游戏画面好糟糕，但是易于上手",rs.getString(5));
			assertEquals((float)1.0,rs.getFloat(6));
			assertEquals(0,rs.getInt(7));
			assertEquals(1,rs.getInt(8));
			testSQL.updateExecutor("delete from label_ods_rst where ods_sentence_id=1 and task_id=1;");
		}
		catch(SQLException e){
			testSQL.logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
		}
		
	}
	
	@Test
	public void testGetAllLabelItem(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		try{
			int rowCount=testSQL.insertLabelItem("James",1,1,(float)1.0,0,1);
			ResultSet rs=testSQL.getAllLabelItem(1,"James");
			rs.last();
			assertEquals(1,rs.getInt(1));
			assertEquals("百度贴吧",rs.getString(2));
			assertEquals("画面",rs.getString(3));
			assertEquals("这个游戏画面好糟糕",rs.getString(4));
			assertEquals("这个游戏画面好糟糕，但是易于上手",rs.getString(5));
			assertEquals((float)1.0,rs.getFloat(6));
			assertEquals(0,rs.getInt(7));
			assertEquals(1,rs.getInt(8));
			testSQL.updateExecutor("delete from label_ods_rst where ods_sentence_id=1 and task_id=1;");
		}
		catch(SQLException e){
			testSQL.logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
		}
	}
	
	@Test
	public void testUpdateProgressByUserIdAndTaskId(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		try{
			int rowCount=testSQL.updateProgressByUserIdAndTaskId("Mary",1,200);
			ResultSet rs=testSQL.getTaskInfoByTaskIdAndUserId(1,"Mary");
			rs.next();
			int progress=rs.getInt(2);
			assertEquals(200,progress);
		}
		catch (SQLException e){
			testSQL.logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
		}
	}
	
	@Test
	public void testUpdateUserTotalLabeled(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		try{
			int rowCount=testSQL.updateUserTotalLabeled("Mary",200);
			ResultSet rs=testSQL.queryExecutor("select total_labeled from label_user where user_id='Mary';");
			rs.next();
			int total_labeled=rs.getInt(1);
			assertEquals(400,total_labeled);
			testSQL.updateExecutor("update label_user set total_labeled=200 where user_id='Mary';");
		}
		catch (SQLException e){
			testSQL.logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
		}
	}

	@Test
	public void testGetFinishedTask(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		try{
			ResultSet rs=testSQL.getFinishedTask("Mary", 200);
			rs.last();
/*			System.out.println(rs.getRow());*/
			assertEquals((float)0.7,rs.getFloat(2));
			assertEquals(130,rs.getInt(3));
		}
		catch (SQLException e){
			testSQL.logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
		}
	}
	
	@Test
	public void testGetLabelRank(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		try{
			ResultSet rs=testSQL.getLabelRank();
			rs.next();
			assertEquals("Thomas",rs.getString(1));
			assertEquals(600,rs.getInt(2));
		}
		catch (SQLException e){
			testSQL.logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
		}
	}
	
	@Test
	public void testCalculateKappaByTaskId(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		float pe=testSQL.calculatePeByTaskId(5,200);
		float pbar=testSQL.calculatePbarByTaskId(5,200);
		float kappa=testSQL.calculateFleissKappa(5, 200);
		System.out.println(pbar);
		System.out.println(pe);
		System.out.println(kappa);
	}
	
	@Test
	public void  testUpdateKappaByTaskId(){
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		try{
			int rowCount=testSQL.updateKappaByTaskId(5,"John",testSQL.calculateFleissKappa(5, 200));
			ResultSet rs=testSQL.getFinishedTask("John", 200);
			rs.next();
			assertEquals(5,rs.getInt(1));
			System.out.println(rs.getFloat(2));
			assertEquals(144,rs.getInt(3));
		}
		catch (SQLException e){
			testSQL.logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
		}
	}
}
