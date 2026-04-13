<%@ page import = "java.sql.ResultSet,com.n2n.util.N2NConst,com.n2n.util.N2NSecurity,java.util.Calendar,java.util.Date,com.n2n.DB.N2NDateFunc,java.text.SimpleDateFormat,java.text.DecimalFormat,com.n2n.DB.N2NMFCliInfo,com.n2n.bean.N2NMFCliInfoBean,com.n2n.DB.N2NSettlement,java.lang.Double"%>
<%@ include file='/common.jsp'%>
<%@ include file='SetupApplet.jsp'%>
<%@include file="/util/sessionCheck.jsp"%>
<script language=JavaScript src="<%=g_sJSPath%>/N2NFunc.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/N2NPrnFunc.js"></script>
<%
	SimpleDateFormat dtFormat = new SimpleDateFormat("dd/MM/yyyy");
	DecimalFormat dfValue = new DecimalFormat("#,###,###,##0.00");
	DecimalFormat dfPrice = new DecimalFormat("#,###,###,##0.0000");

	String sSetOff = ""; String sOnline = ""; 
	String sContract = ""; String [] aContract = null;
	String sQty = ""; String [] aQty = null;
	String sPay = ""; String [] aPay = null;
	String sOSAmt = "";
	String sInterest = "";
	String sBrokerage = ""; String [] aBrokerage = null;
	String sStampDuty = ""; String [] aStampDuty = null;
	String sClearingFee = ""; String [] aClearingFee = null;
	String sMiscAmt = ""; String [] aMiscAmt = null;
	String sName = "";
	double dTotal = 0;
	String sBHCliCode = "";
	String sContractSetOff = "";
	String sPaySetOff = "";
	String sInterestSetOff = "";
	String sBroker = "";
	String sBank = "";
	String [] aWork = null;
	String sBHBranch = "";

