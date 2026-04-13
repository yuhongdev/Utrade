<%@ page import = "java.sql.*,java.text.DecimalFormat,java.text.SimpleDateFormat,java.util.*" %>
<%@ page import = "com.n2n.util.*" %>
<%@ page import = "com.n2n.bean.N2NMFCliInfoBean" %>
<%@ page import = "com.n2n.DB.N2NMFCliInfo" %>
<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>

<%@ include file='common.jsp'%>
<%@ include file='util/sessionCheck.jsp'%>

<%!
	public String GetTrxType(String vsDocType, String vsCurDocNoHdr) {
		
		String sTrxType = "";
		int iDocType = -1, iCurDocNoHdr = -1;
		
		if (vsDocType.equals("S")) {			iDocType = 1;
		} else if (vsDocType.equals("P")) {		iDocType = 2;
		} else if (vsDocType.equals("C")) {		iDocType = 3;
		} else if (vsDocType.equals("O")) {		iDocType = 4;
			if (vsCurDocNoHdr.equals("DN")){			iCurDocNoHdr = 1;
			} else if (vsCurDocNoHdr.equals("JL")) {	iCurDocNoHdr = 2;
			} else if (vsCurDocNoHdr.equals("JA")) {	iCurDocNoHdr = 3;
			} else if (vsCurDocNoHdr.equals("JM")) {	iCurDocNoHdr = 4;
			} else if (vsCurDocNoHdr.equals("JV")) {	iCurDocNoHdr = 5;
			} else if (vsCurDocNoHdr.equals("RA")) {	iCurDocNoHdr = 6;
			} else if (vsCurDocNoHdr.equals("XF")) {	iCurDocNoHdr = 7;
			} else {									iCurDocNoHdr = 8;
			}
		}
		switch (iDocType) {
			case 1:	sTrxType = "Sell"; 		break;
			case 2: sTrxType = "Purchase";	break;
			case 3:	sTrxType = "Contra";	break;
			case 4:
				switch (iCurDocNoHdr) {
					case 1:	sTrxType = "Rollover Fees";		break;
					case 2: sTrxType = "Journal";			break;
					case 3:	sTrxType = "Journal";			break;
					case 4:	sTrxType = "Margin Interest";	break;
					case 5:	sTrxType = "Dividend";			break;
					case 6:	sTrxType = "Receipt";			break;
					case 7:	sTrxType = "CDS Charges";		break;
					case 8: default:
							sTrxType = "Other";				break;
				}
		}
		return sTrxType;
	} // End of public String GetTrxType
	
	public String DrawHeader(String TypeOfHeader) {
	
		String strHTML = "";
	
		strHTML =           "<table border=0 name=tblOSDtlHdr id=tblOSDtlHdr cellpadding=0 cellspacing=0 width=700>\n";
		strHTML = strHTML + "	<tr><td colspan=9>";
		
		if (TypeOfHeader.equalsIgnoreCase("D") ) {
			strHTML = strHTML + "&nbsp;Outstanding Purchases, Contra Losses and Debit Notes Due From You";
		} else {
			strHTML = strHTML + "&nbsp;Sales Proceeds, Contra Profits,Trust Money and Credit Notes Due To You";
		}
		
		strHTML = strHTML + "		</td>\n";
		strHTML = strHTML + "	</tr>\n";
		strHTML = strHTML + "	<tr class=clsRepHeader>\n";
		strHTML = strHTML + "		<td width='10%' class=clsRepFirstCol style='border-right-color: #FFFFFF'>Trans Date</td>\n";
		strHTML = strHTML + "		<td width='10%' class=clsRepMidCol   style='border-right-color: #FFFFFF'>Due Date</td>\n";
		strHTML = strHTML + "		<td width='14%' class=clsRepMidCol   style='border-right-color: #FFFFFF'>Ref No</td>\n";
		strHTML = strHTML + "		<td width='15%' class=clsRepMidCol   style='border-right-color: #FFFFFF'>Stock Name</td>\n";
		strHTML = strHTML + "		<td width='10%' class=clsRepMidCol   style='border-right-color: #FFFFFF'>Unit Price</td>\n";
		strHTML = strHTML + "		<td width='10%' class=clsRepMidCol   style='border-right-color: #FFFFFF'>Qty</td>\n";
		strHTML = strHTML + "		<td width='15%' class=clsRepMidCol   style='border-right-color: #FFFFFF'>Amount</td>\n";
		strHTML = strHTML + "		<td width='10%' class=clsRepMidCol>Acc Interest</td>\n";
		strHTML = strHTML + "		<td width='6%'  class=clsRepLastCol>&nbsp;</td>\n";
		strHTML = strHTML + "	</tr>\n";
		strHTML = strHTML + "</table>\n";
		
		return strHTML;
	}
	
	public String genPrint(String g_sImgPath) {
		String strHTML = "";
		strHTML = "<img border=0 src=" + g_sImgPath + "/butPrint.gif width=18 height=18 title='Print' style='cursor:pointer' onclick='beforePrint();window.print();afterPrint();'>";		
		return strHTML;
	}
	
	public String GenHelpBulb(String strTitle,String g_sImgPath) {
		String strHTML = "";
		strHTML = "<img id=imgHelp border=0 width=20 height=19 src=" + g_sImgPath + "/lightbulboff.jpg";
		strHTML = strHTML + " onmouseover=\"this.src='" + g_sImgPath + "/lightbulbon.jpg'\"";
		strHTML = strHTML + " onmouseout=\"this.src='" + g_sImgPath + "/lightbulboff.jpg'\"";
		strHTML = strHTML + " title=\"" + strTitle + "\">";		
		return strHTML;
	}
	
	public String setupTrdAccSrchUI() {
		String strHTML = "";
		strHTML = "<input id=txtTrdAccSrch name=txtTrdAccSrch style='display:none;width:180px' autocomplete=off>&nbsp;\n";
		strHTML = strHTML + "		<input id=butTrdAccSrch name=butTrdAccSrch type=submit value='Search'>";
		return strHTML;
	}
