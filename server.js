var static = require('node-static');
var http = require('http');
var conf = require('./conference_server');
var Firebase = require("firebase");
var file = new(static.Server)({ cache: false });
var app = http.createServer(function(req, res) {
    file.serve(req, res);
}).listen(process.env.PORT || 3000);

var config = {
    openSocket: function(config) {
        var channel = config.channel || 'chachacha11'.replace( /\/|:|#|%|\.|\[|\]/g , '');
        console.log("open socket on channel: "+channel)
        var socket = new Firebase('https://webrtc.firebaseIO.com/' + channel);
        socket.channel = channel;
        socket.on("child_added", function(data) {
            config.onmessage && config.onmessage(data.val());
        });
        socket.send = function(data) {
            this.push(data);
        };
        config.onopen && setTimeout(config.onopen, 1);
        socket.onDisconnect().remove();
        return socket;
    },
    onRemoteStream: function(media) {
    	console.log("remote streem added");
    },
    onRemoteStreamEnded: function(stream, video) {

    },
    onRoomFound: function(room) {

    },
    onRoomClosed: function(room) {

    }
};

var confe = conf.conference_constructor(config);
confe.createRoom({roomName: 'AnS chat'})

console.log("Server started");
