<%@page contentType="text/html; charset=UTF-8"%>
<%@ page import = "java.net.*, java.io.*,org.json.*" %>
<%@ page import = "com.n2n.tcplus.session.HTTPSessionManager" %>
<%@ page import = "org.directwebremoting.ScriptSession" %>
<%
	HttpSession httpSession = request.getSession(false);
	ScriptSession scriptSession = HTTPSessionManager
			.getScriptSessionByHttpSession(httpSession);

	JSONObject json = new JSONObject();

	if (scriptSession != null) {
		json.put("s", true);
		json.put("ssid", scriptSession.getId());
	} else {
		json.put("s", false);
		json.put("ssid", "");
	}

	System.out.print(json);
	System.out.flush();

	out.println(json);
%>