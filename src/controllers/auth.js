/**
 * FOOTING.
 * Namespace: src/controllers
 * January 14, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

const JSONResponse = require('../models/JSONResponse.js');

module.exports = function(config) {

	// Initialize dependency variables from config file.
	const jwt = config.dependencies.jwt;
	const UIDGenerator = config.dependencies.UIDGenerator;
	// Initialize MongoDB database variable for accessing Mongo database (from config file).
	const mognoDB = config.databases.mongoDatabase;
	// Initialize UID generator.
	const UIDGen = new UIDGenerator(256);


	/**
	 * Authorizes user session and returns authentication token.
	 * @argument {User} user - user object that the authentication token will belong to.
	 * @argument {object} req - login request.
	 * @argument {object} res - login response.
	 */
	module.AuthorizeSession = function(user, req, res) {
		return new Promise(function(resolve, reject) {

			const ip = req.ip; // IP of computer requesting server. Used for logging.

			UIDGen.generate().then(function(uid) {
				const secret = uid;
				req.session._s = secret; // Store authentication token secret in session storage.
				req.session.save();

				return generateAuthenticationToken(user, secret);
			}).then(function(token) {
				return storeAuthenticationCookie(res, token);
			}).then(function(token) {

				req.session.user_id = user.getId(); // Store user id in session. 
				// Store authentication token in response object.
				const resData = {
					id: user.getId(),
					_a: token
				};
				resolve(resData);
			}, function(err) {
				const status = err.statusCode;
				if (status) {
					ServerLog(ip, "USER_ERROR", err.message);
					reject(err);
				} else {
					const responseError = new JSONResponse(500, "An error occured during authorization.");
					ServerLog(ip, "SERVER_ERROR", err.message);
					reject(responseError);
				}
			});

		});
	}


	/**
	 * Authenticate private requests using authentication token provided in header.
	 * @argument {object} req - request to be authenticated.
	 */
	module.AuthenticateRequest = function(req) {
		return new Promise(function(resolve, reject) {

			const ip = req.ip; // IP of computer requesting server. Used for logging.
			const data = req.body;
			const secret = req.session._s; // Authentication token secret needed for validation.
			const authHeader = req.headers.authorization;
			
			const authToken = getBearerValue(authHeader); // Strip authentication token from header value.
			const authCookieVal = req.cookies.a;

			if (authToken !== authCookieVal) {
				const header = "USER_ERROR";
				const errMessage = "Invalid authentication token.";
				ServerLog(ip, header, errMessage, true);
				return reject(new JSONResponse(401, errMessage));
			}

			jwt.verify(authToken, secret, function(err, decoded) {
				if (err) {
					const header = "SERVER_ERROR";
					ServerLog(ip, header, err);
					reject(Error("Error verifying authentication token."));
				} else {
					resolve(true);
				}
			});
		});
	}


	///////////////////////////////////////////////
	//////       HELPER  FUNCTIONS       /////////
	/////////////////////////////////////////////

	/**
	 * Generate authentication token.
	 * @argument {User} user - user object corresponding to authentication token.
	 * @argument {string} secret - secret for signing jwt token. 
	 */
	const generateAuthenticationToken = function(user, secret) {
		return new Promise(function(resolve, reject) {

			const id = user.getId();
			const tokenData = {
				id: id,
			};

			// Sign and resolve token.
			jwt.sign(tokenData, secret, {}, function(err, token) {
				if (err) {
					reject(Error("Error while signing token."));
				} else {
					resolve(token);
				}
			});
		});
	}


	/**
	 * Stores authentication token as cookie.
	 */
	const storeAuthenticationCookie = function(res, token) {
		return new Promise(function(resolve, reject) {
			const cookie_name = "a";
			res.cookie(cookie_name, token, {httpOnly: true}); // Set httpOnly on auth cookie.
			resolve(token);
		});
	}


	/**
	 * Parses bearer token value from authentication header string. 
	 */
	function getBearerValue(bearerToken) {
		const strs = bearerToken.split(" "); // Split bearer token string to retrieve token value.
		if (strs[0] !== 'Bearer') {
			return null;
		}
		return strs[1];
	}

	return module;
}