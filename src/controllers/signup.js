/**
 * BACKBONE.
 * Namespace: src/controllers
 * January 14, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

// Require object models.
const User = require('../models/user.js');
const JSONResponse = require('../models/JSONResponse.js');

module.exports = function(config) {

	// Initialize dependency variables from config file.
	const bcrypt = config.dependencies.bcrypt;
	// Initialize MySQL database variable for accessing MySQL database (from config file).
	const sqlDB = config.databases.sql;


	/**
	 * Adds a new user to the database given details provided by request body.
	 * @argument {object} req - request to signup. 
	 */
	module.Signup = function(req) {
		return new Promise(function(resolve, reject) {

			const ip = req.ip; // IP of computer requesting server. Used for logging.
			const data = req.body;

			verifyInputRequirements(data).then(function(data) {
				return verifyDataValues(data);
			}).then(function(data) {
				const password = data.password; // Raw password.
				return encryptPassword(data, password);
			}).then(function(data) {

				const email = data.email;
				const password = data.password;
				const newUser = new User(email, password);

				return persistUserToDB(newUser);
			}).then(function(data) {
				resolve(data);
			}, function(err) {
				
				const header = "USER_ERROR";
				const jsonMessage = err.message;

				if (jsonMessage) {
					ServerLog(ip, header, jsonMessage);
				} else {
					ServerLog(ip, header, err);
				}

				reject(err);
			}).catch(function(fErr) {
				
				const header = "SERVER_ERROR";
				ServerLog(ip, header, fErr);

				const responseError = new JSONResponse(500, "An error occured during registration.");
				reject(responseError);
			});
		});
	}


	///////////////////////////////////////////////
	//////       HELPER  FUNCTIONS       /////////
	/////////////////////////////////////////////

	/**
	 * Verifies that the request body contains all necessary inputs.
	 * @argument {object} data - request body of the signup request.
	 */
	const verifyInputRequirements = function(data) {
		return new Promise(function(resolve, reject) {

			const email = data.email;
			const password = data.password;
			const confirmPassword = data.confirmPassword;

			let error = new JSONResponse(400);
			if (!email) {
				error.setMessage("No email provided.");
				return reject(error);
			}
			if (!password) {
				error.setMessage("No password provided.");
				return reject(error);
			}
			if (!confirmPassword) {
				error.setMessage("No input provided to confirm password.");
				return reject(error);
			}

			resolve(data);
		});
	}

	/**
	 * Verifies that the data meets requirements.
	 * @argument {object} data - request body of the signup request.
	 */
	const verifyDataValues = function(data) {
		return new Promise(function(resolve, reject) {

			const email = data.email;
			const password = data.password;
			const confirmPassword = data.confirmPassword;

			let error = new JSONResponse(400);
			if (!isValidEmail(email)) { // Open for implementation.
				error.setMessage("Invalid email address.");
				return reject(error);
			}
			if (!isValidPassword(password)) { // Open for implementation.
				error.setMessage("Invalid password. Please meet the password requirements.");
				reject(error);
			}
			if (confirmPassword !== password) {
				error.setMessage("Passwords do not match.");
				return reject(error);
			}

			resolve(data);
		});
	}


	/**
	 * Encrypts password using bcrypt.
	 * @argument {object} userData - request body of signup request.
	 * @argument {string} password - password to be encrypted.
	 */
	const encryptPassword = function(userData, password) {
		return new Promise(function(resolve, reject) {

			const saltRounds = config.configurations.bcrypt.saltRounds;

			bcrypt.genSalt(saltRounds, function(err, salt) {
				
				if (err) {
					reject(Error("Error creating password salt."));
				}

				bcrypt.hash(password, salt, function(err, hash) {
					
					if (err) {
						reject(Error("Error creating password hash."));
					}

					userData.password = hash; // Set the password to encrypted hash.
					resolve(userData);
				});
			});
		});
	}

	/**
	 * Persists user object to database.
	 * @argument {User} user - user object to be persisted to database.
	 */
	const persistUserToDB = function(user) {
		return new Promise(function(resolve, reject) {

			const email = user.getEmail();
			const password = user.getPassword(); // Password hash.
			const userTableName = config.configurations.mysql.tables.users;
			const _query = "INSERT INTO "+userTableName+" (email, password) VALUES (?, ?)";

			let error = new JSONResponse(400);
			sqlDB.query(_query, [email, password], function(err, rows, fields) {
				
				if (err) {
					error.setMessage("Email is already registered.");
					reject(error);
				}

				resolve(user);
			});
		});
	}

	/**
	 * Checks if email is valid.
	 */
	function isValidEmail(email) {
		// Open for implementation...

		/* For security purposes, may want to strip data to prevent XSS and SQL Injection. */

		return true;
	}

	/**
	 * Checks if password is valid.
	 */
	function isValidPassword(password) {
		// Open for implementation...

		/* For security purposes, may want to strip data to prevent XSS and SQL Injection. */

		return true;
	}

	return module;
}
