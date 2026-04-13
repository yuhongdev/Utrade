<%@ page errorPage="error.jsp"%>
<%@ include file='/common.jsp'%>
<%//@ include file='banner.jsp'
%>

<jsp:include page="cliCheckLogin.jsp" flush="true">
	<jsp:param name="SecLevel" value="1" />
</jsp:include>
<%@ page import = "java.sql.ResultSet, com.n2n.DB.N2NMFRef, com.n2n.bean.N2NMFRefBean, com.n2n.DB.N2NMFStkInfo, com.n2n.bean.N2NMFStkInfoBean, com.n2n.bean.N2NMFCliInfoBean, com.n2n.util.N2NConst, com.n2n.DB.N2NDateFunc, com.n2n.DB.N2NMFRmsInfo" %>
<%!
if(g_sDefBHBranch == "995"){
%>
	<html><head><title>System Maintenance</title></head>
		<body>
			<table width='100%' height='100%' bgcolor='#808080'>
			  <tr>
				<td></td>
				<td><font face=Tahoma size=2 align=center color='#FFFFFF'>
					<b><center>Online trading is currently not available for KK Branch.<br>Please call your dealer/remisier/CDT to place order.<br>We apologise for the inconvenience caused.</center></b></font>
				</td>
			  </tr>
			</table>
		</body>
	</html>		
<%	
}
String m_sBorderColor, m_sTitle

String sStkCode; 
String sStkName;
String sOrdType;
String sOddLot; 
String sPrice;
String sOrdSrcSiteID; 

String sSector; 
String sStatus; 
String sBuy; 
String sSell; 
String sRef; 
String sBase; 
String sLastDone;
String sClose; 
String sLotSize;

String sAccList; 
String sBHBranch; 
String sBHCliCode;
String sCliCode;
int nPos = 0;
double dAPPrice = 0;
long lStkLeft = 0;

String sTrdAccNo; 

String sStkClass;
String sTrdRest;
String sEsosPrice = "";
double dESOSPrice=0;

String sListTrdUrl;
String sPinMsg;

String dMinBrokerage;

int iMaxQty = 500;
int nMaxGTDDay = 30;

String[] aList = null;
String sTemp = "";
String[] sLangSetting = null;
String sLang = "";
String slstFile = "";
String sFont = "";
	
String sBorderColor = "#CC0000";
String sColorScheme = "";

String sEncrptPin = "";
	
