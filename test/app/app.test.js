/**
 * FOOTING.
 * Namespace: test/app
 * January 29, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

const config = require('../../src/config/config.js');
const app = require('../../src/config/app.js');

// Create database variables for testing.
const mongoose = config.dependencies.mongoose;
const sqlDB = config.databases.sql;

describe('TEST DATABASES', () => {

	// Test MySQL
	test('MySQL database', () => {
		sqlDB.connect((err) => {
			expect(err).toBeFalsy();
		});
	});

	test('MongoDB database', () => {
		const mongoURL = config.configurations.connectMongo.url;
		mongoose.connect(mongoURL, {useNewUrlParser: true}, (err) => {
			expect(err).toBeFalsy();
		});
	});
});

afterAll(() => {
	sqlDB.end();
	mongoose.disconnect()
});