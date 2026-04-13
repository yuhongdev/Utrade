<%@include file="/common.jsp"%>
<%@include file="/util/sessionCheck.jsp"%>
<%@include file="/util/banner.jsp"%>
<% String url_base_path = request.getRequestURL().toString().substring(0,request.getRequestURL().toString().indexOf("/")+2); %>
<% String HTMLROOT_path = url_base_path+oN2NSession.getSetting("HTMLRoot").substring(oN2NSession.getSetting("HTMLRoot").indexOf("/")+2,oN2NSession.getSetting("HTMLRoot").length()); %>
<script language='javascript' type='text/javascript' src='/gcAM/java/AC_RunActiveContent.js'></script>
<style type="text/css">
.menu_image {
	background: #092475 url(<%=g_sImgPath%>/user_login2.jpg) no-repeat;
	font-size: 0;
	height: 26px;
	width: 1000px;
	float:left;
	top:30px;
	left:0px;
	margin: 0px;
	position:absolute;
}
body  {
	margin: 0; /* it's good practice to zero the margin and padding of the body element to account for differing browser defaults */
	padding: 0;
	text-align: center;
	background-image: url(<%=g_sImgPath%>/bodybg.png);
	background-repeat: repeat-x;
	background-color: #101010;
}
.thrColAbsHdr #container {
	position: relative; /* adding position: relative allows you to position the two sidebars relative to this container */
	width: 1000px;
	margin: 0 auto;
	text-align: left;
} 
.thrColAbsHdr #bodyContent {
	width: 995px;
	margin: 0;
	padding: 0;
	border: 1px solid #54a9f1;
	/*background-image: url(<%=g_sImgPath%>/bodycontent_bg_home.jpg); */
	background-repeat: repeat-y;
	height: 520px;
}
.thrColAbsHdr #bodyContents {
	width: 999px;
	margin: 0;
	padding: 0;
	border: 1px solid #54a9f1;
	background-image: url(<%=g_sImgPath%>/bodycontent_bg_homes.jpg); 
	background-repeat: repeat-y;
	height: 900px;
}
.thrColAbsHdr #footers {
	position: relative; /* adding position: relative allows you to position the two sidebars relative to this container */
	width: 1000px;
	text-align: left;
	background-image: url(<%=g_sImgPath%>/footer_bg.png);
	height: 35px;
	margin-top: 0;
	margin-right: auto;
	margin-bottom: 0;
	margin-left: auto;
} 
.thrColAbsHdr #footer p {
	margin: 0; /* padding on this element will create space, just as the the margin would have, without the margin collapse issue */
}
.footerlink {
	font: 12px/10px Arial;
	FONT-SIZE: 10px; COLOR: #ffffff
}
.footerlink A {
	font: 12px/10px Arial;
	FONT-SIZE: 10px;
	COLOR: #ffffff;
	text-decoration: underline;
}
.footerlink A:visited {
	font: 12px/10px Arial;
	FONT-SIZE: 10px;
	COLOR: #ffffff;
	text-decoration: underline;
}
.footerlink A:hover {
	font: 12px/10px Arial;
	FONT-SIZE: 10px;
	COLOR: #ffffff;
	text-decoration: none;
}
.Content_Listing
{
    FONT: 12px/10px Arial, Helvetica, sans-serif;
    COLOR: #7c7c7c;
    TEXT-ALIGN: justify
}
</style>
<%
	String sCLASS_ID = "clsid:CAFEEFAC-0016-0000-FFFF-ABCDEFFEDCBA";
	String sUserAgent = "";
	boolean ie = false;
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
	if (mode_url.equals("1")) {
		feed_server_url = oN2NSession.getSetting("PFSURL1")+"|"+oN2NSession.getSetting("PFSPort");
	} else if (mode_url.equals("0")) {
		feed_server_url = oN2NSession.getSetting("PPSURL1")+"|"+oN2NSession.getSetting("PPSPort");
	} else {
		feed_server_url = oN2NSession.getSetting("PFSURL1")+"|"+oN2NSession.getSetting("PFSPort");
	}
	sISAPIDLL_url = oN2NSession.getSetting("ISAPIDLL.URL")!=null?oN2NSession.getSetting("ISAPIDLL.URL").toString().trim():"bttbfd.asiaebroker.com";
	sCheckSum = oN2NSession.getSetting("Checksum")!=null?oN2NSession.getSetting("Checksum").toString().trim():"RTWDBEZSCJUEPDNGXMXUTMZGGDDAHJNNV";
