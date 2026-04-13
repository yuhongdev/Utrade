<%@ page import = "java.sql.*, java.lang.*, java.util.Date, java.text.SimpleDateFormat, com.n2n.util.N2NConst" %>
<%@ include file='/common.jsp'%>

<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<jsp:useBean id="clibean" class="com.n2n.bean.N2NMFCliInfoBean" scope="page"/>
<jsp:setProperty name="clibean" property="*" />

<%
String sAgreeTermCond = (String) session.getAttribute("agree_termcond");
sAgreeTermCond = sAgreeTermCond != null ? sAgreeTermCond : "";	

if (sAgreeTermCond.length() ==0) {
	sAgreeTermCond = request.getParameter("agree_termcond");
	sAgreeTermCond = sAgreeTermCond != null ? sAgreeTermCond : "";
	session.setAttribute("agree_termcond",sAgreeTermCond);
}	
if (sAgreeTermCond.equals("Y")) {
	StringBuffer sbMessage = new StringBuffer();
	sbMessage.append("");
	session.setAttribute("disclaimerIndicators",sbMessage.toString());
}
%>
<html>
<head>
	<META content="-1" http-equiv="Expires">
	<META content="no-cache" http-equiv="Pragma">
	<META content="no-cache" http-equiv="Cache-Control">	
	<link rel=stylesheet type=text/css href=<%=g_sStylePath%>/default.css>
	<title><%=oN2NSession.getSetting("WebSiteName")%> - Portfolio disclaimer </title>
	<script language=JavaScript src="<%=g_sJSPath%>/N2NCtrl.js"></script>
	<script language=JavaScript src="<%=g_sJSPath%>/email.js"></script>
</head>

<body>
	<table cellspacing=0 cellpadding=0 border=0 width='100%' bgcolor='white'>
		<tr>
			<td colspan='2'>
				<table cellspacing=0 cellpadding=5 class='clsTableBorder' width='100%'>
					<tr>
						<td class='signup'>
							<table cellspacing=0 cellpadding=3 border=0 bordercolor='#FFFFFF' width='100%'>
								<tr>
									<td>
									<img src="<%=g_sImgPath%>/itrade-logo.gif">
									</td>
									<td class='signup' valign='center' align='justify'>
									In order to gain access to your stock portfolio, you are required to read and understand the authorization statement 
									below. Please click on "AGREED" button if you agree to the authorization or click on "NOT AGREED"
									button if you do not agree to the authorization. <br><br>
									</td>
								</tr>
								<tr><td colspan='2' class='signup'><div id=divTermCond style="overflow:auto">
								<b><u>AUTHORISATION TO ACCESS TO STOCK PORTFOLIO</u></b><br><br>
									Whilst I/we understand that i*TradePro's portfolio manager ("Portfolio Manager") attempts to reflect a user's 
									current holding position with gain/loss computation marked-to-market, CIMB does not warrant the accuracy and 
									completeness of the information in the Portfolio Manager and expressly disclaims liability for misstatements, 
									errors or omissions contained in such information. I/We agree not to rely on the information contained in the 
									Portfolio Manager which shall not be taken as conclusive evidence of my/our position held. As such, I/we have 
									been advised to and shall verify the accuracy of all information including the number of positions held by 
									me/us prior to my/our execution of any trade or giving an order for such execution, as well as maintaining 
									proper and up-to-date records of my/our Securities transactions at all times. I/we shall be solely responsible 
									for any loss or damage suffered as a result of my/our own acts or omissions hereof. </div> 
								</td></tr>
								<tr>
									<td class='signup' height='1' colspan='2'><br><font color="red"><b>Important Note: In the event of any corporate action exercises, the quantity of shares on the online portfolio of i*Trade@CIMB will only be updated after lodgement date. </b></font><br></td>
								</tr>
								<tr>
									<td class='signup' height='1' colspan='2'></td>
								</tr>
								<tr>
									<form name='frmTermCond' action='<%=g_sPath%>/prtfDisclaimer.jsp' method='post'>
									<td align='center'><input type='button' id='btnAgree' onclick='javaascript:btnAgree_onclick();' value='AGREED'></td>
									<td align='center'><input type='button' id='btnDisagree' onclick='javaascript:btnDisagree_onclick();' value='NOT AGREED'>
									<input type='hidden' id='agree_termcond'  name='agree_termcond' value=''>
									</td>
									</form>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
	<script language='javascript'>
		var voForm = document.frmTermCond;
		function body_onload() {
			document.getElementById("divTermCond").style.height = 290;
			window.resizeTo(775,560);
		}
		
		function btnAgree_onclick() {
			document.getElementById("agree_termcond").value="Y";
			voForm.submit();
		} 
		
		function btnDisagree_onclick() {
			window.close();
		}
	</script>
