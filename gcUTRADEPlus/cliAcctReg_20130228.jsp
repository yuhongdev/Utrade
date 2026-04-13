<%@ page import = "java.sql.*, java.lang.*, java.util.Date, java.text.SimpleDateFormat, com.n2n.util.N2NConst" %>
<%@ include file='common.jsp'%>

<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<jsp:useBean id="clibean" class="com.n2n.bean.N2NMFCliInfoBean" scope="page"/>
<jsp:setProperty name="clibean" property="*" />

<html>
<head>
	<META content="-1" http-equiv="Expires">
	<META content="no-cache" http-equiv="Pragma">
	<META content="no-cache" http-equiv="Cache-Control">	
	<link rel=stylesheet type=text/css href=<%=g_sStylePath%>/default.css>
	<title><%=oN2NSession.getSetting("WebSiteName")%> Registration Page</title>
	<script language=JavaScript src="<%=g_sJSPath%>/N2NCtrl.js"></script>
	<script language=JavaScript src="<%=g_sJSPath%>/email.js"></script>
</head>

<%
	//oN2NSession.N2NCheckMinSecLevel(request,response,2);

	String clientType = request.getParameter("clientType").substring(0,1); //E=Existing, N=New
	clientType = clientType != null ? clientType : "";

	String category = request.getParameter("category").substring(0,1); //M=individual, C=Corporate, D=Dealer
	category = category != null ? category : "";
	
	String exchCodeList = request.getParameter("exchCodeList"); // E=equity, D=derivatives
	exchCodeList = exchCodeList != null ? exchCodeList : "";
	
	boolean bIndCli = false, bCorpCli = false, bDealer = false;
	boolean bNewCli = false, bExistCli = false;
	
	if (category.equals(N2NConst.CLI_CATEGORY_MEMBER)) {
		bIndCli = true;
	} else if (category.equals(N2NConst.CLI_CATEGORY_CORPORATE)) {
		bCorpCli = true;
	} else if(category.equals(N2NConst.CLI_CATEGORY_DEALER)) {
		bDealer = true;
	}
	
	if (clientType.equals(N2NConst.CLI_TYPE_NEW)) {
			bNewCli = true;
	} else if (clientType.equals(N2NConst.CLI_TYPE_EXISTING)) {
			bExistCli = true;
	} else {
			bIndCli   = false;
			bCorpCli  = false;
			bNewCli   = false;
			bExistCli = false;
			bDealer = false;
	}
	
	String sErrMsg = "";
	String sSuccMsg = "";
	String sClass = "";
	String [] saResult = new String[2];
	
	//System.out.println("LoginID: " + clibean.getLoginID());
	Date dtNow = new Date();

	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				
	if (clibean.getLoginID().trim().length() > 0) {
	
		//start insert record to DB
		//usp_mfInsNewCli
		cli.init(oN2NSession);
		saResult = cli.insertNewCliWS(clibean,oN2NSession);
		
		if (saResult != null) {
			if (saResult[0].length() == 0) {
			
				sClass = "clsNoErrorMsg";
				
				sSuccMsg = "Thank you " + clibean.getTitleDesc() + " " + clibean.getCliName() + ". Your registration has been ";
				sSuccMsg += "submitted. In a few minutes, you will receive a validation email detailing ";
				sSuccMsg += "how you can validate your registration. Please follow the instructions within ";
				sSuccMsg += "3 days of receiving the email. If you do not validate your registration, you ";
				sSuccMsg += "will not be able to access to "+ oN2NSession.getSetting("WebSiteName")+".\\n\\nThe email will be sent to ";
				sSuccMsg += clibean.getEmail();
				
				out.print("<SCRIPT LANGUAGE='JavaScript'>");
				out.print("location.href='" + oN2NSession.getSetting("HTMLRoot") + request.getContextPath() );
				out.print("/msgRegSucc.jsp?clientType=" + clibean.getClientType() + "&category=" + clibean.getCategory());
				out.print("&name=" + clibean.getTitleDesc() + " " + clibean.getCliName() + "&email=" + clibean.getEmail() + "';");
				
				clibean.reset();
				out.println("</SCRIPT>");
				
			} else {
				sClass = "clsErrorMsg";
				sErrMsg = "Error: " + saResult[0];				
			}
		}
		
	} // End of if (clibean.getLoginID().trim().length() > 0)
%>

<body onload='Body_onLoad()' class='clsBody'>

<table border=0 cellPadding=0 cellSpacing=0 width='100%'>
<form id="frmUserReg" name="frmUserReg" action="cliAcctReg.jsp?clientType=<%=clientType%>&category=<%=category%>&exchCodeList=<%=exchCodeList%>" method="post" onsubmit="javascript:return VerifyControl();">
	<tr>
		<td>
		<table border=0 cellPadding=0 cellSpacing=0>
			<tr height=20>
				<td width='80%' colspan=5 class=clsCliHeader>
				<table border=0 cellpadding=0 cellspacing=0 width='100%' height='100%'>
<%	
	if (sErrMsg.length() > 0) {	
%>
					<tr>
						<td width='94%' class=<%=sClass%>>&nbsp;&nbsp;<%=sErrMsg%></td>
					</tr>
<%	
	}	
