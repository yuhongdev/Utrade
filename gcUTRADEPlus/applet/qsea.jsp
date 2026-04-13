<%@include file="/common.jsp"%>
<%@include file="/util/sessionCheck.jsp"%>
<%@include file="/util/banner.jsp"%>
<%@ include file='cliCheckKey.jsp'%>
<% String url_base_path = request.getRequestURL().toString().substring(0,request.getRequestURL().toString().indexOf("/")+2); %>
<% String HTMLROOT_path = url_base_path+oN2NSession.getSetting("HTMLRoot").substring(oN2NSession.getSetting("HTMLRoot").indexOf("/")+2,oN2NSession.getSetting("HTMLRoot").length()); %>
<script language='javascript' type='text/javascript' src='<%=g_sPath %>/java/AC_RunActiveContent.js'></script>

<script type="text/javascript">
function backToMain() {
	parent.location.href="<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/cliLogin.jsp";
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
	int height = 540;
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
		feed_server_url = oN2NSession.getSetting("PFSURL1")+"|"+oN2NSession.getSetting("PFSPort");
	} else if (mode_url.equals("0")) {
		feed_server_url = oN2NSession.getSetting("PPSURL1")+"|"+oN2NSession.getSetting("PPSPort");
		sDataMode = "0";
	} else {
		feed_server_url = oN2NSession.getSetting("PFSURL1")+"|"+oN2NSession.getSetting("PFSPort");
	}
	sISAPIDLL_url = oN2NSession.getSetting("ISAPIDLL.URL")!=null?oN2NSession.getSetting("ISAPIDLL.URL").toString().trim():"bttbfd.asiaebroker.com";
	sCheckSum = oN2NSession.getSetting("Checksum")!=null?oN2NSession.getSetting("Checksum").toString().trim():"XXGOZQNZMUAPSORQVXHIVXKRLOOOGQZCZQAHRYPBPZR";

	String tradClientAcc = session.getAttribute("tradingAcc")!=null?session.getAttribute("tradingAcc").toString().trim():"1";
	String xml_setting_url = "";
	if (tradClientAcc.equals("1")) {
		xml_setting_url = enc.fetchEncode(oN2NSession.getSetting("HTMLRoot")+"/gcCIMB/java/jar/swing/xml/065KL_ED_qsea.xml").toString().trim();
	} else {
		xml_setting_url = enc.fetchEncode(oN2NSession.getSetting("HTMLRoot")+"/gcCIMB/java/jar/swing/xml/065KL_NA_qsea.xml").toString().trim();
	}	

	String sLstFile = "", sLstVerFile = "", sLanguages = "", sCountry = "", sFont = "";
	String cache_archive = "";
	String cache_version = "";
	String strMobileNum = "";
	String strEmailAdd = "";
	if (m_sLangs.equalsIgnoreCase("en")) {
		sCountry = "US";
		sLanguages = "en";
		sFont = "SansSerif";
		cache_archive = "qsea.jar,imga.jar,com.ebc.awt.jar,CalcFunc.jar,rbRT_en_US.jar,JChart2dN2N.jar";
		cache_version = "1.0.0.4,1.0.0.2,1.0.0.1,1.0.0.1,1.0.0.1,1.0.0.1";
	} else {
		sLstFile = "rbRT_zh_CN.jar";
		sCountry = "CN";
		sLanguages = "zh";
		out.println("<meta http-equiv='Content-Type' content='text/html; charset=gb2312'>");
		sFont = "PMingLiU,MingLiU,SimHei,SimSun,Arial Unicode MS,Ms Hei,Ms Song";
		sLstVerFile = "1.0.0.1";
		cache_archive = "qsea.jar,imga.jar,com.ebc.awt.jar,CalcFunc.jar,rbRT_en_US.jar,rbRT_zh_CN.jar,JChart2dN2N.jar";
		cache_version = "1.0.0.4,1.0.0.2,1.0.0.1,1.0.0.1,1.0.0.1,1.0.0.1,1.0.0.1";
	}
	String atpURL = session.getAttribute("ATPURLpublic")!=null?session.getAttribute("ATPURLpublic").toString().trim():oN2NSession.getSetting("atpURL");
	//String atpURL = oN2NSession.getSetting("atpURL");
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
	String clientSetting[] = null;
	String drtset = null;
	try {
		context = atp.tradeClientSetting(g_sLoginId, g_sCliCode, true, session);
	} catch (Exception excep) {
		context = null;
System.out.println("excep:"+excep.getMessage());
	}

