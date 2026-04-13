onerror = handleErrors;
function tickerConnectNew(vsObjectID,vsUrl,vsTickerType, vsFontSize, vsWidth, vsSpeed, vsImgUrl) {
	//constant variable
	var m_sFontSize = vsFontSize;
	var m_sImgUrl = vsImgUrl;
	var m_iIntervalRefreshTimerKO = new Number(2000);	//auto refresh, <KO>routine hit (2s / 3s will be good, 5s wait too long)
	var m_sHeight = "15px";	   //scroller height, 20px, 15px
	var m_sBgColor = "#9a9a9a";  //scroller background, DEFDD9
	var m_sFgColor = "#FFFFFF";var sPadding = "2px";	   //padding for scoller.(0 for non)
	var m_sBorderCSS = "border:1px solid #CCCCCC";
	var m_iPauseIt = 1;	 //Pause Scoller onMouseOver (0-no, 1-yes)
	var m_iPersistLastViewedMsg = 1;	//should scoller's position persist after users navigate away (1-yes, 0-no) 	
	var m_sPersistMsgBehaviour = "onload"; //set to "onload" or "onclick"	
	var m_sContentSetStart = "<nobr><span style='FONT-WEIGHT: bold;FONT-SIZE: "+ m_sFontSize +";FONT-FAMILY: Verdana'>";	//'<nobr><span style="font: bold 13px Verdana">';
	var m_sContentSetClose = '</span></nobr>';	
	//var m_iFeedbackWaitTime = new Number(10000);
	var m_iFeedbackWaitTime = new Number(5000);
	var m_iReloadTime = new Number(5000);			//1s
	var m_iErrorWaitTime = new Number(5000);		//1s	
	var m_sNBSP = '&nbsp;&nbsp;&nbsp;';
	
	
	//---------------from tickerconnectscrollernew2 ---------------
	var m_iIntervalScrollerID2;
	var m_sLeftTime;	
	var m_iWidth = new Number(parseInt(vsWidth));	
	var m_sContentData = new String("");
	var m_sAllContent = new String("");
	var m_sContent = new String("");

	var m_m_sCombinedCSSTable = "width:"+(m_iWidth+6)+"px;background-color:"+m_sBgColor+";color:"+m_sFgColor+";padding:"+sPadding+";"+m_sBorderCSS+";";
	var m_sCombinedCSS = "width:"+m_iWidth+";height:"+m_sHeight+";";
	var m_sDivonClick = (m_iPersistLastViewedMsg && m_sPersistMsgBehaviour=="onclick")? 'onclick="savelastmsg()" ' : '';
	
	var m_iSpeed = new Number(parseInt(vsSpeed));   //Scoller speed (larger is faster 1-10)
	m_iSpeed=(document.all)? m_iSpeed : Math.max(1, m_iSpeed-1); //slow speed down by 1 for NS
	var m_iCopySpeed = new Number(m_iSpeed);
	m_iPauseSpeed = (m_iPauseIt==0)? m_iCopySpeed: 0;
	var m_sIeDom = document.all||document.getElementById;
	var m_idscroller;

	var m_sContentID;
	var m_sScrollerID;
	var m_sObjectID;
	var m_sTickerType;

	var m_iActualWidth = new Number(0);
	
	m_sObjectID = vsObjectID;
	m_sTickerType = vsTickerType;
	
	m_sMethodName = "";	
	
	//---------------end tickerconnectscrollernew2 ---------------
	var m_sUrl2 = "";

	var m_xXmlHttp;
	var m_sXmlObj = new String("");
	var m_iTimer = new Number(0);
	var m_iStatusTimer = new Number(0);
	
	var m_bLoad = true;
	var m_nLoadStatus = new Number(0);

	var tce = new tickerConnectEngineNew();
	m_sUrl2 = vsUrl;		
	
	//alert("m_sUrl2: " + m_sUrl2);
	function start() {	
		//alert("tickerConnectNew:start");
		bReq = loadXml();
		if(bReq){	
//			alert("start");
			loadData();
		}else{
//			alert("---Critical Error:xXmlHttp not exist---");
		}
	}
	this.start = start;
	
	function setTickerXmlUrl(vs_Url) {
		m_sUrl2 = vs_Url;
	}	
	this.setTickerXmlUrl = setTickerXmlUrl;
	
	function setXmlHttp(vs_xXmlHttp){ m_xXmlHttp = vs_xXmlHttp; }
	this.setXmlHttp = setXmlHttp;
	
	function getXmlHttp(){ return m_xXmlHttp; }
	this.getXmlHttp = getXmlHttp;

	function setXmlObj(vs_sXmlObj){	m_sXmlObj = vs_sXmlObj;}
	this.setXmlObj = setXmlObj;
	
	function getXmlObj(){ return m_sXmlObj; }		
	this.getXmlObj = getXmlObj;
	
	function loadXml(){
		var xXmlHttp;
		var bReq = new Boolean(false);
		var msXml = new Array("MSXML2.XMLHTTP.5.0",
				"MSXML2.XMLHTTP.4.0",
				"MSXML2.XMLHTTP.3.0",
				"MSXML2.XMLHTTP",
				"Microsoft.XMLHTTP");

		// Microsoft MSXML ActiveX (branch for IE/Window ActiveX version)
			if(window.ActiveXObject){
				for(var i=0; i<msXml.length; i++){
					try{
						xXmlHttp = new ActiveXObject(msXml[i]);	
						//alert("Exist & Used:msXml["+i+"]=["+msXml[i]+"]");				
						setXmlObj(new String(msXml[i]));
						setXmlHttp(xXmlHttp);
						return true;
					}catch(e){
						//alert("Not exsist:msXml["+i+"]=["+msXml[i]+"]");
					}				
				}
			}	

		// Mozilla XMLHttpRequest (branch for native XMLHttpRequest)
			if(window.XMLHttpRequest){
				try{
					xXmlHttp = new XMLHttpRequest();
					setXmlObj(new String("XMLHttpRequest()"));
					setXmlHttp(xXmlHttp);
					return true;
				}catch(e){ 
					//alert("e2=["+e+"]");
				}			
			}		

		return bReq;
	}
	this.loadXml = loadXml;
	
	function loadData(){	

		var randomnumber = Math.floor(Math.random() * 11);		
		var xXmlHttp = getXmlHttp();
		var sParam = "";
		
		//xXmlHttp.onreadystatechange = stateChange;	//without ()
		
		if (m_sUrl2.indexOf("?") > 0) {
			sParam = "&time=";
		} else {
			sParam = "?time=";
		}
		
		//alert('2');
//		alert (new Date());
		//xXmlHttp.open("POST", m_sUrl2+ sParam +randomnumber, true);		//Pass different query string to avoid cache.		
		xXmlHttp.open("GET", m_sUrl2+ sParam +randomnumber, true);		//Pass different query string to avoid cache.
		//alert(m_sUrl2+ sParam +randomnumber);
	//alert('3');		
		xXmlHttp.onreadystatechange = stateChange;	//without ()		
		xXmlHttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");	//used when using POST
		xXmlHttp.setRequestHeader("cache-control", "no-cache");
		xXmlHttp.send("sId=28");	//sId currently no used, to avoid sending null, exist error 412.
		setXmlHttp(xXmlHttp);
		
/*		if (m_iStatusTimer != null) {
			clearInterval(m_iStatusTimer);
		}
		m_iStatusTimer = setInterval(m_sObjectID+".checkStatus()",m_iErrorWaitTime);
*/
	}
	this.loadData=loadData;
	
	function stateChange(){	
//		alert("stateChange");
		var sVal = new String("");
		//readyState:
		//0 = uninitialized
		//1 = loading
		//2 = loaded
		//3 = interactive
		//4 = complete
		var xXmlHttp = getXmlHttp();
		//---QuoteDate---
		var xQuoteDateNode;
		var xQuoteDateTextNode;
		var xQuoteDate;
		var sQuoteDate = new String("");
		//---QuoteTime---
		var xQuoteTimeNode;
		var xQuoteTimeTextNode;
		var xQuoteTime;
		var sQuoteTime = new String("");
		//---Inidices---
		var xDataNode;
		var xDataTextNode;
		var xData;
		var sData = new String("");
		//---TotRowCnt---
		var xTotRowCnt;
		var xTotRowCntTextNode;
		var xTotRowCnt;	
		var iTotRowCnt = new Number(0);			
		//---TotColCnt---
		var xTotColCntNode;
		var xTotColCntTextNode;
		var xTotColCnt;
		var iTotColCnt = new Number(0);		
		//---IndicesTrackerUrl---
		var xIndicesTrackerUrlNode;
		var xIndicesTrackerUrlTextNode;
		var xIndicesTrackerUrl;
		//var sDataTrackerUrl = new String("");
		//---Color---
		var xColorNode;
		var xColorTextNode;
		var xColor;
		var sColor = new String("");
		//---Ticker URL---
		/*var xTickerUrlNode;
		var xTickerUrlTextNode;
		var xTickerUrl;
		var sTickerUrl = new String("");
		*/
		//---AnnouncementText---
		var xAnnouncementTextNode;
		var xAnnouncementTextTextNode;
		var xAnnouncementText;
		var sAnnouncementText = new String("");
		//--Announcement Color--
		var xAnnouncementColorNode;
		var xAnnouncementColorTextNode;
		var xAnnouncementColor;
		var sAnnouncementColor = new String("");
		//--Announcement Url--
		var xAnnouncementUrlNode;
		var xAnnouncementUrlTextNode;
		var xAnnouncementUrl;
		var sAnnouncementUrl = new String("");				
		//---Setting---
		var xSettingNode;
		var xSettingTextNode;
		var xSetting;
		var sSetting = new String("");
		//---StkCode---
		var xStkCodeNode;
		var xStkCodeTextNode;
		var xStkCode;
		var sStkCode = new String("");		
		//---StkName---
		var xStkNameNode;
		var xStkNameTextNode;
		var xStkName;
		var sStkName = new String("");
		//---LastDone---
		var xLastDoneNode;
		var xLastDoneTextNode;
		var xLastDone;
		var sLastDone = new String("");		
		//---change---
		var xChangeNode;
		var xChangeTextNode;
		var xChange;
		var sChange = new String("");
		//---High---
		var xHighNode;
		var xHighTextNode;
		var xHigh;
		var sHigh = new String("");
		//---Low---
		var xLowNode;
		var xLowTextNode;
		var xLow;
		var sLow = new String("");		
		//---1st Buy---
		var xBuyNode;
		var xBuyTextNode;
		var xBuy;
		var sBuy = new String("");				
		//---1st Sell---
		var xSellNode;
		var xSellTextNode;
		var xSell;
		var sSell = new String("");
		//---Volume---
		var xVolumeNode;
		var xVolumeTextNode;
		var xVolume;
		var sVolume = new String("");		
		
		//---Open---
		var xOpenNode;
		var xOpenTextNode;
		var xOpen;
		var sOpen = new String("");				

		var iNumElements = new Number(0);
//		m_nLoadStatus = parseInt(xXmlHttp.status);
		//alert("Date: " + (new Date()));
		if(m_iTimer != 0){ clearInterval(m_iTimer); }
		try{		
			//alert("xXmlHttp.readyState: " + xXmlHttp.readyState);
		  switch(xXmlHttp.readyState){
			case 1:
				//m_iTimer = setInterval(m_sObjectID+".errorHandling()",m_iFeedbackWaitTime);
				break;
			case 4:
				//m_iTimer = setInterval(m_sObjectID+".loadData()",m_iReloadTime);		
				m_nLoadStatus = parseInt(xXmlHttp.status);
				if(m_nLoadStatus == 200){
				//if((parseInt(xXmlHttp.status)) == 200){
					//Changing to connected status image
					//idTickerBlink.src = m_sImgUrl+ "blinkStatusG.gif";
					sVal = m_sImgUrl+ "blinkStatusG.gif";	
					//alert("start get xml");
					//alert("xml2: "  + xXmlHttp.responseXML.xml);
					try{
						//---QuoteDate---
						xQuoteDateNode = xXmlHttp.responseXML.getElementsByTagName("QuoteDate")[0]; 
						if (xQuoteDateNode != null) {
							xQuoteDateTextNode = xQuoteDateNode.childNodes[0];
							xQuoteDate = xQuoteDateTextNode.nodeValue;
							sQuoteDate = new String(xQuoteDate).valueOf();
						}
						//alert("sQuoteDate: " +sQuoteDate);

						//---QuoteTime---
						xQuoteTimeNode = xXmlHttp.responseXML.getElementsByTagName("QuoteTime")[0]; 
						if (xQuoteTimeNode != null) {
							xQuoteTimeTextNode = xQuoteTimeNode.childNodes[0];
							xQuoteTime = xQuoteTimeTextNode.nodeValue;
							sQuoteTime = new String(xQuoteTime).valueOf();
						}
						
						//---Data---
						iNumElements = xXmlHttp.responseXML.getElementsByTagName("Data").length;						
						for (n=0; n<iNumElements; n++) {
							xDataNode = xXmlHttp.responseXML.getElementsByTagName("Data")[n]; 
							if (xDataNode != null) {
								xDataTextNode = xDataNode.childNodes[0];
								xData = xDataTextNode.nodeValue;
								sData += new String(xData).valueOf() + "|";
							}
						}
						
						sData = sData.substring(0, sData.length-1);
						
						//---TotRowCnt---
						xTotRowCntNode = xXmlHttp.responseXML.getElementsByTagName("TotRowCnt")[0]; 
						if (xTotRowCntNode != null) {
							xTotRowCntTextNode = xTotRowCntNode.childNodes[0];
							xTotRowCnt = xTotRowCntTextNode.nodeValue;	
							iTotRowCnt = xTotRowCnt;				
						}

						//---TotColCnt---
						xTotColCntNode = xXmlHttp.responseXML.getElementsByTagName("TotColCnt")[0]; 
						
						if (xTotColCntNode != null) {
							xTotColCntTextNode = xTotColCntNode.childNodes[0];
							if (xTotColCntTextNode != null) {
								xTotColCnt = xTotColCntTextNode.nodeValue;
								iTotColCnt = xTotColCnt;	
							} else {
								iTotColCnt = 0;							
							}
						} else {
							iTotColCnt = 0;
						}

						//---Color---
						iNumElements = xXmlHttp.responseXML.getElementsByTagName("Color").length;
						for (n=0; n<iNumElements; n++) {
							xColorNode = xXmlHttp.responseXML.getElementsByTagName("Color")[n]; 
							if (xColorNode != null) {
								xColorTextNode = xColorNode.childNodes[0];					
								xColor = xColorTextNode.nodeValue;
								sColor += new String(xColor).valueOf() + "|";
							}
						}
						sColor = sColor.substring(0, sColor.length-1);
						
						//---Ticker Url---
						/*xTickerUrlNode = xXmlHttp.responseXML.getElementsByTagName("TickerURL")[0]; 
						if (xTickerUrlNode != null) {
							xTickerUrlTextNode = xTickerUrlNode.childNodes[0];					
							xTickerUrl = xTickerUrlTextNode.nodeValue;
							sTickerUrl = new String(xTickerUrl).valueOf();
						}*/						
						
						//alert("sColor: " +sColor);
						//---AnnouncementText---
						iNumElements = xXmlHttp.responseXML.getElementsByTagName("AnnouncementText").length;
						for (n=0; n<iNumElements; n++) {
							xAnnouncementTextNode = xXmlHttp.responseXML.getElementsByTagName("AnnouncementText")[n]; 
							if (xAnnouncementTextNode != null) {
								xAnnouncementTextTextNode = xAnnouncementTextNode.childNodes[0];
								xAnnouncementText = xAnnouncementTextTextNode.nodeValue;
								sAnnouncementText += new String(xAnnouncementText).valueOf() + "|";
							}
						}
						sAnnouncementText = sAnnouncementText.substring(0, sAnnouncementText.length-1);						

						//---AnnouncementColor---
						iNumElements = xXmlHttp.responseXML.getElementsByTagName("AnnouncementColor").length;
						for (n=0; n<iNumElements; n++) {
							xAnnouncementColorNode = xXmlHttp.responseXML.getElementsByTagName("AnnouncementColor")[n];
							if (xAnnouncementColorNode != null) {
								xAnnouncementColorTextNode = xAnnouncementColorNode.childNodes[0];
								xAnnouncementColor = xAnnouncementColorTextNode.nodeValue;
								sAnnouncementColor = new String(xAnnouncementColor).valueOf();
							}
						}						
						sAnnouncementColor = sAnnouncementColor.substring(0, sAnnouncementColor.length-1);
						
						//---AnnouncementUrl---
						iNumElements = xXmlHttp.responseXML.getElementsByTagName("AnnouncementURL").length;
						for (n=0; n<iNumElements; n++) {
							xAnnouncementUrlNode = xXmlHttp.responseXML.getElementsByTagName("AnnouncementURL")[n]; 
							if (xAnnouncementUrlNode != null) {
								xAnnouncementUrlTextNode = xAnnouncementUrlNode.childNodes[0];
								xAnnouncementUrl = xAnnouncementUrlTextNode.nodeValue;
								sAnnouncementUrl = new String(xAnnouncementUrl).valueOf();
							}
						}
						if (sAnnouncementUrl.indexOf("|") > 0) {
							sAnnouncementUrl = sAnnouncementUrl.substring(0, sAnnouncementUrl.length-1);
						}
						
						//---Setting---
						xSettingNode = xXmlHttp.responseXML.getElementsByTagName("Setting")[0]; 
						if (xSettingNode != null) {
							xSettingTextNode = xSettingNode.childNodes[0];
							xSetting = xSettingTextNode.nodeValue;
							sSetting = new String(xSetting).valueOf();
						}

						//---StkCode---						
						iNumElements = xXmlHttp.responseXML.getElementsByTagName("StkCode").length;
						for (n=0; n<iNumElements; n++) {
							xStkCodeNode = xXmlHttp.responseXML.getElementsByTagName("StkCode")[n]; 
							if (xStkCodeNode != null) {
								xStkCodeTextNode = xStkCodeNode.childNodes[0];
								xStkCode = xStkCodeTextNode.nodeValue;
								sStkCode += new String(xStkCode).valueOf() + "|";
							}
						}
						sStkCode = sStkCode.substring(0, sStkCode.length-1);
						
						//---StkName---
						iNumElements = xXmlHttp.responseXML.getElementsByTagName("StkName").length;
						for (n=0; n<iNumElements; n++) {
							xStkNameNode = xXmlHttp.responseXML.getElementsByTagName("StkName")[n]; 
							if (xStkNameNode != null) {
								xStkNameTextNode = xStkNameNode.childNodes[0];
								xStkName = xStkNameTextNode.nodeValue;
								sStkName += new String(xStkName).valueOf() + "|";
							}
						}
						sStkName = sStkName.substring(0, sStkName.length-1);
						
						//---LastDone---
						iNumElements = xXmlHttp.responseXML.getElementsByTagName("LastDone").length;
						for (n=0; n<iNumElements; n++) {
							xLastDoneNode = xXmlHttp.responseXML.getElementsByTagName("LastDone")[n]; 
							if (xLastDoneNode != null) {
								xLastDoneTextNode = xLastDoneNode.childNodes[0];
								xLastDone = xLastDoneTextNode.nodeValue;
								sLastDone += new String(xLastDone).valueOf() + "|";
							}
						}
						sLastDone = sLastDone.substring(0, sLastDone.length-1);
						
						//---Change---
						iNumElements = xXmlHttp.responseXML.getElementsByTagName("Change").length;
						for (n=0; n<iNumElements; n++) {
							xChangeNode = xXmlHttp.responseXML.getElementsByTagName("Change")[n]; 
							if (xChangeNode != null) {
								xChangeTextNode = xChangeNode.childNodes[0];
								xChange = xChangeTextNode.nodeValue;
								sChange += new String(xChange).valueOf() + "|";
							}
						}
						sChange = sChange.substring(0, sChange.length-1);
						
						//---High---
						iNumElements = xXmlHttp.responseXML.getElementsByTagName("High").length;
						for (n=0; n<iNumElements; n++) {
							xHighNode = xXmlHttp.responseXML.getElementsByTagName("High")[n]; 
							if (xHighNode != null) {
								xHighTextNode = xHighNode.childNodes[0];
								xHigh = xHighTextNode.nodeValue;
								sHigh += new String(xHigh).valueOf() + "|";
							}
						}
						sHigh = sHigh.substring(0, sHigh.length-1);
						
						//---Low---
						iNumElements = xXmlHttp.responseXML.getElementsByTagName("Low").length;
						for (n=0; n<iNumElements; n++) {
							xLowNode = xXmlHttp.responseXML.getElementsByTagName("Low")[n]; 
							if (xLowNode != null) {
								xLowTextNode = xLowNode.childNodes[0];
								xLow = xLowTextNode.nodeValue;
								sLow += new String(xLow).valueOf() + "|";
							}
						}
						sLow = sLow.substring(0, sLow.length-1);
						
						//---Buy---
						iNumElements = xXmlHttp.responseXML.getElementsByTagName("Buy").length;
						for (n=0; n<iNumElements; n++) {
							xBuyNode = xXmlHttp.responseXML.getElementsByTagName("Buy")[n]; 
							if (xBuyNode != null) {
								xBuyTextNode = xBuyNode.childNodes[0];
								xBuy = xBuyTextNode.nodeValue;
								sBuy += new String(xBuy).valueOf() + "|";
							}
						}
						sBuy = sBuy.substring(0, sBuy.length-1);
						
						//---Sell---
						iNumElements = xXmlHttp.responseXML.getElementsByTagName("Sell").length;
						for (n=0; n<iNumElements; n++) {
							xSellNode = xXmlHttp.responseXML.getElementsByTagName("Sell")[n]; 
							if (xSellNode != null) {
								xSellTextNode = xSellNode.childNodes[0];
								xSell = xSellTextNode.nodeValue;
								sSell += new String(xSell).valueOf() + "|";
							}
						}
						sSell = sSell.substring(0, sSell.length-1);
						
						//---Volume---
						iNumElements = xXmlHttp.responseXML.getElementsByTagName("Volume").length;
						for (n=0; n<iNumElements; n++) {
							xVolumeNode = xXmlHttp.responseXML.getElementsByTagName("Volume")[n]; 
							if (xVolumeNode != null) {
								xVolumeTextNode = xVolumeNode.childNodes[0];
								xVolume = xVolumeTextNode.nodeValue;
								sVolume += new String(xVolume).valueOf() + "|";
							}
						}
						sVolume = sVolume.substring(0, sVolume.length-1);
						
						//---Open---
						iNumElements = xXmlHttp.responseXML.getElementsByTagName("Open").length;
						for (n=0; n<iNumElements; n++) {
							xOpenNode = xXmlHttp.responseXML.getElementsByTagName("Open")[n]; 
							if (xOpenNode != null) {
								xOpenTextNode = xOpenNode.childNodes[0];
								xOpen = xOpenTextNode.nodeValue;
								sOpen += new String(xOpen).valueOf() + "|";
							}
						}
						sOpen = sOpen.substring(0, sOpen.length-1);						
						
						tce.setTickerType(m_sTickerType);
						tce.setQuoteDate(sQuoteDate);
						tce.setQuoteTime(sQuoteTime);
						//alert(m_sObjectID + ":" + sData);
						tce.setData(sData);	
						//tce.setTotRowCnt(iTotRowCnt);
						tce.setTotColCnt(iTotColCnt);
						//tce.setIndicesTrackerUrl(sIndicesTrackerUrl);					
						tce.setColor(sColor);
						tce.setAnnouncementText(sAnnouncementText);
						tce.setAnnouncementColor(sAnnouncementColor);
						tce.setAnnouncementUrl(sAnnouncementUrl);
						tce.setFontSize(m_sFontSize);						
						tce.setSetting(sSetting);
						//tce.setTickerUrl(sTickerUrl);
						tce.setStkName(sStkName);
						tce.setStkCode(sStkCode);
						tce.setLastDone(sLastDone);						
						tce.setChange(sChange);
						tce.setHigh(sHigh);
						tce.setLow(sLow);
						tce.setBuy(sBuy);
						tce.setSell(sSell);
						tce.setVolume(sVolume);
						tce.setOpen(sOpen);

						//---After Complete, set then run the data formatting engine
						
						tce.refreshThread();	
						setContentData2(tce.getAnnouncementInfo() + tce.getAllContent());						
						
					}catch(e){
//						alert("stateChange1::xXmlHttp:e=["+e.message+" " + e.number + "]");
					}

				}else{
//					alert("stateChange2::xXmlHttp.status=["+xXmlHttp.status+"]");
					errorHandling();
				}
				break;
			default:	
		  }	  
		}catch(e){
			//alert("stateChange::e=["+e+"]");
			//alert("123");
			//alert("error description [" + e.description + "]");
		}
		//loadData;	
	}
	this.stateChange=stateChange;
	
	function errorHandling(){
		var xXmlHttp = getXmlHttp();
		sVal = m_sImgUrl+ "blinkStatusR.gif";
		//Never infinite loop, put a error Handling reload timer
		if(m_iTimer != undefined){
			//alert("clearInterval2");
			clearInterval(m_iTimer);
		}
		//alert("errorHandling");
		m_iTimer = setInterval(m_sObjectID + ".loadData()",m_iErrorWaitTime);
	}
	this.errorHandling=errorHandling;
	
	
	
	//---------------from tickerconnectscrollernew2 ---------------
	function createUI(vsContentID, vsScrollerID)
	{
		m_sContentID = vsContentID;
		m_sScrollerID = vsScrollerID;
		
		if(window.addEventListener)
			window.addEventListener("load",populateScroller,false);
		else if (window.attachEvent)
			window.attachEvent("onload", populateScroller);
		else if(document.all || document.getElementById)
			window.onload=populateScroller;		
			
		if (m_sIeDom) {
			//document.writeln('<span id="' + m_sContentID + '"  style="visibility:hidden;position:absolute;top:-100px;left:-10000px">'+m_sContent+'</span>');
			document.writeln('<span id="' + m_sContentID + '"  style="visibility:hidden;position:absolute;top:-100px;left:-10px">'+m_sContent+'</span>');
		}

		if(m_iPersistLastViewedMsg && m_sPersistMsgBehaviour=="onload"){
			window.onunload=saveLastMsg;
		}
		//alert("m_iSpeed: " + m_iSpeed);
		
		if (m_sIeDom){
			document.write('<table border="0" cellspacing="0" cellpadding="0" style="'+m_m_sCombinedCSSTable+'"><td>');
			//document.write('<div style="position:relative;overflow:hidden;'+m_sCombinedCSS+'" onMouseover="m_iCopySpeed=m_iPauseSpeed;" onMouseout="m_iCopySpeed=m_iSpeed">');
			document.write('<div style="position:relative;overflow:hidden;'+m_sCombinedCSS+'" onMouseover="javascript:' + m_sObjectID + '.setCopySpeed(0);" onMouseout="javascript:' + m_sObjectID + '.setCopySpeed(1)">');
			//document.write('<div style="position:relative;overflow:hidden;'+m_sCombinedCSS+'">');
			document.write('<div id="' + m_sScrollerID + '" style="position:absolute;left:0px;top:0px;" '+m_sDivonClick+'></div>');
			document.write('</div>');			
			document.write('</td>');
			document.write('<td>');		
			document.write('</td></table>');
		}
		
		refreshThread();
		refreshContent();	

	}
	this.createUI = createUI;
	
	function populateScroller()
	{	
		m_idscroller = document.getElementById(m_sScrollerID);		
		m_idscroller.style.left=m_iWidth+8+"px";
		//alert("m_iPersistLastViewedMsg: " + m_iPersistLastViewedMsg);
		//alert("get cookie: " + get_Cookie(m_sObjectID + ".sLastScrollerPos"));
		if(m_iPersistLastViewedMsg && get_Cookie(m_sObjectID + ".sLastScrollerPos")!="") 		
			reviveLastMsg();

		m_idscroller.innerHTML = m_sContent;	
		runscrollMarquee();
	}	
	this.populateScroller = populateScroller;
	
	function runscrollMarquee()
	{		
		if(m_sLeftTime != undefined){clearInterval(m_sLeftTime); }
		if(getContentData2() != ""){		
			m_sMethodName = m_sObjectID + ".scrollMarquee()";			
			//m_sLeftTime = setInterval(m_sMethodName,30);	//20
			m_sLeftTime = setInterval(m_sMethodName,20);	//20
			m_sMethodName = "";
		}else{
			m_sMethodName = m_sObjectID + ".runscrollMarquee()";
			m_sLeftTime = setInterval(m_sMethodName,2000);
			m_sMethodName = "";
		}
	}	
	this.runscrollMarquee = runscrollMarquee;
	
	function refreshThread()
	{
		if(m_iIntervalScrollerID2 != undefined){ clearInterval(m_iIntervalScrollerID2); }	
		m_sMethodName = m_sObjectID + ".refreshContent()";
		m_iIntervalScrollerID2 = setInterval(m_sMethodName,m_iIntervalRefreshTimerKO); 
		m_sMethodName = "";
	}	
	this.refreshThread = refreshThread;
	
	function scrollMarquee()
	{ 	
		var m_iTempWidth = new Number(0);
		
		if (m_iActualWidth > 0 && m_bLoad) {
			m_iTempWidth = 	m_iActualWidth/4;
		}
		
		//if(parseInt(m_idscroller.style.left) > (m_iActualWidth*(-1)+8)){	
		if(parseInt(m_idscroller.style.left) > (m_iActualWidth*(-1)*5-100)){
			m_idscroller.style.left = parseInt(m_idscroller.style.left)-m_iCopySpeed+"px";
			
			if (m_bLoad && (parseInt(m_idscroller.style.left)-m_iCopySpeed) < m_iTempWidth ) {
				//alert("scrollMarquee");
				loadData();			//reconnect to xml b4 reload content				
				m_bLoad = false;
			}
		}else{	
			m_idscroller.style.left = m_iWidth+8+"px";
			m_bLoad = true;
			//alert("reload data");
			//loadData();			//reconnect to xml b4 reload content
			refreshContent();	//reload the latest the content after a finish loop.		
		}	
	}	
	this.scrollMarquee = scrollMarquee;
	
	function get_Cookie(vs_sName) 
	{
		var sSearch =  vs_sName + "=";
		var sReturnValue = "";
		if(document.cookie.length > 0){
			offset = document.cookie.indexOf(sSearch);
			if(offset != -1){
				offset += sSearch.length;
				end = document.cookie.indexOf(";", offset);
				if(end == -1)
				end = document.cookie.length;
				sReturnValue = unescape(document.cookie.substring(offset, end))
			}
		}
		return sReturnValue;
	}	
	this.get_Cookie = get_Cookie;
	
	function saveLastMsg ()
	{
		document.cookie = m_sObjectID + ".sLastScrollerPos="+m_idscroller.style.left;
	}		
	this.saveLastMsg = saveLastMsg;
	
	function reviveLastMsg()
	{
		sLastScrollerPos = parseInt(get_Cookie(m_sObjectID + ".sLastScrollerPos"));		
		m_idscroller.style.left = parseInt(sLastScrollerPos) +"px";			
	}	
	this.reviveLastMsg = reviveLastMsg;
	
	function refreshContent()
	{						
		var sData = "";
		sData = getContentData2();
		if(sData != ""){
			clearInterval(m_iIntervalScrollerID2);

			try {
				m_sAllContent = new String(sData).valueOf();
				
				m_sContent = m_sContentSetStart + m_sAllContent + m_sContentSetClose;				
				if (document.getElementById) {	
					document.getElementById(m_sScrollerID).innerHTML = m_sContent;					
					m_iActualWidth  = document.getElementById(m_sScrollerID).innerHTML.length;
				}

			} catch (e) {
//				alert("e1=[" + e.message + "]");
			}

		}
	}			
	this.refreshContent = refreshContent;	
	
	function setContentData2(vs_sContentData)
	{
		m_sContentData = vs_sContentData;
	}
	this.setContentData2 = setContentData2;
	
	function getContentData2() {
		return m_sContentData;
	}
	this.getContentData2 = getContentData2;
	
	function getObjectID() {
		return m_sObjectID;
	}	
	
	function setCopySpeed(vsCopySpeed) {
		if (vsCopySpeed == 0) {
			m_iCopySpeed = m_iPauseSpeed;
		} else {
			m_iCopySpeed = m_iSpeed;
		}
	}
	this.setCopySpeed = setCopySpeed;
	//end tickerconnectscrollernew2
	
	function setTickerUrl(vsTickerUrl) {
		tce.setTickerUrl(vsTickerUrl);		
	}
	this.setTickerUrl = setTickerUrl;
	
/*	function checkStatus() {		
		if (m_nLoadStatus != 200 && m_sContentData == "") {
			alert("checkStatus");
			loadData();
		}	
	}	
	this.checkStatus = checkStatus;
*/

}

//init();	
function handleErrors(errorMessage, url, line)
{
	msg = "tickerConnectNew: There was an error on this page.\n\n";
	msg += "An internal programming error may keep\n";
	msg += "this page from displaying properly.\n";
	msg += "Click OK to continue.\n\n";
	msg += "Error message: " + errorMessage + "\n";
	msg += "URL: " + url + "\n";
	msg += "Line #: " + line;
	
//	alert(msg);

	return true;
	if(m_iTimer != undefined){
		clearInterval(m_iTimer);
	}

	//alert("handleErrors");
	m_iTimer = setInterval(m_sObjectID + ".loadData()",m_iErrorWaitTime);	
}