var net = require('net')
var server = net.createServer(function (conn) {
	console.log('\033[90m new connection!\033[39m');
	conn.write(
		
	);
	count++;
	conn.setEncoding('utf8');
	
	conn.on('data', function (data) {
		console.log(data);
		
	});


	conn.on('close', function () {
		
	});
});

server.listen(3000, function () {
	console.log('\033[96m  server listening on *:3000\033[39m');
});
