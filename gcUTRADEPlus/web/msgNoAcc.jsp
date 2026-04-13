<%@ include file='common.jsp'%>
<%@ include file='util/sessionCheck.jsp'%>

<html>
<head>
	<title><%=oN2NSession.getSetting("WebSiteName")%> - Your trading account information have not been setup</title>
	<link rel=stylesheet href='<%=g_sStylePath%>/default.css'>
	<script language='JavaScript' type='text/javascript' src='<%=g_sJSPath%>/LinkFunc.js'></script>
	<script language='JavaScript' type='text/javascript' src='<%=g_sJSPath%>/N2NFunc.js'></script>
	<script language='JavaScript' type='text/javascript' src='<%=g_sJSPath%>/SortFunc.js'></script>
	<script language=JavaScript src="<%=g_sJSPath%>/N2NPrnFunc.js"></script>
</head>

<body>
<table border=0 cellspacing=0 cellpadding=0 width=500>
  <tr><td align=center>
		<font color="#004080" style='font-size:14pt;font-weight:600'>Your trading account has not been activated yet!</font>
		<br><br><img src=/gcCIMB/img/UnderConst.gif width=100 height=100><br><br>
	</td></tr>
	<tr><td>
		<hr align=center width='60%'>
		<table class=clsCopyrightBasic cellPadding=0 cellSpacing=0 width='500'>
			<tr><td><font size=1 color=#990066>| <a href="javascript:OpenLinkWinNormal('http://secure.itradecimb.com.my/web/corpCIMBSItrade.asp', 'winCorpCIMBSItrade', '');">About i*Trade</a> |
				<a href="javascript:OpenLinkWinNormal('http://secure.itradecimb.com.my/web/corpContactUs.asp','winCorpContactUs','');">Contact Us</a> |
				<a href="javascript:OpenLinkWinNormal('http://secure.itradecimb.com.my/web/infoPrivatePolicy.asp','winCorpDisclaimer','');">Disclaimer</a> |</font>
				<br><font class=clsCopyrightBasic>All rights reserved. Copyright &copy; <%=year(Now)%> CIMB</font></td></tr></table>
	</td></tr></table>
</body>
</html>
