&nbsp;
<p align="center">
<img src="https://i.ibb.co/kMbvKRC/developing-logo.png" height=100>
</p>

# Index
- ### [Project Directory](#dir)
	- ### [File Hierarchy](#fhier)
	- ### [Making Configurations](#config)
	- ### [Controllers](#cntrlrs)
	- ### [Handlers](#hndlers)
	- ### [Models](#mdls)
	- ### [Routes](#rtes)
	- ### [Middleware](#mid)
- ### [Testing](#test)
	- ### [Main Application Test](#mainapptest)
	- ### [Predefined Route Tests](#apirtes)

<a id="dir"/>

# Project Directory

<a id="fhier"/>


### File Hierarchy

The files below are listed in order from 'most critical' to 'least critical.' 'Most critical' files are ones that the application highly depends on to run properly.  The files below do not include all files in the directory. 

- `app.js` - `src/app.js`
- `config.js` - `src/config/config.js`
	- `app.js` - `src/config/app.js`
	- `server.js` - `src/config/server.js`
	- `routes.js` - `src/config/routes.js`
		- Controller Files - `src/controllers/`
		- Models - `src/models/`
		- Routes - `src/routes/`

<br />

__Main Application File__ - The index of the application (`src/main.js`). 

The `src/main.js` file is the file that runs the application and allows the server to listen for incoming HTTP requests. This file is where database connections are initialized and tested before the server starts. This file uses the Express application variable, `app` to call `app.listen` but it is __not__ where the Express application variable is defined. It merely `require`s it from _the secondary application file._ Please see __The secondary Application File__ below for more information. 

<br />

__Config File__ - The foundation for the application (`src/config/config.js`). 

The config file is designed to hold variables that are used heavily throughout the application, as well as variables that are used by dependencies. It is also where dependencies are defined and database configurations are set up. The __config file__ exports an object that stores...
- The dependencies used by the application.
- The configurations for dependencies used by the application. 
- Database variables.
- Route definitions.
- Server variables and functions. 

An instance of __config file__ is passed as a parameter to all files that need to use anything from the object that it exports. The file was designed to prevent unnecessary code repetition and provide ease of access to heavily used variables and dependencies. 

<br />

__The Secondary Application File__ - AKA the `app.use` file (`src/config/app.js`).

The secondary application file is designated for defining the Express application variable, and allowing it to use dependencies. This file holds all of the `app.use` function calls. In this file you can find...
- All `app.use` statements. 
- The Router configuration (one router for routes with CSRF protection and one for routes without).
- Initialization of routes (route `require` statements). 

The secondary app file exports the Express application variable. The only file that `require`s this file is _the main application file_. The main application file uses the exported Express variable to serve the application and listen for incoming HTTP requests. 

<br />

__The Server File__ - Where 'global' server variables and functions are defined (`src/config/server.js`).

This file is where variables and functions are defined that can be used 'globally' throughout the application. The word 'globally' is in quotations because these variables and functions are not truly 'global.' __The variables and functions are global only to files that can access an instance of the config file__. The __config file__ `require`s the server variables and functions and allows them to be accessed independent of an object provided the file using them has access to the __config file__.

Correct Example - Let's say we have a file that looks like the following...

```
// File header

module.exports = function(config) {
	
	// A code block.
	ServerLog(ip, header, message, suspicious); // This is valid.
}
```

The file above will be allowed to call the server function `ServerLog()` defined in the `src/config/server.js` file so long that the file that `require`s this one passes an instance of the __config file__ argument.  An incorrect example looks like the following...

Incorrect Example - The file below...
```
// File header

module.exports = function() { NO CONFIG INSTANCE PASSED.
	
	// A code block.
	ServerLog(ip, header, message, suspicious); // This is NOT valid.
}
```

<br />

__The Routes File__ - Where predefined route endpoints are defined (`src/config/routes.js`).

This file is where predefined route endpoints are defined. It exports and object that stores the route endpoints. This object is `require`d by the __config file__ in order to pass these endpoints to other files throughout the application. __The reason this file exists__ is in case the developer would like to change the endpoints for the predefined routes that are included in Footing. This file allows for the integration tests to work properly even if the route endpoints are changed in this file. 
 
 <br />
 <a id="config"/>

### Making Configurations 

Configurations to any of the predefined settings in the application can be made in the __config file__ (`src/config/config.js`). Please see __Project Directory -> The Config File__ above to learn more about the __config file__.

Configurations to the dependencies that are used in this project can be made in __the secondary application file__.  This is where the Express application `use`s the dependencies. Please see __Project Directory -> The Secondary Application File__ above to learn more about making changes to the dependencies that Footing currently uses.

 <br />
 <a id="cntrlrs"/>

