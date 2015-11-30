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
	public void testGetLobbyAllTasksInfo(){
		DataLabel testLogicLayer=new DataLabel("config/dbConfig.cfg");
		JSONObject testObject=testLogicLayer.getLobbyAllTasksInfo(1,"hzxiayuanfang");
		//System.out.println(testObject.toString());
	}
	
	@Test 
	public void testGetMyTaskAllUnfinishedTaskInfo(){
		DataLabel testLogicLayer=new DataLabel("config/dbConfig.cfg");
		JSONObject testObject=testLogicLayer.getMyTaskAllUnfinishedTaskInfo("hzxiayuanfang");
		//System.out.println(testObject.toString());
	}
	
	@Test 
	public void testGetMyTaskAllinishedTaskInfo(){
		DataLabel testLogicLayer=new DataLabel("config/dbConfig.cfg");
		JSONObject testObject=testLogicLayer.getMyTaskAllFinishedTaskInfo("hzxiayuanfang");
		//System.out.println(testObject.toString());
	}
	
	@Test 
	public void testGetLabelCorpus(){
		DataLabel testLogicLayer=new DataLabel("config/dbConfig.cfg");
		JSONObject testObject=testLogicLayer.getLabelCorpus(1,1);
		System.out.println(testObject.toString());
	}
}

