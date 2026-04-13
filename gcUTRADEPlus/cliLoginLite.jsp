<%@ page import = "java.text.SimpleDateFormat,java.util.Vector, java.util.Calendar, com.n2n.util.StringTokenizerEx" %>
<%@ page import = "com.spp.util.security.Decrypt" %>
<%@ include file= 'common.jsp'%>
<%@ include file= 'util/sessionCheck.jsp'%>
<%
if (session.getAttribute("uuid")!=null) {
	if (!session.getAttribute("uuid").equals("")) {
		validSession = false;
	}
}
g_validSession = validSession;
session.setAttribute("liteCall","lite");
	String sRsrch = request.getParameter("dp");
	sRsrch = sRsrch != null ? sRsrch : "";
	
	String debugger = request.getParameter("debugger");
	
	if(g_validSession){
		if (sRsrch.compareToIgnoreCase("research") == 0) {
			response.sendRedirect(oN2NSession.getSetting("HTMLRoot")+g_sPath+oN2NSession.getSetting("HTMLRealTimePage_research"));
		} else if (!sRsrch.equals("")) {
			response.sendRedirect(oN2NSession.getSetting("HTMLRoot")+g_sPath+"/"+sRsrch+".jsp?debugger="+debugger);
		}else{
			response.sendRedirect(oN2NSession.getSetting("HTMLRoot")+g_sPath+"/tclite/index.jsp?lang=en");
		}
	}
	setCommonPath(g_sPath, g_sImgPath, g_sJSPath, g_sStylePath, g_sWebPath, oN2NSession.getSetting("HTMLRootSecure"),out, oN2NSession.getSetting("WebBHName"));

	String vsTitle = oN2NSession.getSetting("WebSiteName");
	g_sTitle = vsTitle;
	out.println("<html>");
	out.println("<head>");
	out.println("<title>" + vsTitle + "</title>");
        // Added for the Activate Registration
        // http://mna.asiaebroker.com:8080//n2n_gc/cliLoginMain.jsp?act=ActivateReg&LoginID=877810271867791471877142351877810271833727551833727551834395471
	g_sAction = request.getParameter("act"); //E=Existing, N=New
	g_sAction= g_sAction!= null ? g_sAction: "";
	g_sID = request.getParameter("LoginID"); //M=individual, C=Corporate, D=Dealer
	g_sID= g_sID!= null ? g_sID: "";
	g_sFromUrl = request.getParameter("from_path")!=null?request.getParameter("from_path").toString():"";
	boolean bActReg = false;
	g_bActReg = false;
	
	if(g_sAction.compareToIgnoreCase("ActivateReg") == 0 && !g_sID.equals("")) {
		Decrypt en = new Decrypt();
		g_sID= en.fetchDecode(g_sID);
		if(!g_sID.equals("")) {
			bActReg = true;
			g_bActReg = true;
			//sAction="true";
		}
	}
	
	char acId[] = session.getId().toCharArray();
	int ncID = 0;
	if (ncID==0) {
		for (int i = 0; i < acId.length; ++i) {
			ncID += Character.getNumericValue(acId[i]);
		}
	}
%>
<script language='javascript' src='<%=g_sJSPath%>/LinkFuncMain.js'></script>
<SCRIPT language=javascript src="<%=g_sJSPath%>/popupWindow.js"></SCRIPT>
<style type="text/css">
.aLink {
	color: #660F0F;
	font: 11px/10px Lucida Sans Unicode,Lucida Grande,sans-serif;
	text-decoration: none;
}
.inputFields {
	color: #57461D;
	font: 11px/11px Tahoma,Lucida Sans Unicode,Lucida Grande,sans-serif BOLD;
}
.headerLogin {
	color: #671916;
	font: 12px/12px Lucida Sans Unicode,Lucida Grande,sans-serif BOLD;
	text-decoration: none;
}
.login_bg_image {
	background: url(<%=g_sImgPath%>/Login/MbrLogin.png) no-repeat scroll 0 transparent;
	font-size: 0;
	height: 205px;
	width: 205px;
	float:left;
	top:0px;
	left:0px;
	margin: 0px;
}

