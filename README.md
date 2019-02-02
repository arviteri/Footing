&nbsp;
<p align="center">
<img src="https://i.ibb.co/qRjRw2g/logo-f.png" height=100>
</p>
<p align="center">
	<a href="https://travis-ci.org/arviteri/Footing" alt="Travis-CI"><img src="https://travis-ci.org/arviteri/Footing.svg?branch=master"></a>&nbsp;&nbsp;&nbsp;
	<a href="https://opensource.org/licenses/MIT" alt="License:MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
</p>

Footing is a foundation for developing REST APIs with Express and Node.js. The project is designed in a way to make it easy for developers to build secure REST APIs with minimal setup. Footing provides the ability to define public or private routes with or without CSRF protection. 

Routes that are predefined and come with Footing include ones that allow registering users, authenticating users, and deleting users. Routes for testing CSRF and authentication functionality are also included. 

Footing's purpose is to enable developers to create REST APIs without needing to implement an authentication system. 

# Index
- ### [What's Included?](#included) 
- ### [What's Not Included?](#notincluded) 
- ### [Requirements](#req)  
- ### [Getting Set Up](#setup)  
- ### [Usage](#use) 
	- #### [Environment Variables](#env)
	- #### [Changing Default Routes](#defaultroutes)
	- #### [Defining New Routes](#defroutes)
	- #### [Making Requests](#makerequests)
	-  #### [Adding XSS Protection](#xss)
- ### [Developer](#develop) - Coming Soon
	- #### [Project Directory]()
	- #### [Testing]()

<a id="included"/>

# What's Included?

Footing includes...
- Environment variables for easy setup (provided by npm package `dotenv`).
- An authentication system.
- CSRF protection (provided by npm package `csurf`).
- SQL Injection protection (__for predefined routes only__).
- Two designated files for defining public and private routes,
	- `src/routes/api/public.js`
	- `src/routes/api/private.js`.
- Integration tests for predefined routes.

### The Authentication System
Routes that are private will require a Bearer token in the authentication header of the request. Upon a successful login request, an authentication token will be stored as a cookie, and also returned in the form of a JSON response. The token is in the form of a JWT, and it's secret is a unique ID that is stored in the user's session. The authentication system protects routes by first verifying that the token in the authentication header matches that of the cookie. Secondly, the system verifies the token with the secret that is stored in the user's session.

It's important to note that upon a successful login request, the user's session is regenerated and a new CSRF token will be returned. The CSRF token used to make the login request will no longer be valid.

<a id="notincluded"/>

# What's Not Included?

The following list serves to warn users of what is not included.  It does not serve as a comprehensive list of what is not included with Footing. 

Footing __does  not  include__...
- Email verification for authentication system.
- Password restrictions for authentication system.
- XSS protection (data sanitization) for any input.
- SQL Injection prevention for routes that are defined by the developer. 
- Anything else not listed.

<a id="req" />

# Requirements

