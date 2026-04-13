<%@ page import = "java.sql.*, java.lang.*, java.util.Date, java.text.SimpleDateFormat" %>
<%@ include file='common.jsp'%>
<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<%
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Pragma", "no-cache");

	String sSecure = request.getParameter("secure");
	String sLoginID = "";
	String sOldPwd = "", sNewPwd = "";
	int nRetCode = 9;
	String sIntranetExistFlag = "Y";
	//sLoginID = (String) session.getAttribute("loginid");
	sLoginID = g_sLoginId;
  	if ( sLoginID == null ) sLoginID = "";
  	sSecure = sSecure != null ? sSecure : "";
  	if (sSecure.length() == 0 && request.isSecure()) {
  		sSecure = "Y";
  	}
  	
  	//if ( sLoginID.equals("") ) {
	if (!oN2NSession.getIsUserLogin()) {
		out.println("<script language='javascript'>");
		if (sSecure.compareToIgnoreCase("L") == 0) {		
			out.println("	if(parent.frames.length!=0){parent.resizeIFrame(310,235);}");
			out.println("	this.location.href='" + oN2NSession.getSetting("HTMLRootHome")+"'");		
		} else {
			//out.println("parent.closeit();");
			//out.println("parent.load('chgPwd');");						
			out.println("	alert('Please login to access this page.');");	
			out.println("	this.location.href='" + oN2NSession.getSetting("HTMLRoot") + g_sPath + "/cliChgPwd.jsp?secure=L'");
		}		
		out.println("</script>");	
  	} else {
	  	if (sSecure.compareToIgnoreCase("N") == 0) {
	  		out.println("<script language='javascript'>");
	  		//out.println("alert('"+oN2NSession.getSetting("AppOptIntranet")+"')");
	  		if(!sIntranetExistFlag.equalsIgnoreCase(oN2NSession.getSetting("AppOptIntranet")))
	  		{
	  		 out.println("	if(parent.frames.length!=0){parent.resizeIFrame(360,220);}");
	  		 out.println("	this.location.href='" + oN2NSession.getSetting("HTMLRoot") + g_sPath + "/cliChgPwd.jsp?secure=Y'");
	  		}
	  		else
	  		{
	  		out.println("	if(parent.frames.length!=0){parent.resizeIFrame(360,220);}");
	  		out.println("	if(parent.frames.length!=0){this.location.href='" + oN2NSession.getSetting("HTMLRoot") + g_sPath + "/cliChgPwd.jsp?secure=Y'}");
	  		out.println("	if(parent.frames.length==0){this.location.href='" + oN2NSession.getSetting("HTMLRoot") + g_sPath + "/admin/dealer_login.jsp?act=chgPwd'}");
	  		}
	  		out.println("</script>");
  		} else if (sSecure.compareToIgnoreCase("C") == 0) {
	  		out.println("<script language='javascript'>");
	  		out.println("	if(parent.frames.length!=0){parent.location.href='" + oN2NSession.getSetting("HTMLRoot") + g_sPath + "/logout.jsp';}");
	  		out.println("	if(parent.frames.length==0){this.location.href='" + oN2NSession.getSetting("HTMLRoot") + g_sPath + "/logout.jsp'}");
	  		out.println("</script>");  	
		} else if (sSecure.compareToIgnoreCase("X") == 0) {
	  		out.println("<script language='javascript'>");
	  		out.println("	if(parent.frames.length!=0){parent.closeit();}");
	  		out.println("</script>");  	  				  		
	  	} else {
  
		sOldPwd = request.getParameter("txtOldPwd");
		sNewPwd = request.getParameter("txtNewPwd");
	
		if ( sOldPwd == null ) sOldPwd = "";
		if ( sNewPwd == null ) sNewPwd = "";
	
		if ( (!sOldPwd.equals("")) && (!sNewPwd.equals("")) ) {
		 
		 	cli.init(oN2NSession);
		 	nRetCode = cli.mfChangeExistPwdPIN("1", "", sLoginID, sOldPwd, sNewPwd);
		 
		 	cli.closeResultset();
		}
%>
<script language=JavaScript src="<%=g_sJSPath%>/main.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/N2NFunc.js"></script>
<script language=JavaScript>
function verifyPwdEntry(oField) {
	var sOldPwd = oField[0]
	var sNewPwd = oField[1]
	var sNewCfmPwd = oField[2]

	//make sure old and new pwd diff
	if (sOldPwd == sNewPwd) {
		alert("Your new password should not be the same as old password.");
		return false;
	}
	//make sure new and conf pwd match
	if (sNewPwd != sNewCfmPwd) {
		alert("New password does not match confirmation password");
		return false;
	}
	if (sNewPwd.length < 6) {
		alert("Your password should be at least 6 characters.");
		return false;
	}
	if ((sNewPwd.indexOf(" ") != -1) || (sNewPwd.indexOf("\"") != -1) || (sNewPwd.indexOf("'") != -1)) {
		alert("Password contains illegal character");
		return false;
	}

	var nNumeric=0, nAlpha=0, cChkPass;
	for (var i=0; i < sNewPwd.length ; ++i) {
		cChkPass = sNewPwd.charAt(i);
		if ((cChkPass >= "0") && (cChkPass <= "9")) {
			++nNumeric;
		} else {
			++nAlpha;
		}
	}
	if (nNumeric == 0 || nAlpha == 0) {
		alert("Your password should have at least 1 alphanumeric and 1 numeric character");
		return false;
	}

	return true;
}

function checkRequiredFields(oField) {
	var fieldNames = new Array("Old password", "New password", "Confirm password");
	var fieldCheck   = true;
	var fieldsNeeded = "\nA value must be entered in the following field(s):\n\n\t";

	for(var nField=0; nField < fieldNames.length; ++nField) {
		if (JStrim(oField[nField]) == "") {
			fieldsNeeded += fieldNames[nField] + "\n\t";
			fieldCheck = false;
		}
	}

	if (!fieldCheck) {
		// SOME REQUIRED FIELDS ARE MISSING VALUES
		if(JStrim(oField[0]) == "")             //if user id value is missing
		{
		 document.frmChgPwd.txtOldPwd.focus();  //set focus at user id field
		}
		else if(JStrim(oField[1]) == "")
		{
		 document.frmChgPwd.txtNewPwd.focus();
		}
		else
		{
		 document.frmChgPwd.txtNewCfmPwd.focus();
		} 
		alert(fieldsNeeded);
	}
	return fieldCheck;
}

function entryVerify(voFrm) {
	var oField = new Array("txtOldPwd", "txtNewPwd", "txtNewCfmPwd");
	if (voFrm != null) {
		for (var nField=0; nField < oField.length; ++nField) {
			oField[nField] = voFrm.elements[oField[nField]].value;
		}
		if (checkRequiredFields(oField)) {
			if (verifyPwdEntry(oField)) {
				return true;
			}
		}
	}
	return false;
}
</script>

<html>
<head>
<link rel=stylesheet href="<%=g_sStylePath%>/default.css">
<title>Change Password</title>
</head>

<body onload=Body_OnLoad() style="MARGIN: 3px 0px 0px 5px;BACKGROUND:#FFFFFF">
<table border=0 cellPadding=0 cellSpacing=0 width=340>
	<tr><td class=tdBorderLight>&nbsp;</td></tr>
	<tr><td class=tdBorderWhite>&nbsp;</td></tr>
	<tr><td><table border=0 cellpadding=0 cellspacing=0 width='100%'>
			<tr><td width='6%' class=tdTitleLeftBorder>&nbsp;</td>
				<td width='80%' class=tdTitle>CHANGE PASSWORD</td>
				<td width='14%' class=tdTitleRightBorder>&nbsp;</td></tr>
			<tr><td class=tdTitleBottomBorder colspan=3>&nbsp;</td></tr>
		</table></td></tr>
	<tr><td class=tdBorderWhite>&nbsp;</td></tr>
	<tr><td>
		<table border=1 cellpadding=0 cellspacing=0 width='100%'>
			<tr><td>
				<table width='100%'>
					<tr><td width='10%'>&nbsp;</td>
						<td width='80%' class=fntInfoMsg colspan=2>Please enter your old and new password<br/>into the system.<br/><br/></td>
						<td width='10%'>&nbsp;</td></tr>
					<tr><td width='10%'>&nbsp;</td>
						<td width='45%' class=fntInputMsg>Old Password</td>
						<td width='35%'>
						<form id=frmChgPwd name=frmChgPwd action="cliChgPwd.jsp" method=post onsubmit="return entryVerify(this);">
						<input type=password id=txtOldPwd name=txtOldPwd class=inputField maxlength=20 size=20 value="" /></td>
						<td width='10%'>&nbsp;</td></tr>
					<tr><td>&nbsp;</td>
						<td class=fntInputMsg>New Password</td>
						<td colspan=2><input type=password id=txtNewPwd name=txtNewPwd class=inputField maxlength=20 size=20 value="" /></td>
						<td>&nbsp;</td></tr>
					<tr height=30><td>&nbsp;</td>
						<td class=fntInputMsg>Confirm New Password</td>
						<td colspan=2><input type=password id=txtNewCfmPwd name=txtNewCfmPwd class=inputField maxlength=20 size=20 value="" /><input type='hidden' value='<%=sSecure%>' name='secure'></td>
						</tr>
					<tr><td>&nbsp;</td>
						<td colspan=2><hr width='100%'></td>
						<td>&nbsp;</td></tr>
					<tr height=25><td>&nbsp;</td>
						<td>&nbsp;</td>
						<td><input type=submit value='Submit'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" name="Cancel" value="Cancel" onclick="javascript:btnCancel_onClick();"></td>
						<td>&nbsp;</td></tr></form>
				</table>
				</td></tr>
		</table>
	</td></tr>
</table>
</body>
</html>
<script language=JavaScript defer>
function Body_OnLoad()
{
<%
	  	switch(nRetCode) {
	     	case 0:
	     		out.print("alert('Your password have been changed successfully.');");
	     		out.println("	this.location.href='" + oN2NSession.getSetting("HTMLRoot") + g_sPath + "/cliChgPwd.jsp?secure=C'");
	     		//out.println("	this.location.href='" + oN2NSession.getSetting("HTMLRoot") + g_sPath + "/login?logout=true';");
	     		break;
	     	case 2:
	     		out.print("alert('Your old password does not match the password in our database.');");
	     		break;
	     	case 3:
	     		out.print("alert('Your new password should not be the same as your previous password.');");
	     		break;
	     	case 4: case 5: case -1:
	     		out.print("alert('System error! Please try again later.');");
	     		break;
	     	default:
	     		break;
	  	}

	  	if (nRetCode != 0) {
%>

	if (document.frmChgPwd.txtOldPwd.value == "") {
			document.frmChgPwd.txtOldPwd.focus();
	}
<% 
    	} /*else {
         	out.print("parent.closeit();");
    	} */
%>
}

function btnCancel_onClick() {
	this.location.href = '<%=oN2NSession.getSetting("HTMLRoot") + g_sPath%>/cliChgPwd.jsp?secure=X';
}
</script>
<%
	} // end of if (sSecure)
	}// End of if ( sLoginID.equals("") ) 
%>