.tdTitle {
color:#790008;
font-family:Arial,Helvetica,sans-serif;
font-size:8pt;
font-weight:bold;
}
.tdBody {
color:#000000;
font-family:Arial,Helvetica,sans-serif;
font-size:11px;
font-weight:normal;
}
.tdRtSect{
color:#666666;
font-family:Arial,Helvetica,sans-serif;
font-size:11px;
font-weight:normal;
}
.aRtSect{
color:#666666;
font-family:Arial,Helvetica,sans-serif;
font-size:11px;
font-weight:normal;
}
</style>

<LINK rel=stylesheet type=text/css href="<%=g_sStylePath%>/itrade_style.css">
<link rel="stylesheet" href="<%=g_sPath%>/login/css/bootstrap-5.3.6.min.css" />
<link rel="stylesheet" href="<%=g_sPath%>/login/css/login.css" />
<link rel="stylesheet" href="<%=g_sPath%>/login/css/popup-modal-bootstrap5.css" />
<%
String vsBodyOnLoad = "body_onLoad(\"temp\")";
int vnWidth = 200;
vnWidth = 750;
int vnHeight = 180;
String vsAppBackup = oN2NSession.getSetting("AppBackupServer");
String vsLoginId = g_sLoginId;
boolean bIphone = false;
//System.out.println("*********************************** vsLoginId:"+vsLoginId);
try {
	int iTableWidth = 0;
	out.println("</head>"); 
	if (vsBodyOnLoad.length() > 0) {
		out.println("<body onload='javascript:" + vsBodyOnLoad + "'>");
	} else {
		out.println("<body>");
	}

    String sUserAgent = request.getHeader("User-Agent").toLowerCase();
	if(sUserAgent.indexOf("iphone")>0)
		bIphone = true;
%>
<table align="center" width="750" cellspacing="0" cellpadding="0" border="0">
<tr><td>&nbsp;</td></tr>
<tr><td>
	<table border=0 cellSpacing=0 cellPadding=0 width=750 align='center'>
    <tr><td style="font-family:Arial;text-align:center;font-size:12px;color:#666666" colspan=3>
</table>
<table border=0 cellPadding=0 cellSpacing=0 width='600' align=left>
<tr bgcolor="#FFCF01">
	<td width='203' style='background-image: url("/n2n_gc/img/Logo.png"); background-repeat: repeat-x;'><img src="<%=g_sImgPath%>/Logo.png"></td>
	<td width=237>&nbsp;</td>
	<td>&nbsp;</td>
</tr>

<tr bgcolor='#AAAAAA'>
	<td width='203' align='left' class="tdBody" style='color:#FFFFFF;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;USER LOGIN</td>
	<td colspan='2'>&nbsp;</td>
</tr>
<tr>
	<td colspan='3' align='center' style='padding:15px 0px 0px 0px'>
	<table border=0 cellpadding=0 cellspacing=0 width='75%'>
	<tr>
		<td width='80%'>
<%
	populatePopinLoginWindow();	
	sActionBan = genLoginBody(vsLoginId, g_validSession);
%>
</td></tr>
</table>
</td>
</tr>
    <tr>
		<td class="tdBody" colspan='3' align='center' style='padding:15px 0px 0px 0px;'><hr>Copyright &copy; 2012. PM Link 2 U. All rights reserved.</td>
	</tr>
</table>
</td></tr></table>

<%
} catch (java.io.IOException ioe) {
	ioe.printStackTrace();
}		
%>

<%!
String sLoginId = "", sTblWidth = "", sTickerWidth = "", sBgColor = "";
String g_sXmlUrl = "";
String g_sTickerType = "IndicesSummary";
String g_sPath = "";
String g_sImgPath = "";
String g_sJSPath = "";
String g_sStylePath = "";
String g_sWebPath = "";
String g_sHTMLRoot = "";
String g_sTitle = "";
String sActionBan = "";
String g_sWebBHName = "";
String g_sAction = "";
String g_sID = "";
String g_sFromUrl = "";
boolean g_bActReg = false;
boolean g_validSession = false;
SimpleDateFormat dfDate = new SimpleDateFormat("EEE, dd MMM yy");
JspWriter out = null;

