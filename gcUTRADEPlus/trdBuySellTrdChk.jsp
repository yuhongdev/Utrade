<%@ include file='/common.jsp'%>
<jsp:include page="cliCheckLogin.jsp" flush="true">
	<jsp:param name="SecLevel" value="2" />
</jsp:include>
<%@ page import = "java.sql.ResultSet,com.n2n.util.N2NConst, com.n2n.DB.N2NDateFunc, com.n2n.DB.N2NMFCliInfo" %>
<%
	String sTrdAct = request.getParameter("c");
	String sTrdData = request.getParameter("r");
	String []asTrdData = null;
	String sParam = "";
	String sStkCode = "";
	String sCliCode = "";
	String sBHCliCode = "";
	String sMaxDate = "";
	String sExpDate = "";
	String sBHBranch = "";
	String sBuySellCallRet = "";
	boolean m_bUseNetLimit = false;
	
	sTrdAct = sTrdAct != null ? sTrdAct : "";
	sTrdData = sTrdData != null ? sTrdData : "";	
	asTrdData = sTrdData.split("\\" + N2NConst.FEED_REQFLD_SEP);
	
	if (oN2NSession.getIsUserLogin()) {		
		//case "APPStkLeft":		
		if (sTrdAct.equals("APPStkLeft")) {
			System.out.println("APPStkLeft:asTrdData.length:" + asTrdData.length);
			if (asTrdData.length == 3) {
				sStkCode = asTrdData[0];
				if (sStkCode.length() > 0)
					sStkCode = sStkCode.substring(sStkCode.indexOf("[")+1,sStkCode.length() -1);
				sCliCode = asTrdData[1];
				sBHCliCode = asTrdData[2];
								
				asTrdData = null;
				asTrdData = sBHCliCode.split("-");
				sBHCliCode = asTrdData[0];
				
				if (asTrdData.length >= 2) {
					sBHBranch = asTrdData[1];
				}
				
				System.out.println("sStkCode: " + sStkCode + " sCliCode: " + sCliCode + " sBHCliCode: " + sBHCliCode + " sBHBranch: " + sBHBranch);
				//if (sStkCode.length() > 0 && sCliCode.length() > 0 && sBHCliCode.length() > 0 && sBHBranch.length() > 0) {
				if (sCliCode.length() > 0 && sBHCliCode.length() > 0 && sBHBranch.length() > 0) {
					if (sCliCode.equals("------")){
						sCliCode = g_sCliCode;
					}

					if (sStkCode.length() > 0){
						sBuySellCallRet = oN2NSession.cliinfo.getAPPriceStkLeft(sCliCode, sStkCode, g_sDefBHCode, sBHCliCode, sBHBranch, 3);
					}
					else{
						sBuySellCallRet = "0|0";
					}
					
					sParam = oN2NSession.getSetting("AppOptNetTrdLimit");					
					//m_bUseNetLimit = sParam != null ? (new Boolean(sParam)).booleanValue() : true;
					m_bUseNetLimit = true;
					System.out.println("Tina  Chk"+sParam+" " +m_bUseNetLimit);
					if (m_bUseNetLimit){
						sBuySellCallRet += N2NConst.FEED_REQFLD_SEP;
						sBuySellCallRet += oN2NSession.cliinfo.getAPPriceStkLeft(sCliCode, sStkCode, g_sDefBHCode, sBHCliCode, sBHBranch, 4);
					}
					else{
						sBuySellCallRet += N2NConst.FEED_REQFLD_SEP;
						sBuySellCallRet += oN2NSession.cliinfo.getAPPriceStkLeft(sCliCode, sStkCode, g_sDefBHCode, sBHCliCode, sBHBranch, 4);// changed from 8 to 4 for cimb
					}
				}				
			}

			
		}//end if (sTrdAct.equals("APPStkLeft"))
		else if (sTrdAct.equals("ValidTrdDate")) {
			if (asTrdData.length == 2) {
				sMaxDate = asTrdData[0];
				sExpDate = asTrdData[1];			
				N2NDateFunc datefunc = new N2NDateFunc();
				datefunc.init(oN2NSession);
				
				if (sMaxDate.length() > 0 && sExpDate.length() > 0) {
					sBuySellCallRet = datefunc.getValidMaxTrdDate(sMaxDate, sExpDate);
					datefunc.closeResultset();
					datefunc.dbDisconnect();
				}
			}			
		}
		out.println(N2NConst.STD_DATA_BEGIN);
		out.println(sBuySellCallRet);
		out.println(N2NConst.STD_DATA_END);
	}	
%>