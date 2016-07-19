"use strict";

const ChildProcess = require('child_process');
const EventEmitter = require('events');

class ExecutionContext extends EventEmitter {
	constructor(userID, channelID, serverID) {
		super();
		this.ready = false;
		this.backlog = [];
		this.doneCB = null;
		this.statusCB = null;

		this.childProcess = ChildProcess.fork(
			'child.js',
			[],
			{}
		);
		this.childProcess.on(
			'message',
			(m) => {
				this.handleMessage(m);
			}
		);

		process.nextTick(() => {
			this.emit('done');
			this.setReady();
		});
	}

	handleMessage(m) {
		if ('type' in m) {
			if ('__' + m.type in this) {
				this['__' + m.type](m);
				return;
			}
		}
		console.log('message from child', m);
	}

	setReady() {
		if (this.backlog.length) {
			var toExecute = this.backlog.shift();
			this._execute(toExecute.code, toExecute.doneCB, toExecute.statusCB);
			return;
		}

		this.ready = true;
		this.emit('ready');
	}

	execute(code, doneCB, statusCB) {
		if (this.ready) {
			this.ready = false;
			this._execute(code, doneCB, statusCB);
		} else {
			this.backlog.push({
				code: code,
				doneCB: doneCB,
				statusCB: statusCB
			});
		}
	}

	_execute(code, doneCB, statusCB) {
		var toSend = {
			type: 'execute',
			code: code
		};

		this.doneCB = doneCB;
		this.statusCB = statusCB;

		this.childProcess.send(
			toSend
		);
	}
}

module.exports = ExecutionContext;