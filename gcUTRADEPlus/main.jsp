<%--
    Document   : index
    Created on : Jul 12, 2010, 5:50:26 PM
    Author     : SC Ooi
--%>
<%@page import="com.n2n.tcplus.atp.misc.LoginUtil"%>
<% 
	HttpSession sess = request.getSession();

	String sUser = (String) sess.getAttribute("user");
	
	N2NLogUtil.logInfo("## [MAIN PAGE] ###########################", sUser);
	N2NLogUtil.logInfo("[MAIN PAGE] Session id --> "+ sess.getId(), sUser);
	N2NLogUtil.logInfo("[MAIN PAGE] New session --> "+sess.isNew(), sUser);
	N2NLogUtil.logInfo("[MAIN PAGE] Timeout --> "+sess.getMaxInactiveInterval(), sUser);
	N2NLogUtil.logInfo("[MAIN PAGE] Creation time --> "+sess.getCreationTime(), sUser);
	N2NLogUtil.logInfo("[MAIN PAGE] Last access time --> "+sess.getLastAccessedTime(), sUser);
%>
<%@page import="org.json.JSONArray"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.n2n.tcplus.subscription.LMSSubscription"%>
<%@page import="com.n2n.tcplus.subscription.LMSServiceBean"%>
<%@page import="com.n2n.tcplus.function.MarginableInfo"%>
<%@page import="com.n2n.tcplus.misc.N2NUtil"%>
<%@page import="com.n2n.tcplus.atp.TestATP"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.Enumeration"%>
<%@page import="java.io.File"%>
<%@page import="com.n2n.tcplus.atp.misc.ATPUtil"%>
<%@page import="com.n2n.tcplus.session.HTTPSessionManager"%>
<%@page import="com.n2n.tcplus.session.SessionManager"%>
<%@page import="com.n2n.tcplus.session.HTTPSessionManager"%>
<%@page import="com.n2n.tcplus.atp.ATPSocketManager"%>
<%@page import="com.n2n.tcplus.atp.ATPSocket"%>
<%@page import="com.n2n.tcplus.debug.N2NLogUtil"%>
<%@page import="com.n2n.tcplus.info.N2NConstant"%>
<%@page import="com.n2n.tcplus.conf.N2NAuthentication"%>
<%@page import="com.n2n.tcplus.atp.info.ATPConstant"%>
<%@page import="com.n2n.tcplus.misc.RSA"%>
<%@page import="com.n2n.tcplus.atp.ATPTradingInfo"%>
<%@page import="com.n2n.tcplus.atp.ATPLogin"%>
<%@ include file="util/xssCheck.jsp" %>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">
<%!
    public void loadFiles(HttpSession sess) throws Exception {
		String sLoginId =(String) sess.getAttribute("user");
		
        //java.io.FileInputStream fin = new java.io.FileInputStream(new java.io.File("C:/Documents and Settings/angelinelum/Desktop/sample.dat"));
        java.io.FileInputStream fin = new java.io.FileInputStream(new java.io.File("D:/testing.txt"));
        int available = fin.available();
        if (available > 0) {
            byte[] abt = new byte[available];
            fin.read(abt);
            fin.close();
            
            //N2NLogUtil.logInfo("[MAIN PAGE] raw login message ---> \n" + ATPUtil.byteToString(abt) , sLoginId);
            sess.setAttribute("rawLoginMessage", ATPUtil.byteToString(abt));
        }
	
    }

	public N2NAuthentication getAuthentication(HttpSession sess) {
        // create authen object
        N2NAuthentication n2nAuthen = null;
        try {
            if (sess.getAttribute("lms") == null) {
            	n2nAuthen = new N2NAuthentication();
            	n2nAuthen.setBrokerTradingMode("atp");
                sess.setAttribute("lms", n2nAuthen);	
            }
        } catch (Exception e) {
			N2NLogUtil.logError(e, "TcliteLogin");
        }
        return n2nAuthen;
	}

	public boolean loginTcLite(HttpSession sess) {
		try {
			return LoginUtil.processLoginMessage(sess, false);
		} catch (Exception e) {
			N2NLogUtil.logError(e, "TcliteLogin");
		}
		return false;
	}
	
	public void logoutTcLite(HttpSession sess) {
		HTTPSessionManager.removeTcLiteLoginAttributes(sess);
	}
	
	public void debugSession(HttpSession sess) {
		Enumeration en = sess.getAttributeNames();
		
		while(en.hasMoreElements()) {
			Object object = en.nextElement();
			if (object != null) {
				String name = (String)object;
				System.out.println(name + "-->"  + sess.getAttribute(name));
			}
		}
	}
	
	/*
	public void removeAttributes(HttpSession sess) {
		try {
			if (sess.getAttribute("atp") != null) {
				ATPSocketManager.closeSocket(sess);
			}
			if (sess.getAttribute("socket") != null) {
				SocketManager.closeSocket(sess);
			}
			
			Heartbeat hb = (Heartbeat)sess.getAttribute("keepalive");
			if (hb != null) {
			    hb.stop();
			    hb = null;
			    sess.removeAttribute("keepalive");
			}
			
			N2NAuthentication authentication = (N2NAuthentication) sess.getAttribute("lms");
			if (authentication != null) {
				authentication = null;
				sess.removeAttribute("lms");
			}

        	if (sess.getAttribute("tcliteKey") != null) {
        		sess.removeAttribute("tcliteKey");
        	}
        	
        	if (sess.getAttribute("beaconsub") != null) {
        		sess.removeAttribute("beaconsub");
        	}
		} catch (Exception e) {
			N2NLogUtil.logError(e, "TcliteLogin");
		}
	}*/
%>
<%
String sLoginId = checkParamXSS(request.getParameter("user"), "", 15, 4);
String sRelogin = checkParamXSS(request.getParameter("relogin"), "", 5, 4);


//OSK
String sSector = checkParamXSS(request.getParameter("sector"), "", 8, 4);
String sWarrantCat = "";
if(sSector == null){
	sSector = "";
}
else {
	sSector = sSector.trim().equals("") ? "" : sSector.trim();

	if(sSector.equalsIgnoreCase("2203")){
		sWarrantCat = "S";
	}else if(sSector.equalsIgnoreCase("9994")){
		sWarrantCat = "C";
	}
}

//Language
String sLanguage = checkParamXSS(request.getParameter("lang"), "", 5, 4);
if(sLanguage == null){
	sLanguage = "";
}
else {
	sLanguage = sLanguage.trim().equals("") ? "" : sLanguage.trim();
}

//default exchange
String sDefaultExchange = checkParamXSS(request.getParameter("defEx"), "", 5, 4);
if(sDefaultExchange == null){
	sDefaultExchange = "";
}
else {
	sDefaultExchange = sDefaultExchange.trim().equals("") ? "" : sDefaultExchange.trim();
}

// Search key
String sSearchKey = checkParamXSS(request.getParameter("stk"), "", 30, 4);
if (sSearchKey == null) {
    sSearchKey = "";
}

// View 
String sView = checkParamXSS(request.getParameter("view"), "", 10, 4);
Boolean confMobileView = Boolean.parseBoolean(N2NConstant.getConstant("confMobileView", "false"));
if (!confMobileView) {
    sView = null;
}
if(sView==null){
    sView = "";
}else{
    sView = sView.trim().toLowerCase();
}

String isBasic = request.getParameter("basic");
boolean isBasicVer = false;
if(isBasic != null){
	if(isBasic.equalsIgnoreCase("Y")){
		isBasicVer = true;	
	}
}

String sAppName = N2NConstant.getConstant("constAppName", "TCPlus");
if (sView.equals("mobile")) {
    sAppName = N2NConstant.getConstant("constMbAppName", "TCMobile");
}

N2NLogUtil.initiateSystemLogger();

N2NLogUtil.logInfo("[MAIN PAGE] loginId ---> " + sLoginId, sLoginId);
N2NLogUtil.logInfo("[MAIN PAGE] is relogin ---> " + sRelogin, sLoginId);


if ("true".equals(sRelogin)) {
	boolean b = com.n2n.tcplus.atp.TestATP.login();
	response.sendRedirect("http://localhost:8080/tcplus/main.jsp");
	
	return;
}

//HttpSession sess = request.getSession();
//N2NLogUtil.logInfo("[MAIN PAGE][" + sLoginId + "] Session is New ---> " + sess.isNew(), sLoginId);


//debugSession(sess);

// # [START] Deployment Pack - for Integration with WMS [TRUE will auto append ../ else FALSE will not do anything]
String sWMSServer 	= N2NConstant.getConstant("confWMSServer", "TRUE");
String sAddPath = "";
boolean haveATP = true;
String sDWRPath = "dwr/engine.js";
if (sWMSServer.equalsIgnoreCase("TRUE")) {	// under TRUE cases all calling to backend need add ../
	sAddPath = "../";
    // sDWRPath = "../dwr/engine.js";
} else {
	// internal testing use
	sLoginId = TestATP.sLoginID;	
}
// # [END] Deployment Pack - for Integration with WMS [TRUE will auto append ../ else FALSE will not do anything]

N2NLogUtil.logInfo("[MAIN PAGE] is on WMS Server ---> " + sWMSServer, sLoginId);

haveATP = N2NConstant.getConstant("confHaveATP").trim().equals( "" )  ? true : ( N2NConstant.getConstant("confHaveATP").trim().toLowerCase().equals( "false" ) ? false : true );
N2NLogUtil.logInfo("[MAIN PAGE] have ATP ---> " + haveATP, sLoginId);

boolean loginTcLiteSuccess = false;
String sErrMsg = "";
boolean isGuest = false;

if ( haveATP ) {
			
	boolean bLoadFile = false;
	if (sLoginId == null || sLoginId.length() == 0) {
		sLoginId = (String) session.getAttribute("loginid");
	} else {
		bLoadFile = true;
	}
	if (session.getAttribute("loginFromSelf") != null) {
		if (  session.getAttribute("loginFromSelf").toString().equals("true") ) {
			bLoadFile = false;
		}
	}
	sess.setAttribute("user", sLoginId);
	
	N2NLogUtil.logInfo("\n \n # # # # # # # # START # # # # # # # #" + sLoginId, sLoginId);
	N2NLogUtil.logInfo("[MAIN PAGE] set UserID session attribute ---> " + sLoginId, sLoginId);
	//N2NLogUtil.logInfo("[MAIN PAGE] load login info by txt file ---> " + bLoadFile, sLoginId);
	
	loginTcLiteSuccess = false;
	
	if (sess != null) {
		try {
			if (bLoadFile) 
				loadFiles(sess); // simulate tcweb login
				
		} catch (Exception e) {
			N2NLogUtil.logError(e, "TcliteLogin");
		}
	
		N2NLogUtil.logInfo("[MAIN PAGE] generate login info : start *****", sLoginId);
		
		loginTcLiteSuccess = loginTcLite(sess);
	
		N2NLogUtil.logInfo("[MAIN PAGE] login to tclite --- > " + loginTcLiteSuccess , sLoginId);
		N2NLogUtil.logInfo("[MAIN PAGE] generate login info : end ***** ", sLoginId);
		
		if ( loginTcLiteSuccess ) {
			HTTPSessionManager.insertSession(sLoginId, sess);
			N2NLogUtil.logInfo("[MAIN PAGE] login successfully. \n\n\n\n", sLoginId);
			
		} else {
			N2NLogUtil.logError("[MAIN PAGE] login failed. " + sErrMsg, sLoginId);
			ATPSocket atpSocket = ATPSocketManager.getSocket(sess);
			
			if (atpSocket != null && atpSocket.getATPTradingInfo() != null) {
				sErrMsg = atpSocket.getATPTradingInfo().getLoginErrorMessage();
				N2NLogUtil.logError("[MAIN PAGE] login failed : error message --- > " + sErrMsg, sLoginId);
			}
			
			logoutTcLite(sess);
			N2NLogUtil.logError("[MAIN PAGE] login failed. process logout. \n\n\n\n", sLoginId);
			
			//sess.setAttribute("tcliteErrMsg", sErrMsg);
			//response.sendRedirect("http://fraser.ebrokerconnect.com/gcsg/loginATP?action=logout&frm_path=login1&frmpath=lite");
		}
	}

} else {
	
	sLoginId = "MMS_TcLite_" + sess.getId();
	
	loginTcLiteSuccess = true;
	HTTPSessionManager.insertSession(sLoginId, sess);
	
	sess.setAttribute( "user", sLoginId );
        
	isGuest = true;
}


Boolean confFrontDebug = Boolean.parseBoolean(N2NConstant.getConstant("confFrontDebug", "false"));
Boolean confLoadDebug = Boolean.parseBoolean(N2NConstant.getConstant("confLoadDebug", "false"));
Boolean confMinify = Boolean.parseBoolean(N2NConstant.getConstant("confMinify", "false"));
Boolean confSenchaCmd = Boolean.parseBoolean(N2NConstant.getConstant("confSenchaCmd", "false"));
String sSwitchView = "FALSE";
if (confMobileView) {
    sSwitchView = N2NConstant.getConstant("confSwitchView", "TRUE").toLowerCase();
}
boolean confUseViewURL = Boolean.parseBoolean(N2NConstant.getConstant("confUseViewURL", "false"));
String confMobileViewURL = N2NConstant.getConstant("confMobileViewURL");
String confDesktopViewURL = N2NConstant.getConstant("confDesktopViewURL");
String confHeaderLogo = N2NConstant.getConstant("confHeaderLogo");
String confFooterLogo = N2NConstant.getConstant("confFooterLogo");
String sVersion = N2NConstant.getConstant("constVersion");
String sSponsor = "";
String sTemp = "";
try {
    sSponsor = N2NConstant.getConstant("confSponsorID");
} catch (Exception e) {
    sSponsor = null;
}

//Header for Alert Message
String sPopUpHeader = N2NConstant.getConstant("confPopUpHeader");

// PortFolio Disclaimer is share session with TCWeb
String sPortFolioDisclaimerSessionShare = N2NConstant.getConstant("portFolioDisclaimerSessionShare", "FALSE");

// Enable / Disable on Balance Limit & Net Cash Limit label [EquityPortfolio / Order Status]
String sShowBalnNetCashLimit = N2NConstant.getConstant("confShowBalanceNetCashLimit", "TRUE");
		

//# [order status] - show date time format - start
String sOrderStatusDateFormat = N2NConstant.getConstant("confOrderStatusDateFormat", "Y-m-d H:i:s");
//# [order status] - show date time format - end

//# [tclite] - date / time format - start
String sTcliteDateFormat = N2NConstant.getConstant("confDateFormat", "d-m-Y");
String sTcliteTimeFormat = N2NConstant.getConstant("confTimeFormat", "H:i:s");
String sTcliteDateHidden = N2NConstant.getConstant("confDateHidden", "FALSE");
//# [tclite] - date / time format - end


// SIP message required for AmFraser
String sShowSIPMsg = N2NConstant.getConstant("confShowSIPMsg", "FALSE");

// Currency to show via [TRUE - Default + QC + ATP and FALSE - QC + ATP + Default]
String showDefaultCurrency = N2NConstant.getConstant("confShowDefaultCurrency", "FALSE");

// Corporate Stock News
Boolean confCorporateStockNewsAlert = Boolean.parseBoolean(N2NConstant.getConstant("confCorporateStockNewsAlert", "false"));
String confCorporateStockNewsUrl = N2NConstant.getConstant("confCorporateStockNewsUrl");
String confElasticNewsUrl = N2NConstant.getConstant("confElasticNewsUrl");
String confNikkeiNewsUrl = N2NConstant.getConstant("confNikkeiNewsUrl");

// Margin info (Extra 3 columns  [1]Marginable [2]Margin Price [3]Margin Perc.)
String sShowMargin = N2NConstant.getConstant("confShowMargin", "FALSE");

// For jQC [Java QC] need manually enable this feature
String sDisplayCreditType = N2NConstant.getConstant("confDisplayTypeLimit", "");


//For jQC [Java QC] need manually enable this feature
String ISjQC = N2NConstant.getConstant("confIsJQC", "TRUE");


//For quote screen searching sorting by name or code first
String sQSSortingBy = N2NConstant.getConstant("confQSSortingBy", "CODE");

String sQuoteScreenSize = N2NConstant.getConstant("confQuoteScreenRecord", "30");
String sQuotePagingPanel = N2NConstant.getConstant("conFQuotePagingPanel", "top");
String sQuoteSizeFollowSetting = N2NConstant.getConstant("conFQuoteSizeFollowSetting", "false");
String sMarketRefreshTime = N2NConstant.getConstant("confMarketRefreshTime", "");
String sQuoteScreenCrossSearch = N2NConstant.getConstant("confQuoteScreenCrossSearch", "false");

String sMenuFontSize = N2NConstant.getConstant("confMenuFontSize", "12");

boolean confDockableOrderpad = Boolean.parseBoolean(N2NConstant.getConstant("confDockableOrderpad", "false"));
boolean confChgOBColours = Boolean.parseBoolean(N2NConstant.getConstant("confChgOBColours", "false"));
boolean confOrderpadPopup = Boolean.parseBoolean(N2NConstant.getConstant("confOrderpadPopup", "false"));

String confQuickSearchExcludeBoards = N2NConstant.getConstant("confQuickSearchExcludeBoards", "17,18,2000");

boolean confSortExchangeList = Boolean.parseBoolean(N2NConstant.getConstant("confSortExchangeList", "false"));
boolean confOrderRoundQty = Boolean.parseBoolean(N2NConstant.getConstant("confOrderRoundQty", "false"));
boolean confAutoWidthButton = Boolean.parseBoolean(N2NConstant.getConstant("confAutoWidthButton", "true"));
String constExGroupingList = N2NConstant.getConstant("constExGroupingList", "");
String confGuestEx = N2NConstant.getConstant("confGuestEx");

//v1.3.34.4
String sMaxWatchlistCreate = N2NConstant.getConstant("confMaxWatchlistCreate", "999");
String confMaxOpenWatchlist = N2NConstant.getConstant("confMaxOpenWatchlist", "-1");
String sMaxStockInWatchlist = N2NConstant.getConstant("confMaxStockInWatchlist", "9999"); //1.3.34.5

//v1.3.34.45
String sCheckIsAliveTimer = N2NConstant.getConstant("confCheckIsAliveTimer", "60");

// [START] set theme color
String sThemeColor = N2NConstant.getConstant("confThemeColor", "wh");
String sThemeBackgroundColor = N2NConstant.getConstant("confThemeBackgroundColor", "black");
// [END] set theme color

// [START] display tracker record
String confTrackerRecord = N2NConstant.getConstant("confTrackerRecord", "FALSE"); 
String confTrackerRecordTotalRecord = N2NConstant.getConstant("confTrackerRecordTotalRecord", "-1"); 
boolean confTrackerRecordDisplayCode = Boolean.parseBoolean(N2NConstant.getConstant("confTrackerRecordDisplayCode", "false")); 
boolean confTrackerRecordV2 = Boolean.parseBoolean(N2NConstant.getConstant("confTrackerRecordV2", "false")); 
// [END] display tracker record

String sShowBuySellHeader = N2NConstant.getConstant("confFeaturesBuySell_Header", "TRUE");

String sShowWatchListHeader = N2NConstant.getConstant("confFeaturesWatchList_Header", "TRUE");
String sShowWatchListView = N2NConstant.getConstant("confFeaturesWatchList_View", "TRUE");
String sShowWatchListCreate = N2NConstant.getConstant("confFeaturesWatchList_Create", "TRUE");
String sShowWatchListRename = N2NConstant.getConstant("confFeaturesWatchList_Rename", "TRUE");
String sShowWatchListDelete = N2NConstant.getConstant("confFeaturesWatchList_Delete", "TRUE");

String sShowStkInfoHeader = N2NConstant.getConstant("confFeaturesStockInfo_Header", "TRUE");
String sShowStkInfoStkInfo = N2NConstant.getConstant("confFeaturesStockInfo_StockInfo", "TRUE");
boolean confFeaturesHistoricalData = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesHistoricalData", "false"));
boolean confFeaturesHistoricalData_Periodicity = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesHistoricalData_Periodicity", "true"));
boolean confFeaturesHistoricalData_Load = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesHistoricalData_Load", "true"));
String sShowStkInfoMarketDepth = N2NConstant.getConstant("confFeaturesStockInfo_MarketDepth", "TRUE");
String sShowMktDepthTotal = N2NConstant.getConstant("confShowMktDepthTotal", "TRUE");
String sShowStkInfoMarketMatrixDepth = N2NConstant.getConstant("confFeaturesStockInfo_MarketDepthMatrix", "FALSE");
String confFeaturesDepthMatrix_MaxRow = N2NConstant.getConstant("confFeaturesDepthMatrix_MaxRow", "4");
String confFeaturesDepthMatrix_MaxCol = N2NConstant.getConstant("confFeaturesDepthMatrix_MaxCol", "4");
String confFeaturesDepthMatrix_MinRow = N2NConstant.getConstant("confFeaturesDepthMatrix_MinRow", "2");
String confFeaturesDepthMatrix_MinCol = N2NConstant.getConstant("confFeaturesDepthMatrix_MinCol", "2");

