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

function initLoginActivateFormValidation(BMSSetting){
	
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
		onkeyup:false,
		onclick:false,
		onfocusout:false,
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
			login("ActivateReg");
			//chgLayout(1);
			return false;
		}
	});		
		
	
}

function chgLayout(layout){
				$("#divLogin").css("display","none"); 
				$("#divLogon").css("display","none");
				
				switch(layout){					
					case 1: // display Logon form
						$("#divLogo").css("width","550px");
						$("#divLogon").css("display",""); 

						break;
					default: // display login form
						$("#divLogo").css("width","350px");
						$("#divLogin").css("display",""); 
						$("#frmLogin_password").focus();
						break;
				}	
			}


// on page load
$(document).ready(function(){
	$("#frmLogin_btnFgtPwd").click(function(){
		chgLayout(2);
	});
	initLoginActivateFormValidation(BMSSetting);
	chkSess();
});
