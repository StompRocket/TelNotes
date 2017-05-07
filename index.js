var net = require('net')
var fs = require("fs");
var users = require('./database/users.json');

var server = net.createServer(function (conn) {
	console.log('\033[90m new connection!\033[39m');
	conn.setEncoding('utf8');
	conn.write(
		'Welcome to TelNotes. \nPlease type in your username, if you are creating an account type signup\n>'
	);
	var loggedin = false,
		signup = false,
		verifying = false,
		username = null,
		password = null;
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
				return;
			}
			if (signup) {
				function censor(censor) {
					var i = 0;

					return function (key, value) {
						if (i !== 0 && typeof (censor) === 'object' && typeof (value) == 'object' && censor == value)
							return '[Circular]';

						if (i >= 29) // seems to be a harded maximum of 30 serialized objects?
							return '[Unknown]';

						++i; // so we know we aren't using the original object anymore

						return value;
					}
				}
				if (users[data]) {
					conn.write('\033[93m> Username already in use. try again: \033[39m');
					return;
				} else if (!username) {
					users[username] = conn;
					conn.write('Please create a password: ');
					username = data;
				} else if (!password) {
					password = data;
					conn.write('Please verify your password: ');
					verifying = true;
				} else if (verifying) {
					if (data == password) {
						conn.write('Password verifed');
						verifying = false;
						users[username] = password;
						var store = JSON.stringify(censor(users));
						fs.writeFile('./database/users.json', store, function (err) {
							if (err) {
								return console.log(err);
							}
							console.log('saved');
						});
					} else {
						conn.write('Passwords do not mach try again: ');
					}
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
