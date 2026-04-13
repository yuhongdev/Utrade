<%@ page import = "com.n2n.util.N2NConst,com.n2n.util.N2NSecurity" %>
<%@ include file='common.jsp'%>
<%@ include file='util/N2NFunc.jsp'%>
<jsp:useBean id="eafInfo" class="com.n2n.DB.N2NMFEAFFunc" scope="page"/>
<jsp:include page="cliCheckLogin.jsp" flush="true">
	<jsp:param name="SecLevel" value="1" />
</jsp:include>
<script language=JavaScript src=<%=g_sJSPath%>/N2NCtrl.js></script>
<script language=JavaScript src=<%=g_sJSPath%>/LinkFunc.js></script>
<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
<% if (oN2NSession.getIsUserLogin()) {%>
<html>
<head>
<title><%=oN2NSession.getSetting("WebSiteName")%>: Analysis Chart</title>
</head>
<%
	String sLang="",sCountry="";
	String sChecksum="";
	String sFeedOption="";
	String sPort="";
	String sTotalRow="";
	String sRTSet="";
	String[] sRTSets = null;
	String sLotOrUnit="";
	String sFeedNo="";

	sFeedNo=request.getParameter("feedno");
	if (sFeedNo==null) {
		sFeedNo = "1";
	}

	sLang=request.getParameter("lang");
	sLang=sLang.toLowerCase();
	if (sLang=="") {
		sLang="en";
		sCountry="us";
	}
	if (sLang=="en") {
		sLang="en";
		sCountry="us";
	}
	if (sLang=="zh") {
		sCountry="cn";
	}
	if (sLang=="cn") {
		sLang="zh";
		sCountry="cn";
	}

	String slstFile="";
	if (sLang=="zh") {
		slstFile="rbRT_zh_CN.jar";
		out.println("<meta http-equiv='Content-Type' content='text/html; charset=gb2312'>");
	} else {
		slstFile="rbRT_en_US.jar";
	}

	String sCompress="";
	sCompress = request.getParameter("c");
	if (sCompress==null) {
		sCompress="0";
	}

	sFeedOption = request.getParameter("feedoption");

	if (sFeedOption == null) {
	     sFeedOption = "0"; // '0=cy feed; 1=toh's pull feed; 2=toh's push
	}

	//'--- Beacon Checking --
	String sMode="";
	String sISAPIDLL_URL="";
	String sBgColor="";
	String sFeedServerURL="";

	sMode = session.getAttribute("feed_mode")!=null?session.getAttribute("feed_mode").toString():"";

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

	if (sFeedOption == "1") {
		sISAPIDLL_URL = oN2NSession.getSetting("PFSURL" + sFeedNo);
		sISAPIDLL_URL = sISAPIDLL_URL.replace("http://","");
		sISAPIDLL_URL = sISAPIDLL_URL.replace("/","");
		sPort = "80";
		sTotalRow = "21";
		sRTSet = session.getAttribute("sRTSet")!=null?session.getAttribute("sRTSet").toString():"";

		if (sRTSet.length() == 0) {
			sRTSet = "KLSE|11|1|1|1";
		}
		sRTSets = sRTSet.split("|");

		if (sRTSets.length == 5) {
			sLotOrUnit = sRTSets[4];
		} else {
			sLotOrUnit = "1";
		}
	} else {
		sISAPIDLL_URL = oN2NSession.getSetting("FeedServerURL") +"rtquote.dll";
	}

	//'--- end Beacon checking --
	sChecksum = oN2NSession.getSetting("checksum");
%>
<title>Scoreboard</title>
<script language="JavaScript" src="/java/AC_RunActiveContent.js"></script>
</head>

<BODY onload='document.body.focus();'>
<TABLE border=0 cellpadding=0 cellspacing=0>
	<tr><td valign=top align=left>
<%
String sCode = "ScoreboardApplet.class";
String sArchive = "scoreboard.jar,com.ebc.awt.jar,com.ebc.util.jar," + slstFile;
int iWidths = 730;
int iHeights = 400;

boolean bGameMode = isGameMode();


if (sFeedOption == "1") {
	sArchive = sArchive + ", com.ebc.socket.jar";
	sFeedServerURL = oN2NSession.getSetting("ExtURL1") +  "java/jar/swing";
} else {
	sFeedServerURL = oN2NSession.getSetting("FeedServerJavaURL");
}
%>
<script language="JavaScript">
	var appletArgs = new Array(
                    	"code","<%=sCode%>",
                    	"codebase","<%=sFeedServerURL%>",
			"archive", "<%=sArchive%>",
			"width","<%=iWidths%>",
			"height","<%=iHeights%>",
			"ISAPIDLL_URL","<%=sISAPIDLL_URL%>",
			"REFRESH_INTERVAL","60000",
			"COMPRESS","1",
			"MAYSCRIPT","true",
			"DEFAULT_LANGUAGE", "<%=sLang%>",
			"DEFAULT_COUNTRY",  "<%=sCountry%>",
			"BAR_BG_COLOR", "<% if (bGameMode) { out.println("74,130,173"); }else{ out.println("0,51,102"); } %>",
			"BAR_FG_COLOR", "<% if (bGameMode) { out.println("255,255,255"); } else { out.println("255,255,255"); }%>",
			"STS_OK_BG_COLOR","0,255,0",
			"STS_OK_FG_COLOR","0,0,0",
			"STS_OK_BG_COLOR","0,255,0",
			"STS_OK_FG_COLOR","0,0,0",
			"GRID_SELECTED_BG_COLOR","51,51,51",
			"DRAW_RECT",        "1",
			"MODE",             "<%=sMode%>",
			"DELAY_BG_COLOR",   "<%=sBgColor%>",
			"REALTIME_BG_COLOR","0,0,0",
			"CHECKSUM","<%=sChecksum%>",
			"PORT","<%=oN2NSession.getSetting("PFSPort")%>",
			"TOTAL_ROW","<%=sTotalRow %>",
			"FEED_MODE","<%=sFeedOption%>",
			"UNIT_OR_LOT","<%=sLotOrUnit %>",
			"IS_BT","1"
			);
	AC_AX_RunAppletContent( appletArgs ); //end AC code
</script>

<noscript>
<%
	//'out.println("<applet code=ScoreboardApplet.class codebase="+ Application("FeedServerJavaURL") +" archive=scoreboard.jar,com.ebc.awt.jar,com.ebc.util.jar width=730 height=320>")
	//'out.println("<PARAM NAME=ISAPIDLL_URL VALUE='"+ Application("AppletRTFeedURL") +"'>")

	out.println("<applet code=ScoreboardApplet.class codebase="+ sFeedServerURL +" archive=scoreboard.jar,com.ebc.awt.jar,com.ebc.util.jar," + slstFile + " width=730 height=400>");
	out.println("<PARAM NAME=ISAPIDLL_URL VALUE='"+ sISAPIDLL_URL +"rtquote.dll'>");
%>
		<PARAM NAME=REFRESH_INTERVAL VALUE=60000>
		<PARAM NAME=COMPRESS VALUE=1>
		<PARAM NAME=MAYSCRIPT VALUE=true>
		<PARAM NAME=DEFAULT_LANGUAGE VALUE=<%=sLang%>>
		<PARAM NAME=DEFAULT_COUNTRY VALUE=<%=sCountry%>>
<% /**
		<PARAM NAME=BAR_BG_COLOR VALUE='226,220,159'>
		<PARAM NAME=BAR_FG_COLOR VALUE='0,0,0'>
		<PARAM NAME=STS_OK_BG_COLOR VALUE='0,0,0'>
		<PARAM NAME=STS_OK_FG_COLOR VALUE='0,255,0'>
		<PARAM NAME=STS_OK_BG_COLOR VALUE='0,0,0'>
		<PARAM NAME=STS_OK_FG_COLOR VALUE='255,0,0'>
*/ %>
<%
	if (bGameMode) {
		out.println("<PARAM NAME=BAR_BG_COLOR VALUE='74,130,173'>");
		out.println("<PARAM NAME=BAR_FG_COLOR VALUE='255,255,255'>");
	} else {
		out.println("<PARAM NAME=BAR_BG_COLOR VALUE='0,51,102'>");
		out.println("<PARAM NAME=BAR_FG_COLOR VALUE='255,255,255'>");
	}
%>
		<PARAM NAME=STS_OK_BG_COLOR VALUE='0,255,0'>
		<PARAM NAME=STS_OK_FG_COLOR VALUE='0,0,0'>
		<PARAM NAME=STS_OK_BG_COLOR VALUE='0,0,0'>
		<PARAM NAME=STS_OK_FG_COLOR VALUE='255,0,0'>
		<PARAM NAME=GRID_SELECTED_BG_COLOR VALUE='51,51,51'>
		<PARAM NAME=DRAW_RECT VALUE=1>
		<PARAM NAME=MODE VALUE='<%=sMode%>'>
		<PARAM NAME=DELAY_BG_COLOR VALUE='<%=sBgColor%>'>
		<PARAM NAME=REALTIME_BG_COLOR VALUE='0,0,0'>
		<PARAM NAME=CHECKSUM VALUE='<%=sChecksum%>'>
      </applet>
</noscript>

<%
	if (sMode!=null && sMode.equalsIgnoreCase("RealTime")) {
//		genSingleLoginApplet();
	}
%>
    </td>
    </tr>
</TABLE>
</BODY>
</HTML>
<% } %>