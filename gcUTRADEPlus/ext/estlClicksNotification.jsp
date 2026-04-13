<%@ page import = "java.sql.ResultSet,com.n2n.util.N2NConst,com.n2n.util.N2NSecurity,java.util.Calendar,java.util.Date,com.n2n.DB.N2NDateFunc,java.text.SimpleDateFormat,java.text.DecimalFormat,com.n2n.DB.N2NMFCliInfo,com.n2n.bean.N2NMFCliInfoBean,com.n2n.DB.N2NSettlement"%>
<%@ include file='/common.jsp'%>
<HTML>
<HEAD>
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">
<script language=JavaScript src="<%=g_sJSPath%>/N2NFunc.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/N2NPrnFunc.js"></script>
<%
	Date dtToday = new Date();
	SimpleDateFormat dtLongFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	SimpleDateFormat dtTimeFormat = new SimpleDateFormat("HHmmss");
	SimpleDateFormat dtDateFormat = new SimpleDateFormat("yyyyMMdd");	
	
	String sPayeeId 				= "";
	String sChannelId 				= "";
	String sBillAccNo 				= "";
	String sBillRefNo 				= "";
	String sBillRefNo2 				= "";
	String sAmount					= "";
	double dAmount 					= 0;
	String sPaymentRefNo 			= "";
	String sTransactionDate			= "";
	int iTransactionDate 			= 0;
	int iTransactionTime 			= 0;
	String sUserFullName 			= "";
	String sStatus 					= "";
	String sTransactionDateTime 	= "";
	String sTransactionTime 		= "";
	String sStatusDesc 				= "";
	String sRefNo					= "";
	String sTransType				= "";
	String sDate 					= "";
	String sTime					= "";
	String sBhCliCode				= "";
	String sBhBranch				= "";
	
	sPayeeId = request.getParameter("payeeId");
	sPayeeId = sPayeeId != null ? sPayeeId : "";
	
	sChannelId = request.getParameter("channelId");
	sChannelId = sChannelId != null ? sChannelId : "";
	
	sBillAccNo = request.getParameter("billAccountNo");
	sBillAccNo = sBillAccNo != null ? sBillAccNo : "";
	
	sBillRefNo = request.getParameter("billReferenceNo");
	sBillRefNo = sBillRefNo != null ? sBillRefNo : "";
	
	sBillRefNo2 = request.getParameter("billReferenceNo2");
	sBillRefNo2 = sBillRefNo2 != null ? sBillRefNo2 : "";
	
	sAmount = request.getParameter("amount");
	sAmount = sAmount != null ? sAmount : "";
	
	if (!(sAmount.equals(""))) {
		dAmount = Double.parseDouble(sAmount);
	}
	
	sPaymentRefNo = request.getParameter("paymentRefNo");
	sPaymentRefNo = sPaymentRefNo != null ? sPaymentRefNo : "";
	
	sUserFullName = request.getParameter("userFullName");
	sUserFullName = sUserFullName != null ? sUserFullName : "";
	
	sStatus = request.getParameter("status");
	sStatus = sStatus != null ? sStatus : "";
	
	sTransactionDate = request.getParameter("transactionDate");
	sTransactionDate = sTransactionDate != null ? sTransactionDate : "";
	
	sTransactionTime = request.getParameter("transactionTime");
	sTransactionTime = sTransactionTime != null ? sTransactionTime : "";
	
	if (sStatus.equals("S")) {
		sStatusDesc = "Successful";
	} else {
		sStatusDesc = "Failed";
	}
	
	sTransType = sBillRefNo.substring(0,1);
	
	int totalLength = sBillRefNo.length();
	sRefNo = sBillRefNo.substring(1,totalLength);
	
	Date dtDate = dtDateFormat.parse(sTransactionDate); 
	Date dtTime = dtTimeFormat.parse(sTransactionTime); 
	
	sDate = dtDateFormat.format(dtDate);
	sTime = dtTimeFormat.format(dtTime);
	
	int totalLength2 = sBillAccNo.length();
	sBhBranch = sBillAccNo.substring(0,3);
	sBhCliCode = sBillAccNo.substring(3,totalLength2);
	
	N2NSettlement settle = new N2NSettlement();
	settle.init(oN2NSession);
	settle.setWriter(out);
	
	java.lang.StringBuffer sLog = new StringBuffer();
	String sClientIP =  request.getHeader("client-ip");
	String sRemoteAddr =  request.getRemoteAddr();
		
	String sDtmLog1 = "@vsData='CIMBClicks IP: "+sClientIP+" / "+sRemoteAddr+"'";
	settle.DTMLog(sDtmLog1);
	
	String sDtmLog2 = "@vsData='Calling estlBCBNotification: "+sPaymentRefNo+" / "+sStatus+" / "+sBillRefNo+" / "+sBillAccNo+" / "+sTransactionDate+""+ sTransactionTime+" / "+sAmount+" / "+sUserFullName+" / "+sBhCliCode;
	settle.DTMLog(sDtmLog2);
	
	if(!sChannelId.equals("ECCE")){
		if(oN2NSession.getSetting("ESTL_IP_ADDRESS").indexOf(sRemoteAddr) < 0){
			out.println("You not allow to process this page!");
			return;
		} 
	} 
	
	sLog.append("estlBCBNotification ("+sClientIP+" / "+sRemoteAddr+" - payeeId = "+sPayeeId+", channelId = "+sChannelId+", billAccountNo = "+sBillAccNo+", ");
	sLog.append("billReferenceNo = "+sBillRefNo+", Amount = "+sAmount+", paymentRefNo = "+sPaymentRefNo+", transactionDate = "+sTransactionDate+", ");
	sLog.append("transactionTime = "+sTransactionTime+", userFullName = "+sUserFullName+", status = "+sStatus);
	com.n2n.util.Logging.logAPAgent1(sLog, "stldebug");
	
	settle.debugLog(sLog);
	settle.stlNotification(sPaymentRefNo,sBhCliCode,sRefNo,sDate,sTime,dAmount,sStatus,"",sTransType,null,sBhBranch,"B");
	
	settle.closeResultset();
	settle.dbDisconnect();
	
