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
<script language="javascript" src="ref/marketSummaryData.js" id="jsData_MktSumm"></script>

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
				<TR align=middle bgColor=#FFFFFF>
					<TD colspan=3>
					<table cellspacing=0 cellpadding=0 border=0 width='100%' id='tblSummaryHdr'>
					<tr><td colspan=3 bgcolor='#FFFFFF'>
						<table border=0 cellSpacing=0 cellPadding=0 width='100%'>
						<!--<tr class=tblMainHeader><td width='2%' ></td><td width='96%' valign=center>&nbsp;<b><font style="font-family:Arial;font-size:10pt;color:#428DE7;">Equities</font></b></td><td width='2%'></td></tr>-->
						<tr class=tblMainHeader valign=bottom><td align=left height=19>
							<img id=MostActive border=0 src='<%=g_sImgPath%>/Market/MostActiveOn.gif' onclick='select(0)' alt='MostActive' width='56' height='19'></td><td align=center><img id=TopGainer border=0 src='<%=g_sImgPath%>/Market/TopGainerOff.gif' onclick='select(1)' alt='TopGainer' width='56' height='19'></td><td align=right><img id=TopLoser border=0 src='<%=g_sImgPath%>/Market/TopLoserOff.gif' onclick='select(2)' alt='TopLoser' width='56' height='19'></td>
						</tr>
						</table>
					</td></tr>
					</table>
					</td>
				</tr>

				<TR align=middle class='tblTopHeader' bgcolor="#185795" background="<%=g_sImgPath%>/Home/bluebar_h19px.gif" height="19" style='FONT-FAMILY: Tahoma;FONT-SIZE:8pt;color:white;font-weight:bold'>
					<TD align=left width='50%'><input type='hidden' name='ButtonAction' id='ButtonAction' value='MostActive'><FONT face=Arial color=#ffffff size=1><B></B></FONT><span style='FONT-FAMILY:Tahoma;FONT-SIZE:8pt;color:white;font-weight:bold'><b>&nbsp;KEY INDICES</b></SPAN></TD>
					<TD  width='26%' align='left'><span style='FONT-FAMILY:Tahoma;FONT-SIZE:8pt;color:white;font-weight:bold'><b>LAST</b></SPAN></TD>
					<TD width='24%' align='left'><span style='FONT-FAMILY:Tahoma,;FONT-SIZE:8pt;color:white;font-weight:bold'><b>CHG</b></SPAN></TD>
				</TR>

			</table>

			<!-- AGL Data -->

			<table class="border-blue" cellspacing=2 cellpadding=2 width='100%' id='tblSummaryData'>

			<%
				String sClass_MktSumm = "tableRow1" ;

				for(int i= 0; i<=9 ; i++)
				{
					if (i%2 == 0) sClass_MktSumm = "tableRow1";
					else sClass_MktSumm = "tableRow2";
			%>
			<tr class=<%=sClass_MktSumm%>>
				<td width='41%'>-</td>
				<td align='right' width='26%'>0.000</td>
				<td align='right' width='24%'>0.000</td>
				<td width='9%' align='right'><img src='<%=g_sImgPath%>/Market/unchgarrow.gif'>&nbsp;</td>
			</tr>
			<%
				}
			%>

			</table>
			<!-- endof AGL Data -->
 	  </tbody></table></tr>

 </tbody></table>
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody>
  <tr>
    <td align="right" class='tblUnchg' valign="top" id='AGLTime'></td> 
  </tr>
</tbody>
</table>

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
var m_oTableData_MktSumm_Equities = document.getElementById("tblSummaryData");
var m_oTableData_MktSumm_Indices_ScoreBoard	= document.getElementById("tblSummaryData");

function select(vnOption) {
	quoteData_MktSumm.select(vnOption);
}
function updateData() {
	quoteData_MktSumm.updateData();
}
</script>


