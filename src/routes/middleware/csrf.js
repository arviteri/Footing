/**
 * FOOTING.
 * Namespace: src/routes/middleware
 * January 14, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

const JSONResponse = require('../../models/JSONResponse');

module.exports = function(config) {

	const csurf = config.dependencies.csurf();
	const csrf_protection = config.configurations.csurf.protection;

	const CSRFProtection = function(req, res, next) {
		const ip = req.ip;
		csurf(req, res, function(err) {
			if (err) {
				
				const errorMessage = "Invalid CSRF token.";
				const header = "USER_ERROR";
				const responseError = new JSONResponse(403, errorMessage);

				ServerLog(ip, header, errorMessage, true);
				return res.status(403).json(responseError);
			} else {
				next();
			}
		});
	}

	return CSRFProtection;
}