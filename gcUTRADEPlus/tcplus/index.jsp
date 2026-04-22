<%@include file="/common.jsp"%>
<%@include file="/util/sessionCheck.jsp"%>
<%-- <%@ page import = "com.n2n.util.CommonUtil" %> --%>

<%!
public String getClientIP(HttpServletRequest request){
                String sClientIP = "";

                if ((sClientIP = request.getHeader("client-ip")) == null) {
                        if ((sClientIP = request.getHeader("x-forwarded-for")) == null) {
                                sClientIP = request.getRemoteAddr();
                        }
                }

                sClientIP = sClientIP!=null?sClientIP:"";
                return sClientIP;
        }
%>

<% String url_base_path = request.getRequestURL().toString().substring(0,request.getRequestURL().toString().indexOf("/")+2); %>
<% String HTMLROOT_path = url_base_path+oN2NSession.getSetting("HTMLRootSecure").substring(oN2NSession.getSetting("HTMLRootSecure").indexOf("/")+2,oN2NSession.getSetting("HTMLRootSecure").length()); %>
<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
<%
	String clientIP = getClientIP(request);

	// CommonUtil.logAPAgent(...) disabled: import com.n2n.util.CommonUtil is commented out (line 3)
	// because Logging.logAPAgent1() requires a log file path configured in globalsetting.properties
	// that is not guaranteed to exist in all environments — enabling it without the config would crash the page.

	// CommonUtil.logAPAgent("index.jsp", clientIP, request.getSession().getId(), String.valueOf(request.getSession().getAttribute("loginid")), String.valueOf(request.getSession().getAttribute("clicode")), String.valueOf(request.getSession().getAttribute("userPram")), String.valueOf(request.getSession().getAttribute("uuid")));    
    System.out.println("Session index.jsp "+request.getSession().getId());
    String sid = request.getParameter("sid")!=null?request.getParameter("sid").toString().trim():"";
    System.out.println("Client IP in index.jsp for client:"+g_sLoginId+":"+clientIP+":"+sid);

	String m_sContextPath = request.getContextPath();
	String sSecure = request.getParameter("isSec")!=null?request.getParameter("isSec").toString().trim():"N";	
	String sHTMLROOT = "";
	if (sSecure.equalsIgnoreCase("Y")) {
		sHTMLROOT = oN2NSession.getSetting("HTMLRootSecure") + m_sContextPath;
	} else {
		sHTMLROOT = oN2NSession.getSetting("HTMLRootSecure") + m_sContextPath;
	}

%>
<style type="text/css">
body  {
	margin-top: 1 !important;/* it's good practice to zero the margin and padding of the body element to account for differing browser defaults */
	padding: 0;
	text-align: center;
}

.bodyClass{
	margin: 0 !important; 
	padding: 0 !important;
}

html{
	-webkit-text-size-adjust:100%;
	-ms-text-size-adjust:100%;
	-moz-text-size-adjust:100%;
	text-size-adjust:100%;
}
</style>
<%
	int C_CLIMSGFLG_CLICKS = 1;
	String sCLASS_ID = "clsid:CAFEEFAC-0016-0000-FFFF-ABCDEFFEDCBA";
	String sUserAgent = "";
	boolean ie = false;
	int width = iWidth;
	int height = 540;
	String PULL_MODE = "1";
	String PUSH_MODE = "2";
	com.spp.util.security.Encrypt enc = new com.spp.util.security.Encrypt();
	sUserAgent = request.getHeader("User-Agent").toLowerCase();
	if (sUserAgent.indexOf("msie") != -1) {
		ie = true;
	}
	if (sUserAgent.indexOf("chrome/7") != -1) {
		ie = true;
	}

