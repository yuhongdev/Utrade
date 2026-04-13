<%@ page import = "java.sql.ResultSet,com.n2n.util.N2NConst,com.n2n.util.N2NSecurity,java.util.Calendar,java.util.Date,com.n2n.DB.N2NDateFunc,java.text.SimpleDateFormat,java.text.DecimalFormat,com.n2n.DB.N2NMFCliInfo,com.n2n.bean.N2NMFCliInfoBean,com.n2n.DB.N2NSettlement"%>
<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<%@ include file='/common.jsp'%>
<%@include file="/util/sessionCheck.jsp"%>
<script language=JavaScript src="<%=g_sJSPath%>/N2NFunc.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/N2NPrnFunc.js"></script>
<%
	Date dtToday = new Date();
	SimpleDateFormat dtFormat = new SimpleDateFormat("dd/MM/yyyy");
	SimpleDateFormat dtLongFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
	DecimalFormat dfValue = new DecimalFormat("#,###,###,##0.00");
	DecimalFormat dfPrice = new DecimalFormat("#,###,###,##0.0000");
	DecimalFormat dfPrice2 = new DecimalFormat("#,###,###,##0.000000");

	Calendar calOutstanding = Calendar.getInstance();
	calOutstanding.add(Calendar.DATE,-1);
	Date dtOutstanding = calOutstanding.getTime();

	String sStyle = "visibility:visible;";
	String sExchange ="KL";
	String sLink = "";

	String [] saTrdLimitAndInfo = null;
	String [] aWork = null;
	
	int iHour = 0;

	boolean bStop = false;	

	String sCliCode = "";
	String sBHCliCode = "";
	String sBHBranch = "";	
	String sSelTrdAccNo = "";
	String sStatus = "";
	String sContract = "";
	String sAccType = "";
	
	int iPaymentAllow = 0;
	int intDbtRow = 0;
	int intCrdtRow = 0;

	double dAvailAmt = 0;
	double dT0; double dT1; double dT2; double dT3; double dOverdue;
	double dTotalDue = 0;
	double dTotalContraLoss = 0;
	double dTotalMiscLoss = 0;
	double dTotalInterestLoss = 0;
	double dPendingAmt = 0;
	double dSuccContractAmt = 0;
	double dTotal = 0;
	
	double [] daDueAmt = null;

	Date daT0 = new Date();
	Date daT1 = new Date();
	Date daT2 = new Date();
	Date daT3 = new Date();
	Date daT4 = new Date();
	
	ResultSet rs = null;
	ResultSet oRst = null;
	ResultSet oRstDbt = null;
	ResultSet oRstOther = null;
	ResultSet oRstDate = null;
	
	sCliCode = g_sCliCode;

	N2NMFCliInfoBean clibean = new N2NMFCliInfoBean();
	clibean.setLoginID(g_sLoginId);
	clibean.setCliCode(sCliCode);

	String atpURL = session.getAttribute("ATPURLpublic")!=null?session.getAttribute("ATPURLpublic").toString().trim():oN2NSession.getSetting("atpURL");
	com.n2n.util.N2NATPConnect atp = new com.n2n.util.N2NATPConnect(atpURL);
	com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
	context = atp.getCliInfo(clibean, oN2NSession.getSetting("tradeforgetpinpwdID"));
	java.util.List resultList = new java.util.ArrayList();
	String results[] = null;
	if (context.getErrorMsg().equals("")) {
		resultList = context.getResultsList();
		for (int i=0;i<resultList.size();i++) {
			results = (String[])resultList.get(i);
			g_sDefBHCode = results[22];			
		}
	} else {
		System.out.println("error in getCliInfo during acctInfo:"+context.getErrorMsg());
		// session invalid
	}				
	context = new com.n2n.connection.LoginContext();
	resultList = new java.util.ArrayList();

	//if (oN2NSession.getIsUserLogin()) {
	if (validSession) {
		session.setAttribute("PaymentMade","");
		cli.init(oN2NSession);
	if (!cli.isBankDealer()) {
	
		if (g_sDefBHCode.equals("086")) {
			iHour = dtToday.getHours();
			if (iHour < 9 || iHour >= 23) {
				bStop = true;
			}
		}
		else {
			bStop = false; 
		}
	
		sBHCliCode = request.getParameter("Acc");
		sBHCliCode = sBHCliCode != null ? sBHCliCode : "";
		sContract = request.getParameter("Contract");
		sContract = sContract != null ? sContract : "";
		sStatus = request.getParameter("Status");
		sStatus = sStatus != null ? sStatus : "";

		if (sBHCliCode.length() > 0) {
			aWork = sBHCliCode.split(N2NConst.TRDACC_COL_SEP);
			sBHCliCode = aWork[0];
			if (aWork.length >= 1) {
				sBHBranch = aWork[1];
			}
		}
		
		N2NSettlement settle = new N2NSettlement();
		settle.init(oN2NSession);
		settle.setWriter(out);

%>
<html>
<head>
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">
<title><%=oN2NSession.getSetting("WebSiteName")%> - Summary of Client's Outstanding</title>
</head>
<body onload="Body_OnLoad()" class='clsBody'>
<%
		if (sBHCliCode == "") {
					
			clibean.setCliCode(sCliCode);
			clibean.setBhcode(g_sDefBHCode);								
				
//			rs = oN2NSession.cliinfo.getBHCliInfoByCliCode(clibean,g_sCategory,0,"",sExchange);
//			rs = oN2NSession.cliinfo.getBHCliInfoByCliCode(clibean,"C",0,"",sExchange);

			cli.init(oN2NSession);
			rs = cli.getBHCliInfoByCliCode(clibean,"C",0,"",sExchange);
			
/*			if (rs != null && rs.next()) {
				sAccType = rs.getString("AccType");
				if (sAccType.equals("M")) {
					sBHCliCode = "";
					sBHBranch = "";
				} else {
					sBHCliCode = rs.getString("BHCliCode");
					sBHBranch = rs.getString("BHBranch");
				}
				rs.close();
				rs = null;
			}
*/
			if (rs != null) {
				while (rs.next()) {
					sAccType = rs.getString("AccType");
					if (sAccType.equals("M")) {
						continue;
					} else {
						sBHCliCode = rs.getString("BHCliCode");
						sBHBranch = rs.getString("BHBranch");
						break;
					}
				}
				rs.close();
				rs = null;				
			}
			//oN2NSession.cliinfo.closeResultset();
			//oN2NSession.cliinfo.dbDisconnect();
			cli.closeResultset();
			cli.dbDisconnect();
			clibean.reset();
		}
%>
	<table border=0 cellpadding=0 cellspacing=0 width=<%=iWidth%>>
		<tr>
			<td class=clsSectionHeader width=68%>&nbsp;Step 1: Select Outstanding Transaction(s)</td>
			<td class=clsSectionHeader align=right>Last Update <%=dtFormat.format(dtToday)%>&nbsp;</td>
			<td width='6%'>
				<img border=0 src=<%=g_sImgPath%>/butPrint.gif width=18 height=18 title='Print' style='cursor:pointer' onclick='window.print();'>
				<img id=imgHelp border=0 width=20 height=19 src=<%=g_sImgPath%>/lightbulboff.jpg onmouseover="this.src='<%=g_sImgPath%>/lightbulbon.jpg'" onmouseout="this.src='<%=g_sImgPath%>/lightbulboff.jpg'" title="Summary: Display your financial position in this securities">
			</td>
		</tr>
	</table>
	<BR>
	<table cellpadding=0 cellspacing=0 width=600 height=20>
		<tr>
			<td width=110>&nbsp;Client's Name</td>
			<td width=10>:&nbsp;</td>
			<td colspan=2>&nbsp;<%=g_sLoginId%>&nbsp;&nbsp;<label id=lblCliName></label></td>
		</tr>
		<tr>
			<td width=110>&nbsp;Account Number</td>
			<td>:&nbsp;</td>
			<td width=300><form id=frmTrdAcc onsubmit='return frmTrdAccSrch_OnSubmit(this);'>
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
			</td>					
			<td width=180 align=right>
				<input type=button value="View Client's Outstanding Position" onclick='butOutstanding_OnClick()'></input>
			</td>
			</form>
		</tr>
	<tr><td colspan=4>&nbsp;</td></tr>		
	</table>
	<%		
			clibean.setCliCode(sCliCode);
			clibean.setBhcode(g_sDefBHCode);								
			clibean.setBhbranch(sBHBranch);
			clibean.setBhCliCode(sBHCliCode);				
			//rs = oN2NSession.cliinfo.getCliOSSmy(clibean);
			rs = cli.getCliOSSmy(clibean);

			if (rs != null && rs.next()) {
				oRst = settle.getTrustAmt(clibean);				
				if (oRst != null && oRst.next()) {
					dAvailAmt = oRst.getDouble("Total");
					oRst.close();
				}

				oRst = settle.getPendingTrustAmt(clibean);				
				if (oRst != null && oRst.next()) {
					dAvailAmt = dAvailAmt - oRst.getDouble("Total");
					oRst.close();
				}
				rs.close();				
			}
			else {
				out.println("<font style='font-family:Arial;font-size:8pt;'>There is no record found</font>");
			}
			//oN2NSession.cliinfo.closeResultset();
			//oN2NSession.cliinfo.dbDisconnect();
			cli.closeResultset();
			//cli.dbDisconnect();
			clibean.reset();
	%>
	<table border=0 cellpadding=0 cellspacing=0 width=600 height=20>	
		<% if (!(g_sDefBHCode.equals("076"))) { %>
			<tr>
			<% if (g_sDefBHCode.equals("079")) { %>
				<td width='60%'><font color=red><B>Amount Available to Setoff Outstanding : RM <%=dfValue.format(dAvailAmt)%></B></font></td>
				<td width='40%' valign=top align=right><a href=/Doc/eSettlement_Guide.pdf target=_new><b>How to use eSettlement? (103KB)</b></a></td>
			<% } else { %>
				<td width='60%'><font style='font-family:Arial;font-size:8pt;'><b>Credit Available to Setoff Outstanding : RM <%=dfValue.format(dAvailAmt)%></b></font></td>			
			<% } %>			
			</tr>
		<% } %>
	</table>
	<table cellpadding=0 cellspacing=0 width=750>
		<tr class=clsRepHeader>
			<% if (g_sDefBHCode.equals("079")) { %>
				<td colspan=2 align=left class=clsRepFirstCol style=' border-right-color: #FFFFFF'>&nbsp;Outstanding Items</td>
			<% } else { %>
				<td colspan=2 align=left class=clsRepFirstCol style=' border-right-color: #FFFFFF'>&nbsp;Outstanding as at <%=dtFormat.format(dtOutstanding)%></td>
			<% } %>
			<td align=right class=clsRepLastCol>Debit(RM)&nbsp;</td>
		</tr>
<%
		daDueAmt = settle.getTotalOSPos("D", "P", sCliCode, g_sDefBHCode, sBHCliCode, sBHBranch);
		dT0 = daDueAmt[0];
		dT1 = daDueAmt[1];
		dT2 = daDueAmt[2];
		dT3 = daDueAmt[3];
		dOverdue = daDueAmt[4];
		dTotalDue = dT0 + dT1 + dT2 + dT3 + dOverdue;
		
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

		if (g_sDefBHCode.equals("065") || g_sDefBHCode.equals("086") || g_sDefBHCode.equals("028")) {
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

		rs = settle.getTDueDate();				
		if (rs != null && rs.next()) {
			daT0 = rs.getDate("T0");
			daT1 = rs.getDate("T1");
			daT2 = rs.getDate("T2");
			daT3 = rs.getDate("T3");
			rs.close();
		}

		if (g_sDefBHCode.equals("079")) {
			dTotal = dT3 + dT2 + dT1 + dTotalContraLoss + dTotalMiscLoss + dTotalInterestLoss + dOverdue;
		} else {
			dTotal = dT3 + dT2 + dT1 + dTotalContraLoss + dTotalMiscLoss + dTotalInterestLoss + dOverdue; //- dPendingAmt - dSuccContractAmt;
		}
		//oN2NSession.cliinfo.closeResultset();
		//oN2NSession.cliinfo.dbDisconnect();
		cli.closeResultset();
		//cli.dbDisconnect();
		clibean.reset();
%>
		<tr class=clsRepRowOdd>
			<td width=30% class=clsRepFirstCol>&nbsp;&nbsp;&nbsp;Purchases</td>
			<td>
				<table cellspacing=0 cellpadding=0 width=100%>
					<tr class=clsRepRowEven>
						<% if (g_sDefBHCode.equals("065") || g_sDefBHCode.equals("086") || g_sDefBHCode.equals("028")) { %>
							<td width=34% class=clsRepMidCol>&nbsp;T3 (Due today)</td>
							<td width=33% class=clsRepMidCol>&nbsp;T2 (Due on <%=dtFormat.format(daT2)%>)</td>
							<td width=33% class=clsRepMidCol>&nbsp;T1 (Due on <%=dtFormat.format(daT1)%>)</td>
						<% } else { %>											
							<td class=clsRepMidCol>&nbsp;T3 (<%=dtFormat.format(daT3)%>)</td>
							<td class=clsRepMidCol>&nbsp;T2 (<%=dtFormat.format(daT2)%>)</td>
							<td class=clsRepMidCol>&nbsp;T1 (<%=dtFormat.format(daT1)%>)</td>						
						<% } %>
					</tr>
					<tr class=clsRepRowOdd>
						<td class=clsRepMidCol>&nbsp;<%=dfValue.format(dT3)%></td>
						<td class=clsRepMidCol>&nbsp;<%=dfValue.format(dT2)%></td>
						<td class=clsRepMidCol>&nbsp;<%=dfValue.format(dT1)%></td>
					</tr>
				</table>
			</td>
			<td width=20% align=right class=clsRepLastCol><%=dfValue.format(dT3+dT2+dT1)%>&nbsp;&nbsp;</td>
		</tr>
		<tr class=clsRepRowEven>
			<td colspan=2 class=clsRepFirstCol>&nbsp;&nbsp;&nbsp;Net Contra Loss</td>
			<td align=right class=clsRepLastCol><%=dfValue.format(dTotalContraLoss)%>&nbsp;&nbsp;</td>
		</tr>
		<tr class=clsRepRowOdd>
			<td colspan=2 class=clsRepFirstCol>&nbsp;&nbsp;&nbsp;Miscellaneous Debit</td>
			<td align=right class=clsRepLastCol><%=dfValue.format(dTotalMiscLoss)%>&nbsp;&nbsp;</td>
		</tr>
		<tr class=clsRepRowEven>
			<td colspan=2 class=clsRepFirstCol>&nbsp;&nbsp;&nbsp;Debit Interest</td>
			<td align=right class=clsRepLastCol><%=dfValue.format(dTotalInterestLoss)%>&nbsp;&nbsp;</td>
		</tr>				
		<tr class=clsRepRowOdd>
			<td colspan=2 class=clsRepFirstCol>&nbsp;<a style='cursor: hand' onclick='GoOverdue("<%=g_sPath%>/stlOverdue.jsp?Acc=<%=sBHCliCode%>-<%=sBHBranch%>")'>&nbsp;&nbsp;<U>Overdue Purchases</U></a></td>
			<td align=right class=clsRepLastCol><%=dfValue.format(dOverdue)%>&nbsp;&nbsp;</td>
		</tr>
		<tr class=clsRepHeader>
			<td align=left colspan=2 class=clsRepFirstCol>&nbsp;&nbsp;&nbsp;Total Outstanding Amount</td>
			<td align=right class=clsRepLastCol><%=dfValue.format(dTotal)%>&nbsp;&nbsp;</td>
		</tr>
	</table>
	<BR>

	<% if (g_sDefBHCode.equals("065") || g_sDefBHCode.equals("086") || g_sDefBHCode.equals("028")) { %>
	<table cellpadding=0 cellspacing=0 width=750>
		<tr class=clsRepHeader>
			
			<td colspan=2 align=left class=clsRepFirstCol style=' border-right-color:#FFFFFF'>&nbsp;Settlement Status</td>
			
			<td width=20% align=right class=clsRepLastCol>Debit(RM)&nbsp;</td>
		</tr>

			<tr class=clsRepRowOdd>
				<td colspan=2 class=clsRepFirstCol>&nbsp;&nbsp;&nbsp;Pending Payment</td>
				<td align=right class=clsRepLastCol>(<%=dfValue.format(dPendingAmt)%>)&nbsp;&nbsp;</td>
			</tr>
			<tr class=clsRepRowEven>
				<td colspan=2 class=clsRepFirstCol>&nbsp;&nbsp;&nbsp;Successful Payment</td>
				<td align=right class=clsRepLastCol>(<%=dfValue.format(dSuccContractAmt)%>)&nbsp;&nbsp;</td>
			</tr>

		<tr class=clsRepHeader>
			<td align=left colspan=2 class=clsRepFirstCol>&nbsp;&nbsp;&nbsp;Total Settlement Amount</td>
			<td align=right class=clsRepLastCol>(<%=dfValue.format(dPendingAmt+dSuccContractAmt)%>)&nbsp;&nbsp;</td>
		</tr>
	</table>
	<BR>
	<% }%>
	<%
		clibean = new N2NMFCliInfoBean();

		clibean.setCliCode(sCliCode);
		clibean.setBhcode(g_sDefBHCode);								
		clibean.setBhbranch(sBHBranch);
		clibean.setBhCliCode(sBHCliCode);				

		if (sStatus != "PP" && sStatus != "PD") {
			out.println("<table width=750>");		 		
			out.println("<div align=right>");		 		
			out.println("</div>");		 		
			out.println("</table>");
		}
	
//		oRstDate = settle.getIsPaymentDate(dtLongFormat.format(dtToday));
//		if (oRstDate != null && oRstDate.next()) {
//			iPaymentAllow = oRstDate.getInt("Status");
//		}
//		oRstDate.close();
		
		oRst = settle.getTDate();				
		if (oRst != null && oRst.next()) {
			daT0 = oRst.getDate("T0");
			daT1 = oRst.getDate("T1");
			daT2 = oRst.getDate("T2");
			daT3 = oRst.getDate("T3");
			daT4 = oRst.getDate("T4");
		
			oRst.close();
		}

		Date datTemp = new Date();
		int iInitialLot = 0; int iBalanceLot = 0;
		int iDayLot = 0;
		double dBrokerageRatio = 0;
		String sLastDocNo = "";
		boolean bFirstPayment = false;
		double dBalanceAmt = 0; double dInterest = 0; double dInitialInterest = 0;
		boolean bBreak = false;
		boolean bT4Contract = false;
		int nLotSize = 0;
		String [] aContract = null;
		int iSelectedContract = 0; int iMaxCount = 0;
		boolean bCheckContract = false;
		int iBalanceQty; int iInitialQty; int iLotSize;

		intDbtRow = 0;
		
		out.println("<font color=red face=arial size=2><B>Please select outstanding transaction(s) for settlement.</B>");
		out.println("<table cellpadding=0 cellspacing=0 width=750>");
		out.println("<tr class=clsRepHeader>");
		out.println("<td width='5%' class=clsRepFirstCol style=' border-right-color: #FFFFFF'><img src='"+g_sPath+"/img/check10.gif' width='20'></td>");
		out.println("<td width='9%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Date</td>");
		out.println("<td width='9%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Due Date</td>");
		out.println("<td width='12%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Ref No</td>");
		out.println("<td width='10%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Stock</td>");
		out.println("<td width='7%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Price</td>");
		out.println("<td width='9%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Purc Qty</td>");
		out.println("<td width='11%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>O/S Qty</td>");
		out.println("<td width='8%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Interest</td>");
		out.println("<td width='10%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>O/S Amt</td>");
		out.println("<td width='10%' class=clsRepLastCol>Payable</td>");
		out.println("</tr>");
		out.println("</table>");
		out.println("<table border=0 cellpadding=0 cellspacing=0>");
		out.println("<tr><td>");
		out.println("<div id=divDbt style='overflow:auto'>");
		out.println("<table border=0 name=tblOSDbtLine id=tblOSDbtLine cellpadding=0 cellspacing=0 width=750>");
		aContract = sContract.split("\\" + N2NConst.FEED_REQFLD_SEP);
		if (aContract.length >= 1) {
			iMaxCount = aContract.length;
		}

		oRstDbt = settle.getCliOSPos(clibean,"'P'",null);

		if (oRstDbt != null) {
			while (oRstDbt.next()) {
				bCheckContract = false;
				nLotSize = oRstDbt.getInt("LotSize");
				if (oRstDbt.getInt("OrigQty") < nLotSize) {
					nLotSize = 1;
				}
				
				if (!(sLastDocNo.equals(oRstDbt.getString("DocNo")))) { 
//					iInitialLot = oRstDbt.getInt("OrigQty") / nLotSize;
//					iBalanceLot = (int)((oRstDbt.getInt("Qty") / nLotSize) - oRstDbt.getDouble("TotalLot"));
					iDayLot = oRstDbt.getInt("Qty") / nLotSize;
					iInitialQty = oRstDbt.getInt("OrigQty");
					if (oRstDbt.getInt("Qty") % nLotSize > 0) {		
						iLotSize = 1; //use to calculate the qty of the stock
						iBalanceQty = (int)(oRstDbt.getDouble("Qty") - oRstDbt.getDouble("TotalLot"));
					} else {	
						iLotSize = nLotSize;
						iBalanceQty = (int)(oRstDbt.getDouble("Qty") - (oRstDbt.getDouble("TotalLot") * nLotSize));						
					}

					iBalanceLot = iBalanceQty / nLotSize;

					bFirstPayment = false;
					if (iInitialLot == iBalanceLot || iInitialLot == 0) {
						bFirstPayment = true;
						if ((oRstDbt.getDouble("StampDuty") > 0 && (oRstDbt.getDouble("TotStampDuty") == oRstDbt.getDouble("StampDuty"))) || (oRstDbt.getDouble("ClearingFee") > 0 && (oRstDbt.getDouble("TotClearingFee") == oRstDbt.getDouble("ClearingFee"))) || (oRstDbt.getDouble("MiscAmt") > 0 && (oRstDbt.getDouble("TotMiscAmt") == oRstDbt.getDouble("MiscAmt"))))
							bFirstPayment = false;
					}

					sLastDocNo = oRstDbt.getString("DocNo");

					//This portion is to check those check boxes that has been checked
					if (sContract != "") {
						if (sLastDocNo.trim().equals(aContract[iSelectedContract].trim())) {
							bCheckContract = true;
							if (iSelectedContract < iMaxCount-1) {
								iSelectedContract = iSelectedContract + 1;
							}
						}
					}	

					// T4 Records =================================================
					if (oRstDbt.getDate("DocDate").compareTo(daT4) <= 0) {
						if (datTemp.compareTo(daT4) != 0) {
							bT4Contract = true;
							if (!(bBreak)) {
								out.println("<tr class=clsRepHeader><td style='FONT-SIZE: 1mm' colspan=19>&nbsp;</td></tr>");
								datTemp = daT4;
								intDbtRow = intDbtRow + 3;
								if (intDbtRow % 2 == 0) {
									out.println("<tr width=100% class=clsRepRowEven>");
								} else {
									out.println("<tr width=100% class=clsRepRowOdd>");
								}
								out.println("<td class=clsRepFirstCol>&nbsp;T4+</td>");
								out.println("<td class=clsRepLastCol colspan=10><INPUT type=checkbox id=chkBoxT4 name=chkBoxT4 onclick='chkBoxAll_OnClick(" + intDbtRow + ",this.checked)' disabled=true>&nbsp;<label id=lblT4Msg name=lblT4Msg></label></td></tr>");
								out.println("<tr class=clsRepHeader><td colspan=11 style='FONT-SIZE: 1mm'>&nbsp;</td></tr>");
							}
						}
					} // T3 Records =================================================
					else if (oRstDbt.getDate("DocDate").compareTo(daT3) == 0) {
						if (datTemp.compareTo(daT3) != 0) {
							bT4Contract = false;
							out.println("<tr class=clsRepHeader><td style='FONT-SIZE: 1mm' colspan=19>&nbsp;</td></tr>");
							datTemp = daT3;
							intDbtRow = intDbtRow + 3;
							if (intDbtRow % 2 == 0) {
								out.println("<tr width=100% class=clsRepRowEven>");
							} else {
								out.println("<tr width=100% class=clsRepRowOdd>");
							}
							out.println("<td class=clsRepFirstCol>&nbsp;T3</td>");
							out.println("<td class=clsRepLastCol colspan=10><INPUT type=checkbox id=chkBoxT3 name=chkBoxT3 onclick='chkBoxAll_OnClick(" + intDbtRow + ",this.checked)'></INPUT>Click here to pay all T3</td></tr>");
							out.println("<tr class=clsRepHeader><td colspan=11 style='FONT-SIZE: 1mm'>&nbsp;</td></tr>");	
						}
					} // T2 Records ===================================================
					else if (oRstDbt.getDate("DocDate").compareTo(daT2) == 0) {
						if (datTemp.compareTo(daT2) != 0) {
							bT4Contract = false;
							out.println("<tr class=clsRepHeader><td style='FONT-SIZE: 1mm' colspan=19>&nbsp;</td></tr>");
							datTemp = daT2;
							intDbtRow = intDbtRow + 3;
							if (intDbtRow % 2 == 0) {
								out.println("<tr width=100% class=clsRepRowEven>");
							} else {
								out.println("<tr width=100% class=clsRepRowOdd>");
							}
							out.println("<td class=clsRepFirstCol>&nbsp;T2</td>");
							out.println("<td class=clsRepLastCol colspan=10><INPUT type=checkbox id=chkBoxT2 name=chkBoxT2 onclick='chkBoxAll_OnClick(" + intDbtRow + ",this.checked)'></INPUT>Click here to pay all T2</td></tr>");
							out.println("<tr class=clsRepHeader><td colspan=11 style='FONT-SIZE: 1mm'>&nbsp;</td></tr>");
						}
					} // T1 Records ====================================================
					else if (oRstDbt.getDate("DocDate").compareTo(daT1) == 0) {
						if (datTemp.compareTo(daT1) != 0) {
							bT4Contract = false;
							out.println("<tr class=clsRepHeader><td style='FONT-SIZE: 1mm' colspan=19>&nbsp;</td></tr>");
							datTemp = daT1;
							intDbtRow = intDbtRow + 3;
							if (intDbtRow % 2 == 0) {
								out.println("<tr width=100% class=clsRepRowEven>");
							} else {
								out.println("<tr width=100% class=clsRepRowOdd>");
							}
							out.println("<td class=clsRepFirstCol>&nbsp;T1</td>");
							out.println("<td class=clsRepLastCol colspan=10><INPUT type=checkbox id=chkBoxT1 name=chkBoxT1 onclick='chkBoxAll_OnClick(" + intDbtRow + ",this.checked)'></INPUT>Click here to pay all T1</td></tr>");
							out.println("<tr class=clsRepHeader><td colspan=11 style='FONT-SIZE: 1mm'>&nbsp;</td></tr>");
						}
					}
					else { // T0 Records =================================================
						if (datTemp.compareTo(daT0) != 0) {
							bT4Contract = false;
							out.println("<tr class=clsRepHeader><td style='FONT-SIZE: 1mm' colspan=19>&nbsp;</td></tr>");
							datTemp = daT0;
							intDbtRow = intDbtRow + 3;
							if (intDbtRow % 2 == 0) {
								out.println("<tr width=100% class=clsRepRowEven>");
							} else {
								out.println("<tr width=100% class=clsRepRowOdd>");
							}
							out.println("<td class=clsRepFirstCol>&nbsp;T0</td>");
							out.println("<td class=clsRepLastCol colspan=10><INPUT type=checkbox id=chkBoxT0 name=chkBoxT0 onclick='chkBoxAll_OnClick(" + intDbtRow + ",this.checked)'></INPUT>Click here to pay all T0</td></tr>");
							out.println("<tr class=clsRepHeader><td colspan=11 style='FONT-SIZE: 1mm'>&nbsp;</td></tr>");
						}
					}
					
					if (!(bBreak)) {
						intDbtRow = intDbtRow + 1;
						
						if (iInitialLot != 0) {
							dBrokerageRatio = iBalanceLot / iInitialLot;
						} else {
							dBrokerageRatio = 1;
						}
						
						if (intDbtRow % 2 == 0) {
							if(bFirstPayment) {
								out.println("<tr width=100% id=dtl class=clsRepRowEven docno='" + oRstDbt.getString("DocNo") + "' price='" + oRstDbt.getDouble("Price") + "' origqty='" + oRstDbt.getInt("OrigQty") + "' qty='" + oRstDbt.getInt("Qty") + "' brokerage='" + oRstDbt.getDouble("Brokerage") + "' stamp='" + oRstDbt.getDouble("StampDuty") + "' clearing='" + oRstDbt.getDouble("ClearingFee") + "' misc='" + oRstDbt.getDouble("MiscAmt") + "' interest='" + oRstDbt.getDouble("Interest") + "' balanceqty='" + iBalanceQty + "' lotsize='" + iLotSize + "' initialqty ='" + iInitialQty + "'>");
							} else {
								out.println("<tr width=100% id=dtl class=clsRepRowEven docno='" + oRstDbt.getString("DocNo") + "' price='" + oRstDbt.getDouble("Price") + "' origqty='" + oRstDbt.getInt("OrigQty") + "' qty='" + oRstDbt.getInt("Qty") + "' brokerage='" + oRstDbt.getDouble("Brokerage") + "' stamp='0' clearing='0' misc='0' interest='" + oRstDbt.getDouble("Interest") + "' balanceqty='" + iBalanceQty + "' lotsize='" + iLotSize + "' initialqty ='" + iInitialQty + "'>");					
							}
						} else {
							if(bFirstPayment) {
								out.println("<tr width=100% class=clsRepRowOdd docno='" + oRstDbt.getString("DocNo") + "' price='" + oRstDbt.getDouble("Price") + "' origqty='" + oRstDbt.getInt("OrigQty") + "' qty='" + oRstDbt.getInt("Qty") + "' brokerage='" + oRstDbt.getDouble("Brokerage") + "' stamp='" + oRstDbt.getDouble("StampDuty") + "' clearing='" + oRstDbt.getDouble("ClearingFee") + "' misc='" + oRstDbt.getDouble("MiscAmt") + "' interest='" + oRstDbt.getDouble("Interest") + "' balanceqty='" + iBalanceQty + "' lotsize='" + iLotSize + "' initialqty ='" + iInitialQty + "'>");
							} else {
								out.println("<tr width=100% class=clsRepRowOdd docno='" + oRstDbt.getString("DocNo") + "' price='" + oRstDbt.getDouble("Price") + "' origqty='" + oRstDbt.getInt("OrigQty") + "' qty='" + oRstDbt.getInt("Qty") + "' brokerage='" + oRstDbt.getDouble("Brokerage") + "' stamp='0' clearing='0' misc='0' interest='" + oRstDbt.getDouble("Interest") + "' balanceqty='" + iBalanceQty + "' lotsize='" + iLotSize + "' initialqty ='" + iInitialQty + "'>");				
							}
						}
//						out.println("<td width='1%' style='display:none'>" + Cstr(Cdbl(oRstDbt("Brokerage")) - Cdbl(oRstDbt("TotBrokerage"))) + "</td>")
						out.println("<td width='1%' style='display:none'>" + (oRstDbt.getDouble("Brokerage") - oRstDbt.getDouble("TotBrokerage")) + "</td>");

if (g_sDefBHCode.equals("079") || g_sDefBHCode.equals("086") || g_sDefBHCode.equals("028")) {
	out.println("<td width='1%' style='display:none'>" + (oRstDbt.getDouble("StampDuty") - oRstDbt.getDouble("TotStampDuty")) + "</td>");
	out.println("<td width='1%' style='display:none'>" + (oRstDbt.getDouble("ClearingFee") - oRstDbt.getDouble("TotClearingFee")) + "</td>");
	if (bFirstPayment) {
		out.println("<td width='1%' style='display:none'>" + oRstDbt.getDouble("MiscAmt") + "</td>");
	} else {
		out.println("<td width='1%' style='display:none'>0</td>");
	}
} else {
						if (bFirstPayment) {
							out.println("<td width='1%' style='display:none'>" + oRstDbt.getDouble("StampDuty") + "</td>");
							out.println("<td width='1%' style='display:none'>" + oRstDbt.getDouble("ClearingFee") + "</td>");
							out.println("<td width='1%' style='display:none'>" + oRstDbt.getDouble("MiscAmt") + "</td>");
						} else {
							out.println("<td width='1%' style='display:none'>0</td>");
							out.println("<td width='1%' style='display:none'>0</td>");
							out.println("<td width='1%' style='display:none'>0</td>");
						}
}
						out.println("<td width='1%' style='display:none'>" + iBalanceLot + "</td>");
						out.println("<td width='1%' style='display:none'>" + iInitialLot + "</td>");
						out.println("<td width='1%' style='display:none'>" + iDayLot + "</td>");
						out.println("<td width='1%' style='display:none'>" + (oRstDbt.getDouble("Total")-oRstDbt.getDouble("TotalLot")) + "</td>");

if (g_sDefBHCode.equals("079") || g_sDefBHCode.equals("086") || g_sDefBHCode.equals("028")) {
	out.println("<td width='1%' style='display:none'>" + (oRstDbt.getDouble("Interest") - oRstDbt.getDouble("TotInterest")) + "</td>");
} else {
						out.println("<td width='1%' style='display:none'>" + oRstDbt.getDouble("Interest") + "</td>");
}				
						//To check the check box
						if (bCheckContract) {
							out.print("<td width='4%' class=clsRepFirstCol style='verticalAlign:bottom'><input checked type=checkbox id=checkbox onclick='RecalcTotal()' name=chkDbtSelectPayment" + (intDbtRow-1));
						} else {
							out.print("<td width='4%' class=clsRepFirstCol style='verticalAlign:bottom'><input type=checkbox id=checkbox onclick='RecalcTotal()' name=chkDbtSelectPayment" + (intDbtRow-1));
						}

						if ((iBalanceLot == 0 && nLotSize != -1) || (bT4Contract)) {
							out.print(" disabled=true");
						}
						out.println("></td>");
						out.println("<td width='9%' class=clsRepMidCol style='verticalAlign:bottom'>&nbsp;"+ dtFormat.format(oRstDbt.getDate("DocDate"))+ "</td>");
						if (oRstDbt.getDate("DueDate") != null) {
							out.println("<td width='9%' class=clsRepMidCol style='verticalAlign:bottom'>&nbsp;"+ dtFormat.format(oRstDbt.getDate("DueDate"))+ "</td>");
						} else {
							out.println("<td width='9%' class=clsRepMidCol style='verticalAlign:bottom'>&nbsp;</td>");
						}
						sLink = "\"stlMultiPayment.jsp?ContractNo=" + oRstDbt.getString("DocNo") + "&Acc=" + oRstDbt.getString("BHCliCode").trim() + "-" + oRstDbt.getString("BHBranch").trim() + "\"";
						out.println("<td width='12%' class=clsRepMidCol style='text-align:left'>&nbsp;<a style='cursor: hand' onclick='GoPrevPayment("+ sLink +")'><u>" + oRstDbt.getString("DocNo") + "</u></a></td>");
						if (oRstDbt.getString("StkShtName") != null) {
							out.println("<td width='10%' class=clsRepMidCol style='text-align:left'>&nbsp;" + oRstDbt.getString("StkShtName") + "</td>");
						} else {
							out.println("<td width='10%' class=clsRepMidCol style='text-align:left'>&nbsp;</td>");
						}
						if (oRstDbt.getDouble("Price") != 0) {
							out.println("<td width='7%' class=clsRepMidCol style='text-align:right'>"+ dfPrice2.format(oRstDbt.getDouble("Price")) +"&nbsp;</td>");
						} else {
							out.println("<td width='7%' class=clsRepMidCol style='text-align:right'>&nbsp;</td>");
						}
%>
<%
						if (nLotSize == -1) {
							out.println("<td width='9%' class=clsRepMidCol>&nbsp;</td>");
						} else if (iBalanceQty % nLotSize > 0) {
							out.println("<td width='9%' class=clsRepMidCol>&nbsp;" + oRstDbt.getInt("OrigQty") + " X 1" + "</td>");
						} else {
							out.println("<td width='9%' class=clsRepMidCol>&nbsp;" + (oRstDbt.getInt("OrigQty")/nLotSize) + " X " + nLotSize +"</td>");
						}
						out.println("<td width='11%' class=clsRepMidCol>&nbsp;");
						if (nLotSize != -1) {
							if (iBalanceQty % nLotSize > 0) {
								out.print("<input maxlength=" + Integer.toString(iBalanceQty).length());
							} else {
								out.print("<input maxlength=" + Integer.toString(iBalanceLot).length());
							}
							
							if (g_sDefBHCode.equals("065") || g_sDefBHCode.equals("086") || g_sDefBHCode.equals("028")) {
								out.print("<input maxlength=4 style='width:38;font-size:100%;font-family:Verdana' id=txtQty"+ (intDbtRow-1) +" name=txtQty"+ (intDbtRow-1) +" size=3");
							} else {
								out.print("<input maxlength=3 style='font-size:100%;font-family:Verdana' id=txtQty"+ (intDbtRow-1) +" name=txtQty"+ (intDbtRow-1) +" size=4");
							}
							if (g_sDefBHCode.equals("076")) {
								out.print(" disabled=true");
							}
							if ((!(bT4Contract)) && iBalanceLot > 0) {
								out.print(" onchange='txtQty_OnChange(" + (intDbtRow-1) + ", this)'");
							} else {
								out.print(" disabled=true");
							}
							//odd lot
							if (nLotSize == 1) {
								out.print(" disabled=true value='"+ oRstDbt.getInt("Qty") +"'> X 1");
//							} else {
//								out.print(" title='" + iBalanceLot + "' value='"+ iBalanceLot +"'> X "+ nLotSize);
							} else if (iBalanceQty % nLotSize > 0) {
								out.print(" disabled=true value='"+ iBalanceQty +"'> X 1");
							} else {
								out.print(" title='" + iBalanceLot + "' value='" + iBalanceLot + "'> X "+ nLotSize);			
							}		
						}
						out.println("</td>");

if (g_sDefBHCode.equals("079") || g_sDefBHCode.equals("086") || g_sDefBHCode.equals("028")) {
	out.println("<td width='8%' class=clsRepMidCol style='text-align:right'>"+dfValue.format(oRstDbt.getDouble("Interest") - oRstDbt.getDouble("TotInterest"))+"&nbsp;</td>");
//o/s plus interest
	if (bFirstPayment) {
		out.println("<td width='10%' class=clsRepMidCol style='text-align:right'>"+ dfValue.format(iBalanceLot * nLotSize * oRstDbt.getDouble("Price") + (oRstDbt.getDouble("Brokerage") - oRstDbt.getDouble("TotBrokerage")) + (oRstDbt.getDouble("StampDuty") - oRstDbt.getDouble("TotStampDuty")) + (oRstDbt.getDouble("ClearingFee") - oRstDbt.getDouble("TotClearingFee"))) +"&nbsp;</td>");
	} else {				
		out.println("<td width='10%' class=clsRepMidCol style='text-align:right'>"+ dfValue.format(iBalanceLot * nLotSize * oRstDbt.getDouble("Price") + (oRstDbt.getDouble("Brokerage") - oRstDbt.getDouble("TotBrokerage")) + (oRstDbt.getDouble("StampDuty") - oRstDbt.getDouble("TotStampDuty")) + (oRstDbt.getDouble("ClearingFee") - oRstDbt.getDouble("TotClearingFee")) + (oRstDbt.getDouble("Interest") - oRstDbt.getDouble("TotInterest"))) +"&nbsp;</td>");
	}
} else {
						out.println("<td width='8%' class=clsRepMidCol style='text-align:right'>"+dfValue.format(oRstDbt.getDouble("Interest"))+"&nbsp;</td>");
						// O/S Amt
						if (bFirstPayment) {
							out.println("<td width='10%' class=clsRepMidCol style='text-align:right'>"+ dfValue.format(oRstDbt.getDouble("Total") + oRstDbt.getDouble("MiscAmt")) +"&nbsp;</td>");
						} else {
							out.println("<td width='10%' class=clsRepMidCol style='text-align:right'>"+ dfValue.format(iBalanceLot * nLotSize * oRstDbt.getDouble("Price") + oRstDbt.getDouble("Brokerage") * dBrokerageRatio + oRstDbt.getDouble("Interest")) +"&nbsp;</td>");
						}
}
						if (iBalanceLot != 0 || nLotSize == -1) {
							if (oRstDbt.getString("DocType").equals("P")) {

if (g_sDefBHCode.equals("079") || g_sDefBHCode.equals("086") || g_sDefBHCode.equals("028")) {
//o/s plus interest
	out.println("<td width='10%' class=clsRepLastCol style='text-align:right'>"+ dfValue.format(iBalanceLot * nLotSize * oRstDbt.getDouble("Price") + (oRstDbt.getDouble("Brokerage")  - oRstDbt.getDouble("TotBrokerage")) + (oRstDbt.getDouble("StampDuty") - oRstDbt.getDouble("TotStampDuty")) + (oRstDbt.getDouble("ClearingFee") - oRstDbt.getDouble("TotClearingFee")) + (oRstDbt.getDouble("Interest") - oRstDbt.getDouble("TotInterest"))) +"&nbsp;</td>");
} else {
								if (bFirstPayment) {
									out.println("<td width='10%' class=clsRepLastCol style='text-align:right'>"+ dfValue.format(oRstDbt.getDouble("Total") + oRstDbt.getDouble("Interest") + oRstDbt.getDouble("MiscAmt"))  +"&nbsp;</td>");
								} else {
									out.println("<td width='10%' class=clsRepLastCol style='text-align:right'>"+ dfValue.format(iBalanceLot * nLotSize * oRstDbt.getDouble("Price") + oRstDbt.getDouble("Brokerage") * dBrokerageRatio + oRstDbt.getDouble("Interest")) +"&nbsp;</td>");
								}
}
							} else {
								out.println("<td width='10%' class=clsRepLastCol style='text-align:right'><input style='text-align=right' name=txtAmt" + (intDbtRow-1) + " id=txtAmt" + (intDbtRow-1) + " size=8 value='" + dfValue.format(oRstDbt.getDouble("Total") - oRstDbt.getDouble("TotalLot")) +"' title='" + dfValue.format(oRstDbt.getDouble("Total") - oRstDbt.getDouble("TotalLot")) + "' onchange='txtAmt_OnChange(" + (intDbtRow-1) + ",this.value, this)'></input></td>");
							}
						} else {
							out.println("<td width='10%' class=clsRepLastCol style='text-align:right'>"+ dfValue.format(0) +"&nbsp;</td>");
						}
						out.println("</tr>");
					}
				}
				bBreak = false;
			}
		} 
	
		out.println("<tr class=clsRepHeader><td style='FONT-SIZE: 1mm' colspan=19>&nbsp;</td></tr>");

		if (g_sDefBHCode.equals("076")) {
			oRstOther = settle.getCliOSPos(clibean,"'C','O','B','T'","D");
		} else {
			oRstOther = settle.getCliOSPos(clibean,"'C','O'","D");
		}

		if (oRstOther != null) {
			intDbtRow = intDbtRow + 3;
			if (intDbtRow % 2 == 0) {
				out.println("<tr width=100% class=clsRepRowEven>");
			} else {
				out.println("<tr width=100% class=clsRepRowOdd>");
			}
			out.println("<td class=clsRepFirstCol>&nbsp;</td>");
			out.println("<td class=clsRepLastCol colspan=10><INPUT type=checkbox id=chkBoxOther name=chkBoxOther onclick='chkBoxAll_OnClick(" + intDbtRow + ",this.checked)'></INPUT>Click here to pay all contra & misc.</td></tr>");
			out.println("<tr class=clsRepHeader><td colspan=11 style='FONT-SIZE: 1mm'>&nbsp;</td></tr>");
			while (oRstOther.next()) {
				bCheckContract = false;
				//for oddlot, set LotSize to 1
				nLotSize = oRstOther.getInt("LotSize");
				if (oRstOther.getInt("OrigQty") < nLotSize) {
					nLotSize = 1;
				}

				intDbtRow = intDbtRow + 1;
				iInitialLot = oRstOther.getInt("OrigQty") / nLotSize;
				iBalanceLot = (int)((oRstOther.getInt("Qty") / nLotSize) - oRstOther.getDouble("TotalLot"));
				iDayLot = oRstOther.getInt("Qty") / nLotSize;

				if (iInitialLot == iBalanceLot || iInitialLot == 0) {
					bFirstPayment = true;
					if ((oRstOther.getDouble("StampDuty") > 0 && oRstOther.getDouble("TotStampDuty") == oRstOther.getDouble("StampDuty")) || (oRstOther.getDouble("ClearingFee") > 0 && oRstOther.getDouble("TotClearingFee") == oRstOther.getDouble("ClearingFee")) || (oRstOther.getDouble("MiscAmt") > 0 && oRstOther.getDouble("TotMiscAmt") == oRstOther.getDouble("MiscAmt")))
						bFirstPayment = false;
				}
				dInterest = oRstOther.getDouble("Interest");
				dInitialInterest = dInterest;
				dBalanceAmt = oRstOther.getDouble("Total") - oRstOther.getDouble("TotalLot");

				if (intDbtRow % 2 == 0) {
					out.println("<tr width=100% class=clsRepRowEven>");
				} else {
					out.println("<tr width=100% class=clsRepRowOdd>");
				}
				out.println("<td width='1%' style='display:none'>" + (oRstOther.getDouble("Brokerage") - oRstOther.getDouble("TotBrokerage")) + "</td>");
//				out.println("<td width='1%' style='display:none'>" + oRstOther.getDouble("Brokerage") + "</td>");
if (g_sDefBHCode.equals("079") || g_sDefBHCode.equals("086") || g_sDefBHCode.equals("028")) {
	out.println("<td width='1%' style='display:none'>" + (oRstOther.getDouble("StampDuty") - oRstOther.getDouble("TotStampDuty")) + "</td>");
	out.println("<td width='1%' style='display:none'>" + (oRstOther.getDouble("ClearingFee")- oRstOther.getDouble("TotClearingFee")) + "</td>");
	if (bFirstPayment) {
		out.println("<td width='1%' style='display:none'>" + oRstOther.getDouble("MiscAmt") + "</td>");
	} else {
		out.println("<td width='1%' style='display:none'>0</td>");
	}
} else {
				if (bFirstPayment) {
					out.println("<td width='1%' style='display:none'>" + oRstOther.getDouble("StampDuty") + "</td>");
					out.println("<td width='1%' style='display:none'>" + oRstOther.getDouble("ClearingFee") + "</td>");
					out.println("<td width='1%' style='display:none'>" + oRstOther.getDouble("MiscAmt") + "</td>");
				} else {
					out.println("<td width='1%' style='display:none'>0</td>");
					out.println("<td width='1%' style='display:none'>0</td>");
					out.println("<td width='1%' style='display:none'>0</td>");
				}
}
				out.println("<td width='1%' style='display:none'>" + iBalanceLot + "</td>");
				out.println("<td width='1%' style='display:none'>" + iInitialLot + "</td>");
				out.println("<td width='1%' style='display:none'>" + iDayLot + "</td>");
				if (dBalanceAmt > 0) {
					out.println("<td width='4%' style='display:none'>" + dBalanceAmt + "</td>");
				} else {
					out.println("<td width='4%' style='display:none'>0</td>");
				}
				out.println("<td width='1%' style='display:none'>" + oRstOther.getDouble("Interest") + "</td>");

				if (dBalanceAmt < 0) {
//round 3 decimal point
					dInterest = dInterest + dBalanceAmt;
					if (dInterest == 0) {
						dBalanceAmt = 0;
					} else {
						dBalanceAmt = dBalanceAmt + dInitialInterest;
					}
				} else {
					dBalanceAmt = dBalanceAmt + dInterest;
				}

				//This portion is to check those check boxes that has been checked
				sLastDocNo = oRstOther.getString("DocNo");
				if (sContract != "") {
					if (sLastDocNo.trim().equals(aContract[iSelectedContract].trim())) {
						bCheckContract = true;
						if (iSelectedContract < iMaxCount-1) {
							iSelectedContract = iSelectedContract + 1;
						}
					}
				}
				//To check the check box
				if (bCheckContract) {
					out.print("<td width='4%' class=clsRepFirstCol style='verticalAlign:bottom'><input checked type=checkbox id=checkbox name=chkDbtSelectPayment"+ (intDbtRow-1));
				} else {
					out.print("<td width='4%' class=clsRepFirstCol style='verticalAlign:bottom'><input type=checkbox id=checkbox name=chkDbtSelectPayment"+ (intDbtRow-1));	
				}
				if (dBalanceAmt != 0) {
					out.print(" onclick='RecalcTotal()'");
				} else {
					out.print(" disabled=true");
				}
				out.println("></td>");
				out.println("<td width='9%' class=clsRepMidCol style='verticalAlign:bottom'>&nbsp;"+ dtFormat.format(oRstOther.getDate("DocDate")) + "</td>");
				if (oRstOther.getDate("DocDate") != null) {
					out.println("<td width='9%' class=clsRepMidCol style='verticalAlign:bottom'>&nbsp;"+ dtFormat.format(oRstOther.getDate("DocDate")) + "</td>");
				} else {
					out.println("<td width='9%' class=clsRepMidCol style='verticalAlign:bottom'>&nbsp;</td>");
				}
				sLink = "\"stlMultiPayment.jsp?ContractNo=" + oRstOther.getString("DocNo") + "&Acc=" + oRstOther.getString("BHCliCode").trim() + "-" + oRstOther.getString("BHBranch").trim() + "\"";
				out.println("<td width='12%' class=clsRepMidCol style='text-align:left'>&nbsp;<a style='cursor: hand' onclick='GoPrevPayment(" + sLink + ")'><u>" + oRstOther.getString("DocNo") + "</u></a></td>");
				if (oRstOther.getString("StkShtName") != null) {
					out.println("<td width='10%' class=clsRepMidCol style='text-align:left'>&nbsp;" + oRstOther.getString("StkShtName") + "</td>");
				} else {
					out.println("<td width='10%' class=clsRepMidCol style='text-align:left'>&nbsp;</td>");
				}
				if (oRstOther.getDouble("Price") != 0) {
					out.println("<td width='7%' class=clsRepMidCol style='text-align:right'>"+ dfPrice.format(oRstOther.getDouble("Price")) +"&nbsp;</td>");
				} else {
					out.println("<td width='7%' class=clsRepMidCol style='text-align:right'>&nbsp;</td>");
				}
				if (nLotSize == -1) {
					out.println("<td width='9%' class=clsRepMidCol>&nbsp;</td>");
				} else {
					if (oRstOther.getInt("OrigQty") != 0) {
						out.println("<td width='9%' class=clsRepMidCol>&nbsp;" + (oRstOther.getInt("OrigQty")/nLotSize) + " X " + nLotSize +"</td>");
					} else {
						out.println("<td width='9%' class=clsRepMidCol>&nbsp;</td>");
					}
				}
				out.println("<td width='11%' class=clsRepMidCol>&nbsp;</td>");
				if (oRstOther.getDouble("TotalLot") >= oRstOther.getDouble("Interest")) {
					out.println("<td width='8%' class=clsRepMidCol style='text-align:right' >0.00</td>");
				} else {
					out.println("<td width='8%' class=clsRepMidCol style='text-align:right' >"+dfValue.format(oRstOther.getDouble("Interest")-oRstOther.getDouble("TotalLot"))+"&nbsp;</td>");
				}
				if (oRstOther.getDouble("TotalLot") == oRstOther.getDouble("Total") + oRstOther.getDouble("Interest")) {
					out.println("<td width='10%' class=clsRepMidCol style='text-align:right' >0.00&nbsp;</td>");
					out.println("<td width='10%' class=clsRepLastCol style='text-align:right' ><input disabled=true style='text-align:right;' name=txtAmt" + (intDbtRow-1) + " id=txtAmt" + (intDbtRow-1) + " size=8 value='" + dfValue.format(oRstOther.getDouble("Total") + oRstOther.getDouble("Interest") - oRstOther.getDouble("TotalLot")) +"' title='" + 0.00 + "' onchange='txtAmt_OnChange(" + (intDbtRow-1) + ",this.value, this)'></td>");
				} else {
					if (oRstOther.getDouble("TotalLot") >= oRstOther.getDouble("Interest")) {
						out.println("<td width='10%' class=clsRepMidCol style='text-align:right'>"+ dfValue.format(oRstOther.getDouble("Total") + oRstOther.getDouble("Interest") - oRstOther.getDouble("TotalLot")) +"&nbsp;</td>");
						out.println("<td width='10%' class=clsRepLastCol style='text-align:right'><input style='text-align:right;' name=txtAmt" + (intDbtRow-1) + " id=txtAmt" + (intDbtRow-1) + " size=8 value='" + dfValue.format(oRstOther.getDouble("Total") + oRstOther.getDouble("Interest") - oRstOther.getDouble("TotalLot")) +"' title='" + dfValue.format(dBalanceAmt) + "' onchange='txtAmt_OnChange(" + (intDbtRow-1) + ",this.value, this)'></td>");
					} else {
						out.println("<td width='10%' class=clsRepMidCol style='text-align:right'>"+ dfValue.format(oRstOther.getDouble("Total")) +"&nbsp;</td>");
						out.println("<td width='10%' class=clsRepLastCol style='text-align:right'><input style='text-align:right;' name=txtAmt" + (intDbtRow-1) + " id=txtAmt" + (intDbtRow-1) + " size=8 value='" + dfValue.format(oRstOther.getDouble("Total") + oRstOther.getDouble("Interest") - oRstOther.getDouble("TotalLot")) +"' title='" + "A" + dfValue.format(oRstOther.getDouble("Total")) + "' onchange='txtAmt_OnChange(" + (intDbtRow-1) + ",this.value, this)'></td>");
					}
				}
				out.println("</tr>");				
			}
			if (oRstDbt!=null) {
				oRstDbt.close();		
			}
			if (oRstOther!=null) {
				oRstOther.close();		
			}
		}
		clibean.reset();
		out.println("</table>");
		out.println("</div>");
		out.println("<table border=0 name=tblTotal id=tblTotal cellspacing=0 width=750>");
		out.println("<tr class=clsRepHeader><td width=100% colspan=2 style='FONT-SIZE: 1mm'>&nbsp;</td></tr>");
		out.println("<tr><td width=90% align=right class=clsRepMidCol>");
//		if ((!(bStop)) && iPaymentAllow == 0) {
		if ((!(bStop))) {
			out.print("<INPUT type=button value='    Pay    ' id=butPay name=butPay onclick='Pay_OnClick()'></INPUT>");
		} else {
			out.print("<INPUT type=button value='    Pay    ' id=butPay name=butPay onclick='NoPay_OnClick()'></INPUT>");
		}
		out.println("&nbsp;</td>");
		out.println("<td width=10% align=right class=clsRepLastCol>" + dfValue.format(0) + "&nbsp;</td></tr>");
		out.println("<tr><td style='FONT-SIZE:0.5mm' class=clsRepMidCol>&nbsp;</td><td style='FONT-SIZE: 1mm' class=clsRepHeader>&nbsp;</td></tr>");
		if (g_sDefBHCode.equals("076")) {
			out.println("<tr><td><font style='font-family:Arial;font-size:10pt;'>Important Note : Settlement transactions effected after 6 p.m. shall be for the next trading day's value date.<BR></font><td></tr>");	
		}
		out.println("</table>");
		out.println("<br/>");
		if (settle!=null) {
			settle.closeResultset();
			settle.dbDisconnect();
		}
	%>
<form id=frmSubmit name=frmSubmit action=<%=g_sPath%>/stlSetoff.jsp method=post>
	<input type=hidden id=Acc name=Acc value='<%=sBHCliCode%>-<%=sBHBranch%>'></input>
	<input type=hidden id=Total name=Total value='<%=dTotal%>'></input>
	<input type=hidden id=Contract name=Contract value=''></input>
	<input type=hidden id=Qty name=Qty value=''></input>
	<input type=hidden id=OSAmt name=OSAmt value=''></input>
	<input type=hidden id=Pay name=Pay value=''></input>
	<input type=hidden id=Interest name=Interest value=''></input>
	<input type=hidden id=Brokerage name=Brokerage value=''></input>
	<input type=hidden id=StampDuty name=StampDuty value=''></input>
	<input type=hidden id=ClearingFee name=ClearingFee value=''></input>
	<input type=hidden id=MiscAmt name=MiscAmt value=''></input>
	<input type=hidden id=OSAmtTotal name=OSAmtTotal value=''></input>	
	<input type=hidden id=InterestTotal name=InterestTotal value=''></input>
	<input type=hidden id=ContractTotal name=ContractTotal value=''></input>
</form>
</body>
</html>			
<script language=JavaScript>
window.onload = Body_OnLoad

var g_nDbtRow=<%=intDbtRow%>;
var g_nCrdtRow=<%=intCrdtRow%>;
var g_sRefNo="0";
var g_nRow=-1;

function Body_OnLoad()
{
	document.getElementById("selTrdAcc").disabled = false;
	
	var icount;

	<%if(g_sDefBHCode.equals("065") || g_sDefBHCode.equals("086") || g_sDefBHCode.equals("028")) {%>
	{	
		if (g_nDbtRow > 4) {
			document.all.divDbt.style.height = 115;
		}
	}
	<%} else {%>
	{
		if (g_nDbtRow > 6) {
			document.all.divDbt.style.height = 160;
		}
	}
	<%}%>

	document.getElementById('selTrdAcc').disabled = false;
	
	for (icount = 0; icount < g_nDbtRow; icount++)
	{
		if (document.getElementById("chkDbtSelectPayment" + icount) != null)
		{
			if (document.getElementById("chkDbtSelectPayment" + icount).checked)
			{
				if (document.getElementById("txtQty" + icount) != null)
				{
					txtQty_OnChange(icount, document.getElementById("txtQty" + icount));
				}
				else
				{
					txtAmt_OnChange(icount, document.getElementById("txtAmt" + icount).value, document.getElementById("txtAmt" + icount));
				}
			}
		}
	}
<%
	if(g_sCategory.equals("S") || g_sCategory.equals("A") || g_sCategory.equals("D") || g_sCategory.equals("R")) {
			out.println("if (document.all.selTrdAcc.length > 0 && document.all.selTrdAcc.value != '0') {");
			out.println("document.all.lblCliName.innerText = '['+ document.all.selTrdAcc.options[document.all.selTrdAcc.selectedIndex].text.split(')')[1].substring(1) +']' }");
	}
	out.println("if (document.all.selTrdAcc.value.charAt(0) != '"+ N2NConst.TRD_ACCTYPE_MARGIN +"' && (document.all.lblT4Msg != null))");
	out.println("document.all.lblT4Msg.innerText = ' To be forced sold today ';");
%>
	document.all.selTrdAcc.disabled = false
	document.body.focus();	

}

function NoPay_OnClick()
{
	alert("Dear Valued Clients:\nPlease be advised that our eSettlement and eDeposit services are only avaiable as follows:\n\neSettlement\t: 9:00am to 11:00pm, on business days\neDeposit\t\t: 9:00am to 11:00pm, on business days")
}

function Pay_OnClick()
{
	var sURL;
	var sContractNo, sContractNos;
	var sQty, sQtys;
	var sOSAmt, sOSAmts;
	var sPay, sPays;
	var sInterest, sInterests;
	var sBrokerage, sBrokerages;
	var sStampDuty, sStampDutys;
	var sClearingFee, sClearingFees;
	var sMiscAmt, sMiscAmts;	
	var bChecked;
	var dTotal, dInterestTotal, dOSAmtTotal;	
	var iBalanceLot, iCurrentLot, iInitialLot;
	var iBalanceQty, iCurrentQty, iInitialQty;

	dInterestTotal = 0;
	dOSAmtTotal = 0;
	sContractNos = "";
	nRefNo = "";
	sQtys = "";
	sOSAmts = "";
	sPays = "";
	sInterests = "";
	sBrokerages = "";
	sStampDutys = "";
	sClearingFees = "";
	sMiscAmts = "";	
	bChecked = false;


	for (icount = 0; icount < g_nDbtRow; icount++)
	{
		if (document.getElementById("chkDbtSelectPayment" + icount) != null)
		{
			if (document.getElementById("chkDbtSelectPayment" + icount).checked)
			{
				if (document.getElementById("txtQty" + icount) != null)
				{
					if (!txtQty_OnChange(icount, document.getElementById("txtQty" + icount)))
						return;
				}
				else
				{
					if (!txtAmt_OnChange(icount, document.getElementById("txtAmt" + icount).value, document.getElementById("txtAmt" + icount)))
						return;
				}
			}
		}
	}
	for (var icount = 0; icount < g_nDbtRow; icount++)
	{
		if (document.getElementById("chkDbtSelectPayment" + icount) != null)
		{
			if (document.getElementById("chkDbtSelectPayment" + icount).checked)
			{
				iBalanceLot = parseFloat(document.all.tblOSDbtLine.rows(icount).cells(4).innerText);
				iInitialLot = parseInt(document.all.tblOSDbtLine.rows(icount).cells(5).innerText);
			
				/*Convert all lot into qty*/
				iQty = document.all.tblOSDbtLine.rows[icount].cells[16].innerText;
				iQty = iQty.replace("X", "");
				iQty = iQty.replace(",","");
				iQty = parseInt(iQty.replace(" ", ""));
			
				iInitialQty = parseFloat(iInitialLot) * parseFloat(iQty);
				iBalanceQty = parseFloat(iBalanceLot) * parseFloat(iQty);

				if (iInitialQty < iBalanceQty)
					iInitialQty = iBalanceQty				
									
				sBrokerage = document.all.tblOSDbtLine.rows[icount].cells[0].innerText;
//new add				
				sStampDuty = document.all.tblOSDbtLine.rows[icount].cells[1].innerText;
				sClearingFee = document.all.tblOSDbtLine.rows[icount].cells[2].innerText;

				sContractNo = document.all.tblOSDbtLine.rows[icount].cells[12].innerText;
				sOSAmt = document.all.tblOSDbtLine.rows[icount].cells[7].innerText;

				if (document.getElementById("txtQty" + icount) != null)
				{
					sQty = document.getElementById("txtQty" + icount).value + document.all.tblOSDbtLine.rows[icount].cells[16].innerText;
					iCurrentLot = document.getElementById("txtQty" + icount).value;
					
					iCurrentQty = iCurrentLot * parseFloat(iQty);
					sBrokerage = parseFloat(sBrokerage) * (iCurrentQty / iInitialQty);

//new add
<% if (g_sDefBHCode.equals("079") || g_sDefBHCode.equals("086") || g_sDefBHCode.equals("028")) { %>
		sStampDuty = parseFloat(sStampDuty) * (iCurrentLot / iBalanceLot);
		sClearingFee = parseFloat(sClearingFee) * (iCurrentLot / iBalanceLot);
<% }%>

				}
				else
				{
					sQty = " ";
				}
				if (document.getElementById("txtAmt" + icount) == null)
				{
					sPay = JSstripChar(document.getElementById('tblOSDbtLine').rows[icount].cells[19].innerText, ",");
				}
				else
				{
					sPay = JSstripChar(document.getElementById("txtAmt" + icount).value, ",");
				}
				
				if (document.getElementById("txtQty" + icount) != null)
				{
					sInterest = JSstripChar(document.getElementById('tblOSDbtLine').rows[icount].cells[17].innerText, ","); 
					sInterest = parseFloat(sInterest) * (parseInt(sQty) / iBalanceQty);										
					sOSAmt = parseFloat(sPay) - sInterest;
				}
				else
				{
					sInterest = parseFloat(sPay) - parseFloat(JSstripChar(sOSAmt, ","));	
					if (sInterest < 0)
					{
						sOSAmt = parseFloat(sPay);
						sInterest = 0;
					}
				}
				sInterest = Math.round(sInterest *100) /100;
				dInterestTotal = dInterestTotal + parseFloat(sInterest);
				sOSAmt = Math.round(sOSAmt *100) /100;
				dOSAmtTotal = dOSAmtTotal + parseFloat(sOSAmt);
				
//				sStampDuty = document.all.tblOSDbtLine.rows[icount].cells[1].innerText;
//				sClearingFee = document.all.tblOSDbtLine.rows[icount].cells[2].innerText;
				sMiscAmt = document.getElementById('tblOSDbtLine').rows[icount].cells[3].innerText;
				sContractNos = sContractNos + sContractNo + "|";
				sQtys = sQtys + sQty + "|";
				sOSAmts = sOSAmts + sOSAmt + "|";
				sPays = sPays + sPay + "|";
				sInterests = sInterests + sInterest + "|";
				sBrokerages = sBrokerages + sBrokerage + "|";
				sStampDutys = sStampDutys + sStampDuty + "|";
				sClearingFees = sClearingFees + sClearingFee + "|";
				sMiscAmts = sMiscAmts + sMiscAmt + "|";				
				bChecked = true;
			}
		}
	}

	if (bChecked)
	{
		dTotal = JSstripChar(document.getElementById('tblTotal').rows[1].cells[1].innerText, ",");
		document.frmSubmit.Contract.value = sContractNos;
		document.frmSubmit.Qty.value = sQtys;
		document.frmSubmit.OSAmt.value = sOSAmts;
		document.frmSubmit.Pay.value = sPays;
		document.frmSubmit.Interest.value = sInterests;
		document.frmSubmit.Brokerage.value = sBrokerages;
		document.frmSubmit.StampDuty.value = sStampDutys;
		document.frmSubmit.ClearingFee.value = sClearingFees;
		document.frmSubmit.MiscAmt.value = sMiscAmts;		
		document.frmSubmit.InterestTotal.value = dInterestTotal;
		document.frmSubmit.OSAmtTotal.value = dOSAmtTotal;
		document.frmSubmit.ContractTotal.value = dTotal;
		document.frmSubmit.submit();
	}
	else
	{
		alert("Please select a contract to pay.");
	}
}

function selOption_OnChange(vsTrdAcc)
{
	var sURL = "stlOutstandingCliPos.jsp?";

	if (vsTrdAcc != null && vsTrdAcc != '') {
		sURL += 'Acc='+ vsTrdAcc;
	} else if (document.getElementById('selTrdAcc').selectedIndex >= 0) {
		var sAcc
		sAcc = document.getElementById('selTrdAcc').value;
		sURL += 'Acc='+ sAcc.substr(1);
	}

	window.location.href = sURL;
}

function chkBoxAll_OnClick(iStart, bChecked)
{
	for (var icount = iStart; icount < g_nDbtRow; icount++)
	{
		if (document.getElementById("chkDbtSelectPayment" + icount) != null)
		{
			if (!document.getElementById("chkDbtSelectPayment" + icount).disabled)
			{
				document.getElementById("chkDbtSelectPayment" + icount).checked = bChecked;
			}
		}
		else
		{
			RecalcTotal();
			return;
		}		
	}	
	RecalcTotal();
}

function RecalcTotal()
{
	var dTotal=0;
	
	for (var icount = 0; icount < g_nDbtRow; icount++)
	{
		if (document.getElementById("chkDbtSelectPayment" + icount) != null)
		{
			if (document.getElementById("chkDbtSelectPayment" + icount).checked)
			{
				if (document.getElementById("txtAmt" + icount) == null)
				{
					//alert("dTotal = "+dTotal);
					//alert(document.getElementById('tblOSDbtLine').rows[icount].cells[19].innerHTML);
					
					dTotal = dTotal + parseFloat(JSstripChar(document.all('tblOSDbtLine').rows[icount].cells[19].innerText, ","));
				}
				else
				{
					dTotal = dTotal + parseFloat(JSstripChar(document.getElementById("txtAmt" + icount).value, ","));
				}
			}
		}
	}
	document.getElementById('tblTotal').rows[1].cells[1].innerText = JSformatNumber(dTotal,2);
}

function txtAmt_OnChange(iRow, dCurrentAmt, obj)
{
	var dMaxAmt, sCurrentAmt;
	var bOK=true;

	sCurrentAmt = dCurrentAmt;
	dMaxAmt = parseFloat(JSstripChar(obj.title, ","))
	dCurrentAmt = parseFloat(JSstripChar(dCurrentAmt, ","))
	if (isNaN(dCurrentAmt))
	{
		alert("Please enter a valid amount.");
		obj.value = JSformatNumber(dMaxAmt,2);
		bOK = false
	}
	else if (dCurrentAmt != JSstripChar(sCurrentAmt, ","))
	{
		alert("Please enter a valid amount.");
		obj.value = JSformatNumber(dMaxAmt,2);
		bOK = false
	}
	if (dCurrentAmt > dMaxAmt)
	{
		obj.title = "Maximum amount is " + JSformatNumber(dMaxAmt,2) + ".";
		alert("Maximum amount is " + dMaxAmt + ".");
		obj.value = JSformatNumber(dMaxAmt,2);
		obj.focus();
		bOK = false
	}
	else if (dCurrentAmt <= 0)
	{
		obj.title = "You must pay for a positive amount."
		alert("You must pay for a positive amount.");
		obj.value = JSformatNumber(dMaxAmt,2);
		obj.focus();
		bOK = false
	}	
	RecalcTotal();

	return bOK;
}

function txtQty_OnChange(iRow, obj)
{
	var dBrokerage, dStampDuty, dClearingFee, dMiscAmt, dPrice, dAmt, dInterest;
	var iBalanceLot, iInitialLot, iQty, iCurrentLot, bOK=true;	
	var iBalanceQty, iCurrentQty, iInitialQty, iLotSize;

	
	iBalanceLot = parseFloat(document.getElementById('tblOSDbtLine').rows[iRow].cells[4].innerText);
	iCurrentLot = parseInt(obj.value);

	/*Convert all lot into qty*/
	iQty = document.getElementById('tblOSDbtLine').rows[iRow].cells[16].innerText || document.getElementById('tblOSDbtLine').rows[iRow].cells[16].textContent;
	//alert("iQty 1 = "+iQty);
	iQty = iQty.replace("X", "");
	iQty = iQty.replace(",","");
	iQty = parseInt(iQty.replace(" ", ""));

	//alert("iQty 2 = "+iQty);
	iCurrentQty = parseFloat(obj.value) * parseFloat(iQty);
	//alert("iCurrentQty 1 = "+iCurrentQty);
	iBalanceQty = parseFloat(iBalanceLot) * parseFloat(iQty);
	
	iLotSize = iQty;
	if (isNaN(iCurrentLot) || (iCurrentLot != obj.value))
	{
		alert("Please enter a valid integer quantity.");
		obj.value = iBalanceLot;
		iCurrentQty = iBalanceQty;
		bOK = false
	}
	else if (iCurrentQty > iBalanceQty)
	{
		if (iQty < 100)
		{	
			obj.title = "Maximum number of unit is " + iBalanceQty + ".";
			alert("Maximum number of unit is " + iBalanceQty + ".");
		}
		else
		{
			obj.title = "Maximum number of lot is " + iBalanceLot + ".";
			alert("Maximum number of lot is " + iBalanceLot + ".");		
		}
		obj.value = iBalanceLot;
		iCurrentQty = iBalanceQty;
		obj.focus();
		bOK = false
	}
	else if (iCurrentLot < 1)
	{	
		if (iQty < 100)
		{
			obj.title = "You must pay for at least 1 unit."
			alert("You must pay for at least 1 unit.");
		}
		else
		{
			obj.title = "You must pay for at least 1 lot."
			alert("You must pay for at least 1 lot.");
		}
		obj.value = iBalanceLot;
		iCurrentQty = iBalanceQty;
		obj.focus();
		bOK = false
	}


	obj.title = iBalanceLot;

	dBrokerage = parseFloat(document.getElementById('tblOSDbtLine').rows[iRow].cells[0].innerText);
	dStampDuty = parseFloat(document.getElementById('tblOSDbtLine').rows[iRow].cells[1].innerText);
	dClearingFee = parseFloat(document.getElementById('tblOSDbtLine').rows[iRow].cells[2].innerText);
	dMiscAmt = parseFloat(document.getElementById('tblOSDbtLine').rows[iRow].cells[3].innerText);
//new calculation
	dPrice = parseFloat(document.getElementById('tblOSDbtLine').rows[iRow].price);
	dInterest = parseFloat(document.getElementById('tblOSDbtLine').rows[iRow].cells[17].innerText) * (iCurrentQty / iBalanceQty);
	iInitialQty = parseInt(document.getElementById('tblOSDbtLine').rows[iRow].initialqty);

	dBrokerage = dBrokerage * (iCurrentQty / iBalanceQty);

//new add
<% if (g_sDefBHCode.equals("079") || g_sDefBHCode.equals("086") || g_sDefBHCode.equals("028")) { %>
	{
		dStampDuty = dStampDuty * (iCurrentLot / iBalanceLot);
		dClearingFee = dClearingFee * (iCurrentLot / iBalanceLot);
		dInterest = dInterest * (iCurrentLot / iBalanceLot);
	}
<%	}%>

	//alert("dPrice = "+dPrice);
	//alert("iCurrentQty = "+iCurrentQty);
	//alert("dBrokerage = "+dBrokerage);
	//alert("dStampDuty = "+dStampDuty);
	//alert("dClearingFee = "+dClearingFee);
	//alert("dMiscAmt = "+dMiscAmt);
	//alert("dInterest = "+dInterest);
	dAmt = dPrice * iCurrentQty + dBrokerage + dStampDuty + dClearingFee + dMiscAmt + dInterest;
	//alert("dAmt 1 = "+dAmt);
	dAmt = Math.round(dAmt * 100) / 100;

	var dAmtOS = parseFloat(JSstripChar(document.getElementById('tblOSDbtLine').rows[iRow].cells[18].innerText, ","));
	if (dAmt > dAmtOS) dAmt = dAmtOS;	
	//alert("dAmt 2 = "+dAmt);
	document.getElementById('tblOSDbtLine').rows[iRow].cells[19].innerHTML = JSformatNumber(dAmt, 2) +"&nbsp;";
	RecalcTotal();

	return bOK;
}

<%if(g_sCategory.equals("S") || g_sCategory.equals("A") || g_sCategory.equals("D") || g_sCategory.equals("R")) {%>
	
	var g_lstAccList=getAccList();
	
	function getAccList() {
		var nOffset=0, lstAccList='';
			for (i = nOffset; i < document.getElementById('selTrdAcc').length; ++i) {
				lstAccList += document.getElementById('selTrdAcc').options[i].value.substring(1, 9) +' '+ document.all.selTrdAcc.options[i].text +'|';
			}
			return lstAccList.split('|');
	}
		
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

<%}%>


function GoPrevPayment(LinkURL)
{
	window.open(LinkURL, "Payment", "top=0,left=0,height=350,width=420,status=no,toolbar=no,menubar=no,location=no");
}

function GoOverdue(LinkURL)
{
	window.open(LinkURL, "Overdue", "top=0,left=0,height=230,width=720,status=no,toolbar=no,menubar=no,location=no");
}

function butOutstanding_OnClick()
{
        //added by clleong 20081024
	var sURL
	sURL = "rptSumm.jsp?"

	if (document.getElementById('selTrdAcc').selectedIndex >= 0) {
		//get the account no/code
		var sAcc
		sAcc = document.getElementById('selTrdAcc').value
		sURL += 'Acc='+ sAcc.substr(1)
	}
	//window.location.href = sURL
	window.open(sURL, "WinRepSummary", "left=30,top=100,width=720,height=520,status=no,toolbar=no,menubar=no,location=no");

	//window.open("/gc/rptSumm.jsp?Acc=<%=sBHCliCode + "-" + sBHBranch%>", "WinRepSummary", "left=30,top=100,width=720,height=520,status=no,toolbar=no,menubar=no,location=no");
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