var net = require('net');
var count = 0,
	users = {};
var server = net.createServer(function (conn) {
	console.log('\033[90m new connection!\033[39m');
	conn.write(
		'\n > welcome to \033[92mnode-chat\033[39m!' +
		'\n > ' + count + ' other people on this server' +
		'\nplease write your name and hit enter: '
	);
	count++;
	conn.setEncoding('utf8');
	var nickname;
	conn.on('data', function (data) {
		console.log(data);
		data = data.replace('\r\n', '');
		if (!nickname) {
			if (users[data]) {
				conn.write('\033[93m> nickname already in use. try again: \033[39m');
				return;
			} else {
				nickname = data;
				users[nickname] = conn;

				broadcast('\033[90m >' + nickname + ' joined\033[39m\n');

			}
		} else {

			broadcast('\033[96m >' + nickname + ': \033[39m' + data + '\n');

		}
	});

	function broadcast(msg, execptMe) {
		for (var i in users) {
			if (!execptMe || i != nickname) {
				users[i].write(msg);
			}
		}
	}
	conn.on('close', function () {
		count--;
		delete users[nickname];
		broadcast('\033[90m > ' + nickname + ' Left The Room\033[39\n');
	});
});

server.listen(3000, function () {
	console.log('\033[96m  server listening on *:3000\033[39m');
});
