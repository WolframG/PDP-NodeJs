//-----------------------------------------------------------
// Code for the policy evaluation  
//-----------------------------------------------------------


exports.evaluateUserOwner = function(caller, owner){
	console.log("PDP evaluate caller: " + caller + " owner: " + owner);
	if (caller == owner){
		return true;
	}
	return false;
};


exports.evaluatePolicy = function(callerJson, calleeJson){
	console.log("PDP evaluate policy: " + callerJson + " callee: %j", calleeJson);
	return true;
};

