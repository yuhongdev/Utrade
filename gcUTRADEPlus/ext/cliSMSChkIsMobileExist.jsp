<%@ page import = "java.sql.ResultSet,com.n2n.util.N2NConst,com.n2n.bean.N2NMFCliInfoBean,com.n2n.DB.N2NMFCliInfo" %>
<jsp:useBean id="oN2NSession" class="com.n2n.DB.N2NSession" scope="session">
	<% oN2NSession.init(application);%>
</jsp:useBean>
<%
	String sMobile;
	int iRetCode;

	out.println(N2NConst.STD_DATA_BEGIN);

	sMobile = request.getParameter("sMobile");
	sMobile = sMobile != null ? sMobile : "";

	N2NMFCliInfo cli = new N2NMFCliInfo();
	cli.init(oN2NSession);

	ResultSet rs = cli.chkIsMobileExist(sMobile);
	
	if (rs != null) {
		while (rs.next()){
			iRetCode = rs.getInt("NumCount");
			out.println(iRetCode);
		}
	}
	cli.dbDisconnect();
	out.println(N2NConst.STD_DATA_END);
%>
