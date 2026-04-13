
<%@page import="java.net.*"%>
<%@page import="java.io.*"%>
<%@page import="com.n2n.tcplus.info.N2NConstant, com.n2n.tcplus.debug.N2NLogUtil"%>
<%

	HttpSession sess = request.getSession(false);
	String sUser = (String) sess.getAttribute("user");

    String sURL = N2NConstant.getConstant("constNewsDtlURLFormat");
    String sKey = request.getParameter("k");
    String sLang = request.getParameter("l");

    if (sLang == null || sLang.trim().length() == 0) 
    	sLang = "EN";

    //if (request.getQueryString() != null) System.out.println("request.getQueryString():" + request.getQueryString());

    sURL = sURL.replaceAll("<NewsKey>", sKey);
    sURL = sURL.replaceAll("<NewsLanguage>", sLang);

    //System.out.println("sURL:" + sURL);

  	N2NLogUtil.logInfo("[stock news] QueryString {" + sess.getId() + "} : " + request.getQueryString(), sUser);
    N2NLogUtil.logInfo("[stock news] url ---> " + sURL, sUser);
    
    URL news = new URL(sURL);
    URLConnection newsConn = news.openConnection();
    BufferedReader in = null;
    
	
    try {
        in = new BufferedReader(new InputStreamReader(newsConn.getInputStream()));

        String inputLine;
        while ( ( inputLine = in.readLine() )  != null ) {
            out.println(inputLine);
        }
        
    } catch (Exception e) {
        N2NLogUtil.logError("[stock news] exception ---> " + e, sUser);
    } finally {
        if (in != null)
            in.close();
    }

	N2NLogUtil.logInfo("[stock news] end *** \n", sUser);
    

%>
