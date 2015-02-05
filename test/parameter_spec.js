// ------------------------------------------------
// Basic tets for the JavaScript REST PDP
// For more information about the used REST API testing framework frisby see http://frisbyjs.com/docs/api/
// ------------------------------------------------



var frisby = require('frisby');


// ------------------------------------------------
// Calls with wrong parameters
// ------------------------------------------------



// ------------------------------------------------
// Set policy no caller
// ------------------------------------------------
frisby.create('SetPolicyNoCaller')
  .post('http://127.0.0.1:3000/pdp/12/SI/setPolicy', {"target":123}, {json :true})
  .expectStatus(404)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({error:'No caller URL found'})
.toss();


// ------------------------------------------------
// Get policy no calller
// ------------------------------------------------
frisby.create('GetPolicyNoCaller')
  .get('http://127.0.0.1:3000/pdp/12/SI/getPolicy')
  .expectStatus(404)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({error:'No caller URL found'})
.toss();


// ------------------------------------------------
// Update policy no caller
// ------------------------------------------------
frisby.create('UpdatePolicyNoCaller')
  .post('http://127.0.0.1:3000/pdp/12/SI/updatePolicy', {"target":123}, {json :true})
  .expectStatus(404)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({error:'No caller URL found'})
.toss();


// ------------------------------------------------
// Delete policy no calller
// ------------------------------------------------
frisby.create('deletePolicyNoCaller')
  .get('http://127.0.0.1:3000/pdp/12/SI/deletePolicy')
  .expectStatus(404)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({error:'No caller URL found'})
.toss();
