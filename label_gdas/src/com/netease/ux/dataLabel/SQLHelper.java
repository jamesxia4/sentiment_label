/**
 * 数据库操作封装
 * @version 0.2
 * @2015-11-04
 */
package com.netease.ux.dataLabel;

import com.netease.ux.dataLabel.Config;

import java.io.*;
import java.util.*;
import java.lang.*;
import java.sql.*;
import java.math.* ; 
import java.io.FileInputStream;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLTimeoutException;
import java.sql.Statement;

//用于对properties 这类配置文件做映射，支持key
//www.cnblog.com/lingiu/p/3468464.html
import java.util.Properties; 

import org.apache.log4j.Logger;

public class SQLHelper implements java.io.Serializable{
	public Logger logger = Logger.getLogger(SQLHelper.class);
	private Properties dbProp;
	private String dbDriver="";
	private String dbUrl="";
	private String dbUsername="";
	private String dbPassword="";
	
	private Connection conn=null;
	private Statement stmt=null;
	
	public SQLHelper(){
	}
	
	
	/**
	 * Constructor
	 * @param usrConfig
	 */
	public SQLHelper(Config usrConfig){
		dbProp=usrConfig.getProperties();
		dbDriver=dbProp.getProperty("dbDriver");
		dbUrl=dbProp.getProperty("dbUrl");
		dbUsername=dbProp.getProperty("dbUsername");
		dbPassword=dbProp.getProperty("dbPassword");

	}
	
	/**
	 * Database Info Handler
	 * @param inputKey
	 */
	
	public String SQLInfo(String inputKey){
		if(inputKey=="dbDriver"){
			return dbDriver;
		}
		else if(inputKey=="dbUrl"){
			return dbUrl;
		}
		else if(inputKey=="dbUsername"){
			return dbUsername;
		}
		else if(inputKey=="dbPassword"){
			return dbPassword;
		}
		else{
			return null;
		}
	}
	
	private boolean connect_db(){
		try{
			Class.forName(dbDriver);
/*			System.out.println("Connecting to database...\n");*/
			conn = DriverManager.getConnection(dbUrl,dbUsername,dbPassword);
			return true;
		}
		catch (SQLTimeoutException e){
			System.out.println("Error in connect_db:");
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return false;
		}
		catch (SQLException e){
			System.out.println("Error in connect_db:SQLException");
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return false;
		}
		catch (Exception e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * 关闭数据库链接
	 * @throws SQLException
	 */
	public void close(){
		try{
			stmt.close();
			conn.close();
		}
		catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
		}
	}
	
	
	/*********************************************************
	 * 任务大厅
	 *********************************************************/
	
	/**
	 * 任务大厅，罗列所有任务：任务id,剩余时间,标题,描述信息
	 * @param task_group 任务组
	 * @return List<String[]>: row=[task_id, timediff, task_title,description]
	 */
	public List<String[]> getLobbyAllTasks(Integer task_group){
		String sqlStmt="select task_id,task_group,TIMESTAMPDIFF(day,NOW(),end_time),"
				+ "task_title,dataTime,commentGame,dataSource,taskSize,taskType,generalDesc from label_task "
				+ "where task_group=%d order by task_id;";
		sqlStmt=String.format(sqlStmt,task_group);	
		try{
			connect_db(); 
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmt);
			List<String[]> taskInfoList=new ArrayList<String[]>();
			while(rs.next()){
				String[] taskItem=new String[10];
				taskItem[0]=((Integer)rs.getInt(1)).toString();	//任务id
				taskItem[1]=((Integer)rs.getInt(2)).toString(); //任务组
				taskItem[2]=((Integer)rs.getInt(3)).toString(); //任务剩余时间
				taskItem[3]=rs.getString(4);					//任务名
				taskItem[4]=rs.getString(5);					//数据时间
				taskItem[5]=rs.getString(6);					//数据对应游戏名称
				taskItem[6]=rs.getString(7);					//数据来源
				taskItem[7]=((Integer)rs.getInt(8)).toString(); //任务大小
				taskItem[8]=rs.getString(9);					//任务类型
				taskItem[9]=rs.getString(10);					//infobox说明文字
				taskInfoList.add(taskItem);
			}
			rs.close();
			close();
			return taskInfoList;
		}
		catch(SQLException e){
			close();
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * 任务大厅，获得各个任务已领人数
	 * @param task_group 任务组
	 * @return List<String[]>: row=[task_id,count(人数)]
	 */
	public List<String[]> getLobbyAllTasksTakenByUsers(Integer task_group){
		String sqlStmt="select label_task.task_id,label_task.task_group,tmpCount.cnt from "
				+ "label_task "
				+ "left join "
				+ "(select task_id,task_group,count(*) as cnt from label_user_task where task_group=%d group by task_id order by task_id) as tmpCount "
				+ "on  "
				+ "label_task.task_id=tmpCount.task_id order by label_task.task_id;";
		sqlStmt=String.format(sqlStmt, task_group);
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmt);
			List<String[]> taskUserInfo=new ArrayList<String[]>();
			while(rs.next()){
				String[] taskUserInfoItem=new String[3];
				taskUserInfoItem[0]=((Integer)rs.getInt(1)).toString();
				taskUserInfoItem[1]=((Integer)rs.getInt(2)).toString();
				taskUserInfoItem[2]=((Integer)rs.getInt(3)).toString();
				taskUserInfo.add(taskUserInfoItem);
			}
			rs.close();
			close();
			return taskUserInfo;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		} 
	}
	
