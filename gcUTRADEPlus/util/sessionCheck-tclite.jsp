<%
boolean validSession = true;
try {
	if (session.getAttribute("rawLoginMessage") == null) { // ATP return attribute
//System.out.println("rawLoginMessage is null");
		if(session.getAttribute("rawLoginMessageTCLite") == null) {
			validSession = false;
		} else {
			session.setAttribute("rawLoginMessage", session.getAttribute("rawLoginMessageTCLite"));
		}
	} else {
//System.out.println("rawLoginMessage="+session.getAttribute("rawLoginMessage"));
		if (session.getAttribute("rawLoginMessage").equals("")) {
			if(session.getAttribute("rawLoginMessageTCLite")!=null) {
				if(session.getAttribute("rawLoginMessageTCLite").equals("")) {
					validSession = false;
				} else {
					session.setAttribute("rawLoginMessage", session.getAttribute("rawLoginMessageTCLite"));
				}
			} else {
				validSession = false;
			}
		} else {
			session.setAttribute("rawLoginMessageTCLite", session.getAttribute("rawLoginMessage"));
		}
	}

	if (session.getAttribute("userPram") == null) { // ATP session 
		validSession = false;
	} else {
//System.out.println("userPram="+session.getAttribute("userPram"));
		if (session.getAttribute("userPram").equals("")) {
			validSession = false;
		}	
	}

	if (session.getAttribute("uuid") != null) { // is first time login 
//System.out.println("uuid="+session.getAttribute("uuid"));
		if (!session.getAttribute("uuid").equals("")) {
			validSession = false;
		}
	}
} catch (Exception ex) {
	ex.printStackTrace();
	validSession = false;
	return; //Stop page futher execution of code
}
%>