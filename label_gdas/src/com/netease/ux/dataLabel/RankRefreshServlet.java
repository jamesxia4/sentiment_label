package com.netease.ux.dataLabel;

import java.io.*;
import com.netease.ux.dataLabel.*;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Timer;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;



public class RankRefreshServlet implements ServletContextListener {
	private Timer timer = null;
	
	public void contextInitialized(ServletContextEvent arg0) {
		timer=new Timer(true);
		timer.schedule(new TimerRankRefresh(),0,1000*3);//延迟0秒，每60秒执行一次TimerRankRefresh()
	}
	
	public void contextDestroyed(ServletContextEvent arg0) {
		timer.cancel();
	}
}
