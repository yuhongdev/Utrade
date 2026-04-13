<%@ page import = "java.sql.*, java.lang.*, java.util.Date, java.text.SimpleDateFormat" %>
<%@ include file='common.jsp'%>
<%!

	public String replaceAllChar(String str, String ch, String ch2) {
			
			String strs_srch = str;
			int iloop = 1;
			
			if ((strs_srch != null) && (ch != null) && (ch2 != null)) {
					if ((strs_srch.length()>0) && (ch.length()>0) && (ch2.length()>0)) {
							while (iloop==1) {
									if (strs_srch.indexOf(ch) > -1) {
											strs_srch = strs_srch.replaceAll(ch, ch2);
									} else {
											iloop = 0;
									}
							}
					}
			}
			
			return strs_srch;
	}

%>
<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<jsp:useBean id="clibean" class="com.n2n.bean.N2NMFCliInfoBean" scope="page"/>
<jsp:setProperty name="clibean" property="*" />
<%
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Pragma", "no-cache");

	String sLoginID = "", sHint = "", sHintAns = "", sStatus = "";
	String sSecure = request.getParameter("secure");
	String errorMessage = "";
	String sEmail = "", sNewPwdPIN = "";
	int nRetCode = 9;
	sSecure = sSecure != null ? sSecure : "N";
	String atpURL = session.getAttribute("ATPURLpublic")!=null?session.getAttribute("ATPURLpublic").toString().trim():oN2NSession.getSetting("atpURL");
	com.n2n.util.N2NATPConnect atp = new com.n2n.util.N2NATPConnect(atpURL);
	com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();	

  	//sLoginID = request.getParameter("txtLoginID");
  	//sHint    = request.getParameter("txtHint");
  	//sHintAns = request.getParameter("txtHintAns");
  
  	if (sSecure.compareToIgnoreCase("N") == 0) {
  		out.println("<script language='javascript'>");
  		out.println("	parent.resizeIFrame(420,225);");
  		out.println("	this.location.href='" + oN2NSession.getSetting("HTMLRoot") + g_sPath + "/cliForgetPwd.jsp?secure=Y'");
  		out.println("</script>");
  	} else if (sSecure.compareToIgnoreCase("C") == 0) {
  		out.println("<script language='javascript'>");
  		out.println("	parent.closeit();");
  		out.println("</script>");  		
  	} else {
  	
	  	sLoginID = clibean.getLoginID();
	  	sHint    = clibean.getHint();
	  	sHintAns = clibean.getHintAns();
	  
	  	if ( sLoginID == null ) sLoginID = "";
	  	if ( sHint == null )    sHint    = "";
	  	if ( sHintAns == null ) sHintAns = "";
	  
		if (!sLoginID.equals("")) {
			 
			if (sHint.equals("")) {
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
				       	sStatus = results[25]!=null?results[25].toString().trim():"";
				       	if(sStatus.compareToIgnoreCase("A") == 0) {
	       					sHint 		= results[14];
	       					sHint = replaceAllChar(sHint,"\"","&#34;");
				       		clibean.setHint(sHint);
				       	}
    				}

    				if(sStatus.compareToIgnoreCase("P") == 0) {
    					//Account not yet activated - pending user
    					nRetCode = -6;
    				}
    				else if ( sHint.equals("") ) {
    				    // LoginID not found
    				    nRetCode = -4;
    				}    				
    			} else {
    				System.out.println("error in getCliInfo during cliForgetPwd.jsp:"+context.getErrorMsg());
					checkATPSession(context.getErrorMsg(),oN2NSession,session,out,"Forget Password",atp,g_sLoginId,m_sLang);
					out.println("<script language='javascript'>");
					out.println("location.href='"+oN2NSession.getSetting("HTMLRoot")+oN2NSession.getSetting("projectFolder")+"/cliForgetPwd.jsp?secure=Y'");
					out.println("</script>");
    				// session invalid
    			} 	
    			
			 } else if (!sHintAns.equals("")) {
				   
				String []saResult = new String[2];
				   
				clibean.setLoginID(sLoginID);
				clibean.setHint(sHint);
				clibean.setHintAns(sHintAns);
				 
    			context = atp.verifyHintPwdPIN("1", clibean, oN2NSession.getSetting("tradeforgetpinpwdID"));
    			java.util.List resultList = new java.util.ArrayList();
    			String results[] = null;
    			if (context.getErrorMsg().equals("")) {
    				resultList = context.getResultsList();
    				if (resultList!=null && resultList.size() > 0) {
    					results = (String[])resultList.get(0);
    			    	sEmail     = results[0]!=null?results[0].toString().trim().substring(1):""; //out.print(sEmail);
                  		sNewPwdPIN = results[1]; //out.print(sNewPwdPIN);
	    				   
	    				if ( (!sNewPwdPIN.equals("")) ) {
	    	             	    				       
	    				    if (sNewPwdPIN.equals("0")) {
	    				    	// Hint and HintAns not match
	    				        nRetCode = -3;
	    				    } else if ( (!sEmail.equals("")) && (!sEmail.equals("null")) ) {
	    				        // Successful, Email sent
	    				        //String m_sWebEmail  = oN2NSession.m_sWebEmail;
	    			            String m_sWebEmail  = oN2NSession.getSetting("WebEmail");
	    				        String m_sWebBHCode = oN2NSession.m_sWebBHCode;
	    				        sNewPwdPIN  += "^";   
	    				        int m_nRet = -1;
	    						String m_AppOptIntranet = oN2NSession.getSetting("AppOptIntranet");
	    				        String intranetExistValue = "Y";
	    				        if(intranetExistValue.equalsIgnoreCase(m_AppOptIntranet)) {
									context = atp.mfMsgRegisterMail("P","E",m_sWebEmail,sEmail,24,sNewPwdPIN,m_sWebBHCode,"","N","","","",oN2NSession.getSetting("tradeforgetpinpwdID"));
									if (context!=null) {
										if (context.getErrorMsg()!=null && !context.getErrorMsg().equals("")) {
											errorMessage = context.getErrorMsg();
										} else {
											nRetCode = -1;		
										}
									}	    					     	
	    					    } else {        
									context = atp.mfMsgRegisterMail("P","E",m_sWebEmail,sEmail,20,sNewPwdPIN,m_sWebBHCode,"","N","","","",oN2NSession.getSetting("tradeforgetpinpwdID"));
									if (context!=null) {
										if (context.getErrorMsg()!=null && !context.getErrorMsg().equals("")) {
											errorMessage = context.getErrorMsg();
										} else {
											nRetCode = -1;		
										}
									}	    					    	
	    					    }     
	    				    } else {
	    				        // Email is missing
	    					    nRetCode = -5;
	    				    }
	    				}
	    				
    				}
    			} else {
    				System.out.println("error in getCliInfo during cliForgetPwd.jsp:"+context.getErrorMsg());
				checkATPSession(context.getErrorMsg(),oN2NSession,session,out,"Forget Password",atp,g_sLoginId,m_sLang);
				out.println("<script language='javascript'>");
				out.println("location.href='"+oN2NSession.getSetting("HTMLRoot")+oN2NSession.getSetting("projectFolder")+"/cliForgetPwd.jsp?secure=Y'");
				out.println("</script>");
    				// session invalid
    			}
	     	}
		}
