<%@ page import = "java.sql.*, java.lang.*, java.util.*, java.io.*, java.text.*, java.net.*" %>
<%@ page import = "com.n2n.DB.DBManager, com.n2n.util.N2NConst, com.n2n.DB.N2NDBObject" %>
<%@ include file='common.jsp'%>
<% 
	java.util.Date dtNow = new java.util.Date();
	SimpleDateFormat dt1 = new SimpleDateFormat("yyyy-MM-dd");
	SimpleDateFormat dt2 = new SimpleDateFormat("dd-MM-yyyy");

	String sdtFrom = request.getParameter("dtFrom");
	String sdtTo = request.getParameter("dtTo");

	sdtFrom = sdtFrom != null ? sdtFrom : "";
	sdtTo = sdtTo != null ? sdtTo : "";

	String dtFrom = "";
	String dtTo = "";

	if(sdtFrom.length()==0) {
		sdtFrom = "2012-25-08";
		dtFrom = "25-08-2012";
	} else {
		dtFrom = sdtFrom;
		sdtFrom = sdtFrom.substring(6,10) + "-" + sdtFrom.substring(3,5) + "-" + sdtFrom.substring(0,2);
	}

	if(sdtTo.length()==0) {
		sdtTo = dt1.format(dtNow);
		dtTo = dt2.format(dtNow);
	} else {
		dtTo = sdtTo;
		sdtTo = sdtTo.substring(6,10) + "-" + sdtTo.substring(3,5) + "-" + sdtTo.substring(0,2);
	}

	StringBuffer sb = new StringBuffer();
	String sTemp = "";

	try {
		String driver = oN2NSession.getSetting("DBDriver");
		String url = oN2NSession.getSetting("DBURL");
		String userID = oN2NSession.getSetting("DBUID");
		String userPwd = oN2NSession.getSetting("DBPwd");
		String sSP = "usp_mfGetRegCli";

		Object[][] m_oParam = null;
	        N2NConst m_const = new N2NConst();
	        DBManager m_db = new DBManager();
	        N2NDBObject m_dbObject;
	        ResultSet m_dataResultSet;

	        m_db.openConnection(driver, url, userID, userPwd);

	        m_oParam = new Object[][]
	        {
	            {m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, sdtFrom, m_const.TYPES_EMPTY},
	            {m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, sdtTo, m_const.TYPES_EMPTY}
	        };
						
	        m_dbObject = new N2NDBObject();
	        m_dbObject.setSP(sSP);
	        m_dbObject.setParam(m_oParam);
							
System.out.println("[admGetRegCliInfo] " + sSP + " '" + sdtFrom + "', '" + sdtTo + "'");
	        m_db.runRsSP(m_dbObject);
	        m_dataResultSet = m_dbObject.getResultSet();
		sb.append("<table border=1 cellpadding=1 cellspacing=1 width='100%'>");

	        if (m_dataResultSet != null) {
			sb.append("<tr><th>Name</th>");
			sb.append("<th>Login ID</th>");
			sb.append("<th>Matric. No.</th>");
			sb.append("<th>Category (M-Leader,R-Member)</th>");
			sb.append("<th>Group</th>");
			sb.append("<th>Institution</th>");
			sb.append("<th>Country</th>");
			sb.append("<th>Tel. No.</th>");
			sb.append("<th>Email</th>");
			sb.append("<th>Correspondence Address</th>");
			sb.append("<th>Registration Date</th></tr>");

			while (m_dataResultSet.next()) {
				sTemp = m_dataResultSet.getString("CliName");
				sTemp = sTemp != null ? sTemp : "";
				sb.append("<tr><td>"+sTemp+"</td>");

				sTemp = m_dataResultSet.getString("LoginID");
				sTemp = sTemp != null ? sTemp : "";
				sb.append("<td>"+sTemp+"</td>");

				sTemp = m_dataResultSet.getString("ICNo");
				sTemp = sTemp != null ? sTemp : "";
				sb.append("<td>"+sTemp+"</td>");

				sTemp = m_dataResultSet.getString("Category");
				sTemp = sTemp != null ? sTemp : "";
				sb.append("<td>"+sTemp+"</td>");

				sTemp = m_dataResultSet.getString("Add1");
				sTemp = sTemp != null ? sTemp : "";
				sb.append("<td>"+sTemp+"</td>");

				sTemp = m_dataResultSet.getString("Add2");
				sTemp = sTemp != null ? sTemp : "";
				sb.append("<td>"+sTemp+"</td>");

				sTemp = m_dataResultSet.getString("Country");
				sTemp = sTemp != null ? sTemp : "";
				sb.append("<td>"+sTemp+"</td>");

				sTemp = m_dataResultSet.getString("Telno");
				sTemp = sTemp != null ? sTemp : "";
				sb.append("<td>"+sTemp+"</td>");

				sTemp = m_dataResultSet.getString("Email");
				sTemp = sTemp != null ? sTemp : "";
				sb.append("<td>"+sTemp+"</td>");

				sTemp = m_dataResultSet.getString("Add3");
				sTemp = sTemp != null ? sTemp : "";
				sb.append("<td>"+sTemp+"</td>");

				sTemp = m_dataResultSet.getString("RegDate");
				sTemp = sTemp != null ? sTemp : "";
				try {
					sTemp =  sTemp.substring(8,10) + "/" + sTemp.substring(5,7) + "/" + sTemp.substring(0,4);
				} catch(Exception e) {
					sTemp = sTemp;
				}
				sb.append("<td align=right>"+sTemp+"</td></tr>");
			}
		}
		
		m_db.closeConnection(m_dbObject);
		sb.append("</table>");
		
	} catch (Exception ex) {
		System.out.println("CIMB SG -> admGetRegCliInfo.jsp: " + ex.getMessage());
		ex.printStackTrace();
	}
	
