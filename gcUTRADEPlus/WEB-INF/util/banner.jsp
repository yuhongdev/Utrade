<%@ page import = "java.io.IOException,java.text.SimpleDateFormat, java.util.Date,com.n2n.taglib.*"%>
<%
char acId[] = session.getId().toCharArray();
	int ncID=0;
	for (int i = 0; i < acId.length; ++i) {
		ncID += Character.getNumericValue(acId[i]);
	}
%>
<%!
	String sLoginId = "", sTblWidth = "", sTickerWidth = "", sBgColor = "";
	String g_sXmlUrl = "";
	String g_sTickerType = "IndicesSummary";
	String g_sPath = "";
	String g_sImgPath = "";
	String g_sJSPath = "";
	String g_sStylePath = "";
	String g_sWebPath = "";
	String g_sHTMLRoot = "";
	String g_sTitle = "";
	String sActionBan = "";
	String g_sWebBHName = "";	
	//int ncIDBan = 0;
	final String m_sPRODSERV_MENU = "ProServ_eTradingwithAm.png|PRO-SERVICE-ShareTrading.png|ProServ_MrgFinancing.png|PROSERVICE-CustodialNominee.png|PROSERVICE-CentralDepository.png|PRO-SERVICE-InternationalInvestor.png|PROSERVICE-ForeignInvesting.png|ProServ_SBL.png|PROSERVICE-Research.png|PROSERVICE-CorporateFinance.png";
	final String m_sPRODSERV_LINK = "web/ProdSev.jsp#0|web/ProdSev.jsp#1|web/ProdSev.jsp#2|web/ProdSev.jsp#3|web/ProdSev.jsp#4|web/ProdSev.jsp#5|web/ProdSev.jsp#6|web/ProdSev.jsp#7|web/ProdSev.jsp#8|web/ProdSev.jsp#9";
	//final String m_sABOUTUS_MENU = "ABOUTUS-CorporateInfo.png|ABOUTUS-Directors&SeniorsMng.png|ABOUTUS-ListOfMng.png|ABOUTUS-Disclaimer.png|TermOfAccess.png|ABOUTUS-Jobs.png";
	//final String m_sABOUTUS_LINK = "web/CorpInfo.jsp|web/DirectorSeniorMgt.jsp|web/ListMgt.jsp|web/Disclaimer.jsp|web/TermAccess.jsp|web/Jobs.jsp";
	//final String m_sABOUTUS_MENU = "ABOUTUS-CorporateInfo.png|ABOUTUS-Directors&SeniorsMng.png|ABOUTUS-ListOfMng.png|ABOUTUS-Jobs.png";
	//final String m_sABOUTUS_LINK = "|||web/Jobs.jsp";
	final String m_sABOUTUS_MENU = "ABOUTUS-Jobs.png";
	final String m_sABOUTUS_LINK = "web/Jobs.jsp";
	//final String m_sFAQ_MENU = "FAQ-PCTrobleshooting.png|FAQ-AccountOpening.png|FAQ-Security.png|FAQ-Settlement.png|FAQ-Trading.png";
	//final String m_sFAQ_LINK = "web/FaqPCTrouble.jsp|web/FaqAccOpening.jsp|web/FaqSecurity.jsp|web/FaqSettlement.jsp|web/FaqTrading.jsp";
	final String m_sFAQ_MENU = "FAQ_Registration.png|FAQ_eTrading.png|FAQ_TroubleShoot.png|FAQ_Mobile.png|FAQ_PDA.png|FAQ_Security.png|FAQ_eServices.png";
	final String m_sFAQ_LINK = "web/FaqRegistration.jsp|web/FaqeTrading.jsp|web/FaqPCTrouble.jsp|web/FaqMobile.jsp|web/FaqPDA.jsp|web/FaqSecurity.jsp|web/FaqeServices.jsp";	
	final String m_sEFORM_MENU = "eFroms_Regist_side.png|eFroms_Serv_side.png";
	final String m_sEFORM_LINK = "web/EFormReg.jsp|web/EFormSrv.jsp";	
	
	SimpleDateFormat dfDate = new SimpleDateFormat("EEE, dd MMM yy");
	JspWriter out = null;	
	