%>
<script language=JavaScript src="<%=g_sJSPath%>/N2NFunc.js"></script>
<SCRIPT language=javascript src="<%=g_sJSPath%>/main.js"></SCRIPT>
<script language=JavaScript src="<%=g_sJSPath%>/popupWindow.js"></script>
<script language=JavaScript>
//parent.resizeIFrame(420,225);
/*resizeIFrame(420,225);
function resizeIFrame(vnWidth, vnHeight) {
	try {
		document.getElementById("dwindow").style.height = vnHeight + "px";
		document.getElementById("dwindow").style.width = vnWidth + "px";
	} catch(e) {
		alert(e);
	}
}*/
function checkRequiredFields(oField) {
	var fieldNames;
	if (oField[1] == "")
		fieldNames = new Array('User ID');
	else
		fieldNames = new Array('User ID', 'Hint to Password', 'Answer to Hint');

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
		if (oField[0] == "")
		 document.frmForgetPwd.loginID.focus();
		else
		 document.frmForgetPwd.txtHintAns.focus();
		
		alert(fieldsNeeded);
	}
	return fieldCheck;
}

function entryVerify(voFrm) {
	var oField = new Array("loginID", "hint", "hintAns");
	
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

function frmSubmit(voFrm) {
	voFrm.hint.value = ""
	voFrm.hintAns.value = ""

	if (entryVerify(voFrm))
		 voFrm.submit();
}
</script>

<html>
<head>
<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
<title>Forgot Password</title>
</head>

<body onload=Body_OnLoad() style="MARGIN: 4px 0px 0px 5px;BACKGROUND:#FFFFFF">
<table border=0 cellPadding=0 cellSpacing=0 width=400>
	<tr><td>
		<table border=0 cellpadding=0 cellspacing=0 width='100%'>
			<tr><td width='6%' class=clsSectionHeader>&nbsp;</td>
				<td width='80%' class=clsSectionHeader>FORGOT PASSWORD</td>
				<td width='14%' class=clsSectionHeader>&nbsp;</td></tr>
		</table>
	</td></tr>
	<tr><td>
		<table border=1 cellpadding=0 cellspacing=0 width='100%'>
			<tr><td>
				<table border=0 cellpadding=1 cellspacing=1 width='100%'>
					<tr><td width='6%'>&nbsp;</td>
						<td width='88%' class=fntInfoMsgLeft align=left colspan=2>Please provide an answer to your hint. A six digits numeric code will be sent over to you, please login using this code.<br/><br/></td>
						<td width='6%'>&nbsp;</td></tr>
					<tr><td width='6%'>&nbsp;</td>
						<td width='28%' class=fntInputMsg>User ID</td>
						<td width='60%'>
							<form id=frmForgetPwd name=frmForgetPwd action="cliForgetPwd.jsp" method=post onsubmit="return entryVerify(this);">
							<input id=loginID name=loginID class=inputField maxlength=20 size=20 value='<%=sLoginID%>' autocomplete=off />
							<input type=button value='Retrieve Hint' onclick='frmSubmit(document.frmForgetPwd)'/></td>
						<td width='6%'>&nbsp;</td></tr>
					<tr><td>&nbsp;</td>
						<td class=fntInputMsg>Hint to Password</td>
						<td colspan=2><input id=txtHint name=hint class=inputField maxlength=50 size=50 value="<%=sHint%>" readonly/></td>
						<td>&nbsp;</td></tr>
					<tr height=30><td>&nbsp;</td>
						<td class=fntInputMsg>Answer to Hint</td>
						<td colspan=2><input id=txtHintAns name=hintAns class=inputField maxlength=20 size=20 value='<%=sHintAns%>' autocomplete=off <%if (sHint == "") {out.print("disabled=true");}%>/><input type='hidden' name='secure' value='<%=sSecure%>'></td>
						</tr>
					<tr><td>&nbsp;</td>
						<td colspan=2><hr width='100%'></td>
						<td>&nbsp;</td></tr>
					<tr height=25><td>&nbsp;</td>
						<td>&nbsp;</td>
						<!--<td><input type=submit value='Submit'<%if (sHint == "" ) { out.print("disabled=true"); }%>>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" name="Cancel" value="Cancel" onclick="javascript:parent.closeit();"></td>-->
						<td><input type=submit value='Submit'<%if (sHint == "" ) { out.print("disabled=true"); }%>>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--<input type="button" name="Cancel" value="Cancel" onclick="javascript:btnCancel_onClick();">--></td>
						<td>&nbsp;</td></tr>
						  </form>
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
		    out.print("alert('Your password has been sent to your e-mail account ["+ sEmail +"]');window.close();");
//		    out.print("alert('Your password has been sent to your e-mail account ["+ sEmail +"]');");
//	  		out.println("	this.location.href='" + oN2NSession.getSetting("HTMLRoot") + g_sPath + "/cliForgetPwd.jsp?secure=C'");
		    break;
		case -3:
			out.print("alert( 'Password hint does not match');");
		    break;
		case -4:
			out.print("alert('Please retype your User ID');");
		    break;
		case -5:
			out.print("alert('Your email address does not exists in our database, please call CSR.');");
	     	break;
		case -6:
			out.print("alert('Your account not yet been activated, please call CSR.');");
	     	break;
	    default:
	     	break;
	}

	if (nRetCode != -1) {
	%>
	if (document.frmForgetPwd.loginID.value == "" || document.frmForgetPwd.hintAns.disabled) {
			document.frmForgetPwd.loginID.focus();
	} else {
			document.frmForgetPwd.hintAns.focus();
	}
	
	<%
  	} //else {
  			//out.print("parent.closeit();");
  	//}
	%>
}

function btnCancel_onClick() {
	this.location.href = '<%=oN2NSession.getSetting("HTMLRoot") + g_sPath%>/cliForgetPwd.jsp?secure=C';
	//parent.close();
}
</script>
<%	}%>