<%@ page import = "java.sql.ResultSet,java.net.*,java.io.*,java.text.DecimalFormat" %>
<%@ page import = "com.n2n.util.N2NConst,com.n2n.util.N2NSecurity" %>
<%@ page import = "com.n2n.DB.N2NMFCliColSetting" %>
<%@ page import = "com.n2n.bean.N2NMFCliColSettingBean" %>
<%@ page import = "com.n2n.bean.N2NMFCliInfoBean" %>
<%@ page import = "com.n2n.DB.N2NMFCliInfo" %>
<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<%@ include file='common.jsp'%>
<%@ include file='util/sessionCheck.jsp'%>
<script language=JavaScript src=<%=g_sJSPath%>/N2NCtrl.js></script>
<script language=JavaScript src=<%=g_sJSPath%>/LinkFunc.js></script>

<% //if (oN2NSession.getIsUserLogin()) {
	if (validSession) {
%>
<html>
<head>
<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
<title><%=oN2NSession.getSetting("WebSiteName")%></title>
</head>

<%
	ResultSet oRst;

	String sSQL = "";
	String sOption = "";
	String sCliCode = "", sBHCliCode = "", sBHBranch = "";
	String sLinkCode = "";
	String sStatus = "" ;
	String sService = "";
	String sDefTrdAcct = "", sErrMsg = "";
	String sSave = "";
	String sAcc = "";
	
	int nService = 0;
	
	String[] arrInfo = null;
	String[] aWork = null;		
	
	boolean m_bRetCode = false;
	boolean bShowTrdLimit = true;
	
	DecimalFormat dfValue  = new DecimalFormat("#,###,###,##0.00");
	DecimalFormat dfValue2 = new DecimalFormat("#########0.00");

	sCliCode = g_sCliCode;	
	sLinkCode = "SMSTRD";
	sSave = request.getParameter("Save");
	sErrMsg = request.getParameter("ErrMsg");
	sOption = request.getParameter("txtOption");
	sAcc = request.getParameter("Acc"); 
	sStatus = "U";
	sBHCliCode  = "";
	
	String selTrdAcc = (String) request.getParameter("Acc");
	selTrdAcc = selTrdAcc != null ? selTrdAcc : "";
	
	sSave = sSave != null ? sSave : "";
	sErrMsg = sErrMsg != null ? sErrMsg : "";
	sOption = sOption != null ? sOption : "";
	sAcc = sAcc != null ? sAcc : "";

	N2NMFCliColSetting clicol = new N2NMFCliColSetting();
	N2NMFCliColSettingBean cliBean = new N2NMFCliColSettingBean();
	
	clicol.init(oN2NSession);
	
	if (sOption.length() > 0 ) {
		
		arrInfo = sOption.split(N2NConst.FEED_REQFLD_SEP);
		
		cliBean.reset();		
		
		cliBean.setCli_code(g_sCliCode);
		cliBean.setBhcode(g_sDefBHCode);		
		cliBean.setBhbranch(sBHBranch);
		cliBean.setBh_clicode(sBHCliCode);
		cliBean.setService_code(sLinkCode);
		cliBean.setSms("N");
		cliBean.setEmail("N");		
		cliBean.setParam("");	
		cliBean.setActive("");										
		cliBean.setStatus(sStatus);	
		if (arrInfo.length > 0 ){
			cliBean.setService(arrInfo[1]);
			cliBean.setDeftrdacct(arrInfo[0]);
		}

		sSQL = "EXEC usp_mfCliProfSave @vsCliCode='" + g_sCliCode + "', @vsBHCode='" + g_sDefBHCode + "', @vsBHBranch='', @vsBHCliCode='', @vsSrvCode='" + sLinkCode + "', @vsSMS='N', @vsEmail='N', @vsParam='', @vsActive='', @vsStatus='U', @vsTemplateParam='', @vsImageParam='', @vsAuthCode='', @vsService='" + arrInfo[1] + "', @vsDefTrdAcct='" + arrInfo[0] + "'";
		m_bRetCode = clicol.cliProfSave(cliBean,"","");

		response.sendRedirect(g_sPath+"/cliProfilerTrdEdit.jsp?Save=Y");	
		
	}
	
	cliBean.reset();
	
	cliBean.setService_code("");
	cliBean.setCli_code(g_sCliCode);
	cliBean.setBhcode("");
	cliBean.setBhbranch("");
	cliBean.setBh_clicode("");
	cliBean.setService_code(sLinkCode);
	cliBean.setActive("");
	cliBean.setParam("");
	
	//set oRst = g_oCnn.Execute("EXEC usp_mfGetCliSetting @vsCliCode='" + g_CliCode + "', @vsBHCode='', @vsBHBranch='', @vsBHCliCode='', @vsLinkCode='SMSTRD'")
	oRst = clicol.getCliColSetting(cliBean,sLinkCode);
	
	if (oRst != null && oRst.next()) {
		sStatus = oRst.getString("Status");
		sService = oRst.getString("Service");
		nService = Integer.parseInt(sService);
		sDefTrdAcct = oRst.getString("DefTrdAcct");
	}

	if (sAcc.length() > 0 ) { 
		sBHCliCode = sAcc;
	} 

	if (sBHCliCode.length() <=0 && sDefTrdAcct != "") { 
		sBHCliCode = sDefTrdAcct;
	}

	if (sBHCliCode.length() > 0) {		
		aWork = sBHCliCode.split(N2NConst.TRDACC_COL_SEP);
		sBHCliCode = aWork[0];
		if (aWork.length >= 1) {
			sBHBranch = aWork[1];
		}
	}

	if (sErrMsg != "1" && sStatus != "C") { 
		response.sendRedirect(g_sPath+"/cliProfilerTrd.jsp?ErrMsg=1");
	} 
%>

<body onload='body_OnLoad();'>

<form id=frmProfilerTrd name=frmProfilerTrd METHOD=post action=<%=g_sPath %>'/cliProfilerTrdEdit.jsp' onsubmit="return btnAction_OnClick('S');">
<table border=0 cellpadding=1 cellspacing=0 width=450>

	<tr><td colspan=2 class=clsSectionHeader >&nbsp; Change my default Trading Account to &nbsp; &nbsp; &nbsp; 
	<%	//dim lstTrdLimitAndInfo
		//String sCDSNo = "";

		//lstTrdLimitAndInfo = FillTrdAccListBox(sCliCode, sBHCliCode, sBHBranch, false, false, "")'
	%>
	
				<select id=selTrdAcc name=selTrdAcc style='height:22px;width:180px' onchange='selOption_OnChange("")'>	
					
<%
		String lstTrdLimitAndInfo_Tot = "";
		String lstTrdLimitAndInfo = "";
		double totdTrdLimit = 0.0;
		String lstCDSNo			   = "";

		N2NMFCliInfoBean clibean = new N2NMFCliInfoBean();
		clibean.setCliCode(g_sCliCode);
		clibean.setBhcode(g_sDefBHCode);
		clibean.setBhbranch(g_sDefBHBranch);
		clibean.setBhCliCode("");
		clibean.setAccountType("");
		
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

			double dTrdLimit = 0;

			while (oRst.next()) {

				selBHCliCode        = oRst.getString("BHCliCode").trim();
				selBHCode           = oRst.getString("BHCode");
				selBHBranch         = oRst.getString("BHBranch");
				selAccType          = oRst.getString("AccType");
				lstCDSNo			= lstCDSNo + selBHCliCode + "\\|" + oRst.getString("CDSNo") + "\\|";
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
					out.print("<option value='" + selValue + "' selected>" + selTitle +"</option>");
				else
					out.print("<option value='" + selValue + "'>" + selTitle +"</option>");

				if ( g_sCategory.equals(N2NConst.CLI_CATEGORY_SADMIN)    ||
					 g_sCategory.equals(N2NConst.CLI_CATEGORY_ADMIN)     ||
					 g_sCategory.equals(N2NConst.CLI_CATEGORY_DEALER)    ||
					 g_sCategory.equals(N2NConst.CLI_CATEGORY_REMOTERMS)
				) { out.print(" " + selCliName); }

				clibean.reset();
				clibean.setBhcode(selBHCode);
				clibean.setBhCliCode(selBHCliCode);

				if (bShowTrdLimit) {
					dTrdLimit = oN2NSession.cliinfo.getCliTrdLimit(clibean,"D");
	
					//format : lstTrdLimitAndInfo_Tot = totdTrdLimit|30|0.01|dTrdLimit|selMaxPriceInterval|selBrokerageRate|..
	
					lstTrdLimitAndInfo = lstTrdLimitAndInfo +
										 dfValue.format(dTrdLimit) + "|" +
										 selMaxPriceInterval       + "|" +
										 dfValue2.format(Float.valueOf(selBrokerageRate).floatValue()) + "|";
	
					totdTrdLimit = totdTrdLimit + dTrdLimit;
				}
			} // End of while oRst.next()

			if (bShowTrdLimit) {
				lstTrdLimitAndInfo_Tot = dfValue.format(totdTrdLimit) + "|" + "30" + "|" + "0.01" + "|" +
									 lstTrdLimitAndInfo;
			}
		} // if (oRst != null)

		oRst.close();
		oRst = null;

		cli.closeResultset();
		cli.dbDisconnect();

		//-- End of [list out all of Acct No] -----------------------------------------------------
