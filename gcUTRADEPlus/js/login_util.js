function getContextPath() {
   return window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
}

var root_url = getContextPath() + "/";
var api_path = root_url+"srvs/";
var check_login_url = api_path+"chkSession?t="+$.now();
var login_url = api_path+"login?t="+$.now();
var login_new_url = "/gcCIMBNEW/srvs/login?t="+$.now();
var logout_url = api_path+"logout?t="+$.now();
var change_pwd_url = api_path+"chgPwd?t="+$.now();
var change_pin_url = api_path+"chgPin?t="+$.now();
var change_hint_url = api_path+"chgHint?t="+$.now();
var forget_pwd_url = api_path+"forgetPwdPin?t="+$.now();
var forget_pin_url = api_path+"forgetPwdPin?t="+$.now();
var get_hint_url = api_path+"getHint?t="+$.now();
var get_key_url = api_path+"getKey?t="+$.now();
var get_key_new_url = "/gcCIMBNEW/srvs/getKey?t="+$.now();
var refresh_flag_url = api_path+"refreshFlag?t="+$.now();

var login_page_url = root_url+"web/html/cliLogin.html";
var mobile_login_page_url = root_url+"web/html/cliLoginMobile.html";
var trading_hall_url = root_url+"tclite/index.jsp";
var trading_hall_plus_url = root_url+"tcplus/index.jsp";
var trading_hall_plus_basic_url = root_url+"tcplus/index.jsp?basic=y";
var trading_hall_plus_new = "/gcCIMBNEW/tcplus/index.jsp";
var trading_hall_plus_new_cn = "/gcCIMBNEW/tcplus/index.jsp?lang=cn";
var trading_hall_mobile_url = root_url+"tcplus/indexM.jsp?view=mobile";
var trading_hall_mobile_basic_url = root_url+"tcplus/indexM.jsp?view=mobile&basic=y";
var research_url = root_url+"newsResearch.jsp";

var login_agent;
var public_key,public_salt,public_iv,public_id;
var activate_login_id = qs("LoginID");
var activation=false;
var action = qs("act");
var login_status=0;

if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () { };

function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx control chars
    var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

function checkLogin(handleData){
	$.ajax({
		type:"GET",
		datatype:"json",
		async:false,
		url:check_login_url,
		//url:check_login_url+"&as_fid="+$('input[name=as_fid]')[0].value+"&as_sfid="+$('input[name=as_sfid]')[0].value,
		data:{loginID:activate_login_id},
		success: function(data){
			handleData(data);
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	});
}

function login(value,checksum){
	$.ajax({
		type:"GET",
		datatype:"json",
		async:true,
		url:login_url,
		data:{v:value,cs:checksum,c:public_id},
		success: function(data){
			login_response(data);
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	});
}

function loginNew(value,checksum){
        $.ajax({
                type:"GET",
                datatype:"json",
                async:true,
                url:login_new_url,
                data:{v:value,cs:checksum,c:public_id},
                success: function(data){
                        login_response(data);
                },
                error: function(jqXHR, textStatus){
                        errorHandling(textStatus);
                }
        });
}


function logout(){
	$("#response").css("display","");
	$.ajax({
		type:"GET",
		datatype:"json",
		async:true,
		url:logout_url,
		success: function(data){
			logout_response(data);
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	});
}

function chgPwd(value,checksum){
	$.ajax({
		type:"GET",
		datatype:"json",
		async:true,
		url:change_pwd_url,
		data:{v:value,cs:checksum,c:public_id},
		success: function(data){
			chgPwd_response(data);
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	});
}

function forgetPwd(value,checksum){
	$.ajax({
		type:"GET",
		datatype:"json",
		async:true,
		url:forget_pwd_url,
		data:{v:value,cs:checksum,c:public_id},
		success: function(data){
			forgetPwd_response(data);
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	});
}

function chgPin(value,checksum){
	$.ajax({
		type:"GET",
		datatype:"json",
		async:true,
		url:change_pin_url,
		data:{v:value,cs:checksum,c:public_id},
		success: function(data){
			chgPin_response(data);
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	});
}

function forgetPin(value,checksum){
	$.ajax({
		type:"GET",
		datatype:"json",
		async:true,
		url:forget_pin_url,
		data:{v:value,cs:checksum,c:public_id},
		success: function(data){
			forgetPin_response(data);
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	});
}

function chgHint(value,checksum){
	$.ajax({
		type:"GET",
		datatype:"json",
		async:true,
		url:change_hint_url,
		data:{v:value,cs:checksum,c:public_id},
		success: function(data){
			chgHint_response(data);
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	});
}

function getHint(value,checksum){
	$.ajax({
		type:"GET",
		datatype:"json",
		async:true,
		url:get_hint_url,
		data:{v:value,cs:checksum,c:public_id},
		success: function(data){
			getHint_response(data);
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	});
}

function getKey(handleData){
	$.ajax({
		type:"GET",
		datatype:"json",
		async:false,
		url:get_key_url,
		success: function(data){
			handleData(data);
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	});
}

function getKeyNew(handleData){
        $.ajax({
                type:"GET",
                datatype:"json",
                async:false,
                url:get_key_new_url,
                success: function(data){
                        handleData(data);
                },
                error: function(jqXHR, textStatus){
                        errorHandling(textStatus);
                }
        });
}


function refreshFlag(){
	$.ajax({
		type:"GET",
		async:true,
		url:refresh_flag_url,
		data:{loginStatus:login_status}
	});
}

function errorHandling(textStatus){
	if(textStatus=="timeout"){
		console.log("Timeout.");
	}else if(textStatus=="error"){
		console.log("Error.");
	}else if(textStatus=="abort"){
		console.log("Abort.");
	}else if(textStatus=="parsererror"){
		console.log("Parser error.");
	}
	//alert("System under maintenance. Please kindly try again later.");
	$("#response").css("display","none");
	//window.location(login_page_url);
}

$(document).ajaxStart(function(){$("#response").css("display","");}).ajaxComplete(function(){$("#response").css("display","none");});
//$(document).ready(function() {
checkLogin(function(output){login_agent=output;});
//});
