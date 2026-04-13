<%@page import="com.n2n.tcplus.info.N2NConstant"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">



        <%

            String trackerDebug = ((N2NConstant.getConstant("confTrackerRecordDebug").trim().equals("")) ? "TRUE" : N2NConstant.getConstant("confTrackerRecordDebug").trim());

            String sWMSServer = ((!N2NConstant.getConstant("confWMSServer").trim().equals("")) ? N2NConstant.getConstant("confWMSServer").trim() : "TRUE");
            String confTrackerRecordTotalRecord = (N2NConstant.getConstant("confTrackerRecordTotalRecord").trim()).equals("") ? "FALSE" : N2NConstant.getConstant("confTrackerRecordTotalRecord").trim();
        %>

        <link rel="stylesheet" type="text/css" href="js/lib/extjs/resources/css/ext-all.css"/>
        <script type="text/javascript" src="js/lib/extjs/ext-all.js"></script>

        <script type="text/javascript" src="js/tcliteSub/main.js?<%=N2NConstant.getRelease()%>"></script>
        <script type="text/javascript" src="js/tcliteSub/N2N_Function/N2NNumberFormat.js?<%=N2NConstant.getRelease()%>"></script>


        <script>
            var global_trackerDebug = '<%= trackerDebug%>';
            var global_TrackerRecordTotalRecord = '<%= confTrackerRecordTotalRecord%>';

            var isServerPath = "<%= sWMSServer.equalsIgnoreCase("TRUE") ? "../" : ""%>";
            var winheight = 204;
            if (Ext.isIE) {
                winheight = 165;
            }

            window.onload = function() {
                window.resizeTo(180, winheight);
            };

            function resizeWindow(width) {
                if (Ext.isIE){
                    width += 22;
                }else{
                    width += 20;
                }
                window.resizeTo(width, winheight);

                window.onresize = function() {
                    window.resizeTo(width, winheight);
                };
            }



            function callRecord() {
                Ext.Ajax.request({
                    url: isServerPath + 'tcplus/sub/FeedCall',
                    method: 'GET',
                    success: function(response) {
                        var obj = Ext.decode(response.responseText);

                        main.procData(obj);

                    },
                    failure: function(response) {

                    }
                });
            }


            Ext.onReady(function() {
                Ext.Ajax.defaultHeaders = {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache'
                };

                setInterval(function() {
                    callRecord();
                }, 2000);


            });


        </script>


        <style>
            body{
                background-color: black;                
            }
            .backgroundBlack div.x-panel-body{
                background-color: black  !important;
                color			: white !important;
            }
            *{
                font:normal 12px arial, tahoma, helvetica, sans-serif;
            }

        </style>


    </head>
    <body>
        <div id='content'>  </div>
    </body>
</html>