%>
<html>
<head>
<title><%=oN2NSession.getSetting("WebSiteName")%> - Registered Client List</title>
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">
<script language='JavaScript' src='<%=g_sJSPath%>/N2NCtrl.js'></script>
</head>
<body>
<form id="frmGetRegCliInfo" name="frmGetRegCliInfo" action="admGetRegCliInfo.jsp" method="post" onsubmit="javascript:return btnSubmit_OnClick();">
<table border=0 cellpadding=0 cellspacing=0 width='60%'>
<tr><td colspan=6><b><u>Registered Client List</u></b></td>
</tr>
<tr><td colspan=6>&nbsp;</td>
</tr>
<tr>			
			<td><b>Date</b></td>
			<td width='10%'>FROM</td>
			<td width='15%'>
				<html:N2N_HtmlObject type="calendar" objectName="frmGetRegCliInfo.dtFrom" defaultValue="<%=dtFrom%>"/>
			</td>
			<td width='10%'> TO</td>
			<td width='15%'>
				<html:N2N_HtmlObject type="calendar" objectName="frmGetRegCliInfo.dtTo" defaultValue="<%=dtTo%>"/>
			</td>
			<td width='20%' align='right'><input type=submit value=Search id=btnSubmit name=btnSubmit class=clsContact style='width:54'></td>
</tr>
<tr><td colspan=6>&nbsp;</td>
</tr>
</table>
<%=sb.toString()%>
</form>
<script language="JavaScript">
function btnSubmit_OnClick() {
	var sdtFrom = formatDateToODBC(1,document.getElementById("dtFrom").value);
	var sdtTo = formatDateToODBC(1,document.getElementById("dtTo").value);

	if (sdtFrom > sdtTo) {
		alert ("From Date cannot greater than To Date!");
		document.getElementById("dtTo").focus();
		return false;
	}

	if(sdtFrom < '2012-08-25') {
		alert ("From Date cannot before 25-08-2012");
		document.getElementById("dtFrom").focus();
		return false;
	}

	document.getElementById("dtFrom").value

	return true;

}
</script>
</body>
</html>