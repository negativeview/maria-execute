"use strict";

const ChildProcess = require('child_process');
const EventEmitter = require('events');
const ExecutionToken = require('./execution-token.js');
const Serialize = require('maria-serialize');

class ExecutionContext extends EventEmitter {
	constructor(userID, channelID, serverID) {
		super();
		this.ready = false;
		this.backlog = [];
		this.doneCB = null;
		this.statusCB = null;
		this.timeStart = null;

		this.createChildProcess();

		process.nextTick(() => {
			this.emit('done');
			this.setReady();
		});
	}

	createChildProcess() {
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
	}

	handleMessage(m) {
		console.log('message from child', m);
		if ('type' in m) {
			if ('__' + m.type in this) {
				this['__' + m.type](m);
				return;
			}
		}
	}

	__echo(m) {
		this.currentToken.emit('echo', Serialize.unserialize(m.message));
	}

	__exception(m) {
		console.log('__exception', m, typeof(m));
		this.currentToken.emit('exception', Serialize.unserialize(m));
		this.childProcess.kill();
		this.createChildProcess();
		this.setReady();
	}

	__done(m) {
		this.currentToken.emit('done');
		this.setReady();
	}

	setReady() {
		if (this.backlog.length) {
			var toExecute = this.backlog.shift();
			this._execute(toExecute);
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
		this.currentToken = token;
		token.start();
		var toSend = {
			type: 'execute',
			code: token.code
		};

		this.childProcess.send(
			toSend
		);
	}
}

module.exports = ExecutionContext;