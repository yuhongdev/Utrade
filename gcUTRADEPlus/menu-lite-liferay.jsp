<%@ page import = "com.n2n.util.N2NConst"%>
<%@ page import = "java.text.SimpleDateFormat, java.util.Date"%>
<%@ page import = "java.sql.*,java.net.*, java.io.*" %>

<%	boolean bAdmin = false;
	if (g_sCategory != null && (g_sCategory.equals(N2NConst.CLI_CATEGORY_ADMIN) || g_sCategory.equals(N2NConst.CLI_CATEGORY_SADMIN)))
		bAdmin = true;
	SimpleDateFormat sdf = new SimpleDateFormat("EEE dd MMM yyyy");
	java.util.Date dtNow = new java.util.Date();
	String NRS_KL_status = session.getAttribute("IsOutBoundActivated")!=null&&!("").equals(session.getAttribute("IsOutBoundActivated"))?session.getAttribute("IsOutBoundActivated").toString():"0";
%>
<link rel=stylesheet href='<%=g_sStylePath %>/default.css'>
<link rel="stylesheet" href="<%=g_sStylePath%>/mod_poplogin.css" />
<script type="text/javascript" src="<%=g_sJSPath%>/mod_poplogin.js"></script>
<style type="text/css">
/*------------------------main menu--------------------------------*/
	.nav-menu {
	clear:both;
	margin:0px;
	padding:0px;
	position:relative;
	z-index:199;
	font-family:Arial,Helvetica,Verdana,sans-serif;
	font-size:10px;
	font-weight:bold;
	border-width:1px;
	border-style:solid;
	border-color:#39be15;
	}
	.ie .nav-menu {
	margin-top:-5px;
	}
	.nav-menu ul {
	list-style:none;
	margin:0;
	padding:0px;
	position: relative; 
	z-index: 100;
	}
	.ie7 .nav-menu ul {
	padding:0px;
	}
	.nav-menu li,.nav-menu a {
	display:inline-block;
	}
	.ie6 .nav-menu li,.ie7 .nav-menu li,.ie6 .nav-menu a,.ie7 .nav-menu a {
	display:inline;
	zoom:1;
	z-index:200;
	}
	.level-1 {
	text-align:left;
	max-width:1000px;
	background-color: #39be15;
	vertical-align:middle;	
	}
	.level-1 a {
	cursor:pointer;
	text-decoration:none;
	font:bold 11px arial,verdana,sans-serif;
	text-align:center;
	vertical-align:middle;
	display:block;
	min-width:65px;
	border-style:solid;
	border-color:#39be15;
	margin:0;
	/*border-width:1px;
	padding:2px;*/
	color:#ffffff;
	background-color:#39be15;
	}
	
	.level-1 span {
	cursor:pointer;
	text-decoration:none;
	font:bold 11px arial,verdana,sans-serif;
	text-align:center;
	vertical-align:middle;
	display:block;
	min-width:65px;
	border-style:solid;
	border-color:#39be15;
	margin:0;
	/*border-width:1px;
	padding:2px;*/
	color:#ffffff;
	background-color:#39be15;
	}	
	.level-1 a:hover {

	}
	.level-1 .selected {

	}
	.level-1 li {
	position:relative;
	}
	.level-1 li a.selected {

	}
	.level-1 li a.selected:hover {

	}
	/*----------sub levels--------*/
	ul .level-2 {
	margin-top:-2px;	
	display:none;
	background-color:#39be15;
	}
	.level-2 a {
	background-color:#39be15;
	height:20px;
	width:149px;
	text-align:left;
	z-index:2000;
	color:#ffffff;
	border-color:#39be15;
	border-width:0px;
	}
	.level-2 a:hover {
	background-color:#ed1c24;
	color:#ffffff;
	border-color:#39be15;
	border-width: 0px;
	}
	li:hover .level-2 {
	/*the magic*/
	display:block;
	position:absolute;
	left:0px;
	top:20px;
	z-index:2000;
	color:#ffffff;
	}
	.level-2 .selected {
	z-index:2000;
	background-color:#c61016;
	}
	.level-2 li a.selected:hover {
	color: #ffffff;
	}
	.level-2 span {
	background-color:#39be15;
	height:20px;
	width:149px;
	text-align:left;
	z-index:2000;
	color:#ffffff;
	border-color:#39be15;
	border-width:0px;
	}
	.level-2 span:hover {
	background-color:#ed1c24;
	color:#ffffff;
	border-color:#39be15;
	border-width: 0px;
	}
	.level-2 li span.selected:hover {
	color: #ffffff;
	}	
	</style>
