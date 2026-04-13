<%
	try {
		if (session.getAttribute("userPram") == null) {
			throw new Exception();
		}
		if (session.getAttribute("userPram") != null) {
			if (session.getAttribute("userPram").toString().trim().equals("")) {
				throw new Exception();
			}	
		}
	}catch (Exception ex) {
		response.sendRedirect(g_URL_Wclose);
		return; //Stop page futher execution of code
	}

%>