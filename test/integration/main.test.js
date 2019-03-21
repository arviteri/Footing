/**
 * Main Test.
 */

const config = require('../../src/config/config.js');
const app = require('../../src/config/app.js');

describe("TEST DATABASES", () => {
	test('Application database', () => {
		const uri = config.dep_preferences.MongoDB.app_uri;
		config.dependencies.mongoose.createConnection(uri, {useNewUrlParser: true}, (err) => {
			expect(err).toBeFalsy();
		});
	});

	test('MongoDB', () => {
		const uri = config.dep_preferences.MongoDB.sess_uri;
		config.dependencies.mongoose.createConnection(uri, {useNewUrlParser: true}, (err) => {
			expect(err).toBeFalsy();
		});
	});
});

afterAll(() => {
	config.dependencies.mongoose.disconnect();
})