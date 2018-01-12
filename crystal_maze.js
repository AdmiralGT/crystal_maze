var svgNS = "http://www.w3.org/2000/svg";
var global_button_locations = new Array();
var global_button_list = new Array();
var global_digit_list = new Array();
var lit = "#ffffcc"
var switchboard_rows = 19;
var switchboard_columns = 40;
var switchboard_radius = 10;
var switchboard_diameter = 2 * switchboard_radius;
var switchboard_width = switchboard_diameter * switchboard_columns;
var switchboard_height = switchboard_diameter * switchboard_rows;
var button_radius = 40;
var button_diameter = 2 * button_radius;
var button_grid_width = Math.floor(switchboard_width / (button_diameter));
var segment_size = 5;
var total_segments = 0;

function turn_all_lights_on()
{
	for (row = 0; row < switchboard_rows; row++)
	{
		for (column = 0; column < switchboard_columns; column++)
		{
			var element_name = "#circle_" + column + "_" + row;
			$(element_name).attr('fill', lit);
		}
	}
}

// Turn off some lights
function change_lights()
{
	for (digit_num = 0; digit_num < global_digit_list.length; digit_num++)
	{
		var digit = global_digit_list[digit_num];
		var digit_transform = transform_to_digit(digit_num);

		for (segment_num = 0; segment_num < digit.segments.length; segment_num++)
		{
			var segment = digit.segments[segment_num];
			if (segment.desired)
			{
				var transforms = transform_to_segment(segment.name, digit_transform);

				for (transform_num = 0; transform_num < transforms.length; transform_num++)
				{
					var transform = transforms[transform_num];
					var name = "#circle_" + transform.x + "_" + transform.y;
					$(name).attr('fill', 'black');
				}
			}
		}
	}
}

//
function transform_to_digit(digit)
{
    var digit_width = segment_size + 2 + 2;
    var total_width = (digit_width * 3) + (segment_size + 2);
    var total_height = (2 * segment_size) + 3;
    var horizontal_offset = Math.floor((switchboard_columns - total_width)/2);
    var vertical_offset = Math.floor((switchboard_rows - total_height)/2);
	return new Transform((digit_width*digit) + horizontal_offset, vertical_offset);
}

function transform_to_segment(segment, digit_transform)
{
	var transforms = new Array();
    var segment_offset = segment_size + 1;
	if (segment == 'a')
	{
		for (var ii = 0; ii < segment_size; ii++)
		{
			transforms.push(new Transform(digit_transform.x + ii + 1,
			                              digit_transform.y));
		}
	}
	else if (segment == 'b')
	{
		for (var ii = 0; ii < segment_size; ii++)
		{
			transforms.push(new Transform(digit_transform.x + segment_offset,
			                              digit_transform.y + ii + 1));
		}
	}
	else if (segment == 'c')
	{
		for (var ii = 0; ii < segment_size; ii++)
		{
			transforms.push(new Transform(digit_transform.x + segment_offset,
			                              digit_transform.y + ii + segment_offset + 1));
		}
	}
	else if (segment == 'd')
	{
		for (var ii = 0; ii < segment_size; ii++)
		{
			transforms.push(new Transform(digit_transform.x + ii + 1,
			                              digit_transform.y + (2 * segment_offset)));
		}
	}
	else if (segment == 'e')
	{
		for (var ii = 0; ii < segment_size; ii++)
		{
			transforms.push(new Transform(digit_transform.x,
			                              digit_transform.y + ii + segment_offset + 1));
		}
	}
	else if (segment == 'f')
	{
		for (var ii = 0; ii < segment_size; ii++)
		{
			transforms.push(new Transform(digit_transform.x,
			                              digit_transform.y + ii + 1));
		}
	}
	else if (segment == 'g')
	{
		for (var ii = 0; ii < segment_size; ii++)
		{
			transforms.push(new Transform(digit_transform.x + ii + 1,
			                              digit_transform.y + segment_offset));
		}
	}
	return transforms;
}

