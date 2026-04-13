<%@ page import = "java.sql.*,java.text.DecimalFormat,java.text.SimpleDateFormat,java.util.*" %>
<%@ page import = "com.n2n.util.*" %>
<%@ page import = "com.n2n.bean.N2NMFCliInfoBean" %>
<%@ page import = "com.n2n.DB.N2NMFCliInfo" %>
<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>

<%@ include file='common.jsp'%>
<%@ include file='util/sessionCheck.jsp'%>
<%!
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
	String script_Name = (String) request.getServletPath();
	script_Name = script_Name.replaceAll("/","");

	DecimalFormat dfValue     = new DecimalFormat("#,###,###,##0.00");
	//DecimalFormat dfQty       = new DecimalFormat("#,###,###,##0");
	SimpleDateFormat dtFormat = new SimpleDateFormat("dd/MM/yyyy");

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

	//------------------------
	/*
	strCliCode = "B02010";
	strBHCode  = "086";
	strBHBranch = "001";
	strBHCliCode = "3BB6969";
	*/
	//------------------------
	
	String selTrdAcc = (String) request.getParameter("Acc");
	selTrdAcc = selTrdAcc != null ? selTrdAcc : "";
	
	ResultSet oRst = null;
	
	if (validSession) {
%>
<html>
<head>
<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
<script language=JavaScript src="<%=g_sJSPath%>/LinkFunc.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/N2NPrnFunc.js"></script>
<title><%=oN2NSession.getSetting("WebBHName")%> - Margin Account Summary</title>
</head>

<body onload=Body_OnLoad() class='clsBody'>

<table border=0 cellpadding=0 cellspacing=0 width=700>
	<tr>
		<td class=clsSectionHeader width='94%'>&nbsp;Margin Account Summary</td>
		<td width='6%'>
		<%=genPrint(g_sImgPath)%>
		<%=GenHelpBulb("Summary: This is your Margin Account Summary",g_sImgPath)%>
		</td>
	</tr>
</table>

<table border=0 cellpadding=0 cellspacing=0 width=600>
	<tr height=20>
		<td width='20%'>&nbsp;<b>Client/DealerRep:</b></td>
		<td width='80%'>&nbsp;<%=strCliName.toUpperCase()%>&nbsp;/ <%=strRmsName.toUpperCase()%>&nbsp;<label id=lblCliName></label></td>
	</tr>
	<tr>
		<td>&nbsp;<b>Account:</b></td>
		<td><form id=frmTrdAcc onsubmit='return frmTrdAccSrch_OnSubmit(this);'>
			<select id=selTrdAcc name=selTrdAcc style='height:22px;width:270px' onchange='selOption_OnChange("")'>
			<%/*<option value=0>All*/%>
<%
		N2NMFCliInfoBean clibean = new N2NMFCliInfoBean();
		
		clibean.setCliCode(strCliCode);
		String results[] = getAccountInformations(clibean, oN2NSession, session);
		clibean.setBhcode(results[22]);
		clibean.setBhbranch(results[23]);
		clibean.setBhCliCode("");
		
		clibean.setAccountType("");
		
		String def_selBHCode = "", def_selBHCliCode = "", def_selBHBranch = "";
		
		int m_nAcctNoListCnt = 0;

		//-- [list out all of Acct No] -----------------------------------------------------
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

		if (oRst!=null) {
			oRst.close();
			oRst = null;
		}
		
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


<%
		//usp_mfRptGetCliMgnRpt @vsCliCode ='B02010', @vsBHCode ='086', @vsBHBranch ='001', @vsBHCliCode = '3BB6969'
		//usp_mfRptGetCliMgnRpt 'B02010', '086 ', '001', '3BB6969' 
		//out.println("usp_mfRptGetCliMgnRpt '"+clibean.getCliCode()+"', '" +clibean.getBhcode() );
		//out.println("', '" +clibean.getBhbranch()+ "', '" +clibean.getBhCliCode()+ "'\n");
		
		String sDateTime = "";
		
		boolean blsetTitleDateTime = false;
		cli.closeResultset();
		cli.dbDisconnect();
		
		cli.initRpt(oN2NSession);
		if ( g_sCategory.equals(N2NConst.CLI_CATEGORY_SADMIN)    ||
			 	g_sCategory.equals(N2NConst.CLI_CATEGORY_ADMIN)     ||
			 	g_sCategory.equals(N2NConst.CLI_CATEGORY_DEALER)    ||
			 	g_sCategory.equals(N2NConst.CLI_CATEGORY_REMOTERMS)
			) {
			clibean.setCategory(g_sCategory);
		}
		oRst = cli.getCliMgnRpt(clibean);

		if ( (oRst != null) && (oRst.next()) ) {
			
			String sCreditLimit      = oRst.getString("CrLimit");    // Facility Limt - decimal
			String sOutstandLoan     = oRst.getString("OSBal");      // Outstanding Loan - decimal
			String sCollShareUnCap   = oRst.getString("SecVal");    // Collateral (shares) UnCapped - decimal
			String sMaintenaneMgn    = oRst.getString("ApprMgn");     // Maintenane Margin - decimal
			String sLSRUnCap         = oRst.getString("CurrMgn");     // LSR Uncapped - decimcal
			String sTrdLimit         = oRst.getString("MgnTrd");         // Trading Limit - decimal
			//sDateTime                = oRst.getString("InsertDateTime");
			String sLoanMgn          = oRst.getString("LoanMgn");        // Loan Margin   - decimal
			String sMgnChrgNotCap    = oRst.getString("MgnChrg");        // Margin Charges not Capitalised - decimal
			
			String sRllovrChrgNotCap = oRst.getString("RolloverChrg");   // Rollover Charges not Capitalised - decimal
			String sUnclearChg       = oRst.getString("UnclearChq");     // Uncleared Cheques - decimal
			String sCollShareCap     = oRst.getString("SecValCap"); // Collateral (shares) Capped - decimal
			String sLSRCap           = oRst.getString("CurrMgnCap");  // LSR Capped  - decimal
			
			java.util.Date dtRollOverDate 	 = oRst.getDate("RollOverDt");
			String sFixDeposit		 = oRst.getString("FD");
			String sStatus 			 = oRst.getString("Status");
			String sShortFallCash    = oRst.getString("ShtFallCash");
			String sShortFallSec	 = oRst.getString("ShtFallSec");
			String sForceSell		 = oRst.getString("ForceSell");			
			System.out.println("sRollOverDate:"+dtRollOverDate);			
			String sRollOverDate = dtRollOverDate != null ? ""+dtFormat.format(dtRollOverDate) : "&nbsp;";	
			
			double dCreditLimit      = 0;
			double dOutstandLoan     = 0;
			double dCollShareUnCap   = 0;
			double dMaintenaneMgn    = 0;
			double dLSRUnCap         = 0;
			double dTrdLimit         = 0;
			double dLoanMgn          = 0;
			double dMgnChrgNotCap    = 0;
			double dRllovrChrgNotCap = 0;
			double dUnclearChg       = 0;
			double dCollShareCap     = 0;
			double dLSRCap           = 0;
			double dFixDeposit		 = 0;
			double dShortFallCash    = 0;
			double dShortFallSec 	 = 0;
			double dForceSell		 = 0;
			
			/*
			out.print(sCreditLimit+","+sOutstandLoan+","+sCollShareUnCap+","+sMaintenaneMgn+","+sLSRUnCap+",");
			out.print(sTrdLimit+","+sLoanMgn+","+sMgnChrgNotCap+","+sRllovrChrgNotCap+","+sUnclearChg+",");
			out.print(sCollShareCap+","+sLSRCap);
			out.print(dtFormat.format(oRst.getDate("InsertDateTime")));
			*/
			
			try {
				dCreditLimit = Double.valueOf(sCreditLimit).doubleValue();
			} catch (NumberFormatException nfe) {
				dCreditLimit = 0;
			}
			try {
				dOutstandLoan = Double.valueOf(sOutstandLoan).doubleValue();
			} catch (NumberFormatException nfe) {
				dOutstandLoan = 0;
			}
			try {
				dCollShareUnCap = Double.valueOf(sCollShareUnCap).doubleValue();
			} catch (NumberFormatException nfe) {
				dCollShareUnCap = 0;
			}
			try {
				dMaintenaneMgn = Double.valueOf(sMaintenaneMgn).doubleValue();
			} catch (NumberFormatException nfe) {
				dMaintenaneMgn = 0;
			}
			try {
				dLSRUnCap = Double.valueOf(sLSRUnCap).doubleValue();
			} catch (NumberFormatException nfe) {
				dLSRUnCap = 0;
			}
			try {
				dTrdLimit = Double.valueOf(sTrdLimit).doubleValue();
			} catch (NumberFormatException nfe) {
				dTrdLimit = 0;
			}
			try {
				dLoanMgn = Double.valueOf(sLoanMgn).doubleValue();
			} catch (NumberFormatException nfe) {
				dLoanMgn = 0;
			}
			try {
				dMgnChrgNotCap = Double.valueOf(sMgnChrgNotCap).doubleValue();
			} catch (NumberFormatException nfe) {
				dMgnChrgNotCap = 0;
			}
			try {
				dRllovrChrgNotCap = Double.valueOf(sRllovrChrgNotCap).doubleValue();
			} catch (NumberFormatException nfe) {
				dRllovrChrgNotCap = 0;
			}
			try {
				dUnclearChg = Double.valueOf(sUnclearChg).doubleValue();
			} catch (NumberFormatException nfe) {
				dUnclearChg = 0;
			}
			try {
				dCollShareCap = Double.valueOf(sCollShareCap).doubleValue();
			} catch (NumberFormatException nfe) {
				dCollShareCap = 0;
			}
			try {
				dLSRCap = Double.valueOf(sLSRCap).doubleValue();
			} catch (NumberFormatException nfe) {
				dLSRCap = 0;
			}
			try {
				dFixDeposit = Double.valueOf(sFixDeposit).doubleValue();
			} catch (NumberFormatException nfe) {
				dFixDeposit = 0;
			}
			try {
				dShortFallCash = Double.valueOf(dShortFallCash).doubleValue();
			} catch (NumberFormatException nfe) {
				dShortFallCash = 0;
			}
			try {
				dShortFallSec = Double.valueOf(dShortFallSec).doubleValue();
			} catch (NumberFormatException nfe) {
				dShortFallSec = 0;
			}
			try {
				dForceSell = Double.valueOf(dForceSell).doubleValue();
			} catch (NumberFormatException nfe) {
				dForceSell = 0;
			}
			
			/*
			out.print("<table id=tblRptSumm cellpadding=2 cellspacing=0 width=540 style='BORDER-BOTTOM: #CCCCCC 0.5mm solid'>\n");
			out.print("<tr><td colspan=3 align=right>UPDATED AS AT <label id=lblLastUpdTime></label>&nbsp;08:00:00 AM</td></tr>\n");
			out.print("<tr class=trTableHeader>\n");
			//out.print("	<td style='border-right-color: #ffffff' colspan=3>Margin Account Summary as at <label id=lblLastUpdTime></label>&nbsp;(as at 9am)</td>\n");
			out.print("	<td style='border-right-color: #ffffff' colspan=3>Trading Details</td>\n");
			//out.print("	<td style='border-right-color: #ffffff' colspan=3 height='20'>&nbsp;</td>\n");
			out.print("</tr>\n");
			*/
			
			out.println("<br><table border=0 cellpadding=0 cellspacing=0 width=500>");
			out.println("<tr><td class=clsRepHeader colspan=2 style='font-size:0.5mm'>&nbsp;</td></tr>");
			out.println("<tr class=clsRowEven>");
			out.println("<td width='65%' style='BORDER-LEFT:#4A82AD 0.5mm solid' align=center>&nbsp;<b>TRADING LIMIT FOR THE DAY</b></td>");
			out.println("<td width='35%' style='BORDER-RIGHT:#4A82AD 0.5mm solid' align=center><b>RM&nbsp;"+ dTrdLimit +"</b></td></tr>");
			out.println("<tr><td class=clsRepHeader colspan=2 style='font-size:0.5mm'>&nbsp;</td></tr>");
			out.println("</table><br>");
			
			out.println("<table border=0 cellpadding=0 cellspacing=0 width=500>");
			out.println("<tr class=clsRepHeader>");
			out.println("<td width='65%' class=clsRepFirstCol align=left>&nbsp;Account Information</td>");
			out.println("<td width='35%' class=clsRepLastCol>&nbsp;</td></tr>");
			out.println("<tr class=clsRepRowOdd>");
			out.println("<td class=clsRepFirstCol align=left>&nbsp;Last Rollover Date</td>");
			out.println("<td class=clsRepLastCol align=right>"+ sRollOverDate +"&nbsp;</td></tr>");
			out.println("<tr class=clsRepRowEven>");
			out.println("<td class=clsRepFirstCol align=left>&nbsp;Credit Limit</td>");
			out.println("<td class=clsRepLastCol align=right>RM&nbsp;"+ dCreditLimit +"&nbsp;</td></tr>");
			out.println("<tr class=clsRepRowOdd>");
			out.println("<td class=clsRepFirstCol align=left>&nbsp;Approved Margin</td>");
			out.println("<td class=clsRepLastCol align=right>"+ dMaintenaneMgn +"%&nbsp;</td></tr>");
			out.println("<tr><td class=clsRepHeader colspan=2 style='font-size:1mm'>&nbsp;</td></tr>");
			out.println("</table><br>");
			
			out.println("<table border=0 cellpadding=0 cellspacing=0 width=500>");
			out.println("<tr class=clsRepHeader>");
			out.println("<td width='65%' class=clsRepFirstCol align=left>&nbsp;Collateral</td>");
			out.println("<td width='35%' class=clsRepLastCol>&nbsp;</td></tr>");
			out.println("<tr class=clsRepRowOdd>");
			out.println("<td class=clsRepFirstCol align=left>&nbsp;Fixed Deposit</td>");
			out.println("<td class=clsRepLastCol align=right>RM&nbsp;"+ dFixDeposit +"&nbsp;</td></tr>");
			out.println("<tr class=clsRepRowEven>");
			out.println("<td class=clsRepFirstCol align=left>&nbsp;Security Value (Shares)</td>");
			out.println("<td class=clsRepLastCol align=right>RM&nbsp;"+ sCollShareUnCap +"&nbsp;</td></tr>");
			out.println("<tr><td class=clsRepHeader colspan=2 style='font-size:1mm'>&nbsp;</td></tr>");
			out.println("</table><br>");
			
			out.println("<table border=0 cellpadding=0 cellspacing=0 width=500>");
			out.println("<tr class=clsRepHeader>");
			out.println("<td width='65%' class=clsRepFirstCol align=left>&nbsp;Position</td>");
			out.println("<td width='35%' class=clsRepLastCol>&nbsp;</td></tr>");
			out.println("<tr class=clsRepRowOdd>");
			out.println("<td class=clsRepFirstCol align=left>&nbsp;Outstanding DR/(CR) Balance</td>");
			out.println("<td class=clsRepLastCol align=right>");
			if (dOutstandLoan < 0) 
				out.println("(");			
				out.println("RM&nbsp;"+ dOutstandLoan);
			if (dOutstandLoan < 0)
				out.println(")");
			
			out.println("&nbsp;</td></tr>");
			out.println("<tr class=clsRepRowEven>");
			out.println("<td class=clsRepFirstCol align=left>&nbsp;Current Margin</td>");
			out.println("<td class=clsRepLastCol align=right>"+ dLSRUnCap +"%&nbsp;</td></tr>");
			out.println("<tr class=clsRepRowOdd>");
			out.println("<td class=clsRepFirstCol align=left>&nbsp;Account Status</td>");
			out.println("<td class=clsRepLastCol align=right>"+ sStatus +"&nbsp;</td></tr>");
			out.println("<tr><td class=clsRepHeader colspan=2 style='font-size:1mm'>&nbsp;</td></tr>");
			out.println("</table><br>");
			out.println("<table border=0 cellpadding=0 cellspacing=0 width=500>");
			out.println("<tr class=clsRepHeader>");
			out.println("<td width='65%' class=clsRepFirstCol align=left>&nbsp;Top up Required if Account Status is Breached</td>");
			out.println("<td width='35%' class=clsRepLastCol>&nbsp;</td></tr>");
			out.println("<tr class=clsRepRowOdd>");
			out.println("<td class=clsRepFirstCol align=left>&nbsp;Cash, or</td>");
			out.println("<td class=clsRepLastCol align=right>RM&nbsp;"+ dShortFallCash +"&nbsp;</td></tr>");
			out.println("<tr class=clsRepRowEven>");
			out.println("<td class=clsRepFirstCol align=left>&nbsp;Acceptable Securities, or</td>");
			out.println("<td class=clsRepLastCol align=right>RM&nbsp;"+ dShortFallSec +"&nbsp;</td></tr>");
			out.println("<tr class=clsRepRowOdd>");
			out.println("<td class=clsRepFirstCol align=left>&nbsp;Force Sell</td>");
			out.println("<td class=clsRepLastCol align=right>RM&nbsp;"+ dForceSell +"&nbsp;</td></tr>");
			out.println("<tr><td class=clsRepHeader colspan=2 style='font-size:1mm'>&nbsp;</td></tr>");
			out.println("</table><br>");
			
			
			/*
			String[] sData_Title  = {	"Facility Limit",                   "Trading Limit", 
										"Loan Margin",                      "Maintenance Margin",
								     	"Outstanding Loan",                 "Margin Charges not Capitalised",
								     	"Rollover Charges not Capitalised", "Uncleared Cheques" 
								    };

			String[] sData_Title2       = { "Collateral (shares)", "Loan Security Ratio (LSR)" };

			int iTemp = 0;
			double dTemp = 0;

			for (int i=0; i<sData_Title.length; i++) {

				iTemp = i % 2;
				
				if (iTemp == 0) {
					out.print("<tr class=trRowOdd>\n");
				} else {
					out.print("<tr class=trRowEven>\n");
				}
				
				out.print("	<td width='76%' class=tdFirstCol align=left colspan=2>&nbsp;" + sData_Title[i] + "</td>\n");
				out.print("	<td width='24%' class=tdLastCol align=right>");
				
				if (i==0) {        out.print("RM "); dTemp = dCreditLimit;
				} else if (i==1) { out.print("RM "); dTemp = dTrdLimit;
				} else if (i==2) { dTemp = dLoanMgn;
				} else if (i==3) { dTemp = dMaintenaneMgn;
				} else if (i==4) { out.print("RM "); dTemp = dOutstandLoan;
				} else if (i==5) { out.print("RM "); dTemp = dMgnChrgNotCap;
				} else if (i==6) { out.print("RM "); dTemp = dRllovrChrgNotCap;
				} else if (i==7) { out.print("RM "); dTemp = dUnclearChg;
				}

				out.print(dfValue.format(dTemp));
				
				if (i==2) { 
					out.print(" %");
				} else if (i==3) { 
					out.print(" %");
				}
				
				out.print("&nbsp;</td>\n");
				out.print("</tr>\n");
			}
			
			out.print("<tr class=trTableHeader>\n");
			out.print("	<td width='52%' class=tdFirstCol align=left>&nbsp;</td>\n");
			out.print("	<td width='24%' class=tdMidCol align=center>Capped&nbsp;</td>\n");
			out.print("	<td width='24%' class=tdLastCol align=center>Uncapped&nbsp;</td>\n");
			out.print("</tr>\n");

			for (int i=0; i<sData_Title2.length; i++) {

				iTemp = i % 2;
				
				if (iTemp == 0) {
					out.print("<tr class=trRowEven>\n");
				} else {
					out.print("<tr class=trRowOdd>\n");
				}
				
				out.print("	<td width='52%' class=tdFirstCol>&nbsp;" + sData_Title2[i] + "</td>\n");
				
				out.print("	<td width='24%' class=tdMidCol align=right>");
			
				if (i==0) {
					out.print("RM ");
					dTemp = dCollShareCap;
				} else if (i==1) { 
					dTemp = dLSRCap;
				}
				
				out.print(dfValue.format(dTemp));
				
				if (i==1) { out.print(" %"); }
				
				out.print("&nbsp;</td>\n");
				
				out.print("	<td width='24%' class=tdLastCol align=right>");
				
				if (i==0) {
					 out.print("RM ");
					dTemp = dCollShareUnCap;
				} else if (i==1) { 
					dTemp = dLSRUnCap;
				}

				out.print(dfValue.format(dTemp));
				
				if (i==1) { out.print(" %"); }
				
				out.print("&nbsp;</td>\n");
				out.print("</tr>\n");
			}
			
			
			//out.print("<tr class=clsRepHeader>\n");
			//out.print("	<td style='border-right-color: #ffffff' colspan=3>&nbsp;</td>\n");
			//out.print("</tr>\n");

			out.print("</table>\n\n");
			*/
			
			out.print("<input type=hidden name=DateTime id=DateTime value='");
			
			//if (oRst.getDate("InsertDateTime") != null)
			//	out.print(dtFormat.format(oRst.getDate("InsertDateTime")));
			if (oRst.getDate("LastUpd") != null) {
				out.print(dtFormat.format(oRst.getDate("LastUpd")) + "&nbsp;(as at 9am)");
			} else {
				out.print("00/00/00");
			}
			
			out.print("'>");
			
			blsetTitleDateTime = true;

		} else {
			out.print("<br><b><font color=red size=3>No Record Found!</font></b>\n");
		}
		
		if (oRst!=null) {
			oRst.close();
			oRst = null;			
		}

		cli.closeResultset();
		cli.dbDisconnect();
%>

<br>
<table border=0 cellpadding=5 cellspacing=1 width=700 bgcolor='#FFFFFF' class=tblNote>
	<tr>
		<td>
			Please be informed that this enquiry/statement is provided for your reference only. Whilst reasonable care has been taken to ensure the accuracy of the information contained in this enquiry/statement, the information provided may not be accurate due to differences in timing between the settlement of purchase / sale in Malaysian Central Depository system and Affin Trade back-office system. Thus, Affin Trade shall not be held liable for trading errors arising from sale / purchase of any shares based solely on this enquiry/statement.
		</td>
	</tr>
</table>
<table border=0 cellpadding=0 cellspacing=0 width=700 bgcolor='#FFFFFF'>
	<tr height=8><td></td></tr>
	<tr>
		<td class='aFooterLink' align='center'>
			<hr>
			<font class=clsCopyrightBasic><%=oN2NSession.getSetting("WebSiteName")%>. All rights reserved.</font>
		</td>
	</tr>
</table>

<div id=divPrnFooter name=divPrnFooter>
	<form id=frmPrnFooter name=frmPrnFooter>
		<input type=hidden id=txtLoginID name=txtLoginID value='<%=g_sLoginId%>' />
		<input type=hidden id=lstTrdAcc name=lstTrdAcc value='' />
		<label id=lblDisplay name=lblDisplay></label>
	</form>
</div>

</body>
</html>

<script language=JavaScript>
function Body_OnLoad() {
<%
		// just isAdminUser() Or isBankDealer() can use Search Acct Func Only
		if ( g_sCategory.equals(N2NConst.CLI_CATEGORY_SADMIN)    ||
			 g_sCategory.equals(N2NConst.CLI_CATEGORY_ADMIN)     ||
			 g_sCategory.equals(N2NConst.CLI_CATEGORY_DEALER)    ||
			 g_sCategory.equals(N2NConst.CLI_CATEGORY_REMOTERMS)
		) {
			out.print("if (document.all.selTrdAcc.length > 0 && document.all.selTrdAcc.value != '0') {\n");
			out.print("var wds = document.all.selTrdAcc.options[document.all.selTrdAcc.selectedIndex].text.split(')')[1].substring(1); \n");
			out.print("document.all.lblCliName.innerText = '['+ wds.toUpperCase() +']'; \n");
			out.print("}\n");
		}
%>
	document.all.selTrdAcc.disabled = false;
	
<%
		if (blsetTitleDateTime == true) {
			out.print("document.all.lblLastUpdTime.innerText = document.all.DateTime.value;\n");
		}
%>

		// edit, call setupPrnTrdLimit()
		if (document.all.selTrdAcc.length > 0) {
				var nOffset = 0;
			
				if (document.all.selTrdAcc.options[0].value == '0') { 
						++nOffset; 
				}
			
				if (document.all.selTrdAcc.length > nOffset) {
						var sAcctNo = document.all.selTrdAcc.options[nOffset++].value.substring(1, 9);
						sAcctNo = sAcctNo.substring(0,9).replace(/-/, "");
						var lstAccList = '(Acc: '+ sAcctNo;
				
						for (i = nOffset; i < document.all.selTrdAcc.length; ++i) {
								var sAcctNo_Temp = document.all.selTrdAcc.options[i].value.substring(1, 9);
								sAcctNo_Temp = sAcctNo_Temp.substring(0,9).replace(/-/, "");
								if (sAcctNo != "") {
										lstAccList += ', '+ sAcctNo_Temp; 
								} else {
										lstAccList += sAcctNo_Temp;
										sAcctNo = "_";
								} 
						}
						
						document.frmPrnFooter.lstTrdAcc.value = lstAccList +')';
				} 
		}

	document.body.focus();
}

//display different trading limit for different account
function selOption_OnChange(vsTrdAcc)
{
	var sURL;
	sURL = "<%=script_Name%>?";

	if (vsTrdAcc != null && vsTrdAcc != '') {
		sURL += 'Acc='+ vsTrdAcc;
	
	} else if (document.all.selTrdAcc.selectedIndex >= 0) {
		//get the account no/code
		var sAcc
		sAcc = document.all.selTrdAcc.value
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
	
	for (i = nOffset; i < document.getElementById("selTrdAcc").length; ++i) {
		lstAccList += document.getElementById("selTrdAcc").options[i].value.substring(1, 9) +' '+ document.getElementById("selTrdAcc").options[i].text +'|'; 
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
%>