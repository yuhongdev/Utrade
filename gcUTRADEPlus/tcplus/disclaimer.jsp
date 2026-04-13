<%-- 
    Document   : disclaimer
    Created on : Dec 2, 2010, 9:52:59 AM
    Author     : sc001
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="com.n2n.tcplus.info.N2NConstant" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<%
    String sContent = "";
    String sSponsor = N2NConstant.getConstant("confSponsorID");
    if (sSponsor != null && !sSponsor.isEmpty()) {
        String sDisclaimerSetting = N2NConstant.getConstant("portFolioDisclaimerFileSetting_"+sSponsor);
        String[] arDisclaimerSetting = sDisclaimerSetting.split("\\|");
        String sDisclaimerPath = arDisclaimerSetting.length > 0 ? arDisclaimerSetting[0] : "";
        if (sDisclaimerSetting != null) {
            java.io.FileInputStream fin = null;
            try {
           	 	fin = new java.io.FileInputStream(new java.io.File(sDisclaimerPath));
                int available = fin.available();
                if (available > 0) {
                    byte[] abt = new byte[available];
                    fin.read(abt);
                    sContent = new String(abt);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
            	if (fin != null) 
                	fin.close();
            }
        }
    }
    
    if (sContent != null && !sContent.isEmpty()) {
        out.write(sContent);
    } else {
        out.write("<html><head></head><body></body></html>");
    }
%>