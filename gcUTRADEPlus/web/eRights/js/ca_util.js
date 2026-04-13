//Rest API URL
var eRightsApiPath = api_path + "eRights/"
var tradeAccInfo_url=eRightsApiPath+"getTradeAcc?"+$.now();
var getCASubsInfo_url=eRightsApiPath+"ERGetCAInfo?"+$.now();
var getERVerifyCorpActAndAcc_url=eRightsApiPath+"ERVerifyCorpActAndAcc?"+$.now();
var getERGetSubsBalance_url=eRightsApiPath+"ERGetSubsBalance?"+$.now();
var getSessionAttr_url=eRightsApiPath+"getSessionAttr?"+$.now();
var execSubscription_url=eRightsApiPath+"execSubscription?"+$.now();
var getCASubsLog_url=eRightsApiPath+"ERGetSubscLog?"+$.now();
var cancelSubscription_url = eRightsApiPath+"CancelSubscription?"+$.now();


function tradeAccInfoSubs(){
	$.ajax({
		type:"POST",
		datatype:"json",
		async:true,
		url:tradeAccInfo_url,
		success: function(data){
			tradeAccInfoSubs_response(data);
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	}
	)
}

function tradeAccInfoStatus(){
	$.ajax({
		type:"POST",
		datatype:"json",
		async:true,
		url:tradeAccInfo_url,
		success: function(data){
			tradeAccInfoStatus_response(data);
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	}
	)
}

//Get CA Subscription Info function
function getCASubsInfo(value,checksum){
		$.ajax({
		type:"POST",
		datatype:"json",
		async:true,
		data:{v:value,cs:checksum,c:public_id},
		url:getCASubsInfo_url,
		success: function(data){
			getCASubsInfo_response(data);			
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	}
	)
}

//Verify CA Subscription Info function
function verifyCASubsInfo(value,checksum){
		$.ajax({
		type:"POST",
		datatype:"json",
		async:true,
		data:{v:value,cs:checksum,c:public_id},
		url:getERVerifyCorpActAndAcc_url,
		success: function(data){
			verifyCASubsInfo_response(data);			
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	}
	)
}

//Get subscription balance function
function getSubsBal(value,checksum){
		$.ajax({
		type:"POST",
		datatype:"json",
		async:true,
		data:{v:value,cs:checksum,c:public_id},
		url:getERGetSubsBalance_url,
		success: function(data){
			getSubsBal_response(data);			
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	}
	)
}

//Get Client Info function
function getClientInfo(value,checksum){
		$.ajax({
		type:"POST",
		datatype:"json",
		async:true,
		data:{v:value,cs:checksum,c:public_id},
		url:getSessionAttr_url,
		success: function(data){
			getClientInfo_response(data);			
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	}
	)
}
//Execute Subscription function
function execSubscription(value,checksum){
		$.ajax({
		type:"POST",
		datatype:"json",
		async:true,
		data:{v:value,cs:checksum,c:public_id},
		url:execSubscription_url,
		success: function(data){
			execSubscription_response(data);			
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	}
	)
}

//Get CA Subscription Log function
function getCASubsLog(value,checksum){
		$.ajax({
		type:"POST",
		datatype:"json",
		async:true,
		data:{v:value,cs:checksum,c:public_id},
		url:getCASubsLog_url,
		success: function(data){
			getCASubsLog_response(data);			
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	})
}

function cancelSubscriptions(value,checksum){
	$.ajax({
		type:"POST",
		datatype:"json",
		async:true,
		data:{v:value,cs:checksum,c:public_id},
		url:cancelSubscription_url,
		success: function(data){
			cancelSubscription_response(data);			
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	})
	
}
