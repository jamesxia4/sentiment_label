/**
 * 数据库操作封装
 * @version 0.1
 * @2015-09-14
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

public class SQLHelper {
	public Logger logger = Logger.getLogger(SQLHelper.class);
	private Properties dbProp;
	private String dbDriver="";
	private String dbUrl="";
	private String dbUsername="";
	private String dbPassword="";
	
	private Connection conn=null;
	private Statement stmt=null;
	
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
			conn.close();
		}
		catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
		}
	}
	
	
	/**
	 * 执行查询语句并返回结果
	 * @param sqlToExecute, select型语句
	 * @return rs(查询结果)
	 * @throws SQLException
	 */
	public ResultSet queryExecutor(String sqlToExecute) throws SQLException{
		connect_db();
/*		System.out.println("Creating Statement...");*/
		stmt=conn.createStatement();
		ResultSet rs = stmt.executeQuery(sqlToExecute);
		return rs;
	}
	
	/**
	 * 执行insert/delete/update并返回结果
	 * @param sqlToExecute, insert/delete/update型语句
	 * @return rowCount
	 * @throws SQLException
	 */
	public int updateExecutor(String sqlToExecute) throws SQLException{
		connect_db();
/*		System.out.println("Creating Statement...");*/
		stmt=conn.createStatement();
		int rowCount=stmt.executeUpdate(sqlToExecute);
		return rowCount;
	}
	
	/*********************************************************
	 * 任务大厅
	 *********************************************************/
	
	/**
	 * 任务大厅，罗列所有任务(新)：任务id,剩余时间,标题,描述信息
	 * @param task_group 任务组
	 * @return ResultSet: row=[task_id, timediff, task_title,description]
	 */
	public ResultSet getLobbyAllTasks(Integer task_group){
		String sqlStmt="select task_id,task_group,TIMESTAMPDIFF(day,NOW(),end_time),"
				+ "task_title,description,requirements from label_task "
				+ "where task_group=%d order by task_id;";
		sqlStmt=String.format(sqlStmt,task_group);
		try{
			ResultSet rs=queryExecutor(sqlStmt);
			return rs;
		}
		catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * 任务大厅，获得各个任务已领人数
	 * @param task_group 任务组
	 * @return ResultSet: row=[task_id,count(人数)]
	 */
	public ResultSet getLobbyAllTasksTakenByUsers(Integer task_group){
		String sqlStmt="select task_id,task_group,count(*) from label_user_task "
				+ "where task_group=%d group by task_id order by task_id;";
		sqlStmt=String.format(sqlStmt, task_group);
		try{
			ResultSet rs=queryExecutor(sqlStmt);
			return rs;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * 任务大厅，输出已经被当前用户领取的任务编号
	 * @param task_group
	 * @param user_id
	 * @return ResultSet: row=[task_id,task_group]
	 */
	public ResultSet getLobbyAllTasksIfTaken(Integer task_group,String user_id){
		String sqlStmt="select task_id,task_group from label_user_task where task_group=%d and user_id='%s';";
		sqlStmt=String.format(sqlStmt,task_group,user_id);
		try{
			ResultSet rs=queryExecutor(sqlStmt);
			return rs;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * 任务大厅，输出当前用户已经领了但是没有完成的任务个数
	 */
	public Integer getLobbyNumberOfUnfinishedTask(Integer task_group,String user_id,Integer task_size){
		String sqlStmt="select count(*) from label_user_task "
				+ "where task_group=%d and user_id='%s' and is_finished=0;";
		sqlStmt=String.format(sqlStmt,task_group,user_id,task_size);
		try{
			ResultSet rs=queryExecutor(sqlStmt);
			Integer unfinishedCount=0;
			while(rs.next()){
				unfinishedCount=rs.getInt(1);
			}
			return unfinishedCount;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * 任务大厅，领取任务
	 * @param task_id
	 * @param task_group
	 * @param user_id
	 * @return rowCount, -1为异常
	 */
	public int setNewTaskToBeTaken(Integer task_id,Integer task_group,String user_id){
		String sqlStmt="insert into label_user_task values (%d,%s,%d,0.0,0,0,0)";
		sqlStmt=String.format(sqlStmt, task_id,user_id,task_group);
		try{
			int rowCount=updateExecutor(sqlStmt);
			return rowCount;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return -1;
		}
	}
	
	/*********************************************************
	 * 我的任务
	 *********************************************************/
	
	/**
	 * 我的任务：输出未完成的任务task_id
	 */
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
	
	/**
	 * 我的任务：输出已完成的任务task_id
	 */
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
	
	/**
	 * 我的任务：根据已输出的task_id取得未完成任务的信息
	 * @param task_group
	 * @param task_id
	 * @return
	 */
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
	
	
	/**
	 * 我的任务：根据已输出的task_id取得已完成任务的信息
	 * @param task_group
	 * @param task_id
	 * @return
	 */
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
		
	}
	
	
	
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
