/**
 * BACKBONE.
 * Namespace: src/routes/api
 * January 14, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

const JSONResponse = require('../../models/JSONResponse');

module.exports = function(config, app, routes) {

	const RequestAuthenticator = require('../middleware/auth.js')(config);

	///////////////////////////////////////////////
	/////    PRIVATE  ROUTES - W/O CSRUF     /////
	/////////////////////////////////////////////

	/* Define private routes that do not CSRF protection below. */
	/** Example...
	
		routes.unprotected.post('/auth_without_CSRF', RequestAuthethenticator, function(res, req) {
			
			return res.status(200).json({"200":"Authenticated"});
		});

	 */




	///////////////////////////////////////////////
	/////     PRIVATE  ROUTES - W CSRUF      /////
	/////////////////////////////////////////////

	/* Define private routes that require CSRF protection below. */
	/** Example...
	
		routes.protected.post('/auth_with_CSRF', RequestAuthethenticator, function(res, req) {
			
			return res.status(200).json({"200":"Authenticated"});
		});

	 */
}