String sShowStkInfoTracker = N2NConstant.getConstant("confFeaturesStockInfo_Tracker", "TRUE");
String sShowStkInfoTrackerBusinessDone = N2NConstant.getConstant("confFeaturesStockInfo_TrackerBusinessDone", "FALSE");
Boolean confFeaturesStockInfo_Tracker3Pies = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesStockInfo_Tracker3Pies", "false"));
String sShowStkInfoEquitiesTracker = N2NConstant.getConstant("confFeaturesStockInfo_EquitiesTracker", "FALSE");
String confMsg_ET = N2NConstant.getConstant("confMsg_ET", "Equities Tracker");

String sShowChartHeader = N2NConstant.getConstant("confFeaturesChart_Header", "TRUE");
String sShowChartIntradayChart = N2NConstant.getConstant("confFeaturesChart_IntradayChart", "TRUE");
String sShowChartAnalysisChart = N2NConstant.getConstant("confFeaturesChart_AnalysisChart", "TRUE");
String sShowChartAnalysisChartAsFlash = N2NConstant.getConstant("confFeaturesChart_AnalysisChartAsFlash", "FALSE");
String sShowChartITFinanceChart = N2NConstant.getConstant("confFeaturesChart_ITFinanceChart", "FALSE");

String sShowNewsHeader = N2NConstant.getConstant("confFeaturesNews_Header", "TRUE");
String sShowNewsAnnouncements = N2NConstant.getConstant("confFeaturesNews_Announcements", "TRUE");
String sShowNewsStockNews = N2NConstant.getConstant("confFeaturesNews_StockNews", "TRUE");
boolean constNewsSearchPopup = Boolean.parseBoolean(N2NConstant.getConstant("constNewsSearchPopup", "false"));
boolean confFeaturesNews_Archive = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesNews_Archive", "false"));
boolean confFeaturesNews_Archive_GeneralNews = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesNews_Archive_GeneralNews", "false"));

/* Fundamental data */
boolean confFeaturesNews_FundamentalCPIQ = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesNews_FundamentalCPIQ", "false"));
boolean confFeaturesNews_FundamentalThomsonReuters = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesNews_FundamentalThomsonReuters", "false"));
boolean confFeaturesNews_FundamentalScreenerCPIQ = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesNews_FundamentalScreenerCPIQ", "false"));
boolean confFeaturesNews_FundamentalScreenerThomsonReuters = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesNews_FundamentalScreenerThomsonReuters", "false"));
String constFundamentalURL = N2NConstant.getConstant("constFundamentalURL");
String constFundamentalScreenerURL = N2NConstant.getConstant("constFundamentalScreenerURL");

// mobile
boolean confMbFeaturesNews_FundamentalCPIQ = Boolean.parseBoolean(N2NConstant.getConstant("confMbFeaturesNews_FundamentalCPIQ", "false"));
boolean confMbFeaturesNews_FundamentalThomsonReuters = Boolean.parseBoolean(N2NConstant.getConstant("confMbFeaturesNews_FundamentalThomsonReuters", "false"));
boolean confMbFeaturesNews_FundamentalScreenerCPIQ = Boolean.parseBoolean(N2NConstant.getConstant("confMbFeaturesNews_FundamentalScreenerCPIQ", "false"));
boolean confMbFeaturesNews_FundamentalScreenerThomsonReuters = Boolean.parseBoolean(N2NConstant.getConstant("confMbFeaturesNews_FundamentalScreenerThomsonReuters", "false"));
String confMbFundamentalURL = N2NConstant.getConstant("confMbFundamentalURL");
String confMbFundamentalFiRepURL = N2NConstant.getConstant("confMbFundamentalFiRepURL");
boolean confMbFeaturesNews_SPCapIQ = Boolean.parseBoolean(N2NConstant.getConstant("confMbFeaturesNews_SPCapIQ", "false"));
boolean confMbFeaturesNews_SPCapIQ_Synopsis = Boolean.parseBoolean(N2NConstant.getConstant("confMbFeaturesNews_SPCapIQ_Synopsis", "false"));
boolean confMbFeaturesNews_SPCapIQ_ComInfo = Boolean.parseBoolean(N2NConstant.getConstant("confMbFeaturesNews_SPCapIQ_ComInfo", "false"));
boolean confMbFeaturesNews_SPCapIQ_Announcement = Boolean.parseBoolean(N2NConstant.getConstant("confMbFeaturesNews_SPCapIQ_Announcement", "false"));
boolean confMbFeaturesNews_SPCapIQ_KeyPersons = Boolean.parseBoolean(N2NConstant.getConstant("confMbFeaturesNews_SPCapIQ_KeyPersons", "false"));
boolean confMbFeaturesNews_SPCapIQ_ShareSum = Boolean.parseBoolean(N2NConstant.getConstant("confMbFeaturesNews_SPCapIQ_ShareSum", "false"));
boolean confMbFeaturesNews_SPCapIQ_FiReports = Boolean.parseBoolean(N2NConstant.getConstant("confMbFeaturesNews_SPCapIQ_FiReports", "false"));

String constFundamentalCapitalIQ = N2NConstant.getConstant("constFundamentalCapitalIQ");
String constFundamentalCapitalIQType = N2NConstant.getConstant("constFundamentalCapitalIQType", "1");
String constFundamentalCapitalIQScreenerType = N2NConstant.getConstant("constFundamentalCapitalIQScreenerType", "2");
String constFundamentalThomsonReuters = N2NConstant.getConstant("constFundamentalThomsonReuters");
String constFundamentalThomsonReutersType = N2NConstant.getConstant("constFundamentalThomsonReutersType", "1");
String constFundamentalThomsonReutersScreenerType = N2NConstant.getConstant("constFundamentalThomsonReutersScreenerType", "2");
String confFundamentalSponsor = N2NConstant.getConstant("confFundamentalSponsorMapping_"+sSponsor);
String constFundamentalExchg = N2NConstant.getConstant("constFundamentalExchg");

String sShowWarrantsInfo = N2NConstant.getConstant("confFeatures_WarrantsInfo", "FALSE");

String sShowMarketHeader = N2NConstant.getConstant("confFeaturesMarket_Header", "TRUE");
String sShowMarketSummary = N2NConstant.getConstant("confFeaturesMarket_Summary", "TRUE");
String sShowMarketIndices = N2NConstant.getConstant("confFeaturesMarket_Indices", "TRUE");
String sShowMarketScoreBoard = N2NConstant.getConstant("confFeaturesMarket_ScoreBoard", "TRUE");
String sShowMarketSummaryGraph = N2NConstant.getConstant("confFeaturesMarket_SummaryGraph", "TRUE");
String sShowMarketStreamer = N2NConstant.getConstant("confFeaturesMarket_Streamer", "FALSE");
boolean confFeaturesMarket_Streamer_DisplayCode = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesMarket_Streamer_DisplayCode", "false"));
boolean confFeaturesMarketSummary_PieChart = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesMarketSummary_PieChart", "true"));
String sShowMarketWorldIndices = N2NConstant.getConstant("confFeaturesMarket_WorldIndices", "FALSE");
boolean confWorldIndices = Boolean.parseBoolean(N2NConstant.getConstant("confWorldIndices", "false"));

String sShowOrdBookHeader = N2NConstant.getConstant("confFeaturesOrderBook_Header", "TRUE");
String sShowOrdBookOrderSts = N2NConstant.getConstant("confFeaturesOrderBook_OrderStatus", "TRUE");
String sShowOrdBookOrderHistory = N2NConstant.getConstant("confFeaturesOrderBook_OrderHistory", "TRUE");
String sShowOrdBookOrderLog = N2NConstant.getConstant("confFeaturesOrderBook_OrderLog", "TRUE");
String sShowOrdBookOrderDetails = N2NConstant.getConstant("confFeaturesOrderBook_OrderDetails", "TRUE");
String sShowOrdBookOrderPosition = N2NConstant.getConstant("confFeaturesOrderBook_OrderPosition", "FALSE");

String sShowWebReportHeader = N2NConstant.getConstant("confFeaturesWebReport_Header", "FALSE");
String sShowForeignFlows = N2NConstant.getConstant("confFeaturesForeignFlows", "FALSE");
boolean confFeaturesBrokerInfo = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesBrokerInfo", "false"));
String constBrokerInfoInterval = N2NConstant.getConstant("constBrokerInfoInterval", "30000");

/* not using anymore, control by Web Report URL
sTemp = N2NConstant.getConstant("confFeaturesWebReport_ClientSummary").trim();
String sShowWebReportClientSummary = ((!sTemp.equals("")) ? sTemp : "FALSE" );
sTemp = N2NConstant.getConstant("confFeaturesWebReport_MonthlyStatement").trim();
String sShowWebReportMonthlyStatement = ((!sTemp.equals("")) ? sTemp : "FALSE" );
sTemp = N2NConstant.getConstant("confFeaturesWebReport_MarginAccountSummary").trim();
String sShowWebReportMarginAccountSummary = ((!sTemp.equals("")) ? sTemp : "FALSE" );
sTemp = N2NConstant.getConstant("confFeaturesWebReport_TraderDepositReport").trim();
String sShowWebReportTraderDepositReport = ((!sTemp.equals("")) ? sTemp : "FALSE" );
sTemp = N2NConstant.getConstant("confFeaturesWebReport_TradeBeyondReport").trim();
String sShowWebReportTradeBeyondReport = ((!sTemp.equals("")) ? sTemp : "FALSE" );
sTemp = N2NConstant.getConstant("confFeaturesWebReport_eContract").trim();
String sShowWebReporteContract = ((!sTemp.equals("")) ? sTemp : "FALSE" );
sTemp = N2NConstant.getConstant("confFeaturesWebReport_AISBeStatement").trim();
String sShowWebReportAISBeStatement = ((!sTemp.equals("")) ? sTemp : "FALSE" );
sTemp = N2NConstant.getConstant("confFeaturesWebReport_MarginPortFolioValuation").trim();
String sShowMarginPortFolioValuation = ((!sTemp.equals("")) ? sTemp : "FALSE" );
sTemp = N2NConstant.getConstant("confFeaturesWebReport_TransactionMovement").trim();
String sShowTransactionMovement = ((!sTemp.equals("")) ? sTemp : "FALSE" );
sTemp = N2NConstant.getConstant("confFeaturesWebReport_StockBalance").trim();
String sShowStockBalance = ((!sTemp.equals("")) ? sTemp : "FALSE" );
String sClientTransactionStatement  = ( ( N2NConstant.getConstant("confFeaturesWebReport_ClientTransactionStatement").trim().equals("") ) ? "FALSE" : N2NConstant.getConstant("confFeaturesWebReport_ClientTransactionStatement").trim() );
*/

/* Analysis */
Boolean confFeaturesAnalysis_Header = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesAnalysis_Header", "false"));
Boolean confFeaturesAnalysis_Dividend = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesAnalysis_Dividend", "false"));
Boolean confFeaturesAnalysis_Warrants = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesAnalysis_Warrants", "false"));
Boolean confFeaturesAnalysis_BMFutures = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesAnalysis_BMFutures", "false"));

String sShowSettingHeader = N2NConstant.getConstant("confFeaturesSetting_Header", "TRUE");
String sShowSettingStockAlert = N2NConstant.getConstant("confFeaturesSetting_StockAlert", "TRUE");
// Add Stock Alert
boolean confFeaturesSetting_AddStockAlert = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesSetting_AddStockAlert", "true"));
String sShowSettingAddStockAlert = N2NConstant.getConstant("confFeaturesSetting_AddStockAlert", "TRUE");

// Price alert
Boolean confFeaturesSetting_PriceAlert = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesSetting_PriceAlert", "false"));

String sShowSettingPersonalizationTheme = N2NConstant.getConstant("confFeaturesSetting_PersonalizationTheme", "FALSE");

String sShowPortFolioHeader = N2NConstant.getConstant("confFeaturesPortFolio_Header", "TRUE");

String sShowPortFolioDerivativePortFolio = N2NConstant.getConstant("confFeaturesPortFolio_DerivativePortFolio", "FALSE");
String sShowPortFolioDerivativePortFolioDetail = N2NConstant.getConstant("confFeaturesPortFolio_DerivativePortFolioDetail", "FALSE");

String sShowPortFolioMyPortFolio = N2NConstant.getConstant("confFeaturesPortFolio_MyPortFolio", "TRUE");
String sShowPortFolioManualPortFolio = N2NConstant.getConstant("confFeaturesPortFolio_ManualPortFolio", "FALSE");
String sShowPortFolioRealizedGainLoss = N2NConstant.getConstant("confFeaturesPortFolio_RealizedGainLoss", "TRUE");

String sShowPortFolioDetail = N2NConstant.getConstant("confFeaturesPortFolio_Detail", "TRUE");
String sShowPortFolioDetailAdd = N2NConstant.getConstant("confFeaturesPortFolio_Detail_Add", "FALSE");
String sShowPortFolioDetailDelete = N2NConstant.getConstant("confFeaturesPortFolio_Detail_Delete", "FALSE");
String sShowPortFolioDetailUpdate = N2NConstant.getConstant("confFeaturesPortFolio_Detail_Update", "FALSE");

String sShowPortFolioManualDetail = N2NConstant.getConstant("confFeaturesManualPortFolio_Detail", "FALSE");
String sShowPortFolioManualDetailAdd = N2NConstant.getConstant("confFeaturesManualPortFolio_Detail_Add", "FALSE");
String sShowPortFolioManualDetailDelete = N2NConstant.getConstant("confFeaturesManualPortFolio_Detail_Update", "FALSE");
String sShowPortFolioManualDetailUpdate = N2NConstant.getConstant("confFeaturesManualPortFolio_Detail_Delete", "FALSE");

String sShowMigratedPortFolioHeader = N2NConstant.getConstant("confMigratedPortfolio_Header", "FALSE");
String sShowMigratedPortFolioDetail = N2NConstant.getConstant("confMigratedPortfolio_PortFolioDetail", "FALSE");
String sShowMigratedPortFolioRealized = N2NConstant.getConstant("confMigratedPortfolio_PortFolioRealized", "FALSE");

String sPrtfOrderType = N2NConstant.getConstant("confPrtfOrderType", "");

String sShowOtherToolHeader = N2NConstant.getConstant("confOtherTool_Header", "FALSE");
String sShowOtherToolStockFilter = N2NConstant.getConstant("confOtherTool_StockFilter", "FALSE");
String sShowOtherToolExchangeRate = N2NConstant.getConstant("confOtherTool_ExchangeRate", "FALSE");

String sShowExchangeHeader = N2NConstant.getConstant("confFeaturesExchange_Header", "TRUE");

String sShowUnitHeader = N2NConstant.getConstant("confFeaturesUnit_Header", "FALSE");
String sDefaultDisplay = N2NConstant.getConstant("confDefaultDisplay", "unit");

String sShowFullScreen =  N2NConstant.getConstant("confFeatureFullScreen", "FALSE");

// v1.3.30.21 Add emo Chat header
String sShowEmoChatHeader = N2NConstant.getConstant("confFeaturesEmoChat_Header", "FALSE");


/* calculator setting */
Boolean confFeaturesCalculator_Header = Boolean.parseBoolean(N2NConstant.getConstant("confFeaturesCalculator_Header", "true"));
Boolean confCalculatorBreakeven = Boolean.parseBoolean(N2NConstant.getConstant("confCalculatorBreakeven", "true"));
Boolean confCalculatorPEREPS = Boolean.parseBoolean(N2NConstant.getConstant("confCalculatorPEREPS", "true"));
Boolean confTradeCalculator = Boolean.parseBoolean(N2NConstant.getConstant("confTradeCalculator", "false"));
String confCalculatorURL = N2NConstant.getConstant("confCalculatorURL");
String confCalculatorLabel = N2NConstant.getConstant("confCalculatorLabel", "Calculator");

String sLogoutButton = N2NConstant.getConstant("confLogoutButton", "FALSE");
// [END] TCLite Features Control to replace confUseBackWardv1


// v1.3.33.8 Set is allow user store column info in cookie
String sAllowCookie = N2NConstant.getConstant("confAllowCookie", "TRUE");

//susan 20130413 - added for OSK
//String sShowColSettingHeader=((N2NConstant.getConstant("confColumnSetting_Header").trim().equals("")) ? "TRUE" : N2NConstant.getConstant("confColumnSetting_Header").trim());
 String sShowColSettingHeader=N2NConstant.getConstant("confColumnSetting_Header", "TRUE");
String sShowSortByTopHeader=N2NConstant.getConstant("confSortByTop_Header", "TRUE");
String sShowSortBySectorHeader=N2NConstant.getConstant("confSortBySector_Header", "TRUE");
String sShowSortByMarketHeader=N2NConstant.getConstant("confSortByMarket_Header", "TRUE");


// # [START] open new window or tab
String sNewWindow_News = N2NConstant.getConstant("confNewWindow_News", "FALSE");
String sNewWindow_Report = N2NConstant.getConstant("confNewWindow_Report", "FALSE");
Boolean confNewWindow_Analysis = Boolean.parseBoolean(N2NConstant.getConstant("confNewWindow_Analysis", "false"));
Boolean confNewWindow_Other = Boolean.parseBoolean(N2NConstant.getConstant("confNewWindow_Other", "false"));
Boolean confNewWindow_StkFilter = Boolean.parseBoolean(N2NConstant.getConstant("confNewWindow_StkFilter", "true"));
// # [END] open new window or tab


//# [START] Feed Sector filter
String sShowSector = N2NConstant.getConstant("confShowSector", "TRUE");
String sShowButton = N2NConstant.getConstant("confShowSectorButton", "TRUE");
String sFilterSector = N2NConstant.getConstant("confShowFilterSector", "");
//# [END] Feed Sector filter

String confSingleClickMode = N2NConstant.getConstant("confSingleClickMode", "false");

//# [START] Show Export CSV File Button in Quote Screen
String sShowQuoteScreenExportCSV = N2NConstant.getConstant("confShowQuoteScreenExportCSV", "FALSE");
//# [END] Show Export CSV File Button in Quote Screen

//# [START] Right-click Auto Cancel
String sAutoCancel = N2NConstant.getConstant("confAutoCancel", "FALSE");
//# [END] Right-click Auto Cancel

//# [START] Show Trx Fees
String sShowTrxFees = N2NConstant.getConstant("confShowTrxFees", "0");
//# [END] Show Trx Fees

//# [START] Trx Fees Label
String sTrxFeesLabel = N2NConstant.getConstant("constTrxFeesLabel", "To Be Advised");
//# [END] Trx Fees Label

//# [START] Show IPO
String sShowIPO = N2NConstant.getConstant("confShowIPO", "TRUE");
//# [END] Show IPO

//# [START]  Show Order Status Refresh Label
String sShowOrderStatusLabel = N2NConstant.getConstant("confShowOrderStatusLabel", "FALSE");
//# [END]  Show Order Status Refresh Label

//# [START]  Show Payment Code
String sShowPaymentCode = N2NConstant.getConstant("confShowPaymentCode", "FALSE");
//# [END]  Show Payment Code

//# [START] Show extra confirmation order msg
String sShowExtraOrdMsg = N2NConstant.getConstant("confShowExtraOrdMsg", "FALSE");
//# [END] Show extra confirmation order msg

//# [START] Order Status pull interval
String sOrderStsInterval = N2NConstant.getConstant("constOrderStsInterval", "20000");
//# [END]  Order Status pull interval

//# [START] Delayed Indices Exchange List
String sDelayIndicesExList = N2NConstant.getConstant("constDelayIndicesExList", "");
//# [END]  Delayed Indices Exchange List

//# [START] TP Description data 
//# [END] TP Description data

//# [START] Determine Main Menu Items
String sDetermineMainMenuItems = N2NConstant.getConstant("confDetermineMainMenuItems", "");
//# [END] Determine Main Menu Items

//# [START] Show GIF chart based on exchange
String sGifChartExList= N2NConstant.getConstant("constGifChartExList", "");
//# [END] Show GIF chart based on exchange

//# [START] Enable orderpad UI drag&drop
String sEnableOrdPadDD= N2NConstant.getConstant("confEnableOrdPadDD", "FALSE");
//# [END] Enable orderpad UI drag&drop

//# [START] OrderBook set decimal places
String sSetOrderBookDP= N2NConstant.getConstant("confSetOrderBookDP", "3|3");
//# [END] OrderBook set decimal places

//# [START] Dynamic Orderpad column settings
String sOrdPadColWidth= ( ( N2NConstant.getConstant("confOrdPadColWidth").trim() ).equals("") ? "" : N2NConstant.getConstant("confOrdPadColWidth").trim() );
//# [END] Dynamic Orderpad column settings

boolean confMsgBoxCenter = Boolean.parseBoolean(N2NConstant.getConstant("confMsgBoxCenter", "false"));

boolean confAutoQtyRound = Boolean.parseBoolean(N2NConstant.getConstant("confAutoQtyRound", "true"));
boolean confRound10 = Boolean.parseBoolean(N2NConstant.getConstant("confRound10", "false"));

boolean confOrdBookAmal = Boolean.parseBoolean(N2NConstant.getConstant("confOrdBookAmal", "false"));
boolean confOrdBookAmalStatus = Boolean.parseBoolean(N2NConstant.getConstant("confOrdBookAmalStatus", "true"));

boolean confTradeSetting = Boolean.parseBoolean(N2NConstant.getConstant("confTradeSetting", "false"));

boolean confDefaultTradingAccountFeature = Boolean.parseBoolean(N2NConstant.getConstant("confDefaultTradingAccountFeature", "false"));

boolean confTradeAccountOrder = Boolean.parseBoolean(N2NConstant.getConstant("confTradeAccountOrder", "false"));

