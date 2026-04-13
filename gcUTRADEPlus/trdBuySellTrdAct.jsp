<%@ include file='/common.jsp'%>
<jsp:include page="cliCheckLogin.jsp" flush="true">
	<jsp:param name="SecLevel" value="2" />
	<jsp:param name="NoUI" value="Y" />
</jsp:include>
<%@ page import = "java.sql.ResultSet,com.n2n.util.N2NConst, com.n2n.DB.N2NTrdFunc, com.n2n.bean.N2NMFCliInfoBean" %>
<%
	if (oN2NSession.getIsUserLogin()) {
		String m_sTrdData = request.getParameter("TrdData");
		String m_sTrdCond = request.getParameter("TrdCond");
		String m_sTrdAct = request.getParameter("c");
		String m_sPin = request.getParameter("p");
		String m_sChkStkCode = request.getParameter("ChkStkCode");
		String m_sDupTrdInfo = request.getParameter("txtDupTrdInfo");
		String m_sInstInfo = request.getParameter("txtInstInfo");
		String m_sExchg = request.getParameter("exchg");
		String m_sSplitOrder = request.getParameter("SplitOrder");
		String m_sIndOrderQty = request.getParameter("IndQty");
		String m_sLastQty = request.getParameter("LastQty");
		String m_sRememberPin = request.getParameter("rp");
		String m_sValidate = request.getParameter("validate");
		String m_sDealerBS = request.getParameter("dealerbs");
		
		String m_sRet = "";
		String m_sRetMsg = "";
		String m_sCliCode = "";
		String m_sBhCliCode = "";
		String m_sBhBranch = "";
		String m_sRmsCode = "";
		String m_sOldPin = "";
		String sOrdType = "";
		String m_sExCliCode = "";
		String m_sParam = "";
		String m_sAPPriceStkLeft = "0";
		String m_asTrdData[] = null;
		String m_asProcTrade[] = null;
		String m_asValidTrade[] = null;
		
		boolean m_bCfmTrd = false;	//true:confirm trade; false: check trade
		boolean m_bRememberPin = false;
		boolean m_bUseNetLimit = false;
		int m_nResult = -1;
		int m_nTrdCond = 0;
		int m_nRetCode = 0;
		long m_lStkLeft = 0;
		
		m_sTrdCond = m_sTrdCond != null ? m_sTrdCond : "";
		m_sTrdData = m_sTrdData != null ? m_sTrdData : "";
		m_sTrdAct = m_sTrdAct != null ? m_sTrdAct : "";
		m_sPin = m_sPin != null ? m_sPin : "";
		m_sChkStkCode = m_sChkStkCode != null ? m_sChkStkCode : "";
		m_sDupTrdInfo = m_sDupTrdInfo != null ? m_sDupTrdInfo.trim() : "";
		m_sInstInfo = m_sInstInfo != null ? m_sInstInfo.trim() : "";
		m_sExchg = m_sExchg != null ? m_sExchg : "KL";
		m_sSplitOrder = m_sSplitOrder != null ? m_sSplitOrder : "1";
		m_sIndOrderQty = m_sIndOrderQty != null ? m_sIndOrderQty : "";
		m_sLastQty = m_sLastQty != null ? m_sLastQty : "";
		m_sRememberPin = m_sRememberPin != null ? m_sRememberPin : "N";
		m_sOldPin = session.getAttribute("EncryptTrdPin") != null ? session.getAttribute("EncryptTrdPin").toString() : "";
		m_sValidate = m_sValidate != null ? m_sValidate : "true";
		m_sDealerBS = m_sDealerBS != null ? m_sDealerBS : "";

		m_bRememberPin = m_sRememberPin.equalsIgnoreCase("Y");
		
		oN2NSession.cliinfo.init(oN2NSession);
		if (m_sTrdAct.compareToIgnoreCase("chkTrd") == 0) {
			m_bCfmTrd = false;		
		} else if (m_sTrdAct.compareToIgnoreCase("cfmTrd") == 0) {
			m_bCfmTrd = true;
			//check pin number
			//System.out.println("m_sPin: " + m_sPin);
			m_nResult = oN2NSession.cliinfo.checkPin(g_sCliCode	, oN2NSession.cliinfo.getPin(m_sPin, oN2NSession.getSessionId(session)));
			//m_nResult = oN2NSession.cliinfo.checkPin(g_sCliCode	, 123456);
			switch (m_nResult) {
				case -1:
					m_sRet = "1000241" + N2NConst.STD_SEP + "counter is suspended or otherwise, cannot be traded";
					session.setAttribute("EncryptTrdPin", "");
					break;
				case 0:
					if (m_sOldPin.length() > 0){
						m_sRet = "1000699" + N2NConst.STD_SEP + "Session is no longer active. Please log on again to retry.";
					}
					else{
						if (m_sExchg.equals(N2NConst.EXCHG_SGX)){
							m_sRet = "1001585" + N2NConst.STD_SEP + "You have entered the incorrect trading PIN. Please enter your trading PIN again.";
						}
						else{
							m_sRet = "1000242" + N2NConst.STD_SEP + "PIN entered is not correct! Please try again.";
						}
					}
					session.setAttribute("EncryptTrdPin", "");
					break;
				case 1: 
					if (m_bRememberPin)
						session.setAttribute("EncryptTrdPin", m_sPin);
					else
						session.setAttribute("EncryptTrdPin", "");
					break;
			}
		} else if (m_sTrdAct.compareToIgnoreCase("savePIN") == 0) {
			if (m_bRememberPin)
				session.setAttribute("EncryptTrdPin", m_sPin);
			else
				session.setAttribute("EncryptTrdPin", "");

			m_sRet = session.getValue("EncryptTrdPin") + N2NConst.STD_SEP + m_sRememberPin;
			
		} else {
			m_sRet = "1000243" + N2NConst.STD_SEP + "no trade data provided";
		}
		
		N2NTrdFunc trdfunc = new N2NTrdFunc();
		trdfunc.init(oN2NSession);
		trdfunc.setSession(session);
		trdfunc.dbConnect();
						
		//no error
		if (m_sRet.length() == 0) {
			if (m_sTrdData.length() == 0) {
				m_sRet = "1000243" + N2NConst.STD_SEP + "no trade data provided";
			} else {
				//System.out.println("m_sTrdData: " + m_sTrdData);
				System.out.println("m_sTrdData: " + m_sTrdData);
				m_asTrdData = m_sTrdData.split("\\"+N2NConst.STD_SEP);
				sOrdType = m_asTrdData[N2NConst.TRD_REFPOS_TORDTYPE];
				//
				// retrieve/parse the trade's attributes, this must always
				// be the first function to be called before any of the others are
				//
				m_asProcTrade = trdfunc.procTrade(m_asTrdData,m_sChkStkCode,m_sExchg);
				
				if (m_asProcTrade == null) {
					m_nResult = 4;
				} else {
					try {
						m_nResult = Integer.parseInt(m_asProcTrade[0]);
					} catch (NumberFormatException nfe) {
						System.out.println("Error format m_nResult");
						m_nResult = -2;
					}
				}				
				System.out.println("m_nResult: " + m_nResult + "m_sTrdData: " + m_sTrdData);
				switch (m_nResult) {
					case -2:
						m_sRet = "Number Format Exception.";
						break;
					case 0 :
						m_sRet = "";
						break;
					case 1 :
						m_sRet = "1000243" + N2NConst.FEED_REQFLD_SEP + "no trade data provided";
						break;
					case 2 :
						m_sRet = "1000241" + N2NConst.FEED_REQFLD_SEP + "counter is suspended or otherwise, cannot be traded";
						break;
					case 3:
						m_sRet = "1000298" + N2NConst.FEED_REQFLD_SEP + "Invalid trading account selected";
						break;
					case 4:
						m_sRet = "1000663" + N2NConst.FEED_REQFLD_SEP + "Invalid Stock";
						break;	
					case 5:
						m_sRet = "0" + N2NConst.FEED_REQFLD_SEP + "Invalid Branch";
						break;
					default :
						m_sRet = "1000244" + N2NConst.FEED_REQFLD_SEP + "unknown error";
						break;
				}
				
				if (m_sRet.trim().length() == 0) {
					//Get the BranchNo and RmsCode based on BH and BHCliCode
					//clicode, bhclicode and bhbranch
					m_sCliCode = m_asProcTrade[1];
					m_sBhCliCode = m_asProcTrade[2];
					m_sBhBranch = m_asProcTrade[3];
					
					N2NMFCliInfoBean clibean = new N2NMFCliInfoBean();
					clibean.setCliCode("");					
					clibean.setBhcode(g_sDefBHCode);
					clibean.setBhbranch(m_sBhBranch);
					clibean.setBhCliCode(m_sBhCliCode);	
					m_sRetMsg = trdfunc.getAccInfoByBHAccNo(clibean); 
					
					m_asTrdData = m_sRetMsg.split("\\" + N2NConst.FEED_REQFLD_SEP);
					try { 
						m_nResult = Integer.parseInt(m_asTrdData[0]);
					} catch (NumberFormatException nfe) {
						m_nResult = -1;
					}
					
					//System.out.println("===========================================");				
					//System.out.println("m_nResult: " + m_nResult);
					//System.out.println("N2NConst.SP_SUCCESS: " + N2NConst.SP_SUCCESS);
					if (m_nResult == N2NConst.SP_SUCCESS) {
						m_sParam = oN2NSession.getSetting("AppOptNetTrdLimit");
						m_bUseNetLimit = m_sParam != null ? (new Boolean(m_sParam)).booleanValue() : true;
						m_sRmsCode = m_asTrdData[3];
						//validate those attributes
						System.out.println("Tina  Act"+m_sParam+" " +m_bUseNetLimit);
						m_bUseNetLimit = true;
						m_asValidTrade = trdfunc.validateTrade(Long.parseLong(m_sTrdCond),m_sCliCode,m_sBhCliCode,m_sBhBranch,g_sDefBHCode, m_bUseNetLimit, m_sExchg);
						if (m_asValidTrade!= null && m_asValidTrade.length==3) {
							m_sRetMsg = m_asValidTrade[2];
							//System.out.println("m_sRetMsg: " + m_sRet);
							m_sTrdCond = m_asValidTrade[0];
							try {
								m_lStkLeft = Long.parseLong(m_asValidTrade[1]);
							} catch (NumberFormatException nfe) {
								System.out.println("trdBuySellTrdAct.jsp->Error format m_lStkLeft");
								m_lStkLeft = -1;
							}
							try {
								m_nTrdCond = Integer.parseInt(m_sTrdCond);
							} catch (NumberFormatException nfe) {
								m_nTrdCond = 0;
							}
						}
						if (m_sRetMsg.length() > 0) {
							//got error
							m_sRet = m_sRetMsg;
						}else {
							//no error, proceed...
							if (m_bCfmTrd) {	
								//System.out.println("m_sExchg: " + m_sExchg + "m_sInstInfo: " + m_sInstInfo);
								// 09 Aug 2006 - move tradingRuleValidation to chktrd part
								//before insert order, call usp_mftradingrulevalidation								
								//m_sRet = trdfunc.tradingRuleValidation(m_sExchg,N2NConst.TRD_SRC_INTERNET);
								//if (m_sRet.length() > 0) {
								//	m_sRet = N2NConst.FEED_REQFLD_SEP + m_sRet;
								//} else {	
								//System.out.println("DDDDD: " + 	oN2NSession.cliinfo.isBankDealer());
								if (oN2NSession.cliinfo.isBankDealer()) {
									m_sExCliCode = g_sCliCode;
								} else {
									m_sExCliCode = "";
								}							
								m_sRet = trdfunc.sendTrade(m_sCliCode, m_sBhBranch, m_sRmsCode, m_sBhCliCode, m_nTrdCond, N2NConst.TRD_SRC_INTERNET,m_sDupTrdInfo,m_sInstInfo,m_sExchg,m_sSplitOrder,m_sIndOrderQty,m_sLastQty,m_sExCliCode);
								//}
							} else {
								//before insert order, call usp_mftradingrulevalidation											
								m_sRet = trdfunc.tradingRuleValidation(m_sExchg,N2NConst.TRD_SRC_INTERNET,m_sCliCode,g_sDefBHCode);								
								m_nRetCode = trdfunc.getRetCode();

								//only continue if validation success
								//if (m_sRet.length() <= 0) {
								if (m_sRet.length() <= 0 || m_nRetCode > 0) {
									if (m_sValidate.compareToIgnoreCase("true") == 0) {
										m_sRet = "";
										m_sDupTrdInfo = trdfunc.getDupTrdInfo(m_sCliCode, m_sRmsCode, m_sBhCliCode , m_sBhBranch);
									} else {
										m_sDupTrdInfo = "0" + N2NConst.FEED_REQFLD_SEP+ "0" +N2NConst.FEED_REQFLD_SEP+ "0" +N2NConst.FEED_REQFLD_SEP+ "0";
									}								
									
									String sInstSessionData = trdfunc.procInst();
									long lWarningInterval = trdfunc.getTrdWarningInterval(m_sCliCode,g_sDefBHCode,m_sBhCliCode,m_sBhBranch,m_sExchg);
									
									if (m_sDealerBS.compareToIgnoreCase("yes") == 0) {
										String sAccountStatus = trdfunc.getAccountStatus();
										int iSuspFlg = trdfunc.getSuspFlag();
										int m_nTrdAccTypeChk = 0;										
										
										if (sOrdType.equalsIgnoreCase("B")) {
											sOrdType = N2NConst.TRD_TYPE_BUY;
										} else if (sOrdType.equalsIgnoreCase("S")) {
											sOrdType = N2NConst.TRD_TYPE_SELL;
										}									
										
										System.out.println("m_sDealerBS: " + m_sDealerBS + "  sAccountStatus: " + sAccountStatus + "  iSuspFlg: " + iSuspFlg + "  sOrdType: " + sOrdType);
										if (sAccountStatus.equalsIgnoreCase(N2NConst.TRD_ACCSTATUS_SUSPEND)) {
											if (m_sExchg.equals(N2NConst.EXCHG_SGX)){
												m_sRet = "1001595" + N2NConst.FEED_REQFLD_SEP + "Your trading status has been suspended" + N2NConst.FEED_REQFLD_SEP + "0"  + N2NConst.FEED_REQFLD_SEP + ".~" + N2NConst.FEED_REQFLD_SEP + "1001592" + N2NConst.FEED_REQFLD_SEP + "Please contact your Trading Representative to enquire about your suspension" + N2NConst.FEED_REQFLD_SEP + "0" + N2NConst.FEED_REQFLD_SEP + ".";
											}
											else{
												//m_sRet = "0" + N2NConst.FEED_REQFLD_SEP + "Your selected trading account has been temporarily suspended!\nPlease call your DealerRep for more information.";
												m_sRet = "1000203" + N2NConst.FEED_REQFLD_SEP + "Your selected trading account has been temporarily suspended" + N2NConst.FEED_REQFLD_SEP + "0"  + N2NConst.FEED_REQFLD_SEP + "!~" + N2NConst.FEED_REQFLD_SEP + "1000204" + N2NConst.FEED_REQFLD_SEP + "Please call your DealerRep for more information" + N2NConst.FEED_REQFLD_SEP + "0" + N2NConst.FEED_REQFLD_SEP + ".";
											}
										} else if (sAccountStatus.equalsIgnoreCase(N2NConst.TRD_ACCSTATUS_CLOSE)) {
											if (m_sExchg.equals(N2NConst.EXCHG_SGX)){
												m_sRet = "1001593" + N2NConst.FEED_REQFLD_SEP + "Your trading account have been closed" + N2NConst.FEED_REQFLD_SEP + "0"  + N2NConst.FEED_REQFLD_SEP + ".~" + N2NConst.FEED_REQFLD_SEP + "1001596" + N2NConst.FEED_REQFLD_SEP + "Please contact your TR to enquire about your account status" + N2NConst.FEED_REQFLD_SEP + "0" + N2NConst.FEED_REQFLD_SEP + ".";
											}
											else{
												//m_sRet = "0" + N2NConst.FEED_REQFLD_SEP + "Your selected trading account has been closed!\nPlease call your DealerRep for more information.";
												m_sRet = "1000255" + N2NConst.FEED_REQFLD_SEP + "Your selected trading account has been closed" + N2NConst.FEED_REQFLD_SEP + "0"  + N2NConst.FEED_REQFLD_SEP + "!~" + N2NConst.FEED_REQFLD_SEP + "1000204" + N2NConst.FEED_REQFLD_SEP + "Please call your DealerRep for more information" + N2NConst.FEED_REQFLD_SEP + "0" + N2NConst.FEED_REQFLD_SEP + ".";
											}
										} else if (sAccountStatus.equalsIgnoreCase(N2NConst.TRD_ACCSTATUS_DORMANT)) {
											//m_sRet = "0" + N2NConst.FEED_REQFLD_SEP + "Your selected trading account is a dormant account!\nPlease call your DealerRep for more information.";
											m_sRet = "1001552" + N2NConst.FEED_REQFLD_SEP + "Your selected trading account is a dormant account" + N2NConst.FEED_REQFLD_SEP + "0"  + N2NConst.FEED_REQFLD_SEP + "!~" + N2NConst.FEED_REQFLD_SEP + "1000204" + N2NConst.FEED_REQFLD_SEP + "Please call your DealerRep for more information" + N2NConst.FEED_REQFLD_SEP + "0" + N2NConst.FEED_REQFLD_SEP + ".";
										} else {	//check for suspended buy/sell
											int nStatus = iSuspFlg;

											if (sAccountStatus.equalsIgnoreCase(N2NConst.TRD_ACCTYPE_EES)) {
												m_nTrdAccTypeChk = N2NConst.TRDACCTYPECHK_NOSHORT | N2NConst.TRDACCTYPECHK_NOBUY | N2NConst.TRDACCTYPECHK_ESOSPRICE;
											} else if (sAccountStatus.equalsIgnoreCase(N2NConst.TRD_ACCTYPE_ESOS)) {
												m_nTrdAccTypeChk = N2NConst.TRDACCTYPECHK_NOBUY | N2NConst.TRDACCTYPECHK_ESOSPRICE;
											} else if (sAccountStatus.equalsIgnoreCase(N2NConst.TRD_ACCTYPE_EXTESOS)) {
												m_nTrdAccTypeChk = N2NConst.TRDACCTYPECHK_NOSHORT | N2NConst.TRDACCTYPECHK_NOBUY | N2NConst.TRDACCTYPECHK_ESOSPRICE;	//no chk esos when price <0
											}
						
											//if (m_bBuy) {
											if (sOrdType.equals(N2NConst.TRD_TYPE_BUY)) {
												if ((m_nTrdAccTypeChk & N2NConst.TRDACCTYPECHK_NOBUY) >0) {
													//EES/ESOS cannot account buy stock
													//m_sRet = "0" + N2NConst.FEED_REQFLD_SEP + "This account is suspended from buying!\nPlease use non ESS/ESOS account for buying.";
													m_sRet = "1000300" + N2NConst.FEED_REQFLD_SEP + "This account is suspended from buying" + N2NConst.FEED_REQFLD_SEP + "0"  + N2NConst.FEED_REQFLD_SEP + "!~" + N2NConst.FEED_REQFLD_SEP + "1000301" + N2NConst.FEED_REQFLD_SEP + "Please use non ESS/ESOS account for buying" + N2NConst.FEED_REQFLD_SEP + "0" + N2NConst.FEED_REQFLD_SEP + ".";
												}
						
												//check for suspend buy
												//if ((nStatus &m_oCalcFunc.TRD_ACCSTATUS_SUSPENDBUY) > 0) {
												if ((nStatus &N2NConst.TRD_ACCSTATUS_SUSPENDBUY) > 0 || ((nStatus &N2NConst.TRD_ACCSTATUS_SUSPENDTRADE) > 0 && !oN2NSession.cliinfo.isBankDealer())) {
													//m_sRet = "0" + N2NConst.FEED_REQFLD_SEP + "This account has been suspended from buying!\nPlease call your DealerRep for more information";
													m_sRet = "1000290" + N2NConst.FEED_REQFLD_SEP + "This account has been suspended from buying" + N2NConst.FEED_REQFLD_SEP + "0"  + N2NConst.FEED_REQFLD_SEP + "!~" + N2NConst.FEED_REQFLD_SEP + "1000204" + N2NConst.FEED_REQFLD_SEP + "Please call your DealerRep for more information" + N2NConst.FEED_REQFLD_SEP + "0" + N2NConst.FEED_REQFLD_SEP + ".";
												}
											} else {
												//check for suspend sell
												//if ((nStatus &m_oCalcFunc.TRD_ACCSTATUS_SUSPENDSELL) > 0) {
												if ((nStatus &N2NConst.TRD_ACCSTATUS_SUSPENDSELL) > 0 || ((nStatus &N2NConst.TRD_ACCSTATUS_SUSPENDTRADE) > 0 && !oN2NSession.cliinfo.isBankDealer())) {							
													//m_sRet = "0" + N2NConst.FEED_REQFLD_SEP + "This account has been suspended from selling!\nPlease call your DealerRep for more information.";
													m_sRet = "1000291" + N2NConst.FEED_REQFLD_SEP + "This account has been suspended from selling" + N2NConst.FEED_REQFLD_SEP + "0"  + N2NConst.FEED_REQFLD_SEP + "!~" + N2NConst.FEED_REQFLD_SEP + "1000204" + N2NConst.FEED_REQFLD_SEP + "Please call your DealerRep for more information" + N2NConst.FEED_REQFLD_SEP + "0" + N2NConst.FEED_REQFLD_SEP + ".";
												}												
											}
										}									
									}									
									
									if (m_sRet.length() == 0) {
										// return status is as follows:
										// retStatus|trdcond|warninginterval|processeddate|isduplicate|dupordno|duporddate|ordinstno
										m_sRet = "success" + N2NConst.FEED_REQFLD_SEP + m_sTrdCond + N2NConst.FEED_REQFLD_SEP + lWarningInterval + N2NConst.FEED_REQFLD_SEP +
												+ m_lStkLeft + N2NConst.FEED_REQFLD_SEP + m_sDupTrdInfo + N2NConst.FEED_REQFLD_SEP + "<br>\n" + sInstSessionData;
									}									
								} else {
									m_sRet = "0" + N2NConst.FEED_REQFLD_SEP + m_sRet + "^" + m_nRetCode;
								}
							}	
						}									
					} else {				
						m_sRet = "1000241" + N2NConst.FEED_REQFLD_SEP + "counter is suspended or otherwise, cannot be traded";
						System.out.println("m_sRetMsg222: " + m_sRet);
					}
				}	
			}//end else m_sTrdData.length() == 0			
		}//end if m_sRet.length() == 0
		
		trdfunc.dbDisconnect();
		out.println(m_sTrdData);
		out.println(m_sTrdCond);
		out.println(N2NConst.STD_DATA_BEGIN);
		out.println(m_sRet);
		out.println(N2NConst.STD_DATA_END);
	}
%>