//market mover column mapping, share by watchlist too

var cmap_mmCode 	= "01";
var cmap_mmSymbol 	= "02";
var cmap_mmClose 	= "03";
var cmap_mmOpen 	= "04";
var cmap_mmOpenInt 	= "05";
var cmap_mmLacp 	= "06";
var cmap_mmHigh 	= "07";
var cmap_mmLow 		= "08";
var cmap_mmBidQty 	= "09";
var cmap_mmBid 		= "10";
var cmap_mmAsk 		= "11";
var cmap_mmAskQty 	= "12";
var cmap_mmLast 	= "13";
var cmap_mmBS 		= "14";
var cmap_mmChg 		= "15";
var cmap_mmChgPer	= "16";
var cmap_mmLVol 	= "17";
var cmap_mmVol		= "18";
var cmap_mmTrades 	= "19";
var cmap_mmSts 		= "20";
var cmap_mmNews 	= "21";
var cmap_mmTp 		= "22";
var cmap_mmTime 	= "23";
var cmap_mmTop 		= "24";
var cmap_mmRD 		= "25";
var cmap_mmExchg 	= "26";
var cmap_mmMargin 	= "27";
var cmap_mmMarginPrc = "28";
var cmap_mmMarginPc = "29";
var cmap_mmTValue 	= "30";
var cmap_mmLotSize	="31";
var cmap_mmCurrency	="32";
//msgtype06
var cmap_mm52WHi_06		="33";
var cmap_mm52WLo_06		="34";
var cmap_mmIndexGrp_06	="35";
var cmap_mmPrevStkNo_06	="36";
var cmap_mmPrevStkName_06	="37";
var cmap_mmTickSize_06	="38";
var cmap_mmTheoPrice_06	="39";
var cmap_mmDynamicLow_06	="40";
var cmap_mmDynamicHigh_06	="41";
var cmap_mmLongName = "42";
var cmap_mmBuyRate = "br";
//OSK
var cmap_mmExpiryDate = "43";
var cmap_mmExeRatio = "44";
var cmap_mmGearingX = "45";
var cmap_mmPremiumPerc = "46";
var cmap_mmImpVolatility = "47";
var cmap_mmUnderlying = "48";
var cmap_mmOptionType = "49";
var cmap_mmOptionStyle = "50";
var cmap_mmExePrice = "51";
//msgtype06 - OSK
var cmap_mmIssuer_06 = "52";
var cmap_mmUnderCurrency_06 = "53";
var cmap_mmUnderName_06 = "54";
//msgtype06 - PSE
var cmap_mmFloatLevel_06 = "55";
var cmap_mmFreeFloat_06 = "56";
var cmap_mmFloatShare_06 = "57";
var cmap_mmFlunctuation_06 = "58";
var cmap_mmForeignOwnerLimit_06 = "59";
//msgtype05 - PSE
var cmap_mmfieldShrIssue_05 = "60";

var cmap_mmRemark	="61";

//Days to Expiry (OSK)
var cmap_mmExpiryDays = "62";
var cmap_mmDelta = "63";  //delta (OSK)
var cmap_mmEfectiveGearingX = "64";  //effective gearing (OSK)

//dividend info
var cmap_mmfieldEPS = "65";		
var cmap_mmfieldPERatio = "66";		
var cmap_mmfield12MDiv = "67";		
var cmap_mmfieldDivPay = "68";	
var cmap_mmfieldDivEx = "69";
var cmap_mmfieldDivYld = "70";
var cmap_mmfieldDivCcy = "71";
var cmap_mmfieldIntDiv = "72"; 
var cmap_mmfieldIntExDate = "73";
var cmap_mmfieldSpDiv = "74";
var cmap_mmfieldSpDivExDate = "75";
var cmap_mmfieldFinDiv = "76";
var cmap_mmfieldFinDivExDate = "77";

//FOREX
var cmap_mmfieldFXSpread = "78";

//CIMBSG Circuit Breaker Enhancements
var cmap_fieldRefPrice_06 = "79";
var cmap_fieldEndTime_06 = "80";

//RSS indicator
var cmap_mmRSSIndicator = "81"; //for PSE only

//settlement price(for MY)
var cmap_mmSettPrice = "82";

//CFD columns
var cmap_mmCFDTradable_06 = "83";
var cmap_mmCFDSS_06 = "84";
var cmap_mmCFDMarginPerc_06 = "85";
var cmap_mmCFDMarginLS_06 = "86";

//Structured Warrants Ref.Price and Limit Price
var cmap_mmRefPrice = "87";
var cmap_mmCeilingPrice = "88";
var cmap_mmFloorPrice = "89";

var cmap_mmIDSSTolVol_06 = "90";
var cmap_mmIDSSTolVal_06 = "91";

