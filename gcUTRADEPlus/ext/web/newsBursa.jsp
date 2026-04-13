<%@ page import = "java.text.SimpleDateFormat,java.util.Vector, java.util.Calendar, java.util.StringTokenizer" %>
<%@ page import = "com.spp.util.security.Decrypt,com.n2n.DB.N2NDateFunc" %>
<%@ include file= "/common.jsp"%>
<jsp:useBean id="research" class="com.n2n.DB.N2NMFResearch" scope="page"/>
<jsp:useBean id="researchbean" class="com.n2n.bean.N2NMFResearchBean" scope="page"/>
<%@ include file='/util/banner.jsp'%>
<%
	setCommonPath(g_sPath, g_sImgPath, g_sJSPath, g_sStylePath, g_sWebPath, oN2NSession.getSetting("HTMLRoot"),out);
	genBannerTitle(oN2NSession.getSetting("WebSiteName"));
%>
<link rel="stylesheet" type="text/css" href="<%=g_sStylePath%>/autosuggest.css"/> 
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">
<script language=JavaScript src="<%=g_sJSPath%>/LinkFunc.js"></script>
	<META content='-1' http-equiv='Expires'>
	<META content='no-cache' http-equiv='Pragma'>
	<META content='no-cache' http-equiv='Cache-Control'>
	<link rel=stylesheet type=text/css href=<%=g_sStylePath%>/default.css>
	<script language='JavaScript'>
	function A_OnClick(vsLinkURL, vsParam){
		if (vsParam == '')
			vsParam = 'top=0,left=100,width=800,height=520,scrollbars=yes'
			OpenLinkWindow(vsLinkURL, 'WinNewsCIMBS', vsParam);
	}
	</script>
	<style>
	a.maroon:link {
		color:#0099CC;
		font-family:Arial,Helvetica,sans-serif;
		font-size:11px;
		font-weight:normal;
		text-decoration:none;
}
	</style>
<%
	final String m_sTAB = "";
	final int m_iNEWS_CHAR = 50;
	final int m_iRSH_CHAR = 45;
	String sStoryDate	= "";
	String sTitle		= "";
	String sNewsDate	= "";
	String sNewsHdr		= "";
	String sHtmlName	= "";
	String sKiosk		= request.getParameter("Kiosk");
	Vector vMarketCommNews = new Vector();

	java.sql.ResultSet rs = null;
	sKiosk = sKiosk != null ? sKiosk : "";
%>
	<!--  <table cellspacing=0 cellapdding=0 border=0 width="240">
	<col width="10">
	<col />
	<col width="10">
		<tr>
		  <td style="background: url('<%=g_sImgPath%>/Home/box_tl.gif') no-repeat;"></td>
		  <td style="background: url('<%=g_sImgPath%>/Home/box_tbg.gif') repeat-x;">&nbsp;</td>
		  <td style="background: url('<%=g_sImgPath%>/Home/box_tr.gif') no-repeat;"></td>
		</tr>	
		<tr>
			<td style="background: url('<%=g_sImgPath%>/Home/box_lbg.gif') repeat-y;"></td>
			<td class="clsGrayTimeFont"><%=new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date())%>&nbsp;
				<span style="background: #0000FF;padding:5px"><font color="white">Bursa Announcement</font></span></td>
			<td style="background: url('<%=g_sImgPath%>/Home/box_rbg.gif') repeat-y;">&nbsp;</td>
		</tr>
		<tr>
			<td style="background: url('<%=g_sImgPath%>/Home/box_lbg.gif') repeat-y;">&nbsp;</td>		
			<td style="background: url('<%=g_sImgPath%>/Home/box_bbg.gif') repeat-x;">&nbsp;</td>
			<td style="background: url('<%=g_sImgPath%>/Home/box_rbg.gif') repeat-y;">&nbsp;</td>			
		</tr>-->		
