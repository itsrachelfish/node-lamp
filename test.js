var five = require("johnny-five"),
    board = new five.Board();

board.on("ready", function()
{
    this.pinMode(3, five.Pin.PWM);
    this.pinMode(5, five.Pin.PWM);
    this.pinMode(6, five.Pin.PWM);

    this.pinMode(9, five.Pin.PWM);
    this.pinMode(10, five.Pin.PWM);
    this.pinMode(11, five.Pin.PWM);

    loop(this);    
});

var fade = {value: 0, step: 1};

function loop(board)
{
    if(fade.value < 0)
    {
        fade.value = 0;
        fade.step = 1;
    }
    
    if(fade.value > 255)
    {
        fade.value = 255;
        fade.step = -1;
    }
    
    board.analogWrite(3, fade.value);
    board.analogWrite(5, fade.value);
    board.analogWrite(6, fade.value);    
    
    board.analogWrite(9, fade.value);
    board.analogWrite(10, fade.value);
    board.analogWrite(11, fade.value);    
    
    fade.value += fade.step;

    setTimeout(function() { loop(board) }, 5);
} 
