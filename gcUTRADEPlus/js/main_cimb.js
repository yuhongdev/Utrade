/***
main
----
1. <SCRIPT language=javascript src="<%=g_sJSPath%>/marketSummaryData.js" id=jsData></SCRIPT>
2. body_onload()
	 quoteData = new N2NScriptQuote("quoteData", "<%=g_sJSPath%>/marketSummaryData.js", "<%=oN2NSession.getSetting("MarketSummaryChartServer")%>", "<%=oN2NSession.getSetting("MarketSummaryChartServerBk")%>", 10);
	 quoteData.updateData();
3. 
	 <SCRIPT language=javascript src="<%=g_sJSPath%>/main_AMSec.js"></SCRIPT>
	 <script language=javascript>
	 var m_oTableData     = document.getElementById("tblSummaryData");
	 var m_oTableData_Ind = document.getElementById("tblSummaryData_Indices");
	 var quoteData;
	 function select(vnOption) { quoteData.select(vnOption); }
	 function updateData()     {	quoteData.updateData(); }

GlobalSetting
-------------
MarketSummaryChartServer=http://bursa.n2nconnect.com/img/JAChart/
MarketSummaryChartServerBk=http://chart.ebrokerconnect.com/img/JAChart/
***/
function N2NScriptQuote(vsScript, vsUrl, vsImgUrl, vsImgUrl_Bk, vnInterval) {

	var m_nTOPMOSTACTIVE 	= 0;
	var m_nTOPMOSTGAINERS = 1;
	var m_nTOPMOSTLOSSERS	= 2;
	var m_nINDICESDATA    = 3;
	var m_nSCOREBOARD     = 4;

	var m_nCOUNTERUP 	  = 0;
	var m_nCOUNTERDOWN 	= 1;
	var m_nCOUNTERUNCHG	= 2;

	var m_nCOL_SEP		= "|";

	var m_sBEGINDATA	= "--_BeginData_";
	var m_sENDDATA		= "--_EndData_";

	//var m_sCSSTopMostHeader = "tdTopMostHeader";
	//var m_sCSSTopMostData = "trTopMostData";

	var m_nSelOption 	    = 0;
	var m_nInterval	 	    = vnInterval;
	var m_nLoadInterval	  = 10;
	var m_nExceptionCount = 0;
	var m_nRetryCount	    = 3;
	var m_nTimer		      = 0;

	var m_oJSData;
	var m_sJSData	= "jsData";

	var m_sScript	= vsScript;
	var m_sUrl		= vsUrl;

	var m_bLoaded	= false;

	//var m_sreadyState  = "complete";
	var m_sImgArrowEnd = "arrow.png";
	
	var m_sKeep012SelOption = 0;
	
	/*
	var IndicesCode_Sort = ["0861","0863","0864","0866","0867","0868","0800","0500","0005"];
	*/
	var IndicesCode_Sort = ["86100009","86300005","86400003","86600008","86700006","86800004","87000000","87100008","500003"];
	var nCol_IndicesCode = 1;
	var nCol_IndicesName = 2;
	var nCol_IndicesLast = 6;
	var nCol_IndicesChg  = 7;
	var nRow_oData_Indices = 7;      // How many Column in 1 row data
	var nLen_min_oData_Indices = 65; // Total of raw data
	
	var nLen_oData_TopActiveGainersLosers = 17;
	var nLen_oData_ScoreBoard = 7;

	var sKeepImg = new Image();
	var vssImgUrl    = vsImgUrl    + "KLCIChart.png"
	var vssImgUrl_Bk = vsImgUrl_Bk + "KLCIChart.png"
	
	var sUrl_KLCIChart = [vssImgUrl,vssImgUrl_Bk];

	function updateData() {
		
		//alert("updateData()");
		
		if (!m_bLoaded) {
			
				m_bLoaded = true;
			
				m_sKeep012SelOption = getSelOption();
				loadData_Top10();
				
				setSelOption(3);
				loadData_Indices();
				
				setSelOption(4);
				var oData = new String(getData()).split(m_nCOL_SEP);

				if (oData.length == nLen_oData_ScoreBoard) {
						if ( (oData[0] == m_sBEGINDATA) && (oData[6] == m_sENDDATA) ) {
								document.getElementById("sGainersMS").innerHTML = addCommas(oData[1]);
								document.getElementById("sLosersMS").innerHTML  = addCommas(oData[2]);
								document.getElementById("sUnchgMS").innerHTML   = addCommas(oData[3]);
								document.getElementById("sVolumeMS").innerHTML  = addCommas(oData[4]);
								document.getElementById("sValueMS").innerHTML   = addCommas(oData[5]);
						}
				}
				
				sKeepImg.src = document.getElementById("KLCIChart").src;
				
				sUrl = sUrl_KLCIChart[0];
				sUrl += (sUrl.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());
				document.getElementById("KLCIChart").src = sUrl;
				
				document.getElementById("KLCIChart").onerror = function (evt) { 
						sUrl = sUrl_KLCIChart[1];
						sUrl += (sUrl.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());
						document.getElementById("KLCIChart").src = sUrl; 
				}
				
				document.getElementById("KLCIChart").onerror = function (evt) { 
						document.getElementById("KLCIChart").src = sKeepImg.src;
				}

				document.getElementById("imgGainerMS").src = "/gc/img/JAChart/uparrow.png";
				document.getElementById("imgLoserMS").src  = "/gc/img/JAChart/dwarrow.png";
				document.getElementById("imgUnchgMS").src  = "/gc/img/JAChart/unchgarrow.png";
				document.getElementById("imgVolMS").src    = "/gc/img/JAChart/unchgarrow.png";
				document.getElementById("imgValMS").src    = "/gc/img/JAChart/unchgarrow.png";

				m_nTimer = setTimeout(m_sScript + ".reloadData()", m_nInterval * 1000);
				
				setSelOption(m_sKeep012SelOption);
		}
	}
	this.updateData = updateData;


	function select(vnOption){
		
		//alert("select()");

		if (getSelOption() != vnOption){
			
				if (vnOption=="0") {
						document.getElementById("MostActive").src = "/gc/img/JAChart/AMSec/MostActiveOn.gif";
						document.getElementById("TopGainer").src  = "/gc/img/JAChart/AMSec/TopGainerOff.gif";
						document.getElementById("TopLoser").src   = "/gc/img/JAChart/AMSec/TopLoserOff.gif";
						
						document.getElementById("MostActive").style.cursor = "";
						document.getElementById("TopGainer").style.cursor  = "pointer";
						document.getElementById("TopLoser").style.cursor   = "pointer";
						
				} else if(vnOption=="1") {
						document.getElementById("MostActive").src = "/gc/img/JAChart/AMSec/MostActiveOff.gif";
						document.getElementById("TopGainer").src  = "/gc/img/JAChart/AMSec/TopGainerOn.gif";
						document.getElementById("TopLoser").src   = "/gc/img/JAChart/AMSec/TopLoserOff.gif";
						
						document.getElementById("MostActive").style.cursor = "pointer";
						document.getElementById("TopGainer").style.cursor  = "";
						document.getElementById("TopLoser").style.cursor   = "pointer";
						
				} else if (vnOption=="2") {
						document.getElementById("MostActive").src = "/gc/img/JAChart/AMSec/MostActiveOff.gif";
						document.getElementById("TopGainer").src  = "/gc/img/JAChart/AMSec/TopGainerOff.gif";
						document.getElementById("TopLoser").src   = "/gc/img/JAChart/AMSec/TopLoserOn.gif";
						
						document.getElementById("MostActive").style.cursor = "pointer";
						document.getElementById("TopGainer").style.cursor  = "pointer";
						document.getElementById("TopLoser").style.cursor   = "";
				}

				setSelOption(vnOption);
				loadData_Top10();
		}
	}
	this.select = select;


	function reloadData() {
		
		//alert("reloadData()");
		
		var nIndex = -1;
		var sUrl = "";

		m_bLoaded = false;

		sUrl = m_sUrl;
		nIndex = sUrl.indexOf("time");
		
		if (nIndex >= 0)
				sUrl = sUrl.substring(0, nIndex-1);

		sUrl += (sUrl.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());

		var head = document.getElementsByTagName("head").item(0);
		m_oJSData = document.getElementById(m_sJSData);

		if (m_oJSData) {
				head.removeChild(m_oJSData);
		}

		var script = document.createElement('script');
		script.id = m_sJSData;
		script.src = sUrl;
		script.type = 'text/javascript';
		script.defer = true;
		void(head.appendChild(script));

		m_oJSData = script;

		setTimeout(m_sScript + ".updateData()", m_nLoadInterval * 1000);

/*
		m_oJSData.src = sUrl;
*/
		//window.status = sUrl + " " + new Date();
	}
	this.reloadData = reloadData;


	function loadData_Top10() {
		
		//alert("loadData()");
		
		var nCnt = 0;
		var nArrowCol = -1;
		var oData = new String(getData()).split(m_nCOL_SEP);
				
		var oRows = m_oTableData.rows;

		if (oData.length == nLen_oData_TopActiveGainersLosers && 
				oData[nCnt++] == m_sBEGINDATA && 
				oData[oData.length-1] == m_sENDDATA) {
			
				for (var i = 0; i < oRows.length; i++) {
				
						var oCells = oRows[i].cells;

						nArrowCol = -1;
	
						for (var j = 0; j < oCells.length; j++) {
					
								var sAlign = oCells[j].align;

								if (oCells[j].innerHTML.toLowerCase().indexOf(m_sImgArrowEnd.toLowerCase()) >= 0)
										nArrowCol = j;

								//if (oCells[j].id.indexOf("data") < 0)
										//continue;

								if (sAlign == "right") {
										//oData[nCnt] += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
								} else if (sAlign == "center") {
								} else {
										//oData[nCnt] = "&nbsp;&nbsp;" + oData[nCnt];
										oData[nCnt] = oData[nCnt];
								}
				
								if (j == oCells.length-1)	{
										var sArrow = "unchg";
										var fVal = parseFloat(oData[nCnt]);

										if (fVal > 0){
												fVal = m_nCOUNTERUP;
												sArrow = "up";
												oCells[j].className = "tblUp";
										} else if (fVal < 0)	{
												fVal = m_nCOUNTERDOWN;
												sArrow = "dw";
												oCells[j].className = "tblDown";
										} else {
												fVal = m_nCOUNTERUNCHG;
												sArrow = "unchg";
												oCells[j].className = "tblUnchg";
										}

										//tblOddRow, tblEvenRow
										//oCells[j].className = oRows[i].className + fVal;
								
										if (nArrowCol >= 0){
												if (oCells[nArrowCol].innerHTML.toLowerCase().indexOf(new String(sArrow + m_sImgArrowEnd).toLowerCase()) < 0) {
														oData[nCnt-2] = oData[nCnt-2].replace(/&/g,"&");//&#38; 
														oCells[nArrowCol].innerHTML = "<img src=\"/gc/img/JAChart/" + sArrow + m_sImgArrowEnd + "\">&nbsp;" + oData[nCnt-2];
														//oCells[nArrowCol].innerHTML = "&nbsp;" + oData[nCnt-2];
												}
										}
								}
				
								oCells[j].innerHTML = oData[nCnt];

								nCnt++;
						}
				}

		} else {

			if(m_nTimer != 0){ clearTimeout(m_nTimer); }

			if (m_nExceptionCount < m_nRetryCount) {
					reloadData();
					m_nExceptionCount++;
			} else {
					m_nExceptionCount = 0;
					m_nTimer = setTimeout(m_sScript + ".reloadData()", m_nInterval * 2 * 1000);
			}
			
		}
	}
	this.loadData_Top10 = loadData_Top10;

	function srch_IndicesCode(IndicesCode_Sort_data) {
		
			var res = new Number(-1);
			
			var oData = new String(getData()).split(m_nCOL_SEP);
			var oRows = m_oTableData_Ind.rows;
			
			var oData_rows = new Number(0);
			
			if ((oData.length>2) && (nRow_oData_Indices!=0))
					oData_rows = ((oData.length - 2) / nRow_oData_Indices) * 1;			
			
			for (var k=0; k<oData_rows ; k++) {
								
					nCnt_IndicesCode = k * nRow_oData_Indices + nCol_IndicesCode;
					
					if (IndicesCode_Sort_data == oData[nCnt_IndicesCode]) {
							res = k;
							break;
					} 
			}

			return res;
	}
	this.srch_IndicesCode = srch_IndicesCode;

	function loadData_Indices() {
		
		//alert("loadData_Indices()");

		var k    = new Number(0);
		var nCnt = new Number(0);

		var oData = new String(getData()).split(m_nCOL_SEP);
				
		var oRows = m_oTableData_Ind.rows;
		
		var iTemp = new Number(0);

		if (oData.length >= nLen_min_oData_Indices && 
				oData[nCnt] == m_sBEGINDATA && 
				oData[oData.length-1] == m_sENDDATA) {
			
				for (var i = 0; i < oRows.length; i++) {

						//var oCells = oRows[i].cells;
						ii = i - iTemp;
						var oCells = oRows[ii].cells;
						
						k = srch_IndicesCode(IndicesCode_Sort[i]);

						for (var j = 0; j < oCells.length; j++) {
					
								if (j == 0) {
									
										if (k != -1) {
										} else {
												iTemp++;
												break;
										}
									
								} else if (j == 1) {
									
										if (k != -1) {
												nCnt_Last = k * nRow_oData_Indices + nCol_IndicesLast;
												oCells[j].innerHTML = oData[nCnt_Last];
										} else {
												oCells[j].innerHTML = "-";
										}
										
								} else if (j == oCells.length-1)	{
									
										if (k != -1) {
												nCnt_IndicesCode = k * nRow_oData_Indices + nCol_IndicesCode;
												nCnt_IndicesName = k * nRow_oData_Indices + nCol_IndicesName;
												nCnt_IndicesChg  = k * nRow_oData_Indices + nCol_IndicesChg;
											
												var sArrow = "unchg";
												var fVal = parseFloat(oData[nCnt_IndicesChg]);
		
												if (fVal > 0){
														fVal = m_nCOUNTERUP;
														sArrow = "up";
														oCells[j].className = "tblUp";
														oCells[0].innerHTML = "<img src=\"/gc/img/JAChart/" + sArrow + m_sImgArrowEnd + "\">&nbsp;" + oData[nCnt_IndicesName];
												} else if (fVal < 0)	{
														fVal = m_nCOUNTERDOWN;
														sArrow = "dw";
														oCells[j].className = "tblDown";
														oCells[0].innerHTML = "<img src=\"/gc/img/JAChart/" + sArrow + m_sImgArrowEnd + "\">&nbsp;" + oData[nCnt_IndicesName];
												} else {
														fVal = m_nCOUNTERUNCHG;
														sArrow = "unchg";
														oCells[j].className = "tblUnchg";
														oCells[0].innerHTML = "<img src=\"/gc/img/JAChart/" + sArrow + m_sImgArrowEnd + "\">&nbsp;" + oData[nCnt_IndicesName];
												}
												
												oCells[j].innerHTML = oData[nCnt_IndicesChg];
										} else {
												var sArrow = "unchg";
												oCells[j].className = "tblUnchg";
												oCells[0].innerHTML = "<img src=\"/gc/img/JAChart/" + sArrow + m_sImgArrowEnd + "\">&nbsp;-";
												oCells[j].innerHTML = "-";
												oCells[0].title = "-";
										}
								}
						}
				}
		} else {

				if(m_nTimer != 0){ clearTimeout(m_nTimer); }

				if (m_nExceptionCount < m_nRetryCount) {
						reloadData();
						m_nExceptionCount++;
				} else {
						m_nExceptionCount = 0;
						m_nTimer = setTimeout(m_sScript + ".reloadData()", m_nInterval * 2 * 1000);
				}
		}
	}
	this.loadData_Indices = loadData_Indices;


	function getData(){
		
		//alert("getData()");

		var sData = "";

		try{
			
			switch(getSelOption()){
				
				case m_nTOPMOSTACTIVE	  : sData = m_sMostActiveData;
					break;
				case m_nTOPMOSTGAINERS	: sData = m_sTopGainerData;
					break;
				case m_nTOPMOSTLOSSERS	: sData = m_sTopLoserData;
					break;
				case m_nINDICESDATA	    : sData = m_sIndicesData;
					break;
				case m_nSCOREBOARD      : sData = m_sScoreboardData;
			}
			
		} catch (e) {
			sData = "";
		}

		return sData;
	}
	this.getData = getData;


	function setInterval(vnInterval) {
		m_nInterval = vnInterval;
	}
	this.setInterval = setInterval;


	function getInterval() {
		return m_nInterval;
	}
	this.getInterval = getInterval;


	function setSelOption(vnOption) {
		m_nSelOption = vnOption;
	}
	this.setSelOption = setSelOption;


	function getSelOption() {
		return m_nSelOption;
	}
	this.getSelOption = getSelOption;
	
	function addCommas(nStr) {
		
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		
		var rgx = /(\d+)(\d{3})/;
		
		while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		
		//return x1 + x2;
		return x1;
	}
	this.addCommas = addCommas;
	
}