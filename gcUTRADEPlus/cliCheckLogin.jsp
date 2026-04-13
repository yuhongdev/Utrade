<%@ include file='common.jsp'%>
<%@ include file='/util/banner.jsp'%>
<%@ page import = "java.util.Calendar, java.util.StringTokenizer, java.util.Hashtable" %>
<%
	//System.err.println("session id at cliCheckLogin.jsp: " + session.getId());	
	Hashtable ht = null;
	StringTokenizer st = null;

	int iCnt = 1;
	int iSecLevel = -1;

	String sAction = request.getParameter("act");
	sAction = sAction != null ? sAction : "";
	String sID = request.getParameter("LoginID");
	String sNoUI = request.getParameter("NoUI");
	sID = sID != null ? sID : "";
	sNoUI = sNoUI != null ? sNoUI : "N";

	String sAppOptNoDRLogin = oN2NSession.getSetting("AppOptNoDRLogin");
	String sCheck = oN2NSession.getSetting("SingleLogIn");
	//System.out.println("oN2NSession.getSetting('SingleLogIn') " + oN2NSession.getSetting("SingleLogIn"));
	String sFrom = request.getParameter("frPg");
	sFrom = sFrom != null ? sFrom : "";
	String sSessUserID 		= "";
	String sCurrDate		= "";
	String sSessCompDate	= "";
	String sSessionID 		= "";
	String sSessionValue 	= "";
	String sMsg 			= "";
	//String g_sPath = request.getContextPath();
	//String g_sImgPath = "/gc/img";

	Calendar cal = Calendar.getInstance();
	int iCurrDay 	= cal.get(Calendar.DAY_OF_MONTH);
	int iCurrYear 	= cal.get(Calendar.YEAR);
	cal.add(Calendar.MONTH,1);
	int iCurrMonth 	= cal.get(Calendar.MONTH);

	boolean m_bIsExpired = true;

	try {
		iSecLevel = Integer.parseInt(request.getParameter("SecLevel"));
	} catch (NumberFormatException nfe) {
		iSecLevel = 1;
	}

	System.out.println("iSecLevel: " +iSecLevel);
	boolean bIsUserLogin = oN2NSession.N2NCheckUserLogin(request,response,iSecLevel);
	//String sOutput = "";
	sCheck = sCheck != null ? sCheck : "";
	StringBuffer sOutput = new StringBuffer();
	int loginWidth=310; //310
	int loginHeight=165; //245
	int loginPaddLeft=350;
	int loginPaddRight=0;

