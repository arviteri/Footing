/**
 * FOOTING.
 * Namespace: src/controllers
 * January 14, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

const User = require('../models/user.js');
const JSONResponse = require('../models/JSONResponse.js');

module.exports = function(config) {

	// Initialize dependency variables from config file.
	const bcrypt = config.dependencies.bcrypt;
	// Initialize MySQL database variable for accessing MySQL database (from config file).
	const sqlDB = config.databases.sql;


	/**
	 * Verifies user credentials against database. Returns user object w/ authentication token.
	 * @argument {object} req - request to login.
	 */
	module.Login = function(req) {
		return new Promise(function(resolve, reject) {

			const ip = req.ip; // IP of computer requesting server. Used for logging.
			const data = req.body;

			verifyInputRequirements(data).then(function(data) {
				return pullUserAccount(data);
			}).then(function(user) {
				const inputPassword = data.password;
				return verifyPassword(inputPassword, user);
			}).then(function(user) {	
				resolve(user);
			}, function(err) {
				const status = err.statusCode;
				if (status) {
					ServerLog(ip, "USER_ERROR", err.message);
					reject(err);
				} else {
					const responseError = new JSONResponse(500, "An error occured during authentication.");
					ServerLog(ip, "SERVER_ERROR", err.message);
					reject(responseError);
				}
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

			/* For security purposes, may want to strip data to prevent XSS and SQL Injection. */

			const email = data.email;
			const password = data.password;

			let error = new JSONResponse(422);
			if (!email) {
				error.setMessage("No email provided.");
				return reject(error);
			}
			if (!password) {
				error.setMessage("No password provided.");
				return reject(error);
			}

			resolve(data);
		});
	}

	/**
	 * Retrieves user account given email address.
	 * @argument {object} data - request body of login request. 
	 */
	const pullUserAccount = function(data) {
		return new Promise(function(resolve, reject) {

			const email = data.email;
			const userTableName = config.configurations.mysql.tables.users;
			const _query = "SELECT id, email, password FROM "+userTableName+" WHERE email = ?";

			let error = new JSONResponse(401);
			sqlDB.query(_query, [email], function(err, rows, fields) {

				if (err) {
					error.setMessage("Email is not registered.");
					reject(error);
				}

				/* Create User object from DB data if found */
				if (rows[0]) {
					const userData = rows[0];
					const user = createUserFromSQLData(userData);
					resolve(user);
				} else {
					error.setMessage("Email is not registered.");
					reject(error);
				}

			});

		});
	}


	/**
	 * Verify password input matches that of registered user.
	 * @argument {string} inputPassword - password from login request.
	 * @argument {User} - registered user to verify password against.
	 */
	const verifyPassword = function(inputPassword, user) {
		return new Promise(function(resolve, reject) {

			const encryptedPassword = user.getPassword();
			bcrypt.compare(inputPassword, encryptedPassword, function(err, res) {

				if (err) {
					reject(Error("Error while verifying password."));
				}

				/* Resolve user object if passwords match. */
				if (res === true) {
					resolve(user);
				}

				reject(new JSONResponse(422, "Invalid email or password."));

			});
		});
	}


	/**
	 * Creates user object given user entity from SQL database.
	 * @argument {SQL Response Object} - Response data from SQL query. 
	 */
	function createUserFromSQLData(data) {

		const id = data.id;
		const email = data.email;
		const password = data.password;

		let user = new User(email, password);
		user.setId(id);

		return user;
	}

	return module;
}