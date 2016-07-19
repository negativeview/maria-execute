const Context = require('./context.js');
const Serialize = require('maria-serialize');
const vm = require('vm');

process.on('uncaughtException', (err) => {
	process.send({
		type: 'exception',
		exception: Serialize.serialize(err)
	});
});

process.on('message', (m) => {
	switch (m.type) {
		case 'execute':
			execute(m.code);
			break;
		default:
			console.log('got unknown message in child', m);
			break;
	}
});

function execute(code) {
	var context = new Context();
	context = vm.createContext(context);
	var script = new vm.Script(code);
	console.log('executing', code);
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