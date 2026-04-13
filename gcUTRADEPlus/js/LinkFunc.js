var LINK_TYPE_EODCHART = "E";
var LINK_TYPE_30MCHART = "M";

var LINK_TYPE_COMP_INFO = "01";
var LINK_TYPE_COMP_DIRECTOR = "10";
var LINK_TYPE_COMP_SHAREHOLDER = "11";
var LINK_TYPE_COMP_PARVALUE = "12";
var LINK_TYPE_COMP_PAIDUPCAP = "13";
var LINK_TYPE_COMP_DIVIDEND = "14";
var LINK_TYPE_COMP_PROPERTY = "15";
var LINK_TYPE_COMP_ANOUNCEMENT = "16";
var LINK_TYPE_COMP_SUBSIDIARY = "17";
var LINK_TYPE_COMP_UPDATELOG = "18";

var LINK_TYPE_COMPFIN_BS = "50";		//balance sheet
var LINK_TYPE_COMPFIN_PL = "51";		//profit and loss
var LINK_TYPE_COMPFIN_CF = "52";		//cash flow
var LINK_TYPE_COMPFIN_FH = "53";		//financial highlight
var LINK_TYPE_COMPFIN_RA = "54";		//ratio analysis
var LINK_TYPE_COMPFIN_MS = "55";		//mining statistics
var LINK_TYPE_COMPFIN_PS = "56";		//plantation statistic


