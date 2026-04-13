    var rules_InvestorProfile = {

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
        }

    };

    // validation


    $("#frmInvestorProfile").validate({
        errorElement: 'span',
        rules: rules_InvestorProfile,
        //change function in submitting

        submitHandler: function(form) {
            var s = confirm("Thank you for filling in the questionnaire. A page reload is needed to take effect. Continue?");
            if (s) {
                calculate();
                updRiskScore();
            }
            else {

            }
        }
    });


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


// on page load
$(document).ready(function() {
    chkSess();

});