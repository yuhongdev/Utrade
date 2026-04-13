<%-- 
    Document   : version
    Created on : Nov 8, 2011, 9:52:59 AM
    Author     : DavidYong
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="com.n2n.tcplus.info.N2NConstant" %>
<%@page import="com.n2n.tcplus.atp.info.ATPConstant" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">




<%

    String sSponsor = N2NConstant.getSponsorID();

    String sJQC = N2NConstant.getConstant("confIsJQC");

    String sFeedIp = N2NConstant.getFeedIp(sSponsor);
    String sFeedPort = N2NConstant.getFeedPort(sSponsor);
    String sFeedPull = N2NConstant.getFeedPullIp(sSponsor);

    String sAtpIp = ATPConstant.getServerIp(sSponsor);
    String sAtpPort = ATPConstant.getServerPort(sSponsor);

    // Vertx info
    String confVertxFeed = N2NConstant.getConstant("confVertxFeed");
    String confAutoConnInterval = N2NConstant.getConstant("confAutoConnInterval");
    String confAutoConnRetry = N2NConstant.getConstant("confAutoConnRetry");

    String sRelease = N2NConstant.getConstant("constRelease");
    String sVersion = N2NConstant.getConstant("constVersion");



%>

<html>

    <head>

    </head>


    <body>

        <B>Sponsor : </B> &nbsp;&nbsp;&nbsp; <% out.write(sSponsor);%>

        <br/>
        <br/>

        <B>Version : </B> &nbsp;&nbsp;&nbsp; <% out.write(sRelease);%>

        <br/>

        <B>Release : </B> &nbsp;&nbsp;&nbsp; <% out.write(sVersion);%>

        <br/>
        <br/>
        <br/>

        <B>Vertx Feed : </B> &nbsp;&nbsp;&nbsp; <% out.write(confVertxFeed);%>

        <br/>

        <B>Vertx auto connect interval : </B> &nbsp;&nbsp;&nbsp; <% out.write(confAutoConnInterval);%> ms

        <br/>

        <B>Vertx auto connect retries : </B> &nbsp;&nbsp;&nbsp; <% out.write(confAutoConnRetry);%>

        <br/>
        <br/>

        <B>ATP IP : </B> &nbsp;&nbsp;&nbsp; <% out.write(sAtpIp);%>

        <br/>

        <B>ATP Port : </B> &nbsp;&nbsp;&nbsp; <% out.write(sAtpPort);%>

    </body>

</html>

