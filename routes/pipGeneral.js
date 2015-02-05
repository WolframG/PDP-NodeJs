var db_name = 'integration_tests';
var db_port = 27017;
var db_address = 'localhost';
var db_collection = 'testP';


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
// Checks if a user has the rights to set/store the policies and if yes writes the policy to the PIP
//-----------------------------------------------------------
exports.storePolicy = function(req, res) {
	var pdp = require('./../pdp');

	var policy = req.body;
	var caller = req.param("caller"); // User
	var callee = req.param("callee"); // Service source code
	var evalResult = false;

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
			//console.log('Headers: ' + JSON.stringify(response.headers));
			//console.log("Body", body);
			user_id = JSON.parse(body).id;
			console.log("The user id is: " + user_id);
		} else {
			console.log("Could not connect to IDM");
		}
	});

	// Get Owner
	var owner = getEntityOwner(callee, caller);

	// Evaluate policies
	evalResult = pdp.evaluatePolicy(user_id, owner);

	// Store policy
	if (evalResult == true) {
		storePolicyMongo(callee, db_collection, policy, res); //{"a":100, "_id" : 123}
	}
	else{
		res.status(500);
		res.json({error:'Failer during the policy evaluation'});
	}
};


//-----------------------------------------------------------
// Checks if a user has the rights to update the policies and if yes writes the policy to the PIP
//-----------------------------------------------------------
exports.updatePolicy = function(req, res) {
	var pdp = require('./../pdp');

	var policy = req.body;
	var caller = req.param("caller"); // User
	var callee = req.param("callee"); // Service source code
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

	// Get Owner
	var owner = getEntityOwner(callee, caller);

	// Evaluate policies
	evalResult = pdp.evaluatePolicy(user_id, owner);

	// Store policy
	if (evalResult == true) {
		updatePolicyMongo(callee, db_collection, policy, res); //policy
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

	// Get Owner
	var owner = getEntityOwner(callee, caller);

	// Evaluate policies
	evalResult = pdp.evaluatePolicy(user_id, owner);

	// Store policy
	if (evalResult == true) {
		getPolicyMongo(callee, db_collection, res);
	}else {
		res.status(500);
		res.json({error:'Failer during the policy evaluation'});
	}
};



//-----------------------------------------------------------
// Checks if a user has the rights to delete the policies and if yes deletes the policy in the PIP
//-----------------------------------------------------------
exports.deletePolicy = function(req, res) {
	var pdp = require('./../pdp');

	var caller = req.param("caller"); // User
	var callee = req.param("callee"); // Service source code
	var evalResult = false;
	var current_policy = "";

	console.log('Callee: ' + callee + ' Caller: ' + caller);
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

	// Get Owner
	var owner = getEntityOwner(callee, caller);

	// Evaluate policies
	evalResult = pdp.evaluatePolicy(user_id, owner);

	// Delete policy
	if (evalResult == true) {
		deletePolicyMongo(callee, db_collection, res);
	}
	else{
		res.status(500);
		res.json({error:'Failer during the policy evaluation'});
	}
};





//------------------------Mongo--------------------------------
// Stores the policy in the PIP (MongoDB)
// Parameters ID, collection, policy 
//-----------------------------------------------------------
storePolicyMongo = function(id, collection, policy, res) {
	var retCode = 200;
	var retMessage = {};
	var Db = require('mongodb').Db,
	    MongoClient = require('mongodb').MongoClient,
	    Server = require('mongodb').Server,
	    ReplSetServers = require('mongodb').ReplSetServers,
	    ObjectID = require('mongodb').ObjectID,
	    Binary = require('mongodb').Binary,
	    GridStore = require('mongodb').GridStore,
	    Grid = require('mongodb').Grid,
	    Code = require('mongodb').Code,
	    BSON = require('mongodb').pure().BSON,
	    assert = require('assert');

	console.log("Storing entry: " + id + " in: " + collection + " with: %j", policy);
	var db = new Db(db_name, new Server(db_address, db_port, {auto_reconnect: false, poolSize: 4}), {w:0, native_parser: false});


	// Add id to the policy object
	policy._id = id;
	console.log("Dokuement to store: %j", policy);

	//var db = new Db('test', new Server('localhost', 27017));
	// Establish connection to db
	db.open(function(err, db) {
		if (err != null) {
			console.log(err);
			res.status(500);
			res.json({"error" : "Could not connect to PIP-DB"});
		} else {
			// Create a collection we want to drop later
			db.createCollection(collection, function(err, collection) {
			if (err != null)
			{
				console.log(err);
				res.status(500);
				res.json({"error" : "Could not connect to collection"});
			} else {
			// Insert a bunch of documents for the testing
			collection.insert(policy, {w:1}, function(err, result) {
			if (err != null){
				console.log(err);
				res.status(500);
				res.json({"error" : "Could not store Policy. Already created before?"});
				db.close();
			} else {
			      //assert.equal(null, err);
				db.close();
				// Send response
				res.status(retCode);
				res.json(retMessage);
			}
			    });
			}
			  });
		}
	});
};


//------------------------Mongo--------------------------------
// Updates the policy stored in the PIP (MongoDB)
// Parameters ID, collection, policy 
//-----------------------------------------------------------
updatePolicyMongo = function(id, collection, policy, res) {
	var retCode = 200;
	var retMessage = {};
	var Db = require('mongodb').Db,
	    MongoClient = require('mongodb').MongoClient,
	    Server = require('mongodb').Server,
	    ReplSetServers = require('mongodb').ReplSetServers,
	    ObjectID = require('mongodb').ObjectID,
	    Binary = require('mongodb').Binary,
	    GridStore = require('mongodb').GridStore,
	    Grid = require('mongodb').Grid,
	    Code = require('mongodb').Code,
	    BSON = require('mongodb').pure().BSON,
	    assert = require('assert');

	console.log("Storing entry: " + id + " in: " + collection + " with: %j", policy);
	var db = new Db(db_name, new Server(db_address, db_port, {auto_reconnect: false, poolSize: 4}), {w:0, native_parser: false});


	// Add id to the policy object
	policy._id = id;
	console.log("Dokuement to store: %j", policy);

	//var db = new Db('test', new Server('localhost', 27017));
	// Establish connection to db
	db.open(function(err, db) {
		if (err != null) {
			console.log(err);
			res.status(500);
			res.json({"error" : "Could not connect to PIP-DB"});
		} else {
			// Create a collection we want to drop later
			db.createCollection(collection, function(err, collection) {
			if (err != null)
			{
				console.log(err);
				res.status(500);
				res.json({"error" : "Could not connect to collection"});
			} else {
			// Updata the document
			collection.save(policy, {w:1}, function(err, result) {
			if (err != null){
				console.log(err);
				res.status(500);
				res.json({"error" : "Could not store Policy. Already created before?"});
				db.close();
			} else {
			      //assert.equal(null, err);
				db.close();
				// Send response
				res.status(retCode);
				res.json(retMessage);
			}
			    });
			}
			  });
		}
	});
};





//------------------------Mongo--------------------------------
// Finds the policy in the PIP (MongoDB) for an ID
// Parameters ID, collection 
//-----------------------------------------------------------
getPolicyMongo = function(id, collection, res) {
	var Db = require('mongodb').Db,
	    MongoClient = require('mongodb').MongoClient,
	    Server = require('mongodb').Server,
	    ReplSetServers = require('mongodb').ReplSetServers,
	    ObjectID = require('mongodb').ObjectID,
	    Binary = require('mongodb').Binary,
	    GridStore = require('mongodb').GridStore,
	    Grid = require('mongodb').Grid,
	    Code = require('mongodb').Code,
	    BSON = require('mongodb').pure().BSON,
	    assert = require('assert');


	var db = new Db(db_name, new Server(db_address, db_port, {auto_reconnect: false, poolSize: 4}), {w:0, native_parser: false});

	console.log("ID to search: " + id);
	// Establish connection to db
	db.open(function(err, db) {

	  // Create a collection we want to drop later
	  db.createCollection(collection, function(err, collection) {
	    assert.equal(null, err);

		// Search object
		var searchID = {_id : id};

	      // Peform a simple find and return all the documents
	      collection.find(searchID).toArray(function(err, docs) {
		if (err != null)
		{
			res.status(500);
			res.json({"error": "DB query failed"});
		} else {
			db.close();
			console.log("Found something: %j", docs);
			if (docs.hasOwnProperty(0)){
				// Send response
				delete docs[0]["_id"];
				res.status(200);
				res.json(docs);
			} else {
			//assert.equal(1, docs.length); 
				res.status(404);
				res.json({});
			}



		}
	    });
	  });
	});
};



//------------------------Mongo--------------------------------
// Delets the policy in the PIP (MongoDB) for an ID
// Parameters ID, collection 
//-----------------------------------------------------------
deletePolicyMongo = function(id, collection, res) {
	var Db = require('mongodb').Db,
	    MongoClient = require('mongodb').MongoClient,
	    Server = require('mongodb').Server,
	    ReplSetServers = require('mongodb').ReplSetServers,
	    ObjectID = require('mongodb').ObjectID,
	    Binary = require('mongodb').Binary,
	    GridStore = require('mongodb').GridStore,
	    Grid = require('mongodb').Grid,
	    Code = require('mongodb').Code,
	    BSON = require('mongodb').pure().BSON,
	    assert = require('assert');


	var db = new Db(db_name, new Server(db_address, db_port, {auto_reconnect: false, poolSize: 4}), {w:0, native_parser: false});

	// Build search object
	var searchID = {_id : id};

	//var db = new Db('test', new Server('localhost', 27017));
	// Establish connection to db
	db.open(function(err, db) {

	  // Create a collection we want to drop later
	  db.createCollection(collection, function(err, collection) {
	    assert.equal(null, err);

	    // Insert a bunch of documents for the testing
	    collection.remove(searchID, 1, function(err, result) {
	      assert.equal(null, err);

		db.close();
		// Send response
		res.status(200);
		res.json({});
	    });
	  });
	});
};


//------------------------Mongo--------------------------------
// Delets entire collection in the PIP (MongoDB) for an ID! Used for test cases
// Parameters ID, collection 
//-----------------------------------------------------------
deleteCollectionMongo = function(collection) {
	var Db = require('mongodb').Db,
	    MongoClient = require('mongodb').MongoClient,
	    Server = require('mongodb').Server,
	    ReplSetServers = require('mongodb').ReplSetServers,
	    ObjectID = require('mongodb').ObjectID,
	    Binary = require('mongodb').Binary,
	    GridStore = require('mongodb').GridStore,
	    Grid = require('mongodb').Grid,
	    Code = require('mongodb').Code,
	    BSON = require('mongodb').pure().BSON,
	    assert = require('assert');


	var db = new Db(db_name, new Server(db_address, db_port, {auto_reconnect: false, poolSize: 4}), {w:0, native_parser: false});

	//var db = new Db('test', new Server('localhost', 27017));
	// Establish connection to db
	db.open(function(err, db) {

	  // Create a collection we want to drop later
	  db.createCollection(collection, function(err, collection) {
	    //assert.equal(null, err);
		console.log(err);
	    // Insert a bunch of documents for the testing
	   	collection.remove(); 
		db.close();
	  });
	});
};



//------------------------ IDM ------------------------------
//  Gets information about an entity and returns the owner
//-----------------------------------------------------------
getEntityOwner = function(callee, caller) {
	var request = require("request");
	request({
	  url: IDM-URL + "/any/",
	  body: "{\"id\"" + callee + "}",
	  headers: {"Content-Type": "application/json", "Authorization: Bearer ": caller},
	  method: "POST"
	}, function (error, response, body) {
		if (error != null)
		{
			return "";
		} else {
			return extractOwner(body);

		}
	});

}



//------------------------ IDM ------------------------------
//  Gets information about an entity and returns the owner
//-----------------------------------------------------------
extractOwner = function(callee, caller) {
	Object.keys(o).forEach(function(key) {
		var val = o[key];
		if (val.hasOwnProperty("owner")){
			return val["owner"];
		}
	}); 
	return "";
}


//curl XPOST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json;charset=UTF-8" -d '{"id":"8b80b7a8.8825"}' http://localhost:8080/idm/any/













