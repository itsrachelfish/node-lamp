// Usage: I LOVE LAMPS
// user@host:~/node-lamp$ node lamp.js

var express = require('express'),
    app     = require('express')(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    users   = 0;


server.listen(1439);


// Create routes for static content and the index
app.use(express.static(__dirname + '/static'));
app.get('/', function (req, res)
{
  res.sendfile(__dirname + '/index.html');
});

// LAMP
var five = require("johnny-five"),
    board = new five.Board();

board.on("ready", function()
{
    var arduino = this;
    arduino.pinMode(3, five.Pin.PWM);
    arduino.pinMode(5, five.Pin.PWM);
    arduino.pinMode(6, five.Pin.PWM);

    arduino.pinMode(9, five.Pin.PWM);
    arduino.pinMode(10, five.Pin.PWM);
    arduino.pinMode(11, five.Pin.PWM);

    io.sockets.emit('status', {message: "Board Ready"});

    // Websockets magic
    io.sockets.on('connection', function (socket)
    {
        users++;

        // Notify other clients of the new user
        io.sockets.emit('users', {count: users});

        // Let the new user know they're connected
        socket.emit('status', {message: "Connected"});

        // Update the arduino... trusting user input!?!?!
        socket.on('update', function(update)
        {
            arduino.analogWrite(update.pin, update.value);
        });

        // Bye bye :'(
        socket.on('disconnect', function ()
        {
            users--;        
            io.sockets.emit('users', {count: users});
        });
    });
});
