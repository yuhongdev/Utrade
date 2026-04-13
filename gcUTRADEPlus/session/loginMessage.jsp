<%

//System.out.println("rawLoginMessage:"+session.getAttribute("rawLoginMessage"));
	try {
             out.print("--_BeginData_" + "\n");
             out.println(session.getAttribute("rawLoginMessage"));
             out.print("--_EndData_"+ "\n");
	}
	catch (Exception ex) {
             out.print("--_BeginData_"+ "\n");
             out.println("");
             out.print("--_EndData_"+ "\n");
	}
	
%>
