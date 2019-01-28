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
const dotenv = require('dotenv');
const express = require('express');
const expressSession = require('express-session');
const jwt = require('jsonwebtoken');
const ConnectMongo = require('connect-mongo')(expressSession);
const mongoose = require('mongoose');
const mysql = require('mysql');
const UIDGenerator = require('uid-generator');
const SERVER_FUNCTIONS = require('./server.js')();


/* Environment Variables. See `/.env` */
const SERVER_PORT = process.env.PORT;
const SERVER_IP = process.env.HOST;
const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS;
const SESSION_SECRET = process.env.SESSION_SECRET;
const JWT_SECRET = process.env.JWT_SECRET; // Not used. Unique ID is generated for every auth token and is stored in the session.
const mongoDBUrl = process.env.MONGO_URL;
const dbHost = process.env.SQL_HOST;
const dbPort = process.env.SQL_PORT;
const dbUser = process.env.SQL_USER;
const dbPassword = process.env.SQL_PASS;
const dbName = process.env.SQL_DATABASE;
const userTable = process.env.SQL_USERS_TABLE; // Default name for table that stores users (can change).


/* DATABASE CONFIG */
const mongoDatabase = mongoose.createConnection(mongoDBUrl, { useNewUrlParser: true });
const sqlDB = mysql.createConnection({
	host: dbHost,
	port: dbPort,
	user: dbUser,
	password: dbPassword,
	database: dbName
});


/* Express SESSION CONFIG */
const CSURF_OPTIONS = {cookie: false}; // Can add csurf options here. They will automatically be enabled in `/src/routes/api/middleware/csrf.js`
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
			settings: CSURF_OPTIONS
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