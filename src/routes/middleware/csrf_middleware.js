/**
 * CSRF Middleware.
 */

module.exports = function(config) {
	
	const CSRF_middleware = function(req, res, next) {
		const csurf = config.dependencies.csurf(config.dep_preferences.csurf.settings);
		csurf(req, res, (err) => {
			if (err) {
				ServerLog(req.ip, "USER_ERROR", "Invalid CSRF token.", true);
				return res.status(403).json({
					error: "Invalid CSRF token."
				});
			}
			next();
		});
	}

	return CSRF_middleware;
};