/*
double dTrdLimit = 0;
*/

		sStkCode = request.getParameter("Code");
		sStkName = request.getParameter("Name");
		sOrdType = request.getParameter("OrderType");
		sOddLot = request.getParameter("OddLot");
		sPrice = request.getParameter("Price");
		sOrdSrcSiteID = oN2NSession.getSetting("OrdSrcSiteID");
		
		sSector = request.getParameter("Sector");
		sStatus = request.getParameter("Status");
		sBuy = request.getParameter("Buy");
		sSell = request.getParameter("Sell");
		sRef = request.getParameter("Ref");
		sBase = request.getParameter("Base");
		sLastDone = request.getParameter("LastDone");
		sClose = request.getParameter("Close");
		sLotSize = request.getParameter("Lotsize");
		sLotSize = "100";
		
		sTrdAccNo = request.getParameter("Acc");
		sStkClass = request.getParameter("Class");
		sTrdRest = request.getParameter("TradRest");
		sEsosPrice = request.getParameter("ESOSPrice");
		sFont = request.getParameter("font");
		sLang = request.getParameter("lang");
		
		sStkCode = sStkCode != null ? sStkCode.trim() : "";
		sStkName = sStkName != null ? sStkName : "";
		sOrdType = sOrdType != null ? sOrdType : "";
		sOddLot = sOddLot != null ? sOddLot : "N";
		sPrice = sPrice != null ? sPrice : "0";
		sOrdSrcSiteID = sOrdSrcSiteID != null ? sOrdSrcSiteID : "";
		sSector = sSector != null ? sSector : "";
		sStatus = sStatus != null ? sStatus : "";
		sBuy = sBuy != null ? sBuy : "";
		sSell = sSell != null ? sSell : "";
		sRef = sRef != null ? sRef : "0";
		sBase = sBase != null ? sBase : "0";
		sLastDone = sLastDone != null ? sLastDone : "0";
		sClose = sClose != null ? sClose : "0";
		sLotSize = sLotSize != null ? sLotSize : "0";
		
		sTrdAccNo = sTrdAccNo != null ? sTrdAccNo.trim() : "";
		sStkClass = sStkClass != null ? sStkClass.trim() : "";
		sTrdRest = sTrdRest != null ? sTrdRest.trim() : "";
		sEsosPrice = sEsosPrice != null ? sEsosPrice.trim() : "0";
		sFont = sFont != null ? sFont.trim() : "";
		sLang = sLang != null ? sLang.trim() : "";
		sEncrptPin = session.getAttribute("EncryptTrdPin") != null ? session.getAttribute("EncryptTrdPin").toString() : "";

		//get language setting
		sTemp = oN2NSession.getUpdLangSetting(sLang,request);
		sLangSetting = sTemp.split(N2NConst.LANG_COL_SEP);		
		
		if (sLang.length() == 0) {
			sLang = g_sLanguage;
		}
		if (sLang.compareToIgnoreCase("zh") >= 0){
			sLang = "CN";
		}			
		if (sLang.compareToIgnoreCase("CN")>=0) {
			slstFile = "rbBS_zh_CN.jar";
			out.println("<meta http-equiv='Content-Type' content='text/html; charset=gb2312'>");
		} else {
			slstFile="rbBS_en_US.jar";
		}
		
		if (sFont.length() == 0) {
			sFont = sLangSetting[2];
		}
		
		boolean bAdvUser = false;
		int nAppletHeight = 0;
		if(oN2NSession.cliinfo.isBankDealer()){
			bAdvUser = true;
			nAppletHeight = 270;
		}else{
			bAdvUser = false;
			nAppletHeight = 138;
		}
		
		if(g_IsEmployee){
			nMaxGTDDay = 30;
		}else{
			nMaxGTDDay = Integer.parseInt(oN2NSession.getSetting("AppOptTrdMaxGTDDay"));
		}

		System.out.println("******* sTrdAccNo: " + sTrdAccNo);
		if (sTrdAccNo.trim().length() > 0) {
			aList = sTrdAccNo.split("\\" + N2NConst.TRDACC_COL_SEP);

			if (aList != null && aList.length > 0) {
				sTrdAccNo = aList[0];
			}			
			if (aList.length >= 1) {
				sBHBranch = aList[1];
			}
		} else {
			sTrdAccNo = sBHCliCode;
		}
		System.out.println("sTrdAccNo: " + sTrdAccNo);
		
		if (sOrdType.compareToIgnoreCase(N2NConst.TRD_TYPE_BUY) != 0 && sOrdType.compareToIgnoreCase(N2NConst.TRD_TYPE_SELL) != 0) {
			sOrdType = N2NConst.TRD_TYPE_BUY;
		}

		if (sOrdType.compareToIgnoreCase(N2NConst.TRD_TYPE_BUY) == 0) {
			sTitle = "Buy";	
			sBorderColor = "#009900";			
		} else {
			sTitle = "Sell";
			sBorderColor = "#CC0000";
		}

		if (sOddLot.compareToIgnoreCase("Y") != 0) {
			sOddLot = "N";
			dMinBrokerage = -1;
			sColorScheme = "#7F99B2|#FFFFFF|#003366|#C0C0C0|#C0C0C0|#000000|#FF0000";
		} else {
			sTitle = sTitle + " Odd Lot";
			dMinBrokerage = 12;
			sColorScheme = "#FAFFDC|#FFFFFF|#003366|#C0C0C0|#C0C0C0|#000000|#FF0000";			
		}

		sPinMsg = "0|`Remember PIN` will be disabled after each log-off from " + oN2NSession.getSetting("WebSiteName");

		//bin/cliGetBHCliInfo.asp
		String sListTrdUrl = oN2NSession.getSetting("HTMLRoot") +"/cliGetBHCliInfo.jsp?CliCode="+ g_sCliCode +"&Encrypt=N";		//&LoginID="+ g_sLoginId +"&exchg="+ sExchange;
		
		
		//GetTrdMaxQty
		N2NMFRefBean refbean = new N2NMFRefBean();
		refbean.setRefID("MAXQTY");
		N2NMFRef ref = new N2NMFRef();
		ref.init(oN2NSession);
		ResultSet rs = ref.getRef("",refbean);
		if (rs != null) {
			while(rs.next()) {
				System.out.println(rs.getString("LinkCode"));
				iMaxQty = rs.getInt("LinkCode");
			}
			rs.close();
			rs = null;
			ref.closeResultset();
		}
		ref.dbDisconnect();
		
		//Get StkClass, TradRest, ESOSPrice
		N2NMFStkInfo info = new N2NMFStkInfo();
		if (sStkClass.length() == 0 && sStkCode.length() > 0) {
			N2NMFStkInfoBean infobean = new N2NMFStkInfoBean();
			infobean.setStkCode(sStkCode);
			
			info.init(oN2NSession);
			rs = info.getStkInfo(infobean);
			
			if (rs != null) {
				while (rs.next()) {
					sStkClass = rs.getString("Class");
					if (rs.getBoolean("TradRest")) {
						sTrdRest = "1";
					} else {
						sTrdRest = "0";
					}
					dESOSPrice = rs.getDouble("ESOSPrice");
					sEsosPrice = Double.toString(dESOSPrice);
					//sStockCurrCode = rs.getString("Currency");
				}
				rs.close();
				rs = null;
				info.closeResultset();
			} 
			info.dbDisconnect();
		}		