%>
<TITLE>Online Banking Confirmation</TITLE>
</HEAD>
<BODY style='background:#FFFFFF'>
	<TABLE border=0 cellpadding=2 cellspacing=10 width=600>
		<TR>
			<TD width=48%><b>Trading No</b></TD>
			<TD width=2%><b> : </b></TD>
			<TD width=48%><%=sBillAccNo%></TD>
		</TR>
		<TR>
			<TD width=48%><b>Client Name</b></TD>
			<TD width=2%><b> : </b></TD>
			<TD width=48%><%=sBillRefNo%></TD>
		</TR>
		<TR>
			<TD><b>Date</b></TD>
			<TD width=2%><b> : </b></TD>
			<TD><%=sDate%></TD>
		</TR>
		<TR>
			<TD><b>Time</b></TD>
			<TD width=2%><b> : </b></TD>
			<TD><%=sTime%></TD>
		</TR>
		<TR>
			<TD><b>Reference No.</b></TD>
			<TD width=2%><b> : </b></TD>
			<TD><%=sRefNo%></TD>
		</TR>
		<TR>
			<TD><b>Transaction Type</b></TD>
			<TD width=2%><b> : </b></TD>
			<TD><%=sTransType%></TD>
		</TR>
		<TR>
			<TD><b>Transaction Amount</b></TD>
			<TD width=2%><b> : </b></TD>
			<TD><%=oN2NSession.getSetting("BHCurrencyCode")%> <%=sAmount%></TD>
		</TR>
		<TR>
			<TD><b>Status</b></TD>
			<TD width=2%><b> : </b></TD>
			<TD><%=sStatusDesc%></TD>
		</TR>
		
	</TABLE>
</BODY>
</HTML>