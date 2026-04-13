<%@page import="org.json.JSONObject"%>
<%
	HttpSession httpSession = request.getSession(false);

	String sAction = request.getParameter("act");

	JSONObject jsonObject = new JSONObject();
	
	if (sAction != null) {
		if ("agree".equalsIgnoreCase(sAction)) {
			httpSession.setAttribute("agree_prtfDisclaimer", "Y");
			jsonObject.put("s", true);
		} else {
			jsonObject.put("s", false);
		}
	} else {
		String sAgree = (String) httpSession.getAttribute("agree_prtfDisclaimer");
		
		if (sAgree != null && sAgree.equalsIgnoreCase("Y")) {
			jsonObject.put("s", true);
		} else {
			jsonObject.put("s", false);
		}
	}
	
	out.write(jsonObject.toString());
%>