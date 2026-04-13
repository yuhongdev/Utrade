<%@ page import="com.n2n.util.N2NConst,java.util.Vector,com.n2n.util.N2NSecurity,com.n2n.util.StringTokenizerEx,java.sql.ResultSet,org.apache.log4j.Logger" %>
<%@page import="com.n2n.DB.N2NMFCliInfo,com.n2n.bean.N2NMFCliInfoBean,com.n2n.DB.N2NMFCliFav,com.n2n.bean.N2NMFCliFavNameBean,com.n2n.bean.N2NMFCliFavBean"%>
<%@ include file='common.jsp'%>
<%@ include file='util/N2NFunc.jsp'%>
<jsp:useBean id="eafInfo" class="com.n2n.DB.N2NMFEAFFunc" scope="page"/>
<jsp:include page="cliCheckLogin.jsp" flush="true">
	<jsp:param name="SecLevel" value="1" />
</jsp:include>
<script language=JavaScript src=<%=g_sJSPath%>/N2NCtrl.js></script>
<script language=JavaScript src=<%=g_sJSPath%>/LinkFunc.js></script>
<link rel=stylesheet href=<%=g_sStylePath%>/default.css>
<% if (oN2NSession.getIsUserLogin()) {%>
<html>
<head>
<title><%=oN2NSession.getSetting("WebSiteName")%>: Analysis Chart</title>
</head>

<%
	int nFavID = 0, nRetCode = -1, nFavListCnt = -1, nFavCnt = -1, nRetCodeSub = -1, nRntFav = -1;
	String sCliCode = "", sFavList = "", strStatus = ""; 
	String sLoginID = "", sLoginIDDB = "";
    String m_sDSNInfo = "";
	//dim oCnnDel, oCnn, oCnnSub, oCmdDel, oCmd, oCmdSub
	//dim oRst, oRstSub
	//dim oRntDel, oRntFavList, oRntFav
	String sEncrypt = "";
    boolean bProceed = false;

	String strSessionId = session.getId();
	ResultSet oRst = null, oRstSub = null;
	Vector arrayFavList = new Vector();
	Vector arrayFav = new Vector();
	
	Logger favLogger = Logger.getLogger("FavLogger");	
	sCliCode = request.getParameter("CliCode");
	sFavList = request.getParameter("FavList");
	sLoginID = request.getParameter("LoginID");
  	sEncrypt = request.getParameter("Encrypt");

	sCliCode = sCliCode != null ? sCliCode : sCliCode;
	sFavList = sFavList != null ? sFavList.trim() : "";
	sEncrypt = sEncrypt != null ? sEncrypt.toString() : "";
	sLoginID = sLoginID != null ? sLoginID.toString() : "";
	
//	'verify clicode and login id
	if (sEncrypt.equalsIgnoreCase("Y")) {
		sCliCode = decryption(sCliCode);
		if (sLoginID.length() > 0) {
			sLoginID = decryption(sLoginID);
		}
	}
 
	N2NMFCliInfo cliInfo = new N2NMFCliInfo();
	N2NMFCliInfoBean cliInfoBean = new N2NMFCliInfoBean();
	cliInfo.init(oN2NSession);	
	cliInfoBean.setCliCode(sCliCode);
	oRst = cliInfo.getCliInfo(cliInfoBean);
	
	if (oRst!=null&&oRst.next()) {
		sLoginIDDB = oRst.getString("LoginID");
	} 
	if (sLoginID.length()>0) {
		if (sLoginIDDB.equalsIgnoreCase(sLoginID)) {
			bProceed = true;
		} else {
			bProceed = false;
		}
	} else {
		bProceed = true;
	}
	if (bProceed) {	
		N2NMFCliFav cliFav = new N2NMFCliFav();
		N2NMFCliFavNameBean favName = new N2NMFCliFavNameBean();
		N2NMFCliFavBean favBean = new N2NMFCliFavBean();
		favLogger.info("CliCode: " + sCliCode + " Fav: " + sFavList);
		cliFav.init(oN2NSession);
		nRetCode = cliFav.delFavList(sCliCode,0);
		out.println("--_BeginData_");
		strStatus="OK";

//	  	oCnn.BeginTrans
//	  	set oCmdDel = Server.CreateObject("ADODB.Command")
//	  	oCmdDel.CommandType = adCmdStoredProc
//	  	oCmdDel.CommandText = "sp_mfDelFavList"
//	  	oCmdDel.Parameters.Append oCmdDel.CreateParameter("@CliCode", adVarChar, adParamInput, 6, sCliCode)
//	  	oCmdDel.Parameters.Append oCmdDel.CreateParameter("@Return", adInteger, adParamOutput, 4)
//	  	oCmdDel.ActiveConnection = oCnn
//	  	oCmdDel.Execute()
//	  	oRntDel = oCmdDel("@Return")
//	  	set oCmdDel = Nothing
	  
//	  	out.println "--_BeginData_" & VBCRLF
	  
//	  	strStatus="OK"
		if (nRetCode==1) {
			if (sFavList.length() > 0) {
				StringTokenizerEx tokenEx = new StringTokenizerEx(sFavList, "~");
				while (tokenEx.hasMoreTokens()) {
					arrayFavList.addElement(tokenEx.nextToken());
				}
				nFavListCnt = arrayFavList.size();  //number of fav list
				for (int i =0; i < nFavListCnt; i++) {
					StringTokenizerEx token = new StringTokenizerEx(arrayFavList.elementAt(i).toString(), "|");
					if (arrayFav == null) arrayFav = new Vector();
					while (token.hasMoreTokens()) {					
						arrayFav.addElement(token.nextToken());					
					}
					
					//manage favliststk first
					nFavCnt = arrayFav.size(); //number of stk in 1 fav list
					//System.out.println("nFavCnt: " + nFavCnt);
					
					if (strStatus.equalsIgnoreCase("OK")) {
						favName.setCli_code(sCliCode);
						favName.setFav_id(arrayFav.elementAt(0).toString());
						favName.setFav_name(arrayFav.elementAt(1).toString());
						favName.setBatch_id(strSessionId);
						nRetCodeSub = cliFav.updFavListName(favName);

						if (nRetCodeSub > 0) {
							if (nFavCnt > 2) {	//check whether it is > 2 bec the first 1 is fav list name
								for (int j = 2; j < nFavCnt; j++) {
									if (arrayFav.elementAt(j).toString().trim().length() > 0) {
										favBean.setCli_code(sCliCode);
										favBean.setFav_id(arrayFav.elementAt(0).toString());
										favBean.setStk_code(arrayFav.elementAt(j).toString());
										favBean.setBatch_id(strSessionId);
										nRntFav = cliFav.updFavListStk(favBean);
										
										if (nRntFav==1) {
											if (i==nFavListCnt) {
												if (j==nFavCnt-1) {
													strStatus="OK";
												}
											}
										} else {
											j=nFavCnt+1;
											i=nFavListCnt+1;
											strStatus="FAIL";
										}
									}
								}//endfor int j
							}//endif nFavCnt > 2	
							else {
								if (i==nFavListCnt) {
									strStatus="OK";
								}
							}
						} else {
							i=nFavListCnt+1;
							strStatus="FAIL";				
						}	
					}
					
					arrayFav.removeAllElements();
					arrayFav = null;
					favName.resetAll();
					favBean.resetAll();
					
				}
			} //endif sFavList.length()
		}//endif nRetCode==1
		else {
			out.println("FAIL");
		}

		if (strStatus.compareTo("OK") == 0) {
			out.print("OK");
		} else if (strStatus.compareTo("FAIL") == 0) {
			out.print("FAIL");
		}
		
		out.println("");
		out.print("--_EndData_");

		nRetCode = cliFav.delFavList(sCliCode,-1);		
		cliFav.dbDisconnect();
	} else {
		out.println("--_BeginData_");
		out.println("CliCode not match with Login ID. CliCode: ["+ sCliCode + "] Login ID: [" + sLoginID + "]");
		out.println("--_EndData_");
	}
%>

<% } %>