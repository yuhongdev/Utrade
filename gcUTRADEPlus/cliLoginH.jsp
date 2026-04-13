<%@ page import = "java.text.SimpleDateFormat,java.util.Vector, java.util.Calendar, com.n2n.util.StringTokenizerEx" %>
<%@ page import = "com.spp.util.security.Decrypt" %>
<%@ include file= 'common.jsp'%>
<%@ include file= '/util/sessionCheck-tclite.jsp'%>

<%

//	oN2NSession.N2NCheckMinSecLevel(request,response,2);
if (session.getAttribute("uuid")!=null) {
	if (!session.getAttribute("uuid").equals("")) {
		validSession = false;
	}
}
g_validSession = validSession;

	String sRsrch = request.getParameter("dp");
	sRsrch = sRsrch != null ? sRsrch : "";
	if(g_validSession){
		response.sendRedirect(oN2NSession.getSetting("HTMLRoot") + "/gcUTRADEPlus/tclite/index.jsp?lang=en&t="+new java.util.Date().getTime());
	}
	setCommonPath(g_sPath, g_sImgPath, g_sJSPath, g_sStylePath, g_sWebPath, oN2NSession.getSetting("HTMLRootSecure"),out, oN2NSession.getSetting("WebBHName"));

	String vsTitle = oN2NSession.getSetting("WebSiteName");
	g_sTitle = vsTitle;
	out.println("<html>");
	out.println("<head>");

	out.println("<title>" + vsTitle + "</title>");
        // Added for the Activate Registration

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
<script language='JavaScript' src='<%=g_sJSPath%>/LinkFunc.js'></script>
<SCRIPT language=javascript src="<%=g_sJSPath%>/popupWindow.js"></SCRIPT>
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
try {
	int iTableWidth = 0;
	out.println("</head>");
	if (vsBodyOnLoad.length() > 0) {
		out.println("<body onload='javascript:" + vsBodyOnLoad + "'>");
	} else {
		out.println("<body>");
	}
	populatePopinLoginWindow();
	sActionBan = genLoginBody(vsLoginId, g_validSession);
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
		out.println("						loadwindow('" + g_sPath + "/cliLoginH.jsp?act=' + vsAction,205,175,300,180);");
		out.println("					} else {");
		out.println("						loadwindow('" + g_sPath + "/cliLoginH.jsp',205,175,300,180);");
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
	if(!validSess) {

		out.println(" <form id=frmLogin name=frmLogin method='post' onSubmit='return frmSubmit(document.frmLogin,\"EN\");'>");
		//Start Login
		out.println("	<table bgcolor='transparent'  border=0 cellpadding=0 cellspacing=0 width='100%' height='51' style='font-family:Arial;font-size:12px;'>");
		out.println("	   <tr><td width='10%'>&nbsp;</td>");
		out.println("		<td  valign='middle' align=left width='20%'>");
		out.println("			Username : <input id=txtLoginID name=txtLoginID value='"+(g_bActReg?g_sID:"")+"' maxlength=15 size=15 autocomplete=off onclick=\"javascript:document.getElementById('txtLoginID').select();\"/>");
		out.println("		</td>");
		out.println("		<td valign='middle' align=left width='20%'>");
		out.println("			Password : <input id=txtLoginPwd name=txtLoginPwd type=password value='' maxlength=15 size=15 autocomplete=off onclick=\"javascript:document.getElementById('txtLoginPwd').select();\" />");
		out.println("		</td>");
		out.println("            <td width='10%'>");
		out.println("			<select name='selectOption' id='selectOption' class='tdBody' style=''>");
		out.println("				<option value=tclite>Lite</option>");
		out.println("			</select>");
		out.println("		<td width='15%'>");
		out.println("			<input type=submit value='Submit'/>");
		out.println("		</td>");
		out.println("           <td width='15%'>");
		//out.println("      		<a href='javascript:cliForgotPwd_parent()' class='left_content_font' style='text-decoration:none;'>Forgot your password?</a></td>");
		out.println("      		<a href='javascript:void(0);' class='openModalBtn left_content_font' data-type='fgtPin' style='text-decoration:none;'>Forgot your password?</a></td>");
		out.println("           <td width='10%'>&nbsp;</td></tr>");
		out.println("   </table>");
		//End Login

		out.println("</form>");

		return sActionBan;
		} else {

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
String errMsg = "";
if (session!=null) {
  if (session.getAttribute("errMsg")!=null&&!session.getAttribute("errMsg").equals("")) {
	errMsg = session.getAttribute("errMsg").toString();
	oN2NSession.setLogoutStatus(1);
	session.invalidate();
  }
}
//String errMsg = session.getAttribute("errMsg")!=null&&!session.getAttribute("errMsg").equals("")?session.getAttribute("errMsg").toString():"";
%>
<SCRIPT language=javascript src="<%=g_sJSPath%>/main.js"></SCRIPT>
<script language='JavaScript' src='<%=g_sJSPath%>/LinkFunc.js'></script>
<script language=JavaScript>
	<%
		if (sRsrch.compareToIgnoreCase("research") == 0) {
	%>
		document.getElementById("selectOption").options[4].selected = "selected";
	<%
		}
	%>
function body_onLoad(temp) {
//	GetFromCookie();
/*
	if(sRanking.length > 0) {
		var aRanking = sRanking.split("|");
		document.getElementById("rankDt").innerHTML = aRanking[0];
		document.getElementById("rank1").innerHTML = aRanking[1];
		document.getElementById("rank2").innerHTML = aRanking[2];
		document.getElementById("rank3").innerHTML = aRanking[3];
		document.getElementById("rank4").innerHTML = aRanking[4];
		document.getElementById("rank5").innerHTML = aRanking[5];
		document.getElementById("rank6").innerHTML = aRanking[6];
		document.getElementById("rank7").innerHTML = aRanking[7];
		document.getElementById("rank8").innerHTML = aRanking[8];
		document.getElementById("rank9").innerHTML = aRanking[9];
		document.getElementById("rank10").innerHTML = aRanking[10];
	}
*/
	<%if (!errMsg.equals("")) {%>
	alert("<%=errMsg.trim()%>");
	<%}%>
}

function cliForgotPwd_parent() {
	window.open('<%=oN2NSession.getSetting("HTMLRootSecure") + g_sPath%>/cliForgetPwd.jsp?secure=Y','winRegSuccess','left=310,top=225,width=415,height=225,resizable=yes,status=yes',false);
}

function frmSubmit(voFrm, vsLang)
{
var actPath;
var from_path_url;
	if (entryVerify(voFrm, vsLang)) {
		if (m_nSubmitCount ==0) {
			m_nSubmitCount++;
			var dtNow = new Date();

			var mySel = voFrm.selectOption;
			actPath = mySel.options[mySel.selectedIndex].value;
//			alert(actPath);
			if (actPath=="tclite") {
				from_path_url = "/tclite/index.jsp"+"?t="+dtNow.getTime()+dtNow.getTime();
				actPath = "default";
			} else {
				from_path_url = "/tclite/index.jsp"+"?t="+dtNow.getTime()+dtNow.getTime();
				actPath = "default";
			}

			<%if (sActionBan!=null && sActionBan.length() == 0) {%>
				voFrm.action="<%=oN2NSession.getSetting("HTMLRootSecure") + g_sPath%>/loginATP?t="+ dtNow.getTime()+"&actPath="+actPath+"&from_path="+from_path_url+"&frmpath=lite&acts=<%=g_sAction%>";
			<%} else {%>
				voFrm.action="<%=oN2NSession.getSetting("HTMLRootSecure") + g_sPath%>/loginATP?t="+ dtNow.getTime()+"&act=<%=sActionBan%>"+"&actPath="+actPath+"&from_path="+from_path_url+"&frmpath=lite&acts=<%=g_sAction%>";
			<%}%>
//			storeInSession();
//			voFrm.submit();
			return true;
		} else {
			//alert("Attemp submit form twice");
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

		for (var nField=0; nField < oField.length; ++nField) {
			oField[nField] = voFrm.elements[oField[nField]].value;
//			alert(oField+":nField:"+nField+":"+oField[nField]);
		}



		if (checkRequiredFields(oField)) {
			var isPwdReset="N", sPwd
			sPwd = oField[1];

			//do not send login and pwd field (send the hidden field)
//			voFrm.txtLoginID.disabled = true;
//			voFrm.txtLoginPwd.disabled = true;
			//prepare to be sent over
//			var nID=<=ncID >;
//			nID = 165;
//			voFrm.txtLoginID.value = escape(JSencrypt(oField[0], nID));
//			voFrm.txtLoginPwd.value = escape(JSencrypt(oField[1], nID));
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

function cliNew_Reg() {
        window.open("<%=g_sPath%>/signUp.jsp");
}

function cliNew_RegForm() {
        window.open("<%=g_sPath%>/doc/application form and T&C.pdf");
}

function cliChgPwd_parent(voFrm) {
	<%if(bActReg){%>
	alert('Please login to access this page.');
	<% }else{ %>
	window.open('<%=g_sPath%>/cliChgPasswd.jsp?act=chgPwd','winRegSuccess','left=310,top=225,width=380,height=400,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes',false);
	<% } %>
}

function cliChgPIN_parent(voFrm) {
	<%if(bActReg){%>
	alert('Please login to access this page.');
	<% }else{ %>
	window.open('<%=g_sPath%>/cliChgPIN.jsp?secure=N','winRegSuccess','left=310,top=225,width=325,height=255,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes',false);
	<% } %>
}

function cliForgotPIN_parent(voFrm) {
	<%if(bActReg){%>
	alert('Please login to access this page.');
	<% }else{ %>
	window.open('<%=g_sPath%>/cliForgetPIN.jsp?secure=Y','winRegSuccess','left=310,top=225,width=410,height=220,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes',false);
	<% } %>
}

function cliAccInfo_parent(voFrm) {
	<%if(bActReg){%>
	alert('Please login to access this page.');
	<% }else{ %>
	window.open('<%=g_sPath%>/acctInfo.jsp?secure=Y','winRegSuccess','left=310,top=225,width=800,height=220,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes',false);
	<% } %>
}

function reg_alert() {
	alert('Please contact our remisier for registration.');
}
</script>
<!-- needed for login modal -->
<script src="<%=g_sPath%>/login/js/bootstrap-5.3.6.bundle.min.js"></script>
<!-- needed for login modal -->
<script src="<%=g_sPath%>/login/passport-login-bc.jsp"></script>
<script src="<%=g_sPath%>/login/js/login-popup-bootstrap5.js"></script>
</body>
</html>


