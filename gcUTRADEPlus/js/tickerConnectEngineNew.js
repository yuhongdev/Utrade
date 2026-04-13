onerror = handleErrors;
/*******************************************************************************
*Title			:	General Ticker Scroller Engine with set, get, interval, ...
*Author			:	Wong Zi Wei
*contributors	:	-
*Date			:	05/07/05
********************************************************************************/
function tickerConnectEngineNew() {
	//var tce = tickerConnectEngineNew.prototype;

	//===================================
	//---Customize Global Variable---
	//===================================
	var m_sDelim = new String("|");
	var m_sBlank = new String("&nbsp;");
	var m_sBlank2 = new String("&nbsp;&nbsp;");
	var m_sBlank3 = new String("&nbsp;&nbsp;&nbsp;");
	var m_sBlank4 = new String("&nbsp;&nbsp;&nbsp;&nbsp;");
	var m_sBlank5 = new String("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");

	//---Indices---
	//|Code|Name|?|?|?|Index|Col|
	//|0   |1	|2|3|4|5	|6  |
	var m_iIndicesCodeCol = new Number(0);
	var m_iIndicesNameCol  = new Number(1);
	var m_iIndicesIndexCol = new Number(5);	
	var m_iIndicesChgCol   = new Number(6);

	//---Color---
	var m_iColorUpCol = new Number(0);
	var m_iColorDwCol = new Number(1);
	var m_iColorUcCol = new Number(2);
	var m_iColorUtcol = new Number(3);
	
	//---AnnouncementText---	
	var m_iTextCol     = new Number(0);	//Powered by N2N Connect
	var m_iTextInitCol = new Number(1);	//Kenwealth
	var m_iTextEndCol  = new Number(2);	//Happy Trading

	//---Setting---
	var m_iFontSize = new Number(0);
	var m_iWidth	= new Number(1);
	var m_iSpeed	= new Number(2);

	//---Localize settings
	var m_sFontFace = new String("wingdings 3");
	var m_sColorLk = new String("#FFFFFF");	//link text color
	var m_sColorUp = new String("#00FF00"); //Up Color
	var m_sColorDw = new String("#FF0000"); //Down Color
	var m_sColorUc = new String("#FFFF00");	//Unchg Color
	var m_sColorUt = new String("#FFFF00"); //Untrade Color

	var m_sOLWInit = new String("<a class='Ex0' href=\"javascript:OpenLinkWindow('");
	var m_sOLWEnd = new String("', 'Url', 'left=150,top=100,width=720,height=350,location=yes,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes');\">");

	//var m_sIndicesTrackerUrlDef = new String("http://www.kenwealth.com/bin/stkIndicesTracker.asp");	//http://www.kenwealth.com/bin/stkIndicesTracker.asp
	var m_sInitContent = new String("Powered By N2N CONNECT");
	var m_sAnctInit = new String("");	  //Kenwealth
	var m_sAnctEnd  = new String("");  	  //Happy Trading
	//--------------------

	//===================================
	//---Ticker Scroller Setting---
	//===================================
	var m_iInterval;
	var m_iIntervalID; 
	//var objHit = new Object();
	var m_iIntervalTimerInit = new Number(0);		//init refresh timer, straight away refresh.
	var m_iIntervalTimerThread = new Number(5000);	//auto refresh, chg content after 10 seconds.
	var m_bFlag = new Boolean(false);

	//Global Variable
	var m_sQuoteDate = new String("");
	var m_sQuoteTime = new String("");
	var m_sData = new String("");
	//var m_iTotRowCnt = new Number(0);
	var m_iTotColCnt = new Number(0);
	//var m_sIndicesTrackerUrl = new String("");
	var m_sColor = new String("");
	var m_sAnnouncementText = new String("");
	var m_sAnnouncementColor = new String("");
	var m_sAnnouncementUrl = new String("");
	var m_sSetting = new String("");
	var m_sTickerType = new String("");		//Indices Summary, Alert Setting, Order Status, General
	var m_sFontSize = new String("");
	var m_sTickerUrl = new String("");
	//this is to support fast quote
	var m_sStkCode = new String("");
	var m_sStkName = new String("");
	var m_sLastDone = new String("");
	var m_sChange = new String("");
	var m_sHigh = new String("");
	var m_sLow = new String("");
	var m_sBuy = new String("");
	var m_sSell = new String("");
	var m_sVolume = new String("");
	var m_sOpen = new String("");

	//===================================
	//---Indices Data Array---
	//===================================
	var m_iInitRow = new Number(0);
	var m_sStartFont = new String ("<span style='FONT-WEIGHT: normal;FONT-FAMILY: Verdana;FONT-SIZE:");
	var m_sMiddleFont= new String(";Color:");
	var m_sCloseFont = new String("</span>");
	var m_sDateTime = new String("");
	//var m_asIndices = new Array();
	var m_iIndexCnt = new Number(0);
	//var m_iCnt = new Number(0);
	var m_iDelimIndex = new Number(0);
	var m_iIndex = new Number(0);
	var m_sAllContent = new String("");
	var m_sAnnouncementContent = new String("");	

	var m_sQuoteDateEg = new String("");
	var m_sQuoteTimeEg = new String("");
	var m_sDataEg = new String("");
	//var	m_iTotRowCntEg = new Number(0);
	var	m_iTotColCntEg = new Number(0);
	//var m_sIndicesTrackerUrlEg = new String("");

	var m_asColor;
	var m_asAnnouncementText;
	var m_asAnnouncementColor;
	var m_asAnnouncementUrl;
	
	var m_asSetting;
	var m_iLoop = new Number(0);
	
	
	function refreshThread()
	{
		//*** In javascript plz convert var, string to Number by parseInt..., keep in mind
		var bFlag = new Boolean(false);	//Boolean capital 'B'
		try{
			m_sQuoteDateEg = getQuoteDate();
			m_sQuoteTimeEg = getQuoteTime();
			m_sDataEg   = getData();
			//m_iTotRowCntEg = parseInt(getTotRowCnt());
			if (getTotColCnt() != "")
				m_iTotColCntEg = parseInt(getTotColCnt());	
			//m_sIndicesTrackerUrlEg = getDataTrackerUrl();
			m_sColorEg = getColor();
			m_sAnnouncementTextEg = getAnnouncementText();
			m_sSettingEg = getSetting();

			//bFlag = true;
		}catch(e){
			//Error show nothing
			m_sDataEg   = "";
			//m_iTotRowCntEg = 0;
			m_iTotColCntEg = 0;
			//m_sIndicesTrackerUrlEg = m_sIndicesTrackerUrlDef;	//when error occur, use kenwealth default.

		}
		bFlag = cropSetting();
		if(bFlag){ run(); }

	}
	this.refreshThread = refreshThread;
	
	//===================================
	//---Crop Configuration Setting---
	//===================================
	function cropSetting()
	{
		var bFlag = new Boolean(true);
		var iDelimIndex = new Number(0);
		var iIndexInit = new Number(0);
		var iIndex = new Number(0);
		var sVal = new String("");
		var iVal = new Number(0);

		try{
			//---Color---
			if (m_sColor.length > 0) {
				m_asColor = new Array();
				m_asColor = m_sColor.split("|");
			}
		}catch(e){
			bFlag = false;
			alert("cropSetting:Color:e=["+e+"]");
		};
	
		try{
			//---AnnouncementText---
			if (m_sAnnouncementText.length > 0) {
				m_asAnnouncementText = new Array();
				m_asAnnouncementText = m_sAnnouncementText.split("|");
			}
			//---AnnouncementColor---
			if (m_sAnnouncementColor.length > 0) {
				m_asAnnouncementColor = new Array();
				m_asAnnouncementColor = m_sAnnouncementColor.split("|");
			}			
			
			//---AnnouncementUrl---
			if (m_sAnnouncementUrl.length > 0) {
				m_asAnnouncementUrl = new Array();
				//m_asAnnouncementUrl = m_sAnnouncementUrl.split("|");
			}						
		}catch(e){
			bFlag = false;
			alert("cropSetting:AnnouncementText:e=["+e+"]");
		}

		try{
			//---Setting---
			if (m_sSetting.length > 0) {
				m_asSetting = new Array();
				m_asSetting = m_sSetting.split("|");				
			}
		}catch(e){
			bFlag = false;
			alert("cropSetting:Setting:e=["+e+"]");
		}
		return bFlag;
	}	
	
	this.cropSetting = cropSetting;
	
	//===================================
	//---Set Ticker Info Engine---
	//===================================

/*	function setTickerInfo()
	{
		m_sAllContent = "";

		var sName = new String("");		
		var fChg = 0.00;
		var sContent = new String("");	
		var sTempContent = new String("");
		var asData = new Array();
		m_iLoop = 0;
		
		m_bFlag = true;		
		
		if(m_bFlag){		
			try{	
				if (m_sData != "") {
					asData = m_sData.split("|");
					if (asData != null && asData.length > 0) {						
						for (m_iLoop=0; m_iLoop<asData.length; m_iLoop=parseInt(m_iLoop)+parseInt(m_iTotColCnt)) {							
							m_iLoop = parseInt(m_iLoop);							
							sName = asData[m_iLoop+1];
							sUrl = "http://" + this.location.host + m_sTickerUrl + "?indexCode=" + asData[m_iLoop] + "&amp;indexName=" + sName;
							fChg = parseFloat(asData[m_iLoop+6]);
							//m_sStartFont + m_sFontSize + m_sMiddleFont + "#FFFFFF'>"
sContent += m_sStartFont + m_sFontSize + ";'><b>" + sName + "</span></b>" + m_sBlank;
//sContent += m_sOLWInit + sUrl + m_sOLWEnd + m_sStartFont + m_sFontSize + ";'><b>" + sName + "</span></b>" + m_sBlank;
							//alert(sContent);
							sTempContent = m_sStartFont + m_sFontSize + m_sMiddleFont ;
							if (fChg == 0) {
								sTempContent += m_asColor[m_iColorUcCol];
							} else if (fChg > 0) {
								sTempContent += m_asColor[m_iColorUpCol];
							} else if (fChg < 0) {
								sTempContent += m_asColor[m_iColorDwCol];
							}
							sTempContent += "'><b>" + asData[m_iLoop+5] + m_sBlank + asData[m_iLoop+6] + "</b></span></a>" + m_sBlank5;
							sContent += sTempContent;	
							sTempContent = "";
						}
					}
				}
				
				sContent += m_sCloseFont;
				setAllContent(sContent);
				
			}catch(exc){
				alert("!!! Critical Error in Indices Data Array,exc=["+exc+"]");
				alert(exc.message);
			}
		}else{
			alert("False...Not binding");	//comment when live!
		}
	}
*/
	function setTickerInfo()
	{
		m_sAllContent = "";

		var sName = new String("");		
		var fChg = 0.00;
		var sContent = new String("");	
		var sTempContent = new String("");
		var asData = new Array();
		var asStkCode = new Array();
		var asStkName = new Array();
		var asLastDone = new Array();
		var asChg = new Array();
		
		m_iLoop = 0;
		
		m_bFlag = true;		
		
		if(m_bFlag){		
			try{
				if (m_sStkCode != "") {
					asStkCode = m_sStkCode.split("|");
				}
				
				if (m_sStkName != "") {
					asStkName = m_sStkName.split("|");
				}
				
				if (m_sLastDone != "") {
					asLastDone = m_sLastDone.split("|");
				}
				
				if (m_sChange != "") {
					asChg = m_sChange.split("|");
				}
				
				if ((asStkCode != null && asStkCode.length > 0) && (asStkName != null && asStkName.length > 0) &&
					(asLastDone != null && asLastDone.length > 0) && (asChg != null && asChg.length > 0)) {
					
					for (m_iLoop=0; m_iLoop<asStkCode.length; m_iLoop=parseInt(m_iLoop)+1) {							
						m_iLoop = parseInt(m_iLoop);							
						sName = asStkName[m_iLoop];
						if (m_sTickerUrl.indexOf("http") < 0) {
							sUrl = "http://" + this.location.host + m_sTickerUrl + "?indexCode=" + asStkCode[m_iLoop] + "&amp;indexName=" + sName;
						} else {
							sUrl = m_sTickerUrl + "?indexCode=" + asStkCode[m_iLoop] + "&amp;indexName=" + sName;
						}
						fChg = parseFloat(asChg[m_iLoop]);
						
//sContent += m_sOLWInit + sUrl + m_sOLWEnd + m_sStartFont + m_sFontSize + ";'><b>" + sName + "</span></b>" + m_sBlank;
sContent += m_sStartFont + m_sFontSize + ";'><b>" + sName + "</span></b>" + m_sBlank;
						
						sTempContent = m_sStartFont + m_sFontSize + m_sMiddleFont ;
						if (fChg == 0) {
							sTempContent += m_asColor[m_iColorUcCol];
						} else if (fChg > 0) {
							sTempContent += m_asColor[m_iColorUpCol];
						} else if (fChg < 0) {
							sTempContent += m_asColor[m_iColorDwCol];
						}
						sTempContent += "'><b>" + asLastDone[m_iLoop] + m_sBlank2 + asChg[m_iLoop] + "</b></span></a>" + m_sBlank5;
						sContent += sTempContent;	
						sTempContent = "";
					}
				}
				
				
				sContent += m_sCloseFont;
				setAllContent(sContent);
				
			}catch(exc){
				alert("!!! Critical Error in Indices Data Array,exc=["+exc+"]");
				alert(exc.message);
			}
		}else{
			alert("False...Not binding");	//comment when live!
		}
	}
	this.setTickerInfo = setTickerInfo;
	
	function setAlertInfo() {
		
		m_sAllContent = "";	
		var sContent = new String("");	
		var sTempContent = new String("");
		var asData = new Array();
		var sUrl = new String("");
		
		m_iLoop = 0;
		
		if (m_sTickerUrl.indexOf("http") < 0) {
			sUrl = "http://" + this.location.host + m_sTickerUrl;
		} else {
			sUrl = m_sTickerUrl;
		}
		//alert(sUrl);
		//m_sAnnouncementContent += m_sOLWInit + m_asAnnouncementUrl[i] + m_sOLWEnd;
		if (m_sData != "") {
			asData = m_sData.split("|");
			if (asData != null && asData.length > 0 && m_asColor != null && m_asColor.length > 0 && m_asColor.length == asData.length) {
				for (m_iLoop=0; m_iLoop<asData.length; m_iLoop=parseInt(m_iLoop)+parseInt(m_iTotColCnt)) {
					m_iLoop = parseInt(m_iLoop);
					//sContent += m_sOLWInit + sUrl + m_sOLWEnd + "<font color='" + m_asColor[m_iLoop] + "'><b>" + asData[m_iLoop] + "</b></font></a>" + m_sBlank5;
//sContent += m_sOLWInit + sUrl + m_sOLWEnd + m_sStartFont + m_sFontSize + m_sMiddleFont + m_asColor[m_iLoop] + "'><b>" + asData[m_iLoop] + "</b></span></a>" + m_sBlank5;
sContent += m_sStartFont + m_sFontSize + m_sMiddleFont + m_asColor[m_iLoop] + "'><b>" + asData[m_iLoop] + "</b></span></a>" + m_sBlank5;

				}
				setAllContent(sContent);
			} else {	
				m_sAnnouncementContent = "";
				setAllContent("<font color='#F88484'><b>Error Occur when try to refresh Alert Info. Please contact System Administrator.</b></font>");
			}
		}
	}
	this.setAlertInfo = setAlertInfo;
	
	function setOrderInfo() {
		setAlertInfo();
	}
	this.setOrderInfo = setOrderInfo;
		
	function setFastQuoteInfo() {
		var fChg = 0.00
		var sContent = new String("");
		var sColor = new String("");
		
		if (m_sChange.length > 0) {
			fChg = parseFloat(m_sChange);
		} else {
			fChg = 0.00;
		}
		
		if (fChg == 0) {
			sColor = m_asColor[m_iColorUcCol];
		} else if (fChg > 0) {
			sColor = m_asColor[m_iColorUpCol];
		} else if (fChg < 0) {
			sColor = m_asColor[m_iColorDwCol];
		}
		
		sContent = m_sStartFont + m_sFontSize + m_sMiddleFont + "#FFFFFF'>" 
		
		sContent += "<B>" + m_sStkCode + m_sBlank2 + m_sStkName + m_sBlank3 + "Last Done:&nbsp;<font color='" + sColor + "'>" + m_sLastDone + "</font>";
		sContent += m_sBlank3 + "Change:&nbsp;<font color='" + sColor + "'>" + m_sChange  + "</font>";
		sContent += m_sBlank3 + "Day High:&nbsp;<font color='" + sColor + "'>" + m_sHigh  + "</font>";
		sContent += m_sBlank3 + "Day Low:&nbsp;<font color='" + sColor + "'>" + m_sLow  + "</font>";
		sContent += m_sBlank3 + "Best Buy:&nbsp;<font color='" + sColor + "'>" + m_sBuy  + "</font>";
		sContent += m_sBlank3 + "Best Sell:&nbsp;<font color='" + sColor + "'>" + m_sSell  + "</font>";
		sContent += m_sBlank3 + "Volume:&nbsp;<font color='" + sColor + "'>" + m_sVolume  + "</font></b>";
		sContent += m_sCloseFont;
		setAllContent(sContent);		
	}
	this.setFastQuoteInfo = setFastQuoteInfo;	
	
	function setAnnouncementInfo() {		
		m_sAnnouncementContent = "";
		//add announcement info
		for (i=0; m_asAnnouncementText!= null && i< m_asAnnouncementText.length; i++) {
			if (m_asAnnouncementText[i].length > 0) {
				if (m_asAnnouncementUrl != null && m_asAnnouncementUrl.length > i) {
					//m_sAnnouncementContent += m_sOLWInit + m_asAnnouncementUrl[i] + m_sOLWEnd;
					//m_sAnnouncementContent += m_asAnnouncementUrl[i];
				}
				m_sAnnouncementContent += m_sStartFont + m_sFontSize;
				if (m_asAnnouncementColor != null && m_asAnnouncementColor.length > i) {
					m_sAnnouncementContent += m_sMiddleFont + m_asAnnouncementColor[i];
				}
				m_sAnnouncementContent += "'><b>" + m_asAnnouncementText[i] + "</b>" + "</a>" + m_sBlank5 + m_sCloseFont;
			}
		}

		m_sAnnouncementContent += m_sStartFont + m_sFontSize + m_sMiddleFont + "#FFFFFF'><b>" + m_sQuoteDate + m_sBlank + m_sQuoteTime + "</b>" + m_sBlank2;			
	}	
	this.setAnnouncementInfo = setAnnouncementInfo;
	
	function getAnnouncementInfo() { return m_sAnnouncementContent;}
	this.getAnnouncementInfo = getAnnouncementInfo;
	
	function setFutureInfo() {
		var asStkName = new Array();
		var asLastDone = new Array();
		var asVolume = new Array();
		var asOpen = new Array();
		var fChg = 0.00
		var sContent = new String("");
		var sColor = new String("");
		
		if (m_sChange.length > 0) {
			fChg = parseFloat(m_sChange);
		} else {
			fChg = 0.00;
		}
		
		if (fChg == 0) {
			sColor = m_asColor[m_iColorUcCol];
		} else if (fChg > 0) {
			sColor = m_asColor[m_iColorUpCol];
		} else if (fChg < 0) {
			sColor = m_asColor[m_iColorDwCol];
		}		
		
		if (m_sStkName != "") {
			asStkName  = m_sStkName.split("|");
		}
		
		if (m_sLastDone != "") {
			asLastDone  = m_sLastDone.split("|");
		}		
		
		if (m_sVolume != "") {
			asVolume  = m_sVolume.split("|");
		}		

		if (m_sOpen != "") {
			asOpen  = m_sOpen.split("|");
		}
		
		//alert(asStkName.length);
		if (asStkName != null && asLastDone != null && asVolume != null && asOpen != null) {
			for (k=0; k < asStkName.length; k=k+1) {
				sContent += m_sStartFont + m_sFontSize + m_sMiddleFont + "#FFFFFF'>";
				//m_sAnnouncementContent += m_sOLWInit + m_asAnnouncementUrl[i] + m_sOLWEnd;
				if (m_sTickerUrl.length > 0) {
					//sContent += "<B>" + m_sOLWInit + m_sTickerUrl + m_sOLWEnd + asStkName[k] + m_sBlank3 + "Last:&nbsp;<font color='" + sColor + "'>" + asLastDone[k] + "</font>";
					sContent += "<B>" + asStkName[k] + m_sBlank3 + "Last:&nbsp;<font color='" + sColor + "'>" + asLastDone[k] + "</font>";
				} else {
					sContent += "<B>" + asStkName[k] + m_sBlank3 + "Last:&nbsp;<font color='" + sColor + "'>" + asLastDone[k] + "</font>";
				}
				sContent += m_sBlank3 + "Vol:&nbsp;<font color='" + sColor + "'>" + asVolume[k]  + "</font>";
				sContent += m_sBlank3 + "OI:&nbsp;<font color='" + sColor + "'>" + asOpen[k]  + "</font></a></b>";
				sContent += m_sCloseFont + m_sBlank5;
			}
			setAllContent(sContent);
		}
		
	}
	this.setFutureInfo = setFutureInfo;
	
	//===================================
	//---Initialize process---
	//===================================
	function init(){
		refreshThread();
	}	
	this.init = init;
	
	function run()
	{	
		setAnnouncementInfo();
		if (m_sTickerType == "IndicesSummary") {
			setTickerInfo();
		} else if (m_sTickerType == "AlertSetting") {
			setAlertInfo();
		} else if (m_sTickerType == "OrderStatus") {
			setOrderInfo();
		} else if (m_sTickerType == "FastQuote") {
			setFastQuoteInfo();			
		} else if (m_sTickerType == "General") {
			setGeneralInfo();
		} else if (m_sTickerType == "Future") {
			setFutureInfo();
		}
		
	}		
	this.run = run;
	
//---Indices---
	function setQuoteDate(vs_sQuoteDate) { m_sQuoteDate = vs_sQuoteDate;}
	function getQuoteDate(){ return m_sQuoteDate;}
	this.setQuoteDate = setQuoteDate;
	this.getQuoteDate = getQuoteDate;

	function setQuoteTime(vs_sQuoteTime) { m_sQuoteTime = vs_sQuoteTime; }
	function getQuoteTime(){ return m_sQuoteTime; }
	this.setQuoteTime = setQuoteTime;
	this.getQuoteTime = getQuoteTime;
	
	function setData(vs_sIndices){ m_sData = vs_sIndices; }
	function getData(){ return m_sData; }
	this.setData = setData;
	this.getData = getData;

	/*function setTotRowCnt(vs_iTotRowCnt){ m_iTotRowCnt = vs_iTotRowCnt; }
	function getTotRowCnt(){ return m_iTotRowCnt; }
	this.setTotRowCnt = setTotRowCnt;
	this.getTotRowCnt = getTotRowCnt;
	*/

	function setTotColCnt(vs_iTotColCnt){ m_iTotColCnt = vs_iTotColCnt; }
	function getTotColCnt(){ return m_iTotColCnt; }
	this.setTotColCnt = setTotColCnt;
	this.getTotColCnt = getTotColCnt;


	/*function setIndicesTrackerUrl(vs_sIndicesTrackerUrl){ m_sIndicesTrackerUrl = vs_sIndicesTrackerUrl; }
	function getIndicesTrackerUrl(){ return m_sIndicesTrackerUrl; }
	this.setIndicesTrackerUrl = setIndicesTrackerUrl;
	this.getIndicesTrackerUrl = getIndicesTrackerUrl;
	*/
	
	function setColor(vs_sColor){ m_sColor = vs_sColor; }
	function getColor(){ return m_sColor; }
	this.setColor = setColor;
	this.getColor = getColor;	

	function setAnnouncementText(vs_sAnnouncementText){ m_sAnnouncementText = vs_sAnnouncementText;}
	function getAnnouncementText(){ return m_sAnnouncementText; }
	this.setAnnouncementText = setAnnouncementText;
	this.getAnnouncementText = getAnnouncementText;
	
	function setAnnouncementColor(vs_sAnnouncementColor){ m_sAnnouncementColor = vs_sAnnouncementColor;}
	function getAnnouncementColor(){ return m_sAnnouncementColor; }
	this.setAnnouncementColor = setAnnouncementColor;
	this.getAnnouncementColor = getAnnouncementColor;
	
	function setAnnouncementUrl(vs_sAnnouncementUrl){ m_sAnnouncementUrl = vs_sAnnouncementUrl;}
	function getAnnouncementUrl(){ return m_sAnnouncementUrl; }
	this.setAnnouncementUrl = setAnnouncementUrl;
	this.getAnnouncementUrl = getAnnouncementUrl;	
	
	function setSetting(vs_sSetting){ m_sSetting = vs_sSetting; }
	function getSetting(){ return m_sSetting; }	
	this.setSetting = setSetting;
	this.getSetting = getSetting;	
	
	function setAllContent(vs_Content) {m_sAllContent = vs_Content;}
	function getAllContent() {return m_sAllContent;}
	this.setAllContent = setAllContent;
	this.getAllContent = getAllContent;	
		
	function setTickerType(vsTickerType) {m_sTickerType = vsTickerType;}
	function getTickerType() {return m_sTickerType;}
	this.setTickerType = setTickerType;
	this.getTickerType = getTickerType;
	
	function setFontSize(vsFontSize) {m_sFontSize = vsFontSize;}
	function getFontSize() {return m_sFontSize;}
	this.setFontSize = setFontSize;
	this.getFontSize = getFontSize;	

	function setTickerUrl(vsTickerUrl) {m_sTickerUrl = vsTickerUrl;}
	function getTickerUrl() {return m_sTickerUrl;}
	this.setTickerUrl = setTickerUrl;
	this.getTickerUrl = getTickerUrl;	

	function setStkCode(vsStkCode) {m_sStkCode = vsStkCode;}
	function getStkCode() {return m_sStkCode;}
	this.setStkCode = setStkCode;
	this.getStkCode = getStkCode;
	
	function setStkName(vsStkName) {m_sStkName = vsStkName;}
	function getStkName() {return m_sStkName;}
	this.setStkName = setStkName;
	this.getStkName = getStkName;	
	
	function setLastDone(vsLastDone) {m_sLastDone = vsLastDone;}
	function getLastDone() {return m_sLastDone;}
	this.setLastDone = setLastDone;
	this.getLastDone = getLastDone;		
	
	function setChange(vsChange) {m_sChange = vsChange;}
	function getChange() {return m_sChange;}
	this.setChange = setChange;
	this.getChange = getChange;		
	
	function setHigh(vsHigh) {m_sHigh = vsHigh;}
	function getHigh() {return m_sHigh;}
	this.setHigh = setHigh;
	this.getHigh = getHigh;		
	
	function setLow(vsLow) {m_sLow = vsLow;}
	function getLow() {return m_sLow;}
	this.setLow = setLow;
	this.getLow = getLow;		
	
	function setBuy(vsBuy) {m_sBuy = vsBuy;}
	function getBuy() {return m_sBuy;}
	this.setBuy = setBuy;
	this.getBuy = getBuy;			
	
	function setSell(vsSell) {m_sSell = vsSell;}
	function getSell() {return m_sSell;}
	this.setSell = setSell;
	this.getSell = getSell;			
	
	function setVolume(vsVolume) {m_sVolume = vsVolume;}
	function getVolume() {return m_sVolume;}
	this.setVolume = setVolume;
	this.getVolume = getVolume;			
	
	function setOpen(vsOpen) {m_sOpen = vsOpen;}
	function getOpen() {return m_sOpen;}
	this.setOpen = setOpen;
	this.getOpen = getOpen;
}

function handleErrors(errorMessage, url, line)
	{
	msg = "tickerConnectEnigneNew2: There was an error on this page.\n\n";
	msg += "An internal programming error may keep\n";
	msg += "this page from displaying properly.\n";
	msg += "Click OK to continue.\n\n";
	msg += "Error message: " + errorMessage + "\n";
	msg += "URL: " + url + "\n";
	msg += "Line #: " + line;
//	alert(msg);
	return true;
	}