"use strict";

const EventEmitter = require('events');

class ExecutionContext extends EventEmitter {
	constructor(userID, channelID, serverID) {
		super();
		process.nextTick(() => {
			this.emit('done');
		});
	}
}

module.exports = ExecutionContext;