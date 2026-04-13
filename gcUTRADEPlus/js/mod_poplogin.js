function moveScroller() {
	var a = function(){
		var b = $(window).scrollTop();
		var d = $("#stickydiv-anchor").offset().top + 100;
		var c = $("#stickydiv");
		var e = $("#logo");
		
		if (b>d) {
			var $menu = $('#stickydiv #stickContent').clone();
			$('#stickydiv2').html($menu);
			$("#stickydiv2").addClass("stick");
			$("#stickydiv2 #logo").addClass("stickytop");
			
			var w = $(window).width();		
			if (w > 760) {
				$("#stickydiv2").fadeIn('slow');
			}
		} else {
			if (b<=d) {
				$("#stickydiv2").fadeOut('fast');
			}
		}
	};
	$(window).scroll(a);a()
}
//moveScroller();

// sticky menu when browser scrolled down
$(document).ready(function(){
	/* prepend menu icon */
	$('#stickydiv #tpwrapper-topmenu').prepend('<div id="menu-icon">Menu</div>');
	/* toggle nav */
	$("#stickydiv #menu-icon, #stickydiv2 #menu-icon").on("click", function(){
		$("#stickydiv #responsivemenu").slideToggle("fast");
		$("#stickydiv #menu-icon").toggleClass("active");
	});
});

$(document).ready(function(){ 
	var w = $(window).width();
	$(window).resize(function() {
		w = $(window).width();
		changeWidth(w);
	});
	changeWidth(w);
});

function changeWidth(w) {
	var a = $("#stickydiv");
	var b = $("#stickydiv #logo");
	
	if (w <= 760) {
		a.addClass("stick");
		b.addClass("stickytop");
		$("#row7").css("margin-top", "60px");
		$("#stickydiv2").hide();
	} else {
		a.removeClass("stick").addClass("regular")
        b.removeClass("stickytop").addClass("regular")
		$("#row7").css("margin-top", "0px");
		$("#stickydiv2").fadeIn('slow');
	}
}

$(document).ready(function(){					   		   
	//When you click on a link with class of poplogin and the href starts with a # 
$('a.poplogin[href^=#]').click(function() {
	/**
	if(window.innerWidth <= 760) {
		window.location = "#"
	} else {
	**/
		var popID = $(this).attr('rel'); //Get Popup Name
		var popURL = $(this).attr('href'); //Get Popup href to define size
		
		//Pull Query & Variables from href URL
		//var query= popURL.split('?');
		//var dim= query[1].split('&');
		//var popWidth = dim[0].split('=')[1]; //Gets the first query string value
		var popWidth = 500; //Gets the first query string value
	
		//Fade in the Popup and add close button
		$('#stickydiv #' + popID).fadeIn().css({ 'width': Number( popWidth ) }).prepend('<a href="#" class="close">Close</a>');
	
		//Define margin for center alignment (vertical   horizontal) - we add 80px to the height/width to accomodate for the padding  and border width defined in the css
		var popMargTop = ($('#' + popID).height() + 80) / 2;
		var popMargLeft = ($('#' + popID).width() + 80) / 2;
	
		//Apply Margin to Popup
		$('#' + popID).css({
			'margin-top' : -popMargTop,
			'margin-left' : -popMargLeft
		});
	
		//Fade in Background
		$('body').append('<div id="fade"></div>'); //Add the fade layer to bottom of the body tag.
		$('#fade').css({'filter' : 'alpha(opacity=80)'}).fadeIn(); //Fade in the fade layer - .css({'filter' : 'alpha(opacity=80)'}) is used to fix the IE Bug on fading transparencies 
		
	//}
	
	return false;
});

//Close Popups and Fade Layer
$('a.close, #fade').on('click', function() { //When clicking on the close or fade layer...
    $('#fade , .popbox').fadeOut(function() {
        $('#fade, a.close').remove();  //fade them both out
    });
    return false;
});

$('body').on("click", "#fade", function() {
	 $('#fade , .popbox').fadeOut(function() {
        $('#fade, a.close').remove();  //fade them both out
    });
    return false;
});

$('#tppoplogin').on("click", "a.close", function() {
	 $('#fade , .popbox').fadeOut(function() {
        $('#fade, a.close').remove();  //fade them both out
    });
    return false;
});

$('#redirect').on('click', function() { //When clicking on the close or fade layer...
    $('#fade , .popbox').fadeOut(function() {
        $('#fade, a.close').remove();  //fade them both out
    });
    return false;
});


});





