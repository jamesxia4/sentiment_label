/**
 * 排名趋势定时刷新
 */
package com.netease.ux.dataLabel;

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
	@Override
	public void run(){
		try {
			System.out.println(new Date());
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}
