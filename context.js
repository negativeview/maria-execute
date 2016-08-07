"use strict";

const Serialize = require('maria-serialize');

class Context {
	constructor() {

	}

	echo(a) {
		console.log('echo in context');
		console.log(a);
		process.send(
			{
				type: 'echo',
				message: Serialize.serialize(a)
			}
		);
	}

	valueOf() {
		return 'Value of called';
	}

	toString() {
		return 'To String Called';
	}
}

module.exports = Context;