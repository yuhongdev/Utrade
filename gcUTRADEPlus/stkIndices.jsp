<%@ page import = "com.n2n.util.N2NConst,com.n2n.util.N2NSecurity" %>
<%@ include file='/common.jsp'%>
<jsp:useBean id="eafInfo" class="com.n2n.DB.N2NMFEAFFunc" scope="page"/>
<jsp:include page="cliCheckLogin.jsp" flush="true">
	<jsp:param name="SecLevel" value="1" />
</jsp:include>
<script language=JavaScript src=<%=g_sJSPath%>/N2NCtrl.js></script>
<script language=JavaScript src=<%=g_sJSPath%>/LinkFunc.js></script>
<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
<% if (oN2NSession.getIsUserLogin()) {%>
<%
String sLang="",sCountry="";
sLang=request.getParameter("lang")!=null?request.getParameter("lang").toString().toLowerCase():"";
if (sLang.equals("")) {
	sLang="en";
	sCountry="us";
}
if (sLang.equals("zh")) {
	sCountry="cn";
}
if (sLang.equals("cn")) {
	sLang="zh";
	sCountry="cn";
}

String sLangSetting="", sFont="", sLangFont="";	//need to call GetUpdLangSetting() before call genBanner()
String slstFile="",sHTMLRoot="";
sHTMLRoot = oN2NSession.getSetting("HTMLRoot");

//OpenN2NConnection();

//sLangSetting = GetUpdLangSetting();
//sLangSetting = sLangSetting.split(N2NConst.LANG_COL_SEP);
if (sLang.equals("zh")) {
	slstFile="rbRT_zh_CN.jar";
	out.println("<meta http-equiv='Content-Type' content='text/html; charset=gb2312'>");
} else {
	slstFile="rbRT_en_US.jar";
}

//'--- Beacon Checking --
String sMode="",sISAPIDLL_URL="",sBgColor="",sFeedServerURL="";
String sParam="";
int nTotalIndices = 0;
int nWidth=0, nHeight=0;
sMode = request.getParameter("feed_mode")!=null&&!request.getParameter("feed_mode").equals("")?request.getParameter("feed_mode").toString():"";

if (sMode.length() == 0) {
	sMode = "Delay";
}
if (sMode.equalsIgnoreCase("Delay")) {
sISAPIDLL_URL = oN2NSession.getSetting("FeedServerDelayURL");
sBgColor = oN2NSession.getSetting("DelayBgColor");
sFeedServerURL = oN2NSession.getSetting("FeedServerDelayJavaURL");
} else {
sISAPIDLL_URL = oN2NSession.getSetting("FeedServerURL");
sBgColor = "0,0,0";
sFeedServerURL = oN2NSession.getSetting("FeedServerJavaURL");
}

//'--- end Beacon checking --	
String sCompress = request.getParameter("c")!=null?request.getParameter("c").toString():"0";
nWidth = 730;
sParam = oN2NSession.getSetting("TOTAL_INDICES_COUNT");
if (sParam != null && sParam.length() > 0){
	nTotalIndices = Integer.valueOf(sParam).intValue();
}
nHeight = 62 + (15 * nTotalIndices);

%>
<html>
<head>
<title>Indices</title>
</head>

<BODY onload='body_onload();document.body.focus();'>
<TABLE border=0 cellpadding=0 cellspacing=0>
	<tr><td valign=top align=left>
<%
	out.println("<applet code=IndicesApplet.class codebase="+ "http://n2ntbfd07.asiaebroker.com/java/jar/"  +" archive='indices.jar,com.ebc.util.jar,com.ebc.awt.jar," + slstFile + "' width=" + nWidth + " height=" + nHeight + ">");	
%>
		<PARAM NAME=ISAPIDLL_URL VALUE='http://n2ntbfd07.asiaebroker.com/rtquote.dll'>
		<PARAM NAME=INDICESTRACKER_URL VALUE='<%=oN2NSession.getSetting("HTMLRoot")%>/stkIndicesTracker.asp?|left=25&top=155&width=720&height=335'>
		<PARAM NAME=REFRESH_INTERVAL VALUE=60000>
		<PARAM NAME=MAYSCRIPT VALUE=true>
		<PARAM NAME=SORT_ORDER VALUE=1>
		<PARAM NAME=COMPRESS VALUE=<%=sCompress%>>
		<PARAM NAME=TECH_COMMENTARY VALUE=0>
		<PARAM NAME=INDICES_LIST VALUE='0100|EMAS|0200|COMPOSITE|0300|INDUSTRIA|0001|CONSUMER|0002|INDPROD|0003|CONSTRUCT|0004|TRADSERV|0010|FINANCE|0020|PROPERTY|0025|PLANTATIO|0030|MINING|0500|SYARIAH|0800|2NDBOARD|0810|MESDAQ|0005|TECHNOLOG|'>
		<PARAM NAME=TECH_COMMENTARY_URL VALUE='http://keyquotes.apexetrade.com/indices/'>
		<PARAM NAME=TECH_COMMENTARY_URL2 VALUE='|left=0&top=0&width=780&height=500&scrollbars=yes&tw=WinKeyQuotesIdx|'>

<%	
	boolean bGameMode = oN2NSession.getSetting("AppMode").equalsIgnoreCase("game")?true:false;
	if (bGameMode) {
		out.println("<PARAM NAME=MKT_SUM_BG_COLOR VALUE='74,130,173'>");
		out.println("<PARAM NAME=MKT_SUM_FG_COLOR VALUE='255,255,255'>");
		out.println("<PARAM NAME=BOTTOM_BAR_BG_COLOR VALUE='74,130,173'>");
		out.println("<PARAM NAME=BTN_CHART_BG_COLOR VALUE='74,130,173'>");
		out.println("<PARAM NAME=BTN_CHART_FG_COLOR VALUE='255,255,255'>");
		out.println("<PARAM NAME=TRACKER_BAR_BG_COLOR VALUE='74,130,173'>");
		out.println("<PARAM NAME=TRACKER_BAR_FG_COLOR VALUE='255,255,255'>");
		out.println("<PARAM NAME=TRACKER_GRID_HDR_BG_COLOR VALUE='74,130,173'>");
		out.println("<PARAM NAME=TRACKER_GRID_HDR_FG_COLOR VALUE='255,255,255'>");
	} else {
		out.println("<PARAM NAME=MKT_SUM_BG_COLOR VALUE='0,51,102'>");
		out.println("<PARAM NAME=MKT_SUM_FG_COLOR VALUE='255,255,255'>");
		out.println("<PARAM NAME=BOTTOM_BAR_BG_COLOR VALUE='0,51,102'>");
		out.println("<PARAM NAME=BTN_CHART_BG_COLOR VALUE='0,51,102'>");
		out.println("<PARAM NAME=BTN_CHART_FG_COLOR VALUE='255,255,255'>");
		out.println("<PARAM NAME=TRACKER_BAR_BG_COLOR VALUE='0,51,102'>");
		out.println("<PARAM NAME=TRACKER_BAR_FG_COLOR VALUE='255,255,255'>");
		out.println("<PARAM NAME=TRACKER_GRID_HDR_BG_COLOR VALUE='0,51,102'>");
		out.println("<PARAM NAME=TRACKER_GRID_HDR_FG_COLOR VALUE='255,255,255'>");
	}
%>

		<PARAM NAME=STS_OK_BG_COLOR VALUE='0,255,0'>
		<PARAM NAME=STS_OK_FG_COLOR VALUE='0,0,0'>
		<PARAM NAME=STS_OK_BG_COLOR VALUE='0,0,0'>
		<PARAM NAME=STS_OK_FG_COLOR VALUE='255,0,0'>
		<PARAM NAME=GRID_SELECTED_BG_COLOR VALUE='51,51,51'>
		<PARAM NAME=DRAW_RECT VALUE=1>
		<PARAM NAME=DEFAULT_LANGUAGE VALUE=<%=sLang%>>
		<PARAM NAME=DEFAULT_COUNTRY VALUE=<%=sCountry%>>
		<PARAM NAME=MODE VALUE='<%=sMode%>'>
		<PARAM NAME=DELAY_BG_COLOR VALUE='<%=sBgColor%>'>
		<PARAM NAME=REALTIME_BG_COLOR VALUE='0,0,0'>
		<PARAM NAME=TotalRow VALUE='<%=nTotalIndices%>'>
		<PARAM NAME=CHECKSUM VALUE='ACFRJOUCPXDSVRUTYAKLYANUORRRJTCFCTDKU'>
      </applet>
<%
//	if (sMode.equalsIgnoreCase("RealTime")) {
//		genSingleLoginApplet();
//	}
%>      
    </td>
    </tr>
</TABLE>
<script language=javascript>
function body_onload(){
//	window.resizeTo(720,530);
	var nWidth = <%=nWidth%> - 10;
	var nHeight = (15 * <%=nTotalIndices%>) + 155;

	resizeTo(nWidth, nHeight);
}
</script>
</BODY>
</HTML>



<% } %>

