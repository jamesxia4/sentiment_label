/**
 * 数据库操作封装
 * @version 0.2
 * @2015-11-04
 */
package com.netease.ux.dataLabel;

import com.netease.ux.dataLabel.*;
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
	
	//TODO 修改领取流程
	/**
	 * 任务大厅，领取任务后续,读取label_ods_src并插入label_ods_rst
	 * @param task_id
	 * @param task_group
	 * @param user_id
	 */
	public void loadLabelItemsFromSrcIntoRst(Integer task_id,Integer task_group,String user_id){
		String sqlStmt="insert into label_ods_rst "
				+ "select ods_sentence_id,task_id,task_group,0,0,'%s' from label_ods_src "
				+ "where task_id=%d and task_group=%d;";
		sqlStmt=String.format(sqlStmt, user_id,task_id,task_group);
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
	
/*	public Integer getNumberOfTaskFinishedByUser(Integer task_group,String user_id){
		String sqlStmt="select count(*) from label_user_task where task_group=%d and user_id='%s' and is_finished=1;";
		sqlStmt=String.format(sqlStmt, task_group,user_id);
		Integer finishedCount=0;
		try{
			ResultSet rs=stmt.executeQuery(sqlStmt);
			rs.last();
			finishedCount=rs.getInt(1);
			rs.close();
			close();
			return finishedCount;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		} 
	}*/
	
	/*********************************************************
	 * 我的任务
	 *********************************************************/
	
	/**
	 * 我的任务：输出未完成的任务信息
	 */
	public List<String[]> getMyTaskAllUnfinishedTaskInfo(String user_id){
		String sqlStmt="select label_task.task_id,label_task.task_group,TIMESTAMPDIFF(day,NOW(),label_task.end_time),label_task.task_title,"
				+ "label_task.dataTime,label_task.commentGame,label_task.dataSource,label_task.taskSize,label_task.taskType,label_task.generalDesc "
				+ "from label_task inner join (select * from label_user_task where user_id='%s' and is_finished=0) as label_user_task_unfinished "
				+ "on label_task.task_id=label_user_task_unfinished.task_id and label_task.task_group=label_user_task_unfinished.task_group "
				+ "order by label_task.task_group,label_task.task_id;";
		sqlStmt=String.format(sqlStmt, user_id);
		List<String[]> unfinishedTaskInfo=new ArrayList<String[]>();
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmt);
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
				unfinishedTaskInfo.add(taskItem);
			}
			rs.close();
			close();
			return unfinishedTaskInfo;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		} 
	}
	
	
	/**
	 * 我的任务：输出未完成的任务已领人数
	 */
	public List<String[]> getMyTaskUnfinishedTaskTakenByUser(String user_id){
		String sqlStmt="select user_count.task_id,user_count.task_group,user_count.cnt from "
				+ "(select * from label_user_task where is_finished=0 and user_id='%s') as task_unfinished "
				+ "inner join "
				+ "(select task_group,task_id,count(*) as cnt from label_user_task group by task_group,task_id order by task_group,task_id)as user_count "
				+ "on task_unfinished.task_id=user_count.task_id and task_unfinished.task_group=user_count.task_group "
				+ "order by user_count.task_group,user_count.task_id;";
		sqlStmt=String.format(sqlStmt, user_id);
		List<String[]> unfinishedTaskTakenByUser=new ArrayList<String[]>();
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmt);
			while(rs.next()){
				String[] taskUserInfoItem=new String[3];
				taskUserInfoItem[0]=((Integer)rs.getInt(1)).toString();
				taskUserInfoItem[1]=((Integer)rs.getInt(2)).toString();
				taskUserInfoItem[2]=((Integer)rs.getInt(3)).toString();
				unfinishedTaskTakenByUser.add(taskUserInfoItem);
			}
			rs.close();
			close();
			return unfinishedTaskTakenByUser;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		} 
	}
	
	/**
	 * 我的任务：输出已完成的任务信息
	 */
	public List<String[]> getMyTaskAllFinishedTaskInfo(String user_id){
		String sqlStmt="select label_task.task_id,label_task.task_group,label_task.task_title,"
				+ "label_task.taskSize,finished_task.kappa from "
				+" label_task "
				+ "inner join "
				+ "(select * from label_user_task where user_id='%s' and is_finished=1) as finished_task "
				+ "on label_task.task_id=finished_task.task_id and label_task.task_group=finished_task.task_group "
				+ "order by label_task.task_id;";
		String sqlStmtRankTemplate="select tmpHighKappa.cnt+1 from (select count(*) as cnt from label_user_task "
				+ "where kappa> (select kappa from label_user_task where task_id=%d and task_group=%d and user_id='%s') "
				+ "and task_id=%d and task_group=%d) as tmpHighKappa;";
		sqlStmt=String.format(sqlStmt, user_id);
		List<String[]> unfinishedTaskInfo=new ArrayList<String[]>();
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmt);
			while(rs.next()){
				String sqlStmtRank=String.format(sqlStmtRankTemplate,rs.getInt(1),rs.getInt(2),user_id,rs.getInt(1),rs.getInt(2));
				Statement stmt1=conn.createStatement();
				ResultSet rsRank=stmt1.executeQuery(sqlStmtRank);
				rsRank.last();
				String[] taskItem=new String[6];
				taskItem[0]=((Integer)rs.getInt(1)).toString();	//任务id
				taskItem[1]=((Integer)rs.getInt(2)).toString(); //任务组
				taskItem[2]=rs.getString(3);					//任务名
				taskItem[3]=((Integer)rs.getInt(4)).toString(); //任务大小
				taskItem[4]=((Float)rs.getFloat(5)).toString();	//任务精度
				taskItem[5]=((Integer)rsRank.getInt(1)).toString(); //任务排名
				rsRank.close();
				stmt1.close();
				unfinishedTaskInfo.add(taskItem);
			}
			rs.close();
			close();
			return unfinishedTaskInfo;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		} 
	}
	
	
	/*********************************************************
	 * 标注页面
	 *********************************************************/
	
	/**
	 * 标注页面 载入语料
	 * @param task_id
	 * @param task_group
	 * @return
	 */
	public List<String[]> getLabelPageAllCorpus(Integer task_id,Integer task_group){
/*		System.out.println(task_id.toString()+" "+task_group.toString());*/
		String sqlStmt="select ods_sentence_id,content,src_content,concept_name,source_name,comment_url from  label_ods_src where task_id=%d and task_group=%d order by ods_sentence_id;";
		sqlStmt=String.format(sqlStmt, task_id,task_group);
		List<String[]>  labelTaskCorpus=new ArrayList<String[]>();
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmt);
			while(rs.next()){
				String[] labelItem=new String[6];
				labelItem[0]=((Integer)rs.getInt(1)).toString(); //评论id
				labelItem[1]=rs.getString(2); //评论句子
				labelItem[2]=rs.getString(3); //评论原文
				labelItem[3]=rs.getString(4); //评论特征
				labelItem[4]=rs.getString(5); //评论来源
				labelItem[5]=rs.getString(6); //评论url
				labelTaskCorpus.add(labelItem); 
			}
			rs.close();
			close();