sCheckSum = "CCLTEVSERYXUGSZWCCNNYYSWJTPUNZZHGVTIXGJGWJZMJBVLJ";
	String tradClientAcc = session.getAttribute("tradingAcc")!=null?session.getAttribute("tradingAcc").toString().trim():"1";
	String xml_setting_url = "";
	if (tradClientAcc.equals("1")) {
		//xml_setting_url = oN2NSession.getSetting("XML.URL.trading.acc.activated")!=null?oN2NSession.getSetting("XML.URL.trading.acc.activated").toString().trim():"869795231877810271877810271875138591839070911831723791831723791877810271867791471877142351877810271831055871865119791877142351870463151865119791867791471865787711876474431874470671871798991867791471876474431831055871866455631874470671873134831831723791871131071865119791879146111865119791831723791871131071865119791876474431831723791877142351879814031870463151873802751869127311831723791880481951873134831872466911831723791832391711835731311837067151850425551851093471863783951846418031845750111863783951875806511877142351867791471865119791831055871880481951873134831872466911";
		xml_setting_url = oN2NSession.getSetting("XML.URL.trading.acc.activated")!=null?enc.fetchEncode(url_base_path+"test.asiaebroker.com/java/jar/swing/xml/086KL_ED_qsea.xml").toString().trim():"869795231877810271877810271875138591877142351839070911831723791831723791877810271867791471877142351877810271831055871865119791877142351870463151865119791867791471865787711876474431874470671871798991867791471876474431831055871866455631874470671873134831831723791871131071865119791879146111865119791831723791871131071865119791876474431831723791877142351879814031870463151873802751869127311831723791880481951873134831872466911831723791832391711835731311837067151850425551851093471863783951846418031845750111863783951875806511877142351867791471865119791831055871880481951873134831872466911";
	} else {
		//xml_setting_url = oN2NSession.getSetting("XML.URL.no.trading.acc")!=null?oN2NSession.getSetting("XML.URL.no.trading.acc").toString().trim():"869795231877810271877810271875138591839070911831723791831723791877810271867791471877142351877810271831055871865119791877142351870463151865119791867791471865787711876474431874470671871798991867791471876474431831055871866455631874470671873134831831723791871131071865119791879146111865119791831723791871131071865119791876474431831723791877142351879814031870463151873802751869127311831723791880481951873134831872466911831723791832391711835731311837067151850425551851093471863783951852429311843746351863783951875806511877142351867791471865119791831055871880481951873134831872466911";
		xml_setting_url = oN2NSession.getSetting("XML.URL.no.trading.acc")!=null?enc.fetchEncode(url_base_path+"test.asiaebroker.com/java/jar/swing/xml/086KL_NA_qsea.xml").toString().trim():"869795231877810271877810271875138591877142351839070911831723791831723791877810271867791471877142351877810271831055871865119791877142351870463151865119791867791471865787711876474431874470671871798991867791471876474431831055871866455631874470671873134831831723791871131071865119791879146111865119791831723791871131071865119791876474431831723791877142351879814031870463151873802751869127311831723791880481951873134831872466911831723791832391711835731311837067151850425551851093471863783951852429311843746351863783951875806511877142351867791471865119791831055871880481951873134831872466911";
	}	

	String sLstFile = "", sLstVerFile = "", sLanguages = "", sCountry = "", sFont = "";
	if (m_sLangs.equalsIgnoreCase("en")) {
		sCountry = "US";
		sLanguages = "en";
		sFont = "SansSerif";
	} else {
		sLstFile = "rbRT_zh_CN.jar";
		sCountry = "CN";
		sLanguages = "zh";
		out.println("<meta http-equiv='Content-Type' content='text/html; charset=gb2312'>");
		sFont = "PMingLiU,MingLiU,SimHei,SimSun,Arial Unicode MS,Ms Hei,Ms Song";
		sLstVerFile = "2.0.0.38";
	}
	String atpURL = session.getAttribute("ATPURLpublic")!=null?session.getAttribute("ATPURLpublic").toString().trim():oN2NSession.getSetting("atpURL");
	//String atpURL = "uat.amesecurities.com.my:20020";
	String scheduled_time = "064001";
	java.util.Calendar expDate = java.util.Calendar.getInstance();
	expDate.add(java.util.Calendar.DATE, 1);
	String strExpDate = new java.text.SimpleDateFormat("yyyyMMdd"+scheduled_time).format(expDate.getTime());	
	String defaultKey = oN2NSession.getSetting("qcMsgID").toString();
	boolean connMagicKey = true;

	javax.servlet.ServletContext servlets = getServletContext();
	if (servlets!=null) {
	} else {
		servlets = request.getSession().getServletContext();
	}

	// Part 1: 
	// If have the magic key, means someone had hit LMS and stored in server memory.
	// Check the KEYEXPDT or expiration date in session whether had expired.
	if (servlets.getAttribute("GET_MESSAGE_ID")!=null&&!servlets.getAttribute("GET_MESSAGE_ID").equals("")) {
		System.out.println(new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"|"+"GET_MESSAGE_ID:"+servlets.getAttribute("GET_MESSAGE_ID")+"|"+"encID:"+session.getAttribute("encID")+"|"+"encPwd:"+session.getAttribute("encPwd")+"|");
		connMagicKey = false;
		try {
			// if the KEYEXPDT is not empty
			if (servlets.getAttribute("KEYEXPDT")!=null) {
				String strExpDateTime = servlets.getAttribute("KEYEXPDT").toString();
				// Parse the "yyyyMMddHHmmss" to expiration date
				java.util.Date expDateTime = new java.text.SimpleDateFormat("yyyyMMddHHmmss").parse(strExpDateTime);
				// if expiration date is before current date, means had expired
				if (expDateTime.before(new java.util.Date())) {
					connMagicKey = true;
				}
			}
		} catch (java.text.ParseException ep) {
		}
	}

	// Part 2:
	// scenario 1: If no LMS magic key or connect first time
	// scenario 2: If expired after check the KEYEXPDT
	if(connMagicKey) {
		try {
			// connect to LMS server to retrieve the parameters
			com.n2n.util.N2NATPConnect atpConnect = new com.n2n.util.N2NATPConnect(oN2NSession.getSetting("qcfeed"),"EN");
			atpConnect.loginLMS(g_sLoginId,session,"3",oN2NSession);

			if (session.getAttribute("GET_MESSAGE_ID")==null) {
				servlets.setAttribute("GET_MESSAGE_ID",defaultKey);
				servlets.setAttribute("KEYEXPDT",strExpDate);
			} else {
				servlets.setAttribute("GET_MESSAGE_ID",session.getAttribute("GET_MESSAGE_ID").toString().trim());
			}
		} catch (com.n2n.connection.TCException e) {
			servlets.setAttribute("GET_MESSAGE_ID",defaultKey);
		}
		// Get the KEYEXPDT from session, replace if session is empty
		if (servlets.getAttribute("KEYEXPDT")!=null&&!servlets.getAttribute("KEYEXPDT").equals("")) {
		} else {
			try {
				// the KEYEXPDT in session is empty, either not implemented or error get exp date
				servlets.setAttribute("KEYEXPDT",strExpDate);
			} catch (Exception e) {
			}
		}
		
		// encrypt the magic key and store to GET_MESSAGE_ID
		try {
			String message_id=servlets.getAttribute("GET_MESSAGE_ID").toString();
			com.spp.util.security.Encrypt en = new com.spp.util.security.Encrypt();
			message_id = en.fetchEncode(message_id);
			servlets.setAttribute("GET_MESSAGE_ID",message_id);
		} catch (java.lang.Exception ex) {
		}
	}

