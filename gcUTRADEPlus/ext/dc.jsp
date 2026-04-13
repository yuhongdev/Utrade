<%@ page import="java.util.Arrays, java.util.Hashtable"%>
<%@ page import="org.json.JSONArray"%>
<%@ page import="org.json.JSONObject"%>
<%@ page pageEncoding="UTF-8" %>
<%
	String sSecureIP = "|127.0.0.1|10.99.1.116|125.5.209.34|10.99.1.254|10.140.1.124|10.140.1.202|10.140.1.137|";
	String sClientIP = "";

	if ((sClientIP = request.getHeader("client-ip")) == null) {
		if ((sClientIP = request.getHeader("x-forwarded-for")) == null) {
			sClientIP = request.getRemoteAddr();
		}
	}
	
	System.out.println("[INFO][dc.jsp]["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"] "+sClientIP);
	if (sSecureIP.indexOf("|"+ sClientIP +"|") == -1) {
		out.clear();
		out.println("Error, Unauthorized IP [" + sClientIP + "]");
		return;
	}else{
		//response.setContentType("application/json");
	}


	String vsTime = request.getParameter("t");

	int lTimeTimeout=600000;
	long lTimeCurr=0, lTime=0;
	java.util.Date dtNow = new java.util.Date();

	lTimeCurr = dtNow.getTime();
	if (vsTime == null) {
		lTime = 0;
	} else {
		try {
			lTime = Long.parseLong(vsTime);
		} catch (java.lang.NumberFormatException e) {
			lTime = 0;
		}
	}
	
	String sInput = request.getParameter("i");
	String cliCode = "";
	
	if (lTime + lTimeTimeout >= lTimeCurr) {
        if (sInput != null) {
	        com.spp.util.security.Decrypt dec = new com.spp.util.security.Decrypt();			
			
			if(sInput.indexOf("|") >= 0){
				String splitedTxt[] = sInput.split("\\|");
				cliCode = dec.fetchDecode(splitedTxt[0]);
				cliCode += "|"+dec.fetchDecode(splitedTxt[1]);
			}else{
				cliCode= dec.fetchDecode(sInput);
			}
			
			System.out.println("[INFO][dc.jsp]["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"] "+sInput+"|"+cliCode);
			
			/*Hashtable ht = null;
			String sSSOTokenEnc = "";
			if ( session.getServletContext().getAttribute("TokenList") != null) {
				ht = (java.util.Hashtable) session.getServletContext().getAttribute("TokenList");

				//check session id exists in hashtable. If exist, get its session value
				if (ht.containsKey(cliCode)) {
					sSSOTokenEnc = (String) ht.get(cliCode);
					sSSOTokenEnc = sSSOTokenEnc != null ? sSSOTokenEnc : "";
				}
			}
			
			System.out.println("[INFO][dc.jsp]["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"] "+sSSOTokenEnc);
			
			out.clear();
			
			if(sSSOTokenEnc.equals(sInput)){
				ht.remove(cliCode);
				out.print(cliCode);
			}else{
				out.println("Error, You are not authorise to access this page");
			}*/
			out.clear();
			out.println(cliCode);
		}
	} else {
		System.out.println("[INFO][dc.jsp]["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"] "+ sInput +" - "+ lTime +" / "+ lTimeTimeout +" / "+ lTimeCurr +" / "+ (lTimeCurr - lTime));
		out.clear();
		out.println("Error, You are not authorise to access this page");
	}
%>

