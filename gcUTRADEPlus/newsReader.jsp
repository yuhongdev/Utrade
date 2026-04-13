<%@ page import = "com.n2n.util.N2NConst,com.n2n.util.N2NSecurity" %>
<%@ include file='/common.jsp'%>
<%@include file="/util/sessionCheck.jsp"%>
<%//@ include file='util/Style.jsp'%>
<jsp:useBean id="eafInfo" class="com.n2n.DB.N2NMFEAFFunc" scope="page"/>
<script language=JavaScript src=<%=g_sJSPath%>/N2NCtrl.js></script>
<script language=JavaScript src=<%=g_sJSPath%>/LinkFunc.js></script>
<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
<%
// if (oN2NSession.getIsUserLogin()) {
if (validSession) {
%>
<html>
<head>

<title>News Reader</title>
</head>

<BODY onload='document.body.focus();'>
<TABLE border=0 cellpadding=0 cellspacing=0>
	<tr><td valign=top align=left>
<%

	String sStkCode	= "";//	' StkCode
	String sStkName	= "";//	' StkName
	String sCodebase	= "";
	String sNewsFeedServerURL = "";
	
	sStkCode = request.getParameter("Code");
	sStkCode = sStkCode != null ? sStkCode.toUpperCase() : "";
	sNewsFeedServerURL  = "http://news.asiaebroker.com/";
//	sNewsFeedServerURL  = "http://news.ebrokerconnect.com/";

//	'sCodebase = Application("NewsFeedServerURL") + Application("FSJavaURL") + "/";
	sCodebase = sNewsFeedServerURL + oN2NSession.getSetting("FSJavaURL") + "new/";
 
	
	out.println("<applet code=newsRdApplet.class codebase="+ sCodebase + " archive='newsRdDev.jar,com.ebc.util.jar,com.ebc.awt.jar,com.ebc.awt.N2NCombo.jar,com.ebc.awt.JCalendar.jar,rbJCal_en_US.jar' width=700 height=440 mayscript>")	;
	out.println("<PARAM NAME=ISAPIDLL_URL VALUE='" + sNewsFeedServerURL + "ebcNews/getNews.jsp?type=REALTIMENEWS'>")	;
%>
		<PARAM NAME=NEWS_PARAM VALUE='<%=sNewsFeedServerURL%>ebcNews/index.jsp?id=|left=20&top=40&width=650&height=515&scrollbars=yes&tw=NewsWin|'>
		<PARAM NAME=REFRESH_INTERVAL VALUE=60000>
		<PARAM NAME=TITLE VALUE='News Reader(Bursa Malaysia)'>
		<PARAM NAME=CATEGORY_LIST      VALUE='All Types|Special Annoucement(SA)|General(GA)|Entitlement(EA)|Changes In Boardroom(CB)|Trading of Rights(TR)|Change in Sub-ShrHlr(CS)|Bernama Summary(BS)|Bernama General(BG)|Financial Summary(FS)|Change in Sub-ShrHldrs Int(CI)|Change in Director Int(CD)|Notice of Person Int to be Sub(NA)|Notice of Person Ceasing(ND)|Change Company Secretary(CS)|Notice of Shares Buy Back(NS)|Change of Address(CA)|Change of Registral(CR)|'>		
		<PARAM NAME=CATEGORY_CODE_LIST VALUE='00|20|30|32|33|34|35|40|41|31|36|37|38|39|CC|43|44|45'>
		<PARAM NAME=STOCK_LIST VALUE="<%@include file='ref/mf_stkinfo.applet_stkcode_stkshtname.ref' %>">
		<PARAM NAME=STK_CODE VALUE='<%=sStkCode%>'>
		<PARAM NAME=COMPRESS VALUE=1>
		<PARAM NAME=MAYSCRIPT VALUE=true>
		<PARAM NAME=CHECKSUM VALUE='NFRZOAXJPFEZEVOCOJSUDITBRYRZSFFOUAYODMPMCPFSPHBRP'>
      </applet>
    </td>
    </tr>
</TABLE>
</BODY>
</HTML>

<% } else {
	response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
}
%>
