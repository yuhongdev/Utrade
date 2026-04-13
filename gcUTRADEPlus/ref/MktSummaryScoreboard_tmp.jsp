<%@ page import = "com.spp.util.security.Encrypt, java.sql.*, com.n2n.bean.*, com.n2n.DB.*, java.text.SimpleDateFormat,java.util.Date, com.n2n.util.N2NConst,com.n2n.util.N2NSecurity"%>
<%
	response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
//	response.setHeader("Cache-Control", "post-check=0, pre-check=0", false);
	response.setHeader("Pragma", "no-cache");
	response.setDateHeader("Expires", 0);
%>
<%@ include file='common.jsp'%>

<html>
<head>
<SCRIPT language=javascript src="js/main_MarketSummary.js"></SCRIPT>
<script language="javascript" src="ref/marketSummaryData.js" id="jsData_ScoreBoard"></script>

<style>
.tblBorder
{
	border: 0mm solid #ffece8;
}

.tblMainHeader
{
	background-color : #ffffff;
	font-family      : Arial;
	font-size        : 8pt;
	color            : #ff0000;
}

.tblRow
{
	background-color : #ffffff;
	color            : #4E5E6F;
	font-family : Arial;
	font-size   : 8pt;
}

.clsMktSumm_Data
{
	font-family : Arial;
	font-size   : 7pt;
	color       : #666666;
}

.tblUp
{
	font-family : Arial;
	font-size   : 8pt;
	color       : #009900;
}

.tblDown
{
	font-family : Arial;
	font-size   : 8pt;
	color       : #ff0000;
}

.tblUnchg
{
	font-family : Arial;
	font-size   : 8pt;
	color: #666666;
}

.taInvTitle {
	FONT-FAMILY: Tahoma;
	FONT-SIZE: 11px;
	FONT-WEIGHT: bold;
	COLOR: #FFFFFF
}

.tableRow1 {
	COLOR: #666666; BACKGROUND-COLOR: #fff; font-size   : 8pt; font-family : Tahoma;
}

.tableRow2 {
	COLOR: #666666; BACKGROUND-COLOR: #def; font-size   : 8pt; font-family : Tahoma;
}

.border-blue {
	border:1px solid #6688cc;
}

.tableBox {
	BORDER-LEFT-COLOR: #39f; BORDER-BOTTOM-COLOR: #39f; BORDER-TOP-COLOR: #39f; BACKGROUND-COLOR: #def; BORDER-RIGHT-COLOR: #39f;
}


</style>
</head>
<body onload = 'body_onload()' topmargin=2 leftmargin=3 rightmargin=2>
	<table border=0 class=tblBorder cellSpacing=0 cellPadding=0 width='200'>
   	<tbody>
	<TR>
		<TD colspan=3 width=220>
		<TABLE borderColor=#666666 cellSpacing=0 cellPadding=0 align=center border=0 width='100%'>
		<tbody>
		<!-- 5th (scoreboard)-->
		<%
			String[] sIndicesDataArray = new String[5];
			sIndicesDataArray[0] = "GAINERS";
			sIndicesDataArray[1] = "LOSERS";
			sIndicesDataArray[2] = "UNCHANGED";
			sIndicesDataArray[3] = "Volume (Lots):";
			sIndicesDataArray[4] = "Value (RM):";
		%>
		<TR class='tblHeader' BGCOLOR='185795'>
			<TD><span style='FONT-FAMILY: Arial;FONT-SIZE: 8pt;color:white'><b>&nbsp;&nbsp;&nbsp;&nbsp;SCOREBOARD</b></span></TD>
		</TR>
		<tr>
			<td width='100%'>
			<table width='100%' id='tblSummScoreBoard'>
		<%
			String sClass_MktSumm = "tblRow";
			for (int i= 0 ;i<= 4; i++)
			{
		%>
	        <TR class=<%=sClass_MktSumm%>>
        		<TD>&nbsp;<img src='<%=g_sImgPath%>/Market/unchgarrow.gif'>&nbsp;</td>
        		<td><%=sIndicesDataArray[i]%></TD>
		        <TD colSpan=2 align='left'>000</TD>
			</TR>
			<tr align=middle><td colspan=4><img src='<%=g_sImgPath%>/Market/dot_s.gif'></td></tr>
		<%
			}
		%>
			</table>
			</td>
		</tr>
		</tbody>
		</TABLE>
  		</TD>
 	  </TR>
	</table>
</body>
</td></tr>
</table>

</body></html>

<script language=JavaScript>

function body_onload()
{
	quoteData_MktSumm = new N2NScriptQuote_MktSumm("quoteData_MktSumm", "ref/marketSummaryData.js", "","" ,10);
	quoteData_MktSumm.updateData();
}

var quoteData_MktSumm;
//var m_oTableData_MktSumm_Equities            		 = document.getElementById("tblSummaryData");
var m_oTableData_MktSumm_Indices_ScoreBoard			 = document.getElementById("tblSummScoreBoard");

function updateData() {
	quoteData_MktSumm.updateData();
}
</script>