<table id="rtLogo" border=0 cellspacing=0 cellpadding=5 width=<%=iWidth%> valign="top">
<%
	if(sUserAgent.indexOf("ipad")<0) {
%>	
	<!--<tr>-->
		<!--<td align="left" width="25%">--><!--<img src='<%=g_sImgPath%>/Login/logo.jpg' width="201" height="67" border='0'>--><!--<img src='<%=g_sImgPath%>/Login/logo.jpg' border='0'></td>
		<td width='20%' align='right'><img src='<%=g_sImgPath%>/Home/Logo_PowerByN2N.png' border='0' width='96' height='36'></td>
	</tr>-->
<%
	}
%>
	<tr>
		<td align="left"><font style='font-family:Arial;font-size:10px;font-weight:bold;Color:#b6972e;'>Welcome&nbsp;<%=g_sLoginId%>!</font></td>	
		<td align='right' width='13%' colspan="2">
            <% if (NRS_KL_status.equals("1") && sUserAgent.indexOf("ipad")<0) { %><span style="color: red; font-weight: bolder; font-family: arial; font-size: 9pt; text-decoration: none;"><u>R - Real-time / D - Delay >15 minutes</u></span><img height="1" width="15" border="0" src=<%=g_sImgPath%>/empty.gif><% } %>
			<font class='clsGrayText'><%=sdf.format(new Date())%></font>
		</td>
	</tr>
