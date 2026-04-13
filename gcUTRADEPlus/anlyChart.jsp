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
<title><%=oN2NSession.getSetting("WebSiteName")%>: Analysis Chart</title>
</head>
<body onload='javascript:document.body.focus();' marginheight='5' marginwidth='5' topmargin='5' leftmargin='5'>
<%
String sStkCode="", sStkName="", sAdj="", sIsSwing="", sBPrice="", sSPrice="", sClose="", sBase="", sLotSize="", sRef="", sLD="";
sStkCode = request.getParameter("Code")!=null&&!request.getParameter("Code").equals("")?request.getParameter("Code").toString():"";
sStkName = request.getParameter("Name")!=null&&!request.getParameter("Name").equals("")?request.getParameter("Name").toString():"";
sIsSwing = request.getParameter("Swing")!=null&&!request.getParameter("Swing").equals("")?request.getParameter("Swing").toString():"";
sAdj = request.getParameter("Adj")!=null&&!request.getParameter("Adj").equals("")?request.getParameter("Adj").toString():"1";
sBPrice=request.getParameter("BPrice")!=null&&!request.getParameter("BPrice").equals("")?request.getParameter("BPrice").toString():"";
sSPrice=request.getParameter("SPrice")!=null&&!request.getParameter("SPrice").equals("")?request.getParameter("SPrice").toString():"";
sClose=request.getParameter("Close")!=null&&!request.getParameter("Close").equals("")?request.getParameter("Close").toString():"";
sBase=request.getParameter("Base")!=null&&!request.getParameter("Base").equals("")?request.getParameter("Base").toString():"";
sRef=request.getParameter("Ref")!=null&&!request.getParameter("Ref").equals("")?request.getParameter("Ref").toString():"";
sLD=request.getParameter("Lastdone")!=null&&!request.getParameter("Lastdone").equals("")?request.getParameter("Lastdone").toString():"";
sLotSize=request.getParameter("Lotsize")!=null&&!request.getParameter("Lotsize").equals("")?request.getParameter("Lotsize").toString():"";
sSPrice = sSPrice.replace(sSPrice,","); 
%>
<html>
<head>
<title>Analysis Chart - <%=sStkName%></title>
</head>
<BODY onload='focus()'>
<TABLE>
<tr><td valign=top align=left>
<%
out.println("<applet code=MainApplet.class codebase='"+ oN2NSession.getSetting("FeedChartServerURL") +"java/jar/new' archive=fullchartdev.jar,com.ebc.util.jar,com.ebc.awt.N2NCombo.jar,com.ebc.awt.jar width=780 height=650 mayscript>");
%>
<param name='key' value='N2N'>
<param name='id' value="<%=sStkCode%>">
<param name='name' value="<%=sStkName%>">
<param name='SHOW_ADJ' value="<%=sAdj%>">
<%
if (sIsSwing!=null&&sIsSwing.equals("1")) {
out.println("<PARAM NAME=BUY_URL VALUE='" + oN2NSession.getSetting("HTMLRoot") + "trdBuySell.jsp?|left=70&top=320&width=610&height=166&tw=WinTrdBuySell|SiteID=1&OrderType=" + N2NConst.TRD_TYPE_BUY + "&lang=EN&font=Sansserif&OddLot=N&Buy=" + sBPrice + "&Sell=" + sSPrice + "&Ref=" + sRef + "&Lastdone=" + sLD + "&Close=" + sClose + "&Base=" + sBase + "&Lotsize=" + sLotSize +  "'>");
out.println("<PARAM NAME=SELL_URL VALUE='" + oN2NSession.getSetting("HTMLRoot") + "trdBuySell.jsp?|left=70&top=320&width=610&height=166&tw=WinTrdBuySell|SiteID=1&OrderType=" + N2NConst.TRD_TYPE_SELL + "&lang=EN&font=Sansserif&OddLot=N&Buy=" + sBPrice + "&Sell=" + sSPrice + "&Ref=" + sRef + "&Lastdone=" + sLD + "&Close=" + sClose + "&Base=" + sBase + "&Lotsize=" + sLotSize + "'>");
} else {
out.println("<PARAM NAME=BUY_URL VALUE='" + oN2NSession.getSetting("HTMLRoot") + g_sPath +"/trdBuySellAWT.jsp?|left=70&top=320&width=610&height=166&tw=WinTrdBuySell|SiteID=1&OrderType=" + N2NConst.TRD_TYPE_BUY + "&lang=EN&font=Sansserif&OddLot=N&Buy=" + sBPrice + "&Sell=" + sSPrice + "&Ref=" + sRef + "&Lastdone=" + sLD + "&Close=" + sClose + "&Base=" + sBase + "&Lotsize=" + sLotSize + "'>");
out.println("<PARAM NAME=SELL_URL VALUE='" + oN2NSession.getSetting("HTMLRoot") + g_sPath +"/trdBuySellAWT.jsp?|left=70&top=320&width=610&height=166&tw=WinTrdBuySell|SiteID=1&OrderType=" + N2NConst.TRD_TYPE_SELL + "&lang=EN&font=Sansserif&OddLot=N&Buy=" + sBPrice + "&Sell=" + sSPrice + "&Ref=" + sRef + "&Lastdone=" + sLD + "&Close=" + sClose + "&Base=" + sBase + "&Lotsize=" + sLotSize + "'>");
}
%>
<PARAM NAME="STOCK_LIST" VALUE="<%@ include file='ref/mf_stkinfo.applet_stkcode_stkshtname.ref'%>">
<PARAM NAME='BUY_SELL_FEATURE' VALUE='1'>
<PARAM NAME=BAR_BG_COLOR VALUE='0,51,102'>
<PARAM NAME=BAR_FG_COLOR VALUE='255,255,255'>
<PARAM NAME=HISTDATA_URL VALUE='<%=oN2NSession.getSetting("FeedChartServerURL")%>java/jar/data/'>
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

