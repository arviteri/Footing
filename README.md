# Backbone

Backbone is a foundation for developing APIs using Express with Node.Js. The project is setup in a way to make it easy for developers to build secure APIs with minimal setup. Backbone provides the ability to define public or secure API routes with or without CSRF protection. 

Routes for signing up and logging in users are already defined. Session management and authentication managment has been implenented as well. 

Backbone's purpose is to enable developers to create APIs without needing to implenent an authentication system each time. 

**DISCLAIMER:** Backbone is not setup to protect XSS or SQL Injection attacks. Comments are available in suggested locations for cleaning input data to prevent such attacks.

## Setup Requirements
  - MongoDB database (used for sessions).
  - MySQL database (used for application data).
  - Node.Js

## Setup
**1. Databases:** Database configuration can be set up in the `src/config/config.js` file. The default database setup uses the following values...

```
/* DATABASE CONFIG */
const mongoDBUrl = 'mongodb://localhost/test_db';
const dbHost = 'localhost';
const dbUser = 'root';
const dbName = 'test_db';
```
**2. Dependencies:** CD into the root of the cloned directory and run the command, `npm install` to install the dependencies.

## Starting The Server
**1. Databases:** Make sure the MongoDB and MySQL databases have been started and are running.
**2. Running the project:** CD into the root of the cloned directory and run `node src/app.js`

## Defining Routes

Predefined routes for signing up and logging in users can be found in the `src/api/routes/identification.js` file.

**Public Routes:**
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

**Private Routes:**
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
