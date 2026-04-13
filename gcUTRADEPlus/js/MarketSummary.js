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

function N2NScriptQuote_MktSumm(vsScript, vsUrl_Chart, vsUrl_Indices, vsUrl_ScoreBoard, vnInterval) {

	// Charts
	// KLCIChart_068.png, FBM30Chart_068.png, FBMEMASChart_068.png	
	
	
	var sImgIconPath    = "/gcCIMB/img/Market/";
	var sImgChartPath   = "http://chartwc.asiaebroker.com/img/JAChart/";
	var sImgChartBkPath = "http://charttb.asiaebroker.com/img/JAChart/";
	var sChartBHCode = "0653";
	var sChartID = "KLCIChart_0653";
	var sChartSrc = document.getElementById(sChartID).src;
	
	var sUrl_Image_Fldr = "/gcCIMB/img/Market";
	//sArrow = "unchg","up","dw";	
	var m_sImgArrowEnd = "Arrow.png";

	var m_nTOPMOSTACTIVE 	= 0;
	var m_nTOPMOSTGAINERS = 1;
	var m_nTOPMOSTLOSSERS	= 2;
	var m_nSCOREBOARD     = 3;
	var m_nINDICES        = 4;
	var m_nDERIVATIVEDATA_FCPO = 5;
	var m_nDERIVATIVEDATA_FKLI = 6;

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
	var m_oJSData_Indices;
	var m_sJSData_Indices = "jsData_Indices";

	var m_sScript	= vsScript;
	
	var m_sUrl_Chart		  = vsUrl_Chart;
	var m_sUrl_ScoreBoard	= vsUrl_ScoreBoard;
	var m_sUrl_Indices	  = vsUrl_Indices;
	
	var m_sKeep_SelOption = 0;
	
	var nCol_Top_AGL_Name = 1;
	var nCol_Top_AGL_Last = 2;
	var nCol_Top_AGL_Chg  = 3;
	var nRow_oData_Top_AGL = 5;
	var nLen_oData_Top_AGL = (3 * nRow_oData_Top_AGL) + 2;
	var nCol_indexName = 2;

	var m_bLoaded	= false;
	
	
	function updateData() {
		
		if (!m_bLoaded) {
			
				m_bLoaded = true;
			
				m_sKeep_SelOption = getSelOption();				
				//loadData_Indices();
				loadData_SpotMonthData();
				loadData_ScoreBoard();
				loadData_Top5_AGL();											
				chkRefreshChart();
					
				m_nTimer = setTimeout(m_sScript + ".reloadData()", m_nInterval * 1000);
				m_nTimer = setTimeout(m_sScript + ".reloadData_ScoreBoard()", m_nInterval * 1000);
				//m_nTimer = setTimeout(m_sScript + ".reloadData_Indices()", m_nInterval * 1000);
				m_nTimer = setTimeout(m_sScript + ".reloadData_SpotMonthData()", m_nInterval * 1000);
				
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
						loadData_Top5_AGL();
						chkRefreshChart();
						
				} else if(vnOption=="1") {
						document.getElementById("MostActive").src = sUrl_Image_Fldr + "/MostActiveOff.gif";
						document.getElementById("TopGainer").src  = sUrl_Image_Fldr + "/TopGainerOn.gif";
						document.getElementById("TopLoser").src   = sUrl_Image_Fldr + "/TopLoserOff.gif";
						
						document.getElementById("MostActive").style.cursor = "pointer";
						document.getElementById("TopGainer").style.cursor  = "";
						document.getElementById("TopLoser").style.cursor   = "pointer";
						
						setSelOption(vnOption);
						loadData_Top5_AGL();
						chkRefreshChart();
						
				} else if (vnOption=="2") {
						document.getElementById("MostActive").src = sUrl_Image_Fldr + "/MostActiveOff.gif";
						document.getElementById("TopGainer").src  = sUrl_Image_Fldr + "/TopGainerOff.gif";
						document.getElementById("TopLoser").src   = sUrl_Image_Fldr + "/TopLoserOn.gif";
						
						document.getElementById("MostActive").style.cursor = "pointer";
						document.getElementById("TopGainer").style.cursor  = "pointer";
						document.getElementById("TopLoser").style.cursor   = "";
						
						setSelOption(vnOption);
						loadData_Top5_AGL();
						chkRefreshChart();
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


	function loadData_Top5_AGL() {
		
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

		if (oData[nCnt++] == m_sBEGINDATA && oData[oData.length-1] == m_sENDDATA) {
				//alert(oRows.length);
				for (var i = 0; i < oRows.length; i=i+1) {
				
				

						k = i;//2*i;
						if (i==5) break;
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
									if (oData[nCnt_Name].length > 11) {
											oCells[0].title = oData[nCnt_Name];
											sTemp_Name = oData[nCnt_Name].substring(0, 11) + "..";
									} else
											sTemp_Name = oData[nCnt_Name];
											
									sTemp_Name = sTemp_Name.replace(/&/g,"&#38;");
									oCells[0].innerHTML = "&nbsp;"+sTemp_Name;
									
								} else if (j == 2) { 
									// Column 3 : Last
									nCnt_Last = 3 * i + nCol_Top_AGL_Last;
									oCells[1].innerHTML = oData[nCnt_Last];
								
								} else if (j == 3) { 
									//Change
									nCnt_Chg  = 3 * i + nCol_Top_AGL_Chg;
									
									var sArrow = "unchg";
									var fVal = parseFloat(oData[nCnt_Chg]);
									var aglData = fVal.toFixed(3);
									if (fVal > 0){
											fVal = m_nCOUNTERUP;
											sArrow = "up";
											oCells[3].className = "tblUp";
									} else if (fVal < 0)	{
											fVal = m_nCOUNTERDOWN;
											sArrow = "dw";
											oCells[3].className = "tblDown";	
									} else {
											fVal = m_nCOUNTERUNCHG;
											sArrow = "unchg";
											oCells[3].className = "tblUnchg";
									}
									
									// Column 1 : Images "unchgArrow.png", "upArrow.png", "dwArrow.png"
									oCells[2].innerHTML = "<img src=\"" + sUrl_Image_Fldr + "/" + sArrow + m_sImgArrowEnd + "\">";
									
									// Column 4 : Change
									oCells[3].innerHTML = aglData ; //oData[nCnt_Chg] + "&nbsp;";
								}
						}
						
						/*
						}
						*/
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
	this.loadData_Top5_AGL = loadData_Top5_AGL;

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
		setSelOption(3);
		var oData = new String(getData()).split(m_nCOL_SEP);
		setSelOption(m_sKeep_SelOption);
				
		var oRows = "";
		
		oRows = m_oTableData_MktSumm_Indices_ScoreBoard.rows;

		if (oData[0] == m_sBEGINDATA && oData[13] == m_sENDDATA) {				
				
			/* for (i = 0; i <= 4; i++)
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
				
			}*/
			document.getElementById('MktSummOpen').innerHTML = ":&nbsp;"+oData[2];
			document.getElementById('MktSummHigh').innerHTML = ":&nbsp;"+oData[4];
			document.getElementById('MktSummLow').innerHTML = ":&nbsp;"+oData[5];
			document.getElementById('MktSummVol').innerHTML = ":&nbsp;"+addCommas(oData[11]);
			document.getElementById('MktSummTtl').innerHTML = ":&nbsp;"+addCommas(oData[12]);
			document.getElementById('MktSummUp').innerHTML = "&nbsp;"+oData[8]+"&nbsp;";
			document.getElementById('MktSummDwn').innerHTML = "&nbsp;"+oData[9]+"&nbsp;";
			document.getElementById('MktSummUnchg').innerHTML = "&nbsp;"+oData[10]+"&nbsp;";

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
// INDICES
// =================================================================
	function reloadData_Indices() {
		
		//alert("reloadData_Indices()");
		
		var nIndex = -1;
		var sUrl = "";

		m_bLoaded = false;

		sUrl = m_sUrl_Indices;
		nIndex = sUrl.indexOf("time");
		
		if (nIndex >= 0)
				sUrl = sUrl.substring(0, nIndex-1);

		sUrl += (sUrl.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());
		//alert(sUrl);

		var head = document.getElementsByTagName("head").item(0);
		m_oJSData_Indices = document.getElementById(m_sJSData_Indices);

		if (m_oJSData_Indices) {
				head.removeChild(m_oJSData_Indices);
		}

		var script = document.createElement('script');
		script.id = m_sJSData_Indices;
		script.src = sUrl;
		script.type = 'text/javascript';
		script.defer = true;
		void(head.appendChild(script));

		m_oJSData_Indices = script;

		setTimeout(m_sScript + ".updateData()", m_nLoadInterval * 1000);
	}
	this.reloadData_Indices = reloadData_Indices;

	function loadData_Indices() {
		
		var nCnt = 0;
		
		m_sKeep_SelOption = getSelOption();
		setSelOption(4);
		var oData = new String(getData()).split(m_nCOL_SEP);
		setSelOption(m_sKeep_SelOption);
				
		var oRows = "";
		
		oRows = m_oTableData_MktSumm_Indices.rows;

		if (oData[0] == m_sBEGINDATA && oData[oData.length-1] == m_sENDDATA) {
		
			for (i=0;i<oRows.length;i++)
			{
				//oCells = oRows[i].cells;
				    
				    var j;
				    
				    j = i*2;
				    
				    if (i==5) break;
				
					nCnt_Col = 7 * i + nCol_indexName;
					
					var sArrow = "unchg";
					var fVal = parseFloat(oData[nCnt_Col+5]);
					var indData = fVal.toFixed(2);				
					if (fVal > 0){
						fVal = m_nCOUNTERUP;
						sArrow = "up";
						oRows[j].cells[3].className = "tblUp";
					} else if (fVal < 0)	{
						fVal = m_nCOUNTERDOWN;
						sArrow = "dw";
						oRows[j].cells[3].className = "tblDown";	
					} else {
						fVal = m_nCOUNTERUNCHG;
						sArrow = "unchg";
						oRows[j].cells[3].className = "tblUnchg";
					}
									
					
					oRows[j].cells[0].innerHTML = "<img src=\"" + sUrl_Image_Fldr + "/" + sArrow + m_sImgArrowEnd + "\">";					
					if (oData[nCnt_Col].length > 11) {
							oRows[j].cells[1].innerHTML = oData[nCnt_Col];
							sTemp_Name = oData[nCnt_Col].substring(0, 11) + "..";
					} else
							sTemp_Name = oData[nCnt_Col];											
							sTemp_Name = sTemp_Name.replace(/&/g,"&#38;");
					oRows[j].cells[1].innerHTML = "&nbsp;"+sTemp_Name;
					oRows[j].cells[2].innerHTML = oData[nCnt_Col+4];
					oRows[j].cells[3].innerHTML = indData; //oData[nCnt_Col+5];
				
			}

		} else {

			if(m_nTimer != 0){ clearTimeout(m_nTimer); }

			if (m_nExceptionCount < m_nRetryCount) {
					reloadData_Indices();
					m_nExceptionCount++;
			} else {
					m_nExceptionCount = 0;
					m_nTimer = setTimeout(m_sScript + ".reloadData_Indices()", m_nInterval * 2 * 1000);
			}
			
		}
	}
	this.loadData_Indices = loadData_Indices;
	

// =================================================================
// SPOTMONTHDATA
// =================================================================

    function reloadData_SpotMonthData() {
		
		//alert("reloadData_SpotMonthData()");
		
		var nIndex = -1;
		var sUrl = "";

		m_bLoaded = false;

		sUrl = m_sUrl_Indices;
		nIndex = sUrl.indexOf("time");
		
		if (nIndex >= 0)
				sUrl = sUrl.substring(0, nIndex-1);

		sUrl += (sUrl.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());
		//alert(sUrl);

		var head = document.getElementsByTagName("head").item(0);
		m_oJSData_Indices = document.getElementById(m_sJSData_Indices);

		if (m_oJSData_Indices) {
				head.removeChild(m_oJSData_Indices);
		}

		var script = document.createElement('script');
		script.id = m_sJSData_Indices;
		script.src = sUrl;
		script.type = 'text/javascript';
		script.defer = true;
		void(head.appendChild(script));

		m_oJSData_Indices = script;

		setTimeout(m_sScript + ".updateData()", m_nLoadInterval * 1000);
	}
	this.reloadData_SpotMonthData = reloadData_SpotMonthData;

    function loadData_SpotMonthData() {
		
		var nCnt = 0;
		
		m_sKeep_SelOption = getSelOption();
		setSelOption(5);
		var oData = new String(getData()).split(m_nCOL_SEP);
		setSelOption(m_sKeep_SelOption);
				
		var oRows = "";
		
		oRows = m_oTableData_MktSumm_Indices.rows;				
			
			
	    if(oData.length > 0){
			
			oRows[0].cells[0].innerHTML = "&nbsp;"+oData[0];
			oRows[0].cells[1].innerHTML = oData[1];	
			
			        var fVal = parseFloat(oData[3]);
					var indData = fVal.toFixed(2);				
					if (fVal > 0){
						fVal = m_nCOUNTERUP;
						sArrow = "up";
						//oRows[0].cells[3].className = "tblUp";
					} else if (fVal < 0)	{
						fVal = m_nCOUNTERDOWN;
						sArrow = "dw";
						//oRows[0].cells[3].className = "tblDown";	
					} else {
						fVal = m_nCOUNTERUNCHG;
						sArrow = "unchg";
						//oRows[0].cells[3].className = "tblUnchg";
					}
									
					
			oRows[0].cells[2].innerHTML = "<img src=\"" + sUrl_Image_Fldr + "/" + sArrow + m_sImgArrowEnd + "\">";					
			oRows[0].cells[3].innerHTML = oData[2];
					
			
        }
		
		
		m_sKeep_SelOption = getSelOption();
		setSelOption(6);
		oData = new String(getData()).split(m_nCOL_SEP);
		setSelOption(m_sKeep_SelOption);
		
		if(oData.length > 0){
			
			oRows[1].cells[0].innerHTML = "&nbsp;"+oData[0];
			oRows[1].cells[1].innerHTML = "&nbsp;"+oData[1];	
			
			        var fVal = parseFloat(oData[3]);
					var indData = fVal.toFixed(2);				
					if (fVal > 0){
						fVal = m_nCOUNTERUP;
						sArrow = "up";
						//oRows[0].cells[3].className = "tblUp";
					} else if (fVal < 0)	{
						fVal = m_nCOUNTERDOWN;
						sArrow = "dw";
						//oRows[0].cells[3].className = "tblDown";	
					} else {
						fVal = m_nCOUNTERUNCHG;
						sArrow = "unchg";
						//oRows[0].cells[3].className = "tblUnchg";
					}
									
					
			oRows[1].cells[2].innerHTML = "<img src=\"" + sUrl_Image_Fldr + "/" + sArrow + m_sImgArrowEnd + "\">";					
			oRows[1].cells[3].innerHTML = "&nbsp;"+oData[2];	
			

		} 
		
		if(oData.length <= 0) {

			if(m_nTimer != 0){ clearTimeout(m_nTimer); }

			if (m_nExceptionCount < m_nRetryCount) {
					reloadData_SpotMonthData();
					m_nExceptionCount++;
			} else {
					m_nExceptionCount = 0;
					m_nTimer = setTimeout(m_sScript + ".reloadData_SpotMonthData()", m_nInterval * 2 * 1000);
			}
			
		}
		
		
	}
	this.loadData_SpotMonthData = loadData_SpotMonthData;



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


	function redirectChartServer(oImage_Icon_ID, file_type) {	
	
		var objChart = document.images[sChartID];
		var sChartBackupURL = sImgChartBkPath + oImage_Icon_ID + "." + file_type;
		sChartBackupURL += (sChartBackupURL.indexOf("?") >=0 ? "&" : "?") + "time="+(new Date().getTime());
		objChart.src = sChartBackupURL;
	}
	this.redirectChartServer = redirectChartServer;
	
	function chkRefreshChart() {
		
		var sChart_Url = sChartSrc;//document.getElementById("KLCIChart").src;
		nI = sChart_Url.indexOf(sChartID);
		if (nI > 0)
		{		
			refreshChart(document.getElementById(sChartID), sChart_Url);
		}
						
				
	}
// =================================================================


	function getData() {
		
		//alert("getData()");

		var sData = "";

		try{
			
			switch(getSelOption()){
			
				case m_nTOPMOSTACTIVE	  : sData = m_sMostActiveData_KL;
					break;
				case m_nTOPMOSTGAINERS	: sData = m_sTopGainerData_KL;
					break;
				case m_nTOPMOSTLOSSERS	: sData = m_sTopLoserData_KL;
					break;
				case m_nSCOREBOARD	    : sData = m_sMktSummData_;
					break;
				case m_nINDICES	    		: sData = m_sIndicesData_KL;
					break;
				case m_nDERIVATIVEDATA_FCPO : sData = m_sDerivativeData_FCPO;
				    break;
				case m_nDERIVATIVEDATA_FKLI : sData = m_sDerivativeData_FKLI;
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
		
		var rgx = /(\d+)(\d{3})/;
		
		while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		
		
		return x1 + x2;
		//return x1;
	}
	this.addCommas = addCommas;

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