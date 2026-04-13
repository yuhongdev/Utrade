<%

//System.out.println("disclaimerIndicators:"+session.getAttribute("disclaimerIndicators"));
	try {
             out.print("--_BeginData_" + "\n");
             out.println(session.getAttribute("disclaimerIndicators"));
             out.print("--_EndData_"+ "\n");
	}
	catch (Exception ex) {
             out.print("--_BeginData_"+ "\n");
             out.println("");
             out.print("--_EndData_"+ "\n");
	}
	
%>
