<%@include file="/common.jsp"%>
<%@include file="/util/sessionCheck.jsp"%>
<%@include file="/util/banner.jsp"%>
<%@ include file='cliCheckKey.jsp'%>
<% String url_base_path = request.getRequestURL().toString().substring(0,request.getRequestURL().toString().indexOf("/")+2); %>
<% String HTMLROOT_path = url_base_path+oN2NSession.getSetting("HTMLRoot").substring(oN2NSession.getSetting("HTMLRoot").indexOf("/")+2,oN2NSession.getSetting("HTMLRoot").length()); %>
<script language='javascript' type='text/javascript' src='<%=g_sPath %>/java/AC_RunActiveContent.js'></script>

<script type="text/javascript">
function backToMain() {
	parent.location.href="<%=oN2NSession.getSetting("HTMLRoot")%><%=g_sPath%>/cliLoginQsee.jsp";
}
</script>
<style type="text/css">

body  {
	margin: 0; /* it's good practice to zero the margin and padding of the body element to account for differing browser defaults */
	padding: 0;
	text-align: center;
}
</style>
<%
	String sCLASS_ID = "clsid:CAFEEFAC-0016-0000-FFFF-ABCDEFFEDCBA";
	String sUserAgent = "";
	boolean ie = false;
	int width = iWidth;
	int height = 580;	
	com.spp.util.security.Encrypt enc = new com.spp.util.security.Encrypt();
	sUserAgent = request.getHeader("User-Agent").toLowerCase();
	if (sUserAgent.indexOf("msie") != -1)
		ie = true;

