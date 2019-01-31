/** 
 * FOOTING.
 * Namespace: test/api
 * January 31, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

const assert = require('chai').assert
const config = require('../../src/config/config.js');
const app = require('../../src/config/app.js');
const request = require('supertest')(app);


// Create database variables for testing.
const mongoURL = config.configurations.connectMongo.url;
const mongoose = config.dependencies.mongoose;
const sqlDB = config.databases.sql;

beforeAll(() => {
    SetConsoleLogging(false); // Function from src/config/server.js
	sqlDB.connect();
	mongoose.connect(mongoURL, {useNewUrlParser: true});
});


describe('HEALTH ROUTE', () => {

	// Test status of API.
	test('Check status route - GET '.concat(config.routes.health), async () => {
		const response = await request.get('/status');

		assert.equal(response.statusCode, 200, 'should be successful');
	})

})

afterAll(() => {
	sqlDB.end();
	mongoose.disconnect();
    SetConsoleLogging(true);
});


