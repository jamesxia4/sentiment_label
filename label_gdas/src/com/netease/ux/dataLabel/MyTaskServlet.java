package com.netease.ux.dataLabel;

import java.io.*;

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
 * Servlet implementation class MyTaskServlet
 */

public class MyTaskServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public MyTaskServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
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
        
        //参数:user_id=xxx&req_type=1 输出未完成任务信息
        Integer req_type=Integer.parseInt(request.getParameter("req_type"));
        if(req_type==1){
/*        	System.out.println("Eureka");*/
			JSONObject labelObject=labelHandler.getMyTaskAllUnfinishedTaskInfo(request.getParameter("user_id"));
			out.println(labelObject.toString());
        }else if(req_type==2){
/*        	System.out.println("Eureka1");*/
        	JSONObject labelObject=labelHandler.getMyTaskAllFinishedTaskInfo(request.getParameter("user_id"));
			out.println(labelObject.toString());
        }
        out.flush();
        out.close();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
