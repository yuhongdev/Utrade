<%@ include file='../common.jsp'%>
<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>

<%
	String sParam  ="" ; 
	String sMobile ="";
	String sSQL ="";
	String oRst ="";
	int nRetCode =0;
	String sRetCode ="";
	boolean bIsNumeric = false;
	
	// SMS Login : SJMC or SJSMS
	//sParam  = "http://lms.n2n-connect.com/mc/AmSec/mc.html|0|";
	sParam  = "http://wap.getmsl.com/mc/AME/mcModel.html|0|";
	sMobile = request.getParameter("txtMobile");

System.out.println("[cliMRegSave.jsp] sMobile  ==> " +sMobile );
System.out.println("[cliMRegSave.jsp] sParam   ==> " +sParam );
	
	// nRetCode = 0 :- Save in DB, nRetCode = Err.number 
	// nRetCode = 2 :- len(sMobile)<> 10 or (IsNumeric(sMobile)=false)
	try {
		int nTemp = Integer.parseInt(sMobile);
		bIsNumeric = true;
	} catch (NumberFormatException nfe) {
		bIsNumeric = false;
	}
	
	if ((sMobile.length()!= 10) || (!bIsNumeric)) {
		nRetCode = 1;
	}
	else {
		cli.init(oN2NSession);
 		nRetCode = cli.mfMsgInsMailQueue("C","M&A Online Trading Channel",sMobile,"M&A Online Mobile Trading S/W Download",73,sParam,"","","",0,0,0);
		cli.closeResultset();
	}

	sRetCode=String.valueOf(nRetCode);


%>
<html>
<body>
--_BeginData_<%out.println("\n" + sRetCode);%>--_EndData_
</body>
</html>

