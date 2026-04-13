<%@ page import = "java.sql.ResultSet,com.n2n.util.N2NConst,com.n2n.util.N2NSecurity,java.util.Calendar,java.util.Date,com.n2n.DB.N2NDateFunc,java.text.SimpleDateFormat,java.text.DecimalFormat,com.n2n.DB.N2NMFCliInfo,com.n2n.bean.N2NMFCliInfoBean,com.n2n.DB.N2NSettlement"%>
<%@ include file='/common.jsp'%>
<%@include file="/util/sessionCheck.jsp"%>
<HTML>
<HEAD>
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">
<script language=JavaScript src="<%=g_sJSPath%>/N2NFunc.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/N2NPrnFunc.js"></script>
<%
	DecimalFormat dfValue = new DecimalFormat("#,###,###,##0.00");

	String sRefNo = "";
	String sBroker = "";
	ResultSet oRst = null;
	
	sRefNo = request.getParameter("RefNo");
	sRefNo = sRefNo != null ? sRefNo : "";
	sBroker = request.getParameter("Broker");
	sBroker = sBroker != null ? sBroker : "";

	//if (oN2NSession.getIsUserLogin()) {
	if (validSession) {
	
		N2NSettlement settle = new N2NSettlement();
		settle.init(oN2NSession);
		settle.setWriter(out);
%>
<TITLE>Payment Details</TITLE>
</HEAD>
<!--BODY style='background:#FFFFFF;margin:5px 0px 0px 6px'-->
<BODY class='clsBody'>
	<TABLE border=0 cellpadding=0 cellspacing=0 width=500>
		<TR>
			<TD class=clsSectionHeader width='97%'>&nbsp;Payment Details</TD>
			<TD width='3%'><img id=imgHelp border=0 width=20 height=19 src=<%=g_sImgPath%>/lightbulboff.jpg onmouseover="this.src='<%=g_sImgPath%>/lightbulbon.jpg'" onmouseout="this.src='<%=g_sImgPath%>/lightbulboff.jpg'" title="Summary: Show payment details for a particular payment."></TD>
		</TR>
	</TABLE>
<BR/>
<%
	oRst = settle.stlGetPaymentDtl(sRefNo,"");
	int iRow = 0;

	out.println("<table border=0 cellpadding=0 cellspacing=0 width=500>");
	out.println("<tr class=clsRepHeader>");
	out.println("<td width='12%' class=clsRepFirstCol style=' border-right-color: #FFFFFF'>Line</td>");
	out.println("<td width='30%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Method</td>");
	out.println("<td width='20%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Description</td>");
	out.println("<td width='20%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Branch</td>");
	out.println("<td width='30%' class=clsRepLastCol>Amount</td>");
	out.println("</tr>");
	out.println("</table>");

	out.println("<table border=0 cellpadding=0 cellspacing=0 width=500>");
	if (oRst != null) {
		while (oRst.next()) {
			iRow = iRow + 1;
			if (iRow % 2 == 0) {
				out.println("<tr width=100% class=clsRepRowEven>");
			} else {
				out.println("<tr width=100% class=clsRepRowOdd>");
			}
			out.println("<td width='12%' class=clsRepFirstCol>&nbsp;" + oRst.getInt("Line") + "</td>");
			if (oRst.getString("mode").equals("F")) {
				out.println("<td width='30%' class=clsRepMidCol>&nbsp;Online Transfer</td>");
				if (oRst.getString("Src").equals("M")) {
					out.println("<td width='20%' class=clsRepMidCol>&nbsp;Maybank2U.com</td>");
				} else if (oRst.getString("Src").equals("B")) {
					out.println("<td width='20%' class=clsRepMidCol>&nbsp;CIMBClicks</td>");
				} else if (oRst.getString("Src").equals("A")) {
					out.println("<td width='20%' class=clsRepMidCol>&nbsp;Alliance Online</td>");
				} else if (oRst.getString("Src").equals("F")) {
					out.println("<td width='20%' class=clsRepMidCol>&nbsp;FPX</td>");													
				} else if (oRst.getString("Src").equals("D")) {
					out.println("<td width='20%' class=clsRepMidCol>&nbsp;AmDirect Online</td>");													
				} else if (oRst.getString("Src").equals("I")) {
					out.println("<td width='20%' class=clsRepMidCol>&nbsp;Affin Bank Online</td>");													
				}
				out.println("<td width='20%' class=clsRepMidCol>&nbsp;</td>");				
			} else if (oRst.getString("mode").equals("T")) {
				out.println("<td width='30%' class=clsRepMidCol>&nbsp;Setoff</td>");
				out.println("<td width='20%' class=clsRepMidCol>&nbsp;Trust A/C</td>");
				out.println("<td width='20%' class=clsRepMidCol>&nbsp;"+ g_sBHName +"</td>");
			}
			out.println("<td width='30%' class=clsRepLastCol align=right>" + dfValue.format(oRst.getDouble("line_amt")) + "&nbsp;</td>");
			out.println("</tr>");
		}
		oRst.close();
	}
	if (iRow == 0) {
		out.println("<font style='font-family:Arial;font-size:8pt;'>There is no record found</font>");
	}
	out.println("</table>");
	out.println("<table cellspacing=0 width=500>");
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