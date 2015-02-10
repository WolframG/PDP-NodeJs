var db_name = 'integration_tests';
var db_port = 27017;
var db_address = 'localhost';
var db_collection = 'testP';
var servioticy_url = "http://private-anon-27ef5934a-servioticypublic.apiary-mock.com/"; // Must end with "/"!!


//-----------------------------------------------------------
// Enables the test mode
//-----------------------------------------------------------
exports.testMode = function() {
	db_collection = 'test'+ db_collection;
	db_name = 'tests'+ db_name;
	deleteCollectionMongo(db_collection);
}


//-----------------------------------------------------------
// Initialisation
//-----------------------------------------------------------
exports.init = function(address, port, db, collection) {
	db_port = port;
	db_collection = collection;
	db_name = db;
	db_address = address;
}





//-----------------------------------------------------------
// Checks if a user has the rights to update the policies and if yes writes the policy to the PIP
//-----------------------------------------------------------
exports.updatePolicy = function(req, res) {
	var pdp = require('./../pdp');

	var policy = req.body;
	var caller = req.param("caller"); // User
	var callee = req.param("callee"); // Service Object ID
	var evalResult = false;
	var current_policy = "";

	console.log('Callee: ' + callee + ' Caller: ' + caller + ' policy: ' + policy);
	res.type('json');

	// Check if all parameters are OK
	if(policy == undefined){
		console.log('No policy');
		res.status(404);
		res.json({error:'No policy found'});
		return;
		}
	if(caller == undefined){
		console.log('No Caller');
		res.status(404);
		res.json({error:'No caller URL found'});
		return;
		}
	if(callee == undefined){
		console.log('No Callee');
		res.status(404);
		res.json({error:'No callee URL found'});
		return;
		}

	// Get Meta-data (including the policy) for the caller and the callee


	// Get user ID from IDM
	var request = require("request");
	var user_id = "";
	request({
		url: "http://localhost:8080/idm/user/info/",
		headers: {"Authorization" : 'Bearer ' + caller, 'Content-Type' : 'application/json'},
		method: 'GET'
	}, function (error, response, body) {
		if (response != undefined){
			console.log('Status: ' + response.statusCode);
			user_id = JSON.parse(body).id;
			console.log("The user id is: " + user_id);
		} else {
			console.log("Could not connect to IDM");
		}
	});



	// Evaluate policies
	evalResult = pdp.evaluatePolicy(user_id, current_policy);

	// Build new security meta-data
	var securityMetaData = getSecurityMetaData(callee, caller);
	securityMetaDataOld["policy"] = policy;
	
	// Store policy
	if (evalResult == true) {
		var request_Ser = require("request");
		request_Ser({
		  url: servioticy_url + callee,
		  body: securityMetaData,
		  headers: {"Content-Type": "application/json", "Authorization": caller},
		  method: "PUT"
		}, function (error, response, body) {
			if (error != null){
				res.status(500);
				res.json({error:'Failer during the policy evaluation'});
			} else {
				res.status = response.statusCode;
				res.json(body);
			}
		});
	}
	else{
		res.status(500);
		res.json({error:'Failer during the policy evaluation'});
	}
};



//-----------------------------------------------------------
// Checks if a user has the rights to set/store the policies and if yes writes the policy to the PIP
//-----------------------------------------------------------
exports.getPolicy = function(req, res) {
	var pdp = require('./../pdp');

	var caller = req.param("caller"); // User
	var callee = req.param("callee"); // Service source code
	var evalResult = false;
	var current_policy = "";

	console.log('SI Callee: ' + callee + ' Caller: ' + caller);
	res.type('json');

	// Check if all parameters are OK
	if(caller == undefined){
		console.log('No Caller');
		res.status(404);
		res.json({error:'No caller URL found'});
		return;
		}
	if(callee == undefined){
		console.log('No Callee');
		res.status(404);
		res.json({error:'No callee URL found'});
		return;
		}

	// Get Meta-data (including the policy) for the caller and the callee
	
	// Get user ID from IDM
	var user_id = "";
	var request = require("request");
	request({
		url: "http://localhost:8080/idm/user/info/",
		headers: {"Authorization" : 'Bearer ' + caller, 'Content-Type' : 'application/json'},
		method: 'GET'
	}, function (error, response, body) {
		if (response != undefined){
			console.log('Status: ' + response.statusCode);
			user_id = JSON.parse(body).id;
			console.log("The user id is: " + user_id);
		} else {
			console.log("Could not connect to IDM");
		}
	});



	// Evaluate policies
	evalResult = pdp.evaluatePolicy(user_id, current_policy);

	// Get policy
	if (evalResult == true) {
		var secMetaData = getSecurityMetaData(callee, caller);
		if (secMetaData != {}){
			res.status(200);
			res.json(secMetaData);			
		} else {
			res.status(404);
			res.json({});
		}
	}else {
		res.status(500);
		res.json({error:'Failer during the policy evaluation'});
	}
};


//------------------------Servioticy--------------------------------
// Get security meta data for a service object 
//-----------------------------------------------------------
getSecurityMetaData = function(callee, caller){
	var request = require("request");
	request({
	  url: servioticy_url + callee,
	  headers: {"Authorization": caller},
	  method: "GET"
	}, function (error, response, body) {
		if (error != null || response.statusCode != 200){
			return {};
		} else {
			return body;
		}
	});
}








