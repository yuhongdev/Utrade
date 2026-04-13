<%@ include file= 'common.jsp'%>
<jsp:include page="/cliCheckLogin.jsp" flush="true">
	<jsp:param name="SecLevel" value="1" />
</jsp:include>
<% 
try {
	if (oN2NSession.getIsUserLogin()) {
%>
<%@ page import = "java.sql.*, java.util.*, java.text.SimpleDateFormat"%>
<%@ page import = "com.n2n.util.N2NConst"%>
<%@ taglib uri="/tld/N2N_HtmlObject.tld" prefix="html"%>
<jsp:useBean id="research" class="com.n2n.DB.N2NMFResearch" scope="page"/>
<jsp:useBean id="researchbean" class="com.n2n.bean.N2NMFResearchBean" scope="page"/>
<jsp:setProperty name="researchbean" property="*" />
<%	String sFastQuote = "", sFilterText = "", sChkMainTitle = "", sChkNewsDesc = "", sChkRevText = "";
	
	sFastQuote = request.getParameter("txtFastQuote");
	sFastQuote = sFastQuote != null ? sFastQuote : "";
	sFilterText = request.getParameter("txtSearch");
	sFilterText = sFilterText != null ? sFilterText : "";
	sChkMainTitle = request.getParameter("chkMainTitle");
	sChkMainTitle = sChkMainTitle != null ? sChkMainTitle : "";
	sChkNewsDesc = request.getParameter("chkDesc");
	sChkNewsDesc = sChkNewsDesc != null ? sChkNewsDesc : "";
	sChkRevText = request.getParameter("chkRelText");
	sChkRevText = sChkRevText != null ? sChkRevText : "";
%>
<%@ include file='util/banner.jsp'%>
<%
	setCommonPath(g_sPath, g_sImgPath, g_sJSPath, g_sStylePath, g_sWebPath, oN2NSession.getSetting("HTMLRoot"),out);
	genBannerTitle(oN2NSession.getSetting("WebSiteName"));
%>
<script language='JavaScript' src='<%=g_sJSPath%>/LinkFunc.js'></script>
<script language=JavaScript src="<%=g_sJSPath%>/StkCodeNameFillList.js"></script>
<SCRIPT language=javascript src="<%=g_sJSPath%>/popupWindow.js"></SCRIPT>
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/default.css">
<script language='JavaScript' src='<%=g_sJSPath%>/N2NCtrl.js'></script>
<script language='JavaScript' src='<%=g_sJSPath%>/autosuggest.js'></script>
<script language='JavaScript' src='<%=g_sJSPath%>/suggestions.js'></script>
<script type="text/javascript" src="<%=g_sJSPath%>/gc_dropdownbox_value.js"></script>
<script language='JavaScript' src='<%=g_sPath%>/ref/stkCodeName.js'></script>
<link rel=stylesheet type=text/css href="<%=g_sStylePath%>/autosuggest.css">
</head>
<body onload='javascript:body_onLoad()'>

<table>
<tr>
<td>
<%genAfterMenuNews(iWidth);%>
<form id='frmResearch' name='frmResearch' action='researchArchive.jsp' method='post' onsubmit='return btnSubmit_OnClick();'>
<table border=0 cellpadding=0 cellspacing=0 width='100%'>
<tr><td colspan=2>&nbsp;</td></tr>
<tr>
	<td width='20'>&nbsp;</td>
	<td>
	<table class=clsContact border=0 cellpadding=1 cellspacing=1 id=tblNewsHeader name=tblNewsHeader width='100%'>
		<tr> <td colspan='2'><font size ='3' color='#ff0000'> <b>AmResearch </b></font></td></tr>
		<tr> <td colspan='7'>&nbsp;</td></tr>
		
		<tr>
			<td width='11%'><b>Stock Code</b></td>
			<td width='89%' colspan=5>
			<!--input id=txtFastQuote name=txtFastQuote size='23' autocomplete=off style='font-size:8pt;height:19'-->
				<input type='text' id='txtFastQuote' name='txtFastQuote' size='20' maxlength='80' style='width:131px;' autocomplete='off' class=clsContact value='<%=sFastQuote%>' onkeypress ='javascript:checkText()' onmouseout ='javascript:checkText()' onchange ='javascript:checkText()' disable=false>
				<input id='stkCodeList' name='stkCodeList' value='' type='hidden'>
				<input id='StockName' name='StockName' value='' type='hidden'>
			</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td><b>OR</b></td>
		</tr>
		<tr>
			<td><b>Text Search </b></td>
			<td colspan=5><input type=text id=txtSearch name=txtSearch size=75 maxlength=250 value='<%=sFilterText%>' class=clsContact onkeyup ='javascript:checkText()' onkeydown ='javascript:checkText()' onmouseover ='javascript:checkText()' disable=false></td>
		</tr>
		<tr>
			<td colspan=5>&nbsp;</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td colspan=5><b><font color='#ff0000'> Important Notice: </font><font color='#000000'>Please clear all entries in the search box before you can enter the new one.</font></b></td>
		</tr>
		<tr><td colspan=6>&nbsp;</td></tr>
		<tr><td colspan=6><b>Search Criteria</b></td></tr>
		<tr>
			<td>
				<input type=checkbox id=chkMainTitle name=chkMainTitle size=3 align=left checked disabled>
				&nbsp;&nbsp;&nbsp;Main Title
			</td>
			<td colspan=5>
				<input type=checkbox id=chkDesc name=chkDesc size=3 align=left checked disabled>
				&nbsp;&nbsp;&nbsp;Description
				<span style='width:40;'></span>
				<input type=checkbox id=chkRelText name=chkRelText size=3 align=left checked disabled>
				&nbsp;&nbsp;&nbsp;Relevant Text
		</tr>
		<input type=hidden id=mainTitle name=mainTitle value='<%=researchbean.getMainTitle()%>'>
		<input type=hidden id=newsDesc name=newsDesc value='<%=researchbean.getNewsDesc()%>'>
		<input type=hidden id=revText name=revText value='<%=researchbean.getRevText()%>'>	
		<tr><td colspan=6><hr></td></tr>
		<tr>			
			<td><b>Date</b></td>
			<td width='4%'>FROM</td>
			<td width='15%'>
				<html:N2N_HtmlObject type="calendar" objectName="frmResearch.fromDate" defaultValue="<%=researchbean.getFromDate()%>" className="clsContact"/>
			</td>
			<td width='3%'> TO</td>
			<td width='15%'>
				<html:N2N_HtmlObject type="calendar" objectName="frmResearch.toDate" defaultValue="<%=researchbean.getToDate()%>" className="clsContact"/>
			</td>
			<td width='20%' align='right'><input type=submit value=Search id=btnSubmit name=btnSubmit class=clsContact style='width:54' disabled></td>
		</tr>
		<tr><td colspan=6><hr></td></tr>
		<tr>
			<td colspan=6>
			<table class=clsContact border=0 cellpadding=1 cellspacing=1 id=tblTitle name=tblTitle width='100%' style='display:none;'>
				<tr>
					<% if (g_sCategory != null && (g_sCategory.equals(N2NConst.CLI_CATEGORY_ADMIN) || g_sCategory.equals(N2NConst.CLI_CATEGORY_SADMIN))) { %>
					<td width='20'></td><td width='13%'><% } else { %><td width='16%'><% } %></td>
					<td width='18%'><b>Category</td><td width='33%'><b>Title/Description</b></td>
					<td width='2%'></td><td><b>Text</b></td>
				</tr>
			</table>
			<div id='divResearch' style='overflow:auto;height:130' class='genScrollColor'>	
				<table class=clsContact border=0 cellpadding=1 cellspacing=1 id=tblNewsHeader name=tblNewsHeader width='100%'>
	<%			String sNewsID = "", sDate = "", sLink = "", sCat = "", sTitle = "", sDesc = "", sText = "", sResult = "";
				int iCount = 0;
				ResultSet rs = null;
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
				
				research.init(oN2NSession);
				
				researchbean.setOption("E");
				if(researchbean.getFromDate().length() <= 0 || researchbean.getToDate().length() <= 0) {
					Calendar cal = Calendar.getInstance();
					researchbean.setToDate(dateFormat.format(cal.getTime()));
					cal.add(Calendar.DAY_OF_MONTH,-1);
					researchbean.setFromDate(dateFormat.format(cal.getTime()));
				}
				rs = research.getResearchInfo(researchbean);
				
				if (rs != null) {
					while (rs.next()) {
						sNewsID = rs.getString("NewsID");
						sCat = rs.getString("Category");
						sTitle = rs.getString("Title");
						sDesc = rs.getString("Des");
						sLink = rs.getString("Doc");
						sText = rs.getString("Txt");
						sDate = dateFormat.format(rs.getDate("Dt"));
						out.println("<tr valign='top'>");
						if (g_sCategory != null && (g_sCategory.equals(N2NConst.CLI_CATEGORY_ADMIN) || g_sCategory.equals(N2NConst.CLI_CATEGORY_SADMIN))) {
							out.println("<td width='20'><input type='button' id='btnEdit' name='btnEdit' value='E' style='width:20px;height:17px;FONT-SIZE:7pt' class=clsContact onClick='javascript:research_onClick(" + iCount + ")'>");
							out.println("<input type='hidden' id='txtResearchId[" + iCount + "]' name='txtResearchId[" + iCount + "]' value='"  + sNewsID + "'></td>");
							out.println("<td width='13%'>");
						}
						else {
							out.println("<td width='16%'>");
						}
						out.println(sDate + "</td>");
						out.println("<td width='18%'>" + sCat + "</td><td width='33%'>");
						if(sLink.length() > 0) {
							out.println("<a href='" + oN2NSession.getSetting("UploadPath") + sLink + "' target='_blank' class='ExResearch'>");
							out.println(sTitle + " - " + sDesc + "</a></td>");
						}
						else
							out.println(sTitle + " - " + sDesc + "</td>");
						if(sText.length() > 0)
							out.println("<td width='2%'></td>");
						out.println("<td>" + sText + "</td></tr>");
						/*researchbean.setLinkDoc(rs.getString("LinkDoc"));
						researchbean.setDocType(rs.getString("DocType"));
						researchbean.setRevText(rs.getString("RelevantText"));
						researchbean.setStkCodeList(rs.getString("StockCd"));
						researchbean.setMainCat(rs.getString("Category"));
						try{
							iSeq = Integer.parseInt(rs.getString("DailySeq"));
						} catch(NumberFormatException nbf) {
							iSeq = -999;
						}
						researchbean.setSeq(iSeq);
						researchbean.setNewsCat(rs.getString("NewsCat"));
						researchbean.setEffectiveDate(rs.getString("EffectiveDt"));
						researchbean.setExpiryDate(rs.getString("ExpiryDt"));
						researchbean.setOffLineDate(rs.getString("OffLineDt"));*/
						iCount ++;
			        }
		        	rs.close();
				}
				
				if(iCount == 0) {
					out.println("<tr><td>No Search Result</td>");
				}
				
				rs = null;
				research.closeResultset();
				research.dbDisconnect();
	%>			</table>
			</div>
			</td>
		</tr>
	</table>
	</td>
	<td width='20'>&nbsp;</td>
</tr>
</table>
</form>
<%genFootnote();%>
<script language="JavaScript">
function butFastQuote_OnClick() {
	var sSearch = document.frmFastQuote.txtFastQuote.value;
	if (sSearch == '') {
		alert('Please enter search string!');
		return false;
	}
	getStockCodeName();
	//getStockCode();
	return false;
}

var asFastQuote = new AutoSuggestControl(document.getElementById('txtFastQuote'), new N2NSuggestions(arrStkCodeName), 10);
asFastQuote.setScrollHeight(14);
asFastQuote.setFontSize(8);

var m_sRepChar = new String('&');
var m_sRepWith = new String('~');
var iIndexSEg = new Number(0);
var sStkName = new String('');
var sStkCode = new String('');
var sStkCodeName = new String('');

function getStockCode() {
	for(var y=1; y<=aStkDataList.length; y++){
		if(aStkDataList[y] == document.frmResearch.txtFastQuote.value){
			sStkCode = aStkDataList[y-1];
			document.getElementById('stkCodeList').value = sStkCode;
		}
		else {
			//do nothing
		}
	}
}

function getStockCodeName() {
	sStkCodeName = new String(document.getElementById('txtFastQuote').value);
	
	while((iIndexSEg = sStkCodeName.indexOf(m_sRepWith))!=-1) {
		var regex = new RegExp(m_sRepChar, 'g');
		sStkCodeName = sStkCodeName.replace(regex, m_sRepChar);
	}
	
	var iDelimIndex = sStkCodeName.indexOf('(');
	var iDelimIndex2 = sStkCodeName.indexOf(')');
	
	if(sStkCodeName!=null && sStkCodeName!='' && iDelimIndex!=-1 && iDelimIndex2!=-1) {
		sStkName  = sStkCodeName.substring(0,iDelimIndex);
		sStkCode  = sStkCodeName.substring(iDelimIndex+1,iDelimIndex2);
	}
	else {
		sStkName='';
		sStkCode='';
		sStkCode=sStkCodeName;
	}
	
	document.getElementById('StockName').value = sStkName;
	document.getElementById('stkCodeList').value = sStkCode;
}

/*function mainCat_OnChange() {
	var sMainCat = document.getElementById("mainCat").value;
	var oSubCat = document.getElementById("SubCat"+sMainCat);
	var oNewsCat = document.getElementById("newsCat");
	
	for (var i = oNewsCat.length; i > 0; i--)
		oNewsCat.options[i] = null;
		
	if(oSubCat != null) {
		oNewsCat.disabled = false;
		for (var i = 0; i < oSubCat.length; i++)
			oNewsCat.options[i] = new Option(oSubCat.options[i].text, oSubCat.options[i].value, false);
	}
	else {
		oNewsCat.disabled = true;
		//oNewsCat.options[0].value = '';
		//oNewsCat.options[0].text = '';
	}
}*/
	
function research_onClick(p_iRow) {
	var sResearchId = document.getElementById("txtResearchId[" + p_iRow + "]").value;
	var sUrl = "researchAdmAddEdit.jsp?NewsID=" + sResearchId;
	window.open(sUrl,'winRSAdm','width=790,height=605,left=110,top=30,scrollbars=yes,resizable');
}

//added by chuili-20090217
function checkText(){
	
	document.getElementById("txtFastQuote").disabled = false;
	document.getElementById("txtSearch").disabled = false;
	
	if(document.getElementById("txtFastQuote").value.length >0){
		document.getElementById("txtSearch").disabled = true;
		document.getElementById("txtFastQuote").disabled = false;
	}
	
	if(document.getElementById("txtSearch").value.length >0){
		document.getElementById("txtFastQuote").disabled = true;
		document.getElementById("txtSearch").disabled = false;
	}
	
}

function body_onLoad(temp) {
	//mainCat_OnChange();
	//document.getElementById("newsCat").value = "<%=researchbean.getNewsCat()%>";
	if (document.getElementById("fromDate").value.length > 0)
		document.getElementById("fromDate").value = formatDateField(1,document.getElementById("fromDate").value);
	else
		document.getElementById("fromDate").value = formatDateField(1,"<%=researchbean.getFromDate()%>");
	
	if (document.getElementById("toDate").value.length > 0)
		document.getElementById("toDate").value = formatDateField(1,document.getElementById("toDate").value);
	else
		document.getElementById("toDate").value = formatDateField(1,"<%=researchbean.getToDate()%>");
		
	document.getElementById("btnSubmit").disabled = false;
	
	if(<%=iCount%> > 0)
		document.getElementById("tblTitle").style.display = '';
}

function btnSubmit_OnClick(){
	var sSearch = document.getElementById("txtSearch").value;
	//var oNewsCat = document.getElementById("newsCat");
	var sDateFrom = formatDateToODBC(1,document.getElementById("fromDate").value);
	var sDateTo   = formatDateToODBC(1,document.getElementById("toDate").value);

	if (sSearch != "" && !(document.getElementById("chkMainTitle").checked) && !(document.getElementById("chkDesc").checked) && !(document.getElementById("chkRelText").checked)) {
		alert("Please select at least one search criteria!");
		document.getElementById("chkMainTitle").focus();
	}
	/*else if (sSearch == "" && (document.getElementById("chkMainTitle").checked || document.getElementById("chkDesc").checked || document.getElementById("chkRelText").checked)) {
		alert("Please enter search text!");
		document.getElementById("txtSearch").focus();
	}*/
	/*else if (oNewsCat.options[oNewsCat.length-1].text != "" && oNewsCat.value == "") {
		alert("Please select one sub category!");
		oNewsCat.focus();
	}*/
	else if (sDateFrom > sDateTo) {
		alert ("From Date cannot  greater than To Date!");
		document.getElementById("toDate").focus();
	}
	else {
		getStockCodeName();
		
		if(isNaN(document.frmResearch.txtFastQuote.value)){
			getStockCode();
		} 
		
		if (document.getElementById("chkMainTitle").checked) {
			document.getElementById("mainTitle").value = sSearch;
		}
		else
			document.getElementById("mainTitle").value = '';
			
		if (document.getElementById("chkDesc").checked) {
			document.getElementById("newsDesc").value = sSearch;
		}
		else
			document.getElementById("newsDesc").value = '';
			
		if (document.getElementById("chkRelText").checked) {
			document.getElementById("revText").value = sSearch;
		}
		else
			document.getElementById("revText").value = '';
			
		document.getElementById("fromDate").value = sDateFrom; //formatDateToODBC(1,document.getElementById("fromDate").value);
		document.getElementById("toDate").value = sDateTo; //formatDateToODBC(1,document.getElementById("toDate").value);
		
		return true;
	}
	return false;
}
</script>
<%	}
} catch (Exception ex) {
	ex.printStackTrace();
}
%>