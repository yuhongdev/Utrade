<SCRIPT language=javascript src="plugins.js"></SCRIPT>
<%
String acceptLanguage = request.getHeader("accept-language");
String userAgent      = request.getHeader("user-agent");
String strIE = "MSIE";
boolean isIEver = true;
String strFirefox = "Firefox";
String userAgents = request.getHeader("user-agent");
StringBuffer a = new StringBuffer();
a.append(strIE);
String browserVer = "";
if (userAgents.contains(a)) {
	int iMSIE = userAgents.indexOf(a.toString());
	browserVer = userAgents.substring(iMSIE+5,userAgents.substring(iMSIE).indexOf(";")+iMSIE);
}
if (browserVer.equals("7.0")) {
	browserVer = strIE+browserVer;
}
if (browserVer.equals("8.0")) {
	browserVer = strIE+browserVer;
}
if (browserVer.equals("6.0")) {
	browserVer = strIE+browserVer;
}
a = new StringBuffer();
a.append(strFirefox);
if (userAgents.contains(a)) {
	int iFirefox = userAgents.indexOf(a.toString());
	browserVer = userAgents.substring(iFirefox+8);
}
if (browserVer.charAt(0)=='3') {
	browserVer = strFirefox+browserVer;
	isIEver = false;
}
if (browserVer.charAt(0)=='2') {
	browserVer = strFirefox+browserVer;
	isIEver = false;
}
%>
