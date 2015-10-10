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

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;

public class DataLabelTest extends TestCase{

	@Test
	public void testGetAllTaskId(){
		DataLabel testLogicLayer=new DataLabel();
		List<String> taskIdList=testLogicLayer.getAllTaskId();
		Integer task_id_to_check=1;
		for(String task_id:taskIdList){
			assertEquals(task_id,task_id_to_check.toString());
			task_id_to_check++;
		}
		assertEquals(task_id_to_check.toString(),((Integer)6).toString());
	}
	
	@Test
	public void testGetLobbyAllTaskIdAndDates(){
		DataLabel testLogicLayer=new DataLabel();
		HashMap<Integer,String> taskIdAndDates=testLogicLayer.getLobbyAllTaskIdAndDates();
		Iterator iterDates=taskIdAndDates.entrySet().iterator();
		while(iterDates.hasNext()){
			Map.Entry entryDates=(Map.Entry) iterDates.next();
			Object date=entryDates.getValue();
/*			System.out.println((String)date);*/
		}
	}
	
	@Test
	public void testGetLobbyAllTaskIdAndProgress(){
		DataLabel testLogicLayer=new DataLabel();
		HashMap<Integer,String> taskIdAndProgress=testLogicLayer.getLobbyAllTaskIdAndProgress();
		Iterator iterProgress=taskIdAndProgress.entrySet().iterator();
		while(iterProgress.hasNext()){
			Map.Entry entryProgress=(Map.Entry) iterProgress.next();
			Object progress=entryProgress.getValue();
/*			System.out.println((String)progress);*/
		}
	}
	
	@Test
	public void testGetLobbyAllTaskInfo() {
		DataLabel testLogicLayer=new DataLabel();
		JSONObject testObject=testLogicLayer.getLobbyAllTaskInfo();
		System.out.println(testObject.toString());
	}
	
	@Test
	public void testGetDatesByTaskId(){
		DataLabel testLogicLayer=new DataLabel();
		String testDate=testLogicLayer.getDatesByTaskId(1);
		assertEquals("2015-09-16 16:00:00.0--2015-09-17 16:00:00.0",testDate);
	}
	
	@Test 
	public void testGetAllUserProgressByTaskId(){
		DataLabel testLogicLayer=new DataLabel();
		JSONObject testObject=testLogicLayer.getAllUserProgressByTaskId(1);
		System.out.println(testObject.toString());
	}
	
	@Test
	public void testGetTakenTaskTimeAndProgress(){
		DataLabel testLogicLayer=new DataLabel();
		JSONObject testObject=testLogicLayer.getTakenTaskTimeAndProgress("James");
		System.out.println(testObject.toString());
	}
	
	@Test
	public void testGetAllFinishedTaskInfo(){
		DataLabel testLogicLayer=new DataLabel();
		JSONObject testObject=testLogicLayer.getAllFinishedTaskInfo("Mary");
		System.out.println(testObject.toString());
	}
	
	@Test
	public void testGetAllRank(){
		DataLabel testLogicLayer=new DataLabel();
		JSONArray testObject=testLogicLayer.getAllRank();
		System.out.println(testObject.toString());
	}
	
	@Test
	public void testGetAllItemToLabel(){
		DataLabel testLogicLayer=new DataLabel();
		JSONObject testObject=testLogicLayer.getAllItemToLabel((Integer)1);
/*		System.out.println(testObject.toString());*/
	}
	
}

