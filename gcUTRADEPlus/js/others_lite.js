// JavaScript Document

function mmLoadMenus(opt,page) {
	
  if (opt != "RT") {
		  if (window.mm_menu_0719160026_0) return;
		
			/* menu - Sign Up */
			window.mm_menu_0719160025_0 = new Menu("root",220,20,"Arial",11,"#003366","#ffffff","#eeeeee","#003366","left","middle",5,0,100,-5,7,true,true,true,0,false,true);
			mm_menu_0719160025_0.addMenuItem("&nbsp;&nbsp;Individual Online Registration",         "location='javascript:OpenWinCliReg();'");
			mm_menu_0719160025_0.addMenuItem("&nbsp;&nbsp;Corporate Online Registration",          "location='javascript:OpenWinCliRegCompany();'");
			mm_menu_0719160025_0.addMenuItem("&nbsp;&nbsp;Opening a Trading Account",              "location='/web/faqCliAcctReg.asp'");
			mm_menu_0719160025_0.addMenuItem("&nbsp;&nbsp;Opening a Cross Border Trading Account", "location='/web/faqCliAcctRegCBorder.asp'");
			mm_menu_0719160025_0.hideOnMouseOut=true;
			mm_menu_0719160025_0.bgColor='#555555';
			mm_menu_0719160025_0.menuBorder=1;
			mm_menu_0719160025_0.menuLiteBgColor='#FFFFFF';
			mm_menu_0719160025_0.menuBorderBgColor='#777777';
		
			/* menu - Trading Hall */
			window.mm_menu_0719160026_0 = new Menu("root",200,20,"Arial",11,"#003366","#ffffff","#eeeeee","#003366","left","middle",5,0,100,-5,7,true,true,true,0,false,true);
			mm_menu_0719160026_0.addMenuItem("&nbsp;&nbsp;TC Lite - Beta", 						 "location='/gcCIMB/applet/qsea_tclite.jsp'");
			mm_menu_0719160026_0.hideOnMouseOut=true;
			mm_menu_0719160026_0.bgColor='#555555';
			mm_menu_0719160026_0.menuBorder=1;
			mm_menu_0719160026_0.menuLiteBgColor='#FFFFFF';
			mm_menu_0719160026_0.menuBorderBgColor='#777777';
		
			/* menu - Research */
			window.mm_menu_0719160027_0 = new Menu("root",140,20,"Arial",11,"#003366","#ffffff","#eeeeee","#003366","left","middle",5,0,100,-5,7,true,true,true,0,false,true);
			mm_menu_0719160027_0.addMenuItem("&nbsp;&nbsp;Bursa Malaysia Archive", "location='/bin/newsKLSE.asp'");
			mm_menu_0719160027_0.addMenuItem("&nbsp;&nbsp;Corporate Research",     "location='/bin/newsResearch.asp'");
			mm_menu_0719160027_0.hideOnMouseOut=true;
			mm_menu_0719160027_0.bgColor='#555555';
			mm_menu_0719160027_0.menuBorder=1;
			mm_menu_0719160027_0.menuLiteBgColor='#FFFFFF';
			mm_menu_0719160027_0.menuBorderBgColor='#777777';
		
			/* menu - FAQs */
			window.mm_menu_0719160028_0 = new Menu("root",130,20,"Arial",11,"#003366","#ffffff","#eeeeee","#003366","left","middle",5,0,100,-5,7,true,true,true,0,false,false);
			mm_menu_0719160028_0.addMenuItem("&nbsp;&nbsp;&nbsp;i*Trade@CIMB",         "location='/web/faqAccOpen.asp'");
			mm_menu_0719160028_0.addMenuItem("&nbsp;&nbsp;&nbsp;m*Trade@CIMB",         "location='/web/faqMTradeCIMB.asp'");
			mm_menu_0719160028_0.addMenuItem("&nbsp;&nbsp;&nbsp;sms*Trade@CIMB",       "location='/web/faqSMSTradeCIMB.asp'");
			mm_menu_0719160028_0.addMenuItem("&nbsp;&nbsp;&nbsp;PDA Trading",          "location='/web/faqMobileTrading.asp'");
			mm_menu_0719160028_0.addMenuItem("&nbsp;&nbsp;&nbsp;Islamic StockBroking", "location='/web/faqIslamicStockBroking.asp'");
			mm_menu_0719160028_0.addMenuItem("&nbsp;&nbsp;&nbsp;Cross Border Trading", "location='/web/faqCBTAccOpen.asp'");
			mm_menu_0719160028_0.addMenuItem("&nbsp;&nbsp;&nbsp;Futures Trading",      "OpenWinFuture()");
			mm_menu_0719160028_0.hideOnMouseOut=true;
			mm_menu_0719160028_0.bgColor='#555555';
			mm_menu_0719160028_0.menuBorder=1;
			mm_menu_0719160028_0.menuLiteBgColor='#FFFFFF';
			mm_menu_0719160028_0.menuBorderBgColor='#777777';
		
			/* menu - Demos */
			
			window.mm_menu_0719160029_0 = new Menu("root",110,20,"Arial",11,"#003366","#ffffff","#eeeeee","#003366","left","middle",5,0,100,-5,7,true,true,true,0,false,true);
			mm_menu_0719160029_0.addMenuItem("&nbsp;&nbsp;i*Trade@CIMB",   "location='javascript:OpenWinDemo();'");
			//mm_menu_0719160029_0.addMenuItem("&nbsp;&nbsp;sms*Trade@CIMB", "location='javascript:OpenWinDemoSMS();'");
			mm_menu_0719160029_0.addMenuItem("&nbsp;&nbsp;e*IPO@CIMB",     "location='javascript:OpenWinDemoEIPO();'");
			mm_menu_0719160029_0.hideOnMouseOut=true;
			mm_menu_0719160029_0.bgColor='#555555';
			mm_menu_0719160029_0.menuBorder=1;
			mm_menu_0719160029_0.menuLiteBgColor='#FFFFFF';
			mm_menu_0719160029_0.menuBorderBgColor='#777777';
			

			mm_menu_0719160026_0.writeMenus();
	
	} else {
  		if (window.mm_menu_0719160026_0) return;

			/* menu - Trading Hall */
			window.mm_menu_0719160026_0 = new Menu("root",155,20,"Arial",11,"#000000","#ffffff","#E5E4D7","#3399FF","left","middle",5,0,100,-5,7,true,true,true,0,false,true);
			mm_menu_0719160026_0.addMenuItem("&nbsp;&nbsp;TC Lite - Beta", 						 "location='/gcCIMB/applet/qsea_tclite.jsp'");			
			mm_menu_0719160026_0.hideOnMouseOut=true;
			mm_menu_0719160026_0.bgColor='#555555';
			mm_menu_0719160026_0.menuBorder=1;
			mm_menu_0719160026_0.menuLiteBgColor='#FFFFFF';
			mm_menu_0719160026_0.menuBorderBgColor='#777777';
		
			/* menu - Settlement */
			window.mm_menu_0719160027_0 = new Menu("root",145,20,"Arial",11,"#000000","#ffffff","#E5E4D7","#3399FF","left","middle",5,0,100,-5,7,true,true,true,0,false,true);
			mm_menu_0719160027_0.addMenuItem("&nbsp;&nbsp;eSettlement",       "location='javascript:OpenWinStlOutstandingCliPos();'");
			mm_menu_0719160027_0.addMenuItem("&nbsp;&nbsp;Settlement Status", "location='javascript:OpenWinStlPayStatus();'");
			mm_menu_0719160027_0.addMenuItem("&nbsp;&nbsp;eDeposit",          "location='javascript:OpenWinStlDepositStatus();'");
			mm_menu_0719160027_0.hideOnMouseOut=true;
			mm_menu_0719160027_0.bgColor='#555555';
			mm_menu_0719160027_0.menuBorder=1;
			mm_menu_0719160027_0.menuLiteBgColor='#FFFFFF';
			mm_menu_0719160027_0.menuBorderBgColor='#777777';
		
			/* menu - My Profile for team leader*/
			window.mm_menu_0719160028_0 = new Menu("root",145,20,"Arial",11,"#ffffff","#ffffff","#828282","#212121","left","middle",5,0,100,-5,7,true,true,true,0,false,true);
			mm_menu_0719160028_0.addMenuItem("<IMG src=../img/ITRADE-CIMB/button/acc-arrow-itrade.gif />&nbsp;<b>Change Password</b>",     "location='javascript:OpenWinCliChgPwd(\"../cliChgPasswd.jsp\");'");
		//	mm_menu_0719160028_0.addMenuItem("<IMG src=../img/ITRADE-CIMB/button/acc-arrow-itrade.gif />&nbsp;<b>Forgot Password</b>",     "location='javascript:OpenWinCliForgetPwd(\"../cliForgetPwd.jsp?secure=Y\");'");
			mm_menu_0719160028_0.addMenuItem("<IMG src=../img/ITRADE-CIMB/button/acc-arrow-itrade.gif />&nbsp;<b>Change Pin</b>",          "location='javascript:OpenWinCliChgPIN(\"../cliChgPIN.jsp\");'");
			mm_menu_0719160028_0.addMenuItem("<IMG src=../img/ITRADE-CIMB/button/acc-arrow-itrade.gif />&nbsp;<b>Forgot Pin</b>",          "location='javascript:OpenWinCliForgetPIN(\"../cliForgetPIN.jsp\");'");
                  	mm_menu_0719160028_0.hideOnMouseOut=true;
			mm_menu_0719160028_0.bgColor='#828282';
			mm_menu_0719160028_0.menuBorder=1;
			mm_menu_0719160028_0.menuLiteBgColor='#828282';
			mm_menu_0719160028_0.menuBorderBgColor='#828282';


			/* menu - My Profile for team member*/
			window.mm_menu_0719160029_0 = new Menu("root",145,20,"Arial",11,"#ffffff","#ffffff","#828282","#212121","left","middle",5,0,100,-5,7,true,true,true,0,false,true);
			mm_menu_0719160029_0.addMenuItem("<IMG src=../img/ITRADE-CIMB/button/acc-arrow-itrade.gif />&nbsp;<b>Change Password</b>",     "location='javascript:OpenWinCliChgPwd(\"../cliChgPasswd.jsp\");'");
//			mm_menu_0719160029_0.addMenuItem("<IMG src=../img/ITRADE-CIMB/button/acc-arrow-itrade.gif />&nbsp;<b>Forgot Password</b>",     "location='javascript:OpenWinCliForgetPwd(\"../cliForgetPwd.jsp?secure=Y\");'");
			mm_menu_0719160029_0.addMenuItem("<IMG src=../img/ITRADE-CIMB/button/acc-arrow-itrade.gif />&nbsp;<b>Change Pin</b>",          "location='javascript:OpenWinCliChgPIN(\"../cliChgPIN.jsp\");'");
			mm_menu_0719160029_0.addMenuItem("<IMG src=../img/ITRADE-CIMB/button/acc-arrow-itrade.gif />&nbsp;<b>Forgot Pin</b>",          "location='javascript:OpenWinCliForgetPIN(\"../cliForgetPIN.jsp\");'");
                  	mm_menu_0719160029_0.hideOnMouseOut=true;
			mm_menu_0719160029_0.bgColor='#828282';
			mm_menu_0719160029_0.menuBorder=1;
			mm_menu_0719160029_0.menuLiteBgColor='#828282';
			mm_menu_0719160029_0.menuBorderBgColor='#828282';
		
			mm_menu_0719160026_0.writeMenus();		
	}
} // mmLoadMenus()

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_nbGroup(event, grpName) { //v6.0
  var i,img,nbArr,args=MM_nbGroup.arguments;
  if (event == "init" && args.length > 2) {
    if ((img = MM_findObj(args[2])) != null && !img.MM_init) {
      img.MM_init = true; img.MM_up = args[3]; img.MM_dn = img.src;
      if ((nbArr = document[grpName]) == null) nbArr = document[grpName] = new Array();
      nbArr[nbArr.length] = img;
      for (i=4; i < args.length-1; i+=2) if ((img = MM_findObj(args[i])) != null) {
        if (!img.MM_up) img.MM_up = img.src;
        img.src = img.MM_dn = args[i+1];
        nbArr[nbArr.length] = img;
    } }
  } else if (event == "over") {
    document.MM_nbOver = nbArr = new Array();
    for (i=1; i < args.length-1; i+=3) if ((img = MM_findObj(args[i])) != null) {
      if (!img.MM_up) img.MM_up = img.src;
      img.src = (img.MM_dn && args[i+2]) ? args[i+2] : ((args[i+1])? args[i+1] : img.MM_up);
      nbArr[nbArr.length] = img;
    }
  } else if (event == "out" ) {
    for (i=0; i < document.MM_nbOver.length; i++) {
      img = document.MM_nbOver[i]; img.src = (img.MM_dn) ? img.MM_dn : img.MM_up; }
  } else if (event == "down") {
    nbArr = document[grpName];
    if (nbArr)
      for (i=0; i < nbArr.length; i++) { img=nbArr[i]; img.src = img.MM_up; img.MM_dn = 0; }
    document[grpName] = nbArr = new Array();
    for (i=2; i < args.length-1; i+=2) if ((img = MM_findObj(args[i])) != null) {
      if (!img.MM_up) img.MM_up = img.src;
      img.src = img.MM_dn = (args[i+1])? args[i+1] : img.MM_up;
      nbArr[nbArr.length] = img;
  } }
}

