"use strict";

const Serialize = require('maria-serialize');

class Context {
	constructor(c) {
		this.c = c;
	}

	echo(a) {
		process.send(
			{
				type: 'echo',
				message: Serialize.serialize(a)
			}
		);
	}
}

module.exports = Context;