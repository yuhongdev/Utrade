<!-- 
	In swing version, jar file can locate at different server.          
	ExtURL = use to setup jar file location
	PfsURL = use to setup feed location
	          
	Real Time Mode : 
	0 = pull mode
	1 = push mode
	
	Feed option
	0 = See Wai's feed
	1 = Toh's feed     
 -->
<%
	//jar file constant
	final String sJAR_QS              		= "qs.jar;preload;1.0.0.1_01";
    final String sJAR_JCHART2D        		= "jchart2d-3.1.0.jar;preload;1.0.0.0_00";
	final String sJAR_IMG              		= "img.jar;preload;1.0.0.0_00";
    final String sJAR_REAL_TIME            	= "RealTime.jar;preload;1.0.0.1_01";
    final String sJAR_COM_EBC_SWING  		= "com.ebc.swing.jar;preload;1.0.0.1_01";
	final String sJAR_COM_MKT_DEPTH  		= "com.ebc.swing.MktDept.jar;1.0.0.0_03";
    final String sJAR_MKT_SUMM_CHART     	= "MktSummChart.jar;preload;1.0.0.0_01";
    final String sJAR_TRACKER              	= "tracker.jar;1.0.0.0_08";
    final String sJAR_BUY_SELL             	= "BuySellD.jar;preload;1.0.0.0_01";
    final String sJAR_BUY_SELL_ISO			= "BuySellIso.jar;preload;1.0.0.0_01";
    final String sJAR_COM_SOCKET        	=  "com.ebc.socket.jar;1.0.0.1_01";
    final String sJAR_COM_UTIL             	= "com.ebc.util.jar;preload;1.0.0.7_01";
    final String sJAR_COM_AWT             	= "com.ebc.awt.jar;1.0.0.0_01";
    final String sJAR_RESOURCE_BUNDLE		= ";preload;2.0.0.37_03";
    final String sJAR_INDICES              	= "indices.jar;preload;2.0.0.0_a";
    final String sJAR_INDICES_TRACKER		= "indicesTracker.jar;preload;2.0.0.2";
    final String sJAR_SCOREBOARD       		= "scoreboard.jar;preload;2.0.0.0";
    final String sJAR_STKGENERAL       		= "com.ebc.swing.StkGeneral.jar;preload;1.0.0.1_00";
    final String sJAR_CALCFUNC		       	= "CalcFunc.jar;preload;1.0.0.1";
    final String sCLASS_ID					= "clsid:CAFEEFAC-0016-0000-FFFF-ABCDEFFEDCBA";
    final String sJRE_DL					= "http://download.asiaebroker.com/download/N2N/jre-6u13-windows-i586-p.exe";
    final String sJRE_TYPE					= "application/x-java-applet;version=1.6";
    final String sJAR_CALENDAR				= "com.ebc.awt.JCalendar.jar;preload;1.0.0.0";
    final String sJAR_CALENDAR_SWING		= "com.ebc.swing.JCalendar.jar;preload;1.0.0.0";
    final String sJAR_ACCTSEARCH			= "AcctSearch.jar;1.0.0.0";
     
     //refresh rate constant
     int nREALTIME_REFRESH					= 1000;
     int nINDICES_REFRESH					= 1000;
     int nSCOREBOARD_REFRESH				= 1000;
	 
	//get parameter
	String sExchg				= request.getParameter("exchg");
	String sFeedNo				= request.getParameter("feedno");	
	String sLang				= request.getParameter("lang");	
	String sCompress			= request.getParameter("c");	
	String sFeedOption 			= request.getParameter("feedoption");
	String sRTMode				= request.getParameter("mode");
	String sCodeNo 				= request.getParameter("codeno");	
	String sPort				= request.getParameter("port");
	String sDebug				= request.getParameter("debug");
	String sExchange 			= request.getParameter("exchg");
	String sJavaPath			= "";
	String sISAPIDLL_URL		= "";
	String sPushServerURL		= "";
	String sLstFile				= "";
	String sCountry				= "";
	String sFont				= "";
	String sCodebase			= "";
	String sCodeServerURL		= "";
	String sFsFeed				= "";
	int iCompress				= 1;
	int iFeedServer				= -1;
	int iCodeServer				= -1;
	int iFeedNo					= -1;
	int iCodeNo					= -1;
	int nRTMode					= -1;
	
	if (sFeedNo == null)	sFeedNo = "";
	if (sRTMode == null)	sRTMode = "";
	if (sCodeNo == null)	sCodeNo = "";
	if (sPort == null)		sPort = "";
	if (sDebug == null)		sDebug = "0";
	
	if (sExchg == null)		
		sExchg = "KL";
	else
		sExchg = sExchg.toUpperCase();
	
	//setup language
	if (sLang == null) {
		if (session.getAttribute("language") == null) {
			sLang = (String)session.getAttribute("language");	
		} else {
			sLang = "en";
		}
	}
	sLang = sLang.toLowerCase();			
	if (sLang.equalsIgnoreCase("en")) {
		sLstFile = "rbRT_en_US.jar";
		sCountry = "US";
		sFont = "SansSerif";
	} else {
		sLstFile = "rbRT_zh_CN.jar";
		sCountry = "CN";
		out.println("<meta http-equiv='Content-Type' content='text/html; charset=gb2312'>");
		sFont = "PMingLiU,MingLiU,SimHei,SimSun,Arial Unicode MS,Ms Hei,Ms Song";
	}	
	
	//setup compression
	sCompress = sCompress != null ? sCompress : "1";
	try {
		iCompress = Integer.parseInt(sCompress);
	} catch (NumberFormatException nfe) {
		iCompress = 1;
	}	
	
	//exchange setup
	if (sExchange == null){
		sExchange = "KL";
	}
	
    //setup feed option - whether to use see wai's version or toh's version
 	if (sFeedOption == null) sFeedOption = "";     	
    if (sFeedOption.trim().length() == 0) {
         sFeedOption = "1";    //'0=cy feed; 1=toh's pull feed; 2=toh's push	       	
    }

	if (sFeedOption.compareTo("0") == 0) { 		
		//setup java path
     	sJavaPath = oN2NSession.getSetting("FSJavaURL");     
      	//setup feedno	
		if (sFeedNo.trim().length() == 0) {
			try { 	      
				iFeedServer = Integer.parseInt(oN2NSession.getSetting("FSCount"));
			} catch (NumberFormatException nfe) {
				iFeedServer = 1;  
			}
			iFeedNo = (oN2NSession.getSessionId(session) % iFeedServer) + 1;
		} else {
			try {
				iFeedNo = Integer.parseInt(sFeedNo);
			} catch (NumberFormatException nfe) {
				nfe.printStackTrace();
			}
		}
      	
     	sISAPIDLL_URL = oN2NSession.getSetting("Feed.URL" + iFeedNo);
     	sPushServerURL = sISAPIDLL_URL;
     	sCodeServerURL = sISAPIDLL_URL;
     	sCodebase = sISAPIDLL_URL+ sJavaPath;  
     	sFsFeed = oN2NSession.getSetting("FSFeed."+sExchg);
     } else {     
		//setup real time mode    
		if (sRTMode.trim().length() == 0) {
		   	 sRTMode = oN2NSession.getSetting("RTMode");
		}
		try {
     		nRTMode = Integer.parseInt(sRTMode);
		} catch (NumberFormatException nfe) {
			nRTMode = 1;
		}
		
		//setup java path
     	sJavaPath =  oN2NSession.getSetting("ExtJavaURL");
      
      	//setup codebase 	
		if (sCodeNo.trim().length() == 0) {
			try {			
				iCodeServer = Integer.parseInt(oN2NSession.getSetting("ExtCount"));
			} catch (NumberFormatException nfe) {
				iCodeServer = 1;
			}
			iCodeNo = (oN2NSession.getSessionId(session) % iCodeServer) + 1;				
		}	
		sCodeServerURL = oN2NSession.getSetting("ExtURL" + iCodeNo);
		sCodebase = sCodeServerURL + sJavaPath;	
		sCodebase = sCodebase.replaceFirst("https://", "http://");	
		
		//setup feedno			
		if (sFeedNo.trim().length() == 0) {
			try { 	      
				iFeedServer = Integer.parseInt(oN2NSession.getSetting("PFSCount"));
			} catch (NumberFormatException nfe) {
				iFeedServer = 1;  
			}
			iFeedNo = (oN2NSession.getSessionId(session) % iFeedServer) + 1;
		} else {
			try {
				iFeedNo = Integer.parseInt(sFeedNo);
			} catch (NumberFormatException nfe) {
				nfe.printStackTrace();
			}
		}

		if (nRTMode == 0) {
			sISAPIDLL_URL = oN2NSession.getSetting("PFSURLPull");
		} else {
			sISAPIDLL_URL = oN2NSession.getSetting("PFSURL" + iFeedNo);
		}

		System.out.println("PFSURL: " + iFeedNo + ":" + oN2NSession.getSetting("PFSURL" + iFeedNo));
		sPushServerURL 	= sISAPIDLL_URL;
		sPushServerURL 	= sPushServerURL.replace("/", "");
		sPushServerURL 	= sPushServerURL.replace("http:", "");
		sPushServerURL 	= sPushServerURL.replace("https:", "");
         
		//setup port		
		if (sPort.trim().length() == 0) {
			//sPort = oN2NSession.getSetting("PFSPort");
			if(nRTMode == 1){                            
                sPort = oN2NSession.getSetting("PFSPort");
            }else{
				sPort = "80";
			}
		}		
	}
		
%>