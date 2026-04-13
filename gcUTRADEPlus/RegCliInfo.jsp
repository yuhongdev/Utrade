<%@ include file="common.jsp"%>
<%@include file="util/sessionCheck.jsp"%>

<%@ page import = "java.sql.*,java.text.DecimalFormat,java.text.SimpleDateFormat,java.util.Date,java.util.*,java.text.*" %>
<%@ page import = "com.n2n.util.*" %>
<%@ page import = "com.n2n.bean.N2NMFCliInfoBean" %>
<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>

<%!
	public String genPrint(String g_sImgPath) {
		String strHTML = "";
		strHTML = "<img border=0 src=" + g_sImgPath + "/butPrint.gif width=18 height=18 title='Print' style='cursor:pointer' onclick='beforePrint();window.print();afterPrint();'>";
		return strHTML;
	}
	
	public String GenHelpBulb(String strTitle,String g_sImgPath) {
		String strHTML = "";
		strHTML = "<img id=imgHelp border=0 width=20 height=19 src=" + g_sImgPath + "/lightbulboff.jpg";
		strHTML = strHTML + " onmouseover=\"this.src='" + g_sImgPath + "/lightbulbon.jpg'\"";
		strHTML = strHTML + " onmouseout=\"this.src='" + g_sImgPath + "/lightbulboff.jpg'\"";
		strHTML = strHTML + " title=\"" + strTitle + "\">";		
		return strHTML;
	}
%>

<%
	ResultSet oRst = null;
	ResultSet oRst2 = null;
	String strCliCode = g_sCliCode;
try {

	if (!validSession) {
		out.println("<script language='javascript'>");
		out.println("	alert('Please login to access this page.');");
		out.println("	parent.location.href='"+oN2NSession.getSetting("HTMLRootHome")+"'");
		out.println("</script>");			 
	} else {

%>

<html>
	<head>
		<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
		<script language=JavaScript src="<%=g_sJSPath%>/LinkFunc.js"></script>
		<script language=JavaScript src="<%=g_sJSPath%>/N2NPrnFunc.js"></script>
		<title><%=oN2NSession.getSetting("WebBHName")%> - Account Information</title>
	</head>
	
	<body class='clsBody'>		
		<table border=0 cellpadding=0 cellspacing=0 width=790>
			<tr>
				<td class=clsSectionHeader width='94%'>&nbsp;Account Information</td>
				<td width='6%'>
				<%=genPrint(g_sImgPath)%>
				<%=GenHelpBulb("Summary: Check your Account Information",g_sImgPath)%>
				</td>
			</tr>
		</table>
		<br>

		<%
			N2NMFCliInfoBean clibean = new N2NMFCliInfoBean();
			clibean.setLoginID(g_sLoginId);
			clibean.setCliCode(strCliCode);
			
			String sEmail 	= "";
			String sCliName = "";
			String sCitizenship = "";
			String sICNo = "";
			String sOldICNo = "";
			String sTitle = "";
			String sSex = "";
			String sRace = "";
			String sDOB = "";
			String sAdd1 = "";
			String sAdd2 = "";
			String sAdd3 = "";
			String sPostcode = "";
			String sCity = "";
			String sState = "";
			String sCountry = "";
			String sTelNo = "";
			String sMobile = "";
			String sOffTelNo = "";
			
	        String atpURL = session.getAttribute("ATPURLpublic")!=null?session.getAttribute("ATPURLpublic").toString().trim():oN2NSession.getSetting("atpURL");
	        com.n2n.util.N2NATPConnect atp = new com.n2n.util.N2NATPConnect(atpURL);
			com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
			context = atp.getCliInfo(clibean, oN2NSession.getSetting("tradeforgetpinpwdID"));
			java.util.List resultList = new java.util.ArrayList();
			String results[] = null;
			if (context.getErrorMsg().equals("")) {
				resultList = context.getResultsList();
				for (int i=0;i<resultList.size();i++) {
					results = (String[])resultList.get(i);
					sCliName	= results[1];	
					sCitizenship = results[5];
					sICNo = results[6];
					sOldICNo = results[7];
					sTitle = results[8];
					sSex =  results[9];
					sRace = results[10];
					sDOB = results[11];
					sAdd1 = results[26];
					sAdd2 = results[27];
					sAdd3 = results[28];
					sPostcode = results[29];
					sCity = results[30];
					sState = results[31];
					sCountry = results[32];
					sTelNo = results[33];
					sMobile = results[34];
					sOffTelNo = results[35];
					sEmail 		= results[36];
					
				}
			} else {
				System.out.println("error in getCliInfo during acctInfo:"+context.getErrorMsg());
				// session invalid
			}				
			context = new com.n2n.connection.LoginContext();
			resultList = new java.util.ArrayList();
		%>
		CliName = <%=sCliName%> <br>
		Citizenship = <%=sCitizenship%> <br>
		ICNo = <%=sICNo%> <br>
		OldICNo = <%=sOldICNo%> <br>
		Title = <%=sTitle%> <br>
		Sex = <%=sSex%> <br>
		Race = <%=sRace%> <br>
		DOB = <%=sDOB%> <br>
		Add1 = <%=sAdd1%> <br>
		Add2 = <%=sAdd2%> <br>
		Add3 = <%=sAdd3%> <br>
		Postcode = <%=sPostcode%> <br>
		City = <%=sCity%> <br>
		State = <%=sState%> <br>
		Country = <%=sCountry%> <br>
		Tel No = <%=sTelNo%> <br>
		Mobile = <%=sMobile%> <br>
		Off Tel No = <%=sOffTelNo%> <br>
		Email = <%=sEmail%> <br>
		
	</body>
</html>
<%
}
}catch (Exception ex) {
	ex.printStackTrace();
}
%> 