// ------------------------------------------------
// Basic tets for the JavaScript REST PDP
// For more information about the used REST API testing framework frisby see http://frisbyjs.com/docs/api/
// ------------------------------------------------



var frisby = require('frisby');


// ------------------------------------------------
// Order is relevant!! This is a whole scenario (sequence of calls)
// ------------------------------------------------



// ------------------------------------------------
// Set policy for "12"
// ------------------------------------------------
frisby.create('SetPolicy')
  .post('http://127.0.0.1:3000/pdp/12/SI/setPolicy?caller=507', {"target":123}, {json :true})
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON('', {})
.toss();

// ------------------------------------------------
// Set policy for "12" (already exists)
// ------------------------------------------------
frisby.create('SetPolicy2')
  .post('http://127.0.0.1:3000/pdp/12/SI/setPolicy?caller=507', {"target":123}, {json :true})
  .expectStatus(500)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({"error" : "Could not store Policy. Already created before?"})
.toss();



// ------------------------------------------------
// Get policy for "12"
// ------------------------------------------------
frisby.create('GetPolicy')
  .get('http://127.0.0.1:3000/pdp/12/SI/getPolicy?caller=507')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON([{"target":123}])
.toss();


// ------------------------------------------------
// Update policy for "12"
// ------------------------------------------------
frisby.create('UpdatePolicy')
  .post('http://127.0.0.1:3000/pdp/12/SI/updatePolicy?caller=507', {"target":456}, {json :true})
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON('', {})
.toss();



// ------------------------------------------------
// Get updated policy for "12"
// ------------------------------------------------
frisby.create('GetPolicy2')
  .get('http://127.0.0.1:3000/pdp/12/SI/getPolicy?caller=507')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON([{"target":456}])
.toss();



// ------------------------------------------------
// Delete policy for "12"
// ------------------------------------------------
frisby.create('DeletePolicy')
  .get('http://127.0.0.1:3000/pdp/12/SI/deletePolicy?caller=507')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({})
.toss();



// ------------------------------------------------
// Get deleted policy for "12"
// ------------------------------------------------
frisby.create('GetPolicy3')
  .get('http://127.0.0.1:3000/pdp/12/SI/getPolicy?caller=507')
  .expectStatus(404)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({})
.toss();


// ------------------------------------------------
// Set policy for "12" (after removing)
// ------------------------------------------------
frisby.create('SetPolicy')
  .post('http://127.0.0.1:3000/pdp/12/SI/setPolicy?caller=507', {"target":123}, {json :true})
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON('', {})
.toss();
