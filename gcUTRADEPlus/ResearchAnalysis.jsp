<%@ page import = "java.text.SimpleDateFormat,java.util.Vector, java.util.Calendar, java.util.StringTokenizer" %>
<%@ page import = "com.spp.util.security.Decrypt,com.n2n.DB.N2NDateFunc" %>
<%@ include file= "common.jsp"%>
<jsp:useBean id="research" class="com.n2n.DB.N2NMFResearch" scope="page"/>
<jsp:useBean id="researchbean" class="com.n2n.bean.N2NMFResearchBean" scope="page"/>
<%@ include file='util/banner.jsp'%>
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
<%
//	final String m_sTAB = "						";
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
	<table cellspacing=0 cellapdding=0 border=0 width="200">
	<tr>
		<td colspan='3'>
		<table cellspacing=0 cellapdding=0 border=0 width="265">
			<tr>
			  <td style="background: url('<%=g_sImgPath%>/Home/box_tl.gif') no-repeat;"></td>
			  <td style="background: url('<%=g_sImgPath%>/Home/box_tbg.gif') repeat-x;">&nbsp;</td>
			  <td style="background: url('<%=g_sImgPath%>/Home/box_tr.gif') no-repeat;"></td>
			</tr>	
			<tr>
				<td style="background: url('<%=g_sImgPath%>/Home/box_lbg.gif') repeat-y;"></td>
				<td class="clsGrayTimeFont"><%=new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date())%>&nbsp;
					<span style="background: #0000FF;padding:5px"><font color="white">Research Analysis</font></span></td>
				<td style="background: url('<%=g_sImgPath%>/Home/box_rbg.gif') repeat-y;">&nbsp;</td>
			</tr>
			<tr>
				<td style="background: url('<%=g_sImgPath%>/Home/box_lbg.gif') repeat-y;">&nbsp;</td>		
				<td style="background: url('<%=g_sImgPath%>/Home/box_bbg.gif') repeat-x;">&nbsp;</td>
				<td style="background: url('<%=g_sImgPath%>/Home/box_rbg.gif') repeat-y;">&nbsp;</td>			
			</tr>		

<%
			String sDate = "", sCat = "", sGroup = "", sSection = "", sLink = "", sMainTitle = "", sDesc = "", sShowText = "";
			String sFromDate = "", sToDate = "";
			int iNumRec = 0;
			SimpleDateFormat dateFormatResearch = new SimpleDateFormat("dd MMM yy");
			
			try{
				research.init(oN2NSession);
				researchbean.setOption("C");
				rs = research.getResearchInfo(researchbean);
				String sLinkDoc = "";
				if (rs != null) {
					while (rs.next()) {
						sCat = rs.getString("Description").toUpperCase();
						sMainTitle = rs.getString("MainTitle").toUpperCase();
						sDesc = rs.getString("NewsDesc").toUpperCase();
						sLinkDoc = rs.getString("LinkDoc");
						sLink = oN2NSession.getSetting("UploadPath") + sLinkDoc ;
						sGroup  = rs.getString("Category");
						//sDate = rs.getString("LastUpdateDate");
						sSection = rs.getString("NewsCat");
						sDate = (String) dateFormatResearch.format(rs.getDate("EffectiveDt"));
						sShowText = sMainTitle + " - " + sDesc;
						if (sShowText.length() > m_iRSH_CHAR) {
							sShowText = sShowText.substring(0,m_iRSH_CHAR) + ".....";
						}
						iNumRec ++;
						if (iNumRec > 1) {
							out.println(m_sTAB + "<tr>"+
									"<td style=\"background: url('"+g_sImgPath+"/Home/box_lbg.gif') repeat-y;\">&nbsp;</td>"+		
									"<td style=\"background: url('"+g_sImgPath+"/Home/Hol_Dotedline.gif') repeat-x;\"></td>"+
									"<td style=\"background: url('"+g_sImgPath+"/Home/box_rbg.gif') repeat-y;\">&nbsp;</td></tr>");
						}
						out.print(m_sTAB + "<tr valign='top'>");
						out.println("<td style=\"background: url('"+g_sImgPath+"/Home/box_lbg.gif') repeat-y;\">&nbsp;</td>");
						out.println("<td class='clsGrayNewsFont'><table border='0' width='100%'><tr>");
						out.println("<td width='25%' class='clsGrayTimeFont' align='left'>" + sDate + "</td>");
						out.println("<td width='60%' class='clsGrayNewsFont'>");
						out.println("<b>" + sCat + "<b/></td></tr></table></td>");
						out.println("<td style=\"background: url('"+g_sImgPath+"/Home/box_rbg.gif') repeat-y;\">&nbsp;</td></tr>");
						out.print(m_sTAB + "<tr valign='top'>");
						out.println("<td style=\"background: url('"+g_sImgPath+"/Home/box_lbg.gif') repeat-y;\">&nbsp;</td>");
						if (sLinkDoc.trim().length() > 0) {
							out.println("<td><a class='MainPageNews' href=\"javascript:OpenLinkWindow('researchDisplay.jsp?docLink=" + sLink + "\",\"KLSENews\",\"\")' class='MainPageNews'>&nbsp;" + sShowText + "</a></td>");
						} else {
							out.println("<td>&nbsp;</td>");
						}
						out.println("<td style=\"background: url('"+g_sImgPath+"/Home/box_rbg.gif') repeat-y;\">&nbsp;</td></tr>");
			        }
			        rs.close();
				}
				research.closeResultset();
				research.dbDisconnect();
			}
			catch (Exception ex){
				System.out.println("main.jsp RESEARCH Exception :: " + ex.getMessage());
				ex.printStackTrace();
			}
%>

			</table>
		</td>
	</tr>
	<tr>
		<td style="background: url('<%=g_sImgPath%>/Home/box_lbg.gif') repeat-y;">&nbsp;</td>
		<td align='left'>&nbsp;</td>
		<td style="background: url('<%=g_sImgPath%>/Home/box_rbg.gif') repeat-y;">&nbsp;</td>
	</tr>
	<tr>
		<td style="background: url('<%=g_sImgPath%>/Home/box_lbg.gif') repeat-y;">&nbsp;</td>
		<td align='left'><a href='<%=g_sPath%>/researchArchive.jsp'><img src='<%=g_sImgPath%>/arrow-more.gif' border=0></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
		<td style="background: url('<%=g_sImgPath%>/Home/box_rbg.gif') repeat-y;">&nbsp;</td>
	</tr>
	<tr>
	  <td style="background: url('<%=g_sImgPath%>/Home/box_bl.gif') no-repeat;" width="10">&nbsp;</td>
	  <td style="background: url('<%=g_sImgPath%>/Home/box_bbg.gif') repeat-x;">&nbsp;</td>
	  <td style="background: url('<%=g_sImgPath%>/Home/box_br.gif') no-repeat;" width="15">&nbsp;</td>
	</tr>	
	</table>
</body>
</html>