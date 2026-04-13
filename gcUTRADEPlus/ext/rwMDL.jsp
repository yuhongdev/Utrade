<%@ page import = "java.security.MessageDigest, java.security.Security, java.lang.*, java.util.*, com.n2n.util.AESMobile, java.net.URLEncoder"%>
<%@include file="/common.jsp"%>
<%@include file="/util/sessionCheck.jsp"%>
<% 
	if (validSession) {
		//String url = "https://news-ph.asiaebroker.com/mchart/index.jsp?"; //prod
		String url = "https://news-ph.asiaebroker.com/tvchart/chart.html?"; //prod
		//String url = "https://news-uat.asiaebroker.com/mchart/index.jsp?"; //uat
		String queryStr = request.getQueryString();		
		String cliCode = g_sCliCode!=null?g_sCliCode:" ";	
		String md5Key = "";
		queryStr = queryStr!=null?queryStr:"";
		
		try{
			Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
			md5Key = generateCheckSum(oN2NSession.getSetting("modulus.key")).toString();
			System.out.println("[INFO][rwMDL.jsp]["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"] "+queryStr+"|"+cliCode+"|"+md5Key);
			
			cliCode = AESMobile.encode(md5Key,cliCode);	
			cliCode = URLEncoder.encode(cliCode);
			
			url = url+queryStr+"&h="+cliCode+"&bhCode="+oN2NSession.getSetting("WebBHCode");
			System.out.println("[INFO][rwMDL.jsp]["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"] "+url);
			out.println("<script language='javascript'>location.href='"+url+"';</script>");
		}catch(Exception ex){
			ex.printStackTrace();
		}
	}else{
		out.println("<script language='javascript'>alert('Please login to proceed.');//window.location='/';</script>");
	}
%>
<%!
private synchronized StringBuffer generateCheckSum(String value){
		StringBuffer sb = new StringBuffer();
		
		try{
			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(value.getBytes());
			byte byteData[] = md.digest();
			for (int i = 0; i < byteData.length; i++) {
	        	sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
	        }
		}catch (Exception e){
        	System.out.println(e.getMessage());
			e.printStackTrace();
		}
		
		return sb;
	}
%>
