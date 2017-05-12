var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var httpserver = require('http').createServer();
var ioserver = require('socket.io')(httpserver)

var stubsockets = new Set();
/*
if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();
*/


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
		socket.emit('message', data);
		stubsockets.forEach(function(sock) {
			sock.emit('message', 'random');
			// Call below when message received from chat
			// Change to send reference of message
                        //controller.hears(‘ambient’, function(bot, message) {
			//sock.emit(message, {user, message.ts})
		});
	});
});

ioserver.on('connection', function(socket){
	console.log('an emotion client connected');
	socket.emit('message', 'random');
	stubsockets.add(socket);
	socket.on('emote', function(data) {
		console.log('incoming emote' + data.response)
		io.emit('data', data);

		// if emotion is what we want, add response emoji to message referenced by data
		// data.whatever is "whatever": variable in swift code
        /*controller.hears(['emotion'],'direct_mention,direct_message,mention', function(bot, message) {
                console.log(message.ts, message.channel);
                bot.api.reactions.add({
                    timestamp: message.ts,
                    channel: message.channel,
                    name: 'grinning',
                }, function(err, res) {
                    if (err) {
                        bot.botkit.log('Failed to add emoji reaction :(', err);
                    }
            });
        });*/

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