if (validSession && session.getAttribute("userPram")!=null) {
try {
	String m_sLangs = request.getParameter("lang")!=null?request.getParameter("lang").toString().trim():"en";
		String isBasicVer = request.getParameter("basic")!=null?request.getParameter("basic").toString().trim().toUpperCase():"";
	String mode_url = request.getParameter("mode")!=null?request.getParameter("mode").toString().trim():"1";
	String sess_params = request.getParameter("t")!=null?request.getParameter("t").toString():enc.fetchEncode(sCLASS_ID);
	String feed_server_url = "";
	String sISAPIDLL_url = "";
	String sCheckSum = "";
	String sDataMode = mode_url;
	String sClientIP = "";
	String atpURL = session.getAttribute("ATPURLpublic")!=null?session.getAttribute("ATPURLpublic").toString().trim():oN2NSession.getSetting("atpURL");
	if(session.getAttribute("atpURL_"+g_sLoginId)==null)
		session.setAttribute("atpURL_"+g_sLoginId, atpURL);
	com.n2n.util.N2NATPPushConnect atp = new com.n2n.util.N2NATPPushConnect(atpURL);
	try {
		if ((sClientIP = request.getHeader("client-ip")) == null) {
			if ((sClientIP = request.getHeader("x-forwarded-for")) == null) {
				sClientIP = request.getRemoteAddr();	
			}
		}
		System.out.println("Client IP in qsea.jsp for client:"+g_sLoginId+":"+sClientIP);
	} catch (Exception e) {
		System.out.println("Unable to retrieve client IP :"+e.getMessage());
	}
	String mode_session = session.getAttribute("appletMode")!=null?session.getAttribute("appletMode").toString():"2";
	System.out.println("mode_session:"+mode_session+"|"+"mode_url:"+mode_url);
	if (mode_url.equals("1")) { // default - ATP push Mode
		feed_server_url = oN2NSession.getSetting("PFSURL1")+"|"+oN2NSession.getSetting("PFSPort"); // push mode
	} else if (mode_url.equals("0")) { 
		feed_server_url = oN2NSession.getSetting("PPSURL1")+"|"+oN2NSession.getSetting("PPSPort"); // pull mode
	} else {
		feed_server_url = oN2NSession.getSetting("PFSURL1")+"|"+oN2NSession.getSetting("PFSPort"); // default is push mode
	}

	sISAPIDLL_url = oN2NSession.getSetting("ISAPIDLL.URL")!=null?oN2NSession.getSetting("ISAPIDLL.URL").toString().trim():"bttbfd.asiaebroker.com";
	sCheckSum = oN2NSession.getSetting("Checksum")!=null?oN2NSession.getSetting("Checksum").toString().trim():"XXGOZQNZMUAPSORQVXHIVXKRLOOOGQZCZQAHRYPBPZR";

	String tradClientAcc = session.getAttribute("tradingAcc")!=null?session.getAttribute("tradingAcc").toString().trim():"0";
	if (tradClientAcc.length()>1) {
		String cliTradCliAcc[] = tradClientAcc.split("\\,");
		for (int i=0;i<cliTradCliAcc.length;i++) {
			if (cliTradCliAcc[i].equals("KL")) {
				tradClientAcc = "1";
				break;
			}
		}
	}
	if (g_sCategory.equals("D") || g_sCategory.equals(N2NConst.CLI_CATEGORY_REMOTERMS)) {
		tradClientAcc = "1";
	}
	String xml_setting_url = "";
	if (tradClientAcc.equals("1")) {
		xml_setting_url = enc.fetchEncode("http://uat.itradecimb.com.my/gcCIMB/java/jar/swing/xml/065KL_ED_qsea.xml").toString().trim();
	} else {
		xml_setting_url = enc.fetchEncode("http://uat.itradecimb.com.my/gcCIMB/java/jar/swing/xml/065KL_NA_qsea.xml").toString().trim();
	}	

	String sLstFile = "", sLstVerFile = "", sLanguages = "", sCountry = "", sFont = "";
	String cache_archive = "";
	String cache_version = "";
	String strMobileNum = "";
	String strEmailAdd = "";
	if (m_sLangs.equalsIgnoreCase("en")) {
		sCountry = "US";
		sLanguages = "en";
		sFont = "SansSerif";
		cache_archive = "qsea.jar,imga.jar,com.ebc.awt.jar,CalcFunc_blockCheck.jar,rbRT_en_US.jar,JChart2dN2N.jar";
		cache_version = "1.0.1.6,1.0.0.4,1.0.0.1,1.0.0.1,1.0.0.1,1.0.0.1";
	} else {
		sLstFile = "rbRT_zh_CN.jar";
		sCountry = "CN";
		sLanguages = "zh";
		out.println("<meta http-equiv='Content-Type' content='text/html; charset=gb2312'>");
		sFont = "PMingLiU,MingLiU,SimHei,SimSun,Arial Unicode MS,Ms Hei,Ms Song";
		sLstVerFile = "1.0.0.1";
		cache_archive = "qsea.jar,imga.jar,com.ebc.awt.jar,CalcFunc_blockCheck.jar,rbRT_en_US.jar,rbRT_zh_CN.jar,JChart2dN2N.jar";
		cache_version = "1.0.1.3,1.0.0.1,1.0.0.1,1.0.0.1,1.0.0.1,1.0.0.1,1.0.0.1";
	}
	//String atpURL = session.getAttribute("ATPURLpublic")!=null?session.getAttribute("ATPURLpublic").toString().trim():oN2NSession.getSetting("atpURL");
	//String atpURL = oN2NSession.getSetting("atpURL");
	String sTrdHtmlRoot = HTMLROOT_path + g_sPath.substring(1) + "/";	
	//System.out.println("sess:"+session.getAttribute("userPram").toString().trim());	
	String sCode = "com.n2n.realtime.RealTimeApplet.class";

	String sBrowserType = "";
	String sClassID = "";
	if(!ie) {
		sBrowserType = "Others";
		sClassID = "java:" + sCode;
	} else {
		sBrowserType = "IE";
		sClassID = sCLASS_ID;
	}
	
	String drtset = "11|2|1.25|0|1";
	width = 1000;
	height = 520;
	iWidth = width;	
	strMobileNum = session.getAttribute("senderMobileATP")!=null?session.getAttribute("senderMobileATP").toString():"";
	strEmailAdd = session.getAttribute("senderEmailATP")!=null?session.getAttribute("senderEmailATP").toString():"";

	String prtfDisclaimerTerms = session.getAttribute("agree_prtfDisclaimer")!=null?session.getAttribute("agree_prtfDisclaimer").toString():"";
	String sCliMsgFlg = (String) session.getAttribute("cliMsgFlg");
	if (sCliMsgFlg == null) { sCliMsgFlg = "0"; }
	int nCliMsgFlg = Integer.parseInt(sCliMsgFlg);

	if ((nCliMsgFlg &C_CLIMSGFLG_CLICKS) == 0) {
		if (g_sAccType!=null) {
			if (g_sAccType.equals("Y")) {
				//out.println("<script language=JavaScript>var win = window.showModalDialog(\""+root_url+"/web/Notification.htm\",\"\",\"dialogHeight:280px;dialogWidth:505px;scroll:no\");</script>");
				//out.println("<script language=JavaScript>var win = window.open(\""+root_url+"/web/Notification.htm\",\"\",\"width=580,height=300,left=120,top=80,scrollbars=no,resizable=no\");</script>");
				nCliMsgFlg = nCliMsgFlg |C_CLIMSGFLG_CLICKS;
				sCliMsgFlg = Integer.toString(nCliMsgFlg);
				session.setAttribute("cliMsgFlg", sCliMsgFlg);
			}
		}
	}
%>

<html>
<head>
	<META content='-1' http-equiv='Expires'>
	<META content='no-cache' http-equiv='Pragma'>
	<META content='no-cache' http-equiv='Cache-Control'>
	<title>Trading Portal [1]</title>
	<script language='JavaScript'>
		function noBack(){window.history.forward()}
		noBack();
		window.inhibited_load=noBack;
		window.onpageshow=function(evt){if(evt.persisted)noBack()}
		window.inhibited_unload=function(){void(0)}
	</script>
	<script language='JavaScript' src='<%=g_sJSPath%>/LinkFunc.js'></script>
	<script type="text/javascript" src="<%=g_sJSPath%>/popupWindow.js"></script>
	<script type="text/javascript" src="<%=g_sJSPath%>/jquery-3.7.1.min.js"></script>
	<!--<script type="text/javascript" src="<%=g_sJSPath%>/jquery-2.1.1.js"></script>-->



	<!--<script type="text/javascript" src="/MNA-theme/js/vendor/jquery-2.1.1.js"></script>-->

	<script type="text/javascript" src="<%=g_sJSPath%>/device.min.js"></script>
	<script language='JavaScript' type='text/javascript' src='<%=g_sJSPath%>/tickerConnectEngineNew.js'></script>
	<script language='JavaScript' type='text/javascript' src='<%=g_sJSPath%>/tickerConnectNew.js'></script>	
	
	<div id="stickydiv-anchor" style="display:none;">&nbsp;</div>
	<div id="stickydiv">
	<div id="stickContent">
		<div style="display:none;"><a id="triggerAnchor" rel="tppoplogin" class="poplogin" href="#">trigger</a></div>
		<div style="display: none; width: 500px; margin-top: -238.5px; margin-left: -340px;padding : 20px; " id="tppoplogin" class="popbox">
			<iframe id="popupIFrame" name="popupIFrame" style="position:relative; " src=""  frameborder="0" height="350" width="500"></iframe>
		</div>
	</div>
	</div>

	
	
	<iframe src='' id='fraMenu' scroll='no' scrolling='no' frameborder='1' style='position:absolute;visibility:hidden;filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);border:0;top:0;left:0;width:0;height:0;background-color:#000000;z-index:998;' class='iframe'></iframe>
	<iframe src='' id='fraSubMenu' scroll='no' scrolling='no' frameborder='1' style='position:absolute;visibility:hidden;filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);border:0;top:0;left:0;width:0;height:0;background-color:transparent;z-index:997;' class='iframe'></iframe>
</head>
<body onload="checkSIP()">
	<script language="javascript">	
	
	function checkSIP(){

		<%
	String sSIP = session.getAttribute("SIP")!=null?session.getAttribute("SIP").toString():"";
		System.out.println("value of SIP Flag : "+sSIP);	
	
		if(sSIP.equals("1")) {		
		%>
		popupWin();
		<%
		session.setAttribute("SIP",0);
		
	}
		%>

		
		}
	
		var bodyHeight, bodyWidth, bTablet, bDesktop, bMobile;
		var isBasicVersion = '<%=isBasicVer%>';
		bTablet = device.tablet();
		bMobile = device.mobile();
		bDesktop = device.desktop();
		
		if(bTablet){
			$('head').append('<META name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">');
		}
		function getScreenSize(){
			bodyHeight=("innerHeight" in window)?window.innerHeight:document.documentElement.offsetHeight; 
			bodyWidth =("innerWidth" in window)?window.innerWidth:document.documentElement.offsetWidth; 

			if(bTablet){
				bodyWidth = ""+parseInt(bodyWidth);
				bodyHeight = ""+parseInt(bodyHeight)-46;
			}else{
				bodyWidth = ""+parseInt(bodyWidth)-25;
			}
			bodyHeight = ""+parseInt(bodyHeight);
			
			//$("body").append("width="+bodyWidth+",height="+bodyHeight);
			
			if(bDesktop){
				if(bodyHeight < 500){ bodyHeight = 500; }
				else{bodyHeight -= 20;}
				if(bodyWidth < 1000){ bodyWidth = 1000; }
			}else if(bMobile){
				bodyHeight = 600;
				if(bodyWidth < 1000){ bodyWidth = 1000; }
			}
			
			if(isBasicVersion ==  'Y'){
				if(bMobile){
					if(bodyWidth < 800){ bodyWidth = 800; }
				}
				bodyHeight = 500;
			}
		}getScreenSize();
		
		function adjustSize(){		
			$("#rtLogo").css("width", bodyWidth);
			$("#rtMenu").css("width", bodyWidth);
			//$("#rtFooter").css("width", bodyWidth);
			//$("#tclitewin").css("width", bodyWidth);
			$("#tclitewin").css("height", bodyHeight);
			if(!bTablet){
				//$("#rtTicker").children("table").css("width",bodyWidth-8);
				$("#rtTicker").children("table").css("width","100%");
				$("#idScroller3").parent().css("width",bodyWidth-4);
			}else{
				$("body").addClass("bodyClass");
				window.scrollTo(0,0);
			}
		}
		
		$(function(){
			adjustSize();
			if(bTablet){
				$("#rtFooter").css("display","none");
				$("#trLogo").css("display","none");
			}
<%
			String sPopAnnc = session.getAttribute("DisplayAnnc")!=null?session.getAttribute("DisplayAnnc").toString():"";
			if(sPopAnnc.length()==0) {
				//out.println("alert('1. Cash upfront required for PN17 counters. Kindly call your Dealer Representative. \\n2. 9385-LAYHONG shall be on cash upfront basis with immediate effect. Kindly contact your dealer representative.');");
				session.setAttribute("DisplayAnnc","done");
			}
%>
		});
		
		// $(window).bind("orientationchange resize",function(){
		$(window).on("orientationchange resize", function() {
			//alert("window on resize/orientation change");
			console.log("window on resize/orientation change");
			getScreenSize();
			adjustSize();
		});
		
	function popupWin(){
		$("#popupIFrame").attr("src","/gcUTRADEPlus/web/html/sipbuy.html");
		$("#triggerAnchor")[0].click();
		}
		function closepopup(){
		 $('#fade , .popbox').fadeOut(function() {
        $('#fade, a.close').remove(); //fade them both out
		return false;		
    });
		}
		
		function reloadpopup(){
		document.getElementById('popupIFrame').contentWindow.location.reload();
		}
		
		
	</script>
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr style="display:none">
                        <td align='center' height='20'>
                              <%@ include file='/menu-lite-liferay.jsp'%> 
                        </td>
                </tr>
		<tr>
			<td id="rtTicker" name="rtTicker" align='center'>
				<% 	String sTickerXml= "/ticker/ticker_PH.xml";%>
				<script language="javascript">	
					var indices;
					function createRunningTicker(){
						var sWidth = "", sSpeed = "", sImgUrl = "", sFontSize = "";
				
						sWidth = "<%=iWidth-8%>";
						sSpeed = "1";
						sFontSize = "10px";
						indices = new tickerConnectNew("indices","<%=sTickerXml%>","IndicesSummary",sFontSize,bodyWidth-8,sSpeed,sImgUrl);
						indices.createUI("idContent3", "idScroller3");
						indices.start();	
					}
					if(!bTablet){ //if not tablet, generate running ticker
						createRunningTicker();
					}

				</script>   
			</td>
		</tr>
	</table> 
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td align='center'>
				<script type='text/javascript'>
					//document.write('<iframe scrolling="no" id="tclitewin" src="../tcplus/main.jsp?lang=<%=m_sLangs%>&basic=<%=isBasicVer%>&ts='+new Date().getTime()+'" width="'+bodyWidth+'px" height="'+bodyHeight+'" style="border:none;" frameborder="0"></iframe>');
					document.write('<iframe scrolling="no" id="tclitewin" src="../tcplus/main.jsp?lang=<%=m_sLangs%>&basic=<%=isBasicVer%>&ts='+new Date().getTime()+'" width="100%" height="'+bodyHeight+'" style="border:none;" frameborder="0"></iframe>');
				</script>
			</td>
		</tr>
	</table>
	<script language='JavaScript'>
		function A_OnClick(vsLinkURL, vsParam){
			if (vsParam == '') {
				vsParam = "top=0,left=100,width=800,height=520,scrollbars=yes"
			}
			OpenLinkWindow(vsLinkURL, "WinNews", vsParam);
		}
		
		function backToMain() {
			parent.location.href="<%=oN2NSession.getSetting("HTMLRootSecure")+g_sPath%>/cliLogout.jsp";
		}
	</script>
</body>
<%
}catch (Exception ex) {
	ex.printStackTrace();
//	response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
	out.println("<script language='javascript'>");
	out.println("	alert('" + oN2NSession.getSetting("InvalidSession.MultipleLogin.EN") + "');");
	out.println("parent.location.href='" + oN2NSession.getSetting("HTMLRootSecure")+"/"+oN2NSession.getSetting("projectFolder")+"/loginATPPush?action=logout&frmpath=lite&frm=rt" + "';");
	out.println("</script>");
	oN2NSession.setLogoutStatus(1);
}
} else {
	// CommonUtil.logAPAgent("index.jsp", getClientIP(request), request.getSession().getId(), String.valueOf(request.getSession().getAttribute("loginid")), String.valueOf(request.getSession().getAttribute("clicode")), String.valueOf(request.getSession().getAttribute("userPram")), String.valueOf(request.getSession().getAttribute("uuid")));
	System.out.println("[index.jsp] validSession:"+validSession+"|"+"userPram:"+session.getAttribute("userPram")+"|LoginId:"+g_sLoginId+"|loginid:"+session.getAttribute("loginid"));
	out.println("<script language='javascript'>");
	out.println("	alert('" + oN2NSession.getSetting("InvalidSession.MultipleLogin.EN") + "');");
	out.println("parent.location.href='" + oN2NSession.getSetting("HTMLRootSecure")+"/"+oN2NSession.getSetting("projectFolder")+"/loginATPPush?action=logout&frmpath=lite&frm=rt" + "';");
	out.println("</script>");
	oN2NSession.setLogoutStatus(1);
}
%>
