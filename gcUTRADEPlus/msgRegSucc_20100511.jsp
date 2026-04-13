<%@ include file='common.jsp'%>

<html>
<head>
	<META content="-1" http-equiv="Expires">
	<META content="no-cache" http-equiv="Pragma">
	<META content="no-cache" http-equiv="Cache-Control">	
	<link rel=stylesheet type=text/css href=<%=g_sStylePath%>/default.css>
	<link rel=stylesheet type=text/css href="style/master.css">
	<link rel=stylesheet type=text/css href="style/style-c.css">
	<title>Registration Successful</title>	

	<script language=JavaScript src="<%=g_sJSPath%>/N2NFunc.js"></script>
	<script language='JavaScript' src='<%=g_sJSPath%>/LinkFunc.js'></script>
	<script language='JavaScript'  src="<%=g_sJSPath%>/popupWindow.js"></SCRIPT>
</head>
<%	String sName = request.getParameter("name");
	sName = sName != null ? sName : "";
	String sEmail = request.getParameter("email");
	sEmail = sEmail != null ? sEmail : "";
	String sCategory = request.getParameter("category");
	sCategory = sCategory != null ? sCategory : "";
	String sClientType = request.getParameter("clientType");
	sClientType = sClientType != null ? sClientType : "";
%>

