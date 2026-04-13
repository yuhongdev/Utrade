<%@ page import = "java.sql.ResultSet,com.n2n.util.N2NConst,com.n2n.util.N2NSecurity,java.util.Calendar,java.util.Date,com.n2n.DB.N2NDateFunc,java.text.SimpleDateFormat,java.text.DecimalFormat,com.n2n.DB.N2NMFCliInfo,com.n2n.bean.N2NMFCliInfoBean,com.n2n.DB.N2NSettlement"%>
<%@ include file='/common.jsp'%>
<%@include file="/util/sessionCheck.jsp"%>
<script language=JavaScript src="<%=g_sJSPath%>/N2NFunc.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/N2NPrnFunc.js"></script>
<HTML>
<HEAD>
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">
<TITLE>Previous Payments</TITLE>
</HEAD>
<!--BODY onload='Body_Onload()' style='background:#FFFFFF'-->
<BODY onload='Body_Onload()' class='clsBody'>
<%
	SimpleDateFormat dtFormat = new SimpleDateFormat("dd/MM/yyyy");
	DecimalFormat dfValue = new DecimalFormat("#,###,###,##0.00");
	DecimalFormat dfPrice = new DecimalFormat("#,###,###,##0.0000");

	String sContractNo = "";
	boolean bRecord = false;

	//if (oN2NSession.getIsUserLogin()) {
	if (validSession) {
		String sBHCliCode	 = "";
		int intRow = 0;
		ResultSet oRst = null;
		double dTotal = 0;
		double dInitial = 0;
		String [] aWork = null;
		String sBHBranch = "";
		int nQty = 0;

		sContractNo = request.getParameter("ContractNo").trim();
		sContractNo = sContractNo != null ? sContractNo : "";
		sBHCliCode = request.getParameter("Acc");
		sBHCliCode = sBHCliCode != null ? sBHCliCode : "";

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
	<TABLE border=0 cellpadding=0 cellspacing=0 width=400>
		<TR>
			<TD class=clsSectionHeader width='97%'>&nbsp;Previous Payments</TD>
			<TD width='3%'><img id=imgHelp border=0 width=20 height=19 src=<%=g_sImgPath%>/lightbulboff.jpg onmouseover="this.src='<%=g_sImgPath%>/lightbulbon.jpg'" onmouseout="this.src='<%=g_sImgPath%>/lightbulboff.jpg'" title="Summary: Show all payments made for a or a combination of contracts."></TD>
		</TR>
	</TABLE>
	<BR/>
<%
	out.println("<TABLE id=tblContract border=1 name=tblContract width=400>");
	oRst = settle.getReceiptContractInfo("'"+sContractNo+"'",null,null,sBHCliCode,null,g_sCliCode,g_sDefBHCode,sBHBranch);
	if (oRst != null && oRst.next()) {
		out.println("<TR><TD class=clsRepHeader>Ref No</TD><TD class=clsRepRowOdd>&nbsp;" + oRst.getString("DocNo") + "</TD>");
		if (oRst.getString("StkShtName") != null) {
			out.println("<TD class=clsRepHeader>Stock</TD><TD class=clsRepRowOdd>&nbsp;" + oRst.getString("StkShtName") + "</TR>");
		} else {
			out.println("<TD class=clsRepHeader>Stock</TD><TD class=clsRepRowOdd>&nbsp;</TR>");
		}
		if (oRst.getDate("DueDate") != null) {
			out.println("<TR><TD class=clsRepHeader>Trx Date</TD><TD class=clsRepRowOdd>&nbsp;" + dtFormat.format(oRst.getDate("DocDate")) + "</TD><TD class=clsRepHeader>Due Date</TD><TD class=clsRepRowOdd>&nbsp;" + dtFormat.format(oRst.getDate("DueDate")) + "</TR>");
		} else {
			out.println("<TR><TD class=clsRepHeader>Trx Date</TD><TD class=clsRepRowOdd>&nbsp;" + dtFormat.format(oRst.getDate("DocDate")) + "</TD><TD class=clsRepHeader>Due Date</TD><TD class=clsRepRowOdd>&nbsp;</TR>");
		}
		if (oRst.getDouble("Price") != 0) {
			out.println("<TR><TD class=clsRepHeader>Unit Price</TD><TD class=clsRepRowOdd>&nbsp;" + dfPrice.format(oRst.getDouble("Price")) + "</TD>");
		} else {
			out.println("<TR><TD class=clsRepHeader>Unit Price</TD><TD class=clsRepRowOdd>&nbsp;</TD>");
		}
		if (oRst.getInt("Qty") != 0) { 
			out.println("<TD class=clsRepHeader>Quantity</TD><TD class=clsRepRowOdd>&nbsp;" + oRst.getInt("Qty") + "</TR>");
		} else {
			out.println("<TD class=clsRepHeader>Quantity</TD><TD class=clsRepRowOdd>&nbsp;</TR>");
		}
		out.println("<TR><TD class=clsRepHeader>Amount</TD><TD class=clsRepRowOdd>&nbsp;" + dfValue.format(oRst.getDouble("Total")) + "</TD><TD class=clsRepHeader>Interest</TD><TD class=clsRepRowOdd>&nbsp;" + dfValue.format(oRst.getDouble("Interest")) + "</TR>");
		nQty = 1;
	} else {
		out.println("Cannot locate contract information.");
		nQty = 0;
	}
	out.println("</TABLE>");
	oRst.close();
%>
<BR/>
<table border=0 cellpadding=0 cellspacing=0>	
	<tr><td>
		<table border=0 cellpadding=0 cellspacing=0 width=400>
			<tr class=clsRepHeader>
				<td width='30%' class=clsRepFirstCol style=' border-right-color: #FFFFFF'>Ref No</td>
				<td width='20%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Quantity</td>
				<td width='30%' class=clsRepMidCol style=' border-right-color: #FFFFFF'>Amount</td>
				<td width='20%' class=clsRepLastCol>Status</td>
			</tr>
		</table>
	</tr></td>
	<tr><td>
		<div id=divPayment style='overflow:auto'>
			<table name=tblPayment id=tblPayment border=0 cellpadding=0 cellspacing=0 width=400>
<%	
	intRow = 1;
	oRst = settle.getReceiptByContract(sContractNo,sBHCliCode,g_sDefBHCode,sBHBranch);
	System.out.print(oRst);
	if (oRst != null) {
		while (oRst.next()) {
			if (intRow % 2 == 0) {
				out.println("<tr width=100% class=clsRepRowEven>");
			} else {
				out.println("<tr width=100% class=clsRepRowOdd>");
			}
			out.println("<td width='30%' class=clsRepFirstCol>&nbsp;" + oRst.getString("RefNo") + "</td>");
			if (nQty > 0) {
				if (oRst.getInt("Qty") % oRst.getInt("LotSize") > 0) {
					out.println("<td width='20%' class=clsRepMidCol style='text-align: right'>" + oRst.getInt("NumLot") + "&nbsp;</td>");
				} else {
					out.println("<td width='20%' class=clsRepMidCol style='text-align: right'>" + oRst.getInt("QtyPaid") + "&nbsp;</td>");
				}
			} else {
				out.println("<td width='20%' class=clsRepMidCol style='text-align: right'>&nbsp;</td>");
			}
			out.println("<td width='30%' class=clsRepMidCol style='text-align: right'>" + dfValue.format(oRst.getDouble("Amt")) + "</td>");
			
			out.print("<td width='20%' ");
			if (oRst.getString("Status").equals("A")) {
				out.println("class=clsRepLastCol>&nbsp;Pending</td>");
			} else if (oRst.getString("Status").equals("B")) {
				out.println("class=clsRepLastCol>&nbsp;Paid</td>");
			} else {
				out.println("class=clsRepLastCol>&nbsp;Rejected</td>");
			}
			out.println("</tr>");
			intRow = intRow + 1;
			bRecord = true;
		}
	}
	if (!(bRecord)) {
		out.println("<font style='font-family:Arial;font-size:8pt;'>There is no record found</font>");
	}

	oRst.close();
	settle.closeResultset();
	settle.dbDisconnect();
%>
	</table>
	</tr></td></div>
	<tr><td>
		<table name=paymentfooter id=paymentfooter border=0 cellpadding=0 cellspacing=0 width=400>
			<tr class=clsRepHeader>
				<td></td>
				<td></td>
				<td></td>
				<td style='FONT-SIZE: 1mm'>&nbsp;</td>
				<td></td>
			</tr>
		</table>
	</tr></td>
</table>
<% 	}else{
		response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
	}%>
