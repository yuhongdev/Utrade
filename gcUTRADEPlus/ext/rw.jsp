<%//@ include file='checkParam.jsp'%>
<%@ include file='/common.jsp'%>
<%@ include file='/util/sessionChecks.jsp'%>
<%
	if (!validSession) {
		out.println("<script language='javascript'>");
		out.println("	alert('Please login to access this page.');");
		out.println("	parent.location.href='"+oN2NSession.getSetting("HTMLRootHome")+"'");
		out.println("</script>");
	} else {
	System.out.println("cart_item_id_"+g_sLoginId + "=" +session.getAttribute("cart_item_id_"+g_sLoginId));
session.setAttribute("tradingAcc","PH,");
String encodeUserParam = session.getAttribute("userPrams")==null?"":session.getAttribute("userPrams").toString();
System.out.println("userPram="+encodeUserParam);
/**
1 - Client Summary - /rptCliPos.jsp
2 - Monthly Statement - /rptBosMth.jsp
3 - Margin Account Summary - /rptMgnSumm.jsp
15 - iBeyond - /rptIBeyond.jsp
16 - Trader Deposit - /rptTrdDep.jsp
18 - Statement of Account Report
19 - Purchase and Sales Daily Invoice Report

21 - eSettlement - /stlOutstandingCliPos.jsp
22 - Settlement Status - /stlPayStatus.jsp
23 - eDeposit - /stlDepositStatus.jsp
24 - Other Services - /acctOtherInformation.jsp
25 - New Subscription - /viewSubscriptions.jsp
26 - Current Subscription - /currentSubscription.jsp

44 - News Research - /newsResearch.jsp
45 - News Research(RSS) - /obnews.jsp
46 - Stock Screener - /newsTRKDScn.jsp

61 - Disclaimer Note - /web/disclaimer_outbound.html
62 - Footer Note - /footer_note.jsp
63 - Footer Disclaimer - /footer_disclaimer.jsp

85 - Calculator - /anlyCalc.jsp?lang=en&fontSize=11&lang=en&exchg=KL&|left=20&top=40&width=620&height=350&tw=WinCalc|
86 - Analysis Chart - /anlyChart.jsp
17 - End of day file - /ext/cliEODDL.jsp.jsp
*/

//String report_no="1";
System.out.println("............report no:"+report_no);
System.out.println("===:"+request.getQueryString());
String main_url_redirection = oN2NSession.getSetting("HTMLRoot")+g_sPath;
if (report_no.equals("1")) { // Client Summary
	//response.sendRedirect(main_url_redirection+"/rptCliPos.jsp");
	response.sendRedirect(main_url_redirection+"/web/html/ClientSummReport.html");
} else if (report_no.equals("2")) { // Monthly Statement
	response.sendRedirect(main_url_redirection+"/rptBosMth.jsp");
} else if (report_no.equals("3")) { // Margin Account Summary
	response.sendRedirect(main_url_redirection+"/rptMgnSumm.jsp");
} else if (report_no.equals("15")) { // iBeyond
	response.sendRedirect(main_url_redirection+"/rptIBeyond.jsp");
} else if (report_no.equals("16")) { // Trader Deposit
	response.sendRedirect(main_url_redirection+"/rptTrdDep.jsp");
} else if (report_no.equals("18")) { // Statement of Account Report
        response.sendRedirect(main_url_redirection+"/web/html/rptMthStmt.html");
} else if (report_no.equals("19")) { // Purchase and Sales Daily Invoice Report
        response.sendRedirect(main_url_redirection+"/web/html/rptInv.html");
} else if (report_no.equals("21")) { // eSettlement
	response.sendRedirect(main_url_redirection+"/stlOutstandingCliPos.jsp");
} else if (report_no.equals("22")) { // Settlement Status
	response.sendRedirect(main_url_redirection+"/stlPayStatus.jsp");
} else if (report_no.equals("23")) { // eDeposit
	response.sendRedirect(main_url_redirection+"/stlDepositStatus.jsp");
} else if (report_no.equals("24")) { // Other Services
	response.sendRedirect(main_url_redirection+"/acctOtherInformation.jsp");
} else if (report_no.equals("25")) { // New Subscription
	response.sendRedirect(main_url_redirection+"/viewSubscriptions.jsp");
} else if (report_no.equals("26")) { // Current Subscription
	response.sendRedirect(main_url_redirection+"/currentSubscription.jsp");

} else if (report_no.equals("44")) { // News Research (Redirection)
	response.sendRedirect(main_url_redirection+"/newsResearch.jsp");
} else if (report_no.equals("45")) { // News Research (RSS)
	response.sendRedirect(main_url_redirection+"/obnews.jsp");
} else if (report_no.equals("46")) { // Stock Screener
	response.sendRedirect(main_url_redirection+"/apps/newsTRKDScn.jsp");

} else if (report_no.equals("61")) { // Disclaimer Note
	response.sendRedirect(main_url_redirection+"/web/disclaimer_outbound.html");
} else if (report_no.equals("62")) { // Footer Note
	response.sendRedirect(main_url_redirection+"/footer_note.jsp");
} else if (report_no.equals("63")) { // Footer Disclaimer
	response.sendRedirect(main_url_redirection+"/footer_disclaimer.jsp");

} else if (report_no.equals("85")) { // Calculator
	response.sendRedirect(main_url_redirection+"/anlyCalc.jsp?lang=en&fontSize=11&lang=en&exchg=KL&|left=20&top=40&width=620&height=350&tw=WinCalc|");
} else if (report_no.equals("86")) { // Analysis Chart
	response.sendRedirect(main_url_redirection+"/anlyChart.jsp");
} else if (report_no.equals("87")) { // End Of Day file
	response.sendRedirect(main_url_redirection+"/ext/cliEODDL.jsp");
} else {
	//response.sendRedirect(main_url_redirection+"/rptCliPos.jsp");
	response.sendRedirect(main_url_redirection+"/web/html/ClientSummReport.html");
}

	}
%>
