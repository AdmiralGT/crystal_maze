var svgNS = "http://www.w3.org/2000/svg";
var global_button_locations = new Array();
var global_button_list = new Array();
var global_digit_list = new Array();
var digit_segment_list = new Array();
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
var total_segments_on = 0;

// Function to turn all lights on the switchboard on
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

// Function to determine the next segment to turn off
function determine_next_segment(segments_on)
{
    var digit = digit_segment_list[segments_on];
    for (var ii = 0; ii < digit.segments.length; ii++)
    {
        if (digit.segments[ii].name == digit.order.charAt(digit.active_segments))
        {
            return digit.segments[ii];
        }
    }
    return null;
}

// Turn off a specific segment
function turn_off_segment(segment)
{
    var digit_transform = transform_to_digit(segment.digit_pos);
    var transforms = transform_to_segment(segment.name, digit_transform);
    
    for (transform_num = 0; transform_num < transforms.length; transform_num++)
    {
        var transform = transforms[transform_num];
        var name = "#circle_" + transform.x + "_" + transform.y;
        $(name).attr('fill', 'black');
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

// Finds the position of the top left of a digit
function transform_to_digit(digit)
{
    var digit_width = segment_size + 2 + 2;
    var total_width = (digit_width * 3) + (segment_size + 2);
    var total_height = (2 * segment_size) + 3;
    var horizontal_offset = Math.floor((switchboard_columns - total_width)/2);
    var vertical_offset = Math.floor((switchboard_rows - total_height)/2);
	return new Position((digit_width*digit) + horizontal_offset, vertical_offset);
}

// Find the positions of a segment
function transform_to_segment(segment, digit_transform)
{
	var transforms = new Array();
    var segment_offset = segment_size + 1;
	if (segment == 'a')
	{
		for (var ii = 0; ii < segment_size; ii++)
		{
			transforms.push(new Position(digit_transform.x + ii + 1,
			                             digit_transform.y));
		}
	}
	else if (segment == 'b')
	{
		for (var ii = 0; ii < segment_size; ii++)
		{
			transforms.push(new Position(digit_transform.x + segment_offset,
			                             digit_transform.y + ii + 1));
		}
	}
	else if (segment == 'c')
	{
		for (var ii = 0; ii < segment_size; ii++)
		{
			transforms.push(new Position(digit_transform.x + segment_offset,
			                             digit_transform.y + ii + segment_offset + 1));
		}
	}
	else if (segment == 'd')
	{
		for (var ii = 0; ii < segment_size; ii++)
		{
			transforms.push(new Position(digit_transform.x + ii + 1,
			                             digit_transform.y + (2 * segment_offset)));
		}
	}
	else if (segment == 'e')
	{
		for (var ii = 0; ii < segment_size; ii++)
		{
			transforms.push(new Position(digit_transform.x,
			                             digit_transform.y + ii + segment_offset + 1));
		}
	}
	else if (segment == 'f')
	{
		for (var ii = 0; ii < segment_size; ii++)
		{
			transforms.push(new Position(digit_transform.x,
			                             digit_transform.y + ii + 1));
		}
	}
	else if (segment == 'g')
	{
		for (var ii = 0; ii < segment_size; ii++)
		{
			transforms.push(new Position(digit_transform.x + ii + 1,
			                             digit_transform.y + segment_offset));
		}
	}
	return transforms;
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
        var segment = determine_next_segment(total_segments_on);
    	turn_off_segment(segment);
        total_segments_on++;
        global_digit_list[segment.digit_pos].active_segments++;
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
		var button_location = new Position((button_diameter * (button_num % button_grid_width)) + button_radius, 
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
        
        for (var jj = 0; jj < digit.desired_segments; jj++)
        {
            digit_segment_list.push(digit);
        }
	}
    shuffle(digit_segment_list);
}

// Function to create a Digit object for a string
// Note: This is a terrible function, but I can't yet think of a better way
//       and it does what I want.
function create_digit(digit)
{
	if (digit == '0')
	{
		return new Digit(true, true, true, true, true, true, false, 'cbaefd');
	}
	else if (digit == '1')
	{
		return new Digit(false, true, true, false, false, false, false, 'bc');
	}
	else if (digit == '2')
	{
		return new Digit(true, true, false, true, true, false, true, 'dgabe');
	}
	else if (digit == '3')
	{
		return new Digit(true, true, true, true, false, false, true, 'abgdc');
	}
	else if (digit == '4')
	{
		return new Digit(false, true, true, false, false, true, true, 'cbgf');
	}
	else if (digit == '5')
	{
		return new Digit(true, false, true, true, false, true, true, 'adgcf');
	}
	else if (digit == '6')
	{
		return new Digit(true, false, true, true, true, true, true, 'gdacfe');
	}
	else if (digit == '7')
	{
		return new Digit(true, true, true, false, false, false, false, 'cba');
	}
	else if (digit == '8')
	{
		return new Digit(true, true, true, true, true, true, true, 'gadcfeb');
	}
	else if (digit == '9')
	{
		return new Digit(true, true, true, true, false, true, true, 'gcfdab');
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

// Shuffle the order of buttons around on the display.
function shuffleButtons()
{
    // Shuffle the button locations
    shuffle(global_button_locations);

    // Update the button location of each button
	for (var button_num = 0; button_num < global_button_list.length; button_num++)
	{
		var button = global_button_list[button_num];
		button.setLocation(global_button_locations[button_num]);
		redraw_button(button);
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

