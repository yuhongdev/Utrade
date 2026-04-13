<%@ page import="XMLReader.xmlreader" %>
<%@ page import = "com.n2n.util.N2NConst"%>

<%@ page import = "java.text.SimpleDateFormat, java.util.Date"%>
<%@ page import = "com.n2n.DB.N2NMFNews"%>
<%@ page import = "java.sql.*,java.net.*, java.io.*" %>
<%@ page import = "com.n2n.DB.N2NDateFunc"%>

<%	boolean bAdmin = false;
	if (g_sCategory != null && (g_sCategory.equals(N2NConst.CLI_CATEGORY_ADMIN) || g_sCategory.equals(N2NConst.CLI_CATEGORY_SADMIN)))
		bAdmin = true;
%>
<%
	SimpleDateFormat sdf = new SimpleDateFormat("EEE dd MMM yyyy");
%>
<script language='JavaScript' src='<%=g_sJSPath%>/LinkFunc.js'></script>
<script language=JavaScript src='<%=g_sJSPath%>/others_lite.js'></script>
<script language=JavaScript src='<%=g_sJSPath%>/mm_menu.js'></script>
<script language=javascript src="<%=g_sJSPath%>/popupWindow.js"></script>
<link rel=stylesheet href='<%=g_sStylePath %>/default.css'>

<table id="rtLogo"  border=0 cellspacing=0 cellpadding=0 width=<%=iWidth%> valign="top" align=center>	
	
	<tr>
		<td>&nbsp;</td>	
		<td align='right' width='13%'>&nbsp;</td>
	</tr>
	<tr>
		<td><font style='font-family:Arial;font-size:8pt;font-weight:bold;Color:#828282;'>Welcome&nbsp;<%=g_sLoginId%>!</font></td>	
		<td align='right' width='13%'>
			<font class='clsGrayText'><%=sdf.format(new Date())%></font>
		</td>
	</tr>
</table>

<table id="rtMenu" background='<%=g_sImgPath%>/rtmenu_bg.gif' border=0 cellspacing=0 cellpadding=0 width=<%=bShrtMenu?iWidth-180:iWidth%> align=center>
	<tr bgcolor='#828282'>
		<td height=20>
			<table border=0 cellpadding=0 cellspacing=0 style='font-size:8pt;font-family:Arial,Verdana'>
				<tr height=25>
				
				
					<!-- My Profile -->
<%
	if(!g_sCategory.equals(N2NConst.CLI_CATEGORY_MEMBER)) {
%>
					<td>
						<a name=navProfile id=navProfile style='color:white;text-decoration:none;font-weight:bold' href='#' target=_top onclick="MM_nbGroup('down','group1','navProfile','/img/ITRADE-CIMB/button/myprofile_roll.gif',1)" onmouseover="MM_nbGroup('over','navProfile','/img/ITRADE-CIMB/button/myprofile_roll.gif','',1)" onmouseout="MM_nbGroup('out')"><span onmouseover="MM_showMenu(window.mm_menu_0719160029_0,0,18,null,'navProfile')" onmouseout="MM_startTimeout();" />&nbsp;&nbsp;My Profile&nbsp;&nbsp;|</span></a>
					</td>
<%
	} else {
%>
					<td>
						<a name=navProfile id=navProfile style='color:white;text-decoration:none;font-weight:bold' href='#' target=_top onclick="MM_nbGroup('down','group1','navProfile','/img/ITRADE-CIMB/button/myprofile_roll.gif',1)" onmouseover="MM_nbGroup('over','navProfile','/img/ITRADE-CIMB/button/myprofile_roll.gif','',1)" onmouseout="MM_nbGroup('out')"><span onmouseover="MM_showMenu(window.mm_menu_0719160028_0,0,18,null,'navProfile')" onmouseout="MM_startTimeout();" />&nbsp;&nbsp;My Profile&nbsp;&nbsp;|</span></a>
					</td>
<%
	}
%>
					<!-- LogOut -->
					<td>
						<a name=navLogout id=navLogout style='color:white;text-decoration:none;font-weight:bold' href='/gcUTRADEPlus/loginATP?action=logout&frmpath=lite&frm=rt' target=_top onclick="MM_nbGroup('down','group1','navLogOut','/img/ITRADE-CIMB/button/logout_roll.gif',1)" onmouseover="MM_nbGroup('over','navLogOut','/img/ITRADE-CIMB/button/logout_roll.gif','',1)" onmouseout="MM_nbGroup('out')"><span onmouseout="MM_startTimeout();"></span>&nbsp;&nbsp;Logout</a>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
<%	
	String sRTUrl =  request.getRequestURI().toString();
	if (sRTUrl.indexOf("qsea.jsp")>=0) {
%>
	<script language="JavaScript1.2">
		mmLoadMenus("RT","new");		
	</script>
<%
	}else{
%>	
	<script language="JavaScript1.2">
		mmLoadMenus("RT","old");		
	</script>	
<%	}
%>

<iframe src='' id='fraMenu' scroll='no' scrolling='no' frameborder='1' 
style='position:absolute;visibility:hidden;filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);border:0;top:0;left:0;width:0;height:0;background-color:#000000;z-index:998;' class='iframe'>
</iframe>

<iframe src='' id='fraSubMenu' scroll='no' scrolling='no' frameborder='1' 
style='position:absolute;visibility:hidden;filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);border:0;top:0;left:0;width:0;height:0;background-color:transparent;z-index:997;' class='iframe'>
</iframe>