// How to transform position from the top left of the switch board
function Transform(x, y)
{
	this.x = x;
	this.y = y;
}

// Just a function that turns some lights off for testing.
function change_lights_test()
{
	colour = 'black';

	$("#circle_4_3").attr('fill', colour);
	$("#circle_5_3").attr('fill', colour);
	$("#circle_6_3").attr('fill', colour);
	$("#circle_3_4").attr('fill', colour);
	$("#circle_3_5").attr('fill', colour);
	$("#circle_3_6").attr('fill', colour);
	$("#circle_7_4").attr('fill', colour);
	$("#circle_7_5").attr('fill', colour);
	$("#circle_7_6").attr('fill', colour);
	$("#circle_4_7").attr('fill', colour);
	$("#circle_5_7").attr('fill', colour);
	$("#circle_6_7").attr('fill', colour);
	$("#circle_3_8").attr('fill', colour);
	$("#circle_3_9").attr('fill', colour);
	$("#circle_3_10").attr('fill', colour);
	$("#circle_7_8").attr('fill', colour);
	$("#circle_7_9").attr('fill', colour);
	$("#circle_7_10").attr('fill', colour);
	$("#circle_4_11").attr('fill', colour);
	$("#circle_5_11").attr('fill', colour);
	$("#circle_6_11").attr('fill', colour);

	$("#circle_11_3").attr('fill', colour);
	$("#circle_12_3").attr('fill', colour);
	$("#circle_13_3").attr('fill', colour);
	$("#circle_11_11").attr('fill', colour);
	$("#circle_12_11").attr('fill', colour);
	$("#circle_13_11").attr('fill', colour);
	$("#circle_10_4").attr('fill', colour);
	$("#circle_10_5").attr('fill', colour);
	$("#circle_10_6").attr('fill', colour);
	$("#circle_14_4").attr('fill', colour);
	$("#circle_14_5").attr('fill', colour);
	$("#circle_14_6").attr('fill', colour);
	$("#circle_10_8").attr('fill', colour);
	$("#circle_10_9").attr('fill', colour);
	$("#circle_10_10").attr('fill', colour);
	$("#circle_14_8").attr('fill', colour);
	$("#circle_14_9").attr('fill', colour);
	$("#circle_14_10").attr('fill', colour);
}

// Function called when a button is pressed
function test()
{
    var button = getButtonFromElementID(this.event.target.id);

    if (button.reset)
    {
    	turn_all_lights_on();
	   	shuffleButtons();
    }
    else
    {
    	change_lights();
    	//change_lights_test();
    }

}

// Generate the grid of lightbulbs that will be turned off to reveal the code.
function generate_switch_grid()
{
	var grid_svg = document.getElementById("lightboard_grid");
	grid_svg.setAttribute("width", switchboard_width);
	grid_svg.setAttribute("height", switchboard_height);
	for (var row = 0; row < switchboard_rows; row++)
	{
		for (var column = 0; column < switchboard_columns; column++)
		{
			var circle = document.createElementNS(svgNS, "circle");
			var id = "circle_" + column + "_" + row;
			var centre_x = (column * switchboard_diameter) + switchboard_radius;
			var centre_y = (row * switchboard_diameter) + switchboard_radius;
			var colour = "red";
			var stroke = "black";
			var stroke_width = 2;
			circle.setAttributeNS(null, 'id', id);
			circle.setAttributeNS(null, 'cx', centre_x);
			circle.setAttributeNS(null, 'cy', centre_y);
			circle.setAttributeNS(null, 'r', switchboard_radius - 1);
			circle.setAttributeNS(null, 'fill', lit);
			circle.setAttributeNS(null, 'stroke', stroke);
			circle.setAttributeNS(null, 'stroke-width', stroke_width);

			grid_svg.appendChild(circle);
		}
	}
}