//System.out.println("context :"+context);
	if (context != null) {
		java.util.List listClientSetting = context.getResultsList();
		try {
			if (listClientSetting.size()>0) {
				for (int ix=0;ix<listClientSetting.size();ix++) {
					clientSetting = (String[])listClientSetting.get(0);
					System.out.println("client setting during applet loading:"+clientSetting[7]);
					break;
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
										height = 520;
								break;
								case 3: width = 1210;
										height = 520;
								break;
								case 4: width = 1000;
										height = 420;
								break;
								default: width = 1000;
										height = 416;
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
			height = 520;
		}
		iWidth = width;	
		
		strMobileNum = session.getAttribute("senderMobileATP")!=null?session.getAttribute("senderMobileATP").toString():"";
		strEmailAdd = session.getAttribute("senderEmailATP")!=null?session.getAttribute("senderEmailATP").toString():"";
	} else {
		out.println("<script language='javascript'>");
		out.println("	alert('" + oN2NSession.getSetting("InvalidSession.MultipleLogin.EN") + "');");
		out.println("parent.location.href='"+oN2NSession.getSetting("HTMLRoot")+g_sPath+"/loginATP?action=logout&frm=rt';");
		out.println("</script>");
	}
String nMaxGTDDay = "30";
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
<script language="javascript">
function cliChgPwd_parent() {
	window.open('<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/cliChgPasswd.jsp?act=chgPwd','winRegSuccess','left=310,top=225,width=380,height=420,resizable=yes,status=yes',false);
}

function cliChgPIN_parent() {
	window.open('<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/cliChgPIN.jsp?secure=N','winRegSuccess','left=310,top=225,width=300,height=255',false);
}

function cliForgotPIN_parent() {
	window.open('<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/cliForgetPIN.jsp?secure=Y','winRegSuccess','left=310,top=225,width=410,height=240',false);
}

function cliAccInfo_parent() {
	window.open('<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/acctInfo.jsp?secure=Y','winRegSuccess','left=310,top=225,width=800,height=220',false);
}
function cliForgotPwd_parent() {
	window.open('<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/cliForgetPwd.jsp?secure=Y','winRegSuccess','left=310,top=225,width=415,height=225,resizable=yes,status=yes',false);
}
function OpenWinCliReg() {
	window.open('<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/registration.jsp?secure=Y','winRegSuccess','left=310,top=225,width=800,height=225,resizable=yes,status=yes',false);
}
</script>
<iframe src='' id='fraMenu' scroll='no' scrolling='no' frameborder='1'
style='position:absolute;visibility:hidden;filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);border:0;top:0;left:0;width:0;height:0;background-color:#000000;z-index:998;' class='iframe'></iframe>
<iframe src='' id='fraSubMenu' scroll='no' scrolling='no' frameborder='1'
style='position:absolute;visibility:hidden;filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);border:0;top:0;left:0;width:0;height:0;background-color:transparent;z-index:997;' class='iframe'></iframe>
<script type="text/javascript" src="<%=g_sJSPath%>/swfobjects2.js"></script>

</head>
<body class="thrColAbsHdr">
<%if(request.getParameter("mode") == null || request.getParameter("mode") == "") {%>

<div id="mode" style='z-index: 1; position: absolute; top: 10px; left: 370px; font-size: 7pt; font-family: arial,verdana;'>
[ <a href="qsea.jsp?lang=en&amp;mode=0" style="text-decoration:none;color:black">Click here if you unable to see the Stock prices after installing JAVA</a> ]
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
		flashvars.settingPath = "https://jar.asiaebroker.com/flash/tickerSetting_EN.xml";
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
		swfobject.embedSWF("https://jar.asiaebroker.com/flash/ticker.swf", "divFlash", "<%=iWidth%>", "20", "6.0.0","https://jar.asiaebroker.com/flash/ticker.swf", flashvars, params, attributes);
	// -->
		</script>
<div id="divFlash" name="divFlash" vAlign="top" align="center">
<br>This content requires <a href="http://www.adobe.com/go/getflashplayer">Adobe Flash Player</a>.
</div>
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
    "CODEBASE", "http://jar.asiaebroker.com/java/jar/swing/qsea",
	"CACHE_OPTION", "PLUGIN",
	"CACHE_ARCHIVE", "<%=cache_archive%>",
	"CACHE_VERSION", "<%=cache_version%>",
	"TYPE", "application/x-java-applet;version=1.6",
	"MAYSCRIPT", "true",
	"JAVA_ARGUMENTS", "-Djnlp.packEnabled=true",
	"codebase_lookup", "false",
	"HTMLROOT", "<%=oN2NSession.getSetting("HTMLRoot")%><%=g_sPath%>/",
	"ATPURL", "<%=atpURL%>",
	"IS_MINI", "1",
	"PRTF_POPUP", "0",
	"SLEEP_INTERVAL", "30",
        "EXTRA_STATIC_COL","51|98",

	"TRDLIMIT_TYPE", "1",
	"ISAPIDLL_URL", "<%=sISAPIDLL_url%>",

	"image", "http://jar.asiaebroker.com/java/jar/swing/img/CIMB-loading-animation.gif",
	"boxmessage", "loading...",
	"boxborder", "false",
	"IS_MINI", "1",	
	"centerimage", "true",
	"LOOK_AND_FEEL", "javax.swing.plaf.metal.MetalLookAndFeel",
	"CONTENT-ENCODING", "pack200-gzip , gzip",
	"ACCEPT-ENCODING", "pack200-gzip , gzip",

	//<!-- Added start here -->
	"ENCODED_USER_PARAM", "<%out.print(session.getAttribute("userPram").toString().trim());%>",
	"LOGIN_MESSAGE_URL", "<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/session/loginMessage.jsp",
	"LOGIN_ID", "<%=g_sLoginId%>",
	//<!-- Added end here -->

	"BUY_URL", "<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/trdBuySellAWT.jsp?N2N=00000000000000000000000000000000000000000000000000&|left=70&top=320&width=610&height=166&tw=WinTrdBuySell|OrderType=B&lang=EN&font=SansSerif",
	"SELL_URL", "<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/trdBuySellAWT.jsp?N2N=00000000000000000000000000000000000000000000000000&|left=70&top=320&width=610&height=166&tw=WinTrdBuySell|OrderType=S&lang=EN&font=SansSerif",
	"CHANGE_URL", "<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/ordStatus.jsp?|left=30&top=100&width=725&height=450&tw=WinOrdStatus|Filter=O",
	
	"LOGOUT_OUT_URL", "<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/loginATP?action=logout&from_path=applet",
 	

	"NEWS_URL", "left=20&top=40&width=700&height=515&scrollbars=yes&tw=WinNews|<%=url_base_path%>news.asiaebroker.com/ebcNews/index.jsp?id=",
	"NEWSREADER_URL", "<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/newsKLSE.jsp?c=1&|left=20&top=40&width=730&height=460&scrollbars=yes&tw=WinNewsReader|",
 
	"LINK_TYPE_EODCHART_URL", "http://charttb.asiaebroker.com/ebcServlet/stkChartEOD?|left=20&top=40&width=750&height=500&scrollbars=yes&tw=WinChartEOD|",
	"GET_MESSAGE_URL", "<%=oN2NSession.getSetting("HTMLRoot")%>/ebcServlet/ebcForwarder?Site=MsgURLKNN&CliCode=<%=g_sCliCode%>",
	"GET_MESSAGE_URL1", "<%out.print(session.getAttribute("encID")!=null?session.getAttribute("encID").toString():"");%>",
	"GET_MESSAGE_URL2", "<%out.print(session.getAttribute("encPwd")!=null?session.getAttribute("encPwd").toString():"");%>",
	"GET_MESSAGE_ID", "<%=sGetMsgID%>",
	"GET_MESSAGE_CODE", "Y",
	"KEYEXPDT", "<%=sKeyExpDT%>",
	"STOCK_ALERT_URL", "http://sans.n2n-connect.com/SANS/BH/EntryBH.jsp?BHCode=065&Clicode=<%=g_sCliCode%>&Mobile=<%=strMobileNum%>&Email=<%=strEmailAdd%>&LoginID=<%=g_sLoginId%>&Encrypt=N&",
	"ADD_ALERT_URL", "http://sans.n2n-connect.com/SANS/BH/EntryBH.jsp?BHCode=065&Clicode=<%=g_sCliCode%>&Mobile=<%=strMobileNum%>&Email=<%=strEmailAdd%>&LoginID=<%=g_sLoginId%>&Encrypt=N&",
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
	"END_TIME", "17:00",
 
	"REFRESH_INTERVAL", "1000",
	"BROWSER", "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; SLCC1; .NET CLR 2.0.50727; .NET CLR 1.1.4322; .NET CLR 3.5.21022; .NET CLR 3.5.30729; .NET CLR 3.0.30618)",
	"DEFAULT_LANGUAGE", "<%=sLanguages%>",
	"DEFAULT_COUNTRY", "<%=sCountry%>",
	"DEFAULT_FONT", "<%=sFont%>",
	"FONT_SIZE", "11",
	"EXCHANGE", "KL",
        "BHCODE","065",
 
	"IS_RT_OK", "TRUE",
	"IS_CITIBANK", "FALSE",
	"IS_TRADER", "TRUE",
	"FEATURE_RESOLUTION", "7",
 
	"COL_SETTING_URL", "<%=HTMLROOT_path+g_sPath+"/cliColSetting.jsp?CliCode="+g_sCliCode%>",
	"RECONSTRUCT_URL", "<%=HTMLROOT_path+g_sPath+"/applet/qsea.jsp?"%>", //<!-- pass back current ASP URL -->
 
	"DRAW_RECT", "1",
	"CHECKSUM", "<%=sCheckSum%>",
 
	"LIST_TRD_ACCT_URL", "<%=oN2NSession.getSetting("HTMLRoot")+g_sPath%>/cliGetBHCliInfo.jsp?CliCode=<%=g_sCliCode%>&Encrypt=N",
	"XMLSETTING_URL", "<%=xml_setting_url%>",
	"XMLSETTING_BACKUPURL", "869795231877810271877810271875138591839070911831723791831723791879814031879814031879814031831055871873134831873802751865119791874470671873802751872466911870463151873802751867791471831055871866455631874470671873134831831055871873134831881149871831723791873802751833727551873802751863783951869127311866455631831723791871131071865119791879146111865119791831723791871131071865119791876474431831723791877142351879814031870463151873802751869127311831723791880481951873134831872466911831723791832391711835731311837067151850425551851093471863783951846418031845750111863783951875806511877142351867791471865119791831055871880481951873134831872466911",
 
	"XMLPARAM_LOGINID", "<%=g_sLoginId%>",
	"XMLPARAM_CLICODE", "<%=g_sCliCode%>",
	"ACTIVE_PERIOD", "08:55-12:35|13:55-17:15",
	"RTSET", "KL|<%=drtset%>",
	"RTCOLSET", "1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16",
	"OSCOLSET", "2|41|42|43|12|10|17|18|26|27|28|15|31|34",
	"RTCOLNAMESET", "9~1000101~S/Qty",
	"RTCOLSET_INDICES", "1|2|3|4|5|6|7",
	"RTCOLWIDTH", "90|120|60|60|60|60|35|60|60|35|60|45|35|45|70",
	"RTCOLSIZESET_INDICES", "0|90|100|100|100|100|100|100",
	"TRY_COUNT", "4",
	"MODE", "RealTime",
	"FEED_MODE", "1",
	"SLEEP_COUNTDOWN_TIME", "5",
	"FEATURE_TIME", "1",
    	"SOCKET_SETTING", "<%=feed_server_url%>|<%=enc.fetchEncode(g_sLoginId+"@CIMBSec")%>||",
    	"DATA_MODE", "<%=sDataMode%>",
    	"SORT_PERIOD", "08:59-09:30-10000|09:30-12:35-180000|14:29-15:00-180000|15:00-18:05-180000",
    	"SHT_QTY_FORMAT", "1000000000|B|#,###,##0.000|1000000|M|#,###,##0.00|1000|K|#,###,##0.0",
    	"DEBUG_LEVEL", "0",
//    	"DEV_MODE", "833059631",
//    	"DEBUG_LEVEL", "1",  
    	"FEATURE_SETTING", "1",
	"SORT_ORDER", "1",
	"FONT_BOLD", "1",
	"SOCKET_TIMEOUT", "10",
	"title", "PRICE MOVEMENTATION",
	"CHART_SETTING", "200|15|12|60|30",
	"LOT_SIZE_LABEL", "Y",
	"TEST_SESSION", "Y", 
        "REVISE_MASK","1",

	"DEFAULT_SORT_INDEX", "14",	
	//"DEFAULT_TABLE_SETTING", "1|14|1||",
	"DEFAULT_PRICE_FORMAT", "###,###,###,##0.000",
	"DEFAULT_INDICES", "MY,i200.KL",
	"CHART_TIME_LIST", "9|10|11|12|13|14|15|16|17",
	"CHART_TIME_LIST_INDICES", "8.5|9|10|11|12|13|14|15|16|17|18",
	"INIT_COUNT", "100000",
	"FEATURE_TRADE", "1",
    	"TEST_SESSION", "Y",
    	"SHOW_MKT_CHART", "1",
	"ParamMaxQty", "50000",
	"MAX_DURATION", "<%=nMaxGTDDay%>",
	"ENABLE_CHAR_PIN", "Y",
	"ENABLE_STOP_LIMIT", "N",
	"QPRO_TAB", "0",
	//"MDCOLWIDTH", "30|35|45|65|65|45|35|45|65|65|45",
	"CALC_TRANS_FEES", "1",
	"BS_PRICE_CHECK", "0",	

	
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
//<!-- Only use for Masa Feed-->
/*<!--
	"BOARD_FG_COLOR", "255,255,255|0,255,255|0,255,0",	
	"RTCOL_TOOLTIPS", "0~0~<b><u>Status</u></b><br>'&nbsp;'&nbsp;-&nbsp;Active<br>'B'&nbsp;-&nbsp;Active with Alert Announcement<br>'S'&nbsp;-&nbsp;Suspended<br>'T'&nbsp;-&nbsp;Suspend with Alert Announcement<br>'D'&nbsp;-&nbsp;Delisted<br>'N'&nbsp;-&nbsp;New Listing<br>'P'&nbsp;-&nbsp;New Listing with Alert Announcement<br>'Q'&nbsp;-&nbsp;Designated",
-->*/	
    "COUNTER_FG_COLOR_BY_BIT","4096~255,0,0|1~255,255,255|3~0,255,255|7~0,255,0|15~255,0,255",
	"DEFAULT_RTCOLSET", "0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|26",
	"AVAILABLE_RTCOLSET", "0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|24|25|26|27|28|29|30|31|32|33|34|35|66|68|130|132|133|134|143",
	"SHOW_ALL_COL", "0",
	"SHOW_CREDITLIMIT", "Y",
        "SHOW_NEWS_HREF_MESSAGE","1",

	"ALL_NEWS", "<%=tradClientAcc.equals("1")?"1":"1"%>",
	"SHOW_BUYSELL", "<%=tradClientAcc.equals("1")?"1":"1"%>",
	"SHOW_OPTION", "<%=tradClientAcc.equals("1")?"1|1|0|1|1|1":"0|0|1|1|1|0"%>",
	"NUM_DATA_ROWS", "<%=tradClientAcc.equals("1")?"16":"16"%>",
	"NEWS_REQUEST_URL", "http://jar.asiaebroker.com/ref/generalnews.txt",
	"STK_CALC_INFO", "0800EA|0.001|0.3|0820EA|0.001|0|0821EA|0.001|0|0823EA|0.001|0|0822EA|0.001|0|",
	"ISFEED_LIMITPRICE", "3"
	
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

<!-- end #footer -->
</body>
<%
}catch (Exception ex) {
	ex.printStackTrace();
	response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
}
} else {
	response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
}
%>