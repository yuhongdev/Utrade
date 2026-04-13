<%@ include file='banner.jsp'%>
<%@ page import = "com.n2n.DB.N2NSession"%>
<%@ page import = "com.n2n.util.N2NConst"%>
<%!
	public N2NSession oN2NSession = null;
	private void init(N2NSession voN2NSession) {
		oN2NSession = voN2NSession;
	}

/**
'Purpose:	central area for maintaining style and style sheet settings for the entire
'					project
'By     : Edward
'Date   : Mar 4, 1999
'Args		: none
*/
public void GenStyles() {
	try {
		if (oN2NSession.getSetting("AppMode")!=null&&oN2NSession.getSetting("AppMode").equalsIgnoreCase("game")) {
			out.println("<link rel=stylesheet href=/style/game.css>");
		} else {
			out.println("<link rel=stylesheet href=/style/default.css>");
			out.println("<link rel=\"shortcut icon\" href=/img/favicon.ico >");
		}
	} catch (Exception e) {
	
	}
}

%>