%>				
					<tr>
						<td width='100%' class=clsCliHeader>
						<%=bCorpCli?"Corporate":"Personal"%> Information
						</td>
					</tr>
				</table>
				</td>
			</tr>
			<tr><td colspan=5><img src='<%=g_sImgPath%>/empty.gif' height=3></td></tr>
			
			<tr height=20>
				<td width='25%' class=clsCliDtlLbl>Refer By</td>
				<td width='3%'>&nbsp;</td>
				<td width='72%' colspan=3>
				<select id=refBy name=refBy style='width:280px;height:20px' OnChange='selRefBy_OnChange();'>
					<option value=''>Select From List
					<option value='C1' <%if((clibean.getRefBy()).equals("C1")){out.print("selected");}%>><%out.print(oN2NSession.getSetting("WebBHName"));%> - Central Dealing Team</option>
					<option value='C' <%if((clibean.getRefBy()).equals("C")){out.print("selected");}%>><%out.print(oN2NSession.getSetting("WebBHName"));%> - Remisier/Dealer</option>
					<option value='E' <%if((clibean.getRefBy()).equals("E")){out.print("selected");}%>>CIMB Bank Berhad</option>
					<option value='N' <%if((clibean.getRefBy()).equals("N")){out.print("selected");}%>>N2N Connect</option>
				</select>&nbsp;
				<span id=spanRefByBH style='display:none'>Remisier/Dealer: <input id=refByUid name=refByUid maxlength=50 size=50 style='width:160px' value='<%=clibean.getRefByUid()%>'></span>
				</td>
			</tr>
			
			<tr height=20>
				<td width='25%' class=clsCliDtlLbl>Preferred Broking Branch</td>
				<td width='3%'>&nbsp;</td>
				<td width='72%' colspan=3>
				<html:N2N_HtmlObject type="select" objectName="defBhBranch" fieldName="BHBranch, BHShtName"
					table="vw_mfBHInfo" condition="BHCode='065' order by BHBranch asc" fieldValue="BHBranch" fieldLabel="BHShtName" 
					style="HEIGHT:20px;WIDTH:150px" defaultValue="<%=clibean.getDefBhBranch()%>"/>
				</td>
			</tr>
	
			<%	if(bExistCli && bIndCli) {%>			
			<tr height=20>
				<td class=clsCliDtlLbl>
				Trading Account
				</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				<INPUT class=clsCliDtlInput id=bhCliCode name=bhCliCode size=15 maxlength=7 style='WIDTH:150px;HEIGHT:20px' onkeypress="window.event.keyCode = AlphaNumberCtrl(window.event.keyCode)" value='<%=clibean.getBhCliCode()%>'>
				</td>
			</tr>
			<% } %>

			<% if((bIndCli && bNewCli) || (bIndCli && bExistCli) || (bNewCli && bDealer)){ %>
			<tr height=20>
				<td width='25%' class=clsCliDtlLbl>
				Name (As per NRIC)
				</td>
				<td width='3%'>&nbsp;</td>
				<td width='72%' colspan=3>
					
					<html:N2N_HtmlObject type="select" objectName="title" fieldName="LinkCode,Description"
					table="vw_mfRef" condition="Type='title'" fieldValue="LinkCode" fieldLabel="Description"
					onChangeEvent="title_OnChange()" style="width:150px;height=50" defaultValue="<%=clibean.getTitle()%>"/>
					
					<INPUT class=clsCliDtlInput id=cliName name=cliName maxlength=50 size=50 style='width:247px;height:20px' value="<%=clibean.getCliName()%>">
				</td>
			</tr>
			
			<tr height=20>
				<td width='25%' class=clsCliDtlLbl>Nationality</td>
				<td width='3%'>&nbsp;</td>
				<td width='72%' colspan=3 class=clsCliDtlInput>
				<html:N2N_HtmlObject type="select" 
					objectName="citizenShip" fieldName="LinkCode,Description"
					table="MF_Ref" condition="Type='country' order by Description asc" fieldValue="LinkCode" fieldLabel="Description" 
					onChangeEvent="citizenShip_OnChange()" style="HEIGHT:20px;WIDTH:400px" defaultValue="<%=clibean.getCitizenShip()%>"/>
				</td>
			</tr>
			<tr width='25%' id=tblPassport height=20 <%=clibean.getCitizenShip().compareToIgnoreCase("MY")!=0 ? "" : "style='display:none'"%>>
				<td class=clsCliDtlLbl>Passport</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3><INPUT class=clsCliDtlInput  id=passport name=passport size=15 maxlength=15 style="WIDTH:120px;HEIGHT:20px" value="<%=clibean.getPassport()%>"></td>
			</tr>
			<tr id=tblNRIC height=20 <%=clibean.getCitizenShip().compareToIgnoreCase("MY")==0 ? "" : "style='display:none'"%>>
				<td class=clsCliDtlLbl align=right>NRIC</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
					<input class=clsCliDtlInput id=icNo name=icNo maxLength=12  size=12 style="width:150px;height:20px" onkeypress="window.event.keyCode=NumberCtrl(window.event.keyCode)" value="<%=clibean.getIcNo()%>">
					<font color=#ff0000> or Old (Optional)
						<input class=clsCliDtlInput id=oldIcNo  name=oldIcNo maxLength=9 size=9 style="width:93px;height:20px" value="<%=clibean.getOldIcNo()%>">
					</font>
				</td>
			</tr>
			
			<tr height=20>
				<td class=clsCliDtlLbl>
				Gender
				</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				<table border=0 cellpadding=0 cellspacing=0 width='100%'>
					<tr>
						<td width='23%'>
						<input class=clsCliDtlInput id=sex name=sex type=radio maxLength=1  size=1 value=M style="width:20px;height:20px ; valign=middle" <% if(clibean.getSex().equalsIgnoreCase("M")) out.println("CHECKED"); %>>Male
						<input class=clsCliDtlInput id=sex name=sex type=radio maxLength=1  size=1 value=F style="width:20px;height:20px; valign=middle" <% if(clibean.getSex().equalsIgnoreCase("F")) out.println("CHECKED"); %>>Female</td>
						<td class=clsCliDtlLbl colspan=3></td>
						
						<td class=clsCliDtlLbl width='11%'>Race</td>
						<td width='4%'>&nbsp;</td>
						<td width='62%'>
							<input class=clsCliDtlInput id=race name=race type=radio maxLength=1  size=1 value=M style="width:20px;height:20px ; valign=middle" <% if(clibean.getRace().equalsIgnoreCase("B")) out.println("CHECKED"); %>>Bumiputra
							<input class=clsCliDtlInput id=race name=race type=radio maxLength=1  size=1 value=C style="width:20px;height:20px; valign=middle" <% if(clibean.getRace().equalsIgnoreCase("C")) out.println("CHECKED"); %>>Chinese
							<input class=clsCliDtlInput id=race name=race type=radio maxLength=1  size=1 value=I style="width:20px;height:20px; valign=middle" <% if(clibean.getRace().equalsIgnoreCase("I")) out.println("CHECKED"); %>>Indian						<input class=clsCliDtlInput id=race name=race type=radio maxLength=1  size=1 value=O style="width:20px;height:20px; valign=middle" <% if(clibean.getRace().equalsIgnoreCase("O")) out.println("CHECKED"); %>>Others
						</td>
					</tr>
				</table>
				</td>
			</tr>
			
			<% 	if(bNewCli && !bDealer) { %>
			<tr id=tblDOB height=20>
				<td class=clsCliDtlLbl>
				Date Of Birth
				</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
					<table border=0 cellpadding=0 cellspacing=0>
						<tr>
							<td align=left>
							<%
							String [] sdtTemp = null;
							String dt_year = "";
							
							String dt_words = clibean.getDob();
							
							if ((dt_words!=null)&&(dt_words.length()==10)) {
									sdtTemp = dt_words.split("-");
									dt_year = sdtTemp[0];
									if (dt_year.length()==4)
											dt_words = sdtTemp[2] + "-" + sdtTemp[1] + "-" + sdtTemp[0];
									else
											dt_words = clibean.getDob();
							} else {
									dt_words = clibean.getDob();
							}
							%>
							<html:N2N_HtmlObject type="dobCalendar" objectName="frmUserReg.dob" defaultValue="<%=dt_words%>"/>
							You must be at least 18 years old. The format is dd/mm/yyyy 
							</td>
						</tr>
					</table>
				</td>
			</tr>
			<%}%>
			
			<tr height=20>
				<td class=clsCliDtlLbl>
				Email
				</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3><INPUT id=email name=email maxLength=40  size=40 style="width:200px;height:20px" onkeypress="window.event.keyCode = EmailCtrl(window.event.keyCode)" value="<%=clibean.getEmail()%>">&nbsp; eg. abc@def.com.my</td>
			</tr>
			
			<% 	if(bNewCli && !bDealer) { %>
			<tr id=tbladdr1 height=20>
				<td class=clsCliDtlLbl>
				Address
				</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3><INPUT id=add1 name=add1 maxLength=120 size=120 style="width:400px;" value="<%=clibean.getAdd1()%>"></td>
			</tr>
			<tr id=tbladdr2 height=20>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3><INPUT id=add2 name=add2 maxLength=120 size=120 style="width:400px;" value="<%=clibean.getAdd2()%>"></td>
			</tr>	

			<tr id=tblcity height=25>
				<td class=clsCliDtlLbl>State</td>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				<table border=0 cellpadding=0 cellspacing=0 width='100%'>
					<tr>
						<td width='23%'>
						<html:N2N_HtmlObject type="select" 
							objectName="state" fieldName="LinkCode,Description"
							table="vw_mfRef" condition="Type='state'" fieldValue="LinkCode" fieldLabel="Description" onChangeEvent="state_OnChange()" className="clsCliDtlInput"
							style="width:150px;height=20px" defaultValue="<%=clibean.getState()%>"/>
							<INPUT class=clsCliDtlInput id=otrState name=otrState maxlength=20 size=20 style="width:150px;height:20px;<%=clibean.getState().compareToIgnoreCase("OTR") != 0 ? "display:none" : ""%>" value='<%=clibean.getOtrState()%>'>
						
						<td class=clsCliDtlLbl colspan=3></td>
						<td class=clsCliDtlLbl width='11%'>Postcode</td>
						<td width='4%'>&nbsp;</td>
						<td width='62%'>
							<input class=clsCliDtlInput id=postcode name=postcode maxLength=6 size=9 style="width:86px;height:20px" value="<%=clibean.getPostcode()%>">
						</td>
					</tr>
				</table>
				</td>
			</tr>
			
			<tr id=tblCountry height=20>
				<td class=clsCliDtlLbl>
				Country
				</td>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
					
					<html:N2N_HtmlObject type="select" 
						objectName="country" fieldName="LinkCode,Description"
						table="vw_mfRef" condition="Type='country' order by Description asc" fieldValue="LinkCode" fieldLabel="Description" 
						onChangeEvent="citizenShip_OnChange()" style="HEIGHT:20px;WIDTH:400px" defaultValue="<%=clibean.getCountry()%>"
					/>
					
				</td>
			</tr>
			<%}%>
			
			<tr height=20>
				<td class=clsCliDtlLbl>Phone</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				<table border=0 cellpadding=0 cellspacing=0 width='100%'>
					<tr>
						<td width='23%'>
						<input class=clsCliDtlInput id=telno1 name=telno1 maxlength=4 style="width:40px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)" value="<%=clibean.getTelno1()%>">&nbsp;- 
						<input class=clsCliDtlInput id=telno  name=telno  maxlength=8 style="width:70px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)" value="<%=clibean.getTelno()%>">
						<td class=clsCliDtlLbl colspan=3></td>
						
						<td class=clsCliDtlLbl width='15%'>Mobile Phone</td>
						<td width='4%'>&nbsp;</td>
						<td width='62%'>
							<input class=clsCliDtlInput id=mobile1 name=mobile1 maxlength=4 style="width:40px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)" value="<%=clibean.getMobile1()%>">&nbsp;- 
							<input class=clsCliDtlInput id=mobile name=mobile maxlength=8 style="width:70px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)" value="<%=clibean.getMobile()%>">
						</td>
					</tr>
				</table>
				</td>
			</tr>

			
			<% } else if(bCorpCli) { /*if is corporate client(new or existing)*/%>
			<%@ include file='cliCorpAcctReg.jsp'%>
			<% } %>
