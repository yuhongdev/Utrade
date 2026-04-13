<%@ page import = "java.util.*, java.io.*, com.n2n.util.N2NConst, java.net.*" %>
<%@ include file="/common.jsp"%>
<%@ include file='/style.jsp'%>
<!--%@ include file='/applet/pdt_AppletSetting.jsp'%-->
<html>
<head>
<title><%=oN2NSession.getSetting("WebBHName")%>: Stock Indices Tracker</title>
</head>
<body onload='javascript:document.body.focus();' marginheight='5' marginwidth='5' topmargin='5' leftmargin='5'>
<%
	String sFeedNo				= request.getParameter("feedno");
	String sFeedServerUrl		= "";
	String sFeedServerJavaURL	= "";
	String sCodebase			= "";
	
	int iFeedNo					= -1;
	boolean	bDelay				= false;
	
	sFeedNo = sFeedNo != null ? sFeedNo : "-1";
	
	try {
		iFeedNo = Integer.parseInt(sFeedNo);
	} catch (NumberFormatException nfe) {
		iFeedNo = -1;
	}
	
	if (iFeedNo > 0) {
		sFeedServerUrl = oN2NSession.getFeedServer(iFeedNo,true);
	} else {
		sFeedServerUrl = oN2NSession.getFeedServer(session,bDelay); //e.g. http://n2ntbfd01.ebrokerconnect.com/
	}
	
	sFeedServerUrl = "http://n2nakfd02.asiaebroker.com/";
	sFeedServerJavaURL = oN2NSession.getSetting("FSJavaURL");	//get path for jar file
	sCodebase = sFeedServerUrl + sFeedServerJavaURL;
	
	String sIndexCode = request.getParameter("indexCode");
	String sIndexName = request.getParameter("indexName");
	//String sTitle = "INDICES MOVEMENT - " + sIndexName;
	String sTitle = "Indices Movement - " + sIndexName;
	String sCompress = request.getParameter("c");
	
	sIndexCode = sIndexCode != null ? sIndexCode.toUpperCase() : "";
	sIndexName = sIndexName != null ? sIndexName.toUpperCase() : "";
	sCompress = sCompress != null ? sCompress : "1";
	
	if (sCompress.trim().length() > 0) {
		sCompress="0";
	}
%>
	<TABLE>
	<tr><td valign=top align=left>
		<applet code=IndicesTracker.class codebase=<%=sCodebase%> archive=indicesTracker.jar,com.ebc.util.jar,rbRT_en_US.jar width=700 height=323>
			<param name=url value=<%=sFeedServerUrl%>>			
			<param name=title value="<%=sTitle%>">
			<param name=key value="<%=sIndexCode%>">
			<param name=sleeptime value="60">
			<param name=SORT_ORDER value=1>
			<param NAME=COMPRESS value=<%=sCompress%>>
			<param name=GRID_SELECTED_BG_COLOR value='51,51,51'>
			<param name=DRAW_RECT value=1>
			<%=getAppletParam(m_nSTS_COLOR+m_nBAR_COLOR+m_nPRICE_COLOR+m_nGRID_HDR_COLOR)%>
      		</applet>
	</td></tr>
	</TABLE>
</body>
</html>