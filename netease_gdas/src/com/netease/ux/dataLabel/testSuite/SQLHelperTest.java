/**
 * 数据库操作封装 单元测试
 * @author hzxiayuanfang@corp.netease.com
 * @version 0.1
 * @2015-09-14
 */
package com.netease.ux.dataLabel.testSuite;

import org.junit.*;
import static org.junit.Assert.*;
import org.junit.Test;
import junit.framework.*;
import junit.framework.TestCase;

import com.netease.ux.dataLabel.*;
public class SQLHelperTest extends TestCase{
	@Test
	public void testSQLHelper() {
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		assertEquals("com.mysql.jdbc.Driver",testSQL.SQLInfo("dbDriver"));
		assertEquals("root",testSQL.SQLInfo("dbUsername"));
		assertEquals("biubiubiu",testSQL.SQLInfo("dbPassword"));
		assertEquals("jdbc:mysql://localhost:3306/label_netease_gdas?useUnicode=True&characterEncoding=utf-8",testSQL.SQLInfo("dbUrl"));
		assertEquals("True",testSQL.SQLInfo("connection"));
		System.out.println("In test--SQLHelper Constructor\n");
	}

	@Test
	public void testSQLInfo() {
		Config mysqlConfig=new Config("D:/config/dbConfig.cfg");
		SQLHelper testSQL=new SQLHelper(mysqlConfig);
		assertEquals("com.mysql.jdbc.Driver",testSQL.SQLInfo("dbDriver"));
		assertEquals("root",testSQL.SQLInfo("dbUsername"));
		assertEquals("biubiubiu",testSQL.SQLInfo("dbPassword"));
		assertEquals("jdbc:mysql://localhost:3306/label_netease_gdas?useUnicode=True&characterEncoding=utf-8",testSQL.SQLInfo("dbUrl"));
		assertEquals("True",testSQL.SQLInfo("connection"));
		assertNull(testSQL.SQLInfo("123123123"));
		System.out.println("In test--SQLHelper SQLInfo");
	}

}
