var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

let users = [];
let messages = [];

io.on('connection', function(socket){
	socket.emit('send ID', socket.id);

	socket.on('new user', function(user) {
		user.sockedID = socket.id;
		users.push(user);
		socket.broadcast.emit('update users', users);
		setTimeout(() => { changeStatus(user) }, 60100); 	// "менше хвилини включно", поэтому накинул милисекунду
	});

	const changeStatus = (user) => {
		let index;
		for (var i = 0; i < users.length; i++) {
			if (users[i].userNickName == user.userNickName) {
				index = i;
				break;
			}
		}
		user.status = 'online';
		users.splice(index, 1, user);
		io.sockets.emit('update users', users);
	};

	socket.on('requestHistory', function() {
		socket.emit('responseHistory', messages, users);
	});

	socket.on('chat message', function(msg){
		socket.broadcast.emit('chat message', msg);
		if (messages.length > 10) {
			messages.shift();
			messages.push(msg);
		} else {
			messages.push(msg);
		}
	});

	socket.on('is typing', (data) => {
		if (data.isTyping == true) {
			socket.broadcast.emit('typing', {userNickName: data.userNickName}, false);
		} else {
			socket.broadcast.emit('typing', {userNickName: data.userNickName}, true);
		}
	});

	socket.on('get offline', (user) => {
		let index;
		for (var i = 0; i < users.length; i++) {
			if (users[i].userNickName == user.userNickName) {
				index = i;
				break;
			}
		}
		user.status = 'offline';
		users.splice(index, 1, user);
		io.sockets.emit('update users', users);
	});

	socket.on('disconnect', () => {
		io.sockets.emit('update users', users);
	});
});

http.listen(port, function(){
	console.log('listening on *:' + port);
});
