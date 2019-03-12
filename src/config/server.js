/**
 * FOOTING.
 * Namespace: src/config
 * January 14, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

module.exports = function(){

	
	/*
	 * Server variables below.
	 */
	this.ConsoleLoggingOn = true;

	
	/*
	 * Server functions below.
	 */
	this.TimeStamp = function() {
		
		let now = new Date();
		let currentDate = {
			year: now.getFullYear(),
			month: now.getMonth() + 1,
			day: now.getDate(),
		};
		let currentTime = {
			hours: now.getHours(),
			min: now.getMinutes(),
			sec: now.getSeconds()
		};
		let timestamp = currentDate.year+"-"+currentDate.month+"-"+currentDate.day+"::"+currentTime.hours+":"+currentTime.min+":"+currentTime.sec;
		return timestamp;
	}


	this.SetConsoleLogging = function(val) {
		this.ConsoleLoggingOn = val;
	}


	this.ServerLog = function (ip, header, message, suspicious) {
		if (ConsoleLoggingOn) {
			const now = TimeStamp();
			const attention = suspicious ? " ATTENTION #":"";
			const log = "> "+now+"#"+attention+"IP::"+ip+"$"+header+": "+message+";";	
			console.log(log);
		}
	}

}


