/**
 * FOOTING.
 * Namespace: src/
 * January 12, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */


// Create Application variables.
const config = require('./config/config.js');
const app = require('./config/app.js');
const express = config.dependencies.express;

// Create databases variables for initialization (MongoDB and SQL).
const mongoose = config.dependencies.mongoose;
const sqlDB = config.databases.sql;

// Require API routes. (DO NOT MOVE ABOVE THIS POINT) /////
var routes = {
	unprotected: express.Router(), 	// Routes w/o CSRF protection.
	protected: express.Router()		// Routes w/ CSRF protection.
};
const CSRFProtection = require('./routes/middleware/csrf.js')(config);
routes.protected.use(CSRFProtection);
app.use(routes.unprotected);
app.use(routes.protected);
require('./routes/api/identification.js')(config, app, routes);
require('./routes/api/public.js')(config, app, routes);
require('./routes/api/private.js')(config, app, routes);
require('./routes/api/test.js')(config, app, routes);
/////////////////////////////////////////////////////////

// Serve application.
app.listen(config.server.port, config.server.ip, (err) => {
	// Kill if any errors occur. 
	if (err) {
		console.log('FATAL ERROR: ' + err);
		return process.exit(1);
	}

	// Log server details.
	console.log('\u27F0 FOOTING.');
	console.log('PORT: ' + config.server.port);

	// Test MySQL database connection.
	console.log('Attempting to connect to MySQL database...');
	sqlDB.connect((err) => {
		if (err) {
			console.log('ERROR - MySQL: ' + err);
			return process.exit(1);
		}
		console.log('SUCCESS: MySQL connection established.');
	});

	// Test MongoDB database connection.
	const mongoURL = config.configurations.connectMongo.url;
	console.log('Attempting to connect to MongoDB database...');
	mongoose.connect(mongoURL, {useNewUrlParser: true}, function(err) {
		if (err) {
			console.log('ERROR - MongoDB: ' + err);
			return process.exit(1);
		}
		console.log('SUCCESS: MongoDB connection established.');
	});
});
