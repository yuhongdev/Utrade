<%@ page import = "java.util.*, java.io.*, java.sql.*, com.n2n.util.N2NConst, com.n2n.bean.N2NMFCliColSettingBean, java.net.*" %>
<jsp:useBean id="rt" class="com.n2n.DB.N2NMFCliColSetting" scope="page"/>
<%@ include file="common.jsp"%>

<%
		String sBHBranch = "", sBHCliCode="", sCliCode = "", sBHCode = "", sParam = "", sProcess = "", sServiceCode = "", sLinkCode = "";
		String sKiosk = "", sRedirect = "";
		ResultSet oRst = null;
		boolean bRet = false;
		
		sServiceCode = request.getParameter("ServiceCode");
		sCliCode = request.getParameter("CliCode");
		sParam = request.getParameter("param");
		sProcess = request.getParameter("process");
		sKiosk = request.getParameter("Kiosk");
		sRedirect = request.getParameter("redirect");
		
		sServiceCode = sServiceCode != null ? sServiceCode.trim() : "";
		sCliCode = sCliCode != null ? sCliCode.trim() : "";
		sParam = sParam != null ? sParam.trim() : "";
		sProcess = sProcess != null ? sProcess.trim() : "";
		sKiosk = sKiosk != null ? sKiosk.trim() : "";
		sRedirect = sRedirect != null ? sRedirect.trim() : "";
		
		if(sRedirect.equals("Kiosk")) {
			out.print("--_BeginData_");
			out.print("Success");
			out.println("--_EndData_");
		}
		
		if(sKiosk.equals("Y") && sProcess.compareToIgnoreCase("set") == 0) {
			out.println("<script language='javascript'>");
			out.println("window.open('" + oN2NSession.getSetting("HTMLRoot") + g_sPath + "/cliColSetting_Kiosk.jsp?ServiceCode=" + sServiceCode + "&param=" + sParam + "');");
			out.println("</script>");
			out.print("--_BeginData_");
			out.print("Success");
			out.println("--_EndData_");
			session.setAttribute("KIMFOONG",sParam);

			if (session.getAttribute("KIMFOONG") != null)
		}
		else {
		sBHBranch  = "";
		sBHCliCode = "";
		sBHCode = oN2NSession.getSetting("WebBHCode");

		N2NMFCliColSettingBean cliBean = new N2NMFCliColSettingBean();
		rt.init(oN2NSession);
		
		cliBean.setService_code(sServiceCode);
		cliBean.setCli_code(sCliCode);
		cliBean.setBhcode(sBHCode);
		cliBean.setBhbranch(sBHBranch);
		cliBean.setBh_clicode(sBHCliCode);			
		cliBean.setActive("Y");
		cliBean.setParam(sParam);		
		
		//----- SAVE CLIENT SETTINGS DATA ----- (successfully inserted new client setting)
		if (sProcess.compareToIgnoreCase("set") == 0) {
			bRet = rt.cliProfSave(cliBean,"","");
		
			out.print("--_BeginData_");
			out.print("Success");
			out.println("--_EndData_");
		}
	
		//----- RETRIEVE CLIENT SETTINGS DATA -----
		if(sProcess.compareToIgnoreCase("get") == 0) {
			oRst = rt.getCliColSetting(cliBean,sServiceCode);
			
			out.print("--_BeginData_");
			
			if (oRst != null) {
				while (oRst.next()) {
					sParam = oRst.getString("Param");
					out.print(sParam);
				}
			}
			
			if (sParam.trim().length() == 0) {
				if(sServiceCode.compareToIgnoreCase("RTCOLSET") == 0) { 
					out.print("0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16");
				} else if (sServiceCode.compareToIgnoreCase("RTSET") == 0) {
					out.print("KLSE|11|1|1");
				}
			}
			out.println("--_EndData_");
		}
	}
%>