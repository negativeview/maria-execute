const Context = require('./context.js');
const Serialize = require('maria-serialize');
const vm = require('vm');

process.on('uncaughtException', (err) => {
	process.send({
		type: 'exception',
		exception: err.stack
	});
});

process.on('message', (m) => {
	switch (m.type) {
		case 'set-context':
			console.log('set-context', m);
			setContext(m.context);
			break;
		case 'execute':
			execute(m.code);
			break;
		default:
			console.log('got unknown message in child', m);
			break;
	}
});

var context;
function setContext(c) {
	context = new Context(c);
	context = vm.createContext(context);
}

function execute(code) {
	var script = new vm.Script(code);
	script.runInContext(
		context,
		{
			displayErrors: true,
			timeout: 10000
		}
	);
	process.send(
		{
			type: 'done'
		}
	);
}