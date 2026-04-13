<%@include file="/common.jsp"%>
<%@include file="/util/sessionCheck.jsp"%>
<%
out.clearBuffer();
if (validSession) {
	out.println(session.getAttribute("loginid")+"||0");
} else {
	out.println("|1100 ATP - Invalid session|1100");
}
out.flush();
%>
