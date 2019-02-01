/**
 * FOOTING.
 * Namespace: src/controllers
 * January 29, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

const User = require('../models/user.js');
const JSONResponse = require('../models/JSONResponse.js');

module.exports = function(config) {
	
	// Initialize MySQL database variable for accessing MySQL database (from config file).
	const sqlDB = config.databases.sql;

	/**
	 * Deletes user account from MySQL database. 
	 * Obtains user id from session id. Deletes user from DB. 
	 * @argument {object} req - request to login.
	 */
	module.DeleteAccount = function(req) {
		return new Promise(function(resolve, reject) {
			const ip = req.ip; // IP of computer requesting server. Used for logging.
			const user_id = req.session.user_id;
			removeUserFromDB(user_id).then(function(res) {
				resolve(res);
			}, function(err) {
				const status = err.statusCode;
				if (status) {
					ServerLog(ip, "USER_ERROR", err.message);
					reject(err);
				} else {
					const responseError = new JSONResponse(500, "An error occured during registration.");
					ServerLog(ip, "SERVER_ERROR", err.message);
					reject(responseError);
				}
			})
		});
	}

	///////////////////////////////////////////////
	//////       HELPER  FUNCTIONS       /////////
	/////////////////////////////////////////////

	/**
	 * Deletes user from database.
	 * @argument {int} id - id of the user.
	 */
	const removeUserFromDB = function(id) {
		return new Promise(function(resolve, reject) {

			const userTableName = config.configurations.mysql.tables.users;
			const _query = "DELETE FROM "+userTableName+" WHERE id = ?";

			let error = new JSONResponse(401);
			sqlDB.query(_query, [id], function(err, rows, fields) {
				if (err) {
					reject(err);
				} else {
					resolve(true);
				}
			});
		});
	}


	return module;
}