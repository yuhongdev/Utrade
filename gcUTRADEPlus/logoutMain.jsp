<%
	//session.invalidate();
	response.sendRedirect(request.getContextPath() + "/login?logout=true");
%>
<script language='javascript'>
//	this.location.href='http://localhost:8081/web/cimb';
</script>