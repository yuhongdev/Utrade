<%@ page import = "java.text.SimpleDateFormat,java.util.Vector, java.util.Calendar, java.util.Date, com.n2n.util.StringTokenizerEx" %>
<%@ page import = "com.spp.util.security.Decrypt" %>
<%@ include file= '/common.jsp'%>
<%@ include file= '/util/sessionCheck.jsp'%>
<%!
String sLoginId = "", sTblWidth = "", sTickerWidth = "", sBgColor = "";
String g_sPath = "";
String g_sImgPath = "";
String root_url = "";
String g_sJSPath = "";
String g_sStylePath = "";
String g_sWebPath = "";
String g_sHTMLRoot = "";
String g_sTitle = "";
String sActionBan = "";
String g_sWebBHName = "";
String g_sFromUrl = "";
	
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
		out.println("						loadwindow('" + g_sPath + "/cliLoginV.jsp?act=' + vsAction,205,175,300,180);");
		out.println("					} else {");
		out.println("						loadwindow('" + g_sPath + "/cliLoginV.jsp',205,175,300,180);");
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

public void setCommonPath(String vsPath, String vsImgPath, String vsJSPath, String vsStylePath, String vsWebPath, String vsHTMLRoot, JspWriter voOut, String vsWebBHName, String vsRoot_url) {
	g_sPath = vsPath;
	g_sImgPath = vsImgPath;
	g_sJSPath = vsJSPath;
	g_sStylePath = vsStylePath;
	g_sWebPath = vsWebPath;
	g_sHTMLRoot = vsHTMLRoot;
	g_sWebBHName = vsWebBHName;
	root_url = vsRoot_url;
	out = voOut;
}

