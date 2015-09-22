/**
 * 环境参数配置
 * @author hzxiayuanfang@corp.netease.com
 * @version 0.1
 * @2015-09-14
 */
package com.netease.ux.dataLabel;


import java.io.*;
import java.util.*;
import java.lang.*;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
//用于对properties 这类配置文件做映射，支持key
//www.cnblog.com/lingiu/p/3468464.html
import java.util.Properties; 


public class Config {
	private Properties dbProp=null;
	public Config(String configFilePath){
		dbProp = new Properties();
		try{
			FileInputStream inputConfig=new FileInputStream(configFilePath);
			dbProp.load(inputConfig);
/*			System.out.println("Loading Config..Complete\n");*/
		}
		catch(FileNotFoundException e){
			e.printStackTrace();
		}
		catch(IOException e){
			e.printStackTrace();
		}
	}
	
	public Properties getProperties(){
		return this.dbProp;
	}
}
