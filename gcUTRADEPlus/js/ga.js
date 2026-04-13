function checkParameter(href, key){
	var idxStart = href.indexOf(key);
	var param;
	if(idxStart > -1){
		var idxEnd = href.indexOf('&', idxStart);
		if(idxEnd < 0){
			idxEnd = href.length;
		}
		param = href.substring(idxStart, idxEnd);
		if(param.length ==  key.length) //empty parameter
			return;
		gaParam.push(param);
		if(gaHref.indexOf('tcplus/main.jsp') > -1 && key=='lang='){
			gaTitleName += ' - ' + param.split("=")[1];
		}
	}
}

var bGA = true; //turn on google analysis
var trackerID = 'UA-75414657-1';
if(bGA){
	try{
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', trackerID,'auto');

		var gaHref = window.location.href;
		var gaPathName = window.location.pathname;
		var gaTitleName = '';
		var gaParam = new Array();
		
		if(gaHref.indexOf('tcplus/indexM.jsp') > -1){
			gaTitleName = 'TCPlus';
			checkParameter(gaHref, 'view=');
			if(gaHref.indexOf('view=mobile') > -1){
				gaTitleName += ' Mobile';
			}
			checkParameter(gaHref, 'lang=');
			checkParameter(gaHref, 'basic=');
			if(gaHref.toLowerCase().indexOf('basic=y') > -1 ){
				gaTitleName += ' - basic';
			}
		}else if(gaHref.indexOf('tcplus/index.jsp') > -1){
			gaTitleName = 'TCPlus';
		}
		else if(gaHref.indexOf('web/html/cliLogin.html') > -1 || gaHref.indexOf('cliLogin.jsp') > -1){
			gaTitleName = 'Desktop Login Page';
		}else if(gaHref.indexOf('web/html/cliLoginMobile.html') > -1 || gaHref.indexOf('cliLoginMobile.jsp') > -1){
			gaTitleName = 'Mobile Login Page';
		}else if(gaHref.indexOf('web/html/cliLoginActivate.html') > -1){
			gaTitleName = 'Login Activation Page';
		}else if(gaHref.indexOf('cliAcctReg.jsp') > -1){
			gaTitleName = 'Registration';
			checkParameter(gaHref, 'category=');
			if(gaHref.indexOf('category=M') > -1){
				gaTitleName += ' - Individual';
			}else if(gaHref.indexOf('category=C') > -1){
				gaTitleName += ' - Corporate';
			}
			checkParameter(gaHref, 'clientType=');
			if(gaHref.indexOf('clientType=E') > -1){
				gaTitleName += ' - Existing';
			}else if(gaHref.indexOf('clientType=N') > -1){
				gaTitleName += ' - New';
			}
		}else if(gaHref.indexOf('cliAcctRegEO.jsp') > -1){
			gaTitleName = 'Registration';
			checkParameter(gaHref, 'type=');
			if(gaHref.indexOf('type=M') > -1){
				gaTitleName += ' - Individual';
			}else if(gaHref.indexOf('type=C') > -1){
				gaTitleName += ' - Corporate';
			}
		}else if(gaHref.indexOf('web/html/cliLogin.html') > -1){
			gaTitleName = 'Desktop Login Page';
		}else if(gaHref.indexOf('web/html/ClientSummReport.html') > -1 || gaHref.indexOf('rptCliPos.jsp') > -1){
			gaTitleName = 'Client Sumary Report';
		}else if(gaHref.indexOf('web/html/MonthlySummRpt.html') > -1 || gaHref.indexOf('rptBosMth.jsp') > -1){
			gaTitleName = 'Monthly Statement Report';
		}else if(gaHref.indexOf('web/html/MarginAccSumm.html') > -1 || gaHref.indexOf('rptMgnSumm.jsp') > -1){
			gaTitleName = 'Margin Account Report';
		}else if(gaHref.indexOf('web/html/TraderDepositReport.html') > -1 || gaHref.indexOf('rptTrdDep.jsp') > -1){
			gaTitleName = 'Trader Deposit Report';
		}else if(gaHref.indexOf('web/html/TradeBeyondReport.html') > -1 || gaHref.indexOf('rptIBeyond.jsp') > -1){
			gaTitleName = 'Trade Beyond Report';
		}else if(gaHref.indexOf('web/html/eSettlement.html') > -1 || gaHref.indexOf('stlOutstandingCliPos.jsp') >-1){
			gaTitleName = 'eSettlement';
		}else if(gaHref.indexOf('web/html/stlPayStatus.html') > -1 || gaHref.indexOf('stlPayStatus.jsp') > -1){
			gaTitleName = 'Settlement Status';
		}else if(gaHref.indexOf('web/html/Client%20Deposit%20Report.html') > -1 || gaHref.indexOf('stlDepositStatus.jsp') > -1){
			gaTitleName = 'eDeposit';
		}else if(gaHref.indexOf('viewSubscriptions.jsp') > -1){
			gaTitleName = 'New Subscription';
		}else if(gaHref.indexOf('currentSubscription.jsp') > -1){
			gaTitleName = 'Current Subscription';
		}else if(gaHref.indexOf('web/html/caSubscription.html') > -1){
			gaTitleName = 'Online CA Instruction';
		}else if(gaHref.indexOf('web/html/caSubscpStatus.html') > -1){
			gaTitleName = 'CA Subscription Status';
		}else if(gaHref.indexOf('news_trading.jsp') > -1){
			gaTitleName = 'News Archive';
		}else if(gaHref.indexOf('tcplus/stkNews.jsp') > -1){
			gaTitleName = 'Stock News';
		}else if(gaHref.indexOf('html5/TTchart.jsp') > -1){
			gaTitleName = 'Teletrader Chart';
		}else if(gaHref.indexOf('anlySmfCalcNB.jsp') > -1){
			gaTitleName = 'Share Margin Financing Calculator';
		}
		
		if(gaParam.length > 0){
			gaPathName += '?' + gaParam.join('&');
		}
		if(gaTitleName.length > 0)
			ga('set', 'title', gaTitleName);
		ga('set', 'page', gaPathName);
		ga('send', 'pageview');
	}catch(e){}
}