String sTrdHtmlRoot = HTMLROOT_path + g_sPath.substring(1) + "/";	
//System.out.println("sess:"+session.getAttribute("userPram").toString().trim());	
		String sCode = "com.n2n.realtime.RealTimeApplet.class";

			String sBrowserType = "";
			String sClassID = "";
			if(!ie)
			{
				sBrowserType = "Others";
				sClassID = "java:" + sCode;
			}
			else {
				sBrowserType = "IE";
				sClassID = sCLASS_ID;
			}
%>

<html>
<head>
	<META content='-1' http-equiv='Expires'>
	<META content='no-cache' http-equiv='Pragma'>
	<META content='no-cache' http-equiv='Cache-Control'>
	<title>Bursa Malaysia Real Time</title>

<script language='JavaScript' src='<%=g_sJSPath%>/LinkFunc.js'></script>
<script type="text/javascript" src="<%=g_sJSPath%>/pluginDetect.js"></script>
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
<div id="container">
  <div id="header">
<table width="1000" border="0" cellspacing="0" cellpadding="0">
<tr>
  <td bgcolor="#072887">
  <table border="0" width="100%">
  <tr>
	<td height="30"><div align="right"><font style="font-family: Arial; font-size: 8pt; font-weight: bold; color: white;">Welcome <%=session.getAttribute("senderName")%>!  &nbsp;&nbsp;
