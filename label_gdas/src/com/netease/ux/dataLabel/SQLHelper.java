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
	
	/**
	 * 任务大厅罗列所有任务(新)
	 * @param task_group 任务组
	 * @return ResultSet: row=[task_id, timediff, task_title,description]
	 */
	public ResultSet getLobbyAllTasks(Integer task_group){
		String sqlStmt="select task_group,task_id,TIMESTAMPDIFF(day,NOW(),end_time),"
				+ "task_title,description from label_task where task_group=%d order by task_id;";
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
	 * 查询指定任务的所有人员进度(新)
	 * @param task_id 任务id
	 * @param task_group 任务组
	 * @return ResultSet: row= [user_id, progress]
	 */
	public ResultSet getProgressByTaskId(Integer task_id,Integer task_group){
		String sqlStmt="select user_id,progress from label_user_task where "
				+"task_id =%d and task_group =%d order by user_id;";
		sqlStmt=String.format(sqlStmt, task_id,task_group);
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
	 * 返回指定任务下所有标注员id(新)
	 * @param task_id 任务id
	 * @param task_group 任务组
	 * @return ResultSet rs: row[task_id,user_id]
	 */
	public ResultSet getAllUserIdByTaskId(Integer task_id,Integer task_group){
		String sqlStmt="select task_id, user_id from label_user_task where task_id=%d and task_group=%d;";
		sqlStmt=String.format(sqlStmt,task_id,task_group);
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
	 * 查询指定任务的介绍信息(新)
	 * @param task_id 任务id
	 * @param task_group 任务组
	 * @return ResultSet: row=[task_id,timediff,title,description]
	 */
	public ResultSet getTaskInfoByTaskId(Integer task_id,Integer task_group){
		String sqlStmt="select task_id,TIMESTAMPDIFF(day,NOW(),end_time),title,description from label_task where "
				+"task_id=%d and task_group=%d";
		sqlStmt=String.format(sqlStmt,task_id,task_group);
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
	 * 查询用户的某个任务的进度
	 * @param task_id 任务id
	 * @param task_group 任务组id
	 * @param user_id 用户id
	 * @return ResultSet: row=[task_id,progress]
	 */
	public ResultSet getTaskInfoByTaskIdAndUserId(Integer task_id,Integer task_group,String user_id){
		String sqlStmt="select task_id,progress from label_user_task where "
				+"task_id=%d and task_group=%d and user_id='%s';";
		sqlStmt=String.format(sqlStmt,task_id,task_group,user_id);
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
	 * 查看用户当前已领且未完成的任务
	 * @param task_size 任务大小
	 * @param user_id 用户id
	 * @return ResultSet: row=[task_id,progress]
	 */
	public ResultSet getUnfinishedTaskInfoByUserId(String user_id,Integer task_size){
		String sqlStmt="select task_id,progress from label_user_task where "
				+"user_id='%s' and progress<%d order by task_id;";
		sqlStmt=String.format(sqlStmt,user_id,task_size);
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
	 * 查看用户当前已领且未完成的任务个数
	 * @param task_size 任务大小
	 * @param user_id 用户id
	 * @return Integer: 未完成任务个数
	 */
	public Integer getNumberOfUnfinishedTaskInfoByUserId(String user_id,Integer task_size){
		String sqlStmt="select count(*) from label_user_task where "
				+"user_id='%s' and progress<%d order by task_id;";
		sqlStmt=String.format(sqlStmt,user_id,task_size);
		try{
			ResultSet rs=queryExecutor(sqlStmt);
			return rs.getInt(1);
		}
		catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * 标注页所有待标注条目导出
	 * @param task_id
	 * @param task_group
	 * @return ResultSet: row=[ods_sentence_id, source_name,concept name,
	 *		src_content, content]
	 */
	public ResultSet getAllItemToLabel(Integer task_id,Integer task_group){
		String sqlStmt="select ods_sentence_id, source_name,concept_name, "
				+"content, src_content from label_ods_src where task_id=%d and task_group=%d;";
		sqlStmt=String.format(sqlStmt,task_id,task_group);
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
	 * 第一次提交后后续标注项罗列
	 * @param task_id,task_group 
	 */
	public ResultSet getAllUnlabeledItem(Integer task_id,String user_id,Integer task_group){
		String sqlStmt="select ods_sentence_id,source_name,concept_name,"
				+ "content,src_content,sentiment,is_conflict,is_relevent "
				+ "from label_ods_rst where task_id=%d and user_id='%s' "
				+ "and task_group=%d and is_final=0;";
		sqlStmt=String.format(sqlStmt,task_id,user_id,task_group);
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
	 * 标注页所有已标注条目罗列
	 * @param task_id
	 * @return ResultSet: row=[ods_sentence_id, source_name,concept name,
	 *		src_content, content, sentiment, is_conflict, is_relevent]
	 */
	public ResultSet getAllLabeledItem(Integer task_id,String user_id,Integer task_group){
		String sqlStmt="select ods_sentence_id, source_name,concept_name, "
				+"content, src_content, sentiment, is_conflict, is_relevent "
				+"from label_ods_rst where task_id=%d and task_group=%d and user_id='%s';";
		sqlStmt=String.format(sqlStmt, task_id,user_id);
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
	 * 标注页提交:更新页面上单个标注项的值
	 * @param user_id: 用户id 用于标识标注者的身份
	 * @param task_id: 任务id 用于确定任务
	 * @param ods_sentence_id 用于确定标注项是任务中的哪一条
	 * @param sentiment 情感倾向
	 * @param is_conflict 句中情感是否冲突
	 * @param is_relevent 语句情感是否与特征无关
	 * @return 执行update操作后返回的rowCount, -1为异常
	 */
	public int insertLabelItem(String user_id,Integer task_id,Integer ods_sentence_id,Float sentiment,Integer is_conflict,Integer is_relevent){
		String sqlStmtSrc="select * from label_ods_src where ods_sentence_id=%d and task_id=%d";
		
		String sqlStmtTgt="Insert into label_ods_rst values "
				+ "(%d,%d,%d,%d,%d,%d,%d,"
				+ "'%s','%s','%s','%s',"
				+ "%f,%d,%d,%d,'%s');";
		sqlStmtSrc=String.format(sqlStmtSrc,ods_sentence_id,task_id);
		try{
			ResultSet rs=queryExecutor(sqlStmtSrc);
			while(rs.next()){
				sqlStmtTgt=String.format(sqlStmtTgt,rs.getInt(1),rs.getInt(2),rs.getInt(3),rs.getInt(4),rs.getInt(5),rs.getInt(6),rs.getInt(7),
						rs.getString(8),rs.getString(9),rs.getString(10),rs.getString(11),sentiment,is_conflict,is_relevent,task_id,user_id);
/*				System.out.println(sqlStmtTgt);*/
				int rowCount=updateExecutor(sqlStmtTgt);
				return rowCount;
			}
			return -1;
		}
		catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return -1;
		}
	}
	
	/**
	 * 在提交任务后根据UserId和TaskId更新对应项的progress
	 * @param user_id
	 * @param task_id
	 * @return rowCount,异常时返回-1
	 */
	public int updateProgressByUserIdAndTaskId(String user_id,Integer task_id,Integer task_size){
		String sqlStmt="update label_user_task set progress=%d where user_id='%s' and task_id=%d;";
		sqlStmt=String.format(sqlStmt, task_size, user_id ,task_id);
		try{
			int rowCount=updateExecutor(sqlStmt);
			return rowCount;
		}
		catch (SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return -1;
		}
	}
	
	
	/**
	 * 提交后根据用户任务中的progress更新toal_labeled
	 * @param user_id 用户id
	 * @return rowCount,异常时返回-1
	 */
	public int updateUserTotalLabeled(String user_id,Integer task_size){
		String sqlStmt="update label_user set total_labeled=total_labeled+ %d where user_id='%s';";
		sqlStmt=String.format(sqlStmt, task_size, user_id);
		try{
			int rowCount=updateExecutor(sqlStmt);
			return rowCount;
		}
		catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			return -1;
		}
	}
	
	/**
	 * 根据用户id输出所有已完成任务的kappa和有效标注数量
	 * @param user_id 用户id
	 * @return ResultSet: row=[task_id, kappa, num_effective]
	 */
	public ResultSet getFinishedTask(String user_id,Integer task_size){
		String sqlStmt="select task_id, kappa, num_effective from label_user_task where user_id='%s' and progress=%d order by task_id;";
		sqlStmt=String.format(sqlStmt, user_id,task_size);
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
	 * 输出标注量排行榜
	 * @return ResultSet: row=[user_id,total_labeled]
	 */
	public ResultSet getLabelRank(){
		String sqlStmt="select * from label_user order by total_labeled desc;";
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
	
	/*********************************************************
	 * 标注一致性计算
	 *********************************************************/
	
	/**
	 * 计算一对标注员之间在某个任务上标注结果一致的个数
	 * select count(*) from 
	 * ((select * from label_ods where task_id=%d and user_id = '%s') as task_1_1) 
	 * inner join 
	 * ((select * from label_ods where task_id=%d and user_id = '%s') as task_1_2) 
	 * on task_1_1.sentiment=task_1_2.sentiment and task_1_1.ods_sentence_id=task_1_2.ods_sentence_id;
	 * @param task_id,user_id_1,user_id_2
	 * @return ResultSet rs:[count]
	 */
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
	}
	
	
	/**
	 * 更新某个标注员指定任务的一致性参数
	 * @param task_id, 任务id
	 * @return rowCount, -1为异常
	 */
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
	}

}
