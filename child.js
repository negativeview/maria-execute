process.on('uncaughtException', (err) => {
	console.log('got uncaught exception', err);
});

process.on('message', (m) => {
	console.log('got message', m);
});