<%
	String isSSO = request.getParameter("isSSO")!=null?request.getParameter("isSSO"):"";
	String url = "";
        if(!isSSO.equals("Y")){
                %>
                <script language='javascript'>
                        var Host = window.location.host;
                        var Protocol = window.location.protocol;
                        var sAppVersion = navigator.appVersion.toLowerCase();
                        var sUserAgent = navigator.userAgent.toLowerCase();
                        var sURL = "";
                        sURL = "/";
                       // this.location.href = sURL;
			parent.location.href = sURL;
                </script>
                <%
		url = "/";
        }else{
                %>
                <script language='javascript'>
                if(parent != null) {
                       if (parent.location != null){
                               parent.location.href = 'http://maybank.ayannah.com';
                        } else {
                                this.location.href='http://maybank.ayannah.com';
                        }
                } else {
                        this.location.href='http://maybank.ayannah.com';
                }
                </script>
                <%
		url = "http://maybank.ayannah.com";
        }
%>
<html>
<head>
<title></title>
</head>
<body>
<table cellpadding=0 cellspacing=0 border=0 width=100%>
<tr>
	<td>
		&nbsp;
	</td>
</tr>
<!--Content-->
<tr>
	<td style='font-size:12px;font-family:Arial;' align='center'>
		You have been <b>logged out</b> successfully.<br/>
		Please click <a href="<%=url%>">here</a> if you are not redirected automatically.<br/>
	</td>
</tr>
</tbody>
</table>
</body>
</html>