	/**
	 * 任务大厅，判断某任务当前用户是否已领
	 * @param task_group
	 * @param task_id
	 * @param user_id
	 * @return Integer: row=[count]
	 */
	public Integer getLobbyTaskIsTakenByUser(Integer task_group,Integer task_id,String user_id){
		String sqlStmt="select count(*) from label_user_task "
				+ "where task_group=%d and task_id=%d and user_id='%s';";
		sqlStmt=String.format(sqlStmt,task_group,task_id,user_id);
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmt);
			rs.last();
			Integer rtnInt=rs.getInt(1);
			rs.close();
			close();
			return rtnInt;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		} 
	}
	
	/**
	 * 任务大厅，输出当前用户已经领了但是没有完成的任务个数
	 * //TODO 以后要根据task_size自动判断 
	 * //TODO 把task_group去掉
	 */
	public Integer getLobbyNumberOfUnfinishedTask(Integer task_group,String user_id,Integer task_size){
		String sqlStmt="select count(*) from label_user_task "
				+ "where task_group=%d and user_id='%s' and is_finished=0;";
		sqlStmt=String.format(sqlStmt,task_group,user_id,task_size);
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmt);
			Integer unfinishedCount=0;
			rs.last();
			unfinishedCount=rs.getInt(1);
			rs.close();
			close();
			return unfinishedCount;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		} 
	}
	
	
	/**
	 * 任务大厅，领取任务
	 * @param task_id
	 * @param task_group
	 * @param user_id
	 */
	public void setNewTaskToBeTaken(Integer task_id,Integer task_group,String user_id){
		String sqlStmt="insert into label_user_task values (%d,'%s',%d,0.0,0,0,0)";
		sqlStmt=String.format(sqlStmt, task_id,user_id,task_group);
		try{
			connect_db();
			stmt=conn.createStatement();
			stmt.executeUpdate(sqlStmt);
			close();
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
		} 
	}
	
	