<%
try{
	String InputLine = "", ID="", Lang="", HistIDList="", StkCode="", Source="", Cat="", Reg="", SvrDt="", StkName ="";
	boolean sDetectCount = false, sDetectData = false;
	int i = 0;
	String m_sSourceURL = "http://secure.itradecimb.com.my/ref/mainpagenews.txt";
	String sLinkWindow = "";
	SimpleDateFormat N2NTime = new SimpleDateFormat("hh:mm");
	out.flush();
	//stk.init(oN2NSession);
	java.net.URL sURL = new java.net.URL(m_sSourceURL);
	java.net.URLConnection sCon = sURL.openConnection();
	sCon.setUseCaches(false);
	java.io.BufferedReader bfResult = new java.io.BufferedReader(new java.io.InputStreamReader(sCon.getInputStream()));
//	System.out.println("m_sSourceURL:" + m_sSourceURL);
	out.flush();
	while (((InputLine = bfResult.readLine()) != null)) {
		InputLine = InputLine.trim();
		out.flush();
		if (InputLine.length() > 0){
			if (InputLine.indexOf("--_BeginData_") != -1) {
				sDetectData = true;
				continue;
			}
			else if (InputLine.indexOf("--_EndData_") != -1) {
				sDetectData = false;
				continue;
			}
			else {
				if(sDetectData) {
					//out.println("m_sInputLine:" + InputLine);
					StringTokenizer tokenEx = new StringTokenizer(InputLine, "|");
					ID = tokenEx.nextToken();
					Lang = tokenEx.nextToken();
					HistIDList = tokenEx.nextToken();
					sNewsDate = tokenEx.nextToken();
					sNewsHdr = tokenEx.nextToken();
					StkCode = tokenEx.nextToken();
					Source = tokenEx.nextToken();
					//Cat = tokenEx.nextToken();
					//Reg = tokenEx.nextToken();
					//SvrDt = tokenEx.nextToken();
					StkName = tokenEx.nextToken();
				
					if (Lang.length()>0) {
						i++;
						
						if (i>1) {
							/*out.println(m_sTAB + "<tr>"+
							"<td style=\"background: url('"+g_sImgPath+"/Home/box_lbg.gif') repeat-y;\">&nbsp;</td>"+		
							"<td style=\"background: url('"+g_sImgPath+"/Home/Hol_Dotedline.gif') repeat-x;\"></td>"+
							"<td style=\"background: url('"+g_sImgPath+"/Home/box_rbg.gif') repeat-y;\">&nbsp;</td></tr>");*/
						}
						sNewsDate	= N2NDateFunc.formatDateTime(sNewsDate,"yyyy-MM-dd hh:mm:ss.S","hh:mm");
						sNewsHdr	= sNewsHdr.trim().substring(0,1).toUpperCase() + sNewsHdr.trim().substring(1,sNewsHdr.length()).toLowerCase(); 
						
						if (sNewsHdr.length() > m_iNEWS_CHAR) {
							sNewsHdr = sNewsHdr.substring(0,m_iNEWS_CHAR) + ".....";
						}
						if (StkName.trim().length() == 0)
							StkName = "GENERAL NEWS";
							
						sHtmlName	= oN2NSession.getSetting("NewsDetailUrl") + ID.trim() + "EN";
						sLinkWindow = "<a style='font-family:Arial,Helvetica,sans-serif;cursor:pointer' href=\"javascript:A_OnClick('" + sHtmlName + "','')\" class='maroon'>";
						/*out.print(m_sTAB + "<tr valign='top'>");
						out.println("<td style=\"background: url('"+g_sImgPath+"/Home/box_lbg.gif') repeat-y;\">&nbsp;</td>");
						out.println("<td class='clsGrayNewsFont'><table border='0' width='100%'><tr>");
						out.println("<td width='25%' class='clsGrayTimeFont' align='left'>" + sNewsDate + "</td>");
						out.println("<td width='60%' class='clsGrayNewsFont'>");
						out.println("<b>" + Cat + "<b/></td></tr></table></td>");
						out.println("<td style=\"background: url('"+g_sImgPath+"/Home/box_rbg.gif') repeat-y;\">&nbsp;</td></tr>");
						out.print(m_sTAB + "<tr valign='top'>");
						out.println("<td style=\"background: url('"+g_sImgPath+"/Home/box_lbg.gif') repeat-y;\">&nbsp;</td>");
						out.println("<td><a class='MainPageNews' href=\"javascript:OpenLinkWindow('researchDisplay.jsp?docLink=" + sHtmlName + "','KLSENews','')\">&nbsp;" + sNewsHdr + "</a></td>");
						out.println("<td style=\"background: url('"+g_sImgPath+"/Home/box_rbg.gif') repeat-y;\">&nbsp;</td></tr>");*/
						
						out.println("<table border=0 cellspacing=0 cellpadding=0 bgcolor=#ffffff>");
						out.println("<tr height='24'>");
						out.println("<td width='12'><img src='"+g_sImgPath+"/Home/icon01.gif'></td>");
						out.println("<td width='100' align=left style='font-size:8pt;font-family:Arial;'>" + StkName + "</td>");				
						out.println("<td width='45' align=left style='font-size:8pt;font-family:Arial;'>" + sNewsDate  + "</td>");
						out.println("<td width='300' align=left>" + sLinkWindow + sNewsHdr + "</a></td>");
						out.println("</tr>");				
						out.println("<tr><td colspan=4 width='100%' height='4' bgcolor=#ffffff></td></tr>");
						out.println("</table>");
						
					}//end if Data not null
				}//end if (DetectData)
			}//end else
			out.flush();
		}//end if
	}//end while
}
catch (Exception ex){
	System.out.println("main.jsp NEWS Exception :: " + ex.getMessage());
//	ex.printStackTrace();
}
%>
	<!--<tr>
		<td style="background: url('<%=g_sImgPath%>/Home/box_lbg.gif') repeat-y;">&nbsp;</td>
		<td align='left'>&nbsp;</td>
		<td style="background: url('<%=g_sImgPath%>/Home/box_rbg.gif') repeat-y;">&nbsp;</td>
	</tr>
	<tr>
		<td style="background: url('<%=g_sImgPath%>/Home/box_lbg.gif') repeat-y;">&nbsp;</td>
		<td align='left'><a href='news.jsp' target="_blank"><img src='<%=g_sImgPath%>/arrow-more.gif' border=0></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
		<td style="background: url('<%=g_sImgPath%>/Home/box_rbg.gif') repeat-y;">&nbsp;</td>
	</tr>
	<tr>
	  <td style="background: url('<%=g_sImgPath%>/Home/box_bl.gif') no-repeat;" width="10">&nbsp;</td>
	  <td style="background: url('<%=g_sImgPath%>/Home/box_bbg.gif') repeat-x;">&nbsp;</td>
	  <td style="background: url('<%=g_sImgPath%>/Home/box_br.gif') no-repeat;" width="15">&nbsp;</td>
	</tr>	
	</table>-->
</body>
</html>