<!-- Login Information -->

			<tr height=20>
				<td colspan=5 class=clsCliHeader>
				<table border=0 cellpadding=0 cellspacing=0 width='100%' height='100%'>
					<tr>
						<td width='100%' class=clsCliHeader>
						Login Information
						</td>
					</tr>
				</table>
				</td>
			</tr>
			
			<tr height=30>
				<td class=clsCliDtlLbl>
				User ID
				</td>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				<table border=0 cellspacing=0 cellpadding=0>
					<tr>
						<td style="width:170px"><INPUT class=clsCliDtlInput id=loginID name=loginID maxLength=15  size=15 style="width:150px;height:20px" onkeypress="window.event.keyCode = UserIDCtrl(window.event.keyCode)" value="<%=clibean.getLoginID()%>"></td>
						<td>User ID should be at least 6 characters in length. User ID should not be the same as Password </td>
					</tr>
				</table>
				</td>
			</tr>
			
			<tr height=30>
				<td class=clsCliDtlLbl>Password</td>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				<table border=0 cellspacing=0 cellpadding=0>
					<tr>
						<td style="width:170px">
							<INPUT class=clsCliDtlInput type=password id=pwd name=pwd maxLength=12 size=12 style="width:150px;height:20px">
						</td>
						<td>Password should contain alphabets and numerals and be at least 6 characters in length eg. ABCD99  </td>
					</tr>
				</table>
				</td>
			</tr>
			
			<tr height=20>
				<td class=clsCliDtlLbl>Re-type Password</td>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
					<INPUT class=clsCliDtlInput type=password id=txtConfirmed name=txtConfirmed maxLength=12  size=12 style="width:150px;height:20px">
				</td>
			</tr>
			
			<tr height=20>
				<%	if(bIndCli) {%>
				<td class=clsCliDtlLbl>Trading PIN</td>
				<% } else {%>
					<td class=clsCliDtlLbl>PIN</td>
				<%}%>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				<table border=0 cellspacing=0 cellpadding=0>
					<tr>
						<td style="width:170px">
							<INPUT class=clsCliDtlInput type=password id=pin name=pin maxLength=6 size=12 style="width:150px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)">
						</td>						
						<td>PIN is a 6 digit number. eg. 883388 </td>
					</tr>
				</table>
				</td>
			</tr>
			
			<tr height=20>
				<%	if(bIndCli) {%>
				<td class=clsCliDtlLbl>Re-type Trading PIN</td>
				<% } else {%>
					<td class=clsCliDtlLbl>Re-type PIN</td>
				<%}%>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
					<INPUT type=password id=txtConPIN name=txtConPIN maxLength=6 size=12 style="width:150px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)">
				</td>
			</tr>
			
			<tr height=25>
				<td class=clsCliDtlLbl>
				Hint for Forgotten Password/PIN
				</td>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				
				<select name=hintType id=selCliRegHint style='width:150px' OnChange='selCliRegHint_OnClick()'>
						<option value='OTR' <%=(clibean.getHintType().compareToIgnoreCase("OTR")==0 || clibean.getHintType().equalsIgnoreCase("")) ? "selected" : ""%>>My own question</option>
						<option value='Mother maiden name' <%=clibean.getHintType().compareToIgnoreCase("Mother maiden name") == 0 ? "selected" : ""%>>
							Mother maiden name</option>
						<option value='My favourite cartoon' <%=clibean.getHintType().compareToIgnoreCase("My favourite cartoon") == 0 ? "selected" : ""%>>
							My favourite cartoon</option>
						<option value='My favourite car' <%=clibean.getHintType().compareToIgnoreCase("My favourite car") == 0 ? "selected" : ""%>>
							My favourite car</option>
						<option value='Name of my pet' <%=clibean.getHintType().compareToIgnoreCase("Name of my pet") == 0 ? "selected" : ""%>>
							Name of my pet</option>
				</select>
				
				<INPUT class=clsCliDtlInput id=hint name=hint maxLength=50  size=50 style="width:200px;height:20px" onkeypress="window.event.keyCode = CheckWierdCharCtrl(window.event.keyCode)" value='<%=clibean.getHint()%>' <%=(clibean.getHintType().equalsIgnoreCase("OTR") || clibean.getHintType().equalsIgnoreCase("")) ? "" : "style='display:none'"%>></td>
			</tr>
			
			<tr height=30 valign=top>
				<td class=clsCliDtlLbl>Answer to your hint</td>
				<td class=clsCliDtlLbl>&nbsp;
					
					<input type='hidden' name='titleDesc'  id='titleDesc'  value= '<%=clibean.getTitleDesc()%>'>
					<input type='hidden' name='status'     id='status'     value= 'S'>
					<input type='hidden' name='defPrtf'    id='defPrtf'    value= '1'>
					<input type='hidden' name='nomineeCli' id='nomineeCli' value= 'N'>
					<input type='hidden' name='defBhCode'  id='defBhCode'  value= '065'>					
					<input type='hidden' name='category'   id='category'   value= '<%=category%>'>
					<input type='hidden' name='clientType' id='clientType' value= '<%=clientType%>'>
					<input type='hidden' name='exchCodeList' id='exchCodeList' value= '<%=exchCodeList%>'>
					
				</td>
				<td class=clsCliDtlInput colspan=3>
				<table border=0 cellPadding=0 cellSpacing=0 width="100%">
					<tr>
						<td width=60% class=clsCliDtlInput>
						<input class=clsCliDtlInput id=hintAns name=hintAns maxLength=20 size=20 style="width:150px;height:20px" onkeypress="window.event.keyCode = CheckWierdCharCtrl(window.event.keyCode)" value='<%=clibean.getHintAns()%>'>
						</td>
						<td width=20% class=clsCliDtlLbl align=right>
						<input type=submit name=btnSubmit style="width:80px; CURSOR: hand" title="Submit for registration" value=Submit>
						</td>
			</form>
						<td width=20% class=clsCliDtlLbl>
						<input type=button name=btnClose onclick='window.close();' style="width:80px; CURSOR: hand" title="Close" value=Close>
						</td>
						
					</tr>
				</table>
				</td>
			</tr>
			
			<tr class=clsCliHeader><td width='100%' class=clsCliDtlInput colspan=5><img width=4 height=4 src='<%=g_sImgPath%>/empty.gif'></td></tr>
		</table>
		</td>
	</tr>
	
	<tr><td>&nbsp;</td></tr>
