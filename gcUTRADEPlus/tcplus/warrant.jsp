<%@ page import = "java.net.*, java.io.*" %>
<%
//String url1 = "http://warrants.osk188.com/gcOSKWR/cliStkWrtLineWS.jsp?";
String url1 = "http://warrants.osk188.com/gcOSKWR/ext/cliStkWrtWS.jsp?";

//String maturity = request.getParameter("mat");
String premium = request.getParameter("prem");
String optype = request.getParameter("optype");
String gear = request.getParameter("gear");
String mnytype = request.getParameter("mnytype");
String mnyprc = request.getParameter("mnyprc");
//String sts  = request.getParameter("sts");
String under = request.getParameter("under");
String page1 = request.getParameter("page");
String issuer = request.getParameter("issuer");
String optsty = request.getParameter("optsty");
String expiry = request.getParameter("expiry");
String effgear = request.getParameter("effgear");
String ivfrom = request.getParameter("ivfrom");
String ivto = request.getParameter("ivto");
String cat = request.getParameter("cat");
String row = request.getParameter("row");

url1 += "prem="+premium+        
		"&optype="+optype+
        "&gear="+gear+
        "&mnytype="+mnytype+
        "&mnyprc="+mnyprc+
      //  "&sts="+sts+
        "&under="+under+
        "&issuer="+issuer+
        "&optsty="+optsty+
        "&expiry="+expiry+
        "&effgear"+ effgear+
        "&ivfrom"+ ivfrom+
        "&ivto"+ ivto+
        "&page="+page1+
		"&cat="+cat+
		"&row="+row;

String charset = "UTF-8";

System.out.println(url1);


URLConnection connection = new URL(url1).openConnection();
connection.setRequestProperty("Accept-Charset", charset);
InputStream input = connection.getInputStream();

BufferedReader br = new BufferedReader(new InputStreamReader(input));
StringBuilder sb = new StringBuilder();
String line = null;

while ((line = br.readLine()) != null) {
sb.append(line + "\n");
}

br.close();

out.println(sb.toString());
%>

