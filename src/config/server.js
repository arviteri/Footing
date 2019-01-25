/**
 * FOOTING.
 * Namespace: src/config
 * January 14, 2019
 * LICENSE: MIT
 * Andrew Viteri
 */

module.exports = function(){

	///////////////////////////////////////////////
	///////      SERVER  FUNCTIONS         ///////
	/////////////////////////////////////////////

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

	this.ServerLog = function (ip, header, message, suspicious) {
		const now = TimeStamp();
		const attention = suspicious ? " ATTENTION #":"";
		const log = "> "+now+"#"+attention+"IP::"+ip+"$"+header+": "+message+";";	
		console.log(log);
	}

}