%>
	</select>
	
	</td></tr>

	<tr><td colspan=2>&nbsp;</td></tr>

	<tr><td colspan=2>
		<table border=1 cellpadding=1 cellspacing=0 width=450>
		<tr><td class=trTableHeader align=left>Option for sms auto notification</td></tr>

		<tr><td align=left>
			<table border=0 cellpadding=1 cellspacing=0 width=450>
				<tr><td colspan=2>Notify me automatically via sms for : </td></tr>

				<tr><td><input class=clsCliDtlInput id=radProfiler name=radProfiler type=radio maxLength=1  size=1 value=1 style="WIDTH: 20px; HEIGHT: 20px ; valign=middle"
				<%	if ((nService & 1) != 0)  { 
						out.println(" checked");
					}
				%>
					> Full Matched Confirmation

					</td><td><input class=clsCliDtlInput id=radProfiler name=radProfiler type=radio maxLength=1  size=1 value=2 style="WIDTH: 20px; HEIGHT: 20px ; valign=middle"
				<%	if ((nService & 2) != 0 ) { 
						out.println(" checked");
				} %>
					> Every Partial Matched Confirmation
				</td></tr>

				<tr><td><input type=checkbox id=chkService3_4 name=chkService3_4 size=3 align=middle 
				<%	if ((nService & 4) != 0 ) { 
						out.println(" checked");
				} %>
					> Session End Matched Summary

					</td><td><input type=checkbox id=chkService3_8 name=chkService3_8 size=3 align=middle 
					<%	if ((nService & 8) != 0 ) { 
						out.println(" checked");
					} %>
					> Cancel / Revise Confirmation
				</td></tr>

				<tr><td><input type=checkbox id=chkService3_16 name=chkService3_16 size=3 align=middle 
				<%	if ((nService & 16) != 0 ) { 
						out.println(" checked");
				} %>
					> BFE Reject Order Confirmation 

					</td>
				<td>&nbsp;

				</td></tr>
				<tr><td colspan=2>&nbsp;</td></tr>
				<tr><td colspan=2>* Each auto replied sms costs you RM 0.30 </td></tr>
			</table>
		</td></tr>
		</table>
	</td></tr>
	<tr><td colspan=2>&nbsp;</td></tr>
	<tr><td colspan=2 align=right>
		<input type=button value='  Close  ' id=btnClose name=btnClose sytle='width:200' onclick='btnCls_OnClick()' > &nbsp;&nbsp;&nbsp;
		<input type=button value=' Clear All ' id=btnClear name=btnClear sytle='width:200' onclick='btnClr_OnClick()' > &nbsp;&nbsp;&nbsp;
		<input type=submit value=' Save Settings ' id=btnSave name=btnSave sytle='width:200'>
	</td></tr>
