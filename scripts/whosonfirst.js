// SVG Namespace
var svgNS = "http://www.w3.org/2000/svg";

// Variables for the total SVG area
var svg_width = 1200;
var svg_height = 675

// Do not change the order of global_button_list
var global_button_list = new Array();
var target_button_list = new Array();
var global_button_locations = new Array();
var global_button_targets = new Array();

// Variables for the buttons that can be pressed
//var button_pressed = "#ffe6e6"; // This possibly makes it too easy
var button_pressed = "white";
var button_radius = 50;
var button_diameter = 2 * button_radius;
var button_separation = 2;
var button_effective_diameter = button_diameter + button_separation;
var score = 0;

// Function called when a button is pressed
// If this is a reset button, reset the light board, otherwise turn off the segment of lights.
function button_press()
{
    var button = getButtonFromElementID(this.event.target.id);

    if (button.target)
    {
    	score += 1
    }

    // Send next target
	send_message_to_server("post_slack_message")

}

// Function that receives game configuration
function receive_game_config(config)
{
	var json = JSON.parse(config)
	generate_buttons(json['buttons'], json['rounds'])
}

// Function that generates all our necessary buttons
function generate_buttons(buttons, rounds)
{
	horizontal = Math.floor(svg_width / button_effective_diameter)
	vertical = Math.floor(svg_height / button_effective_diameter)

	for (var ii = 0; ii < buttons.length; ii++)
    {
    	var button = buttons[ii]
        make_button(button.colour, button.text, button.text_colour);
    }

    // We can only display a certain number of buttons so slice the list at the max size
    shuffle(global_button_list)
    global_button_list = global_button_list.slice(0, horizontal * vertical)
    target_button_list = global_button_list.slice(0, rounds)
    
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
    size_game_board("svg_area", svg_width, svg_height);
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