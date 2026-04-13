<%@ page import = "java.text.SimpleDateFormat,java.util.Vector, java.util.Calendar, com.n2n.util.StringTokenizerEx" %>
<%@ page import = "com.spp.util.security.Encrypt, com.n2n.util.N2NConst, com.n2n.DB.N2NSession, com.n2n.util.N2NATPPushConnect, com.n2n.connection.LoginContext" %>
<%@ include file= "/common.jsp" %>
<%@ page import = "java.io.*, java.util.*, java.net.*" %>
<%!
private String verifyClicksRedirection(String sIC, String sLoginID, String sBHCliCode, String sBHBranch, String sBHCode){
	try {
		String url = "http://atpweb/[0108]CheckLoginAuthentication?+="+sIC+"|,="+sLoginID+"|-="+sBHCliCode+"|.="+sBHBranch+"|2="+sBHCode;
//		String url = "http://172.16.0.218/[0108]CheckLoginAuthentication?,=test202|-=bhn2n202";
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

private synchronized void setSSOValue (HttpSession voSession, String vsCliCode, String vsSSOTokenEnc) {
	try {
        Hashtable ht = null;

		if (voSession.getServletContext().getAttribute("SSOTokenList") != null)
			ht = (java.util.Hashtable) voSession.getServletContext().getAttribute("SSOTokenList");
		else
			ht = new java.util.Hashtable();

		ht.put(vsCliCode, vsSSOTokenEnc);
		voSession.getServletContext().setAttribute("SSOTokenList", ht);

	} catch (Exception e) {
		e.printStackTrace();
	}
}
%>
<%
	String sIC="", sLoginID="", sBHCliCode="", sBHBranch="", sIPAddress="", sCliCode="", sBHCode="",
		sAct="", sHash="", sHashCalc="", sHashTemp="";
	boolean bCont=true;
	String sToken = "";
	String sEncryptedToken = "";
	StringBuffer m_sLog;
	java.text.DecimalFormat decFormatter = new java.text.DecimalFormat("#,###,###,##0.00");

	sBHBranch = "001";
	sIC = request.getParameter("IC")!=null?request.getParameter("IC").toString().trim():"";
	sLoginID = request.getParameter("LoginID")!=null?request.getParameter("LoginID").toString().trim():"";
	sBHCliCode = request.getParameter("AccNo")!=null?request.getParameter("AccNo").toString().trim():"";
	sIPAddress = request.getParameter("IPAddress")!=null?request.getParameter("IPAddress").toString().trim():"";
	sBHCode = request.getParameter("BHCode")!=null?request.getParameter("BHCode").toString().trim():"";

	String sClientIP;
	if ((sClientIP = request.getHeader("client-ip")) == null) {
		if ((sClientIP = request.getHeader("x-forwarded-for")) == null) {
			sClientIP = request.getRemoteAddr();
		}
	}

System.out.println("HC["+ new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date()) +"] "+ sClientIP
	+" SSO-cliChkLoginXX: "+ session.getId() +"..."+ request.getQueryString() + " IP: " +sClientIP);


/*	Block Login disabled
	bCont = false;
	out.print("--_BeginData_\r\n");
	out.print("itradeStatus=U\r\n");
	out.print("errorCode=G9999\r\n");
	out.print("authenticationToken=\r\n");
	out.print("--_EndData_\r\n");
*/
%>
<%
System.out.println("HC: SSO Request IP: "+sClientIP);
if(!sClientIP.equals("202.57.109.236") && !sClientIP.equals("127.0.0.1"))
	bCont = false;

String m_sRet = "";
Encrypt en = new Encrypt();

m_sLog = new StringBuffer();
m_sLog.append("["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"]"+ sClientIP
		+" SSO-cliChkLoginXX: IC="+ sIC +", LoginID="+ sLoginID +", BHCliCode="+ sBHCliCode +", BHBranch="+ sBHBranch +", BHCode="+sBHCode
		+", IPAddress="+ sIPAddress +"\r");
com.n2n.util.Logging.logAPAgent1(m_sLog,"SSOLog", "/usr/share/tomcat/logs");

	if (bCont) {
		m_sRet = verifyClicksRedirection(sIC, sLoginID, sBHCliCode, sBHBranch, sBHCode);
		//out.println(m_sRet);
		//A|0|A10111
		//(=+|,|-|.|/|0|1|2|3|)=123456|test1|0010111|001|A|0|A10111|065|0
		if (m_sRet!=null) {
			if (m_sRet.length() >0) {
				m_sRet = m_sRet.replace("(=+|,|-|.|/|0|1|2|3|)=","");
				String sStatus="", sErrCode="";
				String sRet[] = m_sRet.split("\\|");
				
				sStatus = sRet[4];
				sErrCode = sRet[5];

				if (sStatus.equals("E")) {
					sCliCode = sRet[6];

					sToken = sCliCode +"|"+ sLoginID + "|" + sIPAddress +"|"+ sIC +"|"+ sBHCliCode +"|"+ sBHCode;
					//out.println(sToken);
					sEncryptedToken = en.fetchEncode(sToken);

					if (session.getAttribute(sCliCode)!=null) {
						session.removeAttribute(sCliCode);
					}

					String sValue = sEncryptedToken +"|"+ new java.text.SimpleDateFormat("yyyy-MM-dd_HH:mm:ss").format(new java.util.Date());
					session.setAttribute(sCliCode, sValue);

					m_sLog = new StringBuffer();
					m_sLog.append("["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"]"+ sClientIP
						+" SSO-cliChkLoginXX: "+ sCliCode +"|"+ sValue +"|"+ session.getId());
					com.n2n.util.Logging.logAPAgent1(m_sLog, "SSOLog", "/usr/share/tomcat/logs");
				} else {
					sEncryptedToken = "";
				}

				out.print("--_BeginData_\r\n");
				out.print("itradeStatus="+ sStatus +"\r\n");
				out.print("errorCode="+ sErrCode +"\r\n");
				out.print("authenticationToken="+ sEncryptedToken +"\r\n");
				out.print("--_EndData_\r\n");

				m_sLog = new StringBuffer();
				m_sLog.append("["+ new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"]"+ sClientIP
					+" SSO-cliChkLoginXX: IC="+ sIC +", Token="+ sEncryptedToken
					+", iTradeStatus="+ sStatus +", errorCode="+ sErrCode +", sToken=" + sToken);
				com.n2n.util.Logging.logAPAgent1(m_sLog, "SSOLog", "/usr/share/tomcat/logs");
				
				setSSOValue(session, sCliCode, sEncryptedToken);
			} // end check the m_sRet is not empty string
		} // end check the m_sRet is not null
	} // end check the IP address is authorized IP*/
%>
