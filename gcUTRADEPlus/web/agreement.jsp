<%@ page import = "java.sql.*, java.lang.*, java.util.Date, java.text.SimpleDateFormat, com.n2n.util.N2NConst" %>
<%@ include file='../common.jsp'%>
<%@ include file='../util/sessionCheck.jsp'%>

<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<jsp:useBean id="clibean" class="com.n2n.bean.N2NMFCliInfoBean" scope="page"/>
<jsp:setProperty name="clibean" property="*" />

<%
boolean m_bConnected = false;
com.n2n.DB.DBManager m_db = new com.n2n.DB.DBManager();
com.n2n.DB.N2NDBObject m_dbObject = new com.n2n.DB.N2NDBObject();
try {
	m_db.openConnection(oN2NSession.getSetting("DBDriver"), oN2NSession.getSetting("DBURL"), oN2NSession.getSetting("DBUID"), oN2NSession.getSetting("DBPwd"));
	m_bConnected = true;
} catch (SQLException ex) {
	ex.printStackTrace();
	m_bConnected = false;
}

String url_base_path = request.getRequestURL().toString().substring(0,request.getRequestURL().toString().indexOf("/")+2);

String agreement_type = "T&CAGREE";
String status = checkStatus(g_sCliCode,m_db,m_dbObject,agreement_type);
System.out.println("cliChkAgreement:"+status);
//out.println("status:"+status+"|clicode:"+g_sCliCode);
if (status!=null && status.equals("N")) {
	out.println("<script language=javascript>window.close();</script>");
}

String agreed = request.getParameter("actions")!=null?request.getParameter("actions").toString():"";
boolean g_validSession = false;
if (session.getAttribute("uuid")!=null) {
	if (!session.getAttribute("uuid").equals("")) {
		validSession = false;
	}
}
g_validSession = validSession;
if (g_validSession) {
if (agreed.equalsIgnoreCase("agreed")) {
System.out.println("cliChkAgreement g_sCliCode:"+g_sCliCode+"|g_sLoginId:"+g_sLoginId+"|");
	updateTnCIndicator(g_sCliCode,g_sLoginId,m_db,m_dbObject,agreement_type);
	session.setAttribute("agreement_"+g_sLoginId,""+new java.util.Date());
//	out.println("<script language=javascript>alert('Thank you. You have successfully agreed with Terms & Conditions.'); window.close();</script>");
	out.println("<script language=javascript>window.location.href=\"/"+oN2NSession.getSetting("projectFolder")+oN2NSession.getSetting("HTMLRealTimePageTCLite")+"\"</script>");
}
} else {
	out.println("<script language=javascript>alert('Web session expired. Kindly login and try again.'); window.close();</script>");
}

if (m_db!=null) {
	if (m_dbObject!=null) {
		m_db.closeConnection(m_dbObject);
	}
}

%>
<html>
<head>
	<META content="-1" http-equiv="Expires">
	<META content="no-cache" http-equiv="Pragma">
	<META content="no-cache" http-equiv="Cache-Control">	
	<link rel=stylesheet type=text/css href=<%=g_sStylePath%>/default.css>
	<title><%=oN2NSession.getSetting("WebSiteName")%> - Terms & Conditions</title>
	<script language=JavaScript src="<%=g_sJSPath%>/N2NCtrl.js"></script>
<style type="text/css">

body  {
	margin: 0; /* it's good practice to zero the margin and padding of the body element to account for differing browser defaults */
	padding: 0;
	background: white;
}
</style>
</head>

<body>
	<form name="cliTermCondFrm" method=post action="<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/web/agreement.jsp?actions=agreed">
<table width="700" style="border: medium solid black; border-width: 1.25pt; text-align: justify;">
<tbody>
<tr class=clsSectionHeader><td>
<font style='font-size:18pt;text-indent:5mm'><b>Terms & Conditions</b></font>
</td></tr>
<tr><td height=500>
<iframe src='/doc/gcCIMB/YouthStockChallengeTnC.pdf' scrolling=no width='100%' height='100%'></iframe>
</td></tr>
<tr>
<td><input type="checkbox" name="chkRead" value="R"><font style="font: 12px/14px TAHOMA;">Yes, I/We have read and understood the terms & conditions</font></td></tr>
<tr><td>&nbsp;</td></tr>
<tr>
<td width='94%' align=center><input accessKey=R id=Register name=Register onclick="OpenReg()" style="WIDTH: 230px; CURSOR: hand" type=button value="AGREED">
<input type=hidden id=chkAgree name=chkAgree value="A">
</tr>
</tbody></table>
</form>
</body>
</html>
<script language=javascript>
	frm = document.cliTermCondFrm;
	
	function OpenReg(){
if (frm.chkRead.checked) {
		frm.action="<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/web/agreement.jsp?actions=agreed";
		frm.submit();
} else {
alert("Please read the Terms & Conditions, and place a tick to it");
}
	}

	function revert() {
		window.close();
	}
</script>

<%!
public String updateTnCIndicator(String clientCode, String loginID, com.n2n.DB.DBManager m_db, com.n2n.DB.N2NDBObject m_dbObject, String indicator_type){
	Object[][] m_oParam = null;
	int m_nRetCode = 0;
	try {	
		m_oParam = new Object[][] {	
			{new Integer(2), new Integer(Types.VARCHAR), clientCode, new String("")},
			{new Integer(2), new Integer(Types.VARCHAR), loginID, new String("")},
			{new Integer(3), new Integer(Types.VARCHAR), new Integer(""+m_nRetCode), new String("")},
			{new Integer(2), new Integer(Types.VARCHAR), indicator_type, new String("")}
		};
		
		m_dbObject = new com.n2n.DB.N2NDBObject();
		m_dbObject.setSP("usp_mfInsCliTCInfo");
		System.out.println("usp_mfInsCliTCInfo '"+clientCode+"','"+loginID+"','"+m_nRetCode+"','"+indicator_type+"'");
		m_dbObject.setParam(m_oParam);
		m_db.runAdvSP(m_dbObject);
		m_dbObject.getParam();	
		try {
			m_nRetCode = ((Integer) m_oParam[2][3]).intValue();
		} catch (Exception e) {
			System.out.println("Exception:"+e.getMessage());
		}
		return ""+m_nRetCode;
	} catch (SQLException ex) {
		System.err.println("updateTnCIndicator:" + ex.getMessage());
		ex.printStackTrace();
		return null;
	}				
}
public String checkStatus(String clientCode, com.n2n.DB.DBManager m_db, com.n2n.DB.N2NDBObject m_dbObject, String indicator_type){
String value = "";
	try {	
		m_dbObject = new com.n2n.DB.N2NDBObject();
		m_dbObject.setSQL("usp_mfGetCliLoginInfo '"+clientCode+"' ");
		System.out.println("m_dbObject:"+m_dbObject.getSQL());
		m_db.runRsSQL(m_dbObject);
		if (m_dbObject.getResultSet()!=null) {
			while (m_dbObject.getResultSet().next()) {
				if (indicator_type.equals("T&CAGREE")) {
					value = m_dbObject.getResultSet().getString("UpdTCInfo");
				} else {
					value = m_dbObject.getResultSet().getString("UpdTCInfo");
				}
			}
		}
		return value;
	} catch (SQLException ex) {
		System.err.println("checkStatus:" + ex.getMessage());
		ex.printStackTrace();
		return null;
	}				
}
%>
