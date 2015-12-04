package com.netease.ux.dataLabel;

import java.io.*;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.netease.ux.dataLabel.*;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;

/**
 * Servlet implementation class LobbyServlet
 */

public class LobbyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LobbyServlet() {
        super();
    }

	/**
	 * doGet：根据用户选择期数及其用户名输出任务大厅
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html;charset=utf-8"); 
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        
        response.setHeader("Pragma","No-Cache");
		response.setHeader("Cache-Control","No-Cache");
		response.setDateHeader("Ewindowsxpires", 0);
		
        PrintWriter out= response.getWriter();
        DataLabel labelHandler=new DataLabel("../workspace/sentiment_label/label_gdas/config/dbConfig.cfg");
        
        //参数:task_group=xxx&user_id=xxx
        Integer task_group_from_url=Integer.parseInt(request.getParameter("task_group"));
		JSONObject labelObject=labelHandler.getLobbyAllTasksInfo(task_group_from_url,request.getParameter("user_id"));
		out.println(labelObject.toString());
		out.flush();
		out.close();
    }

	/**
	 * doPost:根据用户选择领取任务并更新数据库
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html;charset=utf-8"); 
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        response.setHeader("Pragma","No-Cache");
		response.setHeader("Cache-Control","No-Cache");
		response.setDateHeader("Ewindowsxpires", 0);
		
		PrintWriter out = response.getWriter();
		DataLabel labelHandler=new DataLabel("../workspace/sentiment_label/label_gdas/config/dbConfig.cfg");
		
		//处理post表单
		Integer task_id=Integer.parseInt(request.getParameter("task_id"));
		Integer task_group=Integer.parseInt(request.getParameter("task_group"));
		String user_id=request.getParameter("user_id");
		
		JSONObject labelObject=labelHandler.setUserNewTask(task_group, task_id, user_id);
		out.println(labelObject.toString());		
		out.close();
	}

}
