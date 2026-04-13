var loginAction = "0";
var loginTrigger = false;
var forceLogout = false;

//check session
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
			chgLayout(1);
		}else if (logon.s=="false" && logon.lid){ //For login activation
			$('#frmLogin_userID').val(logon.lid);
			$("#frmLogin_userID").prop("disabled",true);
			chgLayout(0);
		}else{
			chgLayout(0);
		}
	}
}

//login
function login(activate){
	var jsonObject = {};
	jsonObject['lid'] = $("#frmLogin_userID").val();
	jsonObject['pwd'] = $("#frmLogin_password").val();
	jsonObject['srnsz'] = screen.width+"x"+screen.height;
	if(activate)
		jsonObject['actv'] = activate;
	console_log("login:"+JSON.stringify(jsonObject));
	loginReq(jsonObject);
}
function loginResp(data){
	console_log("loginResp:"+JSON.stringify(data));
	if(data.s&&data.s=="200"){
		$("#frmLogin_userID").val("");
		$("#frmLogin_password").val("");
		console_log("loginResp:"+data.ev);
		//alert(data.ev);
		var logon = JSON.parse(data.ev);
		$("#lblUsername").html(logon.lid);
		$("#frmForgetPin_userID").val(logon.lid);
		loginAction = logon.lgact;
		if(!chkAction()){
			chgLayout(1);
			top.location = tradingHall_url;
		}
		
	}else{
	//	$("#frmLogin_userID").val("");
		$("#frmLogin_password").val("");
		alert(data.msg);
	}
}

//forget password
function forgetPwd(){
	var jsonObject = {};
	jsonObject['lid'] = $("#frmForgetPwd_userID").val();
	jsonObject['ht'] = $("#frmForgetPwd_pwdHint").val();
	jsonObject['hta'] = $("#frmForgetPwd_ansHint").val();
	jsonObject['ppflg'] = 1; // indicate forget pin
	jsonObject['eflg'] = 1; // indicate email sender
	console_log("forgetPwd:"+JSON.stringify(jsonObject));
	forgetPwdReq(jsonObject);
}
function forgetPwdResp(data){
	console_log("forgetPwdResp:"+JSON.stringify(data));
	if(data.s&&data.s=="200"){
		alert(data.msg);
		resetResetPwdForm();
		chgLayout(0);		
	}else{
		alert(data.msg);
	}	
}

//forget pin
function forgetPin(){
	var jsonObject = {};
	jsonObject['lid'] = $("#frmForgetPin_userID").val();
	jsonObject['ht'] = $("#frmForgetPin_pinHint").val();
	jsonObject['hta'] = $("#frmForgetPin_ansHint").val();
	jsonObject['ppflg'] = 2; // indicate forget pin
	jsonObject['eflg'] = 1; // indicate email sender
	console_log("forgetPin:"+JSON.stringify(jsonObject));
	forgetPinReq(jsonObject);
}
function forgetPinResp(data){
	console_log("forgetPinResp:"+JSON.stringify(data));
	if(data.s&&data.s=="200"){
		alert(data.msg);
		resetResetPinForm();
		chgLayout(1);		
	}else{
		alert(data.msg);
	}
}

//get hint
function getHint(frm){
	var jsonObject = {};
	jsonObject['lid'] = $("#"+frm+"_userID").val();
	if(frm=="frmForgetPwd"){
		jsonObject['ppflg'] = "1";
	}
	if(frm=="frmForgetPin"){
		jsonObject['ppflg'] = "2";
	}
	console_log("getHint:"+JSON.stringify(jsonObject));
	getHintReq(jsonObject);
}
function getHintResp(data){
	console_log("getHintResp:"+JSON.stringify(data));
	if(data.s&&data.s=="200"){
		console_log("getHintResp:"+data.ev);
		var logon = JSON.parse(data.ev);
		if(logon.ppflg=="1"){
			$("#frmForgetPwd_pwdHint").val(logon.ht).prop("disabled",true);
			$("#frmForgetPwd_ansHint").prop("disabled",false).focus();
			$("#frmForgetPwd_userID").prop("disabled",true);
			$("#frmForgetPwd_btnGetHint").prop("disabled",true);
		}
		if(logon.ppflg=="2"){
			$("#frmForgetPin_pinHint").val(logon.ht).prop("disabled",true);
			$("#frmForgetPin_ansHint").prop("disabled",false).focus();
		}
	}else{
		alert(data.msg);
		if($("#frmForgetPwd").is(':visible')){
			$("#frmForgetPwd_userID").val("").focus();
		}
		if($("#frmForgetPin").is(':visible')){
			$("#frmForgetPin_userID").val("");
		}
	}
}

//change password
function chgPwd(){
	var jsonObject = {};
	jsonObject['opwd'] = $("#frmForceChgPwd_oldPwd").val();
	jsonObject['npwd'] = $("#frmForceChgPwd_newPwd").val();
	console_log("chgPwd:"+JSON.stringify(jsonObject));
	chgPwdReq(jsonObject);
}
function chgPwdResp(data){
	console_log("chgPwdResp:"+JSON.stringify(data));
	if(data.s&&data.s=="200"){
		alert(data.msg);
		updLoginAction(1, true);
		if(!chkAction()){
			chgLayout(1);
		}
	}else{
		alert(data.msg);
	}
}

//change pin
function chgPin(){
	var jsonObject = {};
	jsonObject['opin'] = $("#frmForceChgPin_oldPin").val();
	jsonObject['npin'] = $("#frmForceChgPin_newPin").val();
	console_log("chgPin:"+JSON.stringify(jsonObject));
	chgPinReq(jsonObject);
}
function chgPinResp(data){
	console_log("chgPinResp:"+JSON.stringify(data));
	if(data.s&&data.s=="200"){
		alert(data.msg);
		updLoginAction(2, false);
		if(!chkAction()){
			chgLayout(1);
		}		
	}else{
		alert(data.msg);
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
		window.location = loginPage_url;
	}else{
		alert(data.msg);
	}
}

// check if special action required (force change pwd/pin)
function chkAction(){
	loginAction=(loginAction!=null)?loginAction:"0";
	switch(loginAction){
		case "0":
			if(forceLogout){
				forceLogout = false;
				chgLayout(7);
				return true;
			}else{
				return false;
			}			
			break;
		case "1": //chgPwd
		case "3": //chgPwd + chgPin
		case "5": //chgPwd + chgHint
		case "7": //chgPwd + chgPin + chgHint
			loginTrigger = true;
			chgLayout(4);
			return true;
			break;
		case "2": //chgPin
		case "6": //chgPin + chgHint
			loginTrigger = true;
			chgLayout(5);
			return true;
			break;
		case "4": // chgHint
			loginTrigger = true;
			chgLayout(7);
			return true;
			break;
		default:
			return false;
	}
}

// update login action after success
function updLoginAction(action, bForceLogout){
	if(loginTrigger){
		loginAction = Number(loginAction) ^ action;
		loginTrigger = false;
		if(bForceLogout){
			forceLogout = true;
		}		
	}
}

function resetResetPwdForm(){
	$("#frmForgetPwd_userID").prop("disabled", false);
	$("#frmForgetPwd_btnGetHint").prop("disabled", false);
	$("#frmForgetPwd_pwdHint").prop("disabled", false);
}

function resetResetPinForm(){
	$("#frmForgetPin_btnGetHint").prop("disabled", false);
	$("#frmForgetPin_pwdHint").prop("disabled", false);
}
