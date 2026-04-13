<%
	long before = 0;
	before = System.currentTimeMillis();
%>
<%@ page import = "java.sql.*,java.text.DecimalFormat,java.util.*, java.text.DecimalFormat" %>
<%@ page import = "com.n2n.util.*" %>
<%@ page import = "com.n2n.bean.N2NMFStkPerCliBean" %>
<%@ page import = "com.n2n.bean.N2NMFCliInfoBean" %>
<%@ page import = "com.n2n.bean.N2NMFRefBean" %>
<%@ page import = "com.n2n.DB.N2NMFStkPerCli" %>
<%@ page import = "com.n2n.DB.N2NMFCliInfo" %>
<%@ page import = "com.n2n.DB.N2NMFRef" %>
<%@ page import = "com.n2n.ebc.CalcFunc" %>

<%@ include file='common.jsp'%>
<%@ include file='util/sessionCheck.jsp'%>
<html>
<head>
<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
<script language=JavaScript src="<%=g_sJSPath%>/N2NPrnFunc.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/LinkFunc.js"></script>
<title><%=oN2NSession.getSetting("WebBHName")%> - Portfolio Manager</title>
<%	
	String strCliCode = g_sCliCode;
	String strLoginID = g_sLoginId;		
	String strBHCode    = g_sDefBHCode;
	String strBHBranch  = g_sDefBHBranch;
	String strBHCliCode = "";	
	String strRmsCode   = g_sDefRmsCode;
	String strCategory  = g_sCategory;	
	int nPrtfPercCol = -1;
	
	String strCliName = g_sCliName;
	String strRmsName = g_sRmsName;
	strRmsName = strRmsName != null ? strRmsName : "-";
	if (strRmsName.equals("")) { strRmsName = "-"; }
	strCliName = strCliName != null ? strCliName : "-";
	if (strCliName.equals("")) { strCliName = "-"; }
	
	
	//if (oN2NSession.getIsUserLogin() && sAgreeTermCond.equals("Y")) {
	if (validSession) {
		oN2NSession.checkTrdInfo("","",request,response);
		String sAgreeTermCond = (String) session.getAttribute("agree_termcond");
		sAgreeTermCond = sAgreeTermCond != null ? sAgreeTermCond : "";	
	
		if (sAgreeTermCond.length() ==0) {
			sAgreeTermCond = request.getParameter("agree_termcond");
			sAgreeTermCond = sAgreeTermCond != null ? sAgreeTermCond : "";
			session.setAttribute("agree_termcond",sAgreeTermCond);
		}		
		if (sAgreeTermCond.equals("Y")) {
		
			CalcFunc m_oCalcFunc = new CalcFunc();
			DecimalFormat dfQty    = new DecimalFormat("#,###,###,##0");		
			DecimalFormat dfPrice  = new DecimalFormat("#,###,###,##0.000");		
			DecimalFormat dfPriceLimit = new DecimalFormat("#,###,###,##0.0000");		
			DecimalFormat dfValue  = new DecimalFormat("#,###,###,##0.00");
			DecimalFormat dfValue2 = new DecimalFormat("#########0.00");
	
			String sPrtfID = request.getParameter("intPrtfID");
			sPrtfID = sPrtfID != null ? sPrtfID : "1";
		
			// Internally define ViewID to 1 - Assume we support only 1 view.
			int nViewID = 1;
			
			ResultSet oRst = null;
	
			N2NMFCliInfo cli = new N2NMFCliInfo();
			cli.init(oN2NSession);
			
			String sSort = "A";
			// usp_mfGetCliPrtfHdr
			oRst = cli.getMFCliPrtfHdr(strCliCode, sPrtfID);
			if (oRst != null && oRst.next() ) {
				sSort = oRst.getString("DefSort");
				if (nViewID <= 0 ) nViewID = oRst.getInt("DefViewID");
			}
			if (nViewID <= 0) nViewID = 1;
			oRst.close();
			oRst = null;
			cli.closeResultset();
			cli.dbDisconnect();			
			
			String sColView = "2|30|34|14|12|24|15|11|19|22"; // default viewCol Setting
			
			// PRTF_VIEWCOL_STKCODENAME|PRTF_VIEWCOL_REFLASTP|PRTF_VIEWCOL_DAYHL|PRTF_VIEWCOL_AVEPPRICE|
			// PRTF_VIEWCOL_QTYSOLD|PRTF_VIEWCOL_LIMIT|PRTF_VIEWCOL_AVEBPRICE|PRTF_VIEWCOL_QTYONHAND|
			// PRTF_VIEWCOL_GROSSMKTVAL|PRTF_VIEWCOL_UNREALGL
			
			// usp_mfGetCliPrtfView
			oRst = cli.getMFCliPrtfView(strCliCode, sPrtfID, nViewID);
			if (oRst != null && oRst.next() ) {
				sColView = oRst.getString("ViewColStr");
			}
			oRst.close();
			oRst = null;
			cli.closeResultset();
			cli.dbDisconnect();
			
			String[] sColSetting = sColView.split("\\" + N2NConst.STD_SEP);
			
			String sColWidthPercentage = "12|9|9|9|9|9|10|10|11|12"; // default table width percentage
			String[] sColWidthSetting  = sColWidthPercentage.split("\\" + N2NConst.STD_SEP);
	
			N2NMFStkPerCliBean stkPerClibean = new N2NMFStkPerCliBean();
			
			String selTrdAcc = (String) request.getParameter("Acc");
			selTrdAcc = selTrdAcc != null ? selTrdAcc : "";
			
			if ( selTrdAcc.length() > 0 ) {
				 StringTokenizerEx sToken = new StringTokenizerEx(selTrdAcc, "-");
				 int iIndex = 0;
				 String sTokenData = "";
				 while (sToken.hasMoreTokens()) {
				 		sTokenData = sToken.nextToken();
						++iIndex;
						switch (iIndex) {
							case 1:  stkPerClibean.setBHCliCode(sTokenData); break;
							case 2:  stkPerClibean.setBHBranch(sTokenData);  break;
							default: break;
						}
				 }
			}
			
			stkPerClibean.setCliCode(strCliCode);
			
			if (selTrdAcc.length() > 0) {
				stkPerClibean.setBHCode(g_sDefBHCode);
			} else {
				stkPerClibean.setBHCode("");
			}
	
			stkPerClibean.setSort(sSort);
			
			String qs_sSector = "";
			String qs_sBoard  = "";
			String qs_sIndex  = "";
			
			int qs_nIndex  = 0;
			
			qs_sSector = request.getParameter("sector");
			qs_sSector = qs_sSector != null ? qs_sSector : "";
			
			qs_sBoard  = request.getParameter("board");
			qs_sBoard = qs_sBoard != null ? qs_sBoard : "";
			
			qs_sIndex  = request.getParameter("index");
			qs_sIndex = qs_sIndex != null ? qs_sIndex : "0";
			qs_nIndex = Integer.parseInt(qs_sIndex);
	
			boolean bRestrictedView = false;
			boolean bUseFilter = false;
			
			if ( (qs_sSector.length()>0) || (qs_sBoard.length()>0) || (qs_nIndex>0) ) {
				bUseFilter = true;
			}
			
			if (bUseFilter) {
				if (qs_sSector.length()>0) stkPerClibean.setSector(qs_sSector);
				if (qs_sBoard.length()>0)  stkPerClibean.setBoard(qs_sBoard);
				if (qs_nIndex>0)           stkPerClibean.setIndexFlag(qs_nIndex);
			}
	
			//out.print("   CliCode  ='" + stkPerClibean.getCliCode() + "', BHCliCode='" + stkPerClibean.getBHCliCode() + "', BHBranch ='" + stkPerClibean.getBHBranch() + "', BHCode   ='" + stkPerClibean.getBHCode() + "', Sort     ='" + stkPerClibean.getSort()      + "'" );
			String refresh = (String) request.getParameter("refresh");
			refresh = refresh != null ? refresh : "";
			if ( (refresh.length() > 0) && (Integer.parseInt(refresh) > 0) ) out.print("<meta http-equiv='Refresh' content='" + refresh + "'>");
%>
<script language=JavaScript src=<%=g_sJSPath%>/N2NFunc.js></script>
<script language=JavaScript src=<%=g_sJSPath%>/SortFunc.js></script>
</head>

<body onload='Body_OnLoad()' style='background:#FFFFFF;margin:2px 0px 0px 5px'>

<table border=0 cellpadding=0 cellspacing=0 width=750>
	<tr>
		<td class=clsSectionHeader width='59%'>&nbsp; Personal Portfolio</td>
    	<td class=clsSectionHeader width='32%' align=right>
<%
			if (bRestrictedView == false) {
				out.print("<input type=button value='Filter Portfolio Records' onClick='onClickFilter()' style='width=150'>");
			}
			
			if (bUseFilter) {
				out.print("<input type=button value='Reset Filter' onClick='onDisplayAll("+ sPrtfID +","+ nViewID +")'>");
			}
%>
		</td>
		<td width='9%' align=middle><img border=0 src=<%=g_sImgPath%>/butPrint.gif width=18 height=18 title='Print' style='cursor:pointer' onclick='beforePrint();window.print();afterPrint();'><img id=imgHelp border=0 width=20 height=19 src=<%=g_sImgPath%>/lightbulboff.jpg onmouseover="this.src='<%=g_sImgPath%>/lightbulbon.jpg'" onmouseout="this.src='<%=g_sImgPath%>/lightbulboff.jpg'" title="Portfolio Manager: Helps you monitor your portfolio of shares and tracks your realised and unrealised gains and losses in real time, so that you are always up to date on your portfolio status.(Double click to selected stock for details)"></td>
	</tr>
</table>

<table border=0 cellpadding=0 cellspacing=0 width=750 height=30>
<%
		if (bUseFilter) {
			
			boolean bUseSep = false;
			
			out.print("<tr valign=middle height=20><td>");
			out.print("&nbsp;<b>Filter By: ");
			
			if (qs_sSector.length()>0) { 

				String GetFilterSectorDesc = "";
				String[] SectorCode = qs_sSector.split(",");
				
				N2NMFRefBean RefBean = new N2NMFRefBean();
				
				RefBean.setRefID("SECTORC"+SectorCode[0]);
				System.out.println("RefBean.getRefID: " + RefBean.getRefID());
				N2NMFRef Ref = new N2NMFRef();
				Ref.init(oN2NSession);
				// usp_mfGetRef
				oRst = Ref.getRef("",RefBean);
				if (oRst != null && oRst.next() ) {
					GetFilterSectorDesc = oRst.getString("Description");
				}
				oRst.close();
				oRst = null;
				Ref.closeResultset();
				Ref.dbDisconnect();
				
				out.print(GetFilterSectorDesc +" <b>SECTOR</b>");
				
				bUseSep = true;
			}
			
			if (qs_sBoard.length()>0) {
				
				if (bUseSep) {out.print("; ");} else {bUseSep = true;}
				
				String GetFilterBoardDesc = "";
				String[] BoardCode = qs_sBoard.split(",");
				
				N2NMFRefBean RefBean = new N2NMFRefBean();
				RefBean.setRefID("BOARD"+BoardCode[0]);
				N2NMFRef Ref = new N2NMFRef();
				Ref.init(oN2NSession);
 				// usp_mfGetRef
				oRst = Ref.getRef("",RefBean);
				if (oRst != null && oRst.next() ) {
					GetFilterBoardDesc = oRst.getString("Description");
				}
				oRst.close();
				oRst = null;
				Ref.closeResultset();
				Ref.dbDisconnect();
				
				out.print(GetFilterBoardDesc);
			}
			
			if (qs_nIndex > 0) {
				
				if (bUseSep) {out.print("; ");} else {bUseSep = true;}
				
				String sDesc = "";
				boolean bUseSep2 = false;
				
				if ((qs_nIndex & N2NConst.PRTF_INDEX_KLCI) == N2NConst.PRTF_INDEX_KLCI) {
					bUseSep2 = true;
					sDesc = "KLCI";
				}
				if ((qs_nIndex & N2NConst.PRTF_INDEX_EMAS) == N2NConst.PRTF_INDEX_EMAS) {
					if (bUseSep2) { sDesc = sDesc + ", "; } else { bUseSep2 = true; }
					sDesc = sDesc + "EMAS";
				}
				if ((qs_nIndex & N2NConst.PRTF_INDEX_MESDAQ) == N2NConst.PRTF_INDEX_MESDAQ) {
					if (bUseSep2) { sDesc = sDesc + ", "; } else { bUseSep2 = true; }
					sDesc = sDesc + "MESDAQ";
				}
				if ((qs_nIndex & N2NConst.PRTF_INDEX_SYARIAH) == N2NConst.PRTF_INDEX_SYARIAH) {
					if (bUseSep2) { sDesc = sDesc + ", "; } else { bUseSep2 = true; }
					sDesc = sDesc + "SYARIAH";
				}
				if ((qs_nIndex & N2NConst.PRTF_INDEX_MSCI) == N2NConst.PRTF_INDEX_MSCI) {
					if (bUseSep2) { sDesc = sDesc + ", "; } else { bUseSep2 = true; }
					sDesc = sDesc + "MSCI";
				}
				if ((qs_nIndex & N2NConst.PRTF_INDEX_CLOB) == N2NConst.PRTF_INDEX_CLOB) {
					if (bUseSep) { sDesc = sDesc + ", "; } else { bUseSep2 = true; }
					sDesc = sDesc + "CLOB";
				}
				out.print( sDesc +" <b>INDICES</b>");
			}
			out.print("</td><td>&nbsp;</td></tr>");
		}
%>

	<tr valign=middle height=20>
		<td colspan=3>&nbsp;<b>Client/DealerRep:</b> <%=strCliName.toUpperCase()%> / <%=strRmsName.toUpperCase()%> <label id=lblCliName></label></td>
	</tr>

	<tr valign=middle height=30>
		<td>
			<form id=frmTrdAcc name=frmTrdAcc method=post onsubmit="return frmTrdAccSrch_OnSubmit(this);">
			&nbsp;<b id=lblCDSNo>Account:</b>&nbsp;
			
			<select id=selTrdAcc name=selTrdAcc style='height:22px;width:270px' onchange='selOption_OnChange("")'>
				<option value=0>--All--
<%
		String lstTrdLimitAndInfo_Tot = "";
		String lstTrdLimitAndInfo = "";
		double totdTrdLimit = 0.0;

		N2NMFCliInfoBean clibean = new N2NMFCliInfoBean();
		clibean.setCliCode(strCliCode);
		clibean.setBhcode(strBHCode);
		clibean.setBhbranch(strBHBranch);
		clibean.setBhCliCode("");
		clibean.setAccountType("");

		//-- [list out all of Acct No] -----------------------------------------------------
		oRst = oN2NSession.cliinfo.getBHCliInfoByCliCode(clibean, "C", 0, "", "KL");

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
			
			double dTrdLimit = 0;

			while (oRst.next()) {
				
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

				if (selTrdAcc.equals(selBHCliCode+"-"+selBHBranch))
					out.print("<option value='" + selValue + "' selected>" + selTitle );
				else
					out.print("<option value='" + selValue + "'>" + selTitle );
				
				if ( g_sCategory.equals(N2NConst.CLI_CATEGORY_SADMIN)    ||
					 g_sCategory.equals(N2NConst.CLI_CATEGORY_ADMIN)     ||
					 g_sCategory.equals(N2NConst.CLI_CATEGORY_DEALER)    ||
					 g_sCategory.equals(N2NConst.CLI_CATEGORY_REMOTERMS)
				) { out.print(" " + selCliName); }
				
				clibean.reset();
				clibean.setBhcode(selBHCode);
				clibean.setBhCliCode(selBHCliCode);
				
				dTrdLimit = oN2NSession.cliinfo.getCliTrdLimit(clibean,"D");
				
				//format : lstTrdLimitAndInfo_Tot = totdTrdLimit|30|0.01|dTrdLimit|selMaxPriceInterval|selBrokerageRate|..
				
				lstTrdLimitAndInfo = lstTrdLimitAndInfo + 
									 dfValue.format(dTrdLimit) + "|" + 
									 selMaxPriceInterval       + "|" +
									 dfValue2.format(Float.valueOf(selBrokerageRate).floatValue()) + "|";
				
				totdTrdLimit = totdTrdLimit + dTrdLimit;
			} // End of while oRst.next()
			
			lstTrdLimitAndInfo_Tot = dfValue.format(totdTrdLimit) + "|" + "30" + "|" + "0.01" + "|" +
									 lstTrdLimitAndInfo;
		} // if (oRst != null)

		oRst.close();
		oRst = null;
		
		oN2NSession.cliinfo.closeResultset();
		oN2NSession.cliinfo.dbDisconnect();
		
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
			<input id=txtTrdAccSrch name=txtTrdAccSrch style='display:none;width:180px' autocomplete=off>&nbsp;
			<input id=butTrdAccSrch name=butTrdAccSrch type=submit value='Search'>
<%
		} // just isAdminUser() Or isBankDealer() can use Search Acct Func Only
