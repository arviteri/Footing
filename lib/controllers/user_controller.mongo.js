/**
 * User Controller
 */

const ObjectId = require('mongoose').Types.ObjectId;
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
		let users_collection = _config2.dep_preferences.MongoDB.users_collection;
		if (!users_collection) {
			users_collection = "users";
		}
		_config2.databases.application.collection(users_collection).findOne({email: email}, (err, result) => {
			if (err) {
				reject(new SystemError("MongoDB error on findOne."));
			} else if (!result) {
				reject(new ClientError("Email is not registered."))
			} else {
				const user = new User(result.email, result.password);
				user.id = result._id;
				resolve(user);
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
		let users_collection = _config2.dep_preferences.MongoDB.users_collection;
		if (!users_collection) {
			users_collection = "users";
		}
		_config2.databases.application.collection(users_collection).insertOne(user, (err) => {
			if (err) {
				reject(new ClientError("Email is already registered."));
			}
			resolve(user);
		});
	});
}

const removeUserFromDB = function(id) {
	return new Promise(function(resolve, reject) {
		let users_collection = _config2.dep_preferences.MongoDB.users_collection;
		if (!users_collection) {
			users_collection = "users";
		}
		_config2.databases.application.collection(users_collection).deleteOne({
			_id: ObjectId(id.toString())
		}, (err) => {
			if (err) {
				reject(new SystemError("Error deleting user from DB."));
			}
			resolve(true);
		});
	});
}


module.exports = UserController;