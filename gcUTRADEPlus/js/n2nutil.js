/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function debug(msg) {
	return;
    if (DEBUG) {
        if(Ext.isIE){
        // Do browser specific code here
        } else {
            if (console) {
                if (Ext.isObject(msg) && console.dir) {
                    console.dir(msg);
                } else if (console.log) {
                    console.log(msg);
                }
            }
        }
    }
}

function getBidDiff(price, excode) {
    var bidDiff = 0;
    if(excode != null) {

    } else {
        if (price > 1)
            bidDiff = 0.010;
        else
            bidDiff = 0.005;
    }
    return bidDiff;
}

function truncate(_value)
{
  if (_value<0) return Math.ceil(_value);
  else return Math.floor(_value);
}

function toVol(vol) {
    var multiplier;
    if (isNaN(vol)) {
        return '-';
    } else {
        if (vol > 999999) {
            multiplier = vol / 1000000;
            return multiplier + 'M';
        } else if (vol > 999) {
            multiplier = vol / 1000;
            return multiplier + 'k';
        } else {
            return vol;
        }
    }
}

function trim(str)
{
    if(!str || typeof str != 'string')
        return null;

    return str.replace(/^[\s]+/,'').replace(/[\s]+$/,'').replace(/[\s]{2,}/,' ');
}

function multiply(num1, num2, def)
{
    var val = isNaN(def) ? 0.0 : parseFloat(def);
    try {
        val = parseFloat(num1) * parseFloat(num2);
    } catch (e) {
        debug(e);
        val = 0;
    }
    return val;
}

function contains(array, obj) {
  var i = array.length;
  while (i--) {
    if (array[i] == obj) {
      return true;
    }
  }
  return false;
}

//function containsWatchListFunnyChar(obj){ //v1.3.33.7
//	if (obj.indexOf('&') != -1) {
//		return true;
//	}else if (obj.indexOf('|') != -1) {
//		return true;
//	}else if (obj.indexOf('~') != -1) {
//		return true;
//	}else if (obj.indexOf('.') != -1) {
//		return true;
//	}else if (obj.indexOf('?') != -1) {
//		return true;
//	}else if (obj.indexOf('+') != -1) {
//		return true;
//	}else if (obj.indexOf('=') != -1) {
//		return true;
//	}else if (obj.indexOf('<') != -1) {
//		return true;
//	}else if (obj.indexOf('"') != -1) {
//		return true;	
//	}else if (obj.indexOf('%') != -1) {
//		return true;	
//	}
//	
//
//	return false;
//}

function containsWatchListFunnyChar(obj) { //v1.3.33.7
    var letterNumber = /^[0-9a-zA-Z \-_]+$/;
//	var letterNumber = /^[\w '-]+$/;
    if (obj.match(letterNumber)) {
        return false;
    }
    else
        return true;
}

function getStkExCode(stk) {
    var ex = '';
    stk = stk == null ? '' : stk;
    if (stk.indexOf('.') != -1) {
        ex = stk.substring(stk.lastIndexOf('.') + 1, stk.length);
    }
    return ex;
}

function getStkBoard(sc) {
    var board = '';
    if (sc.indexOf('.') != -1) {
        if (sc.indexOf(':') != -1) {
            board = sc.substring(sc.indexOf(':')+1, sc.indexOf('.'));
        }
    }
    return board;
}

function isMO(val) {
    if (val == -999001 || val == 999001) {
        return true;
    }
    return false;
}

function isMP(val) {
    if (val == -999002 || val == 999002) {
        return true;
    }
    return false;
}

function formatOrdPadPrc(val, stkCode) {
    if (val == null || val == -999002 || val == 999002 || isNaN(val)) {
        return '';
    }

    if (priceDec !== '') {
        return Ext.util.Format.number(val, jsutil.getExtNumFormat(priceDec));
    } else if (stkCode) {
        var stkObj = Storage.returnRecord(stkCode);
        if (stkObj) {
            var tempPrice = stkObj[fieldLacp] || stkObj[fieldBuy] || stkObj[fieldSell];
            if (tempPrice) {
                var decNum = jsutil.getDecNum(tempPrice);
                if (decNum > 0) {
                    return Ext.util.Format.number(val, jsutil.getExtNumFormat(decNum));
                }
            }

        }
    }

    return parseFloat(val);
}

function setCursorPosition (obj, pos) {
    if(obj != null) {
        if(obj.createTextRange) {
            var range = obj.createTextRange();
            range.move('character', pos);
            range.select();
        } else {
            if(obj.setSelectionRange) {
                obj.setSelectionRange(pos, pos);
            }
        }
    }
}

