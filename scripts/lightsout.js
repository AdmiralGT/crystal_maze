// SVG Namespace
var svgNS = "http://www.w3.org/2000/svg";

// Variables for the total SVG area
var svg_width = 1200;
var svg_height = 675

// Do not change the order of global_button_list
var global_button_list = new Array();
var global_button_locations = new Array();
var global_digit_list = new Array();
var digit_segment_list = new Array();

// Variables for the group of lights that turn off to reveal the code
var lit = "#ffffcc";
var switchboard_rows = 19;
var switchboard_columns = 40;
var switchboard_radius = 7.5;
var switchboard_diameter = 2 * switchboard_radius;
var switchboard_width = switchboard_diameter * switchboard_columns;
var switchboard_height = switchboard_diameter * switchboard_rows;
var switchboard_x_offset = (svg_width - switchboard_width)/2

// Variables for the buttons that can be pressed
//var button_pressed = "#ffe6e6"; // This possibly makes it too easy
var button_pressed = "white";
var button_radius = 40;
var button_diameter = 2 * button_radius;
var button_grid_width = Math.floor(switchboard_width / (button_diameter));
var segment_size = 5;
var total_segments = 0;
var total_segments_on = 0;
var score = 0;

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

// Turn off the lights for a specific segment
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

// Reset the game state
function reset_game()
{
    // Reset the list of active segments on each digit
    for (var ii = 0; ii < global_digit_list.length; ii++)
    {
        global_digit_list[ii].active_segments = 0;
    }
    total_segments_on = 0;

    // Reset the state of every button
    for (var button_num = 0; button_num < global_button_list.length; button_num++)
    {
		var button = global_button_list[button_num];
        button.clicked = false;
        $("#" + button.button_id).attr('fill', button.colour);
    }
}

// Determine which buttons are going to be reset buttons
function create_reset_buttons()
{
    var reset_array = new Array();

    // Each segment needs a valid button to press
    for (var ii = 0; ii < total_segments; ii++)
    {
        reset_array.push(false);
    }

    // Remaining segments are all reset buttons
    for (var ii = 0; ii < global_button_list.length - total_segments; ii++)
    {
        reset_array.push(true);
    }

    // Shuffle the array to randomise and then assign to buttons
    shuffle(reset_array);
    for (var ii = 0; ii < reset_array.length; ii++)
    {
        global_button_list[ii].setReset(reset_array[ii]);
    }
}

// Complete game setup, generate the digits and create reset buttons
function finish_game_setup(digits)
{
    generate_digits(digits);
    create_reset_buttons();
    score = 10;
}

// Function called when a button is pressed
// If this is a reset button, reset the light board, otherwise turn off the segment of lights.
function button_press()
{
    var button = getButtonFromElementID(this.event.target.id);

    if (button.reset)
    {
        // Reset button
    	turn_all_lights_on();
        reset_game();
    }
    else if (button.clicked == false)
    {
        // We've clicked a button not previously click. Turn off a segment (unless we've turned off all segments)
        if (total_segments_on < total_segments)
        {
            button.clicked = true;
            var segment = determine_next_segment(total_segments_on);
            turn_off_segment(segment);
            total_segments_on++;
            global_digit_list[segment.digit_pos].active_segments++;
            $("#" + button.button_id).attr('fill', button_pressed);
        }
    }

}

// Generate the grid of lightbulbs that will be turned off to reveal the code.
function generate_switch_grid()
{
	var grid_svg = document.getElementById("svg_area");
    var g = document.createElementNS(svgNS, "g");
    grid_svg.appendChild(g);
	for (var row = 0; row < switchboard_rows; row++)
	{
		for (var column = 0; column < switchboard_columns; column++)
		{
			var circle = document.createElementNS(svgNS, "circle");
			var id = "circle_" + column + "_" + row;
			var centre_x = (column * switchboard_diameter) + switchboard_radius + switchboard_x_offset;
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

			g.appendChild(circle);
		}
	}
}

// Function that generates all our necessary buttons
function generate_buttons()
{
    for (var ii = 0; ii < 32; ii++)
    {
        make_button("white", ii + 1, "black");
    }

    shuffle(global_button_list)
    
    // Generate the locations for the buttons
    for (var button_num = 0; button_num < global_button_list.length; button_num++)
    {
      button_location = generate_button_location()
      global_button_locations.push(button_location);
    }
}

// Function to generate a button location.
function generate_button_location()
{
    var valid_location = false;
    var x;
    var y;
    while (valid_location != true)
    {
        x = getRandomInt(button_radius, svg_width - button_radius);
        y = getRandomInt(button_radius, svg_height - button_radius);
        var pos = new Position(x,y);
        valid_location = !determine_button_overlap(pos)
    }
    return pos;
}

