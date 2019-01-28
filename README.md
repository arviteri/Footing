# Footing

Footing is a foundation for developing REST APIs using Express with Node.Js. The project is designed in a way to make it easy for developers to build secure REST APIs with minimal setup. Footing provides the ability to define public or secure API routes with or without CSRF protection. 

Routes for signing up and logging in users are already defined. Session management and authentication management have been implemented as well. 

Footings's purpose is to enable developers to create REST APIs without needing to implement an authentication system. 

**DISCLAIMER:** Footing is not yet designed with protection against XSS attacks. Comments are available in suggested locations for sanitizing input data to prevent such attacks.  

<br />

## Security 
**SQL Injection:** Footing already includes standard SQL Injection prevention techniques for predefined routes such as `/signup` and `/login`. __Any additional routes that modify the MySQL database will need to be protected by the developer.__ 

<br/>

**XSS:** It is the developer's responsibility to protect ALL routes from XSS attacks. Footing does not currently sanitize ANY input data.


<br />

## Setup Requirements
  - MongoDB database (used for sessions).
  - MySQL database (used for application data).
  - Node.Js

<br />

## Setup
**1. Environment Variables:** The `src/config/config.js` takes advantage of the `dotenv` package and uses the `.env` file in the root of the project to manage configurations. Copy the `.env.dist` file and rename it to `.env`. You can then manage all environment variables in the `.env` file.

**2. Dependencies:** CD into the root of the cloned directory and run the command, `npm install` to install the dependencies.

<br />

## Starting The Server
**1. Databases:** Make sure the MongoDB and MySQL databases have been started and are running.  
**2. Running the project:** CD into the root of the cloned directory and run `node src/app.js`.    
**NOTICE:** Running `node app.js` from the `src` directory will cause errors. This is because of the path required by the `dotenv` package.

<br />

## Defining Routes

Predefined routes for signing up and logging in users can be found in the `src/api/routes/identification.js` file.  

### Public Routes
Public routes can be defined in the `src/api/routes/public.js` file. Below are examples of defining routes that do not need user authentication.

**Example 1:** Defining public route that does not require CSRF protection.
~~~
routes.unprotected.post('/public_without_CSRF', function(res, req) {
    return res.status(200).json({"200":"Unathenticated"});
});
~~~
**Example 2:** Defining public route that requires CSRF protection.
~~~
routes.protected.post('/public_with_CSRF', function(res, req) {
		return res.status(200).json({"200":"Unathenticated"});
});
~~~

### Private Routes
Public routes can be defined in the `src/api/routes/private.js` file. Below are examples of defining routes that need authentication.

**Example 1:** Defining private route that does not require CSRF protection.
~~~
routes.unprotected.post('/auth_without_CSRF', RequestAuthethenticator, function(res, req) {
    return res.status(200).json({"200":"Authenticated"});
});
~~~
**Example 2:** Defining private route that requires CSRF protection.
~~~
routes.protected.post('/auth_with_CSRF', RequestAuthethenticator, function(res, req) {
    return res.status(200).json({"200":"Authenticated"});
});
~~~

<br />

## The Authentication System
Routes that are private will require a Bearer token in the authentication header of the request. Upon a successful login request, an authentication token will be stored as a cookie, and also returned in the form of a JSON response. The token is in the form of a JWT, and it's secret is a unique ID that is stored in the user's session. The authentication system protects routes by first verifying that the token in the authentication header matches that of the cookie. Secondly, the system verifies the token with the secret that is stored in the user's session.

It's important to note that upon a successful login request, the user's session is regenerated and a new CSRF token will be returned. The CSRF token used to make the login request will no longer be valid.

<br />

## Example Requests
**Obtaining CSRF Token**
`GET: http://localhost:port/c/tkn`

**Sign Up**
`POST: http://localhost:port/signup`
~~~
{
	"email": "test@example.com",
	"password": "password",
	"confirmPassword": "password",
	"_csrf": "N2MbkPwA-3cJSavajIlsW_61OPZ_5uoQr6QU"
}
~~~
**Login**
`POST: http://localhost:port/login`
~~~
{
	"email": "test@example.com",
	"password": "password",
	"_csrf": "N2MbkPwA-3cJSavajIlsW_61OPZ_5uoQr6QU"
}
~~~
