<%@ page import = "com.plato.*,java.sql.ResultSet,com.n2n.util.N2NConst,com.n2n.util.N2NSecurity,java.util.Calendar,java.util.Date,com.n2n.DB.N2NDateFunc,java.text.SimpleDateFormat,java.text.DecimalFormat,com.n2n.DB.N2NMFCliInfo,com.n2n.bean.N2NMFCliInfoBean,com.n2n.DB.N2NSettlement,org.apache.commons.codec.digest.DigestUtils"%>
<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<%@ include file='/common.jsp'%>
<%@include file="/util/sessionCheck.jsp"%>
<html>
<head>
<%
	try {
		System.out.println("Process stlProcessERights....STARTED");
		Date dtToday = new Date();
		SimpleDateFormat dtLongFormat = new SimpleDateFormat("dd/MM/yyyy hh:mm:ss a");
		SimpleDateFormat dtFPXFormat = new SimpleDateFormat("yyyyMMddhhmmss");
		DecimalFormat dfValue = new DecimalFormat("#,###,###,##0.00");
		SimpleDateFormat dtShortFormat = new SimpleDateFormat("dd/MM/yyyy");
		DecimalFormat dfValue2 = new DecimalFormat("#.00");

		String sRefNoFull="", sRefNoBank="";
		String sBHCliCode = ""; String sBHBranch = ""; String sAccTypeDesc = "";
		String [] aWork = null;
		String sAmt = "";
		String sBankSrc="", sBankCode="", sBankDesc="", sBankPayeeID="";
		String sPin = "";
		String sPayType = "";
		String sAccType = "";
		String sRefresh = "";
		String sZero = "";
		String sRequestString = "";
//		String sClicksID = "";
		boolean bSuccess = false;
		int iRefNo = 0;
		int nRetCode = 0;
		int i = 0;
		ResultSet rs = null;
		ResultSet oRst = null;
		String sCAID = "";
		
		String P1 = "", F1 = "", F2 = ""; //CIMB Version 2 hashing

		String sExchange = "KL";
	if (validSession) {
		sRefresh =  session.getAttribute("sRefresh") !=null? (String)session.getAttribute("sRefresh") : "";		
System.out.println("Process sRefresh....."+sRefresh);
//		sClicksID = (String) session.getAttribute("ClicksID");

		if (sRefresh.equals("N")) {
			System.out.println("Process stlProcessERights....1.1.1");
			session.setAttribute("sRefresh","Y");						
			sBHCliCode = request.getParameter("Acc");
			sBHCliCode = sBHCliCode != null ? sBHCliCode : "";
			sAmt = request.getParameter("Amt");
			sAmt = sAmt != null ? sAmt : "";
			sBankSrc = request.getParameter("Bank");
			sBankSrc = sBankSrc != null ? sBankSrc : "";
			sRefNoFull = request.getParameter("refID");
			sRefNoFull = sRefNoFull != null ? sRefNoFull : "";
			sAccTypeDesc = request.getParameter("AccTypeDesc");
			sAccTypeDesc = sAccTypeDesc != null ? sAccTypeDesc : "";
			sCAID = request.getParameter("caID");
			sCAID = sCAID != null ? sCAID : "";
			
			
			
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

			//bSuccess = false;
			bSuccess = true;			

			if (bSuccess) {				

				if (sBankSrc.equals("M")) {
					sBankCode = "MBB";
					sBankDesc = "Maybank2U.com - MBB";
				} else if (sBankSrc.equals("B")) {
					sBankCode = "BCB";
					sBankDesc = "CIMB<i>Clicks</i> - CIMB Bank";
				} else if (sBankSrc.equals("F")) {
					sBankCode = "FPX";
					sBankDesc = "FPX-MEPS";
				} else if (sBankSrc.equals("A")) {
					sBankCode = "MPB";
					sBankDesc = "Alliance Online";
				} else if (sBankSrc.equals("D")) {
					sBankCode = "AMB";
					sBankDesc = "AmDirect Online - AMB";
				} else if (sBankSrc.equals("I")) {
					sBankCode = "AFB";
					sBankDesc = "Affin Bank Online";
				} else {
					sBankCode = "O";
				}
				//settle.stlCreateDeposit(sBHCliCode, g_sCliCode, Double.parseDouble(sAmt), sRefNoFull, sBankSrc, sBHBranch);
			}						

			sBankPayeeID = settle.getPayeeCode(g_sDefBHCode, sBHBranch, sBankCode);
			if (sBankPayeeID.length()==0) {
				out.println("You are not allow to make payment online with this payee!");
				out.println("</head></html>");
			} else {
				if (sBankPayeeID.length() >0) {
					aWork = sBankPayeeID.split("\\" + N2NConst.FEED_REQFLD_SEP);
					sBankPayeeID = aWork[0];
					if (aWork.length > 1) {
						sPayType = aWork[1];
					}
				}
			}
			
			sBankPayeeID = "TBCIMBINVEPAY"; //Temporary hardcoded

			sRequestString = "merchantID="+ sBankPayeeID +"&InvoiceNo="+ sBHCliCode +"&TransAmount="+ sAmt +"&field1="+ sRefNoFull +"&field2="+ sBHBranch + sBHCliCode +"&field3="+ sRefNoBank +"&field4=&field5=&field6=&field7=";

			WebToWebEncrypt be = new WebToWebEncrypt();

			settle.closeResultset();
			
			
			//CIMB version 2.0 hashing
			P1 = String.valueOf(dfValue2.format((Double.parseDouble(sAmt) + sBankPayeeID.length()) *  sBankPayeeID.length()));
			F1 = DigestUtils.sha1Hex(sBankPayeeID + sBHBranch + sBHCliCode + sAmt);
			F2 = DigestUtils.md5Hex(sBankPayeeID + sBHBranch + sBHCliCode + sAmt + sRefNoFull + sCAID +  oN2NSession.getSetting("ESTL_CIMBCLICKS_RESPURL"));
			System.out.println("sAmt="+sAmt);
			System.out.println("sAmt="+Double.parseDouble(sAmt));
			System.out.println("sBankPayeeID="+sBankPayeeID);
			System.out.println("sBHBranch="+sBHBranch);
			System.out.println("sBHCliCode="+sBHCliCode);
			System.out.println("sRefNoFull="+sRefNoFull);
			System.out.println("sCAID="+sCAID);
			System.out.println("P1="+P1);
			System.out.println("F1="+F1);
			System.out.println("F2="+F2);
			
	%>
<script language=JavaScript src="<%=g_sJSPath%>/N2NFunc.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/N2NPrnFunc.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/jquery-3.6.0.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/jquery-ui.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/jquery.jcryption.min.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/validate/jquery.uniform.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/validate/jquery.metadata.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/validate/jquery.validate.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/AesUtil.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/aes.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/pbkdf2.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/login_util.js"></script>
<script language=JavaScript src="<%=g_sJSPath%>/login_encrypt.js"></script>
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">
<link rel=stylesheet type=text/css href="<%=g_sWebPath%>/style/ca.css">
<title>Processing CA Instruction</title>
</head>
<body onload='Body_OnLoad()' class='clsBody'>
<table border=0 cellpadding=0 cellspacing=0 width=550>
<tr>
	<td class=clsSectionHeader width='50%'>&nbsp;Corporate Action Subscription</td>
	<td class="clsSectionHeader" align="right" width="43%">Last Update <%=dtShortFormat.format(dtToday)%>&nbsp;&nbsp;</td>
    <td width="7%"><img src="../img/butPrint.gif" title="Print" style="cursor:pointer" onclick="window.print();" height="18" width="18" border="0" /> <img id="imgHelp" src="../img/lightbulboff.jpg" onmouseover="this.src='../img/gcCIMBV/lightbulbon.jpg'" onmouseout="this.src='../img/gcCIMBV/lightbulboff.jpg'" title="Summary: Display your financial position in this securities" height="19" width="20" border="0" /> </td>
</tr>
</table>
<div id="divProcess" class="title_h2 step3">
                <h2>CA Subscription</h2>
                <div class="process">
                    <em>payment process</em>
                    <ol>
                        <li>step1</li>
                        <li>step2</li>
                        <li>step3</li>
                    </ol>
                </div>
 </div>
 <div id="divPayment">
<table id="tblPaymentNote" border=0 cellpadding=2 cellspacing=0 width=550 style="color: red;">
<tr>
	<td colspan="2" style="font-size:13">
		<br/><font color="red"><b>Important Notes</b></font>
	</td>
</tr>
<tr>
	<td style="font-size:13" valign="top">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a)</td>
	<td style="font-size:13">
		You will be routed to the on-line banking website to complete the funds transfer. Kindly ensure the browser's pop up blocker has been disabled.
	</td>
</tr>
<tr>
	<td style="font-size:13" valign="top">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b)</td>
	<td style="font-size:13">
		Please check the subscription status in i*Trade@CIMB quote screen under the "Subscription" menu and select "CA Subscription Status".
	</td>
</tr>
</table>
<!--
Your Fund Transfer Request is in progress. Your Request reference number is <-=sRefNoFull-=>.<br>
If approved, your deposit will be reflected upon the next update session on our system.
-->
<table id="tblPaySts" border="0" align="center" cellpadding="0" cellspacing="0" style="padding:20px;">
                <tr>
                  <td valign="top" style='padding:0in 1.0pt 0in 1.0pt'><p style='margin-top:26.25pt;margin-right:0in;margin-bottom:5.5pt; margin-left:0in;line-height:150%'><strong><span style='font-size:10.5pt; line-height:150%;color:#111111'>Payment Info</span></strong></p>
                    <table border="1" cellspacing="0" cellpadding="0"  style='width:100.0%;border-collapse:collapse;border:none;'>
                      <colgroup>
                      <col style="width:190px;"/>
                      <col />
                      </colgroup>
                      <tr>
                        <td width="190" style='border:none;border-top:solid #333333 1.0pt; background:#F9F9F9;padding: 5.0pt 5.0pt 5.75pt 5.0pt; '><span style='font-size:9.0pt; color:#424242'>Reference number (Bill No.)</span></td>
                        <td width="540" style='border:none;border-top:solid #333333 1.0pt; border-left:solid #E5E5E5 1.0pt; padding: 5.0pt 5.0pt 5.75pt 5.0pt; '><span style="font-size:9.0pt; color:#424242"><%=sRefNoFull%></span></td>
                      </tr>
                      <tr>
                        <td style='border-top:solid #E5E5E5 1.0pt; background:#F9F9F9; border-left:none;border-bottom: solid #C3C5C4 1.0pt;border-right:none;padding:5.0pt 5.0pt 5.75pt 5.0pt;'><span style="font-size:9.0pt; color:#424242">Trading Account</span></td>
                        <td  style='border-top:solid #E5E5E5 1.0pt; border-left:solid #E5E5E5 1.0pt; border-left:solid #E5E5E5 1.0pt; border-bottom: solid #C3C5C4 1.0pt; border-right:none;padding:5.0pt 5.0pt 5.75pt 5.0pt;'><span style="font-size:9.0pt; color:#424242"><%=sBHCliCode%> (<%=sAccTypeDesc%> )</span></td>
                      </tr>		
					   <tr>
                        <td style='border-top:solid #E5E5E5 1.0pt; background:#F9F9F9; border-left:none;border-bottom: solid #C3C5C4 1.0pt;border-right:none;padding:5.0pt 5.0pt 5.75pt 5.0pt;'><span style="font-size:9.0pt; color:#424242">Online Transfer</span></td>
                        <td  style='border-top:solid #E5E5E5 1.0pt; border-left:solid #E5E5E5 1.0pt; border-left:solid #E5E5E5 1.0pt; border-bottom: solid #C3C5C4 1.0pt; border-right:none;padding:5.0pt 5.0pt 5.75pt 5.0pt;'><span style="font-size:9.0pt; color:#424242"><%=sBankDesc%></span></td>
                      </tr>		
					   <tr>
                        <td style='border-top:solid #E5E5E5 1.0pt; background:#F9F9F9; border-left:none;border-bottom: solid #C3C5C4 1.0pt;border-right:none;padding:5.0pt 5.0pt 5.75pt 5.0pt;'><span style="font-size:9.0pt; color:#424242">Amount (RM)</span></td>
                        <td  style='border-top:solid #E5E5E5 1.0pt; border-left:solid #E5E5E5 1.0pt; border-left:solid #E5E5E5 1.0pt; border-bottom: solid #C3C5C4 1.0pt; border-right:none;padding:5.0pt 5.0pt 5.75pt 5.0pt;'><span style="font-size:9.0pt; color:#424242">RM <%=dfValue.format(Double.parseDouble(sAmt))%></span></td>
                      </tr>		
					  <tr>
                        <td style='border-top:solid #E5E5E5 1.0pt; background:#F9F9F9; border-left:none;border-bottom: solid #C3C5C4 1.0pt;border-right:none;padding:5.0pt 5.0pt 5.75pt 5.0pt;'><span style="font-size:9.0pt; color:#424242">Date / Time</span></td>
                        <td  style='border-top:solid #E5E5E5 1.0pt; border-left:solid #E5E5E5 1.0pt; border-left:solid #E5E5E5 1.0pt; border-bottom: solid #C3C5C4 1.0pt; border-right:none;padding:5.0pt 5.0pt 5.75pt 5.0pt;'><span style="font-size:9.0pt; color:#424242"><%=dtLongFormat.format(dtToday)%></span></td>
                      </tr>	
					  <tr>
                        <td style='border-top:solid #E5E5E5 1.0pt; background:#F9F9F9; border-left:none;border-bottom: solid #C3C5C4 1.0pt;border-right:none;padding:5.0pt 5.0pt 5.75pt 5.0pt;'><span style="font-size:9.0pt; color:#424242">Subscription Status</span></td>
                        <td  style='border-top:solid #E5E5E5 1.0pt; border-left:solid #E5E5E5 1.0pt; border-left:solid #E5E5E5 1.0pt; border-bottom: solid #C3C5C4 1.0pt; border-right:none;padding:5.0pt 5.0pt 5.75pt 5.0pt;'><span id="trxSts" style="font-size:9.0pt; color:#424242"></span></td>
                      </tr>		
                    </table>				
					 <div class="btnRArea">
						<div class="btn_r"> <a href="#" onClick="window.close()" class="btn_gb3 btn_s4">Close</a> </div>
					</div>
</table>		
</div>
<div id="divComplete" class="wrap_in3" style="display:none">
	<p>&nbsp; </p>
	<table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding-right:5%" >
	  <tr>
		<td><table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#F8F8F8" >
			<tr>
			  <td valign="top" ><p align="center" style='margin-top:28.5pt;margin-bottom:16.5pt;line-height:150%'> <span style='font-size:16.5pt; line-height:150%; color:#700019'>CIMB e-Rights: <em><span style="line-height:150%; color:#ff0000"><span id="paymentSts"></span> Payment (Ref No: <span><%=sRefNoFull%></span>)</span></em><br />
				  <em><span class="stockName" style='line-height:150%; color:#ff0000'></span></em></span></p></td>
			</tr>
		  </table>
		  <!-- //title -->
		  <!-- detail -->
		  <p >&nbsp;</p>
		  <table border="0" align="center" cellpadding="0" cellspacing="0" style="padding:20px;">
			<tr>
			  <td valign="top" style='padding:0in 1.0pt 0in 1.0pt'><p style='margin-top:26.25pt;margin-right:0in;margin-bottom:5.5pt; margin-left:0in;line-height:150%'><strong><span style='font-size:10.5pt; line-height:150%;color:#111111'>Payment Method</span></strong></p>
				<table border="1" cellspacing="0" cellpadding="0"  style='width:100.0%;border-collapse:collapse;border:none;'>
				  <colgroup>
				  <col style="width:190px;"/>
				  <col />
				  </colgroup>
				  <tr>
					<td width="190" style='border:none;border-top:solid #333333 1.0pt; background:#F9F9F9;padding: 5.0pt 5.0pt 5.75pt 5.0pt; '><span style='font-size:9.0pt; color:#424242'>Mode of Paymen</span></td>
					<td width="540" style='border:none;border-top:solid #333333 1.0pt; border-left:solid #E5E5E5 1.0pt; padding: 5.0pt 5.0pt 5.75pt 5.0pt; '><span style="font-size:9.0pt; color:#424242"><%=sBankDesc%></span></td>
				  </tr>
				  <tr>
					<td style='border-top:solid #E5E5E5 1.0pt; background:#F9F9F9; border-left:none;border-bottom: solid #C3C5C4 1.0pt;border-right:none;padding:5.0pt 5.0pt 5.75pt 5.0pt;'><span style="font-size:9.0pt; color:#424242">Total Payment Amount</span></td>
					<td  style='border-top:solid #E5E5E5 1.0pt; border-left:solid #E5E5E5 1.0pt; border-left:solid #E5E5E5 1.0pt; border-bottom: solid #C3C5C4 1.0pt; border-right:none;padding:5.0pt 5.0pt 5.75pt 5.0pt;'><span style="font-size:9.0pt; color:#424242">RM <%=dfValue.format(Double.parseDouble(sAmt))%></span></td>
				  </tr>
				</table>
				<p style='margin-top:28.5pt; margin-right:0in; margin-bottom:5.5pt; margin-left:0in; line-height:150%'><strong><span style='font-size:10.5pt; line-height:150%;color:#111111'>Subscription Details</span></strong> <span  style='font-size:9.0pt;line-height:150%; color:#424242'>(Subscription Date :<span class="applDt"></span> / Ref No. : <%=sRefNoFull%>)</span> </p>
				<table border="1" cellspacing="0" cellpadding="0"  style='width:100.0%;border-collapse:collapse;border:none;'>
				  <colgroup>
				  <col style="width:120px;" />
				  <col style="" />
				  <col style="width:125px;" />
				  <col style="width:125px;" />
				  </colgroup>
				  <thead>
					<tr >
					  <td width="120" style='border:none;border-top:solid #333333 1.0pt; background:#F9F9F9;padding: 5.0pt 0in 5.75pt 0in; text-align:center;'><span style='font-size:9.0pt; color:#212121'>Application Date</span></td>
					  <td width="238" style='border-top:solid #333333 1.0pt;border-left:solid #E5E5E5 1.0pt; border-bottom:none;border-right:none;background:#F9F9F9;padding: 5.0pt 0in 5.75pt 0in;text-align:center;'><span style='font-size:9.0pt; color:#212121'>Stock</span></td>
					  <td width="125" style='border-top:solid #333333 1.0pt;border-left:solid #E5E5E5 1.0pt; border-bottom:none;border-right:none;background:#F9F9F9;padding: 5.0pt 0in 5.75pt 0in;text-align:center;'><span style='font-size:9.0pt; color:#212121'>Qty of Shares</span></td>
					  <td width="125" style='border-top:solid #333333 1.0pt;border-left:solid #E5E5E5 1.0pt; border-bottom:none;border-right:none;background:#F9F9F9;padding: 5.0pt 0in 5.75pt 0in;text-align:center;'><span style='font-size:9.0pt; color:#212121'>App Ref No.</span></td>
					</tr>
				  </thead>
				  <tr >
					<td style='border-top:solid #E5E5E5 1.0pt;border-left:none;border-bottom: solid #C3C5C4 1.0pt;border-right:none;padding:5.0pt 3.0pt 5.75pt 3.0pt; text-align:center;'><span class="applDt" style="font-size:9.0pt; color:#424242"></span></td>
					<td style='border-top:solid #E5E5E5 1.0pt;border-left:solid #E5E5E5 1.0pt; border-bottom:solid #C3C5C4 1.0pt;border-right:none;padding:5.0pt 3.0pt 5.75pt 3.0pt; text-align:center;'><span class="stockName" style='font-size:9.0pt; color:#424242'></span></td>
					<td style='border-top:solid #E5E5E5 1.0pt;border-left:solid #E5E5E5 1.0pt; border-bottom:solid #C3C5C4 1.0pt;border-right:none;padding:5.0pt 3.0pt 5.75pt 3.0pt; text-align:center;'><span id="stockQty" style='font-size:9.0pt; color:#424242'></span></td>
					<td style='border-top:solid #E5E5E5 1.0pt;border-left:solid #E5E5E5 1.0pt; border-bottom:solid #C3C5C4 1.0pt;border-right:none;padding:5.0pt 3.0pt 5.75pt 3.0pt; text-align:center;'><span style='font-size:9.0pt; color:#424242'><%=sRefNoFull%> </span></td>
				  </tr>
				</table>
				<p style='margin-top:26.25pt;margin-right:0in;margin-bottom:5.5pt; margin-left:0in;line-height:150%'>&nbsp;</p></td>
			</tr>
		  </table>
	  <tr >
		<td valign="top" style='border-top:none; padding:10.0pt 15.0pt 25.0pt 15.0pt'><div class="btnRArea center">
			<!-- Button Area -->
			<div class="btn"><a href="./web/html/caSubscpStatus.html" onclick="#" class="btn_gb3 btn_m">Check Subscription Status</a></div>
		  </div></td>
	  </tr>
	  </td>
	  
	  </tr>
	  
	</table>
	<p>&nbsp;</p>
	<p>&nbsp;</p>
  </div>
   <!-- /divComplete-->
		

<table border=0 cellpadding=0 cellspacing=0 width=550 style="display:none">
<tr><td width=10%>&nbsp;</td>
	<td width=90%>
	<table border=0 cellpadding=1 cellspacing=2 width=100%>
	<tr height=10><td width=30%>&nbsp;</td>
		<td width=2%>&nbsp;</td>
		<td width=68%>&nbsp;</td></tr>
	<tr><td>Reference number (Bill No.)</td>
		<td>:</td>
		<td><%=sRefNoFull%></td></tr>
	<tr><td>Trading Account</td>
		<td>:</td>
		<td>
<%
			out.print(sBHCliCode +" (" +  sAccTypeDesc +")");
			
%>
		</td>
	</tr>
	<tr><td>Online Transfer</td>
		<td>:</td>
		<td><%=sBankDesc%></td></tr>
	<tr><td>Amount (RM)</td>
		<td>:</td>
		<td>RM <%=dfValue.format(Double.parseDouble(sAmt))%></td></tr>
	<tr><td>Date / Time</td>
		<td>:</td>
		<td><%=dtLongFormat.format(dtToday)%></td></tr>
	</table>
	</td></tr>
</table>
<br/>
<%
	if (sBankSrc.equals("B")) {
		out.println("<form name='frmCIMBTrans' action='"+ oN2NSession.getSetting("ESTL_CIMBCLICKS_URL") +"' method='post' target='winStlBank'>");
		out.println("<input type='hidden' name='payeeId' value='"+ sBankPayeeID +"'>");
		out.println("<input type='hidden' name='billAccountNo' value='"+ sBHBranch + sBHCliCode +"'>");
		out.println("<input type='hidden' name='billReferenceNo' value='"+ sRefNoFull +"'>");
		out.println("<input type='hidden' name='billReferenceNo2' value='"+ sCAID +"'>");
		out.println("<input type='hidden' name='p1' value='"+ P1 +"'>");
		out.println("<input type='hidden' name='f1' value='"+ F1 +"'>");
		out.println("<input type='hidden' name='f2' value='"+ F2 +"'>");
		out.println("<input type='hidden' name='payeeResponseURL' value='"+ oN2NSession.getSetting("ESTL_CIMBCLICKS_RESPURL") +"'></form>");
	} else if (sBankSrc.equals("F")) {
		out.println("<form name='frmFPXSubmit' action='"+ oN2NSession.getSetting("ESTL_FPX_URL") +"' method='post' target='fpx'>");
		out.println("<input type='hidden' name='msgType' value='AR'>");
		out.println("<input type='hidden' name='msgToken' value='01'>");
		out.println("<input type='hidden' name='excOrdNo' value='"+oN2NSession.getSetting("ESTL_FPX_EID")+"'>");
		out.println("<input type='hidden' name='excOrderCount' value='1'>");
		out.println("<input type='hidden' name='transcDate' value='"+ dtFPXFormat.format(dtToday) +"'>");
		out.println("<input type='hidden' name='currency' value='MYR'>");
		out.println("<input type='hidden' name='amt' value='"+ Double.parseDouble(sAmt) +"'>");
		out.println("<input type='hidden' name='chargeType' value='AA'>");
		out.println("<input type='hidden' name='pay_refno' value='"+ sRefNoFull +"'>");
		out.println("<input type='hidden' name='sellerID' value='"+ sBankPayeeID +"'>");
		out.println("<input type='hidden' name='bankCode' value='01'></form>");
	} else if (sBankSrc.equals("A")) {
		out.println("<form name='frmAllianceSubmit' action='"+ oN2NSession.getSetting("ESTL_ALBANK_URL") +"' method='post' target='winStlBank'>");
		out.println("<input type='hidden' name='comp_id' value='"+ sBankPayeeID +"'>");
		out.println("<input type='hidden' name='pay_refno' value='"+ sRefNoBank +"'>");
		out.println("<input type='hidden' name='client_no' value='"+ sBHBranch + sBHCliCode +"'>");
		out.println("<input type='hidden' name='pay_type' value='"+ sPayType +"'>");
		out.println("<input type='hidden' name='amt' value='"+ Double.parseDouble(sAmt) +"'></form>");
	} else if (sBankSrc.equals("D")) {
		out.println("<form name='frmAMBSubmit' action='"+ oN2NSession.getSetting("ESTL_AMBANK_URL") +"' method='get' target='winStlBank'>");
		out.println("<input type='hidden' name='requestString' value='"+ be.encryptString(sRequestString) +"'></form>");
	} else if (sBankSrc.equals("I")) {
//		<!--added by clleong 20081030 for Affin Trade -->
		out.println("<form name='frmAFBTrans' action='"+ oN2NSession.getSetting("ESTL_AFBANK_URL") +"' method='post' target='winStlBank'>");
		out.println("<input type='hidden' name='payeeId' value='"+ sBankPayeeID +"'>");
		out.println("<input type='hidden' name='billAccountNo' value='" + sBHCliCode + "'>");
		out.println("<input type='hidden' name='billReferenceNo' value='" + g_sCliName + "'>");
		out.println("<input type='hidden' name='billReferenceNo2' value='" + sRefNoBank + "'>");
		out.println("<input type='hidden' name='responseURL' value='"+ oN2NSession.getSetting("ESTL_AFBANK_RESPURL") +"'>");
		out.println("<input type='hidden' name='amount' value='" + Double.parseDouble(sAmt) + "'></form>");
	}
%>
</body>
</html>
<script language=JavaScript>
var outputValue,inputValue;

function encValWAES(rv){	
	var av="",login_public;
	console.log("RSA Encrypted value: "+rv);	
	getKey(function(output){login_public=output;});
	if(login_public!=null){
		public_key = login_public.key;
		public_salt = login_public.salt;
		public_iv = login_public.iv;
		public_id = login_public.id;
		console.log("Salt: "+public_salt);
		console.log("IV: "+public_iv);
		console.log("ID: "+public_id);
		console.log("Encrypted Key: "+public_key);
		var aesUtilDec = new AesUtil(256,100);
		public_key = aesUtilDec.decrypt(public_salt,public_iv,"wms in n2n is great!",public_key);
		console.log("Decrypted Key: "+public_key);
		
		var aesUtil = new AesUtil(256,100);
		av = aesUtil.encrypt(public_salt,public_iv,public_key,rv);
		console.log("AES Encrypted value: "+av);
	}
	return av;
}

function encryptValue(handleData){
	$.jCryption.getKeys(root_url+"key.jsp",
											function(e) {												
												$.jCryption.encrypt(inputValue,	e,
														function(f) {
															var encryptedValue = encValWAES(f);
															handleData(encryptedValue);

														}
												)
											}
	);
}

function checkBnkSts(handleData){
	//var jsonObject = {'TranDt' : '20151119', 'PayeeID' : 'CIMBEBC', 'BilAccNo' : '0010C2656', 'BilRefNo' : '', 'Amt' : '12.13'};
	var jsonObject = {'bhBranch' : '<%=sBHBranch%>', 'bhCliCode' : '<%=sBHCliCode%>', 'mode' : '0', 'refNo' : '<%=sRefNoFull%>'};
	inputValue =  JSON.stringify(jsonObject);		
	encryptValue(function(output){
		outputValue=output}
		);
		
	if(outputValue != null){
		var checksum = JSChecksum(outputValue);
		
		$.ajax({
		type:"POST",
		datatype:"json",
		async:true,
		data:{v:outputValue,cs:checksum,c:public_id},
		url:root_url + "srvs/eRights/ERGetSubscLog",
		success: function(data){			
			console.log(data);
			handleData(data);
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}})
	}
	
	
}

function chgLayout(layout){
	$("#divComplete").css("display","none");
	$("#divPayment").css("display","none");
	
	switch(layout){
		case 4: 
			$("#divProcess").removeClass().addClass("title_h2 step4");
			$("#divComplete").css("display","");
			break;
		default :
			break;
	}
}

function setPaymentStatus(data){
	$('.stockName').html(data[0].stockName);
	$('.applDt').html(data[0].AppDate);
	$('#stockQty').html(data[0].qtyOfShares);
	
	if(data[0].status == '2'){
		$('#paymentSts').html("Successfull");
	}else{
		$('#paymentSts').html("Failed");
	}
}



window.onload = Body_OnLoad
function Body_OnLoad()
{
	var sURL
	var sFormat
<%
	if (sBankSrc.equals("M")) {
		out.println("sFormat=\"height=400,width=770,scrollbars=yes,resizable=yes,status=yes,toolbar=no,menubar=no,location=no\";");
		out.println("sURL = \""+ oN2NSession.getSetting("ESTL_M2U_URL") + sBankPayeeID +"$1$"+ Double.parseDouble(sAmt) +"$1$"+ sRefNoFull +"$1$"+ sBHBranch + sBHCliCode +"$"+ oN2NSession.getSetting("ESTL_M2U_RESPURL") +"\";");
	} else if (sBankSrc.equals("B")) {
		out.println("sFormat=\"height=650,width=870,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=yes\";");
		out.println("sURL = \"about:blank\";");
	} else if (sBankSrc.equals("F")) {
		out.println("sFormat=\"height=500,width=700,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no\";");
		out.println("sURL = \"about:blank\";");
	} else if (sBankSrc.equals("A")) {
		out.println("sFormat=\"height=500,width=770,status=yes,toolbar=no,menubar=no,location=no\";");
		out.println("sURL = \"about:blank\";");
	} else if (sBankSrc.equals("D")) {
		out.println("sFormat=\"height=550,width=700,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=yes\";");
		out.println("sURL = \"about:blank\";");
	// added by clleong 20081103
	} else if (sBankSrc.equals("I")) {
		out.println("sFormat=\"height=550,width=1000,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=yes\";");
		out.println("sURL = \"about:blank\";");
	} else {
		out.println("sFormat=\"height=374,width=594,status=yes,toolbar=no,menubar=no,location=no\";");
		out.println("sURL = \"about:blank\";");
	}

	if (sBankSrc.equals("F")) {
		out.println("var child = window.open(sURL, 'fpx', sFormat);");
	} else {
		out.println("var child = window.open(sURL, 'winStlBank', sFormat);");
		out.println("var childTimer = setInterval(checkChild, 1000);");		
		
		
	
	}

	if (sBankSrc.equals("B")) {
		out.println("document.frmCIMBTrans.submit();");
	} else if (sBankSrc.equals("F")) {
		out.println("document.frmFPXSubmit.submit();");
	} else if (sBankSrc.equals("A")) {
		out.println("document.frmAllianceSubmit.submit();");
	} else if (sBankSrc.equals("D")) {
		out.println("document.frmAMBSubmit.submit();");
	} else if (sBankSrc.equals("I")) {
		out.println("document.frmAFBTrans.submit();");
	}
%>

function checkChild() {
	checkBnkSts(function(data){	
		if (child.closed) {	
			clearInterval(childTimer);
			checkBnkSts(function(data){			
				if (data) {
					$('#trxSts').html(data[0].remark);
					setPaymentStatus(data)
					chgLayout(4);
				}else{
				}	
			});	
		}else if (data) {	
			$('#trxSts').html(data[0].remark);
			if (data[0].status == '2') {	
				clearInterval(childTimer);	
				setPaymentStatus(data)	
				chgLayout(4);
			}
		}
		});		
}
}
</script>
<%
		} else {
			out.println("<HTML><HEAD><TITLE>Refresh</TITLE></HEAD>");
			out.println("The page has been refreshed more than once.");
			out.println("</HTML>");
		}

	} else { // end of if valid user
		response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
	}

} catch (Exception ex) {
	ex.printStackTrace();
}
%>