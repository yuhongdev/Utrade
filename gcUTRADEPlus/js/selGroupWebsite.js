var sDataList;
var aDataList;
var nDataCount;

sDataList= "||Group Websites";
sDataList= sDataList + "||--------------------";
sDataList= sDataList + "|http://www.commerz.com.my|Bumiputra-Commerce Holdings Berhad";
sDataList= sDataList + "|http://www.cimbgroup.com.my/index.php?tpt=biz|CIMB Biz-Channel";
sDataList= sDataList + "|https://www.cimbclicks.com.my|CIMBClicks";
sDataList= sDataList + "|http://www.cimbaviva.com |CIMB Aviva";
sDataList= sDataList + "|http://www.cimbgroup.com.my/index.php?tpt=cimb_bank|CIMB Bank Berhad";
sDataList= sDataList + "|http://www.cimbgroup.com.my/auction/auction.php?action=view|CIMB Mega Auction";
sDataList= sDataList + "|http://www.cimbgroup.com.my/index.php?tpt=cimb_group|CIMB Group";
sDataList= sDataList + "|http://www.cimbgroup.com.my/index.php?tpt=ib|CIMB Investment Bank Berhad";
sDataList= sDataList + "|http://www.cimbgroup.com.my/index.php?tpt=islamic|CIMB Islamic Bank Berhad";
sDataList= sDataList + "|http://www.cimb.com/warrants/|CIMB Warrants Portal";
sDataList= sDataList + "|http://www.cimbprincipal.com.my/|CIMB-Principal Asset Management Berhad";
sDataList= sDataList + "|http://www.commerce-ventures.com.my|Commerce Asset Ventures Sdn Bhd";
//sDataList= sDataList + "|http://www.commercegroup.com.my|Commerce International Group";
sDataList= sDataList + "|http://www.eipocimb.com/|e*IPO@CIMB";
sDataList= sDataList + "|http://itrade.cimbinvest.com/|CIMBInvest";
sDataList= sDataList + "|http://www.itradecimb.com.my|i*Trade@CIMB";
sDataList= sDataList + "|http://www.bankniaga.com|PT Bank CIMB Niaga Tbk ";
sDataList= sDataList + "|http://www.seabmu.com|South East Asian Bank Ltd (Mauritius)";
sDataList= sDataList + "|http://www.sbb.com.my|Southern Bank Berhad";

aDataList=sDataList.split('|');
nDataCount=((aDataList.length-1)/2);

function selUrlLink(){
	
	var iCtr,jCtr;
	var oItem,TheListBox;

	TheListBox=document.frmSelUrlLink.selUrlLink1;
	/*
	TheListBox.style.width = '150pt';
	TheListBox.style.fontfamily = 'Arial';
	TheListBox.style.fontSize = '7pt';
	*/
	TheListBox.style.color = '#0e3055';

	if(TheListBox!=null){

		iCtr = 1;	
		
		while (iCtr<nDataCount*2) {
				val = aDataList[iCtr++];
				txt = aDataList[iCtr++];
				lgth = TheListBox.options.length - 1;
				TheListBox.options[lgth+1] = new Option(txt,val);
		}
		
	}
}

function MM_jumpMenuCIMBGroup(targ,selObj,restore){ //v3.0
    if (selObj.options[selObj.selectedIndex].value != ""){
      window.open(selObj.options[selObj.selectedIndex].value, targ);
      if (restore) selObj.selectedIndex=0;
    }
}

selUrlLink();