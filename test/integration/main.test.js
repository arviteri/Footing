/**
 * Main Test.
 */

const config = require('../../src/config/config.js');
const app = require('../../src/config/app.js');

describe("TEST DATABASES", () => {
	test('MySQL database', () => {
		config.databases.application.connect((err) => {
			expect(err).toBeFalsy();
		});
	});

	test('MongoDB', () => {
		const uri = config.dep_preferences.MongoDB.uri;
		console.log(uri);
		config.dependencies.mongoose.connect(uri, {useNewUrlParser: true}, (err) => {
			expect(err).toBeFalsy();
		});
	});
});

afterAll(() => {
	config.databases.application.end();
	config.dependencies.mongoose.disconnect();
})