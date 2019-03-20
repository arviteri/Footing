/**
 * Auth Middleware.
 */

const {ClientError} = require('../../models/errors.js');

module.exports = function(authHandler) {
	
	const RequestAuthenticator = function(req, res, next) {
		authHandler.AuthenticateRequest(req).then((authenticated) => {
			next();
		}).catch((err) => {
			if (err instanceof ClientError) {
				return res.status(401).json({
					error: err.message
				});
			} else {
				return res.status(500).json({500: "Internal Server Error."});
			}
		});
	}

	return RequestAuthenticator;
};