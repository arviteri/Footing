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

// Create databases variables for initialization (MongoDB and SQL).
const mongoose = config.dependencies.mongoose;
const sqlDB = config.databases.sql;


const BootstrapServer = async function() {
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
	await mongoose.connect(mongoURL, {useNewUrlParser: true}, function(err) {
		if (err) {
			console.log('ERROR - MongoDB: ' + err);
			return process.exit(1);
		}
		console.log('SUCCESS: MongoDB connection established.');
	});
}

// Bootstrap and serve application.
BootstrapServer().then(function() {
	app.listen(config.server.port, (err) => {
		// Kill if any errors occur. 
		if (err) {
			console.log('FATAL ERROR: ' + err);
			return process.exit(1);
		}
	});
});


// Export for testing
module.exports = app;