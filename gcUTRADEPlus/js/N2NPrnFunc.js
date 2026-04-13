window.onbeforeprint=beforePrint;
window.onafterprint=afterPrint;

function beforePrint()
{	
	var collDiv = document.all.tags("div");
	
	if (collDiv != null) {

			for (var i=0; i < collDiv.length; ++i) {
				
					if (collDiv[i].style.height != "" && collDiv[i].style.height != "undefined") {
							collDiv[i].prevHeight = collDiv[i].style.height
							collDiv[i].style.height = "auto"
					} else {
							collDiv[i].prevHeight = ""
					}
		
					if (collDiv[i].id == "divPrnFooter") {
						
							if (document.frmPrnFooter.txtLoginID != null) {
									
									var sLoginID, lstTrdAcc, sDisplay;
									sLoginID = document.frmPrnFooter.txtLoginID.value;
									lstTrdAcc = document.frmPrnFooter.lstTrdAcc.value;
									sDisplay = "&nbsp;<b>Printed by "+ sLoginID;
									
									if (document.getElementById("selTrdAcc")) {

											iSelectedIndex = document.getElementById("selTrdAcc").selectedIndex;
											iSelectedValue = document.getElementById("selTrdAcc").options[iSelectedIndex].value;
											
											if ((iSelectedValue == "0") || (iSelectedValue == "")) {
													if (lstTrdAcc != "") {
															sDisplay += " "+ lstTrdAcc;
													}
											} else {
													var sAcctNo = iSelectedValue.substring(1, 9);
													sAcctNo = sAcctNo.substring(0,9).replace(/-/, "");
													if (lstTrdAcc != "") 
															sDisplay += " (Acc: " + sAcctNo + ")";
											}
									}
									
									sDisplay += " at "+ Date().toString() +"</b>";
									document.all.lblDisplay.innerHTML = sDisplay
							}
					}
			}
	}
}

function afterPrint()
{
	//if(navigator.userAgent.indexOf("Firefox")!=-1) return false;

	var collDiv = document.all.tags("div")
	if (collDiv != null) {
		for (var i=0; i < collDiv.length; ++i) {
			if (collDiv[i].prevHeight != "") {
				collDiv[i].style.height = collDiv[i].prevHeight
				//collDiv[i].style.height = "auto";
			}

			if (collDiv[i].id == "divPrnFooter") {
				if (document.frmPrnFooter.txtLoginID != null) {
					document.all.lblDisplay.innerHTML = ""
				}
			}
		}
	}
}
