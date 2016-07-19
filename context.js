"use strict";

const Serialize = require('maria-serialize');

class Context {
	constructor() {

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