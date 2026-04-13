<%
boolean validSession = true;
try {
	if (session.getAttribute("rawLoginMessage") == null) { // ATP return attribute
		validSession = false;
	} else {
		if (session.getAttribute("rawLoginMessage").equals("")) {
			validSession = false;
		}
	}
	if (session.getAttribute("userPram") == null) { // ATP session
		validSession = false;
	} else {
		if (session.getAttribute("userPram").equals("")) {
			validSession = false;
		}
	}
	if (session.getAttribute("uuid") != null) { // is first time login
		if (!session.getAttribute("uuid").equals("")) {
			validSession = false;
		}
	}

} catch (Exception ex) {
System.out.println("Exception at sessionCheck.jsp initial loading:"+ex.getMessage());
//	ex.printStackTrace();
	validSession = false;
	return; //Stop page futher execution of code
}


String defaultExchange = "KL";
String ref_No = request.getParameter("ref")!=null?request.getParameter("ref").toString():"";
String encNo = request.getParameter("enc")!=null?request.getParameter("enc").toString():"";
String report_no = "";

try {
//user_param(ascii)~public_ip~private_ip~loginid~port number~report number~
if (!ref_No.equals("")) {
System.out.println("*** ref_No:"+ref_No+"|validSession:"+validSession);
System.out.println("_________________________________________");
System.out.println("ref_No:"+ref_No+"|"+"g_sLoginId:"+g_sLoginId+"|"+"session:"+session.getAttribute("loginid"));
session = request.getSession (true);
System.out.println("............ Prev Session:"+session.getAttribute("userParam")+"|Login:"+g_sLoginId+"|");

	validSession = true;
	String sRefNo[] = ref_No.split("\\~");
	String user_param_session = (sRefNo.length>0)?sRefNo[0]:"";
	String public_ip_session = (sRefNo.length>2)?sRefNo[2]:"";
	g_sLoginId = (sRefNo.length>3)?sRefNo[3]:"";
	String ip_port = (sRefNo.length>4)?sRefNo[4]:"80";
	report_no = (sRefNo.length>5)?sRefNo[5]:"1";
	System.out.println("................user_param_session:"+sRefNo[0]+"|public_ip_session:"+sRefNo[2]+"|g_sLoginId:"+sRefNo[3]+"|ip_port:"+sRefNo[4]+"|report_no:"+sRefNo[5]);
	if (encNo.equals("Y")) {
		g_sLoginId = new com.spp.util.security.Decrypt().fetchDecode(g_sLoginId);
	}
	if (ip_port.equals("20010")) {
		ip_port = "80";
	} else if (ip_port.equals("20012")) {
		ip_port = "80";
	}
	public_ip_session = public_ip_session + ":" + ip_port;

	com.n2n.util.N2NATPPushConnect atp_call = new com.n2n.util.N2NATPPushConnect(public_ip_session, "EN");
	// relogin([USER_PARAM], g_sLoginId, checkIndicator, HttpSession, N2NSession, PUSH/PULL);
	try {
	System.out.println("................relogin:"+user_param_session+"|login:"+g_sLoginId);
	    atp_call.relogin(user_param_session, g_sLoginId, "1", session, oN2NSession, "2");
	} catch (Exception e) {
	}

	System.out.println("..............|SenderName:"+session.getAttribute("senderName")+"|indicator:"+session.getAttribute("TradeIsLogin"));
	String reLogin_session = session.getAttribute("TradeIsLogin")!=null?session.getAttribute("TradeIsLogin").toString():"temp";
	System.out.println("*******|SenderName:"+session.getAttribute("senderName")+"|indicator:"+reLogin_session+"|"+reLogin_session.equals("1")+"|"+validSession+"************");
	
//	if (reLogin_session.equals("0")) {
//		validSession = false;
//		session.invalidate();
//		out.println("<script language='javascript'>");
//		out.println("	alert('Please login to access this page.');");
//		out.println("</script>");
//	}

	if (reLogin_session.equals("1")) {
		validSession = true;
	}
System.out.println("_________________________________________"+validSession);
} // check ref_No value

//}
} catch (Exception e) {
System.out.println("---------------- exception caught at sessionCheck.jsp:"+e.getMessage());
e.printStackTrace();

}

System.out.println("[INFO][HC] validSession:"+validSession);
%>
