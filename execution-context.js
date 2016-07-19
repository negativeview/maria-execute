"use strict";

const EventEmitter = require('events');

class ExecutionContext extends EventEmitter {
	constructor(userID, channelID, serverID) {
		super();
		this.ready = false;
		this.backlog = [];
		
		process.nextTick(() => {
			this.setReady();
			this.emit('done');
		});
	}

	setReady() {
		if (this.backlog.length) {
			var toExecute = this.backlog.shift();
			this._execute(toExecute.code, toExecute.cb);
			return;
		}

		this.ready = true;
		this.emit('ready');
	}

	execute(code, cb) {
		if (this.ready) {
			this.ready = false;
			this._execute(code, cb);
		} else {
			this.backlog.push({
				code: code,
				cb: cb
			});
		}
	}

	_execute(code, cb) {
		process.nextTick(() => {
			cb('_execute not implemented');
		});
	}
}

module.exports = ExecutionContext;