function chkSess(){
	var jsonObject = {};
	console_log("chkSess:"+JSON.stringify(jsonObject));
	chkSessReq(jsonObject);
}
function chkSessResp(data){
	console_log("chkSessResp:"+JSON.stringify(data));
	if(data.s&&data.s=="200"){
		console_log("chkSessResp:"+data.ev);
		var logon = JSON.parse(data.ev);
		if(logon.s=="true"){
			$("#lblUsername").html(logon.lid);
			$("#frmForgetPin_userID").val(logon.lid);
			//chgLayout(1);

	        //added 2 lines below to hide buttons if category is trial
			if (logon.ctgy=="T") {
	            $("#isTrial").show();
			}

			else{//prevent from calling getRiskScore function when trial
				getRiskScore();
			}

		}else{
			//chgLayout(0);
			alert("Please login to view this page");
			window.location.href = "../../web/html/cliLogin.html";
		}
	}
}

function getRiskScore(){

	var jsonObject = {};
	console_log("getRiskScore:"+JSON.stringify(jsonObject));
	getRiskScoreReq(jsonObject);

}

function getRiskScoreResp(data) {
	console_log("getRiskScoreResp:"+JSON.stringify(data));
	if(data.s&&data.s=="200"){
		console_log("getRiskScoreResp:"+data.ev);
		var risk_data = JSON.parse(data.ev);
		var score = risk_data.scr;
		if(score=="0"){
			console.log("Display questionnaire");
			$("#frmInvestorProfile").show();

		}else{
			$("#hasScore").show();
			$("#score").append(score);

		}
	}
}

function updRiskScore(){

	var jsonObject = {};
	jsonObject['tlScore'] = $("#frmRegister_mfTotalScore").val();

	console_log("updRiskScore:"+JSON.stringify(jsonObject));
	updRiskScoreReq(jsonObject);

}

function updRiskScoreResp(data) {
	console_log("updRiskScoreResp:"+JSON.stringify(data));
	//parent.location.reload();

	var s = confirm("Please be informed that in order for the client profile score to reflect correctly and function together with the Mutual Fund filter, a re-login is required.\nPress \"OK\" to logout or \"Cancel\" to continue.");
    if (s) {
    	logout();
		//parent.location.reload();

    }
    else{

    }


}

//logout
function logout(){
	var jsonObject = {};
	console_log("logout:"+JSON.stringify(jsonObject));
	logoutReq(jsonObject);
}
function logoutResp(data){
	console_log("logoutResp:"+JSON.stringify(data));
	if(data.s&&data.s=="200"){
		console_log("Logout successfully!");
		//window.location = loginPage_url;
		window.top.location.href = "/gcUTRADEPlus/web/html/cliLogin.html";

	}else{
		alert(data.msg);
	}
}

/*$("#frmInvestorProfile").submit(function(e) {//added this line to see the error T_T
    e.preventDefault();
});*/
