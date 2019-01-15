/**
 * BACKBONE.
 * Namespace: src/routes/api
 * January 15, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

const JSONResponse = require('../../models/JSONResponse');

module.exports = function(config, app, routes) {

	const RequestAuthenticator = require('../middleware/auth.js')(config);

	///////////////////////////////////////////////
	////     PUBLIC TEST ROUTE - W/O CSRUF    ////
	/////////////////////////////////////////////

	routes.unprotected.get('/status', function(req, res) {
		return res.status(200).json({"200":"OK"});
	});

	///////////////////////////////////////////////
	/////     PUBLIC TEST ROUTE - W CSRUF    /////
	/////////////////////////////////////////////

	routes.protected.post('/test/csrf', function(req, res) {
		return res.status(200).json({"200":"OK"});
	});

	///////////////////////////////////////////////
	/////   PRIVATE TEST ROUTE - W/O CSRUF   /////
	/////////////////////////////////////////////

	routes.unprotected.post('/test/auth', RequestAuthenticator, function(req, res) {
		return res.status(200).json({"200":"Authenticated"});
	});

	///////////////////////////////////////////////
	/////   PRIVATE TEST ROUTE - W CSRUF     /////
	/////////////////////////////////////////////

	routes.protected.post('/test/auth_csrf', RequestAuthenticator, function(req, res) {
		return res.status(200).json({"200":"Authenticated"});
	});

}