try	{
	System.out.println("is user login:"+bIsUserLogin);
	if (bIsUserLogin) {
		if (sAppOptNoDRLogin.equals("Y") && (g_sCategory.equals("D") || g_sCategory.equals("R"))) {
			sMsg = "Sorry, TR may only login from "+oN2NSession.getSetting("WebBHName");
			System.out.println("sAppOptNoDRLogin: "+ sAppOptNoDRLogin +" / "+ g_sCategory +" / "+ sMsg);

			oN2NSession.setLogoutStatus(3);
			oN2NSession.setIsUserLogin(false);
//			session.invalidate();
			bIsUserLogin = false;

		} else if (sCheck.equals("true")) {//check session expired?
			sMsg = "Your session has expired. Please login again to access.";
			// retrieve Session ID and today's date
			sSessionID 	= (String) session.getId();
			sCurrDate	= Integer.toString(iCurrDay) + Integer.toString(iCurrMonth) + Integer.toString(iCurrYear);

			// get hashtable from servlet context
			if ( session.getServletContext().getAttribute("n2nAm_UserSession") != null) {
				ht = (java.util.Hashtable) session.getServletContext().getAttribute("n2nAm_UserSession");

				//check session id exists in hashtable. If exist, get its session value
				if ( ht.containsKey(sSessionID) ) {
					sSessionValue = (String) ht.get(sSessionID);
					sSessionValue = sSessionValue != null ? sSessionValue : "";

					// if session value not empty, Get User Info from Session Value
					if(sSessionValue.length() > 0) {
						st = new StringTokenizer(sSessionValue, "|");
						while (st.hasMoreTokens()) {
							if(iCnt==1)
								sSessUserID = st.nextToken();
							else if(iCnt==2)
								sSessCompDate = st.nextToken();
							iCnt++;
						}
						iCnt = 1;

						sSessUserID = sSessUserID != null ? sSessUserID : "";
						sSessCompDate = sSessCompDate != null ? sSessCompDate : "";

						if(sSessUserID.length() > 0) {
							if(sSessCompDate.length() > 0) {
								if(sSessCompDate.trim().compareTo(sCurrDate.trim())==0) {
									sMsg = "";
									m_bIsExpired = false;
								}
							}
						}
					}
				}
				else //if session id not found in hash table
					sMsg = "System detected you have login via other computer. Please login again to access.";
			}

			if (m_bIsExpired) {
				oN2NSession.setLogoutStatus(4);
				oN2NSession.setIsUserLogin(false);
				session.invalidate();
				bIsUserLogin = false;
			}
		}
	}
	//System.out.println("[GC AmSec] Session >> "+sSessUserID+"|"+sSessCompDate+"|"+sSessionID+"|"+sCurrDate+"|"+m_bIsExpired+"|"+bIsUserLogin);
	//System.out.println("[GC AmSec] Session >> " + sMsg);

	if (!bIsUserLogin) {
		//oN2NSession.setIsUserLogin(false);
		if(sFrom.compareToIgnoreCase("Reload") == 0) {
			sOutput.append("--_BeginData_\n" + sMsg + "\n--_EndData_");
			//System.out.println("--_BeginData_\n" + sMsg + "\n--_EndData_");
		} else {
			//System.out.println("ffff");
			if (sNoUI.equalsIgnoreCase("N")) {
				sOutput.append("<html>");
				sOutput.append("<head>");
				sOutput.append("<META content='-1' http-equiv='Expires'>");
				sOutput.append("<META content='no-cache' http-equiv='Pragma'>");
				sOutput.append("<META content='no-cache' http-equiv='Cache-Control'>");
				//sOutput += "<html><head>\n<title>Session Expired</title>\n</head><body><img src="+ g_sImgPath + "/Login/LogoSimpleBH.gif><hr align=left width=440><font face='Arial Bold' style='font-size:11pt'>The page you are looking for is currently unavailable due to one of the following: <ol style='margin-top:5;margin-bottom:5'><li><b>You have not logged on to the site yet.</b><li><b>Your session has expired. </b></ol>Either way, you will need to Log on to continue.<br/>In a few seconds, a Log on box will appear to enable you to enter your User ID and Password.<br/>If you don't see it, you may click <a href='javascript:loadwindow(\"cliLogin.jsp\",310,245);'>here</a> to Log on.<br/><br/>Thank you and have a pleasant day!</font>";
				sOutput.append("<title>Session Expired</title>");
				sOutput.append("<SCRIPT language=javascript src='" + g_sJSPath + "/popupWindow.js'></SCRIPT>");
				sOutput.append("<link rel=stylesheet type=text/css href='" + g_sStylePath + "/default.css'>");
				sOutput.append("</head>");
				//out.println("<body style='background:#ffffff'>");
				sOutput.append("<body class='clsBody'>");
				setCommonPath(g_sPath, g_sImgPath, g_sJSPath, g_sStylePath, g_sWebPath, oN2NSession.getSetting("HTMLRoot"),out);
				genBannerTitle(oN2NSession.getSetting("WebSiteName"));
				populatePopinLoginWindow();
				sOutput.append("<script language='javascript'>");
				if(!sMsg.equals(""))
					sOutput.append("	alert('" + sMsg + "');");
				if(sAction.compareTo("ActivateReg") == 0) {
					//System.out.println("loadwindow(\"" + g_sPath + "/cliLogin.jsp?act=" + sAction + "&LoginID=" + sID + "\",310,245,350);");
					sOutput.append("	loadwindow(\"" + g_sPath + "/cliLogin.jsp?act=" + sAction + "&LoginID=" + sID + "\","+loginWidth+","+loginHeight+","+loginPaddLeft+");");
				} else {
					// jason - 2007-06-05
					sOutput.append(" var nWidth  = new Number("+loginWidth+");");
					sOutput.append(" var nHeight = new Number("+loginHeight+");");
					sOutput.append(" var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop;");
					//out.println(" nLeft = (scrWidth  / 2) - (nWidth) - (nWidth/3);");
					//out.println(" nTop  = (scrHeight / 2) - (nHeight);");
					sOutput.append(" if (window.opener != null) {");
					sOutput.append("	loadwindow(\"" + g_sPath + "/cliLogin.jsp\",nWidth,nHeight,50,100);");
					sOutput.append(" } else { ");
					sOutput.append("	loadwindow(\"" + g_sPath + "/cliLogin.jsp\","+loginWidth+","+loginHeight+","+loginPaddLeft+");");
					sOutput.append(" } ");
				}
				sOutput.append("</script>");
				sOutput.append("<table cellspacing='0' cellpadding='0' border='0' width='61%' align='left'><tr><td>");
//				out.println("<img src='" + g_sImgPath + "/Home/LOGO_Fraser.png'>");
//				sOutput.append("<a href='" + g_sPath + "/main.jsp'><img src='" + g_sImgPath + "/Home/Logo_iTrade.gif' border='0'></a>");
				sOutput.append("<a href='http://localhost:8081/web/cimb/home'><img src='" + g_sImgPath + "/Home/Logo_iTrade.gif' border='0'></a>");				
//				out.println("<table cellspacing='0' cellpadding='0' border='0' width='61%' align='center'><tr><td><object classid=clsid:D27CDB6E-AE6D-11cf-96B8-444553540000 codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=4,0,2,0' width='202' height='112'>");
//				out.println("<param name='movie' value='" + g_sImgPath + "/Home/LeftLogo.swf'>");
//				out.println("<param name='quality' value='high'><param name='wmode' value='opaque'>");
//				out.println("<embed src='" + g_sImgPath + "/Home/LeftLogo.swf' quality='high' pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash' width='202' height='112'></embed>");
//				out.println("</object>");
				sOutput.append("<hr align=left width=440>");
				sOutput.append("<font face='Arial Bold' style='font-size:11pt'>");
				if(sAction.compareTo("ActivateReg") == 0) {
					sOutput.append("Thank you. You are now registered and logged into "+ oN2NSession.getSetting("WebSiteName")+".<p>");
					sOutput.append("In a few seconds, a Log on box will appear to enable you to enter your Password.<br/>");
				}
				else {
					sOutput.append("The page you are looking for is currently unavailable due to one of the following: ");
					sOutput.append("<ol style='margin-top:5;margin-bottom:5'>");
					sOutput.append("<li><b>You have not logged on to the site yet.</b>");
					sOutput.append("<li><b>Your session has expired. </b>");
					sOutput.append("</ol>");
					sOutput.append("Either way, you will need to Log on to continue.<br/>");
					sOutput.append("In a few seconds, a Log on box will appear to enable you to enter your User ID and Password.<br/>");
				}
				sOutput.append("If you don't see it, you may click ");

				if(sAction.compareTo("ActivateReg") == 0)
					sOutput.append("<a href='javascript:loadwindow(\"" + g_sPath + "/cliLogin.jsp?act=" + sAction + "&LoginID=" + sID + "\","+loginWidth+","+loginHeight+","+loginPaddLeft+");'>");
				else {
					// jason - 2007-06-05
					sOutput.append("<script language=JavaScript>");
					sOutput.append("function loadWindow_lnk() {");
					sOutput.append(" var nWidth  = new Number("+loginWidth+");");
					sOutput.append(" var nHeight = new Number("+loginHeight+");");
					sOutput.append(" var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop;");
					sOutput.append(" nLeft = (scrWidth  / 2) - (nWidth) - (nWidth/3);");
					sOutput.append(" nTop  = (scrHeight / 2) - (nHeight);");
					sOutput.append(" if (window.opener != null) {");
					sOutput.append("	loadwindow(\"" + g_sPath + "/cliLogin.jsp\",nWidth,nHeight,nLeft);");
					sOutput.append(" } else { ");
					sOutput.append("	loadwindow(\"" + g_sPath + "/cliLogin.jsp\","+loginWidth+","+loginHeight+","+loginPaddLeft+");");
					sOutput.append(" } ");
					sOutput.append("} ");
					sOutput.append("</script>");

					sOutput.append("<a href='javascript:loadWindow_lnk();'>");
					//out.println("<a href='javascript:loadwindow(\"" + g_sPath + "/cliLogin.jsp\",310,245,350);'>");
					
				}
				sOutput.append("here</a> to Log on.<br/><br/>");
				sOutput.append("Thank you and have a pleasant day!</font></td></tr></table>");
				sOutput.append("</body>");
				sOutput.append("</html>");
			}
		}		
	}
	else {
		if(sFrom.compareToIgnoreCase("Reload") == 0) {
			sOutput.append("--_BeginData_\nY\n--_EndData_");
		}
	}
	/*else {
		sOutput.append("<html><head></head>");
		sOutput.append("<body>");
		//out.println("<applet id='m_clsN2NIFrame' name='m_clsN2NIFrame' code='N2NIFrame.class' codebase='" + oN2NSession.getSetting("HTMLRoot") + request.getContextPath() +"/java/' archive='N2NIFrame.jar' width=0 height=0 style='display:none' VIEWASTEXT></applet>");
		sOutput.append("<applet id='m_clsN2NIFrame' name='m_clsN2NIFrame' code='N2NIFrame.class' codebase='" + "/java/jar/' archive='N2NIFrame.jar' width=0 height=0 style='display:none' VIEWASTEXT></applet>");
		sOutput.append("<script language='javascript'>");
		sOutput.append("	window.setTimeout(\"chkLogInKeepAlive()\", 300000);");
		sOutput.append("	function chkLogInKeepAlive() {");
		sOutput.append("		var sResult = m_clsN2NIFrame.HitURL(\"" + oN2NSession.getSetting("HTMLRoot") + request.getContextPath() + "/cliCheckLogin.jsp?frPg=Reload\", \"\");");
		//out.println("		alert(sResult)");
		sOutput.append("		if (sResult.length > 0) {alert(sResult); this.location.reload();}");
		sOutput.append("		window.setTimeout(\"chkLogInKeepAlive()\", 300000);");
		sOutput.append("	}");
		sOutput.append("</script>");
		sOutput.append("</body>");
		sOutput.append("</html>");
		//return;
	}*/
	out.println(sOutput.toString());
	return;
}
catch(Exception e) {
	e.printStackTrace();
	System.out.println("*GC* chkLogin.jsp (Exception) :"+e.getMessage());
}
%>
