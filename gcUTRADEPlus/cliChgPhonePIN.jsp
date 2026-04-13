<%@ include file="/util/meta_setting.jsp"%>
<%@ include file="/util/sessionCheck.jsp"%>
<%@ include file='common.jsp'%>
<%@ page import = "java.sql.*, java.lang.*, java.util.Date, java.text.SimpleDateFormat" %>
<%@ page import="XMLReader.xmlreader" %>
<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<%
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Pragma", "no-cache");

	String sSecure = request.getParameter("secure");
	String sLoginID = "";
	String sOldPIN = "", sNewPIN = "";
	String errorMessage = "";	
	int nRetCode = 9;
	
  	sSecure = sSecure != null ? sSecure : "";
  
  	if (sSecure.length() == 0 && request.isSecure()) {
  		sSecure = "Y";
  	}

	sLoginID = g_sLoginId;
  	if ( sLoginID == null ) sLoginID = "";

	if (!validSession) {
			out.println("<script language='javascript'>");
			if (sSecure.compareToIgnoreCase("L") == 0) {
				out.println("	parent.resizeIFrame(310,235);");
				//out.println("	this.location.href='http://"+request.getServerName()+":"+request.getServerPort() + g_sPath + "/cliLogin.jsp?act=chgPin'");
				out.println("	this.parent.location.href='"+oN2NSession.getSetting("HTMLRootHome")+"/session-expired'");
			} else {		
				out.println("	parent.closeit();");
				out.println("	alert('"+xmlreader.getLangByKey(g_sLanguage,"ALERT_PLEASE_LOGIN")+"');");
			}		
			out.println("</script>");
					
			return;
  	} else {
			if (sSecure.compareToIgnoreCase("C") == 0) {
				out.println("<script language='javascript'>");
				out.println("	parent.closeit();");
				out.println("</script>");  	
			} else {	  		  
			
			sOldPIN = request.getParameter("txtOldPhonePIN");
			sNewPIN = request.getParameter("txtNewPhonePIN");
		
			if ( sOldPIN == null ) sOldPIN = "";
			if ( sNewPIN == null ) sNewPIN = "";
		
			if ( (!sOldPIN.equals("")) && (!sNewPIN.equals("")) ) {

				String atpURL = session.getAttribute("ATPURLpublic")!=null?session.getAttribute("ATPURLpublic").toString().trim():oN2NSession.getSetting("atpURL");
				//String atpURL = "123.30.3.54";
		        com.n2n.util.N2NATPConnect atp = new com.n2n.util.N2NATPConnect(atpURL);
				com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
				errorMessage = atp.mfChangeExistPhonePIN(g_sCliCode, sLoginID, sOldPIN, sNewPIN, session);
			 	System.out.println("errorMessage:"+errorMessage);				
			}
%>
<script language=JavaScript src="<%=g_sJSPath%>/main.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/N2NFunc.js"></script>
<script language=JavaScript>
function verifyPINEntry(oField) {
	var sOldPhonePIN = oField[0]
	var sNewPhonePIN = oField[1]
	var sNewCfmPhonePIN = oField[2]

	//make sure old and new PIN diff
	if (sOldPhonePIN == sNewPhonePIN) {
		alert("<%=xmlreader.getLangByKey(g_sLanguage, "C_PHONE_PIN_ALERT_NEW_OLD_PP_SHOULDNOT_SAME")%>");
		return false;
	}
	//make sure new and conf PIN match
	if (sNewPhonePIN != sNewCfmPhonePIN) {
		alert("<%=xmlreader.getLangByKey(g_sLanguage, "C_PHONE_PIN_ALERT_NEW_CONFIRM_PP_UNMATCH")%>");
		return false;
	}

	if (sNewPhonePIN.length < 4 || sNewPhonePIN.length > 8) {
		alert("<%=xmlreader.getLangByKey(g_sLanguage, "C_PHONE_PIN_ALERT_MIN_MAX")%>");
		return false;
	}

	if ((sNewPhonePIN.indexOf(" ") != -1) || (sNewPhonePIN.indexOf("\"") != -1) || (sNewPhonePIN.indexOf("'") != -1)) {
		alert("<%=xmlreader.getLangByKey(g_sLanguage, "C_PHONE_PIN_ALERT_ILLEGAL_CHAR")%>");
		return false;
	}

	var nNumeric=0, nAlpha=0, cChkPass;
	for (var i=0; i < sNewPhonePIN.length ; ++i) {
		cChkPass = sNewPhonePIN.charAt(i);
		if ((cChkPass >= "0") && (cChkPass <= "9")) {
			++nNumeric;
		} else {
			++nAlpha;
		}
	}
	if (nNumeric == 0 || nAlpha == 0) {
		alert("<%=xmlreader.getLangByKey(g_sLanguage, "C_PHONE_PIN_ALERT_PP_SHOULD_ALPHANUMERIC")%>");
		return false;
	}
	
	return true;
}

function checkRequiredFields(oField) {
	var fieldNames = new Array("<%=xmlreader.getLangByKey(g_sLanguage, "OLD_PHONE_PIN")%>", "<%=xmlreader.getLangByKey(g_sLanguage, "NEW_PHONE_PIN")%>", "<%=xmlreader.getLangByKey(g_sLanguage, "CONFIRM_PHONE_PIN")%>");
	var fieldCheck   = true;
	var fieldsNeeded = "\n<%=xmlreader.getLangByKey(g_sLanguage, "ALERT_FEILD_REQUIRED")%>:\n\n\t";

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
	var oField = new Array("txtOldPhonePIN", "txtNewPhonePIN", "txtNewCfmPhonePIN");
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
<title><%=xmlreader.getLangByKey(g_sLanguage, "CHANGE_PHONE_PIN")%></title>
</head>

<body onload=Body_OnLoad() style="MARGIN: 3px 0px 0px 5px;BACKGROUND: #FFFFFF;">
<table border=0 cellPadding=0 cellSpacing=0 width=350>
	<tr><td class=tdBorderLight><img src="<%=g_sImgPath%>/home/kvs_popup_logo_template.png" /></td></tr>
	<tr><td class=tdBorderWhite>&nbsp;</td></tr>
	<tr><td class=tdBorderWhite>&nbsp;</td></tr>
	<tr><td><table border=0 cellpadding=0 cellspacing=0 width='100%'>
			<tr><td width='6%' class=tdTitleLeftBorder>&nbsp;</td>
				<td width='80%' class=tdTitle align='center'><%=xmlreader.getLangByKey(g_sLanguage, "CHANGE_PHONE_PIN")%></td>
				<td width='14%' class=tdTitleRightBorder>&nbsp;</td></tr>
			<tr><td class=tdTitleBottomBorder colspan=3>&nbsp;</td></tr>
		</table></td></tr>
	<tr><td class=tdBorderWhite>&nbsp;</td></tr>
	<tr><td>
		<table border=0 cellpadding=2 cellspacing=2 width='100%'>
			<tr><td>
				<table width='100%' border=0>
				<form id=frmChgPhonePIN name=frmChgPhonePIN action="cliChgPhonePIN.jsp" method=post onsubmit="return entryVerify(this);">
					<tr>
						<td width='7%'>&nbsp;</td>
						<td width='86%' class=fntInfoMsg colspan=2><%=xmlreader.getLangByKey(g_sLanguage, "C_PHONE_PIN_STATEMENT")%><br/><br/></td>
						<td width='7%'>&nbsp;</td>
					</tr>
					<tr>
						<td width='7%'>&nbsp;</td>
						<td width='30%' class=fntInputMsg><%=xmlreader.getLangByKey(g_sLanguage, "OLD_PHONE_PIN")%></td>
						<td width='35%'><input type=password id=txtOldPhonePIN name=txtOldPhonePIN class=inputField maxlength=20 size=20 value="" /></td>						
						<td width='7%'>&nbsp;</td>
					</tr>
					<tr>
						<td>&nbsp;</td>
						<td class=fntInputMsg><%=xmlreader.getLangByKey(g_sLanguage, "NEW_PHONE_PIN")%></td>
						<td><input type=password id=txtNewPhonePIN name=txtNewPhonePIN class=inputField maxlength=20 size=20' value="" /></td>
						<td>&nbsp;</td></tr>
					<tr>
						<td>&nbsp;</td>
						<td class=fntInputMsg><%=xmlreader.getLangByKey(g_sLanguage, "CONFIRM_PHONE_PIN")%></td>
						<td><input type=password id=txtNewCfmPhonePIN name=txtNewCfmPhonePIN class=inputField maxlength=20 size=20' value="" /></td>
						<td>&nbsp;</td>
					</tr>
					<tr>
						<td>&nbsp;</td>
						<td colspan=2><hr width='100%'></td>
						<td>&nbsp;</td></tr>
					<tr height=25>
						<td>&nbsp;</td>
						<td>&nbsp;</td>
						<td><input type=submit value='<%=xmlreader.getLangByKey(g_sLanguage, "SUBMIT")%>'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" name="Cancel" value="<%=xmlreader.getLangByKey(g_sLanguage, "CANCEL")%>" onclick="javascript:btnCancel_onClick();"></td>
						<td>&nbsp;</td></tr>
				</form>
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
	//window.resizeTo(340,300);
<%
			switch(nRetCode) {
				case 0:
					out.print("alert('"+xmlreader.getLangByKey(g_sLanguage, "C_PHONE_PIN_ALERT_PP_SUCCESS_CHANGED")+"');");
					out.println("	this.location.href='" + "http://"+request.getServerName()+":"+request.getServerPort() + g_sPath + "/cliChgPhonePIN.jsp?secure=C'");
					break;
				case 2:
					out.print("alert('"+xmlreader.getLangByKey(g_sLanguage, "C_PHONE_PIN_ALERT_OLD_PP_UNMATCH_DB_PP")+"');");
					break;
				case 4: case 5: case -1:				
					out.print("alert('"+xmlreader.getLangByKey(g_sLanguage, "SYSTEM_ERROR_ALERT")+"');");
					break;
				default:
					break;
			}
	  
			if (nRetCode != 0) {
%>
				if (document.frmChgPhonePIN.txtOldPhonePIN.value == "") {
						document.frmChgPhonePIN.txtOldPhonePIN.focus();
				}
<% 
			} else {  			
				out.println("if((this.location.href).indexOf('cliChgPhonePIN.jsp') != -1) {");
				out.println("	self.close();");  	
				out.println("}");
			} 
%>
}

function btnCancel_onClick() {
	this.location.href = '<%="http://"+request.getServerName()+":"+request.getServerPort() + g_sPath%>/cliChgPhonePIN.jsp?secure=C';
}
</script>
<%
		}
	} // End of if ( sLoginID.equals("") ) 
%>