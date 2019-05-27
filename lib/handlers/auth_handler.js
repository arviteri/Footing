/**
 * Auth Handler
 */
const {ClientError, SystemError} = require('../models/errors.js');

var _config2;
class AuthHandler {
	constructor(config) {
		this.config = config;
		_config2 = config;
	}

	AuthorizeSession(user, req, res) {
		return new Promise(function(resolve, reject) {
			const UIDGen = new _config2.dependencies.uid_generator(256);
			UIDGen.generate().then((uid) => {
				req.session.user_id = user.getId();
				req.session._s = uid;
				req.session.save();
				return createAuthenticationToken(user, uid);
			}).then((token) => {
				res.cookie("a", token, { http_only: true });
				resolve(token);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	AuthenticateRequest(req) {
		return new Promise(function(resolve, reject) {
			const auth_secret = req.session._s;
			const auth_from_cookie = req.cookies.a;
			const auth_from_header = stripBearerToken(req.headers.authorization);
			if (auth_from_header !== auth_from_cookie) {
				ServerLog(req.ip, "USER_ERROR", "Invalid authentication token!", true);
				reject(new ClientError("Invalid authentication token."));
			}
			_config2.dependencies.jsonwebtoken.verify(auth_from_header, auth_secret, (err, decoded) => {
				if (err) {
					reject(new ClientError("Invalid authentication token."));
				}
				resolve(true);
			});
		});
	}
}

const stripBearerToken = (bearer_token) => {
	if (!bearer_token) {
		throw new ClientError("No authentication provided.");
	}
	const split = bearer_token.split(" ");
	if (split[0] !== 'Bearer' || !split[1]) {
		return null;
	}
	return split[1];
}


const createAuthenticationToken = function(user, secret) {
	return new Promise(function(resolve, reject) {
		const token_data = {
			id: user.getId()
		};
		_config2.dependencies.jsonwebtoken.sign(token_data, secret, {}, (err, token) => {
			if (err) {
				reject(new SystemError("Error signing JWT."));
			}
			resolve(token);
		});
	});
}

module.exports = AuthHandler