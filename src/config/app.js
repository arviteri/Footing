/**
 * App.
 * Application setup.
 */

const fs = require('fs');
const config = require('./config.js');
const app = config.dependencies.express();

app.use(config.dependencies.body_parser.json());
app.use(config.dependencies.body_parser.urlencoded({extended: true}));
app.use(config.dependencies.cookie_parser());
app.use(config.dependencies.express_session(
	config.dep_preferences.express_session.config
));

const AuthHandler = require('../handlers/auth_handler.js');
const CSRF_middleware = require('../routes/middleware/csrf_middleware.js')(config);
var routes = {
	unprotected: config.dependencies.express.Router(),
	protected: config.dependencies.express.Router()
};
routes.protected.use(CSRF_middleware);
app.use(routes.unprotected);
app.use(routes.protected);
fs.readdirSync('./src/routes/api/').forEach((file) => {
	const file_dir = '../routes/api/'+file;
	const RequestAuthenticator = require('../routes/middleware/auth_middleware.js')(new AuthHandler(config));
	require(file_dir)(app, config, routes, RequestAuthenticator);
});

module.exports = app;