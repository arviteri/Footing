/**
 * Main
 */

const config = require('./config/config.js');
const app = require('./config/app.js');


console.log('Running', config.app.name+'@'+config.app.version);
console.log('Port:', config.server.port);

/* Create application db users index. */
let users_collection = config.dep_preferences.MongoDB.users_collection;
if (!users_collection) {
	users_collection = "users";
}
config.databases.application.collection(users_collection).createIndex({email: 1}, {unique: true}, (err, result) => {
	if (err) {
		console.log("Error creating users index for application db.");
		process.exit(1);
	}
});

/**
 * Handle database (Mongo) connection events.
 * The Mongo connection is created in the config.js file. 
 */
config.databases.application.on('connected', () => {
	console.log('MongoDB - Application DB connection established.');
});

config.databases.session.on('connected', () => {
	console.log('MongoDB - Session DB connection established.');
});

config.databases.application.on('error', () => {
	// Mongoose will log the error.
	return process.exit(1);
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