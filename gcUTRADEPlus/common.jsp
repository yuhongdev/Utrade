<%@ taglib uri="/tld/N2N_HtmlObject.tld" prefix="html"%>

<jsp:useBean id="oN2NSession" class="com.n2n.DB.N2NSession" scope="session">
	<%
		oN2NSession.init(application);
		oN2NSession.setIsSecure(request.isSecure());
	%>
</jsp:useBean>

<%
	final String g_sPath = request.getContextPath();
	String g_sImgPath = "/gcUTRADEPlus/img";
	String g_sUtilsPath = "/gcUTRADEPlus/util";
	String g_sJSPath = "/gcUTRADEPlus/js";
	String g_sStylePath = "/gcUTRADEPlus/style";
	String g_sWebPath = "/gcUTRADEPlus/web";
	String g_sJavaPath = "/gcUTRADEPlus/java";
	String g_sRefPath = "/gcUTRADEPlus/ref";
	String g_sDocPath = "/gcUTRADEPlus/doc";
	String g_sDocPaths = "/gcUTRADEPlus/doc";
	
	String root_url = oN2NSession.getSetting("HTMLRootSecure")+"/" + "gcUTRADEPlus";

	String g_sLoginId = (String) session.getAttribute("loginid");
	String g_sCliCode = (String) session.getAttribute("clicode");
	String g_sLanguage = (String) session.getAttribute("language");
	String g_sCliName = (String) session.getAttribute("cliname");
	String g_sCategory = (String) session.getAttribute("senderCategoryATP");
	String g_sDefBHCode = (String) session.getAttribute("defbhcode");
	String g_sDefBHBranch = (String) session.getAttribute("defbhbranch");
	String g_sBHName = (String) session.getAttribute("bhname");
	String g_sDefRmsCode = (String) session.getAttribute("defrmscode");
	String g_sRmsName = (String) session.getAttribute("rmsname");
	String g_sAccess = (String) session.getAttribute("senderAccessTP");
	String g_sReason = (String) session.getAttribute("reason");
	String g_sMobile = (String) session.getAttribute("mobile");
	String g_sEmail = (String) session.getAttribute("email");
	String g_sExchange = oN2NSession.getSetting("DefaultExchg");
	String g_sCurrCode = oN2NSession.getSetting("DefaultCurrCode");
	String g_sCorpName = oN2NSession.getSetting("WebBHName");
	String g_IsEmployee = (String) session.getAttribute("isEmployee");
	String g_sAccType = (String) session.getAttribute("accTypeList");

	
	g_sLoginId = g_sLoginId != null ? g_sLoginId : "";
	g_sCliCode = g_sCliCode != null ? g_sCliCode : "";
	//g_sLanguage = g_sLanguage != null ? g_sLanguage : "";
	g_sCliName = g_sCliName != null ? g_sCliName : "";
	g_sCategory = g_sCategory != null ? g_sCategory : "";
	g_sDefBHCode = g_sDefBHCode != null ? g_sDefBHCode : "";
	g_sDefBHBranch = g_sDefBHBranch != null ? g_sDefBHBranch : "";
	g_sBHName = g_sBHName != null ? g_sBHName : "";
	g_sDefRmsCode = g_sDefRmsCode != null ? g_sDefRmsCode : "";
	g_sRmsName = g_sRmsName != null ? g_sRmsName : "";
	g_sAccess = g_sAccess != null ? g_sAccess : "";
	g_sReason = g_sReason != null ? g_sReason : "";
	g_sMobile = g_sMobile != null ? g_sMobile : "";
	g_sEmail = g_sEmail != null ? g_sEmail : "";
	g_sCorpName = g_sCorpName != null ? g_sCorpName : "";
	g_IsEmployee = g_IsEmployee != null ? g_IsEmployee : "N";
	
	boolean bShrtMenu = false;
	
	if (request.getParameter("exchg") != null && (request.getParameter("exchg")).length() > 0) {
		g_sExchange = request.getParameter("exchg");
	}

	if (request.getParameter("currcode") != null && (request.getParameter("currcode")).length() > 0) {
		g_sCurrCode = request.getParameter("currcode");
	}
	
	g_sExchange = g_sExchange != null ? g_sExchange : "";
	g_sCurrCode = g_sCurrCode != null ? g_sCurrCode : "";

	int iWidth = 1000;

	session.setAttribute("ContextPath",g_sPath);
	session.setAttribute("ImgPath",g_sImgPath);
	
	if(g_sLanguage == null){
		session.setAttribute("language", "EN");
		g_sLanguage = (String)session.getAttribute("language");
	}

	g_sLoginId = g_sLoginId == null? "" : g_sLoginId;
	if (g_sLoginId.length() == 0) {
		g_sLoginId = "Guest";
	}
	g_sLoginId = g_sLoginId != null ? g_sLoginId : "";
	
	String m_sLang 	= "";
	m_sLang	= (String)session.getAttribute("lang");
	if (m_sLang == null || m_sLang.equals("")) {
		m_sLang = request.getParameter("lang");
	}
	m_sLang	= m_sLang == null ? "en" : m_sLang;
	if (m_sLang.trim().compareToIgnoreCase("ZH") == 0){
		m_sLang = "zh";
	}
	else if (m_sLang.trim().compareToIgnoreCase("EN") == 0){
		m_sLang = "en";
	}
	else if (m_sLang.trim().compareToIgnoreCase("CN") == 0){
		m_sLang = "cn";
	}
	
	String g_URL_Wclose = oN2NSession.getSetting("HTMLRoot") + oN2NSession.getSetting("projectFolder") + oN2NSession.getSetting("loginPage");
	/****
	 * Flash settings
	 ****/
	String fPVer = "10.0.0"; //Flash Player version control
	String sActions = request.getParameter("act")!=null?request.getParameter("act").toString().trim():"";

