<%@ page import="com.spp.util.security.Encrypt,java.sql.*,com.n2n.bean.*,com.n2n.DB.*,java.text.SimpleDateFormat,java.util.Date,com.n2n.util.N2NSecurity,java.util.*,com.n2n.connection.TCException"%>
<%//@include file="/common.jsp"%>
<%
	String scheduled_time = "064001";
	java.util.Calendar expDate = java.util.Calendar.getInstance();
	expDate.add(java.util.Calendar.DATE, 1);
	String strExpDate = new java.text.SimpleDateFormat("yyyyMMdd"+ scheduled_time).format(expDate.getTime());
	String defaultKey = oN2NSession.getSetting("QCMsgID").toString();
	boolean connMagicKey = true;

	javax.servlet.ServletContext servlets = getServletContext();
	if (servlets != null) {
	} else {
		servlets = request.getSession().getServletContext();
	}

	// Part 1:
	// If have the magic key, means someone had hit LMS and stored in server memory.
	// Check the KEYEXPDT or expiration date in session whether had expired.

	if (servlets.getAttribute("GET_MESSAGE_ID") != null
			&& !servlets.getAttribute("GET_MESSAGE_ID").equals("")) {
		connMagicKey = false;

		try {
			// if the KEYEXPDT is not empty
			if (servlets.getAttribute("KEYEXPDT") != null) {
				String strExpDateTime = servlets.getAttribute("KEYEXPDT").toString();
				// Parse the "yyyyMMdd HHmmss" to expiration date
				java.util.Date expDateTime = new java.text.SimpleDateFormat("yyyyMMddHHmmss").parse(strExpDateTime);
				// if expiration date is before current date, means had expired
				if (expDateTime.before(new java.util.Date())) {
					connMagicKey = true;
				}
			}
		} catch (java.text.ParseException ep) {
		}
	}

	// Part 2:
	// scenario 1: If no LMS magic key or connect first time
	// scenario 2: If expired after check the KEYEXPDT

	if (connMagicKey) {

		try {
			// connect to LMS server to retrieve the parameters
			com.n2n.util.N2NATPConnect atpConnect = new com.n2n.util.N2NATPConnect(oN2NSession.getSetting("QCFeed"), "EN");
			atpConnect.loginLMS(g_sLoginId, session);

			if (session.getAttribute("GET_MESSAGE_ID") == null) {
				servlets.setAttribute("GET_MESSAGE_ID", defaultKey);
				servlets.setAttribute("KEYEXPDT", strExpDate);
			} else {
				servlets.setAttribute("GET_MESSAGE_ID", session.getAttribute("GET_MESSAGE_ID").toString().trim());
				servlets.setAttribute("KEYEXPDT", session.getAttribute("KEYEXPDT").toString().trim());
			}

		} catch (com.n2n.connection.TCException e) {
			servlets.setAttribute("GET_MESSAGE_ID", defaultKey);
		}

		// Get the KEYEXPDT from session, replace if session is empty

		if (servlets.getAttribute("KEYEXPDT") != null
				&& !servlets.getAttribute("KEYEXPDT").equals("")) {

		} else {

			try {
				if (session.getAttribute("KEYEXPDT") == null) {
					servlets.setAttribute("KEYEXPDT", strExpDate);
				} else {
					servlets.setAttribute("KEYEXPDT", session.getAttribute("KEYEXPDT").toString().trim());
				}
				// the KEYEXPDT in session is empty, either not implemented or error get exp date
			} catch (Exception e) {
			}
		}

		// encrypt the magic key and store to GET_MESSAGE_ID
		try {
			String message_id = servlets.getAttribute("GET_MESSAGE_ID").toString();
			com.spp.util.security.Encrypt en = new com.spp.util.security.Encrypt();
			message_id = en.fetchEncode(message_id);
			servlets.setAttribute("GET_MESSAGE_ID", message_id);
		} catch (java.lang.Exception ex) {
		}
	}
%>