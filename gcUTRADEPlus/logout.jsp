<%--
<%
	//session.invalidate();
	response.sendRedirect(request.getContextPath() + "/login?logout=true");
%>
<script language='javascript'>
//	this.location.href='http://localhost:8081/web/cimb';
</script>
--%>
<%@ include file= 'common.jsp'%>

<%
	String sURL = request.getContextPath() + "/login?logout=true"; 

	String frmpath = request.getParameter("frmpath")!=null?request.getParameter("frmpath").toString():"";
	if (frmpath.equalsIgnoreCase("mobile")) {
		sURL = g_sPath+"/web/html/cliLoginMobileV3.html";
	}
%>

<script>
	fetch('<%=request.getContextPath()%>/srvs/v3/logout').finally(() => {
		redirectAfterLogout();
	});

	function redirectAfterLogout() {
		var targetURL = '<%=sURL%>';
		if (parent != null) {
			if (opener != null) {
				opener.location.href = targetURL;
				parent.close();
			} else {
				parent.location.href = targetURL;
			}
		} else {
			window.location.href = targetURL;
		}
	}
</script>