<a href="qsda.jsp?lang=en" style="color:#FFFFFF;">[Derivative]</a>&nbsp;[English]&nbsp;<a href="qsea_cn.jsp?lang=cn" style="color:#FFFFFF;">[Chinese]</a>&nbsp;<a href="qsea_icons.jsp?lang=en" style="color:#FFFFFF;">[Icons]</a>&nbsp;&nbsp;<a href="/gcAM/login1?action=logout" style="color:#FFFFFF;">[Logout]</a>&nbsp;<br>
	<a href="qsea_en.jsp?lang=en&amp;mode=0" style="color:#FFFFFF;font-weight:normal;" 
	target="_self">[ Click here if you are unable to see the Stock prices after installing JAVA ]</a></font></div>
  	</td>
  </tr>
  </table>
  </td>
</tr>
<tr height="20"><td align='left'>
	<script language="JavaScript" type="text/javascript">
	<!--
		var flashvars = {};
		flashvars.settingPath = "http://jar.asiaebroker.com/flash/tickerSetting_EN.xml";
		var params = {};
		params.menu = "false";
		params.quality = "high";
		params.bgcolor = "#000000";
		params.allowScriptAccess = "always";
		params.type = "application/x-shockwave-flash";
		params.wmode = "transparent";
		params.salign = "lt";
		params.allowFullScreen = "false";
		var attributes = {};
		attributes.name = "ticker";
		attributes.id = "ticker";
		swfobject.embedSWF("http://jar.asiaebroker.com/flash/ticker.swf", "myContent", "1000", "20", "6.0.0","http://jar.asiaebroker.com/flash/ticker.swf", flashvars, params, attributes);
	// -->
		</script>
		<div id="myContent"><p>Alternative content</p></div>		
	</td>
</tr>
</table>  
  <!-- end #header --></div>
  <div id="bodyContent">
