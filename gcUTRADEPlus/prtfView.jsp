



























































<%@ page import = "java.sql.ResultSet,java.net.*,java.io.*" %>
<%@ include file='common.jsp'%>
<%@include file="/util/sessionCheck.jsp"%>

<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<jsp:useBean id="N2NConst" class="com.n2n.util.N2NConst" scope="page"/>
<script language=JavaScript src=<%=g_sJSPath%>/N2NCtrl.js></script>
<script language=JavaScript src=<%=g_sJSPath%>/LinkFunc.js></script>
<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
<%
String strCliCode="";
int intPrtfID=0;
int intViewID=0;
int intMode=0;		//'1 Add New, 2 Update, 3 Delete
String strViewName="";
String strViewString="";
java.sql.ResultSet oRst=null;
String strSQL="";
int intCtrI=0;
String sFeatureAPPriceCost = oN2NSession.getSetting("AppFeatureAPPriceCost");
boolean FeatureAPPriceCost = true;
if (sFeatureAPPriceCost == null) {
	FeatureAPPriceCost = false;
}

//if (oN2NSession.getIsUserLogin()) {
if (validSession) {
	//call OpenN2NConnection()
	strCliCode=g_sCliCode;
	intViewID=1;
	String strPrtfID= request.getParameter("intPrtfID");
	if (strPrtfID == null) {
		intPrtfID=1;
	}
	intCtrI = 1;
	cli.init(oN2NSession);
	oRst = cli.getMFCliPrtfView(strCliCode, ""+intPrtfID, intViewID);
	
	if (oRst != null && oRst.next()) {
		intMode = 2;	//'Update
		strViewName=oRst.getString("ViewName");
		strViewString=oRst.getString("ViewColStr");
		
	} else {
		intMode = 1;	//'Add New
	}
	oRst.close();
	oRst = null;
	cli.closeResultset();
	cli.dbDisconnect();

//strSQL = "sp_mfGetCliPrtfView '" & strCliCode & "'," & intPrtfID & "," & intViewID
%>
<%!
private String SetRowNumber(int intRow) {
	if (intRow<10) {
		return "0"+intRow+".";
	} else {
		return ""+intRow+".";
	}
}
%>
<html>
<head>
<title><%=oN2NSession.getSetting("WebSiteName")%> - Portfolio View Setting</title>
</head>
<body onload='body_OnLoad()'>
<table border=0 cellpadding=0 cellspacing=0 width=430>
<tr>
	<td class=clsSectionHeader width='97%'>&nbsp;View Setting</td>
	<td width='3%'>
		<img id=imgHelp border=0 width=20 height=19 src=<%=g_sImgPath%>/lightbulboff.jpg onmouseover="this.src='<%=g_sImgPath%>/lightbulbon.jpg'" onmouseout="this.src='<%=g_sImgPath%>/lightbulboff.jpg'" title="Summary: Maintain your portfolio view setting.">
	</td>
</tr>
</table>
<br>
<table border=1 cellpadding=0 cellspacing=0 width=430>
<tr>
	<td>
	<table border=0 cellpadding=0 cellspacing=0 width='100%'>
	<tr>
		<td width='60%'>
		<table border=0 cellpadding=0 cellspacing=6 class=tblPrtfView width='100%'>
		<tr>
			<td colspan=2 style='font-size:0.5mm'>&nbsp;</td>
		</tr>
		<tr>
			<td width="30%" align=right><b><%=SetRowNumber(intCtrI)%></b></td>
			<td><select style="width:184" size="1" name="ddColumn<%=intCtrI%>">
				<option  value=<%=N2NConst.PRTF_VIEWCOL_STKCODENAME%>>Stock Code/Name</option>
			</td>
		</tr>
		<% for (intCtrI=2; intCtrI<=N2NConst.MAX_VIEW_COL-2; intCtrI++) { %>
			<% if(intCtrI != 6) { %>
		<tr>
			<td align=right><B><%=SetRowNumber(intCtrI)%></B></td>
			<td>
			<select style="width:184" size="1" name="ddColumn<%=intCtrI%>" onChange="onChangeColumn(<%=intCtrI%>)">
			<option value=<%=N2NConst.PRTF_VIEWCOL_FREE%>>--- Performance Info ---</option>
			<option value=<%=N2NConst.PRTF_VIEWCOL_REFLASTP%>>Ref Price/Current Price</option>
			<option value=<%=N2NConst.PRTF_VIEWCOL_DAYHL%>>Day High/Low</option>
			<option value=<%=N2NConst.PRTF_VIEWCOL_YEARHL%>>Year High/Low</option>
			<option value=<%=N2NConst.PRTF_VIEWCOL_PCHANGE%>>Change ($/%)</option>
			<option value=<%=N2NConst.PRTF_VIEWCOL_VOLLOTSIZE%>>Volume / Lot Size</option>
			<option value=<%=N2NConst.PRTF_VIEWCOL_FREE%>>--- Holdings Info ---</option>
			<option value=<%=N2NConst.PRTF_VIEWCOL_QTYONHAND%>>Qty on Hand</option>
			<option value=<%=N2NConst.PRTF_VIEWCOL_QTYSOLD%>>Qty Sold</option>
			<option value=<%=N2NConst.PRTF_VIEWCOL_TOTCOMM%>>Brokerage</option>
			<%if (FeatureAPPriceCost) {
				out.println("<option value="+ N2NConst.PRTF_VIEWCOL_AVEPPRICE +">Avg Purchase Price</option>");
			}
			%>		
			<option value=<%=N2NConst.PRTF_VIEWCOL_AVEBPRICE%>>Avg Buy Price</option>
			<option value=<%=N2NConst.PRTF_VIEWCOL_AVESPRICE%>>Avg Sell Price</option>
			<option value=<%=N2NConst.PRTF_VIEWCOL_PRTFPERC%>>Portfolio (%)</option>
			<option value=<%=N2NConst.PRTF_VIEWCOL_LIMIT%>>Upper/Lower Limit</option>
			<option value=<%=N2NConst.PRTF_VIEWCOL_BREAKEVENP%>>Breakeven Price</option>
			</select>
			</td>
		</tr>
			<% } else { %>
		<tr>
			<td align=right><b><%if (intCtrI < 10) {out.print("0"+intCtrI);} else {out.print(intCtrI);}%>.</b></td>
			<td><select style="width:184" size="1" name="ddColumn<%=intCtrI%>">
				<!--option  value=<%=N2NConst.PRTF_VIEWCOL_QTYAVAIL%>>Qty Available</option-->
				<option  value=<%=N2NConst.PRTF_VIEWCOL_QTYONHAND%>>Qty on Hand</option>
			</td>
		</tr>
			<% } %>
		<% } %>			
		
		<tr><%intCtrI=N2NConst.MAX_VIEW_COL-1;%>
			<td align=right><b><%=SetRowNumber(intCtrI)%></b></td>
			<td>
			<select style="width:184" size="1" name="ddColumn<%=intCtrI%>">
			<option  value=<%=N2NConst.PRTF_VIEWCOL_GROSSMKTVAL%>>Gross Market Value</option>
			</td>
		</tr>
		
		<tr><%intCtrI=N2NConst.MAX_VIEW_COL;%>
			<td align=right><b><%=SetRowNumber(intCtrI)%></b></td>
			<td>
			<select style="width:184" size="1" name="ddColumn<%=intCtrI%>">
			<option  value=<%=N2NConst.PRTF_VIEWCOL_UNREALGL%>>Unrealized Gain/Loss ($/%)</option>
			</td>
		</tr>
		<tr><td colspan=2 style='font-size:0.5mm'>&nbsp;</td></tr>
		</table>
		</td>
		<td width='6%'>&nbsp;</td>
		<td width='34%' valign=top>
		<br>
		<font color="#006699"><b><u>PERFORMANCE INFO</u></b><br><br></font>
		<p style="LINE-HEIGHT:100%; MARGIN-BOTTOM:1px; MARGIN-TOP:0px">
			<font color="#006699">
			- Ref Price/Current Price
			<br>- Day High/Low
			<br>- Year High/Low
			<br>- Change ($/%)
			<br>- Volume / Lot Size
			</font>
		</p>
		<font color="#006699"><br><b><u>HOLDINGS INFO</b></u></font>
		<p style="LINE-HEIGHT:100%; MARGIN-BOTTOM:1px; MARGIN-TOP:0px">
			<font color="#006699">
			<br>- Qty On Hand
			<br>- Qty Sold
			<br>- Brokerage
			<%if (FeatureAPPriceCost) {
			out.println("<br>- Avg Purchase Price");
			}
			%>
			<br>- Avg Buy Price
			<br>- Avg Sell Price
			<br>- Portfolio (%)<!--<br>- Gross Market Value<br>- Realized Gain/Loss ($/%)<br>- Unrealized Gain/Loss ($/%)-->
			<br>- Upper/Lower Limit<br>- Breakeven Price
			</font>
		</p>
		</td>
	</tr>
	</table>
	</td>
</tr>
</table>
<table border=0 cellpadding=0 cellspacing=0 width=430>
	<tr><td style='font-size:2mm'>&nbsp;</td></tr>
	<tr><td colspan=4 align=right>
		<input id=btDone type=button value=' Done' onclick='btDone_onclick()'>
		<input type=button value=Cancel onclick='window.close();'></td>
	</tr>
</table>
<form id=frmUpdColView method=post action="/bin/prtfViewAction.asp" style='display:none'>
<!--<BR>strCliCode --><INPUT NAME=strCliCode SIZE=6 TYPE=HIDDEN>
<!--<BR>intPrtfID--><INPUT NAME=intPrtfID SIZE=4 TYPE=HIDDEN>
<!--<BR>intViewID--><INPUT NAME=intViewID SIZE=1 TYPE=HIDDEN>
<!--<BR>txtViewName>--><INPUT NAME=txtViewName SIZE=20 TYPE=HIDDEN>
<!--<BR>txtViewString--><INPUT NAME=txtViewString SIZE=50 TYPE=HIDDEN>
<!--<BR>Mode--><INPUT NAME=Process_Mode SIZE=1 TYPE=HIDDEN>
</form>
</body>
</html>
<% } else {
	response.sendRedirect(oN2NSession.getSetting("HTMLRootHome"));
}
%>
<script language=JavaScript>
var START_VIEW=1;
var SEPARATOR ="<%=N2NConst.FEED_REQFLD_SEP%>";
var MAX_VIEW_COL = "<%=N2NConst.MAX_VIEW_COL%>";
var BASE_COL ="<%=N2NConst.PRTF_VIEWCOL_FREE%>";
//	'2|36|34|30|40|11|15|38|19|22' Default View
var DEFAULT_VIEW = "<% 
		out.println(
				N2NConst.PRTF_VIEWCOL_STKCODENAME +N2NConst.FEED_REQFLD_SEP+N2NConst.PRTF_VIEWCOL_YEARHL +
				N2NConst.FEED_REQFLD_SEP+N2NConst.PRTF_VIEWCOL_DAYHL +N2NConst.FEED_REQFLD_SEP+ 
				N2NConst.PRTF_VIEWCOL_REFLASTP +N2NConst.FEED_REQFLD_SEP +N2NConst.PRTF_VIEWCOL_VOLLOTSIZE +
				N2NConst.FEED_REQFLD_SEP+ N2NConst.PRTF_VIEWCOL_QTYONHAND +N2NConst.FEED_REQFLD_SEP+
				N2NConst.PRTF_VIEWCOL_AVEBPRICE +N2NConst.FEED_REQFLD_SEP+ N2NConst.PRTF_VIEWCOL_PCHANGE +
				N2NConst.FEED_REQFLD_SEP+	N2NConst.PRTF_VIEWCOL_GROSSMKTVAL +N2NConst.FEED_REQFLD_SEP+ 
				N2NConst.PRTF_VIEWCOL_UNREALGL);
					%>";
