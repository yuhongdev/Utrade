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

function initOpenAcctRegFormValidation(BMSSetting, category, type){
	
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
	$.validator.addMethod("IDTypeNotSame", function(value, element){
		return $('#frmRegister_cli1ICType1').val() != $('#frmRegister_cli1ICType2').val();
	}, "Primary ID Type cannot same with Secondary.");
	
	var rulesAcc = {
			frmRegisterAcc_userID:{
				required:true,
				minlength:lgMin,
				isRestrict:true
			},
			frmRegisterAcc_pwd:{
				required:true,
				minlength:pwdMin,
				isRestrict:true,
				chkPassword:true,
				maxlength:12
			},
			frmRegisterAcc_confPwd:{
				equalTo:"#frmRegisterAcc_confPwd"
			},
			frmRegisterAcc_hint:{
				required: function(element){
					return $("#frmRegisterAcc_hintType").val()=="OTR";
				},
				isRestrict:true
			},
			frmRegisterAcc_hintAns:{
				required:true,
				isRestrict:true
			}
	};
	

		var rulesPersonalInfo = { //#tr_dob, #tr_address, #tr_state, #tr_postcode, #tr_country
			
			frmRegister_category:{
				required:true
			},
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
			frmRegister_sex:{
				required:true
			},
			frmRegister_dob:{
				required:true
			},
			frmRegister_birthPlace:{
				required:true,
				maxlength:50,
				isRestrict:true
			},
			frmRegister_civilStatus:{
				required:true			
			},
			frmRegister_spouseName:{
				required:true,
				maxlength:100		
			},
			frmRegister_citizenship:{
				required:true			
			},
			frmRegister_cli1ICType1:{
				required:true,	
			},
			frmRegister_cli1ICValue1:{
				required:true,
				maxlength:20,
				isRestrict:true
			},
			frmRegister_cli1ICType2:{
				required:true,
				IDTypeNotSame:true
			},
			frmRegister_cli1ICValue2:{
				required:true,
				maxlength:20,
				isRestrict:true
			},
			frmRegister_tin:{
				required:true,
				maxlength:9,
				isRestrict:true
			},
			frmRegister_cli1Add1:{
				required:true,
				isRestrict:true,
				maxlength:120
			},
			frmRegister_cli1Add2:{					
				isRestrict:true,
				maxlength:120
			},
			frmRegister_postcode:{
				required:true,
				digits:true,
				maxlength:10
			},	
			frmRegister_cli1Telno1:{
				required:true,
				digits:true,
				minlength:2
			},
			frmRegister_cli1Telno2:{
				required:true,
				digits:true,
				minlength:6,
				maxlength:18
			},
			frmRegister_ownership:{
				required:true			
			},
			frmRegister_ownershipAns:{
				required: function(element){
					return $("#frmRegister_ownership").val()=="M";
				},
				isRestrict:true
			},
			frmRegister_lengthStay:{
				digits:true,
				required:true
			},
			frmRegister_occupation:{
				required:true,
				maxlength:30,
				isRestrict:true	
			},
			frmRegister_email:{
				required:true,
				email:true,
				isRestrict:true,
				maxlength:30
			},			
			frmRegister_cli1Mobile1:{
				required:true,
				digits:true,
				minlength:2
			},
			frmRegister_cli1Mobile2:{
				required:true,
				digits:true,
				minlength:6,
				maxlength:18
			},
			tr_employmentStatus:{
				required:true						
			},
			frmRegister_employName:{
				required:true,
				maxlength:50,
				isRestrict:true				
			},
			frmRegister_cli1BusinessAdd1:{
				required:true,
				isRestrict:true,
				maxlength:120
			},
			frmRegister_cli1BusinessAdd2:{									
				isRestrict:true,
				maxlength:120
			},
			frmRegister_employPostcode:{
				required:true,
				digits:true,
				maxlength:10
			},	
			frmRegister_cli1EmployTelno1:{
				required:true,
				digits:true,
				minlength:2
			},
			frmRegister_cli1EmployTelno2:{
				required:true,
				digits:true,
				minlength:6,
				maxlength:18
			},
			frmRegister_yearsWithCompany:{
				required:true,
				digits:true
			},
			frmRegister_position:{
				required:true,
				maxlength:50,
				isRestrict:true				
			},
			frmRegister_refBy:{
				required:true			
			},
			frmRegister_refByAns:{
				required: function(element){
					return !($("#frmRegister_refBy").val()=="A");
				},
				isRestrict:true
			},
			frmRegister_cliNameFirst2:{
				required:true,
				isRestrict:true,
				maxlength:50
			},			
			frmRegister_cliNameMiddle2:{
				required:true,
				isRestrict:true,
				maxlength:50
			},		
			frmRegister_cliNameLast2:{
				required:true,
				isRestrict:true,
				maxlength:50
			},		
			frmRegister_sex2:{
				required:true
			},
			frmRegister_dob2:{
				required:true
			},
			frmRegister_birthPlace2:{
				required:true,
				maxlength:50,
				isRestrict:true
			},
			frmRegister_civilStatus2:{
				required:true			
			},
			frmRegister_spouseName2:{
				required:true,
				maxlength:100		
			},
			frmRegister_citizenship2:{
				required:true			
			},
			frmRegister_cli2ICType1:{
				required:true,	
			},
			frmRegister_cli2ICValue1:{
				required:true,
				maxlength:20,
				isRestrict:true
			},
			frmRegister_cli2ICType2:{
				required:true,
				IDTypeNotSame:true
			},
			frmRegister_cli2ICValue2:{
				required:true,
				maxlength:20,
				isRestrict:true
			},
			frmRegister_tin2:{
				required:true,
				maxlength:9,
				isRestrict:true
			},
			frmRegister_cli2Add1:{
				required:true,
				isRestrict:true,
				maxlength:120
			},
			frmRegister_cli2Add2:{					
				isRestrict:true,
				maxlength:120
			},
			frmRegister_postcode2:{
				required:true,
				digits:true,
				maxlength:10
			},	
			frmRegister_cli2Telno1:{
				required:true,
				digits:true,
				minlength:2
			},
			frmRegister_cli2Telno2:{
				required:true,
				digits:true,
				minlength:6,
				maxlength:18
			},
			frmRegister_ownership2:{
				required:true			
			},
			frmRegister_ownershipAns2:{
				required: function(element){
					return $("#frmRegister_ownership2").val()=="M";
				},
				isRestrict:true
			},
			frmRegister_lengthStay2:{
				digits:true,
				required:true
			},
			frmRegister_occupation2:{
				required:true,
				maxlength:30,
				isRestrict:true	
			},
			frmRegister_email2:{
				required:true,
				email:true,
				isRestrict:true,
				maxlength:30
			},			
			frmRegister_cli2Mobile1:{
				required:true,
				digits:true,
				minlength:2
			},
			frmRegister_cli2Mobile2:{
				required:true,
				digits:true,
				minlength:6,
				maxlength:18
			},
			tr_employmentStatus2:{
				required:true						
			},
			frmRegister_employName2:{
				required:true,
				maxlength:50,
				isRestrict:true				
			},
			frmRegister_cli2BusinessAdd1:{
				required:true,
				isRestrict:true,
				maxlength:120
			},
			frmRegister_cli2BusinessAdd2:{									
				isRestrict:true,
				maxlength:120
			},
			frmRegister_employPostcode2:{
				required:true,
				digits:true,
				maxlength:10
			},	
			frmRegister_cli2EmployTelno1:{
				required:true,
				digits:true,
				minlength:2
			},
			frmRegister_cli2EmployTelno2:{
				required:true,
				digits:true,
				minlength:6,
				maxlength:18
			},
			frmRegister_yearsWithCompany2:{
				required:true,
				digits:true
			},
			frmRegister_position2:{
				required:true,
				maxlength:50,
				isRestrict:true				
			},
			frmRegister_refBy2:{
				required:true			
			},
			frmRegister_refByAns2:{
				required: function(element){
					return !($("#frmRegister_refBy2").val()=="A");
				},
				isRestrict:true
			},
			frmRegister_fundSrc:{
				required:true,
				maxlength:50,
				isRestrict:true				
			},
			frmRegister_invObj:{
				required:true			
			},
			frmRegister_invHandleBy:{
				required:true			
			},
			frmRegister_regStkBought:{
				required:true			
			},
			frmRegister_annualIncome:{
				required:true			
			},
			frmRegister_netWorth:{
				required:true			
			},
			frmRegister_bank:{
				required:true,
				maxlength:50,
				isRestrict:true				
			},
			frmRegister_accName:{				
				maxlength:100,
				isRestrict:true				
			},
			frmRegister_accNo:{				
				maxlength:50,
				isRestrict:true				
			},
			frmRegister_accBranch:{		
				required:true,		
				maxlength:20,
				isRestrict:true				
			},
			frmRegister_beneficialOwner:{
				required:true			
			},
			frmRegister_beneficialOwnerCompany:{
				required: function(element){
					return $('input:radio[name=frmRegister_beneficialOwner]:checked').val() == "Y";
				},
				isRestrict:true,
				maxlength:50
			},
			frmRegister_beneficialOwnerPosition:{
				required: function(element){
					return $('input:radio[name=frmRegister_beneficialOwner]:checked').val() == "Y";
				},
				isRestrict:true,
				maxlength:50
			},
			frmRegister_accOthBroker:{
				required:true			
			},
			frmRegister_accOthBrokerName:{
				required: function(element){
					return $('input:radio[name=frmRegister_accOthBroker]:checked').val() == "Y";
				},
				isRestrict:true,
				maxlength:50
			},
			frmRegister_accOthBrokerPerson:{
				required: function(element){
					return $('input:radio[name=frmRegister_accOthBroker]:checked').val() == "Y";
				},
				isRestrict:true,
				maxlength:100
			},
			frmRegister_relOtherBroker:{
				required:true			
			},
			frmRegister_relOtherBrokerName:{
				required: function(element){
					return $('input:radio[name=frmRegister_relOtherBroker]:checked').val() == "Y";
				},
				isRestrict:true,
				maxlength:50
			},
			frmRegister_relOtherBrokerPerson:{
				required: function(element){
					return $('input:radio[name=frmRegister_relOtherBroker]:checked').val() == "Y";
				},
				isRestrict:true,
				maxlength:100
			},
			frmRegister_delivery:{
				required:true			
			}
			
		};
		//$.extend(rules, rules_N);
		
		
		var rules_M = {
			
		};
		//$.extend(rules, rules_M);
	
	//frmLogin validation
	$("#frmRegister").validate({
		errorElement:'span',
		rules:rulesPersonalInfo,
		submitHandler: function(form){
			registerOpenAcc();	
			return false;
		}
	});	

	$("#frmRegisterAcc").validate({
		errorElement:'span',
		rules:rulesAcc,
		submitHandler: function(form){
			getTrialLogin();	
			return false;
		}
	});	
}

