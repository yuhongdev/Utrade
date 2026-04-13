function isAlpha(value) {
    var pattern = /[a-zA-Z]/;
    return pattern.test(value);
}

function isNumeric(value) {
    var pattern = /[\d]/;
    return pattern.test(value);
}
//added for latest unicap cr
function isNumNotReq(value) {
    var pattern = /^\s*\d*\s*$/;
    //var pattern = /^([0-9\s]+)$/;
    return pattern.test(value);
}

function isUpperCase(value) {
    var pattern = /[A-Z]/;
    return pattern.test(value);
}

function isLowerCase(value) {
    var pattern = /[a-z]/;
    return pattern.test(value);
}

function isRestrictSpcChar(value) {
    var pattern = /[|'"]/;
    return pattern.test(value);
}

function isAlphaNumeric(value) {
    var pattern = /^[a-z\d]+$/i;
    return pattern.test(value);
}

function isSpace(value) {
    var pattern = /[ ]/;
    return pattern.test(value);
}

function isLowerThanThisYear(value) {
    if (value < new Date().getFullYear())
        return true;
    else
        return false;
}

function lettersAndSpaceOnly(value) {
    var pattern = /^[a-z ]+$/i;
    return pattern.test(value);
}

function isAlphaNumericAndSpaceOnly(value) {
    var pattern = /^[a-z \d]+$/i;
    return pattern.test(value);
}

function isMonthYear(value) {
    var pattern = /^(0[1-9]|1[0-2])\/\/?([0-9]{4}|[0-9]{3}|[0-9]{2}|[0-9]{1})$/;
    return pattern.test(value);
}

function initOpenAcctRegFormValidation(BMSSetting, category, type) {

    var lgMin = BMSSetting.lgmin;
    var pwdMin = BMSSetting.pwdmin;
    var pinMin = "6";
    var pwdNonDupNo = BMSSetting.pwdnondupno;
    var pwdSecLvl = BMSSetting.pwdseclvl;

    lgMin = (lgMin != null) ? lgMin : "6";
    pwdMin = (pwdMin != null) ? pwdMin : "";
    pwdNonDupNo = (pwdNonDupNo != null) ? pwdNonDupNo : "";
    pwdSecLvl = (pwdSecLvl != null) ? pwdSecLvl : "";

    if (pwdSecLvl == "2") {
        $.validator.addMethod("chkPassword", function(value, element) {

            return isAlpha(value) && isNumeric(value) && !(isSpace(value));

        }, "Password must be alphanumeric.");
    }

    else if (pwdSecLvl == "3") {
        $.validator.addMethod("chkPassword", function(value, element) {
            
            return isAlpha(value) && isNumeric(value) && isUpperCase(value) && isLowerCase(value) && !(isSpace(value));

        }, "Password must be alphanumeric with combination of upper-case, lower-case letters, numbers");
    }
    //letters only
    $.validator.addMethod("isAlpha", function(value, element) {
        return isAlpha(value);
    }, "Please enter alphabets only.");

    //special characters not allowed
    $.validator.addMethod("isRestrict", function(value, element) {
        return !isRestrictSpcChar(value);
    }, "Special character is not allow.");

    //lower than year
    $.validator.addMethod("isLowerThanThisYear", function(value, element) {
        return !isLowerThanThisYear(value);
    }, "Year must be greater or equal to this year.");

    //Primary and secondary ID checking
    $.validator.addMethod("IDTypeNotSame", function(value, element) {
        return $('#frmRegister_cli1ICType1').val() != $('#frmRegister_cli1ICType2').val();
    }, "Primary ID Type cannot same with Secondary.");

    //valid date
    $.validator.addMethod("validDate", function(value, element) {
        return value.match(/^(0?[1-9]|[12][0-9]|3[0-1])[/., -](0?[1-9]|1[0-2])[/., -](19|20)?\d{2}$/);
    }, "Please enter a valid date in the format DD-MM-YYYY");

    //letters and space only
    $.validator.addMethod("lettersAndSpaceOnly", function(value, element) {
        return lettersAndSpaceOnly(value);
    }, "Alphabets and space only.");

    //alphanumeric and space only
    $.validator.addMethod("isAlphaNumericAndSpaceOnly", function(value, element) {
        return isAlphaNumericAndSpaceOnly(value) || value == '';
    }, "Alphanumeric and space only.");

    //
    $.validator.addMethod("isNumeric", function(value, element) {
        return isNumeric(value);
    }, "Only numbers are allowed.");

    $.validator.addMethod("isNumNotReq", function(value, element) {
        return isNumNotReq(value);
    }, "Only numbers are allowed");

    $.validator.addMethod("chkLogin", function(value, element) {
        return isAlphaNumeric(value);
    }, "Username should only contain letters and numbers.");


    $.validator.addMethod("CheckDOB", function(value, element) {
        // checking whether the date entered is in correct format
        var isValid = value.match(/^\d\d?\-\d\d?\-\d\d\d\d$/);
        if (isValid) {
            var minDate = Date.parse("01/01/1900");
            var today = new Date();
            var DOB = Date.parse(value.substring(3, 5) + "/" + value.substring(0, 2) + "/" + value.substring(6, 10));
            if ((DOB >= today || DOB <= minDate)) {
                isValid = false;
            }
            return isValid;
        }
    }, "Birth Date cannot greater than today");

    $.validator.addMethod("CheckDate", function(value, element) {
        // checking whether the date entered is in correct format
        var isValid = value.match(/^\d\d?\-\d\d?\-\d\d\d\d$/);
        if (isValid) {
            var minDate = Date.parse("01/01/1900");
            var today = new Date();
            var DOB = Date.parse(value.substring(3, 5) + "/" + value.substring(0, 2) + "/" + value.substring(6, 10));
            if ((DOB >= today || DOB <= minDate)) {
                isValid = false;
            }
            return isValid;
        }
    }, "Cannot be greater than today");
    $.validator.addMethod("isMonthYear", function(value, element) {
        return isMonthYear(value);
    }, "Must be in MM/Y or MM/YY or MM/YYY or MM/YYYY");

    var rulesAcc = {
        frmRegisterAcc_userID: {
            required: true,
            minlength: lgMin,
            maxlength: 15,
            chkLogin: true,
            isRestrict: true
        },
        frmRegisterAcc_pwd: {
            required: true,
            minlength: pwdMin,
            isRestrict: true,
            chkPassword: true,
            maxlength: 16
        },
        frmRegisterAcc_confPwd: {
            equalTo: "#frmRegisterAcc_pwd"
        },
        frmRegisterAcc_hint: {
            required: function(element) {
                return $("#frmRegisterAcc_hintType").val() == "OTR";
            },
            isRestrict: true,
            maxlength: 250
        },
        frmRegisterAcc_hintAns: {
            required: true,
            isRestrict: true,
            maxlength: 100
        },
        frmRegister_pin: {
            required: true,
            isNumeric: true,
            minlength: 6,
            maxlength: 6
        },
        frmRegister_confPin: {
            equalTo: "#frmRegister_pin",
            required: true
        }
    };

    var rulesPersonalInfo = { //#tr_dob, #tr_address, #tr_state, #tr_postcode, #tr_country
        frmRegister_joint: {
            required: true
        },
        frmRegister_category: {
            required: true
        },
        frmRegister_cliNameFirst: {
            required: true,
            isRestrict: true,
            maxlength: 33
        },
        frmRegister_cliNameMiddle: {
            //17/12/2018
            //required: true,
            isRestrict: true,
            maxlength: 33
        },
        frmRegister_cliNameLast: {
            required: true,
            isRestrict: true,
            maxlength: 33
        },
        frmRegister_sex: {
            required: true
        },
        frmRegister_dob: {
            required: true,
            validDate: true,
            CheckDOB: true
        },
        frmRegister_birthPlace: {
            required: true,
            maxlength: 50,
            isRestrict: true
        },
        frmRegister_civilStatus: {
            required: true
        },
        /*frmRegister_spouseName:{
            required: function(element){
                return $("#frmRegister_civilStatus").val()!="S";
            },
            isRestrict:true,
            maxlength:100
        },*/
        frmRegister_citizenship: {
            required: true
        },
        frmRegister_cli1ICType1: {
            required: true,
        },
        frmRegister_cli1ICValue1: {
            required: true,
            maxlength: 20,
            isRestrict: true
        },
        frmRegister_idValid: {
            required: true,
            validDate: true
        },
        frmRegister_cli1ICType2: {
            required: true,
            IDTypeNotSame: true
        },
        frmRegister_cli1ICValue2: {
            required: true,
            maxlength: 20,
            isRestrict: true
        },
        frmRegister_nationality: {
            required: true,
            maxlength: 20,
            isRestrict: true
        },
        frmRegister_passportNo: {
            required: true,
            maxlength: 20,
            isRestrict: true
        },
        frmRegister_acrNo: {
            required: true,
            maxlength: 20,
            isRestrict: true
        },
        frmRegister_dtIssued: {
            required: true,
            validDate: true,
            CheckDate: true
        },
        frmRegister_placeIssued: {
            required: true,
            maxlength: 20,
            isRestrict: true
        },
        frmRegister_verificationNo: {
            required: true,
            maxlength: 20,
            isRestrict: true
        },
        frmRegister_verificationDt: {
            required: true,
            validDate: true,
            CheckDate: true
        },
        frmRegister_custodianBnk: {
            required: true,
            maxlength: 20,
            isRestrict: true
        },
        frmRegister_regName: {
            required: true,
            maxlength: 20,
            isRestrict: true
        },
        /*frmRegister_tin:{
                required:{
                        depends: function () {
                            return $('#frmRegister_citizenship').val()=='F';
                        }
                },
                maxlength:9,
                isRestrict:true
            },*/
        frmRegister_cli1Add1: {
            required: true,
            isRestrict: true,
            maxlength: 120
        },
        frmRegister_cli1Add2: {
            isRestrict: true,
            maxlength: 120
        },
        frmRegister_postcode: {
            //changes made on 17/12/2018
            //required: true,
            isNumNotReq: true,
            maxlength: 10
        },
        frmRegister_cli1Telno1: {
            required: function(element) {
                return $("#frmRegister_cli1Mobile1").val() == "";
            },
            isNumNotReq: true,
            minlength: 2,
            maxlength: 6
        },
        frmRegister_cli1Telno2: {
            required: function(element) {
                return $("#frmRegister_cli1Mobile2").val() == "";
            },
            isNumNotReq: true,
            minlength: 6,
            maxlength: 13
        },
        frmRegister_occupation: {
            required: true,
        },
        /*frmRegister_ownership:{
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
        },*/
        frmRegister_email: {
            required: true,
            email: true,
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_cli1Mobile1: {
            
            required: function(element) {
                return $("#frmRegister_cli1Telno1").val() == "";
            },
            isNumNotReq: true,
            minlength: 2,
            maxlength: 6
        },
        frmRegister_cli1Mobile2: {
            
            required: function(element) {
                return $("#frmRegister_cli1Telno2").val() == "";
            },
            isNumNotReq: true,
            minlength: 6,
            maxlength: 13
        },
        frmRegister_cli1Fax1: {
            //required: false,
            isNumNotReq: true,
            minlength: 2,
            maxlength: 6
        },
        frmRegister_cli1Fax2: {
            //required: false,
            isNumNotReq: true,
            minlength: 6,
            maxlength: 13
        },
        frmRegister_employmentStatus: {
            required: true,
            maxlength: 20
        },
        frmRegister_employName: {
            required: true,
            maxlength: 50,
            isRestrict: true
        },
        frmRegister_cli1BusinessAdd1: {
            required: true,
            isRestrict: true,
            maxlength: 120
        },

        frmRegister_cli1BusinessAdd2: {
            isRestrict: true,
            maxlength: 120
        },
        frmRegister_cli1EmployTelno1: {
            required: true,
            isNumeric: true,
            minlength: 2,
            maxlength: 6
        },
        frmRegister_cli1EmployTelno2: {
            required: true,
            isNumeric: true,
            minlength: 6,
            maxlength: 13
        },
        frmRegister_employPostcode: {
            required: true,
            isNumeric: true,
            maxlength: 10
        },
        //removed date validation since will be changed to numeric only
        //12282018 commented out numeric rule, changed to existing digits rule
        frmRegister_yearsWithCompany: {
            //numeric: true,
            required: true,
            digits: true
        },
        frmRegister_businessType: {
            required: true
        },

        frmRegister_cliNameFirst2: {
            required: true,
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_cliNameMiddle2: {
            //17/12/2018
            //required: true,
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_cliNameLast2: {
            required: true,
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_sex2: {
            required: true
        },
        frmRegister_dob2: {
            required: true,
            validDate: true,
            CheckDOB: true
        },
        frmRegister_birthPlace2: {
            required: true,
            maxlength: 50,
            isRestrict: true
        },
        frmRegister_civilStatus2: {
            required: true
        },
        /*frmRegister_spouseName2:{
            required: function(element){
                return $("#frmRegister_civilStatus2").val()!="S";
            },
            isRestrict:true,
            maxlength:100       
        },*/
        frmRegister_citizenship2: {
            required: true
        },
        frmRegister_cli2ICType1: {
            required: true,
        },
        frmRegister_cli2ICValue1: {
            required: true,
            maxlength: 20,
            isRestrict: true
        },
        frmRegister_cli2ICType2: {
            required: true,
            IDTypeNotSame: true
        },
        frmRegister_cli2ICValue2: {
            required: true,
            maxlength: 20,
            isRestrict: true
        },
        frmRegister_nationality2: {
            required: true,
            maxlength: 30,
            isRestrict: true
        },
        frmRegister_passportNo2: {
            required: true,
            maxlength: 30,
            isRestrict: true
        },
        frmRegister_acrNo2: {
            required: true,
            maxlength: 30,
            isRestrict: true
        },
        frmRegister_dtIssued2: {
            required: true,
            validDate: true,
            CheckDate: true
        },
        frmRegister_placeIssued2: {
            required: true,
            maxlength: 30,
            isRestrict: true
        },
        frmRegister_verificationNo2: {
            required: true,
            maxlength: 30,
            isRestrict: true
        },
        frmRegister_verificationDt2: {
            required: true,
            validDate: true,
            CheckDate: true
        },
        frmRegister_custodianBnk2: {
            required: true,
            maxlength: 30,
            isRestrict: true
        },
        frmRegister_regName2: {
            required: true,
            maxlength: 50,
            isRestrict: true
        },
        /*frmRegister_tin2:{
            required:true,
            maxlength:9,
            isRestrict:true
        },*/
        frmRegister_cli2Add1: {
            required: true,
            isRestrict: true,
            maxlength: 120
        },
        frmRegister_cli2Add2: {
            isRestrict: true,
            maxlength: 120
        },
        frmRegister_postcode2: {
            //changes made on 17/12/2018
            //required: true,
            isNumNotReq: true,
            maxlength: 10
        },
        frmRegister_cli2Telno1: {
            required: function(element) {
                return $("#frmRegister_cli2Mobile1").val() == "";
            },
            isNumNotReq: true,
            minlength: 2,
            maxlength: 6
        },
        frmRegister_cli2Telno2: {
            required: function(element) {
                return $("#frmRegister_cli2Mobile2").val() == "";
            },
            isNumNotReq: true,
            minlength: 2,
            maxlength: 6
        },
        /*frmRegister_ownership2:{
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
        },*/
        frmRegister_occupation2: {
            required: true,
            maxlength: 30,
            isRestrict: true
        },
        frmRegister_email2: {
            required: true,
            email: true,
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_cli2Mobile1: {
            required: function(element) {
                return $("#frmRegister_cli2Telno1").val() == "";
            },
            isNumNotReq: true,
            minlength: 2,
            maxlength: 6
        },
        frmRegister_cli2Mobile2: {
            required: function(element) {
                return $("#frmRegister_cli2Telno2").val() == "";
            },
            isNumNotReq: true,
            minlength: 6,
            maxlength: 13
        },
        frmRegister_cli2Fax1: {
            //required: false,
            isNumNotReq: true,
            minlength: 2,
            maxlength: 6
        },
        frmRegister_cli2Fax2: {
            //required: false,
            isNumNotReq: true,
            minlength: 6,
            maxlength: 13
        },
        frmRegister_employmentStatus2: {
            required: true
        },
        frmRegister_employName2: {
            required: true,
            maxlength: 50,
            isRestrict: true
        },
        frmRegister_cli2BusinessAdd1: {
            required: true,
            isRestrict: true,
            maxlength: 120
        },
        frmRegister_cli2BusinessAdd2: {
            isRestrict: true,
            maxlength: 120
        },
        frmRegister_employPostcode2: {
            required: true,
            isNumeric: true,
            maxlength: 10
        },
        frmRegister_cli2EmployTelno1: {
            required: true,
            isNumeric: true,
            minlength: 2,
            maxlength: 6
        },
        frmRegister_cli2EmployTelno2: {
            required: true,
            isNumeric: true,
            minlength: 6,
            maxlength: 13
        },
        //same as the change for frmRegister_yearsWithCompany above (validation)
        frmRegister_yearsWithCompany2: {
            required: true,
            isNumeric: true
        },
        frmRegister_position2: {
            required: true,
            maxlength: 50
        },
        frmRegister_refBy2: {
            required: true
        },
        frmRegister_refByAns2: {
            required: function(element) {
                return !$('#frmRegister_refBy2').val() == "A";
            },
            isRestrict: true,
            maxlength: 100
        }
    };
    //$.extend(rules, rules_N);

    var rules_InvestorProfile = {
        frmRegister_fundSrc: {
            required: true
        },
        /* changes made 12/18/2018
        frmRegister_bank: {
            required: true
        },
        frmRegister_bankName: {
            required: true
        },
        frmRegister_accName: {
            required: true,
            maxlength: 50,
            isRestrict: true
        },
        frmRegister_accNo: {
            required: true,
            maxlength: 50,
            isNumeric: true
        },
        frmRegister_accBranch: {
            required: true,
            maxlength: 50,
            isRestrict: true
        },
        */
        frmRegister_invObj: {
            required: true
        },
        frmRegister_annualIncome: {

        },
        frmRegister_netWorth: {

        },
        frmRegister_marketRisk: {
            required: true
        },
        frmRegister_trdYrs: {
            required: true
        },
        frmRegister_invInstrument: {
            required: true
        },
        frmRegister_netWorthInv: {
            required: true
        },
        frmRegister_retireAge: {
            required: true
        },
        frmRegister_invRedemption: {
            required: true
        },
        frmRegister_invObj: {
            required: true
        },
        frmRegister_ratio: {
            required: true
        },
        frmRegister_invDrop: {
            required: true
        },
        frmRegister_mfTotalScore: {
            required: true
        },
        frmRegister_befOwner: {
            required: true
        },
        frmRegister_beneficialOwner: {
            required: true
        },
        frmRegister_beneficialOwnerCompany: {
            required: function(element) {
                return $('input:radio[name=frmRegister_befOwner]:checked').val() == "Y";
            },
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_beneficialOwnerPosition: {
            required: function(element) {
                return $('input:radio[name=frmRegister_befOwner]:checked').val() == "Y";
            },
            isRestrict: true,
            maxlength: 50
        },
        /*frmRegister_accOthBroker:{
            required:true           
        },
        frmRegister_accOthBrokerName:{
            required: true,
            isRestrict:true,
            maxlength:50
        },
        frmRegister_accOthBrokerPerson:{
            required: true,
            isRestrict:true,
            maxlength:100
        },*/
        frmRegister_befPerson: {
            required: true
        },
        frmRegister_beneficiaryName: {
            required: function(element) {
                return $('input:radio[name=frmRegister_befPerson]:checked').val() == "Y";
            },
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_beneficiaryRel: {
            required: function(element) {
                return $('input:radio[name=frmRegister_befPerson]:checked').val() == "Y";
            },
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_relOtherBroker: {
            required: true
        },
        frmRegister_relOtherBrokerName: {
            required: function(element) {
                return $('input:radio[name=frmRegister_relOtherBroker]:checked').val() == "Y";
            },
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_relOtherBrokerPerson: {
            required: function(element) {
                return $('input:radio[name=frmRegister_relOtherBroker]:checked').val() == "Y";
            },
            isRestrict: true,
            maxlength: 100
        },
        frmRegister_delivery: {
            required: true,
            maxlength: 120
        }

    };
    //$.extend(rules, rules_M);
    var rules_UtradeAwareness = {
        frmRegister_refBy: {
            required: true,
            maxlength: 100
        },
        frmRegister_refByAns: {
            required: true,
            isRestrict: true,
            maxlength: 100
        },
        frmRegister_annc: {
            required: true,
            maxlength: 150
        },
        frmRegister_anncByAns: {
            required: true,
            isRestrict: true,
            maxlength: 150
        }

    };
    // validation
    $("#frmRegister").validate({
        errorElement: 'span',
        rules: rulesPersonalInfo,
        submitHandler: function(form) {
            chgRegisterLayout(2);
            return false;
        }
    });

    $("#frmRegisterAcc").validate({
        errorElement: 'span',
        rules: rulesAcc,
        submitHandler: function(form) {
            getTrialLogin();
            return false;
        }
    });

    $("#frmInvestorProfile").validate({
        errorElement: 'span',
        rules: rules_InvestorProfile,
        submitHandler: function(form) {
            calculate();
            chgRegisterLayout(3);
            return false;
        }
    });
    $("#frmUtradeAwareness").validate({
        errorElement: 'span',
        rules: rules_UtradeAwareness,
        submitHandler: function(form) {
            chgRegisterLayout(4);
            console.log("change layout to review and print");
            return false;
        }
    });

    $("#frmRvPrnt").validate({
        errorElement: 'span',
        rules: rules_InvestorProfile,
        submitHandler: function(form) {
            var s = confirm("Press OK to submit. Press Cancel to review your information");
            if (s) {
                resetClicks()
                registerOpenAcc();
                return false;
            }
            else {
                alert("You can press the back button to review your information");
                resetClicks();
            }
        }
    });
}

function calculate() {
    var total1 = 0;
    var total2 = 0;
    var total3 = 0;
    var total4 = 0;

    if (($("#frmRegister_trdYrs").val() == "1")) {
        total1++;
    } else if (($("#frmRegister_trdYrs").val() == "2")) {
        total2++;
    } else if (($("#frmRegister_trdYrs").val() == "3")) {
        total3++;
    } else if (($("#frmRegister_trdYrs").val() == "4")) {
        total4++;
    }

    if (($("#frmRegister_invInstrument").val() == "1")) {
        total1++;
    } else if (($("#frmRegister_invInstrument").val() == "2")) {
        total2++;
    } else if (($("#frmRegister_invInstrument").val() == "3")) {
        total3++;
    } else if (($("#frmRegister_invInstrument").val() == "4")) {
        total4++;
    }

    if (($("#frmRegister_netWorthInv").val() == "1")) {
        total1++;
    } else if (($("#frmRegister_netWorthInv").val() == "2")) {
        total2++;
    } else if (($("#frmRegister_netWorthInv").val() == "3")) {
        total3++;
    } else if (($("#frmRegister_netWorthInv").val() == "4")) {
        total4++;
    }

    if (($("#frmRegister_retireAge").val() == "1")) {
        total1++;
    } else if (($("#frmRegister_retireAge").val() == "2")) {
        total2++;
    } else if (($("#frmRegister_retireAge").val() == "3")) {
        total3++;
    } else if (($("#frmRegister_retireAge").val() == "4")) {
        total4++;
    }

    if (($("#frmRegister_invRedemption").val() == "1")) {
        total1++;
    } else if (($("#frmRegister_invRedemption").val() == "2")) {
        total2++;
    } else if (($("#frmRegister_invRedemption").val() == "3")) {
        total3++;
    } else if (($("#frmRegister_invRedemption").val() == "4")) {
        total4++;
    }

    if (($("#frmRegister_invObj").val() == "1")) {
        total1++;
    } else if (($("#frmRegister_invObj").val() == "2")) {
        total2++;
    } else if (($("#frmRegister_invObj").val() == "3")) {
        total3++;
    } else if (($("#frmRegister_invObj").val() == "4")) {
        total4++;
    }

    if (($("#frmRegister_ratio").val() == "1")) {
        total1++;
    } else if (($("#frmRegister_ratio").val() == "2")) {
        total2++;
    } else if (($("#frmRegister_ratio").val() == "3")) {
        total3++;
    } else if (($("#frmRegister_ratio").val() == "4")) {
        total4++;
    }

    if (($("#frmRegister_invDrop").val() == "1")) {
        total1++;
    } else if (($("#frmRegister_invDrop").val() == "2")) {
        total2++;
    } else if (($("#frmRegister_invDrop").val() == "3")) {
        total3++;
    } else if (($("#frmRegister_invDrop").val() == "4")) {
        total4++;
    }

    var mfTotalScore = ((total1 * 4) + (total2 * 6) + (total3 * 8) + (total4 * 10));
    $("#frmRegister_mfTotalScore").val(mfTotalScore);

}

function chgRegisterLayout(layout) {
    switch (layout) {
        case 0:
            $('#frmRegisterAcc').show();
            $('#frmRegister').hide();
            $('#frmInvestorProfile').hide();
            $('#frmUtradeAwareness').hide();
            $('#frmRvPrnt').hide();

            if ($("li").hasClass("fin-step")) {
                $("li").removeClass("fin-step");
            }

            $("li:contains('1. Account Info')").addClass("fin-step");

            //NetInfinium Request
            $(".accinfo").addClass("currentstep");
            $(".perinfo").removeClass("currentstep");
            break;
        case 1: //Page 2
            $('#frmRegisterAcc').hide();
            $('#frmRegister').show();
            $('#frmInvestorProfile').hide();
            $('#frmUtradeAwareness').hide();
            $('#frmRvPrnt').hide();

            $("li:contains('2. Personal Info')").removeClass("unfin-step").addClass("fin-step");
            $("li:contains('3. Investor Profile')").removeClass("fin-step").addClass("unfin-step");

            //NetInfinium Request
            $(".perinfo").addClass("currentstep");
            $(".accinfo").removeClass("currentstep");
            $(".invpro").removeClass("currentstep");
            break;
        case 2: //Page 3            
            $('#frmRegisterAcc').hide();
            $('#frmRegister').hide();
            $('#frmInvestorProfile').show();
            $('#frmUtradeAwareness').hide();
            $('#frmRvPrnt').hide();

            $("li:contains('3. Investor Profile')").removeClass("unfin-step").addClass("fin-step");
            $("li:contains('4. UTrade Awareness')").removeClass("fin-step").addClass("unfin-step");

            //NetInfinium Request
            $(".invpro").addClass("currentstep");
            $(".perinfo").removeClass("currentstep");
            $(".revprin").removeClass("currentstep");
            break;
        case 3: //Page 4
            $('#frmRegisterAcc').hide();
            $('#frmRegister').hide();
            $('#frmInvestorProfile').hide();
            $('#frmUtradeAwareness').show();
            $('#frmRvPrnt').hide();

            resetClicks();

            $("li:contains('4. UTrade Awareness')").removeClass("unfin-step").addClass("fin-step");
            $("li:contains('5. Review and Print')").removeClass("fin-step").addClass("unfin-step");

            //NetInfinium Request
            $(".revprin").addClass("currentstep");
            $(".invpro").removeClass("currentstep");
            $(".sendoc").removeClass("currentstep");
            break;

        case 4: //Page 5
            $('#frmRegisterAcc').hide();
            $('#frmRegister').hide();
            $('#frmInvestorProfile').hide();
            $('#frmUtradeAwareness').hide();
            $('#frmRvPrnt').show();

            countClicks();

            $("li:contains('5. Review and Print')").removeClass("unfin-step").addClass("fin-step");
            $("li:contains('6. Send Documents')").removeClass("fin-step").addClass("unfin-step");

            //NetInfinium Request
            $(".revprin").addClass("currentstep");
            $(".invpro").removeClass("currentstep");
            $(".sendoc").removeClass("currentstep");
            break;
        case 5: //Page 6
            $('#frmRegisterAcc').hide();
            $('#frmRegister').hide();
            $('#frmInvestorProfile').hide();
            $('#frmUtradeAwareness').hide();
            $('#frmRvPrnt').hide();
            $('#frmSend').show();

            $("li:contains('6. Send Documents')").addClass("fin-step");

            //NetInfinium Request
            $(".sendoc").addClass("currentstep");
            $(".revprin").removeClass("currentstep");
            break;
    }
}

$(".unclicked").click(function() {
    if ($(this).is(':contains("PDF Specimen Signature card")')) {
        $(this).removeClass("unclicked").addClass("clicked");
        registerOpenAccHiddenData('PDF Specimen');
    } else if ($(this).is(':contains("PDF Agreement")')) {
        $(this).removeClass("unclicked").addClass("clicked");
        registerOpenAccHiddenData('PDF Agreement');
    } else if ($(this).is(':contains("PDF Data Consent")')) {
        $(this).removeClass("unclicked").addClass("clicked");
        registerOpenAccHiddenData('PDF Data Consent');
    } else {
        $(this).removeClass("unclicked").addClass("clicked");
        registerOpenAccHiddenData('PDF Application Form');
    }
    countClicks();
})

function countClicks() {
    var clicks = $("a.clicked").length;

    if (clicks == 4) {
        $("#submit-btn").removeProp("disabled");
    } else {
        $("#submit-btn").prop("disabled", true);
    }
}

//
$("[id ^=frmRegister_cli][id $=Type1]").change(function() {
    var d = new Date();

    var month = d.getMonth() + 1;
    var day = d.getDate();
    var year = 2099;

    var fullDate = (day < 10 ? '0' : '') + day + '-' +
        (month < 10 ? '0' : '') + month + '-' +
        year;

    if ($(this).attr("id") == "frmRegister_cli1ICType1") {
        if ($(this).val() == "SSS" || $(this).val() == "TIN" || $(this).val() == "BIRTH" || $(this).val() == "SEN" || $(this).val() == "PHIC") {
            console.log("value 1: " + fullDate);
            $("#frmRegister_idValid").val(fullDate).parent().parent().hide();
        } else {
            $("#frmRegister_idValid").val('').parent().parent().show();
        }
    } else if ($(this).attr("id") == "frmRegister_cli2ICType1") {
        if ($(this).val() == "SSS" || $(this).val() == "TIN" || $(this).val() == "BIRTH" || $(this).val() == "SEN" || $(this).val() == "PHIC") {
            console.log("value 2: " + fullDate);
            $('#frmRegister_idValid2').val(fullDate).parent().parent().hide();
        } else {
            $("#frmRegister_idValid2").val('').parent().parent().show();
        }
    } else {
        //do nothing
    }
})

$("[id ^=frmRegister_cli][id $=ICType1]").change(function() {
    if ($(this).attr("id") == "frmRegister_cli1ICType1") {
        if ($(this).val() == "Other") {
            console.log("Show other id field");
            $("#frmRegister_cli1ICOther").parent().parent().show();
        } else {
            $("#frmRegister_cli1ICOther").parent().parent().hide();
        }
    } else if ($(this).attr("id") == "frmRegister_cli2ICType1") {
        if ($(this).val() == "Other") {
            console.log("Show other id field");
            $("#frmRegister_cli2ICOther").parent().parent().show();
        } else {
            $("#frmRegister_cli2ICOther").parent().parent().hide();
        }
    } else {
        //do nothing
    }
})

function resetClicks() {
    $(".clicked").addClass("unclicked").removeClass("clicked");
    countClicks();
}

function initLookup() {
    $.get("ref/registrationLookup.json", function(lookup) {
        console.log(lookup);
        $('#frmRegisterAcc_hintType').empty();
        for (var i = 0; i < lookup.hint.length; i++) {
            $('#frmRegisterAcc_hintType').append('<option value="' + lookup.hint[i].val + '">' + lookup.hint[i].desc + '</option>');
        }

        $('#frmRegister_category').empty();
        for (var i = 0; i < lookup.accountType.length; i++) {
            $('#frmRegister_category').append('<option value="' + lookup.accountType[i].val + '">' + lookup.accountType[i].desc + '</option>');
        }

        $('#frmRegister_civilStatus').empty();
        $('#frmRegister_civilStatus2').empty();
        for (var i = 0; i < lookup.civilStatus.length; i++) {
            $('#frmRegister_civilStatus').append('<option value="' + lookup.civilStatus[i].val + '">' + lookup.civilStatus[i].desc + '</option>');
            $('#frmRegister_civilStatus2').append('<option value="' + lookup.civilStatus[i].val + '">' + lookup.civilStatus[i].desc + '</option>');
        }

        $('#frmRegister_citizenship').empty();
        $('#frmRegister_citizenship2').empty();
        for (var i = 0; i < lookup.citizenship.length; i++) {
            $('#frmRegister_citizenship').append('<option value="' + lookup.citizenship[i].val + '">' + lookup.citizenship[i].desc + '</option>');
            $('#frmRegister_citizenship2').append('<option value="' + lookup.citizenship[i].val + '">' + lookup.citizenship[i].desc + '</option>');
        }

        $('#frmRegister_cli1ICType1').empty();
        $('#frmRegister_cli1ICType2').empty();
        $('#frmRegister_cli2ICType1').empty();
        $('#frmRegister_cli2ICType2').empty();
        for (var i = 0; i < lookup.idType.length; i++) {
            $('#frmRegister_cli1ICType1').append('<option value="' + lookup.idType[i].val + '">' + lookup.idType[i].desc + '</option>');
            $('#frmRegister_cli1ICType2').append('<option value="' + lookup.idType[i].val + '">' + lookup.idType[i].desc + '</option>');
            $('#frmRegister_cli2ICType1').append('<option value="' + lookup.idType[i].val + '">' + lookup.idType[i].desc + '</option>');
            $('#frmRegister_cli2ICType2').append('<option value="' + lookup.idType[i].val + '">' + lookup.idType[i].desc + '</option>');
        }

        /*$('#frmRegister_ownership').empty();
        $('#frmRegister_ownership2').empty();
        for(var i=0;i <lookup.ownership.length;i++){
            $('#frmRegister_ownership').append('<option value="'+lookup.ownership[i].val+'">'+lookup.ownership[i].desc+'</option>');
            $('#frmRegister_ownership2').append('<option value="'+lookup.ownership[i].val+'">'+lookup.ownership[i].desc+'</option>');
        }*/

        $('#frmRegister_employmentStatus').empty();
        $('#frmRegister_employmentStatus2').empty();
        for (var i = 0; i < lookup.employmentStatus.length; i++) {
            $('#frmRegister_employmentStatus').append('<option value="' + lookup.employmentStatus[i].val + '">' + lookup.employmentStatus[i].desc + '</option>');
            $('#frmRegister_employmentStatus2').append('<option value="' + lookup.employmentStatus[i].val + '">' + lookup.employmentStatus[i].desc + '</option>');
        }

        $('#frmRegister_refBy').empty();
        $('#frmRegister_refBy2').empty();
        for (var i = 0; i < lookup.referredBy.length; i++) {
            $('#frmRegister_refBy').append('<option value="' + lookup.referredBy[i].val + '">' + lookup.referredBy[i].desc + '</option>');
            $('#frmRegister_refBy2').append('<option value="' + lookup.referredBy[i].val + '">' + lookup.referredBy[i].desc + '</option>');
        }

        $('#frmRegister_annualIncome').empty();
        for (var i = 0; i < lookup.annualIncome.length; i++) {
            $('#frmRegister_annualIncome').append('<option value="' + lookup.annualIncome[i].val + '">' + lookup.annualIncome[i].desc + '</option>');
        }

        $('#frmRegister_netWorth').empty();
        for (var i = 0; i < lookup.netWorth.length; i++) {
            $('#frmRegister_netWorth').append('<option value="' + lookup.netWorth[i].val + '">' + lookup.netWorth[i].desc + '</option>');
        }

        for (var i = 0; i < lookup.investObjective.length; i++) {
            if (i == 0) {
                $('#frmRegister_invObj1').parent().empty().append("<input type='checkbox' id='frmRegister_invObj1' name='frmRegister_invObj' style='width:40px' value='" + lookup.investObjective[i].val + "'>" + lookup.investObjective[i].desc + "<br>");
            } else {
                $('#frmRegister_invObj1').parent().append("<input type='checkbox' id='frmRegister_invObj" + (i + 1) + "' name='frmRegister_invObj' style='width:40px' value='" + lookup.investObjective[i].val + "'>" + lookup.investObjective[i].desc + "<br>");
            }
        }

    });

}

// on page load
$(document).ready(function() {
    chkSess();

    var category = "N";
    var type = "M";
    var clientType = getUrlParameter("type") == undefined ? "" : getUrlParameter("type");
    initLookup();
    initOpenAcctRegFormValidation(BMSSetting, category, type);

    //following line placed to fire change function on document ready and check the default ID type
    //this will hide the id validity since the default ID, type which is Tax ID Number, doesn't have a validity date
    $("[id ^=frmRegister_cli][id $=Type1]").trigger("change");


    $("#frmRegister_dob").datepicker({
        changeMonth: true,
        changeYear: true,
        //maxDate:"+0D",

        defaultDate: "-6570",
        yearRange: "-100:+0",
        dateFormat: "dd-mm-yy"

    });
    $("#frmRegister_idValid").datepicker({
        changeMonth: true,
        changeYear: true,
        //maxDate:"+0D",

        yearRange: "-100:+100",
        dateFormat: "dd-mm-yy"
    });
    $("#frmRegister_idValid2").datepicker({
        changeMonth: true,
        changeYear: true,
        //maxDate:"+0D",
        yearRange: "-100:+100",
        dateFormat: "dd-mm-yy"
    });
    $("#frmRegister_dob2").datepicker({
        changeMonth: true,
        changeYear: true,
        //maxDate:"+0D",

        defaultDate: "-6570",
        yearRange: "-100:+0",
        dateFormat: "dd-mm-yy"
    });

    $("#frmRegister_dtIssued").datepicker({
        changeMonth: true,
        changeYear: true,
        //maxDate:"+0D",
        yearRange: "-100:+0",
        dateFormat: "dd-mm-yy"
    });
    $("#frmRegister_dtIssued2").datepicker({
        changeMonth: true,
        changeYear: true,
        //maxDate:"+0D",
        yearRange: "-100:+0",
        dateFormat: "dd-mm-yy"
    });

    $("#frmRegister_verificationDt").datepicker({
        changeMonth: true,
        changeYear: true,
        //maxDate:"+0D",
        yearRange: "-100:+0",
        dateFormat: "dd-mm-yy"
    });
    $("#frmRegister_verificationDt2").datepicker({
        changeMonth: true,
        changeYear: true,
        //maxDate:"+0D",
        yearRange: "-100:+0",
        dateFormat: "dd-mm-yy"
    });

    $('div.ui-datepicker').css({
        "font-size": "10px"
    });

    $("#frmRegisterAcc_hintType").change(function() {
        if ($("#frmRegisterAcc_hintType").val() == "OTR") {
            $("#frmRegisterAcc_hint").parent().parent().show();
        } else {
            $("#frmRegisterAcc_hint").parent().parent().hide().blur();
        }
    });

    $("#frmRegister_refBy").change(function() {
        if ($("#frmRegister_refBy").val() == "8") {
            $("#frmRegister_refByAns").parent().show();
        } else {
            $("#frmRegister_refByAns").parent().hide().blur();
        }
    });
    $("#frmRegister_annc").change(function() {
        if ($("#frmRegister_annc").val() == "6") {
            $("#frmRegister_anncByAns").parent().show();
        } else {
            $("#frmRegister_anncByAns").parent().hide().blur();
        }
    });

    /*$("#frmRegister_ownership2").change(function(){
        if($("#frmRegister_ownership2").val()=="M"){
            $("#frmRegister_ownershipAns2").show();
        }else{
            $("#frmRegister_ownershipAns2").hide().blur();
        }
    });*/

    $("#frmRegister_refBy2").change(function() {
        if (!($("#frmRegister_refBy2").val() == "8")) {
            $("#frmRegister_refByAns2").show();
        } else {
            $("#frmRegister_refByAns2").hide().blur();
        }
    });

    $("#frmRegister_joint").change(function() {
        if ($("#frmRegister_joint").val() != "M") {
            $("#tblAccount2").show();
        } else {
            $("#tblAccount2").hide().blur();
        }
    });

    if (clientType == "1") {
        $('#tr_confPassword').hide();
        $('#tr_hint').hide();
        $('#tr_hintAns').hide();
    }

    $("#frmRegister_civilStatus").change(function() {
        if ($("#frmRegister_civilStatus").val() == "SG") {
            $("#spouseContainer").hide().blur();
        } else {
            $("#spouseContainer").show();

        }
    });

    $("#frmRegister_employmentStatus").change(function() {

        $("#frmRegister_yearsWithCompany").val("");

        if ($("#frmRegister_employmentStatus").val() == "1") {
            $("#frmRegister_employName").parent().prev().html("Name of Employer");
            $("#frmRegister_yearsWithCompany").parent().prev().html("Years with Company");
            //changed as of 102318
            $('#frmRegister_yearsWithCompany').datepicker("destroy");
            $('#frmRegister_yearsWithCompany').removeClass("hasDatepicker");

            $("#frmRegister_employName").parent().parent().show();
            $("#frmRegister_cli1BusinessAdd1").parent().parent().parent().show();
            $("#frmRegister_cli1BusinessAdd2").parent().parent().show();
            $("#frmRegister_cli1EmployTelno1").parent().parent().parent().parent().show();
            $("#frmRegister_cli1EmployTelno2").parent().parent().show();
            $("#frmRegister_yearsWithCompany").parent().parent().show();

            $("#frmRegister_position").parent().parent().hide();

        } else if ($("#frmRegister_employmentStatus").val() == "2") {
            $("#frmRegister_employName").parent().prev().html("Name of Business Owned");
            $("#frmRegister_yearsWithCompany").parent().prev().html("Date Established");
            $("#frmRegister_position").parent().prev().html("Type of Business");

            /*$("#frmRegister_yearsWithCompany").datepicker({
                changeMonth: true,
                changeYear: true,
                //maxDate:"+0D",
                yearRange: "-100:+0",
                dateFormat: "dd-mm-yy"
            });*/

            $("#frmRegister_employName").parent().parent().show();
            $("#frmRegister_cli1BusinessAdd1").parent().parent().parent().show();
            $("#frmRegister_cli1BusinessAdd2").parent().parent().show();
            $("#frmRegister_cli1EmployTelno1").parent().parent().parent().parent().show();
            $("#frmRegister_cli1EmployTelno2").parent().parent().show();
            $("#frmRegister_yearsWithCompany").parent().parent().show();
            $("#frmRegister_position").parent().parent().show();
        } else {
            $("#frmRegister_employName").parent().parent().hide().blur();
            $("#frmRegister_cli1BusinessAdd1").parent().parent().parent().hide().blur();
            $("#frmRegister_cli1BusinessAdd2").parent().parent().hide().blur();
            $("#frmRegister_employPostcode").parent().parent().hide().blur();
            $("#frmRegister_cli1EmployTelno1").parent().parent().parent().parent().hide().blur();
            $("#frmRegister_cli1EmployTelno2").parent().parent().hide().blur();
            $("#frmRegister_yearsWithCompany").parent().parent().hide().blur();
            $("#frmRegister_position").parent().parent().hide();

            $("#frmRegister_employName").val("");
            $("#frmRegister_cli1BusinessAdd1").val("");
            $("#frmRegister_cli1BusinessAdd2").val("");
            $("#frmRegister_employPostcode").val("");
            $("#frmRegister_cli1EmployTelno1").val("");
            $("#frmRegister_cli1EmployTelno2").val("");
            $("#frmRegister_yearsWithCompany").val("");
            $("#frmRegister_position").val("");

        }
    });
    $("#frmRegister_employmentStatus").change(function() {
        if ($("#frmRegister_employmentStatus").val() == "1") {
            $("#frmRegister_delivery1").parent().parent().show();
            $("#frmRegister_delivery2").show();
            $("#frmRegister_deliveryO").show();

        } else if ($("#frmRegister_employmentStatus").val() == "2") {
            $("#frmRegister_delivery1").parent().parent().show();
            $("#frmRegister_delivery2").show();
            $("#frmRegister_deliveryO").show();

        } else {
            $("#frmRegister_delivery1").parent().parent().show();
            $("#frmRegister_delivery2").hide().blur();
            $("#frmRegister_deliveryO").hide().blur();
        }
    });
    $("#frmRegister_bank").change(function() {
        if ($("#frmRegister_bank").val() == "Other") {
            $("#frmRegister_bankName").parent().parent().show();
        } else {
            $("#frmRegister_bankName").parent().parent().hide().blur();
        }
    });
    $("#frmRegister_employmentStatus2").change(function() {

        $("#frmRegister_yearsWithCompany2").val("");

        if ($("#frmRegister_employmentStatus2").val() == "1") {
            $("#frmRegister_employName2").parent().prev().html("Name of Employer");
            $("#frmRegister_yearsWithCompany2").parent().prev().html("Years with Company");
            //$("#frmRegister_position2").parent().prev().html("Position");
            //changed as of 102318
            //$('#frmRegister_yearsWithCompany2').datepicker("destroy");
            //$('#frmRegister_yearsWithCompany2').removeClass("hasDatepicker");

            $("#frmRegister_employName2").parent().parent().show();
            $("#frmRegister_cli2BusinessAdd1").parent().parent().parent().show();
            $("#frmRegister_cli2BusinessAdd2").parent().parent().show();
            //$("#frmRegister_employPostcode2").parent().parent().show();
            $("#frmRegister_cli2EmployTelno1").parent().parent().parent().show();
            $("#frmRegister_cli2EmployTelno2").parent().parent().show();
            $("#frmRegister_yearsWithCompany2").parent().parent().show();
            $("#frmRegister_position2").parent().parent().hide();

        } else if ($("#frmRegister_employmentStatus2").val() == "2") {

            $("#frmRegister_employName2").parent().prev().html("Name of Business Owned");
            $("#frmRegister_yearsWithCompany2").parent().prev().html("Date Established");
            $("#frmRegister_position2").parent().prev().html("Type of Business");
            /*
            $("#frmRegister_yearsWithCompany2").datepicker({
                changeMonth: true,
                changeYear: true,
                //maxDate:"+0D",
                yearRange: "-100:+0",
                dateFormat: "dd-mm-yy"
            });*/

            $("#frmRegister_employName2").parent().parent().show();
            $("#frmRegister_cli2BusinessAdd1").parent().parent().parent().show();
            $("#frmRegister_cli2BusinessAdd2").parent().parent().show();
            $("#frmRegister_cli2EmployTelno1").parent().parent().parent().parent().show();
            $("#frmRegister_cli2EmployTelno2").parent().parent().show();
            $("#frmRegister_yearsWithCompany2").parent().parent().show();
            $("#frmRegister_position2").parent().parent().show();

        } else {
            $("#frmRegister_employName2").parent().parent().hide().blur();
            $("#frmRegister_cli2BusinessAdd1").parent().parent().parent().hide().blur();
            $("#frmRegister_cli2BusinessAdd2").parent().parent().hide().blur();
            $("#frmRegister_employPostcode2").parent().parent().hide().blur();
            $("#frmRegister_cli2EmployTelno1").parent().parent().parent().parent().hide().blur();
            $("#frmRegister_cli2EmployTelno2").parent().parent().hide().blur();
            $("#frmRegister_yearsWithCompany2").parent().parent().hide().blur();
            $("#frmRegister_position2").parent().parent().hide();


            $("#frmRegister_employName2").val("");
            $("#frmRegister_cli2BusinessAdd1").val("");
            $("#frmRegister_cli2BusinessAdd2").val("");
            $("#frmRegister_employPostcode2").val("");
            $("#frmRegister_cli2EmployTelno1").val("");
            $("#frmRegister_cli2EmployTelno2").val("");
            $("#frmRegister_yearsWithCompany2").val("");
            $("#frmRegister_position2").val("");

        }

    });

    //commented out function below to correct behaviour of others textbox in fund source 1/2/2019
    $("#frmRegister_fundSrc6").change(function() {
        if ($(this).prop('checked')) {
            $("#frmRegister_fundSrcOthers").parent().parent().show();
        }
        else {
            $("#frmRegister_fundSrcOthers").parent().parent().hide().blur();
        }
    });
    /*
    $("input[name=frmRegister_fundSrc]").change(function() {
        if (($('input[name=frmRegister_fundSrc]:checked').val() == "Others "{
            $("#frmRegister_fundSrcOthers").parent().parent().show();
        }
        else {
            $("#frmRegister_fundSrcOthers").parent().parent().hide().blur();
        }

    });
    */

    $("input[name=frmRegister_relOtherBroker]").change(function() {
        if ($('input[name=frmRegister_relOtherBroker]:checked').val() == "Y") {
            $("#frmRegister_relOtherBrokerName").parent().parent().show();
            $("#frmRegister_relOtherBrokerPerson").parent().parent().show();
        } else {
            $("#frmRegister_relOtherBrokerName").parent().parent().hide().blur();
            $("#frmRegister_relOtherBrokerPerson").parent().parent().hide().blur();
        }
    });

    $("input[name=frmRegister_befOwner]").change(function() {
        if ($('input[name=frmRegister_befOwner]:checked').val() == "Y") {
            $("#frmRegister_beneficialOwnerCompany").parent().parent().show();
            $("#frmRegister_beneficialOwnerPosition").parent().parent().show();
        } else {
            $("#frmRegister_beneficialOwnerCompany").parent().parent().hide().blur();
            $("#frmRegister_beneficialOwnerPosition").parent().parent().hide().blur();
        }
    });
    $("input[name=frmRegister_befPerson]").change(function() {
        if ($('input[name=frmRegister_befPerson]:checked').val() == "Y") {
            $("#frmRegister_beneficiaryName").parent().parent().show();
            //changes made on 12/18/2018
            $("#frmRegister_beneficiaryRel").parent().parent().show();
            $("#frmRegister_beneficiaryName2").parent().parent().show();
            $("#frmRegister_beneficiaryRel2").parent().parent().show();
        } else {
            $("#frmRegister_beneficiaryName").parent().parent().hide().blur();
            $("#frmRegister_beneficiaryRel").parent().parent().hide().blur();
            $("#frmRegister_beneficiaryName2").parent().parent().hide().blur();
            $("#frmRegister_beneficiaryRel2").parent().parent().hide().blur();
        }
    });

    $("#frmRegister_citizenship").change(function() {
        if ($("#frmRegister_citizenship").val() == "R") {
            $("#frmRegister_cli1ICType1").parent().parent().hide().blur();
            $("#frmRegister_cli1ICValue1").parent().parent().hide().blur();

            $("#frmRegister_cli1ICOther").parent().parent().hide();

            $("#frmRegister_cli1IDType1").parent().parent().show();
            $("#frmRegister_nationality").parent().parent().show();
            $("#frmRegister_passportNo").parent().parent().show();
            $("#frmRegister_acrNo").parent().parent().show();
            $("#frmRegister_dtIssued").parent().parent().show();
            $("#frmRegister_placeIssued").parent().parent().show();
            $("#frmRegister_verificationNo").parent().parent().show();
            $("#frmRegister_verificationDt").parent().parent().show();
            $("#frmRegister_custodianBnk").parent().parent().show();
            $("#frmRegister_regName").parent().parent().show();
        } else if ($("#frmRegister_citizenship").val() == "NR") {
            $("#frmRegister_cli1ICType1").parent().parent().hide().blur();
            $("#frmRegister_cli1ICValue1").parent().parent().hide().blur();

            $("#frmRegister_cli1ICOther").parent().parent().hide();

            $("#frmRegister_cli1IDType1").parent().parent().show();
            $("#frmRegister_nationality").parent().parent().show();
            $("#frmRegister_passportNo").parent().parent().show();
            $("#frmRegister_acrNo").parent().parent().hide().blur();
            $("#frmRegister_dtIssued").parent().parent().hide().blur();
            $("#frmRegister_placeIssued").parent().parent().hide().blur();
            $("#frmRegister_verificationNo").parent().parent().hide().blur();
            $("#frmRegister_verificationDt").parent().parent().hide().blur();
            $("#frmRegister_custodianBnk").parent().parent().show();
            $("#frmRegister_regName").parent().parent().show();
        } else {
            $("#frmRegister_cli1IDType1").parent().parent().hide().blur();
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

        }

    });

    $("#frmRegister_citizenship2").change(function() {
        if ($("#frmRegister_citizenship2").val() == "R") {
            $("#frmRegister_cli2ICType1").parent().parent().hide().blur();
            $("#frmRegister_cli2ICValue1").parent().parent().hide().blur();

            $("#frmRegister_cli1ICOther").parent().parent().hide();

            $("#frmRegister_cli2IDType1").parent().parent().show();
            $("#frmRegister_nationality2").parent().parent().show();
            $("#frmRegister_passportNo2").parent().parent().show();
            $("#frmRegister_acrNo2").parent().parent().hide().show();
            $("#frmRegister_dtIssued2").parent().parent().show();
            $("#frmRegister_placeIssued2").parent().parent().show();
            $("#frmRegister_verificationNo2").parent().parent().show();
            $("#frmRegister_verificationDt2").parent().parent().show();
            $("#frmRegister_custodianBnk2").parent().parent().show();
            $("#frmRegister_regName2").parent().parent().show();
        } else if ($("#frmRegister_citizenship2").val() == "NR") {
            $("#frmRegister_cli2ICType1").parent().parent().hide().blur();
            $("#frmRegister_cli2ICValue1").parent().parent().hide().blur();

            $("#frmRegister_cli1ICOther").parent().parent().hide();

            $("#frmRegister_cli2IDType1").parent().parent().show();
            $("#frmRegister_nationalit2").parent().parent().show();
            $("#frmRegister_passportNo2").parent().parent().show();
            $("#frmRegister_acrNo2").parent().parent().hide().blur();
            $("#frmRegister_dtIssued2").parent().parent().hide().blur();
            $("#frmRegister_placeIssued2").parent().parent().hide().blur();
            $("#frmRegister_verificationNo2").parent().parent().hide().blur();
            $("#frmRegister_verificationDt2").parent().parent().hide().blur();
            $("#frmRegister_custodianBnk2").parent().parent().show();
            $("#frmRegister_regName2").parent().parent().show();
        } else {
            $("#frmRegister_cli2IDType1").parent().parent().hide().blur();
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

        }

    });
    /*$("#frmRegister_lengthStay, #frmRegister_lengthStay2").keyup(function (e) {
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
    });*/

});

function registerOpenAccHiddenData(pdfTypeIndividual) {
    $("#frmRvPrnt input:hidden").each(function() {
        $(this).remove();
    });
    $('#frmRvPrnt').append('<input type="hidden" name="pdfTypeIndividual" value="' + pdfTypeIndividual + '" />');


    $('#frmRvPrnt').append('<input type="hidden" name="userName" value="' + $("#frmRegisterAcc_userID").val() + $("#frmRegisterAcc_userID_hidden").val() + '" />');

    $('#frmRvPrnt').append('<input type="hidden" name="pin" value="' + $("#frmRegister_pin").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="hintQuestion" value="' + $("#frmRegisterAcc_hintType").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="othersQuestion" value="' + $("#frmRegisterAcc_hint").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="hintAns" value="' + $("#frmRegisterAcc_hintAns").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="jointIndicator" value="' + $("#frmRegister_joint").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="accType" value="' + $("#frmRegister_category").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="lastName" value="' + $("#frmRegister_cliNameLast").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="firstName" value="' + $("#frmRegister_cliNameFirst").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="middleName" value="' + $("#frmRegister_cliNameMiddle").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="gender" value="' + $('input:radio[name=frmRegister_sex]:checked').val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="dob" value="' + $("#frmRegister_dob").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="pob" value="' + $("#frmRegister_birthPlace").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="residency" value="' + $("#frmRegister_citizenship").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="idType" value="' + $("#frmRegister_cli1ICType1").val() + '" />');

    $('#frmRvPrnt').append('<input type="hidden" name="idOtherType1" value="' + $("#frmRegister_cli1ICOther").val() + '" />');

    $('#frmRvPrnt').append('<input type="hidden" name="idValue" value="' + $("#frmRegister_cli1ICValue1").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="idValidity" value="' + $("#frmRegister_idValid").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="civilStatus" value="' + $("#frmRegister_civilStatus").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="nationality" value="' + $("#frmRegister_nationality").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="acrNumber" value="' + $("#frmRegister_acrNo").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="dateIssued" value="' + $("#frmRegister_dtIssued").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="placeIssued" value="' + $("#frmRegister_placeIssued").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="verificationOrNumber" value="' + $("#frmRegister_verificationNo").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="verificationDate" value="' + $("#frmRegister_verificationDt").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="custodianBank" value="' + $("#frmRegister_custodianBnk").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="registrationName" value="' + $("#frmRegister_regName").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="email" value="' + $("#frmRegister_email").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="homeAddress" value="' + $("#frmRegister_cli1Add1").val() + " " + $("#frmRegister_cli1Add2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="zipCode" value="' + $("#frmRegister_postcode").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="phoneNo" value="' + $("#frmRegister_cli1Telno1").val() + "-" + $("#frmRegister_cli1Telno2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="mobileNo" value="' + $("#frmRegister_cli1Mobile1").val() + "-" + $("#frmRegister_cli1Mobile2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="faxNo" value="' + $("#frmRegister_cli1Fax1").val() + "-" + $("#frmRegister_cli1Fax2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="occupation" value="' + $("#frmRegister_occupation").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="employmentStatus" value="' + $("#frmRegister_employmentStatus").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="employerName" value="' + $("#frmRegister_employName").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="businessAddress" value="' + $("#frmRegister_cli1BusinessAdd1").val() + " " + $("#frmRegister_cli1BusinessAdd2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="businessPhoneNo" value="' + $("#frmRegister_cli1EmployTelno1").val() + "-" + $("#frmRegister_cli1EmployTelno2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="yearsWithCompany" value="' + $("#frmRegister_yearsWithCompany").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="businessType" value="' + $("#frmRegister_position").val() + '" />');

    $('#frmRvPrnt').append('<input type="hidden" name="lastName2" value="' + $("#frmRegister_cliNameLast2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="firstName2" value="' + $("#frmRegister_cliNameFirst2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="middleName2" value="' + $("#frmRegister_cliNameMiddle2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="gender2" value="' + $('input:radio[name=frmRegister_sex2]:checked').val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="dob2" value="' + $("#frmRegister_dob2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="pob2" value="' + $("#frmRegister_birthPlace2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="civilStatus2" value="' + $("#frmRegister_civilStatus2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="citizenship2" value="' + $("#frmRegister_citizenship2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="idType2" value="' + $("#frmRegister_cli2ICType1").val() + '" />');

    $('#frmRvPrnt').append('<input type="hidden" name="idOtherType2" value="' + $("#frmRegister_cli2ICOther").val() + '" />');

    $('#frmRvPrnt').append('<input type="hidden" name="idValue2" value="' + $("#frmRegister_cli2ICValue1").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="idValidity2" value="' + $("#frmRegister_idValid2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="nationality2" value="' + $("#frmRegister_nationality2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="acrNumber2" value="' + $("#frmRegister_acrNo2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="dateIssued2" value="' + $("#frmRegister_dtIssued2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="placeIssued2" value="' + $("#frmRegister_placeIssued2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="verificationOrNumber2" value="' + $("#frmRegister_verificationNo2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="verificationDate2" value="' + $("#frmRegister_verificationDt2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="custodianBank2" value="' + $("#frmRegister_custodianBnk2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="registrationName2" value="' + $("#frmRegister_regName2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="cli2HomeAddress" value="' + $("#frmRegister_cli2Add1").val() + " " + $("#frmRegister_cli2Add2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="zipCode2" value="' + $("#frmRegister_postcode2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="cli2PhoneNo" value="' + $("#frmRegister_cli2Telno1").val() + "-" + $("#frmRegister_cli2Telno2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="occupation2" value="' + $("#frmRegister_occupation2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="email2" value="' + $("#frmRegister_email2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="cli2MobileNo" value="' + $("#frmRegister_cli2Mobile1").val() + "-" + $("#frmRegister_cli2Mobile2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="cli2FaxNo" value="' + $("#frmRegister_cli2Fax1").val() + "-" + $("#frmRegister_cli2Fax2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="employmentStatus2" value="' + $("#frmRegister_employmentStatus2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="employerName2" value="' + $("#frmRegister_employName2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="cli2BusinessAddress" value="' + $("#frmRegister_cli2BusinessAdd1").val() + " " + $("#frmRegister_cli2BusinessAdd2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="cli2BusinessPhoneNo" value="' + $("#frmRegister_cli2EmployTelno1").val() + "-" + $("#frmRegister_cli2EmployTelno2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="yearsWithCompany2" value="' + $("#frmRegister_yearsWithCompany2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="businessType2" value="' + $("#frmRegister_position2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="referredBy2" value="' + $("#frmRegister_refBy2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="referredValue2" value="' + $("#frmRegister_refByAns2").val() + '" />');

    var investmentObj = "";
    $('input:checkbox[name=frmRegister_fundSrc]:checked').each(function(i) {
        if ($(this).val() == "Others"){
            investmentObj += $("#frmRegister_fundSrcOthers").val();
        } else {
            investmentObj += $(this).val() + ",";
        }        
    });
    investmentObj = investmentObj.substring(0, investmentObj.length - 1);
    $('#frmRvPrnt').append('<input type="hidden" name="fundSource" value="' + investmentObj + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="fundSourceOthers" value="'+$("#frmRegister_fundSrcOthers").val()+'" />');    
    $('#frmRvPrnt').append('<input type="hidden" name="bankName" value="' + $("#frmRegister_bank").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="otherBank" value="' + $("#frmRegister_bankName").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="accName" value="' + $("#frmRegister_accName").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="branch" value="' + $("#frmRegister_accBranch").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="accNo" value="' + $("#frmRegister_accNo").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="annualIncome" value="' + $("#frmRegister_annualIncome").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="netFinancialWorth" value="' + $("#frmRegister_netWorth").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="marketRiskTolerance" value="' + $("#frmRegister_marketRisk").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="tradingExp" value="' + $("#frmRegister_trdYrs").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="invExp" value="' + $("#frmRegister_invInstrument").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="netWorthPercentage" value="' + $("#frmRegister_netWorthInv").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="retirementAge" value="' + $("#frmRegister_retireAge").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="invRedemption" value="' + $("#frmRegister_invRedemption").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="invObj" value="' + $("#frmRegister_invObj").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="ratio" value="' + $("#frmRegister_ratio").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="invDrop" value="' + $("#frmRegister_invDrop").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="owner" value="' + $('input:radio[name=frmRegister_befOwner]:checked').val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="ownerCompany" value="' + $("#frmRegister_beneficialOwnerCompany").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="ownerPosition" value="' + $("#frmRegister_beneficialOwnerPosition").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="brokerDealer" value="' + $('input:radio[name=frmRegister_relOtherBroker]:checked').val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="brokerName" value="' + $("#frmRegister_relOtherBrokerName").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="contactPerson" value="' + $("#frmRegister_relOtherBrokerPerson").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="beneficiaries" value="' + $('input:radio[name=frmRegister_befPerson]:checked').val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="beneficiariesName" value="' + $("#frmRegister_beneficiaryName").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="beneficiariesRelationship" value="' + $("#frmRegister_beneficiaryRel").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="beneficiariesName2" value="'+$("#frmRegister_beneficiaryName2").val()+'" />');
    $('#frmRvPrnt').append('<input type="hidden" name="beneficiariesRelationship2" value="'+$("#frmRegister_beneficiaryRel2").val()+'" />');            
    $('#frmRvPrnt').append('<input type="hidden" name="mailedTo" value="' + $('input:radio[name=frmRegister_delivery]:checked').val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="uTradeReferredBy" value="' + $("#frmRegister_refBy").val() + '" />');
    //$('#frmRvPrnt').append('<input type="hidden" name="refByAns" value="' + $("#frmRegister_refByAns2").val() + '" />');
    //082318
    $('#frmRvPrnt').append('<input type="hidden" name="refByAns" value="'+$("#frmRegister_refByAns").val()+'" />');
    $('#frmRvPrnt').append('<input type="hidden" name="announcement" value="' + $("#frmRegister_annc").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="anncByAns" value="' + $("#frmRegister_anncByAns").val() + '" />');

    document.getElementById("frmRvPrnt").submit();
}
