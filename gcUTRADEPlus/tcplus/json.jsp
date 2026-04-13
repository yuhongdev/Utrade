<%@ page import = "java.net.*, java.io.*" %>
<%
String url1 = "http://warrants.osk188.com/gcOSKWR/ref/mf_underlyingStkListJSON.ref";

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