</table>
<input type=hidden id=txtOption name=txtOption >
</form>

</body>
</html>

<SCRIPT language='JavaScript'>

function body_OnLoad()
{
	var sURL = "<%=g_sPath%>/cliProfilerTrdEdit.jsp?";

	document.getElementById('selTrdAcc').disabled = false;
	document.body.focus();

	<% if (sSave.equalsIgnoreCase("Y")) { %>
		alert("Your option has been successfully saved. Thank you.");
		window.location.href = sURL;
	<%} %>
}
function btnCls_OnClick() {	
	self.close();
}

function btnClr_OnClick() {

	document.frmProfilerTrd.radProfiler(0).checked = false;
	document.frmProfilerTrd.radProfiler(1).checked = false;

	document.frmProfilerTrd.chkService3_4.checked = false;
	document.frmProfilerTrd.chkService3_8.checked = false;
	document.frmProfilerTrd.chkService3_16.checked = false;


}

function btnAction_OnClick(vsAct) {
	var sOption, sAcc 
	sOption=0

	switch (vsAct) {
		case "S":

			if (document.frmProfilerTrd.radProfiler(0).checked){
				sOption = sOption + 1;
			}
			if (document.frmProfilerTrd.radProfiler(1).checked){
				sOption = sOption + 2;
			}
			if (document.frmProfilerTrd.chkService3_4.checked) {
				sOption = sOption + 4;
			}
			if (document.frmProfilerTrd.chkService3_8.checked) {
				sOption = sOption + 8;
			}
			if (document.frmProfilerTrd.chkService3_16.checked) {
				sOption = sOption + 16;
			}
		/*	if (document.frmProfilerTrd.chkService3_32.checked) {
				sOption = sOption + 32;
			}
		*/

			sAcc = document.frmProfilerTrd.selTrdAcc.value;
			if (sAcc.length >= 1) {
				sAcc = sAcc.substr(1);
			}


// alert(sOption)


			document.frmProfilerTrd.txtOption.value = sAcc + "|" + sOption 


//alert(document.frmProfilerTrd.txtOption.value)


			return true;

//		default:
	}
	return false;
}

//display different trading limit for different account
function selOption_OnChange(vsTrdAcc)
{
	var sURL
	sURL = "<%=g_sPath%>/cliProfilerTrdEdit.jsp?";

	if (vsTrdAcc != null && vsTrdAcc != '') {
		sURL += 'Acc='+ vsTrdAcc;
	} else if (document.getElementById('selTrdAcc').selectedIndex >= 0) {
		//get the account no/code
		var sAcc;
		sAcc = document.getElementById('selTrdAcc').value;
		sURL += 'Acc='+ sAcc.substr(1);
	}
	window.location.href = sURL;
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
<%}
	else{
		response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
	}
%>