// Function to determine if this button can be drawn or is too close to another button.
function determine_button_overlap(pos)
{
    // Check button does not overlap switchboard
    if (pos.y <= (switchboard_height + button_radius))
    {
        if (pos.x >= (switchboard_x_offset - button_radius))
        {
            if (pos.x <= ((svg_width + button_radius) - switchboard_x_offset))
            {
                return true;
            }
        }
    }
    
    // Check the button doesn't overlap any other button
    for (var button_num = 0; button_num < global_button_locations.length; button_num++)
    {
        var button_location = global_button_locations[button_num];
        if (overlap(pos, button_location))
        {
            return true;
        }
    }
    return false;
}

// Function to determine if two buttons overlap
function overlap(pos_1, pos_2)
{
    var x_diff = pos_2.x - pos_1.x;
    var y_diff = pos_2.y - pos_1.y;
    var square_distance = Math.pow(x_diff, 2) + Math.pow(y_diff, 2);
    if (Math.pow(square_distance, 0.5) < (button_diameter + 20))
    {
        return true;
    }
    return false;
}
    

// Function to generate the digits to determine which lights to turn off
function generate_digits(digit_string)
{
    var last_digit_segments = new Array();
	for (var ii = 0; ii < digit_string.length; ii++)
	{
		var digit = create_digit(digit_string.charAt(ii));
		digit.setPosition(ii);
        total_segments += digit.desired_segments;
		global_digit_list.push(digit);

        // Save one segment so each digit is only finished at the end of the game
        for (var jj = 0; jj < digit.desired_segments - 1; jj++)
        {
            digit_segment_list.push(digit);
        }
        last_digit_segments.push(digit);
	}
    
    // Randomize the order of segments and the last set of segments separately
    shuffle(digit_segment_list);
    shuffle(last_digit_segments);

    // Pushing an array to the end of an array does add the elements to the end but
    // instead adds an Array object at the original array index. Thanks Javascript...
    for (var ii = 0; ii < last_digit_segments.length; ii++)
    {
        digit_segment_list.push(last_digit_segments[ii]);
    }
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
    size_game_board("svg_area", svg_width, svg_height)
	generate_switch_grid()
    generate_input_and_button()
	generate_buttons()
	generate_button_grid(global_button_list)
    set_button_locations(global_button_list)
	loadjsondata('answer')
}

// Function to generate the guess box and guess button.
function generate_input_and_button()
{
    var gameboard = document.getElementById('gameboard');
    var div = document.createElement('div');
    div.setAttribute('id', 'guess_div');
    var input = document.createElement('input');
    input.type = 'text'
    input.setAttribute('id', 'guess_textbox');
    div.appendChild(input);
    var button = document.createElement('button');
    button.innerHTML = "Guess";
    button.setAttribute('onclick', 'guess()');
    button.setAttribute('id', 'guess_button');
    div.appendChild(button);
    gameboard.appendChild(div);
}

// Get answer
function get_answer(url)
{
    var digit_request = new XMLHttpRequest();
    digit_request.open("GET", url, true);
    return digit_request;
}

// Makes a request to the server to get the code.
function loadjsondata(url)
{
    // first load the Ajax; load the pics file @@jquery this?
    var digit_request = get_answer(url);
    digit_request.onload = function (e) {
        var json = eval('(' + digit_request.responseText + ')');
        var digits = json.data;
        finish_game_setup(digits.toString());
    };
    digit_request.send();
}

// Someone is attempting to guess the answer.
function guess()
{
    var digit_request = get_answer('answer');
    digit_request.onload = function (e) {
        var json = eval('(' + digit_request.responseText + ')');
        var digits = json.data;
        determine_if_guess_correct(digits);
    };
    digit_request.send();
}

// Function to determine if a guess is correct
function determine_if_guess_correct(digits)
{
    var guess_box = document.getElementById('guess_textbox');
    var guess = guess_box.value;
    if (guess == digits.toString())
    {
        alert('Correct! You score ' + Math.max(0, score) + 'points.');
    }
    else
    {
        alert('Incorrect!');
        score -= 1;
    }
}

// Function to build a button and put it in the global list of buttons.
function make_button(colour, text, text_colour)
{
    //var button = new Button(colour, text, text_colour, button_radius);
    var button = new Button(colour, [text], text_colour, button_radius);
    button.setBold(true);
    global_button_list.push(button);
}
