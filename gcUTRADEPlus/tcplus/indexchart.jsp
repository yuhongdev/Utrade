<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="com.n2n.tcplus.feed.QcFeedIntradayChart"%>
<%@page import="com.n2n.tcplus.info.N2NConstant" %>
<%@page import="java.net.URL" %>
<%@page import="java.io.InputStream" %>
<%@page import="java.io.InputStreamReader" %>
<%@page import="java.io.IOException" %>
<%@page import="com.n2n.tcplus.debug.N2NLogUtil"%>


<%!String parseImageLink(String sStringData) throws IOException {

		int iPos = sStringData == null ? -1 : sStringData.indexOf(N2NConstant
				.getConstant("constStartChart"));
		int iPos2;

		if (iPos != -1) {
			iPos2 = sStringData.indexOf(N2NConstant
					.getConstant("constEndChart"));
			if (iPos2 != -1) {
				sStringData = sStringData.substring(iPos + 12, iPos2).trim();
				return sStringData;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}%>

<%
	InputStream is = null;
	InputStreamReader isr = null;
	String sUser = null;
	
	try {
		
		HttpSession httpSession = request.getSession(false);
		
		if (httpSession != null) {
			 sUser = (String) httpSession.getAttribute("user");
        }
		
		N2NLogUtil.logInfo("[INTRADAYCHART] generate chart link ", sUser);
		
		String sKey = request.getParameter("k");
		String sWidth = request.getParameter("w");
		String sHeight = request.getParameter("h");

		String sExCode = request.getParameter("ex");
		String sSponsorId = N2NConstant.getSponsorID();
		String sType = request.getParameter("t");
		String sTitle = request.getParameter("ct");
		String sId = request.getParameter("id");
		String sColor = request.getParameter("c"); //1.3.29.37
		

	
		
		if (sKey == null)
			sKey = "";
		if (sWidth == null)
			sWidth = "201";
		if (sHeight == null)
			sHeight = "164";

		/*
		StringBuffer sbData = new StringBuffer();
		int ch;
		
		String urlstr = "http://localhost:8080/ChartGenerator/chart/intraday?k=" + sKey + "&w=201&h=164&o=" + System.currentTimeMillis();
		URL url = new URL(urlstr);
		is = url.openStream();
		isr = new InputStreamReader(is);
		
		while((ch = isr.read()) != -1) {
		    sbData.append((char)ch);
		}

		if (sbData.length() > 0) {
		    out.write(parseImageLink(sbData.toString()));	
		}
		 */

		N2NLogUtil.logInfo("[INTRADAYCHART] param : sKey ---> " + sKey, sUser);
		N2NLogUtil.logInfo("[INTRADAYCHART] param : sWidth ---> " + sWidth, sUser);
		N2NLogUtil.logInfo("[INTRADAYCHART] param : sHeight ---> " + sHeight, sUser);
		N2NLogUtil.logInfo("[INTRADAYCHART] param : sExCode ---> " + sExCode, sUser);
		N2NLogUtil.logInfo("[INTRADAYCHART] param : sSponsorId ---> " + sSponsorId, sUser);
		N2NLogUtil.logInfo("[INTRADAYCHART] param : sType ---> " + sType, sUser);
		N2NLogUtil.logInfo("[INTRADAYCHART] param : sTitle ---> " + sTitle, sUser);
		N2NLogUtil.logInfo("[INTRADAYCHART] param : sId ---> " + sId, sUser);
		N2NLogUtil.logInfo("[INTRADAYCHART] param : sColor ---> " + sColor, sUser);
		 
		String[] params = { sKey, sWidth, sHeight, sExCode, sSponsorId,
				sType, sTitle, sId, sColor }; //1.3.29.37 added sColor

		
		String sLink = QcFeedIntradayChart.getChartByLink(params, sUser);
		//System.out.println("sLink:" + sLink);

		N2NLogUtil.logInfo("[INTRADAYCHART] chart link ---> " + sLink + " \n", sUser);
		
		if (sLink != null) {
			out.write(sLink);
		}
		
	} catch (Exception e) {
		N2NLogUtil.logInfo("[INTRADAYCHART] chart link : Exception ---> \n" + e , sUser);
		
	} finally {
		if (isr != null)
			isr.close();
		if (is != null)
			is.close();
	}
	
%>