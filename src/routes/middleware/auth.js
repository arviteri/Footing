/**
 * BACKBONE.
 * Namespace: src/routes/middleware
 * January 14, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

const JSONResponse = require('../../models/JSONResponse.js');

module.exports = function(config) {

	// Initialize authentication handler.
	const authHandler = require('../../controllers/auth.js')(config);
	// Define authentication error response.
	const authError = new JSONResponse(401, "Unathenticated request.");

	const RequestAuthenticator = function(req, res, next) {

		const ip = req.ip; // IP of computer requesting server. Used for logging.

		authHandler.AuthenticateRequest(req).then(function(authenticated) {

			if (authenticated === true) {
				next();
			} else {
				ServerLog(ip, "USER_ERROR", "Unathenticated request.", true);
				return res.status(401).json(authError);
			}

		}, function(err) {
			ServerLog(ip, "USER_ERROR", err, true);
			res.status(401).json(authError);
		});
	}

	return RequestAuthenticator;
}