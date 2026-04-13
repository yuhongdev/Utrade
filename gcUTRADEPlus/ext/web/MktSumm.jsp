<%@page import ="java.util.Calendar" %>

<%@ include file= '/common.jsp'%>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
    <head>
        <meta http-equiv='Content-Type' content='text/html'; charset='windows-1252'>
        <meta content='mshtml 6.00.2900.2604' name='generator'>

   </head>
<style type="text/css">
.tblBorder
{
	BORDER-LEFT: #c0c0c0 0.5mm solid;
	BORDER-RIGHT: #c0c0c0 0.5mm solid;
	BORDER-TOP: #c0c0c0 0.5mm solid;
	BORDER-BOTTOM: #c0c0c0 0.5mm solid;
}
.KLCIChartText2{
	FONT-FAMILY: Arial, Helvetica, sans-serif;
	FONT-SIZE: 7.5pt;
	Color: #666666;	
}
.tblTopHeader
{
	BACKGROUND-COLOR: #3366CC;
	FONT-FAMILY: Arial;
	FONT-SIZE: 8pt;	
	TEXT-ALIGN: middle;
	Color: #FFFFFF
	
}
.tblOddRow
{
	BACKGROUND-COLOR: #EEEEEE;
	Color: #5b5b5b;
	FONT-FAMILY: Arial, Helvetica, sans-serif;
	FONT-SIZE: 8pt;
	TEXT-ALIGN: left
}

.tblEvenRow
{
	BACKGROUND-COLOR: #ffffff;
	Color: #5b5b5b;
	FONT-FAMILY: Arial, Helvetica, sans-serif;
	FONT-SIZE: 8pt;
	TEXT-ALIGN: left
}
.tblUp {
	color: #339900;
}


.tblDown {
	color: #c80000;
}

.tblUnchg {
	color: #6600FF;
}

.tblBrder{
	
	border: 1px solid #f2f2f2;
	
}

.tdBrder{
	
	border-top-width: 1px;
	
	border-top-color: #019CDE;
	
	border-top-style: solid;
	
	
}

.tdBrder2{
	border-top-width: 0px;		
		
	border-left-style: solid;
	border-left-width: 1px;	
	border-left-color: #f2f2f2;	
	border-right-style: solid;
	border-right-width: 1px;	
	border-right-color: #f2f2f2;	
	border-bottom-style: solid;
	border-bottom-color: #f2f2f2;
	border-bottom-width: 1px;
}
</style>

<%
String sMktSummDataSrc,sSpotMonthDataSrc = "";

sMktSummDataSrc = "http://charttb.asiaebroker.com/js/JAChart/KL_MSData5.js";
sSpotMonthDataSrc = "https://charttb.asiaebroker.com/js/JAChart/MY_SMData.js";
%>

<SCRIPT language=javascript src="<%=g_sJSPath %>/MarketSummary.js"></SCRIPT>
<SCRIPT language=javascript src="<%=sMktSummDataSrc %>"></SCRIPT>
<SCRIPT language=javascript src="<%=sSpotMonthDataSrc %>"></SCRIPT>

