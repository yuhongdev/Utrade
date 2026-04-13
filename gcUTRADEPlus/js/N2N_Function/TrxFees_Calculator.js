// =====Formula======
//Note
//Tag <> - need to input by front end application
//Tag {} � calculated value
//Tag /**/ - remark information. It need to perform additional process. Currently, it contain 3 key word � Min, Max, RoundUp
//
//The format of [TrxFeeFormula]
//[TrxFeeFormula]=ExchangeCode,SubFormulaName,SubFormula
//
//
//[TrxFeeFormula]=KL,Amount,<OrdQty>*<OrdPrice>
//[TrxFeeFormula]=KL,Commission,{Amount}*0.007 /*Min=12*/
//[TrxFeeFormula]=KL,StampDuty,{Amount}/1000 /*RoundUp=1,Min=1,Max=200*/
//[TrxFeeFormula]=KL,ClearingFee,{Amount}*0.0004 /*Max=500*/
//[TrxFeeFormula]=KL,BuyTrxFee,{Commission}+{StampDuty}+{ClearingFee}
//[TrxFeeFormula]=KL,SellTrxFee,{BuyTrxFee}
//
//[TrxFeeFormula]=PH,Amount,<OrdQty>*<OrdPrice>
//[TrxFeeFormula]=PH,Commission,{Amount}*0.0025 /*Min=20*/
//[TrxFeeFormula]=PH,PSEFee,{Amount}*0.000056
//[TrxFeeFormula]=PH,SCCPFee,{Amount}*0.0001
//[TrxFeeFormula]=PH,SECFee,{Amount}*0.00005
//[TrxFeeFormula]=PH,VAT,{Amount}*0.12
//[TrxFeeFormula]=PH,BuyTrxFee,{Commission}+{PSEFee}+{SCCPFee}+{SECFee}+{VAT}
//[TrxFeeFormula]=PH,SalesTax,{Amount}*0.005
//[TrxFeeFormula]=PH,SellTrxFee,{BuyTrxFee}+{SalesTax}
//
//[TrxFeeFormula]=SG,Amount,<OrdQty>*<OrdPrice>*<ExchRate>
//[TrxFeeFormula]=SG,Commission,{Amount}*0.0025 /*Min=18*/
//[TrxFeeFormula]=SG,SGXFee,{Amount}*0.000075
//[TrxFeeFormula]=SG,ClearingFee,{Amount}*0.0004 /*Max=600*/
//[TrxFeeFormula]=SG,TotCommFee,{Commission}+{ClearingFee}+{SGXFee}
//[TrxFeeFormula]=SG,GST,{TotCommFee}*0.07
//[TrxFeeFormula]=SG,BuyTrxFee,{Commission}+{SGXFee}+{ClearingFee}+{GST}
//[TrxFeeFormula]=SG,SellTrxFee,{BuyTrxFee}

// =====Formula======

var trxFeesCalculator = (function() {

    function calcTrxFee(arTrxFeeFormulaList, act) {
        var trxFee = 0;

        for (var i = 0; i < arTrxFeeFormulaList.length; i++) {
            if (arTrxFeeFormulaList[i].formula.indexOf('{') != -1) {
                var formula = arTrxFeeFormulaList[i].formula.replace(/[{}]/g, '');

                var formulaVariables = formula.split(/[-+*\/]/g);
                if (formulaVariables != null) {
                    for (var j = 0; j < formulaVariables.length; j++) {
                        for (var k = 0; k < arTrxFeeFormulaList.length; k++) {
                            if (formulaVariables[j] == arTrxFeeFormulaList[k].formulaName) {
                                formula = formula.replace(formulaVariables[j], arTrxFeeFormulaList[k].value);
                                break;
                            }
                        }

                    }

                    if (N2N_CONFIG.fDebug) {
                        console.log('formula: ' + formula);
                    }

                    var value = eval(formula);

                    if (arTrxFeeFormulaList[i].roundUp != null) {
                        value = Math.ceil(value);
                    }

                    if (arTrxFeeFormulaList[i].min != null) {
                        if (value < arTrxFeeFormulaList[i].min) {
                            value = arTrxFeeFormulaList[i].min;
                        }
                    }

                    if (arTrxFeeFormulaList[i].max != null) {
                        if (value > arTrxFeeFormulaList[i].max) {
                            value = arTrxFeeFormulaList[i].max;
                        }
                    }

                    arTrxFeeFormulaList[i].value = value;
                    if (N2N_CONFIG.fDebug) {
                        console.log(arTrxFeeFormulaList[i].formulaName + ', formula: ' + formula + ', value: ' + value + ', min: ' + arTrxFeeFormulaList[i].min + ', max: ' + arTrxFeeFormulaList[i].max + ', roundUp: ' + arTrxFeeFormulaList[i].roundUp);
                    }
                }
            }
        }

        for (var i = 0; i < arTrxFeeFormulaList.length; i++) {
            if (act == modeOrdBuy) {
                if (arTrxFeeFormulaList[i].formulaName == 'BuyTrxFee') {
                    trxFee = arTrxFeeFormulaList[i].value;
                }
            }
            else if (act == modeOrdSell) {
                if (arTrxFeeFormulaList[i].formulaName == 'SellTrxFee') {
                    trxFee = arTrxFeeFormulaList[i].value;
                }
            }
        }

        return trxFee;
    }

    return {
        calcTrxFee: calcTrxFee
    };

}());