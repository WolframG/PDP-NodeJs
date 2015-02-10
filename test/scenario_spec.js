// ------------------------------------------------
// Basic tets for the JavaScript REST PDP
// For more information about the used REST API testing framework frisby see http://frisbyjs.com/docs/api/
// ------------------------------------------------



var frisby = require('frisby');


// ------------------------------------------------
// Order is relevant!! This is a whole scenario (sequence of calls)
// ------------------------------------------------

console.log("INIT test");
var token ="eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIzOWEwZjg4NS05ZDRlLTRiNmItYTM5Ni0xYjgwYzk5ZjhmNzkiLCJzdWIiOiJjOGU3YjQxMi04OTI4LTQ3MjAtYjc0ZS02MDMxMDQ3ZDNhZmYiLCJzY29wZSI6WyJzY2ltLnVzZXJpZHMiLCJwYXNzd29yZC53cml0ZSIsImNsb3VkX2NvbnRyb2xsZXIud3JpdGUiLCJvcGVuaWQiLCJjbG91ZF9jb250cm9sbGVyLnJlYWQiXSwiY2xpZW50X2lkIjoidm1jIiwiY2lkIjoidm1jIiwidXNlcl9pZCI6ImM4ZTdiNDEyLTg5MjgtNDcyMC1iNzRlLTYwMzEwNDdkM2FmZiIsInVzZXJfbmFtZSI6InRlc3QyIiwiZW1haWwiOiJ0ZXN0MkBjb21wb3NlLmNvbSIsImlhdCI6MTQyMzU3NTM2MCwiZXhwIjoxNDIzNjE4NTYwLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvdWFhL29hdXRoL3Rva2VuIiwiYXVkIjpbInNjaW0iLCJvcGVuaWQiLCJjbG91ZF9jb250cm9sbGVyIiwicGFzc3dvcmQiXX0.ZjahkzXopRTZooFINl4lcPE-HoFmplOlryVygR31kNA";

var tokenE ="eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMDNhMzViOS1kNzE3LTQxNzEtODNkMi03MWQyYjFlMzk4YWQiLCJzdWIiOiJmM2MzZWJmNC1kM2UxLTQ2NDgtOWYzNy0zNTVmMTUzMDA4NTAiLCJzY29wZSI6WyJzY2ltLnVzZXJpZHMiLCJwYXNzd29yZC53cml0ZSIsImNsb3VkX2NvbnRyb2xsZXIud3JpdGUiLCJvcGVuaWQiLCJjbG91ZF9jb250cm9sbGVyLnJlYWQiXSwiY2xpZW50X2lkIjoidm1jIiwiY2lkIjoidm1jIiwidXNlcl9pZCI6ImYzYzNlYmY0LWQzZTEtNDY0OC05ZjM3LTM1NWYxNTMwMDg1MCIsInVzZXJfbmFtZSI6InRlc3RFIiwiZW1haWwiOiJ0ZXN0RUBjb21wb3NlLmNvbSIsImlhdCI6MTQyMzU3NTM5NiwiZXhwIjoxNDIzNjE4NTk2LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvdWFhL29hdXRoL3Rva2VuIiwiYXVkIjpbInNjaW0iLCJvcGVuaWQiLCJjbG91ZF9jb250cm9sbGVyIiwicGFzc3dvcmQiXX0.xZYSInqlahD7oJfA1HCZVeZ9pjt8ms5bk5oNsEc7TFU";

// ------------------------------------------------
// Set policy for "12"
// ------------------------------------------------
frisby.create('SetPolicy')
  .post('http://127.0.0.1:3000/pdp/test2/SI/setPolicy?caller='+token, {"target":123}, {json :true})
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON('', {})
.toss();

// ------------------------------------------------
// Set policy for "12" (already exists)
// ------------------------------------------------
frisby.create('SetPolicy2')
  .post('http://127.0.0.1:3000/pdp/test2/SI/setPolicy?caller='+token, {"target":123}, {json :true})
  .expectStatus(500)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({"error" : "Could not store Policy. Already created before?"})
.toss();



// ------------------------------------------------
// Get policy for "12"
// ------------------------------------------------
frisby.create('GetPolicy')
  .get('http://127.0.0.1:3000/pdp/test2/SI/getPolicy?caller='+token)
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON([{"target":123}])
.toss();


// ------------------------------------------------
// Update policy for "12"
// ------------------------------------------------
frisby.create('UpdatePolicy')
  .post('http://127.0.0.1:3000/pdp/test2/SI/updatePolicy?caller='+token, {"target":456}, {json :true})
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON('', {})
.toss();



// ------------------------------------------------
// Get updated policy for "12"
// ------------------------------------------------
frisby.create('GetPolicy2')
  .get('http://127.0.0.1:3000/pdp/test2/SI/getPolicy?caller='+token)
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON([{"target":456}])
.toss();



// ------------------------------------------------
// Delete policy for "12"
// ------------------------------------------------
frisby.create('DeletePolicy')
  .get('http://127.0.0.1:3000/pdp/test2/SI/deletePolicy?caller='+token)
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({})
.toss();



// ------------------------------------------------
// Get deleted policy for "12"
// ------------------------------------------------
frisby.create('GetPolicy3')
  .get('http://127.0.0.1:3000/pdp/test2/SI/getPolicy?caller='+token)
  .expectStatus(404)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({})
.toss();


// ------------------------------------------------
// Set policy for "12" (after removing) (no user)
// ------------------------------------------------
frisby.create('SetPolicyNU')
  .post('http://127.0.0.1:3000/pdp/test2/SI/setPolicy?caller='+"asdasd", {"target":123}, {json :true})
  .expectStatus(500)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON('', {})
.toss();


// ------------------------------------------------
// Set policy for "12" (after removing) (wrong user)
// ------------------------------------------------
frisby.create('SetPolicyWU')
  .post('http://127.0.0.1:3000/pdp/test2/SI/setPolicy?caller='+tokenE, {"target":123}, {json :true})
  .expectStatus(500)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON('', {})
.toss();


// ------------------------------------------------
// Set policy for "12" (after removing)
// ------------------------------------------------
frisby.create('SetPolicy')
  .post('http://127.0.0.1:3000/pdp/test2/SI/setPolicy?caller='+token, {"target":123}, {json :true})
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON('', {})
.toss();