public String genLoginBody(String vsLoginId, boolean vbValidSession) {
	if (vsLoginId.equals("Guest"))
		vsLoginId = "";

	try {
		if(!vbValidSession) {
			out.println("<form id=frmLogin name=frmLogin method='post' style='margin:0px;' onSubmit='return frmSubmit(document.frmLogin);'>");
			out.println("	<table height='153' cellspacing='0' style='color:#828282;background:transparent;text-decoration:none;font-size:11px;font-family:Arial;font-weight:bold;' align='center' >");
			out.println("		<tr>");
			out.println("			<td align='center'>USER NAME : </td>");
			out.println("			<td>");			
			out.println("				<input class='username' id='txtLoginID' name='txtLoginID' maxlength='15' size='15' autocomplete='off' type='text' value='' onclick=\"if(this.value=='USER NAME'){this.value='';}\"/>");
			out.println("			<td>");	
			out.println("		</tr>");
			out.println("		<tr>");			
			out.println("			<td align='center'>PASSWORD : </td>");
			out.println("			<td>");
			out.println("				<input class='password' id='txtLoginPwd' name='txtLoginPwd' type='password' maxlength='20' size='15' autocomplete='off' value='' onfocus='this.onclick();' onclick=\"if(this.value=='PASSWORD'){this.value='';}else{document.getElementById('txtLoginPwd').select();}\"/>");
			out.println("			</td>");
			out.println("		</tr>");	
			out.println("		<tr>");	
			out.println("			<td align='center'>");
			out.println("				<input checked='checked' id='defPageRadio' name='defPageRadio' type='hidden' value='eng_hall'/>");
			out.println("				<input id='defPageRadio' name='defPageRadio' type='hidden' value='chinese_hall'/>");			
			out.println("				<input style='vertical-align:middle;width:73px;height:25px;cursor:pointer;margin:0;padding:0 3px;' src='"+g_sImgPath+"/submit_EN.jpg' id='login' name='login' type='image' value=''/>");
			//class=\"goBtn\" onMouseOver=\"btnSwapBg('over')\" onMouseOut=\"btnSwapBg('out')\"
			out.println("			</td>");
			out.println("			<td align='center'>");
			//out.println("				<a href='#' name='LinkFgPwd' style='cursor:pointer;text-decoration:none;' onclick='cliForgotPwd_parent();'>&nbsp;Forgot Password&nbsp;</a></div>");
			out.println("				<a href='javascript:void(0);' class='openModalBtn' data-type='fgtPin' name='LinkFgPwd' style='cursor:pointer;text-decoration:none;'>&nbsp;Forgot Password&nbsp;</a></div>");
			out.println("			</td>");
			out.println("		</tr>");
			out.println("	</table>");
			out.println("</form>");
			return sActionBan;
		}else{
			out.println("<form id=frmLogin name=frmLogin method='post' style='margin:0px;' onSubmit='return frmSubmit(document.frmLogin);'>");
			out.println("	<table height='51' style='color:#828282;background:transparent;text-decoration:none;font-size:11px;font-family:Arial;font-weight:bold;' align='center'>");
			out.println("		<tr>");
			out.println("			<td>");
			out.println("				&nbsp;Welcome " + vsLoginId + " ");
			out.println("			</td>");
			out.println("		</tr>");
			out.println("		<tr>");
			out.println("			<td>");
			out.println("				<a href='/gcUTRADEPlus/tclite/index.jsp?lang=en' style='cursor:pointer;font-size:11px;font-family:Arial;font-weight:bold;color:#828282;text-decoration:none;' target='_parent'>&nbsp;TCLite&nbsp;</a>");
			out.println("			</td>");
			out.println("		</tr>");
			out.println("		<tr>");			
			out.println("			<td align='center'>");
			//out.println("				<a href='#' style='cursor:pointer;font-size:11px;font-family:Arial;font-weight:bold;color:#828282;text-decoration:none;' onclick='javascript:OpenWinCliChgPwd(\"/gcUTRADEPlus/cliChgPasswd.jsp\");'>&nbsp;Change Password&nbsp;</a>");
			out.println("				<a href='javascript:void(0);' class='openModalBtn' data-type='chgPwd' style='cursor:pointer;font-size:11px;font-family:Arial;font-weight:bold;color:#828282;text-decoration:none;'>&nbsp;Change Password&nbsp;</a>");
			out.println("			</td>");
			out.println("		</tr>");
			out.println("		<tr>");		
			out.println("			<td>");
			//out.println("				<a href='#' style='cursor:pointer;font-size:11px;font-family:Arial;font-weight:bold;color:#828282;text-decoration:none;' onclick='javascript:OpenWinCliForgetPwd(\"/gcUTRADEPlus/cliForgetPwd.jsp?secure=Y\");'>&nbsp;Forgot Password&nbsp;</a>");
			out.println("				<a href='javascript:void(0);' class='openModalBtn' data-type='fgtPin' style='cursor:pointer;font-size:11px;font-family:Arial;font-weight:bold;color:#828282;text-decoration:none;'>&nbsp;Forgot Password&nbsp;</a>");
			out.println("			</td>");
			out.println("		</tr>");
			out.println("		<tr>");			
			out.println("			<td>");
			//out.println("				<a href='#' style='cursor:pointer;font-size:11px;font-family:Arial;font-weight:bold;color:#828282;text-decoration:none;' onclick='javascript:OpenWinCliChgPIN(\"/gcUTRADEPlus/cliChgPIN.jsp\");'>&nbsp;Change PIN&nbsp;</a>");
			out.println("				<a href='javascript:void(0);' class='openModalBtn' data-type='chgPin' style='cursor:pointer;font-size:11px;font-family:Arial;font-weight:bold;color:#828282;text-decoration:none;'>&nbsp;Change PIN&nbsp;</a>");
			out.println("			</td>");	
			out.println("		</tr>");
			out.println("		<tr>");
			out.println("			<td>");
			//out.println("				<a href='#' style='cursor:pointer;font-size:11px;font-family:Arial;font-weight:bold;color:#828282;text-decoration:none;' onclick='javascript:OpenWinCliForgetPIN(\"/gcUTRADEPlus/cliForgetPIN.jsp\");'>&nbsp;Forgot PIN&nbsp;</a>");
			out.println("				<a href='javascript:void(0);' class='openModalBtn' data-type='fgtPin' style='cursor:pointer;font-size:11px;font-family:Arial;font-weight:bold;color:#828282;text-decoration:none;'>&nbsp;Forgot PIN&nbsp;</a>");
			out.println("			</td>");
			out.println("		</tr>");
			out.println("		<tr>");
			out.println("			<td>");
			out.println("				<a href='/gcUTRADEPlus/loginATP?action=logout&frmpath=lite&frm=rt' style='cursor:pointer;font-size:11px;font-family:Arial;font-weight:bold;color:#828282;text-decoration:none;' target='_parent'>&nbsp;Sign Out&nbsp;</a>");
			out.println("			</td>");
			out.println("		</tr>");
			out.println("	</table>");
			out.println("</form>");
//<!--<a onclick='cliAccInfo_parent();' style='cursor:pointer;font-size:11px;font-family:Arial;font-weight:bold;color:#828282;'>-->		<!--</a>-->	/gcUTRADEPlus/cliChgPIN.jsp
//cliChgPwd_parent();			
//gcUTRADEPlus/loginATP?action=logout&frmpath=lite&frm=rt	
//gcUTRADEPlus/loginATP?action=logout&frmpath=/cliLoginV.jsp&frm=rt		
			return sActionBan;
		}
	} catch (Exception ex) {
		System.err.println("genLoginBody->" + ex.getMessage());
		//ex.printStackTrace();	
		return null;		
	}
}
%>

