var net = require('net')
var users = {};
var server = net.createServer(function (conn) {
	console.log('\033[90m new connection!\033[39m');
	conn.setEncoding('utf8');
	conn.write(
		'Welcome to TelNotes. \nPlease type in your username, if you are creating an account type signup\n>'
	);
	var loggedin, signup, username, password;
	conn.on('data', function (data) {
		console.log(data);
		data = data.replace('\r\n', '');
		if (!loggedin) {
			if (data == "signup") {
				console.log('signup start');
				conn.write(
					'please create a username: '
				);
				signup = true;
			}
			if (signup) {
				username = data;
				if (users[data]){
					conn.write('\033[93m> Username already in use. try again: \033[39m');
				return;
				} else {
					users[username] = conn;
				}
				
			}
		}


	});

	conn.on('close', function () {

	});
});

server.listen(3000, function () {
	console.log('\033[96m  server listening on *:3000\033[39m');
});