function DisplayStkInfoLink(linktype, p_sStkCode)
{
	var scrWidth, scrHeight, sURL;

	scrWidth = screen.width * 0.8;
	scrHeigth = screen.height * 0.8;

	switch (linktype) {
		case LINK_TYPE_EODCHART:
			// EOD chart
			// http://www.klse-ris.com.my/webchart-html/ceod_html/5088.html
			//sURL = 'http://www.ebrokerconnect.com/ebcServlet/stkRTServlet?key='+ p_sStkCode;
			sURL = 'http://chart.ebrokerconnect.com/ebcServlet/stkChartEOD?key=' + p_sStkCode;
			break;
		case LINK_TYPE_30MCHART:
			// 30 minute chart
			// http://www.klse-ris.com.my/webchart-html/c30m_html/5088.html
			sURL = 'http://www.klse-ris.com.my/webchart-html/c30m_html/' + p_sStkCode + '.html';
			break;

		case LINK_TYPE_COMP_INFO:
			// company info / summary
			// http://www.klse-ris.com.my/CDB/owa/cp_summary?cmp_code_in=5088
			// http://www.klse-ris.com.my/CDB/owa/compchq?cp_code_in=5088&cp_sname_in=&cp_rcode_in=
			sURL = 'http://www.klse-ris.com.my/CDB/owa/cp_summary?cmp_code_in=' + p_sStkCode
			break;
		case LINK_TYPE_COMP_DIRECTOR:
			// company director info
			// http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=DR&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=DR&cmp_code_in=' + p_sStkCode
			break;
		case LINK_TYPE_COMP_SHAREHOLDER:
			// company shareholder info
			// http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=SH&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=SH&cmp_code_in=' + p_sStkCode
			break;
		case LINK_TYPE_COMP_PARVALUE:
			// par value
			// http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=PV&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=PV&cmp_code_in=' + p_sStkCode
			break;
		case LINK_TYPE_COMP_PAIDUPCAP:
			// paid-up capital
			// http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=PV&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=PV&cmp_code_in=' + p_sStkCode
			break;
		case LINK_TYPE_COMP_DIVIDEND:
			// dividend
			// http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=DV&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=DV&cmp_code_in=' + p_sStkCode
			break;
		case LINK_TYPE_COMP_PROPERTY:
			// property held by company
			// http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=PH&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=PH&cmp_code_in=' + p_sStkCode
			break;
		case LINK_TYPE_COMP_ANOUNCEMENT:
			// anouncement
			// http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=AM&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=AM&cmp_code_in=' + p_sStkCode
			break;
		case LINK_TYPE_COMP_SUBSIDIARY:
			// company subsidiary info
			// http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=SC&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=SC&cmp_code_in=' + p_sStkCode
			break;
		case LINK_TYPE_COMP_UPDATELOG:
			// update log
			// http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=UL&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/lcd.genchq?gen_type_in=UL&cmp_code_in=' + p_sStkCode
			break;

		case LINK_TYPE_COMPFIN_BS:
			// balance sheet
			// http://www.klse-ris.com.my/CDB/owa/cp_datechq?acct_type_in=BS&frm_yr=&to_yr=&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/cp_datechq?acct_type_in=BS&frm_yr=&to_yr=&cmp_code_in=' + p_sStkCode
			break;
		case LINK_TYPE_COMPFIN_PL:
			// profit and loss
			// http://www.klse-ris.com.my/CDB/owa/cp_datechq?acct_type_in=PL&frm_yr=&to_yr=&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/cp_datechq?acct_type_in=PL&frm_yr=&to_yr=&cmp_code_in=' + p_sStkCode
			break;
		case LINK_TYPE_COMPFIN_CF:
			// cash flow
			// http://www.klse-ris.com.my/CDB/owa/cp_datechq?acct_type_in=CF&frm_yr=&to_yr=&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/cp_datechq?acct_type_in=CF&frm_yr=&to_yr=&cmp_code_in=' + p_sStkCode
			break;
		case LINK_TYPE_COMPFIN_FH:
			// financial highlight
			// http://www.klse-ris.com.my/CDB/owa/cp_datechq?acct_type_in=FH&frm_yr=&to_yr=&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/cp_datechq?acct_type_in=FH&frm_yr=&to_yr=&cmp_code_in=' + p_sStkCode
			break;
		case LINK_TYPE_COMPFIN_RA:
			// company risk return and performance (ratio analysis)
			// http://www.klse-ris.com.my/CDB/owa/cp_datechq?acct_type_in=RA&frm_yr=&to_yr=&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/cp_datechq?acct_type_in=RA&frm_yr=&to_yr=&cmp_code_in=' + p_sStkCode
			break;
		case LINK_TYPE_COMPFIN_MS:
			// mining statistics
			// http://www.klse-ris.com.my/CDB/owa/cp_datechq?acct_type_in=MS&frm_yr=&to_yr=&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/cp_datechq?acct_type_in=MS&frm_yr=&to_yr=&cmp_code_in=' + p_sStkCode
			break;
		case LINK_TYPE_COMPFIN_PS:
			// plantation statistic
			// http://www.klse-ris.com.my/CDB/owa/cp_datechq?acct_type_in=PS&frm_yr=&to_yr=&cmp_code_in=5088
			sURL = 'http://www.klse-ris.com.my/CDB/owa/cp_datechq?acct_type_in=PS&frm_yr=&to_yr=&cmp_code_in=' + p_sStkCode
			break;

		default:
			// default to company info
			sURL = 'http://www.klse-ris.com.my/CDB/owa/cp_summary?cmp_code_in=' + p_sStkCode
	}

	window.showModalDialog(sURL, '', 'center:yes;dialogWidth:' + scrWidth + 'px;dialogHeight:' + scrHeight + 'px');
}

function FormatStkInfoLink(linktype, p_sStkCode, p_sStkName)
{
	return ("<font style='cursor:hand;color:blue;text-decoration:underline' onclick=DisplayStkInfoLink('"+ linktype +"','"+ p_sStkCode + "')>" + p_sStkName + "</font>");
}

function OpenLinkWinNormal(sURL, sTargetWin, sParam)
{
	window.open(sURL, sTargetWin, sParam, false)
}
function OpenLinkWindow(sURL, sTargetWin, sParam)
{
	if (sParam=='') {
		sParam = 'left=10,top=100,width=770,height=450,location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes'
	}
	window.open(sURL, sTargetWin, sParam, false)
}

