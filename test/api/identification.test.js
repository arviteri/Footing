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
var auth_cookie; // Used to save auth cookie to make further requests.
var auth_token; // Used for testing further requests.
var csrf_token; // Used for testing further requests.


// Test credentials used to signup, login, and delete user.
const test_credentials = {
    email: 'test@example.com',
    password: 'A_Random_Password_321_@@',
}

beforeAll(() => {
    SetConsoleLogging(false); // Function from src/config/server.js
	sqlDB.connect();
	mongoose.connect(mongoURL, {useNewUrlParser: true});
});


describe('CSRF ROUTE', () => {
    test('Attempt to obtain CSRF token - GET '.concat(config.routes.csrf), async () => {
        const response = await request.get(config.routes.csrf).expect('set-cookie', /connect.sid/);
        session_cookie = response.headers['set-cookie'];
        csrf_token = response.body._csrf;
        assert.equal(response.statusCode, 200);
    });
});


describe('SIGNUP ROUTE', () => {
    
    const signup_data = {
        email: undefined,
        password: undefined,
        confirmPassword: undefined,
        _csrf: undefined
    };

    // Test w/out CSRF token
    test('Signup with missing CSRF token - POST '.concat(config.routes.signup), async () => {
        const response = await request.post(config.routes.signup)
                                    .set('Cookie', session_cookie)
                                    .send(signup_data);
        assert.equal(response.statusCode, 403, 'request should be forbidden.');
    });


    test('Signup with missing email - POST '.concat(config.routes.signup), async () => {
        signup_data._csrf = csrf_token; // Add csrf token to request body.
        const response = await request.post(config.routes.signup)
                                        .set('Cookie', session_cookie)
                                        .send(signup_data);
        assert.equal(response.statusCode, 422, 'should be unauthorized');
    });


    test('Signup with missing password - POST '.concat(config.routes.signup), async () => {
        signup_data.email = test_credentials.email; // Add email to signup data.
        const response = await request.post(config.routes.signup)
                                    .set('Cookie', session_cookie)
                                    .send(signup_data);
        assert.equal(response.statusCode, 422, 'should be unauthorized');
    });


    // Test with missing confirm password
    test('Signup with missing confirm password - POST '.concat(config.routes.signup), async () => {
        signup_data.password = test_credentials.password; // Add password to signup data. 
        const response = await request.post(config.routes.signup)
                                    .set('Cookie', session_cookie)
                                    .send(signup_data);

        assert.equal(response.statusCode, 422, 'should be unauthorized');
    });

    test('Signup with incorrect confirm password field - POST '.concat(config.routes.signup), async () => {
        signup_data.confirmPassword = 'different_password'; // Add incorrect confirm password field to signup data.
        const response = await request.post(config.routes.signup)
                                    .set('Cookie', session_cookie)
                                    .send(signup_data);

        assert.equal(response.statusCode, 422, 'request should be forbidden.');
    });


    // Test w/ valid data.
    test('Signup with valid data - POST '.concat(config.routes.signup), async () => {
        signup_data.confirmPassword = test_credentials.password; // Add correct confirm password to signup data.
    	const response = await request.post(config.routes.signup)
                                    .set('Cookie', session_cookie)
                                    .send(signup_data);

    	assert.equal(response.statusCode, 200, 'signup should be successful');
    });

    // Test account that has already been registered.
    test('Signup with valid data (already registered) - POST '.concat(config.routes.signup), async () => {
        const response = await request.post(config.routes.signup)
                                    .set('Cookie', session_cookie)
                                    .send(signup_data);

        assert.equal(response.statusCode, 409, 'email should already be registered');
    });

});


describe('LOGIN ROUTE', () => {

    const login_data = {
        email: undefined,
        password: undefined,
        _csrf: undefined
    };

    // Test without CSRF
    test('Login with missing CSRF token - POST '.concat(config.routes.login), async () => {
        const response = await request.post(config.routes.login)
                                    .set('Cookie', session_cookie)
                                    .send(login_data);

        assert.equal(response.statusCode, 403, 'request should be forbidden.');
    });

    // Test with missing email.
    test('Login with missing email - POST '.concat(config.routes.login), async () => {
        login_data._csrf = csrf_token; // Add csrf token to request.
        const response = await request.post(config.routes.login)
                                    .set('Cookie', session_cookie)
                                    .send(login_data);

        assert.equal(response.statusCode, 422, 'should be unauthorized');
    });

    // Test with missing password.
    test('Login with missing password - POST '.concat(config.routes.login), async () => {
        login_data.email = test_credentials.email; // Add correct email to request.
        const response = await request.post(config.routes.login)
                                    .set('Cookie', session_cookie)
                                    .send(login_data);

        assert.equal(response.statusCode, 422, 'should be unauthorized');
    });

    // Test with incorrect password.
    test('Login with incorrect password - POST '.concat(config.routes.login), async () => {
        login_data.password = "A_WRONG_Password!!"; // Add incorrect password to request.
        const response = await request.post(config.routes.login)
                                    .set('Cookie', session_cookie)
                                    .send(login_data);

        assert.equal(response.statusCode, 422, 'should be unauthorized');
    });

    // Test with email that isn't registered.
    test('Login with unregistered email - POST '.concat(config.routes.login), async () => {
        login_data.email = "unregistered@example.com"; // Add unregistered email to request.
        const response = await request.post(config.routes.login)
                                    .set('Cookie', session_cookie)
                                    .send(login_data);

        assert.equal(response.statusCode, 409, 'email should not be registered');
    });

    // Test with valid data.
    test('Login with valid data - POST '.concat(config.routes.login), async () => {
        login_data.email = test_credentials.email; // Add correct email to request.
        login_data.password = test_credentials.password; // Add correct password to request.
        const response = await request.post(config.routes.login)
                                    .set('Cookie', session_cookie)
                                    .send(login_data);
        
        const cookies = response.headers['set-cookie'][0].split(","); // Need to split cookies string to access them seperatley due to Supertest.      
        
        /* Set data to make authorized requests in following tests. */
        session_cookie = cookies[1];
        auth_cookie = cookies[0];
        auth_token = response.body._a;
        csrf_token = response.body._csrf;

        assert.equal(response.statusCode, 200, 'should be successful');
    });

});


