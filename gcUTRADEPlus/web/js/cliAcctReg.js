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

function initFormValidation(BMSSetting, category, type){
	
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
			return isAlpha(value)&&isNumeric(value);
		},"Password must be alphanumeric.");
	}else if(pwdSecLvl=="3"){
		$.validator.addMethod("chkPassword", function(value, element){
			return isAlpha(value)&&isNumeric(value)&&isUpperCase(value)&&isLowerCase(value);
		},"Password must be alphanumeric with combination of upper-case, lower-case letters, numbers");
	}
	
	$.validator.addMethod("isAlpha", function(value, element){
		return isAlpha(value);
	}, "Please enter alphabets only.");
	$.validator.addMethod("isRestrict", function(value, element){
		return !isRestrictSpcChar(value);
	}, "Special character is not allow.");
	
	var rules = {
			frmRegister_userID:{
				required:true,
				minlength:lgMin,
				isRestrict:true
			},
			frmRegister_pwd:{
				required:true,
				minlength:pwdMin,
				isRestrict:true,
				chkPassword:true
			},
			frmRegister_confPwd:{
				equalTo:"#frmRegister_pwd"
			},
			frmRegister_pin:{
				required:true,
				minlength:pinMin,
				digits:true
			},
			frmRegister_confPin:{
				equalTo:"#frmRegister_pin"
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
				},
				frmRegister_dob:{
					required:true
				},
				frmRegister_add1:{
					required:true
				},
				frmRegister_add2:{
					isRestrict:true
				}
			};
			$.extend(rules, rules_N);
		}
		
		var rules_M = {
			frmRegister_title:{
				required:true
			},
			frmRegister_cliName:{
				required:true,
				isRestrict:true
			},
			frmRegister_passport:{
				required:function(){
					return $("#frmRegister_country").val()!="MY";
				}
			},
			frmRegister_icNo:{
				required:function(){
					return $("#frmRegister_country").val()=="MY";
				}
			},
			frmRegister_sex:{
				required:true
			},
			
			frmRegister_email:{
				required:true,
				email:true,
				isRestrict:true
			},
			
			frmRegister_telno1:{
				required:function(){
					return $("#frmRegister_mobile1").val()==""&&$("#frmRegister_mobile2").val()=="";
				},
				digits:true,
				minlength:2
			},
			frmRegister_telno2:{
				required:function(){
					return $("#frmRegister_mobile1").val()==""&&$("#frmRegister_mobile2").val()=="";
				},
				digits:true,
				minlength:6
			},
			frmRegister_mobile1:{
				digits:true,
				minlength:2
			},
			frmRegister_mobile2:{
				digits:true,
				minlength:6
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
				required:true
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
			register();	
			return false;
		}
	});	
}

function chgLayout(category, type){
	$($('tr[id^="tr_"]')).hide(); //hide all table
	
	// Individual registration
	if(type=="M"){
		$("#typeLabel").html("Personal");
		if(category=="E"){// existing
			$("#tr_bhclicode").show();
		}
		if(category=="N"){// new
			$("#dobLabel").html("Date of Birth");
			$("#addLabel").html("Address");
			$("#tr_dob, #tr_address, #tr_state, #tr_postcode, #tr_country").show();
			$("#frmRegister_dob").datepicker({
				changeMonth: true,
			    changeYear: true,
				maxDate:"-18Y",
				dateFormat:"dd-mm-yy"
			});
			$('div.ui-datepicker').css({ "font-size":"10px" });
		}
		$("#tr_cliName,#tr_email,#tr_gender,#tr_contact,#tr_mobile").show();
		$($("#frmRegister_country").val()=="MY"?"#tr_icNo":"#tr_passport").show();
	}
	
	// company registration
	if(type=="C"){
		if(category=="E"){// existing
			$("#tr_bhclicode").show();
		}
		$("#typeLabel").html("Company");
		$("#dobLabel").html("Date of Incorporate");
		$("#addLabel").html("Business Address");
		$("#tr_companyName, #tr_companyRegNo,#tr_dob, #tr_address, #tr_state, #tr_postcode, #tr_country, #tr_contact").show();
		$("#tr_email_corp, #tr_trdperson, #tr_fax").show();
		$("#frmRegister_dob").datepicker({
			changeMonth: true,
		    changeYear: true,
			maxDate:"+0D",
			dateFormat:"mm-dd-yy"
		});
		$('div.ui-datepicker').css({ "font-size":"10px" });
	}	
	$("#tr_username, #tr_password, #tr_confPassword, #tr_pin, #tr_confPin, #tr_hint, #tr_hintAns, ").show();
	if(type&&category){
		$("#divRegister").show();
	}else{
		alert("Registration page is temporary not available.");
	}
}

// on page load
$(document).ready(function(){
	var category = getUrlParameter("category");
	var type = getUrlParameter("type");
	chgLayout(category, type);
	initFormValidation(BMSSetting, category, type);
	
	$("#frmRegister_state").change(function(){
		$("#frmRegister_othState").css("display", ($("#frmRegister_state").val()=="")?"":"none");
		$("#frmRegister_othState").val("").blur();
	});
	
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
