<%@include file="/common.jsp"%>
<%@include file="/util/banner.jsp"%>
<%!
	private String connectATP(String vsIC, String vsLoginID, String vsBHCliCode, String vsBHCode, String vsClientIP, String mode,  HttpSession session, com.n2n.DB.N2NSession oN2NSession) {
		try {
			String atpURL = session.getAttribute("ATPURLprivate")!=null?session.getAttribute("ATPURLprivate").toString().trim():oN2NSession.getSetting("atpURL");
			com.n2n.util.N2NATPPushConnect atp = new com.n2n.util.N2NATPPushConnect("atpweb:20030");
			com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
			context = atp.login(vsIC, vsLoginID, vsBHCliCode, vsClientIP, mode, session, oN2NSession);
			return context.getErrorMsg();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
%>
<%
	Boolean validSession = true;
System.out.println("userPram:"+session.getAttribute("userPram"));
	try {
		if (session.getAttribute("userPram") == null) {
			validSession = false;
		}
		if (session.getAttribute("userPram") != null) {
			if (session.getAttribute("userPram").toString().equals("")) {
				validSession = false;
			}
		}
		if (session.getAttribute("uuid") != null) { // is first time login
			if (!session.getAttribute("uuid").equals("")) {
				validSession = false;
			}
		}
	} catch (Exception ex) {
		ex.printStackTrace();
		return; //Stop page futher execution of code
	}
System.out.println("validSession:"+validSession+"|g_sLoginId:"+g_sLoginId+"|g_sCliCode:"+g_sCliCode);


StringBuffer m_sLog = new StringBuffer();
String vsSSOTokenEnc = "";
String sTrdAccNo = "";
String sBHCode = "";
String errMsg = "";
String sIPAddr="", sICNo="";
boolean proceedSSOToken = true;
String sClicksID="";

String sClientIP;
if ((sClientIP = request.getHeader("client-ip")) == null) {
	if ((sClientIP = request.getHeader("x-forwarded-for")) == null) {
		sClientIP = request.getRemoteAddr();
	}
}
System.out.println("TCLite: Client IP=" + sClientIP);
if (!validSession) {
	com.spp.util.security.Decrypt dec = new com.spp.util.security.Decrypt();
	vsSSOTokenEnc = request.getParameter("authenticationToken")!=null?request.getParameter("authenticationToken").toString():"";
System.out.println("TCLite: vsSSOTokenEnc=" + vsSSOTokenEnc);

	if (vsSSOTokenEnc.length() >0) {
		String vToken[] = null;
		String sSSOToken = dec.fetchDecode(vsSSOTokenEnc);
System.out.println("TCLite: sSSOToken=" + sSSOToken);
		if (sSSOToken.length() >0) {
			out.println(sSSOToken);
			vToken = sSSOToken.split("\\|");
			// sToken = sCliCode +"|"+ sLoginID +"|"+ sIPAddress +"|"+ sIC +"|"+ sBHCliCode;
			g_sCliCode = vToken[0];
			g_sLoginId = vToken[1];
			sIPAddr = vToken[2];
			sICNo = vToken[3];
			sTrdAccNo = vToken[4];
			if(vToken.length>5)
				sBHCode = vToken[5];

System.out.println("TCLite: g_sCliCode="+ g_sCliCode +" ; g_sLoginId="+ g_sLoginId +" ; sIPAddr="+ sIPAddr);
			
			// get hashtable from servlet context
			java.util.Hashtable ht = null;
			String sSSOTokenEnc = "";

			if ( session.getServletContext().getAttribute("SSOTokenList") != null) {
				ht = (java.util.Hashtable) session.getServletContext().getAttribute("SSOTokenList");

				//check session id exists in hashtable. If exist, get its session value
				if (ht.containsKey(g_sCliCode)) {
					sSSOTokenEnc = (String) ht.get(g_sCliCode);
					sSSOTokenEnc = sSSOTokenEnc != null ? sSSOTokenEnc : "";
				}
			}
System.out.println("TCLite: sSSOTokenEnc="+ sSSOTokenEnc);
			
			if(sSSOTokenEnc.equals(vsSSOTokenEnc)){
				ht.remove(g_sCliCode);
				session.getServletContext().setAttribute("SSOTokenList", ht);
			}

			validSession = true;
			errMsg = connectATP(sICNo, g_sLoginId, sTrdAccNo, sBHCode, sIPAddr, "1", session, oN2NSession);
			errMsg = errMsg!=null?errMsg:"";
			
			if(errMsg.equals("")){
				session.setAttribute("loginid", g_sLoginId);
				session.setAttribute("isSSOUser", "Y");
				out.clear();
				out.println("<script language='javascript'>location.href='http://xts110.pseonline.ph/gcUTRADEPlus/tclite/index.jsp';</script>");
				//response.sendRedirect("/gcATR/tclite/index.jsp");
			}else{
				out.println(errMsg);
			}
		}
	}

}else{
	System.out.println("SSO Previous Session Valid");
	out.println("<script language='javascript'>location.href='http://xts110.pseonline.ph/gcUTRADEPlus/tclite/index.jsp';</script>");
}


%>