function OpenWinNetResearch(sURL, sTargetWin, sParam)
{
	if (sParam=='') {
		sParam = 'left=10,top=100,width=770,height=450,location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes'
	}
	window.open('/gc/gotoNetResearch.jsp?url='+ sURL, sTargetWin, sParam, false)
}

function OpenWinNews(sURL, sParam)
{
	if (sParam=='') {
		sParam = 'left=10,top=100,width=770,height=450,location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes'
	}
	window.open(sURL, 'winNews', sParam, false)
}
function OpenWinNewsResearch()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

//	nLeft = (scrWidth - 770) /2
//	nTop = (scrHeight - 450) /2
//	window.open('/gc/newsResearch.jsp', 'winNewsCorpResearch', 'left='+ nLeft +',top='+ nTop +',width=770,height=450,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no', false)
	window.open('/gc/newsResearch.jsp', 'winNewsCorpResearch', '', false)
}


function OpenWinCliLogin()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 300) /2
	nTop = (scrHeight - 225) /2
	window.open('/gcUTRADEPlus/cliLoginQsee.jsp', 'winCliLogin', 'left='+ nLeft +',top='+ nTop +',width=300,height=225,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no', false)
}

function OpenWinCliChgPwd(vsURL)
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 800) /2
	nTop = (scrHeight - 420) /2
	if (vsURL == '') {
		vsURL = '/gcUTRADEPlus/cliChgPasswd.jsp'
	}
	window.open(vsURL, 'winCliPwdPIN', 'left='+ nLeft +',top='+ nTop +',width=360,height=415,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no', false)
}
function OpenWinCliForgetPwd(vsURL)
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 415) /2
	nTop = (scrHeight - 230) /2
	if (vsURL == '') {
		vsURL = '/gcUTRADEPlus/cliForgetPwd.jsp'
	}
	window.open(vsURL, 'winCliPwdPIN', 'left='+ nLeft +',top='+ nTop +',width=360,height=270,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no', false)
}
function OpenWinCliChgPIN(vsURL)
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 320) /2
	nTop = (scrHeight - 255) /2
	if (vsURL == '') {
		vsURL = '/gcUTRADEPlus/cliChgPIN.jsp'
	}
	window.open(vsURL, 'winCliPwdPIN', 'left='+ nLeft +',top='+ nTop +',width=360,height=318,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no', false)
}
function OpenWinCliForgetPIN(vsURL)
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 420) /2
	nTop = (scrHeight - 230) /2
	if (vsURL == '') {
		vsURL = '/gcUTRADEPlus/cliForgetPIN.jsp'
	}
	window.open(vsURL, 'winCliPwdPIN', 'left='+ nLeft +',top='+ nTop +',width=360,height=270,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no', false)
}

function OpenWinCliReg()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 785) /2
	nTop = (scrHeight - 620) /2

	window.open('/gcUTRADEPlus/cliTermCond.jsp', 'winCliReg', 'left='+ nLeft +',top='+ nTop +',width=785,height=620,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false)
}

//param is vsLang, bPopUp, bProxySafe
function OpenWinStkRealTime(vsLang)
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop, sURL

	nLeft = (scrWidth - 780) /2
	nTop = (scrHeight - 475) /2
	if (vsLang == 'CN')
		sURL = '/gcUTRADEPlus/stkRealTimeAWT.jsp?lang=CN'
	else if (vsLang == 'EN'){
		//check ProxySafe
		if (OpenWinStkRealTime.arguments.length > 2 && (OpenWinStkRealTime.arguments[2] == true))
			sURL = '/gcUTRADEPlus/stkRealTimeAWT.jsp?lang=EN'
		else
			sURL = '/gcUTRADEPlus/stkRealTimeAWT.jsp?lang=EN'
	} else if (vsLang == 'Future') {
		sURL = '/gcUTRADEPlus/stkRealTimeFuture.jsp?lang=EN'
	} else if (vsLang == 'Future-CN') {
		sURL = '/gcUTRADEPlus/stkRealTimeFuture.jsp?lang=CN'
	}

	//check PopUp
	if (OpenWinStkRealTime.arguments.length > 1 && (OpenWinStkRealTime.arguments[1] == true))
		window.open(sURL, 'winStkRealTime', 'left='+ nLeft +',top='+ nTop +',width=780,height=475,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no', false)
	else
		window.location.href = sURL;
}

