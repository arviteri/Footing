/**
 * User Controller
 */

const {ClientError, SystemError} = require('../models/errors.js');
const User = require('../models/user.js');

var _config2;
class UserController {
	constructor(config) {
		this.config = config;
		_config2 = config;
	}

	DeleteUser(user_id) {
		return new Promise(function(resolve, reject) {
			removeUserFromDB(user_id).then((res) => {
				resolve(res);
			}).catch((err) => {
				reject(err);
			})
		});
	}

	Login(email, password) {
		return new Promise(function(resolve, reject) {
			let _user;
			verifyLoginData(email, password);
			getUserFromDB(email).then((user) => {
				_user = user;
				return verifyPassword(password, user.password);
			}).then(() => {
				resolve(_user);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	Signup(email, password, conf_password) {
		return new Promise(function(resolve, reject) {
			verifySignupData(email, password, conf_password);
			encryptPassword(password).then((hash) => {
				let new_user = new User(email, hash);
				return persistUserToDB(new_user);
			}).then((user) => {
				resolve(user);
			}).catch((err) => {
				reject(err);
			});
		});
	}
}


const verifyLoginData = (email, password) => {
	if (!email) {
		throw new ClientError("No email provided.");
	}
	if (!password) {
		throw new ClientError("No password provided.");
	}
	// May want to add data sanitization here.
}


const verifyPassword = function(pass_input, hash) {
	return new Promise(function(resolve, reject) {
		_config2.dependencies.bcrypt.compare(pass_input, hash, (err, res) => {
			if (err) {
				reject(new SystemError("Error verifying password."));
			}
			if (res === true) {
				resolve(true);
			}
			reject(new ClientError("Invalid password."));
		});
	});
}


const getUserFromDB = function(email) {
	return new Promise(function(resolve, reject) {
		let user_table = _config2.dep_preferences.MySQL.user_table
		if (!user_table) {
			user_table = "Users";
		}
		const _query = "SELECT id, email, password FROM "+user_table+" WHERE email = ?";
		_config2.databases.application.query(_query, [email], (err, rows, fields) => {
			if (err) {
				reject(new SystemError("MySQL error."));
			}
			if (rows[0]) {
				const user = new User(rows[0].email, rows[0].password);
				user.id = rows[0].id;
				resolve(user);
			} else {
				reject(new ClientError("Email is not registered."));
			}
		});
	});
}


const verifySignupData = (email, password, conf_password) => {
	if (!email) {
		throw new ClientError("No email provided.");
	}
	if (!password) {
		throw new ClientError("No password provided.");
	}
	if (!conf_password) {
		throw new ClientError("No input provided to confirm password.");
	}
	// Functionality for validating email structure.
	// Functionality for validating password requirements.
	if (conf_password !== password) {
		throw new ClientError("Passwords do not match.");
	}
	// May want to add data sanitization here.
}

const encryptPassword = function(password) {
	return new Promise(function(resolve, reject) {
		const salt_rounds = parseInt(_config2.dep_preferences.bcrypt.salt_rounds);
		_config2.dependencies.bcrypt.genSalt(salt_rounds, (err, salt) => {
			if (err) {
				reject(new SystemError("Error generating password salt."));
			}
			_config2.dependencies.bcrypt.hash(password, salt, (err, hash) => {
				if (err) {
					reject(new SystemError("Error generating password hash."));
				}
				resolve(hash);
			});
		});
	});
}


const persistUserToDB = function(user) {
	return new Promise(function(resolve, reject) {
		let user_table = _config2.dep_preferences.MySQL.user_table
		if (!user_table) {
			user_table = "Users";
		}
		const _query = "INSERT INTO "+user_table+" (email, password) VALUES (?, ?)";
		_config2.databases.application.query(_query, [user.email, user.password], (err, rows, fields) => {
			if (err) {
				if (err.code === "ER_DUP_ENTRY") {
					reject(new ClientError("Email is already registered"));
				}
				reject(new SystemError("MySQL error while persisting user to DB."));
			}
			resolve(user);
		});
	});
}

const removeUserFromDB = function(id) {
	return new Promise(function(resolve, reject) {
		let user_table = _config2.dep_preferences.MySQL.user_table
		if (!user_table) {
			user_table = "Users";
		}
		const _query = "DELETE FROM "+user_table+" WHERE id = ?";
		_config2.databases.application.query(_query, [id], (err, rows, fields) => {
			if (err) {
				reject(new SystemError("MySQL error while deleting user from DB."));
			}
			resolve(true);
		});
	});
}


module.exports = UserController;