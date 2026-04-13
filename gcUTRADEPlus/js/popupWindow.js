//DHTML Window script- Copyright Dynamic Drive (http://www.dynamicdrive.com)
//For full source code, documentation, and terms of usage,
//Visit http://www.dynamicdrive.com/dynamicindex9/dhtmlwindow.htm

	var dragapproved=false
	var minrestore=0
	var initialwidth,initialheight
	var ie5=document.all&&document.getElementById
	var ns6=document.getElementById&&!document.all
	
	var ns4 = document.layers
	var ie4 = document.all 

	function iecompattest(){
		return (!window.opera && document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body
	}

	function drag_drop(e){
		if (ie5&&dragapproved&&event.button==1){
			document.getElementById("dwindow").style.left=tempx+event.clientX-offsetx+"px"
			document.getElementById("dwindow").style.top=tempy+event.clientY-offsety+"px"
		}
		else if (ns6&&dragapproved){
			document.getElementById("dwindow").style.left=tempx+e.clientX-offsetx+"px"
			document.getElementById("dwindow").style.top=tempy+e.clientY-offsety+"px"
		}
	}

	function initializedrag(e){
		offsetx=ie5? event.clientX : e.clientX
		offsety=ie5? event.clientY : e.clientY
		document.getElementById("dwindowcontent").style.display="none" //extra
		tempx=parseInt(document.getElementById("dwindow").style.left)
		tempy=parseInt(document.getElementById("dwindow").style.top)

		dragapproved=true
		document.getElementById("dwindow").onmousemove=drag_drop
	}

		
	function loadwindow(url,width,height,left,top){
		if (left == null) {
			left = "160px";
		}
		
		if (top == null) {
			top = "20";
		}
		
		if (!ie5&&!ns6) {
			window.open(url,"","width=width,height=height,scrollbars=0")
		} else{
			document.getElementById("cframe").style.display=''
			document.getElementById("dwindow").style.display=''
			document.getElementById("dwindow").style.width=initialwidth=width+"px"
			document.getElementById("dwindow").style.height=initialheight=height+"px"
			document.getElementById("dwindow").style.left=left
			document.getElementById("dwindow").style.top=ns6? window.pageYOffset*1+top+"px" : iecompattest().scrollTop*1+top+"px"			
			document.getElementById("cframe").src=url

		}
	}
			
	function maximize(){
		if (minrestore==0){
			minrestore=1 //maximize window
			document.getElementById("maxname").setAttribute("src","http://www.ebrokerconnect.com/NSS/img/restore.gif")
			document.getElementById("dwindow").style.width=ns6? window.innerWidth-200+"px" : iecompattest().clientWidth-200+"px"
			document.getElementById("dwindow").style.height=ns6? window.innerHeight-100+"px" : iecompattest().clientHeight-100+"px"
			document.getElementById("dwindow").style.left="0px"
			document.getElementById("dwindow").style.top=ns6? window.pageYOffset*1+80+"px" : iecompattest().scrollTop*1+80+"px"				
		} else{
			minrestore=0 //restore window
			document.getElementById("maxname").setAttribute("src","http://www.ebrokerconnect.com/NSS/img/max.gif")
			document.getElementById("dwindow").style.width=initialwidth
			document.getElementById("dwindow").style.height=initialheight
			document.getElementById("dwindow").style.left="160px"
			document.getElementById("dwindow").style.top=ns6? window.pageYOffset*1+80+"px" : iecompattest().scrollTop*1+80+"px"
		}

	}

	function closeit(){
	
		document.getElementById("cframe").src=''
		document.getElementById("cframe").style.display='none'
		document.getElementById("dwindow").style.display="none"
	}

	function stopdrag(){
		dragapproved=false;
		document.getElementById("dwindow").onmousemove=null;
		//document.getElementById("dwindow").style.zIndex=6;
		document.getElementById("dwindowcontent").style.display="" //extra
	}

	function hideObject(id) {
		
	   	if (ns4) {
			id.visibility = "hide";
   		}
   		else if (ie4) {
   			if (id != null && id != '') {
   				if (document.all[id] != null) 
      				document.all[id].style.visibility = "hidden";
      		}
   		}
   		else if (ns6) {
   			if (id != null && id != '')
      			document.getElementById(id).style.visibility = "hidden";
   		}
	}
				
	function showObject(id) {
		if (ns4) {
			id.visibility = "show";
		}
		else if (ie4) {
			//if (id == "login") {
				//document.all['table1'].disabled = true;
				//document.all['main'].disabled = true;
				//document.body.disabled = true;
			//}
			
			if (document.all[id] != null)	
				document.all[id].style.visibility = "visible";
		}
		else if (ns6) {
			document.getElementById(id).style.visibility = "visible";
		}
	}	
	
	function closeNRedirect(url) {
		this.style='hidden';
		if (url == '') {
			history.go(-1);
		} else {
			this.parent.location.href = url;
		}
	}
	