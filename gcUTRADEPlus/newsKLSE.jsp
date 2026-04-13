<%@ page import = "com.spp.util.security.Encrypt, java.sql.*, com.n2n.bean.*, com.n2n.DB.*, java.text.SimpleDateFormat,java.util.Date, com.n2n.util.N2NConst,com.n2n.util.N2NSecurity"%>
<%
	response.setHeader("Cache-Control", "no-cache");
//	response.setHeader("Cache-Control", "post-check=0, pre-check=0", false);
	response.setHeader("Pragma", "no-cache");
	response.setDateHeader("Expires", -1);
%>
	<script language="JavaScript" src="js/LinkFunc.js"></script>
	<script language="JavaScript">
	function butFastQuote_OnClick() {
		var sSearch = document.frmFastQuote.txtFastQuote.value;
		if (sSearch == "") {
			alert("Please enter search string!")
			return false;
		}

		OpenLinkWindow(document.frmFastQuote.action +sSearch, "winFastQuote", "left=120,top=60,width=220,height=270,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no");
		return false;
	}

	function KLSEInfo_OnClick(voForm, vsOption) {
		var aQueryURL = new Array ( "http://www.klse-ris.com.my/CDB/owa/lcd.genchq",
									"http://www.klse-ris.com.my/CDB/owa/cp_datechq",
									"http://www.klse-ris.com.my/CDB/owa/cp_summary" );
		var sStkCode = document.all.selStkName.value;
		if (sStkCode == "") {
			alert("Please enter a stock code / name!");
			return false;
		}
		if (vsOption == "") {
			alert("Please select an option to view!");
			return false;
		}
		var sURL = aQueryURL[parseInt(vsOption.charAt(0))];
		vsOption = vsOption.substr(2);
		voForm.txtStkCode.value = sStkCode;
		voForm.txtOption.value = vsOption;
		voForm.action = sURL;
	
		if (vsOption != "") {
			return true;
		} else {
			sURL = voForm.action +"?cmp_code_in="+ sStkCode;
			window.open(sURL, "iFrKLSENewsDisp", "", false);
			return false;
		}
	}
	</script>

<jsp:useBean id="rt" class="com.n2n.DB.N2NMFCliColSetting" scope="page"/>
<%@ include file='common.jsp'%>
 
<%@include file="/util/sessionCheck.jsp"%>
<%
//if (oN2NSession.getIsUserLogin()) { 
if (validSession) {

	session.setAttribute("FromUrl","https://www.itradecimb.com/bin/home.asp");	

	String sStkCode = "";
	String sURL = "";
	//sStkCode = request.getParameter("StkCode");
	sStkCode = request.getQueryString();
	
//	sURL = "http://plc.ebrokerconnect.com/plc/innerAllNews.jsp?Bursa_box=yes&amp;DJ_box=&amp;AWSJ_box=&amp;bhcode=065";
	sURL = "http://plc.ebrokerconnect.com/plc/innerAllNews.jsp?Bursa_box=yes&DJ_box=&AWSJ_box=&load=First";
//	sURL = "http://plc.ebrokerconnect.com/plc/allNews.jsp?Bursa_box=yes&amp;DJ_box=&amp;AWSJ_box=&amp;bhcode=065";
	
	System.out.println("sStkCode:"+sStkCode);
	if (sStkCode!=null && sStkCode.length()>0) {
		sURL = sURL + "&FilterCode="+sStkCode;
	}
	System.out.println("sURL:"+sURL);
%>

<html>
<head>
<title>CIMB</title>
<meta content='text/html; charset=windows-1252' http-equiv="Content-Type">
<script language="JavaScript" type="text/javascript" src="js/N2NFunc.js"></script>
<script language="JavaScript" type="text/javascript" src="js/LinkFunc.js"></script>
<script language="JavaScript" src="js/StkCodeNameFillList.js"></script>
<link rel="stylesheet" type="text/css" href="style/default.css">
</head>

<body >

<table width=780 border=0 cellspacing=0 cellpadding=0 align=center>
<tr>
	<td width=550 valign=top colspan=2>
	<table width=100% border=0 cellspacing=0 cellpadding=0 align=center>
	<tr>
		<td width=10%> </td>
		<td>
		<table border="0" bordercolor='pink' width='780' cellpadding="0" cellspacing="0" ID="Table2">
		<tr valign="top" align="left">
			<td width='100%' valign="top" align="left">
			<table id="tblResults" width="100%" cellpadding="0" cellspacing="0">
			<tr height="20">
				<td colspan="4" width="100%">
					<iframe src=<%=sURL%> id="iFrKLSENewsDisp" name="iFrKLSENewsDisp" scrolling="no" frameborder="no" style="WIDTH:780px;HEIGHT:990px"></iframe>
				</td>
			</tr>
			</table>
			</td>
		</tr>
		</table>
		</td>
	</tr>
	</table>
	</td>
</tr>
</table>
<% }else {
	response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
}
 %>		
</body>
</html>
