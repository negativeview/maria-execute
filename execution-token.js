"use strict";

const EventEmitter = require('events');

class ExecutionToken extends EventEmitter {
	constructor(code, cb) {
		super();
		this.code = code;
		this.cb = cb;
		this.timeStart = null;
		this.executionTime = null;
	}

	done() {
		this.executionTime = process.hrtime(this.timeStart);
		this.emit('done');
	}

	start() {
		this.emit('started');
		this.timeStart = process.hrtime();
	}
}

module.exports = ExecutionToken;