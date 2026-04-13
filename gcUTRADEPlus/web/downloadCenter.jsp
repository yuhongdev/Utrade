<%@include file="/common.jsp"%>
<html>
<head>

<title>Download Center</title>
</head>

<body>
<%
	iWidth=780;
  	bShrtMenu = false;
 %>
<table width=<%=iWidth%> border=0 cellspacing=0 cellpadding=0 align=center>
	<tr>
  		<td align='center' height='20'>
		<%@ include file='/menu_RT.jsp'%>
  		</td>
  
    </tr>
	<tr>
		<td width=<%=iWidth%> valign=top colspan=2>
		<table width=100% border=0 cellspacing=0 cellpadding=0>
			<tr><td>&nbsp;</td><tr>
			<tr><td style='font-size:9pt;font-family:Arial;color:#0e3055;'>&nbsp;&nbsp;&nbsp;Download Center</td><tr>
			
			<tr>
				<td>
					<table width=100% border=0 cellspacing=0 cellpadding=0>
						<tr>
							<td>								
								<table width=<%=iWidth%> border=0 cellspacing=0 cellpadding=0>
									<tr>
										<td width='10%'></td>
										<td width='90%' valign=top>
											<table width='100%' border=0 cellspacing=0 cellpadding=0 style='font-size:8pt;font-family:Arial;color:#003366'>												
												<tr valign=top>
													<td colspan=3>&nbsp;</td>
												</tr>
												<tr valign=top>
													<td colspan=3>
													
													<table width='80%' border=0 cellspacing=0 cellpadding=0>														
														<tr>
															<td width='10'></td>
															<td>
																<img src="<%=g_sImgPath %>/dot-line.png"><img src="<%=g_sImgPath %>/dot-line.png"><img src="<%=g_sImgPath %>/dot-line.png">
														  </td>
															<td></td>
														</tr>
													</table>
													
													<br>
													
													<table width='75%' border=0 cellspacing=0 cellpadding=0>														
														<tr>
															<td width='20'></td>
															<td width=76><img src="<%=g_sImgPath %>/download_logo/Software_ie.gif" id="dl1" onMouseOver='javascript:HighlightImage(this);' onMouseOut='javascript:RestoreImage(this);' onClick="javascript:OpenLinkWindow('http://download.microsoft.com/download/3/8/8/38889dc1-848c-4bf2-8335-86c573ad86d9/IE7-WindowsXP-x86-enu.exe', 'SoftwareDownload', '');" style="cursor: pointer; cursor: hand;"></td>
															<td width='100'></td>
															<td width=81><img src="<%=g_sImgPath %>/download_logo/Software_Reader.gif" id="dl2" onMouseOver='javascript:HighlightImage(this);' onMouseOut='javascript:RestoreImage(this);' onClick="javascript:OpenLinkWindow('http://www.adobe.com/products/acrobat/readstep2.html', 'SoftwareDownload', '');") style="cursor: pointer; cursor: hand;"></td>
															<td width='100'></td>
															<td width=80><img src="<%=g_sImgPath %>/download_logo/Software_flash.gif" id="dl3" onMouseOver='javascript:HighlightImage(this);' onMouseOut='javascript:RestoreImage(this);' onClick="javascript:OpenLinkWindow('http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash', 'SoftwareDownload', '');") style="cursor: pointer; cursor: hand;"></td>
															<td>&nbsp;</td>
														</tr>
														<tr><td>&nbsp;<br></td></tr>
													</table>
													
													<table width='80%' border=0 cellspacing=0 cellpadding=0>														
														<tr>
															<td width='10'></td>
															<td>
																<img src="<%=g_sImgPath %>/dot-line.png"><img src="<%=g_sImgPath %>/dot-line.png"><img src="<%=g_sImgPath %>/dot-line.png">
														  </td>
															<td></td>
														</tr>
													</table>
													
													<br>
													
													<table width='75%' border=0 cellspacing=0 cellpadding=0>														
														<tr>
															<td width='20'></td>
															<td width=110><img src="<%=g_sImgPath %>/download_logo/Software_java.gif" id="dl4" onMouseOver='javascript:HighlightImage(this);' onMouseOut='javascript:RestoreImage(this);' onClick="javascript:OpenLinkWindow('http://dl.asiaebroker.com/download/N2N/jre-6u13-windows-i586-p.exe', 'SoftwareDownload', '');") style="cursor: pointer; cursor: hand;"></td>
															<td width='65'></td>
															<td width=74><img src="<%=g_sImgPath %>/download_logo/Software_Microsoft.gif" id="dl5" onMouseOver='javascript:HighlightImage(this);' onMouseOut='javascript:RestoreImage(this);' onClick="javascript:OpenLinkWindow('http://dl.ebrokerconnect.com/download/MSJVM3805.exe', 'SoftwareDownload', '');") style="cursor: pointer; cursor: hand;"></td>
															<td width='100'></td>
															<td width=80></td>
															<td>&nbsp;<br></td>
														</tr>
														<tr><td>&nbsp;<br></td></tr>
													</table>
													
													<table width='80%' border=0 cellspacing=0 cellpadding=0>														
														<tr>
															<td width='10'></td>
															<td>
																<img src="<%=g_sImgPath %>/dot-line.png"><img src="<%=g_sImgPath %>/dot-line.png"><img src="<%=g_sImgPath %>/dot-line.png">
														  </td>
															<td></td>
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

<script language='javascript'>
function HighlightImage(voImage) {
	if (voImage.id == "dl1") {
		voImage.src="<%=g_sImgPath %>/download_logo/Software_colorIE.gif";
	} else if (voImage.id == "dl2") {
		voImage.src="<%=g_sImgPath %>/download_logo/Software_ColorReader.gif";
	} else if (voImage.id == "dl3") {
		voImage.src="<%=g_sImgPath %>/download_logo/Software_ColorFlash.gif";
	} else if (voImage.id == "dl4") {
		voImage.src="<%=g_sImgPath %>/download_logo/Software_ColorJava.gif";
	} else if (voImage.id == "dl5") {
		voImage.src="<%=g_sImgPath %>/download_logo/Software_ColorMicrosoft.gif";
	}
}

function RestoreImage(voImage) {
	if (voImage.id == "dl1") {
		voImage.src="<%=g_sImgPath %>/download_logo/Software_ie.gif";
	} else if (voImage.id == "dl2") {
		voImage.src="<%=g_sImgPath %>/download_logo/Software_Reader.gif";
	} else if (voImage.id == "dl3") {
		voImage.src="<%=g_sImgPath %>/download_logo/Software_flash.gif";
	} else if (voImage.id == "dl4") {
		voImage.src="<%=g_sImgPath %>/download_logo/Software_java.gif";
	} else if (voImage.id == "dl5") {
		voImage.src="<%=g_sImgPath %>/download_logo/Software_Microsoft.gif";
	}
}
</script>