function chgLayout(layout){
	switch(layout){
		case 0:
			$('#frmRegisterAcc').show();
			$('#frmRegister').hide();
	}
}


// on page load
$(document).ready(function(){
	var category = "N";
	var type = "M";
	var clientType = getUrlParameter("type")==undefined?"":getUrlParameter("type");
	initOpenAcctRegFormValidation(BMSSetting, category, type);

	$("#frmRegister_dob").datepicker({
			changeMonth: true,
		    changeYear: true,
			maxDate:"+0D",
			dateFormat:"dd-mm-yy"
	});
	$("#frmRegister_dob2").datepicker({
			changeMonth: true,
		    changeYear: true,
			maxDate:"+0D",
			dateFormat:"dd-mm-yy"
	});
	$('div.ui-datepicker').css({ "font-size":"10px" });

	$("#frmRegisterAcc_hintType").change(function(){
		if($("#frmRegisterAcc_hintType").val()=="OTR"){
			$("#frmRegisterAcc_hint").show();
		}else{
			$("#frmRegisterAcc_hint").hide().blur();
		}
	});

	$("#frmRegister_ownership").change(function(){
		if($("#frmRegister_ownership").val()=="M"){
			$("#frmRegister_ownershipAns").show();
		}else{
			$("#frmRegister_ownershipAns").hide().blur();
		}
	});

	$("#frmRegister_refBy").change(function(){
		if(!($("#frmRegister_refBy").val()=="A")){
			$("#frmRegister_refByAns").show();
		}else{
			$("#frmRegister_refByAns").hide().blur();
		}
	});

	$("#frmRegister_ownership2").change(function(){
		if($("#frmRegister_ownership2").val()=="M"){
			$("#frmRegister_ownershipAns2").show();
		}else{
			$("#frmRegister_ownershipAns2").hide().blur();
		}
	});

	$("#frmRegister_refBy2").change(function(){
		if(!($("#frmRegister_refBy2").val()=="A")){
			$("#frmRegister_refByAns2").show();
		}else{
			$("#frmRegister_refByAns2").hide().blur();
		}
	});

	$("#frmRegister_category").change(function(){
		if($("#frmRegister_category").val()=="J"){
			$("#tblAccount2").show();
		}else{
			$("#tblAccount2").hide().blur();
		}
	});


	if(clientType == "1"){
		$('#tr_confPassword').hide();
		$('#tr_hint').hide();
		$('#tr_hintAns').hide();		
	}
	
});