String confCookieKey = N2NConstant.getConstant("confCookieKey", "v4");

boolean confAllowMax = Boolean.parseBoolean(N2NConstant.getConstant("confAllowMax", "true"));
boolean confLayoutDD = Boolean.parseBoolean(N2NConstant.getConstant("confLayoutDD", "true"));
boolean confStreamOpt = Boolean.parseBoolean(N2NConstant.getConstant("confStreamOpt", "true"));
boolean confDDMenu = Boolean.parseBoolean(N2NConstant.getConstant("confDDMenu", "true"));
boolean confDDComp = Boolean.parseBoolean(N2NConstant.getConstant("confDDComp", "true"));
boolean confDDWlRemove = Boolean.parseBoolean(N2NConstant.getConstant("confDDWlRemove", "false"));
boolean confSumColorBar = Boolean.parseBoolean(N2NConstant.getConstant("confSumColorBar", "true"));
String confOtherMenuName = N2NConstant.getConstant("confOtherMenuName");
String confOtherMenu1 = N2NConstant.getConstant("confOtherMenu1");
String confOtherMenu2 = N2NConstant.getConstant("confOtherMenu2");
String confOtherMenu3 = N2NConstant.getConstant("confOtherMenu3");
String confOtherMenu4 = N2NConstant.getConstant("confOtherMenu4");
String confOtherMenu5 = N2NConstant.getConstant("confOtherMenu5");
String confOtherMenu6 = N2NConstant.getConstant("confOtherMenu6");

boolean confEnableUserPreference = Boolean.parseBoolean(N2NConstant.getConstant("confEnableUserPreference", "true"));

boolean confGridBufferedRenderer = Boolean.parseBoolean(N2NConstant.getConstant("confGridBufferedRenderer", "true"));
String confGridLeadingBufferZone =  N2NConstant.getConstant("confGridLeadingBufferZone", "1");
String confGridTrailingBufferZone =  N2NConstant.getConstant("confGridTrailingBufferZone", "1");

boolean confSaveMappedNames = Boolean.parseBoolean(N2NConstant.getConstant("confSaveMappedNames", "true"));

boolean confShowMenuLabel = Boolean.parseBoolean(N2NConstant.getConstant("confShowMenuLabel", "false"));

boolean confRecentQuote = Boolean.parseBoolean(N2NConstant.getConstant("confRecentQuote", "true"));
String confMaxRecent = N2NConstant.getConstant("confMaxRecent", "20");
String confRecentComp = N2NConstant.getConstant("confRecentComp", "sh,si,tr,md,hd,sn");

boolean confSyncScreen = Boolean.parseBoolean(N2NConstant.getConstant("confSyncScreen", "true"));
String confSyncItems = N2NConstant.getConstant("confSyncItems", "qs,wl,rq,os,oh,dp,ep,rp,md,tr,si,ic,an,hd,sn,wi,td,ms");
String confDefUserSyncItems = N2NConstant.getConstant("confDefUserSyncItems", "qs,wl,rq,md,tr");

String confRequiredLoginUrl = N2NConstant.getConstant("confRequiredLoginUrl").trim();

//# [START] Show Order Type help text
String sShowOTypeHelpText = N2NConstant.getConstant("confShowOTypeHelpText", "FALSE");
//# [END] Show Order Type help text

//# [START] GST % for calculator
String sGSTPerc = N2NConstant.getConstant("constGSTPerc", "6");
//# [END] GST % for calculator

//# [START] Dealer/Remisier search account
boolean confDRSearchAcc = Boolean.parseBoolean(N2NConstant.getConstant("confDRSearchAcc", "false"));
//# [END] Dealer/Remisier search account

//# [START] Show User Guide
String sShowUserGuide = N2NConstant.getConstant("confShowUserGuide", "false");
//# [END] Show User Guide

//# [START] Stock Tracker No Push Update + Pull Interval
String sTrackerUpdate = N2NConstant.getConstant("constTrackerUpdate", "");
//# [END] Stock Tracker No Push Update + Pull Interval

//# [START] RSS
String sRSSIndicator = N2NConstant.getConstant("confRSSIndicator", "FALSE");
//# [END] RSS

//# [START] CUT Supported Exchange
String sCUTSupportedEx = N2NConstant.getConstant("constCUTSupportedEx", "");
//# [END] CUT Supported Exchange

//# [START] Promo Message
String sPromoMessage = N2NConstant.getConstant("constPromoMessage", "");
//# [END] Promo Message

//# [START] Loop Portfolio Record
String sLoopPortfolioRecord = N2NConstant.getConstant("confLoopPortfolioRecord", "FALSE");
//# [END] Loop Portfolio Record

boolean sCFDMenu = Boolean.parseBoolean(N2NConstant.getConstant("confCFDMenu", "false"));
boolean confEnableMSearch = Boolean.parseBoolean(N2NConstant.getConstant("confEnableMSearch", "false"));
boolean confNewMobileFundamental = Boolean.parseBoolean(N2NConstant.getConstant("confNewMobileFundamental", "false"));
boolean confEnableToast = Boolean.parseBoolean(N2NConstant.getConstant("confEnableToast", "true"));

// # [START] Web Menu Settlement
String sShowSettlementMenu = N2NConstant.getConstant("confSettlement", "FALSE");
String sWebMenuESettlementURL = N2NConstant.getConstant("constWebMenuESettlementURL");
String sWebMenuESettlementStatusURL = N2NConstant.getConstant("constWebMenuESettlementStatusURL");
String sWebMenuEDepositURL = N2NConstant.getConstant("constWebMenuEDepositURL");
//# [END] Web Menu Settlement

//# [START] Quote Screen & Watchlist columns 
String sShowColQW_LACP = N2NConstant.getConstant("confColQW_LACP", "TRUE");
String sShowColQW_TOP = N2NConstant.getConstant("confColQW_TOP", "TRUE");
//# [END] Quote Screen & Watchlist columns 

//# [START]Exchange Mapping
String sShowExchangeMapping=N2NConstant.getConstant("confExchangeMapping", "FALSE");
//# [END]Exchange Mapping

//# [START]Rotating Logo
String sShowRotatingLogo=N2NConstant.getConstant("constRotatingLogo", "FALSE");
//# [END]Rotating Logo

// # [START] Warrants Info
String sWarrantsInfoURL = N2NConstant.getConstant("constWarrantsInfoUrl");
//# [END] Fundamental News

// # [START] Check user browser agent
String sUserAgent = request.getHeader("User-Agent").toLowerCase();
// # [END] Check user browser agent

// # [START] AnalysisChart Flash URL (for non-IOS)
String sAnalysisChartFlashURL = N2NConstant.getConstant("constAnalysisChartFlashURL");
// # [END] AnalysisChart Flash URL (for non-IOS)

// # [START] Web Report URL
String sWebReportClientSummaryURL 		= N2NConstant.getConstant("constWebReportClientSummaryURL");
String sWebReportMonthlyStatementURL 	= N2NConstant.getConstant("constWebReportMonthlyStatementURL");
String sWebReportMarginAccountSummaryURL= N2NConstant.getConstant("constWebReportMarginAccountSummaryURL");
String sWebReportTraderDepositReportURL = N2NConstant.getConstant("constWebReportTraderDepositReportURL");
String sWebReportTradeBeyondReportURL 	= N2NConstant.getConstant("constWebReportTradeBeyondReportURL");
String sWebReporteContractURL			= N2NConstant.getConstant("constWebReporteContractURL");
String sWebReportAISBeStatementURL		= N2NConstant.getConstant("constWebReportAISBeStatementURL");
String sWebReportMarginPortFolioValuation	= N2NConstant.getConstant("constWebReportMarginPortFolioValuationURL");
String sWebReportTransactionMovement	= N2NConstant.getConstant("constWebReportTransactionMovementURL");
String sWebReportStockBalance			= N2NConstant.getConstant("constWebReportStockBalanceURL");
String sWebClientTransactionStatement = N2NConstant.getConstant("constWebClientTransactionStatementURL");
// # [END] Web Report URL

// # [START] Analysis URL
String sAnalysisDividendURL 	= N2NConstant.getConstant("confAnalysisDividendURL");
String sAnalysisWarrantsURL 	= N2NConstant.getConstant("confAnalysisWarrantsURL");
String sAnalysisBMFuturesURL 	= N2NConstant.getConstant("confAnalysisBMFuturesURL");
// # [END] Analysis URL

// # [START] Setting URL
String sSettingStockAlertURL 	= N2NConstant.getConstant("confSettingStockAlertURL");
String sSettingAddStockAlertURL = N2NConstant.getConstant("confSettingAddStockAlertURL");
String sSettingSMSStockAlertURL = N2NConstant.getConstant("confSettingSMSStockAlertURL");
// # [END] Setting URL

// # [START] other tool URL
String sOtherToolStockFilterURL 	= N2NConstant.getConstant("confOtherToolStockFilterURL");
String sOtherToolExchangeRateURL 	= N2NConstant.getConstant("confOtherToolExchangeRateURL");
String sOtherToolStockScreenerURL 	= N2NConstant.getConstant("confOtherToolStockScreenerURL");
// # [END] other tool URL

// # [START] other tool URL
String sMigratedPortfolio_PortFolioDetailURL 	= N2NConstant.getConstant("confMigratedPortfolio_PortFolioDetailURL");
String sMigratedPortfolio_PortFolioRealizedURL 	= N2NConstant.getConstant("confMigratedPortfolio_PortFolioRealizedURL");
// # [END] other tool URL

// # [START] Trade Board Restriction [TRUE - allow to trade, FALSE - not allow to trade]
String sTradeBoardRestriction_B = N2NConstant.getConstant("confTradeBoardRestriction_B", "FALSE");
String sTradeBoardRestriction_D = N2NConstant.getConstant("confTradeBoardRestriction_D", "FALSE");
String sTradeBoardRestriction_I = N2NConstant.getConstant("confTradeBoardRestriction_I", "FALSE");
String sTradeBoardRestriction_O = N2NConstant.getConstant("confTradeBoardRestriction_O", "TRUE");

// # Message to display
String sTradeBoardRestrictionB_Msg 	= N2NConstant.getConstant("confTradeBoardRestrictionB_Msg");
String sTradeBoardRestrictionD_Msg 	= N2NConstant.getConstant("confTradeBoardRestrictionD_Msg");
String sTradeBoardRestrictionI_Msg 	= N2NConstant.getConstant("confTradeBoardRestrictionI_Msg");
String sTradeBoardRestrictionO_Msg 	= N2NConstant.getConstant("confTradeBoardRestrictionO_Msg");
// # [END] Trade Board Restriction / Ban / Not allow

// bug - v1.3.14.9
// # [START] Order Pad - StopLimit, MinQty, DisclosedQty, Sett.Curr and Payment
//String sForceDisableStopLimit 		= N2NConstant.getConstant("confForceDisable_StopLimit");
//String sForceDisableMinQty 			= N2NConstant.getConstant("confForceDisable_MinQty");
//String sForceDisableDisclosedQty 	= N2NConstant.getConstant("confForceDisable_DisclosedQty");
//String sForceDisableSettCurr 		= N2NConstant.getConstant("confForceDisable_SettCurr");
//String sForceDisablePayment 		= N2NConstant.getConstant("confForceDisable_Payment");
// # [END] Order Pad - StopLimit, MinQty, DisclosedQty, Sett.Curr and Payment

//[START] Order Pad - Show Default Value //v1.3.32.3
String sShowPrice = N2NConstant.getConstant("confShowPrice", "TRUE");
//[END] Order Pad - Show Default Value


// # [START] Order Pad - payment type setting
String sOrderPadPaymentSetting = N2NConstant.getConstant("sOrderPadPaymentSetting");
// # [END] Order Pad - payment type setting
		
		
// # [START] Order Pad - order pad unit trading
String sOrderPadUnitTrading = N2NConstant.getConstant("confOrderPadUnitsTrading");
// # [END] Order Pad - order pad unit trading
		

// # [START] Show countdown timer //1.3.29.11
String sShowCountdownTimer = N2NConstant.getConstant("confShowTimer", "FALSE");
String sCountdownIdle = N2NConstant.getConstant("confIdleTime", "1800");
String sCountdownTime = N2NConstant.getConstant("confCountDown", "30");
//# [END] Show countdown timer

// # [START] Control of Logout URL
String sLogoutDeviceDetection = N2NConstant.getConstant("confLogoutDeviceDetection", "FALSE");
String sLogoutURLLite 	= "";
if (sView.equals("mobile")) {
    sLogoutURLLite = N2NConstant.getConstant("confMbLogoutURLLite");
} else {
    sLogoutURLLite = N2NConstant.getConstant("confLogoutURLLite");
}
String sLogoutURLOthers 	= N2NConstant.getConstant("confLogoutURLOthers");
// # [END] Control of Logout URL

// # [START] Equities Tracker URL - currently use by APEX
String sEquitiesTrackerURL 	= N2NConstant.getConstant("confEquitiesTrackerURL");
// # [END] Equities Tracker URL - currently use by APEX

// # [START] stock news URL
String sStockNewsURL = N2NConstant.getConstant("constNewsDtlURLFormat");
// # [END] stock news URL

// # [START] PSE stock news URL
String sPSEStockNewsURL = N2NConstant.getConstant("confPSEStockNewsUrl", "");
// # [END] PSE stock news URL

//# [START] Cash Top-Up URL
String sCashTopUpURL = N2NConstant.getConstant("confCashTopUpUrl", "");
//# [END] Cash Top-Up URL

//# [START] IT Finance Chart URL
String sITFinanceChartURL = N2NConstant.getConstant("confITFinanceChartUrl", "");
//# [END] IT Finance Chart URL

//# [START] World Indices URL
String sWorldIndicesURL = N2NConstant.getConstant("confWorldIndicesUrl");
//# [END] World Indices URL

//# [START] User Guide URL
String sUserGuideURL = N2NConstant.getConstant("confUserGuideUrl");
//# [END] User Guide URL

//# [START] CUT FAQ URL
String sCUTFaqURL = N2NConstant.getConstant("confCUTFaqUrl");
//# [END] CUT FAQ URL

//# [START] TheScreener URL
String sTheScreenerURL = N2NConstant.getConstant("confTheScreenerUrl");
//# [END] TheScreener URL

//# [START] PSE Edge URL
String sPSEEdgeURL = N2NConstant.getConstant("confPSEEdgeUrl");
//# [END] PSE Edge URL

// # [START] Order Pad - according to broker house
String showOrderPadSetting = N2NConstant.getConstant("confOrderPadSetting_" + sSponsor, "||||");
//# [END] Order Pad - according to broker house

// # [START] Derivatives Market - according to broker house
String showConfDerivativesMarket = N2NConstant.getConstant("confDerivativesMarket_" + sSponsor, "");
//# [END] Derivatives Market - according to broker house

// # Order Log App ID tooltips 
String sOrdLogToolTip = N2NConstant.getConstant("constOrdLogToolTip", "<b><u> Application Name </u></b> <br/> LP = TCLite <br/>  TW = TCWeb <br/> LM = TCLite Mobile <br/> TC = TCPro");


// # [START] Default column width for different Exchange //v1.3.30.9 //1.3.33.27
String sColumnID = N2NConstant.getConstant("confColumnId");
String sColumnWidthKL = N2NConstant.getConstant("confColumnWidthKL");
String sColumnWidthMY = N2NConstant.getConstant("confColumnWidthMY");
String sColumnWidthHK = N2NConstant.getConstant("confColumnWidthHK");
String sColumnWidthSI = N2NConstant.getConstant("confColumnWidthSI");
String sColumnWidthOther = N2NConstant.getConstant("confColumnWidthOther");

String sMDColumnID = N2NConstant.getConstant("confMDColumnId");
String sMDColumnWidthKL = N2NConstant.getConstant("confMDColumnWidthKL");
String sMDColumnWidthMY = N2NConstant.getConstant("confMDColumnWidthMY");
String sMDColumnWidthHK = N2NConstant.getConstant("confMDColumnWidthHK");
String sMDColumnWidthOther = N2NConstant.getConstant("confMDColumnWidthOther");

String sWLColumnID = N2NConstant.getConstant("confWLColumnId");
String sWLColumnWidth = N2NConstant.getConstant("confWLColumnWidth");

String sOSColumnID = N2NConstant.getConstant("confOSColumnId");
String sOSColumnWidth = N2NConstant.getConstant("confOSColumnWidth");

String sPFColumnID = N2NConstant.getConstant("confPFColumnId");
String sPFColumnWidth = N2NConstant.getConstant("confPFColumnWidth");

String sRGLColumnID = N2NConstant.getConstant("confRGLColumnId");
String sRGLColumnWidth = N2NConstant.getConstant("confRGLColumnWidth");
boolean confIgnoreColWidthConf = Boolean.parseBoolean(N2NConstant.getConstant("confIgnoreColWidthConf", "true"));
// # [END] Default column width for different Exchange

//# [START] Column Setting
String sFeedAllColumn = N2NConstant.getConstant("confFeedAllColumn");
String sFeedDefaultColumn= N2NConstant.getConstant("confFeedDefaultColumn");
		
String sWLAllColumn = N2NConstant.getConstant("confWLAllColumn");
String sWLDefaultColumn= N2NConstant.getConstant("confWLDefaultColumn");

String sOSAllColumn = N2NConstant.getConstant("confOSAllColumn");
String sOSDefaultColumn= N2NConstant.getConstant("confOSDefaultColumn");

String sOHAllColumn = N2NConstant.getConstant("confOHAllColumn");
String sOHDefaultColumn= N2NConstant.getConstant("confOHDefaultColumn");

String sDerivativePFAllColumn = N2NConstant.getConstant("confDerivativePFAllColumn");
String sDerivativePFDefaultColumn= N2NConstant.getConstant("confDerivativePFDefaultColumn");

String sPFAllColumn = N2NConstant.getConstant("confPFAllColumn");
String sPFDefaultColumn= N2NConstant.getConstant("confPFDefaultColumn");

String sRGLAllColumn = N2NConstant.getConstant("confRGLAllColumn");
String sRGLDefaultColumn= N2NConstant.getConstant("confRGLDefaultColumn");

//# [END] Column Setting

// bid size
boolean confUseBidSize = Boolean.parseBoolean(N2NConstant.getConstant("confUseBidSize", "false"));
// price list size
String confPriceListSize = N2NConstant.getConstant("confPriceListSize", "20");

//# [START] N2N Message
//String sUnableConnect = N2NConstant.getMessage("mUnableConnect");
//#[END] N2N Message

//# [START] Warrant Search
String sWarrantSearch = N2NConstant.getConstant("confWarrantSearch", "FALSE");
//#[END] Warrant Search
String sUISetting = N2NConstant.getConstant("confUISetting", "FALSE");

String sBcumScum = N2NConstant.getConstant("confBcumScum", "FALSE");

// Stock chart
String stockChartURL=N2NConstant.getConstant("confStockChartURL");
String embeddedStockChartURL=N2NConstant.getConstant("confEmbeddedStockChartURL");
Boolean confInteractiveChartButton = Boolean.parseBoolean(N2NConstant.getConstant("confInteractiveChartButton", "false"));

String marketDepthAllColumn = N2NConstant.getConstant("confMDAllColumn");
String marketDepthDefaultColumn = N2NConstant.getConstant("confMDDefaultColumn");
String showMDSettingButton = N2NConstant.getConstant("confMDSettingButton", "FALSE");

String showTrackerBrokerName = N2NConstant.getConstant("confTrackerBrokerName", "FALSE");

String showExtjsChart= N2NConstant.getConstant("constExtjsChart", "FALSE");

String showUISettingItem  = N2NConstant.getConstant("confUISettingItem");
String sMDLevel = N2NConstant.getConstant("confMDL_"+sSponsor);
String sBypassMYAccChecking = N2NConstant.getConstant("confBypassMYAccChecking", "FALSE");

// Layout setting
boolean confLayoutSetting = Boolean.parseBoolean(N2NConstant.getConstant("confLayoutSetting", "true"));
String confLayoutSettingItems = N2NConstant.getConstant("confLayoutSettingItems", "2");

// Advanced layout
boolean confSplitScreen = Boolean.parseBoolean(N2NConstant.getConstant("confSplitScreen", "false"));
boolean confConfigScreen = Boolean.parseBoolean(N2NConstant.getConstant("confConfigScreen", "false"));

String constLayoutOptions = N2NConstant.getConstant("constLayoutOptions");
String[] layoutOpts = constLayoutOptions.split(",");
JSONObject defLayoutObj = new JSONObject();

ArrayList<String> avaiLy = new ArrayList<String>();

for (int i = 0; i < layoutOpts.length; i++) {
    String ly = layoutOpts[i].trim();
    if (!ly.isEmpty()) {
        String lyStr = N2NConstant.getConstant("confLayout" + ly);
        defLayoutObj.put(ly, lyStr);
        avaiLy.add(ly);
    }
}

// available layout profiles
boolean confEnableLayoutProfile = Boolean.parseBoolean(N2NConstant.getConstant("confEnableLayoutProfile", "true"));
String confLayoutProfiles = N2NConstant.getConstant("confLayoutProfiles");
String confGuestLayout = N2NConstant.getConstant("confGuestLayout");
confGuestLayout = N2NConstant.getConstant("confLayout" + confGuestLayout, "w=A{mt=qs==0=0");