/*			System.out.println(labelTaskCorpus.size());
			System.out.println(labelTaskCorpus.get(1)[0]+labelTaskCorpus.get(1)[1]);*/
			return labelTaskCorpus;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		} 
	}
	
	
	/**
	 * 标注页面 载入语料标注结果
	 * @param task_id
	 * @param task_group
	 * @return
	 */
	public List<String[]> getLabelPageAllCorpusLabel(Integer task_id,Integer task_group,String user_id){
/*		System.out.println(task_id.toString()+" "+task_group.toString());*/
		String sqlStmt="select ods_sentence_id,sentiment,is_irrelevent from label_ods_rst where task_id=%d and task_group=%d and user_id='%s' order by ods_sentence_id;";
		sqlStmt=String.format(sqlStmt, task_id,task_group,user_id);
		List<String[]>  labelTaskCorpusLabel=new ArrayList<String[]>();
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmt);
			while(rs.next()){
				String[] labelItem=new String[3];
				labelItem[0]=((Integer)rs.getInt(1)).toString(); //评论id
				labelItem[1]=((Integer)rs.getInt(2)).toString();  //评论情感
				labelItem[2]=((Integer)rs.getInt(3)).toString();  //评论与特征是否相关
				labelTaskCorpusLabel.add(labelItem); 
			}
			rs.close();
			close();
