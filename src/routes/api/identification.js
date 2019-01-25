/**
 * FOOTING.
 * Namespace: src/routes/api
 * January 12, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

const JSONResponse = require('../../models/JSONResponse.js');

module.exports = function(config, app, routes) {

 	const signupHandler = require('../../controllers/signup.js')(config);
 	const loginHandler = require('../../controllers/login.js')(config);
 	const authHandler = require('../../controllers/auth.js')(config);

	///////////////////////////////////////////////
	////       IDENTIFICATION  ROUTES         ////
	/////////////////////////////////////////////

	/**
	 * Generate CSRF token for making requests.
	 */
	routes.protected.get('/c/tkn', function(req, res) {
		const token = req.csrfToken();
	 	const resObj = {
	 		_csrf: token
	 	};
	 	return res.status(200).json(resObj);
	});

	/**
	 * Signup
	 * View 'src/controllers/signup.js' for signup implementation.
	 */
	routes.protected.post('/signup', function(req, res) {
		
		signupHandler.Signup(req).then(function(result) {

			return res.status(200).json(new JSONResponse(200, "success"));
		}, function(err) {
			const statusCode = err.statusCode ? err.statusCode : 400;
			return res.status(statusCode).json(err);
		});

	});

	/**
	 * Login
	 * View 'src/controllers/login.js' for login implementation.
	 */
	routes.protected.post('/login', function(req, res) {

		const ip = req.ip; // IP of computer requesting server. Used for logging.

		loginHandler.Login(req).then(function(result) {

			const user = result;
			// Regenerate session after credentials are verified.
			req.session.regenerate(function(err) {
				if (err) {
					const header = "USER_ERROR";
					const errMessage = "Invalid session.";
					ServerLog(ip, header, err, true);
					return res.status(400).json(new JSONResponse(400, errMessage));
				} else {
					// Generate authentication token for the user.
					authHandler.AuthorizeSession(user, req, res).then(function(result) {
						const newCSRF = req.csrfToken();
						result._csrf = newCSRF;
						return res.status(200).json(result);
					}, function(err) {
						return res.status(401).json(err);
					});
				}
			});
		}, function(err) {
			const statusCode = err.statusCode ? err.statusCode : 400;
			return res.status(statusCode).json(err);
		});

	});

}