/**
 * Server
 *
 * This file serves for global functions and variables.
 */

module.exports = function() {
	/* Server variables. */
	this.ConsoleLogginOn = true;
	
	/* Server functions. */
	this.ServerLog = function(ip, header, message, suspicious) {
		if (this.ConsoleLoggingOn) {
			const attention_message = suspicious ? 'ATTENTION #' : '';
			console.log('>', TimeStamp()+'#'+'IP::'+ip+'$'+header+':', message+';');
		}
	};

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
	};
}