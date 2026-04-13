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
<SCRIPT language=javascript src="js/main_MarketSummary.js"></SCRIPT>
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

<body onload='body_onload()' topmargin=2 leftmargin=3 rightmargin=2>
<table border=0 class=tblBorder cellSpacing=0 cellPadding=0 width=200>
	<tbody>
		<tr bgcolor="#185795">
			<td align=left colspan=3 class="taInvTitle" width=180 height=22>
			&nbsp;KLCI Snapshot</td>
		</tr>
		<TR>
			<TD class='border-blue' colspan=3 width=180><!--<DIV align=center><IMG id="KLCIChart_1818" src="https://charttb.asiaebroker.com/img/JAChart/KLCIChart_1818.png" width=180 border=0 onerror="javascript:redirectChartServer('KLCIChart','png');"></IMG></DIV>-->
			<DIV align=center><IMG id='FTSEChart' src="<%=oN2NSession.getSetting("MarketSummaryChartServer")%>" width=180 border=0
				onerror="javascript:redirectChartServer('FTSEChart','png','<%=oN2NSession.getSetting("MarketSummaryChartServerBk")%>');"></IMG></DIV>
			</TD>
		</TR>
	</tbody>
</table>
</body>
</html>

<script language=JavaScript>
	function body_onload() {
		var quoteData_MktSumm;
		quoteData_MktSumm = new N2NScriptQuote_MktSumm("quoteData_MktSumm","ref/marketSummaryData.js", "ref/main_MSData_WorldIndices.js","ref/main_MSData_WorldCurrencies.js", 10);
//		quoteData_MktSumm.updateData();
	}

	var quoteData_MktSumm;

	function redirectChartServer(oImage_Icon_ID, file_type, image_backup) {
		quoteData_MktSumm.redirectChartServer(oImage_Icon_ID, file_type, image_backup);
	}
</script>


