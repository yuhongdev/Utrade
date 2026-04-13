<%@ page import = "java.sql.ResultSet,com.n2n.util.N2NConst,com.n2n.util.N2NSecurity,java.util.Calendar,java.util.Date,com.n2n.DB.N2NDateFunc,java.text.SimpleDateFormat,java.text.DecimalFormat,com.n2n.DB.N2NMFCliInfo,com.n2n.bean.N2NMFCliInfoBean,com.n2n.DB.N2NSettlement"%>
<%@ include file='/common.jsp'%>
<%@include file="/util/sessionCheck.jsp"%>
<script language=JavaScript src="<%=g_sJSPath%>/N2NFunc.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/N2NPrnFunc.js"></script>
<HTML>
<HEAD>
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">
<TITLE>Overdue Purchases</TITLE>
</HEAD>
<!--BODY onload='Body_OnLoad()' style='background:#FFFFFF'-->
<BODY onload='Body_OnLoad()' class='clsBody'>
<%

	SimpleDateFormat dtFormat = new SimpleDateFormat("dd/MM/yyyy");
	DecimalFormat dfValue = new DecimalFormat("#,###,###,##0.00");
	DecimalFormat dfPrice = new DecimalFormat("#,###,###,##0.0000");
	
	ResultSet oRst = null;
	String sBHCliCode = ""; String sBHBranch = ""; String [] aWork = null;
	int intDbtRow = 0;
	double dTotal = 0;
	
	//if (oN2NSession.getIsUserLogin()) {
	if (validSession) {

		sBHCliCode = request.getParameter("Acc");
		sBHCliCode = sBHCliCode != null ? sBHCliCode : "";

		if (sBHCliCode.length() > 0) {
			aWork = sBHCliCode.split(N2NConst.TRDACC_COL_SEP);
			sBHCliCode = aWork[0];
			if (aWork.length >= 1) {
				sBHBranch = aWork[1];
			}
		}

		intDbtRow = 0;
		
		N2NSettlement settle = new N2NSettlement();
		settle.init(oN2NSession);
		settle.setWriter(out);
%>
	<TABLE border=0 cellpadding=0 cellspacing=0 width=690>
		<TR>
			<TD class=clsSectionHeader width='97%'>&nbsp;Overdue Purchases</TD>
			<TD width='3%'><img id=imgHelp border=0 width=20 height=19 src=<%=g_sImgPath%>/lightbulboff.jpg onmouseover="this.src='<%=g_sImgPath%>/lightbulbon.jpg'" onmouseout="this.src='<%=g_sImgPath%>/lightbulboff.jpg'" title="Summary: Show all overdue purchase contracts."></TD>
		</TR>
	</TABLE>
	<BR/>
<%
		out.println("<font color=red face=arial size=2><B>No payment is allowed and your shares will be forced sold on T+4</B></font>");
		out.println("<table cellpadding=0 cellspacing=0 width=690 colspan=10>");
		out.println("<tr class=clsRepHeader>");
		out.println("<td width='11%' class=clsRepFirstCol style=' border-right-color: #FFFFFF'>Date</td>");
		out.println("<td width='11%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Due Date</td>");
		out.println("<td width='13%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Ref No</td>");
		out.println("<td width='17%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Stock</td>");
		out.println("<td width='10%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Price</td>");
		out.println("<td width='10%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Qty</td>");
		out.println("<td width='8%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Interest</td>");
		out.println("<td width='10%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>O/S Amt</td>");
		out.println("<td width='10%' class=clsRepLastCol>Payable</td>")	;
		out.println("</tr>");
		out.println("</table>");
		out.println("<table border=0 cellpadding=0 cellspacing=0>");
		out.println("<tr><td>");
		out.println("<div id=divDbt style='overflow:auto'>");
		out.println("<table name=tblOSDbtLine id=tblOSDbtLine cellpadding=0 cellspacing=0 width=690 colspan=10>");

		oRst = settle.getOverdueContract(sBHCliCode,sBHBranch);
		if (oRst != null) {
			oRst = settle.getNextResult();
			while (oRst.next()) {
				intDbtRow = intDbtRow + 1;
				
				if (intDbtRow % 2 == 0) {
					out.println("<tr width=100% class=clsRepRowEven>");
				} else {
					out.println("<tr width=100% class=clsRepRowOdd>");
				}
				out.println("<td width='11%' class=clsRepFirstCol style='verticalAlign:bottom'>&nbsp;"+ dtFormat.format(oRst.getDate("DocDate"))+ "</td>");
				
				if (oRst.getDate("DueDate") != null) {
					out.println("<td width='11%' class=clsRepMidCol style='verticalAlign:bottom'>&nbsp;"+ dtFormat.format(oRst.getDate("DueDate"))+ "</td>");
				} else {
					out.println("<td width='11%' class=clsRepMidCol style='verticalAlign:bottom'>&nbsp;</td>");
				}
				out.println("<td width='13%' class=clsRepMidCol style='text-align:left'>&nbsp;" + oRst.getString("DocNo") + "</td>");
				if (oRst.getString("StkShtName") != null) {
					out.println("<td width='17%' class=clsRepMidCol style='text-align:left'>&nbsp;" + oRst.getString("StkShtName") + "</td>");
				} else {
					out.println("<td width='17%' class=clsRepMidCol style='text-align:left'>&nbsp;</td>");
				}
				out.println("<td width='10%' class=clsRepMidCol style='text-align:right'>"+ dfPrice.format(oRst.getDouble("Price")) +"&nbsp;</td>");
				out.println("<td width='10%' class=clsRepMidCol style='text-align:right'>"+ oRst.getInt("Qty")  +"&nbsp;</td>");
				out.println("<td width='8%' class=clsRepMidCol style='text-align:right' >"+ dfValue.format(oRst.getDouble("Interest"))+"&nbsp;</td>");
				out.println("<td width='10%' class=clsRepMidCol style='text-align:right'>"+ dfValue.format(oRst.getDouble("Total")) +"&nbsp;</td>");
				out.println("<td width='10%' class=clsRepLastCol style='text-align:right'>"+ dfValue.format(oRst.getDouble("Total") + oRst.getDouble("Interest")) +"&nbsp;</td>");
				out.println("</tr>");
				dTotal = dTotal + oRst.getDouble("Total") + oRst.getDouble("Interest");
			}
		}
		oRst.close();
		out.println("</table>");
		out.println("</div>");
		out.println("<table name=tblTotal id=tblTotal cellspacing=0 cellpadding=0 width=690>");
		out.println("<tr class=clsRepHeader width='100%' ><td width=90% align=right class=clsRepMidCol>Total&nbsp;&nbsp;</td>");
		out.println("<td width=10% align=right class=clsRepLastCol>" + dfValue.format(dTotal) + "&nbsp;</td></tr>");
		out.println("</table>")	;
		out.println("<br/>");
		settle.closeResultset();
		settle.dbDisconnect();
	}
	else{
		response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
	}
%>
</BODY>
</HTML>
<script language=JavaScript>
var g_nDbtRow=<%=intDbtRow%>;

function Body_OnLoad()
{
	if (g_nDbtRow > 10) {
		document.all.divDbt.style.height = 140;
	}
}
</script>