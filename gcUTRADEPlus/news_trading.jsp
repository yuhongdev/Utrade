<%@ page import = "java.sql.*,java.net.*, java.io.*" %>
<%@ page import = "java.util.*" %>
<%@include file="/common.jsp"%>
<%@include file="/util/sessionCheck.jsp"%>
<% 
try {
	if (validSession) {
		String stkCode, stkName, exchCode, sponsorId, bhCode;
		stkCode = request.getParameter("Code") != null ? request.getParameter("Code") : "";
		stkName = request.getParameter("Name") != null ? request.getParameter("Name") : "";
		exchCode = request.getParameter("exchg") != null ? request.getParameter("exchg") : "";
		sponsorId = oN2NSession.getSetting("news.sponsorId");
		bhCode = oN2NSession.getSetting("WebBHCode");

%>
<html>
	<head>
		<META content='-1' http-equiv='Expires'>
		<META content='no-cache' http-equiv='Pragma'>
		<META content='no-cache' http-equiv='Cache-Control'>
		<title>Real Time</title>
		<script type='text/javascript' src="<%=g_sJSPath%>/ga.js"></script>
		<style>
			body{
				overflow:hidden;
				margin:0;
			}
		</style>
	</head>
	<body>
		<script type='text/javascript' src="<%=g_sJSPath%>/ga.js"></script>
		<iframe frameborder=0 style="width:100%;height:100%;" src="<%=g_sPath%>/ext/rwPLC.jsp?t=6&spc=<%=sponsorId%>&bh=<%=bhCode%>&ns=PH&sc=<%=stkCode%>&ex=<%=exchCode%>&appId=LP"</iframe>
	</body>
</html>
<% 
	} else {
		out.println("No Session found. Please retry again.");
	}
}catch (Exception ex) {
	ex.printStackTrace();
}
%> 
