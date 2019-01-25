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
const session = config.dependencies.expressSession;

// Define variables associated with dependencies.
const bodyParserConfig = { extended: true };
const session_config = config.configurations.expressSession.config;

var whitelist = ['http://localhost:3030', 'http://localhost:3000']
var corsOptions = {
	origin: 'http://localhost:3000',
	allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept', 'Cookie', 'Origin', "credentials"],
 	methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  	credentials: true
}

app.use(cors(corsOptions));
app.options(cors(corsOptions));
app.post(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session(session_config));
//app.use(csurf()); // GLOBAL CSRF PROTECTION.

// Export file as `app` variable.
module.exports = app;