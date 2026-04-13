<%@ page import = "java.text.SimpleDateFormat,java.util.Vector, java.util.Calendar, com.n2n.util.StringTokenizerEx" %>
<%@ page import = "com.spp.util.security.Decrypt,com.n2n.DB.N2NDateFunc" %>
<%@ include file= "common.jsp"%>
<link rel="stylesheet" type="text/css" href="<%=g_sStylePath%>/autosuggest.css"/>
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">
<script language=JavaScript src="<%=g_sJSPath%>/LinkFunc.js"></script>
<link rel=stylesheet type=text/css href=<%=g_sStylePath%>/default.css>
<%
	final String m_sTAB = "";
	final int m_iNEWS_CHAR = 50;
	final int m_iRSH_CHAR = 45;
	String sStoryDate	= "";
	String sTitle		= "";
	String sNewsDate	= "";
	String sNewsHdr		= "";
	String sHtmlName	= "";
	String folderName	= "Announcement";
	String sKiosk		= request.getParameter("Kiosk");
	Vector vMarketCommNews = new Vector();

	java.sql.ResultSet rs = null;
	sKiosk = sKiosk != null ? sKiosk : "";
%>
	<table cellspacing=0 cellapdding=0 border=0 width='500px'>
		<tr>
			<td align='left' width='2%'>&nbsp;</td>
			<td align='left' colspan='5' class='clsGrayNewsFont'><b><u>TEAM RANKING</u></b></td>
			<td align='right' width='2%'>&nbsp;</td>
		</tr>
		<tr>
			<td align='left' width='2%'>&nbsp;</td>
			<td align='left' colspan='5' class='clsGrayNewsFont'>&nbsp;</td>
			<td align='right' width='2%'>&nbsp;</td>
		</tr>
		<tr valign='top'>
			<td align='left' width='2%'>&nbsp;</td>
			<td width='4%' align='left' class='clsGrayNewsFont'><b>Rank</b></td>
			<td width='8%' align='left' class='clsGrayNewsFont'><b>Team</b></td>
			<td width='10%' align='left' class='clsGrayNewsFont'><b>Cash Amount</b></td>
			<td width='12%' align='center' class='clsGrayNewsFont'><b>Total Matched Trades</b></td>
			<td width='10%' align='right' class='clsGrayNewsFont'><b>Total</b></td>
			<td align='right' width='2%'>&nbsp;</td>
		</tr>
<%
		out.println(m_sTAB + "<tr><td width='2%'></td><td colspan='5' style=\"background: url('"+g_sImgPath+"/Home/Hol_Dotedline.gif') repeat-x;\"><td width='2%'></td></tr>");
			try{
				String InputLine = "", ID="", Lang="", HistIDList="", StkCode="", Source="", Cat="", Reg="", SvrDt="", StkName ="";
				boolean sDetectCount = false, sDetectData = false;
				int i = 0;
				String m_sSourceURL = "http://localhost:8080/gcCIMB/ref/ranking.txt";
				out.flush();
				//stk.init(oN2NSession);
				java.net.URL sURL = new java.net.URL(m_sSourceURL);
				java.net.URLConnection sCon = sURL.openConnection();
				sCon.setUseCaches(false);
				java.io.File file_name = new java.io.File("D:\\Tomcat 6.0\\webapps\\gcCIMB\\ref\\ranking.txt");
				java.io.FileReader file_read = new java.io.FileReader(file_name);
				java.io.BufferedReader bfResult = new java.io.BufferedReader(file_read);
				//java.io.BufferedReader bfResult = new java.io.BufferedReader(new java.io.InputStreamReader(sCon.getInputStream()));
				out.flush();
				while (((InputLine = bfResult.readLine()) != null)) {
					InputLine = InputLine.trim();
					//out.println(InputLine);
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
								StringTokenizerEx tokenEx = new StringTokenizerEx(InputLine, "|");

								ID = tokenEx.nextToken();
								Lang = tokenEx.nextToken();
								HistIDList = tokenEx.nextToken();
								sNewsDate = tokenEx.nextToken();
								/*
								sNewsHdr = tokenEx.nextToken();
								StkCode = tokenEx.nextToken();
								Source = tokenEx.nextToken();
								Cat = tokenEx.nextToken();
								Reg = tokenEx.nextToken();
								SvrDt = tokenEx.nextToken();
								StkName = tokenEx.nextToken();
								*/

								if (Lang.length()>0) {
									i++;

									if (i>1) {
										out.println(m_sTAB + "<tr><td width='2%'></td><td colspan='5' style=\"background: url('"+g_sImgPath+"/Home/Hol_Dotedline.gif') repeat-x;\"><td width='2%'></td></tr>");
									}
									//sNewsDate	= N2NDateFunc.formatDateTime(sNewsDate,"yyyy-MM-dd hh:mm:ss","dd MMM yy");
									//sNewsHdr	= sNewsHdr.trim();
									//if (sNewsHdr.length() > m_iNEWS_CHAR) {
									//	sNewsHdr = sNewsHdr.substring(0,m_iNEWS_CHAR) + ".....";
									//}
									//if (StkName.trim().length() == 0)
									//	StkName = "GENERAL NEWS";

									//sHtmlName	= oN2NSession.getSetting("NewsDetailUrl") + ID.trim() + "EN";
									out.print(m_sTAB + "<tr height='15' valign='top'>");
									out.println("<td align='left' width='2%'>&nbsp;</td>");
									out.println("<td width='4%' align='left' class='clsGrayNewsFont'>" + i + "</td>");
									out.println("<td width='8%' align='left' class='clsGrayNewsFont'>" + ID + "</td>");
									out.println("<td width='10%' align='left' class='clsGrayNewsFont'>" + Lang + "</td>");
									out.println("<td width='12%' align='center' class='clsGrayNewsFont'>" + HistIDList + "</td>");
									out.println("<td width='10%' align='right' class='clsGrayNewsFont'>" + sNewsDate + "</td>");
									out.println("<td align='right' width='2%'>&nbsp;</td></tr>");
							}//end if Data not null
						}//end if (DetectData)
					}//end else
					out.flush();
				}//end if
			}//end while
		}
		catch (Exception ex){
			System.out.println("main.jsp NEWS Exception :: " + ex.getMessage());
			ex.printStackTrace();
		}

%>
	<!--
	<tr>
		<td align='left' width='2%' style="background: url('<%=g_sImgPath%>/<%=folderName%>/maintable_left.gif') repeat-y;"></td>
		<td colspan='5' align='left'>&nbsp;</td>
		<td align='right' width='2%' style="background: url('<%=g_sImgPath%>/<%=folderName%>/maintable_right.gif') repeat-y;">&nbsp;</td>
	</tr>
	-->
	<tr>
		<td align='right' width='2%'>&nbsp;</td>
		<td colspan='5' align='right'>&nbsp;&nbsp;&nbsp;&nbsp;</td>
		<td align='right' width='2%'>&nbsp;</td>
	</tr>
	<tr>
		<td align='left' width='2%'></td>
		<td colspan='5'>&nbsp;</td>
		<td align='right' width='2%'>&nbsp;</td>
	</tr>
	</table>
</body>
</html>