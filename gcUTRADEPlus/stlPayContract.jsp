<%@ page import = "java.sql.ResultSet,com.n2n.util.N2NConst,com.n2n.util.N2NSecurity,java.util.Calendar,java.util.Date,com.n2n.DB.N2NDateFunc,java.text.SimpleDateFormat,java.text.DecimalFormat,com.n2n.DB.N2NMFCliInfo,com.n2n.bean.N2NMFCliInfoBean,com.n2n.DB.N2NSettlement"%>
<%@ include file='/common.jsp'%>
<%@include file="/util/sessionCheck.jsp"%>
<HTML>
<HEAD>
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">
<script language=JavaScript src="<%=g_sJSPath%>/N2NFunc.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/N2NPrnFunc.js"></script>
<%
	SimpleDateFormat dtFormat = new SimpleDateFormat("dd/MM/yyyy");
	DecimalFormat dfValue = new DecimalFormat("#,###,###,##0.00");
	DecimalFormat dfPrice = new DecimalFormat("#,###,###,##0.0000");

	String sRefNo = "";
	String sBHCliCode = ""; String sBHBranch = "";
	String [] aWork = null;
	ResultSet oRst = null;
	
	sRefNo = request.getParameter("RefNo");
	sRefNo = sRefNo != null ? sRefNo : "";
	sBHCliCode = request.getParameter("Acc");
	sBHCliCode = sBHCliCode != null ? sBHCliCode : "";
		
	//if (oN2NSession.getIsUserLogin()) {
	if (validSession) {

		if (sBHCliCode.length() > 0) {
			aWork = sBHCliCode.split(N2NConst.TRDACC_COL_SEP);
			sBHCliCode = aWork[0];
			if (aWork.length >= 1) {
				sBHBranch = aWork[1];
			}
		}
	
		N2NSettlement settle = new N2NSettlement();
		settle.init(oN2NSession);
		settle.setWriter(out);
%>
<TITLE>Payment Contract Details</TITLE>
</HEAD>
<!--BODY style='background:#FFFFFF;margin:5px 0px 0px 6px'-->
<BODY class='clsBody'>
	<TABLE border=0 cellpadding=0 cellspacing=0 width=780>
		<TR>
			<TD class=clsSectionHeader width='97%'>&nbsp;Payment Contract Details</TD>
			<TD width='3%'><img id=imgHelp border=0 width=20 height=19 src=<%=g_sImgPath%>/lightbulboff.jpg onmouseover="this.src='<%=g_sImgPath%>/lightbulbon.jpg'" onmouseout="this.src='<%=g_sImgPath%>/lightbulboff.jpg'" title="Summary: Show all contracts for a particular payment."></TD>
		</TR>
	</TABLE>
<BR/>
<%
	oRst = settle.getReceiptContractInfo(null,sRefNo,null,sBHCliCode,null,g_sCliCode,g_sDefBHCode,g_sDefBHBranch);
	
	int iInitialLot = 0;
	int iBalanceLot = 0;
	String sTmpID = "";
	double dTotal = 0;
	String sLastDocNo = "";
	int intScrollRow = 0;
	int nLotSize = 0;
	
	out.println("<table name=tblOSDtl id=tblOSDtl cellpadding=0 cellspacing=0 width=780 colspan=10>");
	out.println("<tr class=clsRepHeader>");
	out.println("<td width='1%' style=' display:none'>ID</ID>");
	out.println("<td width='1%' style='display:none'>RefNo</td>");
	out.println("<td width='4%' style='display:none'><img src=/gc/img/check20.gif width='20'></td>");
	out.println("<td width='9%' class=clsRepFirstCol style=' border-right-color: #FFFFFF'>Trx Date</td>");
	out.println("<td width='9%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Due Date</td>");
	out.println("<td width='10%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Ref No</td>");
	out.println("<td width='17%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Stock</td>");
	out.println("<td width='10%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Price</td>");
	out.println("<td width='10%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Qty</td>");
	out.println("<td width='10%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>O/S Amt</td>");
	out.println("<td width='14%' class=clsRepLastCol>Amount</td>");
	out.println("</tr>");
	out.println("</table>");
	out.println("<table border=0 cellpadding=0 cellspacing=0>");
	out.println("<tr><td>");
	out.println("<div id=divBOSPrtf style='overflow:auto'>");
	out.println("<table name=tblOSDtlLine id=tblOSDtlLine cellpadding=0 cellspacing=0 width=780 colspan=10>");

	if (oRst != null) {
		while (oRst.next()) {
			if (sLastDocNo != oRst.getString("DocNo")) { 
				nLotSize = oRst.getInt("LotSize");
				if (oRst.getInt("Qty") < nLotSize) {
					nLotSize = 1;
				}
				sLastDocNo = oRst.getString("DocNo");
				if (intScrollRow % 2 == 0) {
					out.println("<tr width=100% class=clsRepRowEven>");
				} else {
					out.println("<tr width=100% class=clsRepRowOdd>");
				}
				out.println("<td width='1%' style='display:none'>" + oRst.getDouble("Brokerage") + "</td>");
				out.println("<td width='1%' style='display:none'>" + oRst.getDouble("StampDuty") + "</td>");
				out.println("<td width='1%' style='display:none'>" + oRst.getDouble("ClearingFee") + "</td>");
				out.println("<td width='1%' style='display:none'>" + oRst.getDouble("MiscAmt") + "</td>");
				out.println("<td width='4%' style='display:none'></td>");
				out.println("<td width='9%' class=clsRepFirstCol style='verticalAlign:bottom'>&nbsp;"+ dtFormat.format(oRst.getDate("DocDate"))+ "</td>");
				if (oRst.getDate("DueDate") != null) {
					out.println("<td width='9%' class=clsRepMidCol style='verticalAlign:bottom'>&nbsp;"+ dtFormat.format(oRst.getDate("DueDate"))+ "</td>");
				} else {
					out.println("<td width='9%' class=clsRepMidCol style='verticalAlign:bottom'>&nbsp;</td>");
				}
				out.println("<td width='10%' class=clsRepMidCol style='text-align:left'>&nbsp;" + oRst.getString("DocNo") + "</td>");
				if (oRst.getString("StkShtName") != null) {
					out.println("<td width='17%' class=clsRepMidCol style='text-align:left'>&nbsp;" + oRst.getString("StkShtName") + "</td>");
				} else {
					out.println("<td width='17%' class=clsRepMidCol style='text-align:left'>&nbsp;</td>");
				}
				if (oRst.getDouble("Price") != 0) {
					out.println("<td width='10%' class=clsRepMidCol style='text-align:right'>"+ dfPrice.format(oRst.getDouble("Price")) +"&nbsp;</td>");
				} else {
					out.println("<td width='10%' class=clsRepMidCol style='text-align:right'>&nbsp;</td>");
				}
				if (oRst.getString("DocType").equals("P") || oRst.getString("DocType").equals("S")) {
					if (oRst.getInt("LotSize") != -1) {
						out.println("<td width='10%' class=clsRepMidCol align=center>&nbsp;" + oRst.getInt("NumLot") + " X " + nLotSize + "</td>");
					} else {
						out.println("<td width='10%' class=clsRepMidCol align=center>&nbsp;</td>");
					}
				} else {
					out.println("<td width='10%' class=clsRepMidCol align=center>&nbsp;</td>");
				}
				if (oRst.getString("Debit").equals("D")) {
					out.println("<td width='10%' class=clsRepMidCol style='text-align:right'>"+dfValue.format(oRst.getDouble("Total") + oRst.getDouble("TotMiscAmt"))+"&nbsp;</td>");
					out.println("<td width='14%' class=clsRepLastCol style='text-align: right'>&nbsp;" + dfValue.format(oRst.getDouble("amt")) + "</td>");
				} else {
					out.println("<td width='10%' class=clsRepMidCol style='text-align:right'>("+dfValue.format(oRst.getDouble("Total") + oRst.getDouble("TotMiscAmt"))+")&nbsp;</td>");
					out.println("<td width='14%' class=clsRepLastCol style='text-align: right'>&nbsp;(" + dfValue.format(oRst.getDouble("amt")) + ")</td>");		
				}
				out.println("</tr>");
				intScrollRow = intScrollRow + 1;
			}
		}
		oRst.close();
	}
	if (intScrollRow == 0) {
		out.println("<font style='font-family:Arial;font-size:8pt;'>There is no record found</font>");
	}
	out.println("</table>");
	out.println("</div>");
	out.println("<table cellspacing=0 width=780>");
	out.println("<tr class=clsRepHeader><td style='FONT-SIZE: 1mm'>&nbsp;</td></tr>");
	out.println("</table>");
%>
<BR/>
</BODY>
</HTML>
<%
		settle.closeResultset();
		settle.dbDisconnect();
	}
	else{
		response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
	}
%>