<%@ include file='/common.jsp'%>
<%@ include file='/util/sessionCheck.jsp'%>
<%@ page import = "com.n2n.util.N2NConst"%>
<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<%
	try {
		//String g_sCliCode = (String) session.getAttribute("clicode");
		//if (oN2NSession.N2NCheckUserLogin(request,response,1)) {
		  if (validSession) {
			int m_nResult = 0;
			String sPIN = request.getParameter("txtPIN");
			sPIN = sPIN != null ? sPIN : "";
			
			if (sPIN.length() >  0) {
				cli.init(oN2NSession);				
				m_nResult = cli.checkPin(g_sCliCode	, cli.getPin(sPIN, oN2NSession.getSessionId(session)));
			} else {
				m_nResult = 0;
			}
			out.println(N2NConst.STD_DATA_BEGIN);
			out.println(m_nResult);
			out.println(N2NConst.STD_DATA_END);		
		}
	} catch (Exception nfe) {
		nfe.printStackTrace();
	}
%>