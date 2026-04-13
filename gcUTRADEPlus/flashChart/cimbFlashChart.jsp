<%@ page import = "com.n2n.util.N2NConst, java.net.*, java.io.*"%>
<%@include file="/common.jsp"%>
<%@include file="/util/sessionCheck.jsp"%>

<%
	String portFolioFlag = "N";
	String sUserAgent = request.getHeader("User-Agent").toLowerCase();
	if (validSession) { 
		if (g_sCategory != null) {
			if(!(g_sCategory.equals(N2NConst.CLI_CATEGORY_ADMIN) 
				|| g_sCategory.equals(N2NConst.CLI_CATEGORY_SADMIN) 
				|| g_sCategory.equals(N2NConst.CLI_CATEGORY_DEALER) 
				|| g_sCategory.equals(N2NConst.CLI_CATEGORY_REMOTERMS))){
				portFolioFlag = "Y";
			}
		}
%>
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Flash Chart</title>
	<style>
		body { margin: 0px; overflow:hidden; background-color: #EFF0F5; }
	</style>
</head>
<body onload='Body_OnLoad()'<% if (sUserAgent.indexOf("msie 9.0") <0) { out.print(" onUnload='Body_onUnLoad()'"); };%> >
<div id="searchDiv" style="display:none;">
	<table height="30" width="759px" border=0 cellspacing=2 cellpadding=0>
		<tr><td height="4"></td></tr>
		<tr bgcolor="#C0C1C2" valign="middle">
			<form id="frmFastQuote" name="frmFastQuote"/>
				<td height="30">
					&nbsp;<select style="font-size: 8pt; height: 20px; width: 125px; border: 1px solid #666666; vertical-align : top;" id="exchCode"><option value="">Market</option><option value="SG" selected>SG</option></select>
					&nbsp;<input id="txtFastQuote" autocomplete="off" size=18" name="txtFastQuote" onKeyPress="return event.keyCode!=13;" style="height: 18px; border: 1px solid #666666; vertical-align : top;"/>
					&nbsp;<input type="button" onclick="butFastQuote_OnClick('main');" style="height: 18px; width: 70px; border:1px solid #666666;background-color:#FFFFFF; color: #0099CC; font-size:8pt;" value="Search"/>
					&nbsp;<input type="button" onclick="butFastQuote_OnClick('comp');" style="height: 18px; width: 70px; border:1px solid #666666;background-color:#FFFFFF; color: #0099CC; font-size:8pt;" value="Comparison"/>
				</td>
				<input id="FilterCode" type="hidden" value="" name="FilterCode"/>
				<input id="StockName" type="hidden" value="" name="StockName"/>
			</form>
		</tr>
	</table>
</div>
<script src="chart/AC_OETags.js" language="javascript"></script>
<script src="chart/ChartLoader.js" language="javascript"></script>
<script type='text/javascript' src='<%=g_sJSPath%>/LinkFunc.js'></script>
<script type='text/javascript' src='<%=g_sJSPath%>/autosuggest2.js'></script>
<script type='text/javascript' src='<%=g_sJSPath%>/suggestions.js'></script>
<script type='text/javascript' src='<%=g_sJSPath%>/stkCodeNameSuggListSG.js'></script>
<script type='text/javascript' src='<%=g_sJSPath%>/ajax.js'></script>
<script type='text/javascript' src='<%=g_sJSPath%>/jquery-3.6.0.js'></script>
<link rel='stylesheet' type='text/css' href='<%=g_sStylePath%>/autosuggest.css' />
<script language = 'javascript'>
	var form = document.getElementById("frmFastQuote");
	var asFastQuote = new AutoSuggestControl(document.getElementById("txtFastQuote"), new N2NSuggestions(arrStkCodeName), 5);
	asFastQuote.setScrollHeight(15);
	//asFastQuote.setScrollWidth(50);
	asFastQuote.setFontSize(8);

	var m_sRepChar = new String('&');
	var m_sRepWith = new String('~');

	var iIndexSEg = new Number(0);
	var sStkName = new String('');
	var sStkCode = new String('');
	var sStkCodeName = new String('');

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
			sStkCode=sStkCodeName;
		}

		document.getElementById('StockName').value = sStkName;
		document.getElementById('FilterCode').value = sStkCode;
	}

	function butFastQuote_OnClick(type) {
		//var sSearch = document.getElementById("txtFastQuote").value;
		//if(document.getElementById("exchCode").value == ""){
		//    alert("Please select exchange.");
			//    return false;
		//}
		getStockCodeName();
		symbolSearch(type);
	}
	
	function showHideSearchMain(event){
		document.getElementById("FlashChart").height="93%";
		document.getElementById("searchDiv").style.display = "block";
	}
	
	function showHideSearchCom(event){
		document.getElementById("FlashChart").height="93%";
		document.getElementById("searchDiv").style.display = "block";
	}

	window.onbeforeunload = function (e) {
		e = e || window.event;
		setCookie("oFlashChart", "", -1);
		bCookies = false;
	};
