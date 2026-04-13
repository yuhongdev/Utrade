function isAlpha(value) {
    var pattern = /[a-zA-Z]/;
    return pattern.test(value);
}

function isNumeric(value) {
    var pattern = /[\d]/;
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
    var pattern = /^(0[1-9]|1[0-2])\/\/?([0-9]{2})$/;
    return pattern.test(value);
}

function initCorpAcctRegFormValidation(BMSSetting, category, type) {

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
    } else if (pwdSecLvl == "3") {
        $.validator.addMethod("chkPassword", function(value, element) {
            return isAlpha(value) && isNumeric(value) && isUpperCase(value) && isLowerCase(value) && !(isSpace(value));

        }, "Password must be alphanumeric with combination of upper-case, lower-case letters, numbers");
    }

    $.validator.addMethod("isAlpha", function(value, element) {
        return isAlpha(value);
    }, "Please enter alphabets only.");
    $.validator.addMethod("isRestrict", function(value, element) {
        return !isRestrictSpcChar(value);
    }, "Special character is not allow.");
    $.validator.addMethod("isLowerThanThisYear", function(value, element) {
        return !isLowerThanThisYear(value);
    }, "Year must be greater or equal to this year.");
    $.validator.addMethod("IDTypeNotSame", function(value, element) {
        return $('#frmRegister_cli1ICType1').val() != $('#frmRegister_cli1ICType2').val();
    }, "Primary ID Type cannot same with Secondary.");
    $.validator.addMethod("validDate", function(value, element) {
        return value.match(/^(0?[1-9]|[12][0-9]|3[0-1])[/., -](0?[1-9]|1[0-2])[/., -](19|20)?\d{2}$/);
    }, "Please enter a valid date in the format DD-MM-YYYY");
    $.validator.addMethod("lettersAndSpaceOnly", function(value, element) {
        return lettersAndSpaceOnly(value);
    }, "Alphabets and space only.");
    $.validator.addMethod("isAlphaNumericAndSpaceOnly", function(value, element) {
        return isAlphaNumericAndSpaceOnly(value) || value == '';
    }, "Alphanumeric and space only.");
    $.validator.addMethod("chkPIN", function(value, element) {
        return isNumeric(value);
    }, "Pin must be numeric.");

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
    $.validator.addMethod("isMonthYear", function(value, element) {
        return isMonthYear(value);
    }, "Must be in MM/YY");

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
            chkPIN: true,
            isRestrict: true,
            minlength: 6,
            maxlength: 6
        },
        frmRegister_confpin: {
            equalTo: "#frmRegister_pin"
        }
    };

    var rulesCorpInfo = { //#tr_dob, #tr_address, #tr_state, #tr_postcode, #tr_country

        frmRegister_category: {
            required: true
        },
        frmRegister_companyName: {
            required: true,
            isRestrict: true,
            maxlength: 100
        },
        frmRegister_companyRegNo: {
            required: true,
            maxlength: 50,
            isRestrict: true,
            digits: true
        },
        frmRegister_companyRegCountry: {
            required: true,
            isRestrict: true,
            maxlength: 100
        },
        frmRegister_companyName: {
            required: true,
            isRestrict: true,
            maxlength: 100
        },
        frmRegister_dateOfIncorporation: {
            required: true,
            validDate: true,
            CheckDOB: true
        },
        frmRegister_dtiRegNo: {
            required: true,
            maxlength: 50,
            isRestrict: true,
            digits: true
        },
        frmRegister_dtiRegDate: {
            required: true,
            validDate: true,
            CheckDOB: true
        },
        frmRegister_tin: {
            required: true,
            maxlength: 9,
            isRestrict: true
        },
        frmRegisterAcc_businessNationality: {
            required: true
        },
        frmRegister_cli1Add1: {
            required: true,
            isRestrict: true,
            maxlength: 120
        },
        frmRegister_cli1Add2: {
            isRestrict: true,
            maxlength: 120
        },
        frmRegister_foreignAdd: {
            isRestrict: true,
            maxlength: 120
        },
        frmRegister_email: {
            required: true,
            email: true,
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_natureOfBusiness: {
            required: true
        },
        frmRegister_numOfYears: {
            required: true,
            digits: true,
            minlength: 1,
            maxlength: 3
        },
        frmRegister_cli1Telno1: {
            required: true,
            digits: true,
            minlength: 2,
            maxlength: 6
        },
        frmRegister_cli1Telno2: {
            required: true,
            digits: true,
            minlength: 6,
            maxlength: 13
        },
        frmRegister_cli1Mobile1: {
            required: true,
            digits: true,
            minlength: 2,
            maxlength: 6
        },
        frmRegister_cli1Mobile2: {
            required: true,
            digits: true,
            minlength: 6,
            maxlength: 13
        },
        frmRegister_cli1Fax1: {
            required: false,
            digits: true,
            minlength: 2,
            maxlength: 6
        },
        frmRegister_cli1Fax2: {
            required: false,
            digits: true,
            minlength: 6,
            maxlength: 13
        },

        frmRegister_acStock: {
            required: true,
            digits: true,
            minlength: 3,
            maxlength: 13
        },
        frmRegister_tradePerson1: {
            required: true,
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_tradePosition1: {
            required: true,
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_tradePerson2: {
            required: true,
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_tradePosition2: {
            required: true,
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_tradePerson3: {
            required: true,
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_tradePosition3: {
            required: true,
            isRestrict: true,
            maxlength: 50
        },

        frmRegister_accOthBroker: {
            required: true
        },
        frmRegister_accOthBrokerName: {
            required: function(element) {
                return $('input:radio[name=frmRegister_accOthBroker]:checked').val() == "Y";
            },
            isRestrict: true,
            maxlength: 50
        },
        frmRegister_accOthBrokerPerson: {
            required: function(element) {
                return $('input:radio[name=frmRegister_accOthBroker]:checked').val() == "Y";
            },
            isRestrict: true,
            maxlength: 100
        }
    };

    var rules_InvestorProfile = {
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
            digits: true
        },
        frmRegister_accBranch: {
            required: true,
            maxlength: 50,
            isRestrict: true
        },
        frmRegister_invObj: {
            required: true
        },
        frmRegister_invHandleBy: {
            required: true
        },
        frmRegister_regStkBought: {
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
            required: function(element) {
                return $('#frmRegister_refBy').val() == "8";
            },
            isRestrict: true,
            maxlength: 100
        },
        frmRegister_annc: {
            required: true,
            maxlength: 150
        },
        frmRegister_anncByAns: {
            required: function(element) {
                return $('frmRegister_annc').val() == "6";
            },
            isRestrict: true,
            maxlength: 150
        }

    };

    // validation
    $("#frmRegister").validate({
        errorElement: 'span',
        rules: rulesCorpInfo,
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
            //registerCorpAcc();
            chgRegisterLayout(4);
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
                registerCorpAcc();
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
    console.log(mfTotalScore);
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

            $("li:contains('2. Company Info')").removeClass("unfin-step").addClass("fin-step");
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

function resetClicks() {
    $(".clicked").addClass("unclicked").removeClass("clicked");
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

        $('#frmRegister_annualIncome').empty();
        for (var i = 0; i < lookup.annualIncome.length; i++) {
            $('#frmRegister_annualIncome').append('<option value="' + lookup.annualIncome[i].val + '">' + lookup.annualIncome[i].desc + '</option>');
        }
        $('#frmRegister_invExp').empty();
        for (var i = 0; i < lookup.invExp.length; i++) {
            $('#frmRegister_invExp').append('<option value="' + lookup.invExp[i].val + '">' + lookup.invExp[i].desc + '</option>');
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
    var category = "C";
    var type = "M";
    var clientType = getUrlParameter("type") == undefined ? "" : getUrlParameter("type");
    initLookup();
    initCorpAcctRegFormValidation(BMSSetting, category, type);

    $("#frmRegister_dob").datepicker({
        changeMonth: true,
        changeYear: true,
        //maxDate:"+0D",
        yearRange: "-100:+0",
        dateFormat: "dd-mm-yy"
    });

    $("#frmRegisterAcc_hintType").change(function() {
        if ($("#frmRegisterAcc_hintType").val() == "OTR") {
            $("#frmRegisterAcc_hint").parent().parent().show();
        } else {
            $("#frmRegisterAcc_hint").parent().parent().hide().blur();
        }
    });

    $("#frmRegister_bank").change(function() {
        if ($("#frmRegister_bank").val() == "Other") {
            $("#frmRegister_bankName").parent().parent().show();
        } else {
            $("#frmRegister_bankName").parent().parent().hide().blur();
        }
    });

    $("#frmRegister_dateOfIncorporation").datepicker({
        changeMonth: true,
        changeYear: true,
        maxDate: "+0D",
        yearRange: "-100:+0",
        dateFormat: "dd-mm-yy"
    });
    $('div.ui-datepicker').css({
        "font-size": "10px"
    });

    $("#frmRegister_dtiRegDate").datepicker({
        changeMonth: true,
        changeYear: true,
        maxDate: "+0D",
        yearRange: "-100:+0",
        dateFormat: "dd-mm-yy"
    });
    $('div.ui-datepicker').css({
        "font-size": "10px"
    });

    $("#frmRegisterAcc_businessNationality").change(function() {
        if (($("#frmRegisterAcc_businessNationality").val() == "2")) {
            $("#frmRegister_foreignAdd").parent().parent().show();
        } else {
            $("#frmRegister_foreignAdd").parent().parent().hide().blur();
        }
    });
    $("input[name=frmRegister_delivery]").change(function() {
        if ($('input[name=frmRegister_delivery]:checked').val() == "Others") {
            $("#frmRegister_deliveryAdd").parent().parent().show();
        } else {
            $("#frmRegister_deliveryAdd").parent().parent().hide().blur();
        }
    });

    $("#frmRegister_refBy").change(function() {
        if ($("#frmRegister_refBy").val() == "8") {
            $("#frmRegister_refByAns").parent().parent().show();
        } else {
            $("#frmRegister_refByAns").parent().parent().hide().blur();
        }
    });
    $("#frmRegister_annc").change(function() {
        if ($("#frmRegister_annc").val() == "6") {
            $("#frmRegister_anncByAns").parent().parent().show();
        } else {
            $("#frmRegister_anncByAns").parent().parent().hide().blur();
        }
    });

    $("input[name=frmRegister_accOthBroker]").change(function() {
        if ($('input[name=frmRegister_accOthBroker]:checked').val() == "Y") {
            $("#frmRegister_accOthBrokerName").parent().parent().show();
            $("#frmRegister_accOthBrokerPerson").parent().parent().show();
        } else {
            $("#frmRegister_accOthBrokerName").parent().parent().hide().blur();
            $("#frmRegister_accOthBrokerPerson").parent().parent().hide().blur();
        }
    });
});

function registerOpenAccHiddenData(pdfTypeCorporate) {
    $("#frmRvPrnt input:hidden").each(function() {
        $(this).remove();
    });

    $('#frmRvPrnt').append('<input type="hidden" name="pdfTypeCorporate" value="' + pdfTypeCorporate + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="userName" value="' + $("#frmRegisterAcc_userID").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="pin" value="' + $("#frmRegister_pin").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="hintQuestion" value="' + $("#frmRegisterAcc_hintType").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="othersQuestion" value="' + $("#frmRegisterAcc_hint").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="hintAns" value="' + $("#frmRegisterAcc_hintAns").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="companyName" value="' + $("#frmRegister_companyName").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="secRegistrationNo" value="' + $("#frmRegister_companyRegNo").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="secRegCountry" value="' + $("#frmRegister_companyRegCountry").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="secRegistrationDate" value="' + $("#frmRegister_dateOfIncorporation").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="dtiRegistrationNo" value="' + $("#frmRegister_dtiRegNo").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="dtiRegistrationDate" value="' + $("#frmRegister_dtiRegDate").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="email" value="' + $("#frmRegister_email").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="natureOfBusiness" value="' + $("#frmRegisterAcc_natureOfBusiness").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="businessNationality" value="' + $("#frmRegisterAcc_businessNationality").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="foreignAddress" value="' + $("#frmRegister_foreignAdd").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="companyAddress" value="' + $("#frmRegister_cli1Add1").val() + " " + $("#frmRegister_cli1Add2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="yearOperation" value="' + $("#frmRegister_numOfYears").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="corporateOfficers1" value="' + $("#frmRegister_tradePerson1").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="positions1" value="' + $("#frmRegister_tradePosition1").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="corporateOfficers2" value="' + $("#frmRegister_tradePerson2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="positions2" value="' + $("#frmRegister_tradePosition2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="telNo" value="' + $("#frmRegister_cli1Telno1").val() + " - " + $("#frmRegister_cli1Telno2").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="mobileNo" value="' + $("#frmRegister_cli1Mobile1").val() + " - " + $("#frmRegister_cli1Mobile2").val() + '" />');

    //investor profile-

    $('#frmRvPrnt').append('<input type="hidden" name="assets" value="' + $("#frmRegister_assets").val() + '" />');
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
    $('#frmRvPrnt').append('<input type="hidden" name="mailedTo" value="' + $('input:radio[name=frmRegister_delivery]:checked').val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="address" value="' + $("#frmRegister_deliveryAdd").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="referredBy" value="' + $("#frmRegister_refBy").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="announcement" value="' + $("#frmRegister_annc").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="refByAns" value="' + $("#frmRegister_refByAns").val() + '" />');
    $('#frmRvPrnt').append('<input type="hidden" name="anncByAns" value="' + $("#frmRegister_anncByAns").val() + '" />');

    
    document.getElementById("frmRvPrnt").submit();
}