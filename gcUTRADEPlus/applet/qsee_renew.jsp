<%@ page import = "com.spp.util.security.Encrypt, com.spp.util.security.Decrypt, java.sql.*, com.n2n.bean.*, com.n2n.DB.*, java.text.SimpleDateFormat,java.util.Date, com.n2n.util.N2NConst,com.n2n.util.N2NSecurity,java.util.*"%>
<jsp:useBean id="oN2NSession" class="com.n2n.DB.N2NSession" scope="session">
<%
	oN2NSession.init(application);
	oN2NSession.setIsSecure(request.isSecure());
%>
</jsp:useBean>
<%
response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
response.setHeader("Pragma", "no-cache");
response.setDateHeader("Expires", 0);

String sClientIP = request.getRemoteAddr();
sClientIP = "|" + sClientIP + "|";

if ("|211.24.151.226|124.82.235.186|10.130.1.23|10.130.1.25|211.24.151.46|127.0.0.1|10.58.1.152|".indexOf(sClientIP) >= 0) {

String detailsResults = request.getParameter("detail")!=null?request.getParameter("detail").toString().trim():"";
javax.servlet.ServletContext servlets = getServletContext();
if (servlets!=null) {
} else {
servlets = request.getSession().getServletContext();
}
String defaultKey = oN2NSession.getSetting("QCMsgID").toString();
String scheduled_time = "064001";
java.util.Calendar expDate = java.util.Calendar.getInstance();
expDate.add(java.util.Calendar.DATE, 1);
String strExpDate = new java.text.SimpleDateFormat("yyyyMMdd"+scheduled_time).format(expDate.getTime());
Decrypt dec = new Decrypt(); 
Encrypt enc = new Encrypt();
String renewInd = request.getParameter("param")!=null?request.getParameter("param").toString().trim():"";
String urlHit = request.getParameter("feed")!=null?request.getParameter("feed").toString().trim():"mnatbfd-push.asiaebroker.com:20000";
String sGetMsgID = servlets.getAttribute("GET_MESSAGE_ID")!=null?servlets.getAttribute("GET_MESSAGE_ID").toString():enc.fetchEncode(defaultKey);
String sKeyExpDT = servlets.getAttribute("KEYEXPDT")!=null?servlets.getAttribute("KEYEXPDT").toString():strExpDate ;
String magicKey = request.getParameter("magic")!=null?request.getParameter("magic").toString().trim():dec.fetchDecode(sGetMsgID);

if (renewInd.equalsIgnoreCase("Y")) {
servlets.setAttribute("KEYEXPDT","20100101010101");
}
String hitStatus = qcHit(magicKey,urlHit);
%>
<% if (detailsResults.equalsIgnoreCase("Y")) { %>
<table border="1" width="80%">
<tr><td colspan="2">Checking Magic Key</td></tr>
<tr>
  <td>Param</td>
  <td width="75%">Results</td>
</tr>
<tr>
  <td>GET_MESSAGE_ID</td>
  <td><%=sGetMsgID%></td>
</tr>
<tr>
  <td>GET_MESSAGE_CODE</td>
  <td>Y</td>
</tr>
<tr>
  <td>KEYEXPDT</td>
  <td><%=sKeyExpDT%></td>
</tr>
<tr>
  <td colspan="2">
<%
  if (hitStatus.indexOf("OK")<0) {
    out.println("<font color=red>"+hitStatus+"</font>");
    out.println("<br><a href='./qsee_renew.jsp?param=Y'>Reset</a>");
  } else {
    out.println("<font color=black>"+hitStatus+"</font>");
  }
%><br><br>
  </td>
</tr>
</table>
<% 
} else { 
if (hitStatus.indexOf("OK")<0) {
    out.println("<font color=red>"+hitStatus+"</font>");
// Automate Reset
    servlets.setAttribute("KEYEXPDT","20100101010101");
    out.println("<br>Expiry Date:"+servlets.getAttribute("KEYEXPDT"));
  } else {
    out.println("<font color=black>"+hitStatus+"</font>");
  }
} 
%>

<% } %>

<%!
	private String qcHit(String magicKey, String url) {
		java.lang.String hitStatus = "";
		java.lang.String sParam = null;
		java.io.OutputStreamWriter out = null;
		java.io.BufferedReader reader = null;
		java.net.HttpURLConnection conn = null;		

		if (url != null) {
			if (!url.startsWith("http://"))
				url = (new StringBuilder("http://")).append(url).toString();
			if (!url.endsWith("/"))
				url = (new StringBuilder(java.lang.String.valueOf(url))).append("/").toString();
		}
		
		java.lang.String params[] = new java.lang.String[] { "PullMode=1", 
				(new StringBuilder("ClientApp=")).append("Web").toString(), 
				(new StringBuilder("UserParams=")).append(magicKey).toString() };
		

		for (int i = 0; i < params.length; i++) {
			if (sParam == null)
				sParam = "";
			if (i != 0)
				sParam = (new StringBuilder(java.lang.String.valueOf(sParam))).append("&").toString();
			sParam = (new StringBuilder(java.lang.String.valueOf(sParam))).append(params[i]).toString();
		}
		try {
			url = (new StringBuilder(java.lang.String.valueOf(url))).append("login2").toString();
			java.net.URL newUrl = new java.net.URL(url);
			conn = (java.net.HttpURLConnection) newUrl.openConnection();
			conn.setConnectTimeout(20000);
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestMethod("POST");
			out = new java.io.OutputStreamWriter(conn.getOutputStream(), "ISO-8859-1");
			out.write(sParam);
			out.flush();
			conn.connect();
			java.io.InputStream is = conn.getInputStream();
			if (is != null) {
				reader = new java.io.BufferedReader(new java.io.InputStreamReader(is, "ISO-8859-1"));
				while (reader.readLine()!=null) {
					hitStatus = reader.readLine();
					break;
				}
			}
		} catch (Exception e) {
			System.out.println("Exception caught at qcHit:"+e.getMessage());
		}
		return hitStatus;
	}
%>