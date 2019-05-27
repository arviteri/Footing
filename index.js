#!/usr/bin/env node

const path = require('path');
const rootDir = path.dirname(require.main.filename);
const { exec } = require('child_process');

const isWin = process.platform === "win32";
const args = process.argv.slice(2);
const cmd = args[0];
const cmdArgs = args.slice(1);
var bashCmds;

function showHelp() {
	console.log("Help Menu.");
}

function createProject() {
	return new Promise(function(resolve, reject) {
		console.log("Creating project directory structure...");
		exec(bashCmds["createDirs"], function(err, stdout, sterr) {
			if (err) {
				console.log(err);
				process.exit(1);
			}
			console.log("Creating project files...");
			for (i in bashCmds) {
				if (i != "installModules" && i != "createDirs") {
					exec(bashCmds[i], function (err, stdout, sterr) {
						if (err) {
							console.log(err);
							process.exit(1);
						}
					})
				}
			}

			console.log("Installing node modules...");
			exec(bashCmds["installModules"], function(err, stdout, sterr) {
				if (err) {
					console.log(err);
					process.exit(1);
				}
				resolve();
			});
		});
	});
}


function executeCmd(cmd, args) {
	var projType;
	var projName;

	if (cmd == "new") {
		if (args.length < 1) {
			console.log("Please specify a project type ['mysql','mongo'] and a project name.");
		} else if (args[0] != 'mysql' && args[0] != 'mongo') {
			console.log("Incorrect project type. Available options are ['mysql','mongo']");
		} else if (args.length < 2) {
			console.log("Please specify a project name.");
		} else {
			projType = args[0];
			projName = args[1];
			bashCmds = require('./src/commands.js')(rootDir, projType, projName);
			bashCmds = isWin ? bashCmds['windows'] : bashCmds['unix'];
			console.log(`Creating project: ${projName}`);
			createProject(projType, projName).then(function() {
				console.log("Done.");
			});
		}
	} else {
		showHelp();
		process.exit(0);
	}
}

if (cmd == undefined || cmd == "-help") {
	showHelp();
	process.exit(0);
}
executeCmd(cmd, cmdArgs);