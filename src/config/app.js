/**
 * App.
 * Application setup.
 */

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
require('../routes/api/status_routes.js')(app, config, routes);
require('../routes/api/user_routes.js')(app, config, routes);

module.exports = app;