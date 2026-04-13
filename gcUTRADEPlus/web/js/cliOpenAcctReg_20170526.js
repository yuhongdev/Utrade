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
function isMonthYear(value){
	var pattern = /^(0[1-9]|1[0-2])\/\/?([0-9]{4}|[0-9]{3}|[0-9]{2}|[0-9]{1})$/;
	return pattern.test(value);
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
	$.validator.addMethod("validDate", function(value, element) {
        return value.match(/^(0?[1-9]|[12][0-9]|3[0-1])[/., -](0?[1-9]|1[0-2])[/., -](19|20)?\d{2}$/);   
    }, "Please enter a valid date in the format DD-MM-YYYY");
    $.validator.addMethod("lettersAndSpaceOnly", function(value, element){
		return lettersAndSpaceOnly(value);
	}, "Alphabets and space only.");
	 $.validator.addMethod("isAlphaNumericAndSpaceOnly", function(value, element){
		return isAlphaNumericAndSpaceOnly(value) || value=='';
	}, "Alphanumeric and space only.");
	$.validator.addMethod("chkPIN", function(value, element){
			return isNumeric(value);
	},"Password must be numeric.");
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
	$.validator.addMethod("isMonthYear", function(value, element){
			return isMonthYear(value);
	},"Must be in MM/Y or MM/YY or MM/YYY or MM/YYYY");
	
	var rulesAcc = {
			frmRegisterAcc_userID:{
				required:true,
				minlength:lgMin,
				maxlength:20,
				isRestrict:true
			},
			frmRegisterAcc_pwd:{
				required:true,
				minlength:pwdMin,
				isRestrict:true,
				chkPassword:true,
				maxlength:50
			},
			frmRegisterAcc_confPwd:{
				equalTo:"#frmRegisterAcc_pwd"
			},			
			frmRegisterAcc_hint:{
				required: function(element){
					return $("#frmRegisterAcc_hintType").val()=="OTR";
				},
				isRestrict:true,
				maxlength:250
			},
			frmRegisterAcc_hintAns:{
				required:true,
				isRestrict:true,
				maxlength:100
			},
			frmRegister_pin:{
				required:true,
				chkPIN:true,
				isRestrict:true,
				minlength:6,
				maxlength:6
			},
			frmRegister_confpin:{
				equalTo:"#frmRegister_pin"
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
				required:true,
				validDate:true,
				CheckDOB:true
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
				required: function(element){
					return $("#frmRegister_civilStatus").val()!="S";
				},
				isRestrict:true,
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
			frmRegister_nationality:{
				required:true,
				maxlength:20,
				isRestrict:true	
			},
			frmRegister_passportNo:{
				required:true,
				maxlength:20,
				isRestrict:true	
			},
			frmRegister_acrNo:{
				required:true,
				maxlength:20,
				isRestrict:true	
			},
			frmRegister_dtIssued:{
				required:true,
				validDate:true,
				CheckDOB:true
			},
			frmRegister_placeIssued:{
				required:true,
				maxlength:20,
				isRestrict:true	
			},
			frmRegister_verificationNo:{
				required:true,
				maxlength:20,
				isRestrict:true	
			},
			frmRegister_verificationDt:{
				required:true,
				validDate:true,
				CheckDOB:true
			},		
			frmRegister_custodianBnk:{
				required:true,
				maxlength:20,
				isRestrict:true	
			},
			frmRegister_regName:{
				required:true,
				maxlength:20,
				isRestrict:true	
			},			
			frmRegister_tin:{
				required:{
                		depends: function () {
                    		return $('#frmRegister_citizenship').val()=='FP';
                		}
            	},
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
				minlength:2,
				maxlength:6
			},
			frmRegister_cli1Telno2:{
				required:true,
				digits:true,
				minlength:6,
				maxlength:13
			},
			frmRegister_ownership:{
				required:true			
			},
			frmRegister_ownershipAns:{
				required: function(element){
					return $("#frmRegister_ownership").val()=="M";
				},
				isRestrict:true,
				maxlength:100
			},
			frmRegister_lengthStay:{
				isMonthYear:true,
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
				maxlength:50
			},			
			frmRegister_cli1Mobile1:{
				required:true,
				digits:true,
				minlength:2,
				maxlength:6
			},
			frmRegister_cli1Mobile2:{
				required:true,
				digits:true,
				minlength:6,
				maxlength:13
			},
			frmRegister_cli1Fax1:{
				required:false,
				digits:true,
				minlength:2,
				maxlength:6
			},
			frmRegister_cli1Fax2:{
				required:false,
				digits:true,
				minlength:6,
				maxlength:13
			},
			frmRegister_employmentStatus:{
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
				minlength:2,
				maxlength:6
			},
			frmRegister_cli1EmployTelno2:{
				required:true,
				digits:true,
				minlength:6,
				maxlength:13
			},
			frmRegister_yearsWithCompany:{
				required:true,				
				digits: {
                		depends: function () {
                    		return $('#frmRegister_employmentStatus').val()=='E';
                		}
            	},
            	validDate: {
                		depends: function () {
                    		return $('#frmRegister_employmentStatus').val()=='SE';
                		}
            	}
				
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
				isRestrict:true,
				maxlength:100
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
				required:true,
				validDate:true,
				CheckDOB:true
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
				required: function(element){
					return $("#frmRegister_civilStatus2").val()!="S";
				},
				isRestrict:true,
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
			frmRegister_nationality2:{
				required:true,
				maxlength:30,
				isRestrict:true	
			},
			frmRegister_passportNo2:{
				required:true,
				maxlength:30,
				isRestrict:true	
			},
			frmRegister_acrNo2:{
				required:true,
				maxlength:30,
				isRestrict:true	
			},
			frmRegister_dtIssued2:{
				required:true,
				validDate:true,
				CheckDOB:true
			},
			frmRegister_placeIssued2:{
				required:true,
				maxlength:30,
				isRestrict:true	
			},
			frmRegister_verificationNo2:{
				required:true,
				maxlength:30,
				isRestrict:true	
			},
			frmRegister_verificationDt2:{
				required:true,
				validDate:true,
				CheckDOB:true
			},		
			frmRegister_custodianBnk2:{
				required:true,
				maxlength:30,
				isRestrict:true	
			},
			frmRegister_regName2:{
				required:true,
				maxlength:50,
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
				isMonthYear:true,
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
				maxlength:50
			},			
			frmRegister_cli2Mobile1:{
				required:true,
				digits:true,
				minlength:2,
				maxlength:6
			},
			frmRegister_cli2Mobile2:{
				required:true,
				digits:true,
				minlength:6,
				maxlength:13
			},
			frmRegister_cli2Fax1:{
				required:false,
				digits:true,
				minlength:2,
				maxlength:6
			},
			frmRegister_cli2Fax2:{
				required:false,
				digits:true,
				minlength:6,
				maxlength:13
			},
			frmRegister_employmentStatus2:{
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
				minlength:2,
				maxlength:6
			},
			frmRegister_cli2EmployTelno2:{
				required:true,
				digits:true,
				minlength:6,
				maxlength:13
			},
			frmRegister_yearsWithCompany2:{
				required:true,				
				digits: {
                		depends: function () {
                    		return $('#frmRegister_employmentStatus').val()=='E';
                		}
            	},
            	validDate: {
                		depends: function () {
                    		return $('#frmRegister_employmentStatus').val()=='SE';
                		}
            	}
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
				isRestrict:true,
				maxlength:100
			}						
		};
		//$.extend(rules, rules_N);
		
		
		var rules_InvestorProfile = {
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
		//$.extend(rules, rules_M);
	
	// validation
	$("#frmRegister").validate({
		errorElement:'span',
		rules:rulesPersonalInfo,
		submitHandler: function(form){
			chgRegisterLayout(2);
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
	
	$("#frmInvestorProfile").validate({
		errorElement:'span',
		rules:rules_InvestorProfile,
		submitHandler: function(form){						
			chgRegisterLayout(3);
			return false;
		}
	});	

	$("#frmRvPrnt").validate({
		errorElement:'span',
		rules:rules_InvestorProfile,
		submitHandler: function(form){			
			registerOpenAcc();				
			return false;
		}
	});	
}

function chgRegisterLayout(layout){
	switch(layout){
		case 0:
			$('#frmRegisterAcc').show();
			$('#frmRegister').hide();
			$('#frmInvestorProfile').hide();
			$('#frmRvPrnt').hide();

			//NetInfinium Request
			$(".accinfo").addClass("currentstep");
			$(".perinfo").removeClass("currentstep");
			break;
		case 1: //Page 2
			$('#frmRegisterAcc').hide();
			$('#frmRegister').show();
			$('#frmInvestorProfile').hide();
			$('#frmRvPrnt').hide();

			//NetInfinium Request
			$(".perinfo").addClass("currentstep");
			$(".accinfo").removeClass("currentstep");
			$(".invpro").removeClass("currentstep");
			break;
		case 2: //Page 3			
			$('#frmRegisterAcc').hide();
			$('#frmRegister').hide();
			$('#frmInvestorProfile').show();
			$('#frmRvPrnt').hide();

			//NetInfinium Request
			$(".invpro").addClass("currentstep");
			$(".perinfo").removeClass("currentstep");
			$(".revprin").removeClass("currentstep");
			break;
		case 3: //Page 4
			$('#frmRegisterAcc').hide();
			$('#frmRegister').hide();
			$('#frmInvestorProfile').hide();
			$('#frmRvPrnt').show();

			//NetInfinium Request
			$(".revprin").addClass("currentstep");
			$(".invpro").removeClass("currentstep");
			$(".sendoc").removeClass("currentstep");
			break;
		case 4: //Page 5
			$('#frmRegisterAcc').hide();
			$('#frmRegister').hide();
			$('#frmInvestorProfile').hide();
			$('#frmRvPrnt').hide();
			$('#frmSend').show();

			//NetInfinium Request
			$(".sendoc").addClass("currentstep");
			$(".revprin").removeClass("currentstep");
			break;
	}
}

function initLookup(){
	$.get("ref/registrationLookup.json", function(lookup) {
		console.log(lookup);
		$('#frmRegisterAcc_hintType').empty();
		for(var i=0;i <lookup.hint.length;i++){
			$('#frmRegisterAcc_hintType').append('<option value="'+lookup.hint[i].val+'">'+lookup.hint[i].desc+'</option>');
		}

		$('#frmRegister_category').empty();
		for(var i=0;i <lookup.accountType.length;i++){
			$('#frmRegister_category').append('<option value="'+lookup.accountType[i].val+'">'+lookup.accountType[i].desc+'</option>');
		}

		$('#frmRegister_civilStatus').empty();
		$('#frmRegister_civilStatus2').empty();
		for(var i=0;i <lookup.civilStatus.length;i++){
			$('#frmRegister_civilStatus').append('<option value="'+lookup.civilStatus[i].val+'">'+lookup.civilStatus[i].desc+'</option>');
			$('#frmRegister_civilStatus2').append('<option value="'+lookup.civilStatus[i].val+'">'+lookup.civilStatus[i].desc+'</option>');
		}

		$('#frmRegister_citizenship').empty();
		$('#frmRegister_citizenship2').empty();
		for(var i=0;i <lookup.citizenship.length;i++){
			$('#frmRegister_citizenship').append('<option value="'+lookup.citizenship[i].val+'">'+lookup.citizenship[i].desc+'</option>');
			$('#frmRegister_citizenship2').append('<option value="'+lookup.citizenship[i].val+'">'+lookup.citizenship[i].desc+'</option>');
		}


		$('#frmRegister_cli1ICType1').empty();
		$('#frmRegister_cli1ICType2').empty();
		$('#frmRegister_cli2ICType1').empty();
		$('#frmRegister_cli2ICType2').empty();
		for(var i=0;i <lookup.idType.length;i++){
			$('#frmRegister_cli1ICType1').append('<option value="'+lookup.idType[i].val+'">'+lookup.idType[i].desc+'</option>');
			$('#frmRegister_cli1ICType2').append('<option value="'+lookup.idType[i].val+'">'+lookup.idType[i].desc+'</option>');
			$('#frmRegister_cli2ICType1').append('<option value="'+lookup.idType[i].val+'">'+lookup.idType[i].desc+'</option>');
			$('#frmRegister_cli2ICType2').append('<option value="'+lookup.idType[i].val+'">'+lookup.idType[i].desc+'</option>');
		}
		
		$('#frmRegister_ownership').empty();
		$('#frmRegister_ownership2').empty();
		for(var i=0;i <lookup.ownership.length;i++){
			$('#frmRegister_ownership').append('<option value="'+lookup.ownership[i].val+'">'+lookup.ownership[i].desc+'</option>');
			$('#frmRegister_ownership2').append('<option value="'+lookup.ownership[i].val+'">'+lookup.ownership[i].desc+'</option>');
		}

		$('#frmRegister_employmentStatus').empty();
		$('#frmRegister_employmentStatus2').empty();
		for(var i=0;i <lookup.employmentStatus.length;i++){
			$('#frmRegister_employmentStatus').append('<option value="'+lookup.employmentStatus[i].val+'">'+lookup.employmentStatus[i].desc+'</option>');
			$('#frmRegister_employmentStatus2').append('<option value="'+lookup.employmentStatus[i].val+'">'+lookup.employmentStatus[i].desc+'</option>');
		}

		$('#frmRegister_refBy').empty();
		$('#frmRegister_refBy2').empty();
		for(var i=0;i <lookup.referredBy.length;i++){
			$('#frmRegister_refBy').append('<option value="'+lookup.referredBy[i].val+'">'+lookup.referredBy[i].desc+'</option>');
			$('#frmRegister_refBy2').append('<option value="'+lookup.referredBy[i].val+'">'+lookup.referredBy[i].desc+'</option>');
		}

		$('#frmRegister_annualIncome').empty();
		for(var i=0;i <lookup.annualIncome.length;i++){
			$('#frmRegister_annualIncome').append('<option value="'+lookup.annualIncome[i].val+'">'+lookup.annualIncome[i].desc+'</option>');
		}

		$('#frmRegister_netWorth').empty();
		for(var i=0;i <lookup.netWorth.length;i++){
			$('#frmRegister_netWorth').append('<option value="'+lookup.netWorth[i].val+'">'+lookup.netWorth[i].desc+'</option>');
		}
		
		
		for(var i=0;i <lookup.investObjective.length;i++){
			if(i==0){
				$('#frmRegister_invObj1').parent().empty().append("<input type='checkbox' id='frmRegister_invObj1' name='frmRegister_invObj' style='width:40px' value='"+lookup.investObjective[i].val+"'>"+lookup.investObjective[i].desc+"<br>");
			}else{
				$('#frmRegister_invObj1').parent().append("<input type='checkbox' id='frmRegister_invObj"+(i+1)+"' name='frmRegister_invObj' style='width:40px' value='"+lookup.investObjective[i].val+"'>"+lookup.investObjective[i].desc+"<br>");
			}
		}

 	});

}


// on page load
$(document).ready(function(){
	var category = "N";
	var type = "M";
	var clientType = getUrlParameter("type")==undefined?"":getUrlParameter("type");
	initLookup();
	initOpenAcctRegFormValidation(BMSSetting, category, type);

	$("#frmRegister_dob").datepicker({
			changeMonth: true,
		    changeYear: true,
			//maxDate:"+0D",
			yearRange: "-100:+0",
			dateFormat:"dd-mm-yy"
	});
	$("#frmRegister_dob2").datepicker({
			changeMonth: true,
		    changeYear: true,
			//maxDate:"+0D",
			yearRange: "-100:+0",
			dateFormat:"dd-mm-yy"
	});	

	$("#frmRegister_dtIssued").datepicker({
			changeMonth: true,
		    changeYear: true,
			//maxDate:"+0D",
			yearRange: "-100:+0",
			dateFormat:"dd-mm-yy"
	});	
	$("#frmRegister_dtIssued2").datepicker({
			changeMonth: true,
		    changeYear: true,
			//maxDate:"+0D",
			yearRange: "-100:+0",
			dateFormat:"dd-mm-yy"
	});

	$("#frmRegister_verificationDt").datepicker({
			changeMonth: true,
		    changeYear: true,
			//maxDate:"+0D",
			yearRange: "-100:+0",
			dateFormat:"dd-mm-yy"
	});	
	$("#frmRegister_verificationDt2").datepicker({
			changeMonth: true,
		    changeYear: true,
			//maxDate:"+0D",
			yearRange: "-100:+0",
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

	$("#frmRegister_civilStatus").change(function(){
		if($("#frmRegister_civilStatus").val()=="S"){
			$("#spouseContainer").hide().blur();
		}else{
			$("#spouseContainer").show();

		}
	});

	$("#frmRegister_civilStatus2").change(function(){
		if($("#frmRegister_civilStatus2").val()=="S"){
			$("#spouseContainer2").hide().blur();
		}else{
			$("#spouseContainer2").show();
		}
	});

	$("#frmRegister_employmentStatus").change(function(){
		if($("#frmRegister_employmentStatus").val()=="E"){
			$("#frmRegister_employName").parent().prev().html("Name of Employer");										
			$("#frmRegister_yearsWithCompany").parent().prev().html("Years with Company");
			$("#frmRegister_position").parent().prev().html("Position");

			$( '#frmRegister_yearsWithCompany').datepicker( "destroy" );
			$( '#frmRegister_yearsWithCompany').removeClass("hasDatepicker");


			$("#frmRegister_employName").parent().parent().show();
			$("#frmRegister_cli1BusinessAdd1").parent().parent().show();
			$("#frmRegister_cli1BusinessAdd2").parent().parent().show();
			$("#frmRegister_employPostcode").parent().parent().show();
			$("#frmRegister_cli1EmployTelno1").parent().parent().show();
			$("#frmRegister_cli1EmployTelno2").parent().parent().show();
			$("#frmRegister_yearsWithCompany").parent().parent().show();
			$("#frmRegister_position").parent().parent().show();

		}else if($("#frmRegister_employmentStatus").val()=="SE"){
			$("#frmRegister_employName").parent().prev().html("Name of Business Owned");									
			$("#frmRegister_yearsWithCompany").parent().prev().html("Date Established");
			$("#frmRegister_position").parent().prev().html("Type of Business");
			
			$("#frmRegister_yearsWithCompany").datepicker({
					changeMonth: true,
				    changeYear: true,
					maxDate:"+0D",
					yearRange: "-100:+0",
					dateFormat:"dd-mm-yy"
			});
			$('div.ui-datepicker').css({ "font-size":"10px" });

			$("#frmRegister_employName").parent().parent().show();
			$("#frmRegister_cli1BusinessAdd1").parent().parent().show();
			$("#frmRegister_cli1BusinessAdd2").parent().parent().show();
			$("#frmRegister_employPostcode").parent().parent().show();
			$("#frmRegister_cli1EmployTelno1").parent().parent().show();
			$("#frmRegister_cli1EmployTelno2").parent().parent().show();
			$("#frmRegister_yearsWithCompany").parent().parent().show();
			$("#frmRegister_position").parent().parent().show();
		}else{
			$("#frmRegister_employName").parent().parent().hide().blur();
			$("#frmRegister_cli1BusinessAdd1").parent().parent().hide().blur();
			$("#frmRegister_cli1BusinessAdd2").parent().parent().hide().blur();
			$("#frmRegister_employPostcode").parent().parent().hide().blur();
			$("#frmRegister_cli1EmployTelno1").parent().parent().hide().blur();
			$("#frmRegister_cli1EmployTelno2").parent().parent().hide().blur();
			$("#frmRegister_yearsWithCompany").parent().parent().hide().blur();
			$("#frmRegister_position").parent().parent().hide().blur();
		}
	});

	$("#frmRegister_employmentStatus2").change(function(){
		if($("#frmRegister_employmentStatus2").val()=="E"){
			$("#frmRegister_employName2").parent().prev().html("Name of Employer");										
			$("#frmRegister_yearsWithCompany2").parent().prev().html("Years with Company");
			$("#frmRegister_position2").parent().prev().html("Position");

			$("#frmRegister_employName2").parent().parent().show();
			$("#frmRegister_cli2BusinessAdd1").parent().parent().show();
			$("#frmRegister_cli2BusinessAdd2").parent().parent().show();
			$("#frmRegister_employPostcode2").parent().parent().show();
			$("#frmRegister_cli2EmployTelno1").parent().parent().show();
			$("#frmRegister_cli2EmployTelno2").parent().parent().show();
			$("#frmRegister_yearsWithCompany2").parent().parent().show();
			$("#frmRegister_position2").parent().parent().show();

		}else if($("#frmRegister_employmentStatus2").val()=="SE"){
			$("#frmRegister_employName2").parent().prev().html("Name of Business Owned");									
			$("#frmRegister_yearsWithCompany2").parent().prev().html("Date Established");
			$("#frmRegister_position2").parent().prev().html("Type of Business");

			$("#frmRegister_employName2").parent().parent().show();
			$("#frmRegister_cli2BusinessAdd1").parent().parent().show();
			$("#frmRegister_cli2BusinessAdd2").parent().parent().show();
			$("#frmRegister_employPostcode2").parent().parent().show();
			$("#frmRegister_cli2EmployTelno1").parent().parent().show();
			$("#frmRegister_cli2EmployTelno2").parent().parent().show();
			$("#frmRegister_yearsWithCompany2").parent().parent().show();
			$("#frmRegister_position2").parent().parent().show();
		}else{
			$("#frmRegister_employName2").parent().parent().hide().blur();
			$("#frmRegister_cli2BusinessAdd1").parent().parent().hide().blur();
			$("#frmRegister_cli2BusinessAdd2").parent().parent().hide().blur();
			$("#frmRegister_employPostcode2").parent().parent().hide().blur();
			$("#frmRegister_cli2EmployTelno1").parent().parent().hide().blur();
			$("#frmRegister_cli2EmployTelno2").parent().parent().hide().blur();
			$("#frmRegister_yearsWithCompany2").parent().parent().hide().blur();
			$("#frmRegister_position2").parent().parent().hide().blur();
		}

	});

	$("input[name=frmRegister_beneficialOwner]").change(function(){
		if($('input[name=frmRegister_beneficialOwner]:checked').val() == "Y"){
			$("#frmRegister_beneficialOwnerCompany").parent().parent().show();
			$("#frmRegister_beneficialOwnerPosition").parent().parent().show();
		}else{
			$("#frmRegister_beneficialOwnerCompany").parent().parent().hide().blur();
			$("#frmRegister_beneficialOwnerPosition").parent().parent().hide().blur();
		}
	});

	$("input[name=frmRegister_accOthBroker]").change(function(){
		if($('input[name=frmRegister_accOthBroker]:checked').val() == "Y"){
			$("#frmRegister_accOthBrokerName").parent().parent().show();
			$("#frmRegister_accOthBrokerPerson").parent().parent().show();
		}else{
			$("#frmRegister_accOthBrokerName").parent().parent().hide().blur();
			$("#frmRegister_accOthBrokerPerson").parent().parent().hide().blur();
		}
	});

	$("input[name=frmRegister_relOtherBroker]").change(function(){
		if($('input[name=frmRegister_relOtherBroker]:checked').val() == "Y"){
			$("#frmRegister_relOtherBrokerName").parent().parent().show();
			$("#frmRegister_relOtherBrokerPerson").parent().parent().show();
		}else{
			$("#frmRegister_relOtherBrokerName").parent().parent().hide().blur();
			$("#frmRegister_relOtherBrokerPerson").parent().parent().hide().blur();
		}
	});
	
	$("#frmRegister_citizenship").change(function(){
		if($("#frmRegister_citizenship").val()=="FRP"){
			$("#frmRegister_cli1ICType1").parent().parent().hide().blur();
			$("#frmRegister_cli1ICValue1").parent().parent().hide().blur();
			$("#frmRegister_cli1ICType2").parent().parent().hide().blur();
			$("#frmRegister_cli1ICValue2").parent().parent().hide().blur();

			$("#frmRegister_nationality").parent().parent().show();
			$("#frmRegister_passportNo").parent().parent().show();
			$("#frmRegister_acrNo").parent().parent().show();
			$("#frmRegister_dtIssued").parent().parent().show();
			$("#frmRegister_placeIssued").parent().parent().show();
			$("#frmRegister_verificationNo").parent().parent().show();
			$("#frmRegister_verificationDt").parent().parent().show();
			$("#frmRegister_custodianBnk").parent().parent().show();
			$("#frmRegister_regName").parent().parent().show();		
		}else if($("#frmRegister_citizenship").val()=="FRA"){
			$("#frmRegister_cli1ICType1").parent().parent().hide().blur();
			$("#frmRegister_cli1ICValue1").parent().parent().hide().blur();
			$("#frmRegister_cli1ICType2").parent().parent().hide().blur();
			$("#frmRegister_cli1ICValue2").parent().parent().hide().blur();

			$("#frmRegister_nationality").parent().parent().show();
			$("#frmRegister_passportNo").parent().parent().show();
			$("#frmRegister_acrNo").parent().parent().hide().blur();
			$("#frmRegister_dtIssued").parent().parent().show();
			$("#frmRegister_placeIssued").parent().parent().show();
			$("#frmRegister_verificationNo").parent().parent().show();
			$("#frmRegister_verificationDt").parent().parent().show();
			$("#frmRegister_custodianBnk").parent().parent().show();
			$("#frmRegister_regName").parent().parent().show();		
		}else{
			$("#frmRegister_nationality").parent().parent().hide().blur();
			$("#frmRegister_passportNo").parent().parent().hide().blur();
			$("#frmRegister_acrNo").parent().parent().hide().blur();
			$("#frmRegister_dtIssued").parent().parent().hide().blur();
			$("#frmRegister_placeIssued").parent().parent().hide().blur();
			$("#frmRegister_verificationNo").parent().parent().hide().blur();
			$("#frmRegister_verificationDt").parent().parent().hide().blur();
			$("#frmRegister_custodianBnk").parent().parent().hide().blur();
			$("#frmRegister_regName").parent().parent().hide().blur();

			$("#frmRegister_cli1ICType1").parent().parent().show();
			$("#frmRegister_cli1ICValue1").parent().parent().show();
			$("#frmRegister_cli1ICType2").parent().parent().show();
			$("#frmRegister_cli1ICValue2").parent().parent().show();
		}

	});

	$("#frmRegister_citizenship2").change(function(){
		if($("#frmRegister_citizenship2").val()=="FR"){
			$("#frmRegister_cli2ICType1").parent().parent().hide().blur();
			$("#frmRegister_cli2ICValue1").parent().parent().hide().blur();
			$("#frmRegister_cli2ICType2").parent().parent().hide().blur();
			$("#frmRegister_cli2ICValue2").parent().parent().hide().blur();

			$("#frmRegister_nationality2").parent().parent().show();
			$("#frmRegister_passportNo2").parent().parent().show();
			$("#frmRegister_acrNo2").parent().parent().show();
			$("#frmRegister_dtIssued2").parent().parent().show();
			$("#frmRegister_placeIssued2").parent().parent().show();
			$("#frmRegister_verificationNo2").parent().parent().show();
			$("#frmRegister_verificationDt2").parent().parent().show();
			$("#frmRegister_custodianBnk2").parent().parent().show();
			$("#frmRegister_regName2").parent().parent().show();		
		}else{
			$("#frmRegister_nationality2").parent().parent().hide().blur();
			$("#frmRegister_passportNo2").parent().parent().hide().blur();
			$("#frmRegister_acrNo2").parent().parent().hide().blur();
			$("#frmRegister_dtIssued2").parent().parent().hide().blur();
			$("#frmRegister_placeIssued2").parent().parent().hide().blur();
			$("#frmRegister_verificationNo2").parent().parent().hide().blur();
			$("#frmRegister_verificationDt2").parent().parent().hide().blur();
			$("#frmRegister_custodianBnk2").parent().parent().hide().blur();
			$("#frmRegister_regName2").parent().parent().hide().blur();

			$("#frmRegister_cli2ICType1").parent().parent().show();
			$("#frmRegister_cli2ICValue1").parent().parent().show();
			$("#frmRegister_cli2ICType2").parent().parent().show();
			$("#frmRegister_cli2ICValue2").parent().parent().show();
		}

	});

	$("#frmRegister_lengthStay, #frmRegister_lengthStay2").keyup(function (e) {
        var textSoFar = $(this).val();
        if (e.keyCode != 191) {
            if (e.keyCode != 8) {
                if (textSoFar.length == 2) {
                    $(this).val(textSoFar + "/");
                }
                    //to handle copy & paste of 8 digit
                else if (e.keyCode == 86 && textSoFar.length >=4) {
                    $(this).val(textSoFar.substr(0, 2) + "/" + textSoFar.substr(2));
                }
            }
            else {
                //backspace would skip the slashes and just remove the numbers
                if (textSoFar.length == 5) {
                    $(this).val(textSoFar.substring(0, 4));
                }
                else if (textSoFar.length == 2) {
                    $(this).val(textSoFar.substring(0, 1));
                }
            }
        }
        else {
            //remove slashes to avoid 12//01/2014
            $(this).val(textSoFar.substring(0, textSoFar.length - 1));
        }
    });
	
	
	
});
