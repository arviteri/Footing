/**
 * Error models.
 *
 * Error models are used to distinguish errors to return correct response.
 */

class ClientError extends Error {
	constructor(message) {
		super(message);
	}
}

class SystemError extends Error {
	constructor(message) {
		super(message);
	}
}

module.exports = {
	ClientError: ClientError,
	SystemError: SystemError
};