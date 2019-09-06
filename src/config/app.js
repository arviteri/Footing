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

const CSRF_middleware = require('../routes/middleware/csrf_middleware.js')(config);
var routes = {
	unprotected: config.dependencies.express.Router(),
	protected: config.dependencies.express.Router()
};
routes.protected.use(CSRF_middleware);
app.use(routes.unprotected);
app.use(routes.protected);

/**
 * Recursively reads directory and requires
 * all files while passing in the app, config
 * and routes variable.
 */
const requireApiRoutes = function(folder) {
	fs.readdirSync(folder).forEach((file) => {
		let dir = folder + '/' + file;
		if (fs.lstatSync(dir).isDirectory()) {
			requireApiRoutes(dir);
		} else {
			dir = dir.replace('./src/', '../');
			require(dir)(app, config, routes);
		}
	});
}
requireApiRoutes('./src/routes/api');


module.exports = app;