<body topmargin=0 leftmargin=0 onload="javascript:body_OnLoad()">



	<table cellSpacing=0 cellPadding=0 width=210>	
	
        <tbody>
            <TR>
                <TD width=210> 
                	 
		            <table>
		   	            <tr height="40">
				            <td><%@include file='quoteSearch.jsp' %></td>
			            </tr>
		            </table>
		            
		            <table class='tblBrder' cellSpacing=0 cellPadding=0 width='100%'>
		                <tr><td>		   

                            <table cellpadding=0 cellspacing=0 width='100%'>

                                <!--<tr><td style='height: 22px; background: #019CDE repeat; color: #BCFFFF; text-align: center; font: 12px/14px Tahoma; font-weight: bold;'>MARKET SUMMARY</td></tr>-->
			
                                <tr><td><img src='<%=g_sImgPath%>/Market/market_summary.gif'/></td></tr>

                                <tr><td align=center><IMG id="KLCIChart_0653" src="http://chartwc.asiaebroker.com/img/JAChart/KLCIChart_0653.png" width=180 border=0  onerror="javascript:redirectChartServer('KLCIChart','png');"></IMG></td></tr>

                            </table>

                        </TD></TR>

	                    <TR>
	  		                <TD width=210>

				                <table cellpadding=1 cellspacing=0 width='100%' id='tblSummScoreBoard'> 
				    
				                    <tr bgcolor='#f2f2f2'>

						                <td width=4></td>

						                <td width='48%' class=KLCIChartText2 colspan=2>Open</td>

						                <td width='48%' class=KLCIChartText2 colspan=2 id=MktSummOpen>:&nbsp;1296.56</font></td>

					                </tr>
					
					                <TR align=middle><td colspan=5><img src='<%=g_sImgPath%>/Market/dot-line.png'></td></TR>
				    
				                    <tr>

						                <td width=4></td>

						                <td width='48%' class=KLCIChartText2 colspan=2>High</td>

						                <td width='48%' class=KLCIChartText2 colspan=2 id=MktSummHigh>:&nbsp;1296.56</font></td>

					                </tr>

					

					                <TR align=middle><td colspan=5><img src='<%=g_sImgPath%>/Market/dot-line.png'></td></TR>
					
					                <tr bgcolor='#f2f2f2'>

						                <td width=4></td>

						                <td width='48%' class=KLCIChartText2 colspan=2>Low</td>

						                <td width='48%' class=KLCIChartText2 colspan=2 id=MktSummLow>:&nbsp;1291.16</font></td>

					                </tr>

					

					                <TR align=middle><td colspan=5><img src='<%=g_sImgPath%>/Market/dot-line.png'></td></TR>

					                <tr>

						                <td width=4></td>

						                <td width='48%' class=KLCIChartText2 colspan=2>Total Vol (Lots)</td>

						                <td width='48%' class=KLCIChartText2 colspan=2 id=MktSummVol>:&nbsp;13,775,208</font></td>

					                </tr>

					

					                <TR align=middle><td colspan=5><img src='<%=g_sImgPath%>/Market/dot-line.png'></td></TR>

					

					                <tr bgcolor='#f2f2f2'>

						                <td width=4></td>

						                <td width='48%' class=KLCIChartText2 colspan=2>Turnover (RM)</td>

						                <td width='48%' class=KLCIChartText2 colspan=2 id=MktSummTtl>:&nbsp;1,527,990,174</font></td>

					                </tr>	

					

					                <TR align=middle><td colspan=5><img src='<%=g_sImgPath%>/Market/dot-line.png'></td></TR>

					

					                <tr>

						                <td width=4></td>

						                <td width='100%' class=KLCIChartText2 colspan=4>

						                <b>Up</b>&nbsp;<img src='<%=g_sImgPath%>/Market/upArrow.png'><span id=MktSummUp>&nbsp;476&nbsp;</span>

						                <b>Down</b>&nbsp;<img src='<%=g_sImgPath%>/Market/dwArrow.png'><span id=MktSummDwn>&nbsp;292&nbsp;</span>

						                <b>Unch</b>&nbsp;<img src='<%=g_sImgPath%>/Market/unchgArrow.png'><span id=MktSummUnchg>&nbsp;221</span>

						                </td>

					                </tr>

					                <TR><TD height=3></TD></TR>		  		

	  		                </table>

	  		            </td></tr>
	  		        </table>    
	  	        </TD>

	  	    </TR>

            <tr><td height=5></td></tr>

            <TR>
                <TD width=210>


	                

                                    

                                            <table border=0 cellSpacing=0 cellPadding=0 width='100%'>
                                            
                                                

                                                <tr valign=bottom><td></td>
                                                    <td align=left height=20>
                                                        <img id=MostActive border=0 src='<%=g_sImgPath%>/Market/MostActiveOn.gif' onclick='javascript:select(0)' alt='MostActive'><img id=TopGainer       border=0 src='<%=g_sImgPath%>/Market/TopGainerOff.gif' onclick='javascript:select(1)' alt='TopGainer'><img id=TopLoser        border=0 src='<%=g_sImgPath%>/Market/TopLoserOff.gif'  onclick='javascript:select(2)' alt='TopLoser'><td></td></tr></table>

                                                    </td>
                                                </tr>

                                                <TR align=middle class='tblTopHeader'>

		                                            <TD align=left colspan=3>

		                                                <table cellspacing=0 cellpadding=0 border=0 width='100%' height=16 background='<%=g_sImgPath%>/Market/grey_bg.gif' >

			                                                <tr bgcolor='#022D58'>

				                                                <td width=8></td><td width='102' align='left'><span style='FONT-FAMILY: Arial, Helvetica, sans-serif;FONT-SIZE: 8pt;color:#ffffff'>&nbsp;<b>Name</b></SPAN>&nbsp;</TD>

				                                                <TD width='50' align='left'><span style='FONT-FAMILY: Arial, Helvetica, sans-serif;FONT-SIZE: 8pt;color:#ffffff'><b>Last</b></SPAN>&nbsp;</TD>

				                                                <TD width='50' align='right'><span style='FONT-FAMILY: Arial, Helvetica, sans-serif;FONT-SIZE: 8pt;color:#ffffff'><b>Change</b></SPAN>&nbsp;</TD>

			                                                </TR>

		                                                </table>

                                                    		</td>

                                                </tr>

                                        </table>

                                        <table cellspacing=0 cellpadding=1 border=0 bgcolor='#FFFFFF' width='212' id='tblSummaryData' class=tblBrder>