%>
<%!
	String sGetWebUniCode(String vsMsg) {
		String sOut="";
		char[] chrMsg=null;
		chrMsg = vsMsg.toCharArray();
		for (int i=0; i < chrMsg.length; ++i) {
			if (((int) chrMsg[i]) <= 127) {
				sOut = sOut.concat(String.valueOf(chrMsg[i]));
			} else {
				sOut = sOut.concat("&#"+ Integer.toString((int) chrMsg[i]) +";");
			}
		}
		return sOut;
	}

	private boolean isLangCN(String vsLang) {
		if (vsLang.compareToIgnoreCase("CN") == 0 ||
			vsLang.compareToIgnoreCase("ZH") == 0) {
			return true;
		}
		return false;
	}
	
	public String getPageFooter(String sCorpName) {
		return ("<font class=clsCopyrightBasic>" + sCorpName + ". All rights reserved.");
	}

	String urlUnEscape(String vsInput)
		throws Exception
	{
		char acInput[] = vsInput.toCharArray();
		int nLen = acInput.length;
		StringBuffer sbOutput = new StringBuffer(nLen);
		char cCh, cCh2, cOut;

		for (int iCtr=0; iCtr < nLen; ++iCtr) {
			//get 1st char
			cCh = acInput[iCtr];
			if (cCh == '%') {
				//get 2nd char
				if (nLen - iCtr >= 3) {
					cCh2 = acInput[iCtr+1];
					//is unicode (%uXXXX)
					if (cCh2 == 'u' || cCh2 == 'U') {
						if (nLen - iCtr >= 6) {
							cOut = (char) Integer.parseInt(vsInput.substring(iCtr+2, iCtr+6), 16);
							sbOutput.append(cOut);
							iCtr += 5;
						} else {
							sbOutput.append(cCh);
						}

					//is hex (%XX)
					} else {
						cOut = (char) Integer.parseInt(vsInput.substring(iCtr+1, iCtr+3), 16);
						sbOutput.append(cOut);
						iCtr += 2;
					}
				} else {
					sbOutput.append(cCh);
				}
			} else {
				sbOutput.append(cCh);
			}
		}

		return sbOutput.toString();
	}
	
	private void checkATPSession(String sInvalidSession, com.n2n.DB.N2NSession oN2NSession, 
			HttpSession session, JspWriter out, String sFromUrl, 
			com.n2n.util.N2NATPPushConnect conn, String sUsername, String lang) {
		if (sInvalidSession != null && !("").equals(sInvalidSession)) {
			System.out.println("sInvalidSession:"+sInvalidSession);
			if (sInvalidSession.indexOf("1100 ATP")>0 || sInvalidSession.equalsIgnoreCase("1100ATP")) {
				System.out.println("invalidating session... from "+sFromUrl);				
				oN2NSession.setLogoutStatus(1);
				session.invalidate();
				try {
					out.println("<script language=JavaScript src=\"/gcUTRADEPlus/js/popupWindow.js\"></script>");
					out.println("<script language='javascript'>");
					out.println("	alert('" + oN2NSession.getSetting("InvalidSession.MultipleLogin.EN") + "');");
					out.println("   window.close(); ");
					out.println("parent.location.href='" + oN2NSession.getSetting("HTMLRootHome") + "';");
					out.println("</script>");
				} catch (Exception e) {
					e.printStackTrace();
				}
			} else if (sInvalidSession.indexOf("1201 ATP")>0 || sInvalidSession.equalsIgnoreCase("1201ATP")) {
				// TODO Error 1201 ATP - Session time out
				// Reconnect session
				try {
					connectATPAgain(session, conn, oN2NSession, sUsername, lang);	
				} catch (Exception exec) {
					exec.printStackTrace();
				}
			}
		} 
	}
	
	private com.n2n.connection.LoginContext connectATPAgain(HttpSession session, com.n2n.util.N2NATPPushConnect conn, com.n2n.DB.N2NSession oN2NSession, String sUsername, String lang) {
		com.spp.util.security.Decrypt dec = new com.spp.util.security.Decrypt();
		com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
		String encUsername = session.getAttribute("encID")!=null?dec.fetchDecode(session.getAttribute("encID").toString().trim()):"";
		String encPassword = session.getAttribute("encPwd")!=null?dec.fetchDecode(session.getAttribute("encPwd").toString().trim()):"";
		try {
			context = conn.login(encUsername, encPassword, "", session);
			if (context!=null) {
				session.setAttribute("errMsg","");
				session.setAttribute("loginid",sUsername);
				session.setAttribute("en_loginid",context.getLoginID()); 
				session.setAttribute("pwdreset","N");
				session.setAttribute("lang",lang);
				session.setAttribute("isJVM","");
				session.setAttribute("URL_loginMessage", oN2NSession.getSetting("HTMLRoot") + oN2NSession.getSetting("projectFolder") + oN2NSession.getSetting("MessageDisplay"));
			}
		    System.out.println("2session now for username:"+sUsername+" is:"+session.getAttribute("userPram"));
		} catch (com.n2n.connection.TCException e) {
			e.printStackTrace();
		}
		return context;
	}

	public String[] getAccountInformations(com.n2n.bean.N2NMFCliInfoBean clibean, com.n2n.DB.N2NSession oN2NSession, HttpSession session) {
		String results[] = null;
		try { 
	        String atpURL = session.getAttribute("ATPURLpublic")!=null?session.getAttribute("ATPURLpublic").toString().trim():oN2NSession.getSetting("atpURL");
	        com.n2n.util.N2NATPPushConnect atp = new com.n2n.util.N2NATPPushConnect(atpURL);
			com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
			context = atp.getCliInfo(clibean, session, oN2NSession);
			java.util.List resultList = new java.util.ArrayList();
			if (context.getErrorMsg().equals("")) {
				resultList = context.getResultsList();
				for (int i=0;i<resultList.size();i++) {
					results = (String[])resultList.get(i);
				}
			} else {
				System.out.println("error in getCliInfo during acctInfo:"+context.getErrorMsg());
				// session invalid
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return results;		
	}
%>
