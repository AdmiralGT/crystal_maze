// Buttons that can be pressed by the user to turn off lights or reset the grid
function Button(colour, text, text_colour, radius)
{
	this.colour = colour;
	this.text = text;
	this.text_colour = text_colour;
	this.radius = radius;
	this.location = null;
	this.button_id = null;
	this.text_id = null;
	this.reset = false;
    this.clicked = false;
    this.target = false;

	this.setLocation = function(buttonLocation)
	{
		this.location = buttonLocation;
	}

	this.setButtonID = function(buttonID)
	{
		this.button_id = buttonID;
	}

	this.setTextID = function(textID)
	{
		this.text_id = textID;
	}
    
    this.setReset = function(reset)
    {
        this.reset = reset;
    }

    this.setTarget = function(target)
    {
    	this.target = target
    }
}

// Class representing the segments that requiring turning off for a digit
function Digit(a, b, c, d, e, f, g, order)
{
	this.segments = new Array();
	this.segments.push(new Segment('a', a));
	this.segments.push(new Segment('b', b));
	this.segments.push(new Segment('c', c));
	this.segments.push(new Segment('d', d));
	this.segments.push(new Segment('e', e));
	this.segments.push(new Segment('f', f));
	this.segments.push(new Segment('g', g));
	this.position = 0;
    this.desired_segments = 0;
    this.active_segments = 0;
    this.order = order;
    for (var ii = 0; ii < this.segments.length; ii++)
    {
        if (this.segments[ii].desired)
        {
            this.desired_segments++;
        }
    }

	this.setPosition = function(pos)
	{
		this.position = pos;
        for (var ii = 0; ii < this.segments.length; ii++)
        {
            this.segments[ii].setDigitPos(pos);
        }
	}
}

// Class representing the location in the button grid where a button is drawn
function Position(x, y)
{
	this.x = x;
	this.y = y;
}

// A segment of lights that make up a digit
function Segment(seg, desired)
{
	this.name = seg;
	this.desired = desired;
    this.digit_pos = 0;
    
    this.setDigitPos = function(digit_pos)
    {
        this.digit_pos = digit_pos;
    }
}

