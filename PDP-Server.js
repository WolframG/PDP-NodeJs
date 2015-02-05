//-----------------------------------------------------------------
// 				PDP server (Fokus)
//-----------------------------------------------------------------

//---------------------------- Init -------------------------------------
var express = require('express');
var bodyParser = require('body-parser');

var pipSSC = require('./routes/pipGeneral');
pipSSC.init('localhost', 27017, 'COMPOSE-PIP', 'SSC');
var pipSI = require('./routes/pipGeneral');
pipSI.init('localhost', 27017, 'COMPOSE-PIP', 'SI');
var pipSO = require('./routes/pipSO');
pipSO.init('localhost', 27017, 'COMPOSE-PIP', 'SO');
var pipGeneral = require('./routes/pipGeneral');
pipGeneral.init('localhost', 27017, 'COMPOSE-PIP', 'ALL');

var app = express();
var PORT = 3000;

//----------------------------Make the PIP testable -------------------------------------
if (process.argv[2] == "-test"){
	console.log("----- Run in Test mode! ----- \nNo persistent storage!!");
	pipSSC.testMode();
	pipSI.testMode();
}


//----------------------------------------------------------------------------
//---------------------------- Rest API  -------------------------------------
//----------------------------------------------------------------------------


//------------------------PDP SSC--------------------------------
// Set policies for a service-source-code
// callee == service-source-code
// Caller == user; callee == service source code id (SSC); policy  as body (JSON)
//-----------------------------------------------------------
app.use(bodyParser.json());
app.post('/pdp/:callee/SSC/setPolicy', pipSSC.storePolicy);

//------------------------PDP SSC--------------------------------
// Updates policies for a service-source-code
// callee == service-source-code
// Caller == user; callee == service source code id (SSC); policy as body (JSON)
//-----------------------------------------------------------
app.post('/pdp/:callee/SSC/updatePolicy', pipSSC.updatePolicy);

//------------------------PDP SSC--------------------------------
// Get policies for a service-source-code
// callee == service-source-code
// Caller == user; callee == service source code id (SSC);
//-----------------------------------------------------------
app.get('/pdp/:callee/SSC/getPolicy', pipSSC.getPolicy);

//------------------------PDP SSC--------------------------------
// Delete policy for a service source-code
// callee == service-source-code
// Caller == user; callee == service instance id;
//-----------------------------------------------------------
app.get('/pdp/:callee/SI/deletePolicy', pipSI.deletePolicy);



//------------------------PDP SI--------------------------------
// Set policies for a service instance
// callee == service-source-code
// Caller == user; callee == service instance id; policy as body (JSON)
//-----------------------------------------------------------
app.post('/pdp/:callee/SI/setPolicy', pipSI.storePolicy);

//------------------------PDP SI--------------------------------
// Updates policies for a service instance
// callee == service-source-code
// Caller == user; callee == service instance id; policy  as body (JSON)
//-----------------------------------------------------------
app.post('/pdp/:callee/SI/updatePolicy', pipSI.updatePolicy);

//------------------------PDP SI--------------------------------
// Get policies for a service instance
// callee == service-source-code
// Caller == user; callee == service instance id;
//-----------------------------------------------------------
app.get('/pdp/:callee/SI/getPolicy', pipSI.getPolicy);

//------------------------PDP SI--------------------------------
// Get policies for a service instance
// callee == service-source-code
// Caller == user; callee == service instance id;
//-----------------------------------------------------------
app.get('/pdp/:callee/SI/deletePolicy', pipSI.deletePolicy);



//------------------------PDP SO --------------------------------
// Updates policies for a service instance
// callee == service-source-code
// Caller == user; callee == service instance id; policy  as body (JSON)
//-----------------------------------------------------------
app.post('/pdp/:callee/SO/updatePolicy', pipSO.updatePolicy);

//------------------------PDP SO --------------------------------
// Get policies for a service instance
// callee == service-source-code
// Caller == user; callee == service instance id;
//-----------------------------------------------------------
app.get('/pdp/:callee/SO/getPolicy', pipSO.getPolicy);



//------------------------PDP General--------------------------------
// Set policies for a service instance
// callee == service-source-code
// Caller == user; callee == service instance id; policy as body (JSON)
//-----------------------------------------------------------
app.post('/pdp/:callee/setPolicy', pipGeneral.storePolicy);

//------------------------PDP General--------------------------------
// Updates policies for a service instance
// callee == service-source-code
// Caller == user; callee == service instance id; policy  as body (JSON)
//-----------------------------------------------------------
app.post('/pdp/:callee/updatePolicy', pipGeneral.updatePolicy);

//------------------------PDP General--------------------------------
// Get policies for a service instance
// callee == service-source-code
// Caller == user; callee == service instance id;
//-----------------------------------------------------------
app.get('/pdp/:callee/getPolicy', pipGeneral.getPolicy);

//------------------------PDP General--------------------------------
// Get policies for a service instance
// callee == service-source-code
// Caller == user; callee == service instance id;
//-----------------------------------------------------------
app.get('/pdp/:callee/deletePolicy', pipGeneral.deletePolicy);




app.listen(PORT);
console.log('Listening on port 3000...');







// Set policy --> token, service-id, policy

// Update policy --> token, service-id, policy

// Get policy --> token, service-id


// Get policies --> token, [service-id]

// Set policy --> token, [service-id, policy]

// Update policy --> token, [service-id, poliy]



// Check if person is allowed to change, get, set the policy; perform acction




