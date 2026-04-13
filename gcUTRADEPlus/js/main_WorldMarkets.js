function N2NScriptQuote(vsScript, vsUrl, vnInterval) {

	var m_nWorldMarkets_INDICESDATA = 0;
	var m_nWorldMarkets_DATETIME    = 1;

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
	var m_sImgArrowEnd = "arrow.gif";
	
	var m_sKeep012SelOption = 0;
	
	var IndicesName_Sort = ["Bangkok Set","DJIA","Shanghai","Hang Seng","Jakarta Comp","KLSE","Nikkei","Strait Times"];
	
	var nCol_IndicesName = 1;
	var nCol_IndicesLast = 2;
	var nCol_IndicesChg  = 3;
	var nRow_oData_Indices = 3;
	var nLen_oData_Indices = IndicesName_Sort.length * 3 + 2;

	function updateData() {
		
		//alert("updateData()");
		
		if (!m_bLoaded) {
			
				m_bLoaded = true;
				
				setSelOption(0);
				var oData = new String(getData()).split(m_nCOL_SEP);

				//if (oData.length >= nLen_oData_Indices) {
						//if ( (oData[0] == m_sBEGINDATA) && (oData[oData.length-1] == m_sENDDATA) ) {
								loadData_Indices();
						//}
				//}

				m_nTimer = setTimeout(m_sScript + ".reloadData()", m_nInterval * 1000);
		}
	}
	this.updateData = updateData;

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

	function srch_IndicesName(IndicesName_Sort_data) {
		
			var res = new Number(0);
			
			var oData = new String(getData()).split(m_nCOL_SEP);
			//var oRows = m_oTableData.rows;
			
			var oData_rows = new Number(0);
			
			if ((oData.length>2) && (nRow_oData_Indices!=0))
					oData_rows = ((oData.length - 2) / nRow_oData_Indices) * 1;			
			
			for (var k=0; k<oData_rows ; k++) {
								
					nCnt_IndicesName = k * nRow_oData_Indices + nCol_IndicesName;
					
					if (IndicesName_Sort_data.indexOf(oData[nCnt_IndicesName]) > -1) {
							res = k;
							break;
					} 
			}

			return res;
	}
	this.srch_IndicesName = srch_IndicesName;

	function loadData_Indices() {
		
		//alert("loadData_Indices()");

		var k    = new Number(0);
		var nCnt = new Number(0);

		var oData = new String(getData()).split(m_nCOL_SEP);
				
		var oRows = m_oTableData.rows;

		if (oData.length >= nLen_oData_Indices && oData[nCnt] == m_sBEGINDATA && oData[oData.length-1] == m_sENDDATA) {
			
				for (var i = 0; i < oRows.length; i=i+2) {

						//var m = i * 2;
						var oCells = oRows[i].cells;
						
						k = (i/2);
						//k = srch_IndicesName(IndicesName_Sort[i]);
						//alert(srch_IndicesName(IndicesName_Sort[i]));

						for (var j = 0; j < oCells.length; j++) {
					
								if (j == 0) {
										nCnt_IndicesName = k * nRow_oData_Indices + nCol_IndicesName;
										oCells[j].innerHTML = "&nbsp;" + oData[nCnt_IndicesName];
								} else if (j == 1) {
										nCnt_Last = k * nRow_oData_Indices + nCol_IndicesLast;
										oCells[j].innerHTML = oData[nCnt_Last];
								} else if (j == 2) {
									
										nCnt_IndicesChg  = k * nRow_oData_Indices + nCol_IndicesChg;
										var sArrow = "unchg";
										var fVal = parseFloat(oData[nCnt_IndicesChg]);

										if (fVal > 0){
												fVal = m_nCOUNTERUP;
												sArrow = "up";
												oCells[j+1].className = "tblUp";
												oCells[j].innerHTML = "<img src=\"/gcCIMB/img/Market/" + sArrow + m_sImgArrowEnd + "\">";
										} else if (fVal < 0)	{
												fVal = m_nCOUNTERDOWN;
												sArrow = "dw";
												oCells[j+1].className = "tblDown";
												oCells[j].innerHTML = "<img src=\"/gcCIMB/img/Market/" + sArrow + m_sImgArrowEnd + "\">";
										} else {
												fVal = m_nCOUNTERUNCHG;
												sArrow = "unchg";
												oCells[j+1].className = "tblUnchg";
												oCells[j].innerHTML = "<img src=\"/gcCIMB/img/Market/" + sArrow + m_sImgArrowEnd + "\">";
										}
									
								} else if (j == oCells.length-1)	{
										nCnt_IndicesChg  = k * nRow_oData_Indices + nCol_IndicesChg;
										oCells[j].innerHTML = oData[nCnt_IndicesChg] + "&nbsp;";
								}
						}
				}
				
				setSelOption(1);
				var oData_DT = new String(getData()).split(m_nCOL_SEP);
				if (oData_DT.length == 4 && oData_DT[0] == m_sBEGINDATA && oData[oData.length-1] == m_sENDDATA) {
						document.getElementById("date").innerHTML = oData_DT[1];
						document.getElementById("time").innerHTML = oData_DT[2];
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

		try {
			
			switch(getSelOption()){
				
				case m_nWorldMarkets_INDICESDATA : sData = m_sWorldMarketIndicesData;
					break;
				case m_nWorldMarkets_DATETIME : sData = m_sDateTime;
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
		
		//return x1 + x2;
		return x1;
	}
	this.addCommas = addCommas;
	
}