Requirements for developing REST APIs with Footing include...
- MySQL database (used for application data).
- MongoDB database (used for managing sessions).
- Node.js ( >= v8.11.1, it's recommended to be used with v10.15.1)

__Disclaimer:__ Integration tests have been tested for Node.js >= v10.15.1. The project was originally developed using Node.js v8.11.1; however, the integration tests will fail on v8.11.1 due to the version of npm package `supertest` that v8.11.1 uses. That specific version of `supertest` has an issue making requests and receiving responses that include more than one cookie. 

<a id="setup"/>

# Getting Set Up

1. Clone the repository and `cd` into the root of the project directory.
2. Run `npm install` to install the dependencies.
3. Duplicate the `.env.dist` file and rename it to `.env`
4. Open the `.env` file and set the values for the environment variables (suggested/default values are included).
5. Make sure that MySQL and MongoDB servers are running.
6. (Optional) Run `npm test` to make sure the project is working correctly.
7. Run `npm start` to start the server. 

<a id="use"/>

# Usage

<a id="env"/>

### Environment Variables
To configure environment variables, duplicate the `.env.dist` file and rename it to `.env`. Environment variables are predefined with default values. Change them as needed. The variables are used for...
- Defining the port to serve the application on.
- Setting up a connection to a MySQL database.
- Setting up a connection to a MongoDB database.
- Deciding on salt rounds for hashing passwords.
- Deciding on a secret for session data. 

__Note:__ The `JWT_SECRET` environment variable is not used. It is there because it was previously used, and was not removed in case developers want to change the authentication system. Currently, Footing uses unique id secrets for each individual authentication token (JWT), and not a static secret. In this project, JWT is used to represent an authentication token, and not for all if its functional purposes. 

Environment variables included are...
- __PORT__ - Port the application will be served on.
- __SQL_HOST__ - Host for MySQL connection. 
- __SQL_PORT__ - Port for MySQL connection. The default is 3306.  
- __SQL_USER__ - User for MySQL connection. 
- __SQL_PASS__ - Password for MySQL connection.
- __SQL_DATABASE__ - Database name for MySQL database.
- __SQL_USERS_TABLE__ - The name of the table that stores user entities in the MySQL database.
- __MONGO_URL__ - The URL of the MongoDB database used for sessions.
- __BCRYPT_SALT_ROUNDS__ - Salt rounds for Bcrypt to hash passwords. 
- __JWT_SECRET__ - Secret for authentication token (not used, see `note` above).
- __SESSION_SECRET__ - Secret for Express sessions. 

<br/>
<a id="defaultroutes"/>

### Changing Default Routes

The routes that have already been defined are for...
- User signup - `/signup`.
- User login - `/login`.
- Delete user -  `/delete_account`.
- Obtain CSRF token - `/c/tkn`.
- Status - `/status`.
- Testing routes that include CSRF protection that don't require authentication - `/test/csrf`.
- Testing routes that don't include CSRF protection that require authentication - `/test/auth`.
- Testing routes that include CSRF protection and require authentication - `/test/auth_csrf`.

The routes above are defined in the `src/config/routes.js` file. They are implemented in the `src/routes/api/identification.js` file and the `src/routes/api/health.js` file. 

__To change the default route endpoints, it is recommended that they are changed in the `src/config/routes.js` file and not in the implementation file. This is recommended because the integration tests rely on the `src/config/routes.js` file to test the correct routes.__

__Changing the route endpoints in the `src/config/routes.js` file will ensure that the integration tests will still work correctly.__

<br/>
<a id="defroutes"/>

### Defining New Routes

Footing is designed to allow developers to define public or private routes that include or do not include CSRF protection.

__Public routes__ can be defined in the `src/routes/api/public.js` file.  
__Private routes__ can be defined in the `src/routes/api/private.js` file and use the predefined `RequestAuthenticator` middleware.

__Unprotected routes__ (routes that __do not include__ CSRF protection) are used by the router variables `routes.unprotected`.
__Protected routes__ (routes that __include__ CSRF protection) are used by the router variables `routes.protected`.

<br/>

__Example of defining a new PUBLIC route _without_ CSRF protection__ in the `src/routes/api/public.js`  file:

~~~
routes.unprotected.post('/public_without_CSRF', function(res, req) {
    return res.status(200).json({"200":"Unathenticated"});
});
~~~
<br />

__Example of defining a new PUBLIC route _with_ CSRF protection__ in the `src/routes/api/public.js`  file:
~~~
routes.protected.post('/public_with_CSRF', function(res, req) {
		return res.status(200).json({"200":"Unathenticated"});
});
~~~
<br />

__Example of defining a new PRIVATE route _without_ CSRF protection__ in the `src/routes/api/private.js`  file:
~~~
routes.unprotected.post('/auth_without_CSRF', RequestAuthethenticator, function(res, req) {
    return res.status(200).json({"200":"Authenticated"});
});
~~~
<br />

__Example of defining a new PRIVATE route _with_ CSRF protection__ in the `src/routes/api/private.js`  file:
~~~
routes.protected.post('/auth_with_CSRF', RequestAuthethenticator, function(res, req) {
    return res.status(200).json({"200":"Authenticated"});
});
~~~

<br/>
<a id="makerequests"/>

### Making Requests
__Obtaining a CSRF token:__ 	`GET: http://localhost:port/c/tkn`

__User Signup:__
```
POST: http://localhost:port/signup
{
	"email": "test@example.com",
	"password": "password",
	"confirmPassword": "password",
	"_csrf": "N2MbkPwA-3cJSavajIlsW_61OPZ_5uoQr6QU"
}
```

__User Login:__
```
POST: http://localhost:port/login
{
	"email": "test@example.com",
	"password": "password",
	"_csrf": "N2MbkPwA-3cJSavajIlsW_61OPZ_5uoQr6QU"
}
```

__Private Route without CSRF protection:__
```
POST: http://localhost:port/test/auth
HEADER: Authorization - Bearer {jwtAuthTokenValueHere}
```

__Private Route with CSRF protection:__
```
POST: http://localhost:port/test/auth
HEADER: Authorization - Bearer {jwtAuthTokenValueHere}
{
	"_csrf": "N2MbkPwA-3cJSavajIlsW_61OPZ_5uoQr6QU"
}
```

<br/>
<a id="xss"/>

### Adding XSS Protection
Due to the amount of npm packages that offer data sanitization, and the lack of regulation/validity that is available for such packages, Footing does not offer XSS protection/data sanitization functions. However, comments are available in suggested locations for sanitizing input data. These comments are located in the `src/controllers/signup.js` and `src/controllers/login.js` files. 

It is recommended to implement a middleware function that sanitizes all input data for all requests. 


<a id="develop"/>

# Developer

Coming soon. 
