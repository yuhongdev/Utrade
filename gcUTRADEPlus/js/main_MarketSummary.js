/**
main
----
1. <SCRIPT language=javascript src="/java/marketSummaryData5.js" id=jsData_MktSumm></SCRIPT>
2. body_onload()
	quoteData_MktSumm = new N2NScriptQuote_MktSumm("quoteData_MktSumm", "/java/marketSummaryData5.js", 10);
	quoteData_MktSumm.updateData();
3. 
	<SCRIPT language=javascript src="/java/main_MarketSummary.js"></SCRIPT>
	<script language=javascript>

	var quoteData_MktSumm;

	function select(vnOption) {
		quoteData_MktSumm.select(vnOption);
	}
	function updateData() {
		quoteData_MktSumm.updateData();
	}
	</script>
***/

function N2NScriptQuote_MktSumm(vsScript, vsUrl_Chart, vsUrl_WorldIndices, vsUrl_WorldCurrencies, vnInterval) {

	// Charts
	// KLCIChart_068.png, FBM30Chart_068.png, FBMEMASChart_068.png	
	
	//var aImgChartID   = ["KLCI", "FBM30", "FBMEMAS"];
	var sImgIconPath    = "/gcCIMB/img/Market/";
	var sImgChartPath   = "https://charttb.asiaebroker.com/img/JAChart/";
	var sImgChartBkPath = "http://bursa.n2nconnect.com/img/JAChart/";
	var sChartBHCode = "1818";
	var sChartID = "KLCIChart_1818";
	var sChartSrc = "";
	//var sChartSrc = document.getElementById(sChartID).src;
	
	var sUrl_Image_Fldr = "/gcCIMB/img/Market/";
	//sArrow = "unchg","up","dw";	
	var m_sImgArrowEnd = "arrow.gif";

	var m_nTOPMOSTACTIVE 	= 0;
	var m_nTOPMOSTGAINERS = 1;
	var m_nTOPMOSTLOSSERS	= 2;
	var m_nWORLDCURRENCIES     = 3;
	var m_nWORLDINDICES     = 4;
	var m_nSCOREBOARD     = 5;
	

	var m_nCOUNTERUP 	  = 0;
	var m_nCOUNTERDOWN 	= 1;
	var m_nCOUNTERUNCHG	= 2;

	var m_nCOL_SEP		= "|";
	var m_sBEGINDATA	= "--_BeginData_";
	var m_sENDDATA		= "--_EndData_";

	var m_nSelOption 	    = 0;
	var m_nInterval	 	    = vnInterval;
	var m_nLoadInterval	  = 10;
	var m_nExceptionCount = 0;
	var m_nRetryCount	    = 3;
	var m_nTimer		      = 0;
	
	var m_oJSData;
	var m_sJSData	= "jsData_MktSumm";
	var m_oJSData_ScoreBoard;
	var m_sJSData_ScoreBoard = "jsData_ScoreBoard";
	//var m_oJSData_Indices;
	//var m_sJSData_Indices = "jsData_Indices";
	var m_oJSData_Currencies;
	var m_sJSData_Currencies = "jsData_Currencies";
	var m_oJSData_WorldIndices;
	var m_sJSData_WorldIndices = "jsData_WorldIndices";

	var m_sScript	= vsScript;
	
	var m_sUrl_Chart		  = vsUrl_Chart;
	var m_sUrl_Currencies = vsUrl_WorldCurrencies;
	var m_sUrl_WorldIndices = vsUrl_WorldIndices;
	var m_sUrl_ScoreBoard	= vsUrl_Chart;
	//var m_sUrl_Indices	  = vsUrl_Indices;
	
	var m_sKeep_SelOption = 0;
	
	var nCol_Top_AGL_Name = 1;
	var nCol_Top_AGL_Last = 2;
	var nCol_Top_AGL_Chg  = 3;
	var nRow_oData_Top_AGL = 5;
	var nLen_oData_Top_AGL = (3 * nRow_oData_Top_AGL) + 2;
	var nCol_indexName = 2;

	var m_bLoaded	= false;
	
	
	var nCol_Curr_Stk = 1;
	var nCol_WorldIndex_Name = 1;
	
	
	function updateData() {
		//alert(m_bLoaded);
		if (!m_bLoaded) {
				
				m_bLoaded = true;
			
				m_sKeep_SelOption = getSelOption();				
				//loadData_Indices();
				loadData_ScoreBoard();
				loadData_Top10_AGL();											
				chkRefreshChart();
				loadData_WorldCurrencies();
				loadData_WorldIndices();
				
				//m_nTimer = setTimeout(m_sScript + ".reloadData_WorldCurrencies()", m_nInterval * 1000);
				//m_nTimer = setTimeout(m_sScript + ".reloadData_WorldIndices()", m_nInterval * 1000);
				m_nTimer = setTimeout(m_sScript + ".reloadData()", m_nInterval * 1000);
				m_nTimer = setTimeout(m_sScript + ".reloadData_ScoreBoard()", m_nInterval * 1000);
				//m_nTimer = setTimeout(m_sScript + ".reloadData_Indices()", m_nInterval * 1000);
				
				setSelOption(m_sKeep_SelOption);
		}
	}
	this.updateData = updateData;


	function select(vnOption){

		if (getSelOption() != vnOption){
			
				if (vnOption=="0") {
						document.getElementById("MostActive").src = sUrl_Image_Fldr + "/MostActiveOn.gif";
						document.getElementById("TopGainer").src  = sUrl_Image_Fldr + "/TopGainerOff.gif";
						document.getElementById("TopLoser").src   = sUrl_Image_Fldr + "/TopLoserOff.gif";
						
						document.getElementById("MostActive").style.cursor = "";
						document.getElementById("TopGainer").style.cursor  = "pointer";
						document.getElementById("TopLoser").style.cursor   = "pointer";
						
						setSelOption(vnOption);
						loadData_Top10_AGL();
						//chkRefreshChart();
						
				} else if(vnOption=="1") {
						document.getElementById("MostActive").src = sUrl_Image_Fldr + "/MostActiveOff.gif";
						document.getElementById("TopGainer").src  = sUrl_Image_Fldr + "/TopGainerOn.gif";
						document.getElementById("TopLoser").src   = sUrl_Image_Fldr + "/TopLoserOff.gif";
						
						document.getElementById("MostActive").style.cursor = "pointer";
						document.getElementById("TopGainer").style.cursor  = "";
						document.getElementById("TopLoser").style.cursor   = "pointer";
						
						setSelOption(vnOption);
						loadData_Top10_AGL();
						//chkRefreshChart();
						
				} else if (vnOption=="2") {
						document.getElementById("MostActive").src = sUrl_Image_Fldr + "/MostActiveOff.gif";
						document.getElementById("TopGainer").src  = sUrl_Image_Fldr + "/TopGainerOff.gif";
						document.getElementById("TopLoser").src   = sUrl_Image_Fldr + "/TopLoserOn.gif";
						
						document.getElementById("MostActive").style.cursor = "pointer";
						document.getElementById("TopGainer").style.cursor  = "pointer";
						document.getElementById("TopLoser").style.cursor   = "";
						
						setSelOption(vnOption);
						loadData_Top10_AGL();
						//chkRefreshChart();
				}
		}
	}
	this.select = select;


// =================================================================
// ACTIVE / GAINERS / LOSERS
// =================================================================
	function reloadData() {
		
		var nIndex = -1;
		var sUrl = "";

		m_bLoaded = false;

		sUrl = m_sUrl_Chart;
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
	}
	this.reloadData = reloadData;


	function loadData_Top10_AGL() {
		
		//alert("loadData()");
		var sTemp_Name = "";
		
		var nCnt = 0;
		var nArrowCol = -1;
		var oData = new String(getData()).split(m_nCOL_SEP);
		
		//alert(getData());
				
		var oRows = "";
		
		m_sKeep_SelOption = getSelOption();
		
		oRows = m_oTableData_MktSumm_Equities.rows;
		
		//alert(m_sKeep_SelOption);
		//oData.length >= nLen_oData_Top_AGL && 

		document.getElementById('AGLTime').innerHTML = calculateDateTime();

		if (oData[nCnt++] == m_sBEGINDATA && oData[oData.length-1] == m_sENDDATA) {
				//alert(oRows.length);
				for (var i = 0; i < oRows.length; i=i+1) {
				
				

						k = i;
						if (i==10) break;
						var oCells = oRows[k].cells;
						/*
						if (i == oRows.length) {
								oCells[1].innerHTML = "";
								oCells[2].innerHTML = "";
								oCells[3].innerHTML = "";
								oCells[4].innerHTML = "";
						} else {
						*/
						for (var j = 0; j < oCells.length; j++) {
							
								//if ( (j == 0) || (j == (oCells.length-1)) ) {			
								if (j == 0) {
									//Empty

								} else if (j == 1) { 
									// Column 2 : Name
									nCnt_Name = 3 * i + nCol_Top_AGL_Name;
									if (oData[nCnt_Name]!=null) {
										if (oData[nCnt_Name].length > 11) {
											oCells[1].title = oData[nCnt_Name];
											sTemp_Name = oData[nCnt_Name].substring(0, 11) + "..";
										} else
											sTemp_Name = oData[nCnt_Name];
											
									}
									sTemp_Name = sTemp_Name.replace(/&/g,"&#38;");
									oCells[0].innerHTML = "&nbsp;" + sTemp_Name;
									
								} else if (j == 2) { 
									// Column 3 : Last
									nCnt_Last = 3 * i + nCol_Top_AGL_Last;
									oCells[1].innerHTML = oData[nCnt_Last];
								
								} else if (j == 3) { 
									//Change
									nCnt_Chg  = 3 * i + nCol_Top_AGL_Chg;
									
									var sArrow = "unchg";
									var fVal = parseFloat(oData[nCnt_Chg]);
									var agl = fVal.toFixed(3);
									if (fVal > 0){
											fVal = m_nCOUNTERUP;
											sArrow = "up";
											oCells[2].className = "tblUp";
									} else if (fVal < 0)	{
											fVal = m_nCOUNTERDOWN;
											sArrow = "dw";
											oCells[2].className = "tblDown";	
									} else {
											fVal = m_nCOUNTERUNCHG;
											sArrow = "unchg";
											oCells[2].className = "tblUnchg";
									}
									
									// Column 1 : Images "unchgArrow.png", "upArrow.png", "dwArrow.png"
									oCells[3].innerHTML = "<img src=\"" + sUrl_Image_Fldr + "/" + sArrow + m_sImgArrowEnd + "\">";
									
									// Column 4 : Change
									oCells[2].innerHTML = agl;//oData[nCnt_Chg];
								}
						}
						
						/*
						}
						*/
				}

		} 
		
		else {

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
	this.loadData_Top10_AGL = loadData_Top10_AGL;



// =================================================================
// CHART
// =================================================================
	function refreshChart(oImage_Icon, sImgSrc) {

		var oChart = document.getElementById(sChartID);		
		oChart.onerror = "redirectChartServer(oImage_Icon.id,'png');";
		sUrl = sImgChartPath + oImage_Icon.id + ".png"
		sUrl += (sUrl.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());
		//alert(sUrl);
		oChart.src = sUrl;
	}
	this.refreshChart = refreshChart;	
	/*
	function refreshChart(oImage_Icon, sImgSrc) {

		var oChart = document.getElementById(sChartID);		
		oChart.onerror = "redirectChartServer(oImage_Icon.id,'png');";
		sUrl = sImgChartPath + oImage_Icon.id + ".png"
		sUrl += (sUrl.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());
		//alert(sUrl);
		oChart.src = sUrl;
		document.getElementById('chartTime').innerHTML = calculateDateTime() + "&nbsp;&nbsp;";
	}
	this.refreshChart = refreshChart;


	function redirectChartServer(oImage_Icon_ID, file_type) {	
	
		var objChart = document.images[sChartID];
		var sChartBackupURL = sImgChartBkPath + oImage_Icon_ID + "." + file_type;
		sChartBackupURL += (sChartBackupURL.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());
		objChart.src = sChartBackupURL;
	}
	this.redirectChartServer = redirectChartServer;
	*/
	function chkRefreshChart() {
		var sChart_Url = sChartSrc;//document.getElementById("KLCIChart").src;
		nI = sChart_Url.indexOf(sChartID);
		if (nI > 0)
		{		
			refreshChart(document.getElementById(sChartID), sChart_Url);
		}
	}

	function chgChart_onClick(oImage_Icon, sImgSrc) {

		var sUrl = "";
		var oChart = document.getElementById("FTSEChart");
		//document.getElementById('chartTime').innerHTML = calculateDateTime() + "&nbsp;&nbsp;";
		if (sImgSrc.indexOf("Off") >= 0) {

				// Chart button I clicked, change to On 
				oImage_Icon.src = sImgIconPath + oImage_Icon.id + "On.gif";
				oImage_Icon.style.cursor = "";

				// Others Chart button change to Off
				for (j=0; j < aImgChartID.length; j++) {
					if (aImgChartID[j] != oImage_Icon.id) {
							document.images[aImgChartID[j]].src = sImgIconPath + aImgChartID[j] + "Off.gif";
							document.getElementById(aImgChartID[j]).style.cursor = "pointer";
					}
				}
		}
				// show Chart
				oChart.onerror = "redirectChartServer(oImage_Icon.id,'png');";
				sUrl = sImgChartPath + oImage_Icon.id + "Chart_" + sChartBHCode + ".png"
				sUrl += (sUrl.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());				
				//alert(sUrl);
				oChart.src = sUrl;
	}
	this.chgChart_onClick = chgChart_onClick;


	// change use The Chart in Backup Site
	function redirectChartServer(oImage_Icon_ID, file_type) {	
	
		var objChart = document.images["FTSEChart"];
		var sChartBackupURL = sImgChartBkPath + oImage_Icon_ID + "Chart_" + sChartBHCode + "." + file_type;
		sChartBackupURL += (sChartBackupURL.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());
		objChart.src = sChartBackupURL;
	}
	this.redirectChartServer = redirectChartServer;
	
	function redirectChartServer(oImage_Icon_ID, file_type, sImgChartBkPath) {	
		
		var sChartBackupURL = sImgChartBkPath;
		sChartBackupURL += (sChartBackupURL.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());
		objChart.src = sChartBackupURL;
	}
	this.redirectChartServer = redirectChartServer;	

/**
	// check which Chart we are showing, then refresh it Chart
	function chkRefreshChart() {

		var sChart_Url = document.getElementById("FTSEChart").src;
		//document.getElementById('ChartTime').innerHTML = calculateDateTime();
		document.getElementById('chartTime').innerHTML = calculateDateTime() + "&nbsp;&nbsp;";
		for (i=0; i < aImgChartID.length; i++) {
				nI = sChart_Url.indexOf(aImgChartID[i]);
				if (nI > 0) {
						chgChart_onClick(document.getElementById(aImgChartID[i]), sChart_Url);
						break;	
				}
		}		
	}
*/	
// =================================================================
// WORLD INDICES
// =================================================================
	function reloadData_WorldIndices() {
		
		//alert("reloadData_WorldIndices()");
		runAjax("indices");
		
		var nIndex = -1;
		var sUrl = "";
		
		m_bLoaded = false;

		sUrl = m_sUrl_WorldIndices;
		nIndex = sUrl.indexOf("time");
		
		if (nIndex >= 0)
				sUrl = sUrl.substring(0, nIndex-1);

		sUrl += (sUrl.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());
		//alert(sUrl);

		var head = document.getElementsByTagName("head").item(0);
		m_oJSData_WorldIndices = document.getElementById(m_sJSData_WorldIndices);

		if (m_oJSData_WorldIndices) {
				head.removeChild(m_oJSData_WorldIndices);
		}

		var script = document.createElement('script');
		script.id = m_sJSData_WorldIndices;
		script.src = sUrl;
		script.type = 'text/javascript';
		script.defer = true;
		void(head.appendChild(script));

		m_oJSData_WorldIndices = script;

		setTimeout(m_sScript + ".updateData()", m_nLoadInterval * 1000);
	}
	this.reloadData_WorldIndices = reloadData_WorldIndices;

	function loadData_WorldIndices() {
		
		runAjax("indices");
		var nCnt = 0;		
		
		var rws2 = wi_table.rows;	
		
		m_sKeep_SelOption = getSelOption();
		setSelOption(4);
		var oData = new String(getData()).split(m_nCOL_SEP);
		var datetime = sTime.split("|");
		setSelOption(m_sKeep_SelOption);
				
		var oRows = "";
		
		oRows = m_oTableData_MktSumm_WorldIndices.rows;
		//rws2[1].cells[0].innerHTML = m_sWorldIndicesTime;//calculateDateTime();
		//document.getElementById('timeInd').innerHTML = m_sWorldIndicesTime;
		document.getElementById('timeInd').innerHTML = datetime[1];//m_sWorldIndicesTime;
		document.getElementById('wi_Time').innerHTML = datetime[0];
		if (oData[0] == m_sBEGINDATA && oData[oData.length-1] == m_sENDDATA) {
		
			for (i=0;i<oRows.length;i++)
			{
				//oCells = oRows[i].cells;
				    //j = i + 1;
					nCnt_Col = 3 * i + nCol_WorldIndex_Name;
					
					var cls;
					var fVal = parseFloat(oData[nCnt_Col+2]);
					var sArrow = "unchg";				
					if (fVal > 0){
						fVal = m_nCOUNTERUP;						
						cls = "class=tblUp";
						sArrow = "up";
						
					} else if (fVal < 0)	{
						fVal = m_nCOUNTERDOWN;						
						cls = "class=tblDown";	
						sArrow = "dw";
					} else {
						fVal = m_nCOUNTERUNCHG;
						cls = "class=tblUnchg";	
						sArrow = "unchg";					
					}							
					
										
					if (oData[nCnt_Col].length > 11) {
							oRows[i].cells[0].innerHTML = oData[nCnt_Col];
							sTemp_Name = oData[nCnt_Col].substring(0, 11) + "..";
					} else
							sTemp_Name = oData[nCnt_Col];											
							sTemp_Name = sTemp_Name.replace(/&/g,"&#38;");
					oRows[i].cells[0].innerHTML = sTemp_Name;
					oRows[i].cells[1].innerHTML = oData[nCnt_Col+1];
					oRows[i].cells[2].innerHTML = "<font " + cls + ">" + oData[nCnt_Col+2] + "</font>";
					oRows[i].cells[3].innerHTML = "<img src=\"" + sUrl_Image_Fldr + "/" + sArrow + m_sImgArrowEnd + "\">";
					//rws[2].cell[0].innerHTML="dd+mm+yyyy";
				
			}

		} 
		/*
		else {

			if(m_nTimer != 0){ clearTimeout(m_nTimer); }

			if (m_nExceptionCount < m_nRetryCount) {
					reloadData_WorldIndices();
					m_nExceptionCount++;
			} else {
					m_nExceptionCount = 0;
					m_nTimer = setTimeout(m_sScript + ".reloadData_WorldIndices()", m_nInterval * 2 * 1000);
			}
			
		}*/
	}
	this.loadData_WorldIndices = loadData_WorldIndices;
	
// =================================================================
// WORLD CURRENCIES
// =================================================================
	function reloadData_WorldCurrencies() {
		
		//alert("reloadData_WorldCurrencies()");
		runAjax("currencies");
		var nIndex = -1;
		var sUrl = "";
	
		m_bLoaded = false;

		sUrl = m_sUrl_Currencies;
		nIndex = sUrl.indexOf("time");
		
		if (nIndex >= 0)
				sUrl = sUrl.substring(0, nIndex-1);

		sUrl += (sUrl.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());
		//alert(sUrl);

		var head = document.getElementsByTagName("head").item(0);
		m_oJSData_Currencies = document.getElementById(m_sJSData_Currencies);

		if (m_oJSData_Currencies) {
				head.removeChild(m_oJSData_Currencies);
		}

		var script = document.createElement('script');
		script.id = m_sJSData_Currencies;
		script.src = sUrl;
		script.type = 'text/javascript';
		script.defer = true;
		void(head.appendChild(script));

		m_oJSData_Currencies = script;

		setTimeout(m_sScript + ".updateData()", m_nLoadInterval * 1000);
	}
	this.reloadData_WorldCurrencies = reloadData_WorldCurrencies;


	function loadData_WorldCurrencies() {
		
		//alert("loadData_WorldCurrencies");
		runAjax("currencies");		
		var oRows = "";
		var oData;
		var nCnt = 0;
				
		var rws1 = wc_table.rows;
		
		m_sKeep_SelOption = getSelOption();
		setSelOption(3);
		oData = new String(getData()).split(m_nCOL_SEP);
		var datetime = sTime.split("|");
		setSelOption(m_sKeep_SelOption);	
		
		oRows = m_oTableData_MktSumm_Currencies.rows;			
		//rws1[1].cells[0].innerHTML = m_sWorldCurrenciesTime;//calculateDateTime();
		//document.getElementById('timeCurr').innerHTML = m_sWorldCurrenciesTime;
		document.getElementById('timeCurr').innerHTML = datetime[1];
		document.getElementById('wc_Time').innerHTML = datetime[0];
		if (oData[0] == m_sBEGINDATA && oData[oData.length-1] == m_sENDDATA) {		
		
		
			for (i=0; i < oRows.length; i++)
			{
				//oCells = oRows[i].cells;
				
					nCnt_Col = 3 * i + nCol_Curr_Stk;					
					
								
									
					if (oData[nCnt_Col].length > 11) {
							oRows[i].cells[0].innerHTML = oData[nCnt_Col];
							sTemp_Name = oData[nCnt_Col].substring(0, 11) + "..";
					} else
							sTemp_Name = oData[nCnt_Col];											
							sTemp_Name = sTemp_Name.replace(/&/g,"&#38;");
							
					oRows[i].cells[0].innerHTML = sTemp_Name;
					oRows[i].cells[1].innerHTML = oData[nCnt_Col+1];
					oRows[i].cells[2].innerHTML = oData[nCnt_Col+2];
					
				
			}
				
				
		} 
		/*
		else {

			if(m_nTimer != 0){ clearTimeout(m_nTimer); }

			if (m_nExceptionCount < m_nRetryCount) {
					reloadData_WorldCurrencies();
					m_nExceptionCount++;
			} else {
					m_nExceptionCount = 0;
					m_nTimer = setTimeout(m_sScript + ".reloadData_WorldCurrencies()", m_nInterval * 2 * 1000);
			}
			
		}*/
	  
	}
	this.loadData_WorldCurrencies = loadData_WorldCurrencies;	

	// =================================================================
	// SCOREBOARD
	// =================================================================
		function reloadData_ScoreBoard() {
			
			//alert("reloadData_ScoreBoard()");
			
			var nIndex = -1;
			var sUrl = "";

			m_bLoaded = false;

			sUrl = m_sUrl_ScoreBoard;
			nIndex = sUrl.indexOf("time");
			
			if (nIndex >= 0)
					sUrl = sUrl.substring(0, nIndex-1);

			sUrl += (sUrl.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());
			//alert(sUrl);

			var head = document.getElementsByTagName("head").item(0);
			m_oJSData_ScoreBoard = document.getElementById(m_sJSData_ScoreBoard);

			if (m_oJSData_ScoreBoard) {
					head.removeChild(m_oJSData_ScoreBoard);
			}

			var script = document.createElement('script');
			script.id = m_sJSData_ScoreBoard;
			script.src = sUrl;
			script.type = 'text/javascript';
			script.defer = true;
			void(head.appendChild(script));

			m_oJSData_ScoreBoard = script;

			setTimeout(m_sScript + ".updateData()", m_nLoadInterval * 1000);
		}
		this.reloadData_ScoreBoard = reloadData_ScoreBoard;

		function loadData_ScoreBoard() {
			
			var nCnt = 0;
			
			m_sKeep_SelOption = getSelOption();
			setSelOption(5);
			var oData = new String(getData()).split(m_nCOL_SEP);
			setSelOption(m_sKeep_SelOption);
					
			var oRows = "";
			
			oRows = m_oTableData_MktSumm_Indices_ScoreBoard.rows;

			if (oData[0] == m_sBEGINDATA && oData[6] == m_sENDDATA) {				
					
				for (i = 0; i <= 4; i++)
				{
					var l ;
					
					l = i*2;				
					
					var sArrow = "unchg";
					switch(i){
					
					case 0 		: sArrow = "up";break;
					case 1 		: sArrow = "dw";break;
					case 2,3,4	: sArrow = "unchg";break;
					default     : sArrow = "unchg";
					
					}
					oRows[l].cells[0].innerHTML = "<img src=\"" + sUrl_Image_Fldr + "/" + sArrow + m_sImgArrowEnd + "\">";
					if ((i == 3) || (i == 4))				
						oRows[l].cells[2].innerHTML = addCommas(oData[i+1]);				
					else
						oRows[l].cells[2].innerHTML = oData[i+1];	
					
				}

			} else {

				if(m_nTimer != 0){ clearTimeout(m_nTimer); }

				if (m_nExceptionCount < m_nRetryCount) {
						reloadData_ScoreBoard();
						m_nExceptionCount++;
				} else {
						m_nExceptionCount = 0;
						m_nTimer = setTimeout(m_sScript + ".reloadData_ScoreBoard()", m_nInterval * 2 * 1000);
				}
				
			}
		}
		this.loadData_ScoreBoard = loadData_ScoreBoard;

// =================================================================



	function getData() {
		
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
				case m_nWORLDCURRENCIES : sData = m_sWorldCurrenciesData;sTime = m_sWorldCurrenciesTime;
				    break;
				case m_nWORLDINDICES    : sData = m_sWorldIndicesData;sTime = m_sWorldIndicesTime;
				    break;
				case m_nSCOREBOARD    : sData = m_sScoreboardData;
					break;
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
		//alert(x[1]);
		
		var rgx = /(\d+)(\d{3})/;
		
		while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		
		return x1 + x2;
		//return x1;
	}
	this.addCommas = addCommas;
	
	function calculateDateTime()
	{
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();
		
		var hh = today.getHours();
		var min = today.getMinutes();
		var ss = today.getSeconds();
		var _24hh = hh;
		
		if (dd < 10){ 
			dd = '0'+ dd;
		}
		
		if(mm <10){
			mm = '0'+ mm;
		}	
		
		if (hh > 12) {
      		hh = hh - 12;
      		add = " PM ";
    	} else {
      		hh = hh;
      		add = " AM ";
    	}
    	if (hh == 12) {
      		add = " PM ";
    	}
    	if (hh == 00) {
      		hh = "12";
    	}
    	if (hh < 10) {
    		hh = "0" + hh;
    	}
    	if (min < 10) {
    		min = "0" + min;
    	}
    	if (ss < 10) {
    		ss = "0" + ss;
    	}
    	
    		
    	return dd + "/" + mm +  "/" + yyyy + " " + _24hh + ":" + min + ":" + ss ;//+ add;
	}
	this.calculateDateTime = calculateDateTime;

/**
sKeepImg.src = document.getElementById("SGXChart").src;
				
sUrl = sUrl_SGXChart[0];
sUrl += (sUrl.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());
document.getElementById("SGXChart").src = sUrl;
				
document.getElementById("SGXChart").onerror = function (evt) { 
	sUrl = sUrl_SGXChart[1];
	sUrl += (sUrl.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());
	document.getElementById("SGXChart").src = sUrl;
}
				
document.getElementById("SGXChart").onerror = function (evt) { 
	document.getElementById("SGXChart").src = sKeepImg.src;
}
**/
}