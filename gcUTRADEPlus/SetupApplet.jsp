<%!
public String GetAppletObjectTag(String sId, String sCode, String sCodeBase, String sArchiveEx, String sObjTagParam, String sEmbedParam, String iWidth, String iHeight) {

	final String sCLASS_ID = "clsid:CAFEEFAC-0016-0000-FFFF-ABCDEFFEDCBA";
	final String sJRE_DL	 = "http://dl.ebrokerconnect.com/download/jre-6u2-windows-i586-p.exe";
	final String sJRE_TYPE = "application/x-java-applet;version=1.6";
	final String sJRE_FAIL = "Java JRE 1.6 not available,please download.";

	String str = "";

	str = str + "<OBJECT CLASSID='" + sCLASS_ID + "' CODEBASE='" + sJRE_DL + "' WIDTH='" + iWidth + "' HEIGHT='" + iHeight + "' ";
	
	if (sId.length() > 0) { str = str + "id='" + sId + "' name='"+ sId + "' "; }
	
	str = str + ">\n";
	str = str + "<PARAM NAME='CODE' VALUE='" + sCode + "'>\n";
	str = str + "<PARAM NAME='CODEBASE' VALUE='" + sCodeBase + "'>\n";
	str = str + "<PARAM NAME='CACHE_ARCHIVE_EX' VALUE='" + sArchiveEx + "'>\n";
	str = str + "<PARAM NAME='TYPE' VALUE='" + sJRE_TYPE + "'>\n";
	str = str + "<PARAM NAME='MAYSCRIPT' VALUE='true'>\n";
	str = str + "<PARAM NAME='VIEWASTEXT' VALUE='true'>\n";
	str = str + sObjTagParam + "\n";
	str = str + "<EMBED CODE='" + sCode + "' CODEBASE='" + sCodeBase + "' CACHE_ARCHIVE_EX='" + sArchiveEx + "' WIDTH='" + iWidth + "' HEIGHT='" + iHeight + "' TYPE='" + sJRE_TYPE + "' PLUGINSPAGE='" + sJRE_DL + "' MAYSCRIPT='true' ";

	if (sId.length() > 0) { str = str + "id='" + sId + "' name='"+ sId + "' "; }
	
	str = str + "\n";
	str = str + sEmbedParam + "\n";
	str = str + "<NOEMBED>" + sJRE_FAIL + "</NOEMBED>\n";
	str = str + "</EMBED>\n";
	
	str = str + "</OBJECT>\n";

	System.out.println("SetupApplet: str:"+str);
	return str;
}
%>