/*	public void initialize(HttpSession session, com.n2n.DB.N2NSession oN2NSession) {
		sLoginId = (String) session.getAttribute("loginid");
		g_sPath = (String) session.getAttribute("ContextPath");
		//sHtmlRoot = oN2NSession.getSetting("HTMLRoot");
		
		sLoginId = sLoginId != null ? sLoginId : "";
		g_sPath = g_sPath != null ? g_sPath : "/gc";
		
		if (sLoginId.length() == 0) {
			sLoginId = "Guest";
		}
	}
*/	
	public String bannerTop() {
		String m_sContent = "";
		
		m_sContent = bannerTop(0,"#FFFFFF");//#D9D9D9
		
		return m_sContent;
	}
	
	public String bannerTop(int iTblWidth) {
		String m_sContent = "";
		
		m_sContent = bannerTop(iTblWidth,"#FFFFFF");
		
		return m_sContent;
	}
	
	public String bannerTop(int iTblWidth, String sBackColor) {
		String m_sContent = "";
		
		if (iTblWidth == 0) {
			sTblWidth = "100%";
			sTickerWidth = "screen.width - 31";
		}
		else {
			sTblWidth = "" + iTblWidth + "";
			sTickerWidth = "" + (iTblWidth-8) + "";
		}
		
		sBgColor = sBackColor;
		
		m_sContent = "<table cellspacing='0' cellpadding='0' width='100%' border='0' bgcolor='" + sBgColor + "'>\n";
	//	m_sContent += "<tr height='75'>\n";
	//	m_sContent += "<td align='center'>\n";
	//	m_sContent += "<table cellspacing='0' cellpadding='0' width='" + sTblWidth + "' border='0' bgcolor='#FFFFFF'>\n";
		m_sContent += "<tr>\n";
		m_sContent += "<td align='center' height='15px'>\n";
		m_sContent += "<script language=\"javascript\">\n";
		m_sContent += "var sWidth = new String(\"\");\n";
		m_sContent += "var sSpeed = new String(\"\");\n";
		m_sContent += "var sImgUrl = new String(\"\");\n";
		m_sContent += "var sFontSize = new String(\"\");\n";
		m_sContent += "sWidth = " + sTickerWidth + ";\n";
		m_sContent += "sSpeed = \"1\";\n";
		m_sContent += "sFontSize = \"10px\";\n";
		if (g_sXmlUrl != null && g_sXmlUrl.length() > 0) {
			m_sContent += "var indices = new tickerConnectNew(\"indices\",\"" + g_sXmlUrl + "\",\"" + g_sTickerType + "\",sFontSize,sWidth,sSpeed,sImgUrl);";	
		} else {
//			m_sContent += "var indices = new tickerConnectNew(\"indices\",\"" + g_sHTMLRoot + "/ebcServlet/ebcForwarder?Site=TickerXml\",\"" + g_sTickerType + "\",sFontSize,sWidth,sSpeed,sImgUrl);\n";
//			m_sContent += "var indices = new tickerConnectNew(\"indices\",\"" + g_sHTMLRoot + g_sPath + "/ref/IndicesTicker.xml\",\"" + g_sTickerType + "\",sFontSize,sWidth,sSpeed,sImgUrl);";
			m_sContent += "var indices = new tickerConnectNew(\"indices\",\"" + g_sHTMLRoot + "/ref/gc/IndicesTicker.xml\",\"" + g_sTickerType + "\",sFontSize,sWidth,sSpeed,sImgUrl);";
		}
		m_sContent += "indices.createUI(\"idContent3\", \"idScroller3\");\n";
		m_sContent += "indices.setTickerUrl(\"" + g_sPath + "/applet/pdt_StkIndicesTracker.jsp\");\n";
		m_sContent += "indices.start();\n";
		m_sContent += "</script>\n";
		m_sContent += "</td>\n";
		m_sContent += "</tr>\n";
		
		m_sContent += "<tr height='63'>\n";
		m_sContent += "<td align='center'>\n";
		m_sContent += "<table cellspacing='0' cellpadding='0' width='" + sTblWidth + "' border='0' bgcolor='#FFFFFF'>\n";
		m_sContent += "<tr valign='bottom'>\n";
		m_sContent += "<td width='175'>\n";
		m_sContent += "<img src='" + g_sImgPath + "/trad_amesec.gif' border='0' width='166' height='63'>";
	/*	m_sContent += "<object classid=clsid:D27CDB6E-AE6D-11cf-96B8-444553540000 codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=4,0,2,0' height='75'>\n";
		m_sContent += "<param name='movie' value='" + g_sImgPath + "/LeftLogoH75.swf'>\n";
		m_sContent += "<param name='quality' value='high'>\n";
		m_sContent += "<param name='wmode' value='opaque'>\n";
		m_sContent += "<embed src='" + g_sImgPath + "/LeftLogoH75.swf' quality='high' pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash' height='75'>\n";
		m_sContent += "</embed>\n";
		m_sContent += "</object>\n";*/
		m_sContent += "</td>\n";
		m_sContent += "<td>\n";
		m_sContent += "<table border=0>\n";
		m_sContent += "<tr>\n";
		m_sContent += "<td align='left' class='clsGrayFont'>Welcome " + sLoginId + "</td></tr>\n";
		m_sContent += "<tr><td align='left'><a href='" + g_sPath + "/logout.jsp'><img src='" + g_sImgPath + "/Home/Logout_But.gif' border='0'></a></td></tr>\n";
		m_sContent += "<tr><td align='left'>" + dfDate.format(new Date()) + "</td></tr>\n";
		m_sContent += "</table>\n";
	//	m_sContent += "<td align='left' class='welcome'>Welcome " + sLoginId + "<br>" + dfDate.format(dtToday) + "</td>\n";
	//	m_sContent += "<td align='right' width='332' background='" + g_sImgPath + "/RT_TopBanner1.jpg' style='background-repeat:no-repeat'>\n";
	//	if(sLoginId.compareToIgnoreCase("Guest") != 0) {
	//		m_sContent += "<font color='#FF0000'>&#8226;</font>&nbsp;&nbsp;<a class='menu' href=m_sContent += >Logout</a>&nbsp;&nbsp;&nbsp;";
	//	}
	//	m_sContent += "<font color='#FF0000'>&#8226;</font>&nbsp;&nbsp;<a class='menu' href='" + g_sPath + "/main.jsp'>Home</a>&nbsp;&nbsp;&nbsp;";
		m_sContent += "</td>\n";
		m_sContent += "<td align='right' valign='center' width='170'><img src='" + g_sImgPath + "/Trad_amBank.gif' width='158' height='58'></td>\n";
		m_sContent += "</tr>\n";
		m_sContent += "</table>\n";
		
		m_sContent += "</td>\n";
		m_sContent += "</tr>\n";
		
		m_sContent += "</table>";
		
		return m_sContent;
	}
		
	public void setAction(String vsAction)	{
		sActionBan = vsAction;
		System.out.println("sActionBan @ banner.jsp: " + sActionBan);
	}
	
	public String getAction()	{
		return sActionBan;
	}
	
	public void setCommonPath(String vsPath, String vsImgPath, String vsJSPath, String vsStylePath, String vsWebPath, String vsHTMLRoot, JspWriter voOut) {
		g_sPath = vsPath;
		g_sImgPath = vsImgPath;
		g_sJSPath = vsJSPath;
		g_sStylePath = vsStylePath;
		g_sWebPath = vsWebPath;
		g_sHTMLRoot = vsHTMLRoot;
		out = voOut;
	}
	
	public void setCommonPath(String vsPath, String vsImgPath, String vsJSPath, String vsStylePath, String vsWebPath, String vsHTMLRoot, JspWriter voOut, String vsWebBHName) {
		g_sPath = vsPath;
		g_sImgPath = vsImgPath;
		g_sJSPath = vsJSPath;
		g_sStylePath = vsStylePath;
		g_sWebPath = vsWebPath;
		g_sHTMLRoot = vsHTMLRoot;
		g_sWebBHName = vsWebBHName;
		out = voOut;
	}	
	
	public void setXmlUrl(String vsXmlUrl) {
		g_sXmlUrl = vsXmlUrl;
	}
	
	public void setTickerType(String vsType) {
		g_sTickerType = vsType;
	}
	
	public void genBannerTitle(String vsTitle) {
		try {
			g_sTitle = vsTitle;
			out.println("<html>");
			out.println("<head>");
			out.println("<title>" + vsTitle + "</title>");
			out.println("<script language='JavaScript' type='text/javascript' src='" + g_sJSPath + "/tickerConnectEngineNew.js'></script>");
			out.println("<script language='JavaScript' type='text/javascript' src='" + g_sJSPath + "/tickerConnectNew.js'></script>");
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}
	}
	
	public void genBannerBody(String vsBodyOnLoad, int vnWidth, String vsAppBackup, String vsLoginId) {
		try {
			int iTableWidth = 0;
			out.println("</head>"); 
			if (vsBodyOnLoad.length() > 0) {
				out.println("<body onload='javascript:" + vsBodyOnLoad + "'>");
			} else {
				out.println("<body>");
			}
			//out.println("<html:N2N_HtmlObject objectName=\"login\" type=\"popinwindow\" maximum=\"false\" windowName=\"Global Connect\"/>");
			populatePopinLoginWindow();
			out.println("<table cellspacing=0 cellpadding=0 border=0 align='center' width='" + vnWidth + "' class='clsTable'>");
			out.println("	<tr>");
		//	out.println("	<tr bgcolor='#FFFFFF'>");
		//	out.print("	<td width='30' class='tdNoteWeb' align='center' valign='center'>");
		//	if (vsAppBackup.equalsIgnoreCase("Y")) {
		//		out.println("<img src='" + g_sImgPath + "/ame_backup.gif'>");
		//	}
		//	out.println("	</td>");
		//	out.println("	<td width='170' class='clsGrayFont'>&nbsp;&nbsp;</td>");
			iTableWidth = vnWidth - 200;
			out.println("	<td width='" + iTableWidth + "'</td>");
			out.println("	</tr>");
			out.println("	<tr bgcolor='#FFFFFF'>");
			out.println("		<td colspan='3' bgcolor='#000000'>");
			out.println("			<script language=\"javascript\">");		
			out.println("				var sWidth = new String(\"\");");
			out.println("				var sSpeed = new String(\"\");");
			out.println("				var sImgUrl = new String(\"\");");
			out.println("				var sFontSize = new String(\"\");");	
			iTableWidth = vnWidth - 10;		
			out.println("				sWidth = " + iTableWidth + ";");
			out.println("				sSpeed = \"1\";");
			out.println("				sFontSize = \"10px\";");	
						
			if (g_sXmlUrl != null && g_sXmlUrl.length() > 0) {
				out.println("				var indices = new tickerConnectNew(\"indices\",\"" + g_sXmlUrl + "\",\"" + g_sTickerType + "\",sFontSize,sWidth,sSpeed,sImgUrl);");				
			} else {				
//				out.println("				var indices = new tickerConnectNew(\"indices\",\"" + g_sHTMLRoot + g_sPath + "/ref/IndicesTicker.xml\",\"" + g_sTickerType + "\",sFontSize,sWidth,sSpeed,sImgUrl);");
				out.println("				var indices = new tickerConnectNew(\"indices\",\"" + g_sHTMLRoot + "/ref/gc/IndicesTicker.xml\",\"" + g_sTickerType + "\",sFontSize,sWidth,sSpeed,sImgUrl);");
			}
			
			out.println("				indices.createUI(\"idContent3\", \"idScroller3\");");
			out.println("				indices.setTickerUrl(\"" + g_sPath + "/applet/pdt_StkIndicesTracker.jsp\");");
			out.println("				indices.start();");
			out.println("				</script>");
			out.println("			</td>");
			out.println("		</tr>");
			out.println("		<tr>");
			out.println("			<td colspan='2' valign='top'>");
			out.println("				<object width='200' height='58' classid=clsid:D27CDB6E-AE6D-11cf-96B8-444553540000 codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=4,0,2,0'>");
			out.println("				<param name='movie' value='" + g_sImgPath + "/Home/LeftLogoH.swf'>");
			out.println("				<param name='quality' value='high'>");
			out.println("				<param name='wmode' value='transparent'>");		
			out.println("				<embed src='" + g_sImgPath + "/Home/LeftLogoH.swf' quality='high' type='application/x-shockwave-flash' width='200' height='58' pluginspage='http://www.macromedia.com/go/getflashplayer'></embed>");
			out.println("				</object>");
			out.println("			<table width=100% border=0 width=180 align=center cellspacing=0 cellpadding=0 class='clsGray_TOP'>");
			sActionBan = genLoginBody(vsLoginId);
		//	out.println("				");
		//	out.println("				");
			out.println("			</td>");
			out.println("			</tr>");
			out.println("			</table>");
			out.println("			</td>");
			out.println("			<td>");
			out.println("				<object width='570' height='143' classid=clsid:D27CDB6E-AE6D-11cf-96B8-444553540000 codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=4,0,2,0'>");
			out.println("				<param name='movie' value='" + g_sImgPath + "/Home/TopBanner.swf'>");
			out.println("				<param name='quality' value='high'>");
			out.println("				<param name='wmode' value='transparent'>");
			out.println("				<embed src='" + g_sImgPath + "/Home/TopBanner.swf' quality='high' type='application/x-shockwave-flash' width='570' height='143' pluginspage='http://www.macromedia.com/go/getflashplayer'></embed>");
			out.println("				</object>");
			out.println("			</td>");
			out.println("		</tr>");
			out.println("		<tr>");
			out.println("			<td colspan='3' valign=top height='20'>");
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}		
	}

	public void genBannerBody_ISB(String vsBodyOnLoad, int vnWidth, String vsAppBackup, String vsLoginId) {
		try {
			int iTableWidth = 0;
			out.println("</head>"); 
			if (vsBodyOnLoad.length() > 0) {
				out.println("<body onload='javascript:" + vsBodyOnLoad + "'>");
			} else {
				out.println("<body>");
			}
			//out.println("<html:N2N_HtmlObject objectName=\"login\" type=\"popinwindow\" maximum=\"false\" windowName=\"Global Connect\"/>");
			populatePopinLoginWindow();
			out.println("<table cellspacing=0 cellpadding=0 border=0 align='center' width='" + vnWidth + "' class='clsTable'>");
			out.println("	<tr>");
		//	out.println("	<tr bgcolor='#FFFFFF'>");
		//	out.print("	<td width='30' class='tdNoteWeb' align='center' valign='center'>");
		//	if (vsAppBackup.equalsIgnoreCase("Y")) {
		//		out.println("<img src='" + g_sImgPath + "/ame_backup.gif'>");
		//	}
		//	out.println("	</td>");
		//	out.println("	<td width='170' class='clsGrayFont'>&nbsp;&nbsp;</td>");
			iTableWidth = vnWidth - 200;
			out.println("	<td width='" + iTableWidth + "'</td>");
			out.println("	</tr>");
			out.println("	<tr bgcolor='#FFFFFF'>");
			out.println("		<td colspan='3' bgcolor='#000000'>");
			out.println("			<script language=\"javascript\">");		
			out.println("				var sWidth = new String(\"\");");
			out.println("				var sSpeed = new String(\"\");");
			out.println("				var sImgUrl = new String(\"\");");
			out.println("				var sFontSize = new String(\"\");");	
			iTableWidth = vnWidth - 10;		
			out.println("				sWidth = " + iTableWidth + ";");
			out.println("				sSpeed = \"1\";");
			out.println("				sFontSize = \"10px\";");	
						
			if (g_sXmlUrl != null && g_sXmlUrl.length() > 0) {
				out.println("				var indices = new tickerConnectNew(\"indices\",\"" + g_sXmlUrl + "\",\"" + g_sTickerType + "\",sFontSize,sWidth,sSpeed,sImgUrl);");				
			} else {				
//				out.println("				var indices = new tickerConnectNew(\"indices\",\"" + g_sHTMLRoot + g_sPath + "/ref/IndicesTicker.xml\",\"" + g_sTickerType + "\",sFontSize,sWidth,sSpeed,sImgUrl);");
				out.println("				var indices = new tickerConnectNew(\"indices\",\"" + g_sHTMLRoot + "/ref/gc/IndicesTicker.xml\",\"" + g_sTickerType + "\",sFontSize,sWidth,sSpeed,sImgUrl);");
			}
			
			out.println("				indices.createUI(\"idContent3\", \"idScroller3\");");
			out.println("				indices.setTickerUrl(\"" + g_sPath + "/applet/pdt_StkIndicesTracker.jsp\");");
			out.println("				indices.start();");
			out.println("				</script>");
			out.println("			</td>");
			out.println("		</tr>");
			out.println("		<tr>");
			out.println("			<td colspan='2' valign='top'>");
			out.println("				<object width='200' height='58' classid=clsid:D27CDB6E-AE6D-11cf-96B8-444553540000 codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=4,0,2,0'>");
			out.println("				<param name='movie' value='" + g_sImgPath + "/Home/LeftLogoH.swf'>");
			out.println("				<param name='quality' value='high'>");
			out.println("				<param name='wmode' value='transparent'>");		
			out.println("				<embed src='" + g_sImgPath + "/Home/LeftLogoH.swf' quality='high' type='application/x-shockwave-flash' width='200' height='58' pluginspage='http://www.macromedia.com/go/getflashplayer'></embed>");
			out.println("				</object>");
			out.println("			<table width=100% border=0 width=180 align=center cellspacing=0 cellpadding=0 class='clsGray_TOP'>");
			sActionBan = genLoginBody(vsLoginId);
		//	out.println("				");
		//	out.println("				");
			out.println("			</td>");
			out.println("			</tr>");
			out.println("			</table>");
			out.println("			</td>");
			out.println("			<td>");
			out.println("			<img src='" + g_sImgPath + "/WebBanner_2_1.jpg' width='570' height='143'>");
			//out.println("				<object width='570' height='143' classid=clsid:D27CDB6E-AE6D-11cf-96B8-444553540000 codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=4,0,2,0'>");
			//out.println("				<param name='movie' value='" + g_sImgPath + "/Home/TopBanner.swf'>");
			//out.println("				<param name='quality' value='high'>");
			//out.println("				<param name='wmode' value='transparent'>");
			//out.println("				<embed src='" + g_sImgPath + "/Home/TopBanner.swf' quality='high' type='application/x-shockwave-flash' width='570' height='143' pluginspage='http://www.macromedia.com/go/getflashplayer'></embed>");
			//out.println("				</object>");
			out.println("			</td>");
			out.println("		</tr>");
			out.println("		<tr>");
			out.println("			<td colspan='3' valign=top height='20'>");
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}		
	}

	
	public void genAfterMenu(int vnWidth) {
		try {
			out.println("			</td>");
			out.println("		</tr>");
			out.println("	</table>");					
			out.println("	<table border=0 cellspacing=0 cellpadding=0 height='65%' width='" + vnWidth + "' align=center bgcolor='#FFFFFF'>");
			//out.println("	<table border=0 cellspacing=0 cellpadding=0 width='" + vnWidth + "' align=center bgcolor='#FFFFFF'>");
			out.println("		<tr>");
			out.println("			<td width='5' class='tdCol'>&nbsp;</td>");
			out.println("			<td width='760' VALIGN='TOP'>");			
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}			
	}	

	// added by chuili - 20090401 (for News.jsp)
	public void genAfterMenuNews(int vnWidth) {
		try {
			out.println("			</td>");
			out.println("		</tr>");
			out.println("	</table>");					
			out.println("	<table border=0 cellspacing=0 cellpadding=0 height='65%' width='" + vnWidth + "' align=center bgcolor='#FFFFFF'>");
			//out.println("	<table border=0 cellspacing=0 cellpadding=0 width='" + vnWidth + "' align=center bgcolor='#FFFFFF'>");
			out.println("<tr><td width='5' class='tdCol'>&nbsp;</td><td width='5' class='tdCol'>&nbsp;</td><td width='5' class='tdCol'>&nbsp;</td></tr>");
			out.println("		<tr>");
			out.println("			<td width='5' class='tdCol'>&nbsp;</td>");
			out.println("			<td width='760' VALIGN='TOP'>");			
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}			
	}	
	
	public void genAfterMenuRT(int vnWidth) {
		try {
			out.println("			</td>");
			out.println("		</tr>");
			out.println("	</table>");	
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}			
	}	
		
	public void genFootnoteRT(int vnWidth) {
		try {
			out.println("	<table align='center' cellspacing=0 cellpadding=0 border=0 width='" + vnWidth + "'>");
			//footnote
			genFootnoteContents();
			out.println("	</table>");
			out.println("	</body>");
			out.println("</html>");
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}
	}
			
	public void genFootnote() {
		try {
			out.println("			</td>");
			out.println("			<td width='5' class='tdCol'></td>");
			out.println("		</tr>");
			//footnote
			genFootnoteContents();
			out.println("	</table>");
			out.println("	</body>");
			out.println("</html>");
			out.flush();
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}
	}
	
	private void genFootnoteContents() {
		try {
			out.println("		<tr height='30'>");
			out.println("			<td class='tdFooterGreyBG' colspan='3' valign='center'>");
			out.println("				Copyright &copy; " + (new Date().getYear() + 1900) + " AmInvestment Bank Berhad. All rights reserved. | ");
			out.println("				<a href='" + g_sPath + "/web/TermAccess.jsp' class='FootNote'>Terms</a> | ");
			out.println("				<a href='" + g_sPath + "/web/Disclaimer.jsp' class='FootNote'>Disclaimer</a> | ");
			out.println("				<a href='" + g_sPath + "/web/SiteMap.jsp' class='FootNote'>Sitemap</a> | ");
			out.println("				Best viewed with Internet Explorer 6.0. Using 1024 * 768 resolution");
			out.println("			</td>");
			out.println("		</tr>");	
		} catch (Exception ex) {
			ex.printStackTrace();			
		}			
	}
	
	public void populatePopinLoginWindow() {
		int loginWidth=300;
		int loginHeight=165;
		int loginPaddLeft=300;
		int loginPaddTop=180;
		try {
			String sOutput = "";
	
			sOutput += "<div id='dwindow' style='position:absolute;background-color:#EBEBEB;cursor:pointer;left:250px;top:180px;display:none;' onMousedown='initializedrag(event)' onMouseup='stopdrag()' onSelectStart='return false'>\n";
			sOutput += "<div align='right' style='background-color:#0055E6' onMousedown='initializedrag(event)' onMouseup='stopdrag()' onSelectStart='return false'>\n";
			sOutput += "<table cellspacing='0' cellpadding='0' border='0' width='100%'>\n";
			sOutput += "<tr><td width='5'></td>\n";
			sOutput += "<td class='ieDefaultColor'>" + g_sTitle + "</td>\n";
			sOutput += "<td align='right'>";
			sOutput += "<img src='" + g_sImgPath + "/ie_close.gif' onClick='closeit()' border='0'></td>\n";
			sOutput += "</tr></table></div>\n";
			sOutput += "<div id='dwindowcontent' style='height:100%'>\n";
			sOutput += "<iframe id='cframe' src='' width=100% height=100% border='0' frameBorder='1' style='border:4 solid #0000c6' scrolling='auto'></iframe>\n";
			sOutput += "</div></div>";
			
			out.println(sOutput);		
			out.println("			<script language='javascript'>");
			out.println("				function load(vsAction) {");
			out.println("					if (vsAction != null) {");
			out.println("						loadwindow('" + g_sPath + "/cliLogin.jsp?act=' + vsAction,"+loginWidth+","+loginHeight+","+loginPaddLeft+","+loginPaddTop+");");
			out.println("					} else {");
			out.println("						loadwindow('" + g_sPath + "/cliLogin.jsp',"+loginWidth+","+loginHeight+","+loginPaddLeft+","+loginPaddTop+");");
			out.println("					}");
			out.println("				}");
			out.println("				function resizeIFrame(vnWidth, vnHeight) {");
			//out.println("					document.getElementByID(\"dwindow\").height = vnHeight + \"px\";");
			//out.println("					document.getElementByID(\"cframe\").height = vnHeight;");			
			//out.println("					document.getElementByID('cframe').style.width = vnWidth;");
			out.println("					try {");
			//out.println("					alert(document.getElementById(\"dwindow\").style.left);");
			//out.println("					alert(document.getElementById(\"dwindow\").style.height);");
			out.println("					document.getElementById(\"dwindow\").style.height = vnHeight + \"px\";");
			out.println("					document.getElementById(\"dwindow\").style.width = vnWidth + \"px\";");
			out.println("					} catch(e) {alert(e);}");
			out.println("				}");
			out.println("			</script>");
		} catch (Exception ex) {
			System.err.println("populatePopinLoginWindow->" + ex.getMessage());
			ex.printStackTrace();			
		}
	}
	
	public String genLoginBody(String vsLoginId1)	{
		try {
		if(vsLoginId1.compareToIgnoreCase("Guest") == 0) {
			out.println("			<tr>");
			out.println("			<td>");			
			out.println("			<table border=0 width='100%'>");
			out.println("			<tr>");
			out.println("			<td width='2%'>&nbsp;</td>");
			out.println("			<td width='40%'class='fntLogin'><font style='font-size:8pt'>User ID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</font></td>");
			out.println("			<td width='58%'>");	
			out.println("			<form id=frmLogin name=frmLogin method='post'>");		
			out.println("			<input id=txtLoginID name=txtLoginID class=inputField maxlength=15 size=15 autocomplete=off/></td>");
			out.println("			<td width='1%'></td>");
			out.println("			</tr>");
			out.println("			<tr><td width='2%'>&nbsp;</td>");
			out.println("			<td width='40%' class='fntLogin'><font style='font-size:8pt'>Password&nbsp;&nbsp;&nbsp;</font></td>");
			out.println("			<td colspan=2>");
			out.println("			<input type=password id=txtLoginPwd name=txtLoginPwd class=inputField maxlength=20 size=15 autocomplete=off onkeypress=\"return EntSub();\" />");
			out.println("			<input type=hidden id=loginID name=loginID />");
			out.println("			<input type=hidden id=pwd name=pwd />");
			out.println("			<input type=hidden id=pwdreset name=pwdreset />");
			out.println("			<input type=hidden id=category name=category value=''/>");
			out.println("			<input type=hidden id=lang name=lang />");
			out.println("			<input type=hidden id=isJVM name=isJVM />");
			out.println("			<input type=hidden id=act name=act value='"+ sActionBan +"' />");
			out.println("			</td>");
			out.println("			</tr>");
			out.println("			<tr><td></td>");
			out.println("			<td width='40%' style='FONT-SIZE:7pt'>"+ dfDate.format(new Date()) +"</td>");
			out.println("			<td align=right><img src='" + g_sImgPath + "/Home/Login_But.gif' width=73 height=18 style='cursor:pointer' onclick=\"return frmSubmit(document.frmLogin,'EN');\" /></td>");
			out.println("			<td>&nbsp;</td>");
			out.println("			</tr>");
			out.println("			</form>");
			out.println("			</table>");
			out.println("			</td>");
			out.println("			</tr>");
			return sActionBan;
			} else {
			
			out.println("			<tr>");
			//out.println("			<td width='20%'>&nbsp;</td><td>");	
			out.println("			<td>");		
			out.println("			<table border=0 width='100%'>");
			out.println("			<tr><td></td></tr>");
			out.println("			<tr>");
			out.println("			<td class='clsGrayFont' align='center'>Welcome " + vsLoginId1 + "&nbsp;</td></tr>");
			out.println("			<tr><td></td></tr>");
			out.println("			<tr><td align='center'>");
			out.println("			<a href='" + g_sPath + "/logout.jsp'><img src='" + g_sImgPath + "/Home/Logout_But.gif' width=73 height=18 border=0></a>");
			out.println("			</td>");
			out.println("			</tr>");
			out.println("			<tr><td></td></tr>");
			out.println("			<tr>");
			out.println("			<td align='center'>"+ dfDate.format(new Date()) +"</td>");
			out.println("			</tr>");
			out.println("			</table>");
			out.println("			</td></tr>");
			return sActionBan;
			}
		} catch (Exception ex) {
			System.err.println("genLoginBody->" + ex.getMessage());
			ex.printStackTrace();	
			return null;		
		}
	}
	
	public void genSideNav(String vsId) {
		try {
			String[] MySplit_ContentList = null;
			String[] MySplit_ContentLink = null;
				
			out.println("<table valign='top' cellspacing='0' cellpadding='0' width='100%' border=0 bgcolor='#FFFFFF'>");
			out.println("<tr height='10'><td colspan='2'></td></tr>");
			out.println("<tr><td width='200' valign='top'>");
			
			if (vsId.equalsIgnoreCase("ProdServ")) {
				MySplit_ContentList = m_sPRODSERV_MENU.split("\\|");
				MySplit_ContentLink = m_sPRODSERV_LINK.split("\\|");
			}
			else if (vsId.equalsIgnoreCase("AboutUs")) {
				MySplit_ContentList = m_sABOUTUS_MENU.split("\\|");
				MySplit_ContentLink = m_sABOUTUS_LINK.split("\\|");
			}
			else if (vsId.equalsIgnoreCase("FAQ")) {
				MySplit_ContentList = m_sFAQ_MENU.split("\\|");
				MySplit_ContentLink = m_sFAQ_LINK.split("\\|");
			}
			else if (vsId.equalsIgnoreCase("EFORM")) {
				MySplit_ContentList = m_sEFORM_MENU.split("\\|");
				MySplit_ContentLink = m_sEFORM_LINK.split("\\|");
			}
						
			out.println("	<table border=0 cellpadding=0 cellspacing=0 valign=top width='100%'>");
			out.println("	<tr valign='top'><td><img src='" + g_sImgPath + "/nav-columne/top.png' border=0></td></tr>");
			if (MySplit_ContentList != null && MySplit_ContentLink != null){
				for (int i=0; i < MySplit_ContentList.length; i++) {
					if (MySplit_ContentList[i].length() > 0) {
						out.print("	<tr><td valign='top'>");
						if (MySplit_ContentLink[i].length() > 0) {
							out.print("<a href='" + g_sPath + "/" + MySplit_ContentLink[i] + "'>");
						}
						out.print("<img src='" + g_sImgPath + "/Left-Nav/" + MySplit_ContentList[i] + "' border='0'>");	
						if (MySplit_ContentLink[i].length() > 0) {
							out.print("</a>");
						}
						out.println("</td></tr>");
					}
				}
			}
			out.println("	<tr><td><img src='" + g_sImgPath + "/nav-columne/bottom.png' border=0></td></tr>");
			out.println("	</table>");
			out.println("</td><td width='10' class='aFooterLink'>&nbsp;&nbsp;</td><td valign='top'>");		
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}
	}
	
	public void genCloseSideNav() {
		try {
			out.println("</td</tr></table>");		
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}
	}

	public void genBasicFootnote(int vnWidth, String vsWebSiteName) {
		try {
			out.println("<table class=clsCopyrightBasic cellPadding=0 cellSpacing=0 width='" + vnWidth + "'><tr><td align=middle><br><font class=clsCopyrightBasic> " + vsWebSiteName + ". All rights reserved.</font></td></tr></table>");
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}
	}				
