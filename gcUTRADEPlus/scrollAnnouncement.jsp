<%@ page import = "java.text.SimpleDateFormat,java.util.Vector, java.util.Calendar, java.util.StringTokenizer" %>
<%@ page import = "com.spp.util.security.Decrypt,com.n2n.DB.N2NDateFunc" %>
<%@ include file= "common.jsp"%>
<jsp:useBean id="research" class="com.n2n.DB.N2NMFResearch" scope="page"/>
<jsp:useBean id="researchbean" class="com.n2n.bean.N2NMFResearchBean" scope="page"/>
<%//@ include file='util/banner.jsp'%>
<%
//	setCommonPath(g_sPath, g_sImgPath, g_sJSPath, g_sStylePath, g_sWebPath, oN2NSession.getSetting("HTMLRoot"),out);
//	genBannerTitle(oN2NSession.getSetting("WebSiteName"));
%>
<link rel="stylesheet" type="text/css" href="<%=g_sStylePath%>/autosuggest.css"/> 
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">
<script language=JavaScript src="<%=g_sJSPath%>/LinkFunc.js"></script>
	<META content='-1' http-equiv='Expires'>
	<META content='no-cache' http-equiv='Pragma'>
	<META content='no-cache' http-equiv='Cache-Control'>

<table border=0 cellspacing=0 cellpadding=0 style='font-size:9pt;font-family:Arial;color:#021931'>
<tr>
	<td>
	<table border=0 cellspacing=0 cellpadding=0 style='font-size:9pt;font-family:Arial;color:#021931'>
	<tr><td height=10 colspan=3></td></tr>
	<tr>
			<td colspan=3>
			<table border=0 cellspacing=0 cellpadding=0 style='font-size:9pt;font-family:Arial;color:#0e3055'>
			<tr>
				<td height=20 colspan=2 valign=center><b>What's New</b></td>
				<td width=100>&nbsp;</td>
				<td style='font-size:8pt;font-family:Arial;color:#05a5e4' align=right></td>
			</tr>
			</table>
			</td>
	</tr>
	<tr>
			<td width=13 colspan=3 bgcolor="#CACACA">
			<script language=javascript src='js/scroll.js'></script>
			<span style='border: 0px solid silver;'>
			<script language=JavaScript>Tscroll_init(0)</script>
			</span>
			</td>
	</tr>
	</table>
	</td>
</tr>
</table>
</body>
</html>
