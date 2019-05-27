/**
 * Config
 */
 
const package_json = require('../../package.json');
require('dotenv').config({
	path: './.env'
});

/* Module structure. */
var _exports = {
	app: {
		name: package_json['name'],
		version: package_json['version']
	},
	databases: {},
	dependencies: {},
	dep_preferences: {},
	routes: {},
	server: {}
};

/* Initialize dependencies. */
for (i in package_json['dependencies']) {
	let key = i.replace('-', '_')
	_exports.dependencies[key] = require(i);
}

/* Setup databases. */
_exports.databases = {
	application: _exports.dependencies.mongoose.createConnection(process.env.MongoDB_URI_APP, {
		useNewUrlParser: true
	}),
	session: _exports.dependencies.mongoose.createConnection(process.env.MongoDB_URI_SESS, {
		useNewUrlParser: true
	})
};

/* Setup dependency preferences. */
_exports.dep_preferences = {
	bcrypt: {
		salt_rounds: process.env.BCRYPT_SALT_ROUNDS
	},
	csurf: {
		settings: {
			cookie: false
		}
	},
	express_session: {
		config: {
			secret: process.env.SESSION_SECRET,
			store: new (_exports.dependencies.connect_mongo(_exports.dependencies.express_session))({
				mongooseConnection: _exports.databases.session
			}),
			saveUninitialized: false,
			resave: false
		}
	},
	MongoDB: {
		app_uri: process.env.MongoDB_URI_APP,
		sess_uri: process.env.MongoDB_URI_SESS,
		users_collection: process.env.MongoDB_USERS_COLLECTION
	}
};

/* Setup routes. */
_exports.routes = require('./routes.js'); // We use './routes.js' because this will be accessed from '/src/config/app.js'


/* Setup server config. */
_exports.server = {
	port: process.env.PORT,
	config: require('./server.js')()
}

module.exports = _exports;