%>
<html>
	<head>
		<title><%=sTitle%> - [<%=g_sLoginId%>]</title>
		<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
		<link rel=\"shortcut icon\" href=/img/favicon.ico >
		
	</head>
	<body onload='Body_OnLoad()'>
<%
boolean bGameMode = false;
if(oN2NSession.getSetting("AppMode").equalsIgnoreCase("game")){
	bGameMode = true;
%>
		<table width='615'><tr><td align=right><img src=/img/Game/LogoStockGame.gif></td></tr></table>
<%	
}
%>
		<table border=0 cellpadding=1 cellspacing=0 width=586>
			<tr>
				<td>
				<table id=tblMainFrame border=2 cellpadding=1 cellspacing=0 bordercolor=<%=sBorderColor%> style='border-style:groove' width='100%'>
					<tr>
						<td>
<%
String ar_CHANGEPIN_URL = oN2NSession.getSetting("HTMLRoot") +"/cliChgPIN.jsp"; //bin/cliChgPIN.asp
String ar_RESETPIN_URL = oN2NSession.getSetting("HTMLRoot") +"/cliForgetPIN.jsp"; //bin/cliForgetPIN.asp

int sSessionId = oN2NSession.getSessionId(session);

String sCode = "BuySell.class";
String sCodebase = "/java/jar/new/";
String sArchive = "BuySellAWT.jar,CalcFunc.jar,com.ebc.util.jar,com.ebc.awt.JCalendar.jar,com.ebc.awt.jar,AcctSearch.jar," + slstFile;
int sWidth = 581;
int sRateMethod = 2;
String sBuySellFeature = "159";