<table width="1000" border="0" cellspacing="0" cellpadding="0">
<tr>
<td style="overflow-x: hidden;" width="999">
<script language="JavaScript">
	var objectArgs = new Array(
		"CLASSID", "<%=sClassID%>",
		"CODEBASE1","http://dl.asiaebroker.com/download/jre-6u17-windows-i586-s.exe", 
		"WIDTH","999", 
		"HEIGHT","580", 
		"CODE","com/n2n/realtime/RealTimeApplet.class", 
		"CODEBASE","http://uat.amesecurities.com.my/gcAM/java/jar/swing", 
		"CACHE_OPTION","PLUGIN",
		"CACHE_ARCHIVE","qseaTest.jar,img.jar,schema.jar,com.ebc.awt.jar,CalcFunc.jar,rbRTBS_en_US.jar,JChart2dN2N.jar",
		"CACHE_VERSION","1.0.0.1_20,1.0.0.1_03,1.0.0.3,1.0.0.1,1.0.0.3,1.0.0.3,1.0.0.1", 
		"TYPE","application/x-java-applet;version=1.6", 
		"PLUGINSPAGE","http://dl.asiaebroker.com/download/jre-6u17-windows-i586-s.exe", 
		"MAYSCRIPT","true",
		"JAVA_ARGUMENTS","-Djnlp.packEnabled=true",

		"HTMLROOT","<%=sTrdHtmlRoot%>",
		"ATPURL","<%=atpURL%>",

		"IS_MINI","1",
		"IS_ICON_MENU","Y",
		"PRTF_POPUP","0",
		"TRDLIMIT_TYPE","1",

		"ISAPIDLL_URL","<%=sISAPIDLL_url%>",

		"ENCODED_USER_PARAM","<%out.print(session.getAttribute("userPram").toString().trim());%>",
		"LOGIN_MESSAGE_URL","http://uat.amesecurities.com.my/gcAM/session/loginMessage.jsp",
		"LOGIN_ID","<%out.print(session.getAttribute("loginid").toString().trim());%>",

		"LOGOUT_OUT_URL","http://uat.amesecurities.com.my/gcAM/login1?action=logout&from_path=applet",
		"BUY_URL","http://uat.amesecurities.com.my/gcAM/trdBuySellAWT.jsp?N2N=00000000000000000000000000000000000000000000000000&|left=70&top=320&width=610&height=166&tw=WinTrdBuySell|OrderType=B&lang=EN&font=SansSerif",
		"SELL_URL","http://uat.amesecurities.com.my/gcAM/trdBuySellAWT.jsp?N2N=00000000000000000000000000000000000000000000000000&|left=70&top=320&width=610&height=166&tw=WinTrdBuySell|OrderType=S&lang=EN&font=SansSerif",
		"CHANGE_URL","http://uat.amesecurities.com.my/gcAM/ordStatus.jsp?|left=30&top=100&width=725&height=450&tw=WinOrdStatus|Filter=O",


		"NEWS_URL","http://news.asiaebroker.com/ebcNews/index.jsp?id=|left=20&top=40&width=700&height=515&scrollbars=yes&tw=WinNews",
		"NEWSREADER_URL","http://uat.amesecurities.com.my/gcAM/newsKLSE.jsp?c=1&|left=20&top=40&width=730&height=460&scrollbars=yes&tw=WinNewsReader|",

		"LINK_TYPE_EODCHART_URL","http://charttb.asiaebroker.com/ebcServlet/stkChartEOD?",
		"GET_MESSAGE_URL","http://uat.amesecurities.com.my/ebcServlet/ebcForwarder?Site=MsgURLKNN&CliCode=<%=g_sCliCode%>",
		"GET_MESSAGE_URL1","<%out.print(session.getAttribute("encID")!=null?session.getAttribute("encID").toString():"");%>",
		"GET_MESSAGE_URL2","<%out.print(session.getAttribute("encPwd")!=null?session.getAttribute("encPwd").toString():"");%>",
		"GET_MESSAGE_ID","<%out.print(session.getAttribute("GET_MESSAGE_ID")!=null?session.getAttribute("GET_MESSAGE_ID").toString():defaultKey);%>",
		"KEYQUOTE_ID1","<%out.print(session.getAttribute("KEYQUOTE_ID1")!=null?session.getAttribute("KEYQUOTE_ID1").toString():"");%>",
		"KEYQUOTE_ID2","<%out.print(session.getAttribute("KEYQUOTE_ID2")!=null?session.getAttribute("KEYQUOTE_ID2").toString():"");%>",
		"KEYEXPDT","<%out.print(session.getAttribute("KEYEXPDT")!=null?session.getAttribute("KEYEXPDT").toString():strExpDate);%>",
		"LIST_TRD_ACCT_URL","http://uat.amesecurities.com.my/gcAM/cliGetBHCliInfo.jsp?CliCode=<%=g_sCliCode%>&Encrypt=N",
		"STOCK_ALERT_URL","http://sans.n2n-connect.com/SANS/BH/EntryBH.jsp?BHCode=057&Clicode=<%=g_sCliCode%>&Mobile=&Email=&LoginID=<%=g_sLoginId%>&Encrypt=N&",
		"ADD_ALERT_URL","http://sans.n2n-connect.com/SANS/BH/EntryBH.jsp?BHCode=057&Clicode=<%=g_sCliCode%>&Mobile=&Email=&LoginID=<%=g_sLoginId%>&Encrypt=N&",


		"COMPRESS","1",
		"START_TIME","07:00",
		"END_TIME","23:15",

		"REFRESH_INTERVAL","1000",
		"BROWSER","Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; SLCC1; .NET CLR 2.0.50727; .NET CLR 1.1.4322; .NET CLR 3.5.21022; .NET CLR 3.5.30729; .NET CLR 3.0.30618)",
		"DEFAULT_LANGUAGE","<%=sLanguages%>", 
		"DEFAULT_COUNTRY","<%=sCountry%>", 
		"DEFAULT_FONT","<%=sFont%>",
		"FONT_SIZE","11",
		"EXCHANGE","KL",
		"DRAW_RECT","1",
		"SLEEP_INTERVAL","30",

		"IS_RT_OK","TRUE",
		"IS_CITIBANK","FALSE",
		"IS_TRADER","TRUE",
		
		"COL_SETTING_URL","<%=oN2NSession.getSetting("HTMLRoot")+oN2NSession.getSetting("projectFolder")+"/cliColSetting.jsp?CliCode="+g_sCliCode%>",
		"RECONSTRUCT_URL","<%=oN2NSession.getSetting("HTMLRoot")+oN2NSession.getSetting("projectFolder")+"/qsea_icons.jsp?"%>",

		"CHECKSUM","<%=sCheckSum%>",

		"XMLSETTING_URL","<%=xml_setting_url%>",

		"XMLSETTING_BACKUPURL","869795231877810271877810271875138591839070911831723791831723791879814031879814031879814031831055871873134831873802751865119791874470671873802751872466911870463151873802751867791471831055871866455631874470671873134831831055871873134831881149871831723791873802751833727551873802751863783951869127311866455631831723791871131071865119791879146111865119791831723791871131071865119791876474431831723791877142351879814031870463151873802751869127311831723791880481951873134831872466911831723791832391711835731311837067151850425551851093471863783951846418031845750111863783951875806511877142351867791471865119791831055871880481951873134831872466911",

		"XMLPARAM_LOGINID","n2nuser",
		"XMLPARAM_CLICODE","<%=g_sCliCode%>",
		"ACTIVE_PERIOD","08:55-12:35|13:55-17:15",
		"RTSET","KL|11|2|1.25|0|1",
		"RTCOLSET","1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16",
		"RTCOLNAMESET","9~1000101~S/Qty|3~1001697~Ref",
		"RTCOLSET_INDICES","1|2|3|4|5|6|7",
		"RTCOLSIZESET_INDICES","0|90|100|100|100|100|100|100",
		"DEFAULT_RTCOLSET","1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16",
		"AVAILABLE_RTCOLSET","0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|24|25|26|16|70|80|132|133|151|152",
		"SHOW_ALL_COL","0",
		"RTCOLWIDTH","90|120|60|60|60|60|35|60|60|35|60|45|35|45|70",
		"TRY_COUNT","4",
		"MODE","RealTime",
		"FEED_MODE","1",
		"SLEEP_COUNTDOWN_TIME","5",
		"FEATURE_TIME","1",
	    "SOCKET_SETTING","<%=feed_server_url%>|873802751833727551873802751878478191877142351867791471876474431843078431850425551852429311852429311855768911867791471866455631||",
	    "DATA_MODE","1",
	    "SORT_PERIOD","08:59-09:30-3000|09:30-12:35-3000|14:29-15:00-3000|15:00-18:05-3000",
	    "SHT_QTY_FORMAT","1000000000|B|#,###,##0.000|1000000|M|#,###,##0.00|1000|K|#,###,##0.0",

	    "FEATURE_SETTING","1",
		"SORT_ORDER","1",
		"FONT_BOLD","1",
		"SOCKET_TIMEOUT","10",
		"title","PRICE MOVEMENTATION",
		"CHART_SETTING","200|15|12|60|30",

		"DEFAULT_TABLE_SETTING","1|1|1||1000",
		"DEFAULT_PRICE_FORMAT","###,###,###,##0.000",
		"DEFAULT_INDICES","MY,i200.KL",
		"CHART_TIME_LIST","8.5|9|10|11|12|13|14|15|16|17|18",
		"INIT_COUNT","100000",
		"FEATURE_TRADE","1",
		"FEATURE_RESOLUTION","1",

		"SHOW_MKT_CHART","1",
"MENU1_BG_COLOR","88,169,217", 
"MENU1_FG_COLOR","255,255,255", 
"MENU2_BG_COLOR","88,169,217", 
"MENU2_FG_COLOR","255,255,255", 
"BTN_STK_BG_COLOR","30,96,167", 
"BTN_STK_FG_COLOR","255,255,255", 
"MKT_SUM_BG_COLOR","255,255,255", 
"BTN_BIDS_BG_COLOR","30,96,167", 
"BTN_BIDS_FG_COLOR","255,255,255", 
"BTN_NAV_BG_COLOR","30,96,167", 
"BTN_NAV_FG_COLOR","255,255,255", 
"MENU1_BLINK_BG_COLOR","225,162,66", 
"MENU1_BLINK_FG_COLOR","255,255,255", 
"TOOLTIPS_BG_COLOR","192,192,192", 
"TOOLTIPS_FG_COLOR","0,0,0", 
"BG_COLOR","0,0,0", 
"GRID_SELECTED_BG_COLOR","0,0,128", 
"GRID_BG_COLOR","85,106,125", 
"STK_GRID_HEADER_BG_COLOR","0,51,102", 
"STK_GRID_HEADER_FG_COLOR","255,255,255", 
"BAR_BG_COLOR","0,51,102", 
"BAR_FG_COLOR","255,255,255", 
"buyColor","0,255,0", 
"sellColor","255,0,0", 
"STS_OK_BG_COLOR","0,255,0", 
"STS_OK_FG_COLOR","0,0,0",

    	"DEBUG_LEVEL", "0",
    	"DEV_MODE", "833059631",
//    	"DEBUG_LEVEL", "1",  

		"ALL_NEWS","<%=tradClientAcc.equals("1")?"0":"1"%>",
		"SHOW_BUYSELL","<%=tradClientAcc.equals("1")?"1":"1"%>",
		"SHOW_OPTION","<%=tradClientAcc.equals("1")?"1|1|0|1|1":"0|0|0|0|1"%>",
		"NUM_DATA_ROWS","<%=tradClientAcc.equals("1")?"12":"23"%>",

		"ENABLE_CHAR_PIN","Y",
		"ENABLE_STOP_LIMIT","Y",
		"ParamMaxQty","5000",
		"REVISE_MASK","3",
		"QPRO_TAB","0",

		"CALC_TRANS_FEES","0",
		"BS_PRICE_CHECK","0",

		"NEWS_REQUEST_URL","http://jar.asiaebroker.com/ref/generalnews.txt"
	
);

	AC_AX_RunAppletObjectTagContent_Qsee( objectArgs , "<%=sBrowserType%>");
