"use strict";

const EventEmitter = require('events');

class ExecutionContext extends EventEmitter {
	constructor(userID, channelID, serverID) {
		process.nextTick(() => {
			this.emit('done');
		});
	}
}

module.exports = ExecutionContext;