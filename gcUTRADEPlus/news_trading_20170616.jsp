<%@ page import = "java.sql.*,java.net.*, java.io.*" %>
<%@ page import = "java.util.*" %>
<%@include file="/common.jsp"%>
<%@include file="/util/sessionCheck.jsp"%>
<%@include file="/util/banner.jsp"%>
<script type="text/javascript">
<!--
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}
function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}
//-->
</script>
<% 
try {
String page_width = "765";
String page_height = "600";
if (validSession) {
	setCommonPath(g_sPath, g_sImgPath, g_sJSPath, g_sStylePath, g_sWebPath, oN2NSession.getSetting("HTMLRoot"),out);
	genBannerTitle(oN2NSession.getSetting("WebSiteName"));
%>

<html>
<head>
	<META content='-1' http-equiv='Expires'>
	<META content='no-cache' http-equiv='Pragma'>
	<META content='no-cache' http-equiv='Cache-Control'>
	<title>Real Time</title>

<script language='JavaScript' src='<%=g_sJSPath%>/LinkFunc.js'></script>
<script type="text/javascript" src="<%=g_sJSPath%>/pluginDetect.js"></script>
<script type="text/javascript" src="<%=g_sJSPath%>/popupWindow.js"></script>

<script language="javascript">
</script>
<iframe src='' id='fraMenu' scroll='no' scrolling='no' frameborder='1'
style='position:absolute;visibility:hidden;filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);border:0;top:0;left:0;width:0;height:0;background-color:#000000;z-index:991;' class='iframe'></iframe>
<iframe src='' id='fraSubMenu' scroll='no' scrolling='no' frameborder='1'
style='position:absolute;visibility:hidden;filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);border:0;top:0;left:0;width:0;height:0;background-color:transparent;z-index:992;' class='iframe'></iframe>

<style type="text/css">
body  {
	margin: 0; /* it's good practice to zero the margin and padding of the body element to account for differing browser defaults */
	padding: 0;
	text-align: center;
	background-image: url(img/bodybg.png);
	background-repeat: repeat-x;
/*	background-color: #101010; */
}
.thrColAbsHdr #container {
	position: relative; /* adding position: relative allows you to position the two sidebars relative to this container */
	width: <%=page_width%>px;
	margin: 0 auto;
	text-align: left;
} 
.thrColAbsHdr #bodyContent {
	width: <%=page_width%>px;
	margin: 0;
	padding: 0;
	border: 1px solid #54a9f1;
	background-image: url(img/bodycontent_bg_home.jpg);
	background-repeat: repeat-y;
	height: <%=page_height%>px;
}
.thrColAbsHdr #footers {
	position: relative; /* adding position: relative allows you to position the two sidebars relative to this container */
	width: <%=page_width%>px;
	text-align: left;
	background-image: url(img/footer_bg.png);
	height: 35px;
	margin-top: 0;
	margin-right: auto;
	margin-bottom: 0;
	margin-left: auto;
} 
.thrColAbsHdr #footer p {
	margin: 0; /* padding on this element will create space, just as the the margin would have, without the margin collapse issue */
}
.footerlink {
	FONT-SIZE: 10px; COLOR: #ffffff
}
.footerlink A {
	FONT-SIZE: 10px;
	COLOR: #ffffff;
	text-decoration: underline;
}
.footerlink A:visited {
	FONT-SIZE: 10px;
	COLOR: #ffffff;
	text-decoration: underline;
}
.footerlink A:hover {
	FONT-SIZE: 10px;
	COLOR: #ffffff;
	text-decoration: none;
}
</style>

<body class="thrColAbsHdr">
<div id="container">
  <div id="bodyContent">
<table width="<%=page_width%>" border="0" cellspacing="0" cellpadding="0">
<tr>
	<td>

