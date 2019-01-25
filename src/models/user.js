/**
 * FOOTING.
 * Namespace: src/models
 * January 13, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

class User {

	constructor(email, password) {
		this.id;
		this.email = email;
		this.password = password;
	}

	getId() {
		return this.id;
	}

	setId(id) {
		this.id = id;
		return;
	}

	getEmail() {
		return this.email;
	}

	setEmail(email) {
		this.email = email;
		return;
	}

	getPassword() {
		return this.password;
	}

	setPassword(password) {
		this.password = password;
		return;
	}

}

module.exports = User;