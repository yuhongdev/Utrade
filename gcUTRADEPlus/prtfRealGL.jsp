<%@ include file='common.jsp'%>
<%@ include file='util/sessionCheck.jsp'%>
<% 
try {
	if (validSession) {
%>
<%@ page import = "java.sql.*, java.text.DecimalFormat, com.n2n.util.N2NConst" %>
<jsp:useBean id="order" class="com.n2n.DB.N2NMFOrder" scope="page"/>
<jsp:useBean id="stkPerCli" class="com.n2n.DB.N2NMFStkPerCli" scope="page"/>
<jsp:useBean id="stkPerClibean" class="com.n2n.bean.N2NMFStkPerCliBean" scope="page"/>
<%
	String[] saWork = null;
	int iNumRow = 0;
	String sBHCliCode = "", sBHBranch = "", sLoginName = "";
	String sExchange = "KL";
	String sStyle = "";

	String strCliName = g_sCliName;
	String strRmsName = g_sRmsName;
	strRmsName = strRmsName != null ? strRmsName : "-";
	if (strRmsName.equals("")) { strRmsName = "-"; }
	strCliName = strCliName != null ? strCliName : "-";
	if (strCliName.equals("")) { strCliName = "-"; }

	sBHCliCode = request.getParameter("Acc");
	sExchange = request.getParameter("exchg");
	sBHCliCode = sBHCliCode != null ? sBHCliCode : "";
	sExchange = sExchange != null ? sExchange : "KL";
	if (sBHCliCode.length() > 0) {
		saWork = sBHCliCode.split(N2NConst.TRDACC_COL_SEP);
		sBHCliCode = saWork[0];
		if (saWork.length >= 1) {
			sBHBranch = saWork[1];
		}
		sLoginName = "["+ g_sCliName +"]";
	}
%>
<html>
<head>
	<title><%=oN2NSession.getSetting("WebSiteName")%> - Portfolio Evaluation - Realised Gain/Loss</title>
	<link rel=stylesheet href='<%=g_sStylePath%>/default.css'>
	<script language='JavaScript' type='text/javascript' src='<%=g_sJSPath%>/LinkFunc.js'></script>
	<script language='JavaScript' type='text/javascript' src='<%=g_sJSPath%>/N2NFunc.js'></script>
	<script language='JavaScript' type='text/javascript' src='<%=g_sJSPath%>/SortFunc.js'></script>
	<script language=JavaScript src="<%=g_sJSPath%>/N2NPrnFunc.js"></script>
</head>
<body onload='body_Onload()' style='background-color:#FFFFFF'>
<table border=0 cellpadding=0 cellspacing=0 width=700>
	<tr>
		<td>&nbsp;&nbsp;</td>
		<td class=clsSectionHeader width='94%'>&nbsp; Realised Gain/Loss</td>
		<td width='6%'>
			<a href="javascript:beforePrint();window.print();afterPrint();"><img src=<%=g_sImgPath%>/butPrint.gif border=0></a>
			<img id='imgHelp' border='0' width='20' height='19' src='<%=g_sImgPath%>/lightbulboff.jpg' onmouseover="this.src='<%=g_sImgPath%>/lightbulbon.jpg'" onmouseout="this.src='<%=g_sImgPath%>/lightbulboff.jpg'" title='Portfolio Evaluation - Realised Gain Loss: Track your realised gains and losses in real time, so you&#39;re always up to date on your portfolio status'>
		</td>
	</tr>
</table>
<table border=0 cellpadding=0 cellspacing=0 width=700 height=30>

	<tr valign=middle height=20>
		<td colspan=3>&nbsp;&nbsp;&nbsp; <b>Client/DealerRep:</b> <%=strCliName.toUpperCase()%> / <%=strRmsName.toUpperCase()%> <label id=lblCliName></label></td>
	</tr>

	<tr valign=middle height=30>
		<td>&nbsp;&nbsp;</td>
		<td>
			<form id=frmTrdAcc onsubmit='return frmTrdAccSrch_OnSubmit(this);'>
			&nbsp;<b>Account:</b>&nbsp;
		<%
			order.init(oN2NSession);
			order.setWriter(out);
			
			String[] saTrdLimitAndInfo = null;
			String sBHCliCodeLimit = "", sBHBranchLimit = "";
			//sBHCliCode might be modify in the following function
			sBHCliCodeLimit = sBHCliCode;
			sBHBranchLimit = sBHBranch;
			//lstTrdLimitAndInfo = FillTrdAccListBox(g_sCliCode, sBHCliCodeLimit, sBHBranchLimit, true, not bAccessSF, "", 0);
			saTrdLimitAndInfo = order.fillTrdAccListBox(g_sCliCode, g_sDefBHCode, g_sDefBHBranch, sBHCliCodeLimit, true, "", 316, sExchange, sStyle);
			
			if (sBHCliCode.length() > 0 && sBHCliCodeLimit.compareToIgnoreCase(sBHCliCode) != 0) {
				sBHCliCode = sBHCliCodeLimit;
				sBHBranch = sBHBranchLimit;
			}
			
			if (sBHBranch.length() == 0 && sBHBranchLimit.length() > 0) {
				sBHBranch = sBHBranchLimit;
			}
			
			//setupTrdAccSrchUI()
			if (oN2NSession.cliinfo.isAdminUser() || oN2NSession.cliinfo.isBankDealer()) {
				out.println("<input id=txtTrdAccSrch name=txtTrdAccSrch style='display:none;width:180px' autocomplete=off>");
				out.println("&nbsp;<input id=butTrdAccSrch name=butTrdAccSrch type=submit value='Search'>");
			}
		%>
			&nbsp;&nbsp;<b>Balance:</b> <b>RM <label id=lblTrdLimit></label></b>
		</td>
		<td align=right></td>
		</form>
	</tr>
</table>
<table border=0 cellpadding=0 cellspacing=0 width=700>
	<tr>
		<td>&nbsp;&nbsp;</td>
		<td>
<%			ResultSet rs = null;
			iNumRow = 0;
			String sStkCode = "";
			double dTotPValue = 0.00, dAPPrice = 0.00, dTotSValue = 0.00, dASPrice = 0.00;
			int nQty = 0, nQtyBuy = 0, nQtyShort = 0;
			double dComm = 0.00, dGTotPValue = 0, dGTotSValue = 0, dGTotPComm = 0;
			double dGTotSComm = 0, dGainLoss = 0.00, dTotGainLoss = 0.0;
			DecimalFormat decFormat = new DecimalFormat("#,##0.00");
			DecimalFormat intFormat = new DecimalFormat("#,##0");
			DecimalFormat fourDecFormat = new DecimalFormat("#,##0.0000");
			
			stkPerCli.init(oN2NSession);
			
			stkPerClibean.setCliCode(g_sCliCode);
			if (sBHCliCode.length() > 0) {
				//sSQL = sSQL + ",@vsBHCode='"+ g_BHCode +"',@vsBHCliCode='"+ sBHCliCode +"',@vsBHBranch='"+ sBHBranch +"'"
				stkPerClibean.setBHCode(g_sDefBHCode);
				stkPerClibean.setBHCliCode(sBHCliCode);
				stkPerClibean.setBHBranch(sBHBranch);
			}
			rs = stkPerCli.getStkPerCli_GainLoss(stkPerClibean);
			
			if (rs != null) {
				while (rs.next()) {
					if(iNumRow == 0) {
%>			<table cellpadding=2 cellspacing=0 width=700>
				<tr class=trTableHeader>
					<td class=tdHdrFirstCol width='13%'>
						<I><div title='sort by stock code' style='cursor:hand' onClick="SortTableCol('tblStkOrderList', 0, 0, '&', '', '', SF_StringSort, true)">Stock Code</div>
						<div title='sort by stock name' style='cursor:hand' onClick="SortTableCol('tblStkOrderList', 0, 2, '>', '<', '', SF_StringSort, true)">/Name</div></I>
					</td>
					<td class=tdHdrMidCol width='11%'>Aggr Buy Price</td>
					<td class=tdHdrMidCol width='11%'>Aggr Sell Price</td>
					<td class=tdHdrMidCol width='12%'>Total Qty From Holding</td>
					<td class=tdHdrMidCol width='12%'>
						<I><div title='sort by quantity short' style='cursor:hand' onClick="SortTableCol('tblStkOrderList', 4, 0, '&', '', ',', SF_NumericSort, false)">Total Qty Short</div></I>
					</td>
					<td class=tdHdrMidCol width='12%'>
						<I><div title='sort by quantity sold' style='cursor:hand' onClick="SortTableCol('tblStkOrderList', 5, 0, '&', '', ',', SF_NumericSort, false)">Total Qty Sold</div></I>
					</td>
					<td class=tdHdrMidCol width='12%'>Total Brokerage</td>
					<td class=tdHdrLastCol width='17%'>
						<I><div title='sort by Realised Gain Loss (RM)' style='cursor:hand' onClick="SortTableCol('tblStkOrderList', 7, 0, '&', '', ',', SF_NumericSort, false)">Realised Gain/Loss<br></div>
						<div title='sort by Realised Gain Loss (%)' style='cursor:hand' onClick="SortTableCol('tblStkOrderList', 7, 1, '>', '%', ',', SF_NumericSort, false)">(RM/%)</div></I>
					</td>
				</tr>
			</table>
			<div id=divPrtfRealGLList style="overflow:auto">
			<table id=tblStkOrderList class=tblTableData border=0 cellpadding=2 cellspacing=0 width=700>
		<%			}
					sStkCode = rs.getString("StkCode");
					nQty = rs.getInt("TotSQty");
					nQtyBuy = rs.getInt("TotPQty");
					nQtyShort = nQty - nQtyBuy;
					
					dTotPValue = rs.getDouble("TotPValue");
					dTotSValue = rs.getDouble("TotSValue");
					dGTotPValue = dGTotPValue + dTotPValue;
					dGTotSValue = dGTotSValue + dTotSValue;
					if (nQtyBuy == 0)
						dAPPrice = 0;
					else
						dAPPrice = dTotPValue / nQtyBuy;
						
					dASPrice = dTotSValue / nQty;
					dComm = rs.getDouble("TotPComm") + rs.getDouble("TotSComm");
					dGTotPComm = dGTotPComm + rs.getDouble("TotPComm");
					dGTotSComm = dGTotSComm + rs.getDouble("TotSComm");
					
					iNumRow = iNumRow + 1;
					if (iNumRow % 2 == 0)
						out.println("<tr class=trRowEven>");
					else
						out.println("<tr class=trRowOdd>");
						
					out.println("<td class=tdFirstCol width='13%' title='"+ rs.getString("BHCliCode") +"' align=right>");
					out.println(sStkCode +"&nbsp;<br>");
					out.println("<font style='cursor:hand;color:blue;text-decoration:underline' onclick=\"DisplayStkInfoLink('E','"+ sStkCode + "')\">");
					if (rs.getString("StkShtName") != null) {
						out.println(rs.getString("StkShtName").trim() + "</font>&nbsp;");
					} else {
						out.println("</font>&nbsp;");
					}
					out.println("</td>");
					out.println("<td class=tdMidCol width='11%' align=right>" + fourDecFormat.format(dAPPrice) + "&nbsp;</td>");
					out.println("<td class=tdMidCol width='11%' align=right>" + fourDecFormat.format(dASPrice) + "&nbsp;</td>");
					out.println("<td class=tdMidCol width='12%' align=right>" + intFormat.format(nQtyBuy) + "&nbsp;</td>");
					out.print("<td class=tdMidCol");
					if (nQtyShort > 0)
						out.print("Loss");
					out.println(" width='12%' align=right>" + intFormat.format(nQtyShort) + "&nbsp;</td>");
					out.println("<td class=tdMidCol width='12%' align=right>" + intFormat.format(nQty) + "&nbsp;</td>");
					out.println("<td class=tdMidCol width='12%' align=right>" + decFormat.format(dComm) + "&nbsp;</td>");
					
					dGainLoss = rs.getDouble("GainLoss");
					//out.println(dGainLoss);
					//2007-03-07 Pui Fong [According to audrey, realized gain loss should deduct brokerage]
					dGainLoss = dGainLoss - dComm;
					//2007-03-07
					out.print("<td width='17%' align=right ");
					if (dGainLoss >= 0.0)
						out.println("class=tdLastCol>");
					else
						out.println("class=tdLastColLoss>");
					out.println(decFormat.format(dGainLoss) + "&nbsp;<br>");
					if ((dAPPrice*nQtyBuy) == 0)
						out.println("100");
					else
						out.println(decFormat.format((dGainLoss*100)/(dAPPrice*nQtyBuy +rs.getDouble("TotPComm"))));
					out.println("%&nbsp;</td></tr>");
					
					dTotGainLoss = dTotGainLoss + dGainLoss;
				}
		    	rs.close();
		    }
			
			rs = null;
			stkPerCli.closeResultset();
			
			if(iNumRow > 0) {
%>
			</table>
			</div>
		</td>
	</tr>
	<tr>
		<td>&nbsp;&nbsp;</td>
		<td>
			<table id=tblTotal class=tblFooter cellpadding=1 cellspacing=0 width=700>
				<tr class=tblFooter>
					<td align=right width='77%' title="Total Purchase Value=<%=decFormat.format(dGTotPValue)%>, Total Sell Value=<%=decFormat.format(dGTotSValue)%>, Total Brokerage=<%=decFormat.format(dGTotPComm + dGTotSComm)%>">
						<b>Total realised gain/loss:</b>
					</td>
					<td align=right width='23%' 
<%				if (dGTotPValue != 0)
					out.print("title='Gain Loss Percentage=" + decFormat.format(dTotGainLoss / (dGTotPValue +dGTotPComm+dGTotSComm) *100) + "%'");
					
				if (dTotGainLoss < 0.0)
					out.print("class=tdFooterColLossNormal");
					
				out.println(">" + decFormat.format(dTotGainLoss));
%>
				 		&nbsp;&nbsp;&nbsp;
				 	</td>
			 	</tr>
			 </table>
<%			}
			else {
				out.println("<b><font size=3 color='#FF0000'>Note: You do not have any realise gain/loss data to be displayed.</font></b>");
			}
%>
		 </td>
	</tr>
</table>
<table cellpadding=1 cellspacing=0 width=700>
	<tr height=30><td align=right><input type=button value=Close onClick='self.close()'></td></tr>
</table>

<hr>

<table class=clsCopyrightBasic cellPadding=0 cellSpacing=0 width='755'><tr><td align=middle><br><font class=clsCopyrightBasic> <%=oN2NSession.getSetting("WebSiteName")%>. All rights reserved.</font></td></tr></table>

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
function body_Onload()
{
<%	if (oN2NSession.cliinfo.isAdminUser() || oN2NSession.cliinfo.isBankDealer()) {
		//out.println("if (document.getElementById('selTrdAcc').length > 0 && document.getElementById('selTrdAcc').value != '0') {");
		out.println("if (document.getElementById('selTrdAcc').length > 0 && document.getElementById('selTrdAcc').value != '') {");
		out.println("	var sText = document.getElementById('selTrdAcc').options[document.getElementById('selTrdAcc').selectedIndex].text.split(')');");
		out.println("	document.getElementById('lblCliName').innerText = '['+ sText[1].substring(1).toUpperCase() +']';");
		out.println("}");
	}
%>
	if (<%=iNumRow%> > 8) {
		document.getElementById('divPrtfRealGLList').style.height = 256;
	}
	<%//call displayTrdLimit(): call setupPrnTrdLimit()

//sub displayTrdLimit()
	//set trading limit
	//out.println("var g_lstTrdLimitAndInfo = '"+ saTrdLimitAndInfo +"'.split('"+ N2NConst.FEED_REQFLD_SEP +"');");
	out.println("var g_lstTrdLimitAndInfo = '"+ saTrdLimitAndInfo[2] +"'.split('"+ N2NConst.FEED_REQFLD_SEP +"');");
	out.println("var g_dTrdLimit = g_lstTrdLimitAndInfo[(document.getElementById('selTrdAcc').selectedIndex *3)];");
	if (oN2NSession.cliinfo.isBankDealer()) {
		out.println("if (document.getElementById('selTrdAcc').selectedIndex == 0) {");
		out.println("	document.getElementById('lblTrdLimit').innerText = '--N/A--';");
		out.println("} else {");
		//out.println("	document.getElementById('lblTrdLimit').innerText = JSformatNumber(g_dTrdLimit,2);");
		out.println("document.getElementById('lblTrdLimit').innerText = FormatNumber(g_dTrdLimit,2,true,false,true);");
		out.println("}");
	}
	else {
		//out.println("document.getElementById('lblTrdLimit').innerText = JSformatNumber(g_dTrdLimit,2);");
		out.println("document.getElementById('lblTrdLimit').innerText = FormatNumber(g_dTrdLimit,2,true,false,true);");
	}

	out.println("if (g_dTrdLimit < 0) { document.getElementById('lblTrdLimit').className = 'tdFooterColLoss'; }");
	out.println("document.getElementById('selTrdAcc').disabled = false;");
//}

	/*
	--sub setupPrnTrdLimit()
	if (!(oN2NSession.cliinfo.isBankDealer())) {
		out.println("if (document.getElementById('selTrdAcc').length > 0) {");
		out.println("	var nOffset=0;");
		out.println("	if (document.getElementById('selTrdAcc').options[0].value == '') { ++nOffset; }");
		out.println("	if (document.getElementById('selTrdAcc').length > nOffset) {");
		out.println("		var lstAccList = '(Acc: '+ document.getElementById('selTrdAcc').options[nOffset++].value.substring(1, 9);");
		out.println("		for (i = nOffset; i < document.getElementById('selTrdAcc').length; ++i) {");
		out.println("			lstAccList += ', '+ document.getElementById('selTrdAcc').options[i].value.substring(1, 9); }");
		out.println("		document.frmPrnFooter.lstTrdAcc.value = lstAccList +')'; } }");
	}
	*/
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

function OnPrtfGainLossGo(vsTrdAcc)
{
	var sURL;
	sURL = "prtfRealGL.jsp?";

	if (vsTrdAcc != null && vsTrdAcc != '') {
		sURL += 'Acc='+ vsTrdAcc;
	} else if (document.getElementById('selTrdAcc').selectedIndex > 0) {
		//get the account no/code
		var sAcc;
		sAcc = document.getElementById('selTrdAcc').value;
		sURL += 'Acc='+ sAcc.substr(1);
	}
	window.location.href = sURL + "&exchg=<%=sExchange%>";
}
function selOption_OnChange(vsTrdAcc)
{
	OnPrtfGainLossGo(vsTrdAcc);
}
<%	//call setupTrdAccSrchJS()
	if (oN2NSession.cliinfo.isAdminUser() || oN2NSession.cliinfo.isBankDealer()) {
		out.println("var g_lstAccList=getAccList();");
		out.println("function getAccList() {");
		out.println("	var nOffset=0, lstAccList='';");
		out.println("	for (i = nOffset; i < document.getElementById('selTrdAcc').length; ++i) {");
		out.println("		lstAccList += document.getElementById('selTrdAcc').options[i].value.substring(1, 9) +' '+ document.getElementById('selTrdAcc').options[i].text +'|'; }");
		out.println("		return lstAccList.split('|');");
		out.println("	}");
		
		out.println("	function frmTrdAccSrch_OnSubmit(voFrm) {");
		out.println("		if (voFrm != null) {");
		out.println("		if (voFrm.butTrdAccSrch.value == 'Search') {");
		out.println("			voFrm.selTrdAcc.style.display = 'none';");
		out.println("			voFrm.txtTrdAccSrch.style.display = '';");
		out.println("			voFrm.butTrdAccSrch.value = ' GO ';");
		out.println("			voFrm.txtTrdAccSrch.focus();");
		out.println("		} else {");
		out.println("			if(voFrm.txtTrdAccSrch.value == '') {");
		out.println("				alert('Please enter a search text!');");
		out.println("				voFrm.txtTrdAccSrch.focus();");
		out.println("				return false;");
		out.println("			}");
		out.println("			else if(voFrm.txtTrdAccSrch.value.indexOf('-') == -1) {");
		out.println("				alert('Please enter a valid account!');");
		out.println("				voFrm.txtTrdAccSrch.focus();");
		out.println("				return false;");
		out.println("			}");
		out.println("			voFrm.selTrdAcc.style.display = '';");
		out.println("			voFrm.txtTrdAccSrch.style.display = 'none';");
		out.println("			voFrm.butTrdAccSrch.value = 'Search';");
		out.println("			findTrdAcc(voFrm.txtTrdAccSrch.value, voFrm.selTrdAcc);");
		out.println("		}");
		out.println("	}");
		out.println("	return false;");
		out.println("}");
		
		out.println("function findTrdAcc(vsSearch, voCtrl) {");
		out.println("	var nLen = vsSearch.length; var sTmp;");
		out.println("	if (nLen <= 0) { return 0; }");
		out.println("	vsSearch = vsSearch.toUpperCase();");
		out.println("	for (i = 1; i < g_lstAccList.length; ++i) {");
		out.println("		sTmp = g_lstAccList[i];");
		out.println("		if (sTmp.indexOf(vsSearch) >=0) {");
		out.println("			voCtrl.selectedIndex = i; selOption_OnChange(''); break; }");
		out.println("	}");
		//if (isAdminUser() Or isBankDealer()) {
		out.println("	if (i == g_lstAccList.length) { selOption_OnChange(vsSearch); }");
		//}
		out.println("}");
	}
%>
</script>
<%	}
} catch (Exception ex) {
	ex.printStackTrace();
}
%>