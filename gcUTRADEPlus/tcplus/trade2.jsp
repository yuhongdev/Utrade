<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page 
import="com.n2n.tcplus.misc.RSA, java.net.URL, java.net.URLConnection, java.net.HttpURLConnection, java.net.URLEncoder, java.io.InputStream, com.n2n.passwordservice.PasswordEncryptionService,com.n2n.tcplus.info.N2NConstant,com.n2n.tcplus.debug.N2NLogUtil, com.n2n.tcplus.atp.info.ATPConstant, com.n2n.tcplus.atp.ATPDataFormat, java.util.ArrayList, java.nio.charset.Charset" 
import="java.math.BigInteger"
import="org.json.JSONArray,org.json.JSONException,org.json.JSONObject"
import="java.io.BufferedReader,java.io.DataOutputStream,java.io.InputStreamReader"
import="java.util.Date"
%>


<%
		HttpSession sess = request.getSession(false);

		String sUser = (String) sess.getAttribute("user");
		
       	N2NLogUtil.logInfo("[ATP Trade] QueryString {" + sess.getId() + "} : " + request.getQueryString(), sUser);

        boolean isPost = "POST".equals( request.getMethod() );
        String sPin = null;
        String sAction = request.getParameter("act");       //B - Buy, S - Sell
        String jsonRec = request.getParameter("jsonRec");
		/*
        String sPrice = "";
        String sAction = request.getParameter("act");       //B - Buy, S - Sell
        sAction = sAction == null ? "" : sAction;
        String sOldTktNo = request.getParameter("tktno");
        sOldTktNo = sOldTktNo == null ? "" : sOldTktNo;
        String sOrdSource = request.getParameter("ordsource");
        sOrdSource = sOrdSource == null ? "" : sOrdSource;
        
        String sSkipConfirm = request.getParameter("skipconfirm");
        sSkipConfirm = sSkipConfirm == null ? "off" : sSkipConfirm;
        String sSkipPin = request.getParameter("chkSavePin");
        sSkipPin = sSkipPin == null ? "off" : sSkipPin;

        //shared variables to keep values post from form.
        String sValidity = null;
        String sOrderType = null;
        String sExpiredDate = null;
        String sAccount = null;
        String sClientCode = null;
        String sPin = null;
        String sForce = null;
        String sContra = null;
        String sPayment = null;
        String sAmalgamation = null;
        String sCurrency = null;
        String sShortSell = null;
        String sIDSS = null;
        String sPrivateOrd = null;
        String sQty = null;
        String sUnits = null;

        String sStopLimit = null;
        String sMinQty = null;
        String sDsQty = null;
        String sConfirm = null;
        
        String sTPType = null;
        String sTPDirection = null;
        
        String sFXMCurrency = null;
        
        String sOrdTypeTakeProfit = null;
        String sOrdTypeCutLoss = null;
        String sEnableTakeProfit = null;
        String sEnableCutLoss = null;
        String sTakeProfitPrice = null;
        String sCutLossPrice = null;
        String sCFDOffsetType_0 = null;
        String sCFDOffsetType_1 = null;
        String sTggrPriceCutLoss = null;
        
        String[] tempAccount = (request.getParameter("accountno").toString()).split("-");
        String branchCode = tempAccount[tempAccount.length - 1].trim();
        
        N2NLogUtil.logInfo("[ATP Trade] is post method ---> " + isPost, sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : account no ---> " + request.getParameter("accountno"), sUser);        
        N2NLogUtil.logInfo("[ATP Trade] param : action ---> " + request.getParameter("cbAction"), sUser);   
        N2NLogUtil.logInfo("[ATP Trade] param : act ---> " + request.getParameter("act"), sUser);  
        N2NLogUtil.logInfo("[ATP Trade] param : ex ---> " + request.getParameter("ex"), sUser);        
        N2NLogUtil.logInfo("[ATP Trade]  -------------- ", sUser);        
        N2NLogUtil.logInfo("[ATP Trade] param : price ---> " + request.getParameter("price"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : pin ---> " + request.getParameter("pin"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : pin2 ---> " + request.getParameter("pin2"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : stkcode ---> " + request.getParameter("stkcode"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : lotsize ---> " + request.getParameter("lotsize"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : quantity ---> " + request.getParameter("quantity"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : validity ---> " + request.getParameter("validity"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : otype ---> " + request.getParameter("otype"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : gtd ---> " + request.getParameter("gtd"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : account ---> " + request.getParameter("ac"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : client code ---> " + request.getParameter("cc"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : branch Code ---> " + branchCode, sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : force ---> " + request.getParameter("force"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : contra ---> " + request.getParameter("contra"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : payment ---> " + request.getParameter("payment"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : amalgamation ---> " + request.getParameter("amalgamation"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : settcurr ---> " + request.getParameter("settcurr"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : shortsell ---> " + request.getParameter("shortsell"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : idss ---> " + request.getParameter("idss"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : privateOrd ---> " + request.getParameter("privateOrd"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : stoplimit ---> " + request.getParameter("stoplimit"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : minqty ---> " + request.getParameter("minqty"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : dsqty ---> " + request.getParameter("dsqty"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : confirm ---> " + request.getParameter("confirm"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : tptype ---> " + request.getParameter("tptype"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : tpdirection ---> " + request.getParameter("tpdirection"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : enableTakeProfit ---> " + request.getParameter("chkTakeProfit"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : enableCutLoss ---> " + request.getParameter("chkCutLoss"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : takeprofitprice ---> " + request.getParameter("ordTypeTakeProfit"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : takeprofitprice ---> " + request.getParameter("priceTakeProfit"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : cfdoffsettype_0 ---> " + request.getParameter("cfdostype_0"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : cutlossprice ---> " + request.getParameter("priceCutLoss"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : cfdoffsettype_1 ---> " + request.getParameter("cfdostype_1"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : tggrpriceCutLoss ---> " + request.getParameter("tggrpriceCutLoss"), sUser);
        N2NLogUtil.logInfo("[ATP Trade]  -------------- ", sUser);        
        N2NLogUtil.logInfo("[ATP Trade] param : tktno ---> " + request.getParameter("tktno"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : ordno ---> " + request.getParameter("ordno"), sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : subordno ---> " + request.getParameter("subordno"), sUser);
        N2NLogUtil.logInfo("[ATP Trade]  -------------- ", sUser);        
        N2NLogUtil.logInfo("[ATP Trade] param : checking ---> " + ( "B".equals(sAction) || "S".equals(sAction) ), sUser);  
        N2NLogUtil.logInfo("[ATP Trade] param : ordersource ---> " + sOrdSource, sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : skipconfirm ---> " + sSkipConfirm, sUser);
        N2NLogUtil.logInfo("[ATP Trade] param : skippin ---> " + sSkipPin, sUser);
        N2NLogUtil.logInfo("[ATP Trade]  -------------- ", sUser);  
        */
        
        //Here should be the checking for buy and sell. if fail then just send a custom JSONObject to front end to display msg
        //Too much effort for attempt to integrate with existing msg display
        
        //Last order
        String lastOrder = (String) sess.getAttribute("lastOrder");
        if (lastOrder == null) {
            lastOrder = "";
        }

        //Time
        Date lastOrderDT = (Date) sess.getAttribute("lastOrderDT");
        Date currentOrderDT = new Date();
        long timeDiff = -1;
        //Check time
        if (lastOrderDT != null) {
            timeDiff = currentOrderDT.getTime() - lastOrderDT.getTime();
        }

        //Get config
        String confPreventDuplicateDuration = N2NConstant.getConstant("confPreventDuplicateDuration", "3000");
        long preventDuplicateDuration = 0;
        if (confPreventDuplicateDuration != null && confPreventDuplicateDuration != "0") {
            preventDuplicateDuration = Long.parseLong(confPreventDuplicateDuration);
        }

        //Set config to disable checking if no previous data
        boolean proceedDuplicate = false;
        //Get param to determine allow duplicate order or not
        String allowDup = (String) request.getParameter("allowDup");
        if (allowDup != null) {
            proceedDuplicate = allowDup.equals("1");
        }

        if (preventDuplicateDuration > 0 && lastOrder.equals(jsonRec) && timeDiff < preventDuplicateDuration && !proceedDuplicate) {
            N2NLogUtil.logInfo("[ATP Trade] Submit Order ---> " + "Duplicate Order detected! (by system)", sUser);
            N2NLogUtil.logInfo("[ATP Trade] Action ---> Auto Block", sUser);
            N2NLogUtil.logInfo("[ATP Trade] Previous JSON Order ---> " + lastOrder, sUser);
            N2NLogUtil.logInfo("[ATP Trade] Current JSON Order ---> " + jsonRec, sUser);
            N2NLogUtil.logInfo("[ATP Trade] Previous Order Time ---> " + lastOrderDT.toString(), sUser);
            N2NLogUtil.logInfo("[ATP Trade] Current Order Time ---> " + currentOrderDT.toString(), sUser);
            N2NLogUtil.logInfo("[ATP Trade] Difference Between Two Order Time In Milliseconds ---> " + Long.toString(timeDiff), sUser);
            JSONObject jObj = new JSONObject();

            try {
                jObj.put("duplicate", true);
                jObj.put("promptMsgBox", false);

                out.write(jObj.toString());

            } catch (JSONException ex) {
                throw new JSONException("ATPDataFormat:getTradeError:" + ex.toString());
            }
        } else if (preventDuplicateDuration > 0 && lastOrder.equals(jsonRec) && !proceedDuplicate) {
            N2NLogUtil.logInfo("[ATP Trade] Submit Order ---> " + "Duplicate Order detected! (by user)", sUser);
            N2NLogUtil.logInfo("[ATP Trade] Action ---> Prompt Message", sUser);
            N2NLogUtil.logInfo("[ATP Trade] Previous JSON Order ---> " + lastOrder, sUser);
            N2NLogUtil.logInfo("[ATP Trade] Current JSON Order ---> " + jsonRec, sUser);
            N2NLogUtil.logInfo("[ATP Trade] Previous Order Time ---> " + lastOrderDT.toString(), sUser);
            N2NLogUtil.logInfo("[ATP Trade] Current Order Time ---> " + currentOrderDT.toString(), sUser);
            N2NLogUtil.logInfo("[ATP Trade] Difference Between Two Order Time In Milliseconds ---> " + Long.toString(timeDiff), sUser);
            JSONObject jObj = new JSONObject();

            try {

                jObj.put("duplicate", true);
                jObj.put("promptMsgBox", true);

                out.write(jObj.toString());

            } catch (JSONException ex) {
                throw new JSONException("ATPDataFormat:getTradeError:" + ex.toString());
            }

        } else if ( isPost ) {
            //sPrice = request.getParameter("price");
            StringBuffer urlAdd = new StringBuffer();
            StringBuffer urlbuf = new StringBuffer();

            sPin = request.getParameter("pin2");
            
            if(sPin == null || sPin.equals("")){
            	sPin = request.getParameter("pin3");
            }
            if(sAction == null || sAction.equals("")){
            	sAction = request.getParameter("action");
            }

            // decrypt password
            RSA rsa = (RSA) sess.getAttribute("tcplusKey");
            if (rsa != null) 
            	sPin = rsa.decryptHTML(sPin);

            N2NLogUtil.logInfo("[ATP Trade] tclite key is null ---> " + ( rsa == null ), sUser);
            //N2NLogUtil.logInfo("[ATP Trade] after decrypt sPin ---> " + sPin, sUser);
            N2NLogUtil.logInfo("[ATP Trade]  -------------- ", sUser);
           
            
            if ("BS".equals(sAction) || "B".equals(sAction) || "S".equals(sAction)) {
            	/*
                String sSymbolCode = request.getParameter("stkcode");
                // validation for SymbolCode if last Char is 'D' then filter
                try{
                	if(sSymbolCode!=null){
                		String[] tmpV = sSymbolCode.split("\\.");
                		if(tmpV.length>0){
                			String tmpType = tmpV[tmpV.length-1];
                			if(tmpType.length()==1){
                			}else{
                				String tmpChkType = tmpType.substring(tmpType.length()-1, tmpType.length());
                				String tmpChkTypeValue = tmpType.substring(0, tmpType.length()-1);
                        		if(tmpChkType.toUpperCase().equalsIgnoreCase("D")){
                        			sSymbolCode = tmpV[0]+"."+tmpChkTypeValue;
                        		}else{
                        			sSymbolCode = tmpV[0]+"."+tmpType;
                        		}
                			}
                			
                		}
                	}
                } catch ( Exception e ) {
                	N2NLogUtil.logInfo("[ATP Trade] stock code : Exception ---> " + e , sUser);
                }
                
                String sLotSize = request.getParameter("lotsize") == null ? "1" : request.getParameter("lotsize").equals("0")  ? "1" : request.getParameter("lotsize") ;
                sQty = request.getParameter("quantity");
                
                if(sSymbolCode.indexOf("FXM") == -1){
	                try {
	                	BigInteger qtyNumb = new BigInteger( sQty );
	                	BigInteger lotNumb = new BigInteger( sLotSize );
	                	
	               		sUnits = qtyNumb.multiply( lotNumb ).toString();
	               		
	                } catch (Exception e) {
	                	N2NLogUtil.logError("[ATP Trade] Exception ---> " + e, sUser);
	                	N2NLogUtil.logError("[ATP Trade] set unit to zero *** ", sUser);
	                	
	                	sUnits = "0";
	                }
                }else{
                	sUnits = sQty;
                }
                
                sValidity = request.getParameter("validity");
                sOrderType = request.getParameter("otype");
                sExpiredDate = request.getParameter("gtd");
                if (sValidity == null || !"GTD".equalsIgnoreCase(sValidity)) {
                    sExpiredDate = "";
                }
                sAccount = request.getParameter("ac");
                sClientCode = request.getParameter("cc");

                sForce = request.getParameter("force");
                sContra = request.getParameter("contra");
                sPayment = request.getParameter("payment");
                sAmalgamation = request.getParameter("amalgamation");
                sCurrency = request.getParameter("settcurr");
                sShortSell = request.getParameter("shortsell");
                sIDSS = request.getParameter("idss");
                sPrivateOrd = request.getParameter("privateOrd");
                
                sStopLimit = request.getParameter("stoplimit");
                sMinQty = request.getParameter("minqty");
                sDsQty = request.getParameter("dsqty");
                sConfirm = request.getParameter("confirm");
                
                sTPType = request.getParameter("tptype");
                sTPDirection = request.getParameter("tpdirection");
               
                sFXMCurrency = request.getParameter("fxmCurr");
                
                sOrdTypeTakeProfit = request.getParameter("ordTypeTakeProfit");
                sOrdTypeCutLoss = request.getParameter("ordTypeCutLoss");
                sEnableTakeProfit = request.getParameter("chkTakeProfit");
                sEnableCutLoss = request.getParameter("chkCutLoss");
                sTakeProfitPrice = request.getParameter("priceTakeProfit");
                sCFDOffsetType_0 = request.getParameter("cfdostype_0");
                sCutLossPrice = request.getParameter("priceCutLoss");
                sCFDOffsetType_1 = request.getParameter("cfdostype_1");
                sTggrPriceCutLoss = request.getParameter("tggrpriceCutLoss");

                if ( sDsQty != null ) {
                	if ( !sDsQty.trim().equals( "" ) ) {
                		if ( sLotSize != null ) {
                			if ( !sLotSize.trim().equals( "" ) ) {
                        		sDsQty = Integer.toString( ( Integer.parseInt( sDsQty ) * Integer.parseInt( sLotSize ) ) );
                    		}
                		}
                	}
                }
                
                if ( sMinQty != null ) {
                	if ( !sMinQty.trim().equals( "" ) ) {
                		if ( sLotSize != null ) {
                			if ( !sLotSize.trim().equals( "" ) ) {
                				sMinQty = Integer.toString( Integer.parseInt( sMinQty ) * Integer.parseInt( sLotSize ) );
                			}
                		}
                	}
                }
                */
                
                sPin = PasswordEncryptionService.getInstance().encrypt( sPin, true );
                
                /*
                N2NLogUtil.logInfo("[ATP Trade] final result : sAccount ---> " + sAccount, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sClientCode ---> " + sClientCode, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sPin ---> " + sPin, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sConfirm ---> " + sConfirm, sUser);
                
                N2NLogUtil.logInfo("[ATP Trade] final result : sCurrency ---> " + sCurrency, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sPrice ---> " + sPrice, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sQty ---> " + sQty, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sLotSize ---> " + sLotSize, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sUnits ---> " + sUnits, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sOrderType ---> " + sOrderType, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sValidity ---> " + sValidity, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sExpiredDate ---> " + sExpiredDate, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sForce ---> " + sForce, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sContra ---> " + sContra, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sPayment ---> " + sPayment, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sAmalgamation ---> " + sAmalgamation, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sShortSell ---> " + sShortSell, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sIDSS ---> " + sIDSS, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sPrivateOrd ---> " + sPrivateOrd, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sStopLimit ---> " + sStopLimit, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sMinQty ---> " + sMinQty, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sDsQty ---> " + sDsQty, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sFXMCurrency ---> " + sFXMCurrency, sUser);     
                */
    	        N2NLogUtil.logInfo("[ATP Trade] final result : jsonRec ---> " + jsonRec, sUser);
                urlAdd.append("http://127.0.0.1:" + N2NConstant.getConstant("iMSLServerPort") + request.getContextPath() + "/tcplus/atp/trade?");
                urlbuf.append("s=" + sess.getId());
                /*
                urlbuf.append("&act=" + sAction);

                if (sOldTktNo != null && sOldTktNo.length() > 0) {
                    urlbuf.append("&tn=" + sOldTktNo);
                }
                urlbuf.append("&sc=" + URLEncoder.encode(sSymbolCode, "UTF-8"));
                urlbuf.append("&q=" + sUnits);

                if (sPrice != null && sPrice.length() > 0) {
                    urlbuf.append("&p=" + sPrice);
                }
                
                if (sValidity != null && sValidity.length() > 0) {
                    urlbuf.append("&v=" + sValidity);
                }
                
                if (sOrderType != null && sOrderType.length() > 0) {
                    urlbuf.append("&o=" + sOrderType);
                }
                
                if (sStopLimit != null && sStopLimit.length() > 0) {
                    urlbuf.append("&l=" + sStopLimit);
                }
                
                if (sMinQty != null && sMinQty.length() > 0) {
                    urlbuf.append("&mq=" + sMinQty);
                }
                
                if (sDsQty != null && sDsQty.length() > 0) {
                    urlbuf.append("&ds=" + sDsQty);
                }

                if (sExpiredDate != null && sExpiredDate.length() > 0) {
                    urlbuf.append("&d=" + sExpiredDate);
                }

                if (sCurrency != null && sCurrency.length() > 0) {
                    urlbuf.append("&cr=" + sCurrency);
                }

                if (sPayment != null && sPayment.length() > 0) {
                    urlbuf.append("&pm=" + sPayment);
                }

                if (sForce != null) {
                    urlbuf.append("&f=Y");
                }

                if (sContra != null) {
                    urlbuf.append("&c=Y");
                }

                if (sAmalgamation != null) {
                    urlbuf.append("&a=Y");
                }

                if (sShortSell != null && sAction.equals("S")) {
                    urlbuf.append("&ss=Y");
                }
                
                // IDSS on for either buy or sell
                if (sIDSS != null && sIDSS.equals("on") && (sAction.equals("S") || sAction.equals("B"))) {
                    urlbuf.append("&idss=Y");
                }
                
                if (sPrivateOrd != null) {
                    urlbuf.append("&po=1");
                }

                if (sConfirm != null && sConfirm.length() > 0) {
                    urlbuf.append("&cf=" + sConfirm);
                }
                
                if (sTPType != null && sTPType.length() > 0) {
                    urlbuf.append("&tptype=" + sTPType);
                }
                
                if (sTPDirection != null && sTPDirection.length() > 0) {
                    urlbuf.append("&tpdirection=" + sTPDirection);
                }
                
                if (sFXMCurrency != null && sFXMCurrency.length() > 0) {
                    urlbuf.append("&fxmCurr=" + sFXMCurrency);
                }
                
                if (sEnableTakeProfit != null && sEnableTakeProfit.length() > 0) {
                	if(sEnableTakeProfit.equalsIgnoreCase("on")){
                		urlbuf.append("&tpot=" + sOrdTypeTakeProfit);
                        urlbuf.append("&tpprc=" + sTakeProfitPrice);
                        urlbuf.append("&cfdost_0=" + sCFDOffsetType_0);
                	}
                }
                
                if (sEnableCutLoss != null && sEnableCutLoss.length() > 0) {
                	if(sEnableCutLoss.equalsIgnoreCase("on")){
                		urlbuf.append("&clot=" + sOrdTypeCutLoss);
                        urlbuf.append("&clprc=" + sCutLossPrice);
                        urlbuf.append("&cfdost_1=" + sCFDOffsetType_1);
                        urlbuf.append("&cltp=" + sTggrPriceCutLoss);
                	}
                }

                urlbuf.append("&acc=" + sAccount);
                urlbuf.append("&cc=" + sClientCode);
                urlbuf.append("&branchCode=" + branchCode);
                urlbuf.append("&ordsource=" + sOrdSource);
                */
                
                urlbuf.append("&pin=" + sPin);
                if(jsonRec != null){
                    urlbuf.append("&m=" + URLEncoder.encode(jsonRec, "UTF-8"));
                }
                
            } else {
            	/*
                String sTktNo = request.getParameter("tktno");
                sTktNo = sTktNo == null ? "" : sTktNo;
                String sOrdNo = request.getParameter("ordno");
                String sSubOrdNo = request.getParameter("subordno");
                
                String sLotSize = request.getParameter("lotsize") == null ? "1" : request.getParameter("lotsize").equals("0")  ? "1" : request.getParameter("lotsize") ;
                sQty = request.getParameter("quantity");
                
                try {
                	BigInteger qtyNumb = new BigInteger( sQty );
                	BigInteger lotNumb = new BigInteger( sLotSize );
                	
               		sUnits = qtyNumb.multiply( lotNumb ).toString();
               		
                } catch (Exception e) {
                	N2NLogUtil.logError("[ATP Trade] Exception ---> " + e, sUser);
                	N2NLogUtil.logError("[ATP Trade] set unit to zero *** ", sUser);
                	
                	sUnits = "0";
                }
                
                String sUnMtQty = request.getParameter("unmtqty");// shuwen 29/05/2013
                String sMtQty = request.getParameter("mtqty");// shuwen 29/05/2013
                sAccount = request.getParameter("ac"); // shuwen 28/05/2013
                sClientCode = request.getParameter("cc"); // shuwen 27/05/2013
                sValidity = request.getParameter("validity");
                sOrderType = request.getParameter("otype");
                sExpiredDate = request.getParameter("gtd");
                sStopLimit = request.getParameter("stoplimit");
                sMinQty = request.getParameter("minqty");
                sDsQty = request.getParameter("dsqty");
                sConfirm = request.getParameter("confirm");
                sPrivateOrd = request.getParameter("privateOrd");
                
                if (sOrderType == null || "GTD".equalsIgnoreCase(sOrderType)) {
                    sExpiredDate = "";
                }
                
                if ( sDsQty != null ) {
                	if ( !sDsQty.trim().equals( "" ) ) {
                		if ( sLotSize != null ) {
                			if ( !sLotSize.trim().equals( "" ) ) {
                				sDsQty = Integer.toString( ( Integer.parseInt( sDsQty ) * Integer.parseInt( sLotSize ) ) );
                			}
                		}
                	}
                }
                
                if ( sMinQty != null ) {
                	if ( !sMinQty.trim().equals( "" ) ) {
                		if ( sLotSize != null ) {
                			if ( !sLotSize.trim().equals( "" ) ) {
                				sMinQty = Integer.toString( Integer.parseInt( sMinQty ) * Integer.parseInt( sLotSize ) );
                			}
                		}
                	}
                }
                */
                
                sPin = PasswordEncryptionService.getInstance().encrypt(sPin, true);
                
                /*
                N2NLogUtil.logInfo("[ATP Trade] final result : sPin ---> " + sPin, sUser);
                
                N2NLogUtil.logInfo("[ATP Trade] final result : sTktNo ---> " + sTktNo, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sOrdNo ---> " + sOrdNo, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sSubOrdNo ---> " + sSubOrdNo, sUser);
                
                N2NLogUtil.logInfo("[ATP Trade] final result : sPrice ---> " + sPrice, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sUnits ---> " + sUnits, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sValidity ---> " + sValidity, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sOrderType ---> " + sOrderType, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sStopLimit ---> " + sStopLimit, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sMinQty ---> " + sMinQty, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sDsQty ---> " + sDsQty, sUser);
                N2NLogUtil.logInfo("[ATP Trade] final result : sExpiredDate ---> " + sExpiredDate, sUser);
                */
                
    	        N2NLogUtil.logInfo("[ATP Trade] final result : jsonRec ---> " + jsonRec, sUser);
                urlAdd.append("http://127.0.0.1:" + N2NConstant.getConstant("iMSLServerPort") + request.getContextPath());

                // add checking for cancel or revise order
                if ("C".equals(sAction)) {
                	urlAdd.append("/tcplus/atp/cancel?");               
                } else if ("R".equals(sAction)) {
                	urlAdd.append("/tcplus/atp/revise?");                 
                }
                urlbuf.append("s=" + sess.getId());
                
                /*
                urlbuf.append("&tn=" + sTktNo);
                urlbuf.append("&on=" + sOrdNo);
                urlbuf.append("&son=" + sSubOrdNo);
                urlbuf.append("&acc=" + sAccount); //shuwen 28/05/2013
                
                String sPrevAction = request.getParameter("prevaction");//shuwen 28/05/2013
                String sSymbolCode = request.getParameter("stkcode");//shuwen 28/05/2013
                String sExchange = request.getParameter("ex");//shuwen 28/05/2013
                String sBranchCode = request.getParameter("branchcode");//shuwen 28/05/2013
                String sBrokerCode = request.getParameter("brokercode"); // shuwen 23/08/2013

                // validation for SymbolCode if last Char is 'D' then filter //shuwen 28/05/2013 entire try catch
                try{
                	if(sSymbolCode!=null){
                		String[] tmpV = sSymbolCode.split("\\.");
                		if(tmpV.length>0){
                			String tmpType = tmpV[tmpV.length-1];
                			if(tmpType.length()==1){
                			}else{
                				String tmpChkType = tmpType.substring(tmpType.length()-1, tmpType.length());
                				String tmpChkTypeValue = tmpType.substring(0, tmpType.length()-1);
                        		if(tmpChkType.toUpperCase().equalsIgnoreCase("D")){
                        			sSymbolCode = tmpV[0]+"."+tmpChkTypeValue;
                        		}else{
                        			sSymbolCode = tmpV[0]+"."+tmpType;
                        		}
                			}
                			
                		}
                	}
                } catch ( Exception e ) {
                	N2NLogUtil.logInfo("[ATP Order Revise/Cancel] stock code : Exception ---> " + e , sUser);
                }
                
                if (sPrice != null && sPrice.length() > 0) {
                    urlbuf.append("&p=" + sPrice);
                }
                if (sUnits != null && sUnits.length() > 0) {
                    urlbuf.append("&q=" + sUnits);
                }
                if (sValidity != null && sValidity.length() > 0) {
                    urlbuf.append("&v=" + sValidity);
                }
                if (sOrderType != null && sOrderType.length() > 0) {
                    urlbuf.append("&o=" + sOrderType);
                }
                if (sStopLimit != null && sStopLimit.length() > 0) {
                    urlbuf.append("&l=" + sStopLimit);
                }
                if (sMinQty != null && sMinQty.length() > 0) {
                    urlbuf.append("&mq=" + sMinQty);
                }
                if (sDsQty != null && sDsQty.length() > 0) {
                    urlbuf.append("&ds=" + sDsQty);
                }
                if (sExpiredDate != null && sExpiredDate.length() > 0) {
                    urlbuf.append("&d=" + sExpiredDate);
                }
                if (sClientCode != null && sClientCode.length() > 0) { //shuwen 28/05/2013
                    urlbuf.append("&cc=" + sClientCode);
                }
                if (sSymbolCode != null && sSymbolCode.length() > 0) { //shuwen 28/05/2013
                	 urlbuf.append("&sc=" + URLEncoder.encode(sSymbolCode, "UTF-8"));
                }
                if (branchCode != null && branchCode.length() > 0) { //shuwen 28/05/2013
                    urlbuf.append("&branchCode=" + sBranchCode);
                }
                if (sPrevAction != null && sPrevAction.length() > 0) { //shuwen 28/05/2013
                    urlbuf.append("&prevAct=" + sPrevAction);
                }
                if (sExchange != null && sExchange.length() > 0) { //shuwen 28/05/2013
                    urlbuf.append("&ex=" + sExchange);
                }
                if (sUnMtQty != null && sUnMtQty.length() > 0) { //shuwen 29/05/2013
                    urlbuf.append("&unmtqty=" + sUnMtQty);
                }
                if (sMtQty != null && sMtQty.length() > 0) { //shuwen 29/05/2013
                    urlbuf.append("&mtqty=" + sMtQty);
                }
                if (sBrokerCode != null && sBrokerCode.length() > 0) { //shuwen 29/05/2013
                    urlbuf.append("&brokerCode=" + sBrokerCode);
                }
                if (sConfirm != null && sConfirm.length() > 0) {
                    urlbuf.append("&cf=" + sConfirm);
                }
                if (sPrivateOrd != null) {
                    urlbuf.append("&po=1");
                }
                */
                
                if(jsonRec != null){
                    urlbuf.append("&m=" + URLEncoder.encode(jsonRec, "UTF-8"));
                }
                urlbuf.append("&pin=" + sPin);
            }

            //String url = urlbuf.toString();
            //N2NLogUtil.logInfo("[ATP Trade] url ---> " + url, sUser);
            
            String url = urlAdd.toString();
            String urlParameters = urlbuf.toString();
            N2NLogUtil.logInfo("[ATP Trade] url ---> " + url, sUser);
            N2NLogUtil.logInfo("[ATP Trade] parameters ---> " + urlParameters, sUser);

            HttpURLConnection con = null;
            //InputStream in = null;
            BufferedReader in = null;
            
            try {
                URL urlfeed = new URL(url);
            	con = (HttpURLConnection) urlfeed.openConnection();
            	con.setConnectTimeout(50000);
                con.setUseCaches(false);
                con.setDoOutput(true);
                con.setDoInput(true);
                con.setRequestMethod("POST");
                
                /*
                in = con.getInputStream();
                
                int iVal;
                StringBuffer sb = new StringBuffer();
                while((iVal = in.read()) != -1) {
                    sb.append((char) iVal);
                }
                out.write(sb.toString());
                */
                
                DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        		wr.writeBytes(urlParameters);
        		wr.flush();
        		wr.close();

        		int responseCode = con.getResponseCode();
        		
        		in = new BufferedReader(
        		        new InputStreamReader(con.getInputStream()));
        		String inputLine;
        		StringBuffer resp = new StringBuffer();

        		while ((inputLine = in.readLine()) != null) {
        			resp.append(inputLine);
        		}
                
        		//print result
        		out.write(resp.toString());
                        
                        //Save last order
                        Date savedDate = new Date();
                        sess.setAttribute("lastOrder", jsonRec);
                        sess.setAttribute("lastOrderDT", savedDate);

                        //Write to log
                        N2NLogUtil.logInfo("[ATP Trade] Saved JSON order in session ---> " + jsonRec, sUser);
                        N2NLogUtil.logInfo("[ATP Trade] Saved Order Datetime in session ---> " + savedDate, sUser);
                
            } catch (Exception e) {
                N2NLogUtil.logError("[ATP Trade] send url : Exception ---> \n" + e + " \n", sUser);
                JSONObject jObj;

                try {
                    jObj = new JSONObject();

                    jObj.put("s", false);
                    jObj.put("msg", "Failed to process your request. Please try again.");
                    jObj.put("t", "trd");
                } catch(JSONException ex) {
                    throw new JSONException("ATPDataFormat:getTradeError:" + ex.toString());
                }
                
                String errMsg = jObj.toString();
                out.write(errMsg);
            } finally {
            	if (in != null)
                	in.close();

            	if (con != null)
                	con.disconnect();
            }
        }
%>