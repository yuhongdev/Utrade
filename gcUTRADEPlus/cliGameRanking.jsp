<%@ page import = "java.text.SimpleDateFormat,java.util.Vector, java.util.Calendar, com.n2n.util.StringTokenizerEx" %>
<%@ page import = "com.spp.util.security.Decrypt,com.n2n.DB.N2NDateFunc" %>
<%@ include file= "common.jsp"%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="<%=g_sStylePath%>/autosuggest.css"/>
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">
<script language=JavaScript src="<%=g_sJSPath%>/LinkFunc.js"></script>
<link rel=stylesheet type=text/css href=<%=g_sStylePath%>/default.css>
<title>Youth Challenge Game Ranking</title>
</head>
<body onload='CatOnChange();'>
<%
        Calendar week1 = Calendar.getInstance();
        Calendar week2 = Calendar.getInstance();
        Calendar week3 = Calendar.getInstance();
        Calendar now = Calendar.getInstance();
        week1.set(2012, Calendar.FEBRUARY, 11, 00, 00, 00);
        week2.set(2012, Calendar.FEBRUARY, 18, 00, 00, 00);
        week3.set(2012, Calendar.FEBRUARY, 25, 00, 00, 00);
        now.set(now.get(Calendar.YEAR), now.get(Calendar.MONTH), now.get(Calendar.DAY_OF_MONTH));
        String curWeek = "0";

        if(now.after(week3)){
                curWeek = "3";
        }else if(now.after(week2)){
                curWeek = "2";
        }else{
                curWeek = "1";
        } 
        
	final String m_sTAB = "";
	final int m_iNEWS_CHAR = 50;
	final int m_iRSH_CHAR = 45;
	String sStoryDate	= "";
	String sTitle		= "";
	String sNewsDate	= "";
	String sNewsHdr		= "";
	String sHtmlName	= "";
	String folderName	= "Announcement";
	String sCat		= request.getParameter("Cat");
	sCat = sCat != null ? sCat : "S";
	String sWeek		= request.getParameter("Week");
	sWeek = sWeek != null ? sWeek : curWeek;

	if(sCat.equalsIgnoreCase("C"))
		sWeek = "0";
	Vector vMarketCommNews = new Vector();

	java.sql.ResultSet rs = null;
%>
	<table cellspacing=0 cellapdding=0 border=0 width='500px'>
		<form id="frmRanking" name="frmRanking" action="cliGameRanking.jsp" method="post">
		<tr>
			<td align='left' width='2%'>&nbsp;</td>
			<td align='left' colspan='4' class='clsGrayNewsFont'><b><u>TEAM RANKING</u></b></td>
			<td align='right' width='2%'>&nbsp;</td>
		</tr>
		<tr>
			<td align='left' width='2%'>&nbsp;</td>
			<td align='left' colspan='2' class='clsGrayNewsFont'>
					Category &nbsp;&nbsp;
			</td>
			<td align='left' colspan='2' class='clsGrayNewsFont'>
				<Select name='Cat' id='Cat' style='HEIGHT:20px;WIDTH:150px' onchange='CatOnChange();'>
					<option value='S' <%=sCat.equalsIgnoreCase("S")?"selected":""%>>School</option>
					<option value='C' <%=sCat.equalsIgnoreCase("C")?"selected":""%>>Clubs & Societies</option>
				</Select>
			</td>
			<td align='right' width='2%'>&nbsp;</td>
		</tr>
		<tr id=oWeekTr <%=sCat.equalsIgnoreCase("C")?"style='display:none'":""%>>
			<td align='left' width='2%'>&nbsp;</td>
			<td align='left' colspan='2' class='clsGrayNewsFont'>
					Week &nbsp;&nbsp;
			</td>
			<td align='left' colspan='2' class='clsGrayNewsFont'>
				<Select name='Week' id='Week' style='HEIGHT:20px;WIDTH:100px'>
					<option value='0' <%=sWeek.equalsIgnoreCase("0")?"selected":""%>>Overall</option>
					<%if(Integer.parseInt(curWeek)>=1){%>
                                        	<option value='1' <%=sWeek.equalsIgnoreCase("1")?"selected":""%>>1</option>
					<%}if(Integer.parseInt(curWeek)>=2){%>
                                        	<option value='2' <%=sWeek.equalsIgnoreCase("2")?"selected":""%>>2</option>
					<%}if(Integer.parseInt(curWeek)>=3){%>
						<option value='3' <%=sWeek.equalsIgnoreCase("3")?"selected":""%>>3</option>
					<%}%>
				</Select>
			</td>
			<td align='right' width='2%'>&nbsp;</td>
		</tr>
		<tr>
			<td align='left' width='2%'>&nbsp;</td>
			<td align='left' colspan='2' class='clsGrayNewsFont'>&nbsp;</td>
			<td align='left' colspan='2' class='clsGrayNewsFont'>
				<input type=submit name=btnSubmit style="width:80px; CURSOR: hand;" title="View" value=View>
			</td>
			<td align='right' width='2%'>&nbsp;</td>
		</tr>
		</form>
		<tr>
			<td align='left' width='2%'>&nbsp;</td>
			<td align='left' colspan='4' class='clsGrayNewsFont'>&nbsp;</td>
			<td align='right' width='2%'>&nbsp;</td>
		</tr>
		<tr>
			<td align='left' width='2%'>&nbsp;</td>
			<td align='left' colspan='4' class='clsGrayNewsFont'>&nbsp;</td>
			<td align='right' width='2%'>&nbsp;</td>
		</tr>
		<tr valign='top'>
			<td align='left' width='2%'>&nbsp;</td>
			<td width='8%' align='left' class='clsGrayNewsFont'><b>Rank</b></td>
			<td width='12%' align='left' class='clsGrayNewsFont'><b>University</b></td>
			<td width='38%' align='left' class='clsGrayNewsFont'><b>Team</b></td>
			<!--<td width='12%' align='right' class='clsGrayNewsFont'><b>Open Balance</b></td>-->
			<!--<td width='16%' align='right' class='clsGrayNewsFont'><b>Total</b></td>-->
			<td width='38%' align='right' class='clsGrayNewsFont'><b>Total Net Realized Value(%)</b></td>
			<td align='right' width='2%'>&nbsp;</td>
		</tr>