// Generate the grid of buttons that can be pressed to turn off lights or reset
// the light board.
function generate_button_grid()
{
	// All buttons have the same border for now...
	var stroke = "block";
	var stroke_width = 2;

	// Generate the general SVG area to put buttons in.
    var height = 300;
	var switch_svg = document.getElementById("switch_grid");
	switch_svg.setAttribute("width", switchboard_width);
	switch_svg.setAttribute("height", height);

	// Generate a local copy of the global button list as we're going to remove elements from it
	for (var button_num = 0; button_num < global_button_list.length; button_num++)
	{
		// Get the Button Object from our global list and generate a element name for this Button.
		var button = global_button_list[button_num];
		var button_id = "button_" + button_num.toString().padStart(2, "0");
		button.setButtonID(button_id);

		// Create a group attribute for the circle and text.
		var g = document.createElementNS(svgNS, "g");
		switch_svg.appendChild(g);

		// Create the button element with the properties from the Button.
		var button_element = document.createElementNS(svgNS, "circle");

		button_element.setAttributeNS(null, 'id', button.button_id);
		button_element.setAttributeNS(null, 'r', button.radius - 1);
		button_element.setAttributeNS(null, 'fill', button.colour);
		button_element.setAttributeNS(null, 'stroke', stroke);
		button_element.setAttributeNS(null, 'stroke-width', stroke_width);
		button_element.setAttributeNS(null, 'onclick', 'test()');

		// Put the Button element in the group.
		g.appendChild(button_element);

		var text = document.createElementNS(svgNS, "text");
		var text_id = "text_for_" + button_id;
		button.setTextID(text_id);
		text.setAttributeNS(null, 'id', text_id);
		text.setAttributeNS(null, 'style', 'fill: ' + button.text_colour);
		text.setAttributeNS(null, 'text-anchor', 'middle');
		text.setAttributeNS(null, 'onclick', 'test()');
		var text_node = document.createTextNode(button.text);
		text.appendChild(text_node);
		g.appendChild(text);

	}
	shuffleButtons();
}

// Function to build a button and put it in the global list of buttons.
function make_button(colour, text, text_colour, reset)
{
    var button = new Button(colour, text, text_colour, reset, button_radius);
    global_button_list.push(button);
}

// Function that generates all our necessary buttons
function generate_buttons()
{
	make_button("red", "RED", "black", false);
	make_button("black", "BLACK", "white", true);
	make_button("blue", "BLUE", "black", false);
	make_button("orange", "ORANGE", "black", false);
	make_button("yellow", "YELLOW", "black", false);
	make_button("green", "GREEN", "black", false);
	make_button("red", "RED", "black", false);
	make_button("black", "BLACK", "white", true);
	make_button("blue", "BLUE", "black", false);
	make_button("orange", "ORANGE", "black", false);
	make_button("yellow", "YELLOW", "black", false);
	make_button("green", "GREEN", "black", false);

	for (var button_num = 0; button_num < global_button_list.length; button_num++)
	{
		var button_location = new ButtonLocation((button_diameter * (button_num % button_grid_width)) + button_radius, 
                                                 (button_diameter*Math.floor(button_num/button_grid_width)) + button_radius);
		global_button_locations.push(button_location);
	}
}

// Function to generate the digits to determine which lights to turn off
function generate_digits(digit_string)
{
	for (var ii = 0; ii < digit_string.length; ii++)
	{
		var digit = create_digit(digit_string.charAt(ii));
		digit.setPosition(ii);
        total_segments += digit.desired_segments;
		global_digit_list.push(digit);
	}
    alert(total_segments);
}