<%

String sTblRowClass = "";
for (int i=0 ; i<=4 ; i++){

if ((i % 2) == 0) 
    sTblRowClass = "tblOddRow";
else
    sTblRowClass = "tblEvenRow"  ;  


%>
                                           
		                                                <tr class=<%=sTblRowClass %>>                                        
			                                                
			                                                
							                                <td width='43%'>-</td>
							                                <td align='right' width='26%'>0.000</td>
							                                <td width='7%'><img src='<%=g_sImgPath%>/Market/unchgarrow.png'></td>
							                                <td align='right' width='24%'>0.000</td>
														</tr>
<%		                                                
}
%>

	                                    </table>

	                                </td>
	                                
                                </tr>

                            </table>                      


                        
        </tr>
    </tbody>
</table>

<table cellspacing=0 cellpadding=0 style="border: 0px solid #019CDE; vertical-align: top;">
    <tr><td height=5></td></tr>
    <tr bgcolor='#019CDE'>        
        <td><img src='<%=g_sImgPath%>/Market/future_indices.gif' /></td>
    </tr>
</table>
<!--
<table cellspacing=0 cellpadding=0 style="border: 0px solid #019CDE; vertical-align: top;">
    <tr>
        <td>
            <iframe scrolling="no" frameborder="0" width="220" src='https://charttb.asiaebroker.com/WorldMarket065.html'></iframe>
        </td>
    </tr>
</table>
-->
<table cellspacing=0 cellpadding=0 width=212 class="tdBrder2" style=" vertical-align: top;">
    
    <TR align=middle class='tblTopHeader'>

	    <TD align=left colspan=4>

		    <table cellspacing=0 cellpadding=0 border=0 width='100%' height=16 background='<%=g_sImgPath%>/Market/grey_bg.gif' >

			    <tr bgcolor='#022D58'>

				    <td width=8></td><td width='102' align='left'><span style='FONT-FAMILY: Arial, Helvetica, sans-serif;FONT-SIZE: 8pt;color:#ffffff'><b>Futures/Month</b></SPAN>&nbsp;</TD>

				    <TD width='52' align='left'><span style='FONT-FAMILY: Arial, Helvetica, sans-serif;FONT-SIZE: 8pt;color:#ffffff'><b>Last</b></SPAN>&nbsp;</TD>

				    <TD width='50' align='right'><span style='FONT-FAMILY: Arial, Helvetica, sans-serif;FONT-SIZE: 8pt;color:#ffffff'><b>Vol</b></SPAN>&nbsp;</TD>

			    </TR>

		   </table>

       </td>

    </tr>
    <tr><td>    
    <table width='100%' id=tblSummIndices cellpadding='0' cellspacing='0'>
    <tr class=tblOddRow>                                                 
		<td id=FTNm1 width='43%'>-</td>
		<td id=FTLst1 align='right' width='26%'>0.000</td>
		<td id=FTChg1 width='7%'><img src='<%=g_sImgPath%>/Market/unchgarrow.png'></td>
		<td id=FTVol1 align='right' width='24%'>0.000</td>
	</tr>
	<tr class=tblEvenRow>                                                 
		<td id=FTNm2 width='43%'>-</td>
		<td id=FTLst2 align='right' width='26%'>0.000</td>
		<td id=FTChg2 width='7%'><img src='<%=g_sImgPath%>/Market/unchgarrow.png'></td>
		<td id=FTVol2 align='right' width='24%'>0.000</td>
	</tr>
	</table>
	</td></tr>