/*	*//*********************************************************
	 * 我的任务
	 *********************************************************//*
	
	*//**
	 * 我的任务：输出未完成的任务task_id
	 *//*
	public ResultSet getMyTaskAllUnfinishedTasks(String user_id){
		String sqlStmt="select task_group,task_id from label_user_task where user_id='%s' and is_finished=0;";
		sqlStmt=String.format(sqlStmt, user_id);
		try{
			ResultSet rs=queryExecutor(sqlStmt);
			return rs;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return null;
		} 
	}
	
	*//**
	 * 我的任务：输出已完成的任务task_id
	 *//*
	public ResultSet getMyTaskAllFinishedTasks(String user_id){
		String sqlStmt="select task_group,task_id from label_user_task where user_id='%s' and is_finished=1;";
		sqlStmt=String.format(sqlStmt, user_id);
		try{
			ResultSet rs=queryExecutor(sqlStmt);
			return rs;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return null;
		} 
	}
	
	*//**
	 * 我的任务：根据已输出的task_id取得未完成任务的信息
	 * @param task_group
	 * @param task_id
	 * @return
	 *//*
	public ResultSet getUnfinishedTaskInfoByTaskGroupAndTaskId(Integer task_group,Integer task_id){
		String sqlStmt="select task_id,task_group,TIMESTAMPDIFF(day,NOW(),end_time),"
				+ "task_title,description,requirements from label_task "
				+ "where task_id=%d and task_group=%d;";
		sqlStmt=String.format(sqlStmt, task_id,task_group);
		try{
			ResultSet rs=queryExecutor(sqlStmt);
			return rs;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return null;
		} 
	}
	
	
	*//**
	 * 我的任务，获得未完成的任务的已领人数
	 * @param task_group 任务组
	 * @return ResultSet: row=[task_id,count(人数)]
	 *//*
	public ResultSet getMyTaskAllTasksTakenByUsers(Integer task_group, Integer task_id){
		String sqlStmt="select task_id,task_group,count(*) from label_user_task "
				+ "where task_group=%d and task_id=%d;";
		sqlStmt=String.format(sqlStmt, task_group,task_id);
		try{
			ResultSet rs=queryExecutor(sqlStmt);
			return rs;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return null;
		} 
	}
	
	
	*//**
	 * 我的任务：根据已输出的task_id取得已完成任务的信息
	 * @param task_group
	 * @param task_id
	 * @return
	 *//*
	public ResultSet getFinishedTaskInfoByTaskGroupAndTaskId(Integer task_group,Integer task_id,String user_id){
		String sqlStmt="select task_id,task_group,kappa,progress,num_effective,from label_user_task "
				+ "where task_id=%d and task_group=%d and user_id='%s';";
		sqlStmt=String.format(sqlStmt, task_id,task_group,user_id);
		try{
			ResultSet rs=queryExecutor(sqlStmt);
			return rs;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return null;
		} 
	}*/
	
	/*********************************************************
	 * 标注页面
	 *********************************************************/
	
	/*********************************************************
	 * 标注一致性计算及排行榜
	 *********************************************************/
	
/*	*//**
	 * 计算一对标注员之间在某个任务上标注结果一致的个数
	 * select count(*) from 
	 * ((select * from label_ods where task_id=%d and user_id = '%s') as task_1_1) 
	 * inner join 
	 * ((select * from label_ods where task_id=%d and user_id = '%s') as task_1_2)  
	 * on task_1_1.sentiment=task_1_2.sentiment and task_1_1.ods_sentence_id=task_1_2.ods_sentence_id;
	 * @param task_id,user_id_1,user_id_2
	 * @return ResultSet rs:[count]
	 *//*
	public ResultSet getNumberOfAgreementBetweenTwoUserOnTask(Integer task_id, String user_id_1,String user_id_2){
		String sqlStmt=
				"select count(*) from "+
		"((select * from label_ods_rst where task_id=%d and user_id = '%s') as task_1_1) "+
	    "inner join "+
		"((select * from label_ods_rst where task_id=%d and user_id = '%s') as task_1_2) "+
	    "on task_1_1.sentiment=task_1_2.sentiment and task_1_1.ods_sentence_id=task_1_2.ods_sentence_id;";
		
		sqlStmt=String.format(sqlStmt,task_id,user_id_1,task_id,user_id_2);
		try{
			ResultSet rs=queryExecutor(sqlStmt);
			return rs;
		}
		catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return null;
		}
	}*/
	
	
/*	*//**
	 * 更新某个标注员指定任务的一致性参数
	 * @param task_id, 任务id
	 * @return rowCount, -1为异常
	 *//*
	public int updateKappaByTaskId(Integer task_id, String user_id, Float kappa){
		String sqlStmt="update label_user_task set kappa=%f where task_id=%d and user_id='%s';";
		sqlStmt=String.format(sqlStmt, kappa, task_id, user_id);
		try{
			int rowCount=updateExecutor(sqlStmt);
			return rowCount;
		}
		catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return -1;
		}
	}*/

}
