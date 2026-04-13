<%@ page session="false" %>
<%@ page contentType="application/javascript;charset=UTF-8" %>
<%@ page import="com.n2n.login.config.N2NSession" %>
<%@ page import="com.n2n.login.util.LoginUtil" %>

<%
    //N2NSession oN2NSession = LoginUtil.getN2NSession(session);
    N2NSession oN2NSession = LoginUtil.getN2NSession2(application);
    String passportLoginBc = oN2NSession.getSetting("passportLoginBc");
    if (passportLoginBc == null) {
        passportLoginBc = "";
    } else {
        passportLoginBc = passportLoginBc.replace("\\", "\\\\").replace("'", "\\'");
    }
    //System.out.println("passportLoginBc = " + passportLoginBc);
%>
window.LOGIN_BC = '<%= passportLoginBc %>';