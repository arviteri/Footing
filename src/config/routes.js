/**
 * FOOTING.
 * Namespace: test/api
 * January 29, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

/**
 * This file is used to be able to distribute route paths throughout the application. 
 * Without this file, routes would have to be defined manually wherever needed. 
 * The MAIN PURPOSE of this file is so that if users want to change the main route paths, 
 * the tests will still work.
 */

module.exports = {
 	csrf: '/c/tkn',
 	deleteAccount: '/delete_account',
 	health: '/status',
 	login: '/login',
 	signup: '/signup',
 	test_auth: '/test/auth', // W/O CSRF Protection.
 	test_auth_csrf: '/test/auth_csrf', // W CSRF Protection.
 	test_csrf: 'test/csrf' // CSRF Test Route.
};