<body>
	<table border=0 bordercolor=red width=660 cellpadding=0 cellspacing=0>
		<tr><td rowspan=35 width='4%'>&nbsp;</td><td colspan=3 width='96%' align=right>
				<object classid=clsid:D27CDB6E-AE6D-11cf-96B8-444553540000 codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=4,0,2,0' width=175 height=50>
				<param name=movie value=<%=g_sImgPath%>/LogoBannerTopRight.swf>
				<param name=quality value=high>
				<embed src=<%=g_sImgPath%>/LogoBannerTopRight.swf quality=high pluginspage='http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash' type='application/x-shockwave-flash' width=175 height=50>
				</embed>
				</object>
			</td></tr>
		<tr><td colspan=3 align=right><img src=<%=g_sImgPath%>/LineBlue.gif width='100%'></td></tr>

		<tr><td colspan=3 class=clsAccOpenHeaderFont><br/><font color=#990000 size=4>Congratulations !</font></td></tr>
		<tr><td colspan=3>&nbsp;</td></tr>
		<tr>
			<td colspan=3 class=clsAccOpenHeaderFont>
				You have successfully applied for your online account with <% out.print(oN2NSession.getSetting("WebBHName")); %> 
				You are able to instantly access Bursa Malaysia's real time stock prices, research reports and news.
				Our Retail Equities Officers will contact you to arrange for your account activation.
				An email notification will be sent to you once your trading account is activated subject to submission of duly completed application forms.
			 </td>
		</tr>

		<tr><td colspan=3>&nbsp;</td></tr>
		<tr><td colspan=3><img src=<%=g_sImgPath%>/IconStep1.gif></td></tr>
		<tr><td colspan=3 style='font-size:1mm'>&nbsp;</td></tr>
		<tr><td colspan=3 class=clsAccOpenHeaderFont>
			<% if(sCategory.equals("M") && sClientType.equals("N")){ %>
					Please print the Online Application forms & Online Terms and Conditions forms (PDF file), complete & sign in the presence of our Dealers Representatives, Remisiers, BCB Share Trading Unit Officer or a Commissioner for Oaths or Notary Public.</td></tr>
					<tr><td colspan=3>&nbsp;</td></tr><tr><td colspan=3 class=clsAccOpenHeaderFont>
					Click here for <b><a href="javascript:OpenLinkWindow('<%=g_sPath%>/doc/ApplicationForm.pdf', 'winCliAcctRegDoc', '')">Online Application Form (PDF)</a></b>
			<%	}  else if(sCategory.equals("C") && sClientType.equals("N")){%>
					Please print the Online Application forms & Online Terms and Conditions forms (PDF file), complete & sign in the presence of our Dealers Representatives, Remisiers, BCB Share Trading Unit Officer or a Commissioner for Oaths or Notary Public.</td></tr>
					<tr><td colspan=3>&nbsp;</td></tr><tr><td colspan=3 class=clsAccOpenHeaderFont>
					Click here for <b><a href="javascript:OpenLinkWindow('<%=g_sPath%>/doc/ApplicationFormCorp.pdf','winCliAcctRegDoc','')" & CHR(34) & ">Corporate Online Application Form (PDF)</a></b>
			<% } else { %>
					Print, Read and understand
			<% } %>
			
			</td></tr>

		<tr><td colspan=3>&nbsp;</td></tr>
		<tr><td colspan=3><img src=<%=g_sImgPath%>/IconStep2.gif></td></tr>
		<tr><td colspan=3 style='font-size:1mm'>&nbsp;</td></tr>
		<tr><td colspan=3 class=clsAccOpenHeaderFont>
			<% if(sClientType.equals("N")) {%>
				Attach all required supporting documents and the
				<% if(sCategory.equals("C")) {%>
					Corporate
				<% } else { %>
					Online Application Form and submit it to PCS-Non Advisory Unit at 7th Floor Commerce
					Square Jalan Semantan Damansara Heights 50490 Kuala Lumpur.
				<% } %>
			<% } else { %>
				Click here for <b><a href="javascript:OpenLinkWindow('<%=g_sPath%>/doc/TermCondOnline.pdf', 'winCliAcctRegDoc', '')"& chr(34) &">Online Terms and Conditions (PDF)</a></b>
			<% } %>
			
			</td></tr>

		<tr><td colspan=3>&nbsp;</td></tr>
		<tr><td colspan=3><img src=<%=g_sImgPath%>/IconStep3.gif></td></tr>
		<tr><td colspan=3 style='font-size:1mm'>&nbsp;</td></tr>
		<tr><td colspan=3 class=clsAccOpenHeaderFont>
			<% if(sClientType.equals("N")) { %>
				Thank you for your registration, You may enter <font color='#990000'><b>i*Trade</b></font><font color='#636363'>@</font><font class=tdTitleMainSubWeb><font color='#003366'>CIMB</font></font> as a guest using User ID and Password to view our website.
				Our Retail Equities Officers will contact you to provide you with further information to activate your Online Trading Account.
			<% } else { %>
				Submit <b>Online Terms & Conditions</b> to your remisier OR send to Retail Equities Unit 9th floor Commerce Square Jalan Semantan Damansara Heights 50490 Kuala Lumpur</td></tr>
				<tr><td colspan=3>&nbsp;</td></tr>
				<tr><td colspan=3><img src=<%=g_sImgPath%>/IconStep4.gif></td></tr>
				<tr><td colspan=3 style='font-size:1mm'>&nbsp;</td></tr>
				<tr><td colspan=3 class=clsAccOpenHeaderFont>
				Thank you for your registration, you may enter <font color='#990000'><b>i*Trade</b></font><font color='#636363'>@</font><font class=tdTitleMainSubWeb><font color='#003366'>CIMB</font></font> as a guest using user ID and password to view our website.
				<br/>To activate trading facilities, kindly contact your remisier or call our Retail Equities Officers at (603) 2084 9890
			<% } %>
			
			</td></tr>

		<tr><td colspan=3 style='font-size:1mm'>&nbsp;</td></tr>
		<tr><td colspan=3 style='font-size:1mm'><hr></td></tr>
		<tr><td colspan=3 class=clsAccOpenHeaderFont>
				<p>The recommended browser to view our web site is the Microsoft Internet Explorer (IE) 6 SP1 or higher version. Netscape Navigator
				will be supported at a later stage.</p></td></tr>
		<tr><td colspan=3 class=clsAccOpenHeaderFont>Click here to <b><a href="javascript:OpenLinkWindow('http://www.microsoft.com/downloads/details.aspx?FamilyID=1E1550CB-5E5D-48F5-B02B-20B602228DE6&displaylang=en', '_blank', '')">Download Microsoft Internet Explorer 6 now</a></b>
			</td></tr>

		<tr style='font-size:3mm'>
			<td colspan=3>&nbsp;</td></tr>
		<tr><td colspan=3 class=clsAccOpenHeaderFont>
				<p>The Real Time view offers many exciting features developed using advance Java technology.
				In order to support these features, you will need to install Java 2 Runtime Environment 1.3 or higher (English version).</p></td></tr>
		<tr><td colspan=4 class=clsAccOpenHeaderFont>Click here to <b><a href='javascript:OpenLinkWindow("http://java.sun.com/j2se/1.3.0_01/jre/index.html", "_blank", "")'>Download Java 2 Runtime Environment now</a></b>

		<tr style='font-size:3mm'>
			<td colspan=3>&nbsp;</td></tr>
		<tr><td colspan=3 class=clsAccOpenHeaderFont>
				<p>You will need an Adobe Acrobat Reader to open the above PDF files. If you do not have this software, </p></td></tr>
		<tr><td colspan=3 class=clsAccOpenHeaderFont>Click here to <b><a href='javascript:OpenLinkWindow("http://www.adobe.com/products/acrobat/readstep2.html", "_blank", "")'>Download Adobe Acrobat Reader now</a></b>

		<tr style='font-size:3mm'><td colspan=4>&nbsp;</td></tr>
		<tr><td colspan=3 align=right><center><input type=button name=btnClose  onclick=Close_OnClick() language=javascript style="width:120px; CURSOR: hand" title="Close"  value=Close></center></td></tr>
	</table>
</body>
</html>
<script>
function Close_OnClick()
{
	var parentWin = window.opener
	if (parentWin != null)
		parentWin.close();

	window.close();
}
</script>
