<%@ include file='common.jsp'%>
<%@ page import = "com.n2n.bean.N2NMFRefBean, com.n2n.DB.N2NMFRef, java.sql.ResultSet,com.n2n.util.N2NConst,java.text.DecimalFormat,java.text.SimpleDateFormat" %>
<%@ page import = "com.n2n.DB.N2NPrtfCalc, com.n2n.bean.N2NPrtfBean, com.n2n.DB.N2NMFStkInfo, com.n2n.bean.N2NMFStkInfoBean" %>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" import = "com.n2n.ebc.N2Nrb,java.util.Locale" %>
<jsp:include page="cliCheckLogin.jsp" flush="true">
	<jsp:param name="SecLevel" value="1" />
</jsp:include>
<html>
<head>
<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
<script language=JavaScript src="<%=g_sJSPath%>/LinkFunc.js"></script> 
<title><%=oN2NSession.getSetting("WebSiteName")%> - <%= isLangCN(g_sLanguage) ? "&#25490;&#21015;&#25237;&#36164;&#32452;&#21512;&#35760;&#24405;" : "Filter Portfolio Record" %></title>
<META http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<!--body style='background:#FFFFFF;margin:2px 0px 0px 5px' onload='body_Onload()'-->
<body class='clsBody' onload='body_Onload()'>
<%
	String sLanguage = "", sCountry = "";
	
	if (isLangCN(g_sLanguage)) {
		sLanguage = "zh";
		sCountry="cn";
	} else {
		sLanguage="en";
		sCountry="us";
	}
	
	N2Nrb m_nrbStkName=null;
	Locale currentLocale=new Locale(sLanguage, sCountry);
	
	if (isLangCN(g_sLanguage)) {
		m_nrbStkName = (N2Nrb) N2Nrb.getBundle("com.n2n.ebc.rbStk", currentLocale);
	}
	try {	
		if (oN2NSession.getIsUserLogin()) {		
			oN2NSession.checkTrdInfo("","",request,response);
			String sDocNo = "";
			String sSubOrdNo = "";
			String sStkCode = "";	
			String sStkShtName = "";
			String sStkName = "";
			String sTemp = "";
			String sCliCode = "";
			String sBHCliCode = "";
			String sBHBranch = "";
			String saWork[];
			double dPPrice = 0;
	        double dPrice = 0;
			String sOrdSrc = "";
			String sCurr = "";
			String sMkt = "";
			String sSide = "";			
			int nTotQty = 0;
	        int nQty = 0;
	        int nQtyLeft = 0;
	        int nFreeBal = 0;
	        int nOSSale = 0;
	        int nOSPurchase = 0;
			boolean bCSROrder = false;
			boolean bChinese = false;
			String sPrtfEditPrice = oN2NSession.getSetting("AppFeaturePrtfEditPrice");
			ResultSet rs = null, rsStkInfo = null;
			DecimalFormat dfPrice = new DecimalFormat("#,###,###,##0.0000");
			DecimalFormat dfPrice2DC = new DecimalFormat("#,###,###,##0.00");
			DecimalFormat dfQty = new DecimalFormat("#,###,###,##0");
			String sOrdNoList = "", sSubOrdNoList = "", sSideList = "", sResult = "", sErrOrdNo = "";
			String saOrdNoList[] = null, saSubOrdNoList[] = null, saSideList[] = null;
			boolean bDelSuccess = false;
			//if (g_sLanguage.equals("CN")) {		
			if(isLangCN(g_sLanguage)) {
				bChinese = true;
			}
			
			sStkCode = request.getParameter("code");
			sCliCode = request.getParameter("clicode");
			sTemp = request.getParameter("price");
			sBHCliCode = request.getParameter("Acc");
			sOrdNoList = request.getParameter("ordNoList");
			sSubOrdNoList = request.getParameter("subOrdNoList");
			sSideList = request.getParameter("sideList");
			
			
			sStkCode = sStkCode != null ? sStkCode : "";
			sCliCode = sCliCode != null ? sCliCode : "";
			sTemp = sTemp != null ? sTemp : "0";
			sBHCliCode = sBHCliCode != null ? sBHCliCode : "";
			sOrdNoList = sOrdNoList != null ? sOrdNoList : "";
			sSubOrdNoList = sSubOrdNoList != null ? sSubOrdNoList : "";
			sSideList = sSideList != null ? sSideList : "";
			
			try {
				dPPrice = Double.parseDouble(sTemp);			
			} catch (NumberFormatException nfe) {
				dPPrice = 0;
			}
			
			sTemp = request.getParameter("qty");		
			sTemp = sTemp != null ? sTemp : "0";
			try {
				nTotQty = Integer.parseInt(sTemp);
			} catch (NumberFormatException nfe) {
				nTotQty = 0;
			}
			
			if (sCliCode.length() == 0) {
				sCliCode = g_sCliCode;
			}		
			
			if (sBHCliCode.length() > 0) {
				saWork = sBHCliCode.split("\\" + N2NConst.TRDACC_COL_SEP);
				sBHCliCode = saWork[0];
				if (saWork.length >= 2) {
					sBHBranch = saWork[1];
				}
			}
			
			N2NPrtfBean bean = new N2NPrtfBean();
			/*if (sOrdNoList.length() > 0) {
				saOrdNoList = sOrdNoList.split("\\" + N2NConst.FEED_COL_SEP);
			}
			
			if (sSubOrdNoList.length() > 0) {
				saSubOrdNoList = sSubOrdNoList.split("\\" + N2NConst.FEED_COL_SEP);
			}
			
			if (sSideList.length() > 0) {
				saSideList = sSideList.split("\\" + N2NConst.FEED_COL_SEP);
			}*/
			N2NPrtfCalc prtf = new N2NPrtfCalc();
			prtf.init(oN2NSession);
			
			/*if (sOrdNoList.length() > 0 && sSubOrdNoList.length() > 0 && saOrdNoList.length > 0 && saSubOrdNoList.length > 0) {
				for(int i = 0; i < saOrdNoList.length; i ++) {
					bean.setOrdno(saOrdNoList[i]);
					bean.setSubordno(saSubOrdNoList[i]);
					bean.setSide(saSideList[i]);
					sResult = prtf.amendStkMovHolding(bean);
					if(sResult == null) {
						if(sErrOrdNo.length() == 0)
							sErrOrdNo = bean.getOrdno();
						else
							sErrOrdNo = sErrOrdNo + ", " + bean.getOrdno();
					}
					else
						bDelSuccess = true;
				}
			}*/
			//out.println(bean.getOrdno());
			//out.println(bean.getSubordno());
			//out.println(bean.getSide());
			bean.reset();
			
			bean.setClicode(sCliCode);
			bean.setStkcode(sStkCode);
			if (sBHCliCode.length() > 0) {
				bean.setBhcode(g_sDefBHCode);
				bean.setBhclicode(sBHCliCode);
				bean.setBhbranch(sBHBranch);
			} else {
				bean.setBhcode("");
				bean.setBhclicode("");
				bean.setBhbranch("");			
			}
			bean.setOrdno(null);
			bean.setDocseqno(null);
			bean.setDocsrc(null);
			
			rs = prtf.getPrtfHolding(bean);	
/*			if (rs == null || !rs.next())  {
				N2NMFStkInfo stkinfo = new N2NMFStkInfo();
				N2NMFStkInfoBean stkbean = new N2NMFStkInfoBean();
							
				stkinfo.init(oN2NSession);			
				stkbean.setStkCode(sStkCode);
				rsStkInfo = stkinfo.getStkInfo(stkbean);
				
				if (rsStkInfo != null && rsStkInfo.next()) {
					sStkShtName = rsStkInfo.getString("StkShtName");
					sStkName = rsStkInfo.getString("StkLngName");
				}
				rsStkInfo.close();
				stkinfo.closeResultset();
				stkinfo.dbDisconnect();
			} else {				
				sStkShtName = rs.getString("StkShtName");
				sStkName = rs.getString("StkLngName");				
			}
*/			
%>
<table border=0 cellpadding=0 cellspacing=0 width=700>
	<tr><td class=clsSectionHeader width='94%'>&nbsp;<label id='lblStockInfo'></label></td>
		<td width='6%'>
			<img border=0 src=<%=g_sImgPath%>/butPrint.gif width=18 height=18 title='<%= isLangCN(g_sLanguage) ? "&#25171;&#21360;" : "Print" %>' style='cursor:pointer' onclick='window.print();'>
			<img id=imgHelp border=0 width=20 height=19 src=<%=g_sImgPath%>/lightbulboff.jpg onmouseover="this.src='<%=g_sImgPath%>/lightbulbon.jpg'" onmouseout="this.src='<%=g_sImgPath%>/lightbulboff.jpg'" title="<%= isLangCN(g_sLanguage) ? "&#25237;&#36164;&#32452;&#21512;&#65306;&#26174;&#31034;&#24744;&#30446;&#21069;&#25152;&#25317;&#26377;&#32929;&#39033;&#21450;&#26377;&#20851;&#30340;&#35814;&#24773;" : "Portfolio Details: Display your holdings information on a selected stock" %>">
		</td></tr></table>
<table border=0 cellpadding=0 cellspacing=0 width=360 height=20>
	<tr><td>&nbsp;<%= isLangCN(g_sLanguage) ? "&#24179;&#22343;&#20080;&#20837;&#20215;&#26684;" : "Average Buy Price" %>: <label id='lblCurr'><%=sCurr%></label>&nbsp;<%=dfPrice.format(dPPrice)%></td>
		<td><%= isLangCN(g_sLanguage) ? "&#21097;&#39296;&#25968;&#37327;&#24635;&#32467;" : "Total Remaining Quantity" %>: <%=dfQty.format(nTotQty)%></td></tr>
</table>
<!--table border=0 cellpadding=0 cellspacing=0 width=700 height=20>
	<tr>
		<td width=180>&nbsp;Free Balance: <label id='lblFreeBal'></label></td>
		<td>Outstanding Sales Quantity: <label id='lblOSSale'></label></td>
		<td>Outstanding Purchase Quantity: <label id='lblOSPurchase'></label></td>
	</tr>
</table>
<form id=frmPrtf name=frmPrtf action='prtfDtl.jsp?code=<%=sStkCode%>&clicode=<%=sCliCode%>&price=<%=dPPrice%>&qty=<%=nTotQty%>' method='post'onsubmit="return Delete_OnClick();"-->
<form id=frmPrtf name=frmPrtf action='prtfDtl.jsp?code=<%=sStkCode%>&clicode=<%=sCliCode%>&price=<%=dPPrice%>&qty=<%=nTotQty%>'>
<!--form id=frmPrtf name=frmPrtf action='prtfDtl.jsp?code=<%=sStkCode%>&clicode=<%=sCliCode%>&price=<%=dPPrice%>&qty=<%=nTotQty%>&Acc=<%=sBHCliCode +N2NConst.TRDACC_COL_SEP+ sBHBranch%>' method='post'onsubmit="return Delete_OnClick();"-->
<table width=700>
	<div align=right style='FONT-FAMILY:tahoma,Verdana;FONT-SIZE:8pt;'>
<%
			if (sPrtfEditPrice.equalsIgnoreCase("Y")) {
%>
				<input type=button value='   Edit   ' onClick='Edit_OnClick()'></input>
				<input type=button value=' Edit All ' onClick='EditAll_OnClick()'></input>
<%
			}
%>	
		
		<!--<input type=button value='   <%= isLangCN(g_sLanguage) ? "&#31649;&#29702;&#25237;&#36164;&#32452;&#21512;&#20132;&#26131;" : "Manage Portfolio Transaction" %>  ' onClick='subPortfolio_open()'></input>-->
		<input type=button value='   <%= isLangCN(g_sLanguage) ? "&#20851;&#38381;" : "Close" %>  ' onClick='self.close()'></input>
	</div>
</table>
<!--table border=0 cellpadding=0 cellspacing=0 width=900-->
<table border=0 cellpadding=0 cellspacing=0 width=700>
	<tr><td>
		<!--table cellpadding=2 cellspacing=0 width=900-->
<table border=0 cellpadding=0 cellspacing=0 width=700>
			<tr class=trTableHeader>
				
				<td class=tdHdrFirstCol width='19%'>
<% //Term=1000391
					if (bChinese) {
						//out.print("&#24179;&#22343;&#20080;&#20215;");
						out.print("&#23450;&#21333;&#21495;&#30721;");
					} else{
						out.print("Order No /<br>Remark");
					}
%>				</td>
				<td class=tdHdrMidCol width='11%'>
<% //Term=1000392
					if (bChinese) {
						//out.print("&#23450;&#21333;&#26102;&#38388;");
						out.print("&#23450;&#21333;&#26085;&#26399;");
					} else {
						out.print("Order Date");
					}
%>				</td>
				<td class=tdHdrMidCol width='12%'>
<% //Term=1000327
					if (bChinese) {
						//out.print("&#25143;&#21475;");
						out.print("&#25143;&#21475;&#21495;&#30721;");
					} else {
						out.print("Account No");
					}
%>				</td>
			  	<td class=tdHdrMidCol width='11%'>
<%					if (bChinese) {
						//out.print("&#20080; / &#21334;&#20215;");
						out.print("&#20080; / &#21334;&#20215;");
					} else {
						out.print("Buy/Sell<br> Price");
					}
%>				</td>
				<td class=tdHdrMidCol width='11%'>
<% //Term=1000393
					if (bChinese) {
						//out.print("&#20080; / &#21334;&#20215;");
						out.print("&#20215;&#26684;");
					} else {
						out.print("Buy<br>Quantity");
					}
%>				</td>
				
				<td class=tdHdrMidCol width='11%'>
<% //Term=1000370
					if (bChinese) {
						//out.print("&#21097;&#39296;&#37327;");
						out.print("&#21097;&#39296;&#25968;&#37327;");
					} else {
						out.print("Remaining Quantity");
					}
%>				</td>
			  	<td class=tdHdrMidCol width='11%'>
<% //Term=1000205
					if (bChinese) {
						out.print("&#20323;&#37329;");
					} else {
						out.print("Brokerage");
					}
%>				</td>
				<td class=tdHdrLastCol width='14%'>
<% //Term=1000395
					if (bChinese) {
						//out.print("&#21512;&#21516;&#25968;&#39069;");
						out.print("&#21097;&#39296;&#21512;&#32422;&#35268;&#23450;&#20215;&#20540;");
					} else {
						//out.print("Contract Amount");
						out.print("Contract Amount");
					}
%>				</td>
				
			</tr></table>
		<div id=divPrtfDtlList style="overflow:auto">
		<!--table id=tblStkOrderList name=tblStkOrderList class=tblTableData border=0 cellpadding=2 cellspacing=0 width=900-->
		<table id=tblStkOrderList name=tblStkOrderList class=tblTableData border=0 cellpadding=2 cellspacing=0 width=700>
<%
		int iNumRow = 0;
		int iMonPrtf = 0;
        double dCommission = 0;
        double dTotTrad = 0;
        SimpleDateFormat dtDateFormat = new SimpleDateFormat("dd/MM/yyyy");        
        SimpleDateFormat dtTimeFormat = new SimpleDateFormat("hh:mm:ss a");        
        
        //out.println("TimeFormat:: " + dtTimeFormat.format(new java.util.Date()));
        boolean bRecordFound = false;
		while (rs.next()) {
			bRecordFound = true;
			sDocNo = rs.getString("DocNo");
			sSubOrdNo = rs.getString("SubOrdNo");
			sStkShtName = rs.getString("StkShtName");
			sStkName = rs.getString("StkLngName");		
			//sSide = rs.getString("Side");
			nQty = rs.getInt("Qty");
			nQtyLeft = rs.getInt("QtyLeft");
			dPrice = rs.getDouble("Price");    
			sOrdSrc = rs.getString("OrdSrc");
			//if (nQtyLeft <= 0) {
			if (nQtyLeft < 0) {
			    dCommission = 0;
			} else {
			    dCommission = rs.getDouble("TrxFee");
			}
			//dTotTrad = (nQty * dPrice) + dCommission;
			//if(sSide.equals("1"))
				dTotTrad = (nQtyLeft * dPrice) + dCommission;
			//else if(sSide.equals("2"))
			//	dTotTrad = (nQtyLeft * dPrice) - dCommission;
			iNumRow = iNumRow + 1;
			if ((iNumRow%2) == 0) {
			    out.print("<tr class=trRowEven id=trGenEvent>");
			} else {
			    out.print("<tr class=trRowOdd id=trGenEvent>");
			}
            
            /*out.print("<td class=tdFirstCol width='5%' align=center title=''><input type='checkbox' id='chkDtl" + iNumRow + "' name='chkDtl" + iNumRow + "'");
            if(sOrdSrc.equals("C"))
            	iMonPrtf = iMonPrtf + 1;
            else
            	out.print(" disabled");
            out.print("></td>");*/
            
            //out.println("rs.getDate(\"OrdDate\") :: " + dtTimeFormat.format(rs.getTime("OrdDate")));
			out.print("<td class=tdFirstCol width='19%' align=right title='"+ rs.getString("ContractNo") + "'><b>"+ rs.getString("OrdSrc") +"</b> "+ rs.getString("OrdNo") +"-" + rs.getString("DocSeqNo") + "&nbsp;<br>"+ rs.getString("Remark") + "&nbsp;");
			//out.print("<td class=tdMidCol width='13%' align=right title='"+ rs.getString("ContractNo") +" SubOrdNo: " + rs.getString("SubOrdNo") + "'><b>"+ rs.getString("OrdSrc") +"</b> "+ rs.getString("OrdNo") +"-" + rs.getString("DocSeqNo") + "&nbsp;<br>"+ rs.getString("Remark") + "&nbsp;");
			//out.print("<td class=tdFirstCol width='15%' align=right title='"+ rs.getString("ContractNo") +" SubOrdNo: " + rs.getString("SubOrdNo") + "'><b>"+ rs.getString("OrdSrc") +"</b> "+ rs.getString("OrdNo") +"-" + rs.getString("DocSeqNo") + "&nbsp;");
			if (rs.getDate("OrdDate") != null) {
				out.print("</td><td class=tdMidCol width='11%' align=right>"+ dtDateFormat.format(rs.getDate("OrdDate")) + "<br>" + dtTimeFormat.format(rs.getTime("OrdDate")));
			} else {
				out.print("</td><td class=tdMidCol width='11%' align=right>-");
			}
			out.print("</td><td class=tdMidCol width='12%' align=right>"+ rs.getString("BHCliCode") +"&nbsp;");
			/*out.print("</td><td class=tdMidCol width='5%' align=center>");
			if (sSide.equals(N2NConst.ORD_SIDE_BUY) && !sOrdSrc.equals("S")) {
				out.print("<font color=#037303>");
				if(isLangCN(g_sLanguage)) {
					out.print("&#20080;&#20837;");
				} else {
					out.print("Buy");
				}
				out.print("</font>");
			} else {
				out.print("<font color=#FF0000>");
				if(isLangCN(g_sLanguage)) {
					out.print("&#21334;&#20986;");
				} else {
					out.print("Sell");
				}
				out.print("</font>");
			}*/
			out.print("</td><td class=tdMidCol");
			if (nQtyLeft < 0) {
				out.print("Loss width='11%' align=right>(");
			} else {
				out.print(" width='1%' align=right>");
			}
			
			out.print(dfPrice.format(dPrice));
			if (nQtyLeft < 0) {
				out.print(")");
			}
			out.print("&nbsp;");
			
			out.print("</td><td class=tdMidCol width='11%' align=right>"+ dfQty.format(nQty) +"&nbsp;");
			out.print("</td><td class=tdMidCol");
			//out.print("</td>");
			if (nQtyLeft < 0) {
				out.print("Loss");
			}
			out.print(" width='11%' align=right>"+ dfQty.format(nQtyLeft) +"&nbsp;");
			out.print("</td><td class=tdMidCol width='11%' align=right>"+ dfPrice2DC.format(dCommission) +"&nbsp;");
			out.print("<input type='hidden' id='txtSubOrdNo" + iNumRow + "' value='" + sSubOrdNo + "'>");
			out.print("<input type='hidden' id='txtDocNo" + iNumRow + "' value='" + sDocNo + "'>");
			out.print("<input type='hidden' id='txtSide" + iNumRow + "' value='" + sSide + "'>");
			out.print("</td><td class=tdLastCol width='14%' align=right>"+ dfPrice2DC.format(dTotTrad) +"&nbsp;</td></tr>");
			//out.print("</td><td class=tdLastCol width='9%' align=right>"+ dfPrice2DC.format(dTotTrad) +"&nbsp;</td>");
			if (rs.getString("OrdSrc") != null && rs.getString("OrdSrc").toUpperCase().equals("C")){
				bCSROrder = true;
			}
			//out.print("<td class=tdMidCol width='7%' align=right>" + rs.getInt("OSSalesQty") + "</td>");
			//out.print("<td class=tdMidCol width='7%' align=right>" + rs.getInt("OSPurcQty") + "</td>");
			//out.print("<td class=tdMidCol width='8%' align=right>" + rs.getInt("freebal") + "</td>");
			sMkt = rs.getString("ExchCode");
			sCurr = rs.getString("Currency");
			nOSSale = rs.getInt("OSSalesQty");
			nOSPurchase = rs.getInt("OSPurcQty");
			nFreeBal = rs.getInt("freebal");
		}//end while
		rs.close();
		rs = null;	
		prtf.closeResultset();
		prtf.dbDisconnect();    
		
		if (!bRecordFound) {
			N2NMFStkInfo stkinfo = new N2NMFStkInfo();
			N2NMFStkInfoBean stkbean = new N2NMFStkInfoBean();
						
			stkinfo.init(oN2NSession);			
			stkbean.setStkCode(sStkCode);
			rsStkInfo = stkinfo.getStkInfo(stkbean);
			
			if (rsStkInfo != null && rsStkInfo.next()) {
				sStkShtName = rsStkInfo.getString("StkShtName");
				sStkName = rsStkInfo.getString("StkLngName");
			}
			rsStkInfo.close();
			stkinfo.closeResultset();
			stkinfo.dbDisconnect();
			//out.println("<tr><td colspan='7' class='tdFirstCol' align='center'>No record available</td></tr>");
			out.println("<tr><td colspan='7' class='tdFirstCol' align='center'>");
			if(isLangCN(g_sLanguage))
				out.println("&#27809;&#26377;&#36164;&#26009;&#35760;&#24405;</td></tr>");
			else
				out.println("No record available</td></tr>");
		}            
%>		
		</table></div>
		<!--span id=spanNoRec class='tdFirstCol' style='text-align:center;width:700;padding:2px;display:none'>
			<%= isLangCN(g_sLanguage) ? "&#27809;&#26377;&#36164;&#26009;&#35760;&#24405;" : "No record available" %>
		</span-->
	</td></tr>
	<tr><td>
		<!--table border=0 cellpadding=0 cellspacing=0 width=900-->
		<table border=0 cellpadding=0 cellspacing=0 width=700>
			<tr><td class=tdFooterLine>&nbsp;</td></tr></table>
	</td></tr>
	<!----<tr align=right height=20><td>
		<%= isLangCN(g_sLanguage) ? "&#24179;&#22343;&#20080;&#20837;&#20215;&#26684;" : "Average Buy Price" %>: <%=sCurr%>&nbsp;<%=dfPrice.format(dPPrice)%>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		<%= isLangCN(g_sLanguage) ? "&#21097;&#39296;&#25968;&#37327;&#24635;&#32467;" : "Total Remaining Quantity" %>: <%=dfQty.format(nTotQty)%>
		&nbsp;
	</td></tr>-->
  	<!--tr height='10'><td></td></tr>
  	<tr align='right'>
  		<td>
			<input type=button value='   <%= isLangCN(g_sLanguage) ? "&#36824;&#21407;" : "Reset" %>  ' id=btnReset name=btnReset onclick='Reset_OnClick()' disabled>
  			<input type=submit value='   <%= isLangCN(g_sLanguage) ? "&#21024;&#38500" : "Delete" %>  ' id=btnDtl name=btnDtl disabled>
  			<input id='ordNoList' name='ordNoList' value='' type='hidden'>
  			<input id='subOrdNoList' name='subOrdNoList' value='' type='hidden'>
  			<input id='sideList' name='sideList' value='' type='hidden'>
  			<span id='spanButton'></span>
  		</td>
  	</tr>
  	<tr><td>* Portfolio entry from trading cannot be delete</td></tr-->
	</table>
	<!--<table border=0 cellpadding=0 cellspacing=0 width=700>
	  	<tr height='20'><td></td></tr>
		<tr><td colspan=3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<%= isLangCN(g_sLanguage) ? "&#25688;&#35201;&#35828;&#26126;" : "Legend" %></td></tr>
	  	<tr height='15'><td></td></tr>
		<tr><td width=30 align=center>&nbsp;I</td><td width=15>:</td><td><%= isLangCN(g_sLanguage) ? "&#20114;&#32852;&#32593;&#32476;&#20132;&#26131;&#30340;&#25237;&#36164;&#32452;&#21512;" : "Internet Trading Order" %></td></tr>
		<tr><td align=center>&nbsp;C</td><td>:</td><td><%= isLangCN(g_sLanguage) ? "&#33258;&#34892;&#36755;&#20837;&#30340;&#25237;&#36164;&#32452;&#21512;" : "Manual Portfolio Entry" %></td></tr>
		<tr><td align=center>&nbsp;S</td><td>:</td><td><%= isLangCN(g_sLanguage) ? "&#21334;&#31354;&#30340;&#20132;&#26131;" : "Short Sell" %></td></tr>
	</table>-->
<div id=divPrnFooter name=divPrnFooter>
	<form id=frmPrnFooter name=frmPrnFooter>
		<input type=hidden id=txtLoginID name=txtLoginID value='<%=g_sLoginId%>' />
		<input type=hidden id=lstTrdAcc name=lstTrdAcc value='' />
		<label id=lblDisplay name=lblDisplay></label>
	</form>
</div>
	
<script language='javascript'>
	var g_iRowSelected = -1;
	function body_Onload() {
		if (document.getElementById("tblStkOrderList").rows.length > 8) {
			document.getElementById("divPrtfDtlList").style.height = 256;
		}
		document.getElementById("lblStockInfo").innerHTML = "<%=sStkCode + " " + sStkShtName +" - "+ sStkName %>";
		//document.getElementById("lblFreeBal").innerText = "<%=nFreeBal%>";
		//document.getElementById("lblOSSale").innerText = "<%=nOSSale%>";
		//document.getElementById("lblOSPurchase").innerText = "<%=nOSPurchase%>";
		document.getElementById("lblMkt").innerHTML = "<%=sMkt%>";
		document.getElementById("lblCurr").innerHTML = "<%=sCurr%>";
		
		/*if(<%=iMonPrtf%> > 0) {
			document.getElementById("btnReset").disabled = false;
			document.getElementById("btnDtl").disabled = false;
		}
		
		if(<%=iNumRow%> == 0) {
			document.getElementById("lblAction").style.display = 'none';
			document.getElementById("selAction").style.display = 'none';
			document.getElementById("btnReset").style.display = 'none';
			document.getElementById("btnDtl").style.display = 'none';
		}*/
		
		if ('<%=sErrOrdNo%>' != '')
			alert('Following Order [<%=sErrOrdNo%>] encounter problem when deleting.');
		
		if(<%=bDelSuccess%>){
			alert('Your manual portfolio entry(s) has(have) been deleted successfully.');
			opener.location.reload();
			if(<%=iNumRow%> == 0)
				self.close();
		}
	}
	
	function Edit_OnClick()
	{
		var sURL;
		var sTmp;
		var sOrdSrc;
		var sOrdNo;
		var sSeqNo;
		var aSeqNo;
		var sSubOrdNo;
		var sDocNo;
		
		if (g_iRowSelected < 0) {
			alert("Please select a transaction to edit");
			return;
		}			
		
		sTmp = document.getElementById("tblStkOrderList").rows[g_iRowSelected].cells[0].innerText;
		sOrdSrc = sTmp.substr(0, 1)
		if (sOrdSrc == "C")
		{
			sSubOrdNo = document.getElementById("txtSubOrdNo" + (g_iRowSelected+1)).value;
			sDocNo = document.getElementById("txtDocNo" + (g_iRowSelected+1)).value;
			
			sOrdNo = sTmp.substr(2, 16)
			sSeqNo = sTmp
			//aSeqNo = sSeqNo.split(" ");
			aSeqNo = sSeqNo.split("-");
			sSeqNo = aSeqNo[1];
			sURL = "/gc/prtfDtlEdit.jsp?Code=<%=sStkCode%>&CliCode=<%=sCliCode%>&Acc=<%=sBHCliCode +N2NConst.TRDACC_COL_SEP+ sBHBranch%>&Price=<%=dPPrice%>&Qty=<%=nTotQty%>&OrdNo=" + sOrdNo + "&SeqNo=" + sSeqNo + "&SubOrdNo=" + sSubOrdNo + "&DocNo=" + sDocNo;
			window.location.href = sURL;
		}
		else
		{
			alert("This is not a CSR order. You cannot edit it.");
		}
	}
	
	function EditAll_OnClick()
	{
		if (<%=bCSROrder%>) {
			var sURL;
			var sDocNo = document.getElementById("txtDocNo1").value;
			sURL = "/gc/prtfDtlEdit.jsp?Code=<%=sStkCode%>&CliCode=<%=sCliCode%>&Acc=<%=sBHCliCode +N2NConst.TRDACC_COL_SEP+ sBHBranch%>&Price=<%=dPPrice%>&Qty=<%=nTotQty%>&DocNo=" + sDocNo;
			window.location.href = sURL;
		} else {
			alert("You have no CSR orders for this stock to edit.");
		}
	}	
	
	function PrtfLine_onDblClick(lrow) 
	{
		var sURL;
		g_iRowSelected = lrow;
		Edit_OnClick();
	}
	
	function PrtfLine_onClick(lrow) 
	{
		g_iRowSelected = lrow;
	}	

	function SelectRow(p_lRowIndex, p_Row)
	{
		//	var sStkCode;
		var FldSepPos;
		var oMenu;
		
		//alert("SelectRow: " + g_iRowSelected + " : " + p_lRowIndex);
		// when there is a selected row and another row is selected
		// reset the row's color to it's original color depending on
		// whether it's an even or odd row
		if (g_iRowSelected != -1) {
			if (g_iRowSelected%2 == 0) {
				document.getElementById("tblStkOrderList").rows[g_iRowSelected].className = "trRowOdd";
			} else {
				document.getElementById("tblStkOrderList").rows[g_iRowSelected].className = "trRowEven";
			}
		}
	
		if (g_iRowSelected != p_lRowIndex) {
			// the selected row is different from the currently selected row
			p_Row.className = "trRowSelected";
			//alert("aaa");
			g_iRowSelected = p_lRowIndex;
		} else {
			// the selected row is the same as the last selected row
			g_iRowSelected = -1
		}
	}	
	
	function Reset_OnClick()
	{
		for(var i=1; i<=<%=iNumRow%>; i++) {
			document.getElementById("chkDtl" + i).checked = false;
		}
	}
	
	function Delete_OnClick()
	{
		var sOrdNo = "";
		var sSubOrdNo = "";
		var sSide = "";
		var bFound = false;
		
		for(var i=1; i<=<%=iNumRow%>; i++) {
			if(document.getElementById("chkDtl" + i).checked) {
				bFound = true;
				sTmp = document.getElementById("tblStkOrderList").rows[parseInt(i-1)].cells[1].innerText;
				sOrdNo = sOrdNo + (sTmp.substr(2, 16)).split("-")[0] + "|";
				sSubOrdNo = sSubOrdNo + document.getElementById("txtSubOrdNo" + i).value + "|";
				sSide = sSide + document.getElementById("txtSide" + i).value + "|";
			}				
		}
		
		if(!bFound) {
			alert("<%= isLangCN(g_sLanguage) ? "\\u8BF7\\u9009\\u62E9\\u81F3\\u5C11\\u4E00\\u4E2A\\u4EA4\\u6613\\u4E88\\u4EE5\\u5220\\u9664\\u3002" : "Please select at least one transaction to be deleted."%>");
			document.getElementById("chkDtl1").focus();
		}
		else {
			var bRespond;
			bRespond = confirm("Are you sure you want to delete selected manual portfolio entry(s)?");
			
			if(bRespond) {
				document.getElementById("ordNoList").value = sOrdNo;
				document.getElementById("subOrdNoList").value = sSubOrdNo;
				document.getElementById("sideList").value = sSide;
				return true;
			}
		}
		return false;
	}

	function window.confirm(str)
	{
	    execScript('n = msgbox("'+str+'","4132")', "vbscript");
	    return(n == 6);
	}

	function rowClass(iRowNum,iCount)
	{
		if (iCount%2 == 0)
			document.getElementById("tblStkOrderList").rows[iRowNum].className = "trRowEven";
		else
			document.getElementById("tblStkOrderList").rows[iRowNum].className = "trRowOdd";
	}
	
	function selAction_OnChange()
	{
		var iRow = 0;
		var iMonPrtf = 0;
		
		if(document.getElementById("selAction").value == '0') {
			iRow = <%=iNumRow%>;
			iMonPrtf = <%=iMonPrtf%>;
		}
		
		for(var i=0; i< document.getElementById("tblStkOrderList").rows.length; i++) {
			document.getElementById("chkDtl" + parseInt(i+1)).checked = false;
			
			if(document.getElementById("selAction").value == '0') {
				for(var j = 0; j < document.getElementById("tblStkOrderList").rows[i].cells.length; j++)
					document.getElementById("tblStkOrderList").rows[i].cells(j).style.display = '';
				rowClass(i,parseInt(i+1));
			}
			else if(document.getElementById("selAction").value == '1') {
				if(document.getElementById("txtSide" + parseInt(i+1)).value == '1') {
					iRow = iRow + 1;
					if(document.getElementById("chkDtl" + parseInt(i+1)).disabled == false)
						iMonPrtf = iMonPrtf + 1;
					rowClass(i,iRow);
				}
				
				for(var j = 0; j < document.getElementById("tblStkOrderList").rows[i].cells.length; j++) {
					if(document.getElementById("txtSide" + parseInt(i+1)).value == '1')
						document.getElementById("tblStkOrderList").rows[i].cells(j).style.display = '';
					else
						document.getElementById("tblStkOrderList").rows[i].cells(j).style.display = 'none';
				}
			}
			else if(document.getElementById("selAction").value == '2') {
				if(document.getElementById("txtSide" + parseInt(i+1)).value == '2') {
					iRow = iRow + 1;
					if(document.getElementById("chkDtl" + parseInt(i+1)).disabled == false)
						iMonPrtf = iMonPrtf + 1;
					rowClass(i,iRow);
				}
				
				for(var j = 0; j < document.getElementById("tblStkOrderList").rows[i].cells.length; j++) {
					if(document.getElementById("txtSide" + parseInt(i+1)).value == '2')
						document.getElementById("tblStkOrderList").rows[i].cells(j).style.display = '';
					else
						document.getElementById("tblStkOrderList").rows[i].cells(j).style.display = 'none';
				}
			}
		}
		
		if(iMonPrtf > 0) {
			document.getElementById("btnReset").disabled = false;
			document.getElementById("btnDtl").disabled = false;
		}
		else {
			document.getElementById("btnReset").disabled = true;
			document.getElementById("btnDtl").disabled = true;
		}
		
		if(iRow == 0) {
			document.getElementById("spanNoRec").style.display = '';
			document.getElementById("btnReset").style.display = 'none';
			document.getElementById("btnDtl").style.display = 'none';
		}
		else {
			document.getElementById("spanNoRec").style.display = 'none';
			document.getElementById("btnReset").style.display = '';
			document.getElementById("btnDtl").style.display = '';
		}
	}
	
	function subPortfolio_open()
	{
		var sURL;
		
		sURL = "prtfDelPrtf.jsp?code=<%=sStkCode%>&name=<%=sStkShtName%>&cliCode=<%=sCliCode%>";
		window.location.href = sURL;
	}
</script>

<%
	if (sPrtfEditPrice.equalsIgnoreCase("Y")) {
%>
<script language=JavaScript for=trGenEvent event=ondblclick>
	PrtfLine_onDblClick(this.rowIndex);	
</script>
<script language=JavaScript for=trGenEvent event=onclick>
	//PrtfLine_onClick(this.rowIndex);
	SelectRow(this.rowIndex, this);
</script>
<%
	}
%>
<%
		}//end if isuserlogin	
	} catch (Exception e) {
		e.printStackTrace();
	}
%>		
</body>
</html>