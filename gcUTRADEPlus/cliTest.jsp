<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ page import="java.net.*,java.io.*" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>

<%

StringBuffer sb = new StringBuffer();
OutputStreamWriter out1;
BufferedReader reader;

try{

URL url = new URL("http://atpweb:20030");
HttpURLConnection conn = (HttpURLConnection)url.openConnection();
conn.setConnectTimeout(20000);


conn.setDoOutput(true);
      conn.setDoInput(true);
      conn.setRequestMethod("POST");

      out1 = new OutputStreamWriter(conn.getOutputStream(), "ISO-8859-1");

      String sPostData = "";
      
      out1.write(sPostData);
      out1.flush();

      conn.connect();
      InputStream is = conn.getInputStream();

      if (is != null) {
//        System.out.println("Processing input:" + new Date());
        reader = new BufferedReader(new InputStreamReader(is, "ISO-8859-1"));

        String str = "";
        while ((str = reader.readLine()) != null)
          sb.append(str + "\n");
      }

	out.println(sb.toString());

}catch (SocketTimeoutException ex) {
ex.printStackTrace();
out.print(ex.getMessage());
   //return false;
} catch (IOException ex) {
ex.printStackTrace();
out.print(ex.getMessage());
  
// return false;
}

%>

</body>
</html>
