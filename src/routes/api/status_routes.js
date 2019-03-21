/**
 * API Status Routes
 */

module.exports = function(app, config, routes, RequestAuthenticator) {

	/* Public test route - w/o CSURF */
	routes.unprotected.get('/status', function(req, res) {
		return res.status(200).json({"200":"OK."});
	});

	/* Public test route - w/ CSURF */
	routes.protected.post('/test/csrf', function(req, res) {
		return res.status(200).json({"200":"OK."});
	});

	/* Private test route - w/o CSURF */
	routes.unprotected.post('/test/auth', RequestAuthenticator, function(req, res) {
		return res.status(200).json({"200":"Authenticated."});
	});

	
	/* Private test route - w CSURF */
	routes.protected.post('/test/auth_csrf', RequestAuthenticator, function(req, res) {
		return res.status(200).json({"200":"Authenticated."});
	});

}