<%	String m_sEncryprytedData = "";
	String m_sKey = "";
	String m_sTime = "";
	java.text.SimpleDateFormat sdfDate = new java.text.SimpleDateFormat("yyMMdd");
	java.text.SimpleDateFormat sdfTime = new java.text.SimpleDateFormat("hhmmss");
	
	Calendar calNow = Calendar.getInstance();	
	
	m_sKey = sdfDate.format(calNow.getTime());
	m_sTime = sdfTime.format(calNow.getTime());
	//m_sKey = "070106";
	//m_sTime = "090010";
	
	char[] m_aKey = m_sKey.toCharArray();
	char[] m_aTime = m_sTime.toCharArray();
	//char[] m_aEncryptedData = new char[m_aTime.length]; 
	System.out.println("m_aKey.length : " + m_aKey.length);
	System.out.println("m_aTime.length : " + m_aTime.length);
	
	for (int i=0; i < m_aTime.length; i++) {
		//m_aEncryptedData = (m_aKey[i] ^ m_aTime[i]);
		m_sEncryprytedData +=  Character.toString((char)((int)m_aKey[i] ^ (int)m_aTime[i]));
	}
	
	System.out.println("m_sEncryprytedData.length : " + m_sEncryprytedData.length());
	System.out.println("m_sEncryprytedData: " + m_sEncryprytedData);
	
	String m_sBursa =  request.getParameter("Bursa_box");
	String m_sDowJones =  request.getParameter("DJ_box");
	String m_sAWSJ =  request.getParameter("AWSJ_box");
	m_sBursa = m_sBursa != null ? m_sBursa : "";
	m_sDowJones = m_sDowJones != null ? m_sDowJones : "";
	m_sAWSJ = m_sAWSJ != null ? m_sAWSJ : "";
	
	String m_sFilterStock =  request.getParameter("Filter");
	String m_sStockCode =  request.getParameter("Code");
	String m_sStockName =  request.getParameter("Name");
	m_sFilterStock = m_sFilterStock != null ? m_sFilterStock : "";
	m_sStockCode = m_sStockCode != null ? m_sStockCode : "";
	m_sStockName = m_sStockName != null ? m_sStockName : "";
	
	if(m_sBursa.equals("") && m_sDowJones.equals("") && m_sAWSJ.equals(""))
		m_sBursa = "yes";
%>
	<table cellspacing='0' cellpadding='0' border='0' bgcolor='#000000' width='100%'>
		<tr>
			<td align=left>	
			<%	if(m_sFilterStock.compareToIgnoreCase("LastTrx") == 0) { %>
				<IFRAME src="<%=oN2NSession.getSetting("NewsUrl")%>Bursa_box=<%=m_sBursa%>&DJ_box=<%=m_sDowJones%>&AWSJ_box=<%=m_sAWSJ%>&bhcode=057&FilterCode=<%=m_sStockCode%>&StockName=<%=m_sStockName%>&key=<%=URLEncoder.encode(m_sEncryprytedData)%>" frameBorder="0" width="100%" scrolling="auto" height="<%=page_height%>">
			<%	} else { %>
				<!--IFRAME src="<=oN2NSession.getSetting("NewsUrl")%>Bursa_box=<=m_sBursa%>&DJ_box=<=m_sDowJones>&AWSJ_box=<=m_sAWSJ>&bhcode=057&key=<=URLEncoder.encode(m_sEncryprytedData)>" frameBorder="0" width="760" scrolling="auto" height="988"><!--927">-->
				<IFRAME src="<%=oN2NSession.getSetting("NewsUrl")%>Bursa_box=<%=m_sBursa%>&DJ_box=<%=m_sDowJones%>&AWSJ_box=<%=m_sAWSJ%>&bhcode=057&FilterCode=<%=m_sStockCode%>&StockName=<%=m_sStockName%>&key=<%=URLEncoder.encode(m_sEncryprytedData)%>" frameBorder="0" width="100%" scrolling="auto" height="<%=page_height%>">
			<%	} %>
				<p align="center" class="aindexnews">If this column appears blank, please upgrade your browser to the latest version.</p>
				</IFRAME>																				
			</td>
		</tr>
	</table>
	</td>
</tr>
</table>
  </div>
</div>
<div id="footers">
<form name=frmSelUrlLink id=frmSelUrlLink>
<table cellspacing="0" cellpadding="0" border="0" width="100%" >
        <tr height="40">
            <td width="620" class="footerlink"></td>
            <input type="hidden" name="action" value="search" /> <input type="hidden" name="PHPSESSID" value="b9b80173fb224368c78e403c8684fb1b" /> <input type="hidden" name="id" value="mxf1" /> <input type="hidden" name="tpt" value="cimb_bank" /> <input type="hidden" name="st" value="0" /> <input type="hidden" name="nh" value="10" /> <input type="hidden" name="md" value="0" /> <input type="hidden" name="tl" value="64" />
            <td width="350" class="footerlink">
            </td>
        </tr>
</table>
</form>
<script language='JavaScript'>
function A_OnClick(vsLinkURL, vsParam){
	if (vsParam == '') {
		vsParam = "top=0,left=100,width=800,height=520,scrollbars=yes"
	}
	OpenLinkWindow(vsLinkURL, "WinNews", vsParam);
}
</script>        

<!-- end #footer --></div>	
</body>
</html>
<% 

} else {
}

}catch (Exception ex) {
	ex.printStackTrace();
}
%> 