&nbsp;
<p align="center">
<img src="https://i.ibb.co/kMbvKRC/developing-logo.png" height=100>
</p>

# Index
- ### [Project Directory](#dir)
	- ### [File Hierarchy](#fhier)
	- ### [Making Configurations](#config)
	- ### [Controllers](#cntrlrs)
	- ### [Models](#mdls)
	- ### [Routes](#rtes)
	- ### [Middleware](#mid)
- ### [Testing](#test) - Coming Soon
	- ### [Creating New Route Tests](#newtests)
	- ### [API Routes](#apirtes)
	- ### [Main Application](#mainapptest)

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

__Main Application File__ - The index of the application (`src/app.js`). 

The `src/app.js` file is the file that runs the application and allows the server to listen for incoming HTTP requests. This file is where database connections are initialized and tested before the server starts. This file uses the Express application variable, `app` to call `app.listen` but it is __not__ where the Express application variable is defined. It merely `require`s it from _the secondary application file._ Please see __The secondary Application File__ below for more information. 

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

__NOTE:__ If a new file is made for implementing routes, __it must be `require`d by the secondary application file__ and must be passed the `routers` variable, or the routes will not work. Please see the secondary application file for an example.  

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

__The Signup Controller__ - `src/controllers/signup.js` -The signup controllers manages signing up users and storing them in the MySQL database. 

<br/>

__The Login Controller__ `src/controllers/login.js` - The login controller manages authenticating user credentials. This controller does not return an authentication token. The user entity that owns the email and password provided is passed to the __authentication controller__ to authorize a new session and return an authentication token to the user. 

<br/>

__The Authentication Controller__ `src/controllers/auth.js` - The authentication controller manage authenticated sessions, and authorizes private requests. After a request to login is successful, it gets passed to this controller to authorize the session and return an authentication token to the user. When a computer requests information from a private route, (one that uses the `src/routes/api/auth.js` middleware) the request is passed through a function in this controller to authenticate the validity of the request. 

The above does not serve as a comprehensive explanation for how the authentication system works. For more information on how the authentication system work, please see __Whats Included?__ in the README.md file. 

<br/>

__The Deactivate Controller__ - `src/controllers/deactivate.js` - The deactivate controller manages deleting users from the database. The requests to delete users from the database first need to pass the authentication controller. After a successful request to delete the user's account, the user data will no longer be present in the MySQL database, and the user's session will be destroyed (thus invalidating the user's CSRF token and authentication token). 

<br/>
<a id="mdls"/>


### Models

Models defined in footing make use of ES6 classes. 

__JSON RESPONSE__ - `src/models/JSONResponse.js` The JSON Response model serves to represent a response with a status code and message only. This model is used by the predefined routes to send a response back to the computer requesting data. 

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
- Middleware for CSRF protection - `src/routes/middleware/csrf.js`.
- Middleware for authenticating requests - `src/routes/middleware/auth.js`.

The middleware files can be found in the `src/routes/middleware/` directory.

__CSRF Middleware__ - The CSRF protection middleware uses a function from the npm package `csurf` to protect routes that use this middleware. The `protected` router uses this middleware by default. The `unprotected` router does not use this middleware. For more information on the two router definitions, please look at __the secondary application file__ (`src/config/app.js`).

__Authentication Middleware__ - The authentication middleware uses the authentication controller to verify credentials for private routes. This middleware is not used by either router by default. It is necessary to include this middleware in routes that need to require authentication. Please see the below code for an example of implementation. An example can also be found in the `src/routes/api/private.js` file.

```
// Namespace - /src/routes/api

const RequestAuthenticator = require('../middleware/auth.js');


routes.protected.post('/endpoint', RequestAuthenticator, (req, res) => {
	
	// Code block
	
});

```

<br/>
<a id="test"/>

# Testing
Coming soon.