</script>
	</td>
</tr>
</table>
  </div>
</div>
</body>
<%
}catch (Exception ex) {
	ex.printStackTrace();
}
} else {
	out.println("<html>");
	out.println("<head>");
	out.println("<META content='-1' http-equiv='Expires'>");
	out.println("<META content='no-cache' http-equiv='Pragma'>");
	out.println("<META content='no-cache' http-equiv='Cache-Control'>");
	out.println("<title>TRADE ONLINE</title>");
	out.println("<script type=text/javascript src="+g_sJSPath+"/popupWindow.js></script>");
	out.println("<link rel=stylesheet type=text/css href='" + g_sStylePath + "/default.css'>");
%>
<style type="text/css">
body  {
	margin: 0; /* it's good practice to zero the margin and padding of the body element to account for differing browser defaults */
	padding: 0;
	text-align: center;
	background-image: url(<%=g_sImgPath%>/bodybg.png);
	background-repeat: repeat-x;
	background-color: #101010;
}
</style>
<%
	out.println("</head>");
//	out.println("<body>");
	setCommonPath(g_sPath, g_sImgPath, g_sJSPath, g_sStylePath, g_sWebPath, HTMLROOT_path, out);
	populatePopinLoginWindow();
	out.println("<script language='javascript'>");
	if(sActions.compareTo("ActivateReg") == 0) {
		out.println("	loadwindow(\"" + g_sPath + "/cliLoginMain.jsp?act=" + sActions + "&LoginID=" + g_sLoginId + "&from_path="+m_sLang.toLowerCase()+"_trading_hall_inner\",265,230,200,80);");
	} else{
		out.println("	loadwindow(\"" + g_sPath + "/cliLoginMain.jsp?from_path="+m_sLang.toLowerCase()+"_trading_hall_inner\",265,230,200,80);");
	}
	out.println("</script>");
%>

<body class="thrColAbsHdr">
<div id="container">
  <div id="header">
<table width="1000" border="0" cellspacing="0" cellpadding="0">
<tr>
  <td bgcolor="#072887">
  <table border="0" width="100%">
  <tr>
	<td height="30">&nbsp;</td>
  </tr>
  </table>
  </td>
</tr>
</table>  
  <!-- end #header --></div>
  <div id="bodyContents">
<table width="999" border="0" cellspacing="0" cellpadding="0">
<tr>
	<td width='2%'></td>
	<td width="90%">
	<script type=text/javascript src=<%=g_sJSPath%>/popupWindow.js></script>	
	<table cellspacing='0' cellpadding='0' border='0' width='90%' align='left'>
	<tr>
	<td valign="top" height="900">
	<br><br><br><hr align=left width=440 >
	<font face='Arial Bold' style='font-size:11pt'>
	&nbsp;&nbsp;The page you are looking for is currently unavailable due to one of the following: 
	&nbsp;&nbsp;<ol style='margin-top:5;margin-bottom:5'>
	&nbsp;&nbsp;<li><b>You have not logged on to the site yet.</b>
	&nbsp;&nbsp;<li><b>Your session has expired. </b>
	</ol>

	&nbsp;&nbsp;Either way, you will need to Log on or refresh the page to continue.<br>
<%
	out.println("You may click ");
	out.println("<a href='/gc/main.jsp'>");
	out.println("here</a> Back to main page.<br/><br/>");
	out.println("Thank you and have a pleasant day!</font></td></tr></table>");
				
%>

	</td>
	<td height="900" valign="top"><br>
	</td>
</tr>
</table>
  </div>
</div>
</body>
<%
}
%>