function MM_openBrWindow(theURL,winName,features) { //v2.0
  window.open(theURL,winName,features);
}

function MM_OpenWin(vsLinkURL, vsParam) {
	if (vsParam == '')
		vsParam = "top=0,left=100,width=820,height=600,scrollbars=yes"
	window.open(vsLinkURL, "_blank", vsParam);
}

function OpenWinDemo()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 650) /2
	nTop = (scrHeight - 420) /2
	window.open('/web/demo.htm', 'winDemo', 'left='+ nLeft +',top='+ nTop +',width=780,height=580,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=no', false)
}

function OpenWinFuture()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 650) /2
	nTop = (scrHeight - 420) /2
	//window.open('http://www.cimb.com.my/article.cfm?id=498', 'winFuture', 'left='+ nLeft +',top='+ nTop +',width=780,height=580,location=yes,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes', false)
	window.open('http://www.ib.cimb.com/index.php?ch=ib_busi_equity_futures&tpt=1', 'winFuture', 'left='+ nLeft +',top='+ nTop +',width=780,height=580,location=yes,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes', false)
}

function OpenWinCliRegCompany()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 795) /2
	nTop = (scrHeight - 500) /2
	window.open('/gcCIMB/cliTermCond.jsp?type=C', 'winCliReg', 'left='+ nLeft +',top='+ nTop +',width=795,height=500,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false)
}

