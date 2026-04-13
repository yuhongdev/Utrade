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
function isLowerThanThisYear(value){
	if(value < new Date().getFullYear())
		return true;
	else
		return false;
}
function lettersAndSpaceOnly(value){
	var pattern = /^[a-z ]+$/i;
	return pattern.test(value);
}
function isAlphaNumericAndSpaceOnly(value){
	var pattern = /^[a-z \d]+$/i;
    return pattern.test(value);
} 

function initTrialAcctRegFormValidation(BMSSetting, category, type){
	
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
	
	$.validator.addMethod("isAlpha", function(value, element){
		return isAlpha(value);
	}, "Please enter alphabets only.");
	$.validator.addMethod("isRestrict", function(value, element){
		return !isRestrictSpcChar(value);
	}, "Special character is not allow.");
	$.validator.addMethod("isLowerThanThisYear", function(value, element){
		return !isLowerThanThisYear(value);
	}, "Year must be greater or equal to this year.");
	$.validator.addMethod("validDate", function(value, element) {
        return value.match(/^(0?[1-9]|[12][0-9]|3[0-1])[/., -](0?[1-9]|1[0-2])[/., -](19|20)?\d{2}$/);   
    }, "Please enter a valid date in the format DD-MM-YYYY");
    $.validator.addMethod("lettersAndSpaceOnly", function(value, element){
		return lettersAndSpaceOnly(value);
	}, "Alphabets and space only.");
	 $.validator.addMethod("isAlphaNumericAndSpaceOnly", function(value, element){
		return isAlphaNumericAndSpaceOnly(value) || value=='';
	}, "Alphanumeric and space only.");
	$.validator.addMethod("CheckDOB", function (value, element) {
                // checking whether the date entered is in correct format
                var isValid = value.match(/^\d\d?\-\d\d?\-\d\d\d\d$/);                
                if(isValid){
                    var minDate = Date.parse("01/01/1900");
                    var today = new Date();
                    var DOB = Date.parse(value.substring(3,5) + "/" + value.substring(0,2) + "/" + value.substring(6,10));
                    if ((DOB >= today || DOB <= minDate)) {
                        isValid =  false;
                    }
                    return isValid;
                }
            }, "Birth Date cannot greater than today");
	
	var rules = {
			frmRegister_userID:{
				required:true,
				minlength:lgMin,
				maxlength:15,
				isRestrict:true
			},
			frmRegister_pwd:{
				required:true,
				minlength:pwdMin,
				isRestrict:true,
				chkPassword:true,
				maxlength:50
			},
			frmRegister_confPwd:{
				equalTo:"#frmRegister_pwd"
			},
			frmRegister_hint:{
				required: function(element){
					return $("#frmRegister_hintType").val()=="OTR";
				},
				isRestrict:true
			},
			frmRegister_hintAns:{
				required:true,
				isRestrict:true
			}
	};
	
	if(type=="M"){// individual registration
		if(category=="E"){ //existing
			var rules_E = {
					frmRegister_bhclicode:{
						required:true
					}
			};
			$.extend(rules, rules_E);
		}
		
		if(category=="N"){ //new
			var rules_N = { //#tr_dob, #tr_address, #tr_state, #tr_postcode, #tr_country
				frmRegister_province:{
					required:true
				},
				frmRegister_country:{
					required:true
				},
				frmRegister_dob:{
					required:true,
					CheckDOB:true
				},
				frmRegister_add1:{
				required:true,
				isRestrict:true,
				maxlength:120
				},
				frmRegister_add2:{					
					isRestrict:true,
					maxlength:120
				},
				frmRegister_accOthBroker:{
					required:true,
					isRestrict:true,
					maxlength:50,
					lettersAndSpaceOnly:true
				}
			};
			$.extend(rules, rules_N);
		}
		
		var rules_M = {
			frmRegister_cliNameFirst:{
				required:true,
				isRestrict:true,
				maxlength:50
			},			
			frmRegister_cliNameMiddle:{
				required:true,
				isRestrict:true,
				maxlength:50
			},		
			frmRegister_cliNameLast:{
				required:true,
				isRestrict:true,
				maxlength:50
			},		
			
			
			frmRegister_email:{
				required:true,
				email:true,
				isRestrict:true,
				maxlength:50
			},
			
			frmRegister_telno1:{
				required:true,
				digits:true,
				minlength:2,
				maxlength:6
			},
			frmRegister_telno2:{
				required:true,
				digits:true,
				minlength:6,
				maxlength:13
			},
			frmRegister_mobile1:{
				required:true,
				digits:true,
				minlength:2,
				maxlength:6
			},
			frmRegister_mobile2:{
				required:true,
				digits:true,
				minlength:6,
				maxlength:13
			}
		};
		$.extend(rules, rules_M);
	}
	if(type=="C"){// corporate registration
		
		if(category=="E"){ //existing registration
			var rules_E = {
					frmRegister_bhclicode:{
						required:true
					}
			};
			$.extend(rules, rules_E);
			
		}
		
		var rules_C = {
			frmRegister_companyName:{
				required:true,
				isRestrict:true
			},
			frmRegister_companyRegNo:{
				required:true,
				isRestrict:true
			},
			frmRegister_dob:{
				required:true,
				validDate:true
			},
			frmRegister_add1:{
				required:true,
				isRestrict:true
			},
			frmRegister_add2:{
				isRestrict:true
			},
			frmRegister_tradePerson:{
				required:true,
				isRestrict:true
			},
			frmRegister_icNo2:{
				required:true,
				isRestrict:true
			},
			frmRegister_email2:{
				required:true,
				email:true,
				isRestrict:true
			},
			frmRegister_fax1:{
				required:true,
				digits:true,
				minlength:2
			},
			frmRegister_fax2:{
				required:true,
				digits:true,
				minlength:6
			},
			frmRegister_telno1:{
				required:true,
				digits:true,
				minlength:2
			},
			frmRegister_telno2:{
				required:true,
				digits:true,
				minlength:6
			},
			frmRegister_othState: {
				required:function(element){
					return $("#frmRegister_state").val()=="";
				}
			},
			frmRegister_postcode:{
				required:true,
				digits:true
			},
			frmRegister_country:{
				required:true
			}
		};
		$.extend(rules, rules_C);
	}
	
	//frmLogin validation
	$("#frmRegister").validate({
		errorElement:'span',
		rules:rules,
		submitHandler: function(form){			
			checkLoginID();	
			return false;
		}
	});	
}

