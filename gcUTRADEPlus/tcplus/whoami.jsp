<%@page import="java.util.Arrays"%>
<%@page import="java.net.SocketException"%>
<%@page import="java.net.InterfaceAddress"%>
<%@page import="java.net.NetworkInterface"%>
<%@page import="java.util.Collections"%>
<%@page import="java.util.HashSet"%>
<%@page import="java.util.Set"%>
<%@page import="java.net.InetAddress"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Who Am I?</title>
    </head>
    <body>
        <%!
            private String[] getHostAddresses() {
                Set<String> HostAddresses = new HashSet<String>();

                try {
                    for (NetworkInterface ni : Collections.list(NetworkInterface.getNetworkInterfaces())) {
                        if (!ni.isLoopback() && ni.isUp() && ni.getHardwareAddress() != null) {
                            for (InterfaceAddress ia : ni.getInterfaceAddresses()) {
                                if (ia.getBroadcast() != null) {  //If limited to IPV4
                                    HostAddresses.add(ia.getAddress().getHostAddress());
                                }
                            }
                        }
                    }
                } catch (SocketException e) {
                }

                return HostAddresses.toArray(new String[0]);

            }
        %>
        <%
            InetAddress inetAddress = InetAddress.getLocalHost();
            out.write("IP: ");
            // inetAddress.getHostAddress()
            out.write(getHostAddresses()[0]);
            out.write("<br/>");

            // list of system properties
            // System.getProperties().list(System.out);
            String osName = System.getProperty("os.name").toLowerCase();
            String tomcatPath = System.getProperty("catalina.base");

            String pathSeparator = "/";
            if (osName.indexOf("windows") > -1) { // Windows
                pathSeparator = "\\\\";
            }
            String[] paths = tomcatPath.split(pathSeparator);
            out.write(paths[paths.length - 1]);

        %>
    </body>
</html>