function OpenWinCliAcctInfo() 
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft = 0, nTop = 0

	nLeft = (scrWidth - 800) /2;
	nTop = (scrHeight - 420) /2;

	window.open('/gcCIMB/acctInfo.jsp', 'winAcctInfo', 'left='+ nLeft +',top='+ nTop +',width=800,height=435,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false);
}

function OpenWinStlOutstandingCliPos()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 780) /2
	nTop = (scrHeight - 510) /2
	window.open('/gcCIMB/stlOutstandingCliPos.jsp', 'winStl', 'left='+ nLeft +',top='+ nTop +',width=780,height=600,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false)
}
function OpenWinStlPayStatus()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 635) /2
	nTop = (scrHeight - 330) /2
	window.open('/gcCIMB/stlPayStatus.jsp', 'winStlPayStatus', 'left='+ nLeft +',top='+ nTop +',width=635,height=330,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false)
}
function OpenWinStlDepositStatus()
{
	var scrWidth=screen.width, scrHeight=screen.height, nLeft, nTop

	nLeft = (scrWidth - 600) /2
	nTop = (scrHeight - 530) /2
//	window.open('/bin/stlDepositStatus.asp', 'winStlDepStatus', 'left='+ nLeft +',top='+ nTop +',width=555,height=400,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false)
//	window.open('/bin/stlDepositStatus.asp', 'winStlDepStatus', 'left='+ nLeft +',top='+ nTop +',width=555,height=530,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false)
	window.open('/gcCIMB/stlDepositStatus.jsp', 'winStlDepStatus', 'left='+ nLeft +',top='+ nTop +',width=655,height=530,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes', false)
}
