<%@page import="com.n2n.tcplus.info.N2NConstant, java.util.*, java.text.*"%>  

<%@page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
    
<%
String	sTemp1 = N2NConstant.getConstant("confWMSServer").trim();
String sWMSServer 	= ((!sTemp1.equals("")) ? sTemp1 : "TRUE" );
String addPath 	= ( ( sWMSServer.toLowerCase().equals( "true" ) ) ? "../" : "" );

DateFormat formatter = new SimpleDateFormat("HH:mm:ss dd/MM/yyyy");
String date = formatter.format(new java.util.Date());

%>    
    
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Session</title>
<script type="text/javascript">

function loadXMLDoc() {
	
	//var selectedCombobox = ( document.getElementById( "typeSession" ).value ) ;
	var selectedCombobox = "socket" ;
	
	var xmlhttp;
	
	if ( window.XMLHttpRequest ) {// code for IE7+, Firefox, Chrome, Opera, Safari
  		xmlhttp = new XMLHttpRequest();
  	} else {// code for IE6, IE5
	  	xmlhttp = new ActiveXObject( "Microsoft.XMLHTTP" );
  	}
	
	xmlhttp.onreadystatechange = function() {
  		if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
			var text = xmlhttp.responseText;
			text = text.replace( "<html><body>", "" );
			text = text.replace( "</body></html>", "" );
			
			document.getElementById( "content" ).innerHTML = xmlhttp.responseText;
			
    	} else {}
  	}
	
	xmlhttp.open( "GET", "<%= addPath %>tcplus/sessts?t=" + selectedCombobox, true );
	xmlhttp.send();
}


var timer
onload = function() {
	loadXMLDoc();
	//timer = setInterval( startLoad, 1000 );
}

var currentTiming = 0;
function startLoad(){	
	
	currentTiming += 1;
	var timing = parseInt( document.getElementById( "timeSession" ).value );	
	
	if ( currentTiming >= timing ) {
		loadXMLDoc();
		currentTiming = 0;
	}
	
}

function increase(){
	var tempValue = parseInt( document.getElementById( "timeSession" ).value );
	tempValue += 1;
	document.getElementById( "timeSession" ).value = tempValue;
}

function decrease(){
	var tempValue = parseInt( document.getElementById( "timeSession" ).value );
	
	if ( tempValue == 1 ) 
		return;
	
	tempValue -= 1;
	document.getElementById( "timeSession" ).value = tempValue;
}

</script>
</head>
<body>

	<form name="N2NForm" onSubmit="return false;">
		
		<table>
			<tr>
				<td> Type </td>
				<td> 
					<select id="typeSession" onchange="loadXMLDoc()">
						<option value="socket">socket</option>
						<option value="user">user</option>
						<option value="timer">timer</option>
						<option value="heartbeat">heartbeat</option>						
					</select> 
				</td>
				
				<td>
					&nbsp;
				</td>
				<td> 
					<button onclick="loadXMLDoc()">refresh</button>					
				</td>
				<td>
					&nbsp;
				</td>
			</tr>
						
		</table>
			
	</form>

	
	

	<div id="content">
</div>



</body>
</html>