<%

	boolean g_validSession=validSession;
	String g_sAction = "";
	String g_sID = "";
	boolean g_bActReg = false;

	char aSID[] = session.getId().toCharArray();
	int nSID = 0;
	for (int i = 0; i < aSID.length; ++i) {
		nSID += Character.getNumericValue(aSID[i]);
	}

	String errMsg="", sURLRedirect="";
	if (session!=null) {
		if (session.getAttribute("errMsg")!=null && !session.getAttribute("errMsg").equals("")) {
			errMsg = session.getAttribute("errMsg").toString().trim();
			session.setAttribute("errMsg", "");
		} 
	}

	g_sAction = request.getParameter("act"); //E=Existing, N=New
	if (g_sAction == null) g_sAction = "";

	g_sID = request.getParameter("LoginID"); //M=individual, C=Corporate, D=Dealer
	if (g_sID == null) g_sID = "";

	g_bActReg = false;
	if (g_sAction.compareToIgnoreCase("ActivateReg") == 0 && !g_sID.equals("")) {
		Decrypt en = new Decrypt();
		g_sID = en.fetchDecode(g_sID);
		if (!g_sID.equals("")) {
			g_bActReg = true;
		}
	}
	if (!g_bActReg)
		g_sID = "";

	boolean bInvalidateSession = true;
	if (session.getAttribute("uuid")!=null) {
		if (!session.getAttribute("uuid").equals("")) {
			bInvalidateSession = false;
		}
	}


	if (sURLRedirect.length() > 0 && bInvalidateSession) {
%>
<script language=JavaScript>
<%
		out.println("window.location.href = \""+ sURLRedirect +"\";");
%>
</script>
<%
	} else {

	
	setCommonPath(g_sPath, g_sImgPath, g_sJSPath, g_sStylePath, g_sWebPath, oN2NSession.getSetting("HTMLRootSecure"),out, oN2NSession.getSetting("WebBHName"), root_url);

	String vsTitle = oN2NSession.getSetting("WebSiteName");
	g_sTitle = vsTitle;
	out.println("<html>");
	out.println("<head>");
	out.println("<title>" + vsTitle + "</title>");
	g_sFromUrl = request.getParameter("from_path")!=null?request.getParameter("from_path").toString():"";

%>
<SCRIPT language=javascript src="<%=g_sJSPath%>/popupWindow.js"></SCRIPT>
<link rel="stylesheet" href="<%=g_sPath%>/login/css/bootstrap-5.3.6.min.css" />
<link rel="stylesheet" href="<%=g_sPath%>/login/css/login.css" />
<link rel="stylesheet" href="<%=g_sPath%>/login/css/popup-modal-bootstrap5.css" />
<style type="text/css">

</style>

<%
String vsBodyOnLoad = "body_onLoad(\""+ errMsg +"\")";
int vnWidth = 200;
vnWidth = 750;
int vnHeight = 180;
String vsAppBackup = oN2NSession.getSetting("AppBackupServer");
String vsLoginId = g_sLoginId;
//System.out.println("*********************************** vsLoginId:"+vsLoginId);
try {
	int iTableWidth = 0;
	out.println("</head>"); 
	if (vsBodyOnLoad.length() > 0) {
		out.println("<body style='margin:0px;' onload='javascript:" + vsBodyOnLoad + "'>");
	} else {
		out.println("<body style='margin:0px;' >");
	}
%>
	<table border="0" cellSpacing="0" cellPadding="0" width="100%" align="left">    
    <tr><td style="font-family:Arial;text-align:center;font-size:12px;color:#666666" colspan="3">
<%
	populatePopinLoginWindow();
	if(g_validSession){
		//LOGIN SUCESS
	}
	sActionBan = genLoginBody(vsLoginId, g_validSession);
%>
	</td></tr>

</table>
<%
} catch (java.io.IOException ioe) {
	ioe.printStackTrace();
}		

%>
<SCRIPT language=javascript src="<%=g_sJSPath%>/main.js"></SCRIPT>
<script language='JavaScript' src='<%=g_sJSPath%>/LinkFunc.js'></script>
<script language=JavaScript>
function body_onLoad(vsMsg) {
	if (vsMsg != "") {
		alert(vsMsg);
	}
}

function btnSwapBg(type){
	if (type == "over")
		document.getElementById("login").style.backgroundImage = "url('<%=g_sImgPath%>/Login/login_btn_go_ov.jpg');";
	else
		document.getElementById("login").style.backgroundImage = "url('<%=g_sImgPath%>/Login/login_btn_go.jpg');";
}

var m_nSubmitCount = new Number(0);

function frmSubmit(voFrm, vsLang) 
{	
	var actPath, sExchg, fromPath;
	var option, radioObj;

	if (entryVerify(voFrm, vsLang)) {
		if (m_nSubmitCount ==0) {
			m_nSubmitCount++;
			var dtNow = new Date();

			actPath ="default";
			fromPath = "/cliLoginV.jsp";
			radioObj = document.getElementsByName("defPageRadio");
			if(radioObj[0].checked) {
				option = radioObj[0].value;
			} else if(radioObj[1].checked) {
				option = radioObj[1].value;
			} else {
				option = radioObj[1].value;
			}
			
			if(option=="eng_hall") {
				actPath = option;
				fromPath="en_trading_hall";
			}

			if(option=="chi_hall") {
				actPath = option;
				fromPath="zh_trading_hall";
			}

			<%
			if (sActionBan!=null && sActionBan.length() == 0) {
				out.println("voFrm.action=\"/gcUTRADEPlus/loginATP?md=1&t=\"+ dtNow.getTime() +\"&actPath=tclite/index.jsp&isSec=Y&from_path=lite&acts=\";");
			} else {
				out.println("voFrm.action=\"/gcUTRADEPlus/loginATP?md=1&t=\"+ dtNow.getTime() +\"&actPath=tclite/index.jsp&isSec=Y&from_path=lite&acts=\";");
			}
			%>
			return true;
		} else {
			alert("Your request has been submitted. Please wait...");
		}
	}

	return false;
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
			return true;
		}
	}
 	return false;
}