</table>

</body>
</html>

<script language="JavaScript">
var m_nSubmitCount = new Number(0);
function Body_onLoad() {
	
	frm = document.frmUserReg;

	if (document.frmUserReg.defBhBranch[0].value == "") {
		document.frmUserReg.defBhBranch[0].text = "Select From List";
	}

	<% if(bIndCli || (bNewCli && bExistCli)){ 
	/*if is individual client(new or existing) or new remisier or existing AmSec client*/%>
	if (document.frmUserReg.title[0].value == "") {
		document.frmUserReg.title[0] = null;
		//document.frmUserReg.title.selectedIndex = 0;
	}
	
	if (document.frmUserReg.title.selectedIndex == -1) {
		document.frmUserReg.title.selectedIndex = 0;
	}
	
	//for (i = 0; i < document.frmUserReg.title.length; i++) {
	//	document.frmUserReg.title[i].text = document.frmUserReg.title[i].text.replace(".", "");
	//}
	<% } %>
	
	
	<% if(bIndCli || bDealer) { %>
	//Nationality
	if (document.frmUserReg.citizenShip.selectedIndex == 0) {
		document.frmUserReg.citizenShip.value = "MY";
		citizenShip_OnChange();
	}
	<%}%>
	
	<% if(bIndCli && bNewCli || bCorpCli) { %>
	//State
	if (document.frmUserReg.state.selectedIndex == 0) {
		document.frmUserReg.state.value = "WPS";
		state_OnChange();
	}
	
	//Country
	if (document.frmUserReg.country.selectedIndex == 0) {
		document.frmUserReg.country.value = "MY";
	}
	
	<%}%>
	
	<% if(bCorpCli) { %>
		//DOB
		if(document.frmUserReg.dob.value != ""){
			var dob = document.frmUserReg.dob.value; // yyyy-MM-dd
			dob = dob.substring(8,10) + "-" + dob.substring(5,7) + "-" +  dob.substring(0,4);
			document.frmUserReg.dob.value = dob;
		} 
		
	<%}%>
	
	// DOB
	var dToday = new Date();
	var w = self.gfPop;
	
	if (w!=null) {
			w.gEnd = [dToday.getFullYear(), dToday.getMonth()+1, dToday.getDate()];
	}

<%	
	if (clibean.getLoginID().trim().length() > 0) {
			if (saResult != null) {
					if (saResult[0].length() == 0) { 
%>
				alert('<%=sSuccMsg%>');
				
				if(opener && !opener.closed)
					opener.location.href='main.jsp';
				else
					window.open('main.jsp', 'winMain', 'top=0,left=0,width=' + screen.width + ',height=' + screen.height + ',location=yes,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,status=yes');
					
				window.close();
<%				
					clibean.reset();
					}
			}
	} 
%>

}