if (validSession) {
try {
	String m_sLangs = request.getParameter("lang")!=null?request.getParameter("lang").toString().trim():"en";
	String mode_url = request.getParameter("mode")!=null?request.getParameter("mode").toString().trim():"1";
	String feed_server_url = "";
	String sISAPIDLL_url = "";
	String sCheckSum = "";
	String sDataMode = "1";
	if (mode_url.equals("1")) {
		feed_server_url = oN2NSession.getSetting("PFSURL2")+"|"+oN2NSession.getSetting("PFSPort");
	} else if (mode_url.equals("0")) {
		feed_server_url = oN2NSession.getSetting("PPSURL2")+"|"+oN2NSession.getSetting("PPSPort");
		sDataMode = "0";
	} else {
		feed_server_url = oN2NSession.getSetting("PFSURL2")+"|"+oN2NSession.getSetting("PFSPort");
	}
	feed_server_url = "218.100.22.108|20000";
	sISAPIDLL_url = oN2NSession.getSetting("ISAPIDLL.URL")!=null?oN2NSession.getSetting("ISAPIDLL.URL").toString().trim():"bttbfd.asiaebroker.com";
	sCheckSum = oN2NSession.getSetting("Checksum")!=null?oN2NSession.getSetting("Checksum").toString().trim():"UWZLDIOWJRXMPLONSUEFSUHOILLLDNWZWNXEO";

	String tradClientAcc = session.getAttribute("tradingAcc")!=null?session.getAttribute("tradingAcc").toString().trim():"1";
	String xml_setting_url = "";
	if (tradClientAcc.equals("1")) {
		xml_setting_url = enc.fetchEncode("http://test.asiaebroker.com/java/jar/swing/xml/065MY_ED_qsda.xml");
	} else {
		xml_setting_url = enc.fetchEncode("http://test.asiaebroker.com/java/jar/swing/xml/065MY_NA_qsda.xml");
	}	

	String sLstFile = "", sLstVerFile = "", sLanguages = "", sCountry = "", sFont = "";
	String cache_archive = "";
	String cache_version = "";
	if (m_sLangs.equalsIgnoreCase("en")) {
		sCountry = "US";
		sLanguages = "en";
		sFont = "SansSerif";
		cache_archive = "qsea_newCancelRevise.jar,imga.jar,com.ebc.awt.jar,CalcFunc.jar,rbRTBS_en_US.jar,JChart2dN2N.jar";
		cache_version = "1.0.0.17_24,1.0.0.2,1.0.0.1,1.0.0.3,1.0.0.3,1.0.0.1";
	} else {
		sLstFile = "rbRT_zh_CN.jar";
		sCountry = "CN";
		sLanguages = "zh";
		out.println("<meta http-equiv='Content-Type' content='text/html; charset=gb2312'>");
		sFont = "PMingLiU,MingLiU,SimHei,SimSun,Arial Unicode MS,Ms Hei,Ms Song";
		sLstVerFile = "2.0.0.38";
		cache_archive = "qsea_newCancelRevise.jar,imga.jar,com.ebc.awt.jar,CalcFunc.jar,rbRTBS_en_US.jar,rbRT_zh_CN.jar,JChart2dN2N.jar";
		cache_version = "1.0.0.17_24,1.0.0.2,1.0.0.1,1.0.0.3,1.0.0.3,1.0.0.3,1.0.0.1";
	}
	//String atpURL = session.getAttribute("ATPURLpublic")!=null?session.getAttribute("ATPURLpublic").toString().trim():oN2NSession.getSetting("atpURL");
	String atpURL = oN2NSession.getSetting("atpURL");
	String sGetMsgID = servlets.getAttribute("GET_MESSAGE_ID")!=null?servlets.getAttribute("GET_MESSAGE_ID").toString():defaultKey;
	String sKeyExpDT = servlets.getAttribute("KEYEXPDT")!=null?servlets.getAttribute("KEYEXPDT").toString():strExpDate ;	
	String sTrdHtmlRoot = HTMLROOT_path + g_sPath.substring(1) + "/";	
	//System.out.println("sess:"+session.getAttribute("userPram").toString().trim());	
	String sCode = "com.n2n.realtime.RealTimeApplet.class";

	String sBrowserType = "";
	String sClassID = "";
	if(!ie) {
		sBrowserType = "Others";
		sClassID = "java:" + sCode;
	} else {
		sBrowserType = "IE";
		sClassID = sCLASS_ID;
	}
	
	com.n2n.util.N2NATPConnect atp = new com.n2n.util.N2NATPConnect(atpURL);
	com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
	context = atp.tradeClientSetting(g_sLoginId, g_sCliCode, true, session);
	java.util.List listClientSetting = context.getResultsList();
	String clientSetting[] = null;
	String drtset = null;
	try {
		if (listClientSetting.size()>0) {
			for (int ix=0;ix<listClientSetting.size();ix++) {
				clientSetting = (String[])listClientSetting.get(0);
				System.out.println("client setting during applet loading:"+clientSetting[7]);
	//			for (int iy=0;iy<clientSetting.length;iy++) {
	//				System.out.println("results:"+iy+":"+clientSetting[iy]);
	//			}
			}
			if(clientSetting.length > 7){
				clientSetting[7] = clientSetting[7].replace("~","|");
					String params [] = null;
					params = clientSetting[7].split("\\|");
					if(params.length >=6 ){
						switch(Integer.valueOf(params[2])){
							case 1:
							case 2:	width = 1000;
									height = 580;
							break;
							case 3: width = 1210;
									height = 580;
							break;
							case 4: width = 1000;
									height = 480;
							break;
							default: width = 1000;
									height = 476;
							break;
						}
					}
				drtset = clientSetting[7].split("\\|", 2)[1];

			}else{
				drtset = "11|2|1.25|0|1";
			}

		}
	} catch (Exception e) {
		drtset = "11|2|1.25|0|1";
		width = 1000;
		height = 580;
	}	
	iWidth = width;
%>

<html>
<head>
	<META content='-1' http-equiv='Expires'>
	<META content='no-cache' http-equiv='Pragma'>
	<META content='no-cache' http-equiv='Cache-Control'>
	<title>Bursa Malaysia Real Time</title>

<script language='JavaScript' src='<%=g_sJSPath%>/LinkFunc.js'></script>
<script type="text/javascript" src="<%=g_sJSPath%>/PluginDetect.js"></script>
<script type="text/javascript" src="<%=g_sJSPath%>/popupWindow.js"></script>
<script language="javascript">
	if (PluginDetect.getVersion("Java")==null){
		alert ("You need JRE to run the application. Pleae Click Ok to download JRE.");
		window.location ="https://java.com/en/download/manual.jsp";
	}
</script>
<script type="text/javascript" src="<%=g_sJSPath%>/swfobjects2.js"></script>

</head>
<body class="thrColAbsHdr">
<%if(request.getParameter("mode") != null || request.getParameter("mode") != "") {%>

<div id="mode" style='z-index: 1; position: absolute; top: 10px; left: 370px; font-size: 7pt; font-family: arial,verdana;'>
[ <a href="qsda.jsp?lang=en&amp;mode=0" style="text-decoration:none;color:black">Click here if you unable to see the Stock prices after installing JAVA</a> ]
</div>
<%} %>

<table width="<%=width %>" border="0" cellspacing="0" cellpadding="0">
<tr>
  <td align='center' height='20'>
		<%@ include file='/menu_RT.jsp'%>
  </td>
</tr>
<tr><td align='center'>
	<script language="JavaScript" type="text/javascript">
	<!--
		var flashvars = {};
		flashvars.settingPath = "http://jar.asiaebroker.com/flash/tickerSetting_EN.xml";
		var params = {};
		params.menu = "false";
		params.quality = "high";
		params.bgcolor = "#9a9a9a";
		params.allowScriptAccess = "always";
		params.type = "application/x-shockwave-flash";
		params.wmode = "transparent";
		params.salign = "lt";
		params.allowFullScreen = "false";
		var attributes = {};
		attributes.name = "ticker";
		attributes.id = "ticker";
		swfobject.embedSWF("http://jar.asiaebroker.com/flash/ticker.swf", "myContent", "<%=iWidth%>", "20", "6.0.0","http://jar.asiaebroker.com/flash/ticker.swf", flashvars, params, attributes);
	// -->
		</script>
		<div id="myContent"><p>Alternative content</p></div>		
	</td>
</tr>
</table>    
<table width="<%=iWidth %>" border="0" cellspacing="0" cellpadding="0">
<tr>
<td style="overflow-x: hidden;" width="<%=iWidth %>"  align='center'>
<script language="JavaScript">
	var objectArgs = new Array(
		"CLASSID", "<%=sClassID%>",
		"CODEBASE1", "http://dl.asiaebroker.com/download/jre-6u17-windows-i586-s.exe",
		"WIDTH", "<%=width%>", 
		"HEIGHT", "<%=height%>", 
		"CODE", "<%=sCode%>", 
		"CODEBASE", "http://test.asiaebroker.com/java/jar/swing/qsea",
		"CACHE_OPTION", "PLUGIN", 
		"CACHE_ARCHIVE", "qsea_newCancelRevise.jar,imga.jar,schema.jar,com.ebc.awt.jar,CalcFunc.jar,rbRTBS_en_US.jar,JChart2dN2N.jar", 
		"CACHE_VERSION", "1.0.0.17_24,1.0.0.1,1.0.0.3,1.0.0.1,1.0.0.3,1.0.0.3,1.0.0.1", 
		"TYPE", "application/x-java-applet;version=1.6", 
		"PLUGINSPAGE", "http://dl.asiaebroker.com/download/jre-6u17-windows-i586-s.exe", 
		"MAYSCRIPT", "true", 
		"JAVA_ARGUMENTS", "-Djnlp.packEnabled=true",

		"image", "http://jar.asiaebroker.com/java/jar/swing/img/CIMB-loading-animation.gif",
		"boxmessage", "loading...",
		"boxborder", "false",
		"IS_MINI", "1",	
		"centerimage", "true",
		"LOOK_AND_FEEL", "javax.swing.plaf.metal.MetalLookAndFeel",
		"CONTENT-ENCODING", "pack200-gzip , gzip",
		"ACCEPT-ENCODING", "pack200-gzip , gzip",
		
		//"HTMLROOT", "http://218.100.22.97/QSDA/qsd_Dev.html",
		"HTMLROOT", "<%=oN2NSession.getSetting("HTMLRoot")%><%=g_sPath%>/",
		"ATPURL", "<%=atpURL%>",
		"ALL_NEWS", "0",
		"IS_MINI", "1",
		"PRTF_POPUP", "0",
		"TRDLIMIT_TYPE", "1",

		"ISAPIDLL_URL", "", 

	//<!-- Added start here -->
	"ENCODED_USER_PARAM", "<%out.print(session.getAttribute("userPram").toString().trim());%>",
	"LOGIN_MESSAGE_URL", "<%=oN2NSession.getSetting("HTMLRoot")%><%=g_sPath%>/session/loginMessage.jsp",
	"LOGIN_ID", "<%=g_sLoginId%>",
	//<!-- Added end here -->
		"LOGOUT_OUT_URL", "<%=oN2NSession.getSetting("HTMLRoot")%><%=g_sPath%>/loginATP?action=logout&from_path=applet",	
		
		"BUY_URL", "http://www.kenwealth.com/bin/trdBuySellAWT.asp?N2N=00000000000000000000000000000000000000000000000000&|left=70&top=320&width=610&height=166&tw=WinTrdBuySell|OrderType=B&lang=EN&font=SansSerif", 
		"SELL_URL", "http://www.kenwealth.com/bin/trdBuySellAWT.asp?N2N=00000000000000000000000000000000000000000000000000&|left=70&top=320&width=610&height=166&tw=WinTrdBuySell|OrderType=S&lang=EN&font=SansSerif", 
		"CHANGE_URL", "http://www.kenwealth.com/bin/ordStatus.asp?|left=30&top=100&width=725&height=450&tw=WinOrdStatus|Filter=O", 
		"MAINT_FAV_URL", "A00007", 
		"UPD_FAV_URL", "http://www.kenwealth.com//bin/stkFavUpdList.asp?CliCode=A00007&", 
		"FAV_LIST_URL", "1|DEF123|0033|0039|4235|7201|7447|8389|~2|HIG123|4723|6769|~3|HIJ123|1007|~4|PUIFONG|4715|5037|7206|~5|PUIFONG2|1007|~6|KNN1|0108|1651|1961|4235|5398|9601|", 
 
		"NEWS_URL", "http://n2nwcfd01.ebrokerconnect.com/ebcNews/index.jsp?id=|left=20&top=40&width=700&height=515&scrollbars=yes&tw=WinNews", 
		"NEWSREADER_URL", "http://www.kenwealth.com/bin/newsKLSE.asp?c=1&|left=20&top=40&width=730&height=460&scrollbars=yes&tw=WinNewsReader|", 
 
		"LINK_TYPE_EODCHART_URL", "http://charttb.asiaebroker.com/ebcServlet/stkChartEOD?|height=480&scrollbars=yes|", 
	"GET_MESSAGE_URL", "http://uat.amesecurities.com.my/ebcServlet/ebcForwarder?Site=MsgURLKNN&CliCode=<%=g_sCliCode%>",
	"GET_MESSAGE_URL1", "<%out.print(session.getAttribute("encID")!=null?session.getAttribute("encID").toString():"");%>",
	"GET_MESSAGE_URL2", "<%out.print(session.getAttribute("encPwd")!=null?session.getAttribute("encPwd").toString():"");%>",
	//"GET_MESSAGE_ID", "<%=sGetMsgID%>",
	//"GET_MESSAGE_CODE", "Y",
	//"KEYEXPDT", "<%=strExpDate%>",
		"LIST_TRD_ACCT_URL", "http://www.kenwealth.com/bin/cliGetBHCliInfo.asp?CliCode=A00007&Encrypt=N", 
		"STOCK_ALERT_URL", "http://www.kenwealth.com/bin/prtfAlertSetting.asp?", 
		"ADD_ALERT_URL", "http://www.kenwealth.com/bin/prtfAlertAdd.asp?", 
 "exchangeATP", "<%out.print(session.getAttribute("exchangeATP")!=null?session.getAttribute("exchangeATP").toString():"");%>",
 "actionATP", "<%out.print(session.getAttribute("actionATP")!=null?session.getAttribute("actionATP").toString():"");%>",
 "orderTypeATP", "<%out.print(session.getAttribute("orderTypeATP")!=null?session.getAttribute("orderTypeATP").toString():"");%>",
 "validityATP", "<%out.print(session.getAttribute("validityATP")!=null?session.getAttribute("validityATP").toString():"");%>",
 "orderCtrlATP", "<%out.print(session.getAttribute("orderCtrlATP")!=null?session.getAttribute("orderCtrlATP").toString():"");%>",
 "brokerCodeATP", "<%out.print(session.getAttribute("brokerCodeATP")!=null?session.getAttribute("brokerCodeATP").toString():"");%>",
 "RMSNameATP", "<%out.print(session.getAttribute("RMSNameATP")!=null?session.getAttribute("RMSNameATP").toString():"");%>",
 "senderCategoryATP", "<%out.print(session.getAttribute("senderCategoryATP")!=null?session.getAttribute("senderCategoryATP").toString():"");%>",
 "senderNameATP", "<%out.print(session.getAttribute("senderNameATP")!=null?session.getAttribute("senderNameATP").toString():"");%>",
 "senderCodeATP", "<%out.print(session.getAttribute("senderCodeATP")!=null?session.getAttribute("senderCodeATP").toString():"");%>",
 "Revise_ATP", "<%out.print(session.getAttribute("Revise_ATP")!=null?session.getAttribute("Revise_ATP").toString():"");%>",
 "ReviseOT_ATP", "<%out.print(session.getAttribute("ReviseOT_ATP")!=null?session.getAttribute("ReviseOT_ATP").toString():"");%>",
 "ReviseV_ATP", "<%out.print(session.getAttribute("ReviseV_ATP")!=null?session.getAttribute("ReviseV_ATP").toString():"");%>",
 "ReviseP_ATP", "<%out.print(session.getAttribute("ReviseP_ATP")!=null?session.getAttribute("ReviseP_ATP").toString():"");%>",
 "ReviseC_ATP", "<%out.print(session.getAttribute("ReviseC_ATP")!=null?session.getAttribute("ReviseC_ATP").toString():"");%>",

		"COMPRESS", "1", 
		"START_TIME", "07:00", 
		"END_TIME", "23:15", 
 
		"REFRESH_INTERVAL", "1000",
		"BROWSER", "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; SLCC1; .NET CLR 2.0.50727; .NET CLR 1.1.4322; .NET CLR 3.5.21022; .NET CLR 3.5.30729; .NET CLR 3.0.30618)",
		"DEFAULT_LANGUAGE", "<%=sLanguages%>",
		"DEFAULT_COUNTRY", "<%=sCountry%>",
		"DEFAULT_FONT", "<%=sFont%>",
		"FONT_SIZE", "11", 
		"EXCHANGE", "MY",		
		"DRAW_RECT", "1", 
		"QPRO_TAB", "0",
		
		"IS_RT_OK", "TRUE", 
		"IS_CITIBANK", "FALSE", 
		"IS_TRADER", "TRUE", 
 
		"COL_SETTING_URL", "http://www.kenwealth.com/bin/cliColSetting.asp?CliCode=A00007", 
		"RECONSTRUCT_URL", "<%=HTMLROOT_path+g_sPath+"/applet/qsda.jsp?"%>", //<!-- pass back current ASP URL -->
 
       	"CHECKSUM", "<%=sCheckSum%>", 
 
		"XMLSETTING_URL", "<%=xml_setting_url%>",

		"XMLSETTING_BACKUPURL", "869795231877810271877810271875138591839070911831723791831723791879814031879814031879814031831055871873134831873802751865119791874470671873802751872466911870463151873802751867791471831055871866455631874470671873134831831055871873134831881149871831723791873802751833727551873802751863783951869127311866455631831723791871131071865119791879146111865119791831723791871131071865119791876474431831723791877142351879814031870463151873802751869127311831723791880481951873134831872466911831723791832391711835731311837067151850425551851093471863783951846418031845750111863783951875806511877142351867791471865119791831055871880481951873134831872466911", 

"XMLPARAM_LOGINID", "<%=g_sLoginId%>",
"XMLPARAM_CLICODE", "<%=g_sCliCode%>",
		"ACTIVE_PERIOD", "08:55-12:35|14:25-18:00",
		"RTSET", "MY|<%=drtset%>",
		"RTCOLSET", "0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|24", 
		"DEFAULT_RTCOLSET", "0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|24",
		"AVAILABLE_RTCOLSET", "0|1|2|3|18|4|5|6|7|8|9|10|12|11|14|13|15|16|24",
		"RTCOLWIDTH", "90|120|60|60|60|60|35|60|60|35|60|45|35|45|70",
		"TRY_COUNT", "4", 
		"MODE", "RealTime",
		"FEATURE_TIME", "1", 
	    "SOCKET_SETTING", "<%=feed_server_url%>|<%=enc.fetchEncode(g_sLoginId+"@CIMBSec")%>||", 
	    "DATA_MODE", "1", 
	    "SORT_PERIOD", "08:59-09:30-3000|09:30-12:35-3000|14:29-15:00-3000|15:00-18:05-3000", 
	    "SHT_QTY_FORMAT", "1000000000|B|#,###,##0.000|1000000|M|#,###,##0.00|1000|K|#,###,##0.0", 
	    "FEATURE_SETTING", "1", 
		"SORT_ORDER", "1", 
		"FONT_BOLD", "1", 
		"FEATURE_RESOLUTION", "7",
		"SOCKET_TIMEOUT", "10", 
		"title", "PRICE MOVEMENTATION",
		"CHART_SETTING", "200|15|12|60|30", 	
		
		"DEFAULT_TABLE_SETTING", "1|1|0||1000",
		"DEFAULT_PRICE_FORMAT", "###,###,###,##0.00",
		"DEFAULT_INDICES", "MY,i200.KL",
		"CHART_TIME_LIST", "8.5|9|10|11|12|13|14|15|16|17|18",
		"INIT_COUNT", "100000",
		"FEATURE_TRADE", "1",
		"FEATURE_MKT_SUMM", "4672",
		"SHOW_MKT_CHART", "0",
                "EXTRA_STATIC_COL","51|98|139",


	"MENU1_BG_COLOR", "204,204,204",
	"MENU1_FG_COLOR", "0,51,102",	
	"MENU2_BG_COLOR", "204,204,204",
	"MENU2_FG_COLOR", "0,51,102",	
	"BTN_STK_BG_COLOR", "204,204,204",
	"BTN_STK_FG_COLOR", "0,51,102",
	"MKT_SUM_BG_COLOR", "255,255,255",
	"BTN_BIDS_BG_COLOR", "0,51,102",
	"BTN_BIDS_FG_COLOR", "255,255,255",
	"BTN_NAV_BG_COLOR", "0,51,102",
	"BTN_NAV_FG_COLOR", "255,255,255",
	"MENU1_BLINK_BG_COLOR", "74,130,173",
	"MENU1_BLINK_FG_COLOR", "255,255,255",
	"TOOLTIPS_BG_COLOR", "192,192,192",
	"TOOLTIPS_FG_COLOR", "0,0,0",
	"BG_COLOR", "0,0,0",
	"GRID_SELECTED_BG_COLOR", "0,0,128",
	"GRID_BG_COLOR", "66,66,66",
	"STK_GRID_HEADER_BG_COLOR", "0,51,102",
	"STK_GRID_HEADER_FG_COLOR", "255,255,255",
	"BAR_BG_COLOR", "0,51,102",
	"BAR_FG_COLOR", "255,255,255",
	"buyColor", "0,255,0",
	"sellColor", "255,0,0",
	"STS_OK_BG_COLOR", "0,255,0",
	"STS_OK_FG_COLOR", "0,0,0",
		
//    	"DEBUG_LEVEL", "0",
//    	"DEV_MODE", "833059631",
    	"DEBUG_LEVEL", "1", 		
	
		"SHOW_BUYSELL", "<%=tradClientAcc.equals("1")?"1":"1"%>",
		"SHOW_OPTION", "<%=tradClientAcc.equals("1")?"1|1|0|1|1|1":"0|0|0|0|1|0"%>",
                "BuySellFeature","4096",
		"ENABLE_CHAR_PIN", "Y",
		"ENABLE_STOP_LIMIT", "Y",
		"ParamMaxQty", "50000",
		"REVISE_MASK", "7",
		"MDCOLWIDTH", "30|35|45|65|65|45|35|45|65|65|45",
		"CALC_TRANS_FEES", "0",
		"BS_PRICE_CHECK", "0",
		"NUM_DATA_ROWS", "19",
		"NEWS_REQUEST_URL", "http://n2nwcfd01.ebrokerconnect.com/ebcNews/getNews.jsp?type=REALTIMENEWS&Key=&NewsType=00&FrDate=&ToDate=&From=0&To=20&title=&SourceNews=BM&regional=MY&no=4"	
);

	AC_AX_RunAppletObjectTagContent_Qsee( objectArgs , "<%=sBrowserType%>");
</script>
	</td>
</tr>
</table>

<%@ include file='/footer_RT.jsp'%>

<script language='JavaScript'>
function A_OnClick(vsLinkURL, vsParam){
	if (vsParam == '') {
		vsParam = "top=0,left=100,width=800,height=520,scrollbars=yes"
	}
	OpenLinkWindow(vsLinkURL, "WinNews", vsParam);
}
</script>        
	
</body>
<%
}catch (Exception ex) {
	ex.printStackTrace();
}
} else {
	response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
}
%>