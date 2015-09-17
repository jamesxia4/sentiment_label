/**
 * 数据库操作封装
 * @author hzxiayuanfang@corp.netease.com
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
	private static Logger logger = Logger.getLogger(SQLHelper.class);
	private Properties dbProp;
	private String dbDriver="";
	private String dbUrl="";
	private String dbUsername="";
	private String dbPassword="";
	private boolean isConnected=false;
	
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
		isConnected=connect_db();
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
		else if(inputKey=="connection"){
			if (isConnected){
				return "True";
			}
			else{
				return "False";
			}
		}
		else{
			return null;
		}
	}
	
	private boolean connect_db(){
		try{
			Class.forName(dbDriver);
			System.out.println("Connecting to database...\n");
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
	public void close() throws SQLException{
		conn.close();
	}
	
	
	/**
	 * 执行查询语句并返回结果
	 * @param sqlToExecute, select型语句
	 * @return rs(查询结果)
	 * @throws SQLException
	 */
	public ResultSet queryExecutor(String sqlToExecute) throws SQLException{
		System.out.println("Creating Statement...");
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
		System.out.println("Creating Statement...");
		stmt=conn.createStatement();
		int rowCount=stmt.executeUpdate(sqlToExecute);
		return rowCount;
	}
	
	/**
	 * 任务大厅罗列所有任务
	 * @return ResultSet: row=[task_id, start_time, end_time]
	 */
	public ResultSet getLobbyAllTasks(){
		String sqlStmt="select task_id, start_time, end_time from label_task;";
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
	 * 查询指定任务的所有人员进度
	 * @param task_id 任务id
	 * @return ResultSet: row= [user_id, progress]
	 */
	public ResultSet getProgressByTaskId(Integer task_id){
		String sqlStmt="select user_id,progress from label_user_task where "
				+"task_id ='%d' order by user_id desc;";
		sqlStmt=String.format(sqlStmt, task_id);
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
	 * 查询指定任务的介绍信息（开始、结束时间）
	 * @param task_id 任务id
	 * @return ResultSet: row=[task_id,start_time,end_time]
	 */
	public ResultSet getTaskInfoByTaskId(Integer task_id){
		String sqlStmt="select task_id,start_time,end_time from label_task where "
				+"task_id='%d';";
		sqlStmt=String.format(sqlStmt, task_id);
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
	 * @return ResultSet: row=[task_id,progress]
	 */
	public ResultSet getTaskInfoByTaskId(Integer task_id,Integer user_id){
		String sqlStmt="select task_id,progress from label_user_task where "
				+"task_id='%d' and user_id='%d';";
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
	 * 查看用户当前已领且未完成的任务
	 * @param task_id 任务id
	 * @param user_id 用户id
	 * @return ResultSet: row=[task_id,progress]
	 */
	public ResultSet getTaskInfoByTaskIdAndUserId(Integer task_id,Integer user_id){
		String sqlStmt="select task_id,progress from label_user_task where "
				+"task_id='%d' and user_id='%d' and progress<200 order by task_id desc;";
		sqlStmt=String.format(sqlStmt,task_id,user_id);
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
	 * 标注页所有条目罗列
	 * @param task_id
	 * @return ResultSet: row=[ods_sentence_id, source_name,concept name,
	 *		src_content, content, sentiment, is_conflict, is_relevent]
	 */
	public ResultSet getAllLabelItem(Integer task_id){
		String sqlStmt="select ods_sentence_id, source_name,concept name, "
				+"content, src_content, sentiment, is_conflict, is_relevent "
				+"from label_ods where task_id='%d';";
		sqlStmt=String.format(sqlStmt, task_id);
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
	public int updateLabelItem(Integer user_id,Integer task_id,Integer ods_sentence_id,Float sentiment,Integer is_conflict,Integer is_relevent){
		String sqlStmt="update label_ods set (sentiment ='%f',is_conflict='%d',is_relevent='%d',user_id='%d') "
				+"where ods_sentence_id='%d' and task_id='%d';";
		sqlStmt=String.format(sqlStmt, sentiment,is_conflict,is_relevent,user_id,ods_sentence_id,task_id);
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
	 * 在提交任务时根据UserId和TaskId更新对应项的progress
	 * @param user_id
	 * @param task_id
	 * @return rowCount,异常时返回-1
	 */
	public int updateProgressByUserIdAndTaskId(Integer user_id,Integer task_id){
		String sqlStmt="update label_user_task set progress=200 where user_id='%d' and task_id='%d';";
		sqlStmt=String.format(sqlStmt, user_id,task_id);
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
	 * 在某个task_id下所有标注员提交后遍历同task_id的标注项，选出有效项目
	 * 标准：三人标注一致，且is_conflict!=1, is_relevent=1
	 * @param task_id
	 * @return rowCount,异常时返回-1
	 */
	//要用临时表
	//http://stackoverflow.com/questions/45494/mysql-error-1093-cant-specify-target-table-for-update-in-from-clause
	public int updateNumEffectiveByTaskId(Integer task_id){
		String sqlStmt="update label_ods set is_useful=0 where ods_sentence_id=(select ods_sentence_id FROM (select * from label_ods) as tmpTable "
				+ "where task_id='%d' and is_conflict=0 and is_relevent=1 group by ods_sentence_id having count(distinct sentiment)>1) and task_id='%d';";
		//http://zhidao.baidu.com/question/68619324.html
		sqlStmt=String.format(sqlStmt, task_id);
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
	 * 提交后根据用户任务中的progress更新toal_labeled
	 * @param user_id 用户id
	 * @return rowCount,异常时返回-1
	 */
	public int updateUserTotalLabeled(Integer user_id){
		String sqlStmt="update label_user set total_labeled=total_labeled+200 where user_id='%d';";
		sqlStmt=String.format(sqlStmt, user_id);
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
	//TODO 计算Kappa
	public ResultSet getFinishedTask(Integer user_id){
		String sqlStmt="select task_id, kappa, num_effective from "
				+"where user_id='%d' and progress=200 order by task_id;";
		sqlStmt=String.format(sqlStmt, user_id);
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
		String sqlStmt="select * from label_user order by total_labeled;";
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
	 * 计算指定任务的一致性参数
	 * @param task_id, 任务id
	 * @return rowCount, -1为异常
	 */
	public int updateKappaByTaskId(Integer task_id, Integer user_id){
		String sqlStmt="update label_user_task set kappa='%f' where task_id='%d' and user_id='%d';";
		sqlStmt=String.format(sqlStmt, 1.0,task_id,user_id);
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
	
	
	/*******************
	 * 辅助性查询
	 *******************/
	
	/**
	 * 返回给定任务下所有标注员id
	 * @param task_id
	 * @return ResultSet rs: row[task_id,user_id]
	 */
	public ResultSet getAllUserIdByTaskId(Integer task_id){
		String sqlStmt="select task_id, user_id from label_user_task where task_id='%d' order by user_id";
		sqlStmt=String.format(sqlStmt, task_id);
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
	
	
}