function state_OnChange() {
	//document.frmUserReg.otrState.value = document.frmUserReg.state.value;
	if (document.frmUserReg.state.value =="OTR") {
		document.frmUserReg.otrState.value="";
		document.frmUserReg.otrState.style.display = "";
	} else
		document.frmUserReg.otrState.style.display = "none";			
}

function VerifyControl() {
	
	var bGoNext=true;
	var sControl = null;
	
	frm = document.frmUserReg;
	
<%	if(bExistCli) {  %>

	//Check Trading Acct (bhCliCode) --------------------------------------------
	var sBHCliCode = frm.bhCliCode.value;
	if (sBHCliCode.length <= 0) {
			if (sControl == null) sControl = frm.bhCliCode;
			setInValidColor(frm.bhCliCode);
			bGoNext = false;
	} else {
			setValidColor(frm.bhCliCode);
	}
<% } /* End of if(bExistCli) */ %>

	//Check Referred By (refBy) ------------------------------------------------
	if (frm.refBy.value == '') {
			if (sControl == null) sControl = frm.refBy;
			setInValidColor(frm.refBy);
			bGoNext = false;
	} else {
			setValidColor(frm.refBy);
	}
	
	if(frm.refBy.value == 'C'){
		if (frm.refByUid.value == '') {
			if (sControl == null) sControl = frm.refByUid;
			setInValidColor(frm.refByUid);
			bGoNext = false;
		} else {
				setValidColor(frm.refByUid);
		}
	}
	
	//Check Preferred Broking Branch (defBhBranch) ------------------------------------------------
	if (frm.defBhBranch.value == '') {
			if (sControl == null) sControl = frm.defBhBranch;
			setInValidColor(frm.defBhBranch);
			bGoNext = false;
	} else {
			setValidColor(frm.defBhBranch);
	}

	<%	if(bIndCli) {  %>
	//Check Designation (title) -------------------------------------------------
	if (frm.title.value == "EMPT") {
         if (sControl == null) sControl = frm.title;
			setInValidColor(frm.title);
			bGoNext = false;
	} else {
			setValidColor(frm.title);
	}
	<% } %>
	
	//Check name (cliName) ------------------------------------------------------
	var sCliName = frm.cliName.value;
	sCliName = sCliName.split("'");
	sCliName = sCliName.join("`");
	
	if ((sCliName.length <= 0)||!CheckWierdChar(sCliName)) {
			if (sControl == null) sControl = frm.cliName;
			setInValidColor(frm.cliName);
			bGoNext = false;
	} else {
			setValidColor(frm.cliName);
	}
	
	<%	if(bCorpCli) {  %>
	//Check oldIcNo
	if ((document.frmUserReg.oldIcNo.value.length <=0)||!CheckWierdChar(document.frmUserReg.oldIcNo.value)) {
		if (sControl == null)
			sControl = document.frmUserReg.oldIcNo;
		setInValidColor(document.frmUserReg.oldIcNo);
		bGoNext = false;
	}
	else
		setValidColor(document.frmUserReg.oldIcNo);
	<% } %>
		

	<%	if(bIndCli || bDealer) {  %>
	//Check Nationality (citizenShip) -------------------------------------------
	if ((frm.citizenShip.value.length <=0)||!CheckWierdChar(frm.citizenShip.value)) {
			if (sControl == null) sControl = frm.citizenShip;
			setInValidColor(frm.citizenShip);
			bGoNext = false;
	} else {
			setValidColor(frm.citizenShip);
	}

	if(frm.citizenShip.value == "MY"){
		//Check NRIC/Passport (icno) --------------------------------------------
		if ((frm.icNo.value.length < 4)) {
				if (sControl == null) sControl = frm.icNo;
				setInValidColor(frm.icNo);
				bGoNext = false;
		} else {
				setValidColor(frm.icNo);
		}		
	} else {
		//Check NRIC/Passport (passport) --------------------------------------------
		if ((frm.passport.value.length < 4)||!CheckWierdChar(frm.passport.value)) {
				if (sControl == null) sControl = frm.passport;
				setInValidColor(frm.passport);
				bGoNext = false;
		} else {
				setValidColor(frm.passport);
		}
	}

	//Check gender (sex) --------------------------------------------------------
	if ((!frm.sex[0].checked) && (!frm.sex[1].checked)) {
			if (sControl == null) sControl = frm.sex[0];
			setInValidColor(frm.sex[0]);
			bGoNext = false;
	} else {
			setValidColor(frm.sex[0]);
	}

	//Check race (race) ---------------------------------------------------------
	if ((!document.frmUserReg.race[0].checked)  && (!document.frmUserReg.race[1].checked) &&
		(!document.frmUserReg.race[2].checked)  && (!document.frmUserReg.race[3].checked)) {
		if (sControl == null)
			//alert(sControl)
			sControl = document.frmUserReg.race[0];
		setInValidColor(document.frmUserReg.race[0]);
		bGoNext = false;
	}
	else
		setValidColor(document.frmUserReg.race[0]);
	<% } %>

	<% 	if((bNewCli && bIndCli) || (bCorpCli) ){ %>
	//Check date of birth (dob) -------------------------------------------------
	if (frm.dob.value.length <= 0) {
			if (sControl == null) sControl = frm.dob;
			setInValidColor(frm.dob);
			bGoNext = false;
	} else {
			setValidColor(frm.dob);
	}

	//Check Address 1 (add1) ----------------------------------------------------
   var sAddr1 = frm.add1.value;
	sAddr1 = sAddr1.split("'");
	sAddr1 = sAddr1.join("`");
	if ((frm.add1.value.length <= 0)||!CheckWierdChar(sAddr1)) {
			if (sControl == null) sControl = frm.add1;
			setInValidColor(frm.add1);
			bGoNext = false;
	} else {
			setValidColor(frm.add1);
	}
	//Check Address 2 (add2) ----------------------------------------------------
   var sAddr2 = frm.add2.value;
	sAddr2 = sAddr2.split("'");
	sAddr2 = sAddr2.join("`");
	if (!CheckWierdChar(sAddr2)) {
			if (sControl == null) sControl = frm.add2;
			setInValidColor(frm.add2);
			bGoNext = false;
	} else {
			setValidColor(frm.add2);
	}

	//Check Country (country) ---------------------------------------------------
	if ((frm.country.value.length <=0)||!CheckWierdChar(frm.country.value)) {
			if (sControl == null) sControl = frm.country;
			setInValidColor(frm.country);
			bGoNext = false;
	} else {
			setValidColor(frm.country);
	}

	//Check PostCode (postcode) -------------------------------------------------
	if ((frm.postcode.value.length <=0) || !CheckWierdChar(frm.postcode.value)) {
			if (sControl == null) sControl = frm.postcode;
			setInValidColor(frm.postcode);
			bGoNext = false;
	} else {
			setValidColor(frm.postcode);
	}
	<%}%>

	//check e-Mail (email) ------------------------------------------------------
	if (!checkEMail(frm.email.value)||(frm.email.value.indexOf(" ")!=-1)||!CheckWierdChar(frm.email.value) || !validateEmail(frm.email.value,true,true)) {
			if (sControl == null) sControl = frm.email;
			setInValidColor(frm.email);
			bGoNext = false;
	} else {
			setValidColor(frm.email);
	}

	//check phone
	if ((document.frmUserReg.telno1.value.length < 2) || isNaN(document.frmUserReg.telno1.value)) {
		if (sControl == null)
			sControl = document.frmUserReg.telno1;
		setInValidColor(document.frmUserReg.telno1);
		bGoNext = false;
	}
	else
		setValidColor(document.frmUserReg.telno1);

	if ((document.frmUserReg.telno.value.length < 6) || isNaN(document.frmUserReg.telno.value)) {
		if (sControl == null)
			sControl = document.frmUserReg.telno;
		setInValidColor(document.frmUserReg.telno);
		bGoNext = false;
	}
	else
		setValidColor(document.frmUserReg.telno);

	//check Office phone (faxNo1, faxNo) ----------------------------------------
	/*bFaxPhone_Prefix = true;
	bFaxPhone_Postfix = false;
	
	if ( ((frm.faxNo1.value.length>0)||(frm.faxNo.value.length>0)) && 
			 ( frm.faxNo.value.length < 6) || 
			isNaN(frm.faxNo.value)) {
			if (sControl == null) sControl = frm.faxNo;
			setInValidColor(frm.faxNo);
			bGoNext = false;
	} else {
			setValidColor(frm.faxNo);
			if (frm.faxNo.value.length>0) bFaxPhone_Postfix = true;
	}*/
	
	<% if(bCorpCli){ %>
	//check Office phone
	if ((document.frmUserReg.faxNo1.value.length < 2) || isNaN(document.frmUserReg.faxNo1.value)) {
		if (sControl == null)
			sControl = document.frmUserReg.faxNo1;
		setInValidColor(document.frmUserReg.faxNo1);
		bGoNext = false;
	}
	else
		setValidColor(document.frmUserReg.faxNo1);

	if ((document.frmUserReg.faxNo.value.length < 6) || isNaN(document.frmUserReg.faxNo.value)) {
		if (sControl == null)
			sControl = document.frmUserReg.faxNo;
		setInValidColor(document.frmUserReg.faxNo);
		bGoNext = false;
	}
	else
		setValidColor(document.frmUserReg.faxNo);
		
	//Check Person Authorised To Trade(displayName) -------------------------------------------------
	if ((frm.displayName.value.length <=0) || !CheckWierdChar(frm.displayName.value)) {
			if (sControl == null) sControl = frm.displayName;
			setInValidColor(frm.displayName);
			bGoNext = false;
	} else {
			setValidColor(frm.displayName);
	}
	
	//Check NRIC (icNo) --------------------------------------------
	if ((frm.icNo.value.length < 4)||!CheckWierdChar(frm.icNo.value)) {
		if (sControl == null) sControl = frm.icNo;
		setInValidColor(frm.icNo);
		bGoNext = false;
	} else {
		setValidColor(frm.icNo);
	}
		
	<%} %>

	<% 	if(bIndCli){ %>
	//check mobile phone
	if (((document.frmUserReg.mobile1.value.length>0)||(document.frmUserReg.mobile.value.length>0)) && (document.frmUserReg.mobile1.value.length < 2) || isNaN(document.frmUserReg.mobile1.value)) {
		if (sControl == null)
			sControl = document.frmUserReg.mobile1;
		setInValidColor(document.frmUserReg.mobile1);
		bGoNext = false;
	}
	else
		setValidColor(document.frmUserReg.mobile1);
	<% } %>
	//---------------------------------------------------------------------------

	// ------------------
	// Login Information
	// ------------------
	
	//check userid (loginID) ----------------------------------------------------
	if ((frm.loginID.value.length < 6) || (frm.loginID.value.indexOf(" ")!=-1) || !CheckWierdChar(frm.loginID.value)) {
			if (sControl == null)
					sControl = frm.loginID;
					setInValidColor(frm.loginID);
					bGoNext = false;
	} else {
			setValidColor(frm.loginID);
	}
	
	var bPassword=false;
	var strPassword;
	var bGotNumeric=false;
	var bGotAlphaNumeric=false;
	var bValidPassword = false;
	var bValidPin = false;
	var cChkPass;
	
	//Valid password ------------------------------------------------------------
	strPassword = frm.pwd.value; 
	
	for (var i=0; i <= strPassword.length-1; i++) {
		
			cChkPass = strPassword.charAt(i);
		
			if ((cChkPass >= "0") && (cChkPass <= "9"))
					bGotNumeric = true;
			else
					bGotAlphaNumeric = true;

			if (bGotNumeric && bGotAlphaNumeric)
					bPassword = true;
	}

	if (!bPassword || !CheckWierdChar(frm.txtConfirmed.value) || (frm.txtConfirmed.value.indexOf(" ")!=-1) || (frm.pwd.value.indexOf(" ")!=-1)) {
			if (sControl == null) sControl = frm.pwd;
			setInValidColor(frm.txtConfirmed);
			setInValidColor(frm.pwd);
			bValidPassword = false;
			bGoNext = false;
	} else {
			setValidColor(frm.txtConfirmed);
			setValidColor(frm.pwd);
			bValidPassword = true;
	}

	//compare password against confirmed password
	if (bValidPassword) {
			if ((frm.txtConfirmed.value.length == 0) || (frm.pwd.value != frm.txtConfirmed.value) || 
					(frm.pwd.value == frm.loginID.value)) {
					if (sControl == null) sControl = frm.pwd;
					setInValidColor(frm.pwd);
					setInValidColor(frm.txtConfirmed);
					bValidPassword = false;
					bGoNext = false;
			} else {
					setValidColor(frm.pwd);
					setValidColor(frm.txtConfirmed);
					bValidPassword = true;
			}
	}

	//check password (pwd)
	if (bValidPassword) {
			if ((frm.pwd.value.length == 0) || (frm.pwd.value.length < 6)) {
					if (sControl == null) sControl = frm.pwd;
					setInValidColor(frm.pwd);
					bValidPassword = false;
					bGoNext = false;
			} else {
					setValidColor(frm.pwd);
					bValidPassword = true;
			}
	}

	//check confirmed
	if (bValidPassword) {
			if ((frm.txtConfirmed.value.length == 0) || (frm.txtConfirmed.value.length < 6)) {
					if (sControl == null) sControl = frm.txtConfirmed;
					setInValidColor(frm.txtConfirmed);
					bGoNext = false;
			} else {
					setValidColor(frm.txtConfirmed);
			}
	}		

	//check PIN (pin) -----------------------------------------------------------
	if (frm.txtConPIN.value.length != 6 || isNaN(frm.txtConPIN.value)) {
			if (sControl == null) sControl = frm.txtConPIN;
			setInValidColor(frm.txtConPIN);
			bGoNext = false;
	}else{
			setValidColor(frm.txtConPIN);
			bValidPin = true;
	}

	if (frm.pin.value.length != 6 || isNaN(frm.pin.value)) {
			if (sControl == null) sControl = frm.pin;
			setInValidColor(frm.pin);
			bGoNext = false;
	}else{
			setValidColor(frm.pin);
			bValidPin = true;
	}

	if (bValidPin) {
			if (frm.pin.value != frm.txtConPIN.value) {
					if (sControl == null) sControl = frm.pin;
					setInValidColor(frm.pin);
					setInValidColor(frm.txtConPIN);
					bGoNext = false;
			} else {
					setValidColor(frm.pin);
					setValidColor(frm.txtConPIN);
			}
	}

	//Check for hint (hint) -----------------------------------------------------
	if ((frm.hint.value.length == 0)|| !CheckWierdChar(frm.hint.value)) {
			if (sControl == null) sControl = frm.hint;
			setInValidColor(frm.hint);
			bGoNext = false;
	} else {
			setValidColor(frm.hint);
	}

	//check for answer to hint (hintAns) ----------------------------------------
	if ((frm.hintAns.value.length == 0)|| !CheckWierdChar(frm.hintAns.value)) {
			if (sControl == null) sControl = frm.hintAns;
			setInValidColor(frm.hintAns);
			bGoNext = false;
	} else {
			setValidColor(frm.hintAns);
	}

	if (!bGoNext) {
			alert("Please complete the highlighted field(s) correctly.");
			if (!sControl.disabled) sControl.focus();
			return false;
	} else {
		if (m_nSubmitCount ==0) {
			m_nSubmitCount++;
			<% 	if((bNewCli && bIndCli) || (bCorpCli) ){ %>
			frm.dob.value = formatDateToODBC(1,frm.dob.value); //dd-mm-yyyy
			<%} %>
			return true;
		} else {
			alert("Your request has been submitted. Please wait...");
			return false;
		}	
	}
	
	//return false;
	return bGoNext;
}