</script>
<script language='javascript'>
var bCookies = true;

function Body_OnLoad()
{
	CheckCookiesAlive();
}

function Body_onUnLoad()
{
	setCookie("oFlashChart", "", -1);
}

function CheckCookiesAlive()
{
	var oFlashChart = getCookie("oFlashChart");
	if (oFlashChart != null && oFlashChart != "") {
		window.location.href = "cliInvalid.jsp";
	} else {
		setCookie("oFlashChart", "yes", 5000);
	}
}

function setCookie(c_name, value, exdays)
{
	if (bCookies) {
		var exdate = new Date();
		exdate.setMilliseconds(exdate.getMilliseconds() + exdays);

		var c_value = escape(value) + ((exdays==null) ? "" : "; expires="+ exdate.toUTCString());
		document.cookie = c_name +"="+ c_value;
		window.setTimeout("setCookie('oFlashChart','yes',5000)", 3000);
	}
}

function getCookie(c_name)
{
	var i, x, y, aCookies = document.cookie.split(";");
	for (i=0; i<aCookies.length; i++) {
		x = aCookies[i].substr(0,aCookies[i].indexOf("="));
		y = aCookies[i].substr(aCookies[i].indexOf("=") +1);
		x = x.replace(/^\s+|\s+$/g,"");
		if (x == c_name) {
			return unescape(y);
		}
	}
}

function getQuerystring(key, defaultVal) {
    if (defaultVal == null) {
        defaultVal = "";
    }
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs == null) {
        return defaultVal;
    }
    else {
        return qs[1];
    }
}
</script>
<div>
<script language='javascript' charset='utf-8'>
var exchg = getQuerystring('exchg');
var code = getQuerystring('Code');
var name = getQuerystring('Name');
if(name.indexOf("%26")>0 || name.indexOf("%20")>0)
	name = decodeURIComponent(name);
var atpPortfolio = "";
var portFolioFlag = "<%=portFolioFlag%>";	

if(exchg != "SG") {
	window.location.href = "cliInvalidExchg.jsp";
}

loadChart( "100%", "100%" );

var initCallback = function() 
{
	try
	{
		var chart = FABridge.FlashChart.root();
		
		chart.getSymbols().setMainSymbol( code+"."+exchg, name );
		
		/*
			Default Value
			Symbol - tss-0
			Period - Daily
			NumberOfBar - 510
		*/	
		
		chart.setOptions( {
			"global.key" : "<%=oN2NSession.getSetting("flashChart.global.key")%>",
			"global.showCopyright" : "false",
			"global.showStatusBar" : "false",
			"data.sourceUrl" : "<%=oN2NSession.getSetting("flashChart.data.sourceUrl")%>",
			"data.numberOfBars" : "100",
			"main.chartType" : "candle",
			"comparison.chartType" : "candle",
			"toolbar.top.items" : "file,symbols,periods,numberOfRecords,comparisons,,chartTypes,,volume|minMax|grid|historyView|dataInfo|last|crosshair,,yScale,yLogScale,,addIndicator,indicators,tradingLine,zoomOut|zoomIn,,print,,about,,help,,fullscreen",
           	"toolbar.periods" : "Tick|Ticks,{period_1_minute}|Intraday+1,{period_5_minutes}|Intraday+5,{period_15_minutes}|Intraday+15,{period_30_minutes}|Intraday+30,{period_1_hour}|Intraday+60,{period_daily}|Daily,{period_weekly}|Weekly,{period_monthly}|Monthly,{period_yearly}|Yearly",
			"toolbar.symbols" : ",-,SEARCH|_SEARCH,-,<%@ include file='/ref/StkCodeNameFillListSG.ref'%>",
			"toolbar.comparisons" : "-,SEARCH|_SEARCH,-,<%@ include file='/ref/StkCodeNameFillListSG.ref'%>"
		} );
		
		chart.addEventListener( "helpClicked", onHelpClicked );
		chart.getSymbols().addEventListener("MAIN_SYMBOL_CHANGED", onMainChanged);
		chart.getGui().addEventListener("comparisonSearch",	showHideSearchCom);
		chart.getGui().addEventListener("mainSymbolSearch", showHideSearchMain);
		chart.getGui().addEventListener( "fullScreenClicked", gotofullscreen );		
		onMainChanged(null);
		chart.createToolbars();
		chart.display();
		document.getElementById("FlashChart").height="99%";
	} catch ( err ) {
		alert( err.message );
	}
}

