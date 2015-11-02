package com.netease.ux.dataLabel;

import java.io.*;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
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
//@WebServlet(asyncSupported = true, urlPatterns = { "/lobby" })
public class LobbyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LobbyServlet() {
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
        DataLabel testLogicLayer=new DataLabel();
        
        //参数:task_group=xxx&user_id=xxx
        Integer task_group_from_url=Integer.parseInt(request.getParameter("task_group"));
		JSONObject testObject=testLogicLayer.getLobbyAllTasksInfo(task_group_from_url,request.getParameter("user_id"));
		System.out.println(testObject.toString());
		out.println(testObject.toString());
    }

/*	*//**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 *//*
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}*/

}