var cmap_osAccNo = '01';
var cmap_osOrdNo = '02';
var cmap_osStkCode = '03';
var cmap_osStkName = '04';
var cmap_osOrdTime = '05';
var cmap_osOrdDate = '06';
var cmap_osAction = '07';
var cmap_osType = '08';
var cmap_osValidity = '09';
var cmap_osStsCode = '10';
var cmap_osStatus = '11';
var cmap_osOrdQty = '12';
var cmap_osOrdPrc = '13';
var cmap_osMtQty = '14';
var cmap_osMtPrc = '15';
var cmap_osMchVal = '16';
var cmap_osUnMchQty = '17';
var cmap_osCncQty = '18';
var cmap_osExpDate = '19';
var cmap_osExpQty = '20';
var cmap_osCurrency = '21';
var cmap_osExCode = '22';
var cmap_osLast = '23';
var cmap_osMinQty = '24';
var cmap_osDsQty = '25';
var cmap_osStopLimit = '26';
var cmap_osRemark = '27';
var cmap_osAccountName = '28';
var cmap_osSettOpt = '29';
var cmap_osOrderValue = '30';
var cmap_osLotSize	="31";
var cmap_osLACP	="32";
var cmap_osTradeCurrency ="33";
var cmap_osTradeCound ="34";
var cmap_osLastUpdateTime = "35";
var cmap_osBranchCode ="36";
var cmap_osBrokerCode = "37";
var cmap_osTPType = "38";
var cmap_osTPDirection = "39";
var cmap_osQtyTodayMatch = "40";
var cmap_osSubType = '41';
var cmap_osAmt = '42';
var cmap_osTrailType = '43';

var cmap_pfName 	= "01";
var cmap_pfQtyOH 	= "02";
var cmap_pfQtyAvl 	= "03";
var cmap_pfQtyQue 	= "04";
var cmap_pfCode 	= "05";
var cmap_pfAvgBPrc 	= "06";
var cmap_pfLast	 	= "07";
var cmap_pfMktVal 	= "08";
var cmap_pfAccNo 	= "09";
var cmap_pfYrHigh 	= "10";
var cmap_pfYrLow 	= "11";
var cmap_pfDayHigh 	= "12";
var cmap_pfDayLow 	= "13";
var cmap_pfRef 		= "14";
var cmap_pfVol 		= "15";
var cmap_pfLtSize 	= "16";
var cmap_pfChg 		= "17";
var cmap_pfChgPc 	= "18";
var cmap_pfUnGL 	= "19";
var cmap_pfPL 		= "20";
var cmap_pfCurrency = "21";
var cmap_pfExchg 	= "22";
var cmap_pfQtySold 	= "23";
var cmap_pfQtySusp 	= "24";
var cmap_pfBid 		= "25";
var cmap_pfAsk 		= "26";
var cmap_pfavgsp	= "27";
var cmap_pfTradeValue = "28";
var cmap_pfSettOpt	= "29";
var cmap_pfSoDVol	= "30";
var cmap_pfSoDAvgPrc	= "31";
var cmap_pfActualVol	= "32";
var cmap_pfAvgPrc	= "33";
var cmap_pfAvgPrcTod	= "34";
var cmap_pfClosePL	= "35";
var cmap_pfOpenPL	= "36";
var cmap_pfTotalPL	= "37";
var cmap_pfIMPerc	= "38";
var cmap_pfIM	= "39";
var cmap_pfFXR	= "40";


var cmap_pfRealCode = '01';
var cmap_pfRealName = '02';
var cmap_pfRealAggBuyPrc = '03';
var cmap_pfRealAggSellPrc = '04';
var cmap_pfRealTtlQtyFromHolding = '05';
var cmap_pfRealTtlQtyShort = '06';
var cmap_pfRealTtlQtySold = '07';
var cmap_pfRealTtlBrokerage = '08';
var cmap_pfRealGLAmt = '09';
var cmap_pfRealGLPc = '10';
var cmap_pfRealAccNo = '11';
var cmap_pfRealCurrency = '12';
var cmap_pfRealExchg = '13';
var cmap_pfRealLotSize = '14';
var cmap_pfRealAvgSPrice = '15';
var cmap_pfRealAvgBPrice = '16';
var cmap_pfRealSettOpt	= '17';

//Market Depth
var cmap_mdNo = "01";
var cmap_mdBSplit = "02";
var cmap_mdBCum = "03";
var cmap_mdBidQty = "04";
var cmap_mdBidPrice = "05";
var cmap_mdAskPrice = "06";
var cmap_mdAskQty = "07";
var cmap_mdSCum = "08";
var cmap_mdSSplit = "09";

//Mutual Fund
var cmap_mfFundCode = "01";
var cmap_mfFundName = "02";
var cmap_mfFundType = "03";
var cmap_mfCurrency = "04";
var cmap_mfRiskRate = "05";
var cmap_mfBenchMark = "06";
var cmap_mfLaunchDate = "07";
var cmap_mfMinInvest = "08";
var cmap_mfMinAddSub = "09";
var cmap_mfMinRedQty = "10";
var cmap_mfMinHoldDays = "11";
var cmap_mfEarlyRedFee = "12";
var cmap_mfManageFee = "13";
var cmap_mfAssetClass = "14";
var cmap_mfInvestAllo = "15";
var cmap_mfSetDateRed = "16";
var cmap_mfFundIssuName = "17";
var cmap_mfNAVPS = "18";
var cmap_mfDate = "19";
var cmap_mfFundSize = "20";

// probably future code
var cmap_mfYTD = "21";
var cmap_mf1Y = "22";
var cmap_mf3Y = "23";
var cmap_mf5Y = "24";
var cmap_mfIssuer = "25";

//Fund Portpolio
var cmap_fpFundCode = "01";
var cmap_fpFundName = "02";
var cmap_fpQTYQ = "03";
var cmap_fpQtyHand = "04";
var cmap_fpUncommittedShares = "05";
var cmap_fpMarketValue = "06";
var cmap_fpGainLoss = "07";
var cmap_fpGainLossP= "08";
var cmap_fpCurrency = "09";
var cmap_fpAmount = "10";
var cmap_fpLast = "11";
var cmap_fpAvgBPrc = "12";
var cmap_fpAvgSP = "13";
 
 