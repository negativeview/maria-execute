"use strict";

const EventEmitter = require('events');

class ExecutionToken extends EventEmitter {
	constructor() {
		super();
		this.timeStart = null;
	}

	start() {
		this.emit('started');
		this.timeStart = process.hrtime();
	}
}

module.exports = ExecutionToken;