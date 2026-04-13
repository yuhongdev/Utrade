<%@ page import = "java.net.*, java.io.*"%>
<%
try{
//       URL url = new URL("http://localhost:8080");
URL url = new URL("http://172.16.0.218:80/TradeLogin?PullMode=1|UserName=????????|Password=?%C3%89?%C3%8A?%C3%8B%7CClientIP=175.143.75.130|Compress=0|AppName=A|EncryptedUP=1|Encryption=0|ShowExchCodeList=Y:Mon%20Dec%2003%2012:00:55%20GMT+08:00%202012");

       HttpURLConnection huc = (HttpURLConnection) url.openConnection();
       HttpURLConnection.setFollowRedirects(false);
       huc.setConnectTimeout(15 * 1000);
       huc.setRequestMethod("GET");
       huc.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 (.NET CLR 3.5.30729)");
       huc.connect();
     		BufferedReader in = new BufferedReader(new InputStreamReader(
                                    huc.getInputStream()));
        String inputLine;
        while ((inputLine = in.readLine()) != null) 
            out.println(inputLine);
        in.close();
}catch (SocketTimeoutException ex) {
//ex.printStackTrace();
out.println("timeout");
   //return false;
} catch (IOException ex) {
//ex.printStackTrace();
out.println("IO EXp");
   //return false;
}

%>
