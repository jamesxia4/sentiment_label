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
 * Servlet implementation class LabelServlet
 */

public class LabelServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LabelServlet() {
        super();
    }

	/**
	 * 
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
/*        System.out.println( Integer.parseInt(request.getParameter("task_id")) );
        System.out.println( Integer.parseInt(request.getParameter("task_group")) );
        System.out.println( request.getParameter("user_id") );*/
		JSONObject labelObject=labelHandler.getLabelCorpus(Integer.parseInt(request.getParameter("task_id")),Integer.parseInt(request.getParameter("task_group")),request.getParameter("user_id"));
		out.println(labelObject.toString());
		out.flush();
		out.close();
	}

	/**
	 * 
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html;charset=utf-8"); 
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        
        response.setHeader("Pragma","No-Cache");
		response.setHeader("Cache-Control","No-Cache");
		response.setDateHeader("Ewindowsxpires", 0);
		
		Integer task_id=Integer.parseInt(request.getParameter("task_id"));
		Integer task_group=Integer.parseInt(request.getParameter("task_group"));
		String user_id=request.getParameter("user_id");
		String semData=request.getParameter("semLabelData");
		String irrData=request.getParameter("irrLabelData");
		String reqType=request.getParameter("reqType");
		
/*		System.out.println(task_id);
		System.out.println(task_group);
		System.out.println(user_id);
		System.out.println(semData);
		System.out.println(irrData);
		System.out.println(reqType);*/
		
		
		JSONArray jsonSemData=JSONArray.fromObject(semData);
		JSONArray jsonIrrData=JSONArray.fromObject(irrData);

		DataLabel labelHandler=new DataLabel("../workspace/sentiment_label/label_gdas/config/dbConfig.cfg");
		if(reqType.equals("save")){
			labelHandler.saveLabelData(task_id,task_group,user_id,jsonSemData,jsonIrrData);
			PrintWriter out= response.getWriter();
			out.println("结果暂存成功");
			out.flush();
			out.close();
		}else if(reqType.equals("submit")){
			labelHandler.submitLabelData(task_id,task_group,user_id,jsonSemData,jsonIrrData);
			PrintWriter out= response.getWriter();
			out.println("结果提交成功");
			out.flush();
			out.close();
		}else{
			PrintWriter out= response.getWriter();
			out.println("参数异常，请检查");
			out.flush();
			out.close();
		}
		
	}

}
