
<%
boolean validSession = true;
	try {

	if (session.getAttribute("rawLoginMessage") == null) { // ATP return attribute
		validSession = false;
		System.out.println("[sessionCheck] FAIL: rawLoginMessage is null");
	} else {
		if (session.getAttribute("rawLoginMessage").equals("")) {
			validSession = false;
			System.out.println("[sessionCheck] FAIL: rawLoginMessage is empty");
		}
	}
	if (session.getAttribute("userPram") == null) { // ATP session
		validSession = false;
		System.out.println("[sessionCheck] FAIL: userPram is null");
	} else {
		if (session.getAttribute("userPram").equals("")) {
			validSession = false;
			System.out.println("[sessionCheck] FAIL: userPram is empty");
<<<<<<< HEAD
		}
	}
	if (session.getAttribute("uuid") != null) { // is first time login
		if (!session.getAttribute("uuid").equals("")) {
			validSession = false;
			System.out.println("[sessionCheck] FAIL: uuid is non-empty = " + session.getAttribute("uuid"));
		}
	}
	System.out.println("[sessionCheck] validSession=" + validSession + " | rawLoginMessage=" + session.getAttribute("rawLoginMessage") + " | userPram=" + session.getAttribute("userPram") + " | uuid=" + session.getAttribute("uuid"));
	} catch (Exception ex) {
		//validSession = false;
		ex.printStackTrace();
		validSession = false;
		return; //Stop page futher execution of code
	}
%>