function initLookup(){
	$.get("ref/registrationLookup.json", function(lookup) {
		console.log(lookup);
		$('#frmRegister_hintType').empty();
		for(var i=0;i <lookup.hint.length;i++){
			$('#frmRegister_hintType').append('<option value="'+lookup.hint[i].val+'">'+lookup.hint[i].desc+'</option>');
		}

 	});

}


// on page load
$(document).ready(function(){
	var category = "N";
	var type = "M";
	initLookup();
	initTrialAcctRegFormValidation(BMSSetting, category, type);

	$("#frmRegister_dob").datepicker({
			changeMonth: true,
		    changeYear: true,
			//maxDate:"+0D",
			yearRange: "-100:+0",
			dateFormat:"dd-mm-yy"
	});
	$('div.ui-datepicker').css({ "font-size":"10px" });
	
	
	$("#frmRegister_country").change(function(){
		if(type=="M"){
			if($("#frmRegister_country").val()=="MY"){
				$("#tr_passport").hide();
				$("#tr_icNo").show();
			}else{
				$("#tr_passport").show();
				$("#tr_icNo").hide();
			}
		}
	});
	$("#frmRegister_hintType").change(function(){
		if($("#frmRegister_hintType").val()=="OTR"){
			$("#frmRegister_hint").show();
		}else{
			$("#frmRegister_hint").hide().blur();
		}
	});	
	
});
