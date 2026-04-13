<%@ page import = "java.sql.*, com.n2n.util.N2NConst" %>
<jsp:useBean id="clibean" class="com.n2n.bean.N2NMFCliInfoBean" scope="page"/>
<jsp:useBean id="oN2NSession" class="com.n2n.DB.N2NSession" scope="session">
	<% oN2NSession.init(application);%>
</jsp:useBean>
<%
	try {		
		boolean bAccessSF, bProceed;
		String sSrchAct = "", sSrchStr = "", sCliCode = "", sLoginID = "", sLoginIDDB = "";
		String sEncrypt = "", sExchange = "",sBHCode = "";
		int nSrchAct = 0, nRow = 0, nFrom = 0, nTo = 0;
		String sBHCliCode = "", sBHBranch = "", sCliName = "", sICNo = "", sCDSNo = "", sData = "", sCategory = "";
		String sFrom = "", sTo = "";
		ResultSet rs = null;
	    
	    sSrchAct = request.getParameter("act");
		sSrchStr = request.getParameter("sstr");
		sCliCode = request.getParameter("CliCode");
		sLoginID = request.getParameter("LoginID");
		sEncrypt = request.getParameter("Encrypt");
		sExchange = request.getParameter("exchg");
		sFrom = request.getParameter("from");
		sTo = request.getParameter("to");
		
		sSrchAct = sSrchAct != null ? sSrchAct : "";
		sSrchStr = sSrchStr != null ? sSrchStr : "";
		sCliCode = sCliCode != null ? sCliCode : "";
		sLoginID = sLoginID != null ? sLoginID : "";
		sEncrypt = sEncrypt != null ? sEncrypt : "";
		sExchange = sExchange != null ? sExchange : "KL";
		sFrom = sFrom != null ? sFrom : "";
		sTo = sTo != null ? sTo : "";
		
		if(!sFrom.equals("")) {
			try {
				nFrom = Integer.parseInt(sFrom);
			}catch (NumberFormatException nfe) {
				nFrom = -1;
			}
		}
		
		if(!sTo.equals("")) {
			try {
				nTo = Integer.parseInt(sTo);
			}catch (NumberFormatException nfe) {
				nTo = -1;
			}
		}
		
		/*'add checking on login id and clicode to make sure clicode point to correct user
	    if (StrComp (sEncrypt,"Y",1)=0) then
	        sCliCode = decryption(sCliCode)
	        if (len(sLoginID) > 0) then
	                sLoginID = decryption(sLoginID)
	        end if
	    end if
		call OpenN2NConnection()*/
		
		//cli.init(oN2NSession);
		out.println(N2NConst.STD_DATA_BEGIN);
		if (sLoginID.length() > 0) {
			oN2NSession.cliinfo.init(oN2NSession);
		  	clibean.reset();
			clibean.setLoginID(sLoginID);
			clibean.setMobile(null);
			clibean.setCliCode(null);
			clibean.setCategory(null);
			rs = oN2NSession.cliinfo.getCliInfo(clibean);
			if (rs != null) {
				while (rs.next()) {
					sLoginIDDB = rs.getString("LoginID");
					sCategory = rs.getString("category");
					sBHCode = rs.getString("DefBHCode");
					sBHBranch = rs.getString("DefBHBranch");
		        }
		        rs.close();
			}
			
			//System.out.println("sBHCode: " + sBHCode);
			//System.out.println("sBHBranch: " + sBHBranch);
	        rs = null;
		    oN2NSession.cliinfo.closeResultset();
			//oN2NSession.cliinfo.dbDisconnect();
			
	        if (sLoginID.compareToIgnoreCase(sLoginIDDB) == 0)
	             bProceed = true;
	        else
	            bProceed = false;
		}
		else {
			bProceed = true;
		}
		
		if (bProceed) {
			if (sSrchAct.compareToIgnoreCase("acc") == 0)
		  		nSrchAct = 1;
		  	else if (sSrchAct.compareToIgnoreCase("name") == 0)
		  		nSrchAct = 2;
		  	else if (sSrchAct.compareToIgnoreCase("icno") == 0)
		  		nSrchAct = 3;
		  	else if (sSrchAct.compareToIgnoreCase("cds") == 0)
		  		nSrchAct = 4;
		  	else
		  		nSrchAct = 0;
		  		
		  	//System.out.println("bProceed:" + bProceed + " nSrchAct : " + nSrchAct);
		  	if (nSrchAct > 0) {
		  		clibean.reset();
		  		clibean.setCliCode(sCliCode);
				clibean.setBhcode(sBHCode);
				clibean.setBhbranch(sBHBranch);
				clibean.setBhCliCode("");
				clibean.setAccountType("");
				
				oN2NSession.cliinfo.init(oN2NSession);
				rs = oN2NSession.cliinfo.getBHCliInfoByCliCode(clibean,sCategory,nSrchAct,sSrchStr.replace("*","%"),sExchange);
				
				//System.out.println("rs: " +rs);
				if (rs != null) {
					while (rs.next()) {
						//System.out.println("***************");
		  				if(nFrom < 0 || nTo < 0 || nFrom > nTo) {
							out.println("Error Passing From/To Parameter");
							break;
		  				}
		  				
		  				nRow = nRow + 1;
		  				
		  				if(nFrom > 0) {
							if(nRow < nFrom) {
								continue;
							}
		  				}
		  				
		  				if(nTo > 0) {
							if(nRow > nTo) {
								continue;
							}
		  				}
		  				
						sBHCliCode = rs.getString("BHCliCode").trim();
						sBHBranch = rs.getString("BHBranch");
						sCliName = rs.getString("CliName").toUpperCase();
						sICNo = rs.getString("ICNo").trim();
						sCDSNo = rs.getString("CDSNo");
						
						sData = sBHCliCode + N2NConst.TRDACC_COL_SEP;
						sData += sBHBranch + N2NConst.FEED_COL_SEP;
						sData += sCliName + N2NConst.FEED_COL_SEP;
						sData += sICNo + N2NConst.FEED_COL_SEP;
						sData += sCDSNo + N2NConst.FEED_COL_SEP;
						sData += rs.getString("AccType") + N2NConst.FEED_COL_SEP;
						sData += rs.getString("Status") + N2NConst.FEED_COL_SEP;
						sData += rs.getString("CliCode") + N2NConst.FEED_COL_SEP;
						sData += rs.getString("MaxPriceInterval") + N2NConst.FEED_COL_SEP;
						sData += rs.getString("BrokerageRate") + N2NConst.FEED_COL_SEP;
						sData += rs.getString("SuspFlg");
						//&FEED_COL_SEP& oRst("AccType") &FEED_COL_SEP& oRst("Status") &FEED_COL_SEP& oRst("CliCode") &FEED_COL_SEP& oRst("MaxPriceInterval") &FEED_COL_SEP& oRst("BrokerageRate") &FEED_COL_SEP& oRst("SuspFlg") &VBCRLF)
						out.println(sData);
					}
				}
		        rs = null;
		        oN2NSession.cliinfo.closeResultset();
		  	}
		}	
		else
			nRow = 0;
		//oN2NSession.cliinfo.dbDisconnect();

	//out.print(sData);
	out.println(N2NConst.STD_DATA_END);
	out.print("--_BeginCount_\r\n" + nRow + "\r\n--_EndCount_");
} catch (Exception ex) {
	ex.printStackTrace();
}
%>

