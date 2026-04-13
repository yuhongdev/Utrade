<%@ page import = "java.sql.ResultSet,com.n2n.util.N2NConst,com.n2n.bean.N2NMFCliInfoBean,com.n2n.DB.N2NMFCliInfo,com.n2n.DB.N2NMFCliColSetting,com.n2n.bean.N2NMFCliColSettingBean" %>
<%@ include file='/common.jsp'%>
<%@ include file='/util/sessionCheck.jsp'%>
<%
	response.setHeader("Cache-Control","no-cache");
	response.setHeader("Pragma", "no-cache");

	String sCliCode = g_sCliCode;
	if (request.getParameter("CliCode") != null) {
		sCliCode = request.getParameter("CliCode");
	}
	sCliCode = sCliCode != null ? sCliCode : "";

	out.print(g_sCliCode);

	//oN2NSession.cliinfo.init(oN2NSession);
	//oN2NSession.N2NCheckUserLogin(sCliCode,request, response, 2);
	if (validSession) {

	ResultSet oRst = null;
	String nRetCode = "";

	N2NMFCliInfo cli = new N2NMFCliInfo();
	cli.init(oN2NSession);

	oRst = cli.SMSGetAuthCode(g_sCliCode,g_sDefBHCode,"SMSTRD");
	
	if (oRst != null) {
		while (oRst.next()){
			nRetCode = oRst.getString("AuthCode");
		}
	}
	else {
		nRetCode = "-1";
	}

	out.println(N2NConst.STD_DATA_BEGIN);
	out.println(nRetCode);
	out.println(N2NConst.STD_DATA_END);
	cli.closeResultset();
	//cli.dbDisconnect();
	}else{
		response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
	}
%>