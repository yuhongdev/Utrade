<%@ include file='/common.jsp' %>
<%@ include file='/util/sessionCheck.jsp' %>

<%
	boolean g_validSession=validSession;
	String sReturnStr="";
	if(g_validSession){
		sReturnStr = g_sCliName+"|"+g_sLoginId+"|"+g_sCategory;
	}else{
		sReturnStr="false";
	}
	out.print(sReturnStr);
%>



