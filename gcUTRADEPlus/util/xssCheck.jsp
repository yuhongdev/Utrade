<%--
	Author: Vince Koe
	Created: 07-04-2015
	Last modified: 17-04-2015
	Functions:
	checkParamXSS(
		String sParam - param from request attribute
		String sDefVal - default value
		int nExpLen - expected length from param
		int nInputType - 	1 = HTML Element Content
							2 = HTML Common Attributes
							4 = JS Data values
	)
--%><%!
	public String checkParamXSS(String sParam, String sDefVal, int nExpLen, int nInputType){
		if(sParam == null) return sDefVal;
		int nParamLen = sParam.length();
		if(nParamLen==0) return sParam;	
		if(sParam.indexOf("<script") >= 0) return sDefVal;
		if(sParam.indexOf("<iframe") >= 0) return sDefVal;
		if(nParamLen > 8 || nParamLen > nExpLen || nExpLen == 0){
			if(nInputType==4){
				sParam = org.owasp.esapi.ESAPI.encoder().encodeForJavaScript(sParam);
			}else if(nInputType==2){
				sParam = org.owasp.esapi.ESAPI.encoder().encodeForHTMLAttribute(sParam);
			}else if(nInputType==1){
				sParam = org.owasp.esapi.ESAPI.encoder().encodeForHTML(sParam);
			}
		}
		return sParam;
	}
%><% 
	if(request.getParameter("testXSS")!=null){
		
			out.println("param: "+checkParamXSS(request.getParameter("testXSS"),"a",1,1)+ " , input type="+1 + "</br>");
		
	}
%>