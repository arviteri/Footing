/**
 * User Routes
 */

const UserController = require('../../controllers/user_controller.js');
const AuthHandler = require('../../handlers/auth_handler.js');
const RequestAuthenticator = require('../middleware/auth_middleware.js');
const {ClientError, SystemError} = require('../../models/errors.js');

const handle_error = (err, code, res) => {
	if (err instanceof ClientError) {
		return res.status(code).json({
			error: err.message
		});
	} else {
		return res.status(500).json({500: "Internal Server Error."});
	}
}

module.exports = (app, config, routes) => {

	const userController = new UserController(config);
	const authHandler = new AuthHandler(config);
	const requestAuthenticator = RequestAuthenticator(authHandler);

	/**
	 * Return CSRF Token.
	 */
	routes.protected.get(config.routes.csrf, function(req, res) {
		return res.status(200).json({
			_csrf: req.csrfToken()
		})
	});

	/**
	 * Signup.
	 */
	routes.protected.post(config.routes.signup, function(req, res) {
		const email = req.body.email;
		const password = req.body.password;
		const conf_pwd = req.body.conf_password;
		userController.Signup(email, password, conf_pwd).then((user) => {
			return res.status(200).json({200: "OK"});
		}).catch((err) => {
			handle_error(err, 422, res);
		});
	});

	/**
	 * Login
	 */
	routes.protected.post(config.routes.login, function(req, res) {
		var new_csrf_token;
		const email = req.body.email;
		const password = req.body.password;
		userController.Login(email, password).then((user) => {
			req.session.regenerate((err) => {
				if (err) {
					return res.status(500).json({500: "Internal Server Error."});
				}
				authHandler.AuthorizeSession(user, req, res).then((token) => {
					return res.status(200).json({
						_a: token,
						_csrf: req.csrfToken()
					});
				}).catch((err) => handle_error(err, 401, res));
			});
		}).catch((err) => handle_error(err, 401, res));
	});


	/**
	 * Delete User.
	 */
	routes.protected.post(config.routes.delete_account, requestAuthenticator, function(req, res) {
		userController.DeleteUser(req.session.user_id).then(() => {
			req.session.destroy();
			return res.status(200).json({200: "OK"});
		}).catch((err) => handle_error(err, 401, res));
	});

}