public void populatePopinLoginWindow() {
	try {
		String sOutput = "";

		sOutput += "<div id='dwindow' style='position:absolute;background-color:#EBEBEB;cursor:pointer;left:250px;top:180px;display:none;' onMousedown='initializedrag(event)' onMouseup='stopdrag()' onSelectStart='return false'>\n";
		sOutput += "<div align='right' style='background-color:#0055E6' onMousedown='initializedrag(event)' onMouseup='stopdrag()' onSelectStart='return false'>\n";
		sOutput += "<table cellspacing='0' cellpadding='0' border='0' width='100%'>\n";
		sOutput += "<tr><td width='5'></td>\n";
		sOutput += "<td class='tdTitle'>" + g_sTitle + "</td>\n";
		sOutput += "<td align='right'>";
		sOutput += "<img src='" + g_sImgPath + "/ie_close.gif' onClick='closeit()'></td>\n";
		sOutput += "</tr></table></div>\n";
		sOutput += "<div id='dwindowcontent' style='height:100%'>\n";
		sOutput += "<iframe id='cframe' src='' width=100% height=100% border='0' frameBorder='1' style='border:4 solid #0000c6' scrolling='auto'></iframe>\n";
		sOutput += "</div></div>";
		
		out.println(sOutput);		
		out.println("			<script language='javascript'>");
		out.println("				function load(vsAction) {");
		out.println("					if (vsAction != null) {");
		out.println("						loadwindow('" + g_sPath + "/cliLogin.jsp?act=' + vsAction,205,175,300,180);");
		out.println("					} else {");
		out.println("						loadwindow('" + g_sPath + "/cliLogin.jsp',205,175,300,180);");
		out.println("					}");
		out.println("				}");
		out.println("				function resizeIFrame(vnWidth, vnHeight) {");
		out.println("					try {");
		out.println("					document.getElementById(\"dwindow\").style.height = vnHeight + \"px\";");
		out.println("					document.getElementById(\"dwindow\").style.width = vnWidth + \"px\";");
		out.println("					} catch(e) {alert(e);}");
		out.println("				}");
		out.println("			</script>");
	} catch (Exception ex) {
		System.err.println("populatePopinLoginWindow->" + ex.getMessage());
		ex.printStackTrace();			
	}
}

public void setCommonPath(String vsPath, String vsImgPath, String vsJSPath, String vsStylePath, String vsWebPath, String vsHTMLRoot, JspWriter voOut, String vsWebBHName) {
	g_sPath = vsPath;
	g_sImgPath = vsImgPath;
	g_sJSPath = vsJSPath;
	g_sStylePath = vsStylePath;
	g_sWebPath = vsWebPath;
	g_sHTMLRoot = vsHTMLRoot;
	g_sWebBHName = vsWebBHName;
	out = voOut;
}

