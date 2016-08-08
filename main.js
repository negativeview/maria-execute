"use strict";

const EventEmitter = require('events');
const ExecutionContext = require('./execution-context.js');

class MariaExecute extends EventEmitter {
	constructor() {
		super();
		this.contexts = {};
	}

	_getKey(user, channel, server) {
		return (user ? user.discordID : '') + ':' + (channel ? channel.discordID : '') + ':' + (server ? server.discordID : '');
	}

	/**
	 * The main function. Given a userID, channelID, and serverID, execute the
	 * given code and callback with any errors or results from said execution.
	 **/
	execute(user, channel, server, code, cb) {
		var key = this._getKey(user, channel, server);
		if (key in this.contexts) {
			this.doExecution(this.contexts[key], code, cb);
		} else {
			this.createContext(
				user, channel, server, (error, context) => {
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
		process.nextTick(
			() => {
				cb(context.execute(code));
			}
		);
	}

	createContext(user, channel, server, cb) {
		var key = this._getKey(user, channel, server);
		var context = new ExecutionContext(user, channel, server);
		this.contexts[key] = context;
		context.on('done', () => {
			return cb(null, context);
		});
	}
}

module.exports = MariaExecute;