ArrayList<String> avaiPr = new ArrayList<String>();
JSONObject defLayoutProfilesObj = new JSONObject();
if (!confLayoutProfiles.isEmpty()) {
    String[] lpArr = confLayoutProfiles.split(",");
    for (int i = 0; i < lpArr.length; i++) {
        if (!lpArr[0].trim().isEmpty()) {
            String[] ly = lpArr[i].trim().split("=");
            if (ly.length > 1 && !ly[0].trim().isEmpty()) {
                String proKey = ly[0].trim();
                avaiPr.add(proKey);
                defLayoutProfilesObj.put(proKey, ly[1].trim());
            }
        }
    }
}

JSONObject userLayoutObj = new JSONObject();

// default layouts for each layout profiles
// Portal layout
String confPortalAddItemPosition = N2NConstant.getConstant("confPortalAddItemPosition", "");
String confPortalColumns = N2NConstant.getConstant("confPortalColumns", "3");
Boolean confPortalFullColumn = Boolean.parseBoolean(N2NConstant.getConstant("confPortalFullColumn", "true"));

// Initial Items
String confPortalInitItems = N2NConstant.getConstant("confPortalInitItems", "quote~depth~order");
// tab min width
String confTabMinWidth = N2NConstant.getConstant("confTabMinWidth", "470");
// Quote screen default width
String confQsDefaultHeight = N2NConstant.getConstant("confQsDefaultHeight");
// Quote screen allow resize
boolean confQsResizable = Boolean.parseBoolean(N2NConstant.getConstant("confQsResizable", "true"));
// use Edit/Done button
boolean confUseEditButton = Boolean.parseBoolean(N2NConstant.getConstant("confUseEditButton", "false"));

// will default to true when the saving part is implemented in the future
boolean confGridColMove = Boolean.parseBoolean(N2NConstant.getConstant("confGridColMove", "false"));        
boolean confGridColHide = Boolean.parseBoolean(N2NConstant.getConstant("confGridColHide", "false"));

// Demo menu
boolean confMenuDemo = Boolean.parseBoolean(N2NConstant.getConstant("confMenuDemo", "false"));
String confDemoURL = N2NConstant.getConstant("confDemoURL");
if (confDemoURL.isEmpty()) {
    confMenuDemo = false;
}
// show ower by image
boolean confPowerBy = Boolean.parseBoolean(N2NConstant.getConstant("confPowerBy", "false"));
boolean confOrderPadBasic = Boolean.parseBoolean(N2NConstant.getConstant("confOrderPadBasic", "false"));
boolean confOrderPadAdvView = Boolean.parseBoolean(N2NConstant.getConstant("confOrderPadAdvView", "false"));
// Profile menu
boolean confMenuProfile = Boolean.parseBoolean(N2NConstant.getConstant("confMenuProfile", "false"));
String confProfileChangePasswordURL = N2NConstant.getConstant("confProfileChangePasswordURL");
String confProfileForgotPasswordURL = N2NConstant.getConstant("confProfileForgotPasswordURL");
String confProfileChangePinURL = N2NConstant.getConstant("confProfileChangePinURL");
String confProfileForgotPinURL = N2NConstant.getConstant("confProfileForgotPinURL");
String confMenuType = N2NConstant.getConstant("confMenuType", "0");
boolean confTopSearchBox = Boolean.parseBoolean(N2NConstant.getConstant("confTopSearchBox", "false"));

// Ticker setting
String showTickerSetting = N2NConstant.getConstant("confTickerSetting", "FALSE");
String sFullScreenUrl = N2NConstant.getConstant("confFullScreenUrl");
String sStdScreenUrl = N2NConstant.getConstant("confStdScreenUrl");
String sFullQuote = N2NConstant.getConstant("confFullQuote", "FALSE");

//language options
boolean existLanguageFile = true; // default boolean status for if language file exists
String sShowLanguageMenu = N2NConstant.getConstant("confShowLanguageMenu", "FALSE");
String sDefaultLanguage = N2NConstant.getConstant("constDefaultLanguage", "en");
String sLanguageOptions = N2NConstant.getConstant("constLanguageOptions");

String portfolioTitle = N2NConstant.getConstant("confPortfolioTitle");

