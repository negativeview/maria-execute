"use strict";

const EventEmitter = require('events');
const ExecutionContext = require('./execution-context.js');

class MariaExecute extends EventEmitter {
	constructor() {

	}

	/**
	 * The main function. Given a userID, channelID, and serverID, execute the
	 * given code and callback with any errors or results from said execution.
	 **/
	execute(userID, channelID, serverID, code, cb) {
		var key = (userID ? userID : '') + ':' + (channelID ? channelID : '') + ':' + (serverID ? serverID : '');
		if (key in this.contexts) {
			this.doExecution(this.contexts[key], code, cb);
		} else {
			this.createContext(
				userID, channelID, serverID, (errors, context) => {
					if (error) {
						process.nextTick(() => {
							return cb(error);
						});
						return;
					}

					this.doExecution(context, code, cb);
				}
			);
		}
	}

	doExecution(context, code, cb) {
		process.nextTick(() => {
			return cb("doExecution Unimplemented");
		});
	}

	createContext(userID, channelID, serverID, cb) {
		var key = (userID ? userID : '') + ':' + (channelID ? channelID : '') + ':' + (serverID ? serverID : '');
		var context = new ExecutionContext(userID, channelID, serverID);
		this.contexts[key] = context;
		context.on('done', () => {
			return cb(null, context);
		});
	}
}