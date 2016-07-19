"use strict";

const ChildProcess = require('child_process');
const EventEmitter = require('events');
const ExecutionToken = require('./execution-token.js');

class ExecutionContext extends EventEmitter {
	constructor(userID, channelID, serverID) {
		super();
		this.ready = false;
		this.backlog = [];
		this.doneCB = null;
		this.statusCB = null;
		this.timeStart = null;

		this.childProcess = ChildProcess.fork(
			__dirname + '/child.js',
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

	__echo(m) {
		this.statusCB(m);
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

	execute(code, cb) {
		var token = new ExecutionToken(code, cb);

		if (this.ready) {
			this.ready = false;
			this._execute(token);
		} else {
			this.backlog.push(token);
		}

		return token;
	}

	_execute(token) {
		token.start();
		var toSend = {
			type: 'execute',
			code: code
		};

		this.childProcess.send(
			toSend
		);
	}
}

module.exports = ExecutionContext;