public String genLoginBody(String vsLoginId1, boolean validSess)	{
	try {				
		out.println("<form id=frmLogin name=frmLogin method='post' onSubmit=\"return frmSubmit(document.frmLogin,'EN');\">");		
		out.println("	<table border=0 cellPadding=0 cellSpacing=0 width='90%' align=left>");	
		out.println("		<tr height='15'>");
		out.println("			<td class='tdBody' valign='middle'>&nbsp;&nbsp;User ID</td>");
		out.println("			<td align='left' valign='middle' colspan='3'><input class='tdBody' id=txtLoginID name=txtLoginID value='"+(g_bActReg?g_sID:"")+"' maxlength=15 size=15 autocomplete=off onclick=\"javascript:document.getElementById('txtLoginID').select();\" style='width:110'/></td>");
		out.println("       </tr>");
		out.println("     	<tr height=30>");
		out.println("			<td class='tdBody' valign='middle'>&nbsp;&nbsp;Password</td>");
		out.println("			<td valign='middle' align=left><input class='tdBody' id=txtLoginPwd name=txtLoginPwd type=password value='' maxlength=20 size=15 autocomplete=off onclick=\"javascript:document.getElementById('txtLoginPwd').select();\" onkeypress=\"return EntSub();\" style='width:110' />");
		out.println("				<input type=hidden id=loginID name=loginID />");
		out.println("				<input type=hidden id=pwd name=pwd />");
		out.println("       	<td width='13'>&nbsp;</td>");
		out.println("			<td rowspan='3' style='font-size:8pt; color:#000000; padding:20px 10px 20px 10px;' bgcolor='#F0F0F0'><label id='optionlabel' name='optionlabel'>E.g. Ipad, Samsung Galaxy Tab, Droid Pad, etc.</label></td>");
		out.println("       </tr>");
		out.println("       <tr height=32>");
		out.println("            <td width='20%' class=tdBody valign='top'>&nbsp;&nbsp;Platform</td>");
		out.println("            <td valign='top'>");
		out.println("			 	<select name='selectOption' id='selectOption' class='tdBody' style='width:110;height:22' onchange='platformChange()'>");
//		out.println("					<option value=smartphone>Smartphone</option>");
		out.println("					<option value=tablet>Tablet</option>");	
		out.println("				</select></td><td><img src='"+g_sImgPath+"/triangle.gif'></td></tr>");
		out.println("		<tr height=20>");
		out.println("			<td colspan='3'><input type=submit class='tdBody' value='Login Now' style='width:90'/><input type=reset class='tdBody' value='Reset' style='width:90'/></td>");
		out.println("		</tr>");
		out.println("       <tr height=20>");
		//out.println("            <td class=tdBody colspan='5' style='padding:15px 0px 0px 0px;' align='left'><img src='"+g_sImgPath+"/icon01.gif'>&nbsp;&nbsp;&nbsp;<a href='javascript:cliForgetPwd_parent();' class='aRtSect'>Click Here</a> if you have forgotten your password</td>");
		out.println("            <td class=tdBody colspan='5' style='padding:15px 0px 0px 0px;' align='left'><img src='"+g_sImgPath+"/icon01.gif'>&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' class='openModalBtn aRtSect' data-type='fgtPin'>Click Here</a> if you have forgotten your password</td>");
		out.println("       </tr>");
		out.println("	</table>");
		out.println("</form>");
	
		return sActionBan;	
	} catch (Exception ex) {
		System.err.println("genLoginBody->" + ex.getMessage());
		//ex.printStackTrace();	
		return null;		
	}
}
%>
<%
String errMsg = "";
if (session!=null) {
	if (session.getAttribute("errMsg")!=null&&!session.getAttribute("errMsg").equals("")) {
		errMsg = session.getAttribute("errMsg").toString();
		oN2NSession.setLogoutStatus(1);
		session.invalidate();
  	} 
}
%>

<SCRIPT language=javascript src="<%=g_sJSPath%>/main.js"></SCRIPT>
<script language='JavaScript' src='<%=g_sJSPath%>/LinkFunc.js'></script>
<script language=JavaScript>
	var agent = navigator.userAgent.toLowerCase();
	
	if(agent.indexOf("ipad") != -1 || agent.indexOf("android") != -1 || agent.indexOf("blackberry") != -1) {
		// do nothing
	} else if(agent.indexOf("iphone") != -1) {
		window.location.href = "<%=oN2NSession.getSetting("HTMLRoot")%>/smartphone/";
	} else {
		window.location.href = "<%=oN2NSession.getSetting("HTMLRoot")%>/";
	}
	<%
		if (sRsrch.compareToIgnoreCase("research") == 0) {
	%>
		document.getElementById("selectOption").options[1].selected = "selected";
	<%
		} else if (sRsrch.equals("")) { 
	%>
		document.getElementById("selectOption").options[0].selected = "selected";
	<%
		}
	%>
	
function body_onLoad(temp) {
//	GetFromCookie();
	
	<%if (!errMsg.equals("")) {%>
	alert("<%=errMsg.trim()%>");
	<%}%>
	
	
//	var selectOption = document.getElementById("selectOption");
//	if(!<%=bIphone%>)
//		selectOption.selectedIndex = "1";
        platformChange();
}

function EntSub() 
{
	//if (window.event && window.event.keyCode == 252) {
    	//frmSubmit(document.frmLogin,'EN');
  	//} else {
//    	return true;
    //}
}

function cliForgotPwd_parent() {
	window.open('<%=oN2NSession.getSetting("HTMLRootSecure") + g_sPath%>/cliForgetPwd.jsp?secure=Y','winRegSuccess','left=310,top=225,width=415,height=225,resizable=yes,status=yes',false);
}

