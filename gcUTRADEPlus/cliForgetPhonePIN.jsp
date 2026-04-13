<%@ include file="/util/meta_setting.jsp"%>
<%@ include file='common.jsp'%>
<%@ include file="util/sessionCheck.jsp"%>
<%@ page import = "java.sql.*, java.lang.*, java.util.Date, java.text.SimpleDateFormat" %>
<%@ page import="XMLReader.xmlreader" %>
<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<jsp:useBean id="clibean" class="com.n2n.bean.N2NMFCliInfoBean" scope="page"/>
<%
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Pragma", "no-cache");

	String sSecure = request.getParameter("secure");
	String errorMessage = "";
	String sLoginID = "", sHint = "", sHintAns = "";
  	String sEmail = "", sNewPwdPIN = "";
  	int nRetCode = 9;
  
  	//sLoginID = (String) session.getAttribute("loginid");
  	sLoginID = g_sLoginId;
  	if ( sLoginID == null ) sLoginID = "";
  	sSecure = sSecure != null ? sSecure : "";
  
  	if (sSecure.length() == 0 && request.isSecure()) {
  		sSecure = "Y";
  	}
  	
  	if (!request.isSecure() && !sSecure.equalsIgnoreCase("C")) sSecure = "S";	  
  	//if ( sLoginID.equals("") ) {
	if (!validSession) {

/*			 out.println("<script language='javascript'>");
			 out.println("parent.closeit();");
			 out.println("parent.load('fgtPin');");
			 out.println("alert('Please login to access this page.');");
			 out.println("</script>");	
*/
		out.println("<script language='javascript'>");
		if (sSecure.compareToIgnoreCase("L") == 0) {
			out.println("	parent.resizeIFrame(310,235);");
			//out.println("	this.location.href='http://"+request.getServerName()+":"+request.getServerPort() + g_sPath + "/cliLogin.jsp?act=fgtPin'");
			out.println("	this.parent.location.href='"+oN2NSession.getSetting("HTMLRootHome")+"/session-expired'");			
		} else {
			//out.println("	this.location.href='" + oN2NSession.getSetting("HTMLRoot") + g_sPath + "/cliForgetPIN.jsp?secure=L'");
			out.println("	alert('Please login to access this page.');");
			out.println("	if (parent.document.getElementById('act') != null) { parent.document.getElementById('act').value='fgtPin';}");
			out.println("	if (parent.document.getElementById('txtLoginID') != null) { parent.document.getElementById('txtLoginID').focus();}");			
			out.println("	else { parent.location.href='http://"+request.getServerName()+":"+request.getServerPort() + g_sPath + "/cliLogin.jsp?act=fgtPin1';}");
			out.println("	parent.closeit();");
		}		
		out.println("</script>");			 
  	} else {
		String atpURL = session.getAttribute("ATPURLpublic")!=null?session.getAttribute("ATPURLpublic").toString().trim():oN2NSession.getSetting("atpURL");
		//String atpURL = "123.30.3.54";
        	com.n2n.util.N2NATPConnect atp = new com.n2n.util.N2NATPConnect(atpURL);
		com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();

  			//sLoginID = "jason1"; // for testing
 			if (sSecure.compareToIgnoreCase("C") == 0) {
		  		out.println("<script language='javascript'>");
		  		out.println("	parent.closeit();");
		  		out.println("</script>");  
			} else if (sSecure.compareToIgnoreCase("S") == 0) {
//		  		out.println("<script language='javascript'>");
//				out.println("	this.location.href='" + oN2NSession.getSetting("HTMLRoot") + g_sPath + "/cliForgetPIN.jsp?secure=Y'");		
//		  		out.println("</script>");	  				  			
//			} else {	  		  
  			sHint    = request.getParameter("txtHint");
  			sHintAns = request.getParameter("txtHintAns");
  
  			if ( sLoginID == null ) sLoginID = "";
  			if ( sHint == null )    sHint    = "";
  			if ( sHintAns == null ) sHintAns = "";
 
  			if (!sLoginID.equals("")) {
		 
	    		if (sHint.equals("")) {
		      
		      		//ResultSet rs = null;
			   
			    	clibean.setCliCode(null);
			    	clibean.setMobile(null);
			    	clibean.setLoginID(sLoginID);
			    	clibean.setCategory(null);
					
	    			context = atp.getCliInfo(clibean, oN2NSession.getSetting("tradeforgetpinpwdID"));
	    			java.util.List resultList = new java.util.ArrayList();
	    			String results[] = null;
	    			if (context.getErrorMsg().equals("")) {
	    				resultList = context.getResultsList();
	    				if (resultList!=null && resultList.size() > 0) {
	    					results = (String[])resultList.get(0);
	    					sHint 		= results[14];
	    				}
	    			} else {
	    				System.out.println("error in getCliInfo during cliForgetPhonePIN.jsp:"+context.getErrorMsg());
					checkATPSession(context.getErrorMsg(),oN2NSession,session,out,"Forget PIN",atp,g_sLoginId,m_sLang);
					out.println("<script language='javascript'>");
					out.println("location.href='http://"+request.getServerName()+":"+request.getServerPort() + g_sPath + "/cliForgetPIN.jsp?secure=Y'");
					out.println("</script>");
	    				// session invalid
	    			} 
	        		if (sHint == "") { 
			        	// LoginID not found
			        	nRetCode = -4;
			    	}	    			
	    		} else if (!sHintAns.equals("")) {
		      
		      		String []saResult = new String[2];
			   
			    	clibean.setLoginID(sLoginID);
			    	clibean.setHint(sHint);
			    	clibean.setHintAns(sHintAns);

	    			context = atp.verifyHintPwdPIN("3", clibean, oN2NSession.getSetting("tradeforgetpinpwdID"));
	    			java.util.List resultList = new java.util.ArrayList();
	    			String results[] = null;
	    			if (context.getErrorMsg().equals("")) {
	    				resultList = context.getResultsList();
	    				if (resultList!=null && resultList.size() > 0) {
	    					results = (String[])resultList.get(0);
	    			    	sEmail     = results[0]!=null?results[0].toString().trim().substring(1):""; //out.print(sEmail);
	                  		sNewPwdPIN = results[1]!=null?results[1].toString().trim():""; //out.print(sNewPwdPIN);
	                  		
					    	if ( (!sEmail.equals("")) && (!sNewPwdPIN.equals("")) ) {
					             
					        	if (sNewPwdPIN.equals("0")) {
					            	// Hint and HintAns not match
					            	nRetCode = -3;
					        	} else if ( (!sEmail.equals("")) && (!sEmail.equals("null")) ) {
					            	// Successful, Email sent
					            	String m_sWebEmail  = oN2NSession.m_sWebEmail;
					            	String m_sWebBHCode = oN2NSession.m_sWebBHCode;
					            
					            	int m_nRet = -1;
									sNewPwdPIN += "|";
					            	//m_nRet = cli.mfMsgRegisterMail("P","E",m_sWebEmail,sEmail,30,sNewPwdPIN,m_sWebBHCode,"","N","","","");
		                  			//out.print(m_nRet);

									context = atp.mfMsgRegisterMail("P","E",m_sWebEmail,sEmail,30,sNewPwdPIN,m_sWebBHCode,"","N","","","",oN2NSession.getSetting("tradeforgetpinpwdID"));
									if (context!=null) {
										if (context.getErrorMsg()!=null && !context.getErrorMsg().equals("")) {
											errorMessage = context.getErrorMsg();
										} else {
											nRetCode = -1;		
										}
									}
					        	} else {
					            	// Email is missing
						     		nRetCode = -5;
					       		 }
					    	}
	    				}
	    			} else {
	    				System.out.println("error in getCliInfo during cliForgetPIN.jsp:"+context.getErrorMsg());
					checkATPSession(context.getErrorMsg(),oN2NSession,session,out,"Forget Pin",atp,g_sLoginId,m_sLang);
					out.println("<script language='javascript'>");
					out.println("location.href='http://"+request.getServerName()+":"+request.getServerPort() + g_sPath + "/cliForgetPIN.jsp?secure=Y'");
					out.println("</script>");
	    				// session invalid
	    			}
		 		} // End of if (sHint == "")
		 		
			} // End of if (sLoginID != "")
%>
<script language=JavaScript src="<%=g_sJSPath%>/N2NFunc.js"></script>
<SCRIPT language=javascript src="<%=g_sJSPath%>/main.js"></SCRIPT>
<script language=JavaScript>
function checkRequiredFields(oField) {
	var fieldNames = new Array('<%=xmlreader.getLangByKey(g_sLanguage,"ANSWER_TO_HINT")%>');

	var fieldCheck   = true;
	var fieldsNeeded = "\n<%=xmlreader.getLangByKey(g_sLanguage,"ALERT_FEILD_REQUIRED")%>:\n\n\t";

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
	var oField = new Array("txtHintAns");
	if (voFrm != null) {
		for (var nField=0; nField < oField.length; ++nField) {
			oField[nField] = voFrm.elements[oField[nField]].value;
		}
		if (checkRequiredFields(oField)) {
			return true;
		}
	}
	return false;
}
</script>

<html>
<head>
<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
<title><%=xmlreader.getLangByKey(g_sLanguage, "SUB_PROFILE_FORGOT_PHONE_PIN")%></title>
</head>

<body onload=Body_OnLoad() style="MARGIN: 3px 0px 0px 5px;BACKGROUND: WHITE;">
<table border=0 cellPadding=0 cellSpacing=0 width=400>
	<tr><td class=tdBorderLight><img src="<%=g_sImgPath%>/home/kvs_popup_logo_template.png" /></td></tr>
	<tr><td class=tdBorderWhite>&nbsp;</td></tr>
	<tr><td class=tdBorderWhite>&nbsp;</td></tr>
	<tr><td>
			<table border=0 cellpadding=0 cellspacing=0 width='100%'>
				<tr><td width='6%' class=tdTitleLeftBorder>&nbsp;</td>
					<td width='80%' class=tdTitle align=center><%=xmlreader.getLangByKey(g_sLanguage, "SUB_PROFILE_FORGOT_PHONE_PIN")%>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
					<td width='14%' class=tdTitleRightBorder>&nbsp;</td>
				</tr>
				<tr><td class=tdTitleBottomBorder colspan=3>&nbsp;</td></tr>
			</table>
	</td></tr>
	<tr><td class=tdBorderWhite>&nbsp;</td></tr>
	<tr><td>
			<table border=1 cellpadding=0 cellspacing=0 width='100%'>
				<tr><td>
						<table width='100%'>
							<tr>
								<td width='6%'>&nbsp;</td>
								<td width='88%' class=fntInfoMsgLeft align=left colspan=2><%=xmlreader.getLangByKey(g_sLanguage, "F_PIN_STATEMENT")%><br/><br/></td>
								<td width='6%'>&nbsp;</td>
							</tr>
							<tr><td width='6%'>&nbsp;</td>
								<td width='28%' class=fntInputMsg><%=xmlreader.getLangByKey(g_sLanguage, "HINT_PHONE_PIN")%></td>
								<td width='60%'><form id=frmForgetPhonePIN name=frmForgetPhonePIN action="cliForgetPhonePIN.jsp" method=post onsubmit="return entryVerify(this);"><input id=txtHint name=txtHint class=inputField maxlength=50 size=50 value='<%=sHint%>' readonly/></td>
								<td width='6%'>&nbsp;</td>
							</tr>
							<tr height=30>
								<td>&nbsp;</td>
								<td class=fntInputMsg><%=xmlreader.getLangByKey(g_sLanguage, "ANS_PHONE_PIN")%></td>
								<td colspan=2><input id=txtHintAns name=txtHintAns class=inputField maxlength=20 size=20 value='<%=sHintAns%>' autocomplete=off /></td>
							</tr>
							<tr>
								<td>&nbsp;</td>
								<td colspan=2><hr width='100%'></td>
								<td>&nbsp;</td>
							</tr>
							<tr height=25>
								<td>&nbsp;</td>
								<td>&nbsp;</td>
								<!--<td><input type=submit value='Submit'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" name="Cancel" value="Cancel" onclick="javascript:parent.closeit();"></td>-->
								<td><input type=submit value='<%=xmlreader.getLangByKey(g_sLanguage, "SUBMIT")%>'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" name="Cancel" value="<%=xmlreader.getLangByKey(g_sLanguage, "CANCEL")%>" onclick="javascript:btnCancel_onClick();"></td>
								<td>&nbsp;</td>
							</tr></form>
							<%if (!errorMessage.equals("")) {%>
							<tr><td>&nbsp;</td>
								<td colspan=2><strong style='color:red'><%=errorMessage%></strong></td>
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
<%
		switch(nRetCode) {
			case -1:
		   		out.print("alert('"+xmlreader.getLangByKey(g_sLanguage, "F_PIN_ALERT_PIN_SENT")+" ["+ sEmail +"]');");
		   		out.println("	this.location.href='" + "http://"+request.getServerName()+":"+request.getServerPort() + g_sPath + "/cliForgetPIN.jsp?secure=C'");
		   		break;
		   	case -3:
			 	out.print("alert('"+xmlreader.getLangByKey(g_sLanguage, "F_PIN_ALERT_PIN_HINT_UNMATCH")+"');");
		   		break;
		   	case -4:
			 	//out.print("alert('"+xmlreader.getLangByKey(g_sLanguage, "F_PIN_ALERT_RETYPE_ID")+"');");
			 	out.println("	alert('"+xmlreader.getLangByKey(g_sLanguage,"ALERT_PLEASE_LOGIN")+"');");
			 	out.println("	self.close();");
//			 	out.println("	this.parent.location.href='"+oN2NSession.getSetting("HTMLRootHome")+"/session-expired'");
			 	session.invalidate();
		   		break;
		   	case -5:
			 	out.print("alert('"+xmlreader.getLangByKey(g_sLanguage, "F_PIN_ALERT_EMAIL_NOT_EXIST")+"');");
	     		break;
	     	default:
	     		break;
	  	}
	
		if (nRetCode != -1) {
			out.print("document.frmForgetPhonePIN.txtHintAns.focus();");
  		} else if (nRetCode!= -4) {
  			//out.println("if((parent.location.href).indexOf('cliForgetPIN.jsp') != -1) {");
  			out.println("if((this.location.href).indexOf('cliForgetPIN.jsp') != -1) {");
  			out.println("	self.close();");
  			/*out.println("} else {");
         	out.println("	parent.closeit();");
         	*/
         	out.println("}");
  		}
%>
}

function btnCancel_onClick() {
	this.location.href='<%=oN2NSession.getSetting("HTMLRoot") + g_sPath%>/cliForgetPIN.jsp?secure=C';
}
</script>
<%  }//End if (sSecure.compareToIgnoreCase("C") == 0) { 
	}// End of if ( sLoginID.equals("") 
%>