//param is vsLang, vbPopUp
function OpenWinStkFuture(vsLang, vbPopUp)
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop, sURL;

	nLeft = (scrWidth - 780) /2;
	nTop = (scrHeight - 550) /2;

	sURL = '/gcUTRADEPlus/stkRealTimeFuture.jsp?lang='+ vsLang;

	//check PopUp
	if (vbPopUp == true)
		window.open(sURL, 'winStkFuture', 'left='+ nLeft +',top='+ nTop +',width=780,height=550,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no', false)
	else
		window.location.href = sURL;
}

function OpenWinDemo()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 655) /2
	nTop = (scrHeight - 425) /2
	window.open('http://secure.itradecimb.com.my/web/demo.htm', 'winDemo', 'left='+ nLeft +',top='+ nTop +',width=655,height=425,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no', false)
}

function OpenWinStlOutstandingCliPos()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 780) /2
	nTop = (scrHeight - 510) /2
	window.open('https://www.amesecurities.com.my/gc/stlOutstandingCliPos.jsp', 'winStl', 'left='+ nLeft +',top='+ nTop +',width=780,height=510,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false)
}
function OpenWinStlPayStatus()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 635) /2
	nTop = (scrHeight - 330) /2
	window.open('/gc/stlPayStatus.jsp', 'winStlPayStatus', 'left='+ nLeft +',top='+ nTop +',width=635,height=330,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false)
}
function OpenWinStlDepositStatus()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 535) /2
	nTop = (scrHeight - 330) /2
	window.open('https://www.amesecurities.com.my/gc/stlDepositStatus.jsp', 'winStlDepStatus', 'left='+ nLeft +',top='+ nTop +',width=535,height=330,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false)
}

function OpenWinGameMenu()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 800) /2
	nTop = (scrHeight - 580) /2
	window.open('http://game.itradecimb.com/gc/gameMenu.jsp', 'winGameMenu', 'left='+ nLeft +',top='+ nTop +',width=800,height=580,location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes', false)
}
function OpenWinStkRealTimeGame(vsLang)
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop, sURL

	nLeft = (scrWidth - 780) /2
	nTop = (scrHeight - 555) /2
	if (vsLang == 'CN')
		sURL = '/gc/stkRealTimeGame.jsp?lang=CN'

	else {
		//check ProxySafe
		if (OpenWinStkRealTimeGame.arguments.length > 2 && (OpenWinStkRealTimeGame.arguments[2] == true))
			sURL = '/gc/stkRealTimeGameAWT.jsp?lang=EN'
		else
			sURL = '/gc/stkRealTimeGameAWT.jsp?lang=EN'
	}

	//check PopUp
	if (OpenWinStkRealTimeGame.arguments.length > 1 && (OpenWinStkRealTimeGame.arguments[1] == true))
		window.open(sURL, 'winStkRealTime', 'left='+ nLeft +',top='+ nTop +',width=780,height=555,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no', false)
	else
		window.location.href = sURL;
}
function OpenWinCliRegGame()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 785) /2
	nTop = (scrHeight - 485) /2
	window.open('/gc/cliTermCond_Game.jsp', 'winCliReg', 'left='+ nLeft +',top='+ nTop +',width=790,height=485,location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes', false)
}
function OpenWinGameRanking()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 780) /2
	nTop = (scrHeight - 555) /2
	window.open('/gc/anlyRanking.jsp?Game=Y', 'winGameRanking', 'left='+ nLeft +',top='+ nTop +',width=800,height=450,location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes', false)
}
function OpenWinGameRule()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 785) /2
	nTop = (scrHeight - 485) /2
	window.open('/gcUTRADEPlus/cliTermCond_Game.jsp', 'winFAQGameRule', 'left='+ nLeft +',top='+ nTop +',width=790,height=485,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false)
}