function symbolSearch(symbolType) {
	var stkName = document.getElementById('StockName').value;
	var stkCode = document.getElementById('FilterCode').value;
	document.getElementById("searchDiv").style.display = "none";
	
	if(stkName != ""){
		var chart = FABridge.FlashChart.root();
		
		if(symbolType == "main"){
			var comp = chart.getSymbols().setMainSymbol(stkCode , stkName);
			code = stkCode;
			onMainChanged(null);
		}else{
			var comp = chart.getSymbols().addComparison(stkCode , stkName);
		}	
		chart.display();
	}
	document.getElementById("FlashChart").height="99%";
	document.getElementById("txtFastQuote").value="";
}

function gotofullscreen(event)
{
	if (document.getElementById("flashdiv").style.top  == "" )
	{
		document.getElementById("flashdiv").style.width="100%";
		document.getElementById("flashdiv").style.height="100%";
		document.getElementById("flashdiv").style.top="0px";
		document.getElementById("flashdiv").style.left="0px";
		window.scrollTo(0,1); 
		window.onscroll=function(){window.scrollTo(0,1)}
	}
	else
	{
		document.getElementById("flashdiv").style.width="840px";
		document.getElementById("flashdiv").style.height="500px";
		document.getElementById("flashdiv").style.top="";
		document.getElementById("flashdiv").style.left="";		
		window.onscroll="";
	}
}

function onHelpClicked(event) {
	var oWinHelp = window.open("<%=g_sDocPath%>/EN_Flash_Chart_Help.pdf","_blank");
	oWinHelp.focus();
}

function trim(str) {
	return str.replace(/^\s+|\s+$/g,"");
} 

function onMainChanged(event) {
	if(portFolioFlag == "Y"){
		var symbol = "";
		if(event != null){ 
			symbol = event.getSymbol().getSymbolId();;
		}else if(exchg != ""){
			symbol = code+"."+exchg;
		}else{
			symbol = code;
		}
		
		if(symbol != ""){
			atpPortfolio = N2NHitJspUrl("atpPortfolio.jsp?stkCode="+symbol, "", "char");
			atpPortfolio = trim(atpPortfolio);
			//alert("|"+atpPortfolio+"|");
			if(atpPortfolio != "" && atpPortfolio != "0" && atpPortfolio != "Error"){
				var chart = FABridge.FlashChart.root();
				var tl1 = chart.getTradingLines().addLine( "t1" );


				chart.getTradingLines().setOptions( "t1", {		
					"type" : "full",
					"width" : "2",
					"color" : "blue",
					"buyPrice" : atpPortfolio,
					"buyDate" : "",
					"leftLabel.show" : "true",
					"leftLabel.text" : "Buy Price",
					"leftLabel.vposition" : "auto",
					"leftLabel.color" : "white",
					"middleLabel.show" : "false",
					"middleLabel.text" : "test",
					"middleLabel.vposition" : "middle",
					"rightLabel.show" : "false",
					"rightLabel.text" : "test",
					"rightLabel.vposition" : "middle",
					"isMovable" : "true",
					"isRemovable" : "true",
					"includeInMinMax" : "true"
				} );
			}
		}
	}	
}

FABridge.addInitializationCallback("FlashChart", initCallback);
</script>
</div>
</body>
</html>
<%
	} else { 
		out.println("<script language='javascript'>");
		out.println("	alert('" + oN2NSession.getSetting("InvalidSession.MultipleLogin.EN") + "');");
		out.println("parent.location.href='" + oN2NSession.getSetting("HTMLRootSecure")+"/"+oN2NSession.getSetting("projectFolder")+"/loginATPPush?action=logout&frm=rt" + "';");
		out.println("</script>");
		oN2NSession.setLogoutStatus(1);
	}
%>