<%@ page import = "java.text.SimpleDateFormat,java.util.Vector, java.util.Calendar, com.n2n.util.StringTokenizerEx" %>
<%@ include file= "/common.jsp" %>
<%@ page import = "java.io.*, java.util.*, java.net.*, java.lang.*" %>
<%!
private String changePINWS(String loginID, String newPIN, String BHCode, String BHCliCode){
	try {
		String url = "http://atpweb/[0108]TradeChgPIN2?+="+loginID+"|,="+newPIN+"|-="+BHCode+"|.="+BHCliCode;
		
		String charset = "UTF-8";
		URLConnection connection = new URL(url).openConnection();
		connection.setRequestProperty("Accept-Charset", charset);
		InputStream input = connection.getInputStream();

		BufferedReader br = new BufferedReader(new InputStreamReader(input));
		StringBuilder sb = new StringBuilder();
		String line = null;

		while ((line = br.readLine()) != null) {
			if(!line.trim().equals("")){
				sb.append(line);
			}
		}

		br.close();
		return sb.toString();		
	} catch(Exception ex) {
		ex.printStackTrace();
		return null;
	}
}
%>
<%
	String loginID="",  newPIN="", BHCode="", BHCliCode="", sIPAddress="";
	boolean bCont=true;
	StringBuffer m_sLog;
	java.text.DecimalFormat decFormatter = new java.text.DecimalFormat("#,###,###,##0.00");

	loginID = request.getParameter("LoginID")!=null?request.getParameter("LoginID").toString().trim():"";
	newPIN = request.getParameter("TrdPin")!=null?request.getParameter("TrdPin").toString().trim():"";
	BHCode = request.getParameter("BHCode")!=null?request.getParameter("BHCode").toString().trim():"";
	BHCliCode = request.getParameter("AccNo")!=null?request.getParameter("AccNo").toString().trim():"";
	sIPAddress = request.getParameter("IPAddress")!=null?request.getParameter("IPAddress").toString().trim():"";

	String sClientIP;
	if ((sClientIP = request.getHeader("client-ip")) == null) {
		if ((sClientIP = request.getHeader("x-forwarded-for")) == null) {
			sClientIP = request.getRemoteAddr();			
		}
	}


/*	Block Login disabled
	bCont = false;
	out.print("--_BeginData_\r\n");
	out.print("APIStatus=F\r\n");
	out.print("errorCode=9999\r\n");
	out.print("--_EndData_\r\n");
*/
%>
<%
if(!sClientIP.equals("10.0.20.13") && !sClientIP.equals("127.0.0.1") && !sClientIP.equals("120.89.34.130"))
	bCont = false;

String m_sRet = "";
String sStatus="", sErrorCode="";
m_sLog = new StringBuffer();
m_sLog.append("["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"]"+ sClientIP
+"loginID:"+loginID+" newPIN:"+newPIN+" BHCode:"+BHCode+" BHCliCode:"+BHCliCode+" ClientIP"+sIPAddress);
com.n2n.util.Logging.logAPAgent1(m_sLog,"WSLog", "/usr/share/tomcat/logs");

	if (bCont) {
		if(loginID.equals("") || newPIN.equals("") || BHCode.equals("") || BHCliCode.equals("")){
			sErrorCode = "9001";
		}else{
			m_sRet = changePINWS(loginID, newPIN, BHCode, BHCliCode);
			//out.println(m_sRet);	
			if (m_sRet!=null) {
				if (m_sRet.length() >0){ 
					if(m_sRet.indexOf("ERROR") >= 0)
						sErrorCode = m_sRet.trim().substring(6,10);			
					else
						sErrorCode = m_sRet.trim().substring(0,4);			
					
					m_sLog = new StringBuffer();
					m_sLog.append("["+ new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"]"+ sClientIP + "loginID:"+loginID+" m_sRet:"+m_sRet);
					com.n2n.util.Logging.logAPAgent1(m_sLog, "WSLog", "/usr/share/tomcat/logs");		
				} // end check the m_sRet is not empty string
			}else{
				sErrorCode = "9999";
			}
		}
		
		if (sErrorCode.equals("1803")) {
			sStatus="E";
		} else {
			sStatus="F";
		}
		
		m_sLog.append("["+ new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"]"+ sClientIP + "loginID:"+loginID+" sStatus:"+sStatus+" errorCode:"+sErrorCode);
		com.n2n.util.Logging.logAPAgent1(m_sLog, "WSLog", "/usr/share/tomcat/logs");	
					
		out.print("--_BeginData_\r\n");
		out.print("APIStatus="+sStatus+"\r\n");
		out.print("errorCode="+sErrorCode+"\r\n");
		out.print("--_EndData_\r\n");
	} // end check the IP address is authorized IP

%>
