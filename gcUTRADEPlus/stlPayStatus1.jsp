<%@ page import = "java.sql.ResultSet,com.n2n.util.N2NConst,com.n2n.util.N2NSecurity,java.util.Calendar,java.util.Date,com.n2n.DB.N2NDateFunc,java.text.SimpleDateFormat,java.text.DecimalFormat,com.n2n.DB.N2NMFCliInfo,com.n2n.bean.N2NMFCliInfoBean,com.n2n.DB.N2NSettlement"%>
<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<%@ include file='/common.jsp'%>
<%@include file="/util/sessionCheck.jsp"%>
<script language=JavaScript src="<%=g_sJSPath%>/N2NFunc.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/N2NPrnFunc.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/LinkFunc.js"></script>
<%
	Date dtToday = new Date();
	Calendar calOutstanding = Calendar.getInstance();
	calOutstanding.add(Calendar.DATE,-1);
	Date dtOutstanding = calOutstanding.getTime();
	SimpleDateFormat dtFormat = new SimpleDateFormat("dd/MM/yyyy");
	SimpleDateFormat dtPickerFormat = new SimpleDateFormat("yyyy-MM-dd");
	SimpleDateFormat dtLongFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
	DecimalFormat dfValue = new DecimalFormat("#,###,###,##0.00");

	String [] aWork = null;
	ResultSet oRst = null;
	ResultSet rs = null;
	String [] saTrdLimitAndInfo = null;
	String sBHCliCode = ""; String sBHBranch = "";
	String sStatus = "";
	double [] daDueAmt = null;
	double dOverdue = 0; double dT0 = 0; double dT1 = 0; double dT2 = 0; double dT3 = 0;
	double dTotalContraLoss = 0; double dTotalMiscLoss = 0; double dTotalInterestLoss = 0; double dTotal = 0;
	String sHistory = "";
	double dTotalSuccess = 0; double dTotalPending = 0;
	String sLastDocNo = ""; String sReadDocNo = ""; int iNumRow = 0;
	String sBroker = ""; boolean bGameMode = false;
	double dSuccContractAmt = 0; double dPendingAmt = 0;
	String sAccType = "";
	String sCliCode = "";
	String sCDSNo = "";
	N2NMFCliInfoBean clibean = new N2NMFCliInfoBean();	

	String sStyle = "visibility:visible;";
	String sExchange ="KL";

	//if (oN2NSession.getIsUserLogin()) {
	if (validSession) {

	if (!oN2NSession.cliinfo.isBankDealer()) {

		sCliCode = g_sCliCode;
		sBHCliCode = request.getParameter("Acc");
		sBHCliCode = sBHCliCode != null ? sBHCliCode : "";
		sStatus = request.getParameter("Status");
		sStatus = sStatus != null ? sStatus : "";
		sHistory = request.getParameter("History");
		sHistory = sHistory != null ? sHistory : "";
		
		if (sBHCliCode.length() > 0) {
			aWork = sBHCliCode.split(N2NConst.TRDACC_COL_SEP);
			sBHCliCode = aWork[0];
			if (aWork.length >= 1) {
				sBHBranch = aWork[1];
			}
		}

		System.out.println("sBHCliCode 2 =------------------->> "+sBHCliCode); 
		
		N2NSettlement settle = new N2NSettlement();
		settle.init(oN2NSession);
		settle.setWriter(out);
%>
<HTML>
<HEAD>
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">
<TITLE>Payment History</TITLE>
<%/*Call AutoRefreshCapture()*/%>
</HEAD>
<!--body onload="Body_OnLoad()" style='background:#FFFFFF;margin:5px 0px 0px 6px'-->
<body onload="Body_OnLoad()" class='clsBody'>
<%
		if (sBHCliCode == "") {

			clibean = new N2NMFCliInfoBean();	
			clibean.setCliCode(sCliCode);
			clibean.setBhcode(g_sDefBHCode);								
//			clibean.setBhbranch(g_sDefBHBranch);
				
			//rs = oN2NSession.cliinfo.getBHCliInfoByCliCode(clibean,g_sCategory,0,"",sExchange);
			cli.init(oN2NSession);
			rs = cli.getBHCliInfoByCliCode(clibean,g_sCategory,0,"",sExchange);
			
			if (rs != null && rs.next()) {
				System.out.println("ENTER HERE!!");
				sAccType = rs.getString("AccType");
				System.out.println("sAccType = "+sAccType);
				if (sAccType.equals("M")) {
					sBHCliCode = "";
					sBHBranch = "";
				} else {
					sBHCliCode = rs.getString("BHCliCode");
					sBHBranch = rs.getString("BHBranch");
				}
				rs.close();
				rs = null;
			} else {
				System.out.println("ENTER ELSE");
			}
			//oN2NSession.cliinfo.closeResultset();
			//oN2NSession.cliinfo.dbDisconnect();
			cli.closeResultset();
			cli.dbDisconnect();
			clibean.reset();
		}
		System.out.println("sBHCliCode =------------------->> "+sBHCliCode);
%>
	<TABLE border=0 cellpadding=0 cellspacing=2 width=600>
		<TR>
			<TD class=clsSectionHeader width='67%'>&nbsp;Payment History</TD>
			<TD class=clsSectionHeader valign=bottom align=right width='30%'><%/*Call AutoRefreshOption()*/%><img border=0 src='<%=g_sImgPath%>/refresh.gif' width=15 height=18 title='Click to refresh' style='cursor:hand' onclick='window.location.reload(true);'></td>
			<td><img id=imgHelp border=0 width=20 height=19 src=<%=g_sImgPath%>/lightbulboff.jpg onmouseover="this.src='<%=g_sImgPath%>/lightbulbon.jpg'" onmouseout="this.src='<%=g_sImgPath%>/lightbulboff.jpg'" title="Summary: Check your payment history"></TD>
		</TR>
	</TABLE>
<BR/>
<TABLE Width=600 border=0 cellpadding=0 cellspacing=0>
	<TR>
		<TD width=30%>&nbsp;Name</TD>
		<TD>:&nbsp;</TD>
		<TD><%=g_sLoginId%>&nbsp;&nbsp;<label id=lblCliName></label></TD>
	</TR>
	<tr>
		<td>&nbsp;Account Number</td>
		<td>:&nbsp;</td>
		<td><form id=frmTrdAcc onsubmit='return frmTrdAccSrch_OnSubmit(this);'>
			<%
			//saTrdLimitAndInfo = settle.stlfillTrdAccListBox(sCliCode, g_sDefBHCode, sBHBranch, sBHCliCode, false, "", 0,sExchange,sStyle);

			double dTotTrdLimit = 0;
			double dTrdLimit = 0;
			String sTrdLimit = "";
			int nBHCliCodeLen = 0;
			String sVisibilityStyle = "";
			String[] saRetMsg =new String[3];
			int iLoop = -1;
			int vnSelWidth = 0;
			boolean vbAllAccSel = false;
			boolean bDisplayMargin = false;

			if (vnSelWidth == 0) {
				vnSelWidth = 180;
			}			
			out.println("<select id=selTrdAcc name=selTrdAcc style='" + sStyle + "width:" + vnSelWidth + "px' disabled=true onchange='selOption_OnChange(\"\")'>");
			if (vbAllAccSel){
				out.print("<option value=>--All--</option>");
			}
			clibean.setCliCode(sCliCode);
			clibean.setAccountType("");

			rs = cli.getBHCliInfoByCliCode(clibean,"C",0,"",sExchange);
			dTotTrdLimit = 0;
			sTrdLimit = "";
			nBHCliCodeLen = sBHCliCode.length();

			if 	(rs != null) {
				clibean.reset();
				while (rs.next()) {
					iLoop++;
					sAccType = rs.getString("AccType");
					//filter M acct type for settlement only
					if (!bDisplayMargin && sAccType.equals("M")) {
						continue;
					}
					sBHCliCode = rs.getString("BHCliCode").trim();
					sBHBranch = rs.getString("BHBranch");
					out.print("<option value='"+ sAccType + sBHCliCode +N2NConst.TRDACC_COL_SEP+ sBHBranch +"'");
					//return the first bhclicode
					if (g_sDefBHCode.length() == 0) {
						saRetMsg[0] = sBHCliCode;
						saRetMsg[1] = sBHBranch;
						if (iLoop == 0) {
							out.print("selected");
						}
					} else {

						if (sBHCliCode.equals(sBHCliCode) && sBHBranch.equals(sBHBranch)) {
							out.print("selected");

							if (sBHBranch.length() == 0) {
								saRetMsg[0] = sBHCliCode;
								saRetMsg[1] = sBHBranch;
							}
						}

					}
					out.print(">");

					if (sAccType.equals(N2NConst.TRD_ACCTYPE_NONMARGIN)) {
						out.print(N2NConst.TRD_ACCTYPEDESC_NONMARGIN);
					} else if (sAccType.equals(N2NConst.TRD_ACCTYPE_MARGIN)) {
						out.print(N2NConst.TRD_ACCTYPEDESC_MARGIN);
					} else if (sAccType.equals(N2NConst.TRD_ACCTYPE_NOMINEE)) {
						out.print(N2NConst.TRD_ACCTYPEDESC_NOMINEE);
					} else if (sAccType.equals(N2NConst.TRD_ACCTYPE_BHNOMINEE)) {
						out.print(N2NConst.TRD_ACCTYPEDESC_BHNOMINEE);
					} else if (sAccType.equals(N2NConst.TRD_ACCTYPE_EES)) {
						out.print(N2NConst.TRD_ACCTYPEDESC_EES);
					} else if (sAccType.equals(N2NConst.TRD_ACCTYPE_ESOS)) {
						out.print(N2NConst.TRD_ACCTYPEDESC_ESOS);
					} else if (sAccType.equals(N2NConst.TRD_ACCTYPE_EXTESOS)) {
						out.print(N2NConst.TRD_ACCTYPEDESC_EXTESOS);
					} else if (sAccType.equals(N2NConst.TRD_ACCTYPE_EXTMARGIN)) {
						out.print(N2NConst.TRD_ACCTYPEDESC_EXTMARGIN);
					}

					out.print(" ("+ sBHCliCode +N2NConst.TRDACC_COL_SEP+ sBHBranch +")");
					if (cli.isAdminUser() || cli.isBankDealer()) {
						out.print(" "+ rs.getString("CliName"));
					}

					//different record might have different CliCode - for exempt-dealer
					clibean.setCliCode(sCliCode);
					clibean.setBhcode(g_sDefBHCode);
					clibean.setBhCliCode(sBHCliCode);
					clibean.setBhbranch(sBHBranch);
					if (cli.isBankDealer()) {
							dTrdLimit = cli.getCliTrdLimit(clibean,"D");
					} else {
						dTrdLimit = cli.getCliTrdLimit(clibean,"D");
					}

					sTrdLimit = sTrdLimit + dTrdLimit + N2NConst.FEED_REQFLD_SEP + rs.getString("MaxPriceInterval") +
								N2NConst.FEED_REQFLD_SEP + rs.getString("BrokerageRate") + N2NConst.FEED_REQFLD_SEP;

					dTotTrdLimit = dTotTrdLimit + dTrdLimit;
					out.println("</option>");
				}//end while
				out.println("</select>");
				//closeResultset();
				//m_oN2NSession.cliinfo.closeResultset();
				//m_oN2NSession.cliinfo.dbDisconnect();
				saRetMsg[2] = dTotTrdLimit + N2NConst.FEED_REQFLD_SEP+ "30" + N2NConst.FEED_REQFLD_SEP + "0.01" + N2NConst.FEED_REQFLD_SEP + sTrdLimit;
				rs.close();
				
			}
			%>
			<%
				if (g_sCategory.equals("S") || g_sCategory.equals("A") || g_sCategory.equals("D") || g_sCategory.equals("R")) {
					out.print("<input id=txtTrdAccSrch name=txtTrdAccSrch style='display:none;width:180px' autocomplete=off>");
					out.print("&nbsp;<input id=butTrdAccSrch name=butTrdAccSrch type=submit value='Search'>");
					out.println("");
				}
			%>
		</td></form>
<%
		daDueAmt = settle.getTotalOSPos("D", "P", sCliCode, g_sDefBHCode, sBHCliCode, sBHBranch);
		dT0 = daDueAmt[0];
		dT1 = daDueAmt[1];
		dT2 = daDueAmt[2];
		dT3 = daDueAmt[3];
		dOverdue = daDueAmt[4];
		
		clibean = new N2NMFCliInfoBean();

		clibean.setCliCode(sCliCode);
		clibean.setBhcode(g_sDefBHCode);								
		clibean.setBhbranch(sBHBranch);
		clibean.setBhCliCode(sBHCliCode);				

		//rs = oN2NSession.cliinfo.getCliOSSmy(clibean);
		rs = cli.getCliOSSmy(clibean);
		if (rs != null && rs.next()) {
			dTotalContraLoss = rs.getDouble("TotalContraLoss");
			dTotalMiscLoss = rs.getDouble("TotalOthDebit");
			dTotalInterestLoss = rs.getDouble("TotalIntDebit");
			rs.close();
		}
		else {
			dTotalContraLoss = 0;
			dTotalMiscLoss = 0;
			dTotalInterestLoss = 0;			
		}

		if (g_sDefBHCode.equals("065") || g_sDefBHCode.equals("086")) {
			oRst = settle.getPendingContraAndInt("A",clibean);				
			if (oRst != null && oRst.next()) {
				dPendingAmt = oRst.getDouble("TotalContra");
				oRst.close();
			}
			oRst = settle.getPendingContraAndInt("B",clibean);				
			if (oRst != null && oRst.next()) {
				dSuccContractAmt = oRst.getDouble("TotalContra");
				oRst.close();
			}
		}

		if (g_sDefBHCode.equals("076")) {
			dTotal = dT3 + dT2 + dT1 + dTotalContraLoss + dTotalMiscLoss + dTotalInterestLoss + dOverdue;
		} else {
			dTotal = dT3 + dT2 + dT1 + dTotalContraLoss + dTotalMiscLoss + dTotalInterestLoss + dOverdue; //- dPendingAmt - dSuccContractAmt;
		}
		//oN2NSession.cliinfo.closeResultset();
		//oN2NSession.cliinfo.dbDisconnect();
		cli.closeResultset();
		cli.dbDisconnect();
		clibean.reset();
%>
	</tr>
	<tr>
		<TD>&nbsp;Status</TD>
		<TD>:&nbsp;</TD>
		<TD><select name=selStatus id=selStatus onchange='selOption_OnChange("")'><option value=''>All</option><option value='A' <%if (sStatus.equals("A")) { out.print(" selected");}%>>Pending</option><option value='B' <%if (sStatus.equals("B")) { out.print(" selected");}%>>Successful</option><option value='C' <%if (sStatus.equals("C")) { out.print(" selected");}%>>Failed</option></select></TD>
	</tr>	
<%
	dTotalPending = 0;
	dTotalSuccess = 0;
	if (sHistory.equals("")) {
		oRst = settle.stlGetAmt(sBHCliCode,"A",dtLongFormat.format(dtToday),dtLongFormat.format(dtToday),sCliCode,g_sDefBHCode,sBHBranch);
		if (oRst != null) {
			while (oRst.next()) {
				sReadDocNo = oRst.getString("refno");
				if (!(sLastDocNo.equals(sReadDocNo))) {
					sLastDocNo = sReadDocNo;
					dTotalPending = dTotalPending + oRst.getDouble("amt");
				}	
			}
			oRst.close();
		}
		oRst = settle.stlGetAmt(sBHCliCode,"B",dtLongFormat.format(dtToday),dtLongFormat.format(dtToday),sCliCode,g_sDefBHCode,sBHBranch);
		if (oRst != null) {
			while (oRst.next()) {
				sReadDocNo = oRst.getString("refno");
				if (!(sLastDocNo.equals(sReadDocNo))) {
					sLastDocNo = sReadDocNo;
					dTotalSuccess = dTotalSuccess + oRst.getDouble("amt");
				}	
			}
			oRst.close();
		}
	} else {
		oRst = settle.stlGetAmt(sBHCliCode,"A",null,dtLongFormat.format(dtOutstanding),sCliCode,g_sDefBHCode,sBHBranch);
		if (oRst != null) {
			while (oRst.next()) {
				sReadDocNo = oRst.getString("refno");
				if (!(sLastDocNo.equals(sReadDocNo))) {
					sLastDocNo = sReadDocNo;
					dTotalPending = dTotalPending + oRst.getDouble("amt");
				}	
			}
			oRst.close();
		}
		oRst = settle.stlGetAmt(sBHCliCode,"B",null,dtLongFormat.format(dtOutstanding),sCliCode,g_sDefBHCode,sBHBranch);
		if (oRst != null) {
			while (oRst.next()) {
				sReadDocNo = oRst.getString("refno");
				if (!(sLastDocNo.equals(sReadDocNo))) {
					sLastDocNo = sReadDocNo;
					dTotalSuccess = dTotalSuccess + oRst.getDouble("amt");
				}	
			}
			oRst.close();
		}	
	}
%>
	<TR>
		<TD>&nbsp;Total Amount Paid Successful</TD>
		<TD>:&nbsp;</TD>
		<TD>RM <%=dfValue.format(dTotalSuccess)%></TD>
	</TR>
	<TR>
		<TD>&nbsp;Total Amount Paid Pending</TD>
		<TD>:&nbsp;</TD>
		<TD>RM <%=dfValue.format(dTotalPending)%></TD>
	</TR>	
	<tr>
		<td>&nbsp;Current Outstanding</td>
		<td>:&nbsp;</td>
		<td>RM <%=dfValue.format(dTotal)%></td>
<!-- document and link -->
		<% if (g_sDefBHCode.equals("079")) { %>
			<td align=right><a href=/gc/Doc/Resubmit_Status_Guide.pdf target=_new><b>How to Resubmit? (23.6KB)</b> <img border=0 src=/img/gc/xpdownl.gif width=18 height=18 title='Download' style='cursor:hand'></a></td>
		<% }%>		
	</tr>	
</TABLE>
<%
	if (sStatus.equals("")) {
		if (sHistory.equals("")) {
			oRst = settle.getReceipt(null,sBHCliCode,null,dtLongFormat.format(dtToday),dtLongFormat.format(dtToday),sCliCode,g_sDefBHCode,sBHBranch);
		} else {
			oRst = settle.getReceipt(null,sBHCliCode,null,null,dtLongFormat.format(dtOutstanding),sCliCode,g_sDefBHCode,sBHBranch);
		}
	} else {
		if (sHistory.equals("")) {
			oRst = settle.getReceipt(null,sBHCliCode,sStatus,dtLongFormat.format(dtToday),dtLongFormat.format(dtToday),sCliCode,g_sDefBHCode,sBHBranch);
		} else {
			oRst = settle.getReceipt(null,sBHCliCode,sStatus,null,dtLongFormat.format(dtOutstanding),sCliCode,g_sDefBHCode,sBHBranch);
		}
	}
		
	if (oRst != null) {
		if (sHistory.equals("")) {
%>
			<TABLE width=600>
				<DIV align=right>
					<% if (g_sDefBHCode.equals("076")) { %>
					<input type=button value='Old System Records' onclick='butOldHistory_OnClick()'></input>&nbsp;
					<% } %>
					<input type=button value='History' onclick='butHistory_OnClick()'></input>					
				</DIV>
			</TABLE>
<%		} else { %>
			<TABLE width=600>
				<DIV align=right>
					<input type=button value='Today' onclick='butToday_OnClick()'></input>
				</DIV>
			</TABLE>
<%  	}
		
		int iRow = 0;
		double dReadAmt = 0;
		String sReadStatus = "";
		sLastDocNo = "";
		out.println("<table border=0 cellpadding=0 cellspacing=0 width=600>");
		out.println("<tr class=clsRepHeader>");
		out.println("<td width='20%' class=clsRepFirstCol style=' border-right-color: #FFFFFF'>Payment</td>");
		out.println("<td width='25%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Date / Time</td>");
		out.println("<td width='10%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Details</td>");
		out.println("<td width='20%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Amount</td>");
		out.println("<td width='15%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Status</td>");
		out.println("<td width='10%' class=clsRepLastCol>&nbsp;</td>");
		out.println("</tr>");
		out.println("</table>");
		out.println("<div id=divPayStatus style='overflow:auto'>");
		out.println("<table id=tblPayStatus border=0 cellpadding=0 cellspacing=0 width=600>");
		while (oRst.next()) {
			sReadDocNo = oRst.getString("refno");
			dReadAmt = oRst.getDouble("amt");
			sReadStatus = oRst.getString("status");
			if (!(sLastDocNo.equals(sReadDocNo))) {
				sLastDocNo = sReadDocNo;
				iRow = iRow + 1;
				if (iRow % 2 == 0) {
					out.println("<tr width=100% class=clsRepRowEven>");
				} else {
					out.println("<tr width=100% class=clsRepRowOdd>");
				}
				out.println("<td width='20%' class=clsRepFirstCol>&nbsp;<a style='cursor: hand' onclick=GoDetails('"+g_sPath+"/stlPayDetail.jsp?RefNo=" + sReadDocNo + "')><u>" + sReadDocNo + "</u></a></td>");		
				out.println("<td width='25%' class=clsRepMidCol>&nbsp;" + oRst.getString("last_update") + "</td>");
				out.println("<td width='10%' class=clsRepMidCol align=center>");
				if (oRst.getString("DocNo") != "") {
					out.print("<img src='"+g_sPath+"/img/Magni");
					if (iRow % 2 == 1) {
						out.print("Bg");
					}
					out.print(".gif' style='cursor: hand' onclick=GoContracts('"+g_sPath+"/stlPayContract.jsp?RefNo=" + sReadDocNo + "&Acc=" + sBHCliCode + "-" + sBHBranch + "')>");
				} else {
					out.print("&nbsp;");
				}
				out.println("</td>");
				out.println("<td width='20%' align=right class=clsRepMidCol>" + dfValue.format(dReadAmt) + "&nbsp;</td>");
				if (sReadStatus.equals("A")) {
						out.println("<td width='15%' class=clsRepMidCol>&nbsp;Pending</td>");
						out.println("<td width='10%' class=clsRepLastCol>&nbsp;&nbsp;<a style='cursor: hand' onclick=GoResubmit('"+g_sPath+"/stlChkBankPayment.jsp?RefNo=" + sReadDocNo + "&Acc=" + sBHCliCode + "-" + sBHBranch + "')><u>Resubmit</u></a></td>");
				} else if (sReadStatus.equals("B")) {
						out.println("<td width='15%' class=clsRepMidCol>&nbsp;Successful</td>");
						out.println("<td width='10%' class=clsRepLastCol>&nbsp;</td>");
				} else if (sReadStatus.equals("C")) {
						out.println("<td width='15%' class=clsRepMidCol>&nbsp;Failed</td>");
						out.println("<td width='10%' class=clsRepLastCol>&nbsp;</td>");
				}
				out.println("</tr>");
			}
		}
		if (oRst!=null) {
			oRst.close();	
		}
		out.println("</table></div>");
		iNumRow = iRow;
	} 
	if (iNumRow == 0) {
		out.println("<font style='font-family:Arial;font-size:8pt;'>There is no record found</font>");
	}
	out.println("<table cellspacing=0 width=600>");
	out.println("<tr class=clsRepHeader><td style='FONT-SIZE: 1mm'>&nbsp;</td></tr>");
	out.println("</table>");

	settle.closeResultset();
	settle.dbDisconnect();
%>
</BODY>
</HTML>
<script language='JavaScript'>
function Body_OnLoad()
{
	document.all.selTrdAcc.disabled = false;
<%if (iNumRow > 0) {%>
	if (document.all.tblPayStatus.rows.length > 11) {
		document.all.divPayStatus.style.height = 140
	}
<%}%>	
<%	
//	Call AutoRefreshNoFocus()
%>
}

function selOption_OnChange(vsTrdAcc)
{
	var sURL = "<%=g_sPath%>/stlPayStatus.jsp?<%if (!(sHistory.equals(""))) { out.print("History=Y&");}%>";

	if (vsTrdAcc != null && vsTrdAcc != '') {
		sURL += 'Acc='+ vsTrdAcc;
	} else if (document.all.selTrdAcc.selectedIndex >= 0) {
		//get the account no/code
		var sAcc
		sAcc = document.all.selTrdAcc.value
		sURL += 'Acc='+ sAcc.substr(1)
	}
	sURL += "&Status=" + document.all.selStatus.value;
	<%/*AutoRefreshGo()*/%>
	window.location.href = sURL;
}

function GoDetails(LinkURL)
{
	window.open(LinkURL, "PaymentDetails", "top=0,left=0,height=100,width=520,status=no,toolbar=no,menubar=no,location=no");
}

function GoContracts(LinkURL)
{
	window.open(LinkURL, "PaymentContract", "top=0,left=0,height=200,width=790,status=no,toolbar=no,menubar=no,location=no");
}

function GoResubmit(LinkURL)
{
	window.open(LinkURL, "ResubmitPayment", "top=10,left=10,height=400,width=700,status=no,toolbar=no,menubar=no,location=no");
}

function butHistory_OnClick()
{
	var sURL = "<%=g_sPath%>/stlPayStatus.jsp?History=Y&Acc=";

	sURL += document.all.selTrdAcc.value.substr(1);
	sURL += "&Status=" + document.all.selStatus.value;
	window.location.href = sURL;
}

function butOldHistory_OnClick()
{
	OpenLinkWindow("/hist/n2ntranshis.asp", "WinPopUp", "left=10,top=10,width=615,height=550,scrollbars=No,resizable=No")
}

// added by clleong 20081031
function frmTrdAccSrch_OnSubmit(voFrm) {
	if (voFrm != null) {
		if (voFrm.butTrdAccSrch.value == 'Search') {
			voFrm.selTrdAcc.style.display = 'none';
			voFrm.txtTrdAccSrch.style.display = '';
			voFrm.butTrdAccSrch.value = ' GO ';
			voFrm.txtTrdAccSrch.focus();
		} else {
			voFrm.selTrdAcc.style.display = '';
			voFrm.txtTrdAccSrch.style.display = 'none';
			voFrm.butTrdAccSrch.value = 'Search';
			findTrdAcc(voFrm.txtTrdAccSrch.value, voFrm.selTrdAcc);
		}
	}
	return false;
}

//aded by clleong 20081031
function findTrdAcc(vsSearch, voCtrl) {
	var nLen = vsSearch.length; var sTmp;
	if (nLen <= 0) { return 0; }
	vsSearch = vsSearch.toUpperCase();
	for (i = 1; i < g_lstAccList.length; ++i) {
		sTmp = g_lstAccList[i];
		if (sTmp.indexOf(vsSearch) >=0) {
			voCtrl.selectedIndex = i; selOption_OnChange(vsSearch); break; }
	}
	if (isAdminUser() || isBankDealer()) {
		if (i == g_lstAccList.length) { selOption_OnChange(vsSearch); }
	}
}

function butToday_OnClick()
{
	var sURL = "<%=g_sPath%>/stlPayStatus.jsp?Acc=";

	sURL += document.all.selTrdAcc.value.substr(1);
	sURL += "&Status=" + document.all.selStatus.value;
	window.location.href = sURL;
}
</script>
<%	
	} else {
		out.println("You are not allow to access this page !");
	}
	
	}
	else{
		response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
	}
%>