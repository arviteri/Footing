/**
 * Main
 */

const config = require('./config/config.js');
const app = require('./config/app.js');


console.log('Running', config.app.name+'@'+config.app.version);
console.log('Port:', config.server.port);

// Connect to application database. (MySQL)
config.databases.application.connect((err) => {
	if (err) {
		console.log('ERROR (MySQL):', err);
		return process.exit(1);
	}
	console.log('MySQL connection established.');
});


/**
 * Handle session database (Mongo) connection events.
 * The Mongo connection is created in the config.js file. 
 */
config.databases.session.on('connected', () => {
	console.log('MongoDB connection established.');
});

config.databases.session.on('error', () => {
	// Mongoose will log the error.
	return process.exit(1);
});


// Listen on the server.  
app.listen(config.server.port, (err) => {
	if (err) {
		console.log('FATAL ERROR:', err);
		return process.exit(1);
	}
});


// Export for testing.
module.exports = app;