%>
<%
if(request.getRequestURI().equalsIgnoreCase("/gc/main.jsp")) {
	session.setAttribute("FromUrl","");
}
else if (request.getRequestURI().equalsIgnoreCase("/gc/isb.jsp")) {
	session.setAttribute("FromUrl","/gc/applet/pdt_RealTimeSwing_ISB.jsp?lang=EN");
} else {
	session.setAttribute("FromUrl",request.getRequestURI());
}
sActionBan = "";%>
<SCRIPT language=javascript src="<%=g_sJSPath%>/main.js"></SCRIPT>
<script language='javascript'>
var m_nSubmitCount = new Number(0);
function checkRequiredFields(oField) {
	var fieldNames = new Array("User ID", "Password");
	var fieldCheck   = true;
	var fieldsNeeded = "\nA value must be entered in the following field(s):\n\n\t";

	for(var nField=0; nField < fieldNames.length; ++nField) {
		if (JStrim(oField[nField]) == "") {
			fieldsNeeded += fieldNames[nField] + "\n\t";
			fieldCheck = false;
		}
	}

	if (!fieldCheck) {
		// SOME REQUIRED FIELDS ARE MISSING VALUES
		alert(fieldsNeeded);
	}
	return fieldCheck;
}

function encryptField() {	
	var nID = <%=String.valueOf(ncID) %>;
	var loginid = document.frmLogin.txtLoginID.value;
	var pwd = document.frmLogin.txtLoginPwd.value;
	
	document.frmLogin.loginID.value = escape(JSencrypt(loginid, nID));
	document.frmLogin.pwd.value = escape(JSencrypt(pwd, nID));	
	
	return true;
}

