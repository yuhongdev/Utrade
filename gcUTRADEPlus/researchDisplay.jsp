<%@ include file='common.jsp'%>
<jsp:include page="cliCheckLogin.jsp" flush="true">
	<jsp:param name="SecLevel" value="1" />
</jsp:include>
<% 
try {
	if (oN2NSession.getIsUserLogin()) {
	String sLink = request.getParameter("docLink");
	sLink = sLink != null ? sLink : "";
%>
<script language="JavaScript">
	location.href = '<%=sLink%>';
</script>
<%	}
} catch (Exception ex) {
	ex.printStackTrace();
}
%>