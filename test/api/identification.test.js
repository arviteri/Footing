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

const test_credentials = {
    email: 'test@example.com',
    password: 'A_Random_Password_321_@@',
}

beforeAll(() => {
	sqlDB.connect();
	mongoose.connect(mongoURL, {useNewUrlParser: true});
});

describe('CSRF ROUTE', () => {
    
    // Test CSRF token route. 
    test('GET '.concat(config.routes.csrf), async () => {
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
        let req = request.post(config.routes.signup);
        req.set('Cookie', session_cookie);
        
        const response = await req.send(signup_data);

        assert.equal(response.statusCode, 403, 'request should be forbidden.');
        assert.equal(response.body.message, 'Invalid CSRF token.', 'should have invalid csrf token.');
    });


    test('Signup with missing email - POST '.concat(config.routes.signup), async () => {
        let req = request.post(config.routes.signup);
        req.set('Cookie', session_cookie);
        // Add csrf token to request.
        signup_data._csrf = csrf_token;
        const response = await req.send(signup_data);
        assert.equal(response.statusCode, 422, 'should be unauthorized');
        assert.equal(response.body.message, 'No email provided.', 'should be missing email');
    });


    test('Signup with missing password - POST '.concat(config.routes.signup), async () => {
        let req = request.post(config.routes.signup);
        req.set('Cookie', session_cookie);
        // Add email to signup data.
        signup_data.email = test_credentials.email;
        const response = await req.send(signup_data);
        assert.equal(response.statusCode, 422, 'should be unauthorized');
        assert.equal(response.body.message, 'No password provided.', 'should be missing password');
    });


    // Test with missing confirm password
    test('Signup with missing confirm password - POST '.concat(config.routes.signup), async () => {
        let req = request.post(config.routes.signup);
        req.set('Cookie', session_cookie);
        // Add password to signup data. 
        signup_data.password = test_credentials.password;
        const response = await req.send(signup_data);

        assert.equal(response.statusCode, 422, 'should be unauthorized');
        assert.equal(response.body.message, 'No input provided to confirm password.', 'should be missing confirmpassword');
    });

    test('Signup with incorrect confirm password field - POST '.concat(config.routes.signup), async () => {
        let req = request.post(config.routes.signup);
        req.set('Cookie', session_cookie);
        signup_data.confirmPassword = 'different_password';
        const response = await req.send(signup_data);

        assert.equal(response.statusCode, 422, 'request should be forbidden.');
        assert.equal(response.body.message, 'Passwords do not match.', 'passwords should not match.');
    });


    // Test w/ valid data.
    test('Signup with valid data - POST '.concat(config.routes.signup), async () => {
    	// Add confirm password to signup data.
        signup_data.confirmPassword = test_credentials.password;

    	let req = request.post(config.routes.signup);
    	req.set('Cookie', session_cookie);
    	const response = await req.send(signup_data);
   		
    	assert.equal(response.statusCode, 200, 'signup should be successful');
        assert.equal(response.body.message, 'OK', 'signup response should be: OK');

    });

    // Test account that has already been registered.
    test('Signup with valid data - POST '.concat(config.routes.signup), async () => {
        // Add confirm password to signup data.
        let req = request.post(config.routes.signup);
        req.set('Cookie', session_cookie);
        const response = await req.send(signup_data);
        
        assert.equal(response.statusCode, 409, 'email should already be registered');
        assert.equal(response.body.message, 'Email is already registered.', 'email should already be registered');

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
        let req = request.post(config.routes.login);
        req.set('Cookie', session_cookie);
        
        const response = await req.send(login_data);

        assert.equal(response.statusCode, 403, 'request should be forbidden.');
        assert.equal(response.body.message, 'Invalid CSRF token.', 'should have invalid csrf token.');
    });

    // Test with missing email.
    test('Login with missing email - POST '.concat(config.routes.login), async () => {
        let req = request.post(config.routes.login);
        req.set('Cookie', session_cookie);
        // Add csrf token to request.
        login_data._csrf = csrf_token;
        const response = await req.send(login_data);
        assert.equal(response.statusCode, 422, 'should be unauthorized');
        assert.equal(response.body.message, 'No email provided.', 'should be missing email');
    });

    // Test with missing password.
    test('Login with missing password - POST '.concat(config.routes.login), async () => {
        let req = request.post(config.routes.login);
        req.set('Cookie', session_cookie);
        // Add email to request.
        login_data.email = test_credentials.email;
        const response = await req.send(login_data);
        assert.equal(response.statusCode, 422, 'should be unauthorized');
        assert.equal(response.body.message, 'No password provided.', 'should be missing password');
    });

    // Test with valid data.
    test('Login with valid data - POST '.concat(config.routes.login), async () => {
        let req = request.post(config.routes.login);        
        req.set('Cookie', session_cookie);
        // Add password to request.
        login_data.password = test_credentials.password;
        const response = await req.send(login_data);
        
        const cookies = response.headers['set-cookie'][0].split(",");        
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
        let req = request.post(config.routes.deleteAccount);
        req.set('Cookie', session_cookie);

        const response = await req.send(request_body);
        assert.equal(response.statusCode, 403, 'request should be forbidden.');
        assert.equal(response.body.message, 'Invalid CSRF token.', 'should have invalid csrf token.');
    });

    // Test without auth token.
    test('Delete user with missing auth token - POST '.concat(config.routes.deleteAccount), async () => {
        let req = request.post(config.routes.deleteAccount);
        req.set('Cookie', session_cookie);
        // Add CSRF token to request.
        request_body._csrf = csrf_token;
        const response = await req.send(request_body);
        assert.equal(response.statusCode, 401, 'request should be unauthorized.');
        assert.equal(response.body.message, 'Unathenticated.', 'should have unathenticated response.');
    });

    // Test with auth token as cookie only (not provided in header)
    test('Delete user with auth token as cookie only - POST '.concat(config.routes.deleteAccount), async () => {
        let req = request.post(config.routes.deleteAccount);
        req.set('Cookie', [session_cookie, auth_cookie]);
        //req.set('Cookie', auth_cookie);
        const response = await req.send(request_body);
        assert.equal(response.statusCode, 401, 'request should be unauthorized.');
        assert.equal(response.body.message, 'Unathenticated.', 'should have unathenticated response.');
    });

    // Test with auth token as header only (not saved as cookie)
    test('Delete user with auth token in header only - POST '.concat(config.routes.deleteAccount), async () => {
        let req = request.post(config.routes.deleteAccount);
        req.set('Cookie', session_cookie);
        req.set('Authorization', 'Bearer ' + auth_token);
        const response = await req.send(request_body);
        assert.equal(response.statusCode, 401, 'request should be unauthorized.');
        assert.equal(response.body.message, 'Unathenticated.', 'should have unathenticated response.');
    });

    // Test successful user delete
    test('Delete user with valid data - POST '.concat(config.routes.deleteAccount), async () => {
        let req = request.post(config.routes.deleteAccount);
        req.set('Cookie', session_cookie+";"+auth_cookie);
        req.set('Authorization', 'Bearer ' + auth_token);
        const response = await req.send(request_body);
        assert.equal(response.statusCode, 200, 'request should be successful.');
        assert.equal(response.body.message, 'OK', 'should have deleted user and removed session.');
    });

    // Test validity of auth token after user has been deleted.
    test('Delete user with credentials of recently deleted user - POST '.concat(config.routes.deleteAccount), async () => {
        let req = request.post(config.routes.deleteAccount);
        req.set('Cookie', session_cookie);
        req.set('Cookie', auth_cookie);
        req.set('Authorization', 'Bearer ' + auth_token);
        const response = await req.send(request_body);
        assert.equal(response.statusCode, 403, 'request should be forbidden.');
        assert.equal(response.body.message, 'Invalid CSRF token.', 'should have invalid CSRF token after session being destroyed.');
    });

    // Test validity of auth token after user has been deleted and new CSRF token obtained.
    test('Delete user with invalid credentials and new CSRF - POST '.concat(config.routes.deleteAccount), async () => {
        const csrfResponse = await request.get(config.routes.csrf).expect('set-cookie', /connect.sid/);
        session_cookie = csrfResponse.headers['set-cookie'];
        csrf_token = csrfResponse.body._csrf;


        let req = request.post(config.routes.deleteAccount);
        req.set('Cookie', session_cookie+";"+auth_cookie);
        req.set('Authorization', 'Bearer ' + auth_token);
        request_body._csrf = csrf_token;
        const response = await req.send(request_body);
        assert.equal(response.statusCode, 401, 'request should be unauthorized.');
        assert.equal(response.body.message, 'Unathenticated.', 'should have unauthenticated response..');
    });

});


afterAll(() => {
	sqlDB.end();
    mongoose.connection.db.collection("sessions", (err, collection) => {
        if (err) {
            process.exit(1);
        } else {
            collection.remove({});
        }
    });
	mongoose.disconnect()
});