function title_OnChange() {
	document.frmUserReg.titleDesc.value = document.frmUserReg.title[document.frmUserReg.title.selectedIndex].text;
	document.frmUserReg.titleDesc.value = document.frmUserReg.titleDesc.value.replace(".", "");
}

/*function citizenShip_OnChange() {
	frm = document.frmUserReg;
	if (frm.citizenShip.value != "SG")
			document.all.tbl_tr_PResident.style.display = "";
	else {
			document.all.tbl_tr_PResident.style.display = "none";
			document.frmUserReg.PResident[0].checked = false;
			document.frmUserReg.PResident[1].checked = false;
	}
}*/

function citizenShip_OnChange() {
	var sNationality;
	sNationality = document.frmUserReg.citizenShip.value;	
	if (sNationality.toUpperCase() == "MY") {
		document.all.tblPassport.style.display = "None";
		document.all.tblNRIC.style.display = "";
	} else {
		document.all.tblPassport.style.display = "";
		document.all.tblNRIC.style.display = "None";
	}
}

function country_OnChange() {
}

function selCliRegHint_OnClick() {

	document.frmUserReg.hint.value =document.frmUserReg.selCliRegHint.value;
	
	if (document.frmUserReg.selCliRegHint.value == "OTR") {
			document.frmUserReg.hint.value="";
			document.frmUserReg.hint.style.display = "";
	} else {
			document.frmUserReg.hint.style.display = "none";			
	}
}