//if (oN2NSession.getIsUserLogin()) {
if (validSession) {	

%>
<HTML>
<HEAD>
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">
<TITLE>Online Transfer</TITLE>
</HEAD>
<%
	sSetOff = request.getParameter("SetOff");
	sSetOff = sSetOff != null ? sSetOff : "";
	sOnline = request.getParameter("Online");
	sOnline = sOnline != null ? sOnline : "";
	sContract = request.getParameter("Contract");
	sContract = sContract != null ? sContract : "";
	sQty = request.getParameter("Qty");
	sQty = sQty != null ? sQty : "";
	sOSAmt = request.getParameter("OSAmt");
	sOSAmt = sOSAmt != null ? sOSAmt : "";
	sPay = request.getParameter("Pay");
	sPay = sPay != null ? sPay : "";
	sInterest = request.getParameter("Interest");
	sInterest = sInterest != null ? sInterest : "";
	sBrokerage = request.getParameter("Brokerage");
	sBrokerage = sBrokerage != null ? sBrokerage : "";
	sStampDuty = request.getParameter("StampDuty");
	sStampDuty = sStampDuty != null ? sStampDuty : "";
	sClearingFee = request.getParameter("ClearingFee");
	sClearingFee = sClearingFee != null ? sClearingFee : "";
	sMiscAmt = request.getParameter("MiscAmt");
	sMiscAmt = sMiscAmt != null ? sMiscAmt : "";
	sName = request.getParameter("Name");
	sName = sName != null ? sName : "";
	sBHCliCode = request.getParameter("Acc");
	sBHCliCode = sBHCliCode != null ? sBHCliCode : "";
	sContractSetOff = request.getParameter("ContractSetOff");
	sContractSetOff = sContractSetOff != null ? sContractSetOff : "";
	sPaySetOff = request.getParameter("PaySetOff");
	sPaySetOff = sPaySetOff != null ? sPaySetOff : "";
	sInterestSetOff = request.getParameter("InterestSetOff");
	sInterestSetOff = sInterestSetOff != null ? sInterestSetOff : "";

	if (g_sDefBHCode.equals("076")) {
		sBroker = "KLCS";
	} else if (g_sDefBHCode.equals("065")) {
		sBroker = "CIMB";	
	} else if (g_sDefBHCode.equals("086")) {
		sBroker = "AMSEC";	
	} else if (g_sDefBHCode.equals("028")) {
		sBroker = "AFFIN";	
	} else {
		sBroker = "JFAPEX";
	}
	
	if (sBHCliCode.length() > 0) {
		aWork = sBHCliCode.split(N2NConst.TRDACC_COL_SEP);
		sBHCliCode = aWork[0];
		if (aWork.length >= 1) {
			sBHBranch = aWork[1];
		}
	}
	if (!(sSetOff.equals("") || sOnline.equals(""))){
		dTotal = Double.parseDouble(sSetOff) + Double.parseDouble(sOnline);
	}
		
%>
<!--BODY style='background:#FFFFFF;margin:5px 0px 0px 6px'-->
<BODY class='clsBody'>
	<TABLE border=0 cellpadding=0 cellspacing=0 width=650>
		<TR>
			<%if (g_sDefBHCode.equals("076")) {%>
				<TD class=clsSectionHeader width='97%'>&nbsp;Step 2 - Submit Payment(s)</TD>
			<%} else {%>
				<TD class=clsSectionHeader width='97%'>&nbsp;Step 3 - Submit Payment(s)</TD>
			<%}%>
			<TD width='3%'><img id=imgHelp border=0 width=20 height=19 src=<%=g_sImgPath%>/lightbulboff.jpg onmouseover="this.src='<%=g_sImgPath%>/lightbulbon.jpg'" onmouseout="this.src='<%=g_sImgPath%>/lightbulboff.jpg'" title="Summary: Submit online transfer to complete payment(s)."></TD>
		</TR>
	</TABLE>
		<%
			out.println("<BR/>");
			out.println("<table border=0  cellpadding=0 cellspacing=0 width=500>");
				out.println("<tr>");
					out.println("<td width=100>Internet Banking</td>");
					out.println("<td width=5>:</td>");
					if (g_sDefBHCode.equals("065")) {
						out.println("<td width=175 align=center><img src='"+g_sPath+"/img/stl/stlCIMBBank.gif'></td>");						
						out.println("<td width=175 align=center><img src='"+g_sPath+"/img/stl/stlMayBank.gif'></td>");						
					} else if (g_sDefBHCode.equals("086")) {
						out.println("<td width=175 align=center><img src='"+g_sPath+"/img/stl/amOnline.gif'></td>");					
						out.println("<td width=175 align=center>&nbsp;</td>");
					} else if (g_sDefBHCode.equals("076")) {
						out.println("<td width=175 align=center><img src='"+g_sPath+"/img/stl/stlMayBank.gif'></td>");					
						out.println("<td width=175 align=center><img src='"+g_sPath+"/img/stl/stlallianceonline.gif'></td>");					
					} // added by clleong 20081030
					else if (g_sDefBHCode.equals("028")) {
						out.println("<td width=175 align=center><img src='"+g_sPath+"/img/stl/affin_logo.gif'></td>");
						out.println("<td width=175 align=center>&nbsp;</td>");	
					} else { //Apex
						out.println("<td width=175 align=center><img src='"+g_sPath+"/img/stl/stlMayBank.gif'></td>");									
						out.println("<td width=175 align=center>&nbsp;</td>");
					}
				out.println("</tr>");
				
				out.println("<tr align=center height=20>");
					out.println("<td colspan=2 >&nbsp;</td>");
					if (sBroker.equals("CIMB")) {
						out.println("<td ><input type=radio id=radBank name=radBank value=B onclick=rad_OnClick()> **CIMB Bank</td>");					
						out.println("<td ><input type=radio id=radBank name=radBank value=M onclick=rad_OnClick()> Maybank</td>");
					} else if (sBroker.equals("KLCS")) {
						out.println("<td ><input type=radio id=radBank name=radBank value=M onclick=rad_OnClick()> Maybank</td>");
						out.println("<td ><input type=radio id=radBank name=radBank value=A onclick=rad_OnClick()> Alliance Bank</td>");
					} else if (sBroker.equals("JFAPEX")) {
						out.println("<td ><input type=radio id=radBank name=radBank value=M onclick=rad_OnClick()> Maybank</td>");
						out.println("<td ><input type=hidden id=radBank name=radBank value=O onclick=rad_OnClick()></td>");						
					} else if (sBroker.equals("AMSEC")) {
						out.println("<td ><input type=radio id=radBank name=radBank value=D onclick=rad_OnClick()> AmBank</td>");
						out.println("<td ><input type=hidden id=radBank name=radBank value=O onclick=rad_OnClick()></td>");						
					} // added by clleong 20081030
					else if (sBroker.equals("AFFIN")) {
						out.println("<td ><input type=radio id=radBank name=radBank value=I onclick=rad_OnClick()> Affin Bank</td>");
						out.println("<td ><input type=hidden id=radBank name=radBank value=O onclick=rad_OnClick()></td>");				
					}
				out.println("</tr>");
				
				out.println("<tr>");
					out.println("<td>Amt Payable via Internet Banking</td>");
					out.println("<td>:</td>");
					out.println("<td colspan=2 align=left>RM " + sOnline + "</td>");
				out.println("</tr>");
			out.println("</table>");
			out.println("<br/>");
			
		 	out.println("<table border=0 cellpadding=0 cellspacing=0>");
			out.println("<tr><td>");
			out.println("<table border=0 cellpadding=0 cellspacing=0 width=650>");
			out.println("<tr class=clsRepHeader>");
			out.println("<td width='20%' class=clsRepFirstCol style=' border-right-color: #FFFFFF'>Method</td>");
			out.println("<td width='30%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Description</td>");
			out.println("<td width='20%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Branch</td>");
			out.println("<td width='30%' class=clsRepLastCol>Amount</td>");
			out.println("</tr>");
			out.println("</table>");
			out.println("</td></tr>");
			out.println("<tr><td>");
			out.println("<table name=paymentdetails id=paymentdetails border=0 cellpadding=0 cellspacing=0 width=650>");
			if (!(sSetOff.equals("0") || sSetOff.equals(""))) {
				out.println("<tr class=clsRepRowEven>");
				out.println("<td width='20%' class=clsRepFirstCol>&nbsp;Setoff</td>");
				out.println("<td width='30%' class=clsRepMidCol>&nbsp;Trust A/C</td>");
//				out.println("<td width='20%' class=clsRepMidCol>&nbsp;"& getBranchDesc(g_BHCode, g_BHBranch) &"</td>");
				out.println("<td width='20%' class=clsRepMidCol>&nbsp;"+ g_sBHName +"</td>");
				out.println("<td width='30%' class=clsRepLastCol align=right>" + sSetOff + "&nbsp;</td>");
				out.println("</tr>");
			}
			if (!(sOnline.equals("0.00") || sOnline.equals(""))) {
				out.println("<tr class=clsRepRowOdd>");
				out.println("<td width='20%' class=clsRepFirstCol>&nbsp;Online Transfer</td>");
				if (sBank.equals("M")) {
					out.println("<td width='30%' class=clsRepMidCol>&nbsp;Maybank2U.com</td>");
				} else if (sBank.equals("B")) {
					out.println("<td width='30%' class=clsRepMidCol>&nbsp;Bumiputra-Commerce</td>");
				} else if (sBank.equals("D")) {
					out.println("<td width='30%' class=clsRepMidCol>&nbsp;AmBank</td>");
				} else if (sBank.equals("A")) {
					out.println("<td width='30%' class=clsRepMidCol>&nbsp;Alliance Online</td>");
				} else if (sBank.equals("F")) {
					out.println("<td width='30%' class=clsRepMidCol>&nbsp;FPX</td>");
				} else if (sBank.equals("I")) {
					out.println("<td width='30%' class=clsRepMidCol>&nbsp;Affin Bank Online</td>");
				} else {
					out.println("<td width='30%' class=clsRepMidCol>&nbsp;</td>");
				}
				out.println("<td width='20%' class=clsRepMidCol>&nbsp;</td>");
				out.println("<td width='30%' class=clsRepLastCol align=right>" + sOnline + "&nbsp;</td>");
				out.println("</tr>");
			}
			out.println("</table>");
			out.println("</tr></td>");
			out.println("<tr><td>");
			out.println("<table name=paymentfooter id=paymentfooter border=0 cellpadding=0 cellspacing=0 width=650>");
			out.println("<tr class=clsRepHeader>");
			out.println("<td align=right>" + dfValue.format(dTotal) + "&nbsp;&nbsp;</td>");
			out.println("</tr>");
			out.println("</table>");
			out.println("</tr></td>");
			out.println("</table>");
		%>
<br/>
<table width=650>
	<DIV align=right>
		<input id=butBack name=butBack type=button value='    Back   ' onclick='Back_OnClick()'></input>
		&nbsp;&nbsp;&nbsp;TRADING PIN:&nbsp;<input id=txtPIN type=password size=6 maxlength=6>
		<input id=butSubmit name=butSubmit type=button value='  Submit  ' onclick='frmSubmit_OnSubmit()'></input>
	</DIV>
</table>
<br/><br/>

<TABLE border=0 width=650 cellspacing=0 cellpadding=0>
<%	
	if (g_sDefBHCode.equals("065")) {
		out.println("<tr><td><p>**CIMB Bank Berhad <i>(Formerly known as Bumiputra Commerce Bank Berhad)</i></p></td></tr>");
		out.println("<tr><td>&nbsp;</td></tr>");
	}
%>
	<TR>
		<TD>
			<TABLE cellspacing=0 cellpadding=0>
				<TR><TD>
					<B>Important Notes:</B>
				</TD></TR>
				<TR>
				<TD>&nbsp;</TD>
				</TR>
				<TR><TD>
					<ul>
						<li>For Internet Banking Settlement, you will be connected to your selected bank website.</li>
						<li>At present, Internet Banking Settlement is only available through 
								<%if (sBroker.equals("CIMB")) {%>
								 CIMB Bank @CIMBClicks and Maybank2U.com.
								<%} else if (sBroker.equals("JFAPEX")) {%>
								 Maybank2U.com.
								<%} else if (sBroker.equals("AMSEC")) {%>
								 AmOnline Banking.
								<%} else if (sBroker.equals("KLCS")) {%>
								 Alliance Online and Maybank2U.com.
								 <%} else if (sBroker.equals("AFFIN")) {%>
								 Affin Bank
								<%}%> </li>
						<li>As such, you must have Internet banking access to 
								<%if (sBroker.equals("CIMB")) {%>
									CIMB Bank @CIMBClicks and Maybank2U.com.
								<%} else if (sBroker.equals("JFAPEX")) {%>
									Maybank2U.com before effecting online funds transfers for your <BR/>
									settlements and/or deposits.
								<%} else if (sBroker.equals("AMSEC")) {%>
									AmOnline Banking.
								<%} else if (sBroker.equals("KLCS")) {%>
									Alliance Online and Maybank2U.com.
								<%} else if (sBroker.equals("AFFIN")) {%>
									AffinOnline Banking.
								<%}%> 
						</li>
					</ul>
				</TD></TR>		
			</TABLE>
		</TD>			
</TABLE>

<form id=frmSubmit name=frmSubmit action=<%=g_sPath%>/stlProcessPay.jsp method=post>
	<input type=hidden id=Pin name=Pin value=''></input>
	<input type=hidden id=SetOff name=SetOff value='<%=sSetOff%>'></input>
	<input type=hidden id=Online name=Online value='<%=sOnline%>'></input>
	<input type=hidden id=Contract name=Contract value='<%=sContract%>'></input>
	<input type=hidden id=Qty name=Qty value='<%=sQty%>'></input>
	<input type=hidden id=OSAmt name=OSAmt value='<%=sOSAmt%>'></input>
	<input type=hidden id=Pay name=Pay value='<%=sPay%>'></input>
	<input type=hidden id=Interest name=Interest value='<%=sInterest%>'></input>
	<input type=hidden id=Brokerage name=Brokerage value='<%=sBrokerage%>'></input>
	<input type=hidden id=StampDuty name=StampDuty value='<%=sStampDuty%>'></input>
	<input type=hidden id=ClearingFee name=ClearingFee value='<%=sClearingFee%>'></input>
	<input type=hidden id=MiscAmt name=MiscAmt value='<%=sMiscAmt%>'></input>
	<input type=hidden id=Name name=Name value='<%=sName%>'></input>		
	<input type=hidden id=Acc name=Acc value='<%=sBHCliCode%>-<%=sBHBranch%>'></input>
	<input type=hidden id=ContractSetOff name=ContractSetOff value='<%=sContractSetOff%>'></input>
	<input type=hidden id=PaySetOff name=PaySetOff value='<%=sPaySetOff%>'></input>
	<input type=hidden id=InterestSetOff name=InterestSetOff value='<%=sInterestSetOff%>'></input>
	<input type=hidden id=Broker name=Broker value='<%=sBroker%>'></input>
	<input type=hidden id=BankSrc name=BankSrc value=''></input>
</form>

<!--<span style="display:none">-->
<!--<applet id=m_clsN2NFunc name=m_clsN2NFunc code="com.n2n.ebc.N2NFunc.class" codebase="<%=g_sJavaPath%>" archive="N2NFunc.jar,CalcFunc.jar" width=10 height=10 VIEWASTEXT></applet>-->
<%=GetAppletObjectTag("m_clsN2NFunc", "com.n2n.ebc.N2NFunc.class", g_sJavaPath + "/", "N2NFunc.jar,CalcFunc.jar", "", "", "0", "0")%>

<!--<applet id=m_clsN2NIFrame name=m_clsN2NIFrame code="N2NIFrame.class" codebase="<%=g_sJavaPath%>" archive="N2NIFrame.jar" width=1 height=1 VIEWASTEXT></applet>-->
<%=GetAppletObjectTag("m_clsN2NIFrame", "N2NIFrame.class", g_sJavaPath + "/", "N2NIFrame.jar", "", "", "0", "0")%>
<!--</span>-->

</BODY>
</HTML>
<SCRIPT language='JavaScript'>

function rad_OnClick()
{
	var rowCount, iIndex;
	if ("<%=sOnline%>"!="0.00"){
		if (radBank (0).checked) {
			document.frmSubmit.BankSrc.value = radBank(0).value;		
		} else{
			<%if (g_sDefBHCode.equals("065")) {%>
			{
				if (radBank (1).checked){
					document.frmSubmit.BankSrc.value = radBank(1).value
				}
				else{
					document.frmSubmit.BankSrc.value = radBank(2).value
				}
			}
			<%} else {%>
			{
				document.frmSubmit.BankSrc.value = radBank(1).value
			}
			<%}%>
		}
		rowCount=document.all.paymentdetails.rows.length	
		for (iIndex=0; iIndex < rowCount; iIndex++){
			if (document.all.paymentdetails.rows(iIndex).cells(0).innerText == " Online Transfer"){
				if (document.frmSubmit.BankSrc.value == "M" ) 
					document.all.paymentdetails.rows(iIndex).cells(1).innerText = " " + " Maybank2U.com";
				else if (document.frmSubmit.BankSrc.value == "B" )
					document.all.paymentdetails.rows(iIndex).cells(1).innerText = " " + " CIMBClicks";
				else if (document.frmSubmit.BankSrc.value == "D" )
					document.all.paymentdetails.rows(iIndex).cells(1).innerText = " " + " AmBank";
				else if (document.frmSubmit.BankSrc.value == "A" )
					document.all.paymentdetails.rows(iIndex).cells(1).innerText = " " + " Alliance Online";
				else if (document.frmSubmit.BankSrc.value == "F" )
					document.all.paymentdetails.rows(iIndex).cells(1).innerText = " " + " FPX-MEPS";
				// added by clleong 20081103
				else if (document.frmSubmit.BankSrc.value == "I" )
					document.all.paymentdetails.rows(iIndex).cells(1).innerText = " " + " Affin Bank";
				else
					document.all.paymentdetails.rows(iIndex).cells(1).innerText = "";
			}
		}
	}else{
		alert("You do not need to make online payment.");
	}
}

function Back_OnClick()
{
	<% if (g_sDefBHCode.equals("076")) { %>
		window.history.go(-2);
	<% } else { %>
		window.history.back();
	<% } %>
}

function checkPIN(vsPIN)
{
	var sPIN=""

	if (vsPIN.length != 6) 
	{
		alert("PIN entered is not valid!\nPIN must be 6 digits in length.");
	} 
	else 
	{
		//make sure 6 "digits"
		for (var i=0; i < vsPIN.length; ++i) 
		{
			// '0' - '9'
			if (vsPIN.charCodeAt(i) < 48 || vsPIN.charCodeAt(i) > 57)
				break;
		}

		if (i < vsPIN.length)
		{
			alert("PIN entered is not valid!\nPIN must be 6 digits in length.");
		} 
		else 
		{
			sPIN = m_clsN2NFunc.getPIN(Number(vsPIN), <%=oN2NSession.getSessionId(session)%>);
		}
	}
	return sPIN;
}

var PINRetFromServer=0;
function checkPINFromServer(vsPIN)
{
	var sRet = m_clsN2NIFrame.HitURL("<%=N2NSecurity.getHomePathForProtocol(request,false)%>" +"gcCIMB/trdChkPIN.jsp", "txtPIN="+ vsPIN)
	PINResponse(sRet, vsPIN)
}

function PINResponse(vnRet, vsPIN)
{
	switch (Number(vnRet)) 
	{
		case -1:
			alert("Invalid connection! Please refresh your page.")
			break
		case 0:
			alert("PIN entered is not correct! Please try again.")
			break
		case 1:
			document.all.Pin.value = vsPIN
			PINRetFromServer = 1
			frmSubmit_OnSubmit();
	}
}

function frmSubmit_OnSubmit()
{
	var sPIN;

	if (("<%=sOnline%>"!="0.00")){
		<%if (g_sDefBHCode.equals("065") || g_sDefBHCode.equals("086") || g_sDefBHCode.equals("028")) {%>
			if (!(radBank(0).checked  || radBank(1).checked)){
				alert("Please select a paying bank");		
				return false;			
			}
		<%} else {%>
			if (!(radBank(0).checked  || radBank(1).checked)){
				alert("Please select a paying bank");		
				return false;
			}
		<%}%>

	}
	else{
		document.frmSubmit.BankSrc.value = "O";
	}	

	if (("<%=sOnline%>" > 750000)){
		<%if (g_sDefBHCode.equals("086")) {%>
			alert("Online Banking amount cannot more than 750,000 !");
			return false;			
		<%}%>
	}
	
	//added by chuili 20090603
	if (("<%=sOnline%>" > 25000)){
		<%if (g_sDefBHCode.equals("028")) {%>
			alert("The total outstanding transactions selected for e-settlement is more than the maximum RM25,000 per transaction limit allowed");
			return false;			
		<%}%>
	}	

	//check PIN
	sPIN = checkPIN(txtPIN.value)
	if (sPIN == "")
		return false
	if (PINRetFromServer == 0) {
		checkPINFromServer(sPIN)
		return false
	}	
	document.frmSubmit.submit();
}

</SCRIPT>
<%}else{
		response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
	}%>