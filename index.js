var net = require('net')
var fs = require("fs");
var users = fs.readFileSync("database/users.json", "utf8");
console.log(users);
users = JSON.parse(users);
console.log(users);


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
			} else if (!signup) {
				if (!password) {
					if (users[data]) {
						conn.write('please enter your password: ');
						password = "pross";
						username = data;

						return;
					} else {
						conn.write('unknown username try again: ');
					}
				} else {
					if (users[username] == data) {
						conn.write('Loggedin \n');
						loggedin = true;
						conn.write('Welcome '+ username);
						return;
					} else {
						conn.write('wrong password try again: ');
					}
				}

			}
			if (signup) {

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
						conn.write('Password verifed\n');
						verifying = false;
						users[username] = password;
						var cache = [];
						var store = JSON.stringify(users, function (key, value) {
							if (typeof value === 'object' && value !== null) {
								if (cache.indexOf(value) !== -1) {
									// Circular reference found, discard key
									return;
								}
								// Store value in our collection
								cache.push(value);
							}
							return value;
						});
						cache = null;

						fs.writeFile('./database/users.json', store, function (err) {
							if (err) {
								return console.log(err);
							}
							console.log('saved');
							loggedin = true;
							conn.write('Welcome '+ username);
						});
					} else {
						conn.write('Passwords do not mach try again: ');
					}
				}

			}

		} else {
			
		}


	});

	conn.on('close', function () {
		console.log(username + 'disconnected\n');
	});
});

server.listen(3000, function () {
	console.log('\033[96m  server listening on *:3000\033[39m');
});
