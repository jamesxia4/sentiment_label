/**
 * GDAS系统 数据标注模块 测试脚本
 * @version 0.1
 * @2015-09-14
 */
package com.netease.ux.dataLabel.testSuite;

import junit.framework.*;
import junit.framework.TestSuite;
import junit.framework.Test;
import junit.textui.TestRunner;

public class TestAll extends TestSuite{
	public static Test suite(){
		TestSuite suite=new TestSuite("Sample Test");
/*		suite.addTestSuite(SQLHelperTest.class);*/
		suite.addTestSuite(DataLabelTest.class);
		return suite;
	}
	
	public static void main(String args[]){
		TestRunner.run(suite());
	}
}