function checkRequiredFields(oField) {
	var fieldNames = new Array("User ID", "Password");
	var fieldCheck   = true;
	var fieldsNeeded = "\nA value must be entered in the following field(s):\n\n\t";

	for(var nField=0; nField < fieldNames.length; ++nField) {
		if (JStrim(oField[nField]) == "" || JStrim(oField[nField]) == "USERNAME" || JStrim(oField[nField]) == "PASSWORD") {
			fieldsNeeded += fieldNames[nField] + "\n\t";
			fieldCheck = false;
		}
	}

	if (!fieldCheck) {
		alert(fieldsNeeded);
	}
	return fieldCheck;
}

function encryptField() {	
	var nSID = <%=String.valueOf(nSID) %>;
	var sLoginID = document.frmLogin.txtLoginID.value;
	var sPwd = document.frmLogin.txtLoginPwd.value;
	return true;
}

function openWinWithPF(vsURL, vsWin, vsStyle, vbRplWin) {
	vsURL = "<%=g_sPath%>"+ vsURL;

	if (vsWin == "") {
		window.open(vsURL);
	} else {
		window.open(vsURL, vsWin, vsStyle, vbRplWin);
	}
}

function cliForgotPwd_parent() {
	openWinWithPF("/cliForgetPwd.jsp?secure=Y", "winRegSuccess", "left=310,top=225,width=415,height=225,resizable=yes,status=yes", false);
}

function cliNew_Reg() {
        openWinWithPF("/signUp.jsp", "", "", false);
}

function cliNew_RegForm() {
        openWinWithPF("/doc/application form and T&C.pdf", "", "", false);
}

function cliChgPwd_parent(voFrm) {
<% if (g_bActReg) {%>
	alert("Please login to access this page.");
<% } else { %>
	openWinWithPF("/cliChgPasswd.jsp?act=chgPwd", "winRegSuccess", "left=310,top=225,width=380,height=400,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes", false);
<% } %>
}

function cliChgPIN_parent(voFrm) {
<% if (g_bActReg) {%>
	alert("Please login to access this page.");
<% } else { %>
	openWinWithPF("/cliChgPIN.jsp?secure=N", "winRegSuccess", "left=310,top=225,width=303,height=210,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes", false);
<% } %>
}

function cliForgotPIN_parent(voFrm) {
<% if (g_bActReg) {%>
	alert("Please login to access this page.");
<% } else { %>
	openWinWithPF("/cliForgetPIN.jsp?secure=Y", "winRegSuccess", "left=310,top=225,width=410,height=220,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes", false);
<% } %>
}

function cliAccInfo_parent(voFrm) {
<% if (g_bActReg) {%>
	alert("Please login to access this page.");
<% } else { %>
	openWinWithPF("/acctInformation.jsp?secure=Y", "winRegSuccess", "left=310,top=225,width=800,height=220,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes", false);
<% } %>
}

function OpenWinCliReg()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 960) /2
	nTop = (scrHeight - 700) /2
	window.open('cliTermCond.jsp', 'winCliReg', 'left='+ nLeft +',top='+ nTop +',width=960,height=700,location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes', false);
}
</script>
<!-- needed for login modal -->
<script src="<%=g_sPath%>/login/js/bootstrap-5.3.6.bundle.min.js"></script>
<!-- needed for login modal -->
<script src="<%=g_sPath%>/login/passport-login-bc.jsp"></script>
<script src="<%=g_sPath%>/login/js/login-popup-bootstrap5.js"></script>
</body>
</html>
<%
} 
%>