function frmSubmit(voFrm, vsLang) 
{
alert("Here")	;
var actPath;
var from_path_url = "<%="/"+sRsrch+".jsp"%>";
	if (entryVerify(voFrm, vsLang)) {
		if (m_nSubmitCount ==0) {
			m_nSubmitCount++;
			var dtNow = new Date();
			
			var mySel = voFrm.selectOption;				
			actPath = mySel.options[mySel.selectedIndex].value;
			
			if (actPath=="eng_hall") {
				from_path_url = "en_trad_hall";
			} else if (actPath=="chi_hall") {
				from_path_url = "zh_trad_hall";
//			} else if (actPath=="smartphone") {
//				from_path_url = "/imsl/main.jsp";
				actPath = "default";
			} else if (actPath=="tablet") {
				from_path_url = "/tclite/index.jsp";
				actPath = "default";
			}

			voFrm.action="<%=oN2NSession.getSetting("HTMLRootSecure") + g_sPath%>/loginATP?md=1&t="+ dtNow.getTime()+"&actPath="+actPath+"&from_path="+from_path_url+"&frmpath=lite&acts=<%=g_sAction%>";
alert(voFrm.action);
		} else {
			alert("Your request has been submitted. Please wait...");
			return false;
		}
	}else {
		return false;
	}
}

function entryVerify(voFrm, vsLang) {
	var oField = new Array("txtLoginID", "txtLoginPwd");
	if (voFrm != null) {

		var sLoginID = voFrm.txtLoginID.value;

		for (var nField=0; nField < oField.length; ++nField) {
			oField[nField] = voFrm.elements[oField[nField]].value;
		}
		
		if (checkRequiredFields(oField)) {
			var isPwdReset="N", sPwd
			sPwd = oField[1];	
			var nID=<%=ncID%>;
			return true;
		}
	}
 	return false;
}

var m_nSubmitCount = new Number(0);
function checkRequiredFields(oField) {
	var fieldNames = new Array("User ID", "Password");
	var fieldCheck   = true;
	var fieldsNeeded = "\nA value must be entered in the following field(s):\n\n\t";

	for(var nField=0; nField < fieldNames.length; ++nField) {
		if (JStrim(oField[nField]) == "" || JStrim(oField[nField]) == "User Name" || JStrim(oField[nField]) == "Password") {
			fieldsNeeded += fieldNames[nField] + "\n\t";
			fieldCheck = false;
		}
	}

	if (!fieldCheck) {
		// SOME REQUIRED FIELDS ARE MISSING VALUES
		alert(fieldsNeeded);
	}
	return fieldCheck;
}

function encryptField() {	
	var nID = <%=String.valueOf(ncID) %>;
	var loginid = document.frmLogin.txtLoginID.value;
	var pwd = document.frmLogin.txtLoginPwd.value;
	
//	document.frmLogin.txtLoginID.value = escape(JSencrypt(loginid, nID));
//	document.frmLogin.txtLoginPwd.value = escape(JSencrypt(pwd, nID));	
	
	return true;
}

function cliForgetPwd_parent(){
	window.open('/gcPM/cliForgetPwd.jsp?secure=Y','winRegSuccess','left=310,top=225,width=415,height=225,resizable=yes,status=yes',false);
}

function platformChange(){
	var smartphone = "E.g. Iphone, Samsung Galaxy S, HTC Desire, Sony Ericsson Xperia Arc, HTC7 Mozart, LG Optimus 7, etc.";
	var tablet = "E.g. Ipad, Samsung Galaxy Tab, Droid Pad, etc.";
	if(document.frmLogin.selectOption[document.frmLogin.selectOption.selectedIndex].value == "tablet"){
		document.getElementById("optionlabel").innerHTML = tablet;
	}else{
		document.getElementById("optionlabel").innerHTML = smartphone;
	}
} 
</script>
<!-- needed for login modal -->
<script src="<%=g_sPath%>/login/js/bootstrap-5.3.6.bundle.min.js"></script>
<!-- needed for login modal -->
<script src="<%=g_sPath%>/login/passport-login-bc.jsp"></script>
<script src="<%=g_sPath%>/login/js/login-popup-bootstrap5.js"></script>
</body>
</html>
