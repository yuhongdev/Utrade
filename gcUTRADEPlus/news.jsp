<%@ page import = "java.sql.*,java.net.*, java.io.*" %>
<%@ include file= 'common.jsp'%>
<%@include file="/util/sessionCheck.jsp"%>

<% 
try {
	//if (oN2NSession.getIsUserLogin()) {
	if (validSession) {

%>
<%@ page import = "java.util.*" %>
<%@ include file='util/banner.jsp'%>
<%
	setCommonPath(g_sPath, g_sImgPath, g_sJSPath, g_sStylePath, g_sWebPath, oN2NSession.getSetting("HTMLRoot"),out);
	genBannerTitle(oN2NSession.getSetting("WebSiteName"));
%>
<script language='JavaScript' src='<%=g_sJSPath%>/LinkFunc.js'></script>
<SCRIPT language=javascript src="<%=g_sJSPath%>/popupWindow.js"></SCRIPT>
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">

<%genAfterMenuNews(iWidth);%>
<%	String m_sEncryprytedData = "";
	String m_sKey = "";
	String m_sTime = "";
	java.text.SimpleDateFormat sdfDate = new java.text.SimpleDateFormat("yyMMdd");
	java.text.SimpleDateFormat sdfTime = new java.text.SimpleDateFormat("hhmmss");
	
	Calendar calNow = Calendar.getInstance();	
	
	m_sKey = sdfDate.format(calNow.getTime());
	m_sTime = sdfTime.format(calNow.getTime());
	//m_sKey = "070106";
	//m_sTime = "090010";
	
	char[] m_aKey = m_sKey.toCharArray();
	char[] m_aTime = m_sTime.toCharArray();
	//char[] m_aEncryptedData = new char[m_aTime.length]; 
	System.out.println("m_aKey.length : " + m_aKey.length);
	System.out.println("m_aTime.length : " + m_aTime.length);
	
	for (int i=0; i < m_aTime.length; i++) {
		//m_aEncryptedData = (m_aKey[i] ^ m_aTime[i]);
		m_sEncryprytedData +=  Character.toString((char)((int)m_aKey[i] ^ (int)m_aTime[i]));
	}
	
	System.out.println("m_sEncryprytedData.length : " + m_sEncryprytedData.length());
	System.out.println("m_sEncryprytedData: " + m_sEncryprytedData);
	
	String m_sBursa =  request.getParameter("Bursa_box");
	String m_sDowJones =  request.getParameter("DJ_box");
	String m_sAWSJ =  request.getParameter("AWSJ_box");
	m_sBursa = m_sBursa != null ? m_sBursa : "";
	m_sDowJones = m_sDowJones != null ? m_sDowJones : "";
	m_sAWSJ = m_sAWSJ != null ? m_sAWSJ : "";
	
	String m_sFilterStock =  request.getParameter("Filter");
	String m_sStockCode =  request.getParameter("Code");
	String m_sStockName =  request.getParameter("Name");
	m_sFilterStock = m_sFilterStock != null ? m_sFilterStock : "";
	m_sStockCode = m_sStockCode != null ? m_sStockCode : "";
	m_sStockName = m_sStockName != null ? m_sStockName : "";
	
	if(m_sBursa.equals("") && m_sDowJones.equals("") && m_sAWSJ.equals(""))
		m_sBursa = "yes";
%>
	<table cellspacing='0' cellpadding='0' border='0' bgcolor='#000000' width='100%'>
		<tr>
			<td bgcolor='#D9D9D9' align=center>	
			<%	if(m_sFilterStock.compareToIgnoreCase("LastTrx") == 0) { %>
				<IFRAME src="<%=oN2NSession.getSetting("NewsUrl")%>Bursa_box=<%=m_sBursa%>&DJ_box=<%=m_sDowJones%>&AWSJ_box=<%=m_sAWSJ%>&bhcode=086&FilterCode=<%=m_sStockCode%>&StockName=<%=m_sStockName%>&key=<%=URLEncoder.encode(m_sEncryprytedData)%>" frameBorder="0" width="760" scrolling="auto" height="988">
			<%	} else { %>
				<!-- IFRAME src="<=oN2NSession.getSetting("NewsUrl")%>Bursa_box=<=m_sBursa%>&DJ_box=<=m_sDowJones%>&AWSJ_box=<%=m_sAWSJ%>&bhcode=086&key=<=URLEncoder.encode(m_sEncryprytedData)%>" frameBorder="0" width="760" scrolling="auto" height="988"--><!--927">-->
				<IFRAME src="<%=oN2NSession.getSetting("NewsUrl")%>Bursa_box=<%=m_sBursa%>&DJ_box=<%=m_sDowJones%>&AWSJ_box=<%=m_sAWSJ%>&bhcode=086&FilterCode=<%=m_sStockCode%>&StockName=<%=m_sStockName%>&key=<%=URLEncoder.encode(m_sEncryprytedData)%>" frameBorder="0" width="760" scrolling="auto" height="988">
			<%	} %>
				<p align="center" class="aindexnews">If this column appears blank, please upgrade your browser to the latest version.</p>
				</IFRAME>																				
			</td>
		</tr>
	</table>	
<!-- contents here -->
<%genFootnote();%>
<%	} else {
	response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
}

} catch (Exception ex) {
	ex.printStackTrace();
}
%>