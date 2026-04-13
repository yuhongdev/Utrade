function ajaxFunction(handleData,link)
{
	$.ajax({
		url:link,
		async: false,
		type:"GET",
		success: function(data){
			handleData(data);
		},
		error: function(){handleData("Error");}
	});
}

function N2NHitJspUrl(url, param, returnType)
{
	var result;
	var link = url + param;
	ajaxFunction(function(output,returnType){result=output;},link);
	return result;
}