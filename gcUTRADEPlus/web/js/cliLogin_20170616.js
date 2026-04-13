function isAlpha(value){
	var pattern = /[a-zA-Z]/;
    return pattern.test(value);
}
function isNumeric(value){
	var pattern = /[\d]/;
    return pattern.test(value);
} 
function isUpperCase(value){
	var pattern = /[A-Z]/;
    return pattern.test(value);
}
function isLowerCase(value){
	var pattern = /[a-z]/;
    return pattern.test(value);
}
function isRestrictSpcChar(value){
	var pattern = /[|'"]/;
    return pattern.test(value);
}
function isAlphaNumeric(value){
	var pattern = /^[a-z\d]+$/i;
    return pattern.test(value);
} 
function isSpace(value){
	var pattern = /[ ]/;
    return pattern.test(value);
}

function initLoginFormValidation(BMSSetting){
	
	var lgMin = BMSSetting.lgmin;
	var pwdMin = BMSSetting.pwdmin;
	var pinMin = "6";
	var pwdNonDupNo = BMSSetting.pwdnondupno;
	var pwdSecLvl = BMSSetting.pwdseclvl;
	
	lgMin=(lgMin!=null)?lgMin:"6";
	pwdMin=(pwdMin!=null)?pwdMin:"";
	pwdNonDupNo=(pwdNonDupNo!=null)?pwdNonDupNo:"";
	pwdSecLvl=(pwdSecLvl!=null)?pwdSecLvl:"";

	if(pwdSecLvl=="2"){
		$.validator.addMethod("chkPassword", function(value, element){
			return isAlpha(value)&&isNumeric(value)&&!(isSpace(value));
		},"Password must be alphanumeric.");
	}else if(pwdSecLvl=="3"){
		$.validator.addMethod("chkPassword", function(value, element){			
				return isAlpha(value)&&isNumeric(value)&&isUpperCase(value)&&isLowerCase(value)&&!(isSpace(value));			
			
		},"Password must be alphanumeric with combination of upper-case, lower-case letters, numbers");
	}
	$.validator.addMethod("isRestrict", function(value, element){
		return !isRestrictSpcChar(value);
	}, "Special character is not allow.");
	
	//frmLogin validation
	$("#frmLogin").validate({
		errorElement:'span',
		errorPlacement: function(error, element) {
		    error.insertBefore(element);
		    error.addClass('text-error-top');
		    element.before('<br>');
		},
		rules:{
			frmLogin_userID:{
				required:true,
				minlength:lgMin
			},
			frmLogin_password:{
				required:true,
				minlength:pwdMin
			}
		},
		messages:{
			frmLogin_userID:{
				required:"Please enter login ID.",
				minlength:"At least "+lgMin+" character."
			},
			frmLogin_password:{
				required:"Please enter password.",
				minlength:"At least "+pwdMin+" character."
			}
		},
		submitHandler: function(form){
			login();
			return false;
		}
	});		
	
	//frmForgetPwd validation
	$("#frmForgetPwd").validate({
		errorElement:'span',
		errorPlacement: function(error, element) {
		    error.insertBefore(element);
		    error.addClass('text-error-top');
		    element.before('<br>');
		},
		rules:{
			frmForgetPwd_userID:"required",
			frmForgetPwd_pwdHint:{
				required: function(element){
					return $("#frmForgetPwd_userID").val().length>0 && $("#frmForgetPwd_ansHint").val().length>0;
				}
			},
			frmForgetPwd_ansHint:{
				required: function(element){
					return $("#frmForgetPwd_userID").val().length>0 &&  $("#frmForgetPwd_pwdHint").val().length>0;
				}
			}
		},
		messages:{
			frmForgetPwd_userID:"Please enter login ID.",
			frmForgetPwd_pwdHint:{
				required:"Hint question should not be empty."
			},
			frmForgetPwd_ansHint:{
				required:"Please enter hint answer"
			}
		},
		submitHandler: function(form){
			if($("#frmForgetPwd_pwdHint").val().length==0){
				getHint("frmForgetPwd");	
			}else{
				forgetPwd();
			}						
			return false;
		}
	});	
	
	//frmForgetPin validation
	$("#frmForgetPin").validate({
		errorElement:'span',
		errorPlacement: function(error, element) {
		    error.insertBefore(element);
		    error.addClass('text-error-top');
		    element.before('<br>');
		},
		rules:{
			frmForgetPin_userID:"required",
			frmForgetPin_pinHint:{
				required: function(element){
					return $("#frmForgetPin_userID").val().length>0;
				}
			},
			frmForgetPin_ansHint:{
				required: function(element){
					return $("#frmForgetPin_userID").val().length>0;
				}
			}
		},
		messages:{
			frmForgetPin_userID:"Please enter login ID.",
			frmForgetPin_pinHint:{
				required:"Hint question should not be empty."
			},
			frmForgetPin_ansHint:{
				required:"Please enter hint answer"
			}
		},
		submitHandler: function(form){
			if($("#frmForgetPin_pinHint").val().length==0){
				getHint("frmForgetPin");
			}else{
				forgetPin();
			}						
			return false;
		}
	});	
	
	//frmForceChgPwd validation
	$("#frmForceChgPwd").validate({
		errorElement:'span',
		errorPlacement: function(error, element) {
		    error.insertBefore(element);
		    error.addClass('text-error-top');
		    element.before('<br>');
		},
		rules:{
			frmForceChgPwd_oldPwd:{
				required:true
			},
			frmForceChgPwd_newPwd:{
				required:true,
				minlength:pwdMin,
				chkPassword:true,
				maxlength:50,
				isRestrict:true
			},
			frmForceChgPwd_confPwd:{
				required: true,
				equalTo:"#frmForceChgPwd_newPwd"				
			}
		},
		messages:{
			frmForceChgPwd_oldPwd:{
				required:"Please enter old password."
			},
			frmForceChgPwd_newPwd:{
				required:"Please enter new password.",
				minlength:"Minimum "+pwdMin+" character.",
				maxlength:"Maximum 50 character."
			},
			frmForceChgPwd_confPwd:{
				required:"Please enter confirm password.",
				equalTo:"Confirm password is not same with new password"				
			}
		},
		submitHandler: function(form){
			chgPwd();						
			return false;
		}
	});	
	
	//frmForceChgPwd validation
	$("#frmForceChgPin").validate({
		errorElement:'span',
		errorPlacement: function(error, element) {
		    error.insertBefore(element);
		    error.addClass('text-error-top');
		    element.before('<br>');
		},
		rules:{
			frmForceChgPin_oldPin:{
				required:true
			},
			frmForceChgPin_newPin:{
				required:true,
				minlength:pinMin,
				maxlength:pinMin,
				number:true
			},
			frmForceChgPin_confPin:{
				required: true,
				equalTo:"#frmForceChgPin_newPin"
			}
		},
		messages:{
			frmForceChgPin_oldPin:{
				required:"Please enter old PIN."
			},
			frmForceChgPin_newPin:{
				required:"Please enter new PIN.",
				minlength:"Invalid PIN length, required length = "+pinMin,
				maxlength:"Invalid PIN length, required length = "+pinMin,
				number:"Number only."
			},
			frmForceChgPin_confPin:{
				required:"Please enter confirm PIN.",
				equalTo:"Confirm PIN is not same with new PIN."
			}
		},
		submitHandler: function(form){
			chgPin();						
			return false;
		}
	});	
	
}

//change layout function
function chgLayout(layout){
	$("#divLogon, #divLogin, #divForgetPwd, #divForgetPin, #divForceChgPwd, #divForceChgPin").hide();
	switch(layout){
		case 1: //logon view
			$("#divLogon").show();
			break;
		case 2: //forget password view
			$("#divForgetPwd").show();
			$("#frmForgetPwd_userID").focus();
			break;
		case 3: //forget pin view
			$("#divForgetPin").show();
			getHint("frmForgetPin");
			break;
		case 4: //change password view
			$("#divForceChgPwd").show();
			break;
		case 5: //change pin view
			$("#divForceChgPin").show();
			break;
		case 6: //change hint view
			
			break;
		case 7: //logout
			logout();
			break;
		default: //login view
			$("#divLogin").show();
			break;
	}
}

// on page load
$(document).ready(function(){
	$("#frmLogin_btnFgtPwd").click(function(){
		chgLayout(2);
	});
	initLoginFormValidation(BMSSetting);
	chkSess();
});