/**
 * FOOTING.
 * Namespace: src/config
 * January 12, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */


// Create Application variables.
const config = require('./config.js');
const app = config.dependencies.express();


// Dependencies to use w/ Express.
const bodyParser = config.dependencies.bodyParser;
const cookieParser = config.dependencies.cookieParser;
const cors = config.dependencies.cors;
const csurf = config.dependencies.csurf;
const express = config.dependencies.express;
const session = config.dependencies.expressSession;

// Define variables associated with dependencies.
const bodyParserConfig = { extended: true };
const CSRFProtection = require('../routes/middleware/csrf.js')(config);
const session_config = config.configurations.expressSession.config;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session(session_config));


// Require API routes. (DO NOT MOVE ABOVE THIS POINT) /////
var routes = {
	unprotected: express.Router(), 	// Routes w/o CSRF protection.
	protected: express.Router()		// Routes w/ CSRF protection.
};

routes.protected.use(CSRFProtection);
app.use(routes.unprotected);
app.use(routes.protected);
require('../routes/api/identification.js')(config, app, routes);
require('../routes/api/public.js')(config, app, routes);
require('../routes/api/private.js')(config, app, routes);
require('../routes/api/health.js')(config, app, routes);



// Export file as `app` variable.
module.exports = app;