%>			
		&nbsp;&nbsp;<b>Balance:</b> <b>RM <label id=lblTrdLimit></label></b>
		</td>
		<td align=right>Refresh Rate: 
			<select id=selRefreshRate align=absmiddle onchange='selOption_OnChange()'>
				<option value=0>no refresh
				<option value=5>&nbsp;5 seconds
				<option value=10>10 seconds
				<option value=20>20 seconds
				<option value=30>30 seconds
				<option value=60>&nbsp;1 minute
				<option value=120>&nbsp;2 minutes
				<option value=180>&nbsp;3 minute
				<option value=300>&nbsp;5 minute
				<option value=600>10 minute
			</select>
		</td>
		<td width=15><img border=0 src='<%=g_sImgPath%>/refresh.gif' width=15 height=18 title='Click to refresh' style='cursor:pointer' onclick='window.location.reload(true);'></td>
		</form>
	</tr>
</table>

<table border=0 cellpadding=0 cellspacing=0 width=750>
	<tr><td>
		<table cellpadding=2 cellspacing=0 width=750>
		<tr class=trTableHeader>
<%
		// The Title of Table
		int iCol = 0, iColNo = 0, iColPercentage = 0;
		for (iCol=0; iCol < sColSetting.length; iCol++) {
			
			iColNo         = Integer.parseInt(sColSetting[iCol]);
			iColPercentage = Integer.parseInt(sColWidthSetting[iCol]);			
			if (iCol == 0) { 
				out.print("\n<td class=tdHdrFirstCol width='" + iColPercentage + "%'");
			} else if (iCol == (N2NConst.MAX_VIEW_COL-1)) { 
				out.print("\n<td class=tdHdrLastCol width='" + iColPercentage + "%'");
			} else { 
				out.print("\n<td class=tdHdrMidCol width='" + iColPercentage + "%'");
			}
			
			switch (iColNo) {
				case N2NConst.PRTF_VIEWCOL_STKCODENAME: /*02*/
					out.print("> <b><I><div title='sort by stock code' style='cursor:pointer'       onClick=\"SortTableCol('tblStkOrderList', " + iCol + ", 0, '&', '', '', SF_StringSort, true)\">Stock Code / </div><div title='sort by stock name' style='cursor:pointer' onClick=\"SortTableCol('tblStkOrderList', " + iCol + ", 2, '>', '<', '', SF_StringSort, true)\">Name&nbsp;&nbsp;</div></I></b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_QTYONHAND:   //11 
					out.print("> <b><I><div title='sort by quantity on hand' style='cursor:pointer' onClick=\"SortTableCol('tblStkOrderList', " + iCol + ", 0, '&', '', ',', SF_NumericSort, false)\">Qty On Hand</div></I></b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_QTYAVAIL:   /*41*/ 
					out.print("> <b><I><div title='sort by quantity available' style='cursor:pointer' onClick=\"SortTableCol('tblStkOrderList', " + iCol + ", 0, '&', '', ',', SF_NumericSort, false)\">Qty Available</div></I></b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_QTYSOLD:     /*12*/ 
					out.print("> <b><I><div title='sort by quantity sold' style='cursor:pointer'    onClick=\"SortTableCol('tblStkOrderList', " + iCol + ", 0, '&', '', ',', SF_NumericSort, false)\">Qty Sold</div></I></b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_TOTCOMM:     /*13*/ 
					out.print("> <b>Brokerage</b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_AVEPPRICE:   /*14*/ 
					out.print("> <b>Avg Purc Price</b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_AVEBPRICE:   /*15*/ 
					out.print("> <b>Avg Buy Price</b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_AVESPRICE:   /*16*/ 
					out.print("> <b>Avg Sell Price</b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_PRTFPERC:    /*18*/ 
					//out.print("> <I><div title='sort by portfolio %'            style='cursor:pointer' onClick=\"SortTableCol('tblStkOrderList', " + iCol + ", 0, '%', '', '', SF_NumericSort, false)\">Portfolio (%)</div></I></b>"); 
					out.print("> <I><div title='sort by portfolio ' style='cursor:pointer' onClick=\"SortTableCol('tblStkOrderList', " + iCol + ", 0, '%', '', '', SF_NumericSort, false)\">Portfolio(%)</div></I></b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_GROSSMKTVAL: /*19*/ 
					out.print("> <b><I><div title='sort by gross market value'  style='cursor:pointer' onClick=\"SortTableCol('tblStkOrderList', " + iCol + ", 0, '&', '', ',', SF_NumericSort, false)\">Gross Mkt Value</div></I></b>"); 					
					break;
				case N2NConst.PRTF_VIEWCOL_UNREALGL:    /*22*/ 
					out.print("> <b><I><div title='sort by Unrealised G/L (RM)' style='cursor:pointer' onClick=\"SortTableCol('tblStkOrderList', " + iCol + ", 0, '&', '', ',', SF_NumericSort, false)\">Unrealised G/L</div><div title='sort by Unrealised G/L (%)' style='cursor:pointer' onClick=\"SortTableCol('tblStkOrderList', " + iCol + ", 1, '>', '%', ',', SF_NumericSort, false)\">(RM/%)</div></I></b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_LIMIT:       /*24*/ 
					//out.print("> <b>Upper/Lower Limit</b>"); 
					out.print("> <b>Up/Lower Limit</b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_BREAKEVENP:  /*26*/ 
					out.print("> <b>Breakeven Price</b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_REFLASTP:    /*30*/ 
					out.print("> <b>Ref Price/ <br>  Curr Price&nbsp;</b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_DAYHL:       /*34*/ 
					out.print("> <b>Day High/Low</b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_YEARHL:      /*36*/ 
					out.print("> <b>Year High/Low</b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_PCHANGE:     /*38*/ 
					out.print("> <b><I><div title='sort by Change (RM)' style='cursor:pointer' onClick=\"SortTableCol('tblStkOrderList', " + iCol + ", 0, '&', '', ',', SF_NumericSort, false)\">Change</div><div title='sort by Change (%)' style='cursor:pointer' onClick=\"SortTableCol('tblStkOrderList', " + iCol + ", 1, '>', '%', ',', SF_NumericSort, false)\"> (RM/%)</div></I></b>"); 
					break;
				case N2NConst.PRTF_VIEWCOL_VOLLOTSIZE:  /*40*/ 
					out.print("> <b><I><div title='sort by Volume'      style='cursor:pointer' onClick=\"SortTableCol('tblStkOrderList', " + iCol + ", 0, '&', '', ',', SF_NumericSort, false)\">Volume/</div></I></b>Lot Size"); 
					break;
				default: 
					out.print(">[Free]"); 
					break;
			}
			out.println("</td>");
		}
%>
		</tr>
		</table>
	</td></tr>
  	<tr>
  		<td>
  		<div id=divPortfolio style="overflow:auto">
		<table id=tblStkOrderList class=tblTableData border=0 cellpadding=2 cellspacing=0 width=750>

		<!-- Preparing for details body data -->
<%
		String StkCode = "", lstStkCode = "", StkName = "";

		String sBrokerageRate = "";
		String lstQtyOnHand     = "";
		String lstAPPrice       = "";
		StringBuilder slstGrossMktVal = new StringBuilder();
		
		String sRefPrice  = "", sLastPrice ="";
		String sHighPrice = "";
		String sLowPrice  = "";

		String sCDSNo       = "";
		String sQtyOnHand   = "";
		String sQtySold     = "";
		String sAPPrice     = "";
		String sASPrice     = "";
		String sTotPQty     = "";
		String sTotPComm    = "";
		String sTotPPrice   = "";
		
		int totRow = 0;
		Vector data = new Vector();
		
		N2NMFStkPerCli stkPerCli = new N2NMFStkPerCli();
		stkPerCli.init(oN2NSession);
		
		// usp_mfGetStkPerCli 'B02010','086','001','3BB6969','A','','','','',''
		// usp_mfGetStkPerCli CliCode, BHCode, BHBranch, BHCliCode, Sort, lstSector, Board, IndexFlag, Category, CallParam
		oRst = stkPerCli.getStkPerCli(stkPerClibean);

		if (oRst != null) {
		
			String sPrevStkCode = "";
			String sPrevCDSNo   = "";
			
			double dTotPQty  = 0, dTotPComm = 0;
			String sGetAPComm = "";
			
			while (oRst.next()) {
				StkCode        = oRst.getString("StkCode");			//1
				StkName        = oRst.getString("StkShtName");		//2	
				sCDSNo         = oRst.getString("CDSNo");			//3
				
				StkCode	   = StkCode.trim();
				if ( sPrevStkCode.equals(StkCode) && sPrevCDSNo.equals(sCDSNo))
					continue;
				
				data.addElement (StkCode);
				data.addElement (StkName);
				data.addElement (sCDSNo);
				
				sHighPrice     = oRst.getString("HighPrice");     data.addElement (sHighPrice);	//4
				sLowPrice  	   = oRst.getString("LowPrice");      data.addElement (sLowPrice);	//5
				
				sBrokerageRate = oRst.getString("BrokerageRate"); data.addElement (sBrokerageRate);	//6
				sQtyOnHand     = oRst.getString("QtyOnHand");     data.addElement (sQtyOnHand);		//7
				//sQtyOnHand     = oRst.getString("QtyAvail");	  data.addElement (sQtyOnHand);		//7
				sTotPPrice     = oRst.getString("TotPPrice");     data.addElement (sTotPPrice);		//8
				sQtySold       = oRst.getString("QtySold");       data.addElement (sQtySold);		//9
				sRefPrice      = oRst.getString("RefPrice");      data.addElement (sRefPrice);		//10
				//sAPPrice       = oRst.getString("APPrice");       data.addElement (sAPPrice);		//11
				sAPPrice       = oRst.getDouble("APPrice")+"";       data.addElement (sAPPrice);		//11
				sASPrice       = oRst.getString("ASPrice");       data.addElement (sASPrice);		//12
				sLastPrice     = oRst.getString("LastDonePrice"); data.addElement (sLastPrice);		//13
				sTotPQty       = oRst.getString("TotPQty");       data.addElement (sTotPQty);		//14
				sTotPComm      = oRst.getString("TotPComm");      data.addElement (sTotPComm);		//15
				data.addElement (oRst.getString("Volume"));			//16
				data.addElement (oRst.getString("LotSize"));		//17
				data.addElement (oRst.getString("ChgAmt"));			//18
				data.addElement (oRst.getString("ChgPerc"));		//19
				data.addElement (oRst.getString("SectorCode"));		//20
				data.addElement (oRst.getString("Class"));			//21
				data.addElement (oRst.getString("BasePrice"));		//22
				data.addElement (oRst.getString("Status"));			//23
				data.addElement (oRst.getString("YearHighPrice"));	//24
				data.addElement (oRst.getString("YearLowPrice"));	//25
				
				lstStkCode 		 = lstStkCode + StkCode.trim() + "|";
				lstQtyOnHand     = lstQtyOnHand     + sQtyOnHand     + "|";
				lstAPPrice       = lstAPPrice       + sAPPrice       + "|";

				dTotPQty  = Double.valueOf(sTotPQty).doubleValue();
				dTotPComm = Double.valueOf(sTotPComm).doubleValue();
			
				totRow++;
				
				sPrevStkCode = StkCode;
				sPrevCDSNo = sCDSNo;
			}
		}
		
		if (totRow == 0) {
			out.print("<tr><td><br><b><font size=3 color=#FF0000>Sorry, you currently do not have any stock in your portfolio.</font></b></td></tr>");
		}
		
		oRst.close();
		oRst = null;

		stkPerCli.closeResultset();
		stkPerCli.dbDisconnect();

		double dVal = 0;
		
		double dYearHighPrice = 0,  dYearLowPrice = 0;
		String sYearHighPrice = "", sYearLowPrice = "";
		
		double dAPPrice = 0, dASPrice = 0;
		double dTotPPrice = 0, dQtyOnHand = 0;
		double dTotGrossMktValue = 0, dGrossMktValue = 0, dTotAbsGrossMktValue = 0;
		double dTotComm = 0, dUnrealGL = 0, dCliRate=0.00, dLastDonePrice = 0.00, dTotUnRealGL = 0.00;
		double dUnrealGLPerc = 0, dTotUnRealGLToday=0.00, dRefPrice=0.00, dBasePrice=0.00,dLimit = 0;
		double dChg = 0, dChgPerc = 0;
		boolean trRowOddEven = true;
		char cLoanStk;
		char cClass;
		long lQOH = 0;
		String sSectorCode = "";
		String sClass = "";
		String sStatus = "";
		
		int j = 0;
		int iQOH = 0;

		for (int i=0; i<totRow; i++) {
			
//			j = 15 * i;
//			j = 23 * i;
			j = 25 * i;
				
			StkCode        = (String)data.elementAt(j);
			StkName        = (String)data.elementAt(j+1);
			sCDSNo         = (String)data.elementAt(j+2);
			sHighPrice     = (String)data.elementAt(j+3);
			sLowPrice  	   = (String)data.elementAt(j+4);
			sBrokerageRate = (String)data.elementAt(j+5);
			sQtyOnHand     = (String)data.elementAt(j+6);
			sTotPPrice     = (String)data.elementAt(j+7);
			sQtySold       = (String)data.elementAt(j+8);
			sRefPrice      = (String)data.elementAt(j+9);
			sAPPrice       = (String)data.elementAt(j+10);
			sASPrice       = (String)data.elementAt(j+11);
			sLastPrice     = (String)data.elementAt(j+12);
			sTotPQty       = (String)data.elementAt(j+13);
			sTotPComm      = (String)data.elementAt(j+14);			
			iQOH		   = Integer.parseInt(sQtyOnHand);	
			lQOH		   = new Integer(iQOH).longValue();				
			sSectorCode    = (String)data.elementAt(j+19);
			sStatus		   = (String)data.elementAt(j+22);
			sClass    	   = (String)data.elementAt(j+20);
			sClass		   = (sClass != null && sClass.length() > 0) ? sClass.trim() : " ";
			cClass		   = sClass.charAt(0);
			cLoanStk	   = m_oCalcFunc.isLoanStk(Integer.valueOf(sSectorCode).intValue(), cClass);			
			sYearHighPrice = (String)data.elementAt(j+23);
			sYearLowPrice  = (String)data.elementAt(j+24);
			
			try {
				dBasePrice = Double.valueOf((String)data.elementAt(j+21)).doubleValue();
			} catch (NumberFormatException nfe) {
				nfe.printStackTrace();
			}
			try {
				dRefPrice = Double.valueOf(sRefPrice).doubleValue();
			} catch (NumberFormatException nfe) {
				dRefPrice = 0;
			}
			
			try {
				dCliRate	= Double.valueOf(sBrokerageRate).doubleValue();
			} catch (NumberFormatException nfe) {
				dCliRate	= 0;
				nfe.printStackTrace();	   
			}
			
			try {
				dLastDonePrice = Double.valueOf(sLastPrice).doubleValue();
				if (dLastDonePrice == 0) {
					dLastDonePrice = dRefPrice;
					sLastPrice = sRefPrice;
				}				
			} catch (NumberFormatException nfe) {
				dLastDonePrice = 0;
				nfe.printStackTrace();
			}
			
			try {
				dGrossMktValue = iQOH * dLastDonePrice;
			} catch (NumberFormatException nfe) {
				dGrossMktValue = 0;
			}
			
			try {
				dAPPrice = Double.valueOf(sAPPrice).doubleValue();
			} catch (NumberFormatException nfe) {
				dAPPrice = 0;
			}				
			
			try {
				dChg = Double.valueOf((String)data.elementAt(j+17)).doubleValue();
			} catch (NumberFormatException nfe) {
				dChg = 0;
			}
			
			try {
				dChgPerc = Double.valueOf((String)data.elementAt(j+18)).doubleValue();
			} catch (NumberFormatException nfe) {
				dChgPerc = 0;
			}
						
			dTotGrossMktValue += dGrossMktValue;			
			dTotAbsGrossMktValue += Math.abs(dGrossMktValue);
			slstGrossMktVal.append(dGrossMktValue);
			slstGrossMktVal.append(N2NConst.STD_SEP);
			//System.out.println("Math.abs(dGrossMktValue): " + Math.abs(dGrossMktValue));

			//if (sLastPrice == "0.000") { sLastPrice = sRefPrice; }


			if (trRowOddEven) {
				out.print("<tr class=trRowOdd id=trGenEvent>");
				trRowOddEven = false;
			} else {
				out.print("<tr class=trRowEven id=trGenEvent>");
				trRowOddEven = true;
			}

			for (iCol=0; iCol < sColSetting.length; iCol++) {

				iColNo         = Integer.parseInt(sColSetting[iCol]);
				iColPercentage = Integer.parseInt(sColWidthSetting[iCol]);
				
				if (iCol == 0) { 
					out.print("\n<td class=tdFirstCol width='" + iColPercentage + "%' title='' align=right>");
				} else if (iCol == (sColSetting.length-1)) { 
					out.print("<td class=tdLastCol width='"     + iColPercentage + "%' align=right>");
				} else { 
					out.print("<td class=tdMidCol width='"    + iColPercentage + "%' align=right>");
				}
				
				switch (iColNo) {
					case N2NConst.PRTF_VIEWCOL_STKCODENAME: //02
						out.print(StkCode + "&nbsp;<br>");
						out.print("<font style=cursor:pointer;color:blue;text-decoration:underline onclick=DisplayStkInfoLink('E','" + StkCode + "')>" + StkName + "</font>&nbsp;");
						break;
					case N2NConst.PRTF_VIEWCOL_QTYONHAND:   //11
						out.print(dfQty.format(Integer.parseInt(sQtyOnHand)));
						break;

					case N2NConst.PRTF_VIEWCOL_QTYAVAIL:	//41
						out.print(dfQty.format(iQOH));
						break;						
					case N2NConst.PRTF_VIEWCOL_QTYSOLD:     //12
						out.print(dfQty.format(Integer.parseInt(sQtySold)));
						break;
					case N2NConst.PRTF_VIEWCOL_TOTCOMM:     //13						
						dTotComm = m_oCalcFunc.CalcCommission(lQOH, Double.valueOf(sAPPrice).doubleValue(), dCliRate, cLoanStk, -1,-1, false) + 
							 	  m_oCalcFunc.CalcCommission(lQOH, dLastDonePrice, dCliRate, cLoanStk, -1,-1, false);					
						out.print(dfValue.format(dTotComm));
						break;
					case N2NConst.PRTF_VIEWCOL_AVEPPRICE:   //14
						try {
							dTotPPrice = Double.valueOf(sTotPPrice).doubleValue();
						} catch (NumberFormatException nfe) {
							dTotPPrice = 0;
						}
						try {
							dQtyOnHand = Double.valueOf(sQtyOnHand).doubleValue();
						} catch (NumberFormatException nfe) {
							dQtyOnHand = 0;
						}
						if (dQtyOnHand != 0) {
							dVal = dTotPPrice / dQtyOnHand;
						} else {
							dVal = 0;
						}
						out.print(dfPriceLimit.format(dVal));
						break;
					case N2NConst.PRTF_VIEWCOL_AVEBPRICE:   //15
						out.print(dfPriceLimit.format(dAPPrice));
						break;
					case N2NConst.PRTF_VIEWCOL_AVESPRICE:   //16
						try {
							dASPrice = Double.valueOf(sASPrice).doubleValue();
						} catch (NumberFormatException nfe) {
							dASPrice = 0;
						}
						out.print(dfPriceLimit.format(dASPrice));
						break;
					case N2NConst.PRTF_VIEWCOL_PRTFPERC:    //18
						nPrtfPercCol = iCol;
						//out.print(dfValue.format((dGrossMktValue/dTotAbsGrossMktValue) * 100)); 
						break;
					case N2NConst.PRTF_VIEWCOL_GROSSMKTVAL: //19
						out.print(dfValue.format(dGrossMktValue));						
						break;
					case N2NConst.PRTF_VIEWCOL_UNREALGL:    //22
						//System.out.println("dCliRate: " + dCliRate + "  StkCode: " + StkCode + "  cLoanStk: " + cLoanStk);
						dUnrealGL = m_oCalcFunc.CalcGainLossAmt(lQOH, dAPPrice, dLastDonePrice, dCliRate, cLoanStk, -1,-1);
						dTotUnRealGL += dUnrealGL;
						if (dAPPrice == 0) {
							dUnrealGLPerc = 0;
						} else {
							dUnrealGLPerc = m_oCalcFunc.CalcGainLossPerc(lQOH, dAPPrice, dLastDonePrice, dCliRate, cLoanStk, -1,-1);
						}
						
						out.print(dfValue.format(dUnrealGL) + "&nbsp;<br>");
						if (dAPPrice == 0) {
							out.print(" - ");
						} else {						
							out.print(dfValue.format(dUnrealGLPerc) + "%");
						}
						out.println("&nbsp;");
						
						if (dUnrealGL < 0) {
							out.print("<script language='javascript'>");
							out.print("document.getElementById('tblStkOrderList').rows[" + i + "].cells[" + iCol + "].className='tdLastColLoss'");
							out.print("</script>");
						}
						dTotUnRealGLToday += (dUnrealGL - m_oCalcFunc.CalcGainLossAmt(lQOH, dAPPrice, dRefPrice, dCliRate, cLoanStk, -1,-1));			
						break;
					case N2NConst.PRTF_VIEWCOL_LIMIT:       //24
						out.print(dfPriceLimit.format(m_oCalcFunc.MaxBidPrice(dBasePrice, (sStatus.equals(N2NConst.FEED_RECSTATUS_NEW)))) + "&nbsp;<br>" + dfPriceLimit.format(m_oCalcFunc.MinBidPrice(dBasePrice, (sStatus.equals(N2NConst.FEED_RECSTATUS_NEW)))) + "&nbsp;") ;
						break;
					case N2NConst.PRTF_VIEWCOL_BREAKEVENP:  //26
						//otblCol.innerHTML = JSformatNumber(m_clsN2NFunc.CalcBreakeven(nQtyOnHand,dAPPrice, dCliRate, sLoanStk, -1,-1),4) +"&nbsp;";					
						out.print(dfPriceLimit.format(m_oCalcFunc.CalcBreakeven(lQOH,dAPPrice, dCliRate, cLoanStk, -1,-1)));
						break;
					case N2NConst.PRTF_VIEWCOL_REFLASTP:    //30//////
						//lstRefPrice = lstRefPrice + "<br>" + sRefPrice;
						//out.print(sRefPrice +"<br>"+ sLastPrice);
						//out.print(dfPrice.format(dRefPrice) +"<br>"+ dfPrice.format(dLastDonePrice));
						out.print(dfPriceLimit.format(dRefPrice) +"<br>"+ dfPriceLimit.format(dLastDonePrice));
						//lstRefPrice = "";
						break;
					case N2NConst.PRTF_VIEWCOL_DAYHL:       //34//////						
						out.print(dfPriceLimit.format(Double.valueOf(sHighPrice).doubleValue()) + "<br>" + dfPriceLimit.format(Double.valueOf(sLowPrice).doubleValue()));
						break;
					case N2NConst.PRTF_VIEWCOL_YEARHL:      //36
						
						dVal = 0;
						dYearHighPrice = 0;
						
						try {
							dYearHighPrice = Double.valueOf(sYearHighPrice).doubleValue();
						} catch (NumberFormatException nfe) {
							dYearHighPrice = 0;
						}
						try {
							dVal = Double.valueOf(sHighPrice).doubleValue();
						} catch (NumberFormatException nfe) {
							dVal = 0;
						}
						if (dYearHighPrice < dVal) 
							dYearHighPrice = dVal;
						
						dYearLowPrice = 0;
						
						try {
							dYearLowPrice = Double.valueOf(sYearLowPrice).doubleValue();
						} catch (NumberFormatException nfe) {
							dYearLowPrice = 0;
						}
						try {
							dVal = Double.valueOf(sLowPrice).doubleValue();
						} catch (NumberFormatException nfe) {
							dVal = 0;
						}
						if ( ((dYearLowPrice==0)||(dYearLowPrice>dVal)) && (dVal>0) ) {
							dYearLowPrice = dVal;
						}
						
						out.print(dfPriceLimit.format(dYearHighPrice) + "<br>" + dfPriceLimit.format(dYearLowPrice));
						break;
					case N2NConst.PRTF_VIEWCOL_PCHANGE:     //38 
						out.print(dfPriceLimit.format(dChg) + "<br>" + dfValue.format(dChgPerc) + "%");
						if (dChg < 0) {
							out.print("<script language='javascript'>");
							out.print("document.getElementById('tblStkOrderList').rows[" + i + "].cells[" + iCol + "].className='tdMidColLoss'");
							out.print("</script>");							
						}
						break;
					case N2NConst.PRTF_VIEWCOL_VOLLOTSIZE	:  //40/ 
						out.print((String)data.elementAt(j+15) + "<br>" + (String)data.elementAt(j+16));
						break;					
					default: 
						break;
				}
				out.println("</td>");
			} // End of for iCol < sColSetting.length

			out.print("</tr>");
		} // End of for
%>
		</table>
		</div>

		<table id=tblTotal class=tblFooter border=0 cellpadding=2 cellspacing=0 width=750>
			<tr class=tblFooter><td align=left width='75%'>&nbsp;</td>
				<td align=right width='13%'>0.00</td>
				<td align=right width='12%'>0.00</td>
			</tr>
		</table>

		</td>
	</tr>

<script language=JavaScript>
var	bDirectTrd = false;
var aDirectTrdPos;
var sDirectTrdPos;

sDirectTrdPos = "";

if (sDirectTrdPos != "") {
	bDirectTrd = true;
	aDirectTrdPos = sDirectTrdPos.split("|");
}

/*function butTrade_Click(strOption)
{
	var sURLParam;
	var sOrdNo, sOrdNoList="", sHTML;
	var iCtr, nPos, nSelOrder;

	//the format should be OrdNo
	nPos = Number(aDirectTrdPos[0]);
	
	for (iCtr=0, nSelOrder=0; iCtr < document.all.tblStkOrderList.rows.length; ++iCtr) {
		sHTML = document.all.tblStkOrderList.rows(iCtr).cells(0).innerHTML;
		if (sHTML.indexOf("CHECKED") > -1) {
			//we need to remove the "<OrdSrc> " tag
			sOrdNo = document.all.tblStkOrderList.rows(iCtr).cells(nPos).innerText;			
			sOrdNoList += "|"+ sOrdNo.substring(2, 14);
			++nSelOrder;
		}
	}
	
	if (sOrdNoList == "") {
		sOrdNo = "";
		if (bDirectTrd && g_lSelRowIndex >-1) {
			
			sHTML = document.all.tblStkOrderList.rows(g_lSelRowIndex).cells(0).innerHTML;
			
			if (sHTML.indexOf("disabled") > -1) {
				alert("Cancellation/ Amendment disallowed. Your original order was placed via telephone. Please contact your delaer representative immediately");
				return false;
			}
			
			//the format should be OrdNo ... we need to remove the "<OrdSrc> " tag
			sOrdNo = document.all.tblStkOrderList.rows(g_lSelRowIndex).cells(nPos).innerText;
			sOrdNo = sOrdNo.substring(2, 14);
		}
	}

	if ((sOrdNoList == "") && (sOrdNo == "")) {
		alert("Please select an order to transact!");
		return false;
	}
	
	if (nSelOrder > 8) {
		alert("You can only cancel/revised a maximum of 8 orders in one time!");
		return false;
	}
	
	//sURLParam = "http://knn.n2nmsc.com/bin/trdCancelReqC.asp";
	sURLParam = "http://amestox.ebrokerconnect.com/gc/trdCancelReqC.jsp";
	
	//get all the to be cancel ... format ref as follow
	//type(OrdType)|OrdNo1|...|OrdNoNth
	
	if (sOrdNoList != "") {
		document.all.datRef.value = strOption + sOrdNoList;
	} else {
		document.all.datRef.value = strOption +"|"+ sOrdNo;
	}

	frmTrade.action = sURLParam;
	
	//	window.open('', frmTrade.target, 'width=740,height=450,location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes');
	
	document.all.butTrdSubmit.click();
}
*/
var g_lSelRowIndex=-1;	//currently selected row number, -1 => no rows selected

function SelectRow(p_lRowIndex, p_Row)
{
	//	var sStkCode;
	var FldSepPos;
	var oMenu;

	// when there is a selected row and another row is selected
	// reset the row's color to it's original color depending on
	// whether it's an even or odd row
	if (g_lSelRowIndex != -1) {
		if (g_lSelRowIndex%2 == 0) {
			document.all.tblStkOrderList.rows(g_lSelRowIndex).className = "trRowOdd";
		} else {
			document.all.tblStkOrderList.rows(g_lSelRowIndex).className = "trRowEven";
		}
	}

	if (g_lSelRowIndex != p_lRowIndex) {
		// the selected row is different from the currently selected row
		p_Row.className = "trRowSelected";
		g_lSelRowIndex = p_lRowIndex;

		// First cell contains both stock-code and stock-name
		// separated by "\n"
		//direct trade start at position 1 - for cancel/revise order
		/*
		if (bDirectTrd) {
			sStkCode = p_Row.cells(1).innerText;
		} else {
			sStkCode = p_Row.cells(0).innerText;
		}

		FldSepPos = sStkCode.indexOf("\n");
		if (FldSepPos > 0) {
			 sStkCode = VB_trim(sStkCode.substring(0, FldSepPos-1));
		}
		*/
	} else {
		// the selected row is the same as the last selected row
		g_lSelRowIndex = -1
	}
}
</script>

<script language=JavaScript for=trGenEvent event=onclick>
	SelectRow(this.rowIndex, this);
</script>

</table>

<table border=0 cellpadding=1 cellspacing=0 width=750><tr><td>This Portfolio Manager serves only as an auto-tracking facility for your stock holdings. It is your responsibility to ensure that you have sufficient stock in your CDS account before placing orders.</td></tr></table>
<hr align=left width='755'>
<table class=clsCopyrightBasic cellPadding=0 cellSpacing=0 width='755'><tr><td align=middle><br><font class=clsCopyrightBasic> <%=oN2NSession.getSetting("WebSiteName")%>. All rights reserved.</font></td></tr></table>

<div id=divPrnFooter name=divPrnFooter>
	<form id=frmPrnFooter name=frmPrnFooter>
		<input type=hidden id=txtLoginID name=txtLoginID value='<%=g_sLoginId%>' />
		<input type=hidden id=lstTrdAcc name=lstTrdAcc value='' />
		<label id=lblDisplay name=lblDisplay></label>
	</form>
</div>

<applet id=m_clsN2NFunc name=m_clsN2NFunc code=com.n2n.ebc.N2NFunc codebase=<%=g_sJavaPath%>/ archive="N2NFunc.jar,CalcFunc.jar" width=0 height=0 VIEWASTEXT MAYSCRIPT></applet>

</body>
</html>

<script language=JavaScript>
//use the stock code list to request for feed
var g_lstStkCode;
var g_aStkCode;
var g_lstQtyOnHand     = "<%=lstQtyOnHand%>";
var g_lstAPPrice       = "<%=lstAPPrice%>";

g_lstStkCode = "<%=lstStkCode%>";
if (g_lstStkCode.length >0) {
	g_aStkCode = g_lstStkCode.split("|");
}
g_lstQtyOnHand 	   = g_lstQtyOnHand.split("|");
g_lstAPPrice       = g_lstAPPrice.split("|");

//set flag to indicate ready for feed data
function Body_OnLoad() 
{	
	window.resizeTo(775,560);
	var slstGrossMktVal = "";
	var dTotAbsGrossMktVal = <%=dTotAbsGrossMktValue%>;
	
	document.all.selRefreshRate.value = "<%if (refresh.equals(""))   { out.print("0"); } else {out.print(refresh);} %>";
	<%
		if ( g_sCategory.equals(N2NConst.CLI_CATEGORY_SADMIN)    ||
		 	 g_sCategory.equals(N2NConst.CLI_CATEGORY_ADMIN)     ||
		 	 g_sCategory.equals(N2NConst.CLI_CATEGORY_DEALER)    ||
		 	 g_sCategory.equals(N2NConst.CLI_CATEGORY_REMOTERMS)
		) { 
	%>
	if (document.all.selTrdAcc.length > 0 && document.all.selTrdAcc.value != '0') {
		document.all.lblCliName.innerText = '['+ document.all.selTrdAcc.options[document.all.selTrdAcc.selectedIndex].text.split(')')[1].substring(1).toUpperCase() +']';
	}
	<%
		}
	%>
	var g_lstTrdLimitAndInfo = '<%=lstTrdLimitAndInfo_Tot%>'.split('|');
		
	var g_dTrdLimit = g_lstTrdLimitAndInfo[(document.all.selTrdAcc.selectedIndex *3)];
	
	document.all.lblTrdLimit.innerText = g_dTrdLimit; //JSformatNumber(g_dTrdLimit,2);
	
	if (g_dTrdLimit < 0) { document.all.lblTrdLimit.className = 'tdFooterColLoss'; }
	
	//	document.all.selTrdAcc.disabled = false;
	
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
							lstAccList += ', '+ sAcctNo_Temp; 
					}
					document.frmPrnFooter.lstTrdAcc.value = lstAccList +')'; 
			} 
	}
	
	// edit, if (sCDSNoPrev <> "") then
	if (document.all.selTrdAcc.length > 0) { document.all.lblCDSNo.title = 'CDS No: 076-001-003926151'; }

	//	moveTo(10, 100)
	//	resizeTo(785,450)

	//Display the total
	// for tot NET market value			
	var oTable  = document.getElementById("tblTotal");
	otblCol = oTable.rows[0].cells[1];
//	otblCol.innerHTML = FormatNumber(<%=dTotGrossMktValue%>,2,true,false,true) +"&nbsp;";
	otblCol.innerHTML = "<%=dfValue.format(dTotGrossMktValue)%>" +"&nbsp;";

	
	if (<%=dTotGrossMktValue%> < 0.0)
		otblCol.className = "tdFooterColLossNormal";

	// for tot unrealise gain/loss
	otblCol           = oTable.rows[0].cells[2];
	//otblCol.innerHTML = FormatNumber(<%=dTotUnRealGL%>,2,true,false,true) +"&nbsp;&nbsp;";
	otblCol.innerHTML = "<%=dfValue.format(dTotUnRealGL)%>" +"&nbsp;&nbsp;";
	
	if (<%=dTotUnRealGL%> < 0.0)
		otblCol.className = "tdFooterColLossNormal";
		
	//otblCol.title = 'Today Gain/Loss = '+ JSformatNumber(<%=dTotUnRealGLToday%>, 2);
	otblCol.title = 'Today Gain/Loss = '+ '<%=dfValue.format(dTotUnRealGLToday)%>';
	

	oTable = document.getElementById("tblStkOrderList");
	if (oTable.rows.length > 8) {
		document.all.divPortfolio.style.height = 256;		
	}
	
	if (<%=nPrtfPercCol%> > -1) {
		slstGrossMktVal = "<%=slstGrossMktVal.toString()%>".split("<%=N2NConst.STD_SEP%>");
		for (var iCtr=0; iCtr<=oTable.rows.length; iCtr++) {
			if (oTable.rows[iCtr] != null) {			
				oTable.rows[iCtr].cells[<%=nPrtfPercCol%>].innerText = FormatNumber((Math.abs(slstGrossMktVal[iCtr])/dTotAbsGrossMktVal*100),2,true,false,false) + "% "; 
			}
		}		
	}
	
	document.body.focus();
	//	document.all.selRefreshRate.disabled = false;
}

function findActualRow(vsKey) 
{
	var sKey, nRow;

	for(nRow = 0; nRow < g_aStkCode.length; ++nRow) {
		sKey = g_aStkCode[nRow];
		
		if (sKey == vsKey)
			break;
	}
	
	return nRow;
}

function PrtfLine_onDblClick(lrow) 
{
	var sURL, nActualRow;

	nActualRow = findActualRow(document.all.tblStkOrderList.rows(lrow).cells(0).innerHTML.split('&')[0]);
	
	sURL = "prtfDtl.jsp?code="+ g_aStkCode[nActualRow];
	
	if ("<%=strCliCode%>" != "<%=strCliCode%>") {
		sURL += "&clicode="+ "<%=strCliCode%>"
	}
	
	sURL += "&price="+ g_lstAPPrice[nActualRow] +"&qty="+ g_lstQtyOnHand[nActualRow];
		
	sURL += '&Acc='+ document.all.tblStkOrderList.rows(lrow).cells(0).title;
	
	window.open(sURL, "WinPrtfDtl", "width=730,height=400,scrollbars=no,status=no,toolbar=no,menubar=no,location=no,resizable=yes"); 
	
}


function onDisplayAll(prtfid, viewid) {
	window.location.href = "prtfSumm.jsp"	//?prtfid="+ prtfid +"&viewid="+ viewid)
}

function onClickFilter() {
	window.location.href = "prtfFilter.jsp"
}

function OnPrtfGo(vsTrdAcc) {

	var sURL = "prtfSumm.jsp?";
	
	sURL += "<%
		String sParam = "";
		
		if (qs_sSector.length()>0) { sParam =          "sector=" + qs_sSector + "&"; }
		if ( qs_sBoard.length()>0) { sParam = sParam + "board="  + qs_sBoard  + "&"; }
		if ( qs_nIndex         >0) { sParam = sParam + "index="  + Integer.toString(qs_nIndex) + "&"; }
		out.print(sParam);
	%>";
	
	if (document.all.selRefreshRate.value >= 0) {
		if (sURL.charAt(sURL.length-1) != '?' && sURL.charAt(sURL.length-1) != '&') { 
			sURL += '&';
		}
		sURL += 'refresh='+ document.all.selRefreshRate.value +'&';
	}

	if (false) { sURL += "clicode="+ "<%=strCliCode%>" +"&"; }
	
	if (vsTrdAcc != null && vsTrdAcc != '') {
		sURL += 'Acc='+ vsTrdAcc;
	
	} else if (document.all.selTrdAcc.selectedIndex > 0) {
		
		//get the account no/code
		var sAcc = document.all.selTrdAcc.value;
		
		sURL += 'Acc=' + sAcc.substr(1);
	}
	
	//alert(sURL);
	window.location.replace(sURL);
}

function selOption_OnChange(vsTrdAcc) {
	OnPrtfGo(vsTrdAcc);
}

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
	
	for (i = nOffset; i < document.all.selTrdAcc.length; ++i) {
	
		var sel_Val = document.all.selTrdAcc.options[i].value.substring(1, 9);
		var sel_Txt = document.all.selTrdAcc.options[i].text;
		
		lstAccList += sel_Val + ' '; 
		lstAccList += sel_Txt +'|';
	}
	
	return lstAccList.split('|');
}
	
function frmTrdAccSrch_OnSubmit(voFrm) {

	if (voFrm != null) {
		if (voFrm.butTrdAccSrch.value == 'Search') {
			voFrm.selTrdAcc.style.display     = 'none';
			voFrm.txtTrdAccSrch.style.display = '';
			voFrm.butTrdAccSrch.value         = ' GO ';
			voFrm.txtTrdAccSrch.focus();
		} else {
			voFrm.selTrdAcc.style.display     = '';
			voFrm.txtTrdAccSrch.style.display = 'none';
			voFrm.butTrdAccSrch.value         = 'Search';
			findTrdAcc(voFrm.txtTrdAccSrch.value, voFrm.selTrdAcc);
		}
	}
	
	return false;
}

function findTrdAcc(vsSearch, voCtrl) {
	
	var nLen = vsSearch.length; 
	var sTmp;
	
	if (nLen <= 0) { return 0; }
	
	vsSearch = vsSearch.toUpperCase();
	
	for(i=1; i<g_lstAccList.length; ++i) {
		
		sTmp = g_lstAccList[i];
		
		if (sTmp.indexOf(vsSearch) >= 0) {
			voCtrl.selectedIndex = i;
			selOption_OnChange('');
			break; 
		}
	}

	if (i == g_lstAccList.length) { selOption_OnChange(vsSearch); }
}
<%
		} // just isAdminUser() Or isBankDealer() can use Search Acct Func Only
%>
</script>
<script language=JavaScript for=trGenEvent event=ondblclick>
	PrtfLine_onDblClick(this.rowIndex);
</script>
<%
		//out.print(lstStkCode);
		} // End of if sAgreeTermCond.equals("Y")
		else{	//show terms and condition
%>
	<body style='background:#FFFFFF;margin:5px 0px 0px 5px' onload='body_onload();'>	
	<table cellspacing=0 cellpadding=0 border=0 width='100%' bgcolor='white'>
		<tr>
			<td colspan='2'>
				<table cellspacing=0 cellpadding=5 class='clsTableBorder' width='100%'>
					<tr>
						<td class='signup'>
							<table cellspacing=0 cellpadding=3 border=0 bordercolor='#FFFFFF' width='100%'>
								<tr>
									<td>
										<object classid=clsid:D27CDB6E-AE6D-11cf-96B8-444553540000 codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=4,0,2,0' width='202' height='112'>
										<param name='movie' value='<%=g_sImgPath%>/Home/LeftLogo.swf'>
										<param name='quality' value='high'>
										<param name='wmode' value='opaque'>
										<embed src='<%=g_sImgPath%>/Home/LeftLogo.swf' quality='high' pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash' width='202' height='112'></embed>
										</object>
									</td>
									<td class='signup' valign='center' align='justify'>
									In order to gain access to your stock portfolio, you are required to read and understand the authorization statement 
									below. Please click on "AGREED" button if you agree to the authorization or click on "NOT AGREED"
									button if you do not agree to the authorization. <br><br>
									</td>
								</tr>
								<tr><td colspan='2' class='signup'><div id=divTermCond style="overflow:auto">
								<b><u>AUTHORISATION TO ACCESS TO STOCK PORTFOLIO</u></b><br><br>
									I/WE HEREBY AUTHORISE AND CONSENT TO M&A Online Securities SDN BHD AND ITS AUTHORISED OFFICERS TO ENQUIRE 
									AND ACCESS INTO MY/OUR TRADING ACCOUNT(S) MAINTAINED WITH M&A Online Securities SDN BHD AND TO 
									DISCLOSE ALL OR PART OF MY/OUR STOCK PORTFOLIO TO ME/US, TO MY/OUR DEALER'S 
									REPRESENTATIVE OR TO THE AUTHORISED OFFICERS OF THE EXEMPT DEALERS, AS THE CASE 
									MAY BE, FOR THE PURPOSE OF FACILITATING MY/OUR SALE OR PURCHASE OF SECURITIES 
									TRANSACTIONS.  I/WE HEREBY CONFIRM THAT THIS AUTHORISATION SHALL BE VALID FOR AN 
									INDEFINITE PERIOD UNTIL REVOKED BY ME/US IN WRITING.<br><br>
									I/WE DECLARE AND UNDERSTAND THAT THE DISCLOSURE OF MY/OUR STOCK PORTFOLIO IS MADE ON 
									BEST EFFORT BASIS BASED ON SOURCES WHICH M&A Online Securities SDN BHD BELIEVED TO BE RELIABLE. 
									IT HAS BEEN HIGHLIGHTED TO ME/US THAT THIS STOCK PORTFOLIO REPORT MAY NOT BE AS 
									ACCURATE AS PER THE CDS ACCOUNT BALANCE ENQUIRY REPORT. THUS, I/WE SHALL NOT HOLD 
									M&A Online Securities SDN BHD LIABLE FOR ANY LOSSES OF WHATSOEVER NATURE THAT RESULTED FROM MY/OUR 
									RELIANCE ON THE STOCK PORTFOLIO REPORT. I/WE HEREBY UNDERTAKE TO INFORM 
									M&A Online Securities SDN BHD IMMEDIATELY SHOULD THERE BE ANY DISCREPANCIES IN MY/OUR STOCK 
									PORTFOLIO.<br><br>
									I/WE HEREBY CONFIRM AND DECLARE THAT I/WE HAVE READ AND UNDERSTOOD THE ABOVE AUTHORISATION AND HEREBY 
									RELEASE M&A Online Securities SDN BHD FROM ALL LIABILITIES OF WHATSOEVER NATURE ARISING FROM THIS 
									AUTHORISATION. I/WE AGREE AND UNDERTAKE TO INDEMNIFY M&A Online Securities SDN BHD FROM ALL CLAIMS 
									AND DEMANDS AS A RESULT OF ANY UNAUTHORISED ACTS OF MY DEALER'S REPRESENTATIVE OR 
									EXEMPT DEALER�S AUTHORISED OFFICERS, AS THE CASE MAY BE. </div>
								</td></tr>
								<tr>
									<td class='signup' height='1' colspan='2'>&nbsp;</td>
								</tr>
								<tr>
									<form name='frmTermCond' action='<%=g_sPath%>/prtfSumm.jsp' method='post'>
									<td align='center'><input type='button' id='btnAgree' onclick='javaascript:btnAgree_onclick();' value='AGREED'></td>
									<td align='center'><input type='button' id='btnDisagree' onclick='javaascript:btnDisagree_onclick();' value='NOT AGREED'>
									<input type='hidden' id='agree_termcond'  name='agree_termcond' value=''>
									</td>
									</form>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
	<script language='javascript'>
		var voForm = document.frmTermCond;
		function body_onload() {
			document.getElementById("divTermCond").style.height = 290;
			window.resizeTo(775,560);
		}
		
		function btnAgree_onclick() {
			document.getElementById("agree_termcond").value="Y";
			voForm.submit();
		} 
		
		function btnDisagree_onclick() {
			window.close();
		}
	</script>
	</body>
<%	
	}
	}
%>
<%
	long after = 0;
	after = System.currentTimeMillis();
	System.out.println("time diff in prtfSumm.jsp : " + ((after-before)) +" milisecond");
%>