<%@include file="/common.jsp"%>

<!-- Copyright 2000 N2N Connect Sdn. Bhd. All Rights Reserved. -->
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <title>Welcome to i-Trade</title>
</head>
<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
<link rel="shortcut icon" href=<%=g_sImgPath%>/favicon.ico>
<body topmargin=0 leftmargin=0 style="margin: 0px 0px 0px -5px;">
<%
    String sHTMLRoot=oN2NSession.getSetting("HTMLRoot");
	int sWidth=980;
	int sFontSize=11;
	String projectFolder=oN2NSession.getSetting("projectFolder");
%>

<table border=0 cellspacing=0 cellpadding=0 width='100%' height=16>
<!-- 
<tr><td>
<script language='JavaScript' type='text/javascript' src='< %=g_sJSPath% >/tickerConnectEngineNew.js'></script>
<script language='JavaScript' type='text/javascript' src='< %=g_sJSPath% >/tickerConnectNew.js'></script>
<script language='JavaScript' type='text/javascript' src='< %=g_sJSPath% >/LinkFunc.js'></script>
<script language="javascript">
	var sWidth = new String("");
	var sSpeed = new String("");
	var sImgUrl = new String("");
	var sFontSize = new String("")

	sWidth = "< %=sWidth% >"
	sSpeed = "1";
	sFontSize = "< %=sFontSize% >px"

	var indices = new tickerConnectNew("indices","< %=sHTMLRoot% >ebcServlet/ebcForwarder?Site=TickerXml","IndicesSummary",sFontSize,sWidth,sSpeed,sImgUrl);

	indices.createUI("idContent3", "idScroller3");
	indices.setTickerUrl("< %=sHTMLRoot% >/< %=projectFolder% >/stkIndices.jsp");
	indices.start();
</script>
</td></tr>
-->
<tr><td align='left'>
<script type="text/javascript" src="<%=g_sJSPath%>/swfobjects2.js"></script>
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
</body>
</html>