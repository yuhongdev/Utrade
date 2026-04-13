<%@ page import = "java.sql.*,java.text.DecimalFormat,java.text.SimpleDateFormat,java.util.*" %>
<%@ page import = "com.n2n.util.*" %>
<%@ page import = "com.n2n.DB.N2NMFCliInfo" %>
<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>

<%@ include file='common.jsp'%>
<%@ include file='util/sessionCheck.jsp'%>
<%!
	public String GenHelpBulb(String strTitle,String g_sImgPath) {
		String strHTML = "";
		strHTML = "<img id=imgHelp border=0 width=20 height=19 src=" + g_sImgPath + "/lightbulboff.jpg";
		strHTML = strHTML + " onmouseover=\"this.src='" + g_sImgPath + "/lightbulbon.jpg'\"";
		strHTML = strHTML + " onmouseout=\"this.src='" + g_sImgPath + "/lightbulboff.jpg'\"";
		strHTML = strHTML + " title=\"" + strTitle + "\">";		
		return strHTML;
	}
%>
<%
	String strBHCode = g_sDefBHCode;
	
	String sContraNumber = (String) request.getParameter("ContraNumber");
	sContraNumber = sContraNumber != null ? sContraNumber : "";

	if (validSession) {
%>

<html>
<head>
<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
<title>Client's Contra Details</title>
</head>

<!--body onload=Body_OnLoad() style='background:#ffffff;margin:5px 0px 0px 6px'-->
<body onload=Body_OnLoad() class='clsBody'>

<table border=0 cellpadding=0 cellspacing=0 width=540>
	<tr>
		<td class=clsSectionHeader width='97%'>&nbsp;Client's Contra Detail Information</td>
		<td width='3%'><%=GenHelpBulb("Contra Details: Display contra details information",g_sImgPath)%></td>
	</tr>
</table>

<BR>

<%
		int intRow = 0;

		DecimalFormat dfValue     = new DecimalFormat("#,###,###,##0.00");
		DecimalFormat df4Value    = new DecimalFormat("#,###,###,##0.0000");
		DecimalFormat dfQty       = new DecimalFormat("#,###,###,##0");
		SimpleDateFormat dtFormat = new SimpleDateFormat("dd/MM/yyyy");

		ResultSet oRst = null;
		
		cli.init(oN2NSession);
		oRst = cli.getContraDtl(sContraNumber, strBHCode);

		if (oRst != null) {

			String sContraNo   = "";
			String sContractNo = "";
			String sQty        = "";
			String sStkPrice   = "";
			String sCR         = "";
			
			double dQty = 0, dStkPrice = 0, dAmount = 0, dInterest = 0;
			int rowCount = 0;

			while (oRst.next()) {
			
				rowCount = oRst.getRow();

				if (rowCount == 1) {
					out.print("<table id=tblContraDtlHdr cellpadding=0 cellspacing=0 width=540>\n");
					out.print(" <tr class=clsRepHeader>\n");
					out.print("  <td width='19%' class=clsRepFirstCol style=' border-right-color: #FFFFFF'>Contra No</td>\n");
					out.print("  <td width='11%' class=clsRepMidCol style='   border-right-color: #FFFFFF'>Contract <br>Date</td>\n");
					out.print("  <td width='19%' class=clsRepMidCol style='   border-right-color: #FFFFFF'>Contract No</td>\n");
					out.print("  <td width='10%' class=clsRepMidCol style='   border-right-color: #FFFFFF'>Qty</td>\n");
					out.print("  <td width='9%' class=clsRepMidCol style='   border-right-color: #FFFFFF'>Stock <br>Price</td>\n");
					out.print("  <td width='10%' class=clsRepMidCol style='   border-right-color: #FFFFFF'>Funding Cost</td>\n");
					out.print("  <td width='12%' class=clsRepMidCol>Debit</td>\n");
					out.print("  <td width='13%' class=clsRepLastCol>Credit</td>\n");
					out.print(" </tr>\n");
					out.print("</table>\n\n");

					out.print("<div id=divPortfolio style='overflow:auto'>\n");
					out.print("<table id=tblPrtfDtlList border=0 cellpadding=0 cellspacing=0 width=540 height=50>\n");
				}
			
				sContraNo   = oRst.getString("ContraNo");
				sContractNo = oRst.getString("ContractNo");
				sQty        = oRst.getString("Qty");
				sStkPrice   = oRst.getString("StkPrice");
				dAmount     = oRst.getDouble("Amount");
				sCR         = oRst.getString("CR");
				dInterest   = oRst.getDouble("Interest");
				
				//out.print("["+sContraNo+"],["+sContractNo+"],["+sQty+"],["+sStkPrice+"],["+dAmount+"],["+sCR+"],["+ oRst.getDate("ContractDate")+"]");
				
				try {
					dQty = Double.valueOf(sQty).doubleValue();
				} catch (NumberFormatException nfe) {
					dQty = 0;
				}
				try {
					dStkPrice = Double.valueOf(sStkPrice).doubleValue();
				} catch (NumberFormatException nfe) {
					dStkPrice = 0;
				}

				if ((intRow % 2) == 0) {
					out.print(" <tr width='100%' class=clsRepRowEven>\n");
				} else {
					out.print(" <tr width='100%' class=clsRepRowOdd>\n");
				}
				
				out.print("<td width='19%' class=clsRepFirstCol style='text-align:center'>&nbsp;" + sContraNo + "</td>\n");
				
				out.print("<td width='11%' class=clsRepMidCol style='text-align:center'>&nbsp;");
				out.print(dtFormat.format(oRst.getDate("ContractDate")));
				out.print("</td>\n");
				
				out.print("<td width='19%' align='left' class=clsRepMidCol style='text-align:left'>&nbsp;" + sContractNo + "</td>\n");
				
				out.print("<td width='10%' class=clsRepMidCol style='text-align:right'>");
				out.print(dfQty.format(dQty));
				out.print("&nbsp;</td>\n");
				
				out.print("<td width='9%' class=clsRepMidCol style='text-align:right'>");
				out.print(df4Value.format(dStkPrice));
				out.print("&nbsp;</td>\n");
				
				out.print("<td width='10%' class=clsRepMidCol style='text-align:right'>");
				out.print(dfValue.format(dInterest));
				out.print("&nbsp;</td>\n");
				
				if (sCR.equals("D")) { 
					// Debit item
					out.print("<td width='12%' class=clsRepMidCol style='text-align:right'>");
					out.print(dfValue.format(dAmount));
					out.print("&nbsp;</td>\n");
						
					out.print("<td width='13%' class=clsRepLastCol style='text-align:right'> &nbsp;</td>\n");
				} else {
					// Credit item
					out.print("<td width='12%' class=clsRepMidCol style='text-align:right'> &nbsp;</td>\n");
					
					out.print("<td width='13%' class=clsRepLastCol style='text-align:right'>");
					out.print(dfValue.format(dAmount));
					out.print("&nbsp;</td>\n");
				}

				out.print("</tr>\n");
				
				intRow++;

			} // End of while oRst.next()

			if (rowCount > 0) {
				out.print("</table>\n");
				out.print("</div>\n\n");

				out.print("<table id=tblPrtfDtlFooter cellpadding=0 cellspacing=0 width=540>\n");
				out.print("<tr class=clsRepHeader><td style='FONT-SIZE: 1mm'>&nbsp;</td></tr>\n");
				out.print("</table>\n");
			} else {
				out.print("<font color=red size=3>There is no record found</font>");
			}

		} else {
			
			// When no data found, we will show that no data statement
			// NOTE: If this happened data hasn't been downloaded from BOS
			out.print("<font color=red size=3>There is no record found</font>");
			
		} // End of if ( oRst != null )
		
		if (oRst!=null) {
			oRst.close();
			oRst = null;
		}
		
		oN2NSession.cliinfo.closeResultset();
		oN2NSession.cliinfo.dbDisconnect();
%>

</body>
</html>

<script language=JavaScript>

function Body_OnLoad()
{
	var oTable
	var intTotalRow
	
	if ("<%=intRow%>" != "0") {					  
		oTable = document.all.tblPrtfDtlList;
		if (oTable){
			intTotalRow = oTable.rows.length;
			if (intTotalRow > 5) {
				document.all.divPortfolio.style.height = 150;
				document.all.divPortfolio.style.width = 557;
			}
		}
	}
}
</script>
<%
	}
%>
