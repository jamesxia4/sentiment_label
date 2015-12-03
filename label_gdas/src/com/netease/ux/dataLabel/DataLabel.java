/**
 * 业务逻辑封装
 * @version 0.2
 * @2015-11-04
 */

package com.netease.ux.dataLabel;

import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import java.util.ArrayList;
import java.util.List;


import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class DataLabel implements java.io.Serializable{
	private SQLHelper dbHelper=null;
	public DataLabel(String configFullPath){
		//如果是tomcat调用,当前的根文件夹就是tomcat的文件夹
		Config mysqlConfig=new Config(configFullPath);
		dbHelper=new SQLHelper(mysqlConfig);
	}
	
	//任务大厅:显示所有任务
	//TODO 与期数联调
	public JSONObject getLobbyAllTasksInfo(Integer task_group,String user_id){
		//用了LinkedHashMap就解决了Json无序的问题啦.
		HashMap<String,String[]> taskIdAndInfo=new LinkedHashMap<String,String[]>();
		
		List<String[]> rsInfo=dbHelper.getLobbyAllTasks(task_group);
		List<String[]> rsNumTaken=dbHelper.getLobbyAllTasksTakenByUsers(task_group);
		Integer numUnfinished=dbHelper.getLobbyNumberOfUnfinishedTask(task_group, user_id, 100);
		for(int i=0;i<rsInfo.size();i++){
			String[] task_info=new String[12];
			
			Integer task_id=Integer.parseInt(rsInfo.get(i)[0]);
			String str_task_id=rsInfo.get(i)[0];
			task_info[0]=rsInfo.get(i)[0];	//任务id
			task_info[1]=rsInfo.get(i)[1];	//任务组
			task_info[2]=rsInfo.get(i)[2];	//任务剩余时间
			task_info[3]=rsInfo.get(i)[3];  //任务名
			task_info[4]=rsInfo.get(i)[4];  //数据采集时间
			task_info[5]=rsInfo.get(i)[5];  //数据来源游戏名
			task_info[6]=rsInfo.get(i)[6];  //数据来源
			task_info[7]=rsInfo.get(i)[7];  //任务大小
			task_info[8]=rsInfo.get(i)[8];  //任务类型
			task_info[9]=rsInfo.get(i)[9];  //InfoboxText
			
			Integer numTaken=Integer.parseInt(rsNumTaken.get(i)[2]); //任务已领人数
			task_info[10]=((Integer)numTaken).toString(); //任务已领人数
			
			//是否已被领取
			Integer isTakenByUser=dbHelper.getLobbyTaskIsTakenByUser(task_group,task_id,user_id);
			
			//未完成任务数<=4可以继续接活
			if(numUnfinished<=4){
				if(numTaken<3 && isTakenByUser==0){
					task_info[11]="领取任务";
				}
				else if(numTaken==3 && isTakenByUser==0)
				{
					task_info[11]="人数已满";
				}
				else if(numTaken==3 && isTakenByUser==1)
				{
					task_info[11]="已领取";
				}
				else
				{
					task_info[11]="已领取";
				}
			//>=5以后不允许继续接任务
			}else{
				if(isTakenByUser==1){
					task_info[11]="已领取";
				}
				else if(numTaken==3){
					task_info[11]="人数已满";
				}
				else{
					task_info[11]="不可用";
				}
			}
			taskIdAndInfo.put(str_task_id, task_info);
		}
		return JSONObject.fromObject(taskIdAndInfo);
	}
	
	//任务大厅:领取任务
	public JSONObject setUserNewTask(Integer task_group,Integer task_id,String user_id){
		dbHelper.setNewTaskToBeTaken(task_id, task_group, user_id);
		dbHelper.loadLabelItemsFromSrcIntoRst(task_id, task_group, user_id);
		return getLobbyAllTasksInfo(task_group,user_id);
	}
	
	
	//我的任务:已领未完成任务
	public JSONObject getMyTaskAllUnfinishedTaskInfo(String user_id){
		HashMap<String,String[]> myUnfinishedTaskInfo=new LinkedHashMap<String,String[]>();
		List<String[]> rsInfo=dbHelper.getMyTaskAllUnfinishedTaskInfo(user_id);
		List<String[]> rsNumTaken=dbHelper.getMyTaskUnfinishedTaskTakenByUser(user_id);
		
		for(int i=0;i<rsInfo.size();i++){
			String[] task_info=new String[11];
			
			String str_task_id=rsInfo.get(i)[0];
			task_info[0]=rsInfo.get(i)[0];	//任务id
			task_info[1]=rsInfo.get(i)[1];	//任务组
			task_info[2]=rsInfo.get(i)[2];	//任务剩余时间
			task_info[3]=rsInfo.get(i)[3];  //任务名
			task_info[4]=rsInfo.get(i)[4];  //数据采集时间
			task_info[5]=rsInfo.get(i)[5];  //数据来源游戏名
			task_info[6]=rsInfo.get(i)[6];  //数据来源
			task_info[7]=rsInfo.get(i)[7];  //任务大小
			task_info[8]=rsInfo.get(i)[8];  //任务类型
			task_info[9]=rsInfo.get(i)[9];  //InfoboxText
			
			Integer numTaken=Integer.parseInt(rsNumTaken.get(i)[2]); //任务已领人数
			task_info[10]=((Integer)numTaken).toString(); //任务已领人数
			myUnfinishedTaskInfo.put(str_task_id, task_info);
		}
		
		return JSONObject.fromObject(myUnfinishedTaskInfo);
	}
	
	//我的任务:已完成任务
	public JSONObject getMyTaskAllFinishedTaskInfo(String user_id){
		HashMap<String,String[]> myFinishedTaskInfo=new LinkedHashMap<String,String[]>();
		List<String[]> rsInfo=dbHelper.getMyTaskAllFinishedTaskInfo(user_id);
		
		for(int i=0;i<rsInfo.size();i++){
			String[] task_info=new String[6];
			
			String str_task_id=rsInfo.get(i)[0];
			task_info[0]=rsInfo.get(i)[0];	//任务id
			task_info[1]=rsInfo.get(i)[1];	//任务组
			task_info[2]=rsInfo.get(i)[2];	//任务名
			task_info[3]=rsInfo.get(i)[3];  //任务大小
			task_info[4]=rsInfo.get(i)[4];  //任务精确度
			//TODO 等排名弄好了再改这里
			task_info[5]=rsInfo.get(i)[5];  //任务排名
/*			System.out.println(task_info[5]);*/

			myFinishedTaskInfo.put(str_task_id, task_info);
		}
		
		return JSONObject.fromObject(myFinishedTaskInfo);
	}
	
	//标注页:获取标注条目信息
	public JSONObject getLabelCorpus(Integer task_id,Integer task_group,String user_id){
		HashMap<String,String[]> labelCorpus=new LinkedHashMap<String,String[]>();
		List<String[]> rsCorpus=dbHelper.getLabelPageAllCorpus(task_id,task_group);
		List<String[]> rsCorpusLabel=dbHelper.getLabelPageAllCorpusLabel(task_id,task_group,user_id);
		
		for(int i=0;i<rsCorpus.size();i++){
			String[] label_corpus_item=new String[7];
			
			String item_id=rsCorpus.get(i)[0];
			label_corpus_item[0]=rsCorpus.get(i)[1];	//评论句子
			label_corpus_item[1]=rsCorpus.get(i)[2];	//评论原文
			label_corpus_item[2]=rsCorpus.get(i)[3];	//评论特征
			label_corpus_item[3]=rsCorpus.get(i)[4];  //评论来源
			label_corpus_item[4]=rsCorpus.get(i)[5];  //评论url
			label_corpus_item[5]=rsCorpusLabel.get(i)[1];   //评论情感
			label_corpus_item[6]=rsCorpusLabel.get(i)[2];   //评论是否相关
			
			labelCorpus.put(item_id, label_corpus_item);
		}
/*		JSONObject corpus=JSONObject.fromObject(labelCorpus);
		System.out.println(corpus);
		System.out.println("pause");*/
		return JSONObject.fromObject(labelCorpus);
	}
	
	//标注页:暂存标注结果
	public void saveLabelData(Integer task_id,Integer task_group,String user_id,JSONArray jsonSemData,JSONArray jsonIrrData){
		Integer unfinishedCount=0;
		int[] semDataVal=new int[100];
		int[] irrDataVal=new int[100];
		for(int i=0;i<jsonSemData.size();i++){
			semDataVal[i]=(int)jsonSemData.get(i);
			if(semDataVal[i]!=0){
				++unfinishedCount;
			}
			irrDataVal[i]=(int)jsonIrrData.get(i);
		}
		dbHelper.saveLabelData(task_id, task_group, user_id, semDataVal, irrDataVal);
		dbHelper.setTaskProgress(task_id,task_group,user_id,unfinishedCount);
	}
	
	//暂存页:提交标注结果
	//TODO 暂且设定进度为100吧 
	public void submitLabelData(Integer task_id,Integer task_group,String user_id,JSONArray jsonSemData,JSONArray jsonIrrData){
		int[] semDataVal=new int[100];
		int[] irrDataVal=new int[100];
		for(int i=0;i<jsonSemData.size();i++){
			semDataVal[i]=(int)jsonSemData.get(i);
			irrDataVal[i]=(int)jsonIrrData.get(i);
		}
		dbHelper.saveLabelData(task_id, task_group, user_id, semDataVal, irrDataVal);
		dbHelper.setTaskFinished(task_id,task_group,user_id);
		
		//如果三个人都提交，计算Kappa，更新label_rank表，计算分数变化趋势
		if(dbHelper.isTaskFinishedByAllLabeler(task_id, task_group)){
			//计算一致性
			List<String> userList=dbHelper.getUserIdOfFinishedTask(task_id,task_group);
			float kappa_u1_u2=dbHelper.getKappaOfGivenTaskAndUser(task_id, task_group, userList.get(0), userList.get(1));
			float kappa_u1_u3=dbHelper.getKappaOfGivenTaskAndUser(task_id, task_group, userList.get(0), userList.get(2));
			float kappa_u2_u3=dbHelper.getKappaOfGivenTaskAndUser(task_id, task_group, userList.get(1), userList.get(2));
			
			float kappa_u1=(kappa_u1_u2+kappa_u1_u3)/2;
			float kappa_u2=(kappa_u1_u2+kappa_u2_u3)/2;
			float kappa_u3=(kappa_u1_u3+kappa_u2_u3)/2;
			
			//更新label_user_task里的kappa值
			dbHelper.updateKappaByTaskIdAndUserId(task_id, task_group, userList.get(0), kappa_u1);
			dbHelper.updateKappaByTaskIdAndUserId(task_id, task_group, userList.get(1), kappa_u2);
			dbHelper.updateKappaByTaskIdAndUserId(task_id, task_group, userList.get(2), kappa_u3);
/*			System.out.println("user1:"+userList.get(0)+"="+kappa_u1);
			System.out.println("user2:"+userList.get(1)+"="+kappa_u2);
			System.out.println("user3:"+userList.get(2)+"="+kappa_u3);*/
			
			//计算
		}
	}
}