</BODY>
</HTML>
<SCRIPT language='JavaScript'>

function Body_Onload()
{
	var dTotal, rowCount;
	dTotal = 0;
//	rowCount = document.all.tblPayment.rows.length;
//	if (rowCount > 4) 
//	{
//		document.all.divPayment.style.height = 82;
//	}
}

function View_OnClick()
{
	var bChecked;
	var nRefNo;
	var iRowCount;
	
	bChecked = false;
	nRefNo = "";
	sURL = "/bin/stlPayment.asp?ID=<%=sContractNo%>|";
	iRowCount = document.all.tblPayment.rows.length;
	for (var icount = 0; icount < iRowCount; icount++)
	{
		if (document.all("chkSelectPayment" + icount).checked)
		{
			if (!bChecked)
			{
				nRefNo = document.all.tblPayment.rows(icount).cells(1).innerText
				bChecked = true;
			}
			else
			{
				alert("You can only view a payment at a time. Please select just one payment.");
				return;
			}
		}
	}
		
	if (bChecked)
	{
		sURL = sURL + "&RefNo=" + nRefNo;
		window.open(sURL, "Payment", "height=550,width=820,status=no,toolbar=no,menubar=no,location=no");
	}
	else
	{
		alert("Please select a payment to view.");
	}
}

function Add_OnClick()
{
	var sURL;
	sURL = "/bin/stlPayment.asp?ID=<%=sContractNo%>|";
	window.open(sURL, "Payment", "height=550,width=820,status=no,toolbar=no,menubar=no,location=no");
}
</SCRIPT>
