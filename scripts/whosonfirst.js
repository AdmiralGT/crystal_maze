// SVG Namespace
var svgNS = "http://www.w3.org/2000/svg";

// Variables for the total SVG area
var svg_width = 1200;
var svg_height = 675

// A list of all the buttons and all the locations
var global_button_list = new Array();
var global_button_locations = new Array();

// A list of buttons that are the targets this game
var target_button_list = new Array();

// A list of the buttons in this game
var game_button_list = new Array();

// Variables for the buttons that can be pressed
//var button_pressed = "#ffe6e6"; // This possibly makes it too easy
var button_pressed = "white";
var button_radius = 50;
var button_diameter = 2 * button_radius;
var button_separation = 2;
var button_effective_diameter = button_diameter + button_separation;
var score = 0;
var rounds = 0;
var game_in_progress = false;

// Function called when a button is pressed
// If this is a reset button, reset the light board, otherwise turn off the segment of lights.
function button_press()
{
	// Don't do anything if the game is not in progress, it's just some buttons on a screen.
	if (game_in_progress)
	{
	    var clicked_button = getButtonFromElementID(this.event.target.id);

	    if (clicked_button.target)
	    {
	    	score += 1
	    	alert("Correct")
	    }
	    else
	    {
	    	alert("Wrong")
	    }

	    // We don't know which button is the current target so just set them all not to be the target
	    for (var ii = 0; ii < global_button_list.length; ii++)
	    {
	    	var button = global_button_list[ii]
	    	button.setTarget(false)
	    }

	    if (target_button_list.length > 0)
	    {
		    set_next_target(target_button_list.pop())
	    }
	    else
	    {
	    	game_in_progress = false;
	    	alert(score)
	    }
	}
}

// Function to get the next target button and send the image to slack
function set_next_target(button)
{
    button.setTarget(true)
    send_message_to_server("post_slack_message?imageurl=\""+button.imageurl) + "\"";
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
        make_button(button.colour, button.text, button.text_colour, button.url);
    }

    // Generate the locations for the buttons
    for (var button_num = 0; button_num < buttons.length; button_num++)
    {
      button_location = generate_button_location(button_num, horizontal, vertical)
      global_button_locations.push(button_location);
    }
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
	if (!game_in_progress)
	{
		score = 0;
		game_in_progress = true;
	
	    // We can only display a certain number of buttons so slice the list at the max size
	    shuffle(global_button_list)
	    game_button_list = global_button_list.slice(0, horizontal * vertical)
		generate_button_grid(game_button_list)
	    set_button_locations(game_button_list)
	    target_button_list = game_button_list.slice(0, rounds)
	    set_next_target(target_button_list.pop())
	}
}

function reset_game()
{
	var svg_area = document.getElementById("svg_area")
	while (svg_area.firstChild)
	{
		svg_area.firstChild.remove()
	}
	game_in_progress = false
	send_message_to_server("reload_config")
}

// Sends a picture of the button to slack
function send_message_to_server(url)
{
	var slack_request = new XMLHttpRequest();
	slack_request.open("GET", url, true);
	slack_request.send()
}

// Function to build a button and put it in the global list of buttons.
function make_button(colour, text, text_colour, url)
{
    //var button = new Button(colour, text, text_colour, button_radius);
    var button = new Button(colour, text, text_colour, button_radius)
    button.setImageURL(url)
    global_button_list.push(button)
}

