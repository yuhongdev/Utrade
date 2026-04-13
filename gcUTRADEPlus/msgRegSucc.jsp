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
	<style type="text/css">
		* {
			font-family: Calibri, sans-serif;
		}

		.clsAccOpenHeaderFont p {
			position: absolute;
			top: 150px;
			right: 0;
			bottom: 0;
			left: 0;
			margin: auto;
			font-size: 14px;
			text-align: center;
			line-height: 15px;
		}

		.bold {
			font-size: 20px;
			color: #00AA00;
		}
	</style>	
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
		<!-- <tr><td colspan=3 align=right><img src=<%=g_sImgPath%>/LineBlue.gif width='100%'></td></tr> -->
		<tr><td colspan=3>&nbsp;</td></tr>
		<tr>
			<td colspan=3 class=clsAccOpenHeaderFont>
				<p><span class="bold">Start Investing!</span><br><br>
				You have now activated your online account.<br>
				You will receive an email confirmation within 24 hours.</p>
			</td>
		</tr>
		
		<tr><td colspan=3 style='font-size:1mm'>&nbsp;</td></tr>
		<!-- <tr><td colspan=3 style='font-size:1mm'><hr></td></tr> -->

		<tr style='font-size:3mm'><td colspan=4>&nbsp;</td></tr>
<!-- 		<tr><td colspan=3 align=right><center><input type=button name=btnClose  onclick=Close_OnClick() language=javascript style="width:120px; CURSOR: hand" title="Close"  value=CLOSE></center></td></tr> -->
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
