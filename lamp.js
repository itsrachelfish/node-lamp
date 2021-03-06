// Usage: I LOVE LAMPS
// user@host:~/node-lamp$ node lamp.js

var express = require('express'),
    app     = require('express')(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    users   = 0;


server.listen(1337);


// Create routes for static content and the index
app.use(express.static(__dirname + '/static'));
app.get('/', function (req, res)
{
  res.sendfile(__dirname + '/index.html');
});

// LAMP
var five = require("johnny-five"),
    board = new five.Board(),
    pins = [3, 5, 6, 9, 10, 11];

board.on("ready", function()
{
    var arduino = this;

    function everyPin(value)
    {
        for(var i = pins.length - 1; i >= 0; i--)
        {
            arduino.analogWrite(pins[i], value);
        }
    }

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

        // Turn the lights on when someone connects
        everyPin(255);

        // Notify other clients of the new user
        io.sockets.emit('users', {count: users});

        // Let the new user know they're connected
        socket.emit('status', {message: "Connected"});

        // Update the arduino... trusting user input!?!?!
        socket.on('update', function(update)
        {
            io.sockets.emit('update', update);
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
