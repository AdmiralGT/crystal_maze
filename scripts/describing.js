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
var button_radius = 200;
var button_diameter = 2 * button_radius;
var button_separation = 2;
var button_effective_diameter = button_diameter + button_separation;


// Function that receives game configuration
function receive_game_config(config)
{
	var json = JSON.parse(config)
	generate_buttons(json['buttons'])
	display_button()	
}

// Function that generates all our necessary buttons
function generate_buttons(buttons)
{
	for (var ii = 0; ii < buttons.length; ii++)
    {
    	var button = buttons[ii]
    	if (!Array.isArray(button.text))
    	{
    		button.text = [button.text]
    	}
        make_button(button);
    }

    // Generate the locations for the buttons
    for (var button_num = 0; button_num < buttons.length; button_num++)
    {
      button_location = generate_button_location()
      global_button_locations.push(button_location);
    }
}

// Someone is attempting to guess the answer.
function display_button()
{
	// We can only display a certain number of buttons so slice the list at the max size
	shuffle(global_button_list)
	game_button_list = global_button_list.slice(0, 1)
	generate_button_grid(game_button_list)
	set_button_locations(game_button_list)
}

// Function to generate a button location.
function generate_button_location()
{
	var pos = new Position(600,325);
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

    var input = document.createElement('input');
    input.type = 'text'
    input.setAttribute('id', 'guess_textbox');
    div.appendChild(input);

    var enter_button = document.createElement('button');
    enter_button.innerHTML = "Enter";
    enter_button.setAttribute('onclick', 'enter_description()');
    enter_button.setAttribute('id', 'enter_button');
    div.appendChild(enter_button);

    var reload_button = document.createElement('button');
    reload_button.innerHTML = "Reload Buttons";
    reload_button.setAttribute('onclick', 'reset_game()');
    reload_button.setAttribute('id', 'reload_button');
    div.appendChild(reload_button);

    gameboard.appendChild(div);
}

function reset_game()
{
	clear_display()
	global_button_list.length = 0
	global_button_locations.length = 0
	game_button_list.length = 0	
	send_message_to_server('reload_config')
	get_game_config()
}

// All buttons have a press function. Don't do anything if they press the button
function button_press()
{
	display_new_button()
	return
}

// What to do when we press the enter button
function enter_description()
{
	
	display_new_button()
	var description = $("#guess_textbox").val()
	var button = game_button_list[0]
	var url = "describe_button?button_colour=" + button.colour + "&text_colour=" + button.text_colour + "&button_text=" + button.text + "&description=" + description
	send_message_to_server(url)
	return
}

function display_new_button()
{
	clear_display()
	display_button()
}

function clear_display()
{
	var svg_area = document.getElementById("svg_area")
	while (svg_area.firstChild)
	{
		svg_area.firstChild.remove()
	}
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

// Sends a picture of the button to slack
function send_message_to_server(url)
{
	var slack_request = new XMLHttpRequest();
	slack_request.open("GET", url, true);
	slack_request.send()
}

// Function to build a button and put it in the global list of buttons.
function make_button(button_json)
{
    //var button = new Button(colour, text, text_colour, button_radius);
    var button = new Button(button_json.colour, button_json.text, button_json.text_colour, button_radius)
    button.setTextSize(50)
    global_button_list.push(button)
}