function entryVerify(voFrm, vsLang) {
	var oField = new Array("txtLoginID", "txtLoginPwd");
	if (voFrm != null) {
		for (var nField=0; nField < oField.length; ++nField) {
			oField[nField] = voFrm.elements[oField[nField]].value;
		}
		
		if (checkRequiredFields(oField)) {
			var isPwdReset="N", sPwd
			sPwd = oField[1]
			if (sPwd.length==6) {
				for (var i=0; i<sPwd.length; ++i) {
					if (sPwd.charCodeAt(i) < 48 || sPwd.charCodeAt(i) > 57)	// '0' - '9'
						break;
				}
				if (i == sPwd.length)
					isPwdReset = "Y"
			}
			
			//do not send login and pwd field (send the hidden field)
			voFrm.txtLoginID.disabled = true;
			voFrm.txtLoginPwd.disabled = true;
			//prepare to be sent over	
			var nID=<%=ncID%>;
			voFrm.loginID.value = escape(JSencrypt(oField[0], nID));
			voFrm.pwd.value = escape(JSencrypt(oField[1], nID));
			voFrm.pwdreset.value = isPwdReset;
			voFrm.lang.value = vsLang;
			//voFrm.isJVM.value = m_N2NDetectVM.IsJVM();			
			voFrm.isJVM.value = "";
<%
/*
alert ("Please be informed that access to AmeSecurities website will be unavailable from 8am - 1pm Sat 3 Nov 2007 due to preventive maintenance.\nAny inconvenience caused is much regretted.")
voFrm.txtLoginID.disabled = false;
voFrm.txtLoginPwd.disabled = false;
return false;
*/
%>
//alert("Bursa announcement:\nEquity Market Suspended for the day. All trades done for the day will be busted.");
			return true;
		}
	}
 	return false;
}
function frmSubmit(voFrm, vsLang) {
<%
/*
	// Jason - temporary Not give others go inside
	// Chin 30/09/07 - To block login to web pages
	var sText = "Please be informed that login access to eTrading services will be unavailable ";
	sText = sText + "from 10:00pm, 28 September 2007 to 12:00pm, 30 September 2007 ";
	sText = sText + "due to maintenance and upgrading works. Any inconvenience caused is much regretted."; 
	alert(sText);
	return false; 
*/
%>

	if (entryVerify(voFrm, vsLang)) {
		
		if (m_nSubmitCount ==0) {
			m_nSubmitCount++;
			<%if (sActionBan.length() == 0) {%>
				voFrm.action="<%=oN2NSession.getSetting("HTMLRootSecure") + g_sPath%>/login";
			<%} else {%>
				voFrm.action="<%=oN2NSession.getSetting("HTMLRootSecure") + g_sPath%>/login?act=<%=sActionBan%>";
			<%}%>
			voFrm.submit();
		} else {
			//alert("Attemp submit form twice");
			alert("Your request has been submitted. Please wait...");
			return false;
		}
		
	}else {
		return false;
	}
}
function EntSub() {

	if (window.event && window.event.keyCode == 13) {
    	frmSubmit(document.frmLogin,'EN');
  	} else {
    	return true;
    }
}
</script>
<%
	if (oN2NSession.getIsUserLogin()) {
//		setXmlUrl(oN2NSession.getSetting("HTMLRoot") +""+ g_sPath + "/ref/IndicesTicker_REAL.xml");
		setXmlUrl(oN2NSession.getSetting("HTMLRoot") +"/ref/gc/IndicesTicker_REAL.xml");
	} else {
//		setXmlUrl(oN2NSession.getSetting("HTMLRoot") +""+ g_sPath + "/ref/IndicesTicker_DELAY.xml");
		setXmlUrl(oN2NSession.getSetting("HTMLRoot") +"/ref/gc/IndicesTicker_DELAY.xml");
	}
%>