if ("<%=intMode%>" != '1')	{ //1 Add New, 2 Update, 3 Delete
	ddColumnUpdate("<%=strViewString%>");
} else { //Pass in DEFAULY_VIEW if add new
	ddColumnUpdate(DEFAULT_VIEW);
}
function body_OnLoad()
{
	document.body.focus();
	document.all.ddColumn1.focus();
}
function UpdateFieldBeforePost()
{
	document.all("strCliCode").value="<%=strCliCode%>";
	document.all("intPrtfID").value="<%=intPrtfID%>";
	document.all("intViewID").value="<%=intViewID%>";
	document.all("txtViewName").value="<%=strViewName%>"		//txtVName.value;
	document.all("txtViewString").value=CollectViewString();
	document.all("Process_Mode").value="<%=intMode%>";
}
function ddColumnUpdate(strVString)
{	
	var i;
	var aVString
	if (strVString.length==0)
	return;
	aVString = strVString.split(SEPARATOR)
	//update select combo-box with set-column
	for (i=2; i<MAX_VIEW_COL-2+1; ++i)
	{
		document.all("ddColumn"+i).value=aVString[i-1];
	}
}
function CollectViewString()
{
	var strTemp;
	var strViewString;
	var i;
	strViewString="";
	for(i=START_VIEW;i<=MAX_VIEW_COL;i++){
		strTemp=document.all("ddColumn"+i).value;
		if (strTemp=="")
			strTemp = BASE_COL;
		strViewString=strViewString+ strTemp +( i==MAX_VIEW_COL ? "": SEPARATOR );
	}
	return strViewString;
}
function btDone_onclick() 
{
	UpdateFieldBeforePost();
	frmUpdColView.submit();
	return true;
}
function onChangeColumn(nRow)
{
	var i;
	var intIndex;
	var intVal;
	intIndex = 	document.all("ddColumn" + nRow).value;
	for (i=START_VIEW; i<=MAX_VIEW_COL; i++) {
		if (i != nRow) {
			intVal = document.all("ddColumn" + i).value;
			if (intVal == intIndex && intVal != BASE_COL) {
				alert('Column already exist');
				document.all("ddColumn" + nRow).value = BASE_COL;
			}
		}
	}
}
</script>