<%
		out.println(m_sTAB + "<tr><td width='2%'></td><td colspan='4' style=\"background: url('"+g_sImgPath+"/Home/Hol_Dotedline.gif') repeat-x;\"><td width='2%'></td></tr>");
			try{
				String InputLine = "", ID="", Lang="", HistIDList="", StkCode="", Source="", Cat="", Reg="", SvrDt="", StkName ="";
				boolean sDetectCount = false, sDetectData = false;
				int i = 0;
                                int limitNumRec = 50;
				java.io.File file_name = null;
				if(sCat.equalsIgnoreCase("S")) {
					file_name = new java.io.File("D:\\Tomcat7.0\\webapps\\gcCIMB\\ref\\ranking"+sCat+sWeek+".txt");
				} else {
					file_name = new java.io.File("D:\\Tomcat7.0\\webapps\\gcCIMB\\ref\\ranking"+sCat+".txt");
				}

				java.io.FileReader file_read = new java.io.FileReader(file_name);
				java.io.BufferedReader bfResult = new java.io.BufferedReader(file_read);
				out.flush();
				while (((InputLine = bfResult.readLine()) != null)) {
                                        if(i==limitNumRec){break;}
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
								StringTokenizerEx tokenEx = new StringTokenizerEx(InputLine, "|");

								ID = tokenEx.nextToken();
								sNewsHdr = tokenEx.nextToken();
								StkCode = tokenEx.nextToken();
								Lang = tokenEx.nextToken();
								HistIDList = tokenEx.nextToken();
								sNewsDate = tokenEx.nextToken();


								if (Lang.length()>0) {
									if(sWeek.equalsIgnoreCase("0")) {
										if(i==20)
											break;
									} else {
										if(i==10)
											break;
									}

									i++;

									if (i>1) {
										out.println(m_sTAB + "<tr><td width='2%'></td><td colspan='4' style=\"background: url('"+g_sImgPath+"/Home/Hol_Dotedline.gif') repeat-x;\"><td width='2%'></td></tr>");
									}

									out.print(m_sTAB + "<tr height='15' valign='top'>");
									out.println("<td align='left' width='2%'>&nbsp;</td>");
									out.println("<td width='8%' align='left' class='clsGrayNewsFont'>" + i + "</td>");
									out.println("<td width='12%' align='left' class='clsGrayNewsFont'>" + ID + "</td>");
									out.println("<td width='38%' align='left' class='clsGrayNewsFont'>" + sNewsHdr + "</td>");
									//out.println("<td width='12%' align='right' class='clsGrayNewsFont'>" + StkCode + "</td>");
									//out.println("<td width='16%' align='right' class='clsGrayNewsFont'>" + Lang + "</td>");
									out.println("<td width='38%' align='right' class='clsGrayNewsFont'>" + HistIDList + "</td>");
									out.println("<td align='right' width='2%'>&nbsp;</td></tr>");
							}//end if Data not null
						}//end if (DetectData)
					}//end else
					out.flush();
				}//end if
			}//end while
		}
		catch (Exception ex){
%>
	<tr>
		<td align='right' width='2%'>&nbsp;</td>
		<td colspan='4' align='center'><b>No ranking available</b></td>
		<td align='right' width='2%'>&nbsp;</td>
	</tr>
<%
		}

%>
	<tr>
		<td align='right' width='2%'>&nbsp;</td>
		<td colspan='4' align='right'>&nbsp;&nbsp;&nbsp;&nbsp;</td>
		<td align='right' width='2%'>&nbsp;</td>
	</tr>
	<tr>
		<td align='left' width='2%'></td>
		<td colspan='4'>&nbsp;</td>
		<td align='right' width='2%'>&nbsp;</td>
	</tr>
	</table>
</body>
<script>
function CatOnChange() {
var sCat = document.getElementById("Cat").value;
if(sCat=='C')
	document.getElementById("oWeekTr").style.display='none';
if(sCat=='S')
	document.getElementById("oWeekTr").style.display='block';
}
</script>
</html>