String sCliInfo = g_sCliCode + N2NConst.FEED_COL_SEP + g_sCategory + N2NConst.FEED_COL_SEP + g_sLoginId + N2NConst.FEED_COL_SEP + (iMaxQty) + N2NConst.FEED_COL_SEP + nMaxGTDDay + N2NConst.FEED_COL_SEP + sEncrptPin;

		//Get Account List	
		oN2NSession.cliinfo.init(oN2NSession);	
		sAccList = oN2NSession.cliinfo.getAccList(oN2NSession,sExchange, sTrdAccNo);		
		sAccTempList = sAccList;

		System.out.println("sAccList: " + sAccList);
		if (sStkCode.length() > 0) {
			aList = sAccList.split("\\|");
			if (aList.length <= 9) {
				out.println("this.location.href='" + oN2NSession.getSetting("HTMLRoot") + g_sPath + "/web/msgNoAcc.jsp';");
			}else{
				nPos = 0;
				if (aList[0].compareToIgnoreCase("-ALL-") >= 0) {
					nPos = 9;
				}
				sBHCliCode = aList[nPos];
				sCliCode = aList[nPos +4];
				
				//default acc to EES/ESOS Acc
				if (sTrdAccNo.length() == 0 && sOrdType.equals(N2NConst.TRD_TYPE_SELL) && Integer.parseInt(dESOSPrice) > 0) {
					sTrdAccNo = oN2NSession.cliinfo.getDefTrdAccNo(aList, nPos, 9);
					if (sTrdAccNo != null && sTrdAccNo.trim().length() > 0) {
						aList = sTrdAccNo.split(N2NConst.TRDACC_COL_SEP);
						sTrdAccNo = aList[0];
						sBHBranch = aList[1];
					}
				}
				if(sTrdAccNo.length() > 0){
					sBHCliCode = sTrdAccNo;
				}else{
					aList = sBHCliCode.split(N2NConst.TRDACC_COL_SEP);
					if (aList != null) {
						sBHCliCode = aList[0];	
						if (aList.length > 1) {
							sBHBranch = aList[1];
						}
					}					
				}					
			}
		}else{
			dAPPrice = 0;
			lStkLeft = 0;
		}

		String sTrdInfo = sStkCode + N2NConst.FEED_COL_SEP + sStkName + N2NConst.FEED_COL_SEP + sOrdType + N2NConst.FEED_COL_SEP + sOddLot + N2NConst.FEED_COL_SEP + sPrice + N2NConst.FEED_COL_SEP + sSector + N2NConst.FEED_COL_SEP + sStatus + N2NConst.FEED_COL_SEP + sBuy + N2NConst.FEED_COL_SEP + sSell + N2NConst.FEED_COL_SEP + sRef + N2NConst.FEED_COL_SEP + sBase + N2NConst.FEED_COL_SEP + sLastDone + N2NConst.FEED_COL_SEP + sClose  + N2NConst.FEED_COL_SEP + sLotSize  + N2NConst.FEED_COL_SEP + dAPPrice + N2NConst.FEED_COL_SEP + sStkClass + N2NConst.FEED_COL_SEP + sTrdRest  + N2NConst.FEED_COL_SEP + dESOSPrice + N2NConst.FEED_COL_SEP + sOrdSrcSiteID + N2NConst.FEED_COL_SEP + sBHCliCode + N2NConst.TRDACC_COL_SEP + sBHBranch + N2NConst.FEED_COL_SEP + lStkLeft + N2NConst.FEED_COL_SEP + dMinBrokerage;

		/** get Dealer Info **/
		String sDealerInfo = "";
		N2NMFRmsInfo rms = new N2NMFRmsInfo();
		rms.init(oN2NSession);
		int iDealerRepLoggedOn = rms.isDealerRepLoggedOn(g_sDefRmsCode,oN2NSession.getSetting("AppMode"),oN2NSession.cliinfo.isBankDealer(),oN2NSession.getSetting("AppOptNoChkDRLogon"));
		sDealerInfo = iDealerRepLoggedOn + N2NConst.FEED_COL_SEP + oN2NSession.getSetting("WebBHName"); //"CIMB"
				
		String sISAPIDll = "";		
		sISAPIDll = oN2NSession.getSetting("HTMLRoot") + "/ebcServlet/ebcForwarder?Site=rtQuoteURL&GetBSStockInfo&";
%>					
<script language="JavaScript">		
	var appletArgs = new Array(
			"code","<%=sCode%>",
			"codebase","<%=sCodebase%>",
			"archive","<%=sArchive%>",
			"width","<%=sWidth%>",
			"height","<%=nAppletHeight%>",
			"HTMLRoot","<%=oN2NSession.getSetting("HTMLRootSecure")%>",
			"ISAPIDLL_URL","<%=sISAPIDll%>",
			"CHANGEPIN_URL","<%=ar_CHANGEPIN_URL%>",
			"RESETPIN_URL","<%=ar_RESETPIN_URL%>",
			"CliInfo","<%=sCliInfo%>",
			"AccInfo","<%=sAccList%>",
			"TrdInfo","<%=sTrdInfo%>",
			"PrtfInfo","",
			"DealerInfo","<%=sDealerInfo%>",
			<%if (sStkCode.trim().length() == 0 || oN2NSession.cliinfo.isBankDealer()) {%>
				"StkList","<%@ include file="/ref/mf_stkinfo.applet_stkcode_stkshtname.ref"%>",
			<%}%>
			
			"Feature","<%=sBuySellFeature%>",
			"SID","<%=sSessionId%>",
			"RateMethod","<%=sRateMethod%>",
			"ColorScheme","<%=sColorScheme%>",
			"DEFAULT_LANGUAGE","<%=sLangSetting(0)%>",
			"DEFAULT_COUNTRY","<%=sLangSetting(1)%>",
			"DEFAULT_FONT","<%=sFont%>",
			"LIST_TRD_ACCT_URL","<%=sListTrdUrl%>",
			"PIN_MESSAGE","<%=sPinMsg%>",
			"EXTRA_CONFIRMATION_MSG","",
			"FEATURE_FORM","1983",
			"STK_CALC_INFO","0800EA|0.001|0.3|0820EA|0.01|0|"
		);
