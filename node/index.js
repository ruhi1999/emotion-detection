var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var httpserver = require('http').createServer();
var ioserver = require('socket.io')(httpserver)

var stubsockets = new Set();

app.get('/', function(req, res){
	  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('a web client connected');
	socket.on('disconnect', function(){
		console.log('web client disconnected');
	});
	socket.on('test', function(data){
		console.log(data);
		d = new Date();
		stubsockets.forEach(function(sock) {
			// Call below when message received from chat
			// Change to send reference of message
			sock.emit('message', {user: data, time: d.getTime(), channel: "whatever"})
		});
	});
});

ioserver.on('connection', function(socket){
	console.log('an emotion client connected');
	stubsockets.add(socket);
	socket.on('emote', function(data) {
		console.log('incoming emote' + data.response)
		io.emit('data', data);
		// if emotion is what we want, add response emoji to message referenced by data
		// data.whatever is "whatever": variable in swift code
	});
	socket.on('disconnect', function(){
		console.log('emotion client disconnected');
		stubsockets.delete(socket);
	});
});

http.listen(3000, function(){
	  console.log('listening on *:3000');
});

httpserver.listen(3001, function(){
	console.log('stub server listening on *:3001');
});