%>
<%
	DecimalFormat dfValue     = new DecimalFormat("#,###,###,##0.00");
	DecimalFormat df4Value    = new DecimalFormat("#,###,###,##0.0000");
	DecimalFormat dfQty       = new DecimalFormat("#,###,###,##0");
	SimpleDateFormat dtFormat = new SimpleDateFormat("dd/MM/yyyy");
	
	String FEED_REQFLD_SEP = "|";
	
	final int i_divBOSPrtfDebit  = 1;
	final int i_divBOSPrtfCredit = 2;
	int i_Content = 0;

	String sDocNo   = "";

	String strCliCode = g_sCliCode;
	String strLoginID = g_sLoginId;
	String strBHCode    = g_sDefBHCode;
	String strBHBranch  = g_sDefBHBranch;
	String strBHCliCode = "";

	String strCliName = g_sCliName;
	String strRmsName = g_sRmsName;
	strRmsName = strRmsName != null ? strRmsName : "-";
	if (strRmsName.equals("")) { strRmsName = "-"; }
	strCliName = strCliName != null ? strCliName : "-";
	if (strCliName.equals("")) { strCliName = "-"; }

	String selTrdAcc = (String) request.getParameter("Acc");
	selTrdAcc = selTrdAcc != null ? selTrdAcc : "";
	
	ResultSet oRst = null;
	
	//if (oN2NSession.getIsUserLogin()) {
	if (validSession) {
%>
<html>
<head>
<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
<script language=JavaScript src="<%=g_sJSPath%>/LinkFunc.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/N2NPrnFunc.js"></script>
<title><%=oN2NSession.getSetting("WebSiteName")%> - Summary of Client's Outstanding Position</title>
</head>

<!--body onload=Body_OnLoad() style='background:#ffffff;margin:5px 0px 0px 6px'-->
<body onload=Body_OnLoad() class='clsBody'>

<table border=0 cellpadding=0 cellspacing=0 width=700>
	<tr>
		<td class=clsSectionHeader style='height:19px' width='94%'>&nbsp;Summary Of Client's Outstanding Position</td>
		<td width='6%'>
		<%=genPrint(g_sImgPath)%>
		<%=GenHelpBulb("Summary: Display your financial position in this securities",g_sImgPath)%>
		</td>
	</tr>
</table>

<table border=0 cellpadding=0 cellspacing=0 width=600>
	<tr>
		<td width='20%'>&nbsp;Client's Name :</td>	
		<td width='80%'>&nbsp;<%=strLoginID%>&nbsp;&nbsp;<label id=lblCliName></label></td>
	</tr>
	<tr>
		<td>&nbsp;Account Number :</td>
		<td><form id=frmTrdAcc onsubmit='return frmTrdAccSrch_OnSubmit(this);'>
			<select id=selTrdAcc name=selTrdAcc style='height:22px;width:270px' onchange='selOption_OnChange("")'>
			<%/*<option value=0>All*/%>
<%
		N2NMFCliInfoBean clibean = new N2NMFCliInfoBean();
		clibean.setCliCode(strCliCode);
		clibean.setBhcode(strBHCode.trim());
		clibean.setBhbranch(strBHBranch);
		clibean.setBhCliCode("");
		clibean.setAccountType("");
		
		String def_selBHCode = "", def_selBHCliCode = "", def_selBHBranch = "";
		
		int m_nAcctNoListCnt = 0;

		//-- [list out all of Acct No] -----------------------------------------------------
		//oRst = oN2NSession.cliinfo.getBHCliInfoByCliCode(clibean, "C", 0, "", "KL");
		cli.init(oN2NSession);
		oRst = cli.getBHCliInfoByCliCode(clibean, "C", 0, "", "KL");

		if (oRst != null) {

			String selBHCliCode        = "";
			String selBHCode           = "";
			String selBHBranch         = "";
			String selAccType          = "";
			String selBrokerageRate    = "";
			String selMaxPriceInterval = "";
			String selCliName          = "";

			String selValue = "";
			String selTitle = "";

			while (oRst.next()) {
				
				m_nAcctNoListCnt++;
				if(m_nAcctNoListCnt>1) out.print("\n");
				
				selBHCliCode        = oRst.getString("BHCliCode").trim();
				selBHCode           = oRst.getString("BHCode");
				selBHBranch         = oRst.getString("BHBranch");
				selAccType          = oRst.getString("AccType");
				selBrokerageRate    = oRst.getString("BrokerageRate");
				selMaxPriceInterval = oRst.getString("MaxPriceInterval");
				selCliName          = oRst.getString("CliName");
								
				selValue = selAccType + selBHCliCode + "-" + selBHBranch;
				
				selTitle = "";

				if (selAccType.equals(N2NConst.TRD_ACCTYPE_NONMARGIN))
					selTitle = N2NConst.TRD_ACCTYPEDESC_NONMARGIN;
				else if (selAccType.equals(N2NConst.TRD_ACCTYPE_MARGIN))
					selTitle = N2NConst.TRD_ACCTYPEDESC_MARGIN;
				else if (selAccType.equals(N2NConst.TRD_ACCTYPE_NOMINEE))
					selTitle = N2NConst.TRD_ACCTYPEDESC_NOMINEE;
				else if (selAccType.equals(N2NConst.TRD_ACCTYPE_BHNOMINEE))
					selTitle = N2NConst.TRD_ACCTYPEDESC_BHNOMINEE;
				else if (selAccType.equals(N2NConst.TRD_ACCTYPE_EES))
					selTitle = N2NConst.TRD_ACCTYPEDESC_EES;
				else if (selAccType.equals(N2NConst.TRD_ACCTYPE_ESOS))
					selTitle = N2NConst.TRD_ACCTYPEDESC_ESOS;
				else if (selAccType.equals(N2NConst.TRD_ACCTYPE_EXTESOS))
					selTitle = N2NConst.TRD_ACCTYPEDESC_EXTESOS;
				else if (selAccType.equals(N2NConst.TRD_ACCTYPE_EXTMARGIN))
					selTitle = N2NConst.TRD_ACCTYPEDESC_EXTMARGIN;
				
				selTitle = selTitle + " (" + selBHCliCode + "-" + selBHBranch + ")";

				if (selTrdAcc.equals(selBHCliCode+"-"+selBHBranch)) {
					out.print("				<option value='" + selValue + "' selected>" + selTitle );
					//clibean.reset();
					clibean.setBhcode(selBHCode.trim());
					clibean.setBhCliCode(selBHCliCode);
					
					clibean.setCliCode(strCliCode);
					//clibean.setBhcode(strBHCode);
					clibean.setBhbranch(selBHBranch);
					//clibean.setBhCliCode("");
				} else {
					out.print("	\t\t\t<option value='" + selValue + "'>" + selTitle );
					
					if (m_nAcctNoListCnt == 1) {
						def_selBHCode    = selBHCode; 
						def_selBHCliCode = selBHCliCode;
						def_selBHBranch  = selBHBranch;
					}
				}
				
				if ( g_sCategory.equals(N2NConst.CLI_CATEGORY_SADMIN)    ||
					 g_sCategory.equals(N2NConst.CLI_CATEGORY_ADMIN)     ||
					 g_sCategory.equals(N2NConst.CLI_CATEGORY_DEALER)    ||
					 g_sCategory.equals(N2NConst.CLI_CATEGORY_REMOTERMS)
				) { out.print(" " + selCliName); 
				}
				
			} // End of while oRst.next()
		} // if (oRst != null)

		oRst.close();
		oRst = null;
		
		if (selTrdAcc.equals("") && (m_nAcctNoListCnt > 0)) {
			//clibean.reset();
			clibean.setBhcode(def_selBHCode.trim());
			clibean.setBhCliCode(def_selBHCliCode);
					
			clibean.setCliCode(strCliCode);
			//clibean.setBhcode(strBHCode);
			clibean.setBhbranch(def_selBHBranch);
			//clibean.setBhCliCode("");
		}
		
		//-- End of [list out all of Acct No] -----------------------------------------------------
%>
			</select>
<%
	// just isAdminUser() Or isBankDealer() can use Search Acct Func Only
	if ( g_sCategory.equals(N2NConst.CLI_CATEGORY_SADMIN)    ||
		 g_sCategory.equals(N2NConst.CLI_CATEGORY_ADMIN)     ||
		 g_sCategory.equals(N2NConst.CLI_CATEGORY_DEALER)    ||
		 g_sCategory.equals(N2NConst.CLI_CATEGORY_REMOTERMS)
	) {
%>
		<%=setupTrdAccSrchUI()%>
<%
	}
%>
		</td></form>
	</tr>
</table>

<br>

<table id=tblRptSumm cellpadding=0 cellspacing=0 width=700>
<%
		//out.println("[usp_mfGetCliOSSmy][CliCode='"+clibean.getCliCode()+"', BHCode='" +clibean.getBhcode() );
		//out.println("', BHBranch='" +clibean.getBhbranch()+ "', BHCliCode='" +clibean.getBhCliCode()+ "']\n");
		//usp_mfGetCliOSSmy 'A02021', '086', '001', '9GG0101'
		//out.println("usp_mfGetCliOSSmy '"+clibean.getCliCode()+"', '" +clibean.getBhcode() );
		//out.println("', '" +clibean.getBhbranch()+ "', '" +clibean.getBhCliCode()+ "'\n");
		
		//oRst = oN2NSession.cliinfo.getCliOSSmy(clibean);
		oRst = cli.getCliOSSmy(clibean);

		if ( (oRst != null) && (oRst.next()) ) {
		
			String sTotalPurchDue    = oRst.getString("TotalPurchDue");
			String sTotalPurchNotDue = oRst.getString("TotalPurchNotDue");
			String sTotalContraLoss  = oRst.getString("TotalContraLoss");
			String sTotalOthDebit    = oRst.getString("TotalOthDebit");
			String sTotalIntDebit    = oRst.getString("TotalIntDebit");
			
			String sTotalSell        = oRst.getString("TotalSell");
			String sTotalContraGain  = oRst.getString("TotalContraGain");
			String sTotalOthCredit   = oRst.getString("TotalOthCredit");
			String sTotalTrust       = oRst.getString("TotalTrust");
			String sTotalIntCredit   = oRst.getString("TotalIntCredit");
			
			double dTotalPurchDue    = 0;
			double dTotalPurchNotDue = 0;
			double dTotalContraLoss  = 0;
			double dTotalOthDebit    = 0;
			double dTotalIntDebit    = 0;
			
			double dTotalSell       = 0;
			double dTotalContraGain = 0;
			double dTotalOthCredit  = 0;
			double dTotalTrust      = 0;
			double dTotalIntCredit  = 0;
			
			double dblTotalPayable    = 0;
			double dblTotalReceivable = 0;
			
			try {
				dTotalPurchDue = Double.valueOf(sTotalPurchDue).doubleValue();
			} catch (NumberFormatException nfe) {
				dTotalPurchDue = 0;
			}
			try {
				dTotalPurchNotDue = Double.valueOf(sTotalPurchNotDue).doubleValue();
			} catch (NumberFormatException nfe) {
				dTotalPurchNotDue = 0;
			}
			try {
				dTotalContraLoss = Double.valueOf(sTotalContraLoss).doubleValue();
			} catch (NumberFormatException nfe) {
				dTotalContraLoss = 0;
			}
			try {
				dTotalOthDebit = Double.valueOf(sTotalOthDebit).doubleValue();
			} catch (NumberFormatException nfe) {
				dTotalOthDebit = 0;
			}
			try {
				dTotalIntDebit = Double.valueOf(sTotalIntDebit).doubleValue();
			} catch (NumberFormatException nfe) {
				dTotalIntDebit = 0;
			}
			
			try {
				dTotalSell = Double.valueOf(sTotalSell).doubleValue();
			} catch (NumberFormatException nfe) {
				dTotalSell = 0;
			}
			try {
				dTotalContraGain = Double.valueOf(sTotalContraGain).doubleValue();
			} catch (NumberFormatException nfe) {
				dTotalContraGain = 0;
			}
			try {
				dTotalOthCredit = Double.valueOf(sTotalOthCredit).doubleValue();
			} catch (NumberFormatException nfe) {
				dTotalOthCredit = 0;
			}
			try {
				dTotalTrust = Double.valueOf(sTotalTrust).doubleValue();
			} catch (NumberFormatException nfe) {
				dTotalTrust = 0;
			}
			try {
				dTotalIntCredit = Double.valueOf(sTotalIntCredit).doubleValue();
			} catch (NumberFormatException nfe) {
				dTotalIntCredit = 0;
			}
			
			out.print("<tr class=clsRepHeader>\n");
			out.print("	<td width='60%' class=clsRepFirstCol style='border-right-color: #FFFFFF'>Account Summary</td>\n");
			out.print("	<td width='20%' class=clsRepMidCol style='border-right-color: #FFFFFF'>Due From You</td>\n");
			out.print("	<td width='20%' class=clsRepLastCol>Due To You</td>\n");
			out.print("</tr>\n");
			
			// Outstanding Purchase 'Contract Due'
			out.print("<tr class=clsRepRowOdd>\n");
			out.print("	<td width='60%' class=clsRepFirstCol align=left>&nbsp;O/S Purchase Contracts Due</td>\n");
			
			if (dTotalPurchDue != 0) {
				out.print("	<td width='20%' class=clsRepMidCol align=right>");
				out.print(dfValue.format(dTotalPurchDue));
				out.print("&nbsp;</td>\n");
			} else {
				out.print("	<td width='20%' class=clsRepMidCol align=right>-&nbsp;</td>\n");
			}
			
			out.print("	<td width='20%' class=clsRepLastCol align=right>&nbsp;</td>\n");
			out.print("</tr>\n");
			
			// Outstanding Purchase 'Contract Not Due'
			out.print("<tr class=clsRepRowEven>\n");
			out.print("	<td width='60%' class=clsRepFirstCol align=left>&nbsp;O/S Purchase Contracts  Not Due</td>\n");
			
			if (dTotalPurchNotDue != 0) {
				out.print("	<td width='20%' class=clsRepMidCol align=right>");
				out.print(dfValue.format(dTotalPurchNotDue));
				out.print("&nbsp;</td>\n");
			} else {
				out.print("	<td width='20%' class=clsRepMidCol align=right>-&nbsp;</td>\n");
			}
			
			out.print("	<td width='20%' class=clsRepLastCol align=right>&nbsp;</td>\n");
			out.print("</tr>\n");

			// Outstanding 'Contra Loss'
			out.print("<tr class=clsRepRowOdd>\n");
			out.print("	<td width='60%' class=clsRepFirstCol align=left>&nbsp;O/S Contra Loss</td>\n");
			
			if (dTotalContraLoss != 0) {
				out.print("	<td width='20%' class=clsRepMidCol align=right>");
				out.print(dfValue.format(dTotalContraLoss));
				out.print("&nbsp;</td>\n");
			} else {
				out.print("	<td width='20%' class=clsRepMidCol align=right>-&nbsp;</td>\n");
			}
			
			out.print("	<td width='20%' class=clsRepLastCol align=right>&nbsp;</td>\n");
			out.print("</tr>\n");

			// Outstanding 'Debit Notes'
			out.print("<tr class=clsRepRowEven>");
			out.print("	<td width='60%' class=clsRepFirstCol align=left>&nbsp;O/S Debit Notes</td>\n");
			
			if (dTotalOthDebit != 0) {
				out.print("	<td width='20%' class=clsRepMidCol align=right>");
				out.print(dfValue.format(dTotalOthDebit));
				out.print("&nbsp;</td>\n");
			} else {
				out.print("	<td width='20%' class=clsRepMidCol align=right>-&nbsp;</td>\n");
			}
			
			out.print("	<td width='20%' class=clsRepLastCol align=right>&nbsp;</td>\n");
			out.print("</tr>\n");

			// Outstanding 'Interest Owing on Pricipal Settled'
			out.print("<tr class=clsRepRowOdd>\n");
			out.print("	<td width='60%' class=clsRepFirstCol align=left>&nbsp;O/S Interest Owing on Principal Settled</td>\n");
			
			if (dTotalIntDebit != 0) {
				out.print("	<td width='20%' class=clsRepMidCol align=right>");
				out.print(dfValue.format(dTotalIntDebit));
				out.print("&nbsp;</td>\n");
			} else {
				out.print("	<td width='20%' class=clsRepMidCol align=right>-&nbsp;</td>\n");
			}
			
			out.print("	<td width='20%' class=clsRepLastCol align=right>&nbsp;</td>\n");
			out.print("</tr>\n");

			dblTotalPayable = dTotalPurchDue + dTotalPurchNotDue + dTotalContraLoss + dTotalOthDebit + dTotalIntDebit;

			// 'Subtotal of Debit items'
			out.print("<tr class=clsRepRowEven>\n");
			out.print("	<td width='60%' class=clsRepFirstCol align=left>&nbsp;</td>\n");
			
			if (dblTotalPayable != 0) {
				out.print("	<td width='20%' class=clsRepMidCol align=right>");
				out.print(dfValue.format(dblTotalPayable));
				out.print("&nbsp;</td>\n");
			} else {
				out.print("	<td width='20%' class=clsRepMidCol align=right>-&nbsp;</td>\n");
			}
			
			out.print("	<td width='20%' class=clsRepLastCol align=right>&nbsp;</td>\n");
			out.print("</tr>\n");
			
			//--------------------------End of Debit Item ------------------------------------------

			// 'Total Sell'
			out.print("<tr class=clsRepRowOdd>\n");
			out.print("	<td width='60%' class=clsRepFirstCol align=left>&nbsp;O/S Sales Contract</td>\n");
			out.print("	<td width='20%' class=clsRepMidCol align=left>&nbsp;</td>\n");
			
			if (dTotalSell != 0) {
				out.print("	<td width='20%' class=clsRepLastCol align=right>");
				out.print(dfValue.format(dTotalSell));
				out.print("&nbsp;</td>\n");
			} else {
				out.print("	<td width='20%' class=clsRepLastCol align=right>-&nbsp;</td>\n");
			}
			
			out.print("</tr>\n");
			
			// 'Contra Profit'
			out.print("<tr class=clsRepRowEven>\n");
			out.print("	<td width='60%' class=clsRepFirstCol align=left>&nbsp;O/S Contra Profit</td>\n");
			out.print("	<td width='20%' class=clsRepMidCol align=left>&nbsp;</td>\n");
			
			if (dTotalContraGain != 0 ) {
				out.print("	<td width='20%' class=clsRepLastCol align=right>");
				out.print(dfValue.format(dTotalContraGain));
				out.print("&nbsp;</td>\n");
			} else {
				out.print("	<td width='20%' class=clsRepLastCol align=right>-&nbsp;</td>\n");
			}
			
			out.print("</tr>\n");
			
			// 'Credit Note'
			out.print("<tr class=clsRepRowOdd>\n");
			out.print("	<td width='60%' class=clsRepFirstCol align=left>&nbsp;O/S Credit Notes</td>\n");
			out.print("	<td width='20%' class=clsRepMidCol align=left>&nbsp;</td>\n");
			
			if ( dTotalOthCredit != 0) {
				out.print("	<td width='20%' class=clsRepLastCol align=right>");
				out.print(dfValue.format(dTotalOthCredit));
				out.print("&nbsp;</td>\n");
			} else {
				out.print("	<td width='20%' class=clsRepLastCol align=right>-&nbsp;</td>\n");
			}
			
			out.print("</tr>\n");
			
			// 'Trust Money'
			out.print("<tr class=clsRepRowEven>\n");
			out.print("	<td width='60%' class=clsRepFirstCol align=left>&nbsp;Trust Money</td>\n");
			out.print("	<td width='20%' class=clsRepMidCol align=right>&nbsp;</td>\n");
			
			if (dTotalTrust != 0) {
				out.print("	<td width='20%' class=clsRepLastCol align=right>");
				out.print(dfValue.format(dTotalTrust));
				out.print("&nbsp;</td>\n");
			} else {
				out.print("	<td width='20%' class=clsRepLastCol align=right>-&nbsp;</td>\n");
			}
			
			out.print("</tr>\n");
			
			// 'Interest Earned On trust money'
			out.print("<tr class=clsRepRowOdd>\n");
			out.print("	<td width='60%' class=clsRepFirstCol align=left>&nbsp;Interest Earned on Trust Money</td>\n");
			out.print("	<td width='20%' class=clsRepMidCol align=left>&nbsp;</td>\n");
			
			if (dTotalIntCredit != 0) {
				out.print("	<td width='20%' class=clsRepLastCol align=right>");
				out.print(dfValue.format(dTotalIntCredit));
				out.print("&nbsp;</td>\n");
			} else {
				out.print("	<td width='20%' class=clsRepLastCol align=right>-&nbsp;</td>\n");
			}
			
			out.print("</tr>\n");
			
			dblTotalReceivable = dTotalTrust + dTotalSell + dTotalContraGain + dTotalOthCredit + dTotalIntCredit;

			out.print("<tr class=clsRepHeader>\n");
			out.print("	<td width='60%' class=clsRepFirstCol style='border-right-color: #FFFFFF' align=right>Net Balance From / Due to You&nbsp;</td>\n");
			
			if (dblTotalPayable > dblTotalReceivable) {
				out.print("	<td width='20%' class=clsRepMidCol align=right>");
				double dblTotal = dblTotalReceivable - dblTotalPayable;
				if (dblTotal<0) dblTotal = dblTotal * (-1);
				out.print(dfValue.format(dblTotal));
				out.print("&nbsp;</td>\n");
				out.print("	<td width='20%' class=clsRepLastCol	>&nbsp;</td>\n");
			} else {
				out.print("	<td width='20%' class=clsRepMidCol	style='border-right-color: #FFFFFF'>&nbsp;</td>\n");
				out.print("	<td width='20%' class=clsRepLastCol align=right>");
				double dblTotal = dblTotalPayable - dblTotalReceivable;
				if (dblTotal<0) dblTotal = dblTotal * (-1);
				out.print(dfValue.format(dblTotal));
				out.print("</td>\n");
			}
			
			out.print("</tr>\n");

			out.print("</table>\n\n");
			out.print("<br>\n");

			double dInterest = 0,  dPrice = 0,  dTotal = 0,  dQty = 0;
			String sInterest = "", sPrice = "", sTotal = "", sQty = "";
			
			String sCurrDocType = "A";
			String sParam = "";
			String sDebit = "";
			String sStkShtName = "";
			
			String sCurDoc  = "";
			String sDocType = "";
			
			String sDueDate = "";
			
			int intRow = 0;
			
			ResultSet oRst2 = null;

			//out.print("[usp_mfGetCliOSPOS][CliCode='"+clibean.getCliCode()+"', BHCode='" +clibean.getBhcode() );
			//out.print("', BHBranch='" +clibean.getBhbranch()+ "', BHCliCode='" +clibean.getBhCliCode()+ "']\n");
			
			//out.println("usp_mfGetCliOSPOS '"+clibean.getCliCode()+"', '" +clibean.getBhcode() );
			//out.println("', '" +clibean.getBhCliCode()+ "', '" +clibean.getBhbranch()+ "'\n");

			//oRst2 = oN2NSession.cliinfo.GetCliOSPOS(clibean);
			oRst2 = cli.GetCliOSPOS(clibean);

			if (oRst2 != null) {

				while (oRst2.next()) {
					
					sDebit      = oRst2.getString("Debit");
					sCurDoc     = oRst2.getString("DocNo");
					sStkShtName = oRst2.getString("StkShtName");
					sDocType    = oRst2.getString("DocType");
					sQty        = oRst2.getString("Qty");
					sPrice      = oRst2.getString("Price");
					sTotal      = oRst2.getString("Total");
					sInterest   = oRst2.getString("Interest");
					
					sDueDate    = oRst2.getString("DueDate");
					
					sStkShtName = sStkShtName != null ? sStkShtName : "";
					sDueDate    = sDueDate    != null ? sDueDate    : "";
					
					try {
						dQty = Double.valueOf(sQty).doubleValue();
					} catch (NumberFormatException nfe) {
						dQty = 0;
					}
					try {
						dInterest = Double.valueOf(sInterest).doubleValue();
					} catch (NumberFormatException nfe) {
						dInterest = 0;
					}
					try {
						dPrice = Double.valueOf(sPrice).doubleValue();
					} catch (NumberFormatException nfe) {
						dPrice = 0;
					}
					try {
						dTotal = Double.valueOf(sTotal).doubleValue();
					} catch (NumberFormatException nfe) {
						dTotal = 0;
					}

					//Draw header first
					
					if (!sCurrDocType.equals(sDebit)) {
						
						sCurrDocType = sDebit;
						
						if (sCurrDocType.equals("D")) {
							
							out.print(DrawHeader("D"));
							
							i_Content = i_Content + i_divBOSPrtfDebit;
							
							out.print("\n<div id=divBOSPrtfDebit style='width:717;overflow:auto'>\n");
							out.print("<table border=0 name=tblOSDtlLineDebit id=tblOSDtlLineDebit cellpadding=0 cellspacing=0 width=700>\n");
						
						} else {
							
							if ((i_Content & i_divBOSPrtfDebit) > 0) {
								out.print("</table>\n");
								out.print("</div>\n");
								
								out.print("<table id=tblOSDtlFooter cellpadding=0 cellspacing=0 width=700>\n");
								out.print("<tr class=clsRepHeader><td style='FONT-SIZE: 1mm'>&nbsp;</td></tr>\n");
								out.print("<tr><td >&nbsp;</td></tr>\n");
								out.print("</table>\n");
							}
	
							out.print(DrawHeader("C"));
							
							i_Content = i_Content + i_divBOSPrtfCredit;
							
							out.print("\n<div id=divBOSPrtfCredit style='width:717;overflow:auto'>\n");
							out.print("<table border=0 name=tblOSDtlLineCredit id=tblOSDtlLineCredit cellpadding=0 cellspacing=0 width=700>\n");
						}
					} // if (!sCurrDocType.equals(sDebit))
	
					intRow = intRow + 1;
					
					if ((intRow % 2) == 0)
						out.print("<tr class=clsRepRowEven>\n");
					else
						out.print("<tr class=clsRepRowOdd>\n");
					
					out.print("	<td width='10%' class=clsRepFirstCol style='verticalAlign:bottom'>&nbsp;");
					out.print(dtFormat.format(oRst2.getDate("DocDate")));
					out.print("</td>\n");
					
					if (!sDueDate.equals("")) {
						out.print("	<td width='10%' class=clsRepMidCol style='verticalAlign:bottom'>&nbsp;");
						out.print(dtFormat.format(oRst2.getDate("DueDate")));
						out.print("</td>\n");
					} else {
						out.print("	<td width='10%' class=clsRepMidCol style='verticalAlign:bottom'>&nbsp;</td>\n");
					}
					
					sDocNo = sDocNo + sCurDoc + "|";
					
					if  (!sStkShtName.equals("")) {
							
							if ( (sDocType.equals("P")||sDocType.equals("S")) && (dQty != 0) ) {
								
								sParam = "left=0,top=0,width=730,height=320,scrollbars=no";
								
								out.print("	<td width='14%' class=clsRepMidCol style='text-align:center' name=txtDoc" + intRow + " id=txtDoc" + intRow + ">\n");
								out.print("&nbsp;" + sCurDoc +"</td>\n");
							
							} else if (sDocType.equals("C")) {
								
								sParam = "left=0,top=0,width=730,height=500,scrollbars=no";
								
								out.print("	<td width='14%' class=clsRepMidCol style='text-align:center' name=txtDoc" + intRow + " id=txtDoc"+ intRow + ">");
								out.print("&nbsp;" + sCurDoc +"</td>\n");
							
							} else {
								out.print("	<td width='14%' class=clsRepMidCol style='text-align:center' name=txtDoc" + intRow +" id=txtDoc"+ intRow +">&nbsp;" + sCurDoc +"</td>\n");
							}
							
							out.print("	<td width='15%' class=clsRepMidCol style='text-align:left'>&nbsp;" + sStkShtName + "</td>\n");
	
					} else {
							out.print("<td width='14%' class=clsRepMidCol style='text-align:center' name=txtDoc" + intRow +" id=txtDoc"+ intRow +">&nbsp;" + sCurDoc +"</td>\n");
							out.print("<td width='15%' class=clsRepMidCol style='text-align:left'>&nbsp;</td>\n");
					}
					
					out.print("	<td width='10%' class=clsRepMidCol style='text-align:right'>");
					out.print(df4Value.format(dPrice));
					out.print("&nbsp;</td>\n");
					out.print("	<td width='10%' class=clsRepMidCol style='text-align:right'>");
					out.print(dfQty.format(dQty));
					out.print("&nbsp;</td>\n");
					out.print("	<td width='15%' class=clsRepMidCol style='text-align:right'>");
					out.print(dfValue.format(dTotal));
					out.print("&nbsp;</td>\n");
					out.print("	<td width='10%' class=clsRepMidCol style='text-align:right'>");
					out.print(dfValue.format(dInterest));
					out.print("&nbsp;</td>\n");

					if (sDocType.equals("C")) {
						if ((intRow % 2) == 0) {
							out.print("  <td width='6%' class=clsRepLastCol align=center><img src=" + g_sImgPath + "/magni.gif style='cursor:pointer' onclick=ContraDtl_OnClick(" + intRow + ")></td>");
						} else {
							out.print("  <td width='6%' class=clsRepLastCol align=center><img src=" + g_sImgPath + "/magnibg.gif style='cursor:pointer' onclick=ContraDtl_OnClick(" + intRow + ")></td>");
						}
					} else {
						out.print("	<td width='6%' class=clsRepLastCol align=center>&nbsp;</td>");
					}

					out.print("</tr>\n");

				} // End of while (oRst2.next())

				out.print("</table>\n");
				out.print("</div>\n");
	
				out.print("<table id=tblOSDtlFooter cellpadding=0 cellspacing=0 width=700>\n");
				out.print("	<tr class=clsRepHeader><td style='FONT-SIZE: 1mm'>&nbsp;</td>");
				out.print("</tr>\n");
				out.print("</table>\n");
			
			} // End of if (oRst2 != null)

			oRst2.close();
			oRst2 = null;
		
		} else {
			out.print("<font color=red size=3>There is no record found</font>\n");
		}
		
		oRst.close();
		oRst = null;
		
		//oN2NSession.cliinfo.closeResultset();
		//oN2NSession.cliinfo.dbDisconnect();
		cli.closeResultset();
		cli.dbDisconnect();
%>

<!-- <table border=0 cellpadding=0 cellspacing=0 width=700 bgcolor='#FFFFFF'>
	<tr height=8><td></td></tr>
	<tr>
		<td class='aFooterLink' align='center'>
			<hr>
			<br>
			<font class=clsCopyrightBasic><%=oN2NSession.getSetting("WebSiteName")%>. All rights reserved.</font>
		</td>
	</tr>
</table> -->


<br>

<div id=divPrnFooter name=divPrnFooter>
	<form id=frmPrnFooter name=frmPrnFooter>
		<input type=hidden id=txtLoginID name=txtLoginID value='<%=strLoginID%>' />
		<input type=hidden id=lstTrdAcc name=lstTrdAcc value='' />
		<label id=lblDisplay name=lblDisplay></label>
	</form>
</div>

</body>
</html>

<script language=JavaScript>
function Body_OnLoad() {
<%
		//if ((i_Content & i_divBOSPrtfDebit) = i_divBOSPrtfDebit) {
		out.print("if (document.getElementById('tblOSDtlLineDebit')) {\n");
		out.print("    if (document.getElementById('tblOSDtlLineDebit').rows.length > 5) {\n");
		out.print("        document.getElementById('divBOSPrtfDebit').style.height = 72; }\n");
		out.print("}\n");
		//}

		//if ((i_Content & i_divBOSPrtfCredit) = i_divBOSPrtfCredit) {
		out.print("if (document.getElementById('tblOSDtlLineCredit')) {\n");
		out.print("    if (document.getElementById('tblOSDtlLineCredit').rows.length > 5) {\n");
		out.print("        document.getElementById('divBOSPrtfCredit').style.height = 72; }\n");
		out.print("}\n");
		//}
	
		// just isAdminUser() Or isBankDealer() can use Search Acct Func Only
		if ( g_sCategory.equals(N2NConst.CLI_CATEGORY_SADMIN)    ||
			 g_sCategory.equals(N2NConst.CLI_CATEGORY_ADMIN)     ||
			 g_sCategory.equals(N2NConst.CLI_CATEGORY_DEALER)    ||
			 g_sCategory.equals(N2NConst.CLI_CATEGORY_REMOTERMS)
		) {
			out.print("if (document.getElementById('selTrdAcc').length > 0 && document.getElementById('selTrdAcc').value != '0') {\n");
			out.print("var wds = document.getElementById('selTrdAcc').options[document.getElementById('selTrdAcc').selectedIndex].text.split(')')[1].substring(1); \n");
			out.print("document.getElementById('lblCliName').innerHTML = '[' + wds.toUpperCase() + ']'; \n");
			out.print("}\n");
		}
%>
	document.getElementById('selTrdAcc').disabled = false;
	document.body.focus();
}

function ContraDtl_OnClick(lrow) {
	var sURL
	var sDocNo = "<%=sDocNo%>";
	
	sDocNo = sDocNo.split("<%=FEED_REQFLD_SEP%>")
	sURL = "<%=g_sPath%>/rptContraDtl.jsp?ContraNumber="+ sDocNo[lrow-1];
	window.showModalDialog(sURL, "", "center:yes;dialogWidth:570px;dialogHeight:250px;help:no;status:no");
}

//display different trading limit for different account
function selOption_OnChange(vsTrdAcc)
{
	var sURL
	sURL = "rptSumm.jsp?"

	if (vsTrdAcc != null && vsTrdAcc != '') {
		sURL += 'Acc='+ vsTrdAcc;
	
	} else if (document.getElementById('selTrdAcc').selectedIndex >= 0) {
		//get the account no/code
		var sAcc
		sAcc = document.getElementById('selTrdAcc').value
		sURL += 'Acc='+ sAcc.substr(1)
	}
	window.location.href = sURL
}

// ASP: call setupTrdAccSrchJS()
<%
	// just isAdminUser() Or isBankDealer() can use Search Acct Func Only
	if ( g_sCategory.equals(N2NConst.CLI_CATEGORY_SADMIN)    ||
		 g_sCategory.equals(N2NConst.CLI_CATEGORY_ADMIN)     ||
		 g_sCategory.equals(N2NConst.CLI_CATEGORY_DEALER)    ||
		 g_sCategory.equals(N2NConst.CLI_CATEGORY_REMOTERMS)
	) {
%>
var g_lstAccList=getAccList();

function getAccList() {
	
	var nOffset=0, lstAccList='';
	
	for (i = nOffset; i < document.getElementById('selTrdAcc').length; ++i) {
		lstAccList += document.getElementById('selTrdAcc').options[i].value.substring(1, 9) +' '+ document.getElementById('selTrdAcc').options[i].text +'|'; 
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
	
	var nLen = vsSearch.length; 
	var sTmp;
	if (nLen <= 0) { 
		return 0; 
	}
	vsSearch = vsSearch.toUpperCase();
	
	for (i = 1; i < g_lstAccList.length; ++i) {
		
		sTmp = g_lstAccList[i];
		
		if (sTmp.indexOf(vsSearch) >=0) {
			voCtrl.selectedIndex = i; 
			selOption_OnChange(''); 
			break; 
		}
	}
		
	if (i == g_lstAccList.length) { 
		selOption_OnChange(vsSearch); 
	}
}
<%
	}
%>
</script>

<%
	} // End of if (oN2NSession.getIsUserLogin())
	else{
		response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
	}
%>