//		AC_AX_RunAppletContent( appletArgs ); //end AC code
</script>	
<noscript>
						<applet code=<%=sCode%> codebase='<%=sCodebase%>' archive='<%=sArchive%>' width=<%=sWidth%> height=<%=nAppletHeight%> MAYSCRIPT>
								<PARAM NAME=HTMLRoot VALUE='<%=oN2NSession.getSetting("HTMLRootSecure")%>'>
								<PARAM NAME=ISAPIDLL_URL VALUE='<%=sISAPIDll%>'>
								<PARAM NAME=CHANGEPIN_URL VALUE='<%=ar_CHANGEPIN_URL%>'>
								<PARAM NAME=RESETPIN_URL VALUE='<%=ar_RESETPIN_URL%>'>
								<PARAM NAME=CliInfo VALUE="<%=sCliInfo%>">
								<PARAM NAME=AccInfo VALUE="<%=sAccList%>">
								<PARAM NAME=TrdInfo VALUE="<%=sTrdInfo%>">
								<PARAM NAME=PrtfInfo VALUE="">
								<PARAM NAME=DealerInfo VALUE="<%=sDealerInfo%>">
								<PARAM NAME=LIST_TRD_ACCT_URL VALUE="<%=sListTrdUrl%>">
								<PARAM NAME=StkList VALUE='<%if (sStkCode.trim().length() == 0 || oN2NSession.cliinfo.isBankDealer()){ %><%@ include file="/ref/mf_stkinfo.applet_stkcode_stkshtname.ref"%><%}%>'>
								<PARAM NAME=Feature VALUE=<%=sBuySellFeature%>>
								<PARAM NAME=SID VALUE="<%=sSessionId%>">
								<PARAM NAME=RateMethod VALUE="<%=sRateMethod%>">
								<PARAM NAME=ColorScheme VALUE="<%=sColorScheme%>">
								<PARAM NAME=DEFAULT_LANGUAGE VALUE='<%=sLangSetting(0)%>'>
								<PARAM NAME=DEFAULT_COUNTRY VALUE='<%=sLangSetting(1)%>'>
								<PARAM NAME=DEFAULT_FONT VALUE='<%=sFont%>'>
								<PARAM NAME=PIN_MESSAGE VALUE='<%=sPinMsg%>'>
								<PARAM NAME=EXTRA_CONFIRMATION_MSG VALUE=''>
								<PARAM NAME=FEATURE_FORM VALUE='1983'>
								<PARAM NAME=STK_CALC_INFO VALUE='0800EA|0.001|0.3|0820EA|0.01|0|'>
							</applet>
</noscript>							
						</td>
					</tr>
				</table>
				</td>
			</tr>
		</table>
		&nbsp;<a href="javascript:openWinFAQGTDExpiry()" style="color:#303f53;FONT-WEIGHT: Bolder;FONT-FAMILY: arial; FONT-SIZE: 8pt;text-decoration:none">
		<u>Good Till Date Expiry Note</u></a>&nbsp;
	</body>
</html>
<script language=JavaScript>
function Body_OnLoad(){
	document.body.focus();
}
function CloseWin()
{
	window.setTimeout("window.close();", 500)
}

function openWinFAQGTDExpiry()
{
	window.open("/web/faqGTDExpiry.htm", "WinFAQGTDExpiry", "left=70,top=241,width=620,height=180,scrollbars=no,location=no,toolbar=no,menubar=no,resizable=yes", false);
}
</script>