String vertxFeedServer = N2NConstant.getConstant("confVertxFeed");
String confGuestVertxFeed = N2NConstant.getConstant("confGuestVertxFeed");
String confDefVToken = N2NConstant.getConstant("confDefVToken", "n2n");
if (confDefVToken.equals("vtoken")) {
    confDefVToken = "";
}
String confReloginURL = N2NConstant.getConstant("confReloginURL");
String vertxAutoConnect = N2NConstant.getConstant("confAutoConnInterval");
String vertxAutoRetry = N2NConstant.getConstant("confAutoConnRetry", "3");
Boolean confActiveSubscription = Boolean.parseBoolean(N2NConstant.getConstant("confActiveSubscription", "false"));
/*** Mobile settings ***/
String sMbFeedAllColumn = N2NConstant.getConstant("confMbFeedAllColumn");
String sMbFeedDefaultColumn= N2NConstant.getConstant("confMbFeedDefaultColumn");
String sMbWLAllColumn = N2NConstant.getConstant("confMbWLAllColumn");
String sMbWLDefaultColumn= N2NConstant.getConstant("confMbWLDefaultColumn");
String sMbPFAllColumn = N2NConstant.getConstant("confMbPFAllColumn");
String sMbPFDefaultColumn= N2NConstant.getConstant("confMbPFDefaultColumn");
String sMbRGLAllColumn = N2NConstant.getConstant("confMbRGLAllColumn");
String sMbRGLDefaultColumn= N2NConstant.getConstant("confMbRGLDefaultColumn");
String sMbOSAllColumn = N2NConstant.getConstant("confMbOSAllColumn");
String sMbOSDefaultColumn = N2NConstant.getConstant("confMbOSDefaultColumn");
String sBTS2MDLSetting = N2NConstant.getConstant("confBTS2MDLSetting","FALSE");
Boolean confBTS2MDLSetting = Boolean.parseBoolean(N2NConstant.getConstant("confBTS2MDLSetting", "false"));
String constMDLExList = N2NConstant.getConstant("constMDLExList", "");
String confMDL = N2NConstant.getConstant("confMDL_" + sSponsor);
String derivativeWLSort = N2NConstant.getConstant("confDerivativeWLSort","FALSE");
String sShowOtherToolFXConversion = N2NConstant.getConstant("confOtherTool_FXCONVERSION", "FALSE");
String strLocalCurr = N2NConstant.getConstant("constLocalCurr", "SGD");
String decimalPrtfFieldMeta = N2NConstant.getConstant("confPortfolioFieldMeta");
String decimalCtrlPortfolio = N2NConstant.getConstant("confDecimalCtrl");
Boolean confSaveLayout = Boolean.parseBoolean(N2NConstant.getConstant("confSaveLayout", "false"));
Boolean moColToggIndices = Boolean.parseBoolean(N2NConstant.getConstant("confMoToggColIndices", "false"));
String confKafChartResearchLink = N2NConstant.getConstant("confKafChartResearchLink","");
String confMinFontSize = N2NConstant.getConstant("confMinFontSize","10");
String confMaxFontSize = N2NConstant.getConstant("confMaxFontSize", "14");
Boolean confNumberYellowColumn = Boolean.parseBoolean(N2NConstant.getConstant("confNumberYellowColumn", "false"));
String confFontTypeItem=N2NConstant.getConstant("confFontTypeItem","Helvetica,Helvetica|Tahoma,tahoma|Verdana,verdana|Arial,arial");
Boolean confAutoWidthFontSize = Boolean.parseBoolean(N2NConstant.getConstant("confAutoWidthFontSize","true"));
%>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
        <% if (sView.equals("mobile")) {%>
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="viewport" id="app-viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui">
<% }%>
        <script type="text/javascript">
            var t1 = new Date().getTime();
        </script>
        <script type="text/javascript" src="js/lib/device.min.js?<%=N2NConstant.getRelease()%>"></script>
        <script type="text/javascript">
            var autoWidthFontSize = <%=confAutoWidthFontSize%>;
             var strFontTypeItems = '<%=confFontTypeItem%>'.split("|");
            var fontTypeItemsArr = [];
            for (var i=0; i<strFontTypeItems.length;i++){
                var rec = strFontTypeItems[i].split(",");
                fontTypeItemsArr.push({
                    font: rec[1], name: rec[0]
                });
            }
            var isNumberYellowColumn = <%=confNumberYellowColumn%>;
            var minFontSize = "<%=confMinFontSize%>";
            var maxFontSize = "<%=confMaxFontSize%>";
            var moColToggIndices = <%=moColToggIndices%>;
            var kafChartResearchLinkUrl = "<%=confKafChartResearchLink%>";
            var N2N_CONFIG = new Object();
            var vToken = null;
            N2N_CONFIG.fDebug = <%=confFrontDebug%>;
            N2N_CONFIG.lDebug = <%=confLoadDebug%>;
            N2N_CONFIG.confSaveLayout= <%=confSaveLayout %>;
            var decimalPrtfFieldMeta = "<%=decimalPrtfFieldMeta%>";
            var decimalPrtf = "<%=decimalCtrlPortfolio%>";    
            var  decimalCtrl = [];            
          if(decimalPrtfFieldMeta != "" && decimalPrtf != ""){
              decimalPrtfFieldMeta = decimalPrtfFieldMeta.split('|');
              decimalPrtf = decimalPrtf.split('|');      
                 for(var i = 0 ; i<decimalPrtfFieldMeta.length ; i++){
                    var portfolioField = (decimalPrtfFieldMeta[i]+"").split(" ");

                    var type = portfolioField[0];
                    var field = portfolioField[1];
                    var decimal = decimalPrtf[i];

                                if (!decimalCtrl[type]) {
                                  decimalCtrl[type] = [];
                                }
                               decimalCtrl[type][field] = decimal;   
                }    
            }else{
                //declear variable Array two dimensional.
                decimalCtrl.prtf = [];
                decimalCtrl.rgl = [];
            }
            N2N_CONFIG.orderPadBasic = <%=confOrderPadBasic%>;
            N2N_CONFIG.orderPadAdvView = <%=confOrderPadAdvView%>;
            var bts2MDLSetting = "<%=sBTS2MDLSetting%>";
            var debugStart = new Date().getTime();
            var derivativeWLSort = "<%=derivativeWLSort%>";
            var t1 = new Date().getTime();
            var portfolioTitle = "<%=portfolioTitle%>";    
            var myPortfolioName = "Equities Portfolio";
            var manualPortfolioName = "Manual Portfolio";
            var portfolioTitles = [];
            if(portfolioTitle != ""){
                portfolioTitles = portfolioTitle.split("|");
                myPortfolioName = portfolioTitles[0] == "" ? "Equities Portfolio" : portfolioTitles[0];
                manualPortfolioName = portfolioTitles[1]=="" ? "Manual Porfolio" : portfolioTitles[1];
            }
                       
            var showForeignFlows = "<%=sShowForeignFlows%>";
            N2N_CONFIG.brokerInfo = <%=confFeaturesBrokerInfo%>;
            N2N_CONFIG.brokerInfoInterval = <%=constBrokerInfoInterval%>;
            var global_showFullQuote = "<%=sFullQuote%>";
            var sFullScreenUrl = "<%=sFullScreenUrl%>";
            var sStdScreenUrl = "<%=sStdScreenUrl%>";
            var sMDLevel = "<%=sMDLevel%>";
            var bypassMYAccChecking = "<%=sBypassMYAccChecking%>";
            N2N_CONFIG.BTS2MDLSetting = <%=confBTS2MDLSetting%>;
            var mdlExList = "<%=constMDLExList%>";
            N2N_CONFIG.mdLevel = "<%=confMDL%>";
          
            var showUISettingItem = ("<%=showUISettingItem%>").split('|');
            N2N_CONFIG.layoutSetting=<%=confLayoutSetting%>;
            N2N_CONFIG.layoutSettingItems='<%=confLayoutSettingItems%>';
            N2N_CONFIG.layoutSettingItems = N2N_CONFIG.layoutSettingItems.split('~');
            N2N_CONFIG.splitScreen=<%=confSplitScreen%>;
            N2N_CONFIG.configScreen=<%=confConfigScreen%>;
            N2N_CONFIG.layoutOptions='<%=constLayoutOptions%>';
            N2N_CONFIG.defLayouts = <%=defLayoutObj%>;
            N2N_CONFIG.portalAddItemPosition = '<%=confPortalAddItemPosition%>';
            N2N_CONFIG.portalColumns = <%=confPortalColumns%>;
            N2N_CONFIG.portalFullColumn = <%=confPortalFullColumn%>;
            N2N_CONFIG.portalInitItems = '<%=confPortalInitItems%>';
            N2N_CONFIG.tabMinWidth = <%=confTabMinWidth%>;
            N2N_CONFIG.qsDefaultHeight = '<%=confQsDefaultHeight%>';
            N2N_CONFIG.qsResizable = <%=confQsResizable%>;
            N2N_CONFIG.useEditButton = <%=confUseEditButton%>;
            N2N_CONFIG.gridColMove = <%=confGridColMove%>;
            N2N_CONFIG.gridColHide = <%=confGridColHide%>;
            N2N_CONFIG.menu_Demo=<%=confMenuDemo%>;
            N2N_CONFIG.showPowerBy=<%=confPowerBy%>;
            N2N_CONFIG.demoURL="<%=confDemoURL%>";
            N2N_CONFIG.menuProfile = <%= confMenuProfile %>;
            N2N_CONFIG.profileChgPwdURL = "<%= confProfileChangePasswordURL %>";
            N2N_CONFIG.profileForPwdURL = "<%= confProfileForgotPasswordURL %>";
            N2N_CONFIG.profileChgPinURL = "<%= confProfileChangePinURL %>";
            N2N_CONFIG.profileForPinURL = "<%= confProfileForgotPinURL %>";
            N2N_CONFIG.menuType = '<%= confMenuType %>';
            N2N_CONFIG.topSearchBox = <%= confTopSearchBox %>;
            N2N_CONFIG.useViewURL=<%=confUseViewURL%>;
            N2N_CONFIG.mobileViewURL="<%=confMobileViewURL%>";
            N2N_CONFIG.desktopViewURL="<%=confDesktopViewURL%>";
            N2N_CONFIG.headerLogo='<%=confHeaderLogo%>';
            N2N_CONFIG.footerLogo='<%=confFooterLogo%>';
            var showTickerSetting="<%=showTickerSetting%>";
            var showExtjsChart = "<%=showExtjsChart%>";
            var showTrackerBrokerName = "<%=showTrackerBrokerName%>";
            var stockChartURL="<%=stockChartURL %>";
            var embeddedStockChartURL="<%=embeddedStockChartURL %>";
            N2N_CONFIG.interactiveChartButton = <%= confInteractiveChartButton %>;
            var showMDColButton = "<%=showMDSettingButton%>";
            var global_MDAllColumn="<%=marketDepthAllColumn%>";
            var global_MDDefaultColumn="<%=marketDepthDefaultColumn%>";
            var showBcumScum = "<%=sBcumScum%>";
            var showUISetting=<%= "'"+ sUISetting +"'" %>;
        	var global_selectExchagneWMS = '';
            var global_onFullScreen = false;
            var showWarrantSearch = <%='"'+sWarrantSearch+'"'%>;
            var appId = '<%=ATPConstant.getConstant("constATPAppCodeValue")%>';
			var defCurrency = <%=ATPConstant.getDefaultCurrency().toString()%>;
			defCurrency = defCurrency.toString();
			var defPayment = <%=ATPConstant.getDefaultPayment().toString()%>;
	    	var arExMapping;
	    	var arFldCfg;
	    	var key;
	    	var mod;
	    	
	    	var sDomain = window.location.host; //v1.3.30.9
	    	var popUpHeader = '<%= sPopUpHeader %>';
	    	var global_popUpMsgTitle = popUpHeader +" - "+ sDomain;
	    	
                if(popUpHeader.indexOf('|')!=-1){
                     var showHideTitlePopUp= popUpHeader.split('|')[1];
                     var showHideProductName = showHideTitlePopUp.split(',')[0];
                     var showHideDomain = showHideTitlePopUp.split(',')[1];
                     var productName = showHideProductName == 1 ? popUpHeader.split('|')[0] : '';
                         sDomain = showHideDomain == 1 ? sDomain : '';
                     var dashSignPopUp = showHideProductName == 1 && showHideDomain == 1 ? ' - ' : '';     
                     global_popUpMsgTitle = productName + dashSignPopUp + sDomain; 
                }
	    	
        	var portFolioDisclaimerSessionShare = '<%= sPortFolioDisclaimerSessionShare %>';
        	var showBalanceNNetCashLimit = '<%= sShowBalnNetCashLimit %>';
        	
        	var global_OrderStatusDateFormat = '<%= sOrderStatusDateFormat %>';
        	
        	var global_DateFormat = '<%= sTcliteDateFormat %>';
        	var global_TimeFormat = '<%= sTcliteTimeFormat %>';
        	var global_DateHidden = '<%= sTcliteDateHidden %>';
        	
        	var showSIPMessage = '<%= sShowSIPMsg %>';
        	var showDefaultCur = '<%= showDefaultCurrency %>';
                N2N_CONFIG.corporateStockNewsAlert = <%=confCorporateStockNewsAlert%>;
                N2N_CONFIG.corporateStockNewsUrl = '<%=confCorporateStockNewsUrl%>';
                N2N_CONFIG.elasticNewsUrl = '<%=confElasticNewsUrl%>';
                N2N_CONFIG.nikkeiNewsUrl = '<%=confNikkeiNewsUrl%>';
        	var showMargin = '<%= sShowMargin %>';
        	
        	var jQC = '<%= ISjQC %>';
        	
        	var global_displayCreditType = '<%= sDisplayCreditType %>';
        	
                N2N_CONFIG.breakEvenCalc = <%=confCalculatorBreakeven%>;
                N2N_CONFIG.perEPSCalc = <%=confCalculatorPEREPS%>;
                N2N_CONFIG.tradeCal = <%=confTradeCalculator%>;
                N2N_CONFIG.calcURL = '<%= confCalculatorURL%>';
                N2N_CONFIG.calcLabel = '<%= confCalculatorLabel%>';
        	
        	var QuoteScreenSortingBy = '<%= sQSSortingBy %>';
        	
        	var global_quoteScreenSize = '<%= sQuoteScreenSize %>';
        	var global_QuotePagingPanel = '<%= sQuotePagingPanel %>';
        	var global_QSSizeFollowSetting = '<%= sQuoteSizeFollowSetting %>';
        	var global_QSMarketRefreshTime = '<%= sMarketRefreshTime %>';
        	var global_QSCrossSearch = '<%= sQuoteScreenCrossSearch %>';
        	
            N2N_CONFIG.menuFontSize = <%= sMenuFontSize %>;
            N2N_CONFIG.confDockableOrderpad = <%= confDockableOrderpad %>;
            N2N_CONFIG.confChgOBColours = <%= confChgOBColours %>;
            N2N_CONFIG.confOrderpadPopup = <%= confOrderpadPopup %>;
            
            N2N_CONFIG.quickSearchExcludeBoards = '<%= confQuickSearchExcludeBoards %>';
            N2N_CONFIG.orderRoundQty = <%= confOrderRoundQty %>;
            N2N_CONFIG.autoWidthButton = <%= confAutoWidthButton %>;
            N2N_CONFIG.guestEx = '<%= confGuestEx %>';
            N2N_CONFIG.sortExchangeList = <%= confSortExchangeList %>;
            N2N_CONFIG.exGroupingList = '<%= constExGroupingList %>';
        	
        	//v1.3.34.4
        	var global_maxWatchlistCreate = '<%= sMaxWatchlistCreate %>';
            N2N_CONFIG.maxOpenWatchlist = <%= confMaxOpenWatchlist %>;
            N2N_CONFIG.maxStockInWatchlist = <%= sMaxStockInWatchlist %>;
        	
        	//v1.3.34.45
        	var global_checkIsAliveTimer = '<%= sCheckIsAliveTimer %>';
        	
        	var global_TrackerRecord = '<%= confTrackerRecord %>';
        	var global_TrackerRecordTotalRecord = '<%= confTrackerRecordTotalRecord %>';
        	N2N_CONFIG.trackerRecordDisplayCode = <%= confTrackerRecordDisplayCode %>;
        	N2N_CONFIG.trackerRecordV2 = <%= confTrackerRecordV2 %>;
        	
        	// [START] Features list
        	var showV1GUI = 'FALSE';
        	var showBuySellHeader = '<%= sShowBuySellHeader %>';
        	var showWatchListHeader = '<%= sShowWatchListHeader %>';
        	var showWatchListView = '<%= sShowWatchListView %>';
        	var showWatchListCreate = '<%= sShowWatchListCreate %>';
        	var showWatchListRename = '<%= sShowWatchListRename %>';
        	var showWatchListDelete = '<%= sShowWatchListDelete %>';

        	var showStkInfoHeader = '<%= sShowStkInfoHeader %>';
        	var showStkInfoStkInfo = '<%= sShowStkInfoStkInfo %>';
                N2N_CONFIG.features_HistoricalData = <%= confFeaturesHistoricalData %>;
                N2N_CONFIG.features_HistoricalData_Periodicity = <%= confFeaturesHistoricalData_Periodicity %>;
                N2N_CONFIG.features_HistoricalData_Load = <%= confFeaturesHistoricalData_Load %>;
        	var showStkInfoMarketDepth = '<%= sShowStkInfoMarketDepth %>';
        	var showMktDepthTotal = '<%= sShowMktDepthTotal %>';
        	var showStkInfoMarketMatrixDepth = '<%= sShowStkInfoMarketMatrixDepth %>';
                N2N_CONFIG.features_DepthMatrix_MaxRow = <%=confFeaturesDepthMatrix_MaxRow%>;
                N2N_CONFIG.features_DepthMatrix_MaxCol = <%=confFeaturesDepthMatrix_MaxCol%>;
                N2N_CONFIG.features_DepthMatrix_MinRow = <%=confFeaturesDepthMatrix_MinRow%>;
                N2N_CONFIG.features_DepthMatrix_MinCol = <%=confFeaturesDepthMatrix_MinCol%>;
        	var showStkInfoTracker = '<%= sShowStkInfoTracker %>';
        	var showStkInfoTrackerBusinessDone = '<%= sShowStkInfoTrackerBusinessDone %>';
                N2N_CONFIG.features_Tracker_3Pies = <%= confFeaturesStockInfo_Tracker3Pies %>;
        	var showStkInfoEquitiesTracker = '<%= sShowStkInfoEquitiesTracker %>';
                N2N_CONFIG.msg_ET = '<%= confMsg_ET %>';
        	
        	var showChartHeader = '<%= sShowChartHeader %>';
        	var showChartIntradayChart = '<%= sShowChartIntradayChart %>';
        	var showChartAnalysisChart = '<%= sShowChartAnalysisChart %>';
        	var showChartAnalysisChartAsFlash = '<%= sShowChartAnalysisChartAsFlash %>';
        	var showChartITFinanceChart = '<%= sShowChartITFinanceChart %>';
        	
        	var showNewsHeader = '<%= sShowNewsHeader %>';
        	var showNewsAnnouncements = '<%= sShowNewsAnnouncements %>';
        	var showNewsStockNews = '<%= sShowNewsStockNews %>';
                N2N_CONFIG.featuresNews_Archive = <%= confFeaturesNews_Archive %>;
            N2N_CONFIG.featuresNews_Archive_GeneralNews = <%= confFeaturesNews_Archive_GeneralNews %>;
                N2N_CONFIG.newsSearchPopup = <%=constNewsSearchPopup%>;
                
                // Fundamental news
                N2N_CONFIG.featuresNews_FundamentalCPIQ = <%= confFeaturesNews_FundamentalCPIQ%>;
                N2N_CONFIG.featuresNews_FundamentalThomsonReuters = <%= confFeaturesNews_FundamentalThomsonReuters%>;
                N2N_CONFIG.featuresNews_FundamentalScreenerCPIQ = <%= confFeaturesNews_FundamentalScreenerCPIQ%>;
                N2N_CONFIG.featuresNews_FundamentalScreenerThomsonReuters = <%= confFeaturesNews_FundamentalScreenerThomsonReuters%>;
                
                N2N_CONFIG.mbFeaturesNews_FundamentalCPIQ = <%=confMbFeaturesNews_FundamentalCPIQ%>;
                N2N_CONFIG.mbFeaturesNews_FundamentalThomsonReuters = <%=confMbFeaturesNews_FundamentalThomsonReuters%>;
                N2N_CONFIG.mbFeaturesNews_FundamentalScreenerCPIQ = <%=confMbFeaturesNews_FundamentalScreenerCPIQ%>;
                N2N_CONFIG.mbFeaturesNews_FundamentalScreenerThomsonReuters = <%=confMbFeaturesNews_FundamentalScreenerThomsonReuters%>;
                
                N2N_CONFIG.mbFeaturesNews_SPCapIQ = <%=confMbFeaturesNews_SPCapIQ%>;
                N2N_CONFIG.mbFeaturesNews_SPCapIQ_Synopsis = <%=confMbFeaturesNews_SPCapIQ_Synopsis%>;
                N2N_CONFIG.mbFeaturesNews_SPCapIQ_ComInfo = <%=confMbFeaturesNews_SPCapIQ_ComInfo%>;
                N2N_CONFIG.mbFeaturesNews_SPCapIQ_Announcement = <%=confMbFeaturesNews_SPCapIQ_Announcement%>;
                N2N_CONFIG.mbFeaturesNews_SPCapIQ_KeyPersons = <%=confMbFeaturesNews_SPCapIQ_KeyPersons%>;
                N2N_CONFIG.mbFeaturesNews_SPCapIQ_ShareSum = <%=confMbFeaturesNews_SPCapIQ_ShareSum%>;
                N2N_CONFIG.mbFeaturesNews_SPCapIQ_FiReports = <%=confMbFeaturesNews_SPCapIQ_FiReports%>;
                
                N2N_CONFIG.fundamentalCPIQPrefix = '<%= constFundamentalCapitalIQ%>';
                N2N_CONFIG.fundamentalCPIQType = '<%=constFundamentalCapitalIQType%>';
                N2N_CONFIG.fundamentalCPIQScreenerType = '<%=constFundamentalCapitalIQScreenerType%>';
                N2N_CONFIG.fundamentalThomsonReutersPrefix = '<%= constFundamentalThomsonReuters%>';
                N2N_CONFIG.fundamentalThomsonReutersType = '<%=constFundamentalThomsonReutersType%>';
                N2N_CONFIG.fundamentalThomsonReutersScreenerType = '<%=constFundamentalThomsonReutersScreenerType%>';
                N2N_CONFIG.fundamentalURL = '<%= constFundamentalURL%>';
                N2N_CONFIG.fundamentalScreenerURL = '<%= constFundamentalScreenerURL%>';
                N2N_CONFIG.mbFundamentalURL = '<%= confMbFundamentalURL%>';
                N2N_CONFIG.mbFundamentalFiRepURL = '<%= confMbFundamentalFiRepURL%>';
                N2N_CONFIG.fundamentalSponsor = '<%= confFundamentalSponsor%>';
                N2N_CONFIG.fundamentalExchg = '<%= constFundamentalExchg%>';
                N2N_CONFIG.newsCPIQExchg = '<%= constFundamentalExchg%>';
        	
        	var showWarrantsInfo = '<%= sShowWarrantsInfo %>';
        	
        	var showMarketHeader = '<%= sShowMarketHeader %>';
        	var showMarketSummary = '<%= sShowMarketSummary %>';
        	var showMarketIndices = '<%= sShowMarketIndices %>';
        	var showMarketScoreBoard = '<%= sShowMarketScoreBoard %>';
        	var showMarketStreamer = '<%= sShowMarketStreamer %>';
                N2N_CONFIG.streamerDisplayCode = <%= confFeaturesMarket_Streamer_DisplayCode %>;
                N2N_CONFIG.features_MarketSummary_PieChart = <%= confFeaturesMarketSummary_PieChart %>;

        	var showMarketSummaryGraph = '<%= sShowMarketSummaryGraph %>';
        	var showMarketWorldIndices = '<%= sShowMarketWorldIndices %>';
        	N2N_CONFIG.worldIndices = <%= confWorldIndices %>;
        	
        	var showOrdBookHeader = '<%= sShowOrdBookHeader %>';
        	var showOrdBookOrderSts = '<%= sShowOrdBookOrderSts %>';
        	var showOrdBookOrderHistory = '<%= sShowOrdBookOrderHistory %>';
        	var showOrdBookOrderLog = '<%= sShowOrdBookOrderLog %>';
        	var showOrdBookOrderDetails = '<%= sShowOrdBookOrderDetails %>';
        	var showOrdBookOrderPosition = '<%= sShowOrdBookOrderPosition %>';       	

    	   	var showWebReportHeader = '<%= sShowWebReportHeader %>';
         	
         	<%-- not using anymore, control by Web Report URL
        	var showWebReportClientSummary = '<%= sShowWebReportClientSummary %>';
        	var showWebReportMonthlyStatement = '<%= sShowWebReportMonthlyStatement %>';
        	var showWebReportMarginAccountSummary = '<%= sShowWebReportMarginAccountSummary %>';
        	var showWebReportTraderDepositReport = '<%= sShowWebReportTraderDepositReport %>';
        	var showWebReportTradeBeyondReport = '<%= sShowWebReportTradeBeyondReport %>';
        	var showWebReporteContract = '<%= sShowWebReporteContract %>';
        	var showWebReportAISBeStatement = '<%= sShowWebReportAISBeStatement %>';
        	var showWebMarginPortFolioValuation = '<%= sShowMarginPortFolioValuation %>';
        	var showWebTransactionMovement = '<%= sShowTransactionMovement %>';
        	var showWebStockBalance = '<%= sShowStockBalance %>';
        	var global_showWebClientTransactionStatement = '<%= sClientTransactionStatement %>'; --%>
        	
        	N2N_CONFIG.features_Analysis = <%= confFeaturesAnalysis_Header%>;
        	N2N_CONFIG.features_Analysis_Dividend = <%= confFeaturesAnalysis_Dividend%>;
        	N2N_CONFIG.features_Analysis_Warrants = <%= confFeaturesAnalysis_Warrants%>;
        	N2N_CONFIG.features_Analysis_BMFutures = <%= confFeaturesAnalysis_BMFutures%>;
        	
        	var showSettingHeader = '<%= sShowSettingHeader %>';
        	var showSettingStockAlert = '<%= sShowSettingStockAlert %>';
            N2N_CONFIG.featuresSetting_AddStockAlert = <%= confFeaturesSetting_AddStockAlert %>;
            N2N_CONFIG.featuresSetting_PriceAlert = <%= confFeaturesSetting_PriceAlert %>;
            var showSettingAddStockAlert = '<%= sShowSettingAddStockAlert %>';
        	var showSettingPersonalizationTheme = '<%= sShowSettingPersonalizationTheme %>';
        	
        	var showPortFolioHeader = '<%= sShowPortFolioHeader %>';
        	
        	var global_showPortFolioDerivativePortFolio = '<%= sShowPortFolioDerivativePortFolio %>';
        	var global_showPortFolioDerivativePortFolioDetail = '<%= sShowPortFolioDerivativePortFolioDetail %>';
        	
        	var showPortFolioMyPortFolio = '<%= sShowPortFolioMyPortFolio %>';
        	var global_showPortFolioManualPortFolio = '<%= sShowPortFolioManualPortFolio %>';
        	var showPortFolioRealizedGainLoss = '<%= sShowPortFolioRealizedGainLoss %>';
        	
        	var showPortFolioDetail = '<%= sShowPortFolioDetail %>';
        	var showPortFolioDetailAdd = '<%= sShowPortFolioDetailAdd %>';
        	var showPortFolioDetailDelete = '<%= sShowPortFolioDetailDelete %>';
        	var showPortFolioDetailUpdate = '<%= sShowPortFolioDetailUpdate %>';
        	
        	var global_showPortFolioManualDetail = '<%= sShowPortFolioManualDetail %>';
        	var global_showPortFolioManualDetailAdd = '<%= sShowPortFolioManualDetailAdd %>';
        	var global_showPortFolioManualDetailDelete = '<%= sShowPortFolioManualDetailDelete %>';
        	var global_showPortFolioManualDetailUpdate = '<%= sShowPortFolioManualDetailUpdate %>';
        	
        	var global_showMigratedPortFolioHeader = '<%= sShowMigratedPortFolioHeader %>';
        	var global_showMigratedPortFolioDetail = '<%= sShowMigratedPortFolioDetail %>';
        	var global_showMigratedPortFolioRealized = '<%= sShowMigratedPortFolioRealized %>';
        	var prtfTypeToolTip = '<%= sPrtfOrderType %>';
        	
        	var global_showOtherToolHeader = '<%= sShowOtherToolHeader %>';
        	var global_showOtherToolStockFilter = '<%= sShowOtherToolStockFilter %>';
        	var global_showOtherToolExchangeRate = '<%= sShowOtherToolExchangeRate %>';
        	var global_showOtherToolFXConversion = '<%=sShowOtherToolFXConversion %>';
            var localCurr = "<%=strLocalCurr%>";
        	
        	var global_showFullScreen = '<%= sShowFullScreen %>';
        	
        	var showExchangeHeader = '<%= sShowExchangeHeader %>';
			var showUnitHeader = '<%= sShowUnitHeader %>';
			var showEmoHeader = '<%= sShowEmoChatHeader %>'; //v1.3.30.21 Add emo Chat header
        	N2N_CONFIG.features_Calculator = <%= confFeaturesCalculator_Header %>;
        	var global_allowCookies = '<%= sAllowCookie %>'; // v1.3.33.8 Set is allow user store column info in cookie
        	
        	var global_logoutButton = '<%= sLogoutButton %>'; 
        	
        	var global_NewWindow_News = '<%= sNewWindow_News %>';
        	var global_NewWindow_Report = '<%= sNewWindow_Report %>';
            N2N_CONFIG.newWin_Analysis = <%= confNewWindow_Analysis %>;
        	N2N_CONFIG.newWin_Other = <%= confNewWindow_Other %>;
        	N2N_CONFIG.newWin_StkFilter = <%= confNewWindow_StkFilter %>;
        	
       
       
        	//susan 20130413 - added for OSK
        	var global_showColSettingHeader = '<%=sShowColSettingHeader%>';
        	var global_showSortByTopHeader = '<%=sShowSortByTopHeader%>';
        	var global_showSortBySectorHeader = '<%=sShowSortBySectorHeader%>';
        	var global_showSortByMarketHeader = '<%=sShowSortByMarketHeader%>';

        	// [END] Features list
        	
        	//# [START] Feed Sector filter
        	var showSector = '<%= sShowSector %>';
        	var showButton = '<%= sShowButton %>';
        	var showFilterSector = '<%= sFilterSector %>';
			//# [END] Feed Sector filter

			//# [START] Quote Screen & Watchlist columns
			var showColQW_LACP = '<%= sShowColQW_LACP %>';
			var showColQW_TOP = '<%= sShowColQW_TOP %>';
			//# [END] Quote Screen & Watchlist columns 
			
			//# [START]Exchange Mapping
			var showExchangeMapping = '<%=sShowExchangeMapping%>';
			//# [END]Exchange Mapping
			
			//# [START]Rotating Logo
			var showRotatingLogo = '<%=sShowRotatingLogo%>';
			//# [END]Rotating Logo
			
			// # [START] Warrants Info
			var warrantsInfoURL = '<%= sWarrantsInfoURL %>';
			// # [END] Warrants Info
			
			// # [START] Sort by Sector
			var sectorFilter = '<%= sSector %>';
			// # [END] Sort by Sector
			var searchKey = '<%= sSearchKey %>';
			// Single Click Mode
			var singleClickMode = '<%= confSingleClickMode %>'; // TO REVIEW
                        N2N_CONFIG.singleClickMode = <%= Boolean.parseBoolean(confSingleClickMode) %>;
			
			// # [START] Show Export CSV File Button in Quote Screen
			var showQuoteScreenExportCSV = '<%= sShowQuoteScreenExportCSV %>';
			// # [END] Show Export CSV File Button in Quote Screen
			
			//# [START] Right-click Auto Cancel
			var autoCancel = '<%= sAutoCancel %>';	
			//# [END] Right-click Auto Cancel
			
			//# [START] Show Language Menu
			var showLanguageMenu = '<%= sShowLanguageMenu %>';
			//# [END] Show Language Menu
			
			//# [START] Language Menu Options
			var languageOptions = '<%= sLanguageOptions %>';
			//# [END] Language Menu Options
			
			//# [START] Show Trx Fees
			var showTrxFees = '<%= sShowTrxFees %>';
			//# [END] Show Trx Fees

			//# [START] Trx Fees Label
			var showTrxFeesLabel = '<%= sTrxFeesLabel %>';
			//# [END] Trx Fees Label
			
			//# [START] Show IPO
			var showIPO = '<%= sShowIPO %>';
			//# [END] Show IPO
			
			//# [START]  Show Order Status Refresh Label
			var showOrderStatusLabel = '<%= sShowOrderStatusLabel %>';
			//# [END]  Show Order Status Refresh Label
			
			//# [START]  Show Payment Code
			var showPaymentCode = '<%= sShowPaymentCode %>';		
			//# [END]  Show Payment Code
			
			//# [START] Show extra confirmation order msg
			var showExtraOrdMsg = '<%= sShowExtraOrdMsg %>';
			//# [END] Show extra confirmation order msg
			
			//# [START] Order Status pull interval
			var orderStsInterval = '<%= sOrderStsInterval %>';
			//# [END]  Order Status pull interval
			
			//# [START] Delayed Indices Exchange List
			var delayIndicesExList = '<%= sDelayIndicesExList %>';
			//# [END]  Delayed Indices Exchange List
			
			//# [START] Determine Main Menu Items
            var determineMainMenuItems = '<%= sDetermineMainMenuItems %>';
            //# [END] Determine Main Menu Items
            
            //# [START] Show GIF chart based on exchange
			var gifChartExList = '<%= sGifChartExList %>';
			//# [END] Show GIF chart based on exchange
			
			//# [START] Enable orderpad UI drag&drop
			var enableOrdPadDD = '<%= sEnableOrdPadDD %>';
			//# [END] Enable orderpad UI drag&drop
			
			//# [START] OrderBook set decimal places
			var setOrderBookDP = '<%= sSetOrderBookDP %>';
			//# [END] OrderBook set decimal places
			
			//# [START] Dynamic Orderpad column settings
			var ordPadColWidth = '<%= sOrdPadColWidth %>';
			//# [END] Dynamic Orderpad column settings
            
			N2N_CONFIG.confMsgBoxCenter = <%= confMsgBoxCenter %>;
            N2N_CONFIG.autoQtyRound = <%= confAutoQtyRound %>;
            N2N_CONFIG.round10 = <%= confRound10 %>;
            N2N_CONFIG.ordBookAmal = <%= confOrdBookAmal %>;
            N2N_CONFIG.ordBookAmalStatus = <%= confOrdBookAmalStatus %>;
            N2N_CONFIG.tradeSetting = <%= confTradeSetting %>;
            N2N_CONFIG.defTradeAccFeature = <%= confDefaultTradingAccountFeature %>;
            N2N_CONFIG.tradeAccOrder = <%= confTradeAccountOrder %>;
            N2N_CONFIG.requiredLoginUrl = '<%= confRequiredLoginUrl %>';
            N2N_CONFIG.cookieKey = '<%=confCookieKey %>';
            N2N_CONFIG.allowMax = <%= confAllowMax %>;
            N2N_CONFIG.layoutDD = <%= confLayoutDD %>;
            N2N_CONFIG.streamOpt = <%= confStreamOpt %>;
            N2N_CONFIG.ddMenu = <%= confDDMenu %>;
            N2N_CONFIG.ddComp = <%= confDDComp %>;
            N2N_CONFIG.ddWlRemove = <%= confDDWlRemove %>;
            N2N_CONFIG.sumColorBar = <%= confSumColorBar %>;
            N2N_CONFIG.otherMenuName = '<%= confOtherMenuName %>';
            N2N_CONFIG.otherMenu1 = "<%= confOtherMenu1 %>";
            N2N_CONFIG.otherMenu2 = "<%= confOtherMenu2 %>";
            N2N_CONFIG.otherMenu3 = "<%= confOtherMenu3 %>";
            N2N_CONFIG.otherMenu4 = "<%= confOtherMenu4 %>";
            N2N_CONFIG.otherMenu5 = "<%= confOtherMenu5 %>";
            N2N_CONFIG.otherMenu6 = "<%= confOtherMenu6 %>";
            
            N2N_CONFIG.enableUserPreference = <%= confEnableUserPreference %>;
            N2N_CONFIG.gridBufferedRenderer = <%= confGridBufferedRenderer %>;
            N2N_CONFIG.gridLeadingBufferZone = <%= confGridLeadingBufferZone %>;
            N2N_CONFIG.gridTrailingBufferZone = <%= confGridTrailingBufferZone %>;
            
            N2N_CONFIG.saveMappedNames = <%= confSaveMappedNames %>;
            N2N_CONFIG.showMenuLabel = <%= confShowMenuLabel %>;
            
            N2N_CONFIG.recentQuote = <%= confRecentQuote %>;
            N2N_CONFIG.maxRecent = <%= confMaxRecent %>;
            N2N_CONFIG.recentComp = "<%= confRecentComp %>";
            
            N2N_CONFIG.syncScreen = <%= confSyncScreen %>;
            N2N_CONFIG.syncItems = "<%= confSyncItems %>";
            
            N2N_CONFIG.ignoreColWidthConf = <%= confIgnoreColWidthConf %>;
            
			N2N_CONFIG.enableMSearch = <%= confEnableMSearch %>;
			
			N2N_CONFIG.newMobileFundamental = <%= confNewMobileFundamental %>;
			
			N2N_CONFIG.enableToast = <%= confEnableToast %>;
            
			//# [START] Show Order Type help text
			var showOTypeHelpText = '<%= sShowOTypeHelpText %>';
			//# [END] Show Order Type help text
			
			//# [START] Format number lot
			var showFormatNumberLot = true;
            var showDMFormatNumberLot = true;
			//# [END]  Format number lot
			
			//# [START] GST % for calculator
			var gstPerc = '<%= sGSTPerc %>';
			//# [END] GST % for calculator
			
			//# [START] Dealer/Remisier search account
			N2N_CONFIG.confDRSearchAcc = '<%= confDRSearchAcc %>';
			//# [END] Dealer/Remisier search account
			
			//# [START] Show User Guide
			var showUserGuide = '<%= sShowUserGuide %>';
			//# [END] Show User Guide
			
			//# [START] Stock Tracker No Push Update + Pull Interval
			var trackerUpdate = '<%= sTrackerUpdate %>';
			//# [END] Stock Tracker No Push Update + Pull Interval
			
			//# [START] RSS
			var enableRSSIndicator = '<%= sRSSIndicator %>';
			//# [END] RSS
			
			//# [START] CUT Supported Exchange
			var cutSupportedEx = '<%= sCUTSupportedEx %>';
			//# [END] CUT Supported Exchange
			
			//# [START] Promo Message
			var promoMessage = '<%= sPromoMessage %>';
			//# [END] Promo Message
			
			//# [START] Loop Portfolio Record
			var loopPortfolioRecord = '<%= sLoopPortfolioRecord %>';
			//# [END] Loop Portfolio Record
			
			var sCFDMenu = <%= sCFDMenu %>;
			
			// # [START] Web Menu Settlement
			var showSettlementHeader = '<%= sShowSettlementMenu %>';
			var webESettlementURL = '<%= sWebMenuESettlementURL %>';
			var webESettlementStatusURL = '<%= sWebMenuESettlementStatusURL %>';
			var webEDepositURL = '<%= sWebMenuEDepositURL %>';
			//# [END] Web Menu Settlement
			
			// # [START] Warrant Category
			var warrantCat = '<%= sWarrantCat %>';
			// # [END] Warrant Category
			
			// # [START] AnalysisChart Flash URL (for non-IOS)
			var analysisChartFlashURL = '<%= sAnalysisChartFlashURL %>';
			// # [END] AnalysisChart Flash URL (for non-IOS)
			
			//# [START] Web Report URL
			var webReportClientSummaryURL = '<%= sWebReportClientSummaryURL %>';
			var webReportMonthlyStatementURL = '<%= sWebReportMonthlyStatementURL %>';
			var webReportMarginAccountSummaryURL = '<%= sWebReportMarginAccountSummaryURL %>';
			var webReportTraderDepositReportURL = '<%= sWebReportTraderDepositReportURL %>';
			var webReportTradeBeyondReportURL = '<%= sWebReportTradeBeyondReportURL %>';
			var webReporteContractURL = '<%= sWebReporteContractURL %>';
			var webReportAISBeStatementURL = '<%= sWebReportAISBeStatementURL %>';
			var webReportMarginPortFolioValuationURL = '<%= sWebReportMarginPortFolioValuation %>';
			var webReportTransactionMovementURL = '<%= sWebReportTransactionMovement %>';
			var webReportStockBalanceURL = '<%= sWebReportStockBalance %>';
			var webReportClientTransactionStatementURL = '<%= sWebClientTransactionStatement %>';
			//# [END] Web Report URL
			
			// # [START] Analysis URL
			var analysisDividendURL = '<%= sAnalysisDividendURL %>';
			var analysisWarrantsURL = '<%= sAnalysisWarrantsURL %>';
			var analysisBMFuturesURL = '<%= sAnalysisBMFuturesURL %>';
			//# [END] Analysis URL

			// # [START] Setting URL
			var settingStockAlertURL = '<%= sSettingStockAlertURL %>';
			var settingAddStockAlertURL = '<%= sSettingAddStockAlertURL %>';
			var settingSMSStockAlertURL = '<%= sSettingSMSStockAlertURL %>';
			//# [END] Setting URL
			
			
			// # [START] other tool URL
			var global_otherToolStockFilterURL = '<%= sOtherToolStockFilterURL %>';
			var global_otherToolExchangeRateURL = '<%= sOtherToolExchangeRateURL %>';
			var global_otherToolStockScreenerURL = '<%= sOtherToolStockScreenerURL %>';
			// # [END] other tool URL

			// # [START] migrated portfolio URL
			var global_portFolioDetailURL = '<%= sMigratedPortfolio_PortFolioDetailURL %>';
			var global_portFolioRealizedURL = '<%= sMigratedPortfolio_PortFolioRealizedURL %>';
			// # [END] migrated portfolio URL
			
			
			
			// # [START] Trade Board Restriction [TRUE - allow to trade, FALSE - not allow to trade]
			var tradeBoardRestrictionB = '<%= sTradeBoardRestriction_B %>';
			var tradeBoardRestrictionD = '<%= sTradeBoardRestriction_D %>';
			var tradeBoardRestrictionI = '<%= sTradeBoardRestriction_I %>';
			var tradeBoardRestrictionO = '<%= sTradeBoardRestriction_O %>';

			// # Message to display
			var tradeBoardRestrictionBMsg = '<%= sTradeBoardRestrictionB_Msg %>';
			var tradeBoardRestrictionDMsg = '<%= sTradeBoardRestrictionD_Msg %>';
			var tradeBoardRestrictionIMsg = '<%= sTradeBoardRestrictionI_Msg %>';
			var tradeBoardRestrictionOMsg = '<%= sTradeBoardRestrictionO_Msg %>';
			// # [END] Trade Board Restriction / Ban / Not allow
			
			// bug - v1.3.14.9
			// # [START] Order Pad - StopLimit, MinQty, DisclosedQty, Sett.Curr and Payment
			var forceDisableStopLimit = '';
			var forceDisableMinQty = '';
			var forceDisableDisclosedQty = '';
			var forceDisableSettCurr = '';
			var forceDisablePayment = '';
			// # [END] Order Pad - StopLimit, MinQty, DisclosedQty, Sett.Curr and Payment

			//[START] Order Pad - Show Default Value //v1.3.32.3
			var global_showPrice = '<%= sShowPrice %>';
			//[END] Order Pad - Show Default Value

			
			// # [START] Order Pad - payment type setting
			var global_orderPadPaymentSetting = '<%= sOrderPadPaymentSetting %>';
			// # [END] Order Pad - payment type setting

			
			// # [START] Order Pad - order pad unit trading
			var global_orderPadUnitTrading = '<%= sOrderPadUnitTrading %>';
			// # [END] Order Pad - order pad unit trading

			
			// # [START] Show Countdown timer //1.3.29.11
			var global_showCountDownTimer = '<%= sShowCountdownTimer %>';
			var global_countdownIdle = '<%= sCountdownIdle %>';
			var global_countdownTime = '<%= sCountdownTime %>';
			// # [END] Show Countdown timer
			
			// # [START] Deployment Pack - for Integration with WMS [TRUE will auto append ../ else FALSE will not do anything]
			var wMSServer = '<%= sWMSServer %>';
			var addPath = '<%= sAddPath %>';
			// # [END] Deployment Pack - for Integration with WMS [TRUE will auto append ../ else FALSE will not do anything]
			
			// # [START] Default column width for different Exchange //v1.3.30.9
			var global_feedColumnID = '<%= sColumnID %>';
			var global_feedWidthKL = '<%= sColumnWidthKL %>';
			var global_feedWidthMY = '<%= sColumnWidthMY %>';
			var global_feedWidthHK = '<%= sColumnWidthHK %>';
			var global_feedWidthSI = '<%= sColumnWidthSI %>';
			var global_feedWidthOth = '<%= sColumnWidthOther %>';
			
			var global_MDColumnID = '<%= sMDColumnID %>';
			var global_MDWidthKL = '<%= sMDColumnWidthKL %>';
			var global_MDWidthMY = '<%= sMDColumnWidthMY %>';
			var global_MDWidthHK = '<%= sMDColumnWidthHK %>';
			var global_MDWidthOth = '<%= sMDColumnWidthOther %>';
			
			var global_WLColumnID = '<%= sWLColumnID %>';
			var global_WLWidth = '<%= sWLColumnWidth %>';
			
			var global_OSColumnID = '<%= sOSColumnID %>';
			var global_OSWidth = '<%= sOSColumnWidth %>';
			
			var global_PFColumnID = '<%= sPFColumnID %>';
			var global_PFWidth = '<%= sPFColumnWidth %>';
			
			var global_RGLColumnID = '<%= sRGLColumnID %>';
			var global_RGLWidth = '<%= sRGLColumnWidth %>';
			// # [END] Default column width for different Exchange
			
			// [START] Column Setting
			var global_FeedAllColumn = '<%= sFeedAllColumn %>';
			var global_FeedDefaultColumn = '<%= sFeedDefaultColumn %>';
			
			var global_WLAllColumn = '<%= sWLAllColumn %>';
			var global_WLDefaultColumn = '<%= sWLDefaultColumn %>';
			
			var global_OSAllColumn = '<%= sOSAllColumn %>';
			var global_OSDefaultColumn = '<%= sOSDefaultColumn %>';
			
			var global_OHAllColumn = '<%= sOHAllColumn %>';
			var global_OHDefaultColumn = '<%= sOHDefaultColumn %>';
			
			var global_DerivativePFAllColumn = '<%= sDerivativePFAllColumn %>';
			var global_DerivativePFDefaultColumn = '<%= sDerivativePFDefaultColumn %>';
			
			var global_PFAllColumn = '<%= sPFAllColumn %>';
			var global_PFDefaultColumn = '<%= sPFDefaultColumn %>';
			
			var global_RGLAllColumn = '<%= sRGLAllColumn %>';
			var global_RGLDefaultColumn = '<%= sRGLDefaultColumn %>';
			// [END]Column Setting
                        
                        var vertxfeed = '<%= vertxFeedServer %>';
                        var guestVertxFeed = '<%= confGuestVertxFeed %>';
                        var defVToken = '<%= confDefVToken %>';
                        N2N_CONFIG.reloginURL = '<%= confReloginURL %>';
                        N2N_CONFIG.activeSub = <%= confActiveSubscription %>;
                        var vertxAutoConnect = '<%= vertxAutoConnect %>';
                        var vertxAutoRetry = '<%= vertxAutoRetry %>';
                        /*** Mobile Settings ***/
                        var global_MbFeedAllColumn = '<%= sMbFeedAllColumn %>';
			var global_MbFeedDefaultColumn = '<%= sMbFeedDefaultColumn %>';
                        var global_MbWLAllColumn = '<%= sMbWLAllColumn %>';
			var global_MbWLDefaultColumn = '<%= sMbWLDefaultColumn %>';
                        var global_MbPFAllColumn = '<%= sMbPFAllColumn %>';
			var global_MbPFDefaultColumn = '<%= sMbPFDefaultColumn %>';
                        var global_MbRGLAllColumn = '<%= sMbRGLAllColumn %>';
			var global_MbRGLDefaultColumn = '<%= sMbRGLDefaultColumn %>';
                        var global_MbOSAllColumn = "<%=sMbOSAllColumn%>";
                        var global_MbOSDefaultColumn = "<%=sMbOSDefaultColumn%>";
                        
                        var global_useBidSize = <%= confUseBidSize %>;
                        var global_priceListSize = <%= confPriceListSize %>;
                        
                        var global_useBidSize = <%= confUseBidSize %>;
                        var global_priceListSize = <%= confPriceListSize %>;
                        
			// # [START] Control of Logout URL
			var logoutDeviceDetection = '<%= sLogoutDeviceDetection %>';
			var logoutURLLite = '<%= sLogoutURLLite %>';
			var logoutURLOthers = '<%= sLogoutURLOthers %>';
			// # [END] Control of Logout URL

			// # [START] Equities Tracker URL - currently use by APEX
			var equitiesTrackerURL = '<%= sEquitiesTrackerURL %>';
			// # [END] Equities Tracker URL - currently use by APEX
			
			// # [START] stock news URL
			var global_StockNewsURL = '<%= sStockNewsURL %>';
			// # [END] stock news URL
			
			// # [START] PSE stock news URL
			var pseStockNewsURL = '<%= sPSEStockNewsURL %>';
			// # [END] PSE stock news URL			
			
			//# [START] Cash Top-Up URL
			var cashTopUpURL = '<%= sCashTopUpURL %>';
			//# [END] Cash Top-Up URL
			
			//# [START] IT Finance Chart URL
			var ITFinanceChartURL = '<%= sITFinanceChartURL %>';
			//# [END] IT Finance Chart URL

			//# [START] World Indices URL
			var worldIndicesURL = '<%= sWorldIndicesURL %>';
			//# [END] World Indices URL
			
			//# [START] User Guide URL
			var userGuideURL = '<%= sUserGuideURL %>';
			//# [END] User Guide URL
			
			//# [START] CUT FAQ URL
			var cutFaqURL = '<%= sCUTFaqURL %>';
			//# [END] CUT FAQ URL
			
			//# [START] TheScreener URL
			var theScreenerURL = '<%= sTheScreenerURL %>';
			//# [END] TheScreener URL
			
			//# [START] PSE Edge URL
			N2N_CONFIG.pseEdgeURL = '<%= sPSEEdgeURL %>';
			//# [END] PSE Edge URL
			
			var userAgent = '<%= sUserAgent %>';
			var tempSView = '<%= sView %>';
			
			var showFlashTeleChart = false;
			if(device.tablet() || device.mobile()) {
                        } else{
				if(showChartAnalysisChartAsFlash=="TRUE"){
					showFlashTeleChart = true;	
				}
			}
			
        	// Start - to fix IE 9 createContextualFragment
        	if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment)
        	{
        	    Range.prototype.createContextualFragment = function(html)
        	    {
        	        var frag = document.createDocumentFragment(),
        	        div = document.createElement("div");
        	        frag.appendChild(div);
        	        div.outerHTML = html;
        	        return frag;
        	    };
        	}
        	// Start - to fix IE 9 createContextualFragment
        	
            <%
				// store theme css name
				String themeCSS = "";
				String themeBlinkingCSS = "";
				String personalizationThemm = "";
                                
				boolean bInit = false;
				 	 
				boolean isIE10 = false;
				String browserType = (String) request.getHeader("User-Agent");
				if ( browserType.indexOf( "MSIE 10" ) != -1 ) {
					isIE10 = true;
				}
				 	 
				String global_displayUnit = "";
				
				String marketMoverCol 		= "";
				String watchlistCol 		= "";
				String sizeCol 				= "";
				String orderStatusCol 		= "";
                                String orderMbStatusCol         = "";
				String orderHisCol 			= "";
				String derportfolioCol 		= "";
				String portfolioCol 		= "";
				String portfolioRealCol 	= "";
				String newsReport    = "";
				String newsSetting   = "0";
				String reportSetting = "0";
				String dynamicLimitSetting = "1";
                                String noAsk = "0";
                                String newThemeSet = "0";
                                
                                String marketDepthSet          = "";
                                String marketDepthCol = "";
                                String marketDepthGradient = "normal";
                                String confMainLayout = "";
                                String confTbMainLayout = "";
                                String confMappedNames = "";
                                String confMappedNames_T = "";
                                String confRecentQuoteList = "";
                                String confSyncComp = "";
                                String defMarketDepthBuyPart = N2NConstant.getConstant("confDefGradientBuy", "8ACFAB");
                                String defMarketDepthSellPart = N2NConstant.getConstant("confDefGradientSell", "F296E1");
                                String defMarketDepthBuyPart_b = N2NConstant.getConstant("confDefGradientBuy_b", "497861");
                                String defMarketDepthSellPart_b = N2NConstant.getConstant("confDefGradientSell_b", "99568D");
                                String marketDepthBuyPart = "";
                                String marketDepthSellPart = "";
                                String marketDepthBuyPart_b = "";
                                String marketDepthSellPart_b = "";
                                String marketDepthUnchgColor = "";
                                String marketDepthUpColor = "";
                                String marketDepthDownColor= "";
                                boolean marketDepthApplyAll = true;
                                String tickerSettingItems = "0~7~1~~0~0"; // showticker|speed|showqsticker|watchlist|matchedorder|news
                                String fontSetting = "";
                                
                                // for mobile
                                String mbMarketMoverCol = "";
                                String mbWatchlistCol = "";
                                String mbPortfolioRealCol 	= "";
                                String mbPortfolioCol 		= "";
			//	String chartSetting  = "0";
				 	 
				boolean isOutBound = false;
				   
				String isLMS = N2NConstant.getConstant("confIsLMS").trim().equals("") ? "false" : N2NConstant.getConstant("confIsLMS").trim();
				JSONObject lmsAuthen = null;
				   
				String accRet = "";
				String authenret = "";
				String atpCurrencyRate = "";
				String atpRule = "";
				String atpPaymentCode = "";
				   
				String showTradeExchange = ( ( N2NConstant.getConstant("confTradeExchange_" + sSponsor ).equals("") ) ? "" : N2NConstant.getConstant("confTradeExchange_" + sSponsor) );
				String sConfViewEx = N2NConstant.getConstant( "confViewExchange_" + sSponsor );
				String sConfOBViewEx = N2NConstant.getConstant( "confOBViewExchange_" + sSponsor ).trim();
				  	
				String arFldCfg = "";
	            String arExMapping = "";
			
	            String require2FA = "";
	            String require2FAValidate = "";
	            String require2FADeviceList = "";
	            String require2FADevice = "";
	            String require2FABypass = "";
	            
	            String localExchange = "";
	            
	            String RDSIsRequest = "";
	            String RDSVersion = "";
	            String RDSDisclaimerURl = "";
	            
	            String pfEntryExchange = "";
	            String pfEntryAccType = "";
                String stockAlertATP = "";
                String fontSizeSet = "";
                String defTrAcc = "";
                String trAccOrd = "";
                String constUserPreference = "";
                String constCalPreference = "";
                String constLayoutPreference = "";
                String mbLayout = "";
                String sHomeCurrency = "";
                
                boolean isDealerRemisier = false;
		           
				if ( haveATP ) {
            
					ArrayList<String> subscribedExchange = new ArrayList<String>();
	                
	                ATPSocket atpSocket = null;
	                
	                if ( loginTcLiteSuccess && sess.getAttribute("tcplusatp") != null ) {
	                    atpSocket = (ATPSocket) sess.getAttribute("tcplusatp");
	                    if(confDRSearchAcc && (atpSocket.getATPTradingInfo().getSenderCategory().equalsIgnoreCase("D") || atpSocket.getATPTradingInfo().getSenderCategory().equalsIgnoreCase("R"))){
	                    	bInit = true;
	                    	isDealerRemisier = true;
	                    }else{
		                    bInit = atpSocket.getATPTradingInfo().isAccountInitialized();
	                    }
	                    int iTimeout = 10;
	                    
	                    while ( !bInit & iTimeout > 0 ) {
	                        Thread.sleep( 1000 );
	                        bInit = atpSocket.getATPTradingInfo().isAccountInitialized();
	                        iTimeout--;
	                    }
	
	                    if ( bInit ) {
	                    	try {
	                    		String key = null;
	                      		String mod = null;
	                      		
	                            org.json.JSONObject authenObj = new org.json.JSONObject();
	                            authenObj.put("atp", com.n2n.tcplus.atp.ATPDataFormat.getTradingLoginSuccess(atpSocket.getATPTradingInfo()));
	                            
	                            accRet = com.n2n.tcplus.atp.ATPDataFormat.getAccount( atpSocket.getATPTradingInfo(), null ).toString();
	                            
	                            StringBuffer sbString = new StringBuffer( authenObj.toString() );
	                           
	                            if ( authenObj.toString().length() > 6657 ) {                             
	                              int length = ( sbString.length() / 6657 ) + 1 ;
	
	                              //String[] array = new String[length];
	                              int idx = 0;
	                              int end = Math.min( 6657, sbString.length() );
	                              
	                              while( idx < length ) {
	                                //System.out.println("idx:" + idx);
	                                String string = sbString.substring( 0, end );
	                                sbString.delete( 0, end );
	                                authenret += string;
	                                idx++;
	                                end = Math.min( 6657, sbString.length() );
	                              } 
	                              
	                            } else {
	                            	authenret = authenObj.toString();
	                              
	                            }
	                            
	                            
	
	      	                    JSONArray arInputFld = ATPConstant.getOrderPadSetting();
	      	                  	arFldCfg = arInputFld.toString();
	                         	
	      	                  	// Encryption for order pad
	                            RSA rsa;
	                            if (sess.getAttribute("tcplusKey") == null) {
	                                rsa = new RSA();
	                                sess.setAttribute("tcplusKey", rsa);
	                            } else {
	                                rsa = (RSA) sess.getAttribute("tcplusKey");
	                            }
	                            key = rsa.getKey();
	                            mod = rsa.getMod();
	                            
	      	                    // pass key and modulus to frontend
	      	                    out.write("\n");
								out.write("key = '" + key + "'; \n");
	      	                    out.write("mod = '" + mod + "'; \n\n");
	      	             
	      	                    // currencyRate from ATP
	      	                    org.json.JSONObject authenObjCurrencyRate = new org.json.JSONObject();
	      	                  	authenObjCurrencyRate.put("obj", com.n2n.tcplus.atp.ATPDataFormat.getTradingCurrencyRate(atpSocket.getATPTradingInfo()));
	      	                  	atpCurrencyRate = authenObjCurrencyRate.toString();
	      	                  	
	      	                  	// trading rule from ATP
	      	                    org.json.JSONObject tradeObjFromATP = com.n2n.tcplus.atp.ATPDataFormat.getTradingRule(atpSocket.getATPTradingInfo());
	      	                  	atpRule = tradeObjFromATP.toString();
	      	                  	
	      	                  	//payment code from ATP
	      	                  	org.json.JSONObject tradeObjMapPaymentCode = com.n2n.tcplus.atp.ATPDataFormat.getTradingMapPaymentCode(atpSocket.getATPTradingInfo());
	      	                  	atpPaymentCode = tradeObjMapPaymentCode.toString();
	      	                  	
	      		                if ( sSponsor != null && sSponsor.trim().length() > 0 ) {
	      		                    //org.json.JSONArray setting = ATPConstant.getOrderPadSetting();
	      		
	      		                    
	      		                    //out.write("var confTrdEx ='" + N2NConstant.getConstant("confTradeExchange_" + sSponsor) + "';\n");
	      		                    //out.write("var arFldCfg =" + setting.toString() + ";\n");
	      		
									
		      	                    String sLMSExMapping = null;
		      	                    
		      	                   
		      	                  	String sBhCode = atpSocket.getATPTradingInfo().getBrokerCode();
		      	                	String sCliCode = atpSocket.getATPTradingInfo().getSenderCode();
		      	                	String sCliCategory = atpSocket.getATPTradingInfo().getSenderCategory();
		      	                	String sCliSkipPin = atpSocket.getATPTradingInfo().getSenderSkipPin();
		      	                	String sUserParam = N2NUtil.byteToHex(atpSocket.getATPTradingInfo().getUserParam(), true); //v1.3.30.21 To get user param
		      	                	String sMobileNo = atpSocket.getATPTradingInfo().getMobileNo();
		      	                	String sEmailAdd = atpSocket.getATPTradingInfo().getEmailAdd();
		      	                    isOutBound = atpSocket.getATPTradingInfo().isOutBoundActivated();
		      	                    sHomeCurrency = atpSocket.getATPTradingInfo().getHomeCurrency();
		                          	//isOutBound = false;
		                          	
		                          	
		                          	if ( isLMS.toLowerCase().equals( "true" ) ) {
		                          		String lmsFilePath = N2NConstant.getConstant("confLMSLocalFile");
		                          		String sLMSSponsorID = ( ( N2NConstant.getConstant("confSponsorLMSMapping_" + sSponsor ).equals( "" ) ) ? "" : N2NConstant.getConstant("confSponsorLMSMapping_" + sSponsor) );
		      	                		sess.setAttribute("lmsSponsorId", sLMSSponsorID);
		      	                		
		      	                		if(isOutBound){
		      	                			lmsFilePath = N2NConstant.getConstant("confLMSOutboundFile");
		      	                		}
		      	                		
		      	                    	LMSSubscription lmsSubscription = new LMSSubscription(sLoginId, sLMSSponsorID, isOutBound, lmsFilePath);
		      	                		
		      	                		if ( lmsSubscription.authenSubscription(sBhCode) ) {
		      								ArrayList<LMSServiceBean> list = lmsSubscription.getSubscriptionsOrderByCountryCode();//getSubscriptions();
		      								
		      								ArrayList<String> arService = new ArrayList<String>();
		      								for ( LMSServiceBean bean: list ) {
		      									if( !arService.contains(bean.getFeedExchgCode() ) ) {
		      										arService.add( bean.getFeedExchgCode() );	
		      									}
		      								}
		      								sConfViewEx = N2NUtil.join( arService.iterator(), "," );
		      								
		      								JSONArray jsScptList = new JSONArray();
		      								
		      								for(LMSServiceBean bean: list) {
		      									JSONObject jsScpt = new JSONObject();
		      									jsScpt.put( "ex", bean.getFeedExchgCode() );
		      									jsScpt.put( "trdex", bean.getTrdExchgCode() );
		      									jsScpt.put( "trdopt", bean.getExchgTrdOpt() );
		      									jsScpt.put( "exn", bean.getExchgName() );
		      									jsScpt.put( "exfn", bean.getExchgDesc() );
		      									jsScpt.put( "extype", bean.getExchgType() );
		      									jsScpt.put( "exctycode", bean.getExchgCountryCode() );
		      									jsScpt.put( "mktdptlvl", bean.getMktDepthLvl() );
                                                jsScpt.put( "bts2mktdptlvl", bean.getBTS2MktDepthLevel() );
                                                jsScpt.put( "tcplusfeatures", bean.getTCPlusFeatures() );
		      									
		      									jsScptList.put( jsScpt );
		      								}
		      								lmsAuthen = new JSONObject();
		      								lmsAuthen.put( "scpt", jsScptList );
		      	                		}
		                          	}
		                          	
		                          	if ( lmsAuthen == null ) {
		      							JSONArray jsonExMapping = ATPConstant.getOrdPadExMapping();
		      							arExMapping = jsonExMapping.toString();		      							
		      							
		                          	} else {
		                          		arExMapping = lmsAuthen.toString();
		      	                    }
		                          	
		                            //remove this checking to support BTS2 & MY
		                          	/*
		      	                    if ( isOutBound && isLMS.toLowerCase().equals( "true" ) ) {
		      	                    	
		      	                    	//if ( lmsAuthen != null ) {
		      	                    		showTradeExchange = com.n2n.tcplus.atp.ATPDataFormat.getAccountSupportedEx( atpSocket.getATPTradingInfo() );
		      	                    	//}
		      	                    } */
		
		      	                  	showTradeExchange = com.n2n.tcplus.atp.ATPDataFormat.getAccountSupportedEx( atpSocket.getATPTradingInfo() );
		
		      	                    //out.write("confTrdEx ='" + N2NConstant.getConstant("confTradeExchange_" + sSponsor) + "';\n");	// option to know which exchange can trading
		      	                    //out.write("var confTrdEx ='"+com.n2n.tcplus.atp.ATPDataFormat.getAccountSupportedEx(atpSocket.getATPTradingInfo())+"';\n");	// option to know which exchange can trading
		      	                   
		      	                  	out.write("var bhCode = '" + sBhCode + "';\n");
		      	                  	out.write("var cliCode = '" + sCliCode + "';\n");
		      	                  	out.write("var cliCategory = '" + sCliCategory + "';\n"); //1.3.24.5 
		      	                  	out.write("var global_skipPin = '" + sCliSkipPin + "';\n"); //1.3.24.5
		      	                 	out.write("var global_userParam = '" + sUserParam + "';\n"); //v1.3.30.21 
		      	                	out.write("var mobileNo = '" + sMobileNo + "';\n");
		      	                	out.write("var emailAdd = '" + sEmailAdd + "';\n");
		      	                	
		      	                	
	      		                    //beacon sub
	      		                    String BeaconSubsChecking = ( ( N2NConstant.getConstant("confEnableBeaconSubsChecking_" + sSponsor).equals("") ) ? "false" : N2NConstant.getConstant("confEnableBeaconSubsChecking_" + sSponsor) );
	      		                    
	      		                    /*if ("true".equalsIgnoreCase( BeaconSubsChecking ) ) {
	      		                    	BeaconSubscription beaconSubs = (BeaconSubscription) sess.getAttribute("beaconsub");
	      		                        
	      		                    	if (beaconSubs == null) {
	      		                        	beaconSubs = new BeaconSubscription(sLoginId);
	      		                        }
	      		                    	
	      		                        beaconSubs.check50LvlDepthService();
	      		                        sess.setAttribute("beaconsub", beaconSubs);
	      		                    }*/
	      		                    
	      						}
	      		                
	      		              	marketMoverCol 		= com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLMMCOLS");
	      		              	mbMarketMoverCol 		= com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLMBMMCOL");
	      		                watchlistCol 		= com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLWLCOLS");
	      		                mbWatchlistCol 		= com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLMBWLCOL");
	      		                sizeCol 			= com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLRESSIZ");
	      		              	orderStatusCol 		= com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLOSCOLS");
                                        orderMbStatusCol        = com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLMBOSCOL");
	      		              	orderHisCol 		= com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLOHCOLS");
	      		              	derportfolioCol		= com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLDPFCOLS");
	      		                portfolioCol 		= com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLPFCOLS");
	      		                mbPortfolioCol 		= com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLMBPFCOL");
	      		                portfolioRealCol 	= com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLRGLCOLS");
	      		                mbPortfolioRealCol 	= com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLMBRGLC");
                                        marketDepthCol          = com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLMDCOLS");
                                        marketDepthSet          = com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLMDSET");
	      		              	confMainLayout       = com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLMLV2");
	      		              	confRecentQuoteList       = com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLRQL");
	      		              	confSyncComp       = com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLSCM");
	      		              	confTbMainLayout       = com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLTLV2");
                                        // user profile layouts
                                        for (int i = 0; i < avaiLy.size(); i++) {
                                            for (int j = 0; j < avaiPr.size(); j++) {
                                                String lyKey = avaiLy.get(i) + avaiPr.get(j); // eg. TCLULA1 layout A for profile 1
                                                String lyStr = com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLUL" + lyKey);
                                                userLayoutObj.put(lyKey, lyStr);
                                            }
                                        }
                                        
	      		              	confMappedNames       = com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLMN");
	      		              	confMappedNames_T       = com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLTMN");
                                        stockAlertATP       = com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLALERT");
	      		              	String tempStr = com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLTSI");
                                        defTrAcc =  com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLTDA");
                                        trAccOrd =  com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLTAO");
                                        constUserPreference =  com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLUPRF");
                                        constLayoutPreference =  com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLLPRF");
                                        constCalPreference =  com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLTCAL");
                                        mbLayout =  com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLMBML");
                                        tempStr = tempStr.trim();
                                        if (!tempStr.equals("")) {
                                            tickerSettingItems = tempStr;
                                        }
                                      
                                        fontSetting =  com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLFS");
                                        
	      		                String tempThemeSetting = (isBasicVer ? "" : com.n2n.tcplus.atp.ATPDataFormat.getPersonalization(atpSocket.getATPTradingInfo(), "TCLPTHEME"));
	      		      		
                                        if(marketDepthSet!=""){
                                          if(marketDepthSet.indexOf(",")!=-1){
                                               String marketDepthColSplit [] = marketDepthSet.split(",");
                                               marketDepthCol = marketDepthColSplit[0];
                                               marketDepthGradient = marketDepthColSplit[1]==null || marketDepthColSplit[1].trim()=="" ? "normal" : marketDepthColSplit[1].trim();   
                                              if(marketDepthColSplit.length > 2){
                                                marketDepthBuyPart = marketDepthColSplit[2];
                                                marketDepthSellPart = marketDepthColSplit[3];
                                                if(marketDepthColSplit.length > 4){
                                                    marketDepthUnchgColor = marketDepthColSplit[4];
                                                    marketDepthUpColor = marketDepthColSplit[5];
                                                    marketDepthDownColor = marketDepthColSplit[6];
                                                    if(marketDepthColSplit.length > 7){
                                                        // marketDepthApplyAll = marketDepthColSplit[7].equalsIgnoreCase("y");
                                                    }
                                                    if(marketDepthColSplit.length > 8){
                                                        marketDepthBuyPart_b = marketDepthColSplit[8];
                                                    }
                                                    if(marketDepthColSplit.length > 9){
                                                        marketDepthSellPart_b = marketDepthColSplit[9];
                                                    }
                                                }                                             
                                              }                                             
                                          }else{
                                              marketDepthCol = marketDepthDefaultColumn;
                                          }
                                        }else{
                                               marketDepthCol = marketDepthSet;
                                        }

                                            if (marketDepthBuyPart == "") {
                                                marketDepthBuyPart = defMarketDepthBuyPart;
                                            }
                                            if (marketDepthSellPart == "") {
                                                marketDepthSellPart = defMarketDepthSellPart;
                                            }
                                            if (marketDepthBuyPart_b == "") {
                                                marketDepthBuyPart_b = defMarketDepthBuyPart_b;
                                            }
                                            if (marketDepthSellPart_b == "") {
                                                marketDepthSellPart_b = defMarketDepthSellPart_b;
                                            }
                                        
	      		                if ( tempThemeSetting.indexOf("~") != -1 ) {
	      		                	personalizationThemm = ( tempThemeSetting.split("~") )[0];
	      		                	global_displayUnit = ( tempThemeSetting.split("~") )[1];
	      		                if(tempThemeSetting.split("~").length >= 3){	
	      		                	newsReport = (tempThemeSetting.split("~"))[2]==""? "":(tempThemeSetting.split("~"))[2];
	      		                	if(newsReport.indexOf("news")!=-1){
	      		                		 String newsSplit[] = newsReport.split("-")[0].split(",");
	      		                		   if(newsSplit.length==2){
	      		                		       newsSetting = newsSplit[1];
	      		                	}
	      		                	       }
	      		                	
	      		                	if(newsReport.indexOf("rpt")!= -1){
	      		                		 String reportSplit[] = newsReport.split("-")[1].split(",");
	      		                		    if(reportSplit.length==2){
	      		                		      	reportSetting = reportSplit[1];
	      		                			}
	      		                	 }
	      		                	
	      		                	if(newsReport.indexOf("dl")!= -1){
      		                		 	String dynamicLimitSplit[] = newsReport.split("-")[2].split(",");
      		                		    	if(dynamicLimitSplit.length==2){
      		                		        	dynamicLimitSetting = dynamicLimitSplit[1];
      		                				}
      		                	    }
                                                if(newsReport.indexOf("fs")!= -1){
                                                    String fontSizeSplit[] = newsReport.split("-")[3].split(",");
                                                    if(fontSizeSplit.length == 2){
                                                          fontSizeSet = fontSizeSplit[1]; 
                                                    }
                                                }
                                                if (newsReport.indexOf("na") != -1) {
                                                    String noAskArr[] = newsReport.split("-")[4].split(",");
                                                    if (noAskArr.length == 2) {
                                                        noAsk = noAskArr[1];
                                                    }
                                                }
                                                if (newsReport.indexOf("nt") != -1) { // whether new theme has been set
                                                    String newThemeArr[] = newsReport.split("-")[5].split(",");
                                                    if (newThemeArr.length == 2) {
                                                        newThemeSet = newThemeArr[1];
                                                    }
                                                }
                                                
                                                /* Disable language pref in ATP. Get language from homepage.
                                                if (newsReport.indexOf("lang") != -1) { // default langauge
                                                    String newLangArr[] = newsReport.split("-")[6].split(",");
                                                    if (newLangArr.length == 2) {
                                                        sLanguage = newLangArr[1];
                                                    }                                                  
                                                }
                                                */
	  		                	}
                                        
	      		                	/*
	      		                	if(newsReport.indexOf("chart")!= -1){
	      		                		chartSetting = newsReport.substring(newsReport.indexOf("chart")+6, newsReport.indexOf("chart")+7);
	      		                	}
	      		                	*/
	      		                	
	      		                } else {
	      		                	global_displayUnit = sDefaultDisplay;
	      		                       newsReport = "";
	      		                }
	      		                   		                
	      		              	localExchange = atpSocket.getATPTradingInfo().getLocalExchange();
	      		                
	      		              	require2FA = atpSocket.getATPTradingInfo().get2FARequire() ? "true" : "false";
	      		              	require2FAValidate = atpSocket.getATPTradingInfo().get2FAValidate() ? "true" : "false";
	      		            	require2FADeviceList = atpSocket.getATPTradingInfo().get2FADeviceList();
	      		          		require2FADevice = atpSocket.getATPTradingInfo().get2FADevice();
	      		          		require2FABypass = atpSocket.getATPTradingInfo().get2FABypass().equals("") ? "NO" : atpSocket.getATPTradingInfo().get2FABypass().toUpperCase();
	      		          		
	      		          		RDSIsRequest = atpSocket.getATPTradingInfo().getRDSRequire();
	      		          		RDSVersion = atpSocket.getATPTradingInfo().getRDSVersion();
	      		          		RDSDisclaimerURl = atpSocket.getATPTradingInfo().getRDSDisclaimerURL();
	      		          		
	      		          		pfEntryExchange = atpSocket.getATPTradingInfo().getPFEntryExchange();
	      		          		pfEntryAccType = atpSocket.getATPTradingInfo().getPFEntryAccType();
	      		          		
	                    	} catch ( Exception e ) {
	                    		e.printStackTrace();
	                    	}
	                    	
	                    } else {
							logoutTcLite( sess );
	                    }
	                }                 
                
   				}
                                
                // force to use new theme
                if (personalizationThemm == "" || newThemeSet == "0") {
                    personalizationThemm = sThemeColor; // default theme
                    if (sThemeBackgroundColor != "white") {
                        personalizationThemm += "_" + sThemeBackgroundColor;
                    }
                }
                                
                // sets default main layout if it's empty
                String defLayout = "2~t=2,0{w=1{mt=qs==0=0{am=qs";
                String defSetMainLayout = N2NConstant.getConstant("confMainLayout", defLayout);
                String defSetMainTbLayout = N2NConstant.getConstant("confTbMainLayout", defLayout);
                if(isDealerRemisier){
                	confMainLayout = N2NConstant.getConstant("confMainLayoutDR", defLayout);
                }else{
	                if(confMainLayout.isEmpty())        
	                    confMainLayout = N2NConstant.getConstant("confMainLayout", defLayout);
	                if(confTbMainLayout.isEmpty())        
	                    confTbMainLayout = N2NConstant.getConstant("confTbMainLayout", defLayout);
                }
                
                if (constLayoutPreference.isEmpty()) {
                    constLayoutPreference = N2NConstant.getConstant("confLayoutPreference", "");
                }
                if (mbLayout.isEmpty()) {
                    mbLayout = N2NConstant.getConstant("confMbLayout", "w{am=qs==0=0");
                }
                
                if (fontSetting.isEmpty()) {
                    fontSetting = N2NConstant.getConstant("confFontSetting", "ft_Helvetica,fcl_up~008000~00ff00_down~cc0000~ff0000_unchg~2f4f4f~ffffff_yel~8e9005~ffff00,alter_0");
                }
                
                if (confSyncComp.isEmpty()) {
                    confSyncComp = confDefUserSyncItems;
                }
                
            	 
				out.write("\n\n//------------------------------------------------------------ \n");
          		out.write("var global_HaveATP = '" + haveATP + "';\n\n");
                        out.write("var global_IsGuest = " + isGuest + ";\n\n");
          		out.write("var loginId = '" + sLoginId + "';\n");
          		out.write("var sView = '" + sView + "';\n");
          		out.write("var isBasicVer = " + isBasicVer + ";\n");
          		
          		out.write("var switchView = '" + sSwitchView + "';\n\n");
          		out.write("var version = '" + sVersion + "';\n\n");
          		out.write("var sponsorID = '" + sSponsor + "';\n\n");
               
             	out.write("// have LMS : " + isLMS + "; \n");
         		out.write("// LMS result : " + ( lmsAuthen == null ) + "; \n\n");
         		out.write("var isLMS = " + isLMS + "; \n\n");
                        out.write("var defMarketDepthBuyColor = '"+defMarketDepthBuyPart+"'; \n");
                        out.write("var defMarketDepthSellColor = '"+defMarketDepthSellPart+"'; \n");
                        out.write("var defMarketDepthBuyColor_b = '"+defMarketDepthBuyPart_b+"'; \n");
                        out.write("var defMarketDepthSellColor_b = '"+defMarketDepthSellPart_b+"'; \n");
                        out.write("var marketDepthBuyColor = '"+marketDepthBuyPart+"'; \n");
                        out.write("var marketDepthSellColor = '"+marketDepthSellPart+"'; \n");
                        out.write("var marketDepthBuyColor_b = '"+marketDepthBuyPart_b+"'; \n");
                        out.write("var marketDepthSellColor_b = '"+marketDepthSellPart_b+"'; \n");
                        out.write("var marketDepthUnchgColor = '"+marketDepthUnchgColor+"'; \n");
                        out.write("var marketDepthUpColor = '"+marketDepthUpColor+ "'; \n");
                        out.write("var marketDepthDownColor = '" + marketDepthDownColor + "'; \n");
            	out.write("var outbound = " + isOutBound + "; \n\n");
            	
         		out.write("var confTrdEx ='" + showTradeExchange + "'; \n");	// option to know which exchange can trading (properties)
        		out.write("var confViewEx ='" + sConfViewEx + "'; \n");
        		out.write("var confOBViewEx ='" + sConfOBViewEx + "'; \n");
        		
        		if(sDefaultExchange.length() > 0){
           			out.write("var global_confDefaultViewEx = '" + sDefaultExchange + "'; \n\n");
        		}else{
           			out.write("var global_confDefaultViewEx = '" + N2NConstant.getConstant( "confDefaultViewExchange" ) + "'; \n\n");
        		}
        		
        		if(sHomeCurrency.length() > 0){
        			out.write("defCurrency = '" + sHomeCurrency + "'; \n\n");
        		}
        		
       			out.write("var global_confDefaultViewExBkp = '" + N2NConstant.getConstant( "confDefaultViewExchange" ) + "'; \n\n");
             
           	   	out.write("var global_s2FARequire = '" + require2FA + "'; \n");
         		out.write("var global_s2FAValidate = '" + require2FAValidate + "'; \n");
         		out.write("var global_s2FADeviceList = '" + require2FADeviceList + "'; \n");
         		out.write("var global_s2FADevice = '" + require2FADevice + "'; \n\n");
         		out.write("var global_s2FABypass = '" + require2FABypass + "'; \n\n");
         		
         		out.write("var global_sLocalExchange = '" + localExchange + "'; \n\n");
         		
         		out.write("var global_sRDSIsRequire = '" + RDSIsRequest + "'; \n");
         		out.write("var global_sRDSVersion = '" + RDSVersion + "'; \n\n");
         		out.write("var global_sRDSDisclaimerURL = '" + RDSDisclaimerURl + "'; \n\n");
         		
         		out.write("var global_sPFEntryExchange = '" + pfEntryExchange + "'; \n\n");
         		out.write("var global_sPFEntryAccType = '" + pfEntryAccType + "'; \n\n");
         		
           		out.write("arFldCfg =" + ( arFldCfg.equals( "" ) ? "''" : arFldCfg ) + "; \n\n");
                  
           		out.write("arExMapping = " + ( arExMapping.equals( "" ) ? "''" : arExMapping ) + "; \n\n");
           		
           	 	out.write("var accRet =" + ( accRet.equals( "" ) ? "''" : accRet ) + "; \n\n");
           		out.write("var authenret = " + ( authenret.equals( "" ) ? "''" : authenret ) + "; \n\n");
       	
           		out.write("var atpCurrencyRate = " + ( atpCurrencyRate.equals( "" ) ? "''" : atpCurrencyRate ) + "; \n\n" );
           		out.write("var atpRule = " + ( atpRule.equals( "" ) ? "''" : atpRule ) + "; \n\n" );
           		out.write("var atpPaymentCode = " + ( atpPaymentCode.equals( "" ) ? "''" : atpPaymentCode ) + "; \n\n" );
           		
           		out.write("var isDealerRemisier = " + isDealerRemisier + "; \n\n" );
           		
               	out.write("var mmColSetting = 'TCLMMCOLS';  \n" );
               	out.write("var wlColSetting = 'TCLWLCOLS';  \n" );
               	out.write("var sizeSetting = 'TCLRESSIZ';  \n" );
               	out.write("var osColSetting = 'TCLOSCOLS';  \n" );
                out.write("var mbOSColSetting= 'TCLMBOSCOL'; \n");
               	out.write("var ohColSetting = 'TCLOHCOLS';  \n" );
               	out.write("var dpfColSetting = 'TCLDPFCOLS';  \n" );
              	out.write("var pfColSetting = 'TCLPFCOLS';  \n" );
               	out.write("var pfRealColSetting = 'TCLRGLCOLS';  \n\n" );
                out.write("var mbMMColSetting = 'TCLMBMMCOL';  \n" );
                out.write("var mbWlColSetting = 'TCLMBWLCOL';  \n" );
                out.write("var mbPfColSetting = 'TCLMBPFCOL';  \n" );
                out.write("var mbPfRealColSetting = 'TCLMBRGLC';  \n\n" );
                out.write("var stockAlertATP = '"+stockAlertATP+"';  \n\n" );
               
          		// bug - v1.3.14.9
          		out.write("var global_orderPadSetting = '" + showOrderPadSetting + "'; \n");
          		out.write("var global_derivativesMarket = '" + showConfDerivativesMarket + "'; \n\n");
          	 
          	 	out.write("var global_isIE10 = '" + isIE10 + "'; \n");
            	out.write("var global_personalizationTheme = '" + personalizationThemm + "'; \n");
           		out.write("var global_displayUnit = '" + global_displayUnit + "'; \n\n"); // v1.3.34.68
           		
           		out.write("var global_newsSetting = '"+newsSetting+"'; \n");
           		out.write("var global_reportSetting= '"+reportSetting+"'; \n ");
           		out.write("var global_dynamicLimitSetting= '"+dynamicLimitSetting+"'; \n ");
           		out.write("var global_noAsk= '"+noAsk+"'; \n ");
           		out.write("var global_Language= '"+sLanguage+"'; \n ");
           	//	out.write("var global_chartSetting= '"+chartSetting+"'; \n ");
           	%>
          	if(showUISetting.toLowerCase()=="true"){
        		global_NewWindow_News= global_newsSetting;
   	       }
        	if(showUISetting.toLowerCase()=="true"){
        		global_NewWindow_Report= global_reportSetting;
   	       }
           	<%
           		out.write("var sizeCol = '" + sizeCol + "';  \n");
          	 	out.write("var marketMoverCol = '" + marketMoverCol + "'; \n");
            	out.write("var watchlistCol = '" + watchlistCol + "';  \n");
            	out.write("var orderStatusCol = '" + orderStatusCol + "';  \n");
                out.write("var orderMbStatusCol = '" + orderMbStatusCol + "';  \n");
            	out.write("var orderHisCol = '" + orderHisCol + "';  \n");
            	out.write("var derivativePortfolioCol = '" + derportfolioCol + "';  \n");
            	out.write("var portfolioCol = '" + portfolioCol + "';  \n");
                out.write("var portfolioRealCol = '" + portfolioRealCol + "';  \n");
                out.write("var marketDepthCol= '"+ marketDepthCol+ "';\n\n");
                out.write("var marketDepthGradient = '"+marketDepthGradient+"'; \n");
                out.write("var marketDepthApplyAll = "+marketDepthApplyAll+";\n");
                out.write("var fontSaving='"+fontSetting+"';");
                out.write("N2N_CONFIG.syncComp='"+confSyncComp+"';");
                
                out.write("N2N_CONFIG.mainLayout= '"+ confMainLayout + "';\n");
                out.write("N2N_CONFIG.defaultLayout= '"+ defSetMainLayout + "';\n");
                out.write("N2N_CONFIG.defaultTbLayout= '"+ defSetMainTbLayout + "';\n");
                out.write("N2N_CONFIG.tbMainLayout= '"+ confTbMainLayout + "';\n");
                out.write("N2N_CONFIG.mappedNames= '"+ confMappedNames + "';\n");
                out.write("N2N_CONFIG.mappedNames_T= '"+ confMappedNames_T + "';\n");
                out.write("N2N_CONFIG.defTrAcc = '"+ defTrAcc + "';\n");
                out.write("N2N_CONFIG.trAccOrd = '"+ trAccOrd + "';\n");
                out.write("N2N_CONFIG.userPrf = '"+ constUserPreference + "';\n");
                out.write("N2N_CONFIG.layoutPrf = '"+ constLayoutPreference + "';\n");
                out.write("N2N_CONFIG.mbLayout = '"+ mbLayout + "';\n");
                out.write("N2N_CONFIG.calPrf = '"+ constCalPreference + "';\n");
                out.write("N2N_CONFIG.guestLayout = '"+ confGuestLayout + "';\n");
                out.write("N2N_CONFIG.enableLayoutProfile = "+ confEnableLayoutProfile + ";\n");
                out.write("N2N_CONFIG.defLayoutProfiles = "+ defLayoutProfilesObj + ";\n");
                out.write("N2N_CONFIG.userLayouts = "+ userLayoutObj + ";\n");
                out.write("var tsItems = '"+ tickerSettingItems + "';\n");
                
                out.write("N2N_CONFIG.recentQuoteList= '"+ confRecentQuoteList + "';\n");
                
                out.write("var mbMarketMoverCol = '" + mbMarketMoverCol + "'; \n");
                out.write("var mbWatchlistCol = '" + mbWatchlistCol + "';  \n");
                out.write("var mbPortfolioCol = '" + mbPortfolioCol + "';  \n");
                out.write("var mbPortfolioRealCol = '" + mbPortfolioRealCol + "';  \n");
                
          		// required column setting
				out.write("var marketMoverReqCol = '" + N2NConstant.getConstant("confMarketMoverReqCol") + "';\n");
				out.write("var watchlistReqCol = '" + N2NConstant.getConstant("confWatchlistReqCol") + "';\n");
				out.write("var orderStatusReqCol = '" + N2NConstant.getConstant("confOrderStatusReqCol") + "';\n");
				out.write("var orderHisReqCol = '" + N2NConstant.getConstant("confOrderHisReqCol") + "';\n");
				out.write("var portfolioReqCol = '" + N2NConstant.getConstant("confPortfolioReqCol") + "';\n");
				out.write("var portfolioRealReqCol = '" + N2NConstant.getConstant("confPortfolioRealReqCol") + "';\n\n");
              
          		out.write("var global_theme = '" + themeCSS + "';\n");
				out.write("var global_themeBack = '" + themeBlinkingCSS + "';\n\n");
              
				out.write("var global_margin = ''; \n\n");
				out.write("var ordLogToolTip= '" + sOrdLogToolTip + "';\n");
				
				//String sDisclaimerPath = N2NConstant.getConstant("portFolioDisclaimerFilePath_"+sSponsor);
				String sDisclaimerSetting = N2NConstant.getConstant("portFolioDisclaimerFileSetting_" + sSponsor);
                                if (!sDisclaimerSetting.isEmpty()) {
                                    out.write("var disclaimerAvailble = true; \n\n");

                                    String[] arDisclaimerSetting = sDisclaimerSetting.split("\\|");
                                    if (arDisclaimerSetting.length == 4) {
                                        out.write("var disclaimerBtnType = '" + arDisclaimerSetting[1] + "';\n");
                                        out.write("var disclaimerWidth = " + arDisclaimerSetting[2] + ";\n");
                                        out.write("var disclaimerHeight = " + arDisclaimerSetting[3] + ";\n");
                                    }
                                } else {
                                    out.write("var disclaimerAvailble = false; \n\n");
                                }
					
            %>
        </script>
        
        <%
        	boolean allowLoginTcLite = false;
        	String theme = "";
               String fixcrisp = "";
               String whitetheme = "";
               String blacktheme="";
        	if ( haveATP ) {
        		
        		if ( bInit ) {
        			allowLoginTcLite = true;
        			
        		} else {
        			allowLoginTcLite = false;
        			
        		}
        		
        	} else {
        		allowLoginTcLite = true;
        		
        	}
                // get theme name
                theme = personalizationThemm.split("_")[0];
                
                // blinking css
                if (personalizationThemm.indexOf("black") != -1) {
                    themeBlinkingCSS = "css/N2NCSS/blinking_black.css";
                    if (theme.equals("wh")) {
                        blacktheme = "css/N2NCSS/black.css";
                    }

                } else {
                    themeBlinkingCSS = "css/N2NCSS/blinking_white.css";
                }

                // theme css
                if (theme.equals("grey")) {
                    themeCSS = "js/lib/extjs/themes/ext-theme-gray/resources/ext-theme-gray-all.css";
                } else if (theme.equals("blue")) {
                    themeCSS = "js/lib/extjs/themes/ext-theme-classic/resources/ext-theme-classic-all.css";
                } else if (theme.equals("crisp")) {
                    themeCSS = "js/lib/extjs/themes/ext-theme-crisp/resources/ext-theme-crisp-all.css";
                    fixcrisp = "css/N2NCSS/crisp.css";
                } else if (theme.equals("neptune")) {
                    themeCSS = "js/lib/extjs/themes/ext-theme-neptune/resources/ext-theme-neptune-all.css";
                    fixcrisp = "css/N2NCSS/crisp.css";
                } else {
                    themeCSS = "js/lib/extjs/themes/ext-theme-gray/resources/ext-theme-gray-all.css";
                    whitetheme = "css/N2NCSS/whbase.css";
                }
                
        %>
        
        <% if ( allowLoginTcLite ) { %>
        
        <link rel="stylesheet" type="text/css" href="css/fonts/fonts.css" charset="utf-8"/>
        <link rel="stylesheet" type="text/css" href="<%=themeCSS%>"  id="themeCSS"/>
        <link rel="stylesheet" type="text/css" href="<%=themeBlinkingCSS %>" id="themeCSS_blink" />
           <link rel="stylesheet" type="text/css" href="<%=fixcrisp%>" id="fixcrisp">
           <link rel="stylesheet" type="text/css" href="<%=whitetheme%>" id="whitetheme" >
           <link rel="stylesheet" type="text/css" href="<%=blacktheme%>" id="blacktheme" >
           
        <% if (confMinify) {%>
            <link rel="stylesheet" type="text/css" href="css/style-min.css?<%=N2NConstant.getRelease()%>"/>
            <link rel="stylesheet" type="text/css" href="js/lib/extjs/plugins/colorpicker/css/colorpicker-min.css" />
        <% } else {%>
            <link rel="stylesheet" type="text/css" href="css/style.css?<%=N2NConstant.getRelease()%>"/>
            <link rel="stylesheet" type="text/css" href="js/lib/extjs/plugins/colorpicker/css/colorpicker.css" />
        <% }%>
        
            <script type="text/javascript" src="js/N2N_Storage/N2NHashtable.js?<%=N2NConstant.getRelease()%>"></script>
            
            <!-- Language - load language file -->
        	<script type="text/javascript" src="js/language/LanguageFormat.js?<%=N2NConstant.getRelease()%>"></script> 
	        <% 	
	        	String path = "";
	        	String tempPath = "";
	        	String mobileFileIndicator = "";
	        	
	        	if(sLanguage.equalsIgnoreCase("")){
	        		sLanguage = sDefaultLanguage;
	        	}
	        	
	        	sess.setAttribute("lang", sLanguage);
	        	
	        	if(sView.equals("mobile")){
	        		mobileFileIndicator = "_m";
				}
	        
	        	if(sWMSServer.equalsIgnoreCase("TRUE")){
	        		tempPath = "tcplus/js/language/Language_";
           			path = request.getServletContext().getRealPath(tempPath + sSponsor + "_" + sLanguage.toLowerCase() + mobileFileIndicator + ".js");
	        	}else{
	        		tempPath = "js/language/Language_";
           			path = request.getServletContext().getRealPath(tempPath + sSponsor + "_" + sLanguage.toLowerCase() + mobileFileIndicator + ".js");
	        	}
	                	
	        	File languageFile = new File(path);
	        	
	        	if(languageFile.exists()){ %>
					<script type="text/javascript" src="js/language/Language_<%=sSponsor%>_<%=sLanguage.toLowerCase()%><%=mobileFileIndicator%>.js?<%=N2NConstant.getRelease()%>"></script>
			<%	} else{
					if(!sLanguage.toLowerCase().equalsIgnoreCase("en")){
						path = request.getServletContext().getRealPath(tempPath + sSponsor + "_en" + mobileFileIndicator + ".js");
						languageFile = new File(path);
						
						if(languageFile.exists()){ %>
							<script type="text/javascript" src="js/language/Language_<%=sSponsor%>_en<%=mobileFileIndicator%>.js?<%=N2NConstant.getRelease()%>"></script>
					<%	} else{
							existLanguageFile = false;
						}
					}else{
						existLanguageFile = false;
					}
				} %>
        	               
        	<script>
    			window.parent.postMessage("<%=sLanguage%>", document.location.origin);   
   			</script>
        	                 
        	<script type="text/javascript">
        		var existLanguageFile = '<%= existLanguageFile %>';
        		global_Language = '<%= sLanguage.toLowerCase() %>';
        	</script>
            <link rel="stylesheet" href="login/css/bootstrap-5.3.6.min.css" />
            <link rel="stylesheet" href="login/css/login.css" />
            <link rel="stylesheet" href="login/css/popup-modal-bootstrap5.css" />
            
        <% if (confSenchaCmd) {%>
            <% if(isBasicVer) {%>
            <script type="text/javascript" src="js/cmd-basic.js?<%=N2NConstant.getRelease()%>"></script>
            <% } else {%>
            <script type="text/javascript" src="js/cmd-full.js?<%=N2NConstant.getRelease()%>"></script>
            <% }%>
        <% } else if (confMinify) {%>
            <script type="text/javascript" src="js/lib/extjs/ext-all.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/script1.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/script2.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/script3.js?<%=N2NConstant.getRelease()%>"></script>
        <% } else {
            String debugStr = confFrontDebug ? "-debug" : "";
            %>
            <script type="text/javascript" src="js/lib/extjs/ext-all<%=debugStr%>.js"></script>
            <script type="text/javascript" src="js/lib/extjs/ext-charts<%=debugStr%>.js"></script>
            <script type="text/javascript" src="js/lib/sockjs/sockjs-0.3.4.min.js"></script>
            <script type="text/javascript" src="js/lib/sockjs/vertxbus.min.js"></script>
            <script type="text/javascript" src="js/lib/fix.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/lib/fontdetect.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/N2NCSS.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/N2NUtil.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/n2nutil.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/app/utils/stockutil.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/N2NLoginStatus.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/N2NBrowserInfo.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/timer.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/cookies.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/logger/logger.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/logger/log4javascript.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/ExportFile.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/colutils.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/formatutils.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/StockColor.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/Blinking.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Storage/N2NFilter.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Storage/Storage.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/tcliteSub/N2N_Function/N2NSubWindow.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/n2nconstant.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/columnmapping.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/BigInt.js"></script>
            <script type="text/javascript" src="js/Barrett.js"></script>
            <script type="text/javascript" src="js/RSA.js"></script>
            <!-- E2EE & RSA start-->
            <script type="text/javascript" src="js/N2N_E2EE/e2ee/jsbn_jso.js"></script>
            <script type="text/javascript" src="js/N2N_E2EE/e2ee/prng4_jso.js"></script>
            <script type="text/javascript" src="js/N2N_E2EE/e2ee/rng_jso.js"></script>
            <script type="text/javascript" src="js/N2N_E2EE/e2ee/hashprc_jso.js"></script>
            <script type="text/javascript" src="js/N2N_E2EE/e2ee/rsa_jso.js"></script>
            <script type="text/javascript" src="js/N2N_E2EE/e2ee/base64_jso.js"></script> 
            <script type="text/javascript" src="js/N2N_E2EE/rsa/jsbn.js"></script>
            <script type="text/javascript" src="js/N2N_E2EE/rsa/prng4.js"></script>
            <script type="text/javascript" src="js/N2N_E2EE/rsa/rng.js"></script>
            <script type="text/javascript" src="js/N2N_E2EE/rsa/rsa.js"></script>		
            <!-- E2EE & RSA end-->
            <!-- AES start -->
            <script type="text/javascript" src="js/N2N_AES/aes.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_AES/AesUtil.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_AES/pbkdf2.js?<%=N2NConstant.getRelease()%>"></script>
            <!-- AES end -->
            
            <script type="text/javascript" src="js/N2N_Function/N2N1FA.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/N2N2FA.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/N2NDisclaimer.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/N2NDisclaimerRDS.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/N2N_Function/TrxFees_Calculator.js?<%=N2NConstant.getRelease()%>"></script>
            
            <script type="text/javascript" src="js/lib/QcFeed.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/app/conn.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/app/msg/msg.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/app/utils/msgutil.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/app/utils/configutil.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/app/utils/debugutil.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/app/utils/jsutil.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/app/controller/common.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/app/controller/components.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/app/controller/n2ncomponents.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/app/controller/menu.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/app/updater.js?<%=N2NConstant.getRelease()%>"></script>
            <script type="text/javascript" src="js/app/helper.js?<%=N2NConstant.getRelease()%>"></script>
            <% if(!isBasicVer) {%>
            <script type="text/javascript" src="js/full.js?<%=N2NConstant.getRelease()%>"></script>
            <% }%>
            <script type="text/javascript" src="js/app.js?<%=N2NConstant.getRelease()%>"></script>
        <% }%>
        
        
         <% } else { %>
         
         <script type="text/javascript">
         	//alert("Unable to login to tclite.");
         	<%
            
       
         		if ( sErrMsg != null && sErrMsg.length() > 0 ) 
         			out.write( "alert('" + sErrMsg + "')" );
         	
         		String logoutURL = sLogoutURLLite;
         		
         		/* Not needed anymore
				if ( sLogoutDeviceDetection.equalsIgnoreCase("TRUE") ) {
					if ( sUserAgent.indexOf("android") > 0 || sUserAgent.indexOf("ipad") > 0 || sUserAgent.indexOf("blackberry") > 0 ) {
						logoutURL = sLogoutURLLite;
						
					} else {
						logoutURL = sLogoutURLOthers;
					}
					
				} else {
					logoutURL = sLogoutURLLite;
				}*/
         	%>

         	var loginUrl = '<%= logoutURL %>';
         	//loginUrl = "invalidate.jsp";
         	//loginUrl = "main.jsp?relogin=true";
        	if ( parent ) 
        		parent.document.location = loginUrl;
            else 
            	document.location = loginUrl;
         </script>
         
         <% } %>
        <title><%=sAppName%></title>
    </head>
    <body class='n2n<% if(sView.equals("mobile")) out.write(" " + "mobileview");%>'>
        <div id="page-loader">  
            <div style="font-size:18px;font-weight:bold;font-family:tahoma,arial,helvetica,sans-serif;position:absolute;height:37px;line-height:37px;left:50%;top:50%;margin-left:-75px;margin-top:-25px;padding-left: 43px;padding-top: 2px;background: no-repeat left top url('images/starting.gif');">
                Starting...
            </div>
        </div>
        <div id="appmsg">
            
        </div>
        <div class="x-grid-row" style="display:none;">
            <div class="N2N_stringStyle x-grid-cell">
                <div class="x-grid-cell-inner"  id="gridcell_tmx">
                </div>
            </div>
        </div>
        <div class="x-grid-row" style="display:none;">
            <div class="N2N_stringStyle x-grid-cell gridcell_tmx0">
                <div class="x-grid-cell-inner"  id="gridcell_tmx0">
                </div>
            </div>
        </div>
        <img src="images/icons/Quote.png" style="display:none;" onload="setCSSRule(this);"/>
        <%
            if (confFrontDebug) {
        %>
            <div id="apprevision" style="font-size:12px;font-family:tahoma,arial,helvetica,sans-serif;position:absolute;text-align:right;bottom:0;right:0;padding:5px;">
                Revision: <%=sVersion%>
            </div>
        <%            
            }
        %>
        <!-- needed for login modal -->
        <script src="login/js/bootstrap-5.3.6.bundle.min.js"></script>
        <!-- needed for login modal -->
        <script src="login/passport-login-bc.jsp"></script>
        <script src="login/js/login-popup-bootstrap5.js"></script>
    </body>
</html>
