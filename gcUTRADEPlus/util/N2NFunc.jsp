<%@ page import = "com.n2n.util.N2NConst"%>
<jsp:useBean id="oN2NSessions" class="com.n2n.DB.N2NSession" scope="session">
	<%
		oN2NSessions.init(application);
		oN2NSessions.setIsSecure(request.isSecure());
	%>
</jsp:useBean>

<%!
	private HttpSession session  = null;
	private int m_nRetCode = -1;
		
	public void setSession(HttpSession voSession) {
		session = voSession;
	}
	
	public HttpSession getSession() {
		return session;
	}
	
	private boolean validateLoginPwd(String vsUserID, String vsPwd, String vsCategory, String vsIPAddr) {
		System.out.println("validateLoginPwd");
		return callValLoginPwd(N2NConst.LOGIN_TYPE_LOGINID, vsUserID, vsPwd, vsCategory,vsIPAddr);
	}
	
	private boolean callValLoginPwd(String vsLoginType, String vsUserID, String vsPwd, String vsCategory, String vsIPAddr) {
		String[] saLoginResult = null;
		boolean bRetCode = false;
		int nRetCode = -1,nAccessLogID=-1;
		String sCliCode = "";
		
		
//		if (oN2NSessions != null) {
			oN2NSessions.cliinfo.init(oN2NSessions);
			System.out.println("before login");
			saLoginResult = oN2NSessions.cliinfo.cliLogInOut (vsLoginType, vsUserID, vsPwd, vsIPAddr, vsCategory, false);
			System.out.println("after login");
			
			if (saLoginResult == null) {
				bRetCode = false;
			} else {
				nRetCode = Integer.parseInt(saLoginResult[0]);
				nAccessLogID = Integer.parseInt(saLoginResult[1]);
				sCliCode = saLoginResult[2];
				
				if (nRetCode == 0 || nRetCode == 6) {
					bRetCode = true;
				} else {
					bRetCode = false;
				}
				
				//System.out.println("sCliCode at N2NFunc: " + sCliCode + "  bRetCode: " + bRetCode);
				if (bRetCode) {
					if (session != null) {
						oN2NSessions.cliinfo.setSession(session);
						oN2NSessions.cliinfo.n2nSetSessionGlobal(sCliCode);
						session = oN2NSessions.cliinfo.getSession();
						session.setAttribute("ci_AccessLogID",nAccessLogID+"");
						//oN2NSession.cliinfo.dbDisconnect();
					} else {
						System.out.println("pdaCliLogin.jsp->callValLoginPwd: session is null");
					}
				}
				
				m_nRetCode = nRetCode;
			}
//		} else {
//			System.out.println("pdaCliLogin.jsp->callValLoginPwd: oN2NSession is null");
//		}
		
		return bRetCode;
	}//end callValLoginPwd
	
	public int getRetCode() {
		return m_nRetCode;
	}
	
	public String mapCitizenShip(int vnCitizen) {
		String sCitizen = "";
		switch (vnCitizen) {
			case N2NConst.CITIZEN_SI:
				sCitizen = "Singaporean";
				break;
			case N2NConst.CITIZEN_KL:
				sCitizen = "Malaysia";
				break;				
			case N2NConst.CITIZEN_OTH:
				sCitizen = "Others";
				break;	
			case N2NConst.CITIZEN_NA:
				sCitizen = "Not Applicable";
				break;												
			default:
				break;
		}
		return sCitizen;
	}
	
	public String mapRace(String vsRace) {
		String sRace = "";
		
		if (vsRace.compareToIgnoreCase("M") == 0) {
			sRace = "Malay";
		} else if (vsRace.compareToIgnoreCase("C") == 0)  {
			sRace = "Chinese";
		} else if (vsRace.compareToIgnoreCase("I") == 0) {
			sRace = "Indian";
		} else {
			sRace = "Others";
		}
		
		return sRace;
	}	
	
	public String[] setupExchangeUI(String vsExchange, String vsImgPath, String[] vsaExchangeList, javax.servlet.jsp.JspWriter voOut) {
		try {				
			String [] saOrdStatusExchgDesc = new String[vsaExchangeList.length];
			for (int i=0; i < vsaExchangeList.length; i++) {
				if (vsaExchangeList[i].equals(N2NConst.EXCHG_SGX)) {
					saOrdStatusExchgDesc[i] = "SGX";
					voOut.print("<img id='SGX' src='" + vsImgPath + "/SGX");
				} else if (vsaExchangeList[i].equals(N2NConst.EXCHG_KLSE)) {
					saOrdStatusExchgDesc[i] = "Bursa";
					voOut.print("<img id='Bursa' src='" + vsImgPath + "/Bursa");
				} else if (vsaExchangeList[i].equals(N2NConst.EXCHG_HKSE)) {
					saOrdStatusExchgDesc[i] = "HKSE";
					voOut.print("<img id='HKSE' src='" + vsImgPath + "/HKSE");
				} else if (vsaExchangeList[i].equals(N2NConst.EXCHG_SASE)) {
					saOrdStatusExchgDesc[i] = "SASE";
					voOut.print("<img id='SASE' src='" + vsImgPath + "/SASE");
				}
		
				if (vsaExchangeList[i].equals(vsExchange)) {
					voOut.print("On");
				} else {
					voOut.print("Off");
				}
				voOut.print(".gif' onClick='javascript:exchange_onclick(this);' style='cursor:pointer' border='0'>");
			}
			return saOrdStatusExchgDesc;
		} catch (Exception ex) {
			ex.printStackTrace();		
			return null;	
		}
	}
	
	public boolean isGameMode() {
		System.out.println("test:"+oN2NSessions);
		System.out.println("test:"+oN2NSessions.getSetting("AppMode"));
		String appMode = oN2NSessions.getSetting("AppMode")!=null?oN2NSessions.getSetting("AppMode").toString():"";
		System.out.println("appmode:"+appMode);
		if (appMode.equalsIgnoreCase("game")) {
			return true;
		}
		return false;
	}
	
	public String decryption(String sData) {
		com.spp.util.security.Decrypt en = new com.spp.util.security.Decrypt();
		return en.fetchDecode(sData);		
	}

%>