</table>
<table id="rtMenu" style="display:none" background='<%=g_sImgPath%>/rtmenu_bg.gif' border=0 cellspacing=0 cellpadding=0 width=<%=bShrtMenu?iWidth-180:iWidth%> align=left>
	<tr bgcolor='#39be15'>
		<td height=20>
		<div class="nav-menu nav-menu-style-">
	<%if (!g_sLoginId.equals("Guest")) { %>	
		<ul class="layouts level-1">
			<li class="open">
				<a class="open" href="<%=root_url%>/newsResearch.jsp" target="_blank">Research</a>
			</li>
			<li style="color:#ffffff;">|</li>
			<li class="open">
				<span class="open">Trading Hall</span>
				<ul class="layouts level-2">
					
					<!--<li class="open"><a class="open" href="<%=root_url%>/tclite/index.jsp?lang=en">
						<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">i*Trade (v1.0)
					</a></li>-->
					
					<li class="open"><a class="open" href="<%=root_url%>/tcplus/index.jsp?lang=en">
						<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">i*Trade (v2.0)
					</a></li>		
					<li class="open"><a class="open" href="<%=root_url%>/tcplus/index.jsp?lang=en&basic=y">
						<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">i*Trade (v2.0) LITE
					</a></li>
				</ul>
			</li>
			<li style="color:#ffffff;">|</li>
			<li class="open">
				<span class="open">Settlement</span>
				<ul class="layouts level-2">
						<li class="open"><span class="open" onclick="javascript:window.open('<%=root_url%>/stlOutstandingCliPos.jsp','_blank','left=50, top=50, toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=780, height=600,scrollbars=no,resizable=no,');">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">eSettlement
						</span></li>
						<li class="open"><span class="open" onclick="javascript:window.open('<%=root_url%>/stlPayStatus.jsp','_blank','left=50, top=50, toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=635, height=330,scrollbars=no,resizable=no,');">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">Settlement Status
						</span></li>
						<li class="open"><span class="open" onclick="javascript:window.open('<%=root_url%>/web/html/eSettlement.html','_blank','left=50, top=50, toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=yes, copyhistory=yes, width=1030, height=600,scrollbars=yes,resizable=yes,');">
													<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">eSettlement(NEW)
						</span></li>
						<li class="open"><span class="open" onclick="javascript:window.open('<%=root_url%>/web/html/stlPayStatus.html','_blank','left=50, top=50, toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=yes, copyhistory=yes, width=1030, height=600,resizable=yes,');">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">Settlement Status(NEW)
						</span></li>
						<li class="open"><span class="open" onclick="javascript:window.open('<%=root_url%>/web/html/Client Deposit Report.html','_blank','left=170, top=170, toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=yes, copyhistory=yes, width=1030, height=600,scrollbars=yes,resizable=yes,');">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">eDeposit (NEW)
						</span></li>
						<li class="open"><span class="open" onclick="javascript:window.open('<%=root_url%>/stlDepositStatus.jsp','_blank','left=50, top=50, toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=655, height=530,scrollbars=no,resizable=no,');">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">eDeposit
						</span></li>						
				</ul>
			</li>
			<li style="color:#ffffff;">|</li>
			<li class="open">
				<span class="open">My Profile</span>
				<ul class="layouts level-2">
						<li class="open"><span class="open" onclick="popupWin('chgPwd')">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">Change Password
						</span></li>
						<!--
						<li class="open"><span class="open" onclick="popupWin('forgetPwd')">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">Forgot Password
						</span></li>
						-->
						<li class="open"><span class="open" onclick="popupWin('chgPin')">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">Change Pin
						</span></li>		
						<li class="open"><span class="open" onclick="popupWin('forgetPin')">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">Forgot Pin
						</span></li>
						<li class="open"><span class="open" onclick="javascript:window.open('<%=root_url%>/cliProfilerTrd.jsp','_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=720, height=520,scrollbars=no,resizable=no,top=50,left=50');">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">SMS Setting
						</span></li>
						<li class="open"><span class="open" onclick="javascript:window.open('<%=root_url%>/acctInformationEmail.jsp?act=upd','_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=800, height=435,scrollbars=no,resizable=no,top=50,left=50');">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">Change E-Contract Email
						</span></li>
						<li class="open"><span class="open" onclick="javascript:window.open('<%=root_url%>/acctInformation.jsp','_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=800, height=435,scrollbars=no,resizable=no,top=50,left=50');">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">Account Information
						</span></li>						
						<li class="open"><span class="open" onclick="javascript:window.open('<%=root_url%>/CA/cliGetDisclaimer.jsp','_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=865, height=560,scrollbars=no,resizable=no,top=50,left=50');">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">Corporate Action
						</span></li>						
				</ul>
			</li>
			<li style="color:#ffffff;">|</li>			
<% if (NRS_KL_status.equals("1")) { %>
			<li class="open">
				<span class="open" onclick="javascript:window.open('<%=root_url%>/acctOtherInformation.jsp','_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=800, height=435,scrollbars=no,resizable=no,top=50,left=50');">
					Other Services
				</span>				
			</li>
			<li style="color:#ffffff;">|</li>			
<% } %>
			<li class="open">
				<span class="open">Subscription</span>
				<ul class="layouts level-2">
					<li class="open">
						<span class="open" onclick="javascript:window.open('<%=root_url%>/viewSubscriptions.jsp','_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=1000, height=595,scrollbars=no,resizable=no,top=50,left=50');">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">New Subscription
						</span>
					</li>
					
					<!--<li class="open">
						<span class="open" onclick="javascript:window.open('<%=root_url%>/web/html/viewSubscriptions2.html','_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=1000, height=595,scrollbars=no,resizable=no,top=50,left=50');">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">New Subscription(NEW)
						</span>
					</li>-->

					<li class="open">
						<span class="open" onclick="javascript:window.open('<%=root_url%>/currentSubscription.jsp','_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=1000, height=595,scrollbars=no,resizable=no,top=50,left=50');">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">Current Subscription
						</span>
					</li>
					<li class="open">
						<span class="open" onclick="javascript:window.open('<%=root_url%>/web/html/caSubscription.html','_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=1000, height=595,resizable=no,top=50,left=50');">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">Online CA Instruction
						</span>
					</li>
					<li class="open">
						<span class="open" onclick="javascript:window.open('<%=root_url%>/web/html/caSubscpStatus.html','_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=1000, height=595,resizable=no,top=50,left=50');">
							<img src="<%=root_url%>/img/ITRADE-CIMB/button/acc-arrow-itrade.gif" style="border:0;margin:4px 2px;vertical-align:middle;">CA Subscription Status
						</span>
					</li>
				</ul>
			</li>
		</ul>
						<% } %>			
	</div>		
		</td>
	</tr>
</table>
<script type="text/javascript">
	function popupWin(act){
		$("#popupIFrame").attr("src","/gcUTRADEPlus/web/html/sipbuy.html");
		$("#triggerAnchor")[0].click()
	}
	
	function displayTempAnn(){
		var dtNow = new Date();
		var dtStart = new Date("2015-05-23 9:00:00");
		var dtEnd = new Date("2015-05-23 13:00:00");
		if(dtNow>dtStart && dtNow<dtEnd){
			document.getElementById("tempAnn").style.display = "";
		}
	}
	displayTempAnn();
</script>

<div id="stickydiv-anchor" style="display:none;">&nbsp;</div>
<div id="stickydiv">
	<div id="stickContent">
		<div style="display:none;"><a id="triggerAnchor" rel="tppoplogin" class="poplogin" href="#">trigger</a></div>
		<div style="display: none; width: 500px; margin-top: -238.5px; margin-left: -340px; " id="tppoplogin" class="popbox">
			<iframe id="popupIFrame" name="popupIFrame" style="position:relative;" src="" scrolling="no" frameborder="0" height="470" width="500"></iframe>
		</div>
	</div>
</div>
