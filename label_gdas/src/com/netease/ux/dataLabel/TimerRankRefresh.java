/**
 * 排名趋势定时刷新
 */
package com.netease.ux.dataLabel;

import com.netease.ux.dataLabel.*;

import java.util.Date;
import java.util.TimerTask;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import java.util.ArrayList;
import java.util.List;


import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class TimerRankRefresh extends TimerTask{
	public Integer task_group;
	public DataLabel labelHandler=new DataLabel("../workspace/sentiment_label/label_gdas/config/dbConfig.cfg");
	

	public TimerRankRefresh(Integer taskGroup){
		task_group=taskGroup;
	}
	@Override
	public void run(){
		try {
			System.out.println(new Date());
			labelHandler.updateNewRank(task_group);
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}