function calculator() {
	this.EXCHANGE_MY_KLSE = 1;
	this.EXCHANGE_SG_SGX = 2;
	this.EXCHANGE_SA_SAE = 3;
	this.EXCHANGE_VN_HN = 4;
	this.EXCHANGE_VN_HO = 5;
	this.EXCHANGE_VN_HK = 6;
	this.EXCHANGE_UNKNOWN = -1;
	this.g_Exchange = this.EXCHANGE_MY_KLSE;
					
	this.gBRateCalcMethod = 2;
	
	this.CURR_CODE_MYR = "MYR";
	this.CURR_CODE_SGD = "SGD";
	this.CURR_CODE_HKD = "HKD";
	this.CURR_CODE_USD = "USD";
	this.CURR_CODE_AUD = "AUD";	//Australian Dollar
	this.CURR_CODE_SAR = "SAR";	//saudi riyal
	this.CURR_CODE_JPY = "JPY";	//Japan	
	this.g_sCurrCode = this.CURR_CODE_MYR;
	
	this.BRM_LEVEL_RATE = 1;		//different rate for different amount range
	this.BRM_TOTAL_RATE = 2;		//same rate for total amount
	
	this.cFEED_STKCLASS_BOND = 'B';
	this.cFEED_STKCLASS_CONVLOAN = 'L';
	this.cFEED_STKCLASS_INCONVLOAN = 'N';
	this.cFEED_STKCLASS_OTHER = 'O';
	
	this.dStampLvl = 1000;
	this.dClearChg = 0.04;
	
	this.g_dPreferredBrokerageRate = -1;
	this.g_dBrokerage = -1;
	this.g_dMinBrokerage = -1;
	this.g_dMinBrokerageI = 28;
	this.g_dBrokerhouseRate = 0.15;
	this.g_dDiscountRate = 0;
	
	this.adBrokeragePrice_SI_SGD_1 = 50000;
	this.adBrokeragePrice_SI_SGD_2 = 100000;
	
	this.adBrokeragePrice_SI_HKD_1 = 225000;
	this.adBrokeragePrice_SI_HKD_2 = 450000;
		
	this.adBrokeragePrice_SI_USD_1 = 30000;
	this.adBrokeragePrice_SI_USD_2 = 60000;	
	
	this.adBrokeragePrice_SI_AUD_1 = 50000;
	this.adBrokeragePrice_SI_AUD_2 = 100000;	
	
	this.adBrokeragePriceLevel_KL = [100000, 400000];
	this.adBrokerageRate_KL = [0.0070, 0.0060, 0.0050];
	
	this.adBrokeragePriceLevel_HN = [100000];
	this.adBrokerageRate_HN = [1, 1];
	
	this.adBrokeragePriceLevel_HO = [100000];
	this.adBrokerageRate_HO = [1, 1];
	
	this.adBrokeragePriceLevel_SI_SGD = [49999.999999, 100000];
	this.adBrokeragePriceLevel_SI_HKD = [224999.999999, 450000];
	this.adBrokeragePriceLevel_SI_USD = [29999.999999, 60000];
	this.adBrokeragePriceLevel_SI_AUD = [49999.999999, 100000];
	this.adBrokerageRate_SI = [0.00275, 0.0022, 0.0018];
	
	this.adBrokeragePriceLevel_SA = [];
	this.adBrokerageRate_SA = [0.0012];
	
	this.adCusBrokeragePriceLevel = null;
	this.adCusBrokerageRate = null;
	
	this.doRound = function(vdIn, viScale) {
		vdIn = parseFloat(vdIn).toFixed(viScale);
	
		vdIn = parseFloat(vdIn);
		//BigDecimal bdIn;
		//try {
			//bdIn = new BigDecimal(Double.toString(vdIn));
		//} catch (NumberFormatException e) {
			//bdIn = new BigDecimal(vdIn);
		//}
		//bdIn = bdIn.setScale(viScale, BigDecimal.ROUND_HALF_UP);
		//return bdIn.doubleValue();
		
		return vdIn;
	};
	
	this.CalcVAT = function(vdTotTrxFeeExVAT) {				
		var dVAT=0;
		if (this.g_Exchange == this.EXCHANGE_SG_SGX) {
			dVAT = this.doRound(vdTotTrxFeeExVAT * 0.07, 2);
			//return doRound(vdTotAmt * 0.05, 2);
		}
		return dVAT;
	};
	
	this.CalcClearingFee = function(vlQty, vdUnitPrice) {				
		// FIXED_RND: to 2 decimal places
		var dClearing;
		var dMaxClearing;
		var dRate;

		if (this.g_Exchange == this.EXCHANGE_SA_SAE || this.g_Exchange == this.EXCHANGE_VN_HN || this.g_Exchange == this.EXCHANGE_VN_HO) {
			return 0.0;
		}

		vlQty = Math.abs(vlQty);

		if (this.g_Exchange == this.EXCHANGE_MY_KLSE) {
			dRate = 0.03;	//change from 0.04 --> 0.04 effective from 2008-01-01
		}
		else //if (g_Exchange == EXCHANGE_SG_SGX)
		{
			dRate = 0.04;
		}

		
//		dClearing = doRound(vlQty * vdUnitPrice * 0.0004, 2);
		// we need to round twice to solve rounding problem
		dClearing = this.doRound(Math.ceil(this.doRound((vlQty * vdUnitPrice * dRate), 4))/100, 2);
							
		if (this.g_Exchange == this.EXCHANGE_SG_SGX) {
			if (this.g_sCurrCode == this.CURR_CODE_SGD) {
				dMaxClearing = 600;
			} else if (this.g_sCurrCode == this.CURR_CODE_HKD) {
				dMaxClearing = 3095;
			} else if (this.g_sCurrCode == this.CURR_CODE_USD) {
				dMaxClearing = 393;
			} else if (this.g_sCurrCode == this.CURR_CODE_AUD) {
				dMaxClearing = 507;
			} else {	//default to SGX
				dMaxClearing = 600;
			}

		} else {
			//g_Exchange == EXCHANGE_MY_KLSE
			dMaxClearing = 1000;	//change from 500 --> 1000 effective from 2008-01-01
		}

		//System.out.println("dClearing: " + dClearing + "  dMaxClearing: " + dMaxClearing);
		if (dClearing > dMaxClearing)
			dClearing = dMaxClearing;
		else if (dClearing < 0.01)
			dClearing = 0.01;
			
		if (this.g_Exchange == this.EXCHANGE_MY_KLSE) {
			var gstValue = this.doRound(dClearing * (parseFloat(gstPerc) / 100), 2);
			dClearing = dClearing + gstValue; //GST calculation for KLSE
		}
		
		return dClearing;
	};
	
	this.CalcDiscAmt = function(vdTotTrxFeeExDisc){				
		var dDiscAmt = 0;
		
		if (this.g_Exchange == this.EXCHANGE_SA_SAE && this.g_dDiscountRate != 0) {
			dDiscAmt = this.doRound(((vdTotTrxFeeExDisc - (vdTotTrxFeeExDisc * g_dBrokerhouseRate) ) * g_dDiscountRate), 2);
		}
		
		return dDiscAmt;
	};
	
	this.CalcStampDuty = function(vlQty, vdUnitPrice, vcLoanStk) {				
		var dStampDuty;

		//no stamp duty for Saudi
		if (this.g_Exchange == this.EXCHANGE_SA_SAE || this.g_Exchange == this.EXCHANGE_VN_HN || this.g_Exchange == this.EXCHANGE_VN_HO) {
			return 0.0;
		}

		if (this.g_Exchange == this.EXCHANGE_SG_SGX) {
			dStampDuty = this.doRound(Math.ceil(this.doRound((vlQty * vdUnitPrice * 0.0075), 4))/100, 2);
			if (dStampDuty < 0.01) {
				dStampDuty = 0.01;
			}
			return dStampDuty;
		}

		// g_Exchange == EXCHANGE_MY_KLSE
		vlQty = Math.abs(vlQty);
		dStampDuty = Math.ceil(this.doRound((vlQty * vdUnitPrice), 4) / 1000);
		if (dStampDuty > 200.0)
			dStampDuty = 200;
		return dStampDuty;
	};
	
	this.CalcBrokerageByTotal = function(vlQty, vdUnitPrice, vdCliRate, vcLoanStk, vdRate, adCustomBrokeragePriceLevel, adCustomBrokerageRate) {				
		var dCostOfShares = this.doRound(vlQty * vdUnitPrice, 2);
		var dRate, dPriceLevel = 0.0;
		var iCount;
		var adBrokeragePriceLevel = null;
		var adBrokerageRate = null;

		if (this.g_Exchange == this.EXCHANGE_MY_KLSE || this.g_Exchange == this.EXCHANGE_UNKNOWN) {
			adBrokeragePriceLevel = this.adBrokeragePriceLevel_KL;
			adBrokerageRate = this.adBrokerageRate_KL;
		} else if (this.g_Exchange == this.EXCHANGE_VN_HN) {
			adBrokeragePriceLevel = this.adBrokeragePriceLevel_HN;
			adBrokerageRate = this.adBrokerageRate_HN;
		} else if (this.g_Exchange == this.EXCHANGE_VN_HO) {
			adBrokeragePriceLevel = this.adBrokeragePriceLevel_HO;
			adBrokerageRate = this.adBrokerageRate_HO;
		} else if (this.g_Exchange == this.EXCHANGE_SG_SGX) {
			if (this.g_sCurrCode == this.CURR_CODE_SGD) {
				adBrokeragePriceLevel = this.adBrokeragePriceLevel_SI_SGD;
			} else if (this.g_sCurrCode == this.CURR_CODE_HKD) {
				adBrokeragePriceLevel = this.adBrokeragePriceLevel_SI_HKD;
			} else if (this.g_sCurrCode == this.CURR_CODE_USD) {
				adBrokeragePriceLevel = this.adBrokeragePriceLevel_SI_USD;
			} else if (this.g_sCurrCode == this.CURR_CODE_AUD) {
				adBrokeragePriceLevel = this.adBrokeragePriceLevel_SI_AUD;
			} else {	//default to SGX
				adBrokeragePriceLevel = this.adBrokeragePriceLevel_SI_SGD;
			}

			adBrokerageRate = this.adBrokerageRate_SI;
		} else if (this.g_Exchange == this.EXCHANGE_SA_SAE) {
			adBrokeragePriceLevel = this.adBrokeragePriceLevel_SA;
			adBrokerageRate = this.adBrokerageRate_SA;
		}
		
		if(adCustomBrokeragePriceLevel != null && adCustomBrokerageRate!= null){
			adBrokeragePriceLevel = adCustomBrokeragePriceLevel;
			adBrokerageRate = adCustomBrokerageRate;
		}

		if (vdRate != -1) {
			dRate = vdRate;
		} else {
			dRate = adBrokerageRate[adBrokerageRate.length-1];
			for (iCount = 0; iCount < adBrokeragePriceLevel.length; ++iCount) {
				dPriceLevel += adBrokeragePriceLevel[iCount];
				if (dCostOfShares < dPriceLevel) {
					dRate = adBrokerageRate[iCount];
					break;
				}
			}
		}

		// use the client rate if it is lower
		if (dRate > vdCliRate) {
			dRate = vdCliRate;
		}

		return (dCostOfShares * 1000 * dRate / 1000);
	};
	
	this.CalcBrokerageByLevel = function(vlQty, vdUnitPrice, vdCliRate, vcLoanStk) {				
		//normal rate calculation
		var dCostOfShares = this.doRound(vlQty * vdUnitPrice, 2);
		var dBrokerage = 0.0;
		var dRate;
		var dPriceLevel;
		var iCount;
		var adBrokeragePriceLevel = null;
		var adBrokerageRate = null;

		if (this.g_Exchange == this.EXCHANGE_MY_KLSE) {
			adBrokeragePriceLevel = this.adBrokeragePriceLevel_KL;
			adBrokerageRate = this.adBrokerageRate_KL;
		} else if (this.g_Exchange == this.EXCHANGE_VN_HN) {
			adBrokeragePriceLevel = this.adBrokeragePriceLevel_HN;
			adBrokerageRate = this.adBrokerageRate_HN;
		} else if (this.g_Exchange == this.EXCHANGE_VN_HO) {
			adBrokeragePriceLevel = this.adBrokeragePriceLevel_HO;
			adBrokerageRate = this.adBrokerageRate_HO;
		} else if (this.g_Exchange == this.EXCHANGE_SG_SGX) {
			if (this.g_sCurrCode == this.CURR_CODE_SGD) {
				adBrokeragePriceLevel = this.adBrokeragePriceLevel_SI_SGD;
			} else if (this.g_sCurrCode == this.CURR_CODE_HKD) {
				adBrokeragePriceLevel = this.adBrokeragePriceLevel_SI_HKD;
			} else if (this.g_sCurrCode == this.CURR_CODE_USD) {
				adBrokeragePriceLevel = this.adBrokeragePriceLevel_SI_USD;
			} else if (this.g_sCurrCode == this.CURR_CODE_AUD) {
				adBrokeragePriceLevel = this.adBrokeragePriceLevel_SI_AUD;
			} else {	//default to SGX
				adBrokeragePriceLevel = this.adBrokeragePriceLevel_SI_SGD;
			}

			adBrokerageRate = this.adBrokerageRate_SI;
		} else if (this.g_Exchange == this.EXCHANGE_SA_SAE) {
			adBrokeragePriceLevel = this.adBrokeragePriceLevel_SA;
			adBrokerageRate = this.adBrokerageRate_SA;
		}


		for (iCount = 0; iCount < adBrokeragePriceLevel.length; ++iCount) {
			dRate = adBrokerageRate[iCount];
			// use the client rate if it is lower
			if (dRate > vdCliRate) {
				dRate = vdCliRate;
			}

			dPriceLevel = adBrokeragePriceLevel[iCount];
			// if the cost of shares is lower than the current price level,
			// use that corresponding rate and stop looking for lower rates at higher
			// price levels
			if (dCostOfShares < dPriceLevel) {
				dBrokerage += (dCostOfShares * 1000 * dRate / 1000.0);
				dCostOfShares = 0.0;
				break;
			}

			// otherwise, continue calculating based on the current price level
			dBrokerage += (dPriceLevel * 1000 * dRate / 1000.0);
			dCostOfShares -= dPriceLevel;
		}

		// for cost of shares > 2M
		if (dCostOfShares > 0.0) {
			dRate = adBrokerageRate[iCount];
			//use the client rate if it is lower
			if (dRate > vdCliRate) {
				dRate = vdCliRate;
			}
			dBrokerage += (dCostOfShares * 1000 * dRate / 1000.0);
		}	
		return dBrokerage;
	};
	
	this.CalcBrokerageForSI = function(vlQty, vdUnitPrice, vdCliRate, vcLoanStk, vdRate) {				
		var dCostOfShares = this.doRound(vlQty * vdUnitPrice, 2);
		var dBrokerage = 0.0;
		var dRate = 0;	
		
		if (vdRate != -1) {
			dRate = vdRate;
		} else {
			if (this.g_sCurrCode == this.CURR_CODE_SGD) {
				if (dCostOfShares < this.adBrokeragePrice_SI_SGD_1) {
					dRate = this.adBrokerageRate_SI[0];
				} else if (dCostOfShares >= this.adBrokeragePrice_SI_SGD_1 && dCostOfShares <= this.adBrokeragePrice_SI_SGD_2) {
					dRate = this.adBrokerageRate_SI[1];
				} else if (dCostOfShares > this.adBrokeragePrice_SI_SGD_2) {
					dRate = this.adBrokerageRate_SI[2];
				}
			} else if (this.g_sCurrCode == this.CURR_CODE_HKD) {
				if (dCostOfShares < this.adBrokeragePrice_SI_HKD_1) {
					dRate = this.adBrokerageRate_SI[0];
				} else if (dCostOfShares >= this.adBrokeragePrice_SI_HKD_1 && dCostOfShares <= this.adBrokeragePrice_SI_HKD_2) {
					dRate = this.adBrokerageRate_SI[1];
				} else if (dCostOfShares > this.adBrokeragePrice_SI_HKD_2) {
					dRate = this.adBrokerageRate_SI[2];
				}			
			} else if (this.g_sCurrCode == this.CURR_CODE_USD) {
				if (dCostOfShares < this.adBrokeragePrice_SI_USD_1) {
					dRate = this.adBrokerageRate_SI[0];
				} else if (dCostOfShares >= this.adBrokeragePrice_SI_USD_1 && dCostOfShares <= this.adBrokeragePrice_SI_USD_2) {
					dRate = this.adBrokerageRate_SI[1];
				} else if (dCostOfShares > this.adBrokeragePrice_SI_USD_2) {
					dRate = this.adBrokerageRate_SI[2];
				}			
			} else if (this.g_sCurrCode == this.CURR_CODE_AUD) {
				if (dCostOfShares < this.adBrokeragePrice_SI_AUD_1) {
					dRate = this.adBrokerageRate_SI[0];
				} else if (dCostOfShares >= this.adBrokeragePrice_SI_AUD_1 && dCostOfShares <= this.adBrokeragePrice_SI_AUD_2) {
					dRate = this.adBrokerageRate_SI[1];
				} else if (dCostOfShares > this.adBrokeragePrice_SI_AUD_2) {
					dRate = this.adBrokerageRate_SI[2];
				}			
			}			
		}

		// use the client rate if it is lower
		if (dRate > vdCliRate) {
			dRate = vdCliRate;
		}
		dBrokerage = dCostOfShares * dRate;	
		return dBrokerage;
	};
	
	this.CalcBrokerage = function(vlQty, vdUnitPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage) {				
		var dMinBrokerage;
		var dBrokerage;
		
		vlQty = Math.abs(vlQty);
		//m_bIsMinBrokerage = false;

		//added by BanYee
		if(this.g_dPreferredBrokerageRate != -1){
			vdRate = this.g_dPreferredBrokerageRate;
		}
							
		if (this.g_dBrokerage != -1) {
			dBrokerage = this.g_dBrokerage;
			if(this.g_dBrokerage == -2){
				dBrokerage = this.doRound((vlQty * vdUnitPrice) * 0.000388,2) ;
				if(dBrokerage < 8.88){
					dBrokerage = 8.88;
				}
			}
		}
		else {
			if (this.g_Exchange == this.EXCHANGE_SG_SGX) {						
//				dBrokerage = doRound(vlQty * vdUnitPrice * 0.00275, 2);
				dBrokerage = this.doRound(this.CalcBrokerageForSI(vlQty,vdUnitPrice,vdCliRate,vcLoanStk,vdRate),2);

				if (vdMinBrokerage != -1) {
					dMinBrokerage = vdMinBrokerage;
				} else {
					//dMinBrokerage = 22;	
					//dMinBrokerage = 25;	

					if (this.g_sCurrCode == this.CURR_CODE_SGD) {
						dMinBrokerage = 25;
					} else if (this.g_sCurrCode == this.CURR_CODE_HKD) {
						dMinBrokerage = 115;
					} else if (this.g_sCurrCode == this.CURR_CODE_USD) {
						dMinBrokerage = 15;
					} else if (this.g_sCurrCode == this.CURR_CODE_AUD) {
						dMinBrokerage = 20;
					} else {
						dMinBrokerage = 25; //follow setting for SGD
					}
				}

			} else {						
				switch (this.gBRateCalcMethod) {
					case this.BRM_LEVEL_RATE:		//different rate for different amount range
						dBrokerage = this.CalcBrokerageByLevel(vlQty, vdUnitPrice, vdCliRate, vcLoanStk);
						break;
					case this.BRM_TOTAL_RATE:		//same rate for total amount
							dBrokerage = this.CalcBrokerageByTotal(vlQty, vdUnitPrice, vdCliRate, vcLoanStk, vdRate, this.adCusBrokeragePriceLevel, this.adCusBrokerageRate);
						break;
					default:
						dBrokerage = 0.0;
				}
				if (this.g_Exchange == this.EXCHANGE_SA_SAE) {
					if (vdMinBrokerage != -1) {
						dMinBrokerage = vdMinBrokerage;
					} else {
						dMinBrokerage = 12.0;
					}
				} else {							
					// minimum brokerage of RM2 for loan stock and RM5-->RM12-->RM40 for normal stock
					if (vdMinBrokerage != -1) {
						dMinBrokerage = vdMinBrokerage;
					} else {
						if (this.g_dMinBrokerage != -1) {
							dMinBrokerage = this.g_dMinBrokerage;

						} else if (vcLoanStk == this.cFEED_STKCLASS_OTHER) {
							dMinBrokerage = this.g_dMinBrokerageI;

						//min 2 for cFEED_STKCLASS_BOND, cFEED_STKCLASS_INCONVLOAN and cFEED_STKCLASS_CONVLOAN
						} else {
							dMinBrokerage = 2.0;
						}
					}
				}
			}

			if (dBrokerage < dMinBrokerage) {
				dBrokerage = dMinBrokerage;
				//m_bIsMinBrokerage = true;
			}
		}
		
		if (this.g_Exchange == this.EXCHANGE_MY_KLSE) {
			var gstValue = this.doRound(dBrokerage * (parseFloat(gstPerc) / 100), 2);
			dBrokerage = dBrokerage + gstValue; //GST calculation for KLSE
		}

		//System.out.println("dBrokerage @ CalcBrokerage : " + dBrokerage);
		return this.doRound(dBrokerage, 2);
	};

	this.CalcCommission = function(vlQty, vdUnitPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage, vbBuyIn) {				
		var dComm = 0;
//		System.out.println("g_Exchange: " + g_Exchange);
		if (this.g_Exchange == this.EXCHANGE_SA_SAE) {
			dComm = this.CalcBrokerage(vlQty, vdUnitPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage);
		} else {
			dComm = this.CalcBrokerage(vlQty, vdUnitPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage)
							+ this.CalcStampDuty(vlQty, vdUnitPrice, vcLoanStk);			
		}

		//System.out.println("CalcBrokerage: " + CalcBrokerage(vlQty, vdUnitPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage));
		//System.out.println("CalcStampDuty: " + CalcStampDuty(vlQty, vdUnitPrice, vcLoanStk));
		if (this.g_Exchange == this.EXCHANGE_SA_SAE) {
			//System.out.println(": " + CalcDiscAmt(dComm));
			dComm -= this.CalcDiscAmt(dComm);				
		} else {
		//if (g_Exchange != EXCHANGE_SA_SAE) {
			if (!vbBuyIn) {
				dComm += this.CalcClearingFee(vlQty, vdUnitPrice);
				//System.out.println("CalcClearingFee: " + CalcClearingFee(vlQty, vdUnitPrice));
			}
			//if (g_Exchange == EXCHANGE_SG_SGX && !m_bIsMinBrokerage) {
			if (this.g_Exchange == this.EXCHANGE_SG_SGX) {
				//System.out.println("CalcVAT: " + CalcVAT(dComm));
				dComm += this.CalcVAT(dComm);				
			}
		}
		return dComm;
	};

	this.CalcBreakevenShort = function(vlQty, vdUnitPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage) {				
		var iNumIteration = 10;

		//vlQty must be < 0 and vdUnitPrice must be > 0
		if (vlQty >= 0 || vdUnitPrice <= 0.0) {
			return 0;
		}

		vlQty = -vlQty;
		var dCalReturn = (vlQty * vdUnitPrice) - this.CalcCommission(vlQty, vdUnitPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage, false);
		//get the start point for estimating a breakeven price
		var dBreakEvenPrice = (dCalReturn - this.CalcCommission(vlQty, dCalReturn/vlQty, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage, false)) / vlQty;
		//reverse calculation to get the cost-of-shares based on estimated breakeven price
		var dCostOfShares = (dBreakEvenPrice * vlQty) + this.CalcCommission(vlQty, dBreakEvenPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage, false);

		//iterate while the recalculated cost of share differ too much from the actual cost
		while ((Math.abs(dCostOfShares - dCalReturn) > 0.0001) && (--iNumIteration > 0)) {
			//get the next point for estimating a new breakeven price
			dBreakEvenPrice = (dCalReturn - this.CalcCommission(vlQty, dBreakEvenPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage, false)) / vlQty;
			//resverse calculation to get the calculated-return based on estimated breakeven price
			dCostOfShares = (dBreakEvenPrice * vlQty) + this.CalcCommission(vlQty, dBreakEvenPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage, false);
		}
		return Math.floor(dBreakEvenPrice*1000)/1000;
	};

	this.CalcBreakeven = function(vlQty, vdUnitPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage) {				
		var iNumIteration = 10;

		if (vlQty <= 0 || vdUnitPrice <= 0.0) {
			if (vlQty < 0 && vdUnitPrice > 0.0) {	//calc Break even for short sell
				return this.CalcBreakevenShort(vlQty, vdUnitPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage);
			}
			return 0;
		}

		var dCostOfShares = (vlQty * vdUnitPrice) + this.CalcCommission(vlQty, vdUnitPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage, false);
		//get the start point for estimating a breakeven price
							
		var dBreakEvenPrice = (dCostOfShares + this.CalcCommission(vlQty, dCostOfShares/vlQty, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage, false)) / vlQty;
		//reverse calculation to get the cost-of-shares based on estimated breakeven price
		var dCalReturn = (dBreakEvenPrice * vlQty) - this.CalcCommission(vlQty, dBreakEvenPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage, false);

		//iterate while the recalculated cost of share differ too much from the actual cost
		while ((Math.abs(dCostOfShares - dCalReturn) > 0.0001) && (--iNumIteration > 0)) {
			//get the next point for estimating a new breakeven price
			dBreakEvenPrice = (dCostOfShares + this.CalcCommission(vlQty, dBreakEvenPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage, false)) / vlQty;
			//reverse calculation to get the cost-of-share based on estimated breakeven price
			dCalReturn = (dBreakEvenPrice * vlQty) - this.CalcCommission(vlQty, dBreakEvenPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage, false);
		}
		return Math.ceil(dBreakEvenPrice*1000)/1000;
	};
	
	this.CalcGainLossAmt = function(vlQty, vdBuyPrice, vdSellPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage) {
		if (vlQty <= 0 || vdSellPrice <= 0.0) {
			if (vlQty < 0 && vdBuyPrice > 0.0) {	//calc Gain Loss Amt for short sell
				//we use the sell-price (current market-price) as buy-price
				// use the buy-price (== short-sell sell-price) as the sell price
				// make qty to +ve
				var dTmp;
				dTmp = vdBuyPrice;
				vdBuyPrice = vdSellPrice;
				vdSellPrice = dTmp;
				vlQty = -vlQty;
//				return CalcGainLossAmtShort(vlQty, vdBuyPrice, vdSellPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage);
			} else {
				return 0;
			}
		}

		var dSellCommission = this.CalcCommission(vlQty, vdSellPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage, false);
		if (vdBuyPrice <= 0) {
			//return NetGainLoss based on sell only (assume bonus share ?)
			return this.doRound((vdSellPrice * vlQty) - dSellCommission, 2);
		}

		var dBuyCommission = this.CalcCommission(vlQty, vdBuyPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage, false);
		//return NetGainLoss
		return this.doRound(((vdSellPrice - vdBuyPrice) * vlQty) - dBuyCommission - dSellCommission, 2);
	};
	
	this.CalcSellPrice = function(vdBuyPrice, vdAmt, vlQty, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage) {
		var dCost;
		var dCommision; 
		var dNetSell;
		var dSellPrice;
		//var dBrokerage;
		//var dStamp;
		var dDiff;

		dCommision = this.CalcCommission(vlQty, vdBuyPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage, false);
							
		dCost = vdBuyPrice * vlQty + dCommision;
		dNetSell = dCost + vdAmt;
		dSellPrice = dNetSell / (vlQty * (1 - (vdCliRate / 100 + this.dClearChg / 100 + 1 / this.dStampLvl)));
							
		while ((dDiff = this.CalcGainLossAmt(vlQty, vdBuyPrice, dSellPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage)) < vdAmt) {
			dSellPrice = dSellPrice + 0.001;
		}
		
		if (dDiff != vdAmt) {
			// To prevent over estimation from the start, so we go backward to find first non-overestimation figure
			while ((dDiff = this.CalcGainLossAmt(vlQty, vdBuyPrice, dSellPrice, vdCliRate, vcLoanStk, vdRate, vdMinBrokerage)) > vdAmt) {
				dSellPrice = dSellPrice - 0.001;
			}
			// Current sell price is the first found under-estimation so the previous figure is the best over-estimation
			dSellPrice = dSellPrice + 0.001;
		}
		return dSellPrice;
	};
	
	this.setMinimumBrokerage = function(qty, ordsrc, type) {
		if (type == "L") {
			this.g_dMinBrokerage = -1;
		} else {
			if (qty < 100) { 
				this.g_dMinBrokerage = 12;
			} else {
				if (ordsrc == "I") { 
					this.g_dMinBrokerage = 28;
				} else { 
					this.g_dMinBrokerage = 40;
				}
			}
		}
	};
	
	this.calculateBreakeven = function(price, qty, brate, ordsrc, type) {
		this.setMinimumBrokerage(qty,ordsrc,type);
		
		brate = parseFloat(brate);
		
		var breakeven = 0;
		if (brate == 0.7) {
			breakeven = this.CalcBreakeven(qty, price, 0.01, type, -1, -1);
		} else {
			breakeven = this.CalcBreakeven(qty, price, 0.01, type, brate/100, -1);
		}
		
		return parseFloat(breakeven).toFixed(3);
	};
	
	this.calculateProfitloss = function(price, qty, sprice, brate, ordsrc, type) {
		this.setMinimumBrokerage(qty,ordsrc,type);
		
		brate = parseFloat(brate);
		
		var profitloss = 0;
		if (brate == 0.7) {
			profitloss = this.CalcGainLossAmt(qty, price, sprice, 0.01, type, -1, -1);
		} else {
			profitloss = this.CalcGainLossAmt(qty, price, sprice, 0.01, type, brate/100, -1);
		}
		
		return parseFloat(profitloss).toFixed(3);
	};
	
	this.calculateSellPrice = function(price, qty, target, brate, ordsrc, type) {
		this.setMinimumBrokerage(qty,ordsrc,type);
		
		brate = parseFloat(brate);
		
		var sellprice = 0;
		if (brate == 0.7) {
			sellprice = this.CalcSellPrice(price, target, qty, 0.01, type, -1, -1);
		} else {
			sellprice = this.CalcSellPrice(price, target, qty, 0.01, type, brate/100, -1);
		}
		
		return parseFloat(sellprice).toFixed(3);
	};
}