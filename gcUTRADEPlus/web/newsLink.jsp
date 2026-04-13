
<%@include file="/common.jsp"%>
<html>
<head>

<style>
   .Footerlink {
	color:#0099CC;
	font-family:Arial,Helvetica,sans-serif;
	font-size:11px;
	text-decoration:none;
	}
</style>
<title>News Link</title>
</head>

<body>
<%
	iWidth=780;
  	bShrtMenu = false;
 %>
<table width=<%=iWidth %> border=0 cellspacing=0 cellpadding=0 align=center>
	<tr>
  		<td align='center' height='20' colspan=2>
		<%@ include file='/menu_RT.jsp'%>
  		</td>
    </tr>
	
	<tr>
		<td width=<%=iWidth%> valign=top colspan=2>
		
		<table width=100% border=0 cellspacing=0 cellpadding=0>
			<tr><td>&nbsp;</td><tr>
			<tr><td style='font-size:9pt;font-family:Arial;color:#0e3055;'>&nbsp;&nbsp;&nbsp;News Link</td><tr>
			<tr>
				<td>
					<table width=100% border=0 cellspacing=0 cellpadding=0>
						<tr>
							<td>								
								<table width=<%=iWidth%> border=0 cellspacing=0 cellpadding=0>
									<tr>
										<td width='10%'>&nbsp;</td>
										<td width='90%' valign=top>
											<table width='75%' border=0 cellspacing=0 cellpadding=0 style='font-size:8pt;font-family:Arial;color:#003366'>												
												<tr valign=top><td colspan=2>&nbsp;</td>
													<td>
														<br>We provide links to other sites to help you make informed investment decision. Links to other sites are inserted for convenience and do not constitute our endorsement of any information, product or services at those sites. You are advised to consult your own investment advisor for any investment decision. In any event, we shall not be liable, whether under tort or contract, for any damages, losses or expenses suffered or incurred by you, including direct, consequential, incidental, special, or indirect damages, or loss of profits or trading losses, arising from or otherwise resulting directly or indirectly from your use of the information or services found or comprised in those sites.
														<ol>
															<li><a target="_new" class=Footerlink href="http://biz.thestar.com.my">The Star</a></li>
															<li><a target="_new" class=Footerlink href="http://business-times.asiaone.com">Business Times</a></li>
															<li><a target="_new" class=Footerlink href="http://www.theedgedaily.com">The Edge</a></li>
															<li><a target="_new" class=Footerlink href="http://www.bernama.com">Bernama</a></li>
															<li><a target="_new" class=Footerlink href="http://www.bursamalaysia.com">Bursa Malaysia News</a></li>
															<li><a target="_new" class=Footerlink href="http://biz.thestar.com.my/business/unit_trust.asp">Unit Trust Quo</a></li>
														</ol>
													</td>
												</tr>
											</table>
										</td>
									</tr>
									<tr><td colspan=2 height=5>&nbsp;</td></tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
		</td>
	</tr>
	<tr>
  		<td align='center' height='20' colspan=2>
		<%@ include file='/footer_RT.jsp'%>
  		</td>
    </tr>	
</table>
<br><br>


</body>
</html>