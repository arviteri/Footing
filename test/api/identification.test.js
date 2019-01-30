/**
 * FOOTING.
 * Namespace: test/api
 * January 29, 2019
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

var session_cookie; // Used to save session to make further requests.
var csrf_token; // Used for testing further requests.
var auth_token; // Used for testing further requests.

beforeAll(() => {
	sqlDB.connect();
	mongoose.connect(mongoURL, {useNewUrlParser: true});
});

describe('TESTING CSRF ROUTE', () => {
    
    // Test CSRF token route. 
    test('GET '.concat(config.routes.csrf), async () => {
        const response = await request.get(config.routes.csrf).expect('set-cookie', /connect.sid/);
        session_cookie = response.headers['set-cookie'];
        csrf_token = response.body._csrf;
        assert.equal(response.statusCode, 200);
    });

});

describe('TESTING SIGNUP ROUTE', () => {
    
    const signup_data = {
        email: undefined,
        password: undefined,
        confirmPassword: undefined,
        _csrf: undefined
    };

    // Test w/ valid data.
    test('POST '.concat(config.routes.signup), async () => {
    	signup_data.email = 'test@example.com';
    	signup_data.password = 'A_Random_Password_321_@@';
    	signup_data.confirmPassword = 'A_Random_Password_321_@@';
    	signup_data._csrf = csrf_token;

    	let req = request.post(config.routes.signup);
    	req.set('Cookie', session_cookie);
    	const response = await req.send(signup_data);
   		
    	assert.equal(response.statusCode, 200, 'signup should be successful');
        assert.equal(response.body.message, 'OK', 'signup response should be: OK');

    });

});

afterAll(() => {
	sqlDB.end();
	mongoose.disconnect()
});

