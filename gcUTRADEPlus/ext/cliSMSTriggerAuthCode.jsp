<%@ page import = "java.sql.ResultSet,com.n2n.util.N2NConst,com.n2n.bean.N2NMFCliInfoBean,com.n2n.DB.N2NMFCliInfo,com.n2n.DB.N2NMFCliColSetting,com.n2n.bean.N2NMFCliColSettingBean" %>
<jsp:useBean id="cliinfo" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<%@ include file='/common.jsp'%>
<%@ include file='/util/sessionCheck.jsp'%>

<%
	response.setHeader("Cache-Control","no-cache");
	response.setHeader("Pragma", "no-cache");

	String sCliCode = g_sCliCode;
	boolean bRet;

	if (request.getParameter("CliCode") != null) {
		sCliCode = request.getParameter("CliCode");
	}
	sCliCode = sCliCode != null ? sCliCode : "";
	
	//cliinfo.init(oN2NSession);
	//oN2NSession.N2NCheckUserLogin(sCliCode,request, response, 2);
	if (validSession) {
	
	String sRowData = ""; String[] aWork; String[] arrInfo; String[] aParam;
	String sBHCliCode = ""; String sBHBranch = ""; String sStatus = "";
	String sLinkCode = ""; String sService = "";
	String sMobileNum = "";
	String sChkOldMobileNum = ""; String sChkNewMobileNum = "";
	String sRandomPassword = "";
	
	sRowData = request.getParameter("txtSMSRowData3");
	arrInfo = sRowData.split("\\" + N2NConst.FEED_REQFLD_SEP);
	
	if (sRowData.length() > 0) {
		sLinkCode  = arrInfo[0];
		sService = arrInfo[1];
		sMobileNum = arrInfo[2];
		sMobileNum =  sMobileNum.replaceAll(",", N2NConst.FEED_REQFLD_SEP );
		
		if (sMobileNum.length() > 0) { 
			aParam = sMobileNum.split("\\" + N2NConst.FEED_REQFLD_SEP);
			sChkOldMobileNum = aParam[0];
			sChkNewMobileNum = aParam[1];
		} 

		sBHCliCode = arrInfo[3];
		if (sBHCliCode.length() > 0) {
			aWork = sBHCliCode.split("\\" + N2NConst.TRDACC_COL_SEP);
			sBHCliCode = aWork[0];
			if (aWork.length > 1) {
				sBHBranch = aWork[1];
			}
		}

		sStatus = arrInfo[4];
	}

	String sParam = ""; String sMobile = "";
	String sURL = ""; String sSQL = ""; String sSubject = "";
	int nNumCount; int nRetCode; int nTemplateID; String sPrice;
	ResultSet oRst = null;
	String sChars = "abcdefghjkmn23456789pqrstuvwxyz23456789ABCDEFGHJKMN23456789PQRSTUVWXYZ23456789";
	String sPass = "";
	int i = 0;

	nNumCount = 0;

	if ((sMobileNum.length() > 0) && (!((sService=="Y") && (sChkNewMobileNum == sChkOldMobileNum)))) {

		for (int x=0;x<6;x++) {
			i = (int) Math.floor(Math.random() * 62);
			sPass += sChars.charAt(i);
		}
		sRandomPassword = sPass;

		N2NMFCliColSetting clicol = new N2NMFCliColSetting();
		N2NMFCliColSettingBean cliBean = new N2NMFCliColSettingBean();
		clicol.init(oN2NSession);

		cliBean.setService_code(sLinkCode);
		cliBean.setCli_code(sCliCode);
		cliBean.setBhcode(g_sDefBHCode);
		cliBean.setBhbranch(sBHBranch);
		cliBean.setBh_clicode(sBHCliCode);
		cliBean.setEmail("N");		
		cliBean.setSms("N");
		cliBean.setParam(sMobileNum);		
		cliBean.setActive(sService);
		cliBean.setStatus(sStatus);

		bRet = clicol.cliProfSave2(cliBean,"","",sRandomPassword);

		clicol.dbDisconnect();
			
		sPrice = "0";
		sParam = sRandomPassword + "|" + sPrice  + "|";
		nTemplateID = 74;
		sSubject = oN2NSession.getSetting("WebSiteName")+" SMS Trd Auth Code";

		N2NMFCliInfo cli = new N2NMFCliInfo();
		cli.init(oN2NSession);

		nRetCode = cli.mfMsgInsMailQueue("C","",sChkNewMobileNum,sSubject,nTemplateID,sParam,"","","",0,0,0);	
		cli.closeResultset();
		//cli.dbDisconnect();
	} 
	else {
		nRetCode = 2;
	}
	
	out.println("<script language='javascript'>");
	out.println("this.location.href='"+g_sPath+"/cliProfilerTrd.jsp?nRetCode="+nRetCode+"';");
	out.println("</script>");
	}else{
		response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
	}
%>
