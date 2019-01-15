/**
 * BACKBONE.
 * Namespace: src/routes/api
 * January 15, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

const JSONResponse = require('../../models/JSONResponse');

module.exports = function(config, app, routes) {

	///////////////////////////////////////////////
	/////     PUBLIC  ROUTES - W/O CSRUF     /////
	/////////////////////////////////////////////

	/* Define public routes that do not require CSRF protection below. */
	/** Example...
	
		routes.unprotected.post('/auth_without_CSRF', function(res, req) {
			
			return res.status(200).json({"200":"Unathenticated"});
		});

	 */



	///////////////////////////////////////////////
	/////      PUBLIC  ROUTES - W CSRUF      /////
	/////////////////////////////////////////////

	/* Define public routes that require CSRF protection below. */
	/** Example...
	
		routes.protected.post('/auth_without_CSRF', function(res, req) {
			
			return res.status(200).json({"200":"Unathenticated"});
		});

	 */


}