<%@ page import = "java.sql.*, java.lang.*, java.util.Date, java.text.SimpleDateFormat, com.n2n.util.N2NConst" %>
<%@ include file='common.jsp'%>

<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<jsp:useBean id="clibean" class="com.n2n.bean.N2NMFCliInfoBean" scope="page"/>
<jsp:setProperty name="clibean" property="*" />

<%
	String sType="";
	String sCliType = "";
	String sChkProd = "";
	String sFlagEquity = "false";
	String sFlagDerivatives = "false";
	String sDoc = "";
		
	String g_sDocPath = "/gcUTRADEPlus/doc";
	boolean bIsCorpCli = false;
	boolean bIsEquity = false;
	
	sType=request.getParameter("type");
	sCliType=request.getParameter("cliType");
	sChkProd=request.getParameter("chkProd");
	sFlagEquity=request.getParameter("E");
	sFlagDerivatives=request.getParameter("D");
	sDoc=request.getParameter("doc");
	
	if (sType.equals(N2NConst.CLI_CATEGORY_CORPORATE)) {
		bIsCorpCli = true;
	} else {
		bIsCorpCli = false;
	}
	
	if(sDoc.equals("E")){
		bIsEquity = true;
	} else {
		bIsEquity = false;
	}
%>
<html>
<head>
	<META content="-1" http-equiv="Expires">
	<META content="no-cache" http-equiv="Pragma">
	<META content="no-cache" http-equiv="Cache-Control">	
	<link rel=stylesheet type=text/css href=<%=g_sStylePath%>/default.css>
	<title><%=(bIsEquity)?"Equity":"Derivative"%> Terms & Conditions For Use Of Site</title>
	<script language=JavaScript src="<%=g_sJSPath%>/N2NCtrl.js"></script>
	<script language=JavaScript src="<%=g_sJSPath%>/email.js"></script>
</head>

<body>
	<form name="cliTermCondFrm" method=post action="">
	<table cellpadding=0 border=0 cellspacing=0 width=770>		
		<tr class=clsSectionHeader height=40>
			<td width=2%><img src='<%=g_sImgPath%>/empty.gif' height=2 width=2></td>
			<td width=98% colspan=2><font style='font-size:18pt;text-indent:5mm'><b><%=(bIsEquity)?"Equity":"Derivative"%> Terms & Conditions</b></font></td>
		</tr>
		
		<tr>
		<% if(bIsEquity){
				if (bIsCorpCli) { %>
					<td colspan=3 height=330><iframe src='<%=g_sDocPath%>/TermCondCorp.pdf' scrolling=no width='100%' height='100%'></iframe></td>
		<% 		} else { %>
					<td colspan=3 height=330><iframe src='<%=g_sDocPath%>/TermCondOnline.pdf' scrolling=no width='100%' height='100%'></iframe></td>
		<% 		} 
			} else {	%>
				<td colspan=3 height=330><iframe src='<%=g_sDocPath%>/TermCondOnlineDev.pdf' scrolling=no width='100%' height='100%'></iframe></td>
		<%	}		%>
		
		</tr>
		
		<tr Height=10>
			<td width='2%' valign=bottom><img src='<%=g_sImgPath%>/empty.gif' height=2 width=2></td>
			<td width='98%' colspan=2 valign=bottom><img src='<%=g_sImgPath%>/empty.gif' height=2 width=2></td>
		</tr>
		
		<tr style="FONT-SIZE: 1mm">
			<td colspan=3>&nbsp;</td>
		</tr>
		
		<tr>
			<td width=2% valign=bottom><img src='<%=g_sImgPath%>/empty.gif' height=2 width=2></td>
			<td width=4%><img src='<%=g_sImgPath%>/empty.gif' height=2 width=2></td>
			<td width='94%' align=left><input accessKey=R id=Register name=Register onclick="OpenReg()" style="WIDTH: 230px; CURSOR: hand" type=button value="I AGREE TO THE ABOVE Terms & Conditions"><img src='<%=g_sImgPath%>/empty.gif' height=4 width=20>
			<input accessKey=C id=btnCancel name=btnCancel align=left onclick='javascript:revert()' style="WIDTH: 120px; CURSOR: hand" type=button value="NOT AGREE"></td>
			<input type=hidden id=chkAgree name=chkAgree value="A">
		</tr>
		</form>
	</table>
</body>
</html>
<script language=javascript>
	frm = document.cliTermCondFrm;
	var checkSubs = "";
	
	//function OpenReg(){
	//	frm.action="registrationOption.jsp?type=<%=sType%>&chkProd=<%=sChkProd%>&cliType=<%=sCliType%>&E=<%=sFlagEquity%>&D=<%=sFlagDerivatives%>";
	//	frm.submit();
	//}

	function revert() {
		//frm.close();
		//history.go(-1);
		checkSubs = "<%=sDoc%>";
		if (checkSubs == "E") {
			parent.location.href="registrationOption.jsp?type=<%=sType%>&chkProd=<%=sChkProd%>&cliType=<%=sCliType%>&E=false&D=<%=sFlagDerivatives%>";	
		} else if (checkSubs == "ED") {
			parent.location.href="registrationOption.jsp?type=<%=sType%>&chkProd=<%=sChkProd%>&cliType=<%=sCliType%>&E=false&D=false";
		} else if (checkSubs == "D") {
			parent.location.href="registrationOption.jsp?type=<%=sType%>&chkProd=<%=sChkProd%>&cliType=<%=sCliType%>&E=<%=sFlagEquity%>&D=false";
		} else {
			parent.location.href="registrationOption.jsp?type=<%=sType%>&chkProd=<%=sChkProd%>&cliType=<%=sCliType%>&E=<%=sFlagEquity%>&D=<%=sFlagDerivatives%>";
		}
		
	}
</script>
