/**
 * FOOTING.
 * Namespace: src/config
 * January 12, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */


/* Dependencies. */
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const csurf = require('csurf');
const express = require('express');
const expressSession = require('express-session');
const jwt = require('jsonwebtoken');
const ConnectMongo = require('connect-mongo')(expressSession);
const mongoose = require('mongoose');
const mysql = require('mysql');
const UIDGenerator = require('uid-generator');


/* Environment Variables. */
const SERVER_PORT = 3030;
const SERVER_IP = "localhost";
const SERVER_FUNCTIONS = require('./server.js')();
const BCRYPT_SALT_ROUNDS = 14;
const CSURF_SECRET = "SECRET";
const CSRF_PROTECTION = csurf({ cookie: true });
const SESSION_SECRET = "SECRET";
const JWT_SECRET = "SECRET";

/* DATABASE CONFIG */
const mongoDBUrl = 'mongodb://localhost/test_db';
const dbHost = 'localhost';
const dbUser = 'root';
const dbName = 'test_db';
const userTable = 'Users'; // Default name for table that stores users (can change).


/* Database connections. */
const mongoDatabase = mongoose.createConnection(mongoDBUrl, { useNewUrlParser: true });
const sqlDB = mysql.createConnection({
	host: dbHost,
	user: dbUser,
	database: dbName
});


/* Express SESSION CONFIG */
const session_config = {
	secret: SESSION_SECRET,
	store: new ConnectMongo({ mongooseConnection: mongoDatabase }),
	saveUninitialized: false,
	resave: false
};



module.exports = {
	dependencies: {
		bcrypt: bcrypt,
		bodyParser: bodyParser,
		ConnectMongo: ConnectMongo,
		cookieParser: cookieParser,
		cors: cors,
		csurf: csurf,
		express: express,
		expressSession: expressSession,
		jwt: jwt,
		mongoose: mongoose,
		mysql: mysql,
		UIDGenerator: UIDGenerator
	},
	configurations: {
		bcrypt: {
			saltRounds: BCRYPT_SALT_ROUNDS
		},
		connectMongo: {
			url: mongoDBUrl
		},
		csurf: {
			secret: CSURF_SECRET,
			protection: CSRF_PROTECTION
		},
		expressSession: {
			config: session_config
		},
		jwt: {
			secret: JWT_SECRET
		},
		mysql: {
			tables: {
				users: userTable
			}
		}
	},
	server: {
		port: SERVER_PORT,
		ip: SERVER_IP,
		functions: SERVER_FUNCTIONS
	},
	databases: {
		mongo: mongoDatabase,
		sql: sqlDB
	}
};