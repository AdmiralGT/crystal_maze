// SVG Namespace
var svgNS = "http://www.w3.org/2000/svg";

// Variables for the total SVG area
var svg_width = 1200;
var svg_height = 675

// Do not change the order of global_button_list
var global_button_list = new Array();
var global_button_locations = new Array();

// Variables for the buttons that can be pressed
//var button_pressed = "#ffe6e6"; // This possibly makes it too easy
var button_pressed = "white";
var button_radius = 50;
var button_diameter = 2 * button_radius;
var button_separation = 2;
var button_effective_diameter = button_diameter + button_separation;
var score = 0;
var rounds = 0;

// Reset the game state
function reset_game()
{
    // Reset the state of every button
    for (var button_num = 0; button_num < global_button_list.length; button_num++)
    {
		var button = global_button_list[button_num];
        button.clicked = false;
        $("#" + button.button_id).attr('fill', button.colour);
    }
}

// Complete game setup, generate the digits and create reset buttons
function finish_game_setup(digits)
{
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
        reset_game();
    }
    else if (button.clicked == false)
    {
        // We've clicked a button not previously click. Turn off a segment (unless we've turned off all segments)
        button.clicked = true;
    }

}

// Generate the grid of buttons that can be pressed to turn off lights or reset
// the light board.
function generate_button_grid()
{
	// All buttons have the same border for now...
	var stroke = "black";
	var stroke_width = 2;

	// Generate the general SVG area to put buttons in.
  	var height = 300;
	var switch_svg = document.getElementById("svg_area");

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
		button_element.setAttributeNS(null, 'onmousedown', 'button_press()');

		// Put the Button element in the group.
		g.appendChild(button_element);

		var text = document.createElementNS(svgNS, "text");
		var text_id = "text_for_" + button_id;
		button.setTextID(text_id);
		text.setAttributeNS(null, 'id', text_id);
		text.setAttributeNS(null, 'style', 'fill: ' + button.text_colour + ';font-weight: bold; font-size: 2em; dominant-baseline: middle');
		text.setAttributeNS(null, 'text-anchor', 'middle');
		text.setAttributeNS(null, 'onmousedown', 'button_press()');
		var text_node = document.createTextNode(button.text);
		text.appendChild(text_node);
		g.appendChild(text);

	}
	randomise_buttons();
}

// Function that receives game configuration
function receive_game_config(config)
{
	var json = JSON.parse(config)
	generate_buttons(json['buttons'])
	rounds = json['rounds']
}

// Function that generates all our necessary buttons
function generate_buttons(buttons)
{
	horizontal = Math.floor(svg_width / button_effective_diameter)
	vertical = Math.floor(svg_height / button_effective_diameter)

	for (var ii = 0; ii < buttons.length; ii++)
    {
    	var button = buttons[ii]
        make_button(button.colour, button.text, button.text_colour);
    }
    
    // Generate the locations for the buttons
    for (var button_num = 0; button_num < global_button_list.length; button_num++)
    {
      button_location = generate_button_location(button_num, horizontal, vertical)
      global_button_locations.push(button_location);
    }
	generate_button_grid();
}

// Function to generate a button location.
function generate_button_location(id, width, height)
{
	y_pos = Math.floor(id / width)
	x_pos = id % width

	x = button_radius + (x_pos * button_effective_diameter)
	y = button_radius + (y_pos * button_effective_diameter)
	var pos = new Position(x,y);
    return pos;
}

// Used on page load to generate the light grid and buttons that will be in game
function generate_game()
{
    size_objects();
    get_game_config();
    generate_objects();
}

// Function to generate the guess box and guess button.
function generate_objects()
{
    var gameboard = document.getElementById('gameboard');
    var div = document.createElement('div');
    div.setAttribute('id', 'guess_div');


    var start_button = document.createElement('button');
    start_button.innerHTML = "Start";
    start_button.setAttribute('onclick', 'start_game()');
    start_button.setAttribute('id', 'start_button');
    div.appendChild(start_button);

    var reset_button = document.createElement('button');
    reset_button.innerHTML = "Reset";
    reset_button.setAttribute('onclick', 'reset_game()');
    reset_button.setAttribute('id', 'reset_button');
    div.appendChild(reset_button);

    gameboard.appendChild(div);
}

// Used to size the area in which we can draw buttons/lights
function size_objects()
{
	var svg_area = document.getElementById("svg_area");
    svg_area.setAttribute("width", svg_width);
    svg_area.setAttribute("height", svg_height);
}    

// Shuffle the order of buttons around on the display.
function randomise_buttons()
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

// Get game configuration
function get_game_config()
{
	var button_request = new XMLHttpRequest();
	button_request.open('GET', 'whosonfirst_buttons', true);
	button_request.onload = function (e) {
		receive_game_config(button_request.responseText)
	}
	button_request.send()
}

// 

// Someone is attempting to guess the answer.
function start_game()
{
	send_message_to_server("post_slack_message")
}

function reset_game()
{
	send_message_to_server("reload_config")
}

// Sends a picture of the button to slack
function send_message_to_server(url)
{
	var slack_request = new XMLHttpRequest();
	slack_request.open("GET", url, true);
	slack_request.send()
}