/*			System.out.println(labelTaskCorpus.size());
			System.out.println(labelTaskCorpus.get(1)[0]+labelTaskCorpus.get(1)[1]);*/
			return labelTaskCorpusLabel;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		} 
	}
	
	
	/**
	 * 标注页面:暂存、提交标注结果
	 * @param task_id
	 * @param task_group
	 * @param user_id
	 * @param semData
	 * @param irrData
	 */
	public void saveLabelData(Integer task_id,Integer task_group,String user_id,int[] semData,int[] irrData){
		String sqlStmtTemplate="update label_ods_rst set sentiment=%d ,is_irrelevent=%d "
				+ "where ods_sentence_id=%d and task_id=%d and task_group=%d and user_id='%s';";
		for(int i=0;i<semData.length;i++){
			String sqlStmt=String.format(sqlStmtTemplate,semData[i],irrData[i],i+1,task_id,task_group,user_id);
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
	}
	
	/**
	 * 标注页面:暂存标注结果后设置任务进度
	 * @param task_id
	 * @param task_group
	 * @param user_id
	 * @param task_progress
	 */
	public void setTaskProgress(Integer task_id,Integer task_group,String user_id,Integer task_progress){
		String sqlStmt="update label_user_task set progress=%d "
				+ "where task_id=%d and task_group=%d and user_id='%s';";
		sqlStmt=String.format(sqlStmt,task_progress,task_id,task_group,user_id);
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
	
	/**
	 * 标注页面:提交标注结果后设置任务为已完成
	 * @param task_id
	 * @param task_group 
	 * @param user_id
	 */
	//TODO 暂且设定已完成任务进度为100吧，如果标注偷懒没标完这种情况暂时先不管
	public void setTaskFinished(Integer task_id,Integer task_group,String user_id){
		String sqlStmt="update label_user_task set is_finished=1,progress=100 "
				+ "where task_id=%d and task_group=%d and user_id='%s';";
		sqlStmt=String.format(sqlStmt,task_id,task_group,user_id);
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
	
	/**
	 * 标注页:提交同时判断领取任务的三个人是否都已完成
	 * @param task_id
	 * @param task_group
	 * @return
	 */
	public boolean isTaskFinishedByAllLabeler(Integer task_id,Integer task_group){
		String sqlStmt="select count(*) from label_user_task where task_id=%d and task_group=%d and is_finished=1;";
		sqlStmt=String.format(sqlStmt, task_id,task_group);
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmt);
			rs.last();
			if(rs.getInt(1)==3){
				rs.close();
				close();
				return true;
			}else{
				rs.close();
				close();
				return false;
			}
			
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return false;
		} 
	}
	
	/**
	 * 标注页:获取已完成任务的参与用户名，辅助后续kappa计算
	 * @param task_id
	 * @param task_group
	 * @return
	 */
	public List<String> getUserIdOfFinishedTask(Integer task_id,Integer task_group){
		String sqlStmt="select user_id from label_user_task where task_id=%d and task_group=%d;";
		sqlStmt=String.format(sqlStmt,task_id, task_group);
		List<String> finishedTaskUserId=new ArrayList<String>();
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmt);
			while(rs.next()){
				finishedTaskUserId.add(rs.getString(1));
			}
			rs.close();
			close();
			return finishedTaskUserId;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		}
	}
	
	/**
	 * 标注页:对于三个人都已完成的任务 计算给定用户当前任务的标注一致度Kappa
	 * @param task_id
	 * @param task_group
	 * @param user_id_1
	 * @param user_id_2
	 * @return
	 */
	public Float getKappaOfGivenTaskAndUser(Integer task_id,Integer task_group,String user_id_1,String user_id_2){
		String sqlStmt="select count(*) from "
				+ "(select * from label_ods_rst where task_id=%d and task_group=%d and user_id='%s') as lblAnsUsr1 "
				+ "inner join "
				+ "(select * from label_ods_rst where task_id=%d and task_group=%d and user_id='%s') as lblAnsUsr2 "
				+ "on lblAnsUsr1.ods_sentence_id=lblAnsUsr2.ods_sentence_id and "
				+ "lblAnsUsr1.sentiment=lblAnsUsr2.sentiment and lblAnsUsr1.is_irrelevent=lblAnsUsr2.is_irrelevent;";
		sqlStmt=String.format(sqlStmt,task_id,task_group,user_id_1,task_id,task_group,user_id_2);
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmt);
			rs.last();
			Integer numOfAgreement=rs.getInt(1);
			float kappa=(float)numOfAgreement/100;
			return kappa;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		}
	}
	
	/**
	 * 标注页:更新给定用户给定任务的一致度Kappa
	 * @param task_id
	 * @param task_group
	 * @param user_id
	 * @param kappa
	 */
	public void updateKappaByTaskIdAndUserId(Integer task_id,Integer task_group,String user_id,Float kappa){
		String sqlStmt="update label_user_task set kappa=%f where task_id=%d and task_group=%d and user_id='%s';";
		sqlStmt=String.format(sqlStmt, kappa,task_id,task_group,user_id);
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
	
	/*********************************************************
	 * 排行榜
	 *********************************************************/
	
	/**
	 * 排行榜:计算当期总分排名
	 * @param task_group
	 * @return
	 */
	public List<String[]> getAllScoreRankList(Integer task_group){
		String sqlStmt="select tblA.uid, COALESCE(tblB.nScore,0) from ("
				+ "(select user_id as uid from label_user_task group by user_id) as tblA "
				+ "left join "
				+ "(select user_id as uid,sum(progress*kappa) as nScore from label_user_task where task_group=%d and is_finished=1 group by user_id order by sum(progress*kappa) desc) as tblB "
				+ "on tblA.uid=tblB.uid"
				+ ") order by tblB.nScore desc;";
		sqlStmt=String.format(sqlStmt, task_group);
		List<String[]>  allScoreRankList=new ArrayList<String[]>();
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmt);
			while(rs.next()){
				String[] rankItem=new String[3];
				rankItem[0]=((Integer)rs.getRow()).toString(); //排名编号
				rankItem[1]=rs.getString(1);  //用户名
				rankItem[2]=((Integer)Math.round(rs.getFloat(2))).toString();  //总分
				allScoreRankList.add(rankItem); 
			}
			rs.close();
			close();
			return allScoreRankList;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		} 
	}
	
	/**
	 * 排行榜:计算当期任务数排名
	 * @param task_group
	 * @return
	 */
	public List<String[]> getAllTaskRankList(Integer task_group){
		String sqlStmt="select tblA.uid, COALESCE(tblB.nTask,0) from ("
				+ "(select user_id as uid from label_user_task group by user_id) as tblA "
				+ "left join "
				+ "(select user_id as uid,count(*) as nTask from label_user_task "
				+ "where task_group=%d and is_finished=1 group by user_id order by count(*) desc) as tblB "
				+ "on tblA.uid=tblB.uid"
				+ ") order by tblB.nTask desc;";
		sqlStmt=String.format(sqlStmt, task_group);
		List<String[]>  allTaskRankList=new ArrayList<String[]>();
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmt);
			while(rs.next()){
				String[] rankItem=new String[3];
				rankItem[0]=((Integer)rs.getRow()).toString(); //排名编号
				rankItem[1]=rs.getString(1);  //用户名
				rankItem[2]=((Integer)rs.getInt(2)).toString();  //总任务数
				allTaskRankList.add(rankItem); 
			}
			rs.close();
			close();
			return allTaskRankList;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		} 
	}
	
	/**
	 * 排行榜:计算当期精准度排名
	 * @param task_group
	 * @return
	 */
	public List<String[]> getAllPrecisionRankList(Integer task_group){
		String sqlStmt="select tblA.uid, COALESCE(tblB.nPrecision,0) from ("
				+ "(select user_id as uid from label_user_task group by user_id) as tblA "
				+ "left join "
				+ "(select user_id as uid,avg(kappa) as nPrecision from label_user_task "
				+ "where task_group=%d and is_finished=1 group by user_id order by avg(kappa) desc) as tblB "
				+ "on tblA.uid=tblB.uid"
				+ ") order by tblB.nPrecision desc;";
		sqlStmt=String.format(sqlStmt, task_group);
		List<String[]>  allPrecisionRankList=new ArrayList<String[]>();
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmt);
			while(rs.next()){
				String[] rankItem=new String[3];
				rankItem[0]=((Integer)rs.getRow()).toString(); //排名编号
				rankItem[1]=rs.getString(1);  //用户名
				rankItem[2]=((Float)rs.getFloat(2)).toString();  //精准度
				allPrecisionRankList.add(rankItem); 
			}
			rs.close();
			close();
			return allPrecisionRankList;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		} 
	}
	
    /**
     * 排行榜：更新label_user表某个用户的总分
     * @param user_id
     * @param score
     */
	public void updateLabelUserScoreByUserId(String user_id,Integer task_group,Integer score){
		String sqlStmt="update label_user set score=%d where user_id='%s' and task_group=%d;";
		sqlStmt=String.format(sqlStmt,score,user_id,task_group);
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
	
    /**
     * 排行榜：更新label_user表某个用户的任务数
     * @param user_id
     * @param score
     */
	public void updateLabelUserTaskNumByUserId(String user_id,Integer task_group,Integer nTask){
		String sqlStmt="update label_user set nTask=%d where user_id='%s' and task_group=%d;";
		sqlStmt=String.format(sqlStmt,nTask,user_id,task_group);
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
	
    /**
     * 排行榜：更新label_user表某个用户的标注精准度
     * @param user_id
     * @param score
     */
	public void updateLabelUserPrecisionByUserId(String user_id,Integer task_group,Float Precision){
		String sqlStmt="update label_user set label_Precision=%f where user_id='%s' and task_group=%d;";
		sqlStmt=String.format(sqlStmt,Precision,user_id,task_group);
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
	
	/**
	 * 
	 * @param task_group
	 * @return
	 */
	public List<String[]> getScoreTrend(Integer task_group){
		String sqlStmtCurrentRank="select user_id,score from label_user where task_group=%d order by score desc;";
		
		sqlStmtCurrentRank=String.format(sqlStmtCurrentRank,task_group);
		List<String[]> userNameAndScoreTrend=new ArrayList<String[]>();
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmtCurrentRank);
			while(rs.next()){
				String[] rankItem=new String[4];
				int currentRank=rs.getRow();
				String userName=rs.getString(1);
				int userScore=rs.getInt(2);
				rankItem[0]=((Integer)currentRank).toString(); //排名
				rankItem[1]=userName; //用户名
				rankItem[2]=((Integer)userScore).toString(); //用户当期总分
				String sqlStmtOldScoreRank="select user_id,rankScoreOld from label_rank where task_group=%d and user_id='%s';";
				sqlStmtOldScoreRank=String.format(sqlStmtOldScoreRank, task_group,userName);
/*				System.out.println(sqlStmtOldScoreRank);*/
				Statement stmt1=conn.createStatement();
				ResultSet oldScoreRankRs=stmt1.executeQuery(sqlStmtOldScoreRank);
				oldScoreRankRs.last();
				int oldRank=oldScoreRankRs.getInt(2);
/*			    System.out.println("userName:old="+oldRank+" new="+currentRank);*/
				if(currentRank==oldRank){
					rankItem[3]="0";
				}else if(oldRank>currentRank){
					rankItem[3]="1";
				}else{
					rankItem[3]="-1";
				}
				userNameAndScoreTrend.add(rankItem);
				oldScoreRankRs.close();
				stmt1.close();
				
			}
			rs.close();
			close();
			return userNameAndScoreTrend;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		}
	}
	
	/**
	 * 
	 * @param task_group
	 * @return
	 */
	public List<String[]> getTaskTrend(Integer task_group){
		String sqlStmtCurrentRank="select user_id,nTask from label_user where task_group=%d order by nTask desc;";
		
		sqlStmtCurrentRank=String.format(sqlStmtCurrentRank,task_group);
		List<String[]> userNameAndTaskTrend=new ArrayList<String[]>();
		try{
			connect_db();
			stmt=conn.createStatement();
			ResultSet rs=stmt.executeQuery(sqlStmtCurrentRank);
			while(rs.next()){
				String[] rankItem=new String[4];
				int currentRank=rs.getRow();
				String userName=rs.getString(1);
				int userTask=rs.getInt(2);
				rankItem[0]=((Integer)currentRank).toString(); //排名
				rankItem[1]=userName; //用户名
				rankItem[2]=((Integer)userTask).toString(); //用户当期总任务数
				String sqlStmtOldTaskRank="select user_id,rankTaskOld from label_rank where task_group=%d and user_id='%s';";
				sqlStmtOldTaskRank=String.format(sqlStmtOldTaskRank, task_group,userName);
				Statement stmt1=conn.createStatement();
				ResultSet oldTaskRankRs=stmt1.executeQuery(sqlStmtOldTaskRank);
				oldTaskRankRs.last();
				int oldRank=oldTaskRankRs.getInt(2);
/*				System.out.println("userName:old="+oldRank+" new="+currentRank);*/
				if(currentRank==oldRank){
					rankItem[3]="0";
				}else if(oldRank>currentRank){
					rankItem[3]="1";
				}else{
					rankItem[3]="-1";
				}
				userNameAndTaskTrend.add(rankItem);
				oldTaskRankRs.close();
				stmt1.close();
			}
			rs.close();
			close();
			return userNameAndTaskTrend;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		}
	}
	
	/**
	 * 
	 * @param task_group
	 * @return
	 */
	public List<String[]> getPrecisionTrend(Integer task_group){
		String sqlStmtCurrentRank="select user_id,label_precision from label_user where task_group=%d order by label_precision desc;";
		
		sqlStmtCurrentRank=String.format(sqlStmtCurrentRank,task_group);
		List<String[]> userNameAndPrecisionTrend=new ArrayList<String[]>();
		try{
			connect_db();
			stmt=conn.createStatement();

			ResultSet rs=stmt.executeQuery(sqlStmtCurrentRank);
			while(rs.next()){
				String[] rankItem=new String[4];
				int currentRank=rs.getRow();
				String userName=rs.getString(1);
				float userPrecision=rs.getFloat(2);
				rankItem[0]=((Integer)currentRank).toString(); //排名
				rankItem[1]=userName; //用户名
				rankItem[2]=((Float)userPrecision).toString(); //用户当期精度
				String sqlStmtOldPrecisionRank="select user_id,rankPrecisionOld from label_rank where task_group=%d and user_id='%s';";
				sqlStmtOldPrecisionRank=String.format(sqlStmtOldPrecisionRank, task_group,userName);
				Statement stmt1=conn.createStatement();
				ResultSet oldPrecisionRankRs=stmt1.executeQuery(sqlStmtOldPrecisionRank);
				oldPrecisionRankRs.last();
				int oldRank=oldPrecisionRankRs.getInt(2);
/*				System.out.println(userName+oldRank+currentRank);*/
				if(currentRank==oldRank){
					rankItem[3]="0";
				}else if(oldRank>currentRank){
					rankItem[3]="1";
				}else{
					rankItem[3]="-1";
				}
				userNameAndPrecisionTrend.add(rankItem);
				oldPrecisionRankRs.close();
				stmt1.close();
			}
			rs.close();
			close();
			return userNameAndPrecisionTrend;
		}catch(SQLException e){
			logger.error("[group:" + this.getClass().getName() + "][message: exception][" + e.toString() +"]");
			e.printStackTrace();
			close();
			return null;
		}
	}
	
	public void updateOldRankScore(String user_id,Integer task_group,Integer new_rank){
		String sqlStmt="update label_rank set rankScoreOld=%d where user_id='%s' and task_group=%d;";
		sqlStmt=String.format(sqlStmt,new_rank,user_id,task_group);
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
	
	public void updateOldRankTask(String user_id,Integer task_group,Integer new_rank){
		String sqlStmt="update label_rank set rankTaskOld=%d where user_id='%s' and task_group=%d;";
		sqlStmt=String.format(sqlStmt,new_rank,user_id,task_group);
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
	
	public void updateOldRankPrecision(String user_id,Integer task_group,Integer new_rank){
		String sqlStmt="update label_rank set rankPrecisionOld=%d where user_id='%s' and task_group=%d;";
		sqlStmt=String.format(sqlStmt,new_rank,user_id,task_group);
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
}
