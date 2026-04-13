<%@ page import = "java.sql.*, java.lang.*, java.util.Date, java.text.SimpleDateFormat" %>
<%@ include file='common.jsp'%>
<%@ include file="/util/sessionCheck.jsp"%>

<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<%!
		String sessLogin="";
%>

<%
try {
	com.spp.util.security.Decrypt dec = new com.spp.util.security.Decrypt();
	com.spp.util.security.Encrypt enc = new com.spp.util.security.Encrypt();

	String sUUID = request.getParameter("uuid")!=null?request.getParameter("uuid").toString().trim():"";
	if (sUUID.length()>0) {
	sUUID = dec.fetchDecode(sUUID);	
	
	sessLogin = enc.fetchEncode(sUUID);
	//System.out.println("sessLogin: "+sessLogin);
	validSession = true;
	}
	
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Pragma", "no-cache");

	String sSecure = request.getParameter("secure");
	String sLoginID = "";
	String errorMessage = "";
	String sOldPIN = "", sNewPIN = "";
	int nRetCode = 9;
	
  	sSecure = sSecure != null ? sSecure : "";
  
  	if (sSecure.length() == 0 && request.isSecure()) {
  		sSecure = "Y";
  	}
  		
	//sLoginID = (String) session.getAttribute("sLogin");
	
	sLoginID = sUUID;
  	if ( sLoginID == null ) sLoginID = "";
  	//System.out.println("validSession: "+validSession);
	
  	//if ( sLoginID.equals("") ) {
	if (!validSession) {
		out.println("<script language='javascript'>");
		if (sSecure.compareToIgnoreCase("L") == 0) {
			out.println("	parent.resizeIFrame(310,235);");
			out.println("	this.location.href='"+oN2NSession.getSetting("HTMLRoot")+oN2NSession.getSetting("projectFolder")+"/cliChgDefaultPIN.jsp'");		
		} else {
			out.println("	alert('Please login to access this page.');");
			out.println("	if (parent.document.getElementById('act') != null) { parent.document.getElementById('act').value='chgPin';}");
			out.println("	if (parent.document.getElementById('txtLoginID') != null) { parent.document.getElementById('txtLoginID').focus();}");
			out.println("	else { parent.location.href='"+oN2NSession.getSetting("HTMLRootHome")+"'}");
			out.println("	parent.closeit();");
		}		
		out.println("</script>");
				
		return;
  	} else {
  		
		if (sSecure.compareToIgnoreCase("C") == 0) {
	  		out.println("<script language='javascript'>");
	  		out.println("	parent.closeit();");
	  		out.println("</script>");  	
		} else {	  		  
 
		sOldPIN = request.getParameter("txtOldPIN");
		sNewPIN = request.getParameter("txtNewPIN");
	
		if ( sOldPIN == null ) sOldPIN = "";
		if ( sNewPIN == null ) sNewPIN = "";
	
		if ( (!sOldPIN.equals("")) && (!sNewPIN.equals("")) ) {

			String atpURL = oN2NSession.getSetting("atpURL");
			System.out.println("atpURL: "+atpURL);	
	        com.n2n.util.N2NATPConnectPush atp = new com.n2n.util.N2NATPConnectPush(atpURL);
			com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
			errorMessage = atp.mfChangeExistPIN(g_sCliCode, sLoginID, sOldPIN, sNewPIN, session);
		 	System.out.println("errorMessage:"+errorMessage);
		}
%>
<script language=JavaScript src="<%=g_sJSPath%>/main.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/N2NFunc.js"></script>
<script language=JavaScript>
function verifyPINEntry(oField) {
	var sOldPIN = oField[0]
	var sNewPIN = oField[1]
	var sNewCfmPIN = oField[2]

	//make sure old and new PIN diff
	if (sOldPIN == sNewPIN) {
		alert("Your new PIN should not be the same as old PIN.");
		return false;
	}
	//make sure new and conf PIN match
	if (sNewPIN != sNewCfmPIN) {
		alert("New PIN does not match confirmation PIN");
		return false;
	}
	if (sNewPIN.length != 6) {
		alert("Your PIN must be exactly 6 digits.......");
		return false;
	}

	var nNumeric=0, cChkPass;
	
	for (var i=0; i < sNewPIN.length ; ++i) {
			 cChkPass = sNewPIN.charAt(i);
			 if ((cChkPass >= "0") && (cChkPass <= "9")) {
					++nNumeric;
			 }
	}
	
	if (nNumeric != 6) {
		alert("Your PIN must be exactly 6 digits.");
		return false;
	}

	return true;
}

function checkRequiredFields(oField) {
	var fieldNames = new Array("Old PIN", "New PIN", "Confirm PIN");
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
		alert(fieldsNeeded);
	}
	return fieldCheck;
}

function entryVerify(voFrm) {
	var oField = new Array("txtOldPIN", "txtNewPIN", "txtNewCfmPIN");
	if (voFrm != null) {
		for (var nField=0; nField < oField.length; ++nField) {
			oField[nField] = voFrm.elements[oField[nField]].value;
		}
		if (checkRequiredFields(oField)) {
			if (verifyPINEntry(oField)) {
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
<title>Change PIN</title>
</head>

<body onload=Body_OnLoad() style="MARGIN: 3px 0px 0px 5px;BACKGROUND: WHITE;">
<table border=0 cellPadding=0 cellSpacing=0 width=290>
	<tr><td><table border=0 cellpadding=0 cellspacing=0 width='100%'>
			<tr><td width='6%' class=clsSectionHeader>&nbsp;</td>
				<td width='80%' class=clsSectionHeader>CHANGE PIN</td>
				<td width='14%' class=clsSectionHeader>&nbsp;</td></tr>
		</table></td></tr>
	<tr><td>
		<table border=1 cellpadding=0 cellspacing=0 width='100%'>
			<tr><td>
				<table width='100%'>
					<tr><td width='10%'>&nbsp;</td>
						<td width='80%' class=fntInfoMsg colspan=2>Please enter your old and new PIN<br/>into the system.<br/><br/></td>
						<td width='10%'>&nbsp;</td></tr>
					<tr><td width='10%'>&nbsp;</td>
						<td width='45%' class=fntInputMsg>Old PIN</td>
						<td width='35%'><form id=frmChgPIN name=frmChgPIN action="cliChgDefaultPIN.jsp?uuid=<%=sessLogin%>" method=post onsubmit="return entryVerify(this);">
							<input type=password id=txtOldPIN name=txtOldPIN class=inputField maxlength=20 size=20 style='font-size:10px' value="" /></td>
						<td width='10%'>&nbsp;</td></tr>
					<tr><td>&nbsp;</td>
						<td class=fntInputMsg>New PIN</td>
						<td colspan=2><input type=password id=txtNewPIN name=txtNewPIN class=inputField maxlength=20 size=20' value="" /></td>
						<td>&nbsp;</td></tr>
					<tr height=30><td>&nbsp;</td>
						<td class=fntInputMsg>Confirm New PIN</td>
						<td colspan=2><input type=password id=txtNewCfmPIN name=txtNewCfmPIN class=inputField maxlength=20 size=20' value="" /></td>
						</tr>
					<tr><td>&nbsp;</td>
						<td colspan=2><hr width='100%'></td>
						<td>&nbsp;</td></tr>
					<tr height=25><td>&nbsp;</td>
						<td colspan="2"><input type=submit value='Submit'>&nbsp;&nbsp;<input type="button" name="Cancel" value="CLOSE" onclick="javascript:btnCancel_onClick();"></td>
						<td>&nbsp;</td></tr></form>
					<%if (!errorMessage.equals("")) {%>
					<tr><td>&nbsp;</td>
						<td colspan=2><strong style='color:red'>
						<% if (errorMessage.indexOf("1800")==0) { %>
							1800 ATP - Invalid Old or New PIN
						<% } else if (errorMessage.indexOf("1801")==0) { %>
							1801 ATP - Invalid Old or New PIN
						<% } else if (errorMessage.indexOf("1802")==0) { %>
							1802 ATP - Your new PIN should not be the same as old PIN
						<% } else if (errorMessage.indexOf("1803")==0) { %>
							1803 ATP - Your PIN have been changed successfully
						<% } else if (errorMessage.indexOf("1804")==0) { %>
							1804 ATP - Session Expired. Fail no such login id.
						<% } else if (errorMessage.indexOf("1805")==0) { %>
							1805 ATP - Invalid Old or New PIN
						<% } else if (errorMessage.indexOf("1806")==0) { %>
							1806 ATP - New PIN same as one version before
						<% } else if (errorMessage.indexOf("1807")==0) { %>
							1807 ATP - Invalid Old or New PIN
						<% } else if (errorMessage.indexOf("1808")==0) { %>
							1808 ATP - Invalid Old or New PIN
						<% } else if (errorMessage.indexOf("1809")==0) { %>
							1809 ATP - Change PIN fail. Kindly try again later.
						<% } else { %>
							<%=errorMessage%>						
						<% } %>						
						</strong></td>
						<td>&nbsp;</td></tr>
					<tr><td>&nbsp;</td>
						<td colspan=2><span style='color:red'>click CLOSE button to continue.</span></td>
						<td>&nbsp;</td></tr>
					<%}%>							
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
	//window.resizeTo(305,230);
<% 
/**
	  	switch(nRetCode) {
	     	case 0:
	     		out.print("alert('Your PIN have been changed successfully.');");
	     		out.println("	this.location.href='"+oN2NSession.getSetting("HTMLRoot")+"/n2n_gc/cliChgDefaultPIN.jsp?secure=C'");
	     		break;
	     	case 2:
	     		out.print("alert('Your old PIN does not match the PIN in our database.');");
	     		break;
	     	case 4: case 5: case -1:
	     		out.print("alert('System error! Please try again later.');");
	     		break;
	     	default:
	     		break;
	  	}
*/	  
  	if (nRetCode != 0) {
%>

		if (document.frmChgPIN.txtOldPIN.value == "") {
			document.frmChgPIN.txtOldPIN.focus();
		}
	
<% 
    	} else {
		//out.println("if((parent.location.href).indexOf('cliChgDefaultPIN.jsp') != -1) {");
		out.println("if((this.location.href).indexOf('cliChgDefaultPIN.jsp') != -1) {");
		out.println("	self.close();");
		//out.println("self.location.href = closeit.html");
         	out.println("}");
   	} 
%>
}

function btnCancel_onClick() {
	location.href='<%=oN2NSession.getSetting("HTMLRootSecure") +"/"+ oN2NSession.getSetting("projectFolder")%>/cliLoginLite.jsp';
	//parent.close();
}
</script>
<%
	}
	} // End of if ( sLoginID.equals("") ) 
}catch (Exception ex) {
	ex.printStackTrace();
}
		
%>