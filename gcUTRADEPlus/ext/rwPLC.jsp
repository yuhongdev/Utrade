<%@ page import = "java.security.spec.*, java.security.Key, javax.crypto.Cipher, javax.crypto.KeyGenerator, javax.crypto.*, javax.crypto.spec.*, java.lang.*, java.util.*"%>
<%@include file="/common.jsp"%>
<%@include file="/util/sessionCheck.jsp"%>
<% 
	if (validSession) {
		String url = "https://plc.asiaebroker.com/gcPLC/ext/rwPLC.jsp?";
		String type = (request.getParameter("Type") !=null)?request.getParameter("Type"):((request.getParameter("t") != null)?request.getParameter("t"):"");
		/*
			type 6 = NewsArchive
			type 7 = NewsDetails
		*/
		if(type.equals("6") || type.equals("7")){
			url = "https://news-ph.asiaebroker.com/gcNEWSU/ext/rwPLC.jsp?";
		}
		String queryStr = request.getQueryString();
		String encTxt = "";
		String timeStamp = ""+new java.text.SimpleDateFormat("mmMMHHyyyyddss").format(new java.util.Date());
		String cliCode = g_sCliCode!=null?g_sCliCode:" ";
		String plainTxt = cliCode+""+timeStamp;
		String loginId = g_sLoginId;
		String responseURL = root_url;
		queryStr = queryStr!=null?queryStr:"";
		
		try{
			com.spp.util.security.Encrypt enc = new com.spp.util.security.Encrypt();
			System.out.println("[INFO][rwPLC.jsp]["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"] "+queryStr+"|"+g_sLoginId+"|"+cliCode+"|"+timeStamp);
			encTxt = enc.fetchEncode(plainTxt);
			loginId = enc.fetchEncode(loginId);
			System.out.println("[INFO][rwPLC.jsp]["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"] "+encTxt+"|"+loginId);
			//setEncValue(session, cliCode, encTxt);
			
			url = url+queryStr+"&k="+responseURL+"&j="+plainTxt+"&i="+encTxt+"&h="+loginId;
			System.out.println("[INFO][rwPLC.jsp]["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"] "+url);
			out.println("<script language='javascript'>location.href='"+url+"';</script>");
		}catch(Exception ex){
			ex.printStackTrace();
		}
	}else{
		out.println("<script language='javascript'>alert('Please login to UTrade...');//window.location='/';</script>");
	}
%>
<%!
private synchronized void setEncValue (HttpSession voSession, String vsCliCode, String vsSSOTokenEnc) {
	try {
        Hashtable ht = null;

		if (voSession.getServletContext().getAttribute("TokenList") != null)
			ht = (java.util.Hashtable) voSession.getServletContext().getAttribute("TokenList");
		else
			ht = new java.util.Hashtable();

		ht.put(vsCliCode, vsSSOTokenEnc);
		voSession.getServletContext().setAttribute("TokenList", ht);

	} catch (Exception e) {
		e.printStackTrace();
	}
}
%>