describe('DELETE USER ROUTE', () => {

    const request_body = {
        _csrf: undefined
    };


    // Test missing CSRF token
    test('Delete user without CSRF token - POST '.concat(config.routes.deleteAccount), async () => {
        const response = await request.post(config.routes.deleteAccount)
                                    .set('Cookie', session_cookie)
                                    .send(request_body);

        assert.equal(response.statusCode, 403, 'request should be forbidden.');
    });

    // Test without auth token.
    test('Delete user with missing auth token - POST '.concat(config.routes.deleteAccount), async () => {
        request_body._csrf = csrf_token; // Add CSRF token to request.
        const response = await request.post(config.routes.deleteAccount)
                                    .set('Cookie', session_cookie)
                                    .send(request_body);

        assert.equal(response.statusCode, 401, 'request should be unauthorized.');
    });

    // Test with auth token as cookie only (not provided in header)
    test('Delete user with auth token as cookie only - POST '.concat(config.routes.deleteAccount), async () => {
        const response = await request.post(config.routes.deleteAccount)
                                    .set('Cookie', session_cookie+";"+auth_cookie)
                                    .send(request_body);
                                    
        assert.equal(response.statusCode, 401, 'request should be unauthorized.');
    });

    // Test with auth token as header only (not saved as cookie)
    test('Delete user with auth token in header only - POST '.concat(config.routes.deleteAccount), async () => {
        const response = await request.post(config.routes.deleteAccount)
                                    .set('Cookie', session_cookie)
                                    .set('Authorization', 'Bearer ' + auth_token)
                                    .send(request_body);
      
        assert.equal(response.statusCode, 401, 'request should be unauthorized.');
    });

    // Test successful user delete
    test('Delete user with valid data - POST '.concat(config.routes.deleteAccount), async () => {
        const response = await request.post(config.routes.deleteAccount)
                                    .set('Cookie', session_cookie+";"+auth_cookie) // Use both cookies
                                    .set('Authorization', 'Bearer ' + auth_token)
                                    .send(request_body);

        assert.equal(response.statusCode, 200, 'request should be successful.');
    });

    // Test validity of auth token after user has been deleted.
    test('Delete user with credentials of recently deleted user - POST '.concat(config.routes.deleteAccount), async () => {
        const response = await request.post(config.routes.deleteAccount)
                                    .set('Cookie', session_cookie+";"+auth_cookie) // Use both cookies (both should be invalid)
                                    .set('Authorization', 'Bearer ' + auth_token)
                                    .send(request_body);

        assert.equal(response.statusCode, 403, 'request should be forbidden.');
    });

    // Test validity of auth token after user has been deleted and new CSRF token obtained.
    test('Delete user with invalid credentials and new CSRF - POST '.concat(config.routes.deleteAccount), async () => {
        /* Obtain a new CSRF since session was deleted in previous test. */
        const csrfResponse = await request.get(config.routes.csrf).expect('set-cookie', /connect.sid/);
        session_cookie = csrfResponse.headers['set-cookie'];
        request_body._csrf = csrfResponse.body._csrf; // Reset the CSRF token to the new, valid one.

        const response = await request.post(config.routes.deleteAccount)
                                    .set('Cookie', session_cookie+";"+auth_cookie) // Use both cookies
                                    .set('Authorization', 'Bearer ' + auth_token)
                                    .send(request_body);
        assert.equal(response.statusCode, 401, 'request should be unauthorized.');
    });

});


afterAll(() => {
	sqlDB.end();
    mongoose.connection.db.collection("sessions", (err, collection) => {
        if (err) {
            process.exit(1);
        } else {
            collection.deleteMany({});
        }
    });
	mongoose.disconnect();
    SetConsoleLogging(true);
});

