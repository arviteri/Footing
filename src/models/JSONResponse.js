/**
 * FOOTING.
 * Namespace: src/models
 * January 14, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

class JSONResponse {

	constructor(statusCode, message) {
		this.statusCode = statusCode;
		this.message = message;
	}

	getStatusCode() {
		return this.statusCode;
	}

	setStatusCode(statusCode) {
		this.statusCode = statusCode;
		return;
	}

	getMessage() {
		return this.message;
	}

	setMessage(message) {
		this.message = message;
	}

}

module.exports = JSONResponse;