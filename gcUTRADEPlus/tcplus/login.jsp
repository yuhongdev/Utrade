<%@ 
page language="java" 
contentType="text/html; charset=ISO-8859-1"
pageEncoding="ISO-8859-1"
%>

<%@page import="com.n2n.tcplus.atp.Login"%>

<%@page import="com.n2n.tcplus.atp.misc.ATPUtil"%>


<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">


<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
		<title>Insert title here</title>
	</head>
	
	<body>
		<%
			String sLoginId = request.getParameter("user");
			String sLoginPass = request.getParameter("password");
		
			if ( sLoginId == null || sLoginPass == null ) {
				
				out.write(" <h4> User Info is null value. </h4> ");
				
			} else {
				
				Login tempObj = new Login();
				byte[] result = tempObj.getLoginInfo( sLoginId, sLoginPass );
				
				if ( result == null ) {
					
					out.write(" <h4> Result is null. </h4> ");
					
				} else {

					HttpSession sess = request.getSession();
					sess.setAttribute( "rawLoginMessage", ATPUtil.byteToString( result ) );
					sess.setAttribute( "loginFromSelf", "true" );

					%>
					
					
					<script>
						window.location = "main.jsp";
					</script>
					
					
		
					<%
					
				

				}
				
			}
			
			
		%>
		
		
	</body>
</html>