### Controllers

__The User Controller__ The user controllers is defined in `src/controllers/user_controller.js`. This file is where all functionality is defined for creating, logging in, and deleting users. 

<br />
<a id="hndlers"/>

### Handlers

__The Authentication Handler__ The authentication handler is defined in the `src/handlers/auth_handler.js` file. This file is where all authentication and authorization functionality is defined. An instance of the AuthHandler class is used to create new RequestAuthenticator middleware instances. 

The above does not serve as an explanation for how the authentication system works. For more information on how the authentication system work, please see __Whats Included?__ in the README.md file. 

<br />
<a id="mdls"/>

### Models

Models defined in footing make use of ES6 classes. 

__ERRORS__ - Two main error classes are used to differentiate errors between the client and the server. These two classes are the `ClientError` and `SystemError` classes. They are defined in the `src/models/errors.js` file, and are simply wrappers for the default `Error` class.

__USER__ - `src/models/user.js` - The User model serves to represent a user object. The a User object is used by the __signup controller__ and the __login controller__ to manage handling user data. 

<br/>
<a id="rtes"/>


### Routes

The predefined route endpoints included in Footing are...
- `GET - /c/tkn` - Obtaining a CSRF token.
- `GET - /status` - Checking the status of the API.
- `POST - /test/csrf` - Test route that requires CSRF token.
- `POST - /test/auth` - Test route that requires authentication, but no CSRF token.
- `POST - /test/auth_csrf` - Test route that requires authentication and CSRF token.
- `POST - /signup` - Create user account.
- `POST - /login` - Obtain authentication token and new CSRF token. 
- `POST - /test/delete_account` - Delete user account. 

__Definitions__ - The routes listed above are defined in the `src/config/routes.js` file. Please see __Project Directory -> The Routes File__ for more information on predefined route definitions. 

__Implementations__ - The routes listed above are implemented in files in the `src/routes/api/` directory. This directory includes four files listed below.
- `health.js` - Predefined routes included in this file are listed below.
	- `/status`
	- `/test/csrf`
	- `/test/auth`
	- `/test/auth_csrf`
- `identification.js` - Predefined routes included in this file are listed below.
	- `/c/tkn`
	- `/signup`
	- `/login`
	- `/delete_account`
- `public.js` - Where new public routes are to be defined.
- `private.js` - Where new private routes are to be defined. 

<br />

__IMPORTANT:__ If a new file is made for implementing  routes, __it must be `require`d by the secondary application file__ (`src/config/app.js`) and must be passed the `routers` variable as an argument, or the routes will not work. Please see the secondary application file for an example.  

<br />
<a id="mid"/>

### Middleware

Footing includes two middleware functions..
- Middleware for CSRF protection - `src/routes/middleware/csrf_middleware.js`.
- Middleware for authenticating requests - `src/routes/middleware/auth_middleware.js`.

The middleware files can be found in the `src/routes/middleware/` directory.

__CSRF Middleware__ - The CSRF protection middleware uses a function from the npm package `csurf` to protect routes that use this middleware. The `protected` router uses this middleware by default. The `unprotected` router does not use this middleware. For more information on the two router definitions, please look at __the secondary application file__ (`src/config/app.js`).

__Authentication Middleware__ - The authentication middleware uses the authentication handler to verify credentials for private routes. This middleware is not used by either router by default. It is necessary to include this middleware in routes that need to require authentication. Please see the below code for an example of implementation. An example can also be found in the `src/routes/api/status_routes.js` file.

<br/>
<a id="test"/>

# Testing

Footing uses `jest` for testing, alongside the following dependencies...
- `supertest`
- `chai`

To test the application, run `npm test`. 

The tests included with Footing test the following predefined routes...
- `/status`
-  `/c/tkn`
- `/signup`
- `/login`
- `/delete_account`

<a id="mainapptest"/>

### Main Application Test

The main application test file, `test/integration/main.test.js` tests the database connections only. 

<br />
<a id="apirtes"/>

### Predefined Route Tests

Testing public routes and testing private routes follow two different processes. The public routes require no more than database connections. Testing private routes require a user account, an authentication token, and a CSRF token. The tests defined in the `test/integration/api/user_controller.test.js` file test routes in the following order...
- `/c/tkn` - Route to obtain CSRF token
- `/signup` 
- `/login`
- `/delete_account`

These private route tests were implemented in this order to remove the need for developers to register a user account with the API in order to test successfully.  The tests create a new user, authenticate the new user, and delete it. The tests include various situations for each route. Please see the `test/integration/api.test.js` file for more information on the situations that are tested. 