function setInValidColor(ValidatedControl) {
	ValidatedControl.style.backgroundColor = "#ee8b86";
}

function setValidColor(ValidatedControl) {
	ValidatedControl.style.backgroundColor = "white";
}

function CheckWierdChar(string1) {
	
	if ((string1.indexOf("|")!=-1) || (string1.indexOf("'")!=-1) || (string1.indexOf("\"")!=-1))
			return false;
	else
			return true;
}

function CheckWierdCharCtrl(keypress) {
	// |, ', "
	if ((keypress == 124) || (keypress == 39) || (keypress == 34)) {
			return 0;	
	} else {
			return keypress;
	}
}

function checkEMail(inEmail) {

	var locAt;
	var locPeriod;
	var okEmail;

	locAt = inEmail.indexOf("@");
	okEmail = ((locAt != -1) &&  (locAt != 0) && (locAt != (inEmail.length - 1))&& (inEmail.indexOf("@", locAt + 1) == -1));
	
	if (okEmail) {
			locPeriod = inEmail.indexOf(".");
			okEmail = ((locPeriod != -1) && (locPeriod != (inEmail.length - 1)));
	}
	
	return okEmail;
}

function EmailCtrl(keypress) {
	
	//between '0' - '9', 'A' - 'Z', 'a'-'z', '.', '@', '_'
	if ((keypress >= 48 && keypress <= 57)  ||
			(keypress >= 65 && keypress <= 90)  || 
			(keypress >= 97 && keypress <= 122) ||
			(keypress == 46) || 
			(keypress == 64) || 
			(keypress == 95)
		) {
		return keypress;
	}
	
	return 0;
}

function UserIDCtrl(keypress)
{	
	//alert(keypress);
	
	//between '0' - '9', 'A' - 'Z', 'a'-'z',  '_'
	if ((keypress >= 48 && keypress <= 57)  || 
			(keypress >= 65 && keypress <= 90)  || 
			(keypress >= 97 && keypress <= 122) || 
			//(keypress == 45) || 
			//(keypress == 46) || 
			//(keypress == 47) || 
			//(keypress == 64) || 
			(keypress == 95)
			
		) {
		return keypress;
	} else {
		alert("This character is not allowed.");	
	}
	
	return 0;
}

var sRefByPrev='';

function selRefBy_OnChange() {
		
		var sRefBy = document.frmUserReg.refBy.value;
		
		if (sRefBy == 'C') {
			document.all.spanRefByBH.style.display = "";
		} else if (sRefBy == 'B') {
			document.all.spanRefByBank.style.display = "";
		}

		if (sRefByPrev == 'C') {
			document.all.spanRefByBH.style.display = "none";
		} else if (sRefByPrev == 'B') {
			document.all.spanRefByBank.style.display = "none";
		}
		
		sRefByPrev = sRefBy;
	}
</script>
