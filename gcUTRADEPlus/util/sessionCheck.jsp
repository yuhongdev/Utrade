
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
//System.out.println("hit here...1");
	} else {
		if (session.getAttribute("userPram").equals("")) {
			validSession = false;
//System.out.println("hit here...2");
		}	
	}
	if (session.getAttribute("uuid") != null) { // is first time login 
		if (!session.getAttribute("uuid").equals("")) {
			validSession = false;
//System.out.println("hit here...3");
		}
	}
//System.out.println("uuid here:"+session.getAttribute("uuid"));
	} catch (Exception ex) {
		//validSession = false;
		ex.printStackTrace();
		validSession = false;
		return; //Stop page futher execution of code
	}
%>
