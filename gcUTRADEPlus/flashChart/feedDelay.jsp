<%@ page import = "java.net.*, java.io.*, java.util.Date, java.text.SimpleDateFormat, java.util.Vector" %>
<%
System.out.println("\n"+request.getRequestURL()+"?"+request.getQueryString());

String urlHistorical = "http://sgnews.itradecimb.com/hist/cimbflschart.jsp";

URLConnection connection = null;
InputStream input = null;
BufferedReader br = null;
StringBuilder sbHistorical = null;

String line = "", charset = "UTF-8";

String parameter = "?"+request.getQueryString();
parameter = parameter.replace("+TICKS+", "+TICK+");
if(parameter.indexOf("INDEX_") > 0 && parameter.indexOf(".SG") > 0)
	parameter = parameter.replace(".SG",".SGI");
System.out.println(urlHistorical+parameter);

connection = new URL(urlHistorical+parameter).openConnection();
connection.setRequestProperty("Accept-Charset", charset);
input = connection.getInputStream();
br = new BufferedReader(new InputStreamReader(input));
sbHistorical = new StringBuilder();

while ((line = br.readLine()) != null) {
	if(line.trim().length()>0) {
		sbHistorical.append(line + "\n");
	}
}

br.close();
input.close();
out.clearBuffer();
out.print(sbHistorical.toString());
out.flush();
%>