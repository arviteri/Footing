module.exports = function(_dir, projType, projName) {

	return {
		"unix": {
			"createDirs": `mkdir ${projName} ${projName}/src ${projName}/src/config ${projName}/src/controllers ${projName}/src/handlers ${projName}/src/models ${projName}/src/routes ${projName}/src/routes/api ${projName}/src/routes/middleware`,
			"cpPackageJSON": `cp ${_dir}/lib/package.json ${projName}/package.json`,
			"cpEnvFile": `cp ${_dir}/lib/env.${projType}.dist ${projName}/.env`,
			"cpTests": `cp -r ${_dir}/lib/test.${projType} ${projName}/test`,
			"cpMainFile": `cp ${_dir}/lib/main.${projType}.js ${projName}/src/main.js`,
			"cpConfigFiles": `cp ${_dir}/lib/config/app.js ${projName}/src/config/app.js && cp ${_dir}/lib/config/routes.js ${projName}/src/config/routes.js && cp ${_dir}/lib/config/server.js ${projName}/src/config/server.js && cp ${_dir}/lib/config/config.${projType}.js ${projName}/src/config/config.js`,
			"cpControllers": `cp ${_dir}/lib/controllers/user_controller.${projType}.js ${projName}/src/controllers/user_controller.js`,
			"cpHandlers": `cp ${_dir}/lib/handlers/auth_handler.js ${projName}/src/handlers/auth_handler.js`,
			"cpModels": `cp ${_dir}/lib/models/errors.js ${projName}/src/models/errors.js && cp ${_dir}/lib/models/user.js ${projName}/src/models/user.js`,
			"cpRoutes": `cp ${_dir}/lib/routes/api/status_routes.js ${projName}/src/routes/api/status_routes.js && cp ${_dir}/lib/routes/api/user_routes.js ${projName}/src/routes/api/user_routes.js && cp ${_dir}/lib/routes/middleware/auth_middleware.js ${projName}/src/routes/middleware/auth_middleware.js && cp ${_dir}/lib/routes/middleware/csrf_middleware.js ${projName}/src/routes/middleware/csrf_middleware.js`,
			"installModules": `cd ${projName} && npm install`
		},
		"windows": {
			"createDirs": `mkdir ${projName} ${projName}/src ${projName}/src/config ${projName}/src/controllers ${projName}/src/handlers ${projName}/src/models ${projName}/src/routes ${projName}/src/routes/api ${projName}/src/routes/middleware`,
			"cpPackageJSON": `copy ${_dir}/lib/package.json ${projName}/package.json`,
			"cpEnvFile": `copy ${_dir}/lib/env.${projType}.dist ${projName}/.env`,
			"cpTests": `xcopy ${_dir}/lib/test.${projType} ${projName}/test`,
			"cpMainFile": `copy ${_dir}/lib/main.${projType}.js ${projName}/src/main.js`,
			"cpConfigFiles": `copy ${_dir}/lib/config/app.js ${projName}/src/config/app.js && copy ${_dir}/lib/config/routes.js ${projName}/src/config/routes.js && copy ${_dir}/lib/config/server.js ${projName}/src/config/server.js && copy ${_dir}/lib/config/config.${projType}.js ${projName}/src/config/config.js`,
			"cpControllers": `copy ${_dir}/lib/controllers/user_controller.${projType}.js ${projName}/src/controllers/user_controller.js`,
			"cpHandlers": `copy ${_dir}/lib/handlers/auth_handler.js ${projName}/src/handlers/auth_handler.js`,
			"cpModels": `copy ${_dir}/lib/models/errors.js ${projName}/src/models/errors.js && copy ${_dir}/lib/models/user.js ${projName}/src/models/user.js`,
			"cpRoutes": `copy ${_dir}/lib/routes/api/status_routes.js ${projName}/src/routes/api/status_routes.js && copy ${_dir}/lib/routes/api/user_routes.js ${projName}/src/routes/api/user_routes.js && copy ${_dir}/lib/routes/middleware/auth_middleware.js ${projName}/src/routes/middleware/auth_middleware.js && copy ${_dir}/lib/routes/middleware/csrf_middleware.js ${projName}/src/routes/middleware/csrf_middleware.js`,
			"installModules": `cd ${projName} && npm install`
		}
	}
}