// Function to create a Digit object for a string
// Note: This is a terrible function, but I can't yet think of a better way
//       and it does what I want.
function create_digit(digit)
{
	if (digit == '0')
	{
		return new Digit(true, true, true, true, true, true, false);
	}
	else if (digit == '1')
	{
		return new Digit(false, true, true, false, false, false, false);
	}
	else if (digit == '2')
	{
		return new Digit(true, true, false, true, true, false, true);
	}
	else if (digit == '3')
	{
		return new Digit(true, true, true, true, false, false, true);
	}
	else if (digit == '4')
	{
		return new Digit(false, true, true, false, false, true, true);
	}
	else if (digit == '5')
	{
		return new Digit(true, false, true, true, false, true, true);
	}
	else if (digit == '6')
	{
		return new Digit(true, false, true, true, true, true, true);
	}
	else if (digit == '7')
	{
		return new Digit(true, true, true, false, false, false, false);
	}
	else if (digit == '8')
	{
		return new Digit(true, true, true, true, true, true, true);
	}
	else if (digit == '9')
	{
		return new Digit(true, true, true, true, false, true, true);
	}
	else
	{
		alert('Bad digit ' + digit);
	}
}

// Used on page load to generate the light grid and buttons that will be in game
function generate_game()
{
	generate_switch_grid();
	generate_buttons();
	generate_button_grid();
	loadjsondata('answer');
}

// Buttons that can be pressed by the user to turn off lights or reset the grid
function Button(colour, text, text_colour, reset, radius)
{
	this.colour = colour;
	this.text = text;
	this.text_colour = text_colour;
	this.reset = reset;
	this.radius = radius;
	this.location = null;
	this.button_id = null;
	this.text_id = null;

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
}

// Class representing the location in the button grid where a button is drawn
function ButtonLocation(x, y)
{
	this.x = x;
	this.y = y;
}

// A segment of lights that make up a digit
function Segment(seg, desired)
{
	this.name = seg;
	this.desired = desired;
	this.current = false;
}

// Class representing the segments that requiring turning off for a digit
function Digit(a, b, c, d, e, f, g, h)
{
	this.segments = new Array();
	this.segments.push(new Segment('a', a));
	this.segments.push(new Segment('b', b));
	this.segments.push(new Segment('c', c));
	this.segments.push(new Segment('d', d));
	this.segments.push(new Segment('e', e));
	this.segments.push(new Segment('f', f));
	this.segments.push(new Segment('g', g));
	this.pos = 0;
    this.desired_segments = 0;
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
	}
}

// Get a random int between a minimum and maximum value (inclusive).
function getRandomInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shuffle the order of buttons around on the display.
function shuffleButtons()
{
	var local_button_locations = global_button_locations.slice(0);
	for (var button_num = 0; button_num < global_button_list.length; button_num++)
	{
		// Choose a random button and update it's location.
		var index = getRandomInt(0, local_button_locations.length - 1);
		var button = global_button_list[button_num];
		var location = local_button_locations[index];
		button.setLocation(location);
		redraw_button(button);

		// Remove this button for the list of buttons to shuffle.
		local_button_locations.splice(index, 1);
	}
}

// Redraw a button in it's new position
function redraw_button(button)
{
	var button_element = document.getElementById(button.button_id);
	button_element.setAttribute('cx', button.location.x);
	button_element.setAttribute('cy', button.location.y);
	var text_element = document.getElementById(button.text_id);
	text_element.setAttribute('x', button.location.x);
	text_element.setAttribute('y', button.location.y);
}

// Get a Button Object from a HTTP Element ID
function getButtonFromElementID(elementID)
{
    // Either the text or button was pressed, the last 8 characters is always
    // the button's buttonID.
    var button_num_string = this.event.target.id.substr(this.event.target.id.length - 2);
    var button_num = parseInt(button_num_string, 10);
    var button = global_button_list[button_num];

    return button;
}

// Makes a request to the server to get the code.
function loadjsondata(url)
{
    // first load the Ajax; load the pics file @@jquery this?
    var digit_request = new XMLHttpRequest();
    digit_request.open("GET", 'answer', true);
    digit_request.onload = function (e) {
        var json = eval('(' + digit_request.responseText + ')');
        var digits = json.data;
        generate_digits(digits.toString());
    };
    digit_request.send();
}