function OpenWinPrtfSumm()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 770) /2
	nTop = (scrHeight - 450) /2
	window.open('/gcUTRADEPlus/prtfSumm.jsp', 'winPrtf', 'left='+ nLeft +',top='+ nTop +',width=770,height=450,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false)
}
function OpenWinInfoSiteMap()
{
	window.open('/web/infoSiteMap.jsp', 'winInfoSiteMap', 'left=0,top=0,width=350,height=400,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false)
}
function OpenWinCancelReqFAQ()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 590) /2
	nTop = (scrHeight - 270) /2
	window.open('/web/faqCancelRequest.htm', 'winFAQCancel', 'left='+ nLeft +',top='+ nTop +',width=590,height=270,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no', false);
}
function OpenWinSMSDemo()
{
	var sURL = "/web/demoSMS.htm" 
	var sParam = 'left=10,top=100,width=660,height=310,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no'

	window.open(sURL , 'winSMSDemo', sParam, false);
}

function OpenWinCliReg_KenWeb()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop


	nLeft = (scrWidth - 785) /2
	nTop = (scrHeight - 520) /2

	window.open('/gc/cliTermCond.jsp?Op=KenWeb', 'winCliReg', 'left='+ nLeft +',top='+ nTop +',width=785,height=520,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false)
}
function OpenWinTrdChannel()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 625) /2
	nTop = (scrHeight - 490) /2
	window.open('/gcUTRADEPlus/cliProfilerTrd.jsp', 'winSMSTrd', 'left='+ nLeft +',top='+ nTop +',width=625,height=490,location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=no', false)
}
function OpenWinSMSTrdEdit()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 465) /2
	nTop = (scrHeight - 235) /2
	window.open('/gcUTRADEPlus/cliProfilerTrdEdit.jsp', 'winSMSTrdSetting', 'left='+ nLeft +',top='+ nTop +',width=465,height=235,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false)
}
function OpenNormalWindow(psUrl,psTargetWindow,psParam) {
	var sUrl;
	if (psParam=='') {
		psParam = 'left=10,top=100,width=770,height=450,location=yes,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes';
	}
	if (psUrl.indexOf("http") < 0) {
		sUrl = "http://" + this.location.host + "/" + psUrl;
	} else {
		sUrl = psUrl;
	}
	//alert(psParam);
	window.open(sUrl,psTargetWindow,psParam);
}
function OpenWinCliProfiler()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 720) /2
	nTop = (scrHeight - 220) /2
	window.open('/gcUTRADEPlus/cliProfilerTrd.jsp', 'winCliReg', 'left='+ nLeft +',top='+ nTop +',width=720,height=520,location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes', false)
}
function OpenWinDiffSet(sUrl, sWidth, sHeight){
	var sWidths
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - sWidth) /2
	nTop = (scrHeight - sHeight) /2

	if ((sWidth == "")||(sWidth == null))	sWidth = 670;
	if ((sHeight == "")||(sHeight == null))	sHeight = 520;

	if ((sUrl != "")&&(sUrl != null)){
		oNewWindow = window.open(sUrl,'win','left='+ nLeft +',top='+ nTop +',width='+ sWidth +',height='+ sHeight +',location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no', false);
//		oNewWindow.focus();
	}
}
function openWinFAQGTDExpiry(){
	window.open('/gcUTRADEPlus/web/faqGTDExpiry.htm','','height=200,width=650');
}

function A_OnClick(vsLinkURL, vsParam){
	if (vsParam == '')
		vsParam = 'top=0,left=100,width=800,height=520,scrollbars=yes'
	OpenLinkWindow(vsLinkURL, 'WinNewsCIMBS', vsParam);
}
