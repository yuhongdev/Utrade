<%@ page import = "java.text.SimpleDateFormat,java.util.Vector, java.util.Calendar, java.util.StringTokenizer" %>
<%@ page import = "com.spp.util.security.Decrypt" %>
<%@ include file= 'common.jsp'%>
<%
	response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
//	response.setHeader("Cache-Control", "post-check=0, pre-check=0", false);
	response.setHeader("Pragma", "no-cache");
	response.setDateHeader("Expires", 0);
%>
<html>
<head>
<SCRIPT language=javascript src="/gcCIMB/js/main_WorldMarkets.js"></SCRIPT>
<SCRIPT language=javascript src="/gcCIMB/ref/WorldMarketsData.js" id=jsData></SCRIPT>
<script language=JavaScript src="/gcCIMB/js/LinkFunc.js"></script>
<style>
.tblBorder {
	border: 0mm solid #ffece8;
}

.taInvTitle {
	FONT-FAMILY: Tahoma;
	FONT-SIZE: 11px;
	FONT-WEIGHT: bold;
	COLOR: #FFFFFF
}

.border-blue {
	border: 1px solid #6688cc;
}

</style>
</head>

<body onload='body_OnLoad()' topmargin=2 leftmargin=3 rightmargin=2>
<table border=0 class=tblBorder cellSpacing=0 cellPadding=0 width=200>
	<tbody>
		<tr bgcolor="#185795">
			<td align=left colspan=3 class="taInvTitle" width=180 height=22>
			&nbsp;World Markets</td>
		</tr>
		<TR>
			<td class='border-blue'>
<%
//session.setAttribute("FromURL","https://www.itradecimb.com/bin/home.asp");	
//out.println("<tr><td><iframe src='http://bursa.n2nconnect.com/WorldMarkets.html' width=200 height=190 frameborder=0 scrolling=no></iframe></td></tr>");
//out.println("<iframe src='http://bursa.n2nconnect.com/WorldMarkets.html' width=200 height=190 frameborder=0 scrolling=no></iframe>");
%>			
<!-- 		<iframe src='http://bursa.n2nconnect.com/WorldMarkets.html' width=200 height=190 frameborder=0 scrolling=no></iframe> -->
<!-- 		<iframe src='https://charttb.asiaebroker.com/WorldMarkets.html' width=200 height=190 frameborder=0 scrolling=no></iframe> -->

<link rel=stylesheet type=text/css href='/gcCIMB/style/JAChart/default_WorldMarkets.css'>
<table border=0 cellSpacing=0 cellPadding=0 width='200'>
	
	<tr class=tblTrdCimbMainHeader>
		<td width=70>&nbsp;<b><font id='date'></font></b></td>
		<td width=64 align=right><b>Last</b>&nbsp;&nbsp;</td>
		<td width=10 align=center>&nbsp;</td>
		<td align=right><b>Change</b>&nbsp;</td>
	</tr>
	
	<tr><td colspan=4 align=center><img src='/gcCIMB/img/Home/DotedLine.gif' width=192 height=1></td></tr>

</table>

<table border=0 cellSpacing=0 cellPadding=0 width='200' id=tblSummaryData>
<%
String sClassName = "";

for (int i=1; i<8; i++) {
	if (i%2==1) {
		sClassName = "tblTrdCimbOddRow";
	} else {
		sClassName = "tblTrdCimbEvenRow";
	}
%>

	<tr class=<%=sClassName%> height=15>
		<td width=70></td>
		<td align=right width=60></td>
		<td align=right width=10><img id='ArrPic<%=i%>' src='/gcCIMB/img/Market/unchgarrow.gif'>&nbsp;</td>
		<td align=right></td>
	</tr>
	
	<tr><td colspan=4 align=center><img src='/gcCIMB/img/Home/DotedLine.gif' width=192 height=1></td></tr>

<%
}
%>

</table>

<table border=0 cellSpacing=0 cellPadding=0 width='200'>
	<tr>
		<td width=4></td>
		<td class=tblTrdCimbMainFootner>Delayed 20+ minutes as @ <font id='time'></font>&nbsp;MY</td>
	</tr>
</table>
			</td>						
		</TR>
	</tbody>
</table>
</body>
</html>

<script language="JavaScript">		
//var oTextboxBuy = new AutoSuggestControl(document.getElementById("txtFastQuote"), new N2NSuggestions(arrStkCodeName), 15);
function body_OnLoad() {
	quoteData = new N2NScriptQuote("quoteData", "/gcCIMB/ref/WorldMarketsData.js", 120);
	quoteData.updateData();
}

var quoteData;
var m_oTableData = document.getElementById("tblSummaryData");

function select(vnOption) {
	quoteData.select(vnOption);
}

function updateData() {
	quoteData.updateData();
}

</script>