</table>



</body>
</html>
<%
Calendar now = Calendar.getInstance();
%>
<script language='javascript'> 
function body_OnLoad(){
    quoteData_MktSumm = new N2NScriptQuote_MktSumm("quoteData_MktSumm", "<%=sMktSummDataSrc %>?<%=now.getTimeInMillis() %>", "<%=sSpotMonthDataSrc %>?<%=now.getTimeInMillis() %>", "<%=sMktSummDataSrc %>?<%=now.getTimeInMillis() %>", 120);
	quoteData_MktSumm.updateData();
}
var m_oTableData_MktSumm_Equities            		 = document.getElementById("tblSummaryData");
var m_oTableData_MktSumm_Indices			 		 = document.getElementById("tblSummIndices");
var m_oTableData_MktSumm_Indices_ScoreBoard			 = document.getElementById("tblSummScoreBoard");
var quoteData_MktSumm;
 
function select(vnOption) {
	quoteData_MktSumm.select(vnOption);
}
function updateData() {
	quoteData_MktSumm.updateData();
}
 
function redirectChartServer(oImage_Icon_ID, file_type) {
	quoteData_MktSumm.redirectChartServer(oImage_Icon_ID, file_type);
}
</script> 

	<script type='text/javascript' src='<%=g_sJSPath %>/LinkFunc.js'></script>
	<script type='text/javascript' src='<%=g_sJSPath %>/autosuggest.js'></script>
	<script type='text/javascript' src='<%=g_sJSPath %>/suggestions.js'></script>
	<script type='text/javascript' src='<%=g_sJSPath%>/stkCodeName.js'></script>
	<link rel=stylesheet type='text/css' href='<%=g_sStylePath%>/autosuggest.css' />

	<script language = 'javascript'>
		var form = document.frmFastQuote;
		var asFastQuote = new AutoSuggestControl(document.getElementById("txtFastQuote"), new N2NSuggestions(arrStkCodeName), 10);
		asFastQuote.setScrollHeight(14);
		asFastQuote.setFontSize(8);
	</script>

	<script language='javascript'>

		var m_sRepChar = new String('&');
		var m_sRepWith = new String('~');

		var iIndexSEg = new Number(0);
		var sStkName = new String('');
		var sStkCode = new String('');
		var sStkCodeName = new String('');

		function getStockCodeName() {
			sStkCodeName = new String(document.getElementById('txtFastQuote').value);
			while((iIndexSEg = sStkCodeName.indexOf(m_sRepWith))!=-1) {
				var regex = new RegExp(m_sRepChar, 'g');
				sStkCodeName = sStkCodeName.replace(regex, m_sRepChar);
			}

			var iDelimIndex = sStkCodeName.indexOf('(');
			var iDelimIndex2 = sStkCodeName.indexOf(')');

			if(sStkCodeName!=null && sStkCodeName!='' && iDelimIndex!=-1 && iDelimIndex2!=-1) {
				sStkName  = sStkCodeName.substring(0,iDelimIndex);
				sStkCode  = sStkCodeName.substring(iDelimIndex+1,iDelimIndex2);
			}
			else {
				sStkName='';
				sStkCode=sStkCodeName;
			}

			document.getElementById('StockName').value = sStkName;
			document.getElementById('FilterCode').value = sStkCode;
		}
	</script>

	<link rel='stylesheet' type='text/css' href='<%=g_sStylePath%>/autosuggest.css' />
	<script language='javascript'>
	function butFastQuote_OnClick() {
		var sSearch = document.frmFastQuote.txtFastQuote.value;
		if (sSearch == '') {
			alert('A value must be entered in the following field(s):\nStock Quotes');
			return false;
		}
		getStockCodeName();
		OpenLinkWindow(document.frmFastQuote.action+document.getElementById('FilterCode').value, 'winFastQuote', 'left=120,top=60,width=220,height=300,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no');
		return false;
	}
	</script>