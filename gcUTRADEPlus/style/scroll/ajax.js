var m_sUrl2 = new String("annoucement.txt");
var m_xXmlHttp2;
var messages_ajax = new Array();

function setXmlHttp2(vs_xXmlHttp){ m_xXmlHttp2 = vs_xXmlHttp; }
function getXmlHttp2() { return m_xXmlHttp2; }

function ajax_start() {
	 bReq = loadXml();
	 if(bReq) loadData2();
}

function loadXml() {

	 var xXmlHttp;
	 var bReq = new Boolean(false);
	 var msXml = new Array("MSXML2.XMLHTTP.5.0",
			                   "MSXML2.XMLHTTP.4.0",
			                   "MSXML2.XMLHTTP.3.0",
			                   "MSXML2.XMLHTTP",
			                   "Microsoft.XMLHTTP");
		
	 // Microsoft MSXML ActiveX (branch for IE/Window ActiveX version)
	 if(window.ActiveXObject){
		  for(i=0; i<msXml.length; i++){
				  try{
					    xXmlHttp = new ActiveXObject(msXml[i]);	
					    setXmlHttp2(xXmlHttp);
					    return true;
		      }catch(e){
		      }				
		  }
	 }	
	 // Mozilla XMLHttpRequest (branch for native XMLHttpRequest)
	 if(window.XMLHttpRequest){
			try{
				  xXmlHttp = new XMLHttpRequest();
				  setXmlHttp2(xXmlHttp);
				  return true;
			}catch(e){ 
			}			
	 }		
	 return bReq;
}

function loadData2() {	
	
	 var xXmlHttp = new getXmlHttp2();
	 
	 xXmlHttp.onreadystatechange = stateChange2;
	 xXmlHttp.open("GET", m_sUrl2, true);
	 xXmlHttp.send(null);
}

function stateChange2() {	

	 var xXmlHttp = getXmlHttp2();

	 try{
	 	   switch(xXmlHttp.readyState){
		       case 4:
			        if(xXmlHttp.status == 200){
				         try{
				             var res = xXmlHttp.responseText;
                     //alert(res);
                     messages_ajax  = res.split("\n");
                     //alert(messages[2]);
				         }catch(e){
				         }
			        }
